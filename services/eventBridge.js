/**
 * Event Bridge Service
 * Bridges Kafka messages to Salesforce Platform Events
 */

const { kafkaService, TOPICS } = require('./kafkaService');
const salesforcePubSub = require('./salesforcePubSub');

class EventBridge {
  constructor() {
    this.isRunning = false;
  }

  /**
   * Start the event bridge - consume from Kafka and publish to Salesforce
   */
  async start() {
    if (this.isRunning) {
      console.log('[EventBridge] Already running');
      return;
    }

    console.log('[EventBridge] Starting event bridge...');

    try {
      // Connect to Salesforce first
      await salesforcePubSub.connect();

      // Initialize Kafka
      kafkaService.initialize();

      // Subscribe to all topics FIRST (before starting consumer)
      await this.subscribeToAllTopics();

      // THEN start the consumer
      await kafkaService.startConsumer();

      this.isRunning = true;
      console.log('[EventBridge] Event bridge started successfully');
    } catch (error) {
      console.error('[EventBridge] Failed to start:', error.message);
      throw error;
    }
  }

  /**
   * Subscribe to all Kafka topics with their handlers
   */
  async subscribeToAllTopics() {
    // Handle flight booking events
    await kafkaService.addSubscription(TOPICS.FLIGHT_BOOKINGS, async (message, metadata) => {
      console.log('[EventBridge] Processing booking event...');
      try {
        await salesforcePubSub.publishBookingEvent({
          bookingReference: message.bookingReference,
          passengerName: message.passengerName,
          passengerEmail: message.passengerEmail,
          flightNumber: message.flightNumber,
          origin: message.origin,
          destination: message.destination,
          departureDate: message.departureDate,
          cabinClass: message.cabinClass,
          totalAmount: message.totalAmount,
          seatNumbers: message.seatNumbers,
          status: message.status || 'Confirmed'
        });
        console.log('[EventBridge] Booking event forwarded to Salesforce');
      } catch (error) {
        console.error('[EventBridge] Failed to forward booking event:', error.message);
      }
    });

    // Handle flight search events
    await kafkaService.addSubscription(TOPICS.FLIGHT_SEARCHES, async (message, metadata) => {
      console.log('[EventBridge] Processing search event...');
      try {
        await salesforcePubSub.publishSearchEvent({
          sessionId: message.sessionId,
          origin: message.origin,
          destination: message.destination,
          departureDate: message.departureDate,
          returnDate: message.returnDate,
          passengers: message.passengers,
          tripType: message.tripType,
          cabinClass: message.cabinClass,
          userEmail: message.userEmail
        });
        console.log('[EventBridge] Search event forwarded to Salesforce');
      } catch (error) {
        console.error('[EventBridge] Failed to forward search event:', error.message);
      }
    });

    // Handle abandoned cart events
    await kafkaService.addSubscription(TOPICS.ABANDONED_CARTS, async (message, metadata) => {
      console.log('[EventBridge] Processing abandoned cart event...');
      try {
        await salesforcePubSub.publishAbandonedCartEvent({
          sessionId: message.sessionId,
          userEmail: message.userEmail,
          flightDetails: message.flightDetails,
          cartTotal: message.cartTotal,
          timeOnPage: message.timeOnPage,
          pageUrl: message.pageUrl
        });
        console.log('[EventBridge] Abandoned cart event forwarded to Salesforce');
      } catch (error) {
        console.error('[EventBridge] Failed to forward abandoned cart event:', error.message);
      }
    });

    // Handle generic user events
    await kafkaService.addSubscription(TOPICS.USER_EVENTS, async (message, metadata) => {
      console.log('[EventBridge] Processing user event:', message.eventType);
      // Generic user events can be logged or processed as needed
      console.log('[EventBridge] User event data:', JSON.stringify(message.data));
    });

    console.log('[EventBridge] All topic subscriptions added');
  }

  /**
   * Stop the event bridge
   */
  async stop() {
    console.log('[EventBridge] Stopping event bridge...');
    await kafkaService.disconnect();
    await salesforcePubSub.disconnect();
    this.isRunning = false;
    console.log('[EventBridge] Event bridge stopped');
  }
}

module.exports = new EventBridge();
