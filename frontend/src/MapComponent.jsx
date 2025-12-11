import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, Circle } from 'react-leaflet';
import { Maximize, Minimize, AlertTriangle } from 'lucide-react';
import L from 'leaflet';

// --- Icon Fixes ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Red Icon for Alerts
const alertIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const ChangeMapView = ({ center, zoom, focusedLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && !focusedLocation) {
        map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map, focusedLocation]);

  useEffect(() => {
      if (focusedLocation) {
          map.flyTo(focusedLocation, 16, { animate: true, duration: 1.5 });
      }
  }, [focusedLocation, map]);

  useEffect(() => {
      setTimeout(() => { map.invalidateSize(); }, 100); 
  }, [map]);

  return null;
};

const initialCenter = [12.9716, 77.5946];

// Added 'alerts' prop
const MapComponent = ({ userGps, isFullscreen, toggleFullscreen, focusedLocation, alerts = [] }) => {
    const mapCenter = userGps || initialCenter;
    
    // 2km Radius configuration
    const radiusOptions = { color: 'red', fillColor: '#ff3b30', fillOpacity: 0.1, weight: 1 };

    return (
        <MapContainer 
            center={mapCenter} 
            zoom={13} 
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', borderRadius: isFullscreen ? '0px' : '15px' }} 
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomright" />

            <ChangeMapView center={mapCenter} zoom={14} focusedLocation={focusedLocation} />

            <button
                onClick={toggleFullscreen}
                style={{
                    position: 'absolute', top: isFullscreen ? '20px' : '10px', right: isFullscreen ? '20px' : '10px',
                    zIndex: 1000, background: 'white', border: 'none', borderRadius: '4px', padding: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)', cursor: 'pointer', color: 'var(--text-primary)'
                }}
            >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>

            {/* --- USER LOCATION & RADIUS --- */}
            {userGps && (
                <>
                    <Marker position={userGps}>
                        <Popup><strong>You are here</strong><br/>Safe Zone Monitored</Popup>
                    </Marker>
                    {/* The 2km Radius Circle */}
                    <Circle center={userGps} pathOptions={radiusOptions} radius={2000} />
                </>
            )}

            {/* --- ALERT MARKERS --- */}
            {alerts.map(alert => (
                <Marker key={alert.id} position={alert.coords} icon={alertIcon}>
                    <Popup>
                        <div style={{ textAlign: 'center' }}>
                            <strong style={{color: '#d63031'}}>{alert.type}</strong>
                            <p style={{margin: '5px 0', fontSize: '0.9rem'}}>{alert.msg}</p>
                            <small>{alert.distance} km away</small>
                        </div>
                    </Popup>
                </Marker>
            ))}

        </MapContainer>
    );
};

export default MapComponent;