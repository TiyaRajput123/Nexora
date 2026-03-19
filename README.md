🚀 Nexora – AI Voice Assistant

🔗 Live Demo: https://nexora-omega-mauve.vercel.app/

🌌 Overview

Nexora is a futuristic AI-powered assistant that allows users to interact using both text and voice.
It combines intelligent conversation, real-time responses, and an interactive UI to deliver a next-generation assistant experience.
✨ Key Features
💬 Smart AI Chat

Real-time conversational AI

Context-aware responses using LLM

🎤 Voice Interaction

Speak to Nexora using microphone

Get responses in both text + voice output

🌗 Dark / Light Mode

Toggle between themes

Smooth and modern UI experience

🎵 Music & Controls

Built-in music control button

Enhances interactive experience

⚡ Fast & Responsive

Instant API responses

Clean and smooth UI

🌐 Fully Deployed

Frontend on Vercel

Backend on Render

🛠️ Tech Stack
🔹 Frontend

React (Vite)

HTML, CSS, JavaScript

🔹 Backend

FastAPI (Python)

Groq API (LLM)

🔹 Deployment

Vercel (Frontend)

Render (Backend)

🧩 Project Structure
Nexora/
│
├── backend/
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
⚙️ Local Setup
1️⃣ Clone Repo
git clone https://github.com/your-username/Nexora.git
cd Nexora
2️⃣ Backend Setup
cd backend
pip install -r requirements.txt

Create .env file:

GROQ_API_KEY=your_api_key

Run backend:

uvicorn main:app --reload
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
🔗 API Endpoint

POST /chat

Request:

{
  "message": "Hello Nexora"
}

Response:

{
  "response": "Hello! How can I assist you?"
}
🎯 Unique Highlights

🧠 Combines AI + Voice + UI/UX in one app

🎤 Dual interaction: Speak + Chat

🌗 Modern UX with Dark/Light Mode Toggle

🎵 Extra interactive elements like Music Control

🚀 Fully deployed full-stack project

🔐 Environment Variables
GROQ_API_KEY=your_secret_key

⚠️ Never expose your API key publicly.

🚀 Future Enhancements

🔐 User authentication

💾 Chat history saving

📄 File upload + AI summarization

🌍 Multi-language support

🤖 More advanced voice commands

👩‍💻 Author

Tiya Rajput

Aspiring Full Stack Developer

Interested in AI & Web Development

⭐ Support

If you like this project:
⭐ Star the repo
🚀 Share with others

🌟 Nexora – Talk. Listen. Experience AI.
