/**
 * American Airlines Clone - Express Server
 * With Kafka event publishing endpoints
 */

require('dotenv').config();

const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { kafkaService, TOPICS } = require('./services/kafkaService');
const salesforcePubSub = require('./services/salesforcePubSub');

const app = express();

// Admin API key for control panel (set via environment variable)
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'changeme';

// Simple auth middleware for admin routes
const adminAuth = (req, res, next) => {
  const apiKey = req.headers['x-admin-key'] || req.query.key;
  if (apiKey !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized - Invalid admin key' });
  }
  next();
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
}

// ============================================
// API Routes for Event Publishing
// ============================================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    kafka: kafkaService.isProducerConnected ? 'connected' : 'disconnected'
  });
});

/**
 * Publish flight search event
 * POST /api/events/search
 */
app.post('/api/events/search', async (req, res) => {
  try {
    const searchData = {
      sessionId: req.body.sessionId || uuidv4(),
      origin: req.body.origin,
      destination: req.body.destination,
      departureDate: req.body.departureDate,
      returnDate: req.body.returnDate || null,
      passengers: req.body.passengers || 1,
      tripType: req.body.tripType || 'roundtrip',
      cabinClass: req.body.cabinClass || 'economy',
      userEmail: req.body.userEmail || null,
      timestamp: new Date().toISOString()
    };

    await kafkaService.publish(TOPICS.FLIGHT_SEARCHES, searchData, searchData.sessionId);

    res.json({
      success: true,
      message: 'Search event published',
      sessionId: searchData.sessionId
    });
  } catch (error) {
    console.error('Failed to publish search event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish search event',
      message: error.message
    });
  }
});

/**
 * Publish flight booking event
 * POST /api/events/booking
 */
app.post('/api/events/booking', async (req, res) => {
  try {
    const bookingData = {
      bookingReference: req.body.bookingReference || `AA${Date.now().toString(36).toUpperCase()}`,
      passengerName: req.body.passengerName,
      passengerEmail: req.body.passengerEmail,
      flightNumber: req.body.flightNumber,
      origin: req.body.origin,
      destination: req.body.destination,
      departureDate: req.body.departureDate,
      cabinClass: req.body.cabinClass || 'economy',
      totalAmount: req.body.totalAmount || 0,
      seatNumbers: req.body.seatNumbers || '',
      status: req.body.status || 'Confirmed',
      timestamp: new Date().toISOString()
    };

    await kafkaService.publish(TOPICS.FLIGHT_BOOKINGS, bookingData, bookingData.bookingReference);

    res.json({
      success: true,
      message: 'Booking event published',
      bookingReference: bookingData.bookingReference
    });
  } catch (error) {
    console.error('Failed to publish booking event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish booking event',
      message: error.message
    });
  }
});

/**
 * Publish abandoned cart event
 * POST /api/events/abandoned-cart
 */
app.post('/api/events/abandoned-cart', async (req, res) => {
  try {
    const cartData = {
      sessionId: req.body.sessionId || uuidv4(),
      userEmail: req.body.userEmail,
      flightDetails: req.body.flightDetails || {},
      cartTotal: req.body.cartTotal || 0,
      timeOnPage: req.body.timeOnPage || 0,
      pageUrl: req.body.pageUrl || '',
      timestamp: new Date().toISOString()
    };

    await kafkaService.publish(TOPICS.ABANDONED_CARTS, cartData, cartData.sessionId);

    res.json({
      success: true,
      message: 'Abandoned cart event published',
      sessionId: cartData.sessionId
    });
  } catch (error) {
    console.error('Failed to publish abandoned cart event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish abandoned cart event',
      message: error.message
    });
  }
});

/**
 * Publish generic user event
 * POST /api/events/user
 */
app.post('/api/events/user', async (req, res) => {
  try {
    const eventData = {
      eventId: uuidv4(),
      eventType: req.body.eventType,
      sessionId: req.body.sessionId,
      userId: req.body.userId || null,
      userEmail: req.body.userEmail || null,
      data: req.body.data || {},
      timestamp: new Date().toISOString()
    };

    await kafkaService.publish(TOPICS.USER_EVENTS, eventData, eventData.eventId);

    res.json({
      success: true,
      message: 'User event published',
      eventId: eventData.eventId
    });
  } catch (error) {
    console.error('Failed to publish user event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish user event',
      message: error.message
    });
  }
});

// ============================================
// Admin Control Panel Routes
// ============================================

/**
 * Get Salesforce PubSub service status
 * GET /api/admin/status
 */
app.get('/api/admin/status', adminAuth, (req, res) => {
  res.json({
    service: 'salesforce-pubsub',
    ...salesforcePubSub.getStatus(),
    kafka: {
      producerConnected: kafkaService.isProducerConnected
    }
  });
});

/**
 * Enable Salesforce PubSub service
 * POST /api/admin/enable
 */
app.post('/api/admin/enable', adminAuth, (req, res) => {
  const result = salesforcePubSub.enable();
  res.json({
    message: 'Salesforce PubSub service ENABLED',
    ...result
  });
});

/**
 * Disable Salesforce PubSub service
 * POST /api/admin/disable
 */
app.post('/api/admin/disable', adminAuth, (req, res) => {
  const result = salesforcePubSub.disable();
  res.json({
    message: 'Salesforce PubSub service DISABLED',
    ...result
  });
});

// ============================================
// Static Files & React App
// ============================================

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ============================================
// Server Startup
// ============================================

const port = process.env.PORT || 3000;

// Initialize Kafka on startup
async function startServer() {
  try {
    // Initialize Kafka (don't connect producer until first publish)
    kafkaService.initialize();
    console.log('[Server] Kafka initialized');

    app.listen(port, () => {
      console.log(`[Server] Server is running on port ${port}`);
      console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Server] SIGTERM received, shutting down...');
  await kafkaService.disconnect();
  process.exit(0);
});

startServer();
