import React from 'react';

export default function Navbar({ theme, toggleTheme, dbStatus, onWikiOpen }) {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '3rem', 
      borderBottom: '1px solid var(--border)', 
      paddingBottom: '1rem' 
    }}>
      <div>
        <h1 className="logo-text" style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '2px' }}>
          <span className="sur">SUR</span>
          <span className="ban">BAN</span>
          <span className="ai">AI</span>
        </h1>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>sur·ban·ai = surreal + kanban + ai</div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button 
          onClick={onWikiOpen}
          style={{ 
            padding: '0.5rem 0.8rem', 
            backgroundColor: 'var(--bg-secondary)', 
            color: 'var(--accent-green)', 
            border: '1px solid var(--border)', 
            fontSize: '1rem',
            cursor: 'pointer'
          }}
          title="Wiki / Hilfe (?)"
        >
          [ ? ]
        </button>
        <button 
          onClick={toggleTheme}
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: 'var(--bg-secondary)', 
            color: 'var(--text-primary)', 
            border: '1px solid var(--border)', 
            fontSize: '0.8rem' 
          }}
        >
          THEME: [{theme.toUpperCase()}]
        </button>
        <div style={{ 
          padding: '0.5rem 1rem', 
          border: '1px solid var(--border)', 
          color: dbStatus === 'ONLINE' ? 'var(--accent-green)' : (dbStatus === 'CONNECTING...' ? 'var(--accent-orange)' : 'var(--error)'), 
          fontSize: '0.8rem' 
        }}>
          DB_STATUS: [{dbStatus}]
        </div>
      </div>
    </header>
  );
}
