// consumer.js
const fs = require('fs');
const kafka = require('kafka-node');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB setup
const MONGO_URI = process.env.MONGO_URI || 'mongodb://user-management-db:27017/fleet_users';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define VideoSchema
const videoSchema = new mongoose.Schema({
  vehicleId: String,
  filePath: String,
  timestamp: Date,
});

const Video = mongoose.model('Video', videoSchema);

// Initialize Kafka Consumer
const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const consumer = new kafka.Consumer(client, [{ topic: 'dashcam-video-data' }], {
  autoCommit: true,
});

consumer.on('message', async (message) => {
  try {
    console.log('Received message from Kafka:', JSON.stringify(message));

    // Parse the message
    const { timestamp, vehicleId, data } = JSON.parse(message.value);
    const date = new Date(timestamp);

    // Define storage path and file name
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

    console.log(`Storing video at: ${filePath}`);

    // Ensure directory exists
    fs.mkdirSync(datePath, { recursive: true });

    // Write video to file
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
    console.log(`Video written successfully to: ${filePath}`);

    // Save metadata to MongoDB
    const videoRecord = new Video({
      vehicleId,
      filePath,
      timestamp: date,
    });

    await videoRecord.save();
    console.log('Video metadata saved to MongoDB:', videoRecord);
  } catch (err) {
    console.error('Error processing message:', err);
  }
});

// Handle errors
consumer.on('error', (err) => {
  console.error('Kafka Consumer Error:', err);
});
