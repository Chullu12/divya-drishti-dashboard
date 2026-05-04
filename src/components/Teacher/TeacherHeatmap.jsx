import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../services/firebase';
import { ref, onValue, set, remove } from 'firebase/database';

function TeacherHeatmap() {
  const [targetWord, setTargetWord] = useState('');
  const [globalArena, setGlobalArena] = useState({ isActive: false, targetWord: '' });
  const [telemetry, setTelemetry] = useState({});

  useEffect(() => {
    const arenaRef = ref(db, 'Global_Arena');
    const unsubArena = onValue(arenaRef, (snapshot) => {
      if (snapshot.exists()) {
        setGlobalArena(snapshot.val());
      } else {
        setGlobalArena({ isActive: false, targetWord: '' });
      }
    });

    const telRef = ref(db, 'Arena_Telemetry');
    const unsubTel = onValue(telRef, (snapshot) => {
      if (snapshot.exists()) setTelemetry(snapshot.val());
      else setTelemetry({});
    });

    return () => { unsubArena(); unsubTel(); };
  }, []);

  const handleDeploy = () => {
    if (!targetWord.trim()) return;
    if (window.confirm(`Deploy GLOBAL OVERRIDE to all students with word: ${targetWord}?`)) {
      const cleanWord = targetWord.trim().toUpperCase();
      
      // Update Global Arena for UI override
      set(ref(db, 'Global_Arena'), {
        isActive: true,
        targetWord: cleanWord,
        timestamp: Date.now(),
        mode: 'TOURNAMENT'
      });
      
      // Simultaneously update Hardware Link to trigger the physical Braille IoT nodes
      set(ref(db, 'Hardware_Link'), { 
        target: cleanWord, 
        timestamp: Date.now(), 
        status: "STREAMING" 
      });

      // Clear old telemetry
      remove(ref(db, 'Arena_Telemetry'));
    }
  };

  const handleStop = () => {
    set(ref(db, 'Global_Arena/isActive'), false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      
      {/* Broadcast Module */}
      <div className="glass-card" style={{ padding: 30, marginBottom: 30, borderLeft: '4px solid var(--pink)' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>🚀</span> Global Broadcast Override
        </h2>
        <div style={{ display: 'flex', gap: 16 }}>
          <input 
            className="glass-input"
            style={{ flex: 1, fontSize: 18, textTransform: 'uppercase' }}
            placeholder="ENTER TARGET WORD (E.G., GALAXY)"
            value={targetWord}
            onChange={(e) => setTargetWord(e.target.value.toUpperCase())}
            disabled={globalArena.isActive}
          />
          {globalArena.isActive ? (
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleStop}
              style={{ padding: '16px 32px', background: 'rgba(239,68,68,0.2)', color: 'var(--red)', border: '1px solid var(--red)', borderRadius: 'var(--radius-sm)', fontWeight: 900, cursor: 'pointer' }}
            >
              ⏹ STOP ARENA
            </motion.button>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleDeploy}
              className="btn-primary"
              style={{ padding: '16px 32px', fontSize: 16 }}
            >
              DEPLOY ARENA OVERRIDE
            </motion.button>
          )}
        </div>
      </div>

      {/* Heatmap Leaderboard */}
      <h3 style={{ marginBottom: 20, color: 'var(--text-2)' }}>Live Telemetry Heatmap</h3>
      
      {Object.keys(telemetry).length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-2)', color: 'var(--text-3)' }}>
          Waiting for student data...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {Object.entries(telemetry).map(([student, data]) => {
            const isStuck = data.status === 'typing' && (Date.now() - data.lastKeystrokeTime > 8000);
            const isDone = data.status === 'completed';

            return (
              <motion.div 
                key={student}
                layout
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                style={{
                  padding: 20,
                  borderRadius: 'var(--radius-md)',
                  background: isDone ? 'rgba(16,185,129,0.1)' : (isStuck ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)'),
                  border: `1px solid ${isDone ? 'var(--green)' : (isStuck ? 'var(--amber)' : 'var(--border-2)')}`,
                  boxShadow: isStuck ? '0 0 20px rgba(245,158,11,0.2)' : 'none',
                  animation: isStuck ? 'pulse 2s infinite' : 'none',
                  position: 'relative', overflow: 'hidden'
                }}
              >
                {/* Background Progress Bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, bottom: 0,
                  width: `${data.progressPercentage}%`,
                  background: isDone ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                  zIndex: 0, transition: 'width 0.3s ease'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ margin: 0, fontSize: 18, color: 'var(--text-1)' }}>{student}</h4>
                    <span style={{ fontSize: 12, padding: '4px 8px', borderRadius: 99, background: isDone ? 'var(--green)' : (isStuck ? 'var(--amber)' : 'rgba(255,255,255,0.1)'), color: isDone || isStuck ? '#000' : '#fff', fontWeight: 800 }}>
                      {isDone ? 'DONE' : (isStuck ? 'STUCK' : 'TYPING')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: 12, color: 'var(--text-3)' }}>Current Input</p>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 800, color: isDone ? 'var(--green)' : '#fff', letterSpacing: '0.1em' }}>
                        {data.currentInput || '-'}
                      </div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-3)' }}>
                      {data.progressPercentage}%
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

export default TeacherHeatmap;
