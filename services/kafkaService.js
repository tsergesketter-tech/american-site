/**
 * Kafka Service for Heroku
 * Handles Kafka producer and consumer operations
 */

const { Kafka, logLevel } = require('kafkajs');
const fs = require('fs');

class KafkaService {
  constructor() {
    this.kafka = null;
    this.producer = null;
    this.consumer = null;
    this.isProducerConnected = false;
    this.isConsumerConnected = false;
    this.isConsumerRunning = false;
    this.messageHandlers = new Map(); // topic -> handler
  }

  /**
   * Initialize Kafka client with Heroku configuration
   */
  initialize() {
    const isHeroku = process.env.KAFKA_URL && process.env.KAFKA_CLIENT_CERT;

    if (isHeroku) {
      // Heroku Kafka with SSL/TLS
      const brokers = process.env.KAFKA_URL
        .replace(/kafka\+ssl:\/\//g, '')
        .split(',');

      // Write certificates to temp files (required by KafkaJS)
      const certPath = '/tmp/kafka-client-cert.pem';
      const keyPath = '/tmp/kafka-client-key.pem';
      const caPath = '/tmp/kafka-ca-cert.pem';

      fs.writeFileSync(certPath, process.env.KAFKA_CLIENT_CERT);
      fs.writeFileSync(keyPath, process.env.KAFKA_CLIENT_CERT_KEY);
      fs.writeFileSync(caPath, process.env.KAFKA_TRUSTED_CERT);

      this.kafka = new Kafka({
        clientId: 'american-site',
        brokers: brokers,
        ssl: {
          rejectUnauthorized: false,
          cert: fs.readFileSync(certPath, 'utf-8'),
          key: fs.readFileSync(keyPath, 'utf-8'),
          ca: fs.readFileSync(caPath, 'utf-8')
        },
        logLevel: logLevel.INFO
      });

      this.prefix = process.env.KAFKA_PREFIX || '';
      console.log('[Kafka] Initialized with Heroku configuration');
    } else {
      // Local development Kafka (no SSL)
      const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');

      this.kafka = new Kafka({
        clientId: 'american-site',
        brokers: brokers,
        logLevel: logLevel.INFO
      });

      this.prefix = '';
      console.log('[Kafka] Initialized for local development');
    }
  }

  /**
   * Get topic name with Heroku prefix
   */
  getTopicName(baseName) {
    return `${this.prefix}${baseName}`;
  }

  /**
   * Connect Kafka producer
   */
  async connectProducer() {
    if (!this.kafka) {
      this.initialize();
    }

    if (this.isProducerConnected) {
      return;
    }

    this.producer = this.kafka.producer();
    await this.producer.connect();
    this.isProducerConnected = true;
    console.log('[Kafka] Producer connected');
  }

  /**
   * Connect Kafka consumer
   */
  async connectConsumer(groupId) {
    if (!this.kafka) {
      this.initialize();
    }

    if (this.isConsumerConnected) {
      return;
    }

    const fullGroupId = this.getTopicName(groupId);
    this.consumer = this.kafka.consumer({ groupId: fullGroupId });
    await this.consumer.connect();
    this.isConsumerConnected = true;
    console.log(`[Kafka] Consumer connected with group: ${fullGroupId}`);
  }

  /**
   * Publish message to Kafka topic
   */
  async publish(topic, message, key = null) {
    if (!this.isProducerConnected) {
      await this.connectProducer();
    }

    const fullTopic = this.getTopicName(topic);
    const messageValue = typeof message === 'string' ? message : JSON.stringify(message);

    try {
      const result = await this.producer.send({
        topic: fullTopic,
        messages: [
          {
            key: key,
            value: messageValue,
            timestamp: Date.now().toString()
          }
        ]
      });

      console.log('[Kafka] Message published:', {
        topic: fullTopic,
        partition: result[0].partition,
        offset: result[0].baseOffset
      });

      return result;
    } catch (error) {
      console.error('[Kafka] Failed to publish:', error.message);
      throw error;
    }
  }

  /**
   * Subscribe to a Kafka topic (must be called before startConsumer)
   */
  async addSubscription(topic, messageHandler) {
    if (!this.isConsumerConnected) {
      await this.connectConsumer('salesforce-bridge');
    }

    if (this.isConsumerRunning) {
      throw new Error('Cannot add subscription while consumer is running');
    }

    const fullTopic = this.getTopicName(topic);

    await this.consumer.subscribe({
      topic: fullTopic,
      fromBeginning: false
    });

    this.messageHandlers.set(fullTopic, messageHandler);
    console.log(`[Kafka] Subscribed to topic: ${fullTopic}`);
  }

  /**
   * Start the consumer (call after all subscriptions are added)
   */
  async startConsumer() {
    if (this.isConsumerRunning) {
      console.log('[Kafka] Consumer already running');
      return;
    }

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();
        console.log('[Kafka] Message received:', {
          topic,
          partition,
          offset: message.offset
        });

        const handler = this.messageHandlers.get(topic);
        if (handler) {
          try {
            const parsedMessage = JSON.parse(value);
            await handler(parsedMessage, {
              topic,
              partition,
              offset: message.offset,
              timestamp: message.timestamp
            });
          } catch (error) {
            console.error('[Kafka] Error processing message:', error.message);
          }
        } else {
          console.warn(`[Kafka] No handler for topic: ${topic}`);
        }
      }
    });

    this.isConsumerRunning = true;
    console.log('[Kafka] Consumer started');
  }

  /**
   * Disconnect producer and consumer
   */
  async disconnect() {
    if (this.producer && this.isProducerConnected) {
      await this.producer.disconnect();
      this.isProducerConnected = false;
      console.log('[Kafka] Producer disconnected');
    }

    if (this.consumer && this.isConsumerConnected) {
      await this.consumer.disconnect();
      this.isConsumerConnected = false;
      this.isConsumerRunning = false;
      console.log('[Kafka] Consumer disconnected');
    }
  }
}

// Topic constants
const TOPICS = {
  FLIGHT_BOOKINGS: 'flight-bookings',
  FLIGHT_SEARCHES: 'flight-searches',
  ABANDONED_CARTS: 'abandoned-carts',
  USER_EVENTS: 'user-events'
};

// Export singleton and topics
module.exports = {
  kafkaService: new KafkaService(),
  TOPICS
};
