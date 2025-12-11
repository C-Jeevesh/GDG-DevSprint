import React, { useState } from 'react';
import { 
  Shield, Map, FileText, Bell, Radio, Camera, 
  AlertOctagon, Siren, Ambulance, X, Video
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import './App.css';
import PoliceMapComponent from './PoliceMapComponent'; 

const PoliceDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCCTV, setShowCCTV] = useState(false);
  
  // Mock Complaints
  const [complaints, setComplaints] = useState([
    { id: 101, type: 'Theft', loc: 'Sector 4', time: '10:00 AM', status: 'Pending', severity: 'Low' },
    { id: 102, type: 'Accident', loc: 'Main Road', time: '10:15 AM', status: 'Dispatched', severity: 'Critical' },
    { id: 103, type: 'Traffic Violation', loc: 'Signal 12', time: '11:00 AM', status: 'Pending', severity: 'Medium' }
  ]);

  // Handlers
  const updateStatus = (id) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved' } : c));
    toast.success(`Report #${id} marked as Resolved`);
  };

  const handleHospitalAlert = () => {
    toast.loading("Contacting nearest hospitals...", { duration: 2000 });
    setTimeout(() => {
        toast.success("🚑 Alert sent to City Hospital & Green Cross Trauma Center!");
    }, 2000);
  };

  const handleQuickAlert = (type) => {
    toast.error(`ALERT BROADCAST: ${type} reported! Units dispatched.`);
  };

  const renderContent = () => {
    switch (activeTab) {
      
      case 'dashboard':
        return (
          <div className="grid-2-1">
            {/* LEFT COLUMN: MAP */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: '500px', position:'relative' }}>
              <PoliceMapComponent />
              
              {/* CCTV Overlay Button */}
              <button 
                onClick={() => setShowCCTV(true)}
                style={{
                    position: 'absolute', top: 10, left: 10, zIndex: 1000,
                    background: 'rgba(0,0,0,0.7)', color: '#00cec9', border: '1px solid #00cec9',
                    padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
                }}
              >
                <Video size={16} /> View CCTV Grid
              </button>
            </div>

            {/* RIGHT COLUMN: ACTIONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Live Status */}
              <div className="card" style={{ background: '#2c3e50', color: 'white' }}>
                <h3><Radio style={{ display: 'inline', color: '#e74c3c' }} /> Live Feed</h3>
                <p style={{ fontSize: '0.9rem', marginTop: 10, opacity: 0.8, borderLeft: '3px solid #e74c3c', paddingLeft: '10px' }}>
                  Unit P-04 responding to Sector 4.<br/>
                  <small style={{color:'#bdc3c7'}}>12:42 PM</small>
                </p>
                <p style={{ fontSize: '0.9rem', marginTop: 10, opacity: 0.8, borderLeft: '3px solid #f1c40f', paddingLeft: '10px' }}>
                  Traffic block reported at MG Road.<br/>
                  <small style={{color:'#bdc3c7'}}>12:38 PM</small>
                </p>
              </div>

              {/* Quick Alerts Grid */}
              <div className="card">
                <h3>Quick Alerts</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                    <button className="btn-outline" style={{ borderColor: '#d63031', color: '#d63031', display:'flex', flexDirection:'column', alignItems:'center', padding:'15px' }} onClick={() => handleQuickAlert('Traffic Violation')}>
                        <AlertOctagon size={24} /> 
                        <span style={{fontSize:'0.7rem', marginTop:'5px'}}>Traffic Violation</span>
                    </button>
                    <button className="btn-outline" style={{ borderColor: '#e17055', color: '#e17055', display:'flex', flexDirection:'column', alignItems:'center', padding:'15px' }} onClick={() => handleQuickAlert('Road Block')}>
                        <Shield size={24} /> 
                        <span style={{fontSize:'0.7rem', marginTop:'5px'}}>Road Block</span>
                    </button>
                    <button className="btn-outline" style={{ borderColor: '#6c5ce7', color: '#6c5ce7', display:'flex', flexDirection:'column', alignItems:'center', padding:'15px' }} onClick={() => handleQuickAlert('Suspicious Activity')}>
                        <Camera size={24} /> 
                        <span style={{fontSize:'0.7rem', marginTop:'5px'}}>CCTV Flag</span>
                    </button>
                    <button className="btn-outline" style={{ borderColor: '#00b894', color: '#00b894', display:'flex', flexDirection:'column', alignItems:'center', padding:'15px' }} onClick={handleHospitalAlert}>
                        <Ambulance size={24} /> 
                        <span style={{fontSize:'0.7rem', marginTop:'5px'}}>Notify Hospital</span>
                    </button>
                </div>
              </div>

            </div>
          </div>
        );

      case 'complaints':
        return (
          <div className="card">
            <h3 style={{ marginBottom: 20 }}>Active Incidents</h3>
            <div className="table-header">
              <span>Type</span><span>Location</span><span>Severity</span><span>Status</span><span>Action</span>
            </div>
            {complaints.map(c => (
              <div key={c.id} className="table-row">
                <span style={{ fontWeight: 'bold' }}>{c.type}</span>
                <span>{c.loc}</span>
                <span style={{ 
                    color: c.severity === 'Critical' ? 'red' : c.severity === 'Medium' ? 'orange' : 'green',
                    fontWeight: 'bold'
                }}>{c.severity}</span>
                <span className="status-badge" style={{ 
                  background: c.status === 'Pending' ? '#ffeaa7' : '#55efc4', 
                  color: c.status === 'Pending' ? '#d35400' : '#00b894' 
                }}>{c.status}</span>
                <div style={{display:'flex', gap:'5px'}}>
                    <button className="btn-action" onClick={() => updateStatus(c.id)}>Resolve</button>
                    {c.type === 'Accident' && (
                        <button className="btn-action" style={{background:'#d63031', color:'white'}} onClick={handleHospitalAlert} title="Notify Hospital">
                            <Ambulance size={14}/>
                        </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        );

      case 'broadcast':
        return (
          <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ color: 'var(--danger-color)', marginBottom: 20, display:'flex', alignItems:'center', gap:'10px' }}>
                <Siren /> Public Warning System
            </h2>
            <label style={{ display: 'block', marginBottom: 10 }}>Alert Category</label>
            <select className="form-control" style={{ marginBottom: 20 }}>
                <option>Major Traffic Jam</option>
                <option>Road Accident / Blockage</option>
                <option>Natural Disaster</option>
                <option>Fugitive Alert</option>
            </select>
            <label style={{ display: 'block', marginBottom: 10 }}>Message to Citizens</label>
            <textarea className="form-control" rows="4" style={{ marginBottom: 20 }} placeholder="Enter location and avoid instructions..."></textarea>
            <button className="btn-action" style={{ width: '100%', background: 'var(--danger-color)', color: 'white', padding:'15px', fontSize:'1rem' }}>
                BROADCAST ALERT
            </button>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <div className="sidebar" style={{ background: '#2d3436' }}>
        <div className="logo-area" style={{ color: '#dfe6e9' }}><Shield size={28} /> POLICE</div>
        <div className="nav-links">
          <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')} style={{color:'#b2bec3'}}><Map /> Dashboard</button>
          <button className={`nav-btn ${activeTab === 'complaints' ? 'active' : ''}`} onClick={() => setActiveTab('complaints')} style={{color:'#b2bec3'}}><FileText /> Incidents</button>
          <button className={`nav-btn ${activeTab === 'broadcast' ? 'active' : ''}`} onClick={() => setActiveTab('broadcast')} style={{color:'#b2bec3'}}><Bell /> Broadcast</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-content">
        <div className="header-bar">
          <div className="page-title">Command Center</div>
          <div className="user-pill" style={{ background: '#2d3436', color: 'white' }}>Officer Jeevesh</div>
        </div>
        <div className="content-scroll-area">{renderContent()}</div>
      </div>

      {/* CCTV MODAL */}
      {showCCTV && (
        <div className="modal-overlay" style={{zIndex: 9999}}>
            <div className="modal-box" style={{width: '800px', maxWidth:'90vw', background:'#000'}}>
                <div style={{display:'flex', justifyContent:'space-between', color:'white', marginBottom:'10px'}}>
                    <h3>CCTV Surveillance Grid</h3>
                    <button onClick={() => setShowCCTV(false)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}><X/></button>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', height:'400px'}}>
                    <div style={{background:'#333', display:'flex', alignItems:'center', justifyContent:'center', color:'#555'}}>CAM 01 - Main Rd</div>
                    <div style={{background:'#333', display:'flex', alignItems:'center', justifyContent:'center', color:'#555'}}>CAM 02 - Sector 4</div>
                    <div style={{background:'#333', display:'flex', alignItems:'center', justifyContent:'center', color:'#555'}}>CAM 03 - Signal</div>
                    <div style={{background:'#333', display:'flex', alignItems:'center', justifyContent:'center', color:'#555'}}>CAM 04 - Market</div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PoliceDashboard;