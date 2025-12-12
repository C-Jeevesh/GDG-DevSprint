import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, Circle } from 'react-leaflet';
import { Maximize, Minimize, MapPin, Clock, AlertCircle } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- 1. Fix Default Leaflet Icons ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// --- 2. Custom Icons ---
const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const alertIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// --- 3. Live Clock Component ---
const LiveTime = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>;
};

// --- 4. Map Controller (Handles Flight & Focus) ---
const MapController = ({ center, zoom, focusedLocation, userGps }) => {
    const map = useMap();
    const [hasFlownToUser, setHasFlownToUser] = useState(false); // Fixed variable name

    useEffect(() => {
        if (focusedLocation) {
            map.flyTo(focusedLocation, 16, { animate: true, duration: 1.5 });
        } else if (userGps && !hasFlownToUser) {
            map.flyTo(userGps, 15, { animate: true, duration: 2 });
            setHasFlownToUser(true);
        }
    }, [map, focusedLocation, userGps, hasFlownToUser]);

    return null;
};

// --- 5. Main Component ---
const MapComponent = ({ userGps, isFullscreen, toggleFullscreen, focusedLocation, alerts = [] }) => {
    const defaultCenter = [12.9716, 77.5946];
    const mapCenter = userGps || defaultCenter;
    
    // Count alerts strictly within 2km
    const nearbyCount = alerts.filter(a => parseFloat(a.distance || 10) <= 2.0).length;

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            
            {/* --- FLOATING INFO OVERLAY --- */}
            <div style={{
                position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
                zIndex: 1000, backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '8px 20px', borderRadius: '50px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                display: 'flex', alignItems: 'center', gap: '15px',
                fontSize: '0.85rem', fontWeight: '600', color: '#2d3436',
                border: '1px solid rgba(255,255,255,0.5)', whiteSpace: 'nowrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={16} color="#0984e3" />
                    <span>{userGps ? `${userGps[0].toFixed(3)}, ${userGps[1].toFixed(3)}` : "Locating..."}</span>
                </div>
                <div style={{ width: '1px', height: '15px', background: '#ccc' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={16} color="#636e72" />
                    <LiveTime />
                </div>
                <div style={{ width: '1px', height: '15px', background: '#ccc' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: nearbyCount > 0 ? '#d63031' : '#00b894' }}>
                    <AlertCircle size={16} />
                    <span>{nearbyCount} Nearby</span>
                </div>
            </div>

            {/* --- MAP --- */}
            <MapContainer 
                center={mapCenter} 
                zoom={13} 
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', borderRadius: isFullscreen ? '0px' : '15px' }} 
                zoomControl={false}
            >
                <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <ZoomControl position="bottomright" />
                <MapController center={mapCenter} zoom={14} focusedLocation={focusedLocation} userGps={userGps} />

                <button onClick={toggleFullscreen} style={{
                    position: 'absolute', top: '15px', right: '15px',
                    zIndex: 1000, background: 'white', border: 'none', borderRadius: '8px', padding: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', cursor: 'pointer', color: '#2d3436'
                }}>
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>

                {/* --- USER LOCATION --- */}
                {userGps && (
                    <>
                        <Marker position={userGps} icon={userIcon} zIndexOffset={1000}>
                            <Popup>You are Here</Popup>
                        </Marker>
                        <Circle 
                            center={userGps} 
                            radius={2000} 
                            pathOptions={{ color: '#0984e3', fillColor: '#0984e3', fillOpacity: 0.1, weight: 1, dashArray: '5, 10' }} 
                        />
                    </>
                )}

                {/* --- ALERTS --- */}
                {alerts.map(alert => (
                    <Marker key={alert.id} position={alert.coords} icon={alertIcon}>
                        <Popup>
                            <div style={{ textAlign: 'center' }}>
                                <strong style={{color: '#d63031'}}>{alert.type}</strong>
                                <p style={{margin: '5px 0', fontSize: '0.9rem'}}>{alert.msg}</p>
                                <b style={{fontSize:'0.8rem'}}>{alert.distance} km away</b>
                            </div>
                        </Popup>
                    </Marker>
                ))}

            </MapContainer>
        </div>
    );
};

export default MapComponent;