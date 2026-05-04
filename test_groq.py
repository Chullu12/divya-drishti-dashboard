import urllib.request
import json
import base64
from io import BytesIO
from PIL import Image

API_KEY = "YOUR_GROQ_API_KEY"

def test_groq_vision():
    print("Testing Groq Vision...")
    
    # Create a 640x480 solid blue image
    img = Image.new('RGB', (640, 480), color = (0, 0, 255))
    buffered = BytesIO()
    img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Identify the single most prominent physical object. Respond EXACTLY in this format separated by a pipe character: WORD | A beautiful 1-sentence poetic story about it | A highly detailed, 3-sentence educational explanation of what it is, how it works, or its history."},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_str}"}}
                ]
            }
        ]
    }
    
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
    
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("Response:", json.dumps(result, indent=2))
    except urllib.error.HTTPError as e:
        print("Status:", e.code)
        print("Error:", e.read().decode('utf-8'))
    except Exception as e:
        print("Exception:", str(e))

if __name__ == "__main__":
    test_groq_vision()
