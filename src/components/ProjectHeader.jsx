import React from 'react';
import db from '../lib/db';

export default function ProjectHeader({ activeProject, onWikiOpen, onNotify }) {
  const syncWiki = async (projektName) => {
    try {
      const exists = await db.query(
        'SELECT id FROM wiki WHERE projekt = $name AND typ = "doc" LIMIT 1',
        { name: projektName }
      );
      
      const data = exists[0]?.result || exists[0] || [];
      if (data.length > 0) {
        onNotify('Wiki already exists for this project', 'info');
        onWikiOpen();
        return;
      }

      await db.query(
        'INSERT INTO wiki { projekt: $name, typ: "doc", titel: "Uebersicht", inhalt: "Beschreibung hier eintragen.", erstellt: time::now(), geaendert: time::now(), status: "open" }',
        { name: projektName }
      );
      
      onNotify('Wiki initialized for ' + projektName);
      onWikiOpen();
    } catch (err) {
      console.error('Sync failed:', err);
      onNotify('Sync failed', 'error');
    }
  };

  if (!activeProject) return null;

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem', 
      backgroundColor: 'var(--bg-secondary)', 
      border: '1px solid var(--border)', 
      borderRadius: '4px',
      marginBottom: '2rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '1.5rem' }}>{activeProject.icon}</span>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--accent-green)' }}>
            {activeProject.name.toUpperCase()}
          </h2>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            ID: {activeProject.id.toString()} // STACK: {activeProject.stack}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.8rem' }}>
        <button 
          onClick={() => syncWiki(activeProject.name)}
          style={styles.syncBtn}
        >
          [ 🔄 SYNC_WIKI ]
        </button>
        <button 
          onClick={onWikiOpen}
          style={styles.wikiBtn}
        >
          [ 📄 OPEN_WIKI ]
        </button>
      </div>
    </div>
  );
}

const styles = {
  syncBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(0, 255, 170, 0.1)',
    color: 'var(--accent-green)',
    border: '1px solid var(--accent-green)',
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    cursor: 'pointer'
  },
  wikiBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--accent-blue)',
    border: '1px solid var(--border)',
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    cursor: 'pointer'
  }
};
