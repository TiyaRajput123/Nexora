import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import InputBox from './components/InputBox';
import VoiceButton from './components/VoiceButton';
import Auth from './components/Auth';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [status, setStatus] = useState('idle'); // idle, listening, thinking, speaking
  const [voiceMode, setVoiceMode] = useState(false);
  const [activeTab, setActiveTab] = useState('new');
  const [theme, setTheme] = useState('dark');
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('nexora_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const audioRef = useRef(null);

  useEffect(() => {
    document.body.className = theme === 'dark' ? '' : 'light-mode';
  }, [theme]);

  useEffect(() => {
    if (musicEnabled && audioRef.current) {
      audioRef.current.volume = 0.05;
      audioRef.current.play().catch(e => console.log('Audio play failed', e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [musicEnabled]);
  
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  // Persist history to local storage
  useEffect(() => {
    localStorage.setItem('nexora_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (activeTab === 'new') {
      window.speechSynthesis.cancel();
      setMessages([]);
      setCurrentChatId(null);
      setStatus('idle');
      setActiveTab('chat'); // Reset to chat tab after clearing
    }
  }, [activeTab]);

  // Handle Speech Recognition
  useEffect(() => {
    let recognition = null;
    
    if (status === 'listening') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          console.log("Voice Transcript:", transcript);
          handleSendMessage(transcript);
        };

        recognition.onerror = (event) => {
          console.error("Speech Recognition Error:", event.error);
          setStatus('idle');
          if (voiceMode) setVoiceMode(false);
        };

        recognition.onend = () => {
          // If we haven't switched to thinking/speaking, go back to idle
          if (status === 'listening') {
             setStatus('idle');
          }
        };

        recognition.start();
      } else {
        alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
        setStatus('idle');
      }
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, [status]);

  // Connect to Python Backend API
  const handleSendMessage = async (text, file = null) => {
    const displayMsg = file 
      ? (text ? `${text} [File: ${file.name}]` : `Attached document: ${file.name}`) 
      : text;
    
    if (!displayMsg.trim()) return;

    const newMsg = { sender: 'user', text: displayMsg };
    const newMsgArr = [...messages, newMsg];
    setMessages(newMsgArr);
    setStatus('thinking');

    // Update or create history entry
    let newId = currentChatId;
    if (!currentChatId) {
      newId = Date.now();
      setCurrentChatId(newId);
      const title = text ? (text.substring(0, 30) + (text.length > 30 ? "..." : "")) : "Document Chat";
      setHistory(prev => [{
        id: newId,
        title: title,
        messages: newMsgArr,
        timestamp: new Date().toLocaleString()
      }, ...prev]);
    } else {
      setHistory(prev => prev.map(item => 
        item.id === currentChatId ? { ...item, messages: newMsgArr } : item
      ));
    }
    
    try {
      let aiResponse = '';
      let promptText = text;

      if (file) {
        // Read file content as text
        try {
          const fileContent = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error("Failed to read file"));
            reader.readAsText(file);
          });
          
          promptText = `[User Request]: ${text || "Please analyze and provide a high-level explanation of this document."}\n\n[Document Content from "${file.name}"]: \n--------\n${fileContent}\n--------\nPlease fulfill the User Request based on the provided document content above.`;
        } catch (fileError) {
          console.error("File read error:", fileError);
          promptText = text || `I uploaded ${file.name} but couldn't read its text content.`;
        }
      }

      // Send to FastAPI Python backend
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptText })
      });
      
      if (!res.ok) throw new Error('Backend server is not running');
      const data = await res.json();
      aiResponse = data.response;

      const updatedMsgs = [...newMsgArr, { sender: 'ai', text: aiResponse }];
      setMessages(updatedMsgs);

      // Update history with AI response
      setHistory(prev => prev.map(item => 
        item.id === newId ? { ...item, messages: updatedMsgs } : item
      ));

      // AI Voice Synthesis
      const speech = new SpeechSynthesisUtterance(aiResponse);
      speech.pitch = 1.2;
      speech.rate = 1.0;
      
      speech.onstart = () => {
        setStatus('speaking');
      };
      
      speech.onend = () => {
        setStatus('idle');
      };

      window.speechSynthesis.speak(speech);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'ai', text: "Error connecting to backend server. Make sure Python backend is running on :8000" }]);
      setStatus('idle');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('new');
  };

  if (!isAuthenticated) {
    return (
      <div className={`app-container ${theme}`}>
        <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" loop />
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                left: `${Math.random() * 100}vw`,
                top: `${Math.random() * 100}vh`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            ></div>
          ))}
        </div>
        <Auth onLogin={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className={`app-container ${theme}`}>
      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" loop />
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          ></div>
        ))}
      </div>

      <Sidebar 
        isOpen={sidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme}
        setTheme={setTheme}
        musicEnabled={musicEnabled}
        setMusicEnabled={setMusicEnabled}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <Header 
          status={status} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          theme={theme}
          setTheme={setTheme}
          musicEnabled={musicEnabled}
          setMusicEnabled={setMusicEnabled}
        />

        {voiceMode ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <button 
               className="icon-btn glass-panel" 
               onClick={() => { setVoiceMode(false); setStatus('idle'); }}
               style={{ position: 'absolute', top: '40px', right: '40px', width: '50px', height: '50px', borderRadius: '50%' }}
            >
              ✕
            </button>
            <VoiceButton 
              status={status} 
              toggleVoiceMode={() => {
                if (status === 'listening') {
                  setStatus('idle');
                } else if (status === 'idle') {
                  setStatus('listening');
                }
              }} 
            />
          </div>
        ) : activeTab === 'history' ? (
          <div className="chat-area" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 className="font-orbitron glow-text-purple" style={{ marginBottom: '24px' }}>Chat History</h2>
            {history.length === 0 ? (
               <div style={{ textAlign: 'center', opacity: 0.6, marginTop: '40px' }}>
                  <p>Your previous conversations will be saved here.</p>
               </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {history.map(item => (
                  <div 
                    key={item.id} 
                    className="glass-panel" 
                    style={{ padding: '20px', borderRadius: '16px', cursor: 'pointer', transition: '0.3s', position: 'relative' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--neon-purple)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                    onClick={() => {
                       setMessages(item.messages);
                       setCurrentChatId(item.id);
                       setActiveTab('chat');
                    }}
                  >
                    <button 
                      style={{ 
                        position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ff4b4b', cursor: 'pointer', fontSize: '1.2rem', padding: '5px' 
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setHistory(prev => prev.filter(h => h.id !== item.id));
                      }}
                    >
                      ✕
                    </button>
                    <h4 style={{ color: 'var(--neon-cyan)', marginBottom: '8px' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{item.timestamp}</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.messages[0]?.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'settings' ? (
          <div className="chat-area settings-view">
            <h2 className="font-orbitron glow-text-blue" style={{ marginBottom: '32px' }}>Settings</h2>
            
            <div className="settings-grid">
              <div className="settings-card glass-panel">
                <h3>Appearance</h3>
                <p>Customize how Nexora looks on your screen.</p>
                <div className="settings-action">
                  <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                  <button className="subtle-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                  </button>
                </div>
              </div>

              <div className="settings-card glass-panel">
                <h3>Audio & Music</h3>
                <p>Control background ambience and voice feedback.</p>
                <div className="settings-action">
                  <span>Background Music: {musicEnabled ? 'On' : 'Off'}</span>
                  <button className="subtle-btn" onClick={() => setMusicEnabled(!musicEnabled)}>
                    {musicEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>

              <div className="settings-card glass-panel" style={{ borderLeft: '4px solid #ff4b4b' }}>
                <h3 style={{ color: '#ff4b4b' }}>Account</h3>
                <p>Manage your session and account details.</p>
                <div className="settings-action">
                  <span>Current Session: Active</span>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout from Nexora
                  </button>
                </div>
              </div>

              <div className="settings-card glass-panel">
                <h3>System Info</h3>
                <p>Nexora Intelligence Core v1.0.4</p>
                <div className="settings-action">
                  <span>Backend Status: Online</span>
                  <span style={{ color: 'var(--neon-cyan)' }}>Latency: 14ms</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="chat-interface">
              <ChatWindow messages={messages} status={status} />
              <InputBox 
                onSendMessage={handleSendMessage} 
                status={status} 
                setStatus={setStatus}
                setVoiceMode={setVoiceMode}
              />
            </div>
            <Footer />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
