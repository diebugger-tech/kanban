import React, { useState, useEffect, useRef } from 'react';

export default function KaiAssistant({ project }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Greetings. I am KAi. How can I assist with your project today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const askKAi = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          model: 'qwen2.5:3b', // Optimized for local usage as per AGENTS.md
          prompt: `You are KAi, a terminal-based AI project assistant. 
          Current Project: ${project?.name || 'Global'}
          Stack: ${project?.stack || 'N/A'}
          Context: ${project?.desc || 'General dashboard'}
          
          User says: ${userMsg}`,
          stream: false
        })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'ERROR: Local AI instance (Ollama) unreachable. Ensure Ollama is running on port 11434.' }]);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    bubble: {
      position: 'fixed',
      bottom: '50px',
      right: '2rem',
      width: isOpen ? '350px' : '60px',
      height: isOpen ? '500px' : '60px',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--accent-green)',
      borderRadius: isOpen ? '8px' : '50%',
      boxShadow: '0 0 20px rgba(0, 255, 170, 0.3)',
      zIndex: 2500,
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      cursor: isOpen ? 'default' : 'pointer'
    },
    header: {
      padding: '1rem',
      backgroundColor: 'rgba(0, 255, 170, 0.1)',
      borderBottom: '1px solid var(--accent-green)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: 'bold',
      color: 'var(--accent-green)'
    },
    chat: {
      flex: 1,
      overflowY: 'auto',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8rem',
      fontSize: '0.85rem'
    },
    message: (role) => ({
      alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
      backgroundColor: role === 'user' ? 'rgba(0, 255, 170, 0.05)' : 'rgba(255, 255, 255, 0.02)',
      padding: '0.6rem 0.8rem',
      borderRadius: '4px',
      border: `1px solid ${role === 'user' ? 'var(--accent-green)' : 'var(--border)'}`,
      maxWidth: '85%',
      color: role === 'user' ? 'var(--accent-green)' : 'var(--text-primary)',
      whiteSpace: 'pre-wrap'
    }),
    footer: {
      padding: '0.8rem',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      gap: '0.5rem'
    },
    input: {
      flex: 1,
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border)',
      padding: '0.5rem',
      color: 'var(--text-primary)',
      fontFamily: 'inherit',
      fontSize: '0.8rem',
      outline: 'none'
    }
  };

  return (
    <div style={styles.bubble} onClick={() => !isOpen && setIsOpen(true)}>
      {!isOpen ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🤖</div>
      ) : (
        <>
          <div style={styles.header}>
            <span>&gt; KAi_ASSISTANT</span>
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer' }}>_X</button>
          </div>
          <div style={styles.chat}>
            {messages.map((m, i) => (
              <div key={i} style={styles.message(m.role)}>
                {m.content}
              </div>
            ))}
            {loading && <div style={{ color: 'var(--accent-green)', fontSize: '0.7rem' }}>KAi is thinking...</div>}
            <div ref={chatEndRef} />
          </div>
          <div style={styles.footer}>
            <input 
              style={styles.input}
              placeholder="ASK_SOMETHING..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && askKAi()}
            />
          </div>
        </>
      )}
    </div>
  );
}
