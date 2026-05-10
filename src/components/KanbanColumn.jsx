import React from 'react';
import KanbanCard from './KanbanCard';

export default function KanbanColumn({ column, projects, onDragStart, onDragEnd, onDragOver, onDrop, onCardClick }) {
  const styles = {
    column: {
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '4px',
      padding: '1rem',
      minHeight: '600px',
      transition: 'all 0.3s ease'
    },
    columnHeader: {
      color: column.color,
      fontSize: '0.9rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    count: {
      fontSize: '0.7rem',
      color: 'var(--text-muted)',
      backgroundColor: 'var(--bg-primary)',
      padding: '2px 6px',
      borderRadius: '10px',
      border: '1px solid var(--border)'
    }
  };

  return (
    <div
      style={styles.column}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <div style={styles.columnHeader}>
        <span>⬤</span> {column.title}
        <span style={styles.count}>{projects.length}</span>
      </div>
      {projects.map(project => (
        <KanbanCard
          key={project.id.toString()}
          project={project}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}
