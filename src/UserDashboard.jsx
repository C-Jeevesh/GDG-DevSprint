import React, { useState } from 'react';
import { 
  Home, Search, Bell, User, Settings, Shield, 
  MapPin, AlertTriangle, MessageCircle, X, LogOut, Edit3, Save 
} from 'lucide-react';
import './App.css';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  // --- STATES FOR FEATURES ---
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (activeTab) {
      
      // 1. HOME TAB
      case 'home':
        // Logic: Show first 2 alerts, or all if showAllAlerts is true
        const displayedAlerts = showAllAlerts ? alertsData : alertsData.slice(0, 2);

        return (
          <div className="grid-2-1">
            {/* Left Column: Map */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: '400px' }}>
              <div style={{ width: '100%', height: '100%', background: '#e0e0e0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                <MapPin size={60} style={{ opacity: 0.6, marginBottom: 10 }} />
                <h3>Live Map View</h3>
                <p>Google Maps / Mapbox Integration Area</p>
              </div>
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

  return (
    <div className="dashboard-container">
      
      {/* --- TOP NAVIGATION BAR (HORIZONTAL) --- */}
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
              <select className="form-control">
                <option>Theft</option>
                <option>Harassment</option>
                <option>Accident</option>
                <option>Public Disturbance</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Location</label>
              <input type="text" className="form-control" placeholder="Use GPS or enter address" />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea rows="4" className="form-control" placeholder="Describe what happened..."></textarea>
            </div>

            <div className="form-group">
              <label>Evidence (Optional)</label>
              <input type="file" className="form-control" />
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { alert("Complaint Forged/Lodged Successfully!"); setShowComplaintModal(false); }}>
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