import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { keyToDot, brailleMap } from '../../utils/constants';

function ArenaMode({ globalArena, studentName, wordBuffer, setWordBuffer, currentCellDots, toggleDot, handleSpace, handleDelete, speak, onDismiss }) {
  const [feedback, setFeedback] = useState(null); // 'success' or 'error'

  const targetWord = globalArena.targetWord.toUpperCase();
  const currentIndex = wordBuffer.length;
  
  // Auditory cue on entry
  useEffect(() => {
    if (globalArena.isActive) {
      speak(`Tournament mode initiated! Spell the word: ${targetWord}`);
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
  }, [globalArena.timestamp]);

  // Handle local submission
  const checkSpace = useCallback(() => {
    if (currentCellDots.size === 0) return;
    const pattern = Array.from(currentCellDots).sort().join('');
    const character = brailleMap[pattern];
    
    if (!character || character === "?") {
      setFeedback('error');
      speak("Invalid Character");
      setTimeout(() => setFeedback(null), 500);
      return;
    }

    if (character === targetWord[currentIndex]) {
      setFeedback('success');
      speak(character);
      setWordBuffer(prev => prev + character);
      if (navigator.vibrate) navigator.vibrate(50);
      setTimeout(() => setFeedback(null), 500);
    } else {
      setFeedback('error');
      speak(`Wrong letter. We need ${targetWord[currentIndex]}`);
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      setTimeout(() => setFeedback(null), 500);
    }
  }, [currentCellDots, currentIndex, targetWord, setWordBuffer, speak]);

  const ZoneButton = ({ dotId, pcKey }) => {
    const isActive = currentCellDots.has(dotId);
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.85 }}
        onMouseDown={() => toggleDot(dotId)}
        onTouchStart={e => { e.preventDefault(); toggleDot(dotId); }}
        style={{
          flex: 1, margin: 8, minHeight: 80,
          background: isActive ? 'var(--pink)' : 'rgba(255,255,255,0.05)',
          border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: isActive ? '#fff' : 'var(--text-3)',
          boxShadow: isActive ? '0 0 20px var(--pink)' : 'none',
          cursor: 'pointer', transition: 'all 0.1s'
        }}
      >
        <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>DOT {dotId}</span>
        <span style={{ fontSize: 11, opacity: 0.5 }}>[{pcKey}]</span>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'radial-gradient(circle at center, #1e1b4b 0%, #000 100%)',
        display: 'flex', flexDirection: 'column', padding: '20px 5%'
      }}
    >
      {/* Exit Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onDismiss}
        style={{
          position: 'absolute', top: 20, right: 20,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'var(--text-2)', padding: '10px 16px',
          borderRadius: 'var(--radius-sm)', fontWeight: 700,
          cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
          zIndex: 10
        }}
      >
        ✕ Exit Arena
      </motion.button>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <h2 style={{ color: 'var(--pink)', letterSpacing: '0.2em', fontSize: 14, fontWeight: 800, animation: 'pulse 1.5s infinite' }}>
          ⚠️ GLOBAL OVERRIDE
        </h2>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, textTransform: 'uppercase', textShadow: '0 0 30px rgba(219,39,119,0.5)', margin: '10px 0' }}>
          TOURNAMENT MODE
        </h1>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {targetWord.split('').map((letter, idx) => (
            <motion.div
              key={idx}
              animate={feedback && idx === currentIndex ? { x: [-10, 10, -10, 10, 0] } : {}}
              style={{
                width: 'clamp(40px, 8vw, 80px)', height: 'clamp(60px, 12vw, 100px)',
                background: idx < currentIndex ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                border: idx < currentIndex ? '2px solid var(--green)' : '2px dashed rgba(255,255,255,0.2)',
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900,
                color: idx < currentIndex ? 'var(--green)' : (idx === currentIndex ? '#fff' : 'var(--text-3)'),
                boxShadow: idx < currentIndex ? '0 0 20px rgba(16,185,129,0.4)' : (idx === currentIndex ? '0 0 20px rgba(255,255,255,0.2)' : 'none'),
                borderBottom: idx === currentIndex ? '4px solid var(--pink)' : '',
                transition: 'all 0.3s'
              }}
            >
              {idx < currentIndex ? letter : (idx === currentIndex ? '?' : '')}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hardware Interface overlay */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 40, height: '35vh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <ZoneButton dotId={1} pcKey="F" />
          <ZoneButton dotId={2} pcKey="D" />
          <ZoneButton dotId={3} pcKey="S" />
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
           <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              style={{ padding: 20, background: 'rgba(239,68,68,0.2)', border: '1px solid var(--red)', color: 'var(--red)', borderRadius: 'var(--radius-sm)', fontWeight: 800, cursor: 'pointer' }}
            >
              ⌫ CLEAR CELL
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => {
                checkSpace();
                handleSpace(); // Just to clear dots if needed, but we intercept logic above
              }}
              style={{ padding: 30, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', borderRadius: 'var(--radius-sm)', fontWeight: 900, fontSize: 20, boxShadow: '0 0 30px rgba(16,185,129,0.4)', cursor: 'pointer' }}
            >
              ✓ SUBMIT LETTER
            </motion.button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <ZoneButton dotId={4} pcKey="J" />
          <ZoneButton dotId={5} pcKey="K" />
          <ZoneButton dotId={6} pcKey="L" />
        </div>
      </div>
    </motion.div>
  );
}

export default ArenaMode;
