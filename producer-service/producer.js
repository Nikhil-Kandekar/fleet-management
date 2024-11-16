const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const kafka = require('kafka-node');

// InfluxDB Configuration
const influxUrl = process.env.INFLUXDB_URL || 'http://telemetry-influxdb:8086';
const influxToken = process.env.INFLUXDB_TOKEN || '-5KEJgBrrp9TLocFBoIvlYjFPe41K5vCHuyAatlondgr4vCq7dIZkOnFhkQ-JC3VO9FOUgoFRNURb-1iO-1_cQ====';
const influxOrg = process.env.INFLUXDB_ORG || 'telemetry_org';
const influxBucket = process.env.INFLUXDB_BUCKET || 'telemetry_bucket';

const influxDB = new InfluxDB({ url: influxUrl, token: influxToken });

// Kafka Configuration
const kafkaClient = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const producer = new kafka.Producer(kafkaClient);

const retryInterval = 5000; // 5 seconds
const maxRetries = 10;
let retryCount = 0;

const vehicles = [
  { vehicleId: 'vehicle_001', baseLatitude: 37.7749, baseLongitude: -122.4194 },
  { vehicleId: 'vehicle_002', baseLatitude: 37.7849, baseLongitude: -122.4294 },
  { vehicleId: 'vehicle_003', baseLatitude: 37.7949, baseLongitude: -122.4394 },
  { vehicleId: 'vehicle_004', baseLatitude: 37.8049, baseLongitude: -122.4494 },
  { vehicleId: 'vehicle_005', baseLatitude: 37.8149, baseLongitude: -122.4594 },
];

function connectKafkaProducer() {
  if (retryCount >= maxRetries) {
    console.error('Max retries reached, could not connect to Kafka');
    return;
  }

  producer.on('ready', () => {
    console.log('Producer is ready and connected to Kafka');

    setInterval(() => {
      vehicles.forEach((vehicle) => {
        const { vehicleId, baseLatitude, baseLongitude } = vehicle;

        const message = JSON.stringify({
          vehicleId,
          speed: Math.random() * 100,
          fuel: Math.random() * 100,
          latitude: baseLatitude + Math.random() * 0.01,
          longitude: baseLongitude + Math.random() * 0.01,
          timestamp: new Date().toISOString(),
        });

        producer.send([{ topic: 'vehicle-telemetry', messages: message }], (err, data) => {
          if (err) {
            console.error('Error sending data:', err);
          } else {
            console.log(`Telemetry data sent for ${vehicleId}:`, data);
          }
        });
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
