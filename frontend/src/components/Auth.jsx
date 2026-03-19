import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin(); // Mock login success
    }
  };

  return (
    <div className="auth-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', zIndex: 100 }}>
      <motion.div 
        className="glass-panel"
        style={{ padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '24px' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="logo-text font-orbitron" style={{ justifyContent: 'center', fontSize: '1.8rem' }}>
          <div className="logo-icon"></div>
          NEXORA
        </div>
        
        <h2 style={{ textAlign: 'center', color: 'var(--text-primary)' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" className="auth-btn font-orbitron">
            {isLogin ? 'INITIATE SYSTEM' : 'REGISTER ACCESS'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an access key? Register" : "Already registered? Login"}
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
