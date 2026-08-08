import React, { useState } from 'react';
import { User, GraduationCap, X, Check, Sparkles, Trash2 } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose, userProfile, onSaveProfile, onDeleteProfile }) => {
  const [name, setName] = useState(userProfile?.name || '');
  const [stage, setStage] = useState(userProfile?.stage || 'Inter');
  const [role, setRole] = useState(userProfile?.role || 'CA Aspirant');
  const [avatarColor, setAvatarColor] = useState(userProfile?.avatarColor || 'indigo');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Calculate initials from name
    const parts = name.trim().split(' ');
    let initials = 'CA';
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts[0]) {
      initials = parts[0].substring(0, 2).toUpperCase();
    }

    onSaveProfile({
      name: name.trim(),
      stage,
      role: role.trim() || 'CA Aspirant',
      initials,
      avatarColor,
      isConfigured: true
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      onDeleteProfile();
      setName('');
      setStage('Inter');
      setRole('CA Aspirant');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass-card profile-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="profile-modal-title">
            <User size={20} className="icon-indigo" />
            <h3>{userProfile?.isConfigured ? 'Edit Student Profile' : 'Create Student Profile'}</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Your Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>CA Exam Stage</label>
              <select 
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="custom-select"
              >
                <option value="Foundation">CA Foundation</option>
                <option value="Inter">CA Inter</option>
                <option value="Final">CA Final</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label>Specialization / Target</label>
              <input
                type="text"
                placeholder="e.g. Tax & Audit"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Avatar Badge Style</label>
            <div className="color-options-grid">
              {[
                { id: 'indigo', label: 'Indigo', class: 'bg-indigo' },
                { id: 'emerald', label: 'Emerald', class: 'bg-emerald' },
                { id: 'violet', label: 'Violet', class: 'bg-violet' },
                { id: 'amber', label: 'Amber', class: 'bg-amber' },
              ].map(c => (
                <button
                  key={c.id}
                  type="button"
                  className={`color-chip ${c.class} ${avatarColor === c.id ? 'active' : ''}`}
                  onClick={() => setAvatarColor(c.id)}
                >
                  {name ? name.substring(0, 2).toUpperCase() : 'CA'}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            {userProfile?.isConfigured && (
              <button 
                type="button" 
                className="delete-profile-btn" 
                onClick={handleDelete}
                title="Delete Profile"
              >
                <Trash2 size={15} />
                <span>Delete Profile</span>
              </button>
            )}

            <button type="button" className="secondary-glass-btn" onClick={onClose}>
              Cancel
            </button>
            
            <button type="submit" className="primary-glow-btn">
              <Check size={16} />
              <span>{userProfile?.isConfigured ? 'Save Changes' : 'Create Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
