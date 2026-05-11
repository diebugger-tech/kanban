import React, { useState, useEffect } from 'react';

export default function WikiPanel({ onClose }) {
  const [activePage, setActivePage] = useState('overview');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const pages = [
    { id: 'overview', title: 'Übersicht', icon: '🏠' },
    { id: 'kanban', title: 'Kanban Board', icon: '📋' },
    { id: 'shortcuts', title: 'Tastaturkürzel', icon: '⌨️' },
    { id: 'dragdrop', title: 'Drag & Drop', icon: '🖱️' },
    { id: 'surreal', title: 'SurrealDB API', icon: '💾' },
    { id: 'bugs', title: 'Bekannte Bugs', icon: '🪲' },
    { id: 'changelog', title: 'Changelog', icon: '📜' },
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'overview':
        return (
          <>
            <h2>🏠 Übersicht</h2>
            <p>Willkommen bei <strong>surbanai</strong> – deinem Echtzeit-Kanban-Dashboard powered by SurrealDB.</p>
            <h3>🚀 Schnellstart</h3>
            <ul>
              <li>Projekte werden automatisch aus der SurrealDB geladen.</li>
              <li>Klicke auf eine Karte, um Details zu bearbeiten.</li>
              <li>Verschiebe Karten per Drag & Drop zwischen den Spalten.</li>
            </ul>
            <h3>✅ Feature-Status</h3>
            <table style={styles.table}>
              <thead>
                <tr><th style={styles.th}>Feature</th><th style={styles.th}>Status</th></tr>
              </thead>
              <tbody>
                <tr><td style={styles.td}>Real-time Updates</td><td style={styles.td}>✅ Live (SurrealDB)</td></tr>
                * <tr><td style={styles.td}>Dark/Light Theme</td><td style={styles.td}>✅ Aktiv</td></tr>
                * <tr><td style={styles.td}>Skeleton Loading</td><td style={styles.td}>✅ Aktiv</td></tr>
                * <tr><td style={styles.td}>Wiki / Hilfe</td><td style={styles.td}>✅ Neu (v1.2)</td></tr>
              </tbody>
            </table>
          </>
        );
      case 'kanban':
        return (
          <>
            <h2>📋 Kanban Board</h2>
            <p>Das Board ist in drei Hauptspalten unterteilt:</p>
            <ul>
              <li><strong>BACKLOG:</strong> Neue Ideen und Aufgaben, die noch nicht gestartet wurden.</li>
              <li><strong>IN PROGRESS:</strong> Aktive Projekte in Bearbeitung.</li>
              <li><strong>DONE:</strong> Abgeschlossene Meilensteine.</li>
            </ul>
            <h3>✨ UX Features</h3>
            <ul>
              <li><strong>Skeleton Loader:</strong> Beim DB-Connect erscheinen pulsierende Platzhalter.</li>
              <li><strong>Empty States:</strong> Leere Spalten zeigen <code>&gt; NO TASKS</code> an.</li>
            </ul>
          </>
        );
      case 'shortcuts':
        return (
          <>
            <h2>⌨️ Tastaturkürzel</h2>
            <p>Effizientes Arbeiten mit surbanai:</p>
            <table style={styles.table}>
              <thead>
                <tr><th style={styles.th}>Taste</th><th style={styles.th}>Aktion</th></tr>
              </thead>
              <tbody>
                <tr><td style={styles.td}><code>?</code></td><td style={styles.td}>Dieses Wiki öffnen/schließen</td></tr>
                <tr><td style={styles.td}><code>ESC</code></td><td style={styles.td}>Aktives Panel (Wiki/Detail) schließen</td></tr>
              </tbody>
            </table>
          </>
        );
      case 'dragdrop':
        return (
          <>
            <h2>🖱️ Drag & Drop</h2>
            <p>Verschiebe Projekte einfach zwischen den Spalten, um ihren Status zu ändern.</p>
            <div style={styles.bugBox}>
              <strong>⚠️ Bekannter Bug: RecordID-Serialisierung</strong>
              <p>In einigen Browser-Umgebungen überträgt der <code>dataTransfer</code> die SurrealDB-ID fälschlicherweise als String <code>'drag'</code>.</p>
              <p><em>Fehlermeldung:</em> <code>Expected a record but cannot convert 'drag' into a record</code></p>
              <p><strong>Workaround (v1.2):</strong> In der <code>handleDrop()</code> Funktion wurde eine Sicherheitsprüfung eingebaut: <code>if (!id || id === 'drag') return;</code></p>
            </div>
          </>
        );
      case 'surreal':
        return (
          <>
            <h2>💾 SurrealDB API</h2>
            <p>surbanai nutzt die SurrealDB JavaScript SDK v2.x.</p>
            <h3>Wichtige Queries:</h3>
            <pre style={styles.code}>
{`// Projekte abrufen
SELECT * FROM projekt;

// Live-Updates abonnieren
LIVE SELECT * FROM projekt;

// Projekt aktualisieren
UPDATE type::thing($id) MERGE $data;`}
            </pre>
          </>
        );
      case 'bugs':
        return (
          <>
            <h2>🪲 Bekannte Bugs</h2>
            <table style={styles.table}>
              <thead>
                <tr><th style={styles.th}>Bug</th><th style={styles.th}>Status</th></tr>
              </thead>
              <tbody>
                <tr><td style={styles.td}>Drag & Drop RecordID Error</td><td style={styles.td}>🟡 Workaround aktiv</td></tr>
                <tr><td style={styles.td}>Wayland Hit-Test (3DNTerminal)</td><td style={styles.td}>🔴 Bekannt</td></tr>
                <tr><td style={styles.td}>Corner-Sync (3DNTerminal)</td><td style={styles.td}>🔴 Bekannt</td></tr>
              </tbody>
            </table>
          </>
        );
      case 'changelog':
        return (
          <>
            <h2>📜 Changelog</h2>
            <h3>v1.2 – UX & Hilfe (Aktuell)</h3>
            <ul>
              <li>Neu: <strong>WikiPanel</strong> mit Navigation und Dokumentation.</li>
              <li>Neu: <strong>Keyboard Shortcuts</strong> (ESC zum Schließen, ? für Hilfe).</li>
              <li>Neu: <strong>Toast Notifications</strong> beim Speichern/Verschieben.</li>
              <li>Neu: <strong>Skeleton Loader</strong> für besseres Feedback beim DB-Connect.</li>
              <li>Verbessert: Darstellung leerer Spalten.</li>
            </ul>
            <h3>v1.1 – Core Refactor</h3>
            <ul>
              <li>Umstellung auf <strong>Clean Architecture</strong> (Modular Components).</li>
              <li>Implementierung von <strong>db.js Singleton</strong>.</li>
            </ul>
          </>
        );
      default:
        return null;
    }
  };

  const styles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'var(--bg-overlay)', backdropFilter: 'blur(4px)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    },
    container: {
      width: '100%', maxWidth: '900px', height: '80vh',
      backgroundColor: 'var(--bg-primary)', border: '2px solid var(--border)',
      boxShadow: '0 0 30px var(--shadow)', display: 'flex', position: 'relative'
    },
    sidebar: {
      width: '240px', borderRight: '1px solid var(--border)', padding: '1.5rem',
      backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem'
    },
    main: {
      flex: 1, padding: '2.5rem', overflowY: 'auto', color: 'var(--text-primary)'
    },
    navItem: (active) => ({
      padding: '0.8rem 1rem', cursor: 'pointer', border: '1px solid transparent',
      color: active ? 'var(--accent-green)' : 'var(--text-secondary)',
      backgroundColor: active ? 'rgba(0, 255, 170, 0.05)' : 'transparent',
      borderColor: active ? 'var(--accent-green)' : 'transparent',
      fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.7rem',
      transition: 'all 0.2s'
    }),
    closeBtn: {
      position: 'absolute', top: '1rem', right: '1rem',
      background: 'transparent', border: 'none', color: 'var(--error)',
      fontSize: '1.2rem', cursor: 'pointer', fontFamily: 'monospace'
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
    code: {
      backgroundColor: 'var(--bg-secondary)', padding: '1rem', border: '1px solid var(--border)',
      color: 'var(--text-secondary)', fontSize: '0.8rem', overflowX: 'auto', marginTop: '1rem'
    },
    bugBox: {
      backgroundColor: 'rgba(255, 68, 68, 0.05)', borderLeft: '4px solid var(--error)',
      padding: '1rem', marginTop: '1.5rem', fontSize: '0.85rem'
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.container}>
        <button onClick={onClose} style={styles.closeBtn}>[X]</button>
        
        <aside style={styles.sidebar}>
          <div style={{ color: 'var(--accent-green)', fontWeight: 'bold', marginBottom: '2rem', fontSize: '1.2rem', letterSpacing: '2px' }}>WIKI_CLI v1.2</div>
          {pages.map(page => (
            <div 
              key={page.id} 
              style={styles.navItem(activePage === page.id)}
              onClick={() => setActivePage(page.id)}
            >
              <span>{page.icon}</span> {page.title}
            </div>
          ))}
          <div style={{ marginTop: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)' }}>&gt; status: online</div>
        </aside>

        <main style={styles.main}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
