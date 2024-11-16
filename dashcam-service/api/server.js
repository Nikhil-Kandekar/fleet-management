// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 7002;

app.use(cors());

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

// Endpoint to request video streams based on date range and vehicle ID
app.get('/videos', async (req, res) => {
  const { startTime, endTime, vehicleId } = req.query;

  if (!startTime || !endTime || !vehicleId) {
    return res.status(400).json({
      error: 'startTime, endTime, and vehicleId query parameters are required',
    });
  }

  try {
    // Query MongoDB for video file paths within the date range for the given vehicle ID
    const videoRecords = await Video.find({
      vehicleId,
      timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) },
    }).sort({ timestamp: 1 });

    if (videoRecords.length === 0) {
      return res.status(404).json({
        error: 'No video data available for the specified parameters.',
      });
    }
    console.log(videoRecords);

    res.json(videoRecords);
  } catch (err) {
    console.error('Error retrieving video data:', err);
    res.status(500).json({ error: 'Error retrieving video data.' });
  }
});

// Serve video files
app.get('/storage/:vehicleId/:year/:month/:day/:hour/:file', (req, res) => {
  const { vehicleId, year, month, day, hour, file } = req.params;
  const filePath = path.join('/app/storage', vehicleId, year, month, day, hour, file);

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'video/mp4');
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Video file not found' });
  }
});

app.listen(port, () => {
  console.log(`Dashcam Service API running on port ${port}`);
});
