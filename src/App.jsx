import React, { useState, useEffect, useRef } from 'react';
import { Surreal } from 'surrealdb';

/**
 * AGENT-K KANBAN DASHBOARD (SURREALDB EDITION)
 * Real-time project tracker using SurrealDB 2.3.10
 */

// Initialize SurrealDB instance
const db = new Surreal();
if (typeof window !== "undefined") window.db = db;

const COLUMNS = [
  { id: 'backlog', title: 'BACKLOG', color: '#00aaff' },
  { id: 'in-progress', title: 'IN PROGRESS', color: '#ffaa00' },
  { id: 'done', title: 'DONE', color: '#00ffaa' }
];

export default function App() {
  const [projects, setProjects] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [dbStatus, setDbStatus] = useState('CONNECTING...');
  const [dbError, setDbError] = useState(null);
  const liveQueryId = useRef(null);

  useEffect(() => {
    async function initDB() {
      try {
        setDbError(null);
        // Connect to SurrealDB (SDK v2.x style)
        await db.connect('ws://127.0.0.1:8000/rpc', {
          namespace: 'pflanternen',
          database: 'projekte',
          authentication: { username: 'root', password: 'root' }
        });
        setDbStatus('ONLINE');

        // Initial Load
        const initialProjects = await db.query('SELECT * FROM projekt').then(r => r[0]);
        setProjects(initialProjects || []);

        // Live Subscription
        liveQueryId.current = await db.live('projekt', ({ action, result }) => {
          if (action === 'CREATE') {
            setProjects(prev => [...prev, result]);
          } else if (action === 'UPDATE' || action === 'CHANGE') {
            setProjects(prev => {
              const exists = prev.find(p => p.id === result.id);
              if (exists) {
                return prev.map(p => p.id === result.id ? result : p);
              } else {
                return [...prev, result];
              }
            });
          } else if (action === 'DELETE') {
            setProjects(prev => prev.filter(p => p.id !== result.id));
          }
        });

      } catch (err) {
        console.error('SurrealDB Error:', err);
        setDbError(err.message || String(err));
        setDbStatus('OFFLINE');
      }
    }

    initDB();

    return () => {
      if (liveQueryId.current) db.kill(liveQueryId.current);
      db.close();
    };
  }, []);

  const onDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.4';
  };

  const onDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = async (e, status) => {
    e.preventDefault();
    if (draggedId) {
      try {
        await db.merge(draggedId, { 
          status,
          updated: new Date().toISOString() 
        });
      } catch (err) {
        console.error('Update failed:', err);
      }
      setDraggedId(null);
    }
  };

  const styles = {
    container: {
      backgroundColor: '#0a0a0b',
      color: '#e0e0e0',
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      padding: '2rem',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    },
    header: {
      borderBottom: '2px solid #333',
      paddingBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '1.5rem',
      letterSpacing: '2px',
      color: '#00ffaa',
      margin: 0,
      textShadow: '0 0 10px rgba(0, 255, 170, 0.3)'
    },
    board: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.5rem',
      alignItems: 'start'
    },
    column: {
      backgroundColor: 'rgba(22, 22, 26, 0.5)',
      border: '1px solid #333',
      borderRadius: '4px',
      padding: '1rem',
      minHeight: '600px',
      transition: 'all 0.3s ease'
    },
    columnHeader: (color) => ({
      color: color,
      fontSize: '0.9rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    }),
    card: {
      backgroundColor: '#16161a',
      border: '1px solid #333',
      borderRadius: '4px',
      padding: '1rem',
      marginBottom: '1rem',
      cursor: 'grab',
      transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
      position: 'relative',
      overflow: 'hidden'
    },
    projectHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '0.5rem'
    },
    projectName: {
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#fff',
      margin: 0
    },
    projectStack: {
      fontSize: '0.75rem',
      color: '#888',
      marginBottom: '0.75rem',
      display: 'block'
    },
    projectDesc: {
      fontSize: '0.85rem',
      color: '#bbb',
      lineHeight: '1.4',
      marginBottom: '1rem'
    },
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem'
    },
    tag: {
      fontSize: '0.7rem',
      backgroundColor: '#252529',
      padding: '2px 6px',
      borderRadius: '2px',
      color: '#888'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        
        .kanban-card:hover {
          border-color: #00ffaa66 !important;
          box-shadow: 0 0 15px rgba(0, 255, 170, 0.1);
          transform: translateY(-2px);
        }
        
        .status-dot {
          width: 8px; height: 8px; border-radius: 50%; display: inline-block;
        }
      `}</style>

      <header style={styles.header}>
        <h1 style={styles.title}>[ ANDREAS_WORKSPACE_OS v1.1 ]</h1>
        <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'right' }}>
          DB_STATUS: <span style={{ color: dbStatus === 'ONLINE' ? '#00ffaa' : '#ff4444' }}>{dbStatus}</span>
          {dbError && <div style={{ color: '#ff4444', fontSize: '0.7rem', marginTop: '4px' }}>{dbError}</div>}
        </div>
      </header>

      <div style={styles.board}>
        {COLUMNS.map(col => (
          <div 
            key={col.id}
            style={styles.column}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, col.id)}
          >
            <div style={styles.columnHeader(col.color)}>
              <span className="status-dot" style={{ backgroundColor: col.color, boxShadow: `0 0 8px ${col.color}` }}></span>
              {col.title} ({projects.filter(p => p.status === col.id).length})
            </div>

            {projects
              .filter(p => p.status === col.id)
              .map(project => (
                <div
                  key={project.id.toString()}
                  className="kanban-card"
                  style={styles.card}
                  draggable
                  onDragStart={(e) => onDragStart(e, project.id)}
                  onDragEnd={onDragEnd}
                >
                  <div style={styles.projectHeader}>
                    <span style={{ fontSize: '1.2rem' }}>{project.icon}</span>
                    <h3 style={styles.projectName}>{project.name}</h3>
                  </div>
                  <span style={styles.projectStack}>{'>'} {project.stack}</span>
                  <p style={styles.projectDesc}>{project.desc}</p>
                  <div style={styles.tagContainer}>
                    {project.tags?.map(tag => (
                      <span key={tag} style={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      <footer style={{ marginTop: 'auto', paddingTop: '2rem', fontSize: '0.7rem', color: '#444', textAlign: 'center' }}>
        TERMINAL_K_BOARD // SURREAL_V2.3.10 // {new Date().toLocaleDateString()}
      </footer>
    </div>
  );
}
