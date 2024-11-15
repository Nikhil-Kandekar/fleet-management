const express = require('express');
const kafka = require('kafka-node');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const app = express();
const PORT = 6000;

// InfluxDB setup
const token = 'q6dzJRQWDpdaA62ZuPhcWOlmIongnzO9wvB8ZQodBE2_iWfAuLFAf2LTFakt925wR1F5Yt5sWek5DrOFxslc9g==';
const org = 'telemetry_org';
const bucket = 'telemetry_bucket';
const influx = new InfluxDB({ url: 'http://telemetry-influxdb:8086', token: token });
const writeApi = influx.getWriteApi(org, bucket);

// Kafka Consumer setup
const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const consumer = new kafka.Consumer(
  client,
  [{ topic: 'vehicle-telemetry', partition: 0 }],
  { autoCommit: true }
);

// Handle incoming messages from Kafka
consumer.on('message', (message) => {
  try {
    const telemetryData = JSON.parse(message.value);
    const { vehicleId, speed, fuel, latitude, longitude, timestamp } = telemetryData;

    // Write telemetry data to InfluxDB
    const telemetryPoint = new Point('vehicle_telemetry')
      .tag('vehicleId', vehicleId)
      .floatField('speed', speed)
      .floatField('fuel', fuel)
      .floatField('latitude', latitude)
      .floatField('longitude', longitude)
      .timestamp(new Date(timestamp));

    writeApi.writePoint(telemetryPoint);
    console.log('Telemetry data written to InfluxDB:', telemetryData);

    // Analyze telemetry data and create notifications
    if (speed > 80) {
      createNotification(vehicleId, 'High Speed Alert', `Speed exceeded 80 km/h. Current speed: ${speed} km/h`, timestamp);
    }

    if (speed === 0 && fuel < 10) {
      createNotification(vehicleId, 'Low Fuel Alert', `Vehicle stopped with low fuel: ${fuel}% remaining`, timestamp);
    }

  } catch (error) {
    console.error('Error processing telemetry data:', error);
  }
});

// Function to create and write notifications to InfluxDB
function createNotification(vehicleId, title, message, timestamp) {
  const notificationPoint = new Point('vehicle_notifications')
    .tag('vehicleId', vehicleId)
    .stringField('title', title)
    .stringField('message', message)
    .timestamp(new Date(timestamp));

  writeApi.writePoint(notificationPoint);
  console.log('Notification written to InfluxDB:', { vehicleId, title, message });
}

consumer.on('error', (err) => {
  console.error('Error with Kafka consumer:', err);
});

// Express server for health check
app.get('/', (req, res) => {
  res.send('Telemetry Service is running');
});

app.listen(PORT, () => {
  console.log(`Telemetry Service is running on port ${PORT}`);
});

