import { useState, useEffect, useRef } from 'react';
import db from '../lib/db';

export function useSurrealDB() {
  const [projects, setProjects] = useState([]);
  const [dbStatus, setDbStatus] = useState('CONNECTING...');
  const [dbError, setDbError] = useState(null);
  const liveQueryId = useRef(null);

  useEffect(() => {
    async function initDB() {
      try {
        setDbError(null);
        await db.connect(import.meta.env.VITE_SURREAL_URL, {
          namespace: import.meta.env.VITE_SURREAL_NS,
          database: import.meta.env.VITE_SURREAL_DB,
          authentication: { 
            username: import.meta.env.VITE_SURREAL_USER, 
            password: import.meta.env.VITE_SURREAL_PASS 
          }
        });
        setDbStatus('ONLINE');

        // Initial fetch
        const initialProjects = await db.query('SELECT * FROM projekt').then(r => r[0]);
        setProjects(initialProjects || []);

        // Live Subscription
        liveQueryId.current = await db.live('projekt', ({ action, result }) => {
          if (action === 'CREATE') {
            setProjects(prev => [...prev, result]);
          } else if (action === 'UPDATE' || action === 'CHANGE') {
            setProjects(prev => {
              const exists = prev.find(p => p.id === result.id);
              if (exists) {
                return prev.map(p => p.id === result.id ? result : p);
              } else {
                return [...prev, result];
              }
            });
          } else if (action === 'DELETE') {
            setProjects(prev => prev.filter(p => p.id !== result.id));
          }
        });

      } catch (err) {
        console.error('SurrealDB Connection Error:', err);
        setDbError(err.message || String(err));
        setDbStatus('OFFLINE');
      }
    }

    initDB();

    return () => {
      if (liveQueryId.current) db.kill(liveQueryId.current);
      // Not closing db singleton here to maintain connection during hot-reloads
    };
  }, []);

  return { projects, dbStatus, dbError };
}
