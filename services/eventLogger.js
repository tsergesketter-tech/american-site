/**
 * Event Logger Service
 * Tracks all outbound events and their Salesforce responses
 */

class EventLogger {
  constructor() {
    // In-memory storage (consider Redis/DB for production)
    this.events = [];
    this.maxEvents = 1000; // Keep last 1000 events
  }

  /**
   * Log an outbound event
   */
  logEvent(eventData) {
    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: eventData.type,
      topic: eventData.topic,
      payload: eventData.payload,
      source: eventData.source || 'kafka',
      status: 'pending',
      salesforceResponse: null,
      error: null,
      duration: null
    };

    this.events.unshift(event);

    // Trim to max size
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    return event.id;
  }

  /**
   * Update event with Salesforce response
   */
  updateEvent(eventId, response) {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.status = response.success ? 'success' : 'failed';
      event.salesforceResponse = {
        replayId: response.replayId,
        correlationKey: response.correlationKey,
        id: response.id,
        success: response.success
      };
      event.completedAt = new Date().toISOString();
      event.duration = new Date(event.completedAt) - new Date(event.timestamp);
    }
    return event;
  }

  /**
   * Mark event as failed
   */
  failEvent(eventId, error) {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.status = 'failed';
      event.error = error.message || String(error);
      event.completedAt = new Date().toISOString();
      event.duration = new Date(event.completedAt) - new Date(event.timestamp);
    }
    return event;
  }

  /**
   * Mark event as skipped (service disabled)
   */
  skipEvent(eventId, reason) {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.status = 'skipped';
      event.error = reason;
      event.completedAt = new Date().toISOString();
      event.duration = 0;
    }
    return event;
  }

  /**
   * Get all events with optional filtering
   */
  getEvents(options = {}) {
    let filtered = [...this.events];

    if (options.status) {
      filtered = filtered.filter(e => e.status === options.status);
    }

    if (options.type) {
      filtered = filtered.filter(e => e.type === options.type);
    }

    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  /**
   * Get event by ID
   */
  getEvent(eventId) {
    return this.events.find(e => e.id === eventId);
  }

  /**
   * Get summary statistics
   */
  getStats() {
    const total = this.events.length;
    const success = this.events.filter(e => e.status === 'success').length;
    const failed = this.events.filter(e => e.status === 'failed').length;
    const pending = this.events.filter(e => e.status === 'pending').length;
    const skipped = this.events.filter(e => e.status === 'skipped').length;

    const byType = {};
    this.events.forEach(e => {
      byType[e.type] = (byType[e.type] || 0) + 1;
    });

    const avgDuration = this.events
      .filter(e => e.duration)
      .reduce((acc, e, _, arr) => acc + e.duration / arr.length, 0);

    return {
      total,
      success,
      failed,
      pending,
      skipped,
      successRate: total > 0 ? ((success / total) * 100).toFixed(1) + '%' : '0%',
      byType,
      avgDuration: Math.round(avgDuration) + 'ms'
    };
  }

  /**
   * Clear all events
   */
  clear() {
    this.events = [];
    return { cleared: true };
  }
}

module.exports = new EventLogger();
