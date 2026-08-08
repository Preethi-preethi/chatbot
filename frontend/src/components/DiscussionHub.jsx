import React, { useState } from 'react';
import { 
  MessageSquare, Plus, ThumbsUp, MessageCircle, CheckCircle2, 
  Search, Filter, Users, Send, User, Sparkles, Tag, ShieldCheck, Video, X 
} from 'lucide-react';

const INITIAL_POSTS = [];
const FRIENDS_LIST = [];


const DiscussionHub = ({ onOpenGroupStudy }) => {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [activeFriendChat, setActiveFriendChat] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [chatInputText, setChatInputText] = useState('');

  // Form State
  const [newSubject, setNewSubject] = useState('Indirect Tax (GST)');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Reply State
  const [replyTextMap, setReplyTextMap] = useState({});
  const [expandedAnswers, setExpandedAnswers] = useState({});

  const subjects = ['All', 'Indirect Tax (GST)', 'Direct Tax', 'Auditing & Ethics', 'Corporate Law', 'Advanced Accounting'];

  const filteredPosts = posts.filter(post => {
    const matchesSubject = selectedSubject === 'All' || post.subject === selectedSubject;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleUpvote = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          upvotes: p.isUpvoted ? p.upvotes - 1 : p.upvotes + 1,
          isUpvoted: !p.isUpvoted
        };
      }
      return p;
    }));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPostObj = {
      id: Date.now(),
      author: 'You (CA Aspirant)',
      avatar: 'CA',
      stage: 'CA Inter',
      timeAgo: 'Just now',
      subject: newSubject,
      title: newTitle,
      content: newContent,
      upvotes: 0,
      isUpvoted: false,
      resolved: false,
      answers: []
    };

    setPosts([newPostObj, ...posts]);
    setNewTitle('');
    setNewContent('');
    setIsAskModalOpen(false);
  };

  const handleAddAnswer = (postId) => {
    const text = replyTextMap[postId];
    if (!text || !text.trim()) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          answers: [
            ...p.answers,
            {
              id: Date.now(),
              author: 'You (CA Aspirant)',
              avatar: 'CA',
              stage: 'CA Inter',
              timeAgo: 'Just now',
              text: text.trim()
            }
          ]
        };
      }
      return p;
    }));

    setReplyTextMap(prev => ({ ...prev, [postId]: '' }));
  };

  const toggleAnswers = (postId) => {
    setExpandedAnswers(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleSendFriendMsg = () => {
    if (!activeFriendChat || !chatInputText.trim()) return;
    const friendId = activeFriendChat.id;
    const newMsg = { id: Date.now(), sender: 'you', text: chatInputText.trim(), time: 'Just now' };

    setChatMessages(prev => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), newMsg]
    }));
    setChatInputText('');

    // Simulate friend auto reply after 1s
    setTimeout(() => {
      setChatMessages(prev => ({
        ...prev,
        [friendId]: [
          ...(prev[friendId] || []),
          { id: Date.now() + 1, sender: 'friend', text: `Hey! Thanks for connecting. Let's study ${activeFriendChat.activity.split(' ')[1] || 'together'}!`, time: 'Just now' }
        ]
      }));
    }, 1200);
  };

  return (
    <div className="discussion-container custom-scrollbar">
      {/* Top Banner */}
      <div className="discussion-hero glass-card">
        <div className="hero-badge">
          <Users size={16} />
          <span>CA Student Community</span>
        </div>
        <h2>Connect, Discuss & Resolve Doubts in Real-Time</h2>
        <p>Ask questions, solve complex ICAI case studies with peer CA aspirants, and launch group study sessions.</p>

        <div className="discussion-hero-actions">
          <button className="primary-glow-btn" onClick={() => setIsAskModalOpen(true)}>
            <Plus size={18} />
            <span>Post a Doubt</span>
          </button>
          <button className="secondary-glass-btn" onClick={onOpenGroupStudy}>
            <Video size={18} />
            <span>Group Study Rooms</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="discussion-layout">
        {/* Left / Center Feed */}
        <div className="feed-section">
          {/* Controls Bar */}
          <div className="feed-controls-bar glass-panel">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search doubts, topics or case laws..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="subject-tags-scroll custom-scrollbar">
              {subjects.map(sub => (
                <button
                  key={sub}
                  className={`subject-pill ${selectedSubject === sub ? 'active' : ''}`}
                  onClick={() => setSelectedSubject(sub)}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List */}
          <div className="posts-feed">
            {filteredPosts.length === 0 ? (
              <div className="no-posts-card glass-panel">
                <MessageSquare size={36} style={{ opacity: 0.4 }} />
                <h3>No doubts found</h3>
                <p>Be the first to ask a doubt under <strong>{selectedSubject}</strong>!</p>
                <button className="primary-glow-btn" onClick={() => setIsAskModalOpen(true)}>
                  <Plus size={16} /> Post Question
                </button>
              </div>
            ) : (
              filteredPosts.map(post => (
                <div key={post.id} className="post-card glass-panel">
                  {/* Post Header */}
                  <div className="post-header">
                    <div className="post-author-group">
                      <div className="author-avatar">{post.avatar}</div>
                      <div>
                        <div className="author-name-row">
                          <span className="author-name">{post.author}</span>
                          <span className="author-stage">{post.stage}</span>
                        </div>
                        <span className="post-time">{post.timeAgo}</span>
                      </div>
                    </div>

                    <div className="post-badges">
                      <span className="post-subject-badge">
                        <Tag size={12} /> {post.subject}
                      </span>
                      {post.resolved && (
                        <span className="resolved-badge">
                          <CheckCircle2 size={12} /> Resolved
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-body">{post.content}</p>

                  {/* Post Footer Actions */}
                  <div className="post-actions">
                    <button 
                      className={`post-action-btn upvote-btn ${post.isUpvoted ? 'active' : ''}`}
                      onClick={() => handleUpvote(post.id)}
                    >
                      <ThumbsUp size={15} />
                      <span>{post.upvotes} Upvotes</span>
                    </button>

                    <button 
                      className="post-action-btn comment-btn"
                      onClick={() => toggleAnswers(post.id)}
                    >
                      <MessageCircle size={15} />
                      <span>{post.answers.length} Answers</span>
                    </button>

                    <button className="post-action-btn share-btn" onClick={onOpenGroupStudy}>
                      <Video size={15} />
                      <span>Study in Group</span>
                    </button>
                  </div>


                  {/* Answers Drawer */}
                  {(expandedAnswers[post.id] || post.answers.length > 0) && (
                    <div className="answers-container">
                      <div className="answers-list">
                        {post.answers.map(ans => (
                          <div key={ans.id} className="answer-card">
                            <div className="answer-author-row">
                              <div className="ans-avatar">{ans.avatar}</div>
                              <span className="ans-author">{ans.author}</span>
                              <span className="ans-stage">{ans.stage}</span>
                              <span className="ans-time">{ans.timeAgo}</span>
                            </div>
                            <p className="ans-text">{ans.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Add Answer Input */}
                      <div className="add-answer-row">
                        <input
                          type="text"
                          placeholder="Write your explanation or clarification..."
                          value={replyTextMap[post.id] || ''}
                          onChange={(e) => setReplyTextMap({ ...replyTextMap, [post.id]: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddAnswer(post.id)}
                        />
                        <button className="send-answer-btn" onClick={() => handleAddAnswer(post.id)}>
                          <Send size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar: Friends & Online Study Buddies */}
        <div className="friends-sidebar glass-panel">
          <div className="friends-header">
            <Users size={18} className="friends-icon" />
            <h3>Study Buddies ({FRIENDS_LIST.filter(f => f.status === 'online').length} Online)</h3>
          </div>

          <div className="friends-list custom-scrollbar">
            {FRIENDS_LIST.map(friend => (
              <div key={friend.id} className="friend-card" onClick={() => setActiveFriendChat(friend)}>
                <div className="friend-avatar-wrap">
                  <div className="friend-avatar">{friend.avatar}</div>
                  <span className={`status-dot ${friend.status}`} />
                </div>
                <div className="friend-info">
                  <div className="friend-name-row">
                    <span className="friend-name">{friend.name}</span>
                    <span className="friend-stage">{friend.stage}</span>
                  </div>
                  <span className="friend-activity">{friend.activity}</span>
                </div>
                <button className="chat-friend-btn" title="Chat with friend">
                  <MessageSquare size={15} />
                </button>
              </div>
            ))}
          </div>

          <div className="friends-callout-card">
            <Sparkles size={18} className="callout-sparkle" />
            <h4>Group Study Room</h4>
            <p>Start a live audio/video room with your study buddies right now.</p>
            <button className="primary-glow-btn full-width" onClick={onOpenGroupStudy}>
              <Video size={16} /> Launch Lounge
            </button>
          </div>
        </div>
      </div>

      {/* Post Doubt Modal */}
      {isAskModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAskModalOpen(false)}>
          <div className="modal-card glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Post a Doubt for Discussion</h3>
              <button className="close-btn" onClick={() => setIsAskModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="modal-form">
              <div className="form-group">
                <label>Select Subject</label>
                <select 
                  value={newSubject} 
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="custom-select"
                >
                  {subjects.filter(s => s !== 'All').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Doubt Title / Question</label>
                <input
                  type="text"
                  placeholder="e.g. Can input tax credit be claimed on motor vehicles used for transportation of goods?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Detailed Explanation / Case Details</label>
                <textarea
                  rows={5}
                  placeholder="Provide background context, sections referenced, or your calculation step..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="secondary-glass-btn" onClick={() => setIsAskModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-glow-btn">
                  Publish Doubt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Friend Chat Drawer */}
      {activeFriendChat && (
        <div className="direct-chat-drawer glass-card">
          <div className="drawer-header">
            <div className="drawer-user-info">
              <div className="friend-avatar">{activeFriendChat.avatar}</div>
              <div>
                <h4>{activeFriendChat.name}</h4>
                <span className="drawer-sub">{activeFriendChat.stage} • {activeFriendChat.status}</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setActiveFriendChat(null)}>
              <X size={16} />
            </button>
          </div>

          <div className="drawer-body custom-scrollbar">
            <div className="chat-intro-note">
              This is a private conversation with {activeFriendChat.name}. Ask study questions or coordinate group study!
            </div>
            {(chatMessages[activeFriendChat.id] || []).map((msg) => (
              <div key={msg.id} className={`direct-msg-row ${msg.sender === 'you' ? 'sent' : 'received'}`}>
                <div className="direct-msg-bubble">
                  <p>{msg.text}</p>
                  <span className="direct-msg-time">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="drawer-footer">
            <input
              type="text"
              placeholder={`Message ${activeFriendChat.name.split(' ')[0]}...`}
              value={chatInputText}
              onChange={(e) => setChatInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendFriendMsg()}
            />
            <button className="send-btn" onClick={handleSendFriendMsg}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionHub;
