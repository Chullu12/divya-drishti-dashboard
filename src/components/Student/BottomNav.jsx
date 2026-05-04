import React from 'react';
import { motion } from 'framer-motion';

const TABS = [
  { key: 'classroom', label: 'Classroom',   icon: '🏫' },
  { key: 'vision',    label: 'Vision Scan',  icon: '📷' },
  { key: 'fluency',   label: 'Encyclopedia', icon: '🧠' },
];

function BottomNav({ activeTab, setActiveTab, speak }) {
  return (
    <motion.nav
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      className="bottom-nav"
    >
      {TABS.map(({ key, label, icon }) => (
        <motion.button
          key={key}
          whileTap={{ scale: 0.9 }}
          className={`bottom-nav-item ${activeTab === key ? 'active' : 'inactive'}`}
          onClick={() => { setActiveTab(key); speak(label + ' mode.'); }}
        >
          <span className="nav-icon">{icon}</span>
          <span className="nav-label">{label}</span>
          {activeTab === key && (
            <motion.div
              layoutId="nav-indicator"
              style={{
                position: 'absolute',
                top: 0, left: '20%', right: '20%',
                height: 2,
                background: 'linear-gradient(90deg, transparent, var(--pink), transparent)',
                borderRadius: 99,
              }}
            />
          )}
        </motion.button>
      ))}
    </motion.nav>
  );
}

export default BottomNav;
