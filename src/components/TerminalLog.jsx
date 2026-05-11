import React, { useState, useEffect, useRef } from 'react';

export default function TerminalLog() {
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const logEndRef = useRef(null);

  useEffect(() => {
    const handleLog = (e) => {
      const { action, table, result, message } = e.detail;
      const timestamp = new Date().toLocaleTimeString();
      const newLog = {
        id: Date.now(),
        timestamp,
        action: action?.toUpperCase() || 'EVENT',
        table: table?.toUpperCase() || 'SYS',
        message: message || (result?.name ? `"${result.name}"` : result?.id ? result.id : JSON.stringify(result)),
        type: action === 'delete' ? 'error' : action === 'create' ? 'success' : 'info'
      };
      setLogs(prev => [...prev.slice(-49), newLog]);
    };

    window.addEventListener('surreal-log', handleLog);
    return () => window.removeEventListener('surreal-log', handleLog);
  }, []);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const styles = {
    container: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(10, 10, 15, 0.95)',
      borderTop: '1px solid var(--border)',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '0.7rem',
      zIndex: 1000,
      transition: 'height 0.3s ease',
      height: isExpanded ? '200px' : '30px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 1rem',
      backgroundColor: 'var(--bg-secondary)',
      cursor: 'pointer',
      justifyContent: 'space-between',
      borderBottom: isExpanded ? '1px solid var(--border)' : 'none'
    },
    logList: {
      flex: 1,
      overflowY: 'auto',
      padding: '0.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.2rem'
    },
    logLine: {
      display: 'flex',
      gap: '1rem',
      whiteSpace: 'nowrap'
    },
    timestamp: { color: 'var(--text-muted)' },
    action: (type) => ({
      color: type === 'success' ? 'var(--accent-green)' : 
             type === 'error' ? 'var(--error)' : 'var(--accent-blue)',
      width: '60px'
    }),
    message: { color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>TERMINAL_LOG</span>
          <span style={{ color: 'var(--text-muted)' }}>
            {logs.length > 0 ? `> ${logs[logs.length-1].action}: ${logs[logs.length-1].message}` : '> IDLE'}
          </span>
        </div>
        <span style={{ color: 'var(--text-muted)' }}>{isExpanded ? '▼' : '▲'}</span>
      </div>
      
      {isExpanded && (
        <div style={styles.logList}>
          {logs.map(log => (
            <div key={log.id} style={styles.logLine}>
              <span style={styles.timestamp}>[{log.timestamp}]</span>
              <span style={styles.action(log.type)}>{log.action}</span>
              <span style={{ color: 'var(--text-muted)', width: '80px' }}>{log.table}</span>
              <span style={styles.message}>{log.message}</span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      )}
    </div>
  );
}
