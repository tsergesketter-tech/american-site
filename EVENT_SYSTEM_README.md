# Event-Driven Architecture: Kafka, Pub/Sub API & Salesforce Platform Events

## Overview

This system implements a comprehensive event-driven architecture that captures user interactions, publishes them to Kafka for processing, and forwards critical business events to Salesforce Platform Events using the gRPC Pub/Sub API. The architecture supports real-time analytics, event monitoring, and integration with Salesforce Marketing Cloud Personalization.

## Architecture

```
┌─────────────────┐      ┌──────────────┐      ┌─────────────────┐
│   React App     │─────▶│  Express     │─────▶│     Kafka       │
│  (User Events)  │      │   Server     │      │   (Event Bus)   │
└─────────────────┘      │  (REST API)  │      └─────────────────┘
                         └──────────────┘              │
                                │                       │
                                │                       ▼
                                │              ┌─────────────────┐
                                │              │  Event Bridge   │
                                │              │   (Consumer)    │
                                │              └─────────────────┘
                                │                       │
                                ▼                       ▼
                         ┌──────────────────────────────────┐
                         │   Salesforce Pub/Sub API         │
                         │   (gRPC + Avro / REST Fallback)  │
                         └──────────────────────────────────┘
                                         │
                                         ▼
                         ┌──────────────────────────────────┐
                         │  Salesforce Platform Events      │
                         │  - Flight_Booking__e             │
                         │  - Flight_Search__e              │
                         │  - Abandoned_Cart__e             │
                         └──────────────────────────────────┘
```

## Components

### 1. Kafka Service (`services/kafkaService.js`)

Handles event publishing and consumption using Apache Kafka. Supports both Heroku Kafka (with SSL/TLS) and local development configurations.

**Key Features:**
- Producer and consumer management
- Topic-based message routing
- Automatic reconnection
- SSL/TLS support for Heroku
- Message partitioning by key

**Topics:**
- `flight-bookings` - Completed booking events
- `flight-searches` - Flight search queries
- `abandoned-carts` - Cart abandonment tracking
- `user-events` - Generic user interaction events

### 2. Salesforce Pub/Sub Service (`services/salesforcePubSub.js`)

Publishes Platform Events to Salesforce using either the gRPC Pub/Sub API (default) or REST API (fallback).

**Key Features:**
- OAuth 2.0 client credentials authentication
- gRPC Pub/Sub API with Avro schema encoding
- REST API fallback for compatibility
- Automatic token refresh
- Runtime enable/disable toggle
- Event logging and monitoring

**Supported Platform Events:**
- `Flight_Booking__e` - Booking confirmations
- `Flight_Search__e` - Search activity
- `Abandoned_Cart__e` - Cart abandonment

### 3. Event Logger (`services/eventLogger.js`)

In-memory event tracking and monitoring system for debugging and observability.

**Features:**
- Event status tracking (pending, success, failed, skipped)
- Performance metrics (duration, success rate)
- Event filtering by type and status
- Real-time statistics
- Last 1000 events retained in memory

### 4. Event Bridge (`services/eventBridge.js`)

Kafka-to-Salesforce bridge that consumes events from Kafka and forwards them to Salesforce Platform Events.

**Features:**
- Multi-topic subscription
- Automatic message transformation
- Error handling and retry logic
- Graceful shutdown

### 5. Express Server (`server.js`)

RESTful API server that provides event publishing endpoints and an admin dashboard.

## API Endpoints

### Event Publishing

#### `POST /api/events/search`
Publish a flight search event.

**Request Body:**
```json
{
  "sessionId": "uuid-v4",
  "origin": "DFW",
  "destination": "LAX",
  "departureDate": "2024-06-15",
  "returnDate": "2024-06-22",
  "passengers": 2,
  "tripType": "roundtrip",
  "cabinClass": "economy",
  "userEmail": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Search event published",
  "sessionId": "uuid-v4"
}
```

#### `POST /api/events/booking`
Publish a flight booking event (publishes directly to Salesforce).

**Request Body:**
```json
{
  "bookingReference": "AA123ABC",
  "passengerName": "John Doe",
  "passengerEmail": "john.doe@example.com",
  "flightNumber": "AA1234",
  "origin": "DFW",
  "destination": "LAX",
  "departureDate": "2024-06-15",
  "cabinClass": "economy",
  "totalAmount": 450.00,
  "seatNumbers": "12A",
  "status": "Confirmed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking event published",
  "bookingReference": "AA123ABC",
  "salesforce": {
    "success": true,
    "replayId": 12345678,
    "correlationKey": "abc-123"
  }
}
```

