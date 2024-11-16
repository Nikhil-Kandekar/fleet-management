import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';

function VehicleDetail() {
  const { id: vehicleId } = useParams();
  const [telemetryData, setTelemetryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const fetchTelemetryData = async () => {
      try {
        const response = await axios.get(`http://localhost:6000/telemetry`, {
          params: { vehicleId },
        });
        setTelemetryData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching telemetry data:', error);
      }
    };
    fetchTelemetryData();
  }, [vehicleId]);

  const fetchVideo = async () => {
    try {
      const response = await axios.get(`http://localhost:7002/videos`, {
        params: { startTime, endTime, vehicleId },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setVideoUrl(url);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  return (
    <div className="vehicle-detail-container">
      <h1>Vehicle Detail - {vehicleId}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Telemetry Data</h2>
          <ul>
            {telemetryData.map((data, index) => (
              <li key={index}>
                Time: {data.timestamp}, Speed: {data.speed}, Fuel: {data.fuel}, Latitude: {data.latitude}, Longitude: {data.longitude}
              </li>
            ))}
          </ul>

          <h2>View Dashcam Footage</h2>
          <input
            type="datetime-local"
            placeholder="Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            type="datetime-local"
            placeholder="End Time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <button onClick={fetchVideo}>Fetch Video</button>

          {videoUrl && (
            <div className="video-player">
              <ReactPlayer url={videoUrl} controls={true} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VehicleDetail;
