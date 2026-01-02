import React from 'react';
import { useNavigate } from 'react-router-dom';

const TextRenderer = ({ text, style = {} }) => {
  const navigate = useNavigate();

  if (!text) return null;

  // Dividir texto em partes (menções e texto normal)
  const parts = text.split(/(@\w+)/g);

  const handleMentionClick = (username) => {
    // Remove @ e navega para perfil
    const cleanUsername = username.slice(1);
    navigate(`/perfil?user=${cleanUsername}`);
  };

  return (
    <p style={{
      color: 'rgba(255,255,255,0.8)',
      lineHeight: '1.6',
      whiteSpace: 'pre-line',
      marginBottom: '20px',
      ...style
    }}>
      {parts.map((part, index) => {
        if (part.startsWith('@')) {
          return (
            <span
              key={index}
              onClick={() => handleMentionClick(part)}
              style={{
                color: '#60a5fa',
                fontWeight: '600',
                cursor: 'pointer',
                borderBottom: '1px solid #60a5fa',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
};

export default TextRenderer;
