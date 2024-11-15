const fs = require('fs');
const kafka = require('kafka-node');
const path = require('path');

// Initialize Kafka Producer
const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const producer = new kafka.Producer(client);

// Handle producer readiness
producer.on('ready', () => {
  console.log('Kafka Producer is connected and ready.');
  sendVideoChunks();
});

// Handle errors
producer.on('error', (err) => {
  console.error('Kafka Producer Error:', err);
});

// Function to send video chunks
function sendVideoChunks() {
  const vehicleId = 'vehicle_123';
  const videoFilePath = './videos/video.mp4';

  // Read the video file
  const videoStream = fs.createReadStream(videoFilePath, { highWaterMark: 65536 }); // 64KB chunks

  videoStream.on('data', (chunk) => {
    const message = JSON.stringify({
      timestamp: new Date().toISOString(),
      vehicleId,
      data: chunk.toString('base64'),
    });

    const payloads = [
      { topic: 'dashcam-video-data', messages: message },
    ];

    producer.send(payloads, (err, data) => {
      if (err) console.error('Error sending message:', err);
    });
  });

  videoStream.on('end', () => {
    console.log('Finished sending video chunks.');
  });
}
