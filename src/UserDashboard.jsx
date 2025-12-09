import React, { useState, useEffect } from 'react';
import { Home, Search, Bell, User, MessageCircle, Menu, MapPin, AlertTriangle, FileText } from 'lucide-react';
import './UserDashboard.css'; // Make sure you still have the CSS file from the previous step!

const UserDashboard = () => {
  // --- STATE VARIABLES (To hold data from Database/API) ---
  const [alerts, setAlerts] = useState([]);
  const [complaintsData, setComplaintsData] = useState({ count: 0, status: '' });
  const [gpsLocation, setGpsLocation] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // --- CONNECTING TO BACKEND (Simulated) ---
  useEffect(() => {
    
    // 1. SIMULATE FETCHING ALERTS FROM DATABASE
    // In future: const response = await fetch('http://localhost:8000/alerts')
    const mockAlerts = [
      { id: 1, type: 'Traffic', severity: 'high', msg: 'Heavy congestion on Main St' },
      { id: 2, type: 'Accident', severity: 'medium', msg: 'Minor crash near Park' }
    ];
    setAlerts(mockAlerts);

    // 2. SIMULATE FETCHING COMPLAINTS STATUS
    // In future: const response = await fetch('http://localhost:8000/complaints/user/123')
    setComplaintsData({ count: 5, status: 'In Progress' });

    // 3. GET USER GPS LOCATION
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log("GPS Error", error)
      );
    }
  }, []);

  return (
    <div className="dashboard-container">
      
      {/* --- TOP NAV --- */}
      <div className="top-nav">
        <div className="logo">LOCONO</div>
        <button className="menu-btn"><Menu size={24} /></button>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="content-area">
        
        {/* 1. MAP SECTION */}
        <div className="map-section">
          <MapPin size={40} style={{ marginBottom: '10px', opacity: 0.7 }} />
          <div className="map-placeholder-text">
            <h3>Map Integration</h3>
            <p>
              {gpsLocation 
                ? `Lat: ${gpsLocation.lat.toFixed(4)}, Lng: ${gpsLocation.lng.toFixed(4)}` 
                : "Locating GPS..."}
            </p>
          </div>

          {/* Chatbot Button inside Map */}
          <button className="chatbot-btn" onClick={() => setIsChatOpen(!isChatOpen)}>
            <MessageCircle size={24} />
          </button>
        </div>

        {/* Chat Window (Conditional) */}
        {isChatOpen && (
          <div className="chat-window">
            <div className="chat-header">LOCONO Assistant</div>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Hello! How can I help you navigate?</p>
            <input type="text" className="chat-input" placeholder="Type a message..." />
          </div>
        )}

        {/* 2. ALERTS & COMPLAINTS SPLIT */}
        <div className="split-section">
          
          {/* Alerts Panel */}
          <div className="alerts-panel">
            <div className="section-title">
              <AlertTriangle size={18} color="#e74c3c" /> Alerts
            </div>
            {alerts.map((alert) => (
              <div key={alert.id} className="alert-card">
                <span className={`alert-type ${alert.severity}`}>{alert.type}</span>
                <span className="alert-msg">{alert.msg}</span>
              </div>
            ))}
          </div>

          {/* Complaints Panel */}
          <div className="complaints-panel">
            <FileText size={32} color="#7f8c8d" />
            <div className="section-title" style={{ marginTop: '10px' }}>Complaints</div>
            <div className="stat-number">{complaintsData.count}</div>
            <div className="stat-status">{complaintsData.status}</div>
          </div>

        </div>
      </div>

      {/* --- BOTTOM NAV --- */}
      <div className="bottom-nav">
        <button className="nav-item active">
          <Home size={22} />
          <span>Home</span>
        </button>
        <button className="nav-item">
          <Search size={22} />
          <span>Search</span>
        </button>
        <button className="nav-item">
          <Bell size={22} />
          <span>Notify</span>
        </button>
        <button className="nav-item">
          <User size={22} />
          <span>Profile</span>
        </button>
      </div>

    </div>
  );
};

export default UserDashboard;