import React, { useState } from 'react';
import { 
  Plus, MessageSquare, Search, ChevronDown, ChevronRight, PanelLeftClose, PanelLeft, 
  Trash2, Sparkles, UserCheck, Clock, Users, Video, Calendar, Map, BookOpen, Compass, Edit3, UserPlus 
} from 'lucide-react';
import logoImg from '../assets/logo.png';

const Sidebar = ({ 
  isOpen, 
  toggleSidebar, 
  onNewChat, 
  sessions = [], 
  onSessionClick, 
  onDeleteSession, 
  activeSessionId, 
  onOpenSearch,
  activeTab,
  setActiveTab,
  userProfile,
  onOpenProfileModal
}) => {

  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = (groupName) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const groupSessions = (sessionsList) => {
    if (!Array.isArray(sessionsList)) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const groups = {
      'Recent Chats': [],
      'Previous 7 Days': [],
      'Older': []
    };

    sessionsList.forEach(session => {
      if (!session) return;
      const dateStr = session.created_at || session.timestamp;
      const date = dateStr ? new Date(dateStr) : new Date();
      if (isNaN(date.getTime())) {
        groups['Recent Chats'].push(session);
        return;
      }
      
      date.setHours(0, 0, 0, 0);
      const diffTime = today - date;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        groups['Recent Chats'].push(session);
      } else if (diffDays > 1 && diffDays <= 7) {
        groups['Previous 7 Days'].push(session);
      } else {
        groups['Older'].push(session);
      }
    });
    
    return Object.entries(groups).filter(([_, arr]) => arr.length > 0);
  };

  const groupedSessions = groupSessions(sessions);

  return (
    <aside className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        {isOpen && (
          <div className="brand-header" onClick={() => setActiveTab && setActiveTab('chat')} style={{ cursor: 'pointer' }}>
            <div className="brand-logo-wrapper">
              <img src={logoImg} alt="CA Logo" className="brand-logo-img" />
              <div className="brand-logo-glow" />
            </div>
            <div className="brand-title-group">
              <span className="brand-name">CA Tutor AI</span>
              <span className="brand-badge">2026 PRO</span>
            </div>
          </div>
        )}
        <button 
          onClick={toggleSidebar} 
          className="sidebar-toggle-btn"
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
        </button>
      </div>

      {/* Main Actions */}
      <div className="sidebar-actions">
        <button 
          className="new-chat-btn" 
          onClick={() => {
            if (setActiveTab) setActiveTab('chat');
            if (onNewChat) onNewChat();
          }} 
          title="Start new conversation"
        >
          <Plus size={18} />
          {isOpen && <span>New Session</span>}
          {isOpen && <Sparkles size={14} className="sparkle-icon" />}
        </button>

        <button className="search-trigger-btn" onClick={onOpenSearch} title="Search chats (Ctrl+K)">
          <Search size={16} />
          {isOpen && <span>Search chats</span>}
          {isOpen && <kbd className="shortcut-kbd">Ctrl+K</kbd>}
        </button>
      </div>

      {/* Navigation Quick Links */}
      {isOpen && (
        <div className="sidebar-nav-section">
          <div className="section-label">MAIN MODULES</div>
          <button 
            className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab && setActiveTab('chat')}
          >
            <div className="nav-item-icon-badge nav-icon-chat">
              <MessageSquare size={15} />
            </div>
            <span>AI Tutor Assistant</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'discussions' ? 'active' : ''}`}
            onClick={() => setActiveTab && setActiveTab('discussions')}
          >
            <div className="nav-item-icon-badge nav-icon-discuss">
              <Users size={15} />
            </div>
            <span>Discussion & Doubts</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'study_rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab && setActiveTab('study_rooms')}
          >
            <div className="nav-item-icon-badge nav-icon-video">
              <Video size={15} />
            </div>
            <span>Group Study Meetings</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab && setActiveTab('calendar')}
          >
            <div className="nav-item-icon-badge nav-icon-calendar">
              <Calendar size={15} />
            </div>
            <span>Task & Exam Calendar</span>
          </button>
        </div>
      )}

      {/* Chat History Header */}
      {isOpen && (
        <div className="history-section-header">
          <Clock size={13} />
          <span>Chat History ({sessions.length})</span>
        </div>
      )}

      {/* Chat History List */}
      <div className="sidebar-content custom-scrollbar">
        {sessions.length === 0 ? (
          isOpen && (
            <div className="history-empty">
              <MessageSquare size={24} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <div>No chat history yet</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Start a new query to save history</span>
            </div>
          )
        ) : (
          <div className="history-groups">
            {groupedSessions.map(([groupName, groupItems]) => (
              <div key={groupName} className="history-section">
                {isOpen && (
                  <div 
                    className="history-title"
                    onClick={() => toggleGroup(groupName)}
                  >
                    <span>{groupName}</span>
                    {collapsedGroups[groupName] ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                  </div>
                )}
                
                {!collapsedGroups[groupName] && groupItems.map((item) => (
                  <div 
                    key={item.id || Math.random()} 
                    className={`history-item ${activeSessionId === item.id && activeTab === 'chat' ? 'active' : ''}`}
                    onClick={() => {
                      if (setActiveTab) setActiveTab('chat');
                      onSessionClick(item.id);
                    }}
                    title={item.title || "Untitled Chat"}
                  >
                    <MessageSquare size={16} className="history-icon" />
                    {isOpen && <span className="history-title-text">{item.title || "Untitled Chat"}</span>}
                    {isOpen && (
                      <button 
                        onClick={(e) => onDeleteSession(item.id, e)}
                        className="delete-session-btn"
                        title="Delete chat"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar Footer - User Profile */}
      <div className="sidebar-footer">
        {userProfile?.isConfigured ? (
          <div className="user-profile-card" onClick={onOpenProfileModal} title="Click to edit your profile">
            <div className="user-avatar-ring">
              <div className={`user-avatar bg-${userProfile.avatarColor || 'indigo'}`}>
                {userProfile.initials || 'CA'}
              </div>
              <div className="status-dot" />
            </div>
            {isOpen && (
              <div className="user-info">
                <div className="user-name">{userProfile.name}</div>
                <div className="user-role">
                  <UserCheck size={12} style={{ color: 'var(--success)' }} />
                  <span>CA {userProfile.stage}</span>
                </div>
              </div>
            )}
            {isOpen && (
              <button className="edit-profile-btn" title="Edit Profile">
                <Edit3 size={14} />
              </button>
            )}
          </div>
        ) : (
          <button className="create-profile-trigger-btn" onClick={onOpenProfileModal} title="Create your profile">
            <UserPlus size={16} />
            {isOpen && <span>Create Profile</span>}
          </button>
        )}
      </div>
    </aside>
  );
};


export default Sidebar;

