import React from 'react';
import KanbanCard from './KanbanCard';

export default function KanbanColumn({ column, projects, onDragStart, onDragEnd, onDragOver, onDrop, onCardClick }) {
  const styles = {
    column: {
      backgroundColor: 'rgba(22, 22, 26, 0.5)',
      border: '1px solid #333',
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
      color: '#666',
      backgroundColor: '#000',
      padding: '2px 6px',
      borderRadius: '10px',
      border: '1px solid #333'
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
