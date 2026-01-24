/**
 * Direct test of Salesforce Pub/Sub API
 */

require('dotenv').config();

// Override env for local testing
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

  // Test payload - matching exactly what Platform Event expects
  const payload = {
    CreatedDate: Date.now(),
    // Required fields
    Booking_Reference__c: 'TEST' + Date.now(),
    Passenger_Name__c: 'Test User',
    Passenger_Email__c: 'test@example.com',
    Flight_Number__c: 'AA1234',
    Origin__c: 'DFW',
    Destination__c: 'LAX',
    Departure_Date__c: '2026-02-15',
    // Nullable fields - try different formats
    Cabin_Class__c: { string: 'economy' },
    Total_Amount__c: { double: 459.00 },
    Seat_Numbers__c: { string: '12A' },
    Booking_Status__c: { string: 'Confirmed' }
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    console.log('Publishing to /event/Flight_Booking__e...');
    const result = await client.publish('/event/Flight_Booking__e', payload);
    console.log('SUCCESS! Result:', result);
  } catch (error) {
    console.error('FAILED:', error.message);
    console.error('Full error:', error);

    // Try with null for optional fields
    console.log('\nRetrying with null for optional fields...');
    const payload2 = {
      CreatedDate: Date.now(),
      Booking_Reference__c: 'TEST' + Date.now(),
      Passenger_Name__c: 'Test User',
      Passenger_Email__c: 'test@example.com',
      Flight_Number__c: 'AA1234',
      Origin__c: 'DFW',
      Destination__c: 'LAX',
      Departure_Date__c: '2026-02-15',
      Cabin_Class__c: null,
      Total_Amount__c: null,
      Seat_Numbers__c: null,
      Booking_Status__c: null
    };

    try {
      const result2 = await client.publish('/event/Flight_Booking__e', payload2);
      console.log('SUCCESS with nulls! Result:', result2);
    } catch (error2) {
      console.error('FAILED with nulls:', error2.message);

      // Try without optional fields at all
      console.log('\nRetrying without optional fields...');
      const payload3 = {
        CreatedDate: Date.now(),
        Booking_Reference__c: 'TEST' + Date.now(),
        Passenger_Name__c: 'Test User',
        Passenger_Email__c: 'test@example.com',
        Flight_Number__c: 'AA1234',
        Origin__c: 'DFW',
        Destination__c: 'LAX',
        Departure_Date__c: '2026-02-15'
      };

      try {
        const result3 = await client.publish('/event/Flight_Booking__e', payload3);
        console.log('SUCCESS without optionals! Result:', result3);
      } catch (error3) {
        console.error('FAILED without optionals:', error3.message);
      }
    }
  }

  await client.close();
  console.log('Done.');
}

testPublish().catch(console.error);
