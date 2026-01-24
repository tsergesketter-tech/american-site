/**
 * Salesforce Pub/Sub API Service
 * Publishes Platform Events to Salesforce using gRPC Pub/Sub API
 *
 * The Avro schema for Platform Events requires:
 *   - CreatedDate (long) - REQUIRED - timestamp in milliseconds
 *   - CreatedById (string) - REQUIRED - Salesforce User ID
 *   - Custom fields use union types like ["null", "string"] with format { string: "value" }
 */

const PubSubApiClient = require('salesforce-pubsub-api-client').default;
const eventLogger = require('./eventLogger');

class SalesforcePubSubService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.accessToken = null;
    this.instanceUrl = null;
    this.userId = null;  // Cache the user ID for CreatedById field
    this.useGrpc = process.env.SALESFORCE_USE_GRPC !== 'false';  // Default to gRPC

    // Global kill switch - defaults to DISABLED for safety
    this.enabled = process.env.SALESFORCE_PUBSUB_ENABLED === 'true';
  }

  /**
   * Check if the service is enabled
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Enable the service (runtime toggle)
   */
  enable() {
    this.enabled = true;
    console.log('[SF PubSub] Service ENABLED');
    return { enabled: true };
  }

  /**
   * Disable the service (runtime toggle)
   */
  disable() {
    this.enabled = false;
    console.log('[SF PubSub] Service DISABLED');
    return { enabled: false };
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      enabled: this.enabled,
      connected: this.isConnected,
      useGrpc: this.useGrpc,
      userId: this.userId
    };
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
      // Get OAuth token and user info
      await this.refreshToken();
      await this.fetchUserId();

      // Connect Pub/Sub client for gRPC operations
      this.client = new PubSubApiClient({
        authType: 'oauth-client-credentials',
        loginUrl: process.env.SALESFORCE_LOGIN_URL,
        clientId: process.env.SALESFORCE_CLIENT_ID,
        clientSecret: process.env.SALESFORCE_CLIENT_SECRET
      });

      await this.client.connect();
      this.isConnected = true;
      console.log('[SF PubSub] Connected to Salesforce Pub/Sub API (gRPC mode:', this.useGrpc, ')');
    } catch (error) {
      console.error('[SF PubSub] Connection failed:', error.message);
      throw error;
    }
  }

  /**
   * Refresh OAuth token
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
   * Fetch the current user ID for CreatedById field (required by Avro schema)
   */
  async fetchUserId() {
    if (this.userId) return this.userId;

    const response = await fetch(`${this.instanceUrl}/services/oauth2/userinfo`, {
      headers: { 'Authorization': `Bearer ${this.accessToken}` }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.status}`);
    }

    const data = await response.json();
    this.userId = data.user_id;
    console.log('[SF PubSub] User ID cached:', this.userId);
    return this.userId;
  }

  /**
   * Wrap a value in Avro union format for nullable fields
   * For ["null", "string"] unions, use { string: "value" } or null
   */
  wrapUnion(value, type = 'string') {
    if (value === null || value === undefined) {
      return null;
    }
    return { [type]: value };
  }

  /**
   * Publish Platform Event via gRPC Pub/Sub API
   */
  async publishEventGrpc(topicName, payload) {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      const result = await this.client.publish(topicName, payload);
      return {
        success: true,
        replayId: result.replayId,
        correlationKey: result.correlationKey
      };
    } catch (error) {
      console.error('[SF PubSub] gRPC publish error:', error.message);
      throw error;
    }
  }

  /**
   * Publish Platform Event via REST API (fallback)
   */
  async publishEventRest(eventApiName, payload) {
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
      if (response.status === 401) {
        await this.refreshToken();
        return this.publishEventRest(eventApiName, payload);
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
    // Log the event
    const eventId = eventLogger.logEvent({
      type: 'Flight_Booking__e',
      topic: '/event/Flight_Booking__e',
      payload: bookingData,
      source: 'salesforcePubSub'
    });

    if (!this.enabled) {
      console.log('[SF PubSub] Service disabled - skipping booking event');
      eventLogger.skipEvent(eventId, 'Service disabled');
      return { success: false, reason: 'Service disabled', eventId };
    }

    if (this.useGrpc) {
      // gRPC Pub/Sub API with Avro encoding
      const payload = {
        // Required fields
        CreatedDate: Date.now(),
        CreatedById: this.userId,
        // Nullable union fields
        Booking_Reference__c: this.wrapUnion(bookingData.bookingReference || 'UNKNOWN'),
        Passenger_Name__c: this.wrapUnion(bookingData.passengerName || 'Unknown'),
        Passenger_Email__c: this.wrapUnion(bookingData.passengerEmail || 'unknown@example.com'),
        Flight_Number__c: this.wrapUnion(bookingData.flightNumber || 'AA0000'),
        Origin__c: this.wrapUnion(bookingData.origin || 'XXX'),
        Destination__c: this.wrapUnion(bookingData.destination || 'XXX'),
        Departure_Date__c: this.wrapUnion(bookingData.departureDate || new Date().toISOString().split('T')[0]),
        Cabin_Class__c: this.wrapUnion(bookingData.cabinClass),
        Total_Amount__c: this.wrapUnion(bookingData.totalAmount, 'double'),
        Seat_Numbers__c: this.wrapUnion(bookingData.seatNumbers),
        Booking_Status__c: this.wrapUnion(bookingData.status || 'Confirmed')
      };

      try {
        console.log('[SF PubSub] Publishing booking event via gRPC Pub/Sub API');
        const result = await this.publishEventGrpc('/event/Flight_Booking__e', payload);
        eventLogger.updateEvent(eventId, result);
        console.log('[SF PubSub] Booking event published:', {
          replayId: result.replayId,
          success: result.success,
          bookingReference: bookingData.bookingReference
        });
        return { ...result, eventId };
      } catch (error) {
        eventLogger.failEvent(eventId, error);
        console.error('[SF PubSub] Failed to publish booking event:', error.message);
        throw error;
      }
    } else {
      // REST API fallback
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
        const result = await this.publishEventRest('Flight_Booking__e', payload);
        eventLogger.updateEvent(eventId, { ...result, success: true });
        console.log('[SF PubSub] Booking event published:', {
          id: result.id,
          success: result.success,
          bookingReference: bookingData.bookingReference
        });
        return { ...result, eventId };
      } catch (error) {
        eventLogger.failEvent(eventId, error);
        console.error('[SF PubSub] Failed to publish booking event:', error.message);
        throw error;
      }
    }
  }

  /**
   * Publish a Flight Search Platform Event
   */
  async publishSearchEvent(searchData) {
    // Log the event
    const eventId = eventLogger.logEvent({
      type: 'Flight_Search__e',
      topic: '/event/Flight_Search__e',
      payload: searchData,
      source: 'salesforcePubSub'
    });

    if (!this.enabled) {
      console.log('[SF PubSub] Service disabled - skipping search event');
      eventLogger.skipEvent(eventId, 'Service disabled');
      return { success: false, reason: 'Service disabled', eventId };
    }

    if (this.useGrpc) {
      // gRPC Pub/Sub API with Avro encoding
      const payload = {
        // Required fields
        CreatedDate: Date.now(),
        CreatedById: this.userId,
        // Nullable union fields
        Session_Id__c: this.wrapUnion(searchData.sessionId),
        Origin__c: this.wrapUnion(searchData.origin),
        Destination__c: this.wrapUnion(searchData.destination),
        Departure_Date__c: this.wrapUnion(searchData.departureDate),
        Return_Date__c: this.wrapUnion(searchData.returnDate),
        Passengers__c: this.wrapUnion(searchData.passengers, 'double'),
        Trip_Type__c: this.wrapUnion(searchData.tripType),
        Cabin_Class__c: this.wrapUnion(searchData.cabinClass),
        User_Email__c: this.wrapUnion(searchData.userEmail)
      };

      try {
        console.log('[SF PubSub] Publishing search event via gRPC Pub/Sub API');
        const result = await this.publishEventGrpc('/event/Flight_Search__e', payload);
        eventLogger.updateEvent(eventId, result);
        console.log('[SF PubSub] Search event published:', {
          replayId: result.replayId,
          success: result.success,
          sessionId: searchData.sessionId
        });
        return { ...result, eventId };
      } catch (error) {
        eventLogger.failEvent(eventId, error);
        console.error('[SF PubSub] Failed to publish search event:', error.message);
        throw error;
      }
    } else {
      // REST API fallback
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
        const result = await this.publishEventRest('Flight_Search__e', payload);
        eventLogger.updateEvent(eventId, { ...result, success: true });
        console.log('[SF PubSub] Search event published:', {
          id: result.id,
          success: result.success,
          sessionId: searchData.sessionId
        });
        return { ...result, eventId };
      } catch (error) {
        eventLogger.failEvent(eventId, error);
        console.error('[SF PubSub] Failed to publish search event:', error.message);
        throw error;
      }
    }
  }

  /**
   * Publish an Abandoned Cart Platform Event
   */
  async publishAbandonedCartEvent(cartData) {
    // Log the event
    const eventId = eventLogger.logEvent({
      type: 'Abandoned_Cart__e',
      topic: '/event/Abandoned_Cart__e',
      payload: cartData,
      source: 'salesforcePubSub'
    });

    if (!this.enabled) {
      console.log('[SF PubSub] Service disabled - skipping abandoned cart event');
      eventLogger.skipEvent(eventId, 'Service disabled');
      return { success: false, reason: 'Service disabled', eventId };
    }

    if (this.useGrpc) {
      // gRPC Pub/Sub API with Avro encoding
      const payload = {
        // Required fields
        CreatedDate: Date.now(),
        CreatedById: this.userId,
        // Nullable union fields
        Session_Id__c: this.wrapUnion(cartData.sessionId),
        User_Email__c: this.wrapUnion(cartData.userEmail),
        Flight_Details__c: this.wrapUnion(cartData.flightDetails ? JSON.stringify(cartData.flightDetails) : null),
        Cart_Total__c: this.wrapUnion(cartData.cartTotal, 'double'),
        Time_On_Page__c: this.wrapUnion(cartData.timeOnPage, 'double'),
        Page_URL__c: this.wrapUnion(cartData.pageUrl)
      };

      try {
        console.log('[SF PubSub] Publishing abandoned cart event via gRPC Pub/Sub API');
        const result = await this.publishEventGrpc('/event/Abandoned_Cart__e', payload);
        eventLogger.updateEvent(eventId, result);
        console.log('[SF PubSub] Abandoned cart event published:', {
          replayId: result.replayId,
          success: result.success,
          userEmail: cartData.userEmail
        });
        return { ...result, eventId };
      } catch (error) {
        eventLogger.failEvent(eventId, error);
        console.error('[SF PubSub] Failed to publish abandoned cart event:', error.message);
        throw error;
      }
    } else {
      // REST API fallback
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
        const result = await this.publishEventRest('Abandoned_Cart__e', payload);
        eventLogger.updateEvent(eventId, { ...result, success: true });
        console.log('[SF PubSub] Abandoned cart event published:', {
          id: result.id,
          success: result.success,
          userEmail: cartData.userEmail
        });
        return { ...result, eventId };
      } catch (error) {
        eventLogger.failEvent(eventId, error);
        console.error('[SF PubSub] Failed to publish abandoned cart event:', error.message);
        throw error;
      }
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
