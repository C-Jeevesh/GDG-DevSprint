import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// --- Custom Icons for different units/alerts ---
const policeIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const complaintIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

// --- Mock Data for Police View ---
const mockUnits = [
  { id: 'P-01', lat: 13.0, lng: 77.6, status: 'Patrol' },
  { id: 'P-04', lat: 12.98, lng: 77.58, status: 'Responding' },
];

const mockComplaints = [
  { id: 101, type: 'Theft', loc: 'Sector 4', lat: 12.96, lng: 77.56 },
  { id: 102, type: 'Accident', loc: 'Main Road', lat: 13.02, lng: 77.62 },
];


const PoliceMapComponent = () => {
  // Center map over Bangalore for a tactical view
  const defaultCenter = [12.9716, 77.5946]; 

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={12} // Zoomed in for city tactical view
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* OpenStreetMap Tile Layer (Free) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Display Police Units */}
        {mockUnits.map(unit => (
          <Marker key={unit.id} position={[unit.lat, unit.lng]} icon={policeIcon}>
            <Popup>
              <strong>Unit: {unit.id}</strong><br />
              Status: {unit.status}
            </Popup>
          </Marker>
        ))}

        {/* Display Active Complaints */}
        {mockComplaints.map(complaint => (
          <Marker key={complaint.id} position={[complaint.lat, complaint.lng]} icon={complaintIcon}>
            <Popup>
              <strong>Alert #{complaint.id}</strong><br />
              Type: {complaint.type}
            </Popup>
          </Marker>
        ))}
        
      </MapContainer>
    </div>
  );
};

export default PoliceMapComponent;