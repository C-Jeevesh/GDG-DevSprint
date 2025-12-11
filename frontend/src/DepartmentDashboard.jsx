import React, { useState } from 'react';
import { 
  Hammer, AlertTriangle, CheckCircle, Map, List, 
  Construction, LocateFixed 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import './App.css';
import PoliceMapComponent from './PoliceMapComponent'; // Reusing map for now

const DepartmentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Infrastructure Data
  const [issues, setIssues] = useState([
    { id: 'INF-001', type: 'Pothole', location: 'MG Road, Cross 4', severity: 'Risky', status: 'Open', reported: '2 days ago' },
    { id: 'INF-002', type: 'Broken Street Light', location: 'Sector 5 Park', severity: 'Moderate', status: 'In Progress', reported: '1 day ago' },
    { id: 'INF-003', type: 'Water Logging', location: 'Underpass 2', severity: 'Risky', status: 'Open', reported: '4 hours ago' },
    { id: 'INF-004', type: 'Faded Zebra Crossing', location: 'School Zone', severity: 'Low', status: 'Resolved', reported: '1 week ago' },
  ]);

  const handleRepairAction = (id) => {
    toast.success(`Maintenance Crew assigned to ${id}`);
    setIssues(prev => prev.map(i => i.id === id ? { ...i, status: 'In Progress' } : i));
  };

  const handleResolve = (id) => {
    toast.success(`Issue ${id} marked as Resolved`);
    setIssues(prev => prev.map(i => i.id === id ? { ...i, status: 'Resolved' } : i));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid-2-1">
            <div className="card" style={{padding:0, overflow:'hidden', minHeight:'500px'}}>
                <PoliceMapComponent />
                <div style={{position:'absolute', bottom:20, left:20, background:'white', padding:'10px', borderRadius:'8px', boxShadow:'0 2px 10px rgba(0,0,0,0.2)', zIndex:999}}>
                    <h5>Infra Legend</h5>
                    <div style={{display:'flex', alignItems:'center', gap:'5px', fontSize:'0.8rem'}}><span style={{width:10, height:10, background:'red', borderRadius:'50%'}}></span> Risky</div>
                    <div style={{display:'flex', alignItems:'center', gap:'5px', fontSize:'0.8rem'}}><span style={{width:10, height:10, background:'orange', borderRadius:'50%'}}></span> Moderate</div>
                </div>
            </div>
            
            <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                <div className="card">
                    <h3>Priority Repairs</h3>
                    <div style={{marginTop:'15px'}}>
                        {issues.filter(i => i.severity === 'Risky' && i.status !== 'Resolved').map(issue => (
                            <div key={issue.id} style={{borderLeft:'4px solid #d63031', background:'#fff5f5', padding:'10px', marginBottom:'10px', borderRadius:'4px'}}>
                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                    <strong>{issue.type}</strong>
                                    <span style={{color:'#d63031', fontWeight:'bold', fontSize:'0.8rem'}}>RISKY</span>
                                </div>
                                <p style={{fontSize:'0.9rem', color:'#666', margin:'5px 0'}}>{issue.location}</p>
                                <button className="btn-action" onClick={() => handleRepairAction(issue.id)} style={{width:'100%', marginTop:'5px'}}>Dispatch Crew</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card">
                    <h3>Quick Stats</h3>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                        <span>Open Potholes</span> <strong>12</strong>
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <span>Crews Active</span> <strong>4</strong>
                    </div>
                </div>
            </div>
          </div>
        );

      case 'issues':
        return (
            <div className="card">
                <h3>Infrastructure Issues List</h3>
                <div className="table-header">
                    <span>ID</span><span>Issue</span><span>Location</span><span>Severity</span><span>Status</span><span>Action</span>
                </div>
                {issues.map(issue => (
                    <div key={issue.id} className="table-row">
                        <span>{issue.id}</span>
                        <span>{issue.type}</span>
                        <span>{issue.location}</span>
                        <span style={{
                            color: issue.severity === 'Risky' ? 'red' : issue.severity === 'Moderate' ? 'orange' : 'green',
                            fontWeight: 'bold'
                        }}>{issue.severity}</span>
                        <span className="status-badge" style={{
                            background: issue.status === 'Open' ? '#fab1a0' : issue.status === 'In Progress' ? '#74b9ff' : '#55efc4',
                            color: '#2d3436'
                        }}>{issue.status}</span>
                        <div>
                            {issue.status !== 'Resolved' && (
                                <button className="btn-action" onClick={() => handleResolve(issue.id)}>Mark Fixed</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );

      default: return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar" style={{ background: '#e67e22' }}>
        <div className="logo-area" style={{ color: 'white' }}><Construction size={28} /> WORKS DEPT</div>
        <div className="nav-links">
          <button className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')} style={{color:'white'}}><Map /> Map View</button>
          <button className={`nav-btn ${activeTab === 'issues' ? 'active' : ''}`} onClick={() => setActiveTab('issues')} style={{color:'white'}}><List /> Issue List</button>
        </div>
      </div>
      <div className="main-content">
        <div className="header-bar">
          <div className="page-title">Infrastructure Maintenance</div>
          <div className="user-pill" style={{ background: '#d35400', color: 'white' }}>Engineer Admin</div>
        </div>
        <div className="content-scroll-area">{renderContent()}</div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;