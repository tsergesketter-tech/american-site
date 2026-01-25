// Wait for SDK to load
if (typeof SalesforceInteractions === 'undefined') {
  console.warn('❌ Salesforce Interactions SDK not loaded in sitemap');
} else {

// Enable detailed logging for debugging (set to 0 for production)
SalesforceInteractions.setLoggingLevel(5);

// ============================================================================
// CONSENT CONFIGURATION - FORCE CONSENT IN SITEMAP
// ============================================================================

// Check available consent methods
console.log('🔍 Available Salesforce consent methods:', {
  setConsent: typeof SalesforceInteractions.setConsent,
  ConsentPurpose: typeof SalesforceInteractions.ConsentPurpose,
  ConsentStatus: typeof SalesforceInteractions.ConsentStatus,
  mcis: typeof SalesforceInteractions.mcis,
  reinit: typeof SalesforceInteractions.reinit
});

// Skip problematic reinit approach - it causes shutdown/reinit errors
// We'll rely on per-event consent which is more reliable
console.log('🎯 Skipping reinit to avoid shutdown errors - using per-event consent only');

// ============================================================================
// ERROR HANDLING & LOGGING
// ============================================================================
const logSalesforceError = (context, error, additionalData = {}) => {
  const errorLog = {
    context: context,
    error: error.toString(),
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    ...additionalData
  };
  
  console.error(`🚨 Salesforce Error [${context}]:`, errorLog);
  
  // Store in localStorage for debugging
  try {
    const errorLogs = JSON.parse(localStorage.getItem('sf_error_logs') || '[]');
    errorLogs.push(errorLog);
    localStorage.setItem('sf_error_logs', JSON.stringify(errorLogs.slice(-100))); // Keep last 100
  } catch (storageError) {
    console.warn('Failed to store error log:', storageError);
  }
  
  // Send error to analytics if available
  if (typeof gtag !== 'undefined') {
    gtag('event', 'salesforce_error', {
      event_category: 'Salesforce',
      event_label: context,
      custom_map: { error: error.toString() }
    });
  }
};

/**
 * Safe wrapper for Salesforce sendEvent calls
 */
const safeSendEvent = (eventData, context = 'unknown') => {
  try {
    // Defensive null checks
    if (!eventData) {
      console.warn(`⚠️ [${context}] No event data provided`);
      return Promise.resolve();
    }
    
    if (!eventData.interaction) {
      console.warn(`⚠️ [${context}] No interaction provided`);
      return Promise.resolve();
    }
    
    if (!SalesforceInteractions) {
      console.warn(`⚠️ [${context}] SalesforceInteractions not available`);
      return Promise.resolve();
    }
    
    if (typeof SalesforceInteractions.sendEvent !== 'function') {
      console.warn(`⚠️ [${context}] SalesforceInteractions.sendEvent not available`);
      return Promise.resolve();
    }
    
    // PROPER CONSENT STRUCTURE based on Salesforce documentation
    // Consent should be attached to the Event Structure
    eventData.consents = [
      {
        purpose: SalesforceInteractions.ConsentPurpose?.Tracking || 'Tracking',
        status: SalesforceInteractions.ConsentStatus?.OptIn || 'OptIn',
        provider: 'Website'
      },
      {
        purpose: SalesforceInteractions.ConsentPurpose?.Personalization || 'Personalization',
        status: SalesforceInteractions.ConsentStatus?.OptIn || 'OptIn', 
        provider: 'Website'
      }
    ];
    
    // REQUIRED: Ensure eventType is set in both interaction AND user.attributes
    if (eventData.interaction) {
      const interactionName = eventData.interaction.name;
      let eventType;
      
      if (interactionName?.includes('Search')) {
        eventType = 'search';
      } else if (interactionName?.includes('Purchase') || interactionName?.includes('Order')) {
        eventType = 'purchase';
      } else if (interactionName?.includes('View') || interactionName?.includes('Page')) {
        eventType = 'page_view';
      } else if (interactionName?.includes('Click') || interactionName?.includes('Select')) {
        eventType = 'user_engagement';
      } else {
        eventType = 'user_engagement';
      }
      
      // Set in both places per error message requirements
      eventData.interaction.eventType = eventType;
      eventData.user = eventData.user || {};
      eventData.user.attributes = eventData.user.attributes || {};
      eventData.user.attributes.eventType = eventType;
    }
    
    console.log(`🎯 Sending event [${context}] with forced consent:`, {
      interaction: eventData.interaction.name,
      consents: eventData.consents,
      hasUser: !!eventData.user
    });
    
    const result = SalesforceInteractions.sendEvent(eventData);
    
    // Log successful sends in debug mode
    if (SalesforceInteractions.getLoggingLevel && SalesforceInteractions.getLoggingLevel() > 3) {
      console.log(`✅ Salesforce event sent [${context}]:`, eventData);
    }
    
    return result;
  } catch (error) {
    // Comprehensive error logging without throwing
    console.warn(`⚠️ [${context}] Salesforce event send failed:`, {
      error: error.message || error.toString(),
      eventName: eventData?.interaction?.name || 'unknown',
      timestamp: new Date().toISOString()
    });
    
    // Try to log the error safely
    try {
      logSalesforceError(`sendEvent_${context}`, error, { eventData });
    } catch (loggingError) {
      console.warn('Failed to log Salesforce error:', loggingError);
    }
    
    // Return resolved promise to prevent uncaught errors
    return Promise.resolve();
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract flight search parameters from URL query string or React context
 */
const getFlightSearchParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        origin: params.get('origin') || params.get('from'),
        destination: params.get('destination') || params.get('to'),
        departDate: params.get('departDate') || params.get('departure'),
        returnDate: params.get('returnDate') || params.get('return'),
        passengers: parseInt(params.get('passengers') || params.get('pax')) || 1,
        tripType: params.get('tripType') || (params.get('returnDate') ? 'roundtrip' : 'oneway'),
        cabinClass: params.get('cabin') || params.get('class') || 'economy'
    };
};

/**
 * Calculate days until departure for advance booking tracking
 */
const getDaysUntilDeparture = (departDate) => {
    if (!departDate) return null;
    const today = new Date();
    const departure = new Date(departDate);
    const diffTime = departure - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};

/**
 * Format currency for tracking
 */
const formatPrice = (priceString) => {
    if (!priceString) return null;
    const cleaned = priceString.toString().replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || null;
};

/**
 * Get user's device type
 */
const getDeviceType = () => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
};

