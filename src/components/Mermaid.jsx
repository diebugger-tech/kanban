import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'monospace'
});

export default function Mermaid({ chart }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && chart) {
      mermaid.contentLoaded();
      // Clear previous content
      ref.current.removeAttribute('data-processed');
      ref.current.innerHTML = chart;
      mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart).then(
        ({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        }
      ).catch(err => {
        console.error('Mermaid error:', err);
      });
    }
  }, [chart]);

  return (
    <div 
      className="mermaid" 
      ref={ref} 
      style={{ 
        backgroundColor: 'var(--bg-primary)', 
        padding: '1rem', 
        borderRadius: '4px', 
        marginBottom: '1rem',
        overflowX: 'auto',
        border: '1px solid var(--border)'
      }}
    >
      {chart}
    </div>
  );
}
