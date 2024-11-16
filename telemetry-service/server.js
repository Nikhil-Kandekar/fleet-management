const express = require('express');
const kafka = require('kafka-node');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const cors = require('cors');

const app = express();
const PORT = 7001;
app.use(express.json());
app.use(cors());

// InfluxDB setup
const token = '-5KEJgBrrp9TLocFBoIvlYjFPe41K5vCHuyAatlondgr4vCq7dIZkOnFhkQ-JC3VO9FOUgoFRNURb-1iO-1_cQ=='; // Replace with your actual InfluxDB token
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
  } catch (error) {
    console.error('Error processing telemetry data:', error);
  }
});

// Endpoint to retrieve analytics data for all vehicles
app.get('/api/analytics', async (req, res) => {
  try {
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -7d)
        |> filter(fn: (r) => r["_measurement"] == "vehicle_telemetry")
        |> group(columns: ["vehicleId"])
        |> last()
        |> keep(columns: ["vehicleId", "_field", "_value"])
    `;

    let analyticsData = {};
    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          const vehicleId = o.vehicleId;

          // Initialize the vehicle entry if it does not exist
          if (!analyticsData[vehicleId]) {
            analyticsData[vehicleId] = { vehicleId };
          }

          // Assign the value based on the field
          if (o._field === 'speed') {
            analyticsData[vehicleId].speed = o._value;
          } else if (o._field === 'fuel') {
            analyticsData[vehicleId].fuel = o._value;
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

    // Convert the result object to an array for easier consumption in the frontend
    res.status(200).json(Object.values(analyticsData));
  } catch (error) {
    console.error('Error retrieving analytics data:', error);
    res.status(500).json({ error: 'Error retrieving analytics data.' });
  }
});

// Endpoint to retrieve data for a single vehicle
app.get('/api/vehicle/:vehicleId', async (req, res) => {
  const { vehicleId } = req.params;

  try {
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -7d)
        |> filter(fn: (r) => r["_measurement"] == "vehicle_telemetry" and r["vehicleId"] == "${vehicleId}")
        |> last()
        |> keep(columns: ["vehicleId", "_field", "_value"])
    `;

    let vehicleData = { vehicleId };
    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);

          // Assign the value based on the field
          if (o._field === 'speed') {
            vehicleData.speed = o._value;
          } else if (o._field === 'fuel') {
            vehicleData.fuel = o._value;
          } else if (o._field === 'latitude') {
            vehicleData.latitude = o._value;
          } else if (o._field === 'longitude') {
            vehicleData.longitude = o._value;
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

    res.status(200).json(vehicleData);
  } catch (error) {
    console.error('Error retrieving vehicle data:', error);
    res.status(500).json({ error: 'Error retrieving vehicle data.' });
  }
});

// Endpoint to retrieve locations of all vehicles
app.get('/api/locations', async (req, res) => {
  try {
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -30d) // Increase the range to -30 days to ensure we capture data if available
        |> filter(fn: (r) => r["_measurement"] == "vehicle_telemetry" and (r["_field"] == "latitude" or r["_field"] == "longitude"))
        |> group(columns: ["vehicleId"])
        |> last()
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> keep(columns: ["vehicleId", "latitude", "longitude"])
    `;

    console.log("Executing Flux Query: ", fluxQuery);

    let locations = [];
    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          console.log("Query Result Row: ", o); // Log the raw row result

          // Check if latitude and longitude are defined, and if so, push to the locations array
          if (typeof o.latitude !== 'undefined' && typeof o.longitude !== 'undefined') {
            locations.push({
              vehicleId: o.vehicleId,
              latitude: o.latitude,
              longitude: o.longitude,
            });
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

    if (locations.length === 0) {
      console.warn('No locations found for vehicles.');
    }

    res.status(200).json(locations);
  } catch (error) {
    console.error('Error retrieving vehicle locations:', error);
    res.status(500).json({ error: 'Error retrieving vehicle locations.' });
  }
});



// Express server for health check
app.get('/', (req, res) => {
  res.send('Telemetry Service is running');
});

app.listen(PORT, () => {
  console.log(`Telemetry Service is running on port ${PORT}`);
});
