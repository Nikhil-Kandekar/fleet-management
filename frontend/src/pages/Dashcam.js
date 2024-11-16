import React, { useState } from 'react';

function Dashcam() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [vehicleId, setVehicleId] = useState('');
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    try {
      const url = new URL('http://localhost:7002/videos');
      const params = {
        startTime: new Date(startDate).toISOString(),
        endTime: new Date(endDate).toISOString(),
      };
      if (vehicleId) params.vehicleId = vehicleId;

      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

      const response = await fetch(url);
      const data = await response.json();
      if (Array.isArray(data)) {
        setVideos(data);
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  return (
    <div className="container mx-auto my-10">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Dashcam Video Search</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Vehicle ID (Optional)</label>
            <input
              type="text"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        </div>
        <button
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:bg-blue-700"
          onClick={fetchVideos}
        >
          Search Videos
        </button>
      </div>

      <div className="mt-8">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-2">Vehicle ID: {video.vehicleId}</h3>
                <p className="mb-4">Timestamp: {new Date(video.timestamp).toLocaleString()}</p>
                <video controls className="w-full rounded-lg shadow-md">
                  <source src={`http://localhost:7002/storage${video.filePath}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-4">No videos available for the selected date range.</p>
        )}
      </div>
    </div>
  );
}

export default Dashcam;
