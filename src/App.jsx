import React, { useState } from 'react';
import { useSurrealDB } from './hooks/useSurrealDB';
import { COLUMNS } from './constants';
import db from './lib/db';
import KanbanColumn from './components/KanbanColumn';
import DetailPanel from './components/DetailPanel';

export default function App() {
  const { projects, dbStatus, dbError } = useSurrealDB();
  const [selectedProject, setSelectedProject] = useState(null);

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
    <div style={{ backgroundColor: '#0a0a0b', minHeight: '100vh', color: '#e0e0e0', padding: '2rem', fontFamily: '"JetBrains Mono", monospace' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ color: '#00ffaa', margin: 0, fontSize: '1.8rem', letterSpacing: '2px' }}>SURREAL_BOARD</h1>
          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.4rem' }}>v1.2.0 // REFACTOR_COMPLETE</div>
        </div>
        <div style={{ padding: '0.5rem 1rem', border: '1px solid #333', color: dbStatus === 'ONLINE' ? '#00ffaa' : '#ff4444', fontSize: '0.8rem' }}>
          DB_STATUS: [{dbStatus}]
        </div>
      </header>

      {dbError && <div style={{ backgroundColor: '#441111', color: '#ffaaaa', padding: '1rem', border: '1px solid #ff4444', marginBottom: '2rem' }}>Error: {dbError}</div>}

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

      <footer style={{ marginTop: '4rem', color: '#444', fontSize: '0.7rem', textAlign: 'center' }}>© 2026 ANDREAS BADER // TERMINAL_UI</footer>
      <DetailPanel projectId={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
