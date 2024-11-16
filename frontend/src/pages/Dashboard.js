import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom car icon for vehicle markers
const carIcon = new L.Icon({
  iconUrl: '/car-icon.png', // Make sure you have a car icon at the specified path
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function Dashboard() {
  const [locations, setLocations] = useState([]);
  const [vehicleData, setVehicleData] = useState({});
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  // Fetch all vehicle locations every 5 seconds
  useEffect(() => {
    const vehicleIds = ["vehicle_001", "vehicle_002", "vehicle_003", "vehicle_004", "vehicle_005", "vehicle_123"];

    const fetchLocations = async () => {
      try {
        const promises = vehicleIds.map((vehicleId) =>
          axios.get(`http://localhost:7001/api/vehicle/${vehicleId}`)
        );

        const responses = await Promise.all(promises);
        const newLocations = responses.map((res) => res.data).filter((data) => data.latitude && data.longitude);

        setLocations(newLocations);
        setLoadingLocations(false);
      } catch (error) {
        console.error('Error fetching vehicle locations:', error);
        setLoadingLocations(false);
      }
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data for a single vehicle when user inputs ID
  useEffect(() => {
    if (selectedVehicleId) {
      const fetchVehicleData = async () => {
        try {
          const response = await axios.get(`http://localhost:7001/api/vehicle/${selectedVehicleId}`);
          setVehicleData(response.data);
        } catch (error) {
          console.error('Error fetching vehicle data:', error);
        }
      };

      fetchVehicleData();
      const interval = setInterval(fetchVehicleData, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedVehicleId]);

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Map with vehicle locations */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Vehicle Locations on Map</h2>
        {loadingLocations ? (
          <p>Loading vehicle locations...</p>
        ) : (
          <MapContainer center={[26.479682064473124, 73.11957122977769]} zoom={15} style={{ height: '500px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {locations.map((location, index) => (
              <Marker key={index} position={[location.latitude, location.longitude]} icon={carIcon}>
                <Popup>
                  <div>
                    <h3>Vehicle: {location.vehicleId}</h3>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Single Vehicle Data */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Search Vehicle by ID</h2>
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
            onClick={() => setVehicleData({})}
            className="mt-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:bg-blue-700"
          >
            Search Vehicle
          </button>
        </div>
        {selectedVehicleId && vehicleData.latitude && vehicleData.longitude && (
          <MapContainer center={[vehicleData.latitude, vehicleData.longitude]} zoom={15} style={{ height: '300px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[vehicleData.latitude, vehicleData.longitude]} icon={carIcon}>
              <Popup>
                <div>
                  <h3>Vehicle: {vehicleData.vehicleId}</h3>
                  <p>Latitude: {vehicleData.latitude}</p>
                  <p>Longitude: {vehicleData.longitude}</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        )}
      </div>

      {/* Vehicle Data Cards */}
      {selectedVehicleId && vehicleData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicleData.speed !== undefined && (
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold">Vehicle Speed</h3>
              <p>{vehicleData.speed ? `${vehicleData.speed.toFixed(2)} km/h` : 'N/A'}</p>
            </div>
          )}
          {vehicleData.fuel !== undefined && (
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold">Fuel Level</h3>
              <p>{vehicleData.fuel ? `${vehicleData.fuel.toFixed(2)} %` : 'N/A'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
