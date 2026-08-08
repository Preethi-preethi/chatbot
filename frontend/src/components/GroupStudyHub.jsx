import React, { useState, useEffect } from 'react';
import { 
  Video, Mic, MicOff, Camera, CameraOff, Monitor, Play, Pause, RotateCcw, 
  Users, Plus, Clock, BookOpen, MessageSquare, Send, X, ShieldCheck, Sparkles, LogOut 
} from 'lucide-react';

const INITIAL_MEETINGS = [];


const GroupStudyHub = () => {
  const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
  const [activeRoom, setActiveRoom] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Audio/Video controls state inside room
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Pomodoro Timer state inside room
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Room notes state
  const [roomNotes, setRoomNotes] = useState([
    '• Key Formula: Taxable Supply = Transaction Value + Incidental Expenses - Discount',
    '• Section 16(2)(aa) - Invoice details must be uploaded by supplier in GSTR-1',
    '• Time of supply for services: Earlier of Invoice Date or Payment Date'
  ]);
  const [noteInput, setNoteInput] = useState('');

  // Schedule modal inputs
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Indirect Tax (GST)');
  const [newStage, setNewStage] = useState('CA Inter');
  const [newTime, setNewTime] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleJoinRoom = (meeting) => {
    setActiveRoom(meeting);
    setTimerSeconds(25 * 60);
    setIsTimerRunning(false);
  };

  const handleLeaveRoom = () => {
    setActiveRoom(null);
    setIsTimerRunning(false);
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    setRoomNotes([...roomNotes, `• ${noteInput.trim()}`]);
    setNoteInput('');
  };

  const handleScheduleMeeting = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTime.trim()) return;

    const createdObj = {
      id: Date.now(),
      title: newTitle,
      subject: newSubject,
      stage: newStage,
      host: 'You (CA Aspirant)',
      hostAvatar: 'CA',
      time: newTime,
      participants: 1,
      maxParticipants: 8,
      isLive: false,
      desc: newDesc || 'Collaborative CA study session.'
    };

    setMeetings([createdObj, ...meetings]);
    setNewTitle('');
    setNewTime('');
    setNewDesc('');
    setIsScheduleModalOpen(false);
  };

  return (
    <div className="group-study-container custom-scrollbar">
      {/* Active Room Screen if in meeting */}
      {activeRoom ? (
        <div className="active-room-view glass-card">
          {/* Room Header */}
          <div className="room-header">
            <div className="room-title-group">
              <span className="live-pill"><span className="live-dot" /> LIVE STUDY SESSION</span>
              <h2>{activeRoom.title}</h2>
              <span className="room-meta">{activeRoom.subject} • {activeRoom.stage}</span>
            </div>

            <div className="room-header-actions">
              {/* Pomodoro Widget */}
              <div className="room-pomodoro-widget glass-panel">
                <Clock size={16} className="timer-icon" />
                <span className="timer-display">{formatTimer(timerSeconds)}</span>
                <button 
                  className="timer-btn"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  title={isTimerRunning ? "Pause Timer" : "Start Focus Timer"}
                >
                  {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button 
                  className="timer-btn"
                  onClick={() => { setTimerSeconds(25 * 60); setIsTimerRunning(false); }}
                  title="Reset Timer"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              <button className="leave-room-btn" onClick={handleLeaveRoom}>
                <LogOut size={16} />
                <span>Leave Room</span>
              </button>
            </div>
          </div>

          {/* Room Grid Layout */}
          <div className="room-content-grid">
            {/* Left: Video / Screen Share Area */}
            <div className="video-conference-pane glass-panel">
              <div className="participant-video-grid">
                {/* User Tile */}
                <div className={`video-tile ${!isCamOn ? 'cam-off' : ''}`}>
                  {isCamOn ? (
                    <div className="simulated-feed user-feed">
                      <div className="feed-avatar">CA</div>
                      <span className="feed-name">You (Host)</span>
                    </div>
                  ) : (
                    <div className="video-placeholder">
                      <div className="user-avatar-large">CA</div>
                      <span className="placeholder-name">You (Camera Off)</span>
                    </div>
                  )}
                  <span className={`mic-status-badge ${isMicOn ? 'on' : 'off'}`}>
                    {isMicOn ? <Mic size={12} /> : <MicOff size={12} />}
                  </span>
                </div>

                {/* Peer Tile 1 */}
                <div className="video-tile active-speaker">
                  <div className="simulated-feed peer-1-feed">
                    <div className="audio-wave">
                      <span /><span /><span />
                    </div>
                    <div className="feed-avatar">PM</div>
                    <span className="feed-name">Priya Mehta</span>
                  </div>
                  <span className="mic-status-badge on"><Mic size={12} /></span>
                </div>

                {/* Peer Tile 2 */}
                <div className="video-tile">
                  <div className="simulated-feed peer-2-feed">
                    <div className="feed-avatar">RS</div>
                    <span className="feed-name">Rohan Sharma</span>
                  </div>
                  <span className="mic-status-badge on"><Mic size={12} /></span>
                </div>

                {/* Peer Tile 3 */}
                <div className="video-tile">
                  <div className="simulated-feed peer-3-feed">
                    <div className="feed-avatar">NV</div>
                    <span className="feed-name">Neha Verma</span>
                  </div>
                  <span className="mic-status-badge off"><MicOff size={12} /></span>
                </div>
              </div>

              {/* Conference Controls */}
              <div className="conference-toolbar">
                <button 
                  className={`toolbar-btn ${!isMicOn ? 'danger' : ''}`}
                  onClick={() => setIsMicOn(!isMicOn)}
                >
                  {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
                  <span>{isMicOn ? 'Mute' : 'Unmute'}</span>
                </button>

                <button 
                  className={`toolbar-btn ${!isCamOn ? 'danger' : ''}`}
                  onClick={() => setIsCamOn(!isCamOn)}
                >
                  {isCamOn ? <Camera size={18} /> : <CameraOff size={18} />}
                  <span>{isCamOn ? 'Stop Cam' : 'Start Cam'}</span>
                </button>

                <button 
                  className={`toolbar-btn ${isScreenSharing ? 'active-share' : ''}`}
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                >
                  <Monitor size={18} />
                  <span>{isScreenSharing ? 'Sharing Screen' : 'Share Screen'}</span>
                </button>
              </div>
            </div>

            {/* Right: Collaborative Study Notes */}
            <div className="collaborative-notes-pane glass-panel">
              <div className="notes-header">
                <BookOpen size={18} className="notes-icon" />
                <h3>Live Shared Study Notes</h3>
              </div>

              <div className="notes-list custom-scrollbar">
                {roomNotes.map((note, i) => (
                  <div key={i} className="note-item">
                    {note}
                  </div>
                ))}
              </div>

              <div className="notes-input-box">
                <input
                  type="text"
                  placeholder="Add a key section or formula note..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                />
                <button className="add-note-btn" onClick={handleAddNote}>
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Lobby View */
        <>
          <div className="group-study-hero glass-card">
            <div className="hero-badge">
              <Video size={16} />
              <span>Virtual Study Rooms</span>
            </div>
            <h2>Study Together with Live Video, Audio & Pomodoro Timers</h2>
            <p>Join active CA study lounges, schedule subject revision marathons, and solve ICAI questions in real-time.</p>

            <div className="group-study-actions">
              <button className="primary-glow-btn" onClick={() => setIsScheduleModalOpen(true)}>
                <Plus size={18} />
                <span>Schedule Study Session</span>
              </button>
            </div>
          </div>

          {/* Meetings Grid */}
          <div className="meetings-section">
            <div className="section-title-row">
              <h3>Available & Upcoming Study Lounges</h3>
              <span className="count-pill">{meetings.length} Sessions</span>
            </div>

            <div className="meetings-grid">
              {meetings.map(meeting => (
                <div key={meeting.id} className="meeting-card glass-panel">
                  <div className="meeting-card-header">
                    <span className="meeting-subject-tag">{meeting.subject}</span>
                    {meeting.isLive ? (
                      <span className="live-status-badge">
                        <span className="pulse-dot" /> Live Now
                      </span>
                    ) : (
                      <span className="upcoming-status-badge">
                        <Clock size={12} /> {meeting.time}
                      </span>
                    )}
                  </div>

                  <h3 className="meeting-title">{meeting.title}</h3>
                  <p className="meeting-desc">{meeting.desc}</p>

                  <div className="meeting-host-info">
                    <div className="host-avatar">{meeting.hostAvatar}</div>
                    <div>
                      <span className="host-name">{meeting.host}</span>
                      <span className="host-stage">{meeting.stage}</span>
                    </div>
                  </div>

                  <div className="meeting-card-footer">
                    <div className="participants-count">
                      <Users size={14} />
                      <span>{meeting.participants}/{meeting.maxParticipants} Seats</span>
                    </div>

                    <button 
                      className={`join-room-btn ${meeting.isLive ? 'live-btn' : ''}`}
                      onClick={() => handleJoinRoom(meeting)}
                    >
                      <Video size={15} />
                      <span>{meeting.isLive ? 'Join Room Now' : 'Enter Lounge'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Schedule Meeting Modal */}
      {isScheduleModalOpen && (
        <div className="modal-overlay" onClick={() => setIsScheduleModalOpen(false)}>
          <div className="modal-card glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Schedule a Group Study Session</h3>
              <button className="close-btn" onClick={() => setIsScheduleModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleScheduleMeeting} className="modal-form">
              <div className="form-group">
                <label>Session Title</label>
                <input
                  type="text"
                  placeholder="e.g. Ind AS 115 Revenue Recognition Case Laws"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Subject</label>
                  <select 
                    value={newSubject} 
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="custom-select"
                  >
                    <option value="Indirect Tax (GST)">Indirect Tax (GST)</option>
                    <option value="Direct Tax">Direct Tax</option>
                    <option value="Auditing & Ethics">Auditing & Ethics</option>
                    <option value="Financial Reporting">Financial Reporting</option>
                    <option value="Corporate Law">Corporate Law</option>
                    <option value="Advanced Accounting">Advanced Accounting</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label>CA Stage</label>
                  <select 
                    value={newStage} 
                    onChange={(e) => setNewStage(e.target.value)}
                    className="custom-select"
                  >
                    <option value="CA Foundation">CA Foundation</option>
                    <option value="CA Inter">CA Inter</option>
                    <option value="CA Final">CA Final</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Date & Time</label>
                <input
                  type="text"
                  placeholder="e.g. Today at 8:00 PM or Tomorrow 6:00 PM"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Study Focus / Goals</label>
                <textarea
                  rows={3}
                  placeholder="What topics or question papers will the group focus on?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="secondary-glass-btn" onClick={() => setIsScheduleModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-glow-btn">
                  Publish Lounge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupStudyHub;
