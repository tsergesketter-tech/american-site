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

      // Connect Kafka consumer
      await kafkaService.connectConsumer('salesforce-bridge');

      // Subscribe to all relevant topics
      await this.subscribeToTopics();

      this.isRunning = true;
      console.log('[EventBridge] Event bridge started successfully');
    } catch (error) {
      console.error('[EventBridge] Failed to start:', error.message);
      throw error;
    }
  }

  /**
   * Subscribe to Kafka topics and set up message handlers
   */
  async subscribeToTopics() {
    // Handle flight booking events
    await kafkaService.subscribe(TOPICS.FLIGHT_BOOKINGS, async (message, metadata) => {
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
        // In production, implement dead letter queue or retry logic
      }
    });

    // Handle flight search events
    await kafkaService.subscribe(TOPICS.FLIGHT_SEARCHES, async (message, metadata) => {
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
    await kafkaService.subscribe(TOPICS.ABANDONED_CARTS, async (message, metadata) => {
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

    console.log('[EventBridge] Subscribed to all topics');
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
