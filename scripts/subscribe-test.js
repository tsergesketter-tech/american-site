/**
 * Subscribe to see the event schema format
 */

require('dotenv').config();

process.env.SALESFORCE_LOGIN_URL = 'https://trailsignup-fb4f077cdf5625.my.salesforce.com';
process.env.SALESFORCE_CLIENT_ID = '3MVG9Rr0EZ2YOVMY7w1h6SFFRDiV0J9G6jMN7NYqimFGDyweKVEB3.WrXmNr7c1FR17gWzD6zkCocw0vJMy2r';
process.env.SALESFORCE_CLIENT_SECRET = '502A7250913041E39BA6AE98E253AFD11796440453F65A0EE2D2056DC9935C55';

const PubSubApiClient = require('salesforce-pubsub-api-client').default;

async function subscribeAndPublishViaREST() {
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

  // First, publish via REST API to create an event
  console.log('\nPublishing event via Salesforce REST API...');

  const fetch = (await import('node-fetch')).default;

  // Get access token
  const tokenResponse = await fetch('https://trailsignup-fb4f077cdf5625.my.salesforce.com/services/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials&client_id=3MVG9Rr0EZ2YOVMY7w1h6SFFRDiV0J9G6jMN7NYqimFGDyweKVEB3.WrXmNr7c1FR17gWzD6zkCocw0vJMy2r&client_secret=502A7250913041E39BA6AE98E253AFD11796440453F65A0EE2D2056DC9935C55'
  });
  const tokenData = await tokenResponse.json();
  console.log('Got access token');

  // Publish via REST API
  const eventPayload = {
    Booking_Reference__c: 'REST' + Date.now(),
    Passenger_Name__c: 'REST Test User',
    Passenger_Email__c: 'rest@test.com',
    Flight_Number__c: 'AA999',
    Origin__c: 'SFO',
    Destination__c: 'SEA',
    Departure_Date__c: '2026-02-20',
    Cabin_Class__c: 'first',
    Total_Amount__c: 2000,
    Seat_Numbers__c: '1A',
    Booking_Status__c: 'Confirmed'
  };

  console.log('Publishing to REST API:', JSON.stringify(eventPayload));

  const publishResponse = await fetch('https://trailsignup-fb4f077cdf5625.my.salesforce.com/services/data/v59.0/sobjects/Flight_Booking__e', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventPayload)
  });

  const publishResult = await publishResponse.json();
  console.log('REST API Publish Result:', JSON.stringify(publishResult));

  // Now subscribe to see the event
  console.log('\nSubscribing to /event/Flight_Booking__e to see event format...');

  let eventReceived = false;

  const callback = (subscription, callbackType, data) => {
    console.log(`\n[Callback] Type: ${callbackType}`);
    if (callbackType === 'event') {
      console.log('Event data:', JSON.stringify(data, null, 2));
      eventReceived = true;
    } else if (callbackType === 'lastEvent') {
      console.log('Last event in batch');
    } else if (callbackType === 'error') {
      console.error('Subscription error:', data);
    }
  };

  try {
    await client.subscribe('/event/Flight_Booking__e', callback, 5);
    console.log('Subscribed, waiting for events...');

    // Wait a few seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

  } catch (e) {
    console.error('Subscribe error:', e.message);
  }

  await client.close();
  console.log('\nDone.');
}

subscribeAndPublishViaREST().catch(console.error);
