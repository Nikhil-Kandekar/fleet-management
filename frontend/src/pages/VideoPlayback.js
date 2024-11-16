import React, { useState } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

function VideoPlayback() {
  const [vehicleId, setVehicleId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const fetchVideo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:7002/videos`, {
        params: {
          startTime,
          endTime,
          vehicleId,
        },
        responseType: 'json',
      });

      if (response.data.length > 0) {
        const filePath = response.data[0].filePath;
        setVideoUrl(`http://localhost:7002/storage${filePath}`);
        setUseFallback(false);
      } else {
        throw new Error('No videos found for the given criteria.');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      setVideoUrl(`http://localhost:3000/video.mp4`); // Fallback to local video
      setUseFallback(true);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto my-10 p-6 max-w-xl bg-white shadow-lg rounded-md">
      <h1 className="text-3xl font-bold text-center mb-6">Video Playback</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Vehicle ID"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <input
          type="datetime-local"
          placeholder="Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <input
          type="datetime-local"
          placeholder="End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          onClick={fetchVideo}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Fetching Video...' : 'Fetch Video'}
        </button>
      </div>

      {videoUrl && (
        <div className="mt-8">
          <ReactPlayer
            url={videoUrl}
            controls={true}
            width="100%"
            height="360px"
            loop={useFallback} // Loop if fallback video is used
            playing={useFallback} // Autoplay if using fallback video
            style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
          />
          
        </div>
      )}
    </div>
  );
}

export default VideoPlayback;
