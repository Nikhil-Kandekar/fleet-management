import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:7001/api/analytics');
        setAnalyticsData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Fleet Analytics Dashboard</h1>
      {loading ? (
        <p>Loading analytics data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {analyticsData.length > 0 ? (
            analyticsData.map((data, index) => (
              <div key={index} className="p-4 bg-white rounded shadow-md">
                <h2 className="text-xl font-bold">Vehicle: {data.vehicleId}</h2>
                <p>Average Speed: {data.speed ? `${data.speed.toFixed(2)} km/h` : 'N/A'}</p>
                <p>Average Fuel: {data.fuel ? `${data.fuel.toFixed(2)}%` : 'N/A'}</p>
              </div>
            ))
          ) : (
            <p>No analytics data available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Analytics;
