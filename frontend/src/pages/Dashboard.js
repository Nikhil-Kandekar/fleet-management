import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`http://localhost:6000/vehicles`);
        setVehicles(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Fleet Dashboard</h1>
      {loading ? (
        <p>Loading vehicles...</p>
      ) : (
        <ul className="vehicle-list">
          {vehicles.map((vehicle, index) => (
            <li key={index}>
              <Link to={`/vehicle/${vehicle.vehicleId}`}>
                Vehicle: {vehicle.vehicleId}, Last Known Location: ({vehicle.latitude}, {vehicle.longitude})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
