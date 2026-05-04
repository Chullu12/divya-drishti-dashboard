import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function StudentHeader({ isListening, toggleMic, speak }) {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px', flexShrink: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        zIndex: 10,
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg, #db2777, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 4px 14px rgba(219,39,119,0.4)'
        }}>🌸</div>
        <div>
          <div className="text-gradient-pink" style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.1 }}>
            Divya-Drishti
          </div>
          <div className="uppercase-label" style={{ fontSize: 9, marginTop: 2 }}>Student Learning Hub</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => window.speechSynthesis.cancel()}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.06)',
            color: 'var(--text-2)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: '7px 12px',
            fontWeight: 600, fontSize: 12,
            cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
          }}
        >
          ⏹ Stop Audio
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
          onClick={toggleMic}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: isListening
              ? 'linear-gradient(135deg, #dc2626, #ef4444)'
              : 'linear-gradient(135deg, #db2777, #7c3aed)',
            color: '#fff', border: 'none',
            borderRadius: 10, padding: '8px 16px',
            fontWeight: 700, fontSize: 13,
            cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            boxShadow: isListening
              ? '0 4px 20px rgba(239,68,68,0.6)'
              : '0 4px 20px rgba(219,39,119,0.4)',
            animation: isListening ? 'voicePulse 1.2s ease-in-out infinite' : 'none'
          }}
        >
          {isListening ? '🔴 Listening...' : '🎙️ Mic Off (Tap to Wake)'}
        </motion.button>
      </div>
    </motion.header>
  );
}

export default StudentHeader;
