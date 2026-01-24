/**
 * Test publishBatch method with correct Avro schema fields
 *
 * IMPORTANT: The Avro schema requires:
 *   - CreatedDate (long) - REQUIRED
 *   - CreatedById (string) - REQUIRED
 *   - All other fields are nullable unions with default null
 */

require('dotenv').config();

process.env.SALESFORCE_LOGIN_URL = 'https://trailsignup-fb4f077cdf5625.my.salesforce.com';
process.env.SALESFORCE_CLIENT_ID = '3MVG9Rr0EZ2YOVMY7w1h6SFFRDiV0J9G6jMN7NYqimFGDyweKVEB3.WrXmNr7c1FR17gWzD6zkCocw0vJMy2r';
process.env.SALESFORCE_CLIENT_SECRET = '502A7250913041E39BA6AE98E253AFD11796440453F65A0EE2D2056DC9935C55';

const PubSubApiClient = require('salesforce-pubsub-api-client').default;

async function getUserId() {
  // Get OAuth token and user info
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.SALESFORCE_CLIENT_ID,
    client_secret: process.env.SALESFORCE_CLIENT_SECRET
  });

  const tokenResponse = await fetch(`${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  const tokenData = await tokenResponse.json();

  // Get user info to get the user ID
  const userResponse = await fetch(`${tokenData.instance_url}/services/oauth2/userinfo`, {
    headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
  });

  const userData = await userResponse.json();
  console.log('User ID:', userData.user_id);
  return userData.user_id;
}

async function testBatch() {
  console.log('Getting user ID for CreatedById field...');
  const userId = await getUserId();

  console.log('\nCreating Pub/Sub API client...');

  const client = new PubSubApiClient({
    authType: 'oauth-client-credentials',
    loginUrl: process.env.SALESFORCE_LOGIN_URL,
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET
  });

  await client.connect();
  console.log('Connected!');

  // Build payload with REQUIRED fields and proper union format for nullable fields
  // For Avro unions like ["null", "string"], provide { string: "value" } or null
  const payload = {
    // REQUIRED fields (non-nullable)
    CreatedDate: Date.now(),
    CreatedById: userId,

    // Nullable union fields - try with union syntax { string: "value" }
    Booking_Reference__c: { string: 'GRPC' + Date.now() },
    Passenger_Name__c: { string: 'gRPC Test User' },
    Passenger_Email__c: { string: 'grpc@test.com' },
    Flight_Number__c: { string: 'AA300' },
    Origin__c: { string: 'ORD' },
    Destination__c: { string: 'ATL' },
    Departure_Date__c: { string: '2026-03-01' },
    Cabin_Class__c: { string: 'premium' },
    Total_Amount__c: { double: 750.0 },
    Seat_Numbers__c: { string: '5C' },
    Booking_Status__c: { string: 'Confirmed' }
  };

  console.log('\nPayload:', JSON.stringify(payload, null, 2));

  const events = [{ payload }];

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
