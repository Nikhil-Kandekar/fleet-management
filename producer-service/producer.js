const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const kafka = require('kafka-node');

// InfluxDB Configuration
const influxUrl = process.env.INFLUXDB_URL || 'http://telemetry-influxdb:8086';
const influxToken = process.env.INFLUXDB_TOKEN || 'q6dzJRQWDpdaA62ZuPhcWOlmIongnzO9wvB8ZQodBE2_iWfAuLFAf2LTFakt925wR1F5Yt5sWek5DrOFxslc9g==';
const influxOrg = process.env.INFLUXDB_ORG || 'telemetry_org';
const influxBucket = process.env.INFLUXDB_BUCKET || 'telemetry_bucket';

const influxDB = new InfluxDB({ url: influxUrl, token: influxToken });

// Kafka Configuration
const kafkaClient = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });

const producer = new kafka.Producer(kafkaClient);


const retryInterval = 5000; // 5 seconds
const maxRetries = 10;
let retryCount = 0;

function connectKafkaProducer() {
  if (retryCount >= maxRetries) {
    console.error('Max retries reached, could not connect to Kafka');
    return;
  }

  producer.on('ready', () => {
    console.log('Producer is ready and connected to Kafka');
    
    setInterval(() => {
      const message = JSON.stringify({
        vehicleId: 'vehicle_123',
        speed: Math.random() * 100,
        fuel: Math.random() * 100,
        latitude: 37.7749 + Math.random() * 0.01,
        longitude: -122.4194 + Math.random() * 0.01,
        timestamp: new Date().toISOString(),
      });

      producer.send([{ topic: 'vehicle-telemetry', messages: message }], (err, data) => {
        if (err) {
          console.error('Error sending data:', err);
        } else {
          console.log('Telemetry data sent:', data);
        }
      });
    }, 3000);
  });

  producer.on('error', (err) => {
    console.error('Producer error:', err);
    console.log('Retrying to connect...');
    retryCount += 1;
    setTimeout(connectKafkaProducer, retryInterval);
  });
}

connectKafkaProducer();

