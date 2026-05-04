import React from 'react';
import { motion } from 'framer-motion';

function ControlDashboard({
  deploySmartLesson, isAILoading, alphabets, selectedAlpha, setSelectedAlpha, pushManualChar,
  numbers, selectedNum, setSelectedNum, specialChars, selectedSpecial, setSelectedSpecial,
  streamText, setStreamText, handleStream, stats, exportCSV, terminalLogs
}) {
  const SectionTitle = ({ icon, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span className="uppercase-label" style={{ color: 'var(--text-1)', fontSize: 11, letterSpacing: '0.1em' }}>{title}</span>
    </div>
  );

  const OverrideRow = ({ label, icon, color, glowColor, value, onChange, options, onClick }) => (
    <div style={{ marginBottom: 16 }}>
      <SectionTitle icon={icon} title={label} />
      <div style={{ display: 'flex', gap: 10 }}>
        <select
          className="glass-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ flex: 1, padding: '10px 12px' }}
        >
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={onClick}
          style={{
            padding: '10px 22px', background: `linear-gradient(135deg, ${color}, ${glowColor})`,
            color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)',
            fontWeight: 700, cursor: 'pointer', fontSize: 13,
            boxShadow: `0 4px 14px ${glowColor}55`,
            fontFamily: 'Outfit, sans-serif'
          }}
        >
          PUSH
        </motion.button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}
    >
      {/* ── Left Panel: Controls ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        
        {/* Deploy AI Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={deploySmartLesson}
          disabled={isAILoading}
          style={{
            width: '100%', padding: '18px',
            background: isAILoading
              ? 'rgba(255,255,255,0.05)'
              : 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
            fontWeight: 800, fontSize: 15, cursor: isAILoading ? 'not-allowed' : 'pointer',
            fontFamily: 'Outfit, sans-serif', letterSpacing: '0.03em',
            boxShadow: isAILoading ? 'none' : '0 6px 24px rgba(124,58,237,0.45)',
            transition: 'all 0.3s ease'
          }}
        >
          {isAILoading ? '⏳ Analyzing Student Data...' : '🧠 Deploy AI Adaptive Lesson'}
        </motion.button>

        {/* Character Overrides */}
        <div className="glass-card" style={{ padding: 20 }}>
          <OverrideRow
            label="Alphabet Override" icon="🔤" color="#db2777" glowColor="#9d174d"
            value={selectedAlpha} onChange={setSelectedAlpha} options={alphabets}
            onClick={() => pushManualChar(selectedAlpha, 'Manual Alpha')}
          />
          <OverrideRow
            label="Number Override" icon="🔢" color="#0ea5e9" glowColor="#0369a1"
            value={selectedNum} onChange={setSelectedNum} options={numbers}
            onClick={() => pushManualChar(selectedNum, 'Manual Num')}
          />
          <OverrideRow
            label="Special Character Override" icon="✨" color="#7c3aed" glowColor="#5b21b6"
            value={selectedSpecial} onChange={setSelectedSpecial} options={specialChars}
            onClick={() => pushManualChar(selectedSpecial, 'Manual Special')}
          />
        </div>

        {/* Word Streaming */}
        <div className="glass-card" style={{ padding: 20 }}>
          <SectionTitle icon="🌊" title="Word Streaming Engine" />
          <input
            className="glass-input"
            style={{ marginBottom: 12 }}
            placeholder="Enter word to stream..."
            value={streamText}
            onChange={e => setStreamText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStream()}
          />
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleStream}
            style={{
              width: '100%', padding: '12px',
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              color: 'var(--teal)', border: '1px solid rgba(45,212,191,0.3)',
              borderRadius: 'var(--radius-sm)', fontWeight: 800, cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif', letterSpacing: '0.08em',
              fontSize: 13, boxShadow: '0 4px 16px rgba(45,212,191,0.15)'
            }}
          >
            START WORD STREAM ▶
          </motion.button>
        </div>
      </div>

      {/* ── Right Panel: Analytics + Terminal ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-badge"
            style={{ borderBottom: '2px solid var(--blue)' }}
          >
            <div className="value" style={{ color: 'var(--blue)' }}>{stats.accuracy}<span style={{ fontSize: 20 }}>%</span></div>
            <div className="label">Accuracy</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-badge"
            style={{ borderBottom: '2px solid var(--red)' }}
          >
            <div className="value" style={{ color: 'var(--red)' }}>{stats.errors}</div>
            <div className="label">Errors</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-badge"
            style={{ borderBottom: '2px solid var(--green)' }}
          >
            <div className="value" style={{ color: 'var(--green)' }}>{stats.total}</div>
            <div className="label">Attempts</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-badge"
            style={{ borderBottom: '2px solid var(--pink)' }}
          >
            <div className="value" style={{ color: 'var(--pink)', fontSize: 26 }}>LIVE</div>
            <div className="label">Status</div>
          </motion.div>
        </div>

        {/* Terminal */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }} />
              <span className="uppercase-label" style={{ color: 'var(--teal)' }}>📡 Live Telemetry Uplink</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={exportCSV}
              style={{
                background: 'rgba(52,211,153,0.1)', color: 'var(--green)',
                border: '1px solid rgba(52,211,153,0.3)', borderRadius: 'var(--radius-sm)',
                padding: '5px 12px', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif', fontSize: 12
              }}
            >
              ↓ EXPORT
            </motion.button>
          </div>
          <div
            className="terminal"
            style={{ flex: 1, height: 320, overflowY: 'auto' }}
          >
            {terminalLogs.length === 0
              ? <span style={{ color: 'var(--text-3)' }}>Awaiting events...</span>
              : terminalLogs.map((log, i) => (
                <div key={i} style={{
                  padding: '3px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  color: log.includes('[STUDENT]') ? 'var(--amber)'
                    : log.includes('Error') ? 'var(--red)'
                    : log.includes('SYSTEM') ? 'var(--blue)'
                    : 'var(--text-2)',
                  animation: i === 0 ? 'fadeInUp 0.3s ease' : 'none'
                }}>
                  {log}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ControlDashboard;
