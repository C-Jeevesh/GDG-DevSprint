import React, { useState } from 'react';
import UserDashboard from './UserDashboard';
import PoliceDashboard from './PoliceDashboard';
import DepartmentDashboard from './DepartmentDashboard'; // New Component
import './App.css';
import { Toaster } from 'react-hot-toast';

function App() {
  const [role, setRole] = useState('user'); // 'user', 'police', or 'dept'

  return (
    <div>
      {/* RENDER ACTIVE DASHBOARD */}
      {role === 'user' && <UserDashboard />}
      {role === 'police' && <PoliceDashboard />}
      {role === 'dept' && <DepartmentDashboard />}

      {/* GLOBAL TOASTER */}
      <Toaster position="top-right" reverseOrder={false} /> 

      {/* DEV ROLE SWITCHER (Bottom Right - For Testing) */}
      <div style={{
        position: 'fixed', bottom: 20, center: 20, zIndex: 9999,
        background: '#2d3436', padding: '10px 15px', borderRadius: 50, 
        display: 'flex', gap: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
      }}>
        <button onClick={() => setRole('user')} style={{ padding: '8px 12px', borderRadius: 20, border: 'none', background: role === 'user' ? '#0984e3' : '#636e72', color: 'white', cursor: 'pointer', fontSize:'0.8rem' }}>User</button>
        <button onClick={() => setRole('police')} style={{ padding: '8px 12px', borderRadius: 20, border: 'none', background: role === 'police' ? '#d63031' : '#636e72', color: 'white', cursor: 'pointer', fontSize:'0.8rem' }}>Police</button>
        <button onClick={() => setRole('dept')} style={{ padding: '8px 12px', borderRadius: 20, border: 'none', background: role === 'dept' ? '#e67e22' : '#636e72', color: 'white', cursor: 'pointer', fontSize:'0.8rem' }}>Dept</button>
      </div>
    </div>
  );
}

export default App;