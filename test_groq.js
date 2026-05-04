const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const GROQ_API_KEY = "YOUR_GROQ_API_KEY";

async function testGroqVision() {
    console.log("Testing Groq Vision...");
    
    const tinyImg = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    
    const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0"
        },
        body: JSON.stringify({
            model: "llama-3.2-90b-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "What is in this image?" },
                        { type: "image_url", image_url: { url: `data:image/png;base64,${tinyImg}` } }
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
