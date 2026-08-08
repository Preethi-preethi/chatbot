import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Users, Video, Calendar, 
  Menu, GraduationCap, Cpu, Compass, ChevronDown, Check
} from 'lucide-react';

const Header = ({ 
  toggleSidebar, 
  activeTab = 'chat',
  onOpenFeatureModal, 
  activeStage = 'Inter', 
  setActiveStage,
  activeModel = 'groq:llama-3.1-8b',
  setActiveModel,
  modelsList = []
}) => {
  const [openDropdown, setOpenDropdown] = useState(null); // 'stage' | 'model' | 'tools' | null
  const headerRef = useRef(null);

  const defaultModels = [
    { id: "groq:llama-3.1-8b", name: "Llama 3.1 8B (Cloud)", ram: "Fast" },
    { id: "groq:llama-3.3-70b", name: "Llama 3.3 70B (Cloud)", ram: "Pro" },
    { id: "groq:mixtral-8x7b", name: "Mixtral 8x7B (Cloud)", ram: "Pro" },
    { id: "ollama:llama3.2:1b", name: "Llama 3.2 1B (Local)", ram: "1.3 GB" },
    { id: "ollama:llama3.2:3b", name: "Llama 3.2 3B (Local)", ram: "2.2 GB" },
    { id: "ollama:qwen2.5:7b", name: "Qwen 2.5 7B (Local)", ram: "4.7 GB" },
    { id: "ollama:deepseek-r1:8b", name: "DeepSeek R1 8B (Local)", ram: "4.9 GB" },
    { id: "ollama:mistral:7b", name: "Mistral 7B (Local)", ram: "4.4 GB" }
  ];

  const availableModels = modelsList.length > 0 ? modelsList : defaultModels;
  const currentModelObj = availableModels.find(m => m.id === activeModel) || availableModels[0];

  const tabTitles = {
    chat: { title: 'AI Tutor Workspace', icon: <MessageSquare size={16} className="icon-indigo" /> },
    discussions: { title: 'Discussion & Doubts Hub', icon: <Users size={16} className="icon-emerald" /> },
    study_rooms: { title: 'Group Study Rooms', icon: <Video size={16} className="icon-violet" /> },
    calendar: { title: 'Task & Exam Calendar', icon: <Calendar size={16} className="icon-amber" /> }
  };

  const activeInfo = tabTitles[activeTab] || tabTitles.chat;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="app-header glass-header" ref={headerRef}>
      {/* Left: Sidebar Toggle + Active View Indicator Title */}
      <div className="header-left">
        <button className="mobile-toggle-btn" onClick={toggleSidebar} title="Toggle Sidebar">
          <Menu size={20} />
        </button>

        <div className="header-active-view-badge">
          {activeInfo.icon}
          <span className="active-view-title">{activeInfo.title}</span>
        </div>
      </div>

      {/* Right Tools: Custom Executive Dropdowns */}
      <div className="header-right">
        {/* 1. Custom Stage Dropdown */}
        <div className="custom-dropdown-container">
          <button 
            className={`custom-dropdown-trigger ${openDropdown === 'stage' ? 'active' : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'stage' ? null : 'stage')}
            title="Select CA Exam Stage"
          >
            <div className="dropdown-trigger-icon-wrap icon-emerald">
              <GraduationCap size={15} />
            </div>
            <span className="dropdown-trigger-label">CA {activeStage}</span>
            <ChevronDown size={14} className={`dropdown-chevron ${openDropdown === 'stage' ? 'rotate' : ''}`} />
          </button>

          {openDropdown === 'stage' && (
            <div className="custom-dropdown-menu glass-card">
              <div className="dropdown-menu-header">CA Exam Stage</div>
              {['Foundation', 'Inter', 'Final'].map(st => (
                <button
                  key={st}
                  className={`dropdown-menu-item ${activeStage === st ? 'selected' : ''}`}
                  onClick={() => {
                    if (setActiveStage) setActiveStage(st);
                    setOpenDropdown(null);
                  }}
                >
                  <GraduationCap size={14} className="item-icon icon-emerald" />
                  <span className="item-text">CA {st}</span>
                  {activeStage === st && <Check size={14} className="check-icon" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Custom AI Model Dropdown */}
        <div className="custom-dropdown-container">
          <button 
            className={`custom-dropdown-trigger ${openDropdown === 'model' ? 'active' : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'model' ? null : 'model')}
            title="Select AI Engine"
          >
            <div className="dropdown-trigger-icon-wrap icon-violet">
              <Cpu size={15} />
            </div>
            <span className="dropdown-trigger-label">{currentModelObj?.name || 'AI Model'}</span>
            <ChevronDown size={14} className={`dropdown-chevron ${openDropdown === 'model' ? 'rotate' : ''}`} />
          </button>

          {openDropdown === 'model' && (
            <div className="custom-dropdown-menu glass-card model-menu">
              <div className="dropdown-menu-header">Choose AI Engine</div>
              {availableModels.map(m => (
                <button
                  key={m.id}
                  className={`dropdown-menu-item ${activeModel === m.id ? 'selected' : ''}`}
                  onClick={() => {
                    if (setActiveModel) setActiveModel(m.id);
                    setOpenDropdown(null);
                  }}
                >
                  <Cpu size={14} className="item-icon icon-violet" />
                  <div className="model-item-info">
                    <span className="model-item-name">{m.name}</span>
                    {m.ram && <span className="model-item-ram">{m.ram}</span>}
                  </div>
                  {activeModel === m.id && <Check size={14} className="check-icon" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Custom ICAI Tools Dropdown */}
        <div className="custom-dropdown-container">
          <button 
            className={`custom-dropdown-trigger ${openDropdown === 'tools' ? 'active' : ''}`}
            onClick={() => setOpenDropdown(openDropdown === 'tools' ? null : 'tools')}
            title="ICAI Study Resources"
          >
            <div className="dropdown-trigger-icon-wrap icon-amber">
              <Compass size={15} />
            </div>
            <span className="dropdown-trigger-label">ICAI Tools</span>
            <ChevronDown size={14} className={`dropdown-chevron ${openDropdown === 'tools' ? 'rotate' : ''}`} />
          </button>

          {openDropdown === 'tools' && (
            <div className="custom-dropdown-menu glass-card">
              <div className="dropdown-menu-header">ICAI Study Resources</div>
              <button
                className="dropdown-menu-item"
                onClick={() => {
                  if (onOpenFeatureModal) onOpenFeatureModal('roadmap');
                  setOpenDropdown(null);
                }}
              >
                <span className="item-emoji">🎯</span>
                <span className="item-text">Exam Roadmap</span>
              </button>
              <button
                className="dropdown-menu-item"
                onClick={() => {
                  if (onOpenFeatureModal) onOpenFeatureModal('syllabus');
                  setOpenDropdown(null);
                }}
              >
                <span className="item-emoji">📚</span>
                <span className="item-text">Paper Syllabus</span>
              </button>
              <button
                className="dropdown-menu-item"
                onClick={() => {
                  if (onOpenFeatureModal) onOpenFeatureModal('materials');
                  setOpenDropdown(null);
                }}
              >
                <span className="item-emoji">📄</span>
                <span className="item-text">Study Materials</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;




