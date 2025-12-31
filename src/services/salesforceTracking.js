/**
 * Salesforce Interactions SDK Wrapper
 *
 * This module provides wrapper functions for tracking user interactions
 * with the Salesforce Interactions SDK (formerly Evergage).
 *
 * Documentation: https://developer.salesforce.com/docs/marketing/einstein-personalization/
 */

// Check if SDK is loaded
const isSalesforceSDKLoaded = () => {
  return typeof window !== 'undefined' && window.SalesforceInteractions;
};

/**
 * Initialize the Salesforce Interactions SDK
 * Call this once when the app loads
 */
export const initializeSalesforceSDK = (config = {}) => {
  if (!isSalesforceSDKLoaded()) {
    console.warn('Salesforce Interactions SDK not loaded yet');
    return Promise.reject('SDK not loaded');
  }

  return window.SalesforceInteractions.init({
    cookieDomain: config.cookieDomain || window.location.hostname,
    ...config
  }).then(() => {
    console.log('Salesforce Interactions SDK initialized');
    return true;
  }).catch(error => {
    console.error('Failed to initialize Salesforce SDK:', error);
    return false;
  });
};

/**
 * Track page view
 */
export const trackPageView = (pageName, pageType = 'other') => {
  if (!isSalesforceSDKLoaded()) return;

  window.SalesforceInteractions.sendEvent({
    interaction: {
      name: pageName,
      catalogObject: {
        type: 'Page',
        id: pageName,
        attributes: {
          pageType,
          url: window.location.href,
          timestamp: new Date().toISOString()
        }
      }
    }
  });

  console.log('Page view tracked:', pageName);
};

/**
 * Track flight search
 */
export const trackFlightSearch = (searchParams) => {
  if (!isSalesforceSDKLoaded()) return;

  window.SalesforceInteractions.sendEvent({
    interaction: {
      name: 'Flight Search',
      catalogObject: {
        type: 'FlightSearch',
        id: `${searchParams.from}-${searchParams.to}-${searchParams.departDate}`,
        attributes: {
          origin: searchParams.from,
          destination: searchParams.to,
          departDate: searchParams.departDate,
          returnDate: searchParams.returnDate,
          passengers: searchParams.passengers,
          tripType: searchParams.tripType,
          timestamp: new Date().toISOString()
        }
      }
    }
  });

  console.log('Flight search tracked:', searchParams);
};

/**
 * Track flight view (when viewing flight details)
 */
export const trackFlightView = (flight) => {
  if (!isSalesforceSDKLoaded()) return;

  window.SalesforceInteractions.sendEvent({
    interaction: {
      name: 'View Catalog Object',
      catalogObject: {
        type: 'Flight',
        id: flight.flightNumber,
        attributes: {
          flightNumber: flight.flightNumber,
          origin: flight.origin,
          destination: flight.destination,
          departTime: flight.departTime,
          arriveTime: flight.arriveTime,
          price: flight.mainPrice,
          premiumPrice: flight.premiumPrice,
          aircraft: flight.aircraft
        }
      }
    }
  });

  console.log('Flight view tracked:', flight.flightNumber);
};

/**
 * Track add to cart (flight selection)
 */
export const trackAddToCart = (flight, cabin = 'main') => {
  if (!isSalesforceSDKLoaded()) return;

  const price = cabin === 'main' ? flight.mainPrice : flight.premiumPrice;

  window.SalesforceInteractions.sendEvent({
    interaction: {
      name: 'AddToCart',
      lineItems: [{
        catalogObjectType: 'Flight',
        catalogObjectId: flight.flightNumber,
        price: price,
        quantity: 1,
        attributes: {
          origin: flight.origin,
          destination: flight.destination,
          departTime: flight.departTime,
          arriveTime: flight.arriveTime,
          cabin: cabin,
          duration: flight.duration
        }
      }]
    }
  });

  console.log('Add to cart tracked:', flight.flightNumber, cabin);
};

/**
 * Track cart update (seat selection, etc.)
 */
export const trackReplaceCart = (cartItems) => {
  if (!isSalesforceSDKLoaded()) return;

  window.SalesforceInteractions.sendEvent({
    interaction: {
      name: 'ReplaceCart',
      lineItems: cartItems.map(item => ({
        catalogObjectType: 'Flight',
        catalogObjectId: item.flightNumber,
        price: item.price,
        quantity: 1,
        attributes: item.attributes || {}
      }))
    }
  });

  console.log('Cart replaced:', cartItems.length, 'items');
};

/**
 * Track purchase (booking completion)
 */
export const trackPurchase = (orderData) => {
  if (!isSalesforceSDKLoaded()) return;

  window.SalesforceInteractions.sendEvent({
    interaction: {
      name: 'Purchase',
      order: {
        orderId: orderData.bookingReference,
        totalValue: orderData.total,
        currency: 'USD',
        lineItems: orderData.lineItems.map(item => ({
          catalogObjectType: 'Flight',
          catalogObjectId: item.flightNumber,
          price: item.price,
          quantity: 1,
          attributes: item.attributes || {}
        }))
      }
    }
  });

  console.log('Purchase tracked:', orderData.bookingReference);
};

/**
 * Track abandoned cart
 */
export const trackAbandonedCart = (cartData) => {
  if (!isSalesforceSDKLoaded()) return;

  window.SalesforceInteractions.sendEvent({
    interaction: {
      name: 'Abandoned Cart',
      catalogObject: {
        type: 'AbandonedCart',
        id: `abandoned-${Date.now()}`,
        attributes: {
          email: cartData.email,
          flightNumber: cartData.flightNumber,
          total: cartData.total,
          timeOnPage: cartData.timeOnPage,
          timestamp: new Date().toISOString()
        }
      }
    }
  });

  console.log('Abandoned cart tracked:', cartData.email);
};

/**
 * Identify user (when they provide email or log in)
 */
export const identifyUser = (userData) => {
  if (!isSalesforceSDKLoaded()) return;

  window.SalesforceInteractions.sendEvent({
    interaction: {
      name: 'User Identified'
    },
    user: {
      attributes: {
        emailAddress: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone
      }
    }
  });

  console.log('User identified:', userData.email);
};

/**
 * Track custom event
 */
export const trackCustomEvent = (eventName, eventData = {}) => {
  if (!isSalesforceSDKLoaded()) return;

  window.SalesforceInteractions.sendEvent({
    interaction: {
      name: eventName,
      catalogObject: {
        type: 'CustomEvent',
        id: `${eventName}-${Date.now()}`,
        attributes: {
          ...eventData,
          timestamp: new Date().toISOString()
        }
      }
    }
  });

  console.log('Custom event tracked:', eventName, eventData);
};

// Export all tracking functions
export default {
  initializeSalesforceSDK,
  trackPageView,
  trackFlightSearch,
  trackFlightView,
  trackAddToCart,
  trackReplaceCart,
  trackPurchase,
  trackAbandonedCart,
  identifyUser,
  trackCustomEvent
};
