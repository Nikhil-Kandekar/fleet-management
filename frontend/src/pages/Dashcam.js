// src/pages/Dashcam.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Dashcam() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    try {
      const response = await fetch(
        `http://localhost:7000/videos?startTime=${startDate.toISOString()}&endTime=${endDate.toISOString()}`
      );
      const data = await response.json();
      setVideos(data);
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
      </div>
      <button
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:bg-blue-700"
        onClick={handleSearch}
      >
        Search Videos
      </button>
    </div>
    {/* Video playback results would go here */}
  </div>
  );
}

export default Dashcam;
