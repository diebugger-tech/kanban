import React, { useState, useEffect, useCallback } from 'react';
import db from '../lib/db';
import { marked } from 'marked';

export default function WikiPanel({ projekt, onClose }) {
  const [activePage, setActivePage] = useState('doc');
  const [entries, setEntries] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [currentScope, setCurrentScope] = useState(projekt?.name || 'SurKAi');
  const [loading, setLoading] = useState(true);

  // Load all projects for the switcher
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await db.query('SELECT name FROM projekt ORDER BY name ASC');
        const data = res[0]?.result || res[0] || [];
        setAllProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects for wiki:', err);
      }
    };
    fetchProjects();
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch both project-specific entries and global system entries
      const result = await db.query(
        'SELECT * FROM wiki WHERE projekt = $name OR typ = "system" ORDER BY erstellt DESC',
        { name: currentScope }
      );
      setEntries(result[0] ?? []);
    } catch (err) {
      console.error('Wiki load failed:', err);
    } finally {
      setLoading(false);
    }
  }, [currentScope]);

  useEffect(() => {
    load();
    const unsub = db.live('wiki', ({ action, result }) => {
      if (result.projekt === currentScope || result.typ === 'system') load();
    });
    return () => unsub.then(u => u());
  }, [load, currentScope]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const sections = [
    { id: 'system', title: 'System', icon: '⚙️', type: 'system' },
    { id: 'doc', title: 'Docs', icon: '📄', type: 'project' },
    { id: 'bug', title: 'Bugs', icon: '🪲', type: 'project' },
    { id: 'todo', title: 'TODOs', icon: '✅', type: 'project' },
    { id: 'shortcuts', title: 'Shortcuts', icon: '⌨️', type: 'meta' },
  ];

  const getCount = (sectionId) => {
    if (sectionId === 'system') return entries.filter(e => e.typ === 'system').length;
    return entries.filter(e => e.typ === sectionId && e.projekt === currentScope).length;
  };

  const renderMarkdown = (content) => {
    return { __html: marked.parse(content) };
  };

  const renderContent = () => {
    if (activePage === 'shortcuts') {
      return (
        <div className="wiki-markdown">
          <h2>⌨️ Tastaturkürzel</h2>
          <p>Effizientes Arbeiten mit SurKAi:</p>
          <table style={styles.table}>
            <thead>
              <tr><th style={styles.th}>Taste</th><th style={styles.th}>Aktion</th></tr>
            </thead>
            <tbody>
              <tr><td style={styles.td}><code>?</code></td><td style={styles.td}>Wiki öffnen/schließen</td></tr>
              <tr><td style={styles.td}><code>T</code></td><td style={styles.td}>Todo-Panel öffnen/schließen</td></tr>
              <tr><td style={styles.td}><code>ESC</code></td><td style={styles.td}>Aktives Panel schließen</td></tr>
              <tr><td style={styles.td}><code>J</code> / <code>K</code></td><td style={styles.td}>Navigation (Detail-Panel)</td></tr>
              <tr><td style={styles.td}><code>+</code></td><td style={styles.td}>Neues Projekt (Navbar)</td></tr>
            </tbody>
          </table>
        </div>
      );
    }

    const filtered = entries.filter(e => {
      if (activePage === 'system') return e.typ === 'system';
      return e.typ === activePage && e.projekt === currentScope;
    });

    return (
      <div className="wiki-markdown">
        <h2 style={{ textTransform: 'uppercase' }}>
          {sections.find(p => p.id === activePage)?.icon} {activePage === 'system' ? 'System Rules' : activePage + 's'}
        </h2>
        
        {loading ? (
          <div className="skeleton" style={{ height: '100px', width: '100%' }}></div>
        ) : filtered.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', marginTop: '2rem' }}>&gt; NO ENTRIES FOUND FOR [{currentScope}]</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1.5rem' }}>
            {filtered.map(entry => (
              <div key={entry.id} style={styles.entry}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(0, 255, 170, 0.1)', paddingBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--accent-green)' }}>{entry.titel}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {entry.prioritaet && (
                      <span style={{ 
                        fontSize: '0.6rem', 
                        padding: '0.1rem 0.4rem', 
                        border: '1px solid currentColor',
                        color: entry.prioritaet === 'high' ? 'var(--error)' : 'var(--accent-orange)'
                      }}>
                        {entry.prioritaet.toUpperCase()}
                      </span>
                    )}
                    <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
                      {entry.typ.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div 
                  className="markdown-body"
                  dangerouslySetInnerHTML={renderMarkdown(entry.inhalt)}
                  style={{ fontSize: '0.9rem', lineHeight: '1.6' }}
                />

                <div style={{ marginTop: '1.2rem', fontSize: '0.65rem', color: 'var(--text-muted)', borderTop: '1px dotted var(--border)', paddingTop: '0.5rem' }}>
                  PROJEKT: {entry.projekt} // STATUS: {entry.status.toUpperCase()} // UPDATED: {new Date(entry.geaendert).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const styles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'var(--bg-overlay)', backdropFilter: 'blur(10px)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    },
    container: {
      width: '100%', maxWidth: '1000px', height: '85vh',
      backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)',
      boxShadow: '0 0 50px rgba(0,0,0,0.5)', display: 'flex', position: 'relative',
      overflow: 'hidden'
    },
    sidebar: {
      width: '260px', borderRight: '1px solid var(--border)', padding: '1.5rem',
      backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem',
      overflowY: 'auto'
    },
    main: {
      flex: 1, padding: '3rem', overflowY: 'auto', color: 'var(--text-primary)',
      backgroundColor: 'var(--bg-primary)'
    },
    navItem: (active) => ({
      padding: '0.8rem 1rem', cursor: 'pointer', borderLeft: '3px solid transparent',
      color: active ? 'var(--accent-green)' : 'var(--text-secondary)',
      backgroundColor: active ? 'rgba(0, 255, 170, 0.05)' : 'transparent',
      borderColor: active ? 'var(--accent-green)' : 'transparent',
      fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.7rem',
      transition: 'all 0.2s',
      marginBottom: '2px'
    }),
    closeBtn: {
      position: 'absolute', top: '1rem', right: '1rem',
      background: 'transparent', border: 'none', color: 'var(--text-muted)',
      fontSize: '1rem', cursor: 'pointer', fontFamily: 'monospace',
      zIndex: 10
    },
    projectSelect: {
      width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border)', color: 'var(--accent-green)',
      fontFamily: 'monospace', fontSize: '0.8rem', marginBottom: '1.5rem',
      outline: 'none'
    },
    table: {
      width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '0.85rem'
    },
    th: {
      textAlign: 'left', borderBottom: '2px solid var(--border)', padding: '0.8rem', color: 'var(--accent-green)'
    },
    td: {
      borderBottom: '1px solid var(--border)', padding: '0.8rem'
    },
    entry: {
      padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
      borderRadius: '4px'
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.container}>
        <button onClick={onClose} style={styles.closeBtn}>[ ESC_CLOSE ]</button>
        
        <aside style={styles.sidebar}>
          <div style={{ color: 'var(--accent-green)', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem', letterSpacing: '1px' }}>SURBANAI_WIKI</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem', marginBottom: '1.5rem' }}>v1.3.0_STABLE</div>
          
          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.3rem' }}>ACTIVE_CONTEXT:</div>
          <select 
            style={styles.projectSelect} 
            value={currentScope} 
            onChange={(e) => setCurrentScope(e.target.value)}
          >
            <option value="SurKAi">SurKAi (Global)</option>
            {allProjects.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>

          {sections.map(section => (
            <div 
              key={section.id} 
              style={styles.navItem(activePage === section.id)}
              onClick={() => setActivePage(section.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flex: 1 }}>
                <span>{section.icon}</span> {section.title}
              </div>
              {section.type !== 'meta' && (
                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>[{getCount(section.id)}]</span>
              )}
            </div>
          ))}

          <div style={{ marginTop: 'auto', padding: '1rem', border: '1px dashed var(--border)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <div style={{ color: 'var(--accent-orange)', marginBottom: '0.3rem' }}>TERMINAL_STATUS:</div>
            &gt; Live Queries: Active<br/>
            &gt; Context: {currentScope}<br/>
            &gt; User: {import.meta.env.VITE_SURREAL_USER || 'root'}
          </div>
        </aside>

        <main style={styles.main}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
