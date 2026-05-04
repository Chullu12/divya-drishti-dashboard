import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../services/firebase';
import { ref, onValue, set } from 'firebase/database';
import { brailleMap, keyToDot } from '../utils/constants';
import { parseStudentCommand } from '../utils/aiCommandRouter';


import StudentLogin from '../components/Student/StudentLogin';
import StudentHeader from '../components/Student/StudentHeader';
import ClassroomTab from '../components/Student/ClassroomTab';
import VisionTab from '../components/Student/VisionTab';
import EncyclopediaTab from '../components/Student/EncyclopediaTab';
import BottomNav from '../components/Student/BottomNav';
import ArenaMode from '../components/Student/ArenaMode';

function StudentPortal() {
  // 🟢 NAVIGATION & GLOBAL STATES
  const [activeTab, setActiveTab] = useState('classroom');   
  const [studentList, setStudentList] = useState([]);
  const [studentName, setStudentName] = useState(() => localStorage.getItem("myStudentName") || "");
  const [isLogged, setIsLogged] = useState(!!studentName);
  
  // 🟢 CLASSROOM / TUTOR STATES
  const [currentTask, setCurrentTask] = useState(null);
  const [currentCellDots, setCurrentCellDots] = useState(new Set());
  const [wordBuffer, setWordBuffer] = useState("");

  // 🟢 ARENA STATES
  const [globalArena, setGlobalArena] = useState({ isActive: false, targetWord: "", timestamp: 0 });
  const [localArenaDismissed, setLocalArenaDismissed] = useState(false);

  // 🟢 AI VISION STATES
  const webcamRef = useRef(null); 
  const [isScanning, setIsScanning] = useState(false);
  const [inventory, setInventory] = useState([]);

  // 🟢 ENCYCLOPEDIA CHAT STATES
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatMicActive, setIsChatMicActive] = useState(false);

  // 🎤 GLOBAL VOICE ASSISTANT STATES
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false); 
  const scanActionRef = useRef(null);
  const clearActionRef = useRef(null);
  const handleSendChatRef = useRef(null); // 🟢 NEW: Ref to access chat from global mic
  const speak = (t) => { 
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(t);
    
    utterance.onstart = () => {
        isSpeakingRef.current = true;
        try { recognitionRef.current?.abort(); } catch(e) {}
    };

    utterance.onend = () => {
        isSpeakingRef.current = false;
        if (isLogged) {
            setTimeout(() => {
                if (!isSpeakingRef.current && !isChatMicActive) {
                    try { recognitionRef.current?.start(); } catch(e) {}
                }
            }, 500);
        }
    };

    window.speechSynthesis.speak(utterance); 
  };

  const logStudentAction = (msg) => {
    if (!studentName) return;
    set(ref(db, `Learning_Logs/${studentName}/Telemetry/${Date.now()}`), `[STUDENT] ${msg}`);
  };

  const getDotsForChar = (char) => {
    const entry = Object.entries(brailleMap).find(([dots, c]) => c === char);
    return entry ? entry[0].split('').join(' and ') : '';
  };

  useEffect(() => {
    const namesRef = ref(db, 'Learning_Logs');
    const unsubscribe = onValue(namesRef, (snapshot) => {
      if (snapshot.exists()) setStudentList(Object.keys(snapshot.val()));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLogged || !studentName) return;
    const studentPath = `Learning_Logs/${studentName}/Current_Command`;
    const unsubscribe = onValue(ref(db, studentPath), (snapshot) => {
      if (snapshot.exists() && activeTab === 'classroom') {
        const incomingTask = snapshot.val();
        
        if (incomingTask.status === "COMPLETED" || incomingTask.status === "CANCELLED") {
            setCurrentTask(null);
            return;
        }

        setCurrentTask((prevTask) => {
          if (!prevTask || prevTask.timestamp !== incomingTask.timestamp) setWordBuffer(""); 
          return { ...incomingTask, mode: incomingTask.mode || 'TEACHER' }; 
        });
      }
    });
    return () => unsubscribe();
  }, [isLogged, studentName, activeTab]);

  // 🟢 LISTEN TO GLOBAL ARENA
  useEffect(() => {
    if (!isLogged || !studentName) return;
    const unsubscribe = onValue(ref(db, 'Global_Arena'), (snapshot) => {
      if (snapshot.exists()) {
        const arenaData = snapshot.val();
        if (arenaData.isActive && (!globalArena.isActive || arenaData.timestamp !== globalArena.timestamp)) {
           setWordBuffer(""); // Clear buffer on new arena start
           setCurrentCellDots(new Set());
           setLocalArenaDismissed(false); // Re-open arena on a newly deployed broadcast
        }
        setGlobalArena(arenaData || { isActive: false, targetWord: "", timestamp: 0 });
      } else {
        setGlobalArena({ isActive: false, targetWord: "", timestamp: 0 });
      }
    });
    return () => unsubscribe();
  }, [isLogged, studentName]);

  // 🟢 UPDATE ARENA TELEMETRY
  useEffect(() => {
    if (!isLogged || !studentName || !globalArena.isActive) return;
    
    const progress = globalArena.targetWord ? Math.round((wordBuffer.length / globalArena.targetWord.length) * 100) : 0;
    const isCompleted = wordBuffer.toUpperCase() === globalArena.targetWord.toUpperCase();

    set(ref(db, `Arena_Telemetry/${studentName}`), {
      currentInput: wordBuffer,
      progressPercentage: progress,
      lastKeystrokeTime: Date.now(),
      status: isCompleted ? "completed" : "typing"
    });

    if (isCompleted) {
      speak(`Incredible! You completed the arena challenge!`);
      // Optional: Auto close or let teacher close
    }
  }, [wordBuffer, globalArena.isActive, isLogged, studentName]);

  useEffect(() => {
    if (currentTask && currentTask.mode === 'TUTOR' && currentTask.currentIndex < currentTask.target.length) {
      const expectedChar = currentTask.target[currentTask.currentIndex];
      const dots = getDotsForChar(expectedChar);
      const hintTimer = setTimeout(() => { speak(`Hint: To type ${expectedChar}, press dots ${dots}.`); }, 8000); 
      return () => clearTimeout(hintTimer); 
    }
  }, [currentTask]);


  // 🎤 GLOBAL HTML5 VOICE ASSISTANT
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false; 
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      
      recognition.onend = () => {
        setIsListening(false);
        if (isLogged && !isSpeakingRef.current && !isChatMicActive) {
            setTimeout(() => { 
                if (recognitionRef.current && !isSpeakingRef.current && !isChatMicActive) {
                    try { recognitionRef.current.start(); } catch(e) {} 
                }
            }, 800); 
        }
      };

      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
    return () => { if (recognitionRef.current) recognitionRef.current.stop(); };
  }, [isLogged, isChatMicActive]);

  // 🟢 UPGRADED: STATE-MACHINE VOICE COMMAND ROUTER
  useEffect(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.onresult = async (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript.toLowerCase().trim();
      
      if (!transcript) return; 

      console.log("🎤 Global Voice Heard:", transcript);

      // --- OMNIPOTENT AI ROUTER ---
      speak("Thinking...");
      const response = await parseStudentCommand(transcript);
      const { intent, args } = response;

      switch (intent) {
        case 'NAVIGATE_TAB':
          setActiveTab(args.tab);
          speak(`Navigating to ${args.tab} tab.`);
          break;
        case 'SCAN_OBJECT':
          setActiveTab('vision');
          if (scanActionRef.current) {
            speak("Scanning object now.");
            setTimeout(() => scanActionRef.current(), 1000);
          }
          break;
        case 'CLEAR_CELL':
          setActiveTab('classroom');
          if (clearActionRef.current) clearActionRef.current();
          break;
        default:
          // Fallback to chat if they just asked a question
          if (activeTab === 'fluency' && currentTask && currentTask.target && handleSendChatRef.current) {
            handleSendChatRef.current(transcript);
          } else if (activeTab === 'classroom') {
            try {
              const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "YOUR_GROQ_API_KEY"; 
              const chatRes = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  model: "llama-3.1-8b-instant", 
                  messages: [
                    { role: "system", content: "You are an encouraging tutor for a blind student. Keep answers to 1 short sentence." },
                    { role: "user", content: transcript }
                  ],
                  max_tokens: 80, temperature: 0.5 
                })
              });
              const data = await chatRes.json();
              speak(data.choices[0].message.content.trim()); 
            } catch (error) {
              speak(args.reply || "I am here to help you learn.");
            }
          } else {
            speak(args.reply || "Please scan an object first or ask me a question in the classroom.");
          }
      }
    };
  }, [activeTab, currentTask]);


  // 📖 ENHANCED AI VISION
  const executeAIScan = async () => {
    if (isScanning || !webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return alert("🚨 Failed to capture image!");

    setIsScanning(true);
    speak("Analyzing image.");
    if (navigator.vibrate) navigator.vibrate([50, 100, 50]);

    try {
      const base64Image = imageSrc.split(',')[1];
      const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "YOUR_GROQ_API_KEY";
      
      const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [{
              role: "user",
              content: [
                { type: "text", text: "Identify the single most prominent physical object. Return ONLY valid JSON with three keys: 'word' (just the object name, 1 word), 'story' (1 poetic sentence), and 'explanation' (2 detailed sentences). Do not use markdown blocks." },
                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
              ]
          }],
          max_tokens: 300, temperature: 0.1 
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Vision API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const rawText = data.choices[0].message.content;
      
      let detectedWord = "OBJECT";
      let storyFact = "Let's learn how to spell this.";
      let detailedExp = "This is a wonderful object.";

      try {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            detectedWord = parsed.word?.replace(/[^a-zA-Z]/g, '').toUpperCase() || "OBJECT";
            storyFact = parsed.story || storyFact;
            detailedExp = parsed.explanation || detailedExp;
        } else {
            detectedWord = rawText.split(' ')[0].replace(/[^a-zA-Z]/g, '').toUpperCase() || "OBJECT";
        }
      } catch(e) {
        console.error("Failed to parse AI Vision:", e);
      }

      speak(`You found a ${detectedWord}! ${storyFact} Let's spell it together.`);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      
      setIsScanning(false);
      setChatMessages([]); 
      setChatInput("");

      const newTutorTask = {
        mode: 'TUTOR', original_question: `You found a ${detectedWord}!`,
        story_fact: storyFact, detailed_explanation: detailedExp, target: detectedWord,
        currentIndex: 0, status: "AWAITING_INPUT", timestamp: Date.now()
      };
      
      set(ref(db, `Learning_Logs/${studentName}/Current_Command`), newTutorTask);
      setWordBuffer("");
      setActiveTab('classroom'); 

    } catch (error) {
      alert(`🚨 GROQ AI FAILED TO SCAN:\n\n${error.message}`); 
      setIsScanning(false);
    }
  };

  useEffect(() => { scanActionRef.current = executeAIScan; }, [isScanning, executeAIScan]);

  // 🟢 DEDICATED ENCYCLOPEDIA CHAT SUBMITTER
  const handleSendChat = async (voiceTextOverride) => {
    const textToSend = typeof voiceTextOverride === 'string' ? voiceTextOverride : chatInput;
    if (!textToSend || !textToSend.trim() || !currentTask?.target) return;

    const userMsg = { role: 'user', content: textToSend };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
        const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "YOUR_GROQ_API_KEY"; 
        
        const messageHistory = chatMessages.map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content
        }));

        const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", 
                messages: [
                    {
                        role: "system",
                        content: `You are an educational AI tutor for a blind student. The student is holding and examining a physical object: a ${currentTask.target}. Answer their questions about this ${currentTask.target} simply and engagingly in 1-2 short sentences. Do not use markdown.`
                    },
                    ...messageHistory,
                    { role: "user", content: textToSend }
                ],
                max_tokens: 100, temperature: 0.5 
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || "Chat Network Error");
        }

        const data = await response.json();
        const aiText = data.choices[0].message.content.trim();
        
        setChatMessages(prev => [...prev, { role: 'ai', content: aiText }]);
        speak(aiText);

    } catch (error) {
        console.error(error);
        const errorMsg = "Sorry, my servers are a little busy right now. Try asking again.";
        setChatMessages(prev => [...prev, { role: 'ai', content: errorMsg }]);
        speak(errorMsg);
    } finally {
        setIsChatLoading(false);
    }
  };

  // 🟢 Bind the ref so the global mic can trigger chat
  handleSendChatRef.current = handleSendChat;

  // 🟢 DEDICATED ENCYCLOPEDIA CHAT MICROPHONE
  const startChatMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported.");
    
    try { recognitionRef.current?.abort(); } catch(e) {}

    const chatMic = new SpeechRecognition();
    chatMic.continuous = false;
    chatMic.interimResults = false;
    chatMic.lang = 'en-US';

    chatMic.onstart = () => {
        setIsChatMicActive(true);
        if (navigator.vibrate) navigator.vibrate(50);
    };
    
    chatMic.onend = () => setIsChatMicActive(false);
    chatMic.onerror = () => setIsChatMicActive(false);
    
    chatMic.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (!transcript || !transcript.trim()) return; 
        console.log("🗣️ Chat Mic Heard:", transcript);
        handleSendChat(transcript); 
    };
    
    chatMic.start();
  };

  const cancelTutorTask = () => {
    if (studentName) set(ref(db, `Learning_Logs/${studentName}/Current_Command/status`), "CANCELLED");
    setCurrentTask(null); setWordBuffer(""); setActiveTab('vision');
  };

  const toggleDot = useCallback((dot) => {
    setCurrentCellDots(prev => {
      const next = new Set(prev);
      if (!next.has(dot)) { next.add(dot); speak(`Dot ${dot}`); } 
      else { next.delete(dot); }
      if (navigator.vibrate) navigator.vibrate(20);
      return next;
    });
  }, []);

  const handleSpace = useCallback(() => {
    if (currentCellDots.size === 0) return; 
    const pattern = Array.from(currentCellDots).sort().join('');
    const character = brailleMap[pattern] || "?";
    
    if (character === "?") {
      speak("Invalid Character"); setCurrentCellDots(new Set()); return;
    }

    if (currentTask && currentTask.mode === 'TUTOR') {
      const expectedChar = currentTask.target[currentTask.currentIndex];
      if (character === expectedChar) {
        const newIndex = currentTask.currentIndex + 1;
        setWordBuffer(prev => prev + character);
        if (newIndex === currentTask.target.length) {
          speak(`Beautifully done! You spelled ${currentTask.target}.`);
          setInventory(prev => [...prev, currentTask.target]); 
          set(ref(db, `Learning_Logs/${studentName}/Current_Command/status`), "COMPLETED");
          setWordBuffer("");
          setTimeout(() => setActiveTab('vision'), 3500); 
        } else {
          speak(`Good! The next letter is ${currentTask.target[newIndex]}.`);
          set(ref(db, `Learning_Logs/${studentName}/Current_Command/currentIndex`), newIndex); 
        }
      } else {
        speak(`Not quite. Try again. We need the letter ${expectedChar}.`);
      }
    } 
    else {
      setWordBuffer(prev => prev + character); speak(character);
    }
    setCurrentCellDots(new Set()); 
  }, [currentCellDots, currentTask]);

  const handleDelete = useCallback(() => {
    if (currentCellDots.size > 0) { setCurrentCellDots(new Set()); speak("Cell cleared"); } 
    else if (wordBuffer.length > 0 && (!currentTask || currentTask.mode !== 'TUTOR')) {
        setWordBuffer(prev => prev.slice(0, -1)); speak("Letter deleted");
    }
  }, [currentCellDots, wordBuffer, currentTask]);

  useEffect(() => { clearActionRef.current = handleDelete; }, [handleDelete]);

  const handleKeyDown = useCallback((e) => {
    if (activeTab !== 'classroom') return; 
    const key = e.key.toLowerCase();
    if (keyToDot[key]) { toggleDot(keyToDot[key]); }
    if (e.code === "Space") { e.preventDefault(); handleSpace(); }
    if (e.code === "Enter") { e.preventDefault(); if (wordBuffer.length > 0) submitAnswer(wordBuffer); }
    if (e.code === "Backspace") { e.preventDefault(); handleDelete(); }
  }, [toggleDot, handleSpace, handleDelete, wordBuffer, activeTab, currentTask]); 

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const submitAnswer = (ans) => {
    if (!currentTask) return;
    const isCorrect = ans.toUpperCase() === currentTask.target.toUpperCase();
    const timestamp = new Date().getTime();
    set(ref(db, `Learning_Logs/${studentName}/${timestamp}`), { 
      Submitted_Word: ans, Target_Word: currentTask.target, Status: isCorrect ? "Success" : "Error"
    });
    set(ref(db, `Learning_Logs/${studentName}/Current_Command/status`), isCorrect ? "SUCCESS" : "ERROR");
    speak(isCorrect ? "Excellent! That is the correct answer." : "Not quite right. Clear it and try again.");
    if (isCorrect) setWordBuffer(""); 
  };

  if (!isLogged) { 
    return <StudentLogin studentList={studentList} setStudentName={setStudentName} setIsLogged={setIsLogged} />;
  }

  const currentPattern = Array.from(currentCellDots).sort().join('');
  const liveTranslation = brailleMap[currentPattern] || (currentCellDots.size > 0 ? "?" : "");

  const toggleMic = () => {
    if (isListening) { recognitionRef.current?.stop(); speak("Microphone paused."); } 
    else { try { recognitionRef.current?.start(); } catch(e){} speak("Microphone active."); }
  };

  if (globalArena.isActive && globalArena.targetWord && !localArenaDismissed) {
    return (
      <ArenaMode 
        globalArena={globalArena} 
        studentName={studentName} 
        wordBuffer={wordBuffer} 
        setWordBuffer={setWordBuffer}
        currentCellDots={currentCellDots}
        toggleDot={toggleDot}
        handleSpace={handleSpace}
        handleDelete={handleDelete}
        speak={speak}
        onDismiss={() => setLocalArenaDismissed(true)}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-void)', fontFamily: "'Outfit', sans-serif", overflow: 'hidden' }}>
      
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
    </motion.div>
  );
}

export default StudentPortal;
