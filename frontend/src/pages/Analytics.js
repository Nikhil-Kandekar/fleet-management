import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Import for Chart.js to handle all necessary chart types

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

  // Prepare data for each Bar chart
  const speedChartData = {
    labels: analyticsData.map((data) => `Vehicle: ${data.vehicleId}`),
    datasets: [
      {
        label: 'Average Speed (km/h)',
        data: analyticsData.map((data) => data.speed || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const fuelChartData = {
    labels: analyticsData.map((data) => `Vehicle: ${data.vehicleId}`),
    datasets: [
      {
        label: 'Average Fuel (%)',
        data: analyticsData.map((data) => data.fuel || 0),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const distanceChartData = {
    labels: analyticsData.map((data) => `Vehicle: ${data.vehicleId}`),
    datasets: [
      {
        label: 'Distance Travelled (km)',
        data: analyticsData.map((data) => parseFloat(data.distanceTravelled) || 0),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Fleet Analytics Dashboard</h1>
      {loading ? (
        <p>Loading analytics data...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {analyticsData.length > 0 ? (
              analyticsData.map((data, index) => (
                <div key={index} className="p-4 bg-white rounded shadow-md">
                  <h2 className="text-xl font-bold">Vehicle: {data.vehicleId}</h2>
                  <p>Average Speed: {data.speed ? `${data.speed.toFixed(2)} km/h` : 'N/A'}</p>
                  <p>Average Fuel: {data.fuel ? `${data.fuel.toFixed(2)}%` : 'N/A'}</p>
                  <p>Distance Travelled: {data.distanceTravelled ? `${data.distanceTravelled} km` : 'N/A'}</p>
                </div>
              ))
            ) : (
              <p>No analytics data available.</p>
            )}
          </div>

          {/* Bar Chart for Average Speed */}
          <div className="bg-white p-4 rounded shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Average Speed Comparison</h2>
            <Bar
              data={speedChartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Speed (km/h)',
                    },
                  },
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Average Speed of Vehicles',
                  },
                },
              }}
            />
          </div>

          {/* Bar Chart for Average Fuel */}
          <div className="bg-white p-4 rounded shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Average Fuel Comparison</h2>
            <Bar
              data={fuelChartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Fuel (%)',
                    },
                  },
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Average Fuel Level of Vehicles',
                  },
                },
              }}
            />
          </div>

          {/* Bar Chart for Distance Travelled */}
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Distance Travelled Comparison</h2>
            <Bar
              data={distanceChartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Distance (km)',
                    },
                  },
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Total Distance Travelled by Vehicles',
                  },
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
