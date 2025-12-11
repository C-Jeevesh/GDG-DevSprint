import React, { useState } from 'react';
import { Shield, Map, FileText, Bell, Users, CheckCircle, Radio } from 'lucide-react';
import './App.css';
import PoliceMapComponent from './PoliceMapComponent'; // <-- IMPORTED MAP COMPONENT

const PoliceDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Fake Data
  const [complaints, setComplaints] = useState([
    { id: 101, type: 'Theft', loc: 'Sector 4', time: '10:00 AM', status: 'Pending' },
    { id: 102, type: 'Accident', loc: 'Main Road', time: '10:15 AM', status: 'Dispatched' }
  ]);

  const updateStatus = (id) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved' } : c));
  };

  const renderContent = () => {
    switch (activeTab) {
      
      case 'dashboard':
        return (
          <div className="grid-2-1">
            {/* ------------------------------------------ */}
            {/* MAP VIEW AREA - REPLACED WITH LIVE MAP     */}
            {/* ------------------------------------------ */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: '500px' }}>
              <PoliceMapComponent />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="card">
                <h3>Station Overview</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
                  <span>Active Units</span><strong style={{ color: 'var(--success-color)' }}>12</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Critical Alerts</span><strong style={{ color: 'var(--danger-color)' }}>3</strong>
                </div>
              </div>
              <div className="card" style={{ flex: 1, background: '#2c3e50', color: 'white' }}>
                <h3><Radio style={{ display: 'inline' }} /> Live Feed</h3>
                <p style={{ fontSize: '0.9rem', marginTop: 10, opacity: 0.8 }}>Unit P-04 responding to Sector 4...</p>
              </div>
            </div>
          </div>
        );

      case 'complaints':
        return (
          <div className="card">
            <h3 style={{ marginBottom: 20 }}>Incoming Reports</h3>
            <div className="table-header">
              <span>ID</span><span>Type</span><span>Location</span><span>Time</span><span>Status</span><span>Action</span>
            </div>
            {complaints.map(c => (
              <div key={c.id} className="table-row">
                <strong>#{c.id}</strong>
                <span>{c.type}</span>
                <span>{c.loc}</span>
                <span>{c.time}</span>
                <span className="status-badge" style={{ 
                  background: c.status === 'Pending' ? '#ffeaa7' : '#55efc4', 
                  color: c.status === 'Pending' ? '#d35400' : '#00b894' 
                }}>{c.status}</span>
                <button className="btn-action" onClick={() => updateStatus(c.id)}>Resolve</button>
              </div>
            ))}
          </div>
        );

      case 'broadcast':
        return (
          <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ color: 'var(--danger-color)', marginBottom: 20 }}>Issue Public Alert</h2>
            <label style={{ display: 'block', marginBottom: 10 }}>Alert Type</label>
            <select style={{ marginBottom: 20 }}><option>Traffic</option><option>Disaster</option></select>
            <label style={{ display: 'block', marginBottom: 10 }}>Message</label>
            <textarea rows="4" style={{ marginBottom: 20 }}></textarea>
            <button className="btn-action" style={{ width: '100%', background: 'var(--danger-color)', color: 'white' }}>BROADCAST</button>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar" style={{ background: '#f8f9fa' }}>
        <div className="logo-area" style={{ color: '#2c3e50' }}><Shield size={28} /> POLICE</div>
        <div className="nav-links">
          <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><Map /> Dashboard</button>
          <button className={`nav-btn ${activeTab === 'complaints' ? 'active' : ''}`} onClick={() => setActiveTab('complaints')}><FileText /> Complaints</button>
          <button className={`nav-btn ${activeTab === 'broadcast' ? 'active' : ''}`} onClick={() => setActiveTab('broadcast')}><Bell /> Broadcast</button>
        </div>
      </div>
      <div className="main-content">
        <div className="header-bar">
          <div className="page-title">Control Room</div>
          <div className="user-pill" style={{ background: '#2c3e50', color: 'white' }}>Officer Jeevesh</div>
        </div>
        <div className="content-scroll-area">{renderContent()}</div>
      </div>
    </div>
  );
};

export default PoliceDashboard;