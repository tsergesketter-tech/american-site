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
const eventLogger = require('./services/eventLogger');

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
 *
 * Publishes directly to Salesforce (for logging) and optionally to Kafka
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

    // Publish directly to Salesforce (logs to admin dashboard)
    let sfResult = null;
    try {
      sfResult = await salesforcePubSub.publishBookingEvent(bookingData);
    } catch (sfError) {
      console.error('Salesforce publish error:', sfError.message);
    }

    // Also publish to Kafka (for worker processing if needed)
    try {
      await kafkaService.publish(TOPICS.FLIGHT_BOOKINGS, bookingData, bookingData.bookingReference);
    } catch (kafkaError) {
      console.error('Kafka publish error:', kafkaError.message);
    }

    res.json({
      success: true,
      message: 'Booking event published',
      bookingReference: bookingData.bookingReference,
      salesforce: sfResult
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

/**
 * Get event log statistics
 * GET /api/admin/events/stats
 */
app.get('/api/admin/events/stats', adminAuth, (req, res) => {
  res.json(eventLogger.getStats());
});

/**
 * Get event logs
 * GET /api/admin/events
 */
app.get('/api/admin/events', adminAuth, (req, res) => {
  const options = {
    status: req.query.status,
    type: req.query.type,
    limit: parseInt(req.query.limit) || 100
  };
  res.json(eventLogger.getEvents(options));
});

/**
 * Get single event by ID
 * GET /api/admin/events/:id
 */
app.get('/api/admin/events/:id', adminAuth, (req, res) => {
  const event = eventLogger.getEvent(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json(event);
});

/**
 * Clear event logs
 * POST /api/admin/events/clear
 */
app.post('/api/admin/events/clear', adminAuth, (req, res) => {
  const result = eventLogger.clear();
  res.json({ message: 'Event logs cleared', ...result });
});

/**
 * Admin Dashboard UI
 * GET /admin
 */
app.get('/admin', (req, res) => {
  res.send(getAdminDashboardHtml());
});

function getAdminDashboardHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Salesforce Event Monitor</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1a1a2e; color: #eee; min-height: 100vh; }
    .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
    h1 { color: #00d4ff; margin-bottom: 20px; }
    .auth-form { background: #16213e; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .auth-form input { padding: 10px; border: none; border-radius: 4px; margin-right: 10px; width: 300px; }
    .auth-form button { padding: 10px 20px; background: #00d4ff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px; }
    .stat-card { background: #16213e; padding: 20px; border-radius: 8px; text-align: center; }
    .stat-card .value { font-size: 2em; font-weight: bold; color: #00d4ff; }
    .stat-card .label { color: #888; margin-top: 5px; }
    .stat-card.success .value { color: #00ff88; }
    .stat-card.failed .value { color: #ff4757; }
    .stat-card.skipped .value { color: #ffa502; }
    .controls { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
    .controls button { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .btn-enable { background: #00ff88; color: #000; }
    .btn-disable { background: #ff4757; color: #fff; }
    .btn-refresh { background: #00d4ff; color: #000; }
    .btn-clear { background: #666; color: #fff; }
    .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
    .status-enabled { background: #00ff88; color: #000; }
    .status-disabled { background: #ff4757; color: #fff; }
    .events-table { width: 100%; border-collapse: collapse; background: #16213e; border-radius: 8px; overflow: hidden; }
    .events-table th, .events-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #2a2a4a; }
    .events-table th { background: #0f3460; color: #00d4ff; }
    .events-table tr:hover { background: #1f3a60; }
    .status-success { color: #00ff88; }
    .status-failed { color: #ff4757; }
    .status-pending { color: #ffa502; }
    .status-skipped { color: #888; }
    .payload-preview { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.85em; color: #888; }
    .filters { display: flex; gap: 10px; margin-bottom: 15px; }
    .filters select { padding: 8px; border-radius: 4px; border: none; background: #16213e; color: #eee; }
    .hidden { display: none; }
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: #16213e; padding: 20px; border-radius: 8px; max-width: 800px; max-height: 80vh; overflow: auto; width: 90%; }
    .modal-content pre { background: #0f3460; padding: 15px; border-radius: 4px; overflow: auto; font-size: 0.85em; }
    .modal-close { float: right; background: #ff4757; border: none; color: #fff; padding: 5px 15px; border-radius: 4px; cursor: pointer; }
    .auto-refresh { display: flex; align-items: center; gap: 10px; }
    .auto-refresh input { width: 20px; height: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚡ Salesforce Event Monitor</h1>

    <div class="auth-form" id="authForm">
      <input type="password" id="apiKey" placeholder="Enter Admin API Key">
      <button onclick="authenticate()">Connect</button>
    </div>

    <div id="dashboard" class="hidden">
      <div class="controls">
        <span class="status-badge" id="serviceStatus">-</span>
        <button class="btn-enable" onclick="enableService()">Enable Service</button>
        <button class="btn-disable" onclick="disableService()">Disable Service</button>
        <button class="btn-refresh" onclick="refresh()">↻ Refresh</button>
        <button class="btn-clear" onclick="clearLogs()">Clear Logs</button>
        <div class="auto-refresh">
          <input type="checkbox" id="autoRefresh" onchange="toggleAutoRefresh()">
          <label for="autoRefresh">Auto-refresh (5s)</label>
        </div>
      </div>

      <div class="stats" id="stats"></div>

      <div class="filters">
        <select id="filterStatus" onchange="refresh()">
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
          <option value="skipped">Skipped</option>
        </select>
        <select id="filterType" onchange="refresh()">
          <option value="">All Types</option>
          <option value="Flight_Booking__e">Booking</option>
          <option value="Flight_Search__e">Search</option>
          <option value="Abandoned_Cart__e">Abandoned Cart</option>
        </select>
      </div>

      <table class="events-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Type</th>
            <th>Status</th>
            <th>Replay ID</th>
            <th>Duration</th>
            <th>Payload</th>
          </tr>
        </thead>
        <tbody id="eventsBody"></tbody>
      </table>
    </div>
  </div>

  <div id="modal" class="modal hidden" onclick="closeModal(event)">
    <div class="modal-content" onclick="event.stopPropagation()">
      <button class="modal-close" onclick="closeModal()">Close</button>
      <h3 id="modalTitle">Event Details</h3>
      <pre id="modalContent"></pre>
    </div>
  </div>

  <script>
    let apiKey = localStorage.getItem('adminApiKey') || '';
    let autoRefreshInterval = null;

    if (apiKey) {
      document.getElementById('apiKey').value = apiKey;
      authenticate();
    }

    function authenticate() {
      apiKey = document.getElementById('apiKey').value;
      localStorage.setItem('adminApiKey', apiKey);
      document.getElementById('authForm').classList.add('hidden');
      document.getElementById('dashboard').classList.remove('hidden');
      refresh();
    }

    async function fetchApi(endpoint, method = 'GET') {
      const res = await fetch('/api/admin/' + endpoint + '?key=' + encodeURIComponent(apiKey), { method });
      if (res.status === 401) {
        alert('Invalid API key');
        localStorage.removeItem('adminApiKey');
        location.reload();
        return null;
      }
      return res.json();
    }

    async function refresh() {
      const status = await fetchApi('status');
      if (!status) return;

      const statusEl = document.getElementById('serviceStatus');
      statusEl.textContent = status.enabled ? 'ENABLED' : 'DISABLED';
      statusEl.className = 'status-badge ' + (status.enabled ? 'status-enabled' : 'status-disabled');

      const stats = await fetchApi('events/stats');
      document.getElementById('stats').innerHTML = \`
        <div class="stat-card"><div class="value">\${stats.total}</div><div class="label">Total Events</div></div>
        <div class="stat-card success"><div class="value">\${stats.success}</div><div class="label">Success</div></div>
        <div class="stat-card failed"><div class="value">\${stats.failed}</div><div class="label">Failed</div></div>
        <div class="stat-card skipped"><div class="value">\${stats.skipped}</div><div class="label">Skipped</div></div>
        <div class="stat-card"><div class="value">\${stats.successRate}</div><div class="label">Success Rate</div></div>
        <div class="stat-card"><div class="value">\${stats.avgDuration}</div><div class="label">Avg Duration</div></div>
      \`;

      const filterStatus = document.getElementById('filterStatus').value;
      const filterType = document.getElementById('filterType').value;
      let url = 'events?limit=100';
      if (filterStatus) url += '&status=' + filterStatus;
      if (filterType) url += '&type=' + filterType;

      const events = await fetchApi(url);
      const tbody = document.getElementById('eventsBody');
      tbody.innerHTML = events.map(e => \`
        <tr onclick="showEvent('\${e.id}')" style="cursor:pointer">
          <td>\${new Date(e.timestamp).toLocaleString()}</td>
          <td>\${e.type.replace('__e', '')}</td>
          <td class="status-\${e.status}">\${e.status.toUpperCase()}</td>
          <td>\${e.salesforceResponse?.replayId || '-'}</td>
          <td>\${e.duration ? e.duration + 'ms' : '-'}</td>
          <td class="payload-preview">\${JSON.stringify(e.payload)}</td>
        </tr>
      \`).join('');
    }

    async function showEvent(id) {
      const event = await fetchApi('events/' + id);
      document.getElementById('modalTitle').textContent = 'Event: ' + event.id;
      document.getElementById('modalContent').textContent = JSON.stringify(event, null, 2);
      document.getElementById('modal').classList.remove('hidden');
    }

    function closeModal(e) {
      if (!e || e.target.id === 'modal') {
        document.getElementById('modal').classList.add('hidden');
      }
    }

    async function enableService() {
      await fetchApi('enable', 'POST');
      refresh();
    }

    async function disableService() {
      await fetchApi('disable', 'POST');
      refresh();
    }

    async function clearLogs() {
      if (confirm('Clear all event logs?')) {
        await fetchApi('events/clear', 'POST');
        refresh();
      }
    }

    function toggleAutoRefresh() {
      if (document.getElementById('autoRefresh').checked) {
        autoRefreshInterval = setInterval(refresh, 5000);
      } else {
        clearInterval(autoRefreshInterval);
      }
    }

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  </script>
</body>
</html>`;
}

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

// Initialize services on startup
async function startServer() {
  try {
    // Initialize Kafka (don't connect producer until first publish)
    kafkaService.initialize();
    console.log('[Server] Kafka initialized');

    // Connect to Salesforce for direct publishing
    try {
      await salesforcePubSub.connect();
      console.log('[Server] Salesforce PubSub connected');
    } catch (sfError) {
      console.error('[Server] Salesforce connection failed (will retry on first publish):', sfError.message);
    }

    app.listen(port, () => {
      console.log(`[Server] Server is running on port ${port}`);
      console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[Server] Salesforce PubSub enabled: ${salesforcePubSub.isEnabled()}`);
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
  await salesforcePubSub.disconnect();
  process.exit(0);
});

startServer();
