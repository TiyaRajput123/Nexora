import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

const ChatWindow = ({ messages, status }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  return (
    <div className="chat-area">
      {messages.length === 0 && (
        <div style={{ margin: 'auto', textAlign: 'center', opacity: 0.6 }}>
          <div className="logo-icon" style={{ margin: '0 auto 24px auto', width: '64px', height: '64px', animation: 'pulse-glow-small 3s infinite alternate' }}></div>
          <h2 className="font-orbitron" style={{ color: 'var(--neon-cyan)', marginBottom: '16px' }}>How can I help you today?</h2>
          <p>Try speaking or typing a command.</p>
        </div>
      )}
      
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} message={msg} />
      ))}

      {status === 'thinking' && (
        <div className="message ai">
          <div className="ai-avatar" style={{ left: '-50px', position: 'absolute' }}>
           <div className="status-dot thinking"></div>
          </div>
          <div className="typing-dots">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      )}

      {status === 'listening' && (
        <div className="message user" style={{ opacity: 0.7, fontStyle: 'italic' }}>
          Listening...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
