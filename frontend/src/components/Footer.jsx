import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        width: "100%",
        textAlign: "center",
        fontSize: "12px",
        color: "var(--text-secondary)",
        padding: "12px 24px",
        borderTop: "1px solid var(--border-glow)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "var(--bg-panel)",
        letterSpacing: "0.5px",
        flexShrink: 0,
        zIndex: 5
      }}
    >
      <span style={{ color: 'var(--neon-cyan)' }}>Nexora AI </span>
       © 2026 Nexora Systems.
    </footer>
  );
};

export default Footer;
