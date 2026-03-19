import React, { useState, useRef } from 'react';
import { Mic, Send, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';

const InputBox = ({ onSendMessage, status, setStatus, setVoiceMode }) => {
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (inputText.trim() || attachedFile) {
      onSendMessage(inputText, attachedFile);
      setInputText('');
      setAttachedFile(null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
    e.target.value = '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = () => {
    if (setVoiceMode) {
      setVoiceMode(true);
      setStatus('listening');
    }
  };

  return (
    <div 
      className="input-section glass-panel" 
      style={{ 
        flexShrink: 0, 
        zIndex: 10,
        position: 'relative',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottom: 'none',
        paddingTop: '32px'
      }}
    >
      {attachedFile && (
        <div className="file-preview-bubble glass-panel">
          <Paperclip size={14} color="var(--neon-cyan)" />
          <span className="file-name">{attachedFile.name}</span>
          <button className="remove-file" onClick={() => setAttachedFile(null)}>✕</button>
        </div>
      )}

      {/* Input Row */}
      <div className="input-container">
        <input 
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />

        <button className="icon-btn" onClick={() => fileInputRef.current?.click()}>
          <Paperclip size={20} />
        </button>
        
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={attachedFile ? "Add a message about this file..." : "Message Nexora..."}
          className="chat-input"
        />

        <motion.button 
          className="icon-btn" 
          onClick={toggleVoice}
          animate={{
            scale: status === 'listening' ? [1, 1.2, 1] : 1,
            color: status === 'listening' ? '#ff0055' : 'var(--text-secondary)'
          }}
          transition={{ repeat: status === 'listening' ? Infinity : 0, duration: 1.5 }}
          style={{ width: '40px', height: '40px' }}
        >
          <Mic size={24} />
        </motion.button>
        
        <button className="send-btn" onClick={handleSend} disabled={!inputText.trim() && !attachedFile}>
          <Send size={20} />
        </button>
      </div>

    </div>
  );
};

export default InputBox;
