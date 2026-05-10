import React, { useState, useEffect } from 'react';
import { useSurrealDB } from './hooks/useSurrealDB';
import { COLUMNS } from './constants';
import db from './lib/db';
import KanbanColumn from './components/KanbanColumn';
import DetailPanel from './components/DetailPanel';

export default function App() {
  const { projects, dbStatus, dbError } = useSurrealDB();
  const [selectedProject, setSelectedProject] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleDragStart = (e, id) => e.dataTransfer.setData('text/plain', id);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = async (e, status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    try {
      await db.query(`UPDATE type::thing($id) MERGE $data`, { 
        id, data: { status, updated: new Date().toISOString() } 
      });
    } catch (err) { console.error('Drop update failed:', err); }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
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
          <div style={{ padding: '0.5rem 1rem', border: '1px solid var(--border)', color: dbStatus === 'ONLINE' ? 'var(--accent-green)' : 'var(--error)', fontSize: '0.8rem' }}>
            DB_STATUS: [{dbStatus}]
          </div>
        </div>
      </header>

      {dbError && <div style={{ backgroundColor: 'rgba(255, 68, 68, 0.1)', color: 'var(--error)', padding: '1rem', border: '1px solid var(--error)', marginBottom: '2rem' }}>Error: {dbError}</div>}

      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.id}
            column={col}
            projects={projects.filter(p => p.status === col.id)}
            onDragStart={handleDragStart}
            onDragEnd={() => {}}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onCardClick={(id) => setSelectedProject(id)}
          />
        ))}
      </main>

      <footer style={{ marginTop: '4rem', color: 'var(--text-muted)', fontSize: '0.7rem', textAlign: 'center' }}>© 2026 ANDREAS BADER // sur·ban·ai = surreal + kanban + ai // TERMINAL_UI</footer>
      <DetailPanel projectId={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
