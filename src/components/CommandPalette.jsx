import React, { useState, useEffect, useRef } from 'react';

export default function CommandPalette({ projects, onSelectProject, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filtered = projects.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description?.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      if (filtered[selectedIndex]) {
        onSelectProject(filtered[selectedIndex].id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '15vh',
      zIndex: 2000
    },
    container: {
      width: '100%',
      maxWidth: '600px',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--accent-green)',
      boxShadow: '0 0 30px rgba(0, 255, 170, 0.2)',
      borderRadius: '8px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    input: {
      width: '100%',
      padding: '1.2rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '1px solid var(--border)',
      color: 'var(--accent-green)',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '1.2rem',
      outline: 'none'
    },
    list: {
      maxHeight: '400px',
      overflowY: 'auto',
      padding: '0.5rem'
    },
    item: (active) => ({
      padding: '1rem',
      backgroundColor: active ? 'rgba(0, 255, 170, 0.1)' : 'transparent',
      color: active ? 'var(--accent-green)' : 'var(--text-primary)',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '4px'
    }),
    badge: {
      fontSize: '0.7rem',
      padding: '0.2rem 0.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '4px',
      color: 'var(--text-muted)'
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.container} onClick={e => e.stopPropagation()}>
        <input 
          ref={inputRef}
          style={styles.input}
          placeholder="SEARCH_PROJECTS_OR_COMMANDS..."
          value={query}
          onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
          onKeyDown={handleKeyDown}
        />
        <div style={styles.list}>
          {filtered.length === 0 ? (
            <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>&gt; NO_RESULTS_FOUND</div>
          ) : (
            filtered.map((p, idx) => (
              <div 
                key={p.id} 
                style={styles.item(idx === selectedIndex)}
                onClick={() => { onSelectProject(p.id); onClose(); }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{p.description || 'No description'}</div>
                </div>
                <div style={styles.badge}>{p.status.toUpperCase()}</div>
              </div>
            ))
          )}
        </div>
        <div style={{ padding: '0.8rem', backgroundColor: 'rgba(0,0,0,0.2)', fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span>↑↓ NAVIGATE // ENTER SELECT // ESC CLOSE</span>
          <span>Surbanai OS v1.3</span>
        </div>
      </div>
    </div>
  );
}
