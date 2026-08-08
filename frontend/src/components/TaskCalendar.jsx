import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, CheckCircle2, 
  Circle, Clock, Flame, Tag, AlertCircle, Trash2, X, Sparkles, Trophy 
} from 'lucide-react';

const INITIAL_TASKS = [];


const TaskCalendar = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [selectedDate, setSelectedDate] = useState('2026-08-04');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(7); // 0-indexed: 7 = August

  // Task Modal Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-08-04');
  const [newSubject, setNewSubject] = useState('Direct Tax');
  const [newPriority, setNewPriority] = useState('High');
  const [newHours, setNewHours] = useState('2.0');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calculate calendar grid for current year and month
  const firstDay = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayOfWeek = firstDay.getDay();

  const calendarGrid = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const monthStr = (currentMonth + 1).toString().padStart(2, '0');
    const dayStr = d.toString().padStart(2, '0');
    calendarGrid.push(`${currentYear}-${monthStr}-${dayStr}`);
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleToggleTask = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTaskObj = {
      id: Date.now(),
      title: newTitle,
      date: newDate,
      subject: newSubject,
      priority: newPriority,
      hours: parseFloat(newHours) || 2.0,
      completed: false
    };

    setTasks([...tasks, newTaskObj]);
    setNewTitle('');
    setIsAddTaskModalOpen(false);
  };

  const filteredAgendaTasks = selectedDate 
    ? tasks.filter(t => t.date === selectedDate)
    : tasks;

  const completedCount = tasks.filter(t => t.completed).length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="task-calendar-container custom-scrollbar">
      {/* Top Banner with Exam Countdown */}
      <div className="calendar-hero glass-card">
        <div className="countdown-widget">
          <div className="countdown-ring">
            <Trophy size={22} className="trophy-icon" />
          </div>
          <div>
            <span className="countdown-label">CA INTER & FINAL EXAM COUNTDOWN</span>
            <div className="countdown-days">
              <span className="days-number">87</span>
              <span className="days-text">Days Left • November 2026 ICAI Exam Cycle</span>
            </div>
          </div>
        </div>

        <div className="progress-summary-widget glass-panel">
          <div className="progress-label-row">
            <span>Study Target Progress</span>
            <span className="progress-pct">{completionPercentage}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${completionPercentage}%` }} />
          </div>
          <div className="progress-sub">
            <span>{completedCount} of {tasks.length} Study Targets Completed</span>
          </div>
        </div>

        <button className="primary-glow-btn" onClick={() => setIsAddTaskModalOpen(true)}>
          <Plus size={18} />
          <span>Add Study Target</span>
        </button>
      </div>

      {/* Main Calendar Layout */}
      <div className="calendar-layout">
        {/* Left: 100% Full 7-Day Month Calendar Grid */}
        <div className="calendar-grid-card glass-panel">
          <div className="month-header">
            <h3>{monthNames[currentMonth]} {currentYear}</h3>
            <div className="month-nav-btns">
              <button className="nav-btn" onClick={handlePrevMonth} title="Previous Month">
                <ChevronLeft size={18} />
              </button>
              <button className="nav-btn" onClick={handleNextMonth} title="Next Month">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* 7 Days Headers: Sun, Mon, Tue, Wed, Thu, Fri, Sat */}
          <div className="days-header-row">
            {daysOfWeek.map(day => (
              <div key={day} className="day-name-cell">
                <span>{day}</span>
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="days-grid">
            {calendarGrid.map((dateStr, idx) => {
              if (!dateStr) return <div key={`empty-${idx}`} className="grid-cell empty" />;

              const dayNum = parseInt(dateStr.split('-')[2], 10);
              const dayTasks = tasks.filter(t => t.date === dateStr);
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === '2026-08-04';

              return (
                <div 
                  key={dateStr}
                  className={`grid-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  <div className="cell-top">
                    <span className="day-number">{dayNum}</span>
                    {isToday && <span className="today-badge">TODAY</span>}
                  </div>

                  <div className="cell-tasks-list">
                    {dayTasks.slice(0, 2).map(t => (
                      <div 
                        key={t.id} 
                        className={`cell-task-chip ${t.priority.toLowerCase()} ${t.completed ? 'done' : ''}`}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="more-tasks-pill">+{dayTasks.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Task Agenda List */}
        <div className="agenda-sidebar glass-panel">
          <div className="agenda-header">
            <CalendarIcon size={18} className="agenda-icon" />
            <div>
              <h3>Study Agenda</h3>
              <span className="agenda-date">
                {selectedDate ? `Date: ${selectedDate}` : 'All Scheduled Tasks'}
              </span>
            </div>
            {selectedDate && (
              <button 
                className="clear-filter-btn" 
                onClick={() => setSelectedDate('')}
                title="Show all tasks"
              >
                All
              </button>
            )}
          </div>

          <div className="agenda-list custom-scrollbar">
            {filteredAgendaTasks.length === 0 ? (
              <div className="no-tasks-state">
                <Clock size={28} style={{ opacity: 0.3, marginBottom: '6px' }} />
                <p>No study tasks on this date.</p>
                <button 
                  className="primary-glow-btn small-btn"
                  onClick={() => {
                    setNewDate(selectedDate || '2026-08-04');
                    setIsAddTaskModalOpen(true);
                  }}
                >
                  <Plus size={14} /> Add Target
                </button>
              </div>
            ) : (
              filteredAgendaTasks.map(task => (
                <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                  <button className="check-btn" onClick={() => handleToggleTask(task.id)}>
                    {task.completed ? (
                      <CheckCircle2 size={18} className="icon-completed" />
                    ) : (
                      <Circle size={18} className="icon-pending" />
                    )}
                  </button>

                  <div className="task-info">
                    <h4 className="task-title">{task.title}</h4>
                    <div className="task-meta-row">
                      <span className="task-subject-tag">{task.subject}</span>
                      <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      <span className="task-hours">
                        <Clock size={12} /> {task.hours}h
                      </span>
                    </div>
                  </div>

                  <button className="delete-task-btn" onClick={() => handleDeleteTask(task.id)} title="Delete Task">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddTaskModalOpen(false)}>
          <div className="modal-card glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Schedule a New Study Target</h3>
              <button className="close-btn" onClick={() => setIsAddTaskModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="modal-form">
              <div className="form-group">
                <label>Task Title / Target</label>
                <input
                  type="text"
                  placeholder="e.g. Solve 5 Income Tax Practical Problems"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Subject Tag</label>
                  <select 
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="custom-select"
                  >
                    <option value="Direct Tax">Direct Tax</option>
                    <option value="Indirect Tax (GST)">Indirect Tax (GST)</option>
                    <option value="Auditing & Ethics">Auditing & Ethics</option>
                    <option value="Financial Reporting">Financial Reporting</option>
                    <option value="Corporate Law">Corporate Law</option>
                    <option value="Advanced Accounting">Advanced Accounting</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label>Priority</label>
                  <select 
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="custom-select"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group flex-1">
                  <label>Estimated Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="secondary-glass-btn" onClick={() => setIsAddTaskModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-glow-btn">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCalendar;

