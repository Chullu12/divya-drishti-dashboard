import os

components_dir = "d:\\Divya-Drishti-Project\\src\\components\\Student"
os.makedirs(components_dir, exist_ok=True)

# 1. StudentLogin.jsx
student_login_content = """import React from 'react';

function StudentLogin({ studentList, setStudentName, setIsLogged }) {
  return (
    <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif', background: '#fdf2f8', minHeight: '100vh' }}>
      <h1 style={{ color: '#db2777', fontSize: '42px' }}>Divya Drishti Portal</h1>
      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', display: 'inline-block', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <select id="sSel" style={{ padding: '15px', fontSize: '18px', borderRadius: '10px', width: '250px', border: '2px solid #fbcfe8' }}>
          <option value="">Choose Your Name</option>
          {studentList.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <button 
          style={{ padding: '15px 40px', marginLeft: '15px', background: '#db2777', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }} 
          onClick={() => { 
            const val = document.getElementById('sSel').value; 
            if (val) { 
              setStudentName(val); 
              localStorage.setItem("myStudentName", val); 
              setIsLogged(true); 
            } 
          }}
        >
          Enter Hub
        </button>
      </div>
    </div>
  );
}

export default StudentLogin;
"""
with open(os.path.join(components_dir, "StudentLogin.jsx"), "w", encoding="utf-8") as f:
    f.write(student_login_content)

# 2. StudentHeader.jsx
student_header_content = """import React from 'react';

function StudentHeader({ isListening, toggleMic, speak }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '10px 5%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', zIndex: 10 }}>
      <h1 style={{ color: '#db2777', margin: 0, fontSize: '20px' }}>🌸 Divya-Drishti</h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div 
          onClick={toggleMic}
          style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              color: isListening ? '#10b981' : '#ef4444', 
              fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', 
              padding: '6px 12px', borderRadius: '12px',
              backgroundColor: isListening ? '#ecfdf5' : '#fef2f2',
              border: `2px solid ${isListening ? '#10b981' : '#ef4444'}`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s'
          }}
        >
          <span style={{ height: '12px', width: '12px', backgroundColor: isListening ? '#10b981' : '#ef4444', borderRadius: '50%', display: 'inline-block', animation: isListening ? 'pulse 1.5s infinite' : 'none' }}></span>
          {isListening ? "Listening (Tap to Pause)" : "Mic Off (Tap to Wake)"}
        </div>
      </div>
    </header>
  );
}

export default StudentHeader;
"""
with open(os.path.join(components_dir, "StudentHeader.jsx"), "w", encoding="utf-8") as f:
    f.write(student_header_content)

# 3. BottomNav.jsx
bottom_nav_content = """import React from 'react';

function BottomNav({ activeTab, setActiveTab, speak }) {
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-around', padding: '15px 0', boxShadow: '0 -4px 10px rgba(0,0,0,0.05)', zIndex: 100 }}>
      <button onClick={() => {setActiveTab('classroom'); speak('Classroom Mode');}} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: activeTab === 'classroom' ? 1 : 0.5, color: activeTab === 'classroom' ? '#db2777' : '#4b5563' }}>
        <span style={{ fontSize: '24px', marginBottom: '5px' }}>🏫</span>
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Classroom</span>
      </button>
      <button onClick={() => {setActiveTab('vision'); speak('AI Vision Mode');}} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: activeTab === 'vision' ? 1 : 0.5, color: activeTab === 'vision' ? '#db2777' : '#4b5563' }}>
        <span style={{ fontSize: '24px', marginBottom: '5px' }}>📷</span>
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Vision Scan</span>
      </button>
      <button onClick={() => {setActiveTab('fluency'); speak('Encyclopedia Mode');}} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: activeTab === 'fluency' ? 1 : 0.5, color: activeTab === 'fluency' ? '#db2777' : '#4b5563' }}>
        <span style={{ fontSize: '24px', marginBottom: '5px' }}>🧠</span>
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Encyclopedia</span>
      </button>
    </nav>
  );
}

export default BottomNav;
"""
with open(os.path.join(components_dir, "BottomNav.jsx"), "w", encoding="utf-8") as f:
    f.write(bottom_nav_content)

