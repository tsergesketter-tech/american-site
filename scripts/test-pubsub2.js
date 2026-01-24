/**
 * Direct test of Salesforce Pub/Sub API with more debugging
 */

require('dotenv').config();

process.env.SALESFORCE_LOGIN_URL = 'https://trailsignup-fb4f077cdf5625.my.salesforce.com';
process.env.SALESFORCE_CLIENT_ID = '3MVG9Rr0EZ2YOVMY7w1h6SFFRDiV0J9G6jMN7NYqimFGDyweKVEB3.WrXmNr7c1FR17gWzD6zkCocw0vJMy2r';
process.env.SALESFORCE_CLIENT_SECRET = '502A7250913041E39BA6AE98E253AFD11796440453F65A0EE2D2056DC9935C55';

const PubSubApiClient = require('salesforce-pubsub-api-client').default;

async function testPublish() {
  console.log('Creating Pub/Sub API client...');

  const client = new PubSubApiClient({
    authType: 'oauth-client-credentials',
    loginUrl: process.env.SALESFORCE_LOGIN_URL,
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET
  });

  console.log('Connecting...');
  await client.connect();
  console.log('Connected!');

  // Based on Salesforce Pub/Sub API documentation, try minimal payload first
  // Only CreatedDate is auto-managed, everything else we provide

  const testCases = [
    // Test 1: All fields as simple strings/numbers
    {
      name: 'Simple values only',
      payload: {
        CreatedDate: Date.now(),
        Booking_Reference__c: 'TEST123',
        Passenger_Name__c: 'John Doe',
        Passenger_Email__c: 'john@test.com',
        Flight_Number__c: 'AA100',
        Origin__c: 'DFW',
        Destination__c: 'LAX',
        Departure_Date__c: '2026-01-30',
        Cabin_Class__c: 'economy',
        Total_Amount__c: 500,
        Seat_Numbers__c: '10A',
        Booking_Status__c: 'Confirmed'
      }
    },
    // Test 2: With explicit types for all
    {
      name: 'With string wrapper for nullables',
      payload: {
        CreatedDate: Date.now(),
        Booking_Reference__c: 'TEST456',
        Passenger_Name__c: 'Jane Doe',
        Passenger_Email__c: 'jane@test.com',
        Flight_Number__c: 'AA200',
        Origin__c: 'JFK',
        Destination__c: 'MIA',
        Departure_Date__c: '2026-02-01',
        Cabin_Class__c: { string: 'business' },
        Total_Amount__c: { double: 1000.50 },
        Seat_Numbers__c: { string: '2B' },
        Booking_Status__c: { string: 'Pending' }
      }
    }
  ];

  for (const test of testCases) {
    console.log(`\n=== Testing: ${test.name} ===`);
    console.log('Payload:', JSON.stringify(test.payload, null, 2));

    try {
      const result = await client.publish('/event/Flight_Booking__e', test.payload);
      console.log('SUCCESS:', result);
      break; // Stop on first success
    } catch (error) {
      console.error('FAILED:', error.message);
      if (error.cause) {
        console.error('Cause:', error.cause.message);
      }
    }
  }

  await client.close();
  console.log('\nDone.');
}

testPublish().catch(console.error);
