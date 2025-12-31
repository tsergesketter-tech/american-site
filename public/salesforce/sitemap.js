/**
 * Salesforce Interactions SDK Sitemap Configuration
 *
 * This file defines the interaction tracking rules for the website.
 * It tells the SDK which pages to track and what events to capture.
 *
 * Documentation: https://developer.salesforce.com/docs/marketing/personalization/guide/sitemapping-getting-started.html
 */

// Wait for SDK to load
(function() {
  if (typeof SalesforceInteractions === 'undefined') {
    console.warn('Salesforce Interactions SDK not loaded');
    return;
  }

  // Initialize the sitemap
  SalesforceInteractions.init({
    cookieDomain: window.location.hostname,
    consents: [{
      purpose: SalesforceInteractions.mcis.ConsentPurpose.Personalization,
      status: SalesforceInteractions.ConsentStatus.OptIn
    }]
  });

  // Configure page types and tracking
  const config = {
    global: {
      // Global listeners that apply to all pages
      listeners: [
        // Track all clicks on primary CTAs
        SalesforceInteractions.listener('click', '.cta-button', (event) => {
          const buttonText = event.target.textContent;
          SalesforceInteractions.sendEvent({
            interaction: {
              name: 'CTA Clicked',
              catalogObject: {
                type: 'Button',
                id: buttonText,
                attributes: {
                  text: buttonText,
                  page: window.location.pathname
                }
              }
            }
          });
        })
      ],
      contentZones: [
        // Define content zones for personalization
        {
          name: 'hero_banner',
          selector: '.hero-section'
        },
        {
          name: 'offers_section',
          selector: '.offers-section'
        }
      ]
    },

    pageTypeDefault: {
      name: 'default',
      action: 'View Page',
      interaction: {
        catalogObject: {
          type: 'Page',
          attributes: {
            url: () => window.location.href,
            title: () => document.title
          }
        }
      }
    },

    pageTypes: [
      {
        name: 'home',
        isMatch: () => window.location.pathname === '/',
        interaction: {
          name: 'View Home Page',
          catalogObject: {
            type: 'HomePage',
            id: 'home',
            attributes: {
              pageType: 'home'
            }
          }
        }
      },

      {
        name: 'flight_search_results',
        isMatch: () => window.location.pathname === '/flights',
        interaction: {
          name: 'View Flight Results',
          catalogObject: {
            type: 'FlightResults',
            id: () => {
              const params = new URLSearchParams(window.location.search);
              return `flights-${params.get('from')}-${params.get('to')}` || 'flight-results';
            }
          }
        }
      },

      {
        name: 'seat_selection',
        isMatch: () => window.location.pathname === '/flights/seats',
        interaction: {
          name: 'View Seat Selection',
          catalogObject: {
            type: 'SeatSelection',
            id: 'seat-selection'
          }
        }
      },

      {
        name: 'checkout',
        isMatch: () => window.location.pathname === '/checkout',
        interaction: {
          name: 'View Checkout',
          catalogObject: {
            type: 'Checkout',
            id: 'checkout'
          }
        }
      },

      {
        name: 'confirmation',
        isMatch: () => window.location.pathname === '/confirmation',
        interaction: {
          name: 'View Confirmation',
          catalogObject: {
            type: 'Confirmation',
            id: 'confirmation'
          }
        }
      }
    ]
  };

  // Apply the sitemap configuration
  SalesforceInteractions.initSitemap(config);

  console.log('Salesforce Interactions sitemap configured');
})();
