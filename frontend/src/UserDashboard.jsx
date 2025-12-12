import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Search, Bell, User, Settings, Shield, 
  MapPin, AlertTriangle, MessageCircle, X, LogOut, 
  Edit3, Save, LocateFixed, Menu, Phone, Send, Maximize, Minimize
} from 'lucide-react';
import { toast } from 'react-hot-toast'; 
import './App.css';
import MapComponent from './MapComponent';

// --- UTILITY: Calculate Distance (Haversine Formula) ---
// Returns distance in Kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
};

const UserDashboard = () => {
  // --- LAYOUT STATES ---
  const [activeTab, setActiveTab] = useState('home');
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Sidebar Menu State
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // Logout Modal

  // --- FEATURE STATES ---
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- LOCATION & MAP STATES ---
  const [userGps, setUserGps] = useState(null); 
  const [focusedLocation, setFocusedLocation] = useState(null); // Used to fly map to specific alerts

  // --- DATA STATES ---
  const [allAlerts, setAllAlerts] = useState([
    { id: 1, type: "High Severity", msg: "Accident reported on Highway 4", level: "alert-high", date: "2 mins ago", coords: [12.9352, 77.6245], distance: null },
    { id: 2, type: "Warning", msg: "Heavy rain expected in Sector 5", level: "alert-med", date: "1 hour ago", coords: [12.9250, 77.5938], distance: null },
    { id: 3, type: "Info", msg: "Road maintenance on MG Road", level: "alert-med", date: "Yesterday", coords: [12.9716, 77.5946], distance: null },
    { id: 4, type: "Resolved", msg: "Traffic jam cleared at Silk Board", level: "alert-med", date: "2 days ago", coords: [12.9177, 77.6233], distance: null },
  ]);

  // --- CHATBOT STATE ---
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Hello! I am Locono AI. Type "SOS" for emergencies, or ask me about safety laws.' }
  ]);
  const chatEndRef = useRef(null);

  // --- FORMS ---
  const [complaintForm, setComplaintForm] = useState({
    type: 'Theft', location: '', description: '', latitude: null, longitude: null,
  });

  const [userProfile, setUserProfile] = useState({
    name: "Jeevesh C", email: "jeeveshc20@gmail.com", phone: "+91 98765 43210", bio: "Civilian User • Bangalore"
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const safetyTips = [
    { id: 1, title: "Night Travel", desc: "Share your live location with trusted contacts." },
    { id: 2, title: "Emergency Numbers", desc: "Police: 100, Fire: 101, Ambulance: 102." },
    { id: 3, title: "Crowded Areas", desc: "Keep your valuables in front pockets." },
    { id: 4, title: "Online Safety", desc: "Do not share OTPs with anyone claiming to be officials." },
    { id: 5, title: "Harassment", desc: "Use the SOS button immediately if you feel unsafe." },
  ];

  // --- EFFECTS ---

  // Scroll Chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // 1. LIVE GPS TRACKING & MOCK DATA GENERATION
  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          if (!userGps || Math.abs(userGps[0] - latitude) > 0.0001) {
              setUserGps([latitude, longitude]);
              
              setAllAlerts(prev => {
                  if(prev.some(a => a.isDynamic)) return prev;

                  const randomOffset = () => (Math.random() - 0.5) * 0.015; 
                  
                  const newNearbyAlerts = [
                      { 
                          id: 901, type: "Suspicious Activity", msg: "Reported in your immediate vicinity.", 
                          level: "alert-high", date: "Just now", 
                          coords: [latitude + randomOffset(), longitude + randomOffset()], 
                          isDynamic: true 
                      },
                      { 
                          id: 902, type: "Accident", msg: "Minor collision detected nearby.", 
                          level: "alert-med", date: "10 mins ago", 
                          coords: [latitude + randomOffset(), longitude + randomOffset()], 
                          isDynamic: true 
                      }
                  ];
                  return [...newNearbyAlerts, ...prev];
              });
          }

          setComplaintForm(prev => ({
            ...prev,
            location: `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            latitude: latitude,
            longitude: longitude,
          }));
        },
        (error) => {
          console.error("GPS Error:", error);
          toast.error("Location access denied or failed.", { id: 'gps-error' });
        },
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []); 

  // 2. PROCESS ALERTS (Calculate Distances)
  const processedAlerts = allAlerts.map(alert => {
      if (!userGps) return { ...alert, distance: 0 };
      const dist = calculateDistance(userGps[0], userGps[1], alert.coords[0], alert.coords[1]);
      return { ...alert, distance: dist.toFixed(2) }; 
  }).sort((a, b) => a.distance - b.distance); 

  const nearbyAlerts = processedAlerts.filter(a => parseFloat(a.distance) <= 2.0);
  
  // --- FIXED LOGIC HERE ---
  // If showAllAlerts is false, strictly show only the first 2 items.
  const displayList = showAllAlerts ? processedAlerts : processedAlerts.slice(0, 2);

  // --- HANDLERS ---
  
  const toggleFullscreenMap = () => {
    setIsMapFullscreen(!isMapFullscreen);
  };
  
  const handleAlertClick = (coords) => {
    if(coords) {
      setFocusedLocation(coords); 
      if(!isMapFullscreen) window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success("Locating alert on map...");
    }
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    setTimeout(() => window.location.reload(), 1000); 
  };

  // --- REAL BACKEND CHATBOT CONNECTION ---
  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    // 1. Add User Message to UI
    const userMsg = { sender: 'user', text: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    
    // Store input and clear field
    const messageToSend = chatInput;
    setChatInput("");

    try {
      // 2. Connect to Python Backend
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: messageToSend,
            user_id: "user_dashboard" 
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // 3. Process Response
      const data = await response.json();
      setChatHistory(prev => [...prev, { sender: 'bot', text: data.response }]);

    } catch (error) {
      console.error("Chat Error:", error);
      // Fallback if backend is offline
      setChatHistory(prev => [...prev, { 
        sender: 'bot', 
        text: "⚠️ Unable to reach LOCONO server. Please ensure the backend (main.py) is running." 
      }]);
    }
  };

  const handleSubmitComplaint = async () => {
    const loadingToastId = toast.loading("Submitting complaint...");
    try {
      const response = await fetch('http://127.0.0.1:8000/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintForm),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      toast.success(`Complaint Lodged! ID: #${result.data.id}`, { id: loadingToastId });
      setShowComplaintModal(false);
      setComplaintForm({ type: 'Theft', location: userGps ? `GPS: ${userGps[0].toFixed(4)}, ${userGps[1].toFixed(4)}` : '', description: '', latitude: null, longitude: null });

    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error(`Submission failed. Is Backend running?`, { id: loadingToastId });
    }
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        if (isMapFullscreen) {
            return (
                <div className="card" style={{ padding: 0, overflow: 'hidden', height: '100%', borderRadius: 0 }}>
                    <MapComponent 
                        userGps={userGps} 
                        focusedLocation={focusedLocation} 
                        isFullscreen={isMapFullscreen} 
                        toggleFullscreen={toggleFullscreenMap}
                        alerts={processedAlerts} 
                    />
                </div>
            );
        }

        return (
          <div className="grid-2-1">
            {/* Map Column */}
            <div className="card map-card-container" style={{ padding: 0, overflow: 'hidden', minHeight: '60vh' }}>
                <MapComponent 
                    userGps={userGps} 
                    focusedLocation={focusedLocation}
                    isFullscreen={isMapFullscreen} 
                    toggleFullscreen={toggleFullscreenMap}
                    alerts={processedAlerts} 
                />
            </div>

            {/* Actions Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card">
                <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle color="orange" size={20} /> 
                  Nearby Alerts ({nearbyAlerts.length})
                </h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {displayList.map(alert => {
                    const isNearby = parseFloat(alert.distance) <= 2.0;
                    return (
                        <div 
                        key={alert.id} 
                        className={`alert-box ${alert.level}`}
                        onClick={() => handleAlertClick(alert.coords)} 
                        style={{ 
                            cursor: 'pointer',
                            borderLeft: isNearby ? '5px solid #ff3b30' : '5px solid #ccc',
                            backgroundColor: isNearby ? '#fff5f5' : 'white'
                        }}
                        title="Click to locate on map"
                        >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{alert.type}</strong>
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>{alert.date}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>{alert.msg}</p>
                        <div style={{ fontSize: '0.8rem', marginTop: '5px', fontWeight: 'bold', color: isNearby ? 'red' : '#666' }}>
                            {alert.distance} km away {isNearby && "(Inside 2km Radius)"}
                        </div>
                        </div>
                    );
                  })}
                </div>
                <button className="view-more-btn" onClick={() => setShowAllAlerts(!showAllAlerts)}>
                  {showAllAlerts ? "Show Less" : "View More Alerts"}
                </button>
              </div>

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
                placeholder="Search safety tips..." 
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
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>Notifications</h2>
            {[1,2,3].map((n) => (
              <div key={n} style={{ display: 'flex', gap: '15px', padding: '15px', borderBottom: '1px solid #eee' }}>
                <div style={{ width: '12px', height: '12px', background: n===1 ? 'red' : '#ddd', borderRadius: '50%', marginTop: '6px' }}></div>
                <div>
                  <strong>{n===1 ? 'Emergency Alert' : 'System Update'}</strong>
                  <p style={{ fontSize: '0.9rem', color: '#555', marginTop: '4px' }}>
                    {n===1 ? 'Heavy traffic reported near your saved location.' : 'Your complaint status has been updated to "Reviewed".'}
                  </p>
                  <small style={{ color: '#ff0000ff' }}>{n} hours ago</small>
                </div>
              </div>
            ))}
          </div>
        );
      
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
                        <label>Name</label>
                        {isEditingProfile ? <input className="form-control" value={userProfile.name} onChange={(e)=>setUserProfile({...userProfile, name: e.target.value})}/> : <p>{userProfile.name}</p>}
                    </div>
                </div>
            </div>
        );

      default: return null;
    }
  };

  const containerClass = isMapFullscreen ? 'dashboard-container fullscreen-map-active' : 'dashboard-container';

  return (
    <div className={containerClass}>
      
      {/* --- SIDE MENU DRAWER (Hamburger) --- */}
      <div className={`side-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`side-menu-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>Menu</h3>
          <button onClick={() => setIsMenuOpen(false)}><X size={24}/></button>
        </div>
        
        <div className="drawer-profile">
            <div className="drawer-avatar">{userProfile.name.charAt(0)}</div>
            <div>
                <h4 style={{ margin: 0 }}>{userProfile.name}</h4>
                <small style={{ color: '#3d3b3bff' }}>{userProfile.email}</small>
            </div>
        </div>

        <div className="drawer-links">
            <button onClick={() => {setActiveTab('home'); setIsMenuOpen(false)}}><Home size={18}/> Home</button>
            <button onClick={() => {setActiveTab('profile'); setIsMenuOpen(false);}}><User size={18}/> My Profile</button>
            <button onClick={() => {setActiveTab('settings'); setIsMenuOpen(false);}}><Settings size={18}/> App Settings</button>
            <button><Phone size={18}/> Emergency Contacts</button>
            <hr style={{ width: '100%', borderTop: '1px solid #002affff' }} />
            <button style={{ color: 'var(--danger-color)' }} onClick={() => setShowLogoutConfirm(true)}>
                <LogOut size={18}/> Logout
            </button>
        </div>
      </div>

      {/* --- TOP NAVBAR --- */}
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
                  
                  <button className="nav-item menu-trigger" onClick={() => setIsMenuOpen(true)}>
                      <Menu size={24} />
                  </button>
              </div>
          </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="main-content">
        {renderContent()}
      </div>

      {/* --- MODALS --- */}
      
      {showComplaintModal && (
        <div className="modal-overlay">
            <div className="modal-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3>Forge Complaint</h3>
                    <button onClick={() => setShowComplaintModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                </div>
                <div className="form-group">
                    <label>Complaint Type</label>
                    <select className="form-control" value={complaintForm.type} onChange={(e) => setComplaintForm({...complaintForm, type: e.target.value})}>
                        <option>Theft</option><option>Harassment</option><option>Accident</option><option>Public Disturbance</option>
                    </select>
                </div>
                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        Location {userGps && <LocateFixed size={14} color="#1877f2" />}
                    </label>
                    <input type="text" className="form-control" value={complaintForm.location} onChange={(e) => setComplaintForm({...complaintForm, location: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea rows="4" className="form-control" value={complaintForm.description} onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}></textarea>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSubmitComplaint}>Submit Report</button>
            </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="modal-overlay">
            <div className="modal-box small-box" style={{ maxWidth: '350px', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '10px' }}>Are you sure?</h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>You will be returned to the login screen.</p>
                <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button className="btn btn-outline" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                    <button className="btn btn-danger" onClick={handleLogout}>Yes, Logout</button>
                </div>
            </div>
        </div>
      )}

      {/* --- CHATBOT --- */}
      <div className="chatbot-btn" onClick={() => setIsChatOpen(!isChatOpen)}>
        {isChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </div>
      
      {isChatOpen && (
        <div className="chatbot-window">
          <div className="chat-header">Locono Assistant</div>
          <div className="chat-body">
             {chatHistory.map((msg, idx) => (
                 <div key={idx} className={`chat-bubble ${msg.sender}`}>
                     {msg.text}
                 </div>
             ))}
             <div ref={chatEndRef}></div>
          </div>
          <div className="chat-footer">
            <input 
                type="text" 
                placeholder="Type 'SOS' or message..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
            />
            <button onClick={handleChatSubmit} style={{ background: 'var(--accent-color)', color: 'white', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Send size={16}/>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;