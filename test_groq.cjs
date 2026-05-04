const GROQ_API_KEY = "YOUR_GROQ_API_KEY";

async function testGroqVision() {
    console.log("Testing Llama 4 Scout Vision...");
    
    // Create a simple red 100x100 PNG base64
    const validImg = "iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAZUlEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4GscHAAAVQ0bJwAAAABJRU5ErkJggg==";
    
    const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "What color is this image?" },
                        { type: "image_url", image_url: { url: `data:image/png;base64,${validImg}` } }
                    ]
                }
            ]
        })
    });
    
    console.log("Status:", response.status);
    const text = await response.text();
    console.log("Response:", text);
}

testGroqVision();