# 4. ClassroomTab.jsx
classroom_tab_content = """import React from 'react';

function ClassroomTab({ 
  currentTask, currentCellDots, wordBuffer, liveTranslation, 
  toggleDot, handleSpace, handleDelete, cancelTutorTask 
}) {
  const ZoneButton = ({ dotId, pcKey }) => {
    const isActive = currentCellDots.has(dotId);
    return (
      <div 
        onMouseDown={() => toggleDot(dotId)} 
        onTouchStart={(e) => { e.preventDefault(); toggleDot(dotId); }} 
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          backgroundColor: isActive ? '#db2777' : '#fff', color: isActive ? '#fff' : '#db2777',
          border: `4px solid ${isActive ? '#be185d' : '#fbcfe8'}`, borderRadius: '16px',
          margin: '5px', cursor: 'pointer', transition: 'all 0.05s ease', userSelect: 'none', touchAction: 'none'
        }}
      >
        <span style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', fontWeight: '900' }}>DOT {dotId}</span>
        <span style={{ fontSize: '12px', opacity: 0.6, marginTop: '5px' }}>Key: {pcKey}</span>
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: 'flex', gap: '10px', width: '100%', animation: 'fadeIn 0.3s' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ZoneButton dotId={1} pcKey="F" />
        <ZoneButton dotId={2} pcKey="D" />
        <ZoneButton dotId={3} pcKey="S" />
      </div>

      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ backgroundColor: '#db2777', padding: '15px', borderRadius: '16px', textAlign: 'center', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, position: 'relative', overflow: 'hidden' }}>
          
          {currentTask && currentTask.mode === 'TUTOR' ? (
            <>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#fbcfe8', textTransform: 'uppercase', zIndex: 1 }}>{currentTask.original_question}</h3>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '10px 0 5px 0', zIndex: 1, flexWrap: 'wrap' }}>
                {currentTask.target.split('').map((letter, idx) => (
                  <span key={idx} style={{
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '900',
                    color: idx < currentTask.currentIndex ? '#fbcfe8' : (idx === currentTask.currentIndex ? '#fff' : 'rgba(255,255,255,0.3)'),
                    borderBottom: idx === currentTask.currentIndex ? '4px solid #fff' : 'none',
                  }}>{letter}</span>
                ))}
              </div>
              {currentTask.story_fact && <p style={{ margin: '5px 0 15px 0', fontSize: '15px', color: '#fbcfe8', fontStyle: 'italic' }}>✨ "{currentTask.story_fact}"</p>}
              <p style={{ margin: '0', fontSize: '16px', color: '#fff', fontWeight: 'bold' }}>Type the letter: <strong style={{ fontSize: '24px', color: '#fbcfe8' }}>{currentTask.target[currentTask.currentIndex]}</strong></p>

              <button onClick={cancelTutorTask} style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', zIndex: 2 }}>
                  ❌ CANCEL & SCAN AGAIN
              </button>
            </>
          ) : (
            <h1 style={{ margin: 0, fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 'bold' }}>Waiting for Teacher...</h1>
          )}
        </div>

        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '16px', textAlign: 'center', flex: 1, border: '4px dashed #fbcfe8', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ color: '#db2777', fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0, letterSpacing: '5px' }}>
            {wordBuffer}<span style={{ color: '#9ca3af' }}>{liveTranslation}</span><span style={{ animation: 'blink 1s step-end infinite', color: '#db2777' }}>_</span>
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px', height: '60px' }}>
          <button onClick={handleDelete} style={{ flex: 1, backgroundColor: '#f3f4f6', border: 'none', borderRadius: '12px', fontWeight: 'bold', color: '#4b5563' }}>CLEAR</button>
          <button onClick={handleSpace} style={{ flex: 2, backgroundColor: '#10b981', border: 'none', borderRadius: '12px', fontWeight: 'bold', color: '#fff' }}>ADD LETTER</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ZoneButton dotId={4} pcKey="J" />
        <ZoneButton dotId={5} pcKey="K" />
        <ZoneButton dotId={6} pcKey="L" />
      </div>
    </div>
  );
}

export default ClassroomTab;
"""
with open(os.path.join(components_dir, "ClassroomTab.jsx"), "w", encoding="utf-8") as f:
    f.write(classroom_tab_content)

