import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { Maximize, Minimize } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons not showing up 
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to recenter the map view
const ChangeMapView = ({ center, zoom }) => {
  const map = useMap();
  
  React.useEffect(() => {
    map.setView(center, zoom, {
      animate: true, 
      duration: 0.5 
    });
    // Forces map to re-render its tiles when container size changes (e.g., fullscreen toggle)
    setTimeout(() => {
        map.invalidateSize();
    }, 100); 
  }, [center, zoom, map]);

  return null;
};

// Initial state for the map view
const initialCenter = [12.9716, 77.5946]; // Default to Bangalore coordinates
const initialZoom = 13;

// The MapComponent now accepts userGps, isFullscreen, and toggleFullscreen as props
const MapComponent = ({ userGps, isFullscreen, toggleFullscreen }) => {
    
    // Set map center: use user's location if available, otherwise use default
    const mapCenter = userGps || initialCenter;

    // Use OpenStreetMap (OSM) as the free tile provider
    const osmTileLayer = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    return (
        <MapContainer 
            center={mapCenter} 
            zoom={initialZoom} 
            scrollWheelZoom={true}
            // Dynamic styling for fullscreen visual effect
            style={{ height: '100%', width: '100%', borderRadius: isFullscreen ? '0px' : '15px' }} 
            zoomControl={false} // Disable default zoom control
        >
            <TileLayer
                attribution={attribution}
                url={osmTileLayer}
            />
            <ZoomControl position="bottomright" />

            {/* Component to update map center */}
            <ChangeMapView center={mapCenter} zoom={initialZoom} />

            {/* Fullscreen Toggle Button */}
            <button
                onClick={toggleFullscreen}
                style={{
                    position: 'absolute',
                    top: isFullscreen ? '20px' : '10px',
                    right: isFullscreen ? '20px' : '10px',
                    zIndex: 1000,
                    background: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    color: 'var(--text-primary)'
                }}
                title={isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
            >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>

            {/* User Location Marker */}
            {userGps && (
                <Marker position={userGps}>
                    <Popup>
                        Your Current Location.
                    </Popup>
                </Marker>
            )}

            {/* Static marker example (e.g., a reported incident) */}
            <Marker position={[12.98, 77.58]}>
                <Popup>
                    🚨 Accident Reported Here!
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapComponent;