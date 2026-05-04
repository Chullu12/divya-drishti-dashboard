import re

with open("d:\\Divya-Drishti-Project\\src\\pages\\TeacherDash.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add imports
imports = """import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { ref, onValue, set, remove } from 'firebase/database';
import { GoogleGenerativeAI } from '@google/generative-ai';
import TeacherHeader from '../components/Teacher/TeacherHeader';
import ControlDashboard from '../components/Teacher/ControlDashboard';
import CurriculumManagement from '../components/Teacher/CurriculumManagement';
"""

content = re.sub(
    r"import React.*?\nimport { GoogleGenerativeAI } from '@google/generative-ai';\n",
    imports,
    content,
    flags=re.DOTALL
)

# Replace the UI rendering section
new_return = """  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: 'Segoe UI, sans-serif', color: '#333' }}>
      <TeacherHeader
        currentStudent={currentStudent}
        studentList={studentList}
        setCurrentStudent={setCurrentStudent}
        handleResetStudent={handleResetStudent}
      />

      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <input style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', flex: 1 }} placeholder="Enter new student name..." value={newStudentInput} onChange={(e) => setNewStudentInput(e.target.value)} />
        <button onClick={handleAddStudent} style={{ padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', background: '#db2777', color: '#fff', width: '150px' }}>Add Profile</button>
      </div>

      <nav style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button onClick={() => setActiveTab('dashboard')} style={{ padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', flex: 1, background: activeTab === 'dashboard' ? '#db2777' : '#f0f0f0', color: activeTab === 'dashboard' ? '#fff' : '#333' }}>🎛️ CONTROL DASHBOARD</button>
        <button onClick={() => setActiveTab('curriculum')} style={{ padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', flex: 1, background: activeTab === 'curriculum' ? '#db2777' : '#f0f0f0', color: activeTab === 'curriculum' ? '#fff' : '#333' }}>📚 CURRICULUM MANAGEMENT</button>
      </nav>

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

      <div onClick={triggerVoiceAssistant} style={{ position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px', borderRadius: '50%', background: isListening ? '#ef4444' : '#3b82f6', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', cursor: 'pointer', zIndex: 1000, transition: 'all 0.3s ease', animation: isListening ? 'pulse 1.5s infinite' : 'none' }} title="Press 'V' or Click to speak">
        {isListening ? "👂" : "🎙️"}
      </div>
    </div>
  );
}"""

content = re.sub(
    r"  const cardStyle = \{ background: '#ffffff'.*?\}\n\nexport default TeacherDash;\n?",
    new_return + "\n\nexport default TeacherDash;\n",
    content,
    flags=re.DOTALL
)

with open("d:\\Divya-Drishti-Project\\src\\pages\\TeacherDash.jsx", "w", encoding="utf-8") as f:
    f.write(content)
