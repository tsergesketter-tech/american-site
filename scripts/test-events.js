/**
 * Test Script for Event Publishing
 * Run with: node scripts/test-events.js
 */

require('dotenv').config();

const { kafkaService, TOPICS } = require('../services/kafkaService');
const salesforcePubSub = require('../services/salesforcePubSub');

async function testKafkaPublish() {
  console.log('\n=== Testing Kafka Publishing ===\n');

  try {
    kafkaService.initialize();
    await kafkaService.connectProducer();

    // Test booking event
    const bookingEvent = {
      bookingReference: `TEST${Date.now()}`,
      passengerName: 'John Doe',
      passengerEmail: 'john.doe@test.com',
      flightNumber: 'AA1234',
      origin: 'DFW',
      destination: 'LAX',
      departureDate: '2024-03-15',
      cabinClass: 'economy',
      totalAmount: 459.00,
      seatNumbers: '12A',
      status: 'Confirmed',
      timestamp: new Date().toISOString()
    };

    await kafkaService.publish(TOPICS.FLIGHT_BOOKINGS, bookingEvent, bookingEvent.bookingReference);
    console.log('✓ Booking event published to Kafka');

    // Test search event
    const searchEvent = {
      sessionId: `sess_${Date.now()}`,
      origin: 'JFK',
      destination: 'MIA',
      departureDate: '2024-04-01',
      returnDate: '2024-04-08',
      passengers: 2,
      tripType: 'roundtrip',
      cabinClass: 'business',
      timestamp: new Date().toISOString()
    };

    await kafkaService.publish(TOPICS.FLIGHT_SEARCHES, searchEvent, searchEvent.sessionId);
    console.log('✓ Search event published to Kafka');

    await kafkaService.disconnect();
    console.log('\n✓ Kafka test completed successfully\n');
  } catch (error) {
    console.error('✗ Kafka test failed:', error.message);
  }
}

async function testSalesforcePubSub() {
  console.log('\n=== Testing Salesforce Pub/Sub API ===\n');

  try {
    await salesforcePubSub.connect();

    // Test booking event
    const bookingResult = await salesforcePubSub.publishBookingEvent({
      bookingReference: `TEST${Date.now()}`,
      passengerName: 'Jane Smith',
      passengerEmail: 'jane.smith@test.com',
      flightNumber: 'AA5678',
      origin: 'ORD',
      destination: 'SFO',
      departureDate: '2024-03-20',
      cabinClass: 'first',
      totalAmount: 1299.00,
      seatNumbers: '1A',
      status: 'Confirmed'
    });
    console.log('✓ Booking event published to Salesforce:', bookingResult);

    // Test search event
    const searchResult = await salesforcePubSub.publishSearchEvent({
      sessionId: `sess_${Date.now()}`,
      origin: 'BOS',
      destination: 'SEA',
      departureDate: '2024-05-01',
      returnDate: '2024-05-10',
      passengers: 1,
      tripType: 'roundtrip',
      cabinClass: 'economy'
    });
    console.log('✓ Search event published to Salesforce:', searchResult);

    await salesforcePubSub.disconnect();
    console.log('\n✓ Salesforce test completed successfully\n');
  } catch (error) {
    console.error('✗ Salesforce test failed:', error.message);
    console.error('  Make sure your Salesforce credentials are configured and Platform Events are deployed');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const testType = args[0] || 'all';

  console.log('========================================');
  console.log('   Event Publishing Test Suite');
  console.log('========================================');

  if (testType === 'kafka' || testType === 'all') {
    await testKafkaPublish();
  }

  if (testType === 'salesforce' || testType === 'sf' || testType === 'all') {
    await testSalesforcePubSub();
  }

  console.log('========================================');
  console.log('   Tests Complete');
  console.log('========================================\n');

  process.exit(0);
}

main().catch(console.error);
