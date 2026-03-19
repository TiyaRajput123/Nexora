import { MessageSquare, Clock, Settings, Zap, Sun, Moon, Volume2, VolumeX, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.jpeg';

const Sidebar = ({ isOpen, activeTab, setActiveTab, theme, setTheme, musicEnabled, setMusicEnabled, onLogout }) => {
  return (
    <motion.aside 
      className="sidebar glass-panel"
      initial={{ x: -280 }}
      animate={{ x: isOpen ? 0 : -280 }}
      transition={{ duration: 0.4, type: 'spring', damping: 20 }}
    >
      <div className="logo-container">
  <img src={logo} alt="Nexora Logo" className="logo-img" />

      </div>

      <nav className="menu-items">
        <div 
          className={`menu-item ${(activeTab === 'new' || activeTab === 'chat') ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          <MessageSquare size={20} />
          New Chat
        </div>
        <div 
          className={`menu-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={20} />
          History
        </div>
        <div style={{ flex: 1 }}></div>
        <div 
          className="menu-item"
          onClick={() => {}}
        >
          <Zap size={20} color="var(--neon-purple)" />
          Upgrade to Nexus
        </div>
        
        <div 
          className="menu-item"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </div>
        
        <div 
          className="menu-item"
          onClick={() => setMusicEnabled(!musicEnabled)}
        >
          {musicEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          {musicEnabled ? 'Music: ON' : 'Music: OFF'}
        </div>

        <div 
          className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={20} />
          Settings
        </div>

        <div 
          className="menu-item logout-item-sidebar"
          onClick={onLogout}
          style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}
        >
          <LogOut size={20} color="#ff4b4b" />
          <span style={{ color: '#ff4b4b' }}>Logout</span>
        </div>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
