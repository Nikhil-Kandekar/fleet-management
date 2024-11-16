// producer.js
const fs = require('fs');
const kafka = require('kafka-node');
const path = require('path');

// Kafka configuration
const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const producer = new kafka.Producer(client);

producer.on('ready', () => {
  console.log('Kafka Producer is connected and ready.');
  setInterval(sendVideoFile, 10000); // Send video every 10 seconds
});

producer.on('error', (err) => {
  console.error('Kafka Producer Error:', err);
});

// Function to send the entire video file
function sendVideoFile() {
  const vehicleId = 'vehicle_123';
  const videoFilePath = path.join(__dirname, 'videos', 'video.mp4');

  fs.readFile(videoFilePath, (err, data) => {
    if (err) {
      return console.error('Error reading video file:', err);
    }
    console.log('data\n',data);

    const message = JSON.stringify({
      timestamp: new Date().toISOString(),
      vehicleId,
      data: data.toString('base64'), // Send the video file as a base64 encoded string
    });

    const payloads = [{ topic: 'dashcam-video-data', message: message }];

    producer.send(payloads, (err, data) => {
      if (err) {
        console.error('Error sending video file:', err);
      } else {
        console.log('Video file sent successfully:', data);
      }
    });
  });
}
