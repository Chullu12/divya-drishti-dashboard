import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { ref, onValue, set, remove } from 'firebase/database';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyA89jMg3iGXmKCI7AmeDHzEI7lmUcCgTJQ');

function TeacherDash() {
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. STATE MANAGEMENT & PERSISTENCE
  // ═══════════════════════════════════════════════════════════════════════════
  const [educatorName, setEducatorName] = useState(() => localStorage.getItem("educatorName") || "Prof. Debi Prasad Pradhan");
  const [currentStudent, setCurrentStudent] = useState(() => localStorage.getItem("selectedStudent") || "");
  const [studentList, setStudentList] = useState([]);
  const [newStudentInput, setNewStudentInput] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const [stats, setStats] = useState({ total: 0, errors: 0, accuracy: 100 });
  const [terminalLogs, setTerminalLogs] = useState(["System Ready..."]);
  const [exportData, setExportData] = useState([]);
  
  const [cloudQuestions, setCloudQuestions] = useState(null);
  const [selectedTests, setSelectedTests] = useState({ English: 0, Math: 0, Science: 0, History: 0 });

  const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const specialChars = ["!", "?", ".", ",", "+", "-", "=", "*", "/"];
  
  const [selectedAlpha, setSelectedAlpha] = useState("A");
  const [selectedNum, setSelectedNum] = useState("0");
  const [selectedSpecial, setSelectedSpecial] = useState("!");

  const [streamText, setStreamText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // 🟢 NEW: Global Telemetry Logger
  const logTelemetry = (msg) => {
    if (!currentStudent) return;
    set(ref(db, `Learning_Logs/${currentStudent}/Telemetry/${Date.now()}`), `[TEACHER] ${msg}`);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. DATA SYNCHRONIZATION
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => { localStorage.setItem("educatorName", educatorName); }, [educatorName]);
  useEffect(() => { if (currentStudent) localStorage.setItem("selectedStudent", currentStudent); }, [currentStudent]);

  useEffect(() => {
    const rootRef = ref(db, '/');
    const unsubscribe = onValue(rootRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.Learning_Logs) {
          const names = Object.keys(data.Learning_Logs);
          setStudentList(names);
          if (!currentStudent && names.length > 0) setCurrentStudent(names[0]);
        }
        if (data.Curriculum_Modules) setCloudQuestions(data.Curriculum_Modules);
      }
    });
    return () => unsubscribe();
  }, [currentStudent]);

  useEffect(() => {
    if (!currentStudent) return;
    const studentRef = ref(db, `Learning_Logs/${currentStudent}`);
    const unsubscribe = onValue(studentRef, (snapshot) => {
      let total = 0, errs = 0, dataToExport = [];
      let tLogs = [];

      if (snapshot.exists()) {
        const data = snapshot.val();
        
        // 🟢 NEW: Parse the God's-Eye Telemetry Node
        if (data.Telemetry) {
          const keys = Object.keys(data.Telemetry).sort((a, b) => b - a); // Newest first
          tLogs = keys.map(k => `[${new Date(parseInt(k)).toLocaleTimeString()}] ${data.Telemetry[k]}`);
        }

        // Parse Standard Stats
        Object.keys(data).forEach((key) => {
          if (key !== 'Current_Command' && key !== 'Init' && key !== 'Telemetry') {
            const val = data[key];
            total++;
            if (val.Status === "Error") errs++;
            dataToExport.push({ ...val, id: key });
          }
        });
      }
      setStats({ total, errors: errs, accuracy: total > 0 ? Math.round(((total - errs) / total) * 100) : 100 });
      setTerminalLogs(tLogs.slice(0, 20)); // Shows last 20 events
      setExportData(dataToExport);
    });
    return () => unsubscribe();
  }, [currentStudent]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. CORE LOGIC & HARDWARE ROUTING
  // ═══════════════════════════════════════════════════════════════════════════
  const handleAddStudent = () => {
    if (!newStudentInput.trim()) return;
    const name = newStudentInput.trim().charAt(0).toUpperCase() + newStudentInput.trim().slice(1);
    set(ref(db, `Learning_Logs/${name}/Init`), { Timestamp: new Date().getTime(), Status: "Created" });
    setCurrentStudent(name);
    setNewStudentInput("");
    speak("Profile added for " + name);
  };

  // 🟢 NEW: Hard Reset Function
  const handleResetStudent = () => {
    if (window.confirm(`⚠️ WARNING ⚠️\nAre you sure you want to completely erase all data, analytics, and telemetry for ${currentStudent}?`)) {
      set(ref(db, `Learning_Logs/${currentStudent}`), {
        Init: { Timestamp: new Date().getTime(), Status: "Created" },
        Telemetry: { [Date.now()]: "[SYSTEM] Teacher performed a Hard Reset on student profile." }
      });
      speak(`Profile reset for ${currentStudent}`);
    }
  };

  const executeCommand = (payload) => {
    if (!currentStudent) return;
    set(ref(db, `Learning_Logs/${currentStudent}/Current_Command`), payload);
    set(ref(db, 'Hardware_Link'), { target: payload.target, timestamp: new Date().getTime(), status: "STREAMING" });
  };

  const pushManualChar = (char, label) => {
    if (isStreaming) return;
    logTelemetry(`Forced Hardware Actuation: [ ${char} ]`);
    executeCommand({ command_type: "FORCE_HARDWARE", target: char, test_type: label, audio_prompt: `Find the character ${char}`, timestamp: new Date().getTime(), status: "AWAITING_INPUT" });
    speak("Pushing " + char);
  };

  const handleStream = async () => {
    if (!streamText || isStreaming) return;
    setIsStreaming(true);
    
    const fullWord = streamText.toUpperCase();
    const input = fullWord.split('');

    speak(`Streaming the word: ${fullWord}`);
    logTelemetry(`Deployed Word Stream: [ ${fullWord} ]`);

    set(ref(db, 'Hardware_Link'), { target: fullWord, timestamp: new Date().getTime(), status: "STREAMING" });

    for (const char of input) {
      set(ref(db, `Learning_Logs/${currentStudent}/Current_Command`), {
          command_type: "FORCE_HARDWARE", 
          target: char, 
          test_type: "Word Stream", 
          audio_prompt: `Spelling ${char}`, 
          timestamp: new Date().getTime(), 
          status: "AWAITING_INPUT" 
      });
      await new Promise(r => setTimeout(r, 1500));
    }
    
    setIsStreaming(false);
    setStreamText("");
    speak("Streaming finished.");
  };

  const deployTest = (subject) => {
    if (!cloudQuestions?.[subject]) return;
    const test = cloudQuestions[subject][selectedTests[subject]];
    logTelemetry(`Deployed Test (${subject}): [ Question ${selectedTests[subject] + 1} ]`);
    executeCommand({ command_type: "TEST", target: test.a, test_type: subject + " Test", audio_prompt: test.q, timestamp: new Date().getTime(), status: "AWAITING_INPUT" });
    speak("Question deployed.");
  };

  const deploySmartLesson = async () => {
    try {
      setIsAILoading(true);
      speak("Consulting AI model for student weaknesses.");
      logTelemetry(`Consulting Machine Learning Server for weak points...`);
      
      const response = await fetch(`https://divya-drishti-ai.vercel.app/predict_hardest?student=${currentStudent}`);
      const data = await response.json();
      const suggestedLetter = data.suggested_remedial_letter;
      
      logTelemetry(`AI Deployed Remedial Lesson for: [ ${suggestedLetter} ]`);
      executeCommand({ 
        command_type: "FORCE_HARDWARE", target: suggestedLetter, test_type: "AI Remedial", 
        audio_prompt: `AI Remedial. Find the character ${suggestedLetter}`, timestamp: new Date().getTime(), status: "AWAITING_INPUT" 
      });
      
      speak(`AI predicts difficulty with ${suggestedLetter}. Remedial session deployed.`);
    } catch (error) {
      logTelemetry(`⚠️ AI Server Connection Failed!`);
      speak("AI Server is offline.");
    } finally {
      setIsAILoading(false);
    }
  };

  const speak = (msg) => { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg)); };

  const exportCSV = () => {
    let csv = "Timestamp,Target,Input,Status\n";
    exportData.forEach(r => { csv += `${new Date(r.Timestamp).toLocaleString()},${r.Target_Character},${r.Character_ID},${r.Status}\n`; });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = `${currentStudent}_Logs.csv`;
    link.click();
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. VOICE ASSISTANT
  // ═══════════════════════════════════════════════════════════════════════════
  const triggerVoiceAssistant = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Your browser doesn't support Voice AI.");

    const recognition = new SpeechRecognition();
    recognition.onstart = () => { setIsListening(true); speak("I am listening."); };

    recognition.onresult = async (event) => {
      setIsListening(false);
      const transcript = event.results[0][0].transcript;
      logTelemetry(`Asked AI: "${transcript}"`);
      speak("Thinking...");

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`You are an assistant for a teacher of visually impaired students. They said: "${transcript}". Give a short, helpful reply (1-2 sentences). No markdown.`);
        const responseText = result.response.text();
        speak(responseText); 
      } catch (error) {
        speak("Sorry, I had trouble connecting to my AI brain.");
      }
    };

    recognition.onerror = () => { setIsListening(false); speak("I didn't quite catch that."); };
    recognition.start();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') return;
      if ((event.code === 'KeyV' || event.key === 'v') && !isListening) {
        event.preventDefault(); triggerVoiceAssistant();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. UI RENDERING
  // ═══════════════════════════════════════════════════════════════════════════
  const cardStyle = { background: '#ffffff', padding: '25px', borderRadius: '15px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0', marginBottom: '20px' };
  const buttonStyle = { padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: 'Segoe UI, sans-serif', color: '#333' }}>
      <header style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '6px solid #db2777' }}>
        <div><h1 style={{ margin: 0, color: '#db2777' }}>Divya-Drishti Educator Portal</h1><p style={{ margin: '5px 0 0 0', color: '#666' }}>IoT Braille Interface Node v3.2</p></div>
        <div style={{ textAlign: 'right' }}>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '12px', color: '#db2777', marginBottom: '5px' }}>ACTIVE STUDENT</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select value={currentStudent} onChange={(e) => setCurrentStudent(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '2px solid #db2777', fontWeight: 'bold', minWidth: '180px' }}>
              {studentList.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
            {/* 🔴 NEW RESET BUTTON */}
            <button onClick={handleResetStudent} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '0 15px', fontWeight: 'bold', cursor: 'pointer' }} title="Erase Student Data">RESET</button>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <input style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', flex: 1 }} placeholder="Enter new student name..." value={newStudentInput} onChange={(e) => setNewStudentInput(e.target.value)} />
        <button onClick={handleAddStudent} style={{ ...buttonStyle, background: '#db2777', color: '#fff', width: '150px' }}>Add Profile</button>
      </div>

      <nav style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button onClick={() => setActiveTab('dashboard')} style={{ ...buttonStyle, flex: 1, background: activeTab === 'dashboard' ? '#db2777' : '#f0f0f0', color: activeTab === 'dashboard' ? '#fff' : '#333' }}>🎛️ CONTROL DASHBOARD</button>
        <button onClick={() => setActiveTab('curriculum')} style={{ ...buttonStyle, flex: 1, background: activeTab === 'curriculum' ? '#db2777' : '#f0f0f0', color: activeTab === 'curriculum' ? '#fff' : '#333' }}>📚 CURRICULUM MANAGEMENT</button>
      </nav>

      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
          <section>
            <div style={cardStyle}>
              <button style={{ padding: '15px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', border: 'none', borderRadius: '8px', width: '100%', fontWeight: 'bold', cursor: 'pointer', marginBottom: '30px', fontSize: '16px', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)' }} onClick={deploySmartLesson} disabled={isAILoading}>
                {isAILoading ? "⏳ Analyzing Data..." : "🧠 Deploy AI Adaptive Lesson"}
              </button>

              <h3 style={{ marginTop: 0 }}>🔤 Alphabet Override</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select style={{ flex: 1, padding: '10px' }} value={selectedAlpha} onChange={e => setSelectedAlpha(e.target.value)}>{alphabets.map(a => <option key={a}>{a}</option>)}</select>
                <button style={{ ...buttonStyle, background: '#db2777', color: '#fff' }} onClick={() => pushManualChar(selectedAlpha, "Manual Alpha")}>PUSH</button>
              </div>

              <h3 style={{ marginTop: '25px' }}>🔢 Number Override</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select style={{ flex: 1, padding: '10px' }} value={selectedNum} onChange={e => setSelectedNum(e.target.value)}>{numbers.map(n => <option key={n}>{n}</option>)}</select>
                <button style={{ ...buttonStyle, background: '#0ea5e9', color: '#fff' }} onClick={() => pushManualChar(selectedNum, "Manual Num")}>PUSH</button>
              </div>

              <h3 style={{ marginTop: '25px' }}>✨ Special Character Override</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select style={{ flex: 1, padding: '10px' }} value={selectedSpecial} onChange={e => setSelectedSpecial(e.target.value)}>{specialChars.map(s => <option key={s}>{s}</option>)}</select>
                <button style={{ ...buttonStyle, background: '#8b5cf6', color: '#fff' }} onClick={() => pushManualChar(selectedSpecial, "Manual Special")}>PUSH</button>
              </div>

              <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />
              
              <h3>🌊 Word Streaming Engine</h3>
              <input style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '15px', boxSizing: 'border-box' }} placeholder="Type word to stream..." value={streamText} onChange={e => setStreamText(e.target.value)} />
              <button style={{ ...buttonStyle, background: isStreaming ? '#ccc' : '#222', color: '#fff', width: '100%' }} onClick={handleStream}>{isStreaming ? 'STREAMING...' : 'START WORD STREAM'}</button>
            </div>
          </section>

          <section>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
              <div style={{ ...cardStyle, flex: 1, textAlign: 'center', borderBottom: '5px solid #0ea5e9' }}><h2 style={{ margin: 0, fontSize: '36px' }}>{stats.accuracy}%</h2><p style={{ margin: 0, fontWeight: 'bold', color: '#666' }}>ACCURACY</p></div>
              <div style={{ ...cardStyle, flex: 1, textAlign: 'center', borderBottom: '5px solid #ef4444' }}><h2 style={{ margin: 0, fontSize: '36px' }}>{stats.errors}</h2><p style={{ margin: 0, fontWeight: 'bold', color: '#666' }}>ERRORS</p></div>
            </div>

            <div style={{ ...cardStyle, background: '#1e293b', color: '#fff', border: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#38bdf8' }}>📡 Live Omni-Telemetry Uplink</h3>
                <button onClick={exportCSV} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>EXPORT DATA</button>
              </div>
              {/* 🔴 NEW TELEMETRY CONSOLE */}
              <div style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6', height: '350px', overflowY: 'auto', borderTop: '1px solid #334155', paddingTop: '10px' }}>
                {terminalLogs.map((log, i) => <div key={i} style={{ padding: '4px 0', borderBottom: '1px solid #334155', color: log.includes("[STUDENT]") ? "#fde047" : (log.includes("Error") ? "#fca5a5" : "#e2e8f0") }}>{log}</div>)}
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'curriculum' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
          {['English', 'Math', 'Science', 'History'].map(subject => (
            <div key={subject} style={{ ...cardStyle, borderLeft: '6px solid #db2777' }}>
              <h3 style={{ marginTop: 0 }}>{subject} Curriculum</h3>
              <select style={{ width: '100%', padding: '12px', borderRadius: '8px', marginBottom: '15px' }} value={selectedTests[subject]} onChange={e => setSelectedTests(p => ({ ...p, [subject]: parseInt(e.target.value) }))}>
                {cloudQuestions?.[subject]?.map((q, i) => <option key={i} value={i}>Question {i+1}: {q.q}</option>)}
              </select>
              <button onClick={() => deployTest(subject)} style={{ ...buttonStyle, background: '#db2777', color: '#fff', width: '100%' }}>DEPLOY TO STUDENT</button>
            </div>
          ))}
        </div>
      )}

      <div onClick={triggerVoiceAssistant} style={{ position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px', borderRadius: '50%', background: isListening ? '#ef4444' : '#3b82f6', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', cursor: 'pointer', zIndex: 1000, transition: 'all 0.3s ease', animation: isListening ? 'pulse 1.5s infinite' : 'none' }} title="Press 'V' or Click to speak">
        {isListening ? "👂" : "🎙️"}
      </div>
    </div>
  );
}

export default TeacherDash;