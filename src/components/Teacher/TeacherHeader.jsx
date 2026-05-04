import React from 'react';
import { motion } from 'framer-motion';

function TeacherHeader({ currentStudent, studentList, setCurrentStudent, handleResetStudent }) {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      className="glass"
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 28px', marginBottom: '24px',
        borderBottom: '1px solid rgba(244,114,182,0.2)',
        borderTop: '1px solid rgba(244,114,182,0.15)',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '12px',
          background: 'linear-gradient(135deg, #db2777, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', boxShadow: '0 4px 16px rgba(219,39,119,0.4)'
        }}>🌸</div>
        <div>
          <div className="text-gradient-pink" style={{ fontSize: '20px', fontWeight: 900, lineHeight: 1.1 }}>
            Divya-Drishti
          </div>
          <div className="uppercase-label" style={{ marginTop: 3 }}>Educator Portal · IoT Braille v3.2</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="btn-ghost"
          onClick={() => window.speechSynthesis.cancel()}
          title="Stop Agent Speech"
          style={{ padding: '8px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          ⏹ Stop Audio
        </motion.button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <span className="uppercase-label">Active Student</span>
          <select
            value={currentStudent}
            onChange={e => setCurrentStudent(e.target.value)}
            className="glass-input"
            style={{ padding: '8px 12px', minWidth: '180px', fontSize: '14px', fontWeight: 700 }}
          >
            {studentList.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="btn-danger"
          onClick={handleResetStudent}
          title="Erase Student Data"
        >
          ⚠ RESET
        </motion.button>
      </div>
    </motion.header>
  );
}

export default TeacherHeader;
