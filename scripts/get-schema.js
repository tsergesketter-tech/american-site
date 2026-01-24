/**
 * Get Avro schema from Salesforce Pub/Sub API
 */

require('dotenv').config();

process.env.SALESFORCE_LOGIN_URL = 'https://trailsignup-fb4f077cdf5625.my.salesforce.com';
process.env.SALESFORCE_CLIENT_ID = '3MVG9Rr0EZ2YOVMY7w1h6SFFRDiV0J9G6jMN7NYqimFGDyweKVEB3.WrXmNr7c1FR17gWzD6zkCocw0vJMy2r';
process.env.SALESFORCE_CLIENT_SECRET = '502A7250913041E39BA6AE98E253AFD11796440453F65A0EE2D2056DC9935C55';

const PubSubApiClient = require('salesforce-pubsub-api-client').default;

async function getSchema() {
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

  // Get topic info which includes schema
  console.log('\nGetting topic info for /event/Flight_Booking__e...');
  const topicInfo = await client.getTopicInfo('/event/Flight_Booking__e');
  console.log('Topic Info:', JSON.stringify(topicInfo, null, 2));

  // Try to get schema details
  if (topicInfo.schemaId) {
    console.log('\nGetting schema for ID:', topicInfo.schemaId);
    try {
      const schema = await client.getSchema(topicInfo.schemaId);
      console.log('Schema:', JSON.stringify(schema, null, 2));
    } catch (e) {
      console.log('Schema error:', e.message);
    }
  }

  await client.close();
}

getSchema().catch(console.error);
