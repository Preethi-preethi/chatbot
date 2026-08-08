import React, { useState, useEffect, useRef } from 'react';
import { X, Search, MessageSquare, Plus, Command, ArrowRight } from 'lucide-react';

const SearchModal = ({ isOpen, onClose, sessions = [], onSessionClick, onNewChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredSessions = sessions.filter(session => 
    (session.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupSessions = (sessionsList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const groups = {
      'Today': [],
      'Yesterday': [],
      'Previous 7 Days': [],
      'Older': []
    };

    sessionsList.forEach(session => {
      const dateStr = session.created_at || session.timestamp;
      const date = dateStr ? new Date(dateStr) : new Date();
      if (isNaN(date.getTime())) {
        groups['Today'].push(session);
        return;
      }
      date.setHours(0, 0, 0, 0);
      const diffTime = today - date;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) groups['Today'].push(session);
      else if (diffDays === 1) groups['Yesterday'].push(session);
      else if (diffDays > 1 && diffDays <= 7) groups['Previous 7 Days'].push(session);
      else groups['Older'].push(session);
    });
    
    return Object.entries(groups).filter(([_, arr]) => arr.length > 0);
  };

  const groupedSessions = searchQuery ? [['Search Results', filteredSessions]] : groupSessions(filteredSessions);

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-card glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Search Header Bar */}
        <div className="search-modal-input-wrapper">
          <Search size={20} className="search-input-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Type to search past conversations or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
          <button className="close-modal-btn" onClick={onClose}>
            <kbd className="esc-kbd">ESC</kbd>
          </button>
        </div>

        {/* Results List */}
        <div className="search-modal-results custom-scrollbar">
          {!searchQuery && (
            <div 
              className="search-modal-action-item" 
              onClick={() => { if (onNewChat) onNewChat(); onClose(); }}
            >
              <div className="action-icon-pill">
                <Plus size={16} />
              </div>
              <div className="action-details">
                <span className="action-title">Start a New Chat</span>
                <span className="action-subtext">Begin a fresh conversation with CA Tutor AI</span>
              </div>
              <ArrowRight size={16} className="arrow-icon" />
            </div>
          )}

          {filteredSessions.length === 0 ? (
            <div className="search-modal-empty">
              <Search size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <div>No matching conversations found</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Try searching for a different keyword</span>
            </div>
          ) : (
            groupedSessions.map(([groupName, groupItems]) => (
              <div key={groupName} className="search-modal-group">
                {groupName && <div className="search-group-header">{groupName}</div>}
                {groupItems.map(session => (
                  <div 
                    key={session.id} 
                    className="search-modal-item glass-panel"
                    onClick={() => {
                      onSessionClick(session.id);
                      onClose();
                    }}
                  >
                    <MessageSquare size={16} className="item-icon" />
                    <span className="item-title truncate">{session.title || "Untitled Chat"}</span>
                    <span className="item-badge">Open</span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Search Modal Footer */}
        <div className="search-modal-footer">
          <div className="footer-hint">
            <Command size={13} />
            <span>Use <strong>⌘K</strong> / <strong>Ctrl+K</strong> anytime to quick search</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
