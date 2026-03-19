import React from 'react';
import { User, Menu } from 'lucide-react';

const Header = ({ status, setSidebarOpen, sidebarOpen, theme, setTheme, musicEnabled, setMusicEnabled }) => {
  return (
    <header className="header glass-panel">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          className="icon-btn" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ width: '40px', height: '40px' }}
        >
          <Menu size={20} />
        </button>
        <div className="header-title font-orbitron">
          NEXORA <span style={{ color: 'var(--neon-purple)' }}>AI</span> ASSISTANT
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div className="status-indicator font-orbitron">
          {status === 'idle' && (
            <>
              <div className="status-dot"></div>
              IDLE
            </>
          )}
          {status === 'listening' && (
            <>
              <div className="status-dot listening"></div>
              LISTENING...
            </>
          )}
          {status === 'thinking' && (
            <>
              <div className="status-dot thinking"></div>
              THINKING...
            </>
          )}
        </div>

        <div className="profile-icon">
          <User size={20} color="var(--neon-cyan)" />
        </div>
      </div>
    </header>
  );
};

export default Header;
