import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [locations, setLocations] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingVehicleData, setLoadingVehicleData] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  // Fetch all vehicle locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:7001/api/locations');
        setLocations(response.data);
        setLoadingLocations(false);
      } catch (error) {
        console.error('Error fetching vehicle locations:', error);
        setLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  // Fetch analytics data for all vehicles
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:7001/api/analytics');
        setAnalytics(response.data);
        setLoadingAnalytics(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Fetch data for a single vehicle based on selected vehicleId
  useEffect(() => {
    if (selectedVehicleId) {
      const fetchVehicleData = async () => {
        try {
          const response = await axios.get(`http://localhost:7001/api/vehicle/${selectedVehicleId}`);
          setVehicleData(response.data);
          setLoadingVehicleData(false);
        } catch (error) {
          console.error('Error fetching vehicle data:', error);
          setLoadingVehicleData(false);
        }
      };
      fetchVehicleData();
    }
  }, [selectedVehicleId]);

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Fleet Dashboard (JSON Data Display)</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Vehicle Locations</h2>
        {loadingLocations ? (
          <p>Loading vehicle locations...</p>
        ) : (
          <pre>{JSON.stringify(locations, null, 2)}</pre>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Analytics Data for All Vehicles</h2>
        {loadingAnalytics ? (
          <p>Loading analytics data...</p>
        ) : (
          <pre>{JSON.stringify(analytics, null, 2)}</pre>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Single Vehicle Data</h2>
        <div className="mb-4">
          <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">
            Enter Vehicle ID:
          </label>
          <input
            type="text"
            id="vehicleId"
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={() => setLoadingVehicleData(true)}
            className="mt-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:bg-blue-700"
          >
            Fetch Vehicle Data
          </button>
        </div>
        {loadingVehicleData && selectedVehicleId ? (
          <p>Loading vehicle data for ID: {selectedVehicleId}...</p>
        ) : (
          <pre>{JSON.stringify(vehicleData, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
