import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    // We use a relative container to overlay a beautiful animated mesh gradient
    <div style={{ position: 'relative', width: '100%', minHeight: '85vh', fontFamily: "'Segoe UI', Tahoma, sans-serif", padding: '20px 0' }}>
      
      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: auto auto;
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .bento-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          padding: 40px;
          border: 1px solid rgba(255, 255, 255, 1);
          box-shadow: 0 20px 40px rgba(219, 39, 119, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .bento-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 60px rgba(219, 39, 119, 0.15);
        }

        .hero-span { grid-column: span 2; }
        
        .gradient-text {
          background: linear-gradient(135deg, #db2777, #7e22ce);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .mesh-bg {
          position: absolute;
          top: -100px; left: -100px; right: -100px; bottom: -100px;
          background: 
            radial-gradient(circle at 15% 50%, rgba(244, 114, 182, 0.15), transparent 25%),
            radial-gradient(circle at 85% 30%, rgba(167, 139, 250, 0.15), transparent 25%);
          z-index: -1;
          animation: breath 10s ease-in-out infinite alternate;
        }

        @keyframes breath {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }

        .primary-btn {
          background: #db2777;
          color: white;
          padding: 15px 30px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: bold;
          font-size: 16px;
          display: inline-block;
          box-shadow: 0 10px 20px rgba(219, 39, 119, 0.3);
          transition: all 0.2s;
        }
        .primary-btn:hover { background: #be185d; transform: scale(1.05); }

        .secondary-btn {
          background: white;
          color: #db2777;
          padding: 15px 30px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: bold;
          font-size: 16px;
          display: inline-block;
          border: 2px solid #fbcfe8;
          transition: all 0.2s;
        }
        .secondary-btn:hover { background: #fdf2f8; transform: scale(1.05); }
      `}</style>

      <div className="mesh-bg"></div>

      <div className="bento-grid">
        
        {/* HERO CARD (Spans 2 columns) */}
        <div className="bento-card hero-span" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'inline-block', padding: '8px 15px', background: '#fce7f3', color: '#db2777', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', alignSelf: 'flex-start', marginBottom: '20px' }}>
            🎓 SILICON UNIVERSITY CAPSTONE // ECE V6.0
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#0f172a', margin: '0 0 20px 0', lineHeight: '1.1' }}>
            Vision through <br/><span className="gradient-text">Tactile Sensation.</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#475569', lineHeight: '1.6', maxWidth: '90%', margin: '0 0 30px 0' }}>
            Divya-Drishti merges ESP32 hardware matrices with real-time Firebase cloud telemetry, redefining accessibility and pedagogy for the visually impaired.
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/teacher" className="primary-btn">🎛️ Launch Educator Portal</Link>
            <Link to="/student" className="secondary-btn">🎧 Open Student Interface</Link>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(253,242,248,0.9) 100%)' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#fbcfe8', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '50px', boxShadow: '0 10px 20px rgba(219, 39, 119, 0.2)' }}>
            👨‍💻
          </div>
          <h3 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '22px' }}>Pratyush Mohanty</h3>
          <p style={{ margin: 0, color: '#db2777', fontWeight: 'bold', fontSize: '14px' }}>Lead Systems Engineer</p>
          <div style={{ width: '40px', height: '4px', background: '#db2777', borderRadius: '2px', margin: '20px 0' }}></div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Faculty Supervisor</p>
          <p style={{ margin: '5px 0 0 0', color: '#334155', fontWeight: 'bold' }}>Prof. D. P. Pradhan</p>
        </div>

        {/* FEATURE 1: HARDWARE */}
        <div className="bento-card" style={{ borderTop: '6px solid #10b981' }}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>⚡</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '20px' }}>ESP32 Edge Array</h3>
          <p style={{ margin: 0, color: '#64748b', lineHeight: '1.5' }}>Sub-millimeter servo actuation controlled by dual-core microcontrollers for instant physical Braille rendering.</p>
        </div>

        {/* FEATURE 2: CLOUD */}
        <div className="bento-card" style={{ borderTop: '6px solid #0ea5e9' }}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>☁️</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '20px' }}>NoSQL Telemetry</h3>
          <p style={{ margin: 0, color: '#64748b', lineHeight: '1.5' }}>Bidirectional Firebase sync ensuring zero-latency data transfer between the Educator dashboard and the Student portal.</p>
        </div>

        {/* FEATURE 3: AI AUDIO */}
        <div className="bento-card" style={{ borderTop: '6px solid #8b5cf6' }}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>🗣️</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '20px' }}>Auditory Pedagogy</h3>
          <p style={{ margin: 0, color: '#64748b', lineHeight: '1.5' }}>Web Speech API integration providing real-time acoustic feedback and algorithmic curriculum guidance.</p>
        </div>

      </div>
    </div>
  );
}

export default Landing;
