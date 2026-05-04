import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import Landing from './pages/Landing'; // This is the most important line!
import TeacherDash from './pages/TeacherDash';
import StudentPortal from './pages/StudentPortal';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* PREMIUM NAVIGATION BAR */}
        <nav style={{
          padding: '16px 48px',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000
        }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '10px',
              background: 'linear-gradient(135deg, #db2777, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', boxShadow: '0 4px 14px rgba(219,39,119,0.4)'
            }}>🌸</div>
            <h1 style={{ color: '#fff', margin: 0, fontSize: '22px', letterSpacing: '0.05em', fontWeight: '900', textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
              DIVYA<span style={{ color: '#f472b6' }}>DRISHTI</span>
            </h1>
          </Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link to="/" className="nav-tab inactive" style={{ textDecoration: 'none', border: 'none' }}>Home</Link>
            <Link to="/teacher" className="btn-ghost" style={{ textDecoration: 'none', color: '#60a5fa', borderColor: 'rgba(96,165,250,0.3)' }}>Educator Portal</Link>
            <Link to="/student" className="btn-primary" style={{ textDecoration: 'none' }}>Student Access</Link>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <div style={{ flex: 1, paddingTop: '68px' }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/teacher" element={<TeacherDash />} />
            <Route path="/student" element={<StudentPortal />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