#### `POST /api/events/abandoned-cart`
Publish an abandoned cart event.

**Request Body:**
```json
{
  "sessionId": "uuid-v4",
  "userEmail": "user@example.com",
  "flightDetails": {
    "origin": "DFW",
    "destination": "LAX",
    "date": "2024-06-15"
  },
  "cartTotal": 450.00,
  "timeOnPage": 120,
  "pageUrl": "https://example.com/booking"
}
```

#### `POST /api/events/user`
Publish a generic user event.

**Request Body:**
```json
{
  "eventType": "page_view",
  "sessionId": "uuid-v4",
  "userId": "user123",
  "userEmail": "user@example.com",
  "data": {
    "page": "/flights",
    "referrer": "https://google.com"
  }
}
```

### Admin API

#### `GET /api/admin/status`
Get system status including Salesforce and Kafka connection state.

#### `POST /api/admin/enable`
Enable Salesforce event publishing.

#### `POST /api/admin/disable`
Disable Salesforce event publishing (events will be skipped).

#### `GET /api/admin/events/stats`
Get event statistics (success rate, counts, average duration).

#### `GET /api/admin/events?status=success&type=Flight_Booking__e&limit=100`
Get filtered event logs.

#### `POST /api/admin/events/clear`
Clear all event logs.

#### `POST /api/admin/generate-bookings?count=500`
Generate synthetic booking events for testing (batched with rate limiting).

## Admin Dashboard

Access the admin dashboard at `/admin` for real-time event monitoring.

**Features:**
- Live event stream with auto-refresh
- Service status (enabled/disabled)
- Event statistics dashboard
- Success/failure tracking
- Event filtering by type and status
- Detailed event inspection
- Synthetic data generation
- Event log management

**UI Components:**
- Status badge (enabled/disabled)
- Statistics cards (total, success, failed, skipped, success rate, avg duration)
- Service control buttons (enable, disable, refresh, clear)
- Synthetic booking generator
- Event table with real-time updates
- Modal for detailed event inspection

## Event Schemas

### Salesforce Platform Event: Flight_Booking__e

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `Booking_Reference__c` | String | Yes | Unique booking identifier |
| `Passenger_Name__c` | String | Yes | Full name of passenger |
| `Passenger_Email__c` | String | Yes | Contact email |
| `Flight_Number__c` | String | Yes | Flight identifier (e.g., AA1234) |
| `Origin__c` | String | Yes | Origin airport code |
| `Destination__c` | String | Yes | Destination airport code |
| `Departure_Date__c` | Date | Yes | Departure date (YYYY-MM-DD) |
| `Cabin_Class__c` | String | No | economy, premium_economy, business, first |
| `Total_Amount__c` | Number | No | Total booking cost |
| `Seat_Numbers__c` | String | No | Assigned seat numbers |
| `Booking_Status__c` | String | Yes | Confirmed, Pending, Cancelled |

### Salesforce Platform Event: Flight_Search__e

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `Session_Id__c` | String | Yes | User session identifier |
| `Origin__c` | String | Yes | Origin airport code |
| `Destination__c` | String | Yes | Destination airport code |
| `Departure_Date__c` | Date | Yes | Departure date |
| `Return_Date__c` | Date | No | Return date (for roundtrip) |
| `Passengers__c` | Number | Yes | Number of passengers |
| `Trip_Type__c` | String | Yes | oneway, roundtrip |
| `Cabin_Class__c` | String | No | Cabin preference |
| `User_Email__c` | String | No | User email if authenticated |

### Salesforce Platform Event: Abandoned_Cart__e

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `Session_Id__c` | String | Yes | Session identifier |
| `User_Email__c` | String | Yes | User email |
| `Flight_Details__c` | String (JSON) | No | Serialized flight details |
| `Cart_Total__c` | Number | No | Total cart value |
| `Time_On_Page__c` | Number | No | Time spent (seconds) |
| `Page_URL__c` | String | No | Page where abandonment occurred |

## Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Kafka Configuration (Heroku Kafka)
KAFKA_URL=kafka+ssl://broker1:9096,kafka+ssl://broker2:9096
KAFKA_PREFIX=your-kafka-prefix-
KAFKA_CLIENT_CERT=-----BEGIN CERTIFICATE-----...
KAFKA_CLIENT_CERT_KEY=-----BEGIN PRIVATE KEY-----...
KAFKA_TRUSTED_CERT=-----BEGIN CERTIFICATE-----...

# Local Kafka (for development)
KAFKA_BROKERS=localhost:9092

# Salesforce OAuth Configuration
SALESFORCE_LOGIN_URL=https://login.salesforce.com
SALESFORCE_CLIENT_ID=your_connected_app_client_id
SALESFORCE_CLIENT_SECRET=your_connected_app_client_secret

# Salesforce Settings
SALESFORCE_PUBSUB_ENABLED=true  # Enable/disable at startup
SALESFORCE_USE_GRPC=true         # Use gRPC (true) or REST (false)
```

### Salesforce Setup

1. **Create Platform Events in Salesforce:**
   - Navigate to Setup → Platform Events → New Platform Event
   - Create `Flight_Booking__e`, `Flight_Search__e`, `Abandoned_Cart__e`
   - Add custom fields as defined in Event Schemas section

2. **Create Connected App:**
   - Setup → App Manager → New Connected App
   - Enable OAuth Settings
   - Enable "Client Credentials Flow"
   - Add Scopes: `api`, `cdp_profile_api`, `cdp_ingest_api`
   - Note the Consumer Key (Client ID) and Consumer Secret

3. **Configure Pub/Sub API Access:**
   - Ensure your Salesforce org has API access enabled
   - Verify Platform Event limits (see quotas)

### Kafka Setup

**Heroku Kafka:**
```bash
heroku addons:create heroku-kafka:basic-0
heroku kafka:topics:create flight-bookings
heroku kafka:topics:create flight-searches
heroku kafka:topics:create abandoned-carts
heroku kafka:topics:create user-events
```

**Local Kafka (Docker):**
```bash
docker run -d --name kafka \
  -p 9092:9092 \
  -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
  confluentinc/cp-kafka:latest
```

## Installation

```bash
# Install dependencies
npm install

# Required packages
npm install express dotenv uuid kafkajs salesforce-pubsub-api-client

# Create .env file with your credentials
cp .env.example .env
```

## Usage

### Start the Server

```bash
# Development
npm start

# Production
NODE_ENV=production npm start
```

### Start Event Bridge (Kafka → Salesforce)

Create a separate process (`bridge.js`):

```javascript
const eventBridge = require('./services/eventBridge');

(async () => {
  try {
    await eventBridge.start();
    console.log('Event bridge is running');
  } catch (error) {
    console.error('Failed to start event bridge:', error);
    process.exit(1);
  }
})();
```

Run it:
```bash
node bridge.js
```

### Publishing Events from React App

```javascript
// Example: Publishing a search event
const publishSearch = async (searchData) => {
  await fetch('/api/events/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: getSessionId(),
      origin: searchData.from,
      destination: searchData.to,
      departureDate: searchData.departure,
      returnDate: searchData.return,
      passengers: searchData.passengers,
      tripType: searchData.tripType,
      cabinClass: searchData.class
    })
  });
};

// Example: Publishing a booking event
const publishBooking = async (booking) => {
  await fetch('/api/events/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bookingReference: booking.reference,
      passengerName: booking.name,
      passengerEmail: booking.email,
      flightNumber: booking.flightNumber,
      origin: booking.origin,
      destination: booking.destination,
      departureDate: booking.date,
      cabinClass: booking.class,
      totalAmount: booking.total,
      seatNumbers: booking.seats,
      status: 'Confirmed'
    })
  });
};
```

## Monitoring and Observability

### Event Logging

All events are logged with:
- Unique event ID
- Timestamp
- Event type
- Payload
- Status (pending, success, failed, skipped)
- Salesforce response (replayId, correlationKey)
- Duration (ms)
- Error messages (if failed)

### Admin Dashboard

Monitor in real-time at `http://localhost:3000/admin`:
- Total events processed
- Success/failure rates
- Average processing time
- Recent events with filtering
- Service status and controls

### Console Logging

The system provides detailed console logs:
```
[Kafka] Message published: { topic: 'flight-bookings', partition: 0 }
[SF PubSub] Booking event published: { replayId: 12345678, success: true }
[EventBridge] Booking event forwarded to Salesforce
```

## Testing

### Generate Synthetic Data

Use the admin dashboard to generate test bookings:

1. Navigate to `/admin`
2. Click "Generate 500 Bookings"
3. Enter desired count
4. Monitor progress and results

Or use the API:
```bash
curl -X POST http://localhost:3000/api/admin/generate-bookings?count=100
```

### Manual Testing

