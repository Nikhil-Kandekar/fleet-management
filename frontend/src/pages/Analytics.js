import React, { useEffect, useState } from 'react';

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:6000/api/analytics', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data);
        } else {
          alert('Failed to fetch analytics data');
        }
      } catch (error) {
        console.error('Error fetching analytics', error);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="container mx-auto my-10">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Fleet Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placeholder for analytics charts */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-4">Total Fleet Fuel Consumption</h3>
            {/* Chart Placeholder */}
            <div className="h-48 bg-gray-300 rounded-lg"></div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-4">Average Speed Per Vehicle</h3>
            {/* Chart Placeholder */}
            <div className="h-48 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
