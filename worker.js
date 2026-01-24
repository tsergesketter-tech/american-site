/**
 * Kafka Consumer Worker
 * Runs as a separate Heroku dyno to process Kafka messages
 * and forward them to Salesforce Platform Events
 */

require('dotenv').config();

const eventBridge = require('./services/eventBridge');

// Graceful shutdown handler
const shutdown = async (signal) => {
  console.log(`\n[Worker] Received ${signal}, shutting down gracefully...`);
  try {
    await eventBridge.stop();
    console.log('[Worker] Shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('[Worker] Error during shutdown:', error.message);
    process.exit(1);
  }
};

// Handle termination signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('[Worker] Uncaught exception:', error);
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Worker] Unhandled rejection at:', promise, 'reason:', reason);
});

// Main worker function
async function main() {
  console.log('[Worker] Starting Kafka-Salesforce Event Bridge Worker...');
  console.log('[Worker] Environment:', process.env.NODE_ENV || 'development');

  try {
    await eventBridge.start();
    console.log('[Worker] Worker is running. Press Ctrl+C to stop.');

    // Keep the process alive
    setInterval(() => {
      console.log('[Worker] Heartbeat - worker is alive');
    }, 60000); // Log every minute

  } catch (error) {
    console.error('[Worker] Failed to start worker:', error.message);
    process.exit(1);
  }
}

// Start the worker
main();
