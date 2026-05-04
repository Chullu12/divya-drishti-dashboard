const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "YOUR_GROQ_API_KEY";

async function fetchGroqJSON(prompt) {
    const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150, temperature: 0.1 
        })
    });
    
    if (!response.ok) throw new Error("Groq API Error");
    
    const data = await response.json();
    return data.choices[0].message.content;
}

/**
 * Parses natural language into structured commands for the Teacher Portal.
 */
export async function parseTeacherCommand(transcript) {
  const prompt = `You are the core logic engine for an educator portal that manages IoT braille devices for visually impaired students.
A teacher just spoke this instruction: "${transcript}"

Extract their intent and map it to one of these commands. Return ONLY valid JSON, nothing else.

Intents:
1. "NAVIGATE_TAB" (args: { "tab": "dashboard" | "curriculum" })
   - Example: "Take me to the curriculum", "Go to dashboard"
2. "DEPLOY_AI_LESSON" (args: {})
   - Example: "Deploy the smart lesson", "Run the adaptive AI"
3. "ADD_STUDENT" (args: { "name": "StudentName" })
   - Example: "Add profile for John", "Create a student named Alice"
4. "RESET_STUDENT" (args: {})
   - Example: "Wipe this student's data", "Reset the profile"
5. "PUSH_CHAR" (args: { "char": "A" | "1" | "?" })
   - Example: "Push the letter A to the braille cell", "Send number 5"
6. "UNKNOWN" (args: { "reply": "A helpful short response explaining you couldn't find the command." })
   - If it doesn't match a command, act as a helpful AI assistant.

JSON format:
{
  "intent": "NAVIGATE_TAB",
  "args": { "tab": "curriculum" }
}
`;
  
  try {
    const text = await fetchGroqJSON(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("No JSON found in response");
    }
  } catch (error) {
    console.error("AI Router Error:", error);
    return { intent: "UNKNOWN", args: { reply: "Sorry, my systems are temporarily offline." } };
  }
}

/**
 * Parses natural language into structured commands for the Student Portal.
 */
export async function parseStudentCommand(transcript) {
  const prompt = `You are the core logic engine for a blind student's learning portal.
The student just spoke this instruction: "${transcript}"

Extract their intent and map it to one of these commands. Return ONLY valid JSON, nothing else.

Intents:
1. "NAVIGATE_TAB" (args: { "tab": "classroom" | "vision" | "fluency" })
   - Example: "Open the classroom", "Take me to the camera", "Open encyclopedia"
   - "vision" is the camera/scanner tab. "fluency" is the encyclopedia.
2. "SCAN_OBJECT" (args: {})
   - Example: "Scan this object", "Take a picture", "What am I holding"
3. "CLEAR_CELL" (args: {})
   - Example: "Clear the braille cell", "Delete that letter"
4. "UNKNOWN" (args: { "reply": "A short, 1-2 sentence encouraging answer to their general question." })
   - If it's a general question, act as a helpful tutor.

JSON format:
{
  "intent": "NAVIGATE_TAB",
  "args": { "tab": "vision" }
}
`;
  
  try {
    const text = await fetchGroqJSON(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("No JSON found in response");
    }
  } catch (error) {
    console.error("AI Router Error:", error);
    return { intent: "UNKNOWN", args: { reply: "Sorry, I had trouble understanding that." } };
  }
}
