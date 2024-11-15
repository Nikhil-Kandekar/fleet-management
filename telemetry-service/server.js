const express = require('express');
const kafka = require('kafka-node');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const app = express();
const PORT = 6000;
app.use(express.json());

const JWT_SECRET = 'your_jwt_secret_here';

// InfluxDB setup
const token = 'q6dzJRQWDpdaA62ZuPhcWOlmIongnzO9wvB8ZQodBE2_iWfAuLFAf2LTFakt925wR1F5Yt5sWek5DrOFxslc9g';
const org = 'telemetry_org';
const bucket = 'telemetry_bucket';
const influx = new InfluxDB({ url: 'http://telemetry-influxdb:8086', token: token });
const writeApi = influx.getWriteApi(org, bucket);
const queryApi = influx.getQueryApi(org);

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

// User registration endpoint
app.post('/api/auth/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password, and role are required.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to InfluxDB
    const point = new Point('users')
      .tag('username', username)
      .stringField('role', role)
      .stringField('password', hashedPassword)
      .timestamp(new Date());

    writeApi.writePoint(point);
    await writeApi.flush();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user.' });
  }
});

// User login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -30d)
        |> filter(fn: (r) => r["_measurement"] == "users" and r["username"] == "${username}")
    `;

    let user = null;
    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          if (o.password) {
            user = o;
          }
        },
        error(error) {
          reject(error);
        },
        complete() {
          resolve();
        },
      });
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Error during login.' });
  }
});

// Endpoint to retrieve analytics data
app.get('/api/analytics', async (req, res) => {
  try {
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -7d)
        |> filter(fn: (r) => r["_measurement"] == "vehicle_telemetry")
        |> mean()
    `;

    let analyticsData = [];
    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          analyticsData.push(o);
        },
        error(error) {
          reject(error);
        },
        complete() {
          resolve();
        },
      });
    });

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Error retrieving analytics data:', error);
    res.status(500).json({ error: 'Error retrieving analytics data.' });
  }
});

// Express server for health check
app.get('/', (req, res) => {
  res.send('Telemetry Service is running');
});

app.listen(PORT, () => {
  console.log(`Telemetry Service is running on port ${PORT}`);
});
