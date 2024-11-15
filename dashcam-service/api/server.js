// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { InfluxDB } = require('@influxdata/influxdb-client');

const app = express();
const port = 7000;

// Environment variables for InfluxDB
const INFLUXDB_URL = process.env.INFLUXDB_URL || 'http://telemetry-influxdb:8086';
const INFLUXDB_TOKEN = process.env.INFLUXDB_TOKEN || 'q6dzJRQWDpdaA62ZuPhcWOlmIongnzO9wvB8ZQodBE2_iWfAuLFAf2LTFakt925wR1F5Yt5sWek5DrOFxslc9g';
const INFLUXDB_ORG = process.env.INFLUXDB_ORG || 'telemetry_org';
const INFLUXDB_BUCKET = process.env.INFLUXDB_BUCKET || 'dashcam_metadata';

// Initialize InfluxDB client
const influxDB = new InfluxDB({ url: INFLUXDB_URL, token: INFLUXDB_TOKEN });
const queryApi = influxDB.getQueryApi(INFLUXDB_ORG);

// Endpoint to request video streams based on date range and vehicle ID
app.get('/videos', async (req, res) => {
  const { startTime, endTime, vehicleId } = req.query;

  if (!startTime || !endTime || !vehicleId) {
    return res.status(400).json({
      error: 'startTime, endTime, and vehicleId query parameters are required',
    });
  }

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({
      error: 'Invalid date format. Use ISO 8601 format for startTime and endTime.',
    });
  }

  try {
    // Build the Flux query
    const fluxQuery = `
      from(bucket: "${INFLUXDB_BUCKET}")
        |> range(start: ${startDate.toISOString()}, stop: ${endDate.toISOString()})
        |> filter(fn: (r) => r["_measurement"] == "video_chunks" and r["vehicleId"] == "${vehicleId}")
        |> sort(columns: ["_time"], desc: false)
    `;

    const filePaths = [];

    // Execute the query
    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          if (o._field === 'filePath') {
            filePaths.push(o._value);
          }
        },
        error(error) {
          console.error('Error querying InfluxDB:', error);
          reject(error);
        },
        complete() {
          resolve();
        },
      });
    });

    if (filePaths.length === 0) {
      return res.status(404).json({
        error: 'No video data available for the specified parameters.',
      });
    }

    // Set response headers for video streaming
    res.writeHead(200, {
      'Content-Type': 'video/mp4',
    });

    // Function to stream video files sequentially
    const streamVideoFiles = async () => {
      for (const filePath of filePaths) {
        if (fs.existsSync(filePath)) {
          // Create a readable stream for the video file
          const videoStream = fs.createReadStream(filePath);

          // Pipe the video stream to the response
          await new Promise((resolve, reject) => {
            videoStream.on('end', resolve);
            videoStream.on('error', reject);
            videoStream.pipe(res, { end: false });
          });
        } else {
          console.warn(`Video file not found: ${filePath}`);
        }
      }
      // End the response once all video files have been streamed
      res.end();
    };

    // Start streaming the video files
    streamVideoFiles().catch((err) => {
      console.error('Error streaming video files:', err);
      res.status(500).json({ error: 'Error streaming video files.' });
    });
  } catch (err) {
    console.error('Error retrieving video data:', err);
    res.status(500).json({ error: 'Error retrieving video data.' });
  }
});

app.listen(port, () => {
  console.log(`Dashcam Service API running on port ${port}`);
});
