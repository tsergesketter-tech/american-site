/**
 * Test the final Salesforce service
 */

require('dotenv').config();

process.env.SALESFORCE_LOGIN_URL = 'https://trailsignup-fb4f077cdf5625.my.salesforce.com';
process.env.SALESFORCE_CLIENT_ID = '3MVG9Rr0EZ2YOVMY7w1h6SFFRDiV0J9G6jMN7NYqimFGDyweKVEB3.WrXmNr7c1FR17gWzD6zkCocw0vJMy2r';
process.env.SALESFORCE_CLIENT_SECRET = '502A7250913041E39BA6AE98E253AFD11796440453F65A0EE2D2056DC9935C55';

const salesforcePubSub = require('../services/salesforcePubSub');

async function test() {
  console.log('=== Testing Salesforce Service ===\n');

  try {
    await salesforcePubSub.connect();

    // Test booking event
    console.log('\n1. Testing Booking Event...');
    const bookingResult = await salesforcePubSub.publishBookingEvent({
      bookingReference: 'FINAL' + Date.now(),
      passengerName: 'Final Test User',
      passengerEmail: 'final@test.com',
      flightNumber: 'AA999',
      origin: 'DFW',
      destination: 'LAX',
      departureDate: '2026-02-20',
      cabinClass: 'business',
      totalAmount: 1500,
      seatNumbers: '4A',
      status: 'Confirmed'
    });
    console.log('Booking Result:', bookingResult);

    // Test search event
    console.log('\n2. Testing Search Event...');
    const searchResult = await salesforcePubSub.publishSearchEvent({
      sessionId: 'sess_' + Date.now(),
      origin: 'JFK',
      destination: 'MIA',
      departureDate: '2026-03-15',
      returnDate: '2026-03-22',
      passengers: 2,
      tripType: 'roundtrip',
      cabinClass: 'economy',
      userEmail: 'searcher@test.com'
    });
    console.log('Search Result:', searchResult);

    // Test abandoned cart event
    console.log('\n3. Testing Abandoned Cart Event...');
    const cartResult = await salesforcePubSub.publishAbandonedCartEvent({
      sessionId: 'cart_' + Date.now(),
      userEmail: 'abandoner@test.com',
      flightDetails: { flight: 'AA123', price: 450 },
      cartTotal: 450,
      timeOnPage: 120,
      pageUrl: '/checkout'
    });
    console.log('Cart Result:', cartResult);

    await salesforcePubSub.disconnect();
    console.log('\n=== All Tests Passed ===');

  } catch (error) {
    console.error('\n=== Test Failed ===');
    console.error(error);
  }
}

test();
