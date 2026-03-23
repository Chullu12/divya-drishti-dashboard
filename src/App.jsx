import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing'; // This is the most important line!
import TeacherDash from './pages/TeacherDash';
import StudentPortal from './pages/StudentPortal';

function App() {
  const themeStyle = {
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
    minHeight: '100vh',
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(253, 242, 248, 0.95)), url('https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=2076&auto=format&fit=crop')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    color: '#334155',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <Router>
      <div style={themeStyle}>
        {/* NAVIGATION BAR */}
        <nav style={{ padding: '20px 40px', background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(244, 114, 182, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ color: '#db2777', margin: 0, fontSize: '26px', letterSpacing: '2px', fontWeight: '800' }}>
              🌸 DIVYA-DRISHTI
            </h1>
          </Link>
          <div style={{ display: 'flex', gap: '30px' }}>
            <Link to="/" style={{ color: '#475569', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
            <Link to="/teacher" style={{ color: '#be185d', textDecoration: 'none', fontWeight: 'bold' }}>Educator Portal</Link>
            <Link to="/student" style={{ color: '#ec4899', textDecoration: 'none', fontWeight: 'bold' }}>Student Access</Link>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <div style={{ flex: 1 }}>
          <Routes>
            {/* THIS IS THE FIX: We are now telling the "/" path to show the Landing component */}
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