# 5. VisionTab.jsx
vision_tab_content = """import React from 'react';
import Webcam from 'react-webcam';

function VisionTab({ webcamRef, isScanning, executeAIScan }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s', backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      
      <div style={{ flex: 2, backgroundColor: '#000', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" screenshotQuality={0.7} videoConstraints={{ facingMode: "environment", width: 640, height: 480 }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {isScanning && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(219, 39, 119, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ color: '#fff', fontSize: '32px', textShadow: '0 4px 10px rgba(0,0,0,0.5)', animation: 'blink 1s infinite' }}>⏳ Analyzing...</h2>
          </div>
        )}
      </div>

      <div style={{ flex: 1.5, padding: '15px', display: 'flex', flexDirection: 'column', backgroundColor: '#fdf2f8' }}>
        <button 
          onClick={executeAIScan} disabled={isScanning}
          style={{ width: '100%', padding: '25px', fontSize: '24px', background: isScanning ? '#fbcfe8' : '#e11d48', color: 'white', border: '4px solid #9f1239', borderRadius: '16px', fontWeight: '900', cursor: isScanning ? 'not-allowed' : 'pointer', textTransform: 'uppercase' }}
        >
          {isScanning ? "Processing Image..." : "📸 PRESS HERE TO SCAN"}
        </button>
      </div>
    </div>
  );
}

export default VisionTab;
"""
with open(os.path.join(components_dir, "VisionTab.jsx"), "w", encoding="utf-8") as f:
    f.write(vision_tab_content)

# 6. EncyclopediaTab.jsx
encyclopedia_tab_content = """import React from 'react';

function EncyclopediaTab({ 
  currentTask, speak, chatMessages, isChatLoading, isChatMicActive, 
  startChatMic, chatInput, setChatInput, handleSendChat, setActiveTab
}) {
  if (!currentTask || !currentTask.detailed_explanation) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.6, animation: 'fadeIn 0.3s', backgroundColor: '#fff', borderRadius: '16px', padding: '20px' }}>
        <span style={{ fontSize: '60px', marginBottom: '20px' }}>🔍</span>
        <h3 style={{ color: '#4b5563' }}>No Object Scanned Yet</h3>
        <p style={{ color: '#6b7280', maxWidth: '400px', textAlign: 'center', lineHeight: '1.5' }}>
          Head over to the Vision tab, scan a real-world object, and come back here to ask questions about it!
        </p>
        <button onClick={() => setActiveTab('vision')} style={{ marginTop: '20px', padding: '10px 20px', background: '#db2777', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>GO TO VISION SCANNER</button>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s', backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '20px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #fbcfe8', paddingBottom: '10px', marginBottom: '10px' }}>
            <h1 style={{ fontSize: '28px', margin: 0, color: '#be185d', textTransform: 'uppercase' }}>
              🧠 {currentTask.target}
            </h1>
            <button 
              onClick={() => speak(currentTask.detailed_explanation)}
              style={{ padding: '8px 15px', fontSize: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🔊 Read Summary
            </button>
        </div>

        <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.5', margin: '0 0 15px 0', backgroundColor: '#fdf2f8', padding: '15px', borderRadius: '12px' }}>
            {currentTask.detailed_explanation}
        </p>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ alignSelf: 'flex-start', background: '#e0e7ff', padding: '10px 15px', borderRadius: '12px', maxWidth: '85%', color: '#3730a3', fontSize: '15px' }}>
                    Hi! I am ready to answer any questions you have about the <strong>{currentTask.target}</strong>. Ask me anything!
                </div>
                
                {chatMessages.map((msg, idx) => (
                    <div key={idx} style={{ 
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', 
                        background: msg.role === 'user' ? '#db2777' : '#f3f4f6', 
                        color: msg.role === 'user' ? '#fff' : '#1f2937', 
                        padding: '10px 15px', borderRadius: '12px', maxWidth: '85%', fontSize: '15px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                        {msg.content}
                    </div>
                ))}

                {isChatLoading && (
                    <div style={{ alignSelf: 'flex-start', background: '#f3f4f6', padding: '10px 15px', borderRadius: '12px', color: '#6b7280', fontStyle: 'italic', fontSize: '14px' }}>
                        Thinking...
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', padding: '10px', backgroundColor: '#fff', borderTop: '1px solid #e5e7eb', alignItems: 'center' }}>
                <button 
                    onClick={startChatMic}
                    style={{ 
                        background: isChatMicActive ? '#ef4444' : '#f3f4f6', 
                        color: isChatMicActive ? '#fff' : '#4b5563',
                        border: 'none', borderRadius: '50%', width: '45px', height: '45px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        cursor: 'pointer', marginRight: '10px', transition: 'all 0.2s',
                        animation: isChatMicActive ? 'pulse 1.5s infinite' : 'none'
                    }}
                >
                    <span style={{ fontSize: '20px' }}>🎤</span>
                </button>

                <input 
                    type="text" 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
                    placeholder={isChatMicActive ? "Listening..." : `Ask about the ${currentTask.target}...`}
                    style={{ flex: 1, padding: '12px 15px', borderRadius: '25px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px', background: '#f9fafb' }}
                />
                
                <button 
                    onClick={() => handleSendChat()}
                    disabled={isChatLoading || (!chatInput.trim() && !isChatMicActive)}
                    style={{ background: '#db2777', color: '#fff', border: 'none', borderRadius: '25px', padding: '0 20px', height: '45px', marginLeft: '10px', fontWeight: 'bold', cursor: 'pointer', opacity: (isChatLoading || (!chatInput.trim() && !isChatMicActive)) ? 0.5 : 1 }}
                >
                    SEND
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}

export default EncyclopediaTab;
"""
with open(os.path.join(components_dir, "EncyclopediaTab.jsx"), "w", encoding="utf-8") as f:
    f.write(encyclopedia_tab_content)

# Refactor StudentPortal.jsx
import re
with open("d:\\Divya-Drishti-Project\\src\\pages\\StudentPortal.jsx", "r", encoding="utf-8") as f:
    portal_content = f.read()

# Replace imports
new_imports = """import React, { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../services/firebase';
import { ref, onValue, set } from 'firebase/database';
import { brailleMap, keyToDot } from '../utils/constants';

import StudentLogin from '../components/Student/StudentLogin';
import StudentHeader from '../components/Student/StudentHeader';
import ClassroomTab from '../components/Student/ClassroomTab';
import VisionTab from '../components/Student/VisionTab';
import EncyclopediaTab from '../components/Student/EncyclopediaTab';
import BottomNav from '../components/Student/BottomNav';
"""

# We need to remove the Webcam import and replace the React/firebase imports
portal_content = re.sub(r"import React.*?\nimport Webcam from 'react-webcam';\n", new_imports, portal_content, flags=re.DOTALL)

# Remove the inline definitions of brailleMap and keyToDot from the component body
portal_content = re.sub(r"\s+const brailleMap = \{.*?^\s+\};\n", "", portal_content, flags=re.DOTALL|re.MULTILINE)
portal_content = re.sub(r"\s+const keyToDot = \{.*?\};\n", "", portal_content, flags=re.DOTALL|re.MULTILINE)

# Now find the `if (!isLogged)` and the rest of the return, and replace it
new_return = """  if (!isLogged) { 
    return <StudentLogin studentList={studentList} setStudentName={setStudentName} setIsLogged={setIsLogged} />;
  }

  const currentPattern = Array.from(currentCellDots).sort().join('');
  const liveTranslation = brailleMap[currentPattern] || (currentCellDots.size > 0 ? "?" : "");

  const toggleMic = () => {
    if (isListening) { recognitionRef.current?.stop(); speak("Microphone paused."); } 
    else { try { recognitionRef.current?.start(); } catch(e){} speak("Microphone active."); }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fdf2f8', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      
      <StudentHeader isListening={isListening} toggleMic={toggleMic} speak={speak} />

      <main style={{ flex: 1, display: 'flex', padding: '10px', gap: '10px', paddingBottom: '90px', overflowY: 'auto' }}>
        {activeTab === 'classroom' && (
          <ClassroomTab
            currentTask={currentTask}
            currentCellDots={currentCellDots}
            wordBuffer={wordBuffer}
            liveTranslation={liveTranslation}
            toggleDot={toggleDot}
            handleSpace={handleSpace}
            handleDelete={handleDelete}
            cancelTutorTask={cancelTutorTask}
          />
        )}

        {activeTab === 'vision' && (
          <VisionTab
            webcamRef={webcamRef}
            isScanning={isScanning}
            executeAIScan={executeAIScan}
          />
        )}

        {activeTab === 'fluency' && (
          <EncyclopediaTab
            currentTask={currentTask}
            speak={speak}
            chatMessages={chatMessages}
            isChatLoading={isChatLoading}
            isChatMicActive={isChatMicActive}
            startChatMic={startChatMic}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleSendChat={handleSendChat}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} speak={speak} />

      <style>{`
        @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.5); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default StudentPortal;"""

portal_content = re.sub(
    r"  if \(!isLogged\).*?export default StudentPortal;\n?",
    new_return + "\n",
    portal_content,
    flags=re.DOTALL
)

with open("d:\\Divya-Drishti-Project\\src\\pages\\StudentPortal.jsx", "w", encoding="utf-8") as f:
    f.write(portal_content)
