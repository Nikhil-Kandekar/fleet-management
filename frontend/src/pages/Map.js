import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicleLocations = async () => {
      try {
        const response = await axios.get('http://localhost:7001/api/analytics');
        setVehicles(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vehicle locations:', error);
        setLoading(false);
      }
    };
    fetchVehicleLocations();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Vehicle Location Map</h1>
      {loading ? (
        <p>Loading map data...</p>
      ) : (
        <MapContainer center={[37.7749, -122.4194]} zoom={13} className="h-[500px] w-full rounded shadow-lg">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {vehicles.map((vehicle, index) => (
            <Marker key={index} position={[vehicle.latitude, vehicle.longitude]}>
              <Popup>
                <strong>Vehicle ID:</strong> {vehicle.vehicleId} <br />
                <strong>Speed:</strong> {vehicle.speed} km/h <br />
                <strong>Fuel:</strong> {vehicle.fuel}%
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}

export default MapPage;
