/**
 * Test publishBatch method
 */

require('dotenv').config();

process.env.SALESFORCE_LOGIN_URL = 'https://trailsignup-fb4f077cdf5625.my.salesforce.com';
process.env.SALESFORCE_CLIENT_ID = '3MVG9Rr0EZ2YOVMY7w1h6SFFRDiV0J9G6jMN7NYqimFGDyweKVEB3.WrXmNr7c1FR17gWzD6zkCocw0vJMy2r';
process.env.SALESFORCE_CLIENT_SECRET = '502A7250913041E39BA6AE98E253AFD11796440453F65A0EE2D2056DC9935C55';

const PubSubApiClient = require('salesforce-pubsub-api-client').default;

async function testBatch() {
  console.log('Creating Pub/Sub API client...');

  const client = new PubSubApiClient({
    authType: 'oauth-client-credentials',
    loginUrl: process.env.SALESFORCE_LOGIN_URL,
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET
  });

  await client.connect();
  console.log('Connected!');

  // Try publishBatch
  const events = [{
    payload: {
      CreatedDate: Date.now(),
      Booking_Reference__c: 'BATCH' + Date.now(),
      Passenger_Name__c: 'Batch User',
      Passenger_Email__c: 'batch@test.com',
      Flight_Number__c: 'AA300',
      Origin__c: 'ORD',
      Destination__c: 'ATL',
      Departure_Date__c: '2026-03-01',
      Cabin_Class__c: 'premium',
      Total_Amount__c: 750,
      Seat_Numbers__c: '5C',
      Booking_Status__c: 'Confirmed'
    }
  }];

  console.log('Testing publishBatch...');

  const callback = (publishResult) => {
    console.log('Publish callback received:', publishResult);
    if (publishResult.error) {
      console.error('Error:', publishResult.error);
    } else {
      console.log('Success! ReplayId:', publishResult.replayId);
    }
  };

  try {
    await client.publishBatch('/event/Flight_Booking__e', events, callback);
    console.log('publishBatch called');

    // Wait for callback
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (error) {
    console.error('publishBatch error:', error.message);
    if (error.cause) console.error('Cause:', error.cause);
  }

  await client.close();
  console.log('Done.');
}

testBatch().catch(console.error);
