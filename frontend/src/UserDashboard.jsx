import React, { useState, useEffect } from 'react';
import { 
  Home, Search, Bell, User, Settings, Shield, 
  MapPin, AlertTriangle, MessageCircle, X, LogOut, Edit3, Save, LocateFixed, Maximize, Minimize 
} from 'lucide-react';
import { toast } from 'react-hot-toast'; 
import './App.css';
import MapComponent from './MapComponent';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  // --- NEW STATE FOR FULLSCREEN MAP ---
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  
  // --- STATES FOR FEATURES ---
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [userGps, setUserGps] = useState(null); 

  // Complaint form state
  const [complaintForm, setComplaintForm] = useState({
    type: 'Theft',
    location: '',
    description: '',
    latitude: null,
    longitude: null,
  });

  // Profile Editing State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "Jeevesh C",
    email: "jeeveshc20@gmail.com",
    phone: "+91 98765 43210",
    bio: "Civilian User • Bangalore"
  });

  // --- MOCK DATA ---
  const alertsData = [
    { id: 1, type: "High Severity", msg: "Accident reported on Highway 4", level: "alert-high", date: "2 mins ago" },
    { id: 2, type: "Warning", msg: "Heavy rain expected in Sector 5", level: "alert-med", date: "1 hour ago" },
    { id: 3, type: "Info", msg: "Road maintenance on MG Road", level: "alert-med", date: "Yesterday" },
    { id: 4, type: "Resolved", msg: "Traffic jam cleared at Silk Board", level: "alert-med", date: "2 days ago" },
    { id: 5, type: "High Severity", msg: "Fire reported near City Center", level: "alert-high", date: "3 days ago" },
  ];

  const safetyTips = [
    { id: 1, title: "Night Travel", desc: "Share your live location with trusted contacts." },
    { id: 2, title: "Emergency Numbers", desc: "Police: 100, Fire: 101, Ambulance: 102." },
    { id: 3, title: "Crowded Areas", desc: "Keep your valuables in front pockets." },
    { id: 4, title: "Online Safety", desc: "Do not share OTPs with anyone claiming to be officials." },
    { id: 5, title: "Harassment", desc: "Use the SOS button immediately if you feel unsafe." },
  ];

  // --- HANDLERS ---
  const toggleFullscreenMap = () => {
    setIsMapFullscreen(!isMapFullscreen);
  };

  // 1. GPS Location Fetch on Mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserGps([latitude, longitude]);
          setComplaintForm(prev => ({
            ...prev,
            location: `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            latitude: latitude,
            longitude: longitude,
          }));
        },
        (error) => {
          console.error("Error fetching GPS:", error);
          toast.error("Location access denied or failed.", { id: 'gps-error' });
        }
      );
    }
  }, []);

  // 2. Complaint Submission Handler (FASTAPI INTEGRATION)
  const handleSubmitComplaint = async () => {
    const loadingToastId = toast.loading("Submitting complaint...", { duration: Infinity });
    try {
      // NOTE: Ensure your FastAPI server is running on http://127.0.0.1:8000
      const response = await fetch('http://127.0.0.1:8000/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintForm),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      toast.success(`Complaint lodged! Server: ${result.message}`, { id: loadingToastId });
      setShowComplaintModal(false);
      
      // Reset form fields
      setComplaintForm({
        type: 'Theft',
        location: userGps ? `GPS: ${userGps[0].toFixed(4)}, ${userGps[1].toFixed(4)}` : '',
        description: '',
        latitude: userGps ? userGps[0] : null,
        longitude: userGps ? userGps[1] : null,
      });

    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error(`Submission failed. Is FastAPI running on port 8000?`, { id: loadingToastId });
    }
  };


  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (activeTab) {
      
      // 1. HOME TAB
      case 'home':
        const displayedAlerts = showAllAlerts ? alertsData : alertsData.slice(0, 2);

        // Render full screen map if active
        if (isMapFullscreen) {
            return (
                <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: 'calc(100vh - 100px)' }}>
                    <MapComponent 
                        userGps={userGps} 
                        isFullscreen={isMapFullscreen} 
                        toggleFullscreen={toggleFullscreenMap}
                    />
                </div>
            );
        }

        // Render normal grid layout
        return (
          <div className="grid-2-1">
            {/* Left Column: Map in normal view */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: '600px' }}>
                <MapComponent 
                    userGps={userGps} 
                    isFullscreen={isMapFullscreen} 
                    toggleFullscreen={toggleFullscreenMap}
                />
            </div>

            {/* Right Column: Alerts & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Recent Alerts */}
              <div className="card">
                <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle color="orange" /> Recent Alerts
                </h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {displayedAlerts.map(alert => (
                    <div key={alert.id} className={`alert-box ${alert.level}`}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{alert.type}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>{alert.date}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>{alert.msg}</p>
                    </div>
                  ))}
                </div>
                <button className="view-more-btn" onClick={() => setShowAllAlerts(!showAllAlerts)}>
                  {showAllAlerts ? "Show Less" : "View More Alerts"}
                </button>
              </div>

              {/* Forge Complaint Button */}
              <div className="card" style={{ textAlign: 'center', background: '#eaf4ff', border: '1px solid #1877f2' }}>
                <h3>Witnessed an Incident?</h3>
                <p style={{ margin: '10px 0', fontSize: '0.9rem', color: '#555' }}>Report incidents directly to the police control room.</p>
                <button className="btn btn-danger" style={{ width: '100%' }} onClick={() => setShowComplaintModal(true)}>
                  Forge Complaint
                </button>
              </div>
            </div>
          </div>
        );

      // 2. SEARCH TAB
      case 'search':
        const filteredTips = safetyTips.filter(t => 
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          t.desc.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
          <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>Safety Knowledge Base</h2>
            <div style={{ position: 'relative', marginBottom: '30px' }}>
              <Search style={{ position: 'absolute', left: 15, top: 12, color: '#999' }} />
              <input 
                type="text" 
                placeholder="Search related to safety measures, emergency tips..." 
                className="form-control"
                style={{ paddingLeft: '45px', padding: '15px 15px 15px 45px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid-cards">
              {filteredTips.map(tip => (
                <div key={tip.id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                  <h4 style={{ color: 'var(--accent-color)', marginBottom: '5px' }}>{tip.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: '#555' }}>{tip.desc}</p>
                </div>
              ))}
              {filteredTips.length === 0 && <p>No results found.</p>}
            </div>
          </div>
        );

      // 3. NOTIFICATIONS TAB
      case 'notifications':
        return (
          <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>Notifications</h2>
            {[1,2,3,4].map((n) => (
              <div key={n} style={{ display: 'flex', gap: '15px', padding: '15px', borderBottom: '1px solid #eee' }}>
                <div style={{ width: '12px', height: '12px', background: n===1 ? 'red' : '#ddd', borderRadius: '50%', marginTop: '6px' }}></div>
                <div>
                  <strong>{n===1 ? 'Emergency Alert' : 'System Update'}</strong>
                  <p style={{ fontSize: '0.9rem', color: '#555', marginTop: '4px' }}>
                    {n===1 ? 'Heavy traffic reported near your saved location.' : 'Your complaint status has been updated to "Reviewed".'}
                  </p>
                  <small style={{ color: '#999' }}>{n} hours ago</small>
                </div>
              </div>
            ))}
          </div>
        );

      // 4. PROFILE TAB
      case 'profile':
        return (
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', background: 'var(--accent-color)', color: 'white', fontSize: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              {userProfile.name.charAt(0)}
            </div>
            
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>User Profile</h3>
                <button className="btn btn-outline" onClick={() => setIsEditingProfile(!isEditingProfile)}>
                  {isEditingProfile ? <Save size={16} /> : <Edit3 size={16} />} {isEditingProfile ? "Save" : "Customize"}
                </button>
              </div>

              <div className="form-group">
                <label>Full Name</label>
                {isEditingProfile ? (
                  <input className="form-control" value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} />
                ) : (
                  <p>{userProfile.name}</p>
                )}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                {isEditingProfile ? (
                  <input className="form-control" value={userProfile.email} onChange={(e) => setUserProfile({...userProfile, email: e.target.value})} />
                ) : (
                  <p>{userProfile.email}</p>
                )}
              </div>

              <div className="form-group">
                <label>Bio</label>
                 <p>{userProfile.bio}</p>
              </div>
            </div>

            <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />
            
            <button className="btn btn-danger" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <LogOut size={18} /> Log Out
            </button>
          </div>
        );

      // 5. SETTINGS
      case 'settings':
        return (
            <div className="card">
             <h2>Settings</h2>
             <p>Application configurations go here.</p>
            </div>
        );

      default: return null;
    }
  };

  // The overall container class changes based on fullscreen state
  const containerClass = isMapFullscreen ? 'dashboard-container fullscreen-map-active' : 'dashboard-container';

  return (
    <div className={containerClass}>
      
      {/* --- TOP NAVIGATION BAR (HORIZONTAL) --- */}
      {/* Hide the top navbar when map is fullscreen */}
      {!isMapFullscreen && (
          <div className="top-navbar">
              <div className="nav-brand">
                  <Shield size={28} /> LOCONO
              </div>
              <div className="nav-menu">
                  <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                      <Home size={20} /> <span style={{fontSize:'0.8rem', marginTop:'4px'}}>Home</span>
                  </button>
                  <button className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
                      <Search size={20} /> <span style={{fontSize:'0.8rem', marginTop:'4px'}}>Search</span>
                  </button>
                  <button className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                      <Bell size={20} /> <span style={{fontSize:'0.8rem', marginTop:'4px'}}>Notify</span>
                  </button>
                  <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                      <User size={20} /> <span style={{fontSize:'0.8rem', marginTop:'4px'}}>Profile</span>
                  </button>
                  <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                      <Settings size={20} /> <span style={{fontSize:'0.8rem', marginTop:'4px'}}>Settings</span>
                  </button>
              </div>
          </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="main-content">
        {renderContent()}
      </div>

      {/* --- MODAL: FORGE COMPLAINT --- */}
      {showComplaintModal && (
        <div className="modal-overlay">
            <div className="modal-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3>Forge Complaint</h3>
                    <button onClick={() => setShowComplaintModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                </div>
                
                <div className="form-group">
                    <label>Complaint Type</label>
                    <select 
                        className="form-control"
                        value={complaintForm.type}
                        onChange={(e) => setComplaintForm({...complaintForm, type: e.target.value})}
                    >
                        <option>Theft</option>
                        <option>Harassment</option>
                        <option>Accident</option>
                        <option>Public Disturbance</option>
                        <option>Other</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        Location 
                        {userGps && <LocateFixed size={14} color="#1877f2" title="GPS automatically detected" />}
                    </label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter address or manually adjust location"
                        value={complaintForm.location}
                        onChange={(e) => setComplaintForm({...complaintForm, location: e.target.value})}
                    />
                    <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                        {userGps ? `Current GPS Lat/Lon: ${userGps[0].toFixed(4)}, ${userGps[1].toFixed(4)}` : "Awaiting GPS coordinates..."}
                    </small>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea 
                        rows="4" 
                        className="form-control" 
                        placeholder="Describe what happened..."
                        value={complaintForm.description}
                        onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Evidence (Optional)</label>
                    <input type="file" className="form-control" />
                </div>

                <button 
                    className="btn btn-primary" 
                    style={{ width: '100%' }} 
                    onClick={handleSubmitComplaint}
                >
                    Submit Report
                </button>
            </div>
        </div>
      )}

      {/* --- CHATBOT --- */}
      <div className="chatbot-btn" onClick={() => setIsChatOpen(!isChatOpen)}>
        {isChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </div>
      
      {isChatOpen && (
        <div className="chatbot-window">
          <div style={{ background: 'var(--accent-color)', color: 'white', padding: '15px', fontWeight: 'bold' }}>Locono Assistant</div>
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', background: '#f9f9f9' }}>
             <p style={{ background: '#e0e0e0', padding: '8px', borderRadius: '8px', display: 'inline-block' }}>Hello! I can help you with safety tips or navigation.</p>
          </div>
          <div style={{ padding: '10px', borderTop: '1px solid #ddd' }}>
            <input type="text" placeholder="Type a message..." className="form-control" style={{ borderRadius: '20px' }} />
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;