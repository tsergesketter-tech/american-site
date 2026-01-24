/**
 * Salesforce Pub/Sub API Service
 * Publishes Platform Events to Salesforce using gRPC
 */

const PubSubApiClient = require('salesforce-pubsub-api-client').default;

class SalesforcePubSubService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  /**
   * Initialize and connect to Salesforce Pub/Sub API
   */
  async connect() {
    if (this.isConnected) {
      console.log('[SF PubSub] Already connected');
      return;
    }

    try {
      // Use OAuth Client Credentials flow for server-to-server
      this.client = new PubSubApiClient({
        authType: 'oauth-client-credentials',
        loginUrl: process.env.SALESFORCE_LOGIN_URL,
        clientId: process.env.SALESFORCE_CLIENT_ID,
        clientSecret: process.env.SALESFORCE_CLIENT_SECRET
      });

      await this.client.connect();
      this.isConnected = true;
      console.log('[SF PubSub] Connected to Salesforce Pub/Sub API');
    } catch (error) {
      console.error('[SF PubSub] Connection failed:', error.message);

      // Fallback to username-password if client credentials fails
      if (process.env.SALESFORCE_USERNAME && process.env.SALESFORCE_PASSWORD) {
        console.log('[SF PubSub] Attempting username-password authentication...');
        try {
          this.client = new PubSubApiClient({
            authType: 'username-password',
            loginUrl: process.env.SALESFORCE_LOGIN_URL,
            username: process.env.SALESFORCE_USERNAME,
            password: process.env.SALESFORCE_PASSWORD,
            userToken: process.env.SALESFORCE_TOKEN || ''
          });
          await this.client.connect();
          this.isConnected = true;
          console.log('[SF PubSub] Connected via username-password');
        } catch (fallbackError) {
          console.error('[SF PubSub] Fallback auth failed:', fallbackError.message);
          throw fallbackError;
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * Publish a Flight Booking Platform Event
   * @param {Object} bookingData - The booking information
   */
  async publishBookingEvent(bookingData) {
    if (!this.isConnected) {
      await this.connect();
    }

    const eventTopic = process.env.SF_BOOKING_EVENT_TOPIC || '/event/Flight_Booking__e';

    // Simple payload format - library handles Avro encoding
    const payload = {
      CreatedDate: Date.now(),
      Booking_Reference__c: bookingData.bookingReference || '',
      Passenger_Name__c: bookingData.passengerName || '',
      Passenger_Email__c: bookingData.passengerEmail || '',
      Flight_Number__c: bookingData.flightNumber || '',
      Origin__c: bookingData.origin || '',
      Destination__c: bookingData.destination || '',
      Departure_Date__c: bookingData.departureDate || '',
      Cabin_Class__c: bookingData.cabinClass || '',
      Total_Amount__c: bookingData.totalAmount || 0,
      Seat_Numbers__c: bookingData.seatNumbers || '',
      Booking_Status__c: bookingData.status || 'Confirmed'
    };

    try {
      console.log('[SF PubSub] Publishing booking event:', JSON.stringify(payload));
      const result = await this.client.publish(eventTopic, payload);
      console.log('[SF PubSub] Booking event published:', {
        replayId: result.replayId,
        bookingReference: bookingData.bookingReference
      });
      return result;
    } catch (error) {
      console.error('[SF PubSub] Failed to publish booking event:', error.message);
      console.error('[SF PubSub] Full error:', error);
      throw error;
    }
  }

  /**
   * Publish a Flight Search Platform Event
   * @param {Object} searchData - The search parameters
   */
  async publishSearchEvent(searchData) {
    if (!this.isConnected) {
      await this.connect();
    }

    const eventTopic = process.env.SF_SEARCH_EVENT_TOPIC || '/event/Flight_Search__e';

    const payload = {
      CreatedDate: Date.now(),
      Session_Id__c: searchData.sessionId || '',
      Origin__c: searchData.origin || '',
      Destination__c: searchData.destination || '',
      Departure_Date__c: searchData.departureDate || '',
      Return_Date__c: searchData.returnDate || '',
      Passengers__c: searchData.passengers || 1,
      Trip_Type__c: searchData.tripType || '',
      Cabin_Class__c: searchData.cabinClass || '',
      User_Email__c: searchData.userEmail || ''
    };

    try {
      console.log('[SF PubSub] Publishing search event:', JSON.stringify(payload));
      const result = await this.client.publish(eventTopic, payload);
      console.log('[SF PubSub] Search event published:', {
        replayId: result.replayId,
        sessionId: searchData.sessionId
      });
      return result;
    } catch (error) {
      console.error('[SF PubSub] Failed to publish search event:', error.message);
      throw error;
    }
  }

  /**
   * Publish an Abandoned Cart Platform Event
   * @param {Object} cartData - The abandoned cart information
   */
  async publishAbandonedCartEvent(cartData) {
    if (!this.isConnected) {
      await this.connect();
    }

    const eventTopic = '/event/Abandoned_Cart__e';

    const payload = {
      CreatedDate: Date.now(),
      Session_Id__c: cartData.sessionId || '',
      User_Email__c: cartData.userEmail || '',
      Flight_Details__c: JSON.stringify(cartData.flightDetails || {}),
      Cart_Total__c: cartData.cartTotal || 0,
      Time_On_Page__c: cartData.timeOnPage || 0,
      Page_URL__c: cartData.pageUrl || ''
    };

    try {
      console.log('[SF PubSub] Publishing abandoned cart event:', JSON.stringify(payload));
      const result = await this.client.publish(eventTopic, payload);
      console.log('[SF PubSub] Abandoned cart event published:', {
        replayId: result.replayId,
        userEmail: cartData.userEmail
      });
      return result;
    } catch (error) {
      console.error('[SF PubSub] Failed to publish abandoned cart event:', error.message);
      throw error;
    }
  }

  /**
   * Subscribe to Platform Events (for testing/debugging)
   * @param {string} topic - The event topic to subscribe to
   * @param {Function} callback - Callback function for received events
   */
  async subscribe(topic, callback) {
    if (!this.isConnected) {
      await this.connect();
    }

    const subscribeCallback = (subscription, callbackType, data) => {
      switch (callbackType) {
        case 'event':
          console.log('[SF PubSub] Event received:', data);
          callback(data);
          break;
        case 'lastEvent':
          console.log('[SF PubSub] Reached last requested event');
          // Request more events to keep subscription alive
          this.client.requestAdditionalEvents(subscription, 100);
          break;
        case 'error':
          console.error('[SF PubSub] Subscription error:', data);
          break;
        case 'end':
          console.log('[SF PubSub] Subscription ended');
          break;
      }
    };

    await this.client.subscribe(topic, subscribeCallback, 100);
    console.log(`[SF PubSub] Subscribed to ${topic}`);
  }

  /**
   * Disconnect from Salesforce
   */
  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      console.log('[SF PubSub] Disconnected from Salesforce');
    }
  }
}

// Export singleton instance
module.exports = new SalesforcePubSubService();
