import React from 'react';

export default function KanbanCard({ project, onDragStart, onDragEnd, onClick }) {
  const styles = {
    card: {
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '4px',
      padding: '1rem',
      marginBottom: '1rem',
      cursor: 'grab',
      transition: 'all 0.2s ease',
      borderLeft: '4px solid var(--accent-green)'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem',
      marginBottom: '0.5rem'
    },
    icon: {
      fontSize: '1.2rem'
    },
    cardTitle: {
      fontSize: '0.9rem',
      fontWeight: 'bold',
      color: 'var(--accent-green)',
      margin: 0
    },
    stack: {
      fontSize: '0.7rem',
      color: 'var(--text-muted)',
      marginBottom: '0.8rem',
      fontStyle: 'italic'
    },
    desc: {
      fontSize: '0.75rem',
      color: 'var(--text-secondary)',
      lineHeight: '1.4',
      marginBottom: '1rem'
    },
    tagsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.4rem'
    },
    tag: {
      fontSize: '0.65rem',
      backgroundColor: 'var(--bg-tertiary)',
      color: 'var(--accent-green)',
      padding: '2px 6px',
      borderRadius: '2px',
      border: '1px solid var(--border)'
    }
  };

  return (
    <div
      style={styles.card}
      draggable
      onDragStart={(e) => onDragStart(e, project.id)}
      onDragEnd={onDragEnd}
      onClick={() => onClick(project.id)}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-green)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={styles.cardHeader}>
        <span style={styles.icon}>{project.icon || '📦'}</span>
        <h3 style={styles.cardTitle}>{project.name}</h3>
      </div>
      <div style={styles.stack}>{project.stack}</div>
      <div style={styles.desc}>{project.desc}</div>
      <div style={styles.tagsContainer}>
        {Array.isArray(project.tags) && project.tags.map((tag, idx) => (
          <span key={idx} style={styles.tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}
