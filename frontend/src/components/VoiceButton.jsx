import React from 'react';
import { Mic, Activity } from 'lucide-react';

const VoiceButton = ({ status, toggleVoiceMode }) => {
  return (
    <div className="central-voice glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
      <h3 className="font-orbitron" style={{ color: 'var(--neon-cyan)', marginBottom: '16px' }}>
        {status === 'listening' ? 'LISTENING TO YOU...' : status === 'speaking' ? 'NEXORA IS SPEAKING...' : 'VOICE MODE ENABLED'}
      </h3>
      
      <div 
        className={`voice-orb ${status === 'listening' ? 'listening' : ''}`}
        onClick={toggleVoiceMode}
      >
        {status === 'speaking' ? (
          <Activity size={48} color="#00f0ff" />
        ) : (
          <Mic size={48} />
        )}
      </div>

      <p style={{ color: 'var(--text-secondary)', marginTop: '24px', fontSize: '0.9rem' }}>
        {status === 'listening' ? 'Tap to stop recording' : 'Tap to start speaking'}
      </p>

      {status === 'speaking' && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              style={{
                width: '6px',
                height: '24px',
                background: 'var(--neon-cyan)',
                borderRadius: '4px',
                animation: `bounce 1s infinite alternate-reverse`,
                animationDelay: `${i * 0.1}s`
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceButton;
