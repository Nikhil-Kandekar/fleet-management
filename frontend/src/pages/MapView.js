// src/pages/MapView.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapView({ vehicleData }) {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {vehicleData.map((vehicle) => (
        <Marker key={vehicle.id} position={[vehicle.latitude, vehicle.longitude]}>
          <Popup>
            {vehicle.name}<br />Speed: {vehicle.speed} km/h
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
