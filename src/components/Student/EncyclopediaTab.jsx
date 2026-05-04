import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function EncyclopediaTab({
  currentTask, speak, chatMessages, isChatLoading, isChatMicActive,
  startChatMic, chatInput, setChatInput, handleSendChat, setActiveTab
}) {
  if (!currentTask || !currentTask.detailed_explanation) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 32, textAlign: 'center'
        }}
      >
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 40px', maxWidth: 360,
          boxShadow: '0 16px 48px rgba(0,0,0,0.4)'
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 10, color: 'var(--text-1)' }}>
            No Object Scanned
          </h3>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 24, fontSize: 14 }}>
            Head to the Vision tab, scan a real-world object, and come back here to ask questions about it!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="btn-primary"
            onClick={() => setActiveTab('vision')}
            style={{ padding: '12px 24px' }}
          >
            📷 Go to Vision Scanner
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: 12 }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingBottom: 12,
        borderBottom: '1px solid rgba(244,114,182,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🧠</span>
          <h2 className="text-gradient-pink" style={{ fontWeight: 900, fontSize: 22, margin: 0, textTransform: 'uppercase' }}>
            {currentTask.target}
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => speak(currentTask.detailed_explanation)}
          style={{
            padding: '8px 14px', background: 'rgba(52,211,153,0.1)',
            color: 'var(--green)', border: '1px solid rgba(52,211,153,0.3)',
            borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif', fontSize: 12
          }}
        >
          🔊 Read Aloud
        </motion.button>
      </div>

      {/* Summary */}
      <div style={{
        background: 'rgba(96,165,250,0.06)',
        border: '1px solid rgba(96,165,250,0.15)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px', fontSize: 14,
        color: 'var(--text-2)', lineHeight: 1.7
      }}>
        {currentTask.detailed_explanation}
      </div>

      {/* Chat window */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden', minHeight: 0
      }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            alignSelf: 'flex-start',
            background: 'rgba(96,165,250,0.12)',
            border: '1px solid rgba(96,165,250,0.2)',
            padding: '10px 14px', borderRadius: 12,
            maxWidth: '85%', color: 'var(--blue)', fontSize: 14, lineHeight: 1.5
          }}>
            Hi! I'm ready to answer any questions about <strong>{currentTask.target}</strong>. Ask me anything!
          </div>

          {chatMessages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #db2777, #7c3aed)'
                  : 'rgba(255,255,255,0.07)',
                border: msg.role === 'user'
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.1)',
                padding: '10px 14px', borderRadius: 12,
                maxWidth: '85%', fontSize: 14, lineHeight: 1.5,
                color: '#fff',
                boxShadow: msg.role === 'user' ? '0 4px 16px rgba(219,39,119,0.3)' : 'none'
              }}
            >
              {msg.content}
            </motion.div>
          ))}

          {isChatLoading && (
            <div style={{
              alignSelf: 'flex-start',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '10px 14px', borderRadius: 12,
              color: 'var(--text-3)', fontStyle: 'italic', fontSize: 13
            }}>
              Thinking...
            </div>
          )}
        </div>

        {/* Input bar */}
        <div style={{
          display: 'flex', padding: '10px 12px', gap: 10, alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={startChatMic}
            style={{
              width: 42, height: 42, borderRadius: '50%',
              background: isChatMicActive
                ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                : 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 18, flexShrink: 0,
              boxShadow: isChatMicActive ? '0 0 20px rgba(239,68,68,0.5)' : 'none',
              animation: isChatMicActive ? 'voicePulse 1.2s infinite' : 'none'
            }}
          >
            🎤
          </motion.button>

          <input
            className="glass-input"
            style={{ flex: 1, borderRadius: 99, padding: '10px 16px', fontSize: 14 }}
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendChat()}
            placeholder={isChatMicActive ? 'Listening...' : `Ask about the ${currentTask.target}...`}
          />

          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => handleSendChat()}
            disabled={isChatLoading || !chatInput.trim()}
            className="btn-primary"
            style={{ padding: '10px 18px', fontSize: 13, flexShrink: 0 }}
          >
            Send ↑
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default EncyclopediaTab;
