import React, { useState, useEffect, useRef } from 'react';
import { CommunityAPI } from '../services/api';

const MentionInput = ({
  value,
  onChange,
  placeholder = 'Escreve algo...',
  multiline = true,
  minHeight = '100px'
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Detectar @ e carregar sugestões
  useEffect(() => {
    const detectMention = () => {
      if (!inputRef.current) return;

      const text = inputRef.current.value;
      const pos = inputRef.current.selectionStart;

      // Procurar @ antes do cursor
      let atIndex = -1;
      for (let i = pos - 1; i >= 0; i--) {
        if (text[i] === '@') {
          atIndex = i;
          break;
        }
        if (text[i] === ' ' || text[i] === '\n') break;
      }

      if (atIndex >= 0) {
        const query = text.substring(atIndex + 1, pos);

        if (/^\w*$/.test(query)) {
          if (query.length > 0) {
            fetchSuggestions(query);
            setShowDropdown(true);
          } else {
            setSuggestions([]);
            setShowDropdown(false);
          }
          setSelectedIndex(0);
        } else {
          setShowDropdown(false);
        }
      } else {
        setShowDropdown(false);
      }
    };

    detectMention();
  }, [value]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await CommunityAPI.searchProfiles({ q: query });
      setSuggestions(response.data || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const insertMention = (username) => {
    const text = inputRef.current.value;
    const pos = inputRef.current.selectionStart;

    // Encontrar @
    let atIndex = -1;
    for (let i = pos - 1; i >= 0; i--) {
      if (text[i] === '@') {
        atIndex = i;
        break;
      }
    }

    const newText =
      text.substring(0, atIndex) +
      `@${username} ` +
      text.substring(pos);

    onChange(newText);
    setShowDropdown(false);
    setSuggestions([]);

    // Colocar cursor após menção
    setTimeout(() => {
      if (inputRef.current) {
        const newPos = atIndex + username.length + 2;
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          e.preventDefault();
          insertMention(suggestions[selectedIndex].username);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
      default:
        break;
    }
  };

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <InputComponent
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
          backgroundColor: 'rgba(255,255,255,0.05)',
          color: 'white',
          fontFamily: 'inherit',
          fontSize: '0.95rem',
          resize: multiline ? 'vertical' : 'none',
          minHeight: multiline ? minHeight : 'auto'
        }}
      />

      {/* Dropdown de sugestões */}
      {showDropdown && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          backgroundColor: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          {suggestions.map((user, index) => (
            <div
              key={user.userId}
              onClick={() => insertMention(user.username)}
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                backgroundColor: selectedIndex === index
                  ? 'rgba(96,165,250,0.2)'
                  : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderBottom: index < suggestions.length - 1
                  ? '1px solid rgba(255,255,255,0.05)'
                  : 'none'
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {user.profilePhoto && (
                <img
                  src={`http://localhost:3004${user.profilePhoto}`}
                  alt={user.username}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                  @{user.username}
                </div>
                {user.restaurantName && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.6)'
                  }}>
                    {user.restaurantName}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentionInput;
