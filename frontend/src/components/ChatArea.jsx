import React, { useRef, useEffect } from 'react';
import { FileText, PieChart, ShieldCheck, User, ArrowLeft, Calculator, File, Sparkles, Zap, BookOpen, Upload, Layers } from 'lucide-react';
import TypingIndicator from './TypingIndicator';
import logoImg from '../assets/logo.png';
import chatLogoImg from '../assets/chat-logo.png';

const renderTextWithLinks = (text, onPreviewUrl) => {
  if (!text) return null;
  const parts = text.split(/([a-zA-Z0-9_.-]+\.(?:pdf|docx|png|jpg|jpeg|webp|txt))/gi);
  return parts.map((part, i) => {
    if (part.toLowerCase().match(/\.(pdf|docx|png|jpg|jpeg|webp|txt)$/i)) {
      return (
        <span
          key={i}
          className="chat-file-link"
          onClick={() => onPreviewUrl(`http://localhost:8000/api/uploads/${part}`)}
          title={`Preview source document: ${part}`}
        >
          📄 {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const ChatArea = ({ messages, isTyping, onPromptClick, onPreviewUrl, onNewChat, activeStage = 'Inter' }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const prompts = [
    {
      icon: <FileText size={22} />,
      colorClass: 'icon-indigo',
      badgeText: 'Foundation',
      title: 'Principles of Accounting & Law',
      description: 'Practice conceptual questions, trial balances, and partnership accounts.',
      prompt: 'Provide 3 important conceptual questions on Principles of Accounting.'
    },
    {
      icon: <ShieldCheck size={22} />,
      colorClass: 'icon-emerald',
      badgeText: 'CA Inter',
      title: 'Direct & Indirect Taxation (GST)',
      description: 'Clarify doubts on Sec 17(5) blocked credits, ITC eligibility, & Income Tax deductions.',
      prompt: 'Explain the key provisions of Input Tax Credit (ITC) under GST with eligibility criteria.'
    },
    {
      icon: <Calculator size={22} />,
      colorClass: 'icon-violet',
      badgeText: 'CA Final',
      title: 'Advanced Auditing & SA Standards',
      description: 'Review SA 200-700 guidelines, auditor fraud obligations under SA 240, and case studies.',
      prompt: 'Summarize the core responsibilities of an auditor under SA 240 regarding fraud.'
    },
    {
      icon: <Upload size={22} />,
      colorClass: 'icon-amber',
      badgeText: 'OCR Query',
      title: 'Upload Study Material / PDF',
      description: 'Upload your ICAI study module, practice paper, or case file for instant deep analysis.',
      prompt: 'Upload Study Material'
    }
  ];

  return (
    <div className="chat-area custom-scrollbar">
      <div className="chat-container">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            {/* Ambient Soft Light Glow Orbs */}
            <div className="ambient-glow orb-1" />
            <div className="ambient-glow orb-2" />

            <div className="welcome-hero-card glass-card">
              <div className="welcome-logo-badge">
                <img src={logoImg} alt="CA Prep AI" className="hero-logo-img" />
                <div className="hero-logo-pulse" />
              </div>

              <h1 className="welcome-title">
                Master CA Exams with <span className="gradient-text">AI Intelligence</span>
              </h1>
              <p className="welcome-subtitle">
                Context-aware tutoring for <strong>{activeStage} Stage</strong> • Deep OCR PDF analysis • Multi-Module Workspace
              </p>

              <div className="hero-tags">
                <span className="hero-tag tag-cyan"><Zap size={13} /> Instant Answers</span>
                <span className="hero-tag tag-emerald"><BookOpen size={13} /> ICAI Standard Compliant</span>
                <span className="hero-tag tag-violet"><Sparkles size={13} /> Multi-Stage AI Tutor</span>
              </div>
            </div>

            {/* Prompt Action Cards with Notable Icons */}
            <div className="feature-card-grid-header">
              <Layers size={16} className="grid-header-icon" />
              <span>QUICK PRACTICE & FEATURE MODULES</span>
            </div>
            
            <div className="ca-prompts">
              {prompts.map((p, idx) => (
                <button
                  key={idx}
                  className="prompt-card glass-panel"
                  onClick={() => onPromptClick(p.prompt)}
                >
                  <div className="prompt-card-header">
                    <div className={`prompt-card-icon ${p.colorClass}`}>{p.icon}</div>
                    <div className="prompt-title-group">
                      <span className="prompt-card-title">{p.title}</span>
                      <span className="prompt-card-badge">{p.badgeText}</span>
                    </div>
                  </div>
                  <p className="prompt-card-desc">{p.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="chat-sticky-nav">
              <button
                onClick={onNewChat}
                className="back-to-home-btn"
              >
                <ArrowLeft size={15} />
                <span>New Session</span>
              </button>
              <div className="chat-stage-pill">{activeStage} Active</div>
            </div>

            <div className="messages-wrapper">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message-row ${msg.role === 'user' ? 'message-user' : 'message-ai'}`}>
                  <div className="message-avatar">
                    {msg.role === 'user' ? (
                      <User size={18} />
                    ) : (
                      <img src={chatLogoImg} alt="AI" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                    )}
                  </div>
                  <div className="message-bubble glass-panel">
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="message-attachments">
                        {msg.attachments.map((att, aIdx) => (
                          <div key={aIdx} className="attachment-chip">
                            <File size={13} />
                            <span className="truncate">{att.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="message-text">
                      {(msg.content && msg.content.trim() ? msg.content.trim() : "Hello! I am your CA Tutor AI. How can I assist you with your exam prep today?").split('\n').map((line, i) => {
                        const trimmed = line.trim();

                          if (!trimmed) return <div key={i} className="line-spacer" />;
                          if (trimmed === '---') return <hr key={i} className="chat-divider" />;
                          if (trimmed.startsWith('### ')) {
                            return <h3 key={i} className="chat-heading-3">{renderTextWithLinks(trimmed.replace(/^###\s+/, ''), onPreviewUrl)}</h3>;
                          }
                          if (trimmed.startsWith('## ')) {
                            return <h2 key={i} className="chat-heading-2">{renderTextWithLinks(trimmed.replace(/^##\s+/, ''), onPreviewUrl)}</h2>;
                          }
                          if (trimmed.startsWith('# ')) {
                            return <h1 key={i} className="chat-heading-1">{renderTextWithLinks(trimmed.replace(/^#\s+/, ''), onPreviewUrl)}</h1>;
                          }
                          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                            const bulletContent = trimmed.replace(/^[-*]\s+(?:Source Document:\s*)?/, '');
                            return (
                              <div key={i} className="chat-bullet-line">
                                <span className="bullet-dot">•</span>
                                <div>{renderTextWithLinks(bulletContent, onPreviewUrl)}</div>
                              </div>
                            );
                          }
                          return <p key={i}>{renderTextWithLinks(line, onPreviewUrl)}</p>;
                        })}
                      </div>
                  </div>
                </div>

              ))}

              {isTyping && (
                <div className="message-row message-ai">
                  <div className="message-avatar">
                    <img src={chatLogoImg} alt="AI" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                  </div>
                  <div className="message-bubble glass-panel typing-bubble">
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatArea;

