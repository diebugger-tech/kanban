import React from 'react';

export default function KanbanCard({ project, onDragStart, onDragEnd, onClick }) {
  const styles = {
    card: {
      backgroundColor: '#16161a',
      border: '1px solid #333',
      borderRadius: '4px',
      padding: '1rem',
      marginBottom: '1rem',
      cursor: 'grab',
      transition: 'all 0.2s ease',
      borderLeft: '4px solid #00ffaa'
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
      color: '#00ffaa',
      margin: 0
    },
    stack: {
      fontSize: '0.7rem',
      color: '#888',
      marginBottom: '0.8rem',
      fontStyle: 'italic'
    },
    desc: {
      fontSize: '0.75rem',
      color: '#aaa',
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
      backgroundColor: '#222',
      color: '#00ffaa',
      padding: '2px 6px',
      borderRadius: '2px',
      border: '1px solid #333'
    }
  };

  return (
    <div
      style={styles.card}
      draggable
      onDragStart={(e) => onDragStart(e, project.id)}
      onDragEnd={onDragEnd}
      onClick={() => onClick(project.id)}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00ffaa'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333'}
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
