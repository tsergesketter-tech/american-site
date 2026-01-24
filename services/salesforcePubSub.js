/**
 * Salesforce Pub/Sub API Service
 * Publishes Platform Events to Salesforce
 * Uses REST API for publishing (more reliable) and gRPC for subscribing
 */

const PubSubApiClient = require('salesforce-pubsub-api-client').default;

class SalesforcePubSubService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.accessToken = null;
    this.instanceUrl = null;
  }

  /**
   * Initialize and connect to Salesforce
   */
  async connect() {
    if (this.isConnected) {
      console.log('[SF PubSub] Already connected');
      return;
    }

    try {
      // Get OAuth token for REST API
      await this.refreshToken();

      // Also connect Pub/Sub client for subscribing
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
      throw error;
    }
  }

  /**
   * Refresh OAuth token for REST API calls
   */
  async refreshToken() {
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET
    });

    const response = await fetch(`${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.instanceUrl = data.instance_url;
    console.log('[SF PubSub] OAuth token refreshed');
  }

  /**
   * Publish Platform Event via REST API
   */
  async publishEvent(eventApiName, payload) {
    if (!this.accessToken) {
      await this.refreshToken();
    }

    const url = `${this.instanceUrl}/services/data/v59.0/sobjects/${eventApiName}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      // Token might be expired, try refreshing
      if (response.status === 401) {
        await this.refreshToken();
        return this.publishEvent(eventApiName, payload);
      }
      console.error('[SF PubSub] REST API error:', result);
      throw new Error(`Failed to publish event: ${JSON.stringify(result)}`);
    }

    return result;
  }

  /**
   * Publish a Flight Booking Platform Event
   */
  async publishBookingEvent(bookingData) {
    const payload = {
      Booking_Reference__c: bookingData.bookingReference || 'UNKNOWN',
      Passenger_Name__c: bookingData.passengerName || 'Unknown',
      Passenger_Email__c: bookingData.passengerEmail || 'unknown@example.com',
      Flight_Number__c: bookingData.flightNumber || 'AA0000',
      Origin__c: bookingData.origin || 'XXX',
      Destination__c: bookingData.destination || 'XXX',
      Departure_Date__c: bookingData.departureDate || new Date().toISOString().split('T')[0],
      Cabin_Class__c: bookingData.cabinClass || null,
      Total_Amount__c: bookingData.totalAmount || null,
      Seat_Numbers__c: bookingData.seatNumbers || null,
      Booking_Status__c: bookingData.status || 'Confirmed'
    };

    try {
      console.log('[SF PubSub] Publishing booking event via REST API');
      const result = await this.publishEvent('Flight_Booking__e', payload);
      console.log('[SF PubSub] Booking event published:', {
        id: result.id,
        success: result.success,
        bookingReference: bookingData.bookingReference
      });
      return result;
    } catch (error) {
      console.error('[SF PubSub] Failed to publish booking event:', error.message);
      throw error;
    }
  }

  /**
   * Publish a Flight Search Platform Event
   */
  async publishSearchEvent(searchData) {
    const payload = {
      Session_Id__c: searchData.sessionId || '',
      Origin__c: searchData.origin || '',
      Destination__c: searchData.destination || '',
      Departure_Date__c: searchData.departureDate || '',
      Return_Date__c: searchData.returnDate || null,
      Passengers__c: searchData.passengers || 1,
      Trip_Type__c: searchData.tripType || '',
      Cabin_Class__c: searchData.cabinClass || null,
      User_Email__c: searchData.userEmail || null
    };

    try {
      console.log('[SF PubSub] Publishing search event via REST API');
      const result = await this.publishEvent('Flight_Search__e', payload);
      console.log('[SF PubSub] Search event published:', {
        id: result.id,
        success: result.success,
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
   */
  async publishAbandonedCartEvent(cartData) {
    const payload = {
      Session_Id__c: cartData.sessionId || '',
      User_Email__c: cartData.userEmail || '',
      Flight_Details__c: JSON.stringify(cartData.flightDetails || {}),
      Cart_Total__c: cartData.cartTotal || null,
      Time_On_Page__c: cartData.timeOnPage || null,
      Page_URL__c: cartData.pageUrl || null
    };

    try {
      console.log('[SF PubSub] Publishing abandoned cart event via REST API');
      const result = await this.publishEvent('Abandoned_Cart__e', payload);
      console.log('[SF PubSub] Abandoned cart event published:', {
        id: result.id,
        success: result.success,
        userEmail: cartData.userEmail
      });
      return result;
    } catch (error) {
      console.error('[SF PubSub] Failed to publish abandoned cart event:', error.message);
      throw error;
    }
  }

  /**
   * Subscribe to Platform Events (using gRPC Pub/Sub API)
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
      this.accessToken = null;
      console.log('[SF PubSub] Disconnected from Salesforce');
    }
  }
}

// Export singleton instance
module.exports = new SalesforcePubSubService();