/**
 * Get cookie value
 */
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

// ============================================================================
// REACT STATE TRACKING HELPERS
// ============================================================================

/**
 * Track React component interactions by monitoring DOM changes
 */
const trackReactStateChange = (eventName, dataExtractor) => {
    const observer = new MutationObserver(() => {
        try {
            const data = dataExtractor();
            if (data) {
                safeSendEvent({
                    interaction: {
                        name: eventName,
                        eventType: "userEngagement"
                    },
                    ...data
                }, 'react_state_change');
            }
        } catch (error) {
            console.warn('Error tracking React state:', error);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });
};

// ============================================================================
// MAIN SITEMAP CONFIGURATION
// ============================================================================

const config = {
    
    // ====================================================================
    // GLOBAL CONFIGURATION
    // ====================================================================
    
    global: {
        // Global content zones available on all pages - CORRECTED SELECTORS
        contentZones: [
            { name: "Global - Header", selector: "header" },
            { name: "Global - Footer", selector: "footer" },
            { name: "Global - Popup" },
            { name: "Global - Slide In" },
            { name: "Global - Exit Intent" }
        ],
        
        // Global event handler for all page events
        onActionEvent: (event) => {
            // PROPER CONSENT STRUCTURE - Attached to Event Structure as per documentation
            event.consents = [
                {
                    purpose: SalesforceInteractions.ConsentPurpose?.Tracking || 'Tracking',
                    status: SalesforceInteractions.ConsentStatus?.OptIn || 'OptIn',
                    provider: 'Website'
                },
                {
                    purpose: SalesforceInteractions.ConsentPurpose?.Personalization || 'Personalization',
                    status: SalesforceInteractions.ConsentStatus?.OptIn || 'OptIn',
                    provider: 'Website'
                }
            ];
            
            // REQUIRED: Add eventType to user.attributes (per error message)
            // BUT: Don't override if eventType is already set (for custom events)
            if (event.interaction && !event.interaction.eventType) {
                const interactionName = event.interaction.name;
                let eventType;

                if (interactionName?.includes('Search')) {
                    eventType = 'search';
                } else if (interactionName?.includes('Purchase') || interactionName?.includes('Order')) {
                    eventType = 'purchase';
                } else if (interactionName?.includes('View') || interactionName?.includes('Page')) {
                    eventType = 'page_view';
                } else if (interactionName?.includes('Click') || interactionName?.includes('Select')) {
                    eventType = 'user_engagement';
                } else {
                    eventType = 'user_engagement';
                }

                // Set in both places to be safe
                event.interaction.eventType = eventType;
                event.user.attributes.eventType = eventType;
            }
            
            // Enrich all events with device and session context
            event.user = event.user || {};
            event.user.attributes = event.user.attributes || {};
            
            // Add device type
            event.user.attributes.deviceType = getDeviceType();
            
            // Add referrer tracking
            if (document.referrer) {
                event.user.attributes.referrerDomain = new URL(document.referrer).hostname;
            }
            
            // Extract AAdvantage number from cookies or session
            const aadvantageNumber = getCookie('aadvantage_number');
            if (aadvantageNumber) {
                event.user.id = aadvantageNumber;
                event.user.attributes.aadvantageNumber = aadvantageNumber;
            }
            
            // Extract email from query string (for email campaigns)
            const urlParams = new URLSearchParams(window.location.search);
            const emailParam = urlParams.get('email') || urlParams.get('subscriberKey');
            if (emailParam) {
                event.user.attributes.emailAddress = emailParam;
            }
            
            // Track UTM parameters
            const utmSource = urlParams.get('utm_source');
            const utmMedium = urlParams.get('utm_medium');
            const utmCampaign = urlParams.get('utm_campaign');
            
            if (utmSource) event.user.attributes.utmSource = utmSource;
            if (utmMedium) event.user.attributes.utmMedium = utmMedium;
            if (utmCampaign) event.user.attributes.utmCampaign = utmCampaign;
            
            console.log('🎯 Event processed with forced consent and eventType:', event);
            return event;
        },
        
        // Global click listeners - CORRECTED FOR REACT
        listeners: [
            // Track main navigation clicks
            SalesforceInteractions.listener("click", "nav a, header a", (event) => {
                const linkText = SalesforceInteractions.cashDom(event.currentTarget).text().trim();
                const linkHref = SalesforceInteractions.cashDom(event.currentTarget).attr("href");
                
                safeSendEvent({
                    interaction: {
                        name: "Navigation Click",
                        eventType: "userEngagement"
                    },
                    user: {
                        attributes: {
                            lastNavClick: linkText,
                            lastNavDestination: linkHref
                        }
                    }
                }, 'navigation');
            })
        ]
    },
    
    // ====================================================================
    // PAGE TYPE CONFIGURATIONS
    // ====================================================================
    
    pageTypes: [
        
        // ----------------------------------------------------------------
        // HOME PAGE - CORRECTED
        // ----------------------------------------------------------------
        {
            name: "Home Page",
            isMatch: () => {
                return window.location.pathname === '/';
            },
            interaction: {
                name: "View Home Page",
                eventType: "pageView"
            },
            // CORRECTED: Match actual component structure
            contentZones: [
                { name: "Home - Hero Section", selector: ".relative.h-\\[500px\\]" },
                { name: "Home - Booking Widget", selector: ".bg-white.shadow-lg.-mt-20" },
                { name: "Home - Offers Section", selector: ".bg-gray-50.py-16" }
            ],
            onActionEvent: (event) => {
                // Track if user has searched before
                const hasSearched = sessionStorage.getItem('aa_has_searched');
                event.user = event.user || {};
                event.user.attributes = event.user.attributes || {};
                event.user.attributes.returningSearcher = hasSearched === 'true';
                
                return event;
            },
            listeners: [
                // CORRECTED: Track React hero slide changes via button clicks
                SalesforceInteractions.listener("click", "button[aria-label*='slide'], button[aria-label='Previous slide'], button[aria-label='Next slide']", (event) => {
                    safeSendEvent({
                        interaction: {
                            name: "Hero Navigation Click",
                            eventType: "userEngagement"
                        }
                    }, 'hero_navigation');
                }),
                
                // CORRECTED: Track pause/play button
                SalesforceInteractions.listener("click", "button[aria-label*='carousel']", (event) => {
                    const isPauseAction = SalesforceInteractions.cashDom(event.currentTarget).attr('aria-label').includes('Pause');
                    
                    safeSendEvent({
                        interaction: {
                            name: isPauseAction ? "Hero Carousel Paused" : "Hero Carousel Resumed",
                            eventType: "userEngagement"
                        }
                    }, 'hero_carousel');
                }),
                
                // DISABLED: Flight search tracking moved to React component (salesforceTracking.js)
                // This prevents duplicate events - the React component handles flight search events
                
                // CORRECTED: Track offer clicks using actual class structure
                SalesforceInteractions.listener("click", ".bg-white.rounded-lg a, .text-aa-light-blue", (event) => {
                    const offerCard = SalesforceInteractions.cashDom(event.currentTarget).closest('.bg-white.rounded-lg');
                    
                    if (offerCard.length > 0) {
                        const offerTitle = offerCard.find('h3').text().trim();
                        const offerLink = SalesforceInteractions.cashDom(event.currentTarget).attr('href');
                        
                        safeSendEvent({
                            interaction: {
                                name: "Offer Click",
                                eventType: "userEngagement",
                                catalogObject: {
                                    type: "Offer",
                                    id: offerTitle.replace(/\s+/g, '-'),
                                    attributes: {
                                        title: offerTitle,
                                        linkUrl: offerLink
                                    }
                                }
                            }
                        }, 'offer_click');
                    }
                }),
                
                // Track booking widget tab changes
                SalesforceInteractions.listener("click", ".py-4.px-6.text-center", (event) => {
                    const tabText = SalesforceInteractions.cashDom(event.currentTarget).text().trim();
                    
                    safeSendEvent({
                        interaction: {
                            name: "Booking Tab Changed",
                            eventType: "userEngagement"
                        },
                        user: {
                            attributes: {
                                selectedBookingTab: tabText
                            }
                        }
                    }, 'booking_tab');
                })
            ]
        },
        
        // ----------------------------------------------------------------
        // FLIGHT SEARCH RESULTS PAGE - CORRECTED
        // ----------------------------------------------------------------
        {
            name: "Flight Search Results",
            isMatch: () => {
                return window.location.pathname === '/flights';
            },
            interaction: {
                name: "View Flight Results",
                eventType: "search"
            },
            // CORRECTED: Use actual page structure
            contentZones: [
                { name: "Flights - Page Container", selector: ".min-h-screen.bg-gray-50" },
                { name: "Flights - Results Area", selector: ".space-y-4" }
            ],
            onActionEvent: (event) => {
                const searchParams = getFlightSearchParams();
                
                event.interaction = event.interaction || {};
                event.interaction.catalogObject = {
                    type: "FlightRoute",
                    id: `${searchParams.origin}-${searchParams.destination}`,
                    attributes: searchParams
                };
                
                return event;
            },
            listeners: [
                // CORRECTED: Track flight card clicks using actual structure
                SalesforceInteractions.listener("click", ".bg-white.rounded-lg.border", (event) => {
                    const flightCard = SalesforceInteractions.cashDom(event.currentTarget);
                    
                    // Extract flight details from the card
                    const flightNumber = flightCard.find('.text-aa-blue.font-semibold').text().trim();
                    const price = flightCard.find('.text-2xl.font-bold').text().trim();
                    const departTime = flightCard.find('.text-2xl.font-bold').first().text().trim();
                    
                    safeSendEvent({
                        interaction: {
                            name: "Flight Card Click",
                            eventType: "productView",
                            catalogObject: {
                                type: "Flight",
                                id: flightNumber,
                                attributes: {
                                    flightNumber: flightNumber,
                                    price: formatPrice(price),
                                    departureTime: departTime
                                }
                            }
                        }
                    }, 'flight_selection');
                }),
                
                // Track date selector changes
                SalesforceInteractions.listener("click", ".border.rounded.p-3", (event) => {
                    const dateButton = SalesforceInteractions.cashDom(event.currentTarget);
                    const selectedDate = dateButton.find('.text-sm').text().trim();
                    const price = dateButton.find('.text-aa-blue.font-semibold').text().trim();
                    
                    safeSendEvent({
                        interaction: {
                            name: "Flight Date Changed",
                            eventType: "userEngagement"
                        },
                        user: {
                            attributes: {
                                selectedFlightDate: selectedDate,
                                selectedDatePrice: formatPrice(price)
                            }
                        }
                    }, 'date_change');
                })
            ]
        },
        
        // ----------------------------------------------------------------
        // SEAT SELECTION PAGE - CORRECTED
        // ----------------------------------------------------------------
        {
            name: "Seat Selection",
            isMatch: () => {
                return window.location.pathname === '/flights/seats';
            },
            interaction: {
                name: "View Seat Selection",
                eventType: "pageView"
            },
            contentZones: [
                { name: "Seats - Page Container", selector: ".min-h-screen.bg-gray-50" },
                { name: "Seats - Seat Map", selector: ".seat-map" }
            ],
            listeners: [
                // Track continue button clicks
                SalesforceInteractions.listener("click", ".bg-aa-red, .bg-aa-blue", (event) => {
                    const buttonText = SalesforceInteractions.cashDom(event.currentTarget).text().trim();
                    
                    if (buttonText.includes('Continue') || buttonText.includes('Next')) {
                        safeSendEvent({
                            interaction: {
                                name: "Proceed from Seat Selection",
                                eventType: "userEngagement"
                            }
                        }, 'seat_continue');
                    }
                })
            ]
        },
        
        // ----------------------------------------------------------------
        // CHECKOUT PAGE - CORRECTED
        // ----------------------------------------------------------------
        {
            name: "Checkout",
            isMatch: () => {
                return window.location.pathname === '/checkout';
            },
            interaction: {
                name: "Checkout Initiated",
                eventType: "checkoutStart"
            },
            contentZones: [
                { name: "Checkout - Page Container", selector: ".min-h-screen.bg-gray-50" }
            ],
            listeners: [
                // Track form submissions
                SalesforceInteractions.listener("click", "button[type='submit'], .bg-aa-red", (event) => {
                    const buttonText = SalesforceInteractions.cashDom(event.currentTarget).text().trim();
                    
                    if (buttonText.includes('Pay') || buttonText.includes('Complete')) {
                        safeSendEvent({
                            interaction: {
                                name: "Checkout Submitted",
                                eventType: "checkoutComplete"
                            }
                        }, 'checkout_complete');
                    }
                })
            ]
        },
        
        // ----------------------------------------------------------------
        // CONFIRMATION PAGE - CORRECTED
        // ----------------------------------------------------------------
        {
            name: "Booking Confirmation",
            isMatch: () => {
                return window.location.pathname === '/confirmation';
            },
            interaction: {
                name: SalesforceInteractions.OrderInteractionName.Purchase
            },
            contentZones: [
                { name: "Confirmation - Page Container", selector: ".min-h-screen.bg-gray-50" },
                { name: "Confirmation - Details", selector: ".confirmation-details" }
            ],
            onActionEvent: (event) => {
                return SalesforceInteractions.DisplayUtils.pageElementLoaded(".confirmation-number, .booking-reference", "html").then(() => {
                    const pnr = SalesforceInteractions.cashDom(".confirmation-number, .booking-reference").text().trim();
                    const totalPrice = formatPrice(SalesforceInteractions.cashDom(".total-price, .total-amount").text());
                    
                    event.interaction = {
                        name: SalesforceInteractions.OrderInteractionName.Purchase,
                        order: {
                            id: pnr || 'booking-' + Date.now(),
                            totalValue: totalPrice || 694
                        }
                    };
                    
                    event.user = event.user || {};
                    event.user.attributes = event.user.attributes || {};
                    event.user.attributes.lastBookingPNR = pnr;
                    event.user.attributes.lastBookingValue = totalPrice;
                    event.user.attributes.lastBookingDate = new Date().toISOString();
                    event.user.attributes.hasCompletedBooking = true;
                    
                    return event;
                });
            }
        },
        
        // ----------------------------------------------------------------
        // CITI AADVANTAGE CREDIT CARD PAGE - CORRECTED
        // ----------------------------------------------------------------
        {
            name: "Credit Card - Citi AAdvantage",
            isMatch: () => {
                return window.location.pathname === '/credit-cards/aadvantage-citi';
            },
            interaction: {
                name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
                catalogObject: {
                    type: "CreditCard",
                    id: "citi-aadvantage-platinum",
                    attributes: {
                        name: "Citi AAdvantage Platinum Select",
                        issuer: "Citi",
                        cardType: "personal",
                        annualFee: 99,
                        signupBonus: "90,000 bonus miles"
                    }
                }
            },
            contentZones: [
                { name: "CC Citi - Hero Section", selector: ".bg-gradient-to-r" },
                { name: "CC Citi - Benefits Section", selector: ".benefits-section" }
            ],
            listeners: [
                // CORRECTED: Track apply button using actual class structure
                SalesforceInteractions.listener("click", ".bg-white.text-blue-900", (event) => {
                    const buttonText = SalesforceInteractions.cashDom(event.currentTarget).text().trim();
                    
                    if (buttonText.includes('Apply')) {
                        safeSendEvent({
                            interaction: {
                                name: "Credit Card Application Start",
                                eventType: "productAdd",
                                catalogObject: {
                                    type: "CreditCard",
                                    id: "citi-aadvantage-platinum"
                                }
                            },
                            user: {
                                attributes: {
                                    creditCardApplicationStarted: true,
                                    interestedCreditCard: "citi-aadvantage-platinum"
                                }
                            }
                        }, 'cc_application');
                    }
                })
            ]
        },
        
        // ----------------------------------------------------------------
        // BUSINESS CREDIT CARD PAGE - CORRECTED
        // ----------------------------------------------------------------
        {
            name: "Credit Card - Business",
            isMatch: () => {
                return window.location.pathname === '/credit-cards/business';
            },
            interaction: {
                name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
                catalogObject: {
                    type: "CreditCard",
                    id: "aadvantage-business",
                    attributes: {
                        name: "AAdvantage Business Card",
                        issuer: "Citi",
                        cardType: "business",
                        annualFee: 99
                    }
                }
            },
            contentZones: [
                { name: "CC Business - Hero Section", selector: ".bg-gradient-to-r" }
            ],
            listeners: [
                // Track apply button clicks
                SalesforceInteractions.listener("click", ".bg-white", (event) => {
                    const buttonText = SalesforceInteractions.cashDom(event.currentTarget).text().trim();
                    
                    if (buttonText.includes('Apply')) {
                        safeSendEvent({
                            interaction: {
                                name: "Business Credit Card Application Start",
                                eventType: "productAdd",
                                catalogObject: {
                                    type: "CreditCard",
                                    id: "aadvantage-business"
                                }
                            },
                            user: {
                                attributes: {
                                    creditCardApplicationStarted: true,
                                    interestedCreditCard: "aadvantage-business",
                                    isBusinessUser: true
                                }
                            }
                        }, 'business_cc_application');
                    }
                })
            ]
        },
        
        // ----------------------------------------------------------------
        // FALLBACK / DEFAULT PAGE - CORRECTED
        // ----------------------------------------------------------------
        {
            name: "Default Page",
            isMatch: () => true,
            interaction: {
                name: "Page View",
                eventType: "pageView"
            },
            contentZones: [
                { name: "Default - Main Content", selector: ".App" }
            ]
        }
    ]
};

// ========================================================================
// INITIALIZE SITEMAP
// ========================================================================

try {
  SalesforceInteractions.initSitemap(config);
  console.log("✅ American Airlines CORRECTED Sitemap initialized successfully");
  console.log("📝 Sitemap Version: 2.0.0 - CORRECTED - " + new Date().toISOString());
  console.log("🔧 Fixed for React component structure and Tailwind CSS classes");
} catch (sitemapError) {
  console.error("❌ Failed to initialize Salesforce sitemap:", {
    error: sitemapError.message || sitemapError.toString(),
    timestamp: new Date().toISOString()
  });
  
  // Store the error for debugging
  try {
    localStorage.setItem('sf_sitemap_error', JSON.stringify({
      error: sitemapError.toString(),
      timestamp: new Date().toISOString()
    }));
  } catch (storageError) {
    console.warn('Failed to store sitemap error:', storageError);
  }
}

} // End SDK check