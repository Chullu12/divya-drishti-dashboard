import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ClassroomTab({
  currentTask, currentCellDots, wordBuffer, liveTranslation,
  toggleDot, handleSpace, handleDelete, cancelTutorTask
}) {
  const ZoneButton = ({ dotId, pcKey }) => {
    const isActive = currentCellDots.has(dotId);
    return (
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.88 }}
        onMouseDown={() => toggleDot(dotId)}
        onTouchStart={e => { e.preventDefault(); toggleDot(dotId); }}
        className={`dot-btn ${isActive ? 'active' : 'inactive'}`}
        style={{ flex: 1, margin: 5, minHeight: 70 }}
      >
        <span style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)', fontWeight: 900 }}>DOT {dotId}</span>
        <span style={{ fontSize: 11, opacity: 0.55, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>[ {pcKey} ]</span>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      style={{ flex: 1, display: 'flex', gap: 10, width: '100%', overflow: 'hidden' }}
    >
      {/* Left dots */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ZoneButton dotId={1} pcKey="F" />
        <ZoneButton dotId={2} pcKey="D" />
        <ZoneButton dotId={3} pcKey="S" />
      </div>

      {/* Center panel */}
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 10 }}>
        
        {/* Task / waiting display */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(219,39,119,0.25), rgba(124,58,237,0.2))',
          border: '1px solid rgba(244,114,182,0.3)',
          backdropFilter: 'blur(12px)',
          padding: 16, borderRadius: 'var(--radius-md)', textAlign: 'center',
          flex: 1, position: 'relative', overflow: 'hidden', display: 'flex',
          flexDirection: 'column', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(219,39,119,0.15)'
        }}>
          {/* Decorative corner glow */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: 120, height: 120,
            background: 'radial-gradient(circle, rgba(244,114,182,0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          {currentTask?.mode === 'TUTOR' ? (
            <>
              <p className="uppercase-label" style={{ color: 'rgba(244,114,182,0.8)', marginBottom: 8 }}>
                {currentTask.original_question}
              </p>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                {currentTask.target.split('').map((letter, idx) => (
                  <motion.span
                    key={idx}
                    animate={{ opacity: idx === currentTask.currentIndex ? 1 : 0.35, scale: idx === currentTask.currentIndex ? 1.1 : 1 }}
                    style={{
                      fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900,
                      color: idx < currentTask.currentIndex ? 'rgba(244,114,182,0.7)' : '#fff',
                      borderBottom: idx === currentTask.currentIndex ? '3px solid var(--pink)' : 'none',
                      display: 'inline-block', lineHeight: 1.1,
                      filter: idx === currentTask.currentIndex ? 'drop-shadow(0 0 12px rgba(244,114,182,0.8))' : 'none',
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
              {currentTask.story_fact && (
                <p style={{ fontSize: 13, color: 'rgba(244,114,182,0.7)', fontStyle: 'italic', margin: '6px 0' }}>
                  ✨ "{currentTask.story_fact}"
                </p>
              )}
              <p style={{ fontSize: 14, color: 'var(--text-1)', fontWeight: 700, marginTop: 4 }}>
                Type: <strong style={{ color: 'var(--pink)', fontSize: 20 }}>{currentTask.target[currentTask.currentIndex]}</strong>
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={cancelTutorTask}
                style={{
                  position: 'absolute', bottom: 10, right: 10,
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--text-2)', padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
                }}
              >
                ✕ Cancel
              </motion.button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                border: '2px dashed rgba(244,114,182,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'voicePulse 2.5s ease-in-out infinite'
              }}>
                ⏳
              </div>
              <p style={{ color: 'var(--text-2)', fontWeight: 600, fontSize: 14 }}>
                Waiting for Teacher...
              </p>
            </div>
          )}
        </div>

        {/* Word buffer display */}
        <div style={{
          background: 'rgba(0,0,0,0.35)',
          border: '1px dashed rgba(255,255,255,0.12)',
          borderRadius: 'var(--radius-md)', padding: '14px 18px',
          textAlign: 'center', flex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <h1 style={{
            color: 'var(--pink)', fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
            margin: 0, letterSpacing: 8, fontWeight: 900,
            filter: wordBuffer ? 'drop-shadow(0 0 14px rgba(244,114,182,0.7))' : 'none'
          }}>
            {wordBuffer}
            <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>{liveTranslation}</span>
            <span style={{ animation: 'blink 1s step-end infinite', color: 'var(--pink)' }}>_</span>
          </h1>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, height: 52 }}>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            style={{
              flex: 1, background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-sm)', fontWeight: 700,
              color: 'var(--text-2)', cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif', fontSize: 13
            }}
          >
            ⌫ CLEAR
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
            onClick={handleSpace}
            style={{
              flex: 2,
              background: 'linear-gradient(135deg, #059669, #047857)',
              border: 'none', borderRadius: 'var(--radius-sm)',
              fontWeight: 800, color: '#fff', cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif', fontSize: 13,
              boxShadow: '0 4px 16px rgba(5,150,105,0.4)'
            }}
          >
            ✓ ADD LETTER
          </motion.button>
        </div>
      </div>

      {/* Right dots */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ZoneButton dotId={4} pcKey="J" />
        <ZoneButton dotId={5} pcKey="K" />
        <ZoneButton dotId={6} pcKey="L" />
      </div>
    </motion.div>
  );
}

export default ClassroomTab;
