import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import DiscussionHub from './components/DiscussionHub';
import GroupStudyHub from './components/GroupStudyHub';
import TaskCalendar from './components/TaskCalendar';
import SearchModal from './components/SearchModal';
import FeatureHubModal from './components/FeatureHubModal';
import ProfileModal from './components/ProfileModal';
import logoImg from './assets/logo.png';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const LOCAL_STORAGE_KEY = 'ca_chat_sessions_cache';


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'discussions' | 'study_rooms' | 'calendar'
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [featureModalTab, setFeatureModalTab] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Dynamic user profile state
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('ca_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { name: '', stage: 'Inter', role: 'CA Aspirant', initials: '?', isConfigured: false };
  });

  const handleSaveProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem('ca_user_profile', JSON.stringify(updatedProfile));
  };

  const handleDeleteProfile = () => {
    const defaultProf = { name: '', stage: 'Inter', role: 'CA Aspirant', initials: '?', isConfigured: false };
    setUserProfile(defaultProf);
    localStorage.removeItem('ca_user_profile');
  };

  const [activeStage, setActiveStage] = useState('Inter');
  const [activeModel, setActiveModel] = useState('groq:llama-3.1-8b');
  const [modelsList, setModelsList] = useState([]);


  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Real chat history state
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // File Staging state
  const [pendingFiles, setPendingFiles] = useState([]);

  // PDF Viewer state
  const [activePdfUrl, setActivePdfUrl] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/models`)
      .then(res => res.json())
      .then(data => {
        if (data.models && data.models.length > 0) {
          setModelsList(data.models);
        }
      })
      .catch(err => console.error("Could not fetch models:", err));
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`);
      if (response.ok) {
        const data = await response.json();
        const serverSessions = data.sessions || [];
        if (serverSessions.length > 0) {
          setSessions(serverSessions);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverSessions));
        } else {
          const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (cached) setSessions(JSON.parse(cached));
        }
      } else {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) setSessions(JSON.parse(cached));
      }
    } catch (err) {
      console.error("Failed to load sessions from server:", err);
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) setSessions(JSON.parse(cached));
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = () => {
    setActiveTab('chat');
    setCurrentSessionId(null);
    setActiveSessionId(null);
    setMessages([]);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSessionClick = async (sessionId) => {
    setActiveTab('chat');
    setCurrentSessionId(sessionId);
    setActiveSessionId(sessionId);
    if (window.innerWidth < 768) setIsSidebarOpen(false);

    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to load session messages:", err);
    }
  };

  const handleDeleteSession = async (sessionId, e) => {
    if (e) e.stopPropagation();
    try {
      await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error("Delete request error:", err);
    }
    
    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    if (currentSessionId === sessionId) {
      handleNewChat();
    }
  };

  const handleSend = async (text) => {
    if (text === 'Upload Study Material') {
      fileInputRef.current?.click();
      return;
    }

    const filesToUpload = [...pendingFiles];
    if (!text.trim() && filesToUpload.length === 0) return;

    setIsTyping(true);
    let chatSessionId = currentSessionId;

    if (filesToUpload.length > 0) {
      setPendingFiles([]);
    }

    const newUserMsg = { 
      role: 'user', 
      content: text || '', 
      attachments: filesToUpload.map(f => ({ name: f.name }))
    };
    setMessages((prev) => [...prev, newUserMsg]);

    let uploadSuccessMessages = [];
    let isBackgroundProcessing = false;

    // 1. Handle File Uploads first
    if (filesToUpload.length > 0) {
      try {
        for (const file of filesToUpload) {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            let errorDetail = `Failed to upload ${file.name}`;
            try {
              const errData = await response.json();
              if (errData.detail) errorDetail = errData.detail;
            } catch (e) {}
            throw new Error(errorDetail);
          }
          
          const successData = await response.json();
          const msg = successData.message || `Success! Ingested ${file.name}.`;
          uploadSuccessMessages.push(msg);
          if (msg.includes("background")) {
            isBackgroundProcessing = true;
          }
        }
      } catch (error) {
        console.error("Upload error:", error);
        setMessages((prev) => [...prev, { role: 'ai', content: error.message || "Failed to upload document." }]);
        setIsTyping(false);
        return;
      }
    }

    // 2. Handle Text Message with activeModel selection
    if (text && !isBackgroundProcessing) {
      try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            session_id: chatSessionId,
            model_id: activeModel
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch response');
        }

        const data = await response.json();

        if (data.session_id) {
          const newId = data.session_id;
          if (!chatSessionId) {
            setCurrentSessionId(newId);
            setActiveSessionId(newId);
            const titleSnippet = text.length > 30 ? text.substring(0, 30) + '...' : text;
            const newSessionObj = { id: newId, title: titleSnippet, created_at: new Date().toISOString() };
            const newSessionsList = [newSessionObj, ...sessions];
            setSessions(newSessionsList);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSessionsList));
          }
          fetchSessions();
        }

        let finalAiResponse = data.response || "No response received.";
        if (uploadSuccessMessages.length > 0) {
           finalAiResponse = uploadSuccessMessages.join('\n\n') + '\n\n---\n\n' + finalAiResponse;
        }

        setMessages((prev) => [...prev, { role: 'ai', content: finalAiResponse }]);
      } catch (error) {
        console.error(error);
        setMessages((prev) => [...prev, { role: 'ai', content: "Sorry, I encountered an error connecting to the backend server." }]);
      }
    } else if (text && isBackgroundProcessing) {
      let warningMsg = uploadSuccessMessages.join('\n\n') + '\n\n---\n\n' + `I received your question: "${text}"\n\nHowever, because your document is still being processed by OCR in the background, please wait a few moments and resend your query.`;
      setMessages((prev) => [...prev, { role: 'ai', content: warningMsg }]);
    } else if (uploadSuccessMessages.length > 0) {
      setMessages((prev) => [...prev, { role: 'ai', content: uploadSuccessMessages.join('\n\n') }]);
    }

    setIsTyping(false);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setPendingFiles(prev => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveFile = (indexToRemove) => {
    setPendingFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handlePreviewUrl = (url) => {
    setActivePdfUrl(url);
  };

  const handlePreviewPendingFile = (file) => {
    setActivePdfUrl(URL.createObjectURL(file));
  };

  return (
    <div className="app-container">
      {showSplash && (
        <div className="splash-screen">
          <div className="splash-content">
            <img src={logoImg} alt="CA Exam Prep Logo" className="splash-logo" />
            <div className="splash-loader">
              <div className="loader-line" />
            </div>
            <span className="splash-tag">CA AI Tutor 2026</span>
          </div>
        </div>
      )}

      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.webp,.bmp,.tiff,.txt,.md,.docx,.webm,.wav,.mp3,.m4a,.ogg"
        multiple
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileUpload}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onNewChat={handleNewChat}
        sessions={sessions}
        onSessionClick={handleSessionClick}
        onDeleteSession={handleDeleteSession}
        activeSessionId={activeSessionId}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        sessions={sessions}
        onSessionClick={handleSessionClick}
        onNewChat={handleNewChat}
      />

      <FeatureHubModal
        isOpen={featureModalTab !== null}
        onClose={() => setFeatureModalTab(null)}
        initialTab={featureModalTab || 'roadmap'}
        activeStage={activeStage}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        onDeleteProfile={handleDeleteProfile}
      />


      <main className="main-content">
        <Header
          toggleSidebar={toggleSidebar}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenFeatureModal={(tab) => setFeatureModalTab(tab)}
          activeStage={activeStage}
          setActiveStage={setActiveStage}
          activeModel={activeModel}
          setActiveModel={setActiveModel}
          modelsList={modelsList}
        />

        {/* Tab Views */}
        {activeTab === 'chat' && (
          <>
            <ChatArea
              messages={messages}
              isTyping={isTyping}
              onPromptClick={handleSend}
              onPreviewUrl={handlePreviewUrl}
              onNewChat={handleNewChat}
              activeStage={activeStage}
            />

            <ChatInput
              onSend={handleSend}
              disabled={isTyping}
              onAttachClick={() => fileInputRef.current?.click()}
              pendingFiles={pendingFiles}
              onRemoveFile={handleRemoveFile}
              onPreviewFile={handlePreviewPendingFile}
              onVoiceRecordComplete={(voiceFile) => setPendingFiles(prev => [...prev, voiceFile])}
            />
          </>
        )}

        {activeTab === 'discussions' && (
          <DiscussionHub 
            onOpenGroupStudy={() => setActiveTab('study_rooms')}
          />
        )}

        {activeTab === 'study_rooms' && (
          <GroupStudyHub />
        )}

        {activeTab === 'calendar' && (
          <TaskCalendar />
        )}
      </main>

      {activePdfUrl && (
        <aside className="pdf-viewer-pane glass-panel">
          <div className="pdf-viewer-header">
            <span>Document Preview</span>
            <button className="close-pdf-btn" onClick={() => setActivePdfUrl(null)}>
              <X size={18} />
            </button>
          </div>
          {activePdfUrl.match(/\.(png|jpg|jpeg|webp|bmp|tiff)($|\?)/i) ? (
            <div className="img-preview-wrapper">
              <img src={activePdfUrl} alt="Preview" />
            </div>
          ) : (
            <iframe src={activePdfUrl} className="pdf-viewer-iframe" title="Document Preview" />
          )}
        </aside>
      )}
    </div>
  );
}

export default App;
