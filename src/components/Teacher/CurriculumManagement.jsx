import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SUBJECTS = [
  { key: 'English',  icon: '📖', color: '#f472b6', glow: 'rgba(244,114,182,0.3)' },
  { key: 'Math',     icon: '📐', color: '#60a5fa', glow: 'rgba(96,165,250,0.3)'  },
  { key: 'Science',  icon: '🔬', color: '#34d399', glow: 'rgba(52,211,153,0.3)'  },
  { key: 'History',  icon: '🏛️', color: '#fbbf24', glow: 'rgba(251,191,36,0.3)'  },
];

function CurriculumManagement({
  cloudQuestions, selectedTests, setSelectedTests, deployTest,
  newQSubject, setNewQSubject, newQuestion, setNewQuestion, newAnswer, setNewAnswer, handleAddQuestion
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {SUBJECTS.map(({ key, icon, color, glow }) => (
          <motion.div
            key={key}
            whileHover={{ y: -2 }}
            className="glass-card"
            style={{ padding: 22, borderLeft: `3px solid ${color}` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ fontWeight: 800, fontSize: 16, color }}>{key}</span>
              <span className="uppercase-label" style={{ marginLeft: 'auto' }}>Curriculum</span>
            </div>

            <select
              className="glass-input"
              style={{ marginBottom: 12 }}
              value={selectedTests[key] || 0}
              onChange={e => setSelectedTests(p => ({ ...p, [key]: parseInt(e.target.value) }))}
            >
              {cloudQuestions?.[key]?.map((q, i) => (
                <option key={i} value={i}>Q{i + 1}: {q.q}</option>
              )) ?? <option>No questions yet</option>}
            </select>

            {cloudQuestions?.[key] && (
              <div style={{
                marginBottom: 14, padding: '10px 12px',
                background: 'rgba(0,0,0,0.3)',
                border: `1px dashed ${color}44`,
                borderRadius: 'var(--radius-sm)',
                fontSize: 13, color: color, lineHeight: 1.5
              }}>
                <strong>Expected Answer:</strong>{' '}
                {cloudQuestions[key][selectedTests[key] || 0]?.a}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => deployTest(key)}
              style={{
                width: '100%', padding: '10px',
                background: `linear-gradient(135deg, ${color}22, ${color}11)`,
                color, border: `1px solid ${color}44`,
                borderRadius: 'var(--radius-sm)',
                fontWeight: 800, cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
                fontSize: 13, letterSpacing: '0.06em',
                boxShadow: `0 4px 16px ${glow}`,
                transition: 'all 0.2s ease'
              }}
            >
              ▶ DEPLOY TO STUDENT
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Add Custom Question */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span style={{ fontSize: 18 }}>➕</span>
          <span style={{ fontWeight: 800, color: 'var(--green)', fontSize: 15 }}>Add Custom Question</span>
          <span className="uppercase-label" style={{ marginLeft: 'auto' }}>Cloud Database</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr auto', gap: 12, alignItems: 'center' }}>
          <select
            className="glass-input"
            value={newQSubject}
            onChange={e => setNewQSubject(e.target.value)}
            style={{ width: 'auto', padding: '11px 14px' }}
          >
            {SUBJECTS.map(({ key }) => <option key={key}>{key}</option>)}
          </select>
          <input
            className="glass-input"
            placeholder="Type Question (e.g. Spell CAT)"
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
          />
          <input
            className="glass-input"
            placeholder="Answer (e.g. CAT)"
            value={newAnswer}
            onChange={e => setNewAnswer(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={handleAddQuestion}
            style={{
              padding: '11px 20px',
              background: 'linear-gradient(135deg, #059669, #047857)',
              color: '#fff', border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 800, cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif', fontSize: 13,
              boxShadow: '0 4px 14px rgba(5,150,105,0.4)',
              whiteSpace: 'nowrap'
            }}
          >
            ↑ SAVE TO CLOUD
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default CurriculumManagement;
