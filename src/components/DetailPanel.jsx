import React, { useState, useEffect } from 'react';
import db from '../lib/db';
import { COLUMNS } from '../constants';

export default function DetailPanel({ projectId, isOpen, onClose }) {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({ desc: '', tags: '', status: '', cmd_start: '', cmd_stop: '' });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (isOpen && projectId) {
      setLoading(true);
      db.query(`SELECT * FROM ${projectId.toString()}`)
        .then(res => {
          if (res && res[0] && res[0][0]) {
            const row = res[0][0];
            setData(row);
            setFormData({
              desc: row.desc || '',
              tags: Array.isArray(row.tags) ? row.tags.join(', ') : (row.tags || ''),
              status: row.status || 'backlog',
              cmd_start: row.cmd_start || 'make dev',
              cmd_stop: row.cmd_stop || 'make stop'
            });
          }
        })
        .catch(err => console.error('Error fetching detail:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, projectId]);

  const handleSave = async () => {
    if (!projectId) return;
    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      await db.query(`UPDATE type::thing($id) MERGE $data`, {
        id: projectId.toString(),
        data: {
          desc: formData.desc,
          tags: tagsArray,
          status: formData.status,
          cmd_start: formData.cmd_start,
          cmd_stop: formData.cmd_stop,
          updated: new Date().toISOString()
        }
      });
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)', zIndex: 999
    },
    panel: {
      position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px',
      backgroundColor: '#0a0a0b', borderLeft: '2px solid #333', zIndex: 1000,
      display: 'flex', flexDirection: 'column', padding: '2rem',
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-out', boxShadow: '-5px 0 20px rgba(0,0,0,0.5)',
      overflowY: 'auto'
    },
    closeBtn: {
      position: 'absolute', top: '1rem', right: '1rem',
      background: 'transparent', border: 'none', color: '#ff4444',
      fontSize: '1.2rem', cursor: 'pointer', fontFamily: 'monospace'
    },
    content: {
      display: 'flex', flexDirection: 'column', gap: '1.5rem',
      fontFamily: '"JetBrains Mono", monospace', color: '#e0e0e0'
    },
    label: (color = '#00ffaa') => ({
      color: color, fontSize: '0.8rem'
    }),
    input: {
      backgroundColor: '#16161a', color: '#e0e0e0', border: '1px solid #333',
      padding: '0.5rem', fontFamily: 'inherit'
    },
    textarea: {
      backgroundColor: '#16161a', color: '#e0e0e0', border: '1px solid #333',
      padding: '0.5rem', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical'
    },
    actionBtn: (bgColor) => ({
      flex: 1, backgroundColor: bgColor, color: '#000', border: 'none',
      padding: '0.6rem', fontWeight: 'bold', cursor: 'pointer',
      fontFamily: 'inherit', transition: 'all 0.2s'
    }),
    saveBtn: {
      backgroundColor: '#00aaff', color: '#000', border: 'none',
      padding: '0.8rem', fontWeight: 'bold', cursor: 'pointer',
      fontFamily: 'inherit'
    },
    terminalBox: {
      marginTop: '1rem', backgroundColor: '#000', padding: '1rem',
      border: '1px solid #333', borderRadius: '4px'
    }
  };

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div style={styles.panel}>
        <button onClick={onClose} style={styles.closeBtn}>[X]</button>
        
        {loading || !data ? (
          <div style={{ color: '#00ffaa' }}>&gt; LOADING DATA...</div>
        ) : (
          <div style={styles.content}>
            <div style={{ borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{data.icon}</div>
              <h2 style={{ margin: 0, color: '#00ffaa', letterSpacing: '1px' }}>{data.name}</h2>
              <div style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.5rem' }}>ID: {data.id.toString()}</div>
              <div style={{ color: '#888', fontSize: '0.8rem' }}>STACK: {data.stack}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={styles.label()}>&gt; DESCRIPTION</label>
              <textarea value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} style={styles.textarea} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={styles.label()}>&gt; TAGS (comma separated)</label>
              <input type="text" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} style={styles.input} />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={styles.label()}>&gt; START CMD</label>
                <input type="text" value={formData.cmd_start} onChange={e => setFormData({ ...formData, cmd_start: e.target.value })} style={styles.input} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={styles.label('#ff4444')}>&gt; STOP CMD</label>
                <input type="text" value={formData.cmd_stop} onChange={e => setFormData({ ...formData, cmd_stop: e.target.value })} style={styles.input} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={styles.label()}>&gt; STATUS</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ ...styles.input, cursor: 'pointer' }}>
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                style={styles.actionBtn(copied === 'start' ? '#fff' : '#00ffaa')} 
                onClick={() => copyToClipboard(formData.cmd_start, 'start')}
              >
                {copied === 'start' ? '[ COPIED! ]' : `[ START (${formData.cmd_start}) ]`}
              </button>
              <button 
                style={styles.actionBtn(copied === 'stop' ? '#fff' : '#ff4444')} 
                onClick={() => copyToClipboard(formData.cmd_stop, 'stop')}
              >
                {copied === 'stop' ? '[ COPIED! ]' : `[ STOP (${formData.cmd_stop}) ]`}
              </button>
            </div>
            
            <button style={styles.saveBtn} onClick={handleSave}>[ SAVE CHANGES ]</button>

            <div style={styles.terminalBox}>
              <div style={{ color: '#888', fontSize: '0.7rem', marginBottom: '0.5rem' }}>$ {data.name.toLowerCase()} --help</div>
              <pre style={{ margin: 0, color: '#aaa', fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
Available commands:
{formData.cmd_start.padEnd(15)} Start project
{formData.cmd_stop.padEnd(15)} Stop project
make build      Build production
make logs       View logs
              </pre>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#666', textAlign: 'right', marginTop: '1rem' }}>
              LAST_UPDATE: {data.updated ? new Date(data.updated).toLocaleString() : 'N/A'}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
