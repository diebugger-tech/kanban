import React, { useState } from 'react';
import KanbanCard from './KanbanCard';
import BacklogDashboard from './BacklogDashboard';

export default function KanbanColumn({ column, projects, isLoading, onDragStart, onDragEnd, onDragOver, onDrop, onCardClick, wikiStats, allProjects }) {
  const [isOver, setIsOver] = useState(false);
  const styles = {
    column: {
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '4px',
      padding: '1rem',
      minHeight: '600px',
      flexDirection: 'column',
      boxShadow: isOver ? `0 0 15px ${column.color}` : 'none',
      borderColor: isOver ? column.color : 'var(--border)'
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
    },
    emptyState: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px dashed var(--border)',
      borderRadius: '4px',
      color: 'var(--text-muted)',
      fontSize: '0.75rem',
      userSelect: 'none'
    }
  };

  return (
    <div
      style={styles.column}
      onDragOver={onDragOver}
      onDragEnter={() => setIsOver(true)}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        setIsOver(false);
        onDrop(e, column.id);
      }}
    >
      <div style={styles.columnHeader}>
        <span>⬤</span> {column.title}
        <span style={styles.count}>{isLoading ? '...' : projects.length}</span>
      </div>

      {isLoading ? (
        <>
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
        </>
      ) : projects.length > 0 ? (
        projects.map(project => (
          <KanbanCard
            key={project.id.toString()}
            project={project}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onCardClick}
            wikiStats={wikiStats}
          />
        ))
      ) : column.id === 'backlog' ? (
        <BacklogDashboard allProjects={allProjects || []} wikiStats={wikiStats || {}} />
      ) : (
        <div style={styles.emptyState}>
          &gt; NO TASKS
        </div>
      )}
    </div>
  );
}
