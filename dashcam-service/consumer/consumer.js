// consumer.js
const fs = require('fs');
const kafka = require('kafka-node');
const path = require('path');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

// Environment variables for InfluxDB
const INFLUXDB_URL = process.env.INFLUXDB_URL || 'http://telemetry-influxdb:8086';
const INFLUXDB_TOKEN = process.env.INFLUXDB_TOKEN || 'q6dzJRQWDpdaA62ZuPhcWOlmIongnzO9wvB8ZQodBE2_iWfAuLFAf2LTFakt925wR1F5Yt5sWek5DrOFxslc9g';
const INFLUXDB_ORG = process.env.INFLUXDB_ORG || 'telemetry_org';
const INFLUXDB_BUCKET = process.env.INFLUXDB_BUCKET || 'dashcam_metadata';

// Initialize InfluxDB client
const influxDB = new InfluxDB({ url: INFLUXDB_URL, token: INFLUXDB_TOKEN });
const writeApi = influxDB.getWriteApi(INFLUXDB_ORG, INFLUXDB_BUCKET, 'ns');

// Initialize Kafka Consumer
const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const consumer = new kafka.Consumer(client, [{ topic: 'dashcam-video-data' }], {
  autoCommit: true,
});

// Handle incoming messages
consumer.on('message', async (message) => {
  try {
    // Parse the message (assumed to be JSON)
    const { timestamp, vehicleId, data } = JSON.parse(message.value);

    // Convert timestamp to Date object
    const date = new Date(timestamp);

    // Define the storage path using the timestamp
    const datePath = path.join(
      '/app/storage',
      vehicleId,
      date.getUTCFullYear().toString(),
      (date.getUTCMonth() + 1).toString().padStart(2, '0'),
      date.getUTCDate().toString().padStart(2, '0'),
      date.getUTCHours().toString().padStart(2, '0')
    );
    const fileName = `${date.getUTCMinutes().toString().padStart(2, '0')}${date.getUTCSeconds().toString().padStart(2, '0')}_${Date.now()}.mp4`;
    const filePath = path.join(datePath, fileName);

    // Ensure the directory exists
    fs.mkdirSync(datePath, { recursive: true });

    // Write the video chunk to a file
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));

    // Write metadata to InfluxDB
    const point = new Point('video_chunks')
      .tag('vehicleId', vehicleId)
      .stringField('filePath', filePath)
      .timestamp(date);

    writeApi.writePoint(point);
  } catch (err) {
    console.error('Error processing message:', err);
  }
});

// Handle errors
consumer.on('error', (err) => {
  console.error('Kafka Consumer Error:', err);
});

// Ensure data is flushed before exiting
process.on('SIGINT', async () => {
  console.log('Flushing data to InfluxDB and closing consumer...');
  await writeApi.flush();
  await writeApi.close();
  consumer.close(true, () => process.exit());
});

