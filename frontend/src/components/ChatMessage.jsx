import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`message ${isUser ? 'user' : 'ai'}`}
      style={{ alignSelf: isUser ? 'flex-end' : 'flex-start' }}
    >
      {!isUser && (
        <div className="ai-avatar">
          <Bot size={20} color="#fff" />
        </div>
      )}
      <div className="message-content">
        {message.text}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
