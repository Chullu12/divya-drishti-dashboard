import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../services/firebase';
import { ref, onValue, set } from 'firebase/database';

function StudentPortal() {
  const [studentList, setStudentList] = useState([]);
  const [studentName, setStudentName] = useState(() => localStorage.getItem("myStudentName") || "");
  const [isLogged, setIsLogged] = useState(!!studentName);
  const [currentTask, setCurrentTask] = useState(null);
  
  // State for the "Sticky" dots currently active in the cell
  const [currentCellDots, setCurrentCellDots] = useState(new Set());
  const [lastSubmittedChar, setLastSubmittedChar] = useState("");

  // Braille Dictionary Mapping
  const brailleMap = {
    "1": "A", "12": "B", "14": "C", "145": "D", "15": "E", "124": "F",
    "1245": "G", "125": "H", "24": "I", "245": "J", "13": "K", "123": "L",
    "134": "M", "1345": "N", "135": "O", "1234": "P", "12345": "Q", "1235": "R",
    "234": "S", "2345": "T", "136": "U", "1236": "V", "2456": "W", "1346": "X",
    "13456": "Y", "1356": "Z", "2": "1", "23": "2", "25": "3", "256": "4"
  };

  // 🔴 MAPPING: Key -> Dot Number
  const keyToDot = { 
    'f': 1, 'd': 2, 's': 3, 
    'j': 4, 'k': 5, 'l': 6 
  };

  // Fetch Student List for Dropdown
  useEffect(() => {
    const namesRef = ref(db, 'Learning_Logs');
    const unsubscribe = onValue(namesRef, (snapshot) => {
      if (snapshot.exists()) setStudentList(Object.keys(snapshot.val()));
    });
    return () => unsubscribe();
  }, []);

  // Listen for unique missions
  useEffect(() => {
    if (!isLogged || !studentName) return;
    const studentPath = `Learning_Logs/${studentName}/Current_Command`;
    const unsubscribe = onValue(ref(db, studentPath), (snapshot) => {
      if (snapshot.exists()) {
        const task = snapshot.val();
        setCurrentTask(task);
        if (task.status === "AWAITING_INPUT") {
          speak(`New Mission. ${task.audio_prompt}. Press your Braille keys and hit Space to finish.`);
        }
      }
    });
    return () => unsubscribe();
  }, [isLogged, studentName]);

  // 🔴 UPDATED KEYBOARD LOGIC
  const handleKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase();

    // 1. Add Dot via Letter Keys
    if (keyToDot[key]) {
      const dot = keyToDot[key];
      setCurrentCellDots(prev => {
        const next = new Set(prev);
        if (!next.has(dot)) {
          next.add(dot);
          speak(`Key ${key.toUpperCase()}`); // Now speaks the key name for clarity
        }
        return next;
      });
    }

    // 2. Submit (Spacebar)
    if (e.code === "Space") {
      e.preventDefault();
      const pattern = Array.from(currentCellDots).sort().join('');
      const character = brailleMap[pattern] || "?";
      
      if (character !== "?") {
        setLastSubmittedChar(character);
        speak(`Submitting ${character}`);
        submitAnswer(character);
      } else {
        speak("Pattern not recognized. Try again.");
      }
      setCurrentCellDots(new Set()); 
    }

    // 3. Clear (Backspace)
    if (e.code === "Backspace") {
      e.preventDefault();
      setCurrentCellDots(new Set());
      speak("Cleared");
    }
  }, [currentCellDots, currentTask]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const submitAnswer = (ans) => {
    if (!currentTask) return;
    const isCorrect = ans.toUpperCase() === currentTask.target.toUpperCase();
    const timestamp = new Date().getTime();

    // Log to Firebase
    set(ref(db, `Learning_Logs/${studentName}/${timestamp}`), {
      Character_ID: ans,
      Target_Character: currentTask.target,
      Status: isCorrect ? "Success" : "Error",
      Timestamp: timestamp,
      Dwell_Time_ms: timestamp - currentTask.timestamp
    });

    // Update mission status for Teacher Dashboard
    set(ref(db, `Learning_Logs/${studentName}/Current_Command/status`), isCorrect ? "SUCCESS" : "ERROR");
    speak(isCorrect ? "That is correct!" : "Not quite. Check the Braille cell again.");
  };

  const speak = (t) => {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(t));
  };

  // 🔴 CUSTOM UI COMPONENT: Dot labeled with Letter
  const DotButton = ({ dotNum, label }) => (
    <div style={{
      width: '90px', height: '90px', borderRadius: '50%', 
      border: '5px solid #db2777', margin: '15px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: currentCellDots.has(dotNum) ? '#db2777' : 'white',
      color: currentCellDots.has(dotNum) ? 'white' : '#db2777',
      transition: 'all 0.15s ease'
    }}>
      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>DOT {dotNum}</span>
      <span style={{ fontSize: '32px', fontWeight: '900' }}>{label}</span>
    </div>
  );

  if (!isLogged) {
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
              if (val) { setStudentName(val); localStorage.setItem("myStudentName", val); setIsLogged(true); }
            }}
          >Enter Hub</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid #db2777', paddingBottom: '15px', marginBottom: '30px' }}>
        <h2 style={{ color: '#db2777' }}>Learning Session: {studentName}</h2>
        <button onClick={() => { setIsLogged(false); localStorage.removeItem("myStudentName"); }} style={{ padding: '8px 15px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer' }}>Switch User</button>
      </header>

      {currentTask ? (
        <div>
          <div style={{ background: '#fff1f2', padding: '30px', borderRadius: '20px', border: '2px solid #fecdd3', marginBottom: '40px' }}>
            <h4 style={{ margin: 0, color: '#be185d', letterSpacing: '1px' }}>INSTRUCTOR'S QUESTION</h4>
            <p style={{ fontSize: '30px', fontWeight: 'bold', margin: '15px 0' }}>{currentTask.audio_prompt}</p>
          </div>

          {/* 🔴 RESTORED & LABELED DOTS 🔴 */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <DotButton dotNum={1} label="F" />
              <DotButton dotNum={2} label="D" />
              <DotButton dotNum={3} label="S" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <DotButton dotNum={4} label="J" />
              <DotButton dotNum={5} label="K" />
              <DotButton dotNum={6} label="L" />
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px' }}>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#64748b' }}>TRANSLATED INPUT</p>
            <span style={{ fontSize: '64px', fontWeight: '900', color: '#db2777' }}>{lastSubmittedChar || "?"}</span>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>
              [SPACEBAR TO SUBMIT] • [BACKSPACE TO RESET CELL]
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '100px' }}>
          <h2 style={{ color: '#cbd5e1' }}>Waiting for the teacher to start a lesson...</h2>
        </div>
      )}
    </div>
  );
}

export default StudentPortal;