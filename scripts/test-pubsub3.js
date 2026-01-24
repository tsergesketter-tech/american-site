/**
 * Test with all possible Platform Event fields
 */

require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

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

  // Test cases trying to find the missing field
  const testCases = [
    // Test with EventUuid
    {
      name: 'With EventUuid',
      payload: {
        CreatedDate: Date.now(),
        EventUuid: uuidv4(),
        Booking_Reference__c: 'TEST1',
        Passenger_Name__c: 'Test User',
        Passenger_Email__c: 'test@example.com',
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
    // Test with ReplayId
    {
      name: 'With ReplayId and EventUuid',
      payload: {
        CreatedDate: Date.now(),
        ReplayId: '1',
        EventUuid: uuidv4(),
        Booking_Reference__c: 'TEST2',
        Passenger_Name__c: 'Test User',
        Passenger_Email__c: 'test@example.com',
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
    // Test with CreatedById
    {
      name: 'With CreatedById',
      payload: {
        CreatedDate: Date.now(),
        CreatedById: '005Ho00000KwlUVIAZ', // From the token response
        Booking_Reference__c: 'TEST3',
        Passenger_Name__c: 'Test User',
        Passenger_Email__c: 'test@example.com',
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
    // Test with all system fields
    {
      name: 'With all system fields',
      payload: {
        CreatedDate: Date.now(),
        CreatedById: '005Ho00000KwlUVIAZ',
        ReplayId: null,
        EventUuid: null,
        Booking_Reference__c: 'TEST4',
        Passenger_Name__c: 'Test User',
        Passenger_Email__c: 'test@example.com',
        Flight_Number__c: 'AA100',
        Origin__c: 'DFW',
        Destination__c: 'LAX',
        Departure_Date__c: '2026-01-30',
        Cabin_Class__c: { string: 'economy' },
        Total_Amount__c: { double: 500 },
        Seat_Numbers__c: { string: '10A' },
        Booking_Status__c: { string: 'Confirmed' }
      }
    }
  ];

  for (const test of testCases) {
    console.log(`\n=== Testing: ${test.name} ===`);
    console.log('Fields:', Object.keys(test.payload).join(', '));

    try {
      const result = await client.publish('/event/Flight_Booking__e', test.payload);
      console.log('SUCCESS:', result);
      break;
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
