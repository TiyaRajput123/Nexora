from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
import webbrowser

from dotenv import load_dotenv
from datetime import datetime
load_dotenv()
# Initialize Groq Client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

# Allow React to connect to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

# Global message history with system prompt
messages = [
    {
        "role": "system",
        "content": (
            "You are Nexora, a sophisticated and futuristic AI Voice Assistant. "
            "Your personality is helpful, intelligent, and slightly futuristic. "
            "When users upload documents or files, do not just repeat their content. "
            "Instead, provide a clear, insightful analysis, summary, or explanation as requested. "
            "Always aim for high-quality, professional responses."
        )
    }
]

def handle_local_commands(command: str):
    command = command.lower()

    # YouTube Play Command: "play [song] on youtube", "on youtube play [song]", etc.
    if "youtube" in command and ("play" in command or "search" in command):
        query = ""
        if "play" in command:
            query = command.split("play")[-1].replace("on youtube", "").replace("in youtube", "").replace("youtube", "").strip()
        elif "search" in command:
            query = command.split("search")[-1].replace("on youtube", "").replace("in youtube", "").replace("youtube", "").strip()
        
        if query:
            import urllib.parse
            url_query = urllib.parse.quote(query)
            webbrowser.open(f"https://www.youtube.com/results?search_query={url_query}")
            return f"Searching for '{query}' on YouTube and playing the top result."
            
    if "youtube" in command:
        webbrowser.open("https://www.youtube.com")
        return "Opening YouTube for you."
    elif "google" in command:
        webbrowser.open("https://www.google.com")
        return "Opening Google Search."
    elif "notepad" in command:
        os.system("notepad")
        return "Opening Notepad."
    elif "vscode" in command or ("vs" in command and "code" in command):
        os.system("code")
        return "Opening Visual Studio Code."
    elif "time" in command:
        current_time = datetime.now().strftime("%I:%M %p")
        return f"The current system time is {current_time}."
        
    return None

@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    global messages
    user_msg = req.message
    
    # 1. Check local commands first
    local_response = handle_local_commands(user_msg)
    if local_response:
        return {"response": local_response}
        
    # 2. Call Groq AI if no local command matched
    messages.append({"role": "user", "content": user_msg})
    
    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile"
        )
        reply = chat_completion.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})
        return {"response": reply}
    except Exception as e:
        return {"response": f"AI process failed: {str(e)}"}

@app.get("/")
def home():
    return {"message": "Backend is running 🚀"}