import React from 'react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';

function VisionTab({ webcamRef, isScanning, executeAIScan }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}
    >
      {/* Camera viewport */}
      <div style={{
        flex: 1, position: 'relative', background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.6)'
      }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.8}
          videoConstraints={{ facingMode: 'environment', width: 1280, height: 720 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Corner brackets */}
        {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map(corner => (
          <div key={corner} style={{
            position: 'absolute',
            top: corner.includes('top') ? 16 : 'auto',
            bottom: corner.includes('bottom') ? 16 : 'auto',
            left: corner.includes('Left') ? 16 : 'auto',
            right: corner.includes('Right') ? 16 : 'auto',
            width: 28, height: 28,
            borderTop: corner.includes('top') ? '2px solid rgba(244,114,182,0.7)' : 'none',
            borderBottom: corner.includes('bottom') ? '2px solid rgba(244,114,182,0.7)' : 'none',
            borderLeft: corner.includes('Left') ? '2px solid rgba(244,114,182,0.7)' : 'none',
            borderRight: corner.includes('Right') ? '2px solid rgba(244,114,182,0.7)' : 'none',
          }} />
        ))}

        {/* Scanning overlay */}
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="scanning-overlay"
          >
            <div style={{
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(244,114,182,0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '20px 32px',
              textAlign: 'center',
              boxShadow: '0 8px 40px rgba(244,114,182,0.2)'
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <p style={{ fontWeight: 800, fontSize: 18, color: '#fff' }}>Analyzing Image...</p>
              <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>Powered by Groq AI</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Scan button */}
      <div style={{ padding: '14px 0 0 0', flexShrink: 0 }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={executeAIScan}
          disabled={isScanning}
          style={{
            width: '100%', padding: 22,
            background: isScanning
              ? 'rgba(255,255,255,0.05)'
              : 'linear-gradient(135deg, #db2777 0%, #7c3aed 100%)',
            color: '#fff', border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 900, fontSize: 20,
            cursor: isScanning ? 'not-allowed' : 'pointer',
            fontFamily: 'Outfit, sans-serif',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            boxShadow: isScanning
              ? 'none'
              : '0 8px 32px rgba(219,39,119,0.45)',
            transition: 'all 0.3s ease'
          }}
        >
          {isScanning ? '⏳ Processing...' : '📸 SCAN OBJECT'}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default VisionTab;
