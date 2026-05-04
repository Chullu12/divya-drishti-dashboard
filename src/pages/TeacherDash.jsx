import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../services/firebase';
import { ref, onValue, set, remove } from 'firebase/database';
import { GoogleGenerativeAI } from '@google/generative-ai';
import TeacherHeader from '../components/Teacher/TeacherHeader';
import ControlDashboard from '../components/Teacher/ControlDashboard';
import CurriculumManagement from '../components/Teacher/CurriculumManagement';
import TeacherHeatmap from '../components/Teacher/TeacherHeatmap';
import { parseTeacherCommand } from '../utils/aiCommandRouter';


const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY');

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
  
  const [newQSubject, setNewQSubject] = useState("English");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const specialChars = ["!", "?", ".", ",", "+", "-", "=", "*", "/"];
  
  const [selectedAlpha, setSelectedAlpha] = useState("A");
  const [selectedNum, setSelectedNum] = useState("0");
  const [selectedSpecial, setSelectedSpecial] = useState("!");

  const [streamText, setStreamText] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

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
        
        if (data.Telemetry) {
          const keys = Object.keys(data.Telemetry).sort((a, b) => b - a); 
          tLogs = keys.map(k => `[${new Date(parseInt(k)).toLocaleTimeString()}] ${data.Telemetry[k]}`);
        }

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
      setTerminalLogs(tLogs.slice(0, 20)); 
      setExportData(dataToExport);
    });
    return () => unsubscribe();
  }, [currentStudent]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. CORE LOGIC & HARDWARE ROUTING (NO LOCKS, DIRECT PUSH)
  // ═══════════════════════════════════════════════════════════════════════════
  const handleAddStudent = (overrideName) => {
    const inputName = typeof overrideName === 'string' ? overrideName : newStudentInput;
    if (!inputName.trim()) return;
    const name = inputName.trim().charAt(0).toUpperCase() + inputName.trim().slice(1);
    set(ref(db, `Learning_Logs/${name}/Init`), { Timestamp: new Date().getTime(), Status: "Created" });
    setCurrentStudent(name);
    setNewStudentInput("");
    speak("Profile added for " + name);
  };

  const handleResetStudent = () => {
    if (window.confirm(`⚠️ WARNING ⚠️\nAre you sure you want to completely erase all data, analytics, and telemetry for ${currentStudent}?`)) {
      set(ref(db, `Learning_Logs/${currentStudent}`), {
        Init: { Timestamp: new Date().getTime(), Status: "Created" },
        Telemetry: { [Date.now()]: "[SYSTEM] Teacher performed a Hard Reset on student profile." }
      });
      speak(`Profile reset for ${currentStudent}`);
    }
  };

  const pushManualChar = (char, label) => {
    logTelemetry(`Forced Hardware Actuation: [ ${char} ]`);
    set(ref(db, `Learning_Logs/${currentStudent}/Current_Command`), { 
        command_type: "FORCE_HARDWARE", target: char, test_type: label, audio_prompt: `Find the character ${char}`, timestamp: new Date().getTime(), status: "AWAITING_INPUT" 
    });
    set(ref(db, 'Hardware_Link'), { target: char, timestamp: new Date().getTime(), status: "STREAMING" });
    speak("Pushing " + char);
  };

  const handleStream = async () => {
    if (!streamText) return;
    
    const fullWord = streamText.toUpperCase().trim();
    speak(`Streaming the word: ${fullWord}`);
    logTelemetry(`Deployed Word Stream: [ ${fullWord} ]`);

    set(ref(db, `Learning_Logs/${currentStudent}/Current_Command`), {
      command_type: "FORCE_HARDWARE", 
      target: fullWord, 
      test_type: "Word Stream", 
      audio_prompt: `Spelling ${fullWord}`, 
      timestamp: new Date().getTime(), 
      status: "AWAITING_INPUT" 
    });

    // Pushing full word instantly (Fixes missing letters)
    set(ref(db, 'Hardware_Link'), { target: fullWord, timestamp: new Date().getTime(), status: "STREAMING" });

    setStreamText("");
  };

  const deployTest = async (subject) => {
    if (!cloudQuestions?.[subject]) return;
    const test = cloudQuestions[subject][selectedTests[subject]];
    const answer = test.a.toUpperCase().trim();

    logTelemetry(`Deployed Curriculum: [ ${test.q} ]`);
    speak(`Question: ${test.q}. Sending to Braille cell now.`);

    set(ref(db, `Learning_Logs/${currentStudent}/Current_Command`), {
      command_type: "TEST", 
      target: answer, 
      test_type: subject + " Test", 
      original_question: test.q, 
      audio_prompt: test.q, 
      timestamp: new Date().getTime(), 
      status: "AWAITING_INPUT" 
    });

    // Pushing full answer instantly (Fixes missing letters)
    set(ref(db, 'Hardware_Link'), { target: answer, timestamp: new Date().getTime(), status: "STREAMING" });
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
      set(ref(db, `Learning_Logs/${currentStudent}/Current_Command`), { 
        command_type: "FORCE_HARDWARE", target: suggestedLetter, test_type: "AI Remedial", 
        audio_prompt: `AI Remedial. Find the character ${suggestedLetter}`, timestamp: new Date().getTime(), status: "AWAITING_INPUT" 
      });
      set(ref(db, 'Hardware_Link'), { target: suggestedLetter, timestamp: new Date().getTime(), status: "STREAMING" });
      
      speak(`AI predicts difficulty with ${suggestedLetter}. Remedial session deployed.`);
    } catch (error) {
      logTelemetry(`⚠️ AI Server Connection Failed!`);
      speak("AI Server is offline.");
    } finally {
      setIsAILoading(false);
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      speak("Please enter both a question and an answer.");
      return;
    }
    
    const newIndex = cloudQuestions?.[newQSubject] ? cloudQuestions[newQSubject].length : 0;

    set(ref(db, `Curriculum_Modules/${newQSubject}/${newIndex}`), {
      q: newQuestion,
      a: newAnswer.toUpperCase().trim()
    });

    speak(`Successfully added new question to the ${newQSubject} curriculum.`);
    logTelemetry(`Teacher added new custom question to ${newQSubject}.`);
    
    setNewQuestion("");
    setNewAnswer("");
  };

  const speak = (msg) => { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg)); };

  const exportCSV = () => {
    let csv = "Timestamp,Target,Input,Status\n";
    exportData.forEach(r => { csv += `${new Date(r.Timestamp).toLocaleString()},${r.Target_Word || r.Target_Character || ""},${r.Submitted_Word || r.Character_ID || ""},${r.Status}\n`; });
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
        const response = await parseTeacherCommand(transcript);
        const { intent, args } = response;
        
        switch (intent) {
          case 'NAVIGATE_TAB':
            setActiveTab(args.tab);
            speak(`Navigating to ${args.tab} tab.`);
            break;
          case 'DEPLOY_AI_LESSON':
            await deploySmartLesson();
            break;
          case 'ADD_STUDENT':
            handleAddStudent(args.name);
            break;
          case 'RESET_STUDENT':
            handleResetStudent();
            break;
          case 'PUSH_CHAR':
            pushManualChar(args.char, "Voice Command");
            break;
          default:
            speak(args.reply || "I couldn't process that command.");
        }
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
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ maxWidth: '1240px', margin: '0 auto', padding: '28px 24px', minHeight: '100vh' }}>
      <TeacherHeader
        currentStudent={currentStudent}
        studentList={studentList}
        setCurrentStudent={setCurrentStudent}
        handleResetStudent={handleResetStudent}
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          className="glass-input"
          style={{ flex: 1 }}
          placeholder="Enter new student name..."
          value={newStudentInput}
          onChange={e => setNewStudentInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddStudent()}
        />
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="btn-primary"
          onClick={handleAddStudent}
          style={{ padding: '11px 22px', whiteSpace: 'nowrap' }}
        >
          + Add Profile
        </motion.button>
      </div>

      <nav style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button className={`nav-tab ${activeTab === 'dashboard' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('dashboard')}>
          🎛️ Control Dashboard
        </button>
        <button className={`nav-tab ${activeTab === 'curriculum' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('curriculum')}>
          📚 Curriculum
        </button>
        <button className={`nav-tab ${activeTab === 'live-arena' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('live-arena')} style={{ borderLeft: activeTab === 'live-arena' ? '2px solid var(--pink)' : '' }}>
          🚀 Live Arena Heatmap
        </button>
      </nav>

      {activeTab === 'live-arena' && (
        <TeacherHeatmap />
      )}

      {activeTab === 'dashboard' && (
        <ControlDashboard
          deploySmartLesson={deploySmartLesson}
          isAILoading={isAILoading}
          alphabets={alphabets}
          selectedAlpha={selectedAlpha}
          setSelectedAlpha={setSelectedAlpha}
          pushManualChar={pushManualChar}
          numbers={numbers}
          selectedNum={selectedNum}
          setSelectedNum={setSelectedNum}
          specialChars={specialChars}
          selectedSpecial={selectedSpecial}
          setSelectedSpecial={setSelectedSpecial}
          streamText={streamText}
          setStreamText={setStreamText}
          handleStream={handleStream}
          stats={stats}
          exportCSV={exportCSV}
          terminalLogs={terminalLogs}
        />
      )}

      {activeTab === 'curriculum' && (
        <CurriculumManagement
          cloudQuestions={cloudQuestions}
          selectedTests={selectedTests}
          setSelectedTests={setSelectedTests}
          deployTest={deployTest}
          newQSubject={newQSubject}
          setNewQSubject={setNewQSubject}
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          newAnswer={newAnswer}
          setNewAnswer={setNewAnswer}
          handleAddQuestion={handleAddQuestion}
        />
      )}

      {/* Voice FAB */}
      <motion.div
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        className={`voice-fab ${isListening ? 'listening' : 'idle'}`}
        onClick={triggerVoiceAssistant}
        title="Press 'V' or click to speak"
      >
        {isListening ? '👂' : '🎙️'}
      </motion.div>
    </motion.div>
  );
}

export default TeacherDash;
