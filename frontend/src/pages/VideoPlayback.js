import React, { useState } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

function VideoPlayback() {
  const [vehicleId, setVehicleId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const fetchVideo = async () => {
    try {
      const response = await axios.get(`http://localhost:7000/videos`, {
        params: {
          startTime,
          endTime,
          vehicleId,
        },
        responseType: 'blob',
      });
      // Create an object URL for the video blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setVideoUrl(url);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  return (
    <div>
      <h1>Video Playback</h1>
      <input
        type="text"
        placeholder="Vehicle ID"
        value={vehicleId}
        onChange={(e) => setVehicleId(e.target.value)}
      />
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
        <div>
          <ReactPlayer url={videoUrl} controls={true} />
        </div>
      )}
    </div>
  );
}

export default VideoPlayback;
