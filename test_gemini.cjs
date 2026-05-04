const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";

async function fetchModels() {
    console.log("Fetching Gemini Models...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
    const data = await response.json();
    console.log(data.models.map(m => m.name).filter(n => n.includes('gemini')));
}

fetchModels();