```bash
# Test search event
curl -X POST http://localhost:3000/api/events/search \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "DFW",
    "destination": "LAX",
    "departureDate": "2024-06-15",
    "passengers": 1,
    "tripType": "oneway"
  }'

# Test booking event
curl -X POST http://localhost:3000/api/events/booking \
  -H "Content-Type: application/json" \
  -d '{
    "passengerName": "Test User",
    "passengerEmail": "test@example.com",
    "flightNumber": "AA1234",
    "origin": "DFW",
    "destination": "LAX",
    "departureDate": "2024-06-15",
    "totalAmount": 450
  }'
```

## Performance Considerations

### Batching

The synthetic booking generator processes events in batches of 10 with 500ms delays to avoid overwhelming Salesforce API limits.

### Rate Limits

**Salesforce Platform Events:**
- 250,000 events/day (standard edition)
- 1,000,000+ events/day (enterprise/unlimited)
- 2,000 API calls/hour per user

**Kafka:**
- Depends on your Heroku Kafka plan
- Basic-0: 10 topics, 10 MB/s throughput

### Scalability

- Event logger stores last 1000 events in memory (consider Redis/database for production)
- Kafka provides horizontal scalability through partitions
- Multiple event bridge instances can be deployed for high availability

## Error Handling

### Retry Logic

- Kafka producer automatically retries failed publishes
- Salesforce OAuth tokens are automatically refreshed on 401 errors
- Event bridge logs failures but continues processing

### Graceful Shutdown

```javascript
process.on('SIGTERM', async () => {
  await kafkaService.disconnect();
  await salesforcePubSub.disconnect();
  process.exit(0);
});
```

## Security

### Authentication

- Salesforce: OAuth 2.0 Client Credentials Flow
- Kafka: SSL/TLS with client certificates (Heroku)
- Admin Dashboard: No authentication (add auth middleware for production)

### Best Practices

- Store credentials in environment variables (never commit .env)
- Use SSL/TLS for all external communications
- Rotate OAuth credentials regularly
- Implement rate limiting on API endpoints
- Add authentication to admin dashboard before production deployment

## Troubleshooting

### Kafka Connection Issues

```
Error: Failed to connect to Kafka
```
**Solution:** Verify `KAFKA_URL` and certificate environment variables are set correctly.

### Salesforce Authentication Failures

```
Error: Token refresh failed: 401
```
**Solution:** Verify Connected App credentials and ensure Client Credentials Flow is enabled.

### Events Not Appearing in Salesforce

**Checklist:**
1. Verify Platform Events exist with correct API names
2. Check service is enabled: `/api/admin/status`
3. Review event logs in admin dashboard
4. Confirm user has API access and Platform Event publish permissions
5. Check Salesforce debug logs for event processing errors

### Avro Schema Errors

```
Error: Required field CreatedById is missing
```
**Solution:** Ensure Salesforce user ID is fetched and cached (happens automatically on connect).

## Deployment

### Heroku Deployment

```bash
# Create app
heroku create your-app-name

# Add Kafka
heroku addons:create heroku-kafka:basic-0

# Set environment variables
heroku config:set SALESFORCE_CLIENT_ID=your_id
heroku config:set SALESFORCE_CLIENT_SECRET=your_secret
heroku config:set SALESFORCE_PUBSUB_ENABLED=true

# Deploy
git push heroku main

# Scale up
heroku ps:scale web=1 worker=1
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

## Architecture Decisions

### Why gRPC Pub/Sub API?

- Higher throughput than REST API
- Bi-directional streaming for subscriptions
- Avro schema ensures type safety
- Better for high-volume event publishing

### Why Kafka?

- Durable message queue with replay capability
- Horizontal scalability through partitions
- Decouples event producers from consumers
- Enables multiple downstream integrations

### Why Event Bridge?

- Separates concerns (web server vs. event processing)
- Enables independent scaling
- Provides retry logic and error handling
- Allows offline processing and batch operations

## Future Enhancements

- [ ] Add Redis for distributed event logging
- [ ] Implement dead letter queue for failed events
- [ ] Add Prometheus metrics and Grafana dashboards
- [ ] Implement event replay from Salesforce
- [ ] Add webhook support for event subscriptions
- [ ] Build React component library for event tracking
- [ ] Add authentication to admin dashboard
- [ ] Implement rate limiting middleware
- [ ] Add event schema validation
- [ ] Support for Change Data Capture events

## License

MIT

## Contributors

Built for the American Airlines demo site - Salesforce Marketing Cloud Personalization integration.
