import React, { useState, useEffect } from 'react';
import { useSurrealDB } from './hooks/useSurrealDB';
import { COLUMNS } from './constants';
import db from './lib/db';
import KanbanColumn from './components/KanbanColumn';
import DetailPanel from './components/DetailPanel';
import Navbar from './components/Navbar';
import WikiPanel from './components/WikiPanel';
import TodoPanel from './components/TodoPanel';
import CreateProjectModal from './components/CreateProjectModal';

export default function App() {
  const { projects, dbStatus, dbError, loading: isLoading } = useSurrealDB();
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [toasts, setToasts] = useState([]);
  const [showWiki, setShowWiki] = useState(false);
  const [showTodo, setShowTodo] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Der aktuell ausgewählte Projekt-Datensatz
  const selectedProject = projects.find(p => p.id.toString() === selectedProjectId?.toString());

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '?') {
        setShowWiki(prev => !prev);
      }
      if (e.key === 't' || e.key === 'T') {
        setShowTodo(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowWiki(false);
        setShowTodo(false);
        setShowCreateModal(false);
        setSelectedProjectId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    
    // Safety check: ensure we have a valid ID and filter out potential browser-testing artifacts like 'drag'
    if (!id || id === 'drag') return;

    try {
      await db.query('UPDATE type::thing($id) MERGE $data', {
        id,
        data: { status, updated: new Date().toISOString() }
      });
      showToast('Project moved successfully', 'success');
    } catch (err) {
      console.error('Drop update failed:', err);
      showToast('Move failed', 'error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        dbStatus={dbStatus} 
        onWikiOpen={() => setShowWiki(true)} 
        onTodoOpen={() => setShowTodo(true)}
        onCreateOpen={() => setShowCreateModal(true)}
        showToast={showToast}
      />

      {dbError && <div style={{ backgroundColor: 'rgba(255, 68, 68, 0.1)', color: 'var(--error)', padding: '1rem', border: '1px solid var(--error)', marginBottom: '2rem' }}>Error: {dbError}</div>}

      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.id}
            column={col}
            projects={projects.filter(p => p.status === col.id)}
            isLoading={isLoading}
            onDragStart={handleDragStart}
            onDragEnd={() => {}}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onCardClick={(id) => setSelectedProjectId(id)}
          />
        ))}
      </main>

      <footer style={{ marginTop: '4rem', color: 'var(--text-muted)', fontSize: '0.7rem', textAlign: 'center' }}>© 2026 ANDREAS BADER // sur·k·ai = surreal + kanban + ai // TERMINAL_UI</footer>
      
      <DetailPanel 
        projectId={selectedProjectId} 
        projects={projects}
        isOpen={!!selectedProjectId} 
        onClose={() => setSelectedProjectId(null)} 
        onSelectProject={setSelectedProjectId}
        onNotify={showToast}
      />

      {showWiki && (
        <WikiPanel 
          projekt={selectedProject} 
          onClose={() => setShowWiki(false)} 
        />
      )}
      {showTodo && <TodoPanel onClose={() => setShowTodo(false)} />}
      
      <CreateProjectModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onNotify={showToast}
      />

      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === 'success' ? '✅' : '❌'} {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
