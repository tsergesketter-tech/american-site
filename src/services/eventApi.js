/**
 * Event API Client
 * Sends events to the backend for Kafka publishing
 */

const API_BASE = process.env.NODE_ENV === 'production'
  ? ''
  : 'http://localhost:3000';

/**
 * Generate a session ID if not exists
 */
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('aa_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('aa_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Send event to backend API
 */
const sendEvent = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE}/api/events/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        sessionId: data.sessionId || getSessionId(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[EventAPI] Failed to send ${endpoint} event:`, error);
    // Don't throw - we don't want to break the user experience
    return { success: false, error: error.message };
  }
};

/**
 * Track flight search event
 */
export const trackFlightSearch = async (searchParams) => {
  return sendEvent('search', {
    origin: searchParams.from,
    destination: searchParams.to,
    departureDate: searchParams.departDate,
    returnDate: searchParams.returnDate,
    passengers: searchParams.passengers,
    tripType: searchParams.tripType,
    cabinClass: searchParams.cabin,
  });
};

/**
 * Track flight booking completion
 */
export const trackBooking = async (bookingData) => {
  return sendEvent('booking', {
    bookingReference: bookingData.bookingReference,
    passengerName: `${bookingData.firstName} ${bookingData.lastName}`,
    passengerEmail: bookingData.email,
    flightNumber: bookingData.flightNumber,
    origin: bookingData.origin,
    destination: bookingData.destination,
    departureDate: bookingData.departureDate,
    cabinClass: bookingData.cabinClass,
    totalAmount: bookingData.totalAmount,
    seatNumbers: bookingData.seatNumbers,
    status: 'Confirmed',
  });
};

/**
 * Track abandoned cart
 */
export const trackAbandonedCart = async (cartData) => {
  return sendEvent('abandoned-cart', {
    userEmail: cartData.email,
    flightDetails: cartData.flightDetails,
    cartTotal: cartData.cartTotal,
    timeOnPage: cartData.timeOnPage,
    pageUrl: window.location.href,
  });
};

/**
 * Track generic user event
 */
export const trackUserEvent = async (eventType, eventData) => {
  return sendEvent('user', {
    eventType,
    data: eventData,
  });
};

/**
 * Get current session ID
 */
export const getCurrentSessionId = getSessionId;

export default {
  trackFlightSearch,
  trackBooking,
  trackAbandonedCart,
  trackUserEvent,
  getCurrentSessionId,
};
