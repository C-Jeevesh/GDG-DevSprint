import React, { useState } from 'react';
import UserDashboard from './UserDashboard';
import PoliceDashboard from './PoliceDashboard';
import './App.css';

function App() {
  const [role, setRole] = useState('user'); // 'user' or 'police'

  return (
    <div>
      {/* RENDER ACTIVE DASHBOARD */}
      {role === 'user' ? <UserDashboard /> : <PoliceDashboard />}

      {/* DEV ROLE SWITCHER (Bottom Right) */}
      <div style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
        background: '#333', padding: 10, borderRadius: 50, display: 'flex', gap: 10
      }}>
        <button onClick={() => setRole('user')} style={{ padding: '8px 15px', borderRadius: 20, border: 'none', background: role === 'user' ? '#0984e3' : 'transparent', color: 'white', cursor: 'pointer' }}>User View</button>
        <button onClick={() => setRole('police')} style={{ padding: '8px 15px', borderRadius: 20, border: 'none', background: role === 'police' ? '#d63031' : 'transparent', color: 'white', cursor: 'pointer' }}>Police View</button>
      </div>
    </div>
  );
}

export default App;