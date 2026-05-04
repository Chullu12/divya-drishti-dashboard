import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function StudentLogin({ studentList, setStudentName, setIsLogged }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      background: `
        radial-gradient(ellipse 80% 50% at 20% 0%, rgba(244,114,182,0.15) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 80%, rgba(96,165,250,0.12) 0%, transparent 60%)
      `
    }}>
      {/* Glow orbs */}
      <div style={{
        position: 'fixed', top: '20%', left: '10%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '20%', right: '10%',
        width: 250, height: 250, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 32,
          padding: '56px 48px',
          width: '100%', maxWidth: 420,
          textAlign: 'center',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #db2777, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto 24px',
            boxShadow: '0 12px 40px rgba(219,39,119,0.5)'
          }}
        >
          🌸
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gradient-pink"
          style={{ fontSize: 36, fontWeight: 900, marginBottom: 6 }}
        >
          Divya Drishti
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ color: 'var(--text-2)', fontSize: 13, marginBottom: 40, letterSpacing: '0.05em' }}
        >
          STUDENT LEARNING PORTAL
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <div style={{ textAlign: 'left' }}>
            <label className="uppercase-label" style={{ display: 'block', marginBottom: 8 }}>
              Select Your Name
            </label>
            <select
              id="sSel"
              className="glass-input"
              style={{ fontSize: 16, fontWeight: 600, padding: '14px 16px' }}
            >
              <option value="">-- Choose Your Name --</option>
              {studentList.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary"
            style={{ padding: '14px', fontSize: 16, letterSpacing: '0.05em', marginTop: 8 }}
            onClick={() => {
              const val = document.getElementById('sSel').value;
              if (val) {
                setStudentName(val);
                localStorage.setItem('myStudentName', val);
                setIsLogged(true);
              }
            }}
          >
            Enter Learning Hub →
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.8 }}
        style={{ marginTop: 24, fontSize: 12, color: 'var(--text-3)', textAlign: 'center' }}
      >
        IoT Braille Interface · Powered by AI
      </motion.p>
    </div>
  );
}

export default StudentLogin;
