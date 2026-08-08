import React, { useState, useEffect } from 'react';
import { X, Map, BookOpen, Library, CheckCircle2, Circle, ArrowRight, Download, ExternalLink, ShieldCheck, Calculator, FileText } from 'lucide-react';

const FeatureHubModal = ({ isOpen, onClose, initialTab = 'roadmap', activeStage = 'Inter' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;


  const roadmapData = {
    Foundation: [
      { step: 1, title: 'Principles & Practice of Accounting', desc: 'Cover journal entries, trial balance, final accounts & Partnership.', status: 'completed' },
      { step: 2, title: 'Business Laws & Business Correspondence', desc: 'Indian Contract Act, Sale of Goods Act & Companies Act.', status: 'in-progress' },
      { step: 3, title: 'Business Mathematics, Logical Reasoning & Stats', desc: 'Ratios, Annuities, Permutations, Probability & Index numbers.', status: 'upcoming' },
      { step: 4, title: 'Business Economics & Commercial Knowledge', desc: 'Demand & Supply, Price Determination & Macro Economic Concepts.', status: 'upcoming' }
    ],
    Inter: [
      { step: 1, title: 'Group 1: Advanced Accounting', desc: 'Ind AS compliance, consolidation of financial statements, branch accounts.', status: 'completed' },
      { step: 2, title: 'Group 1: Corporate & Other Laws', desc: 'Companies Act 2013 deep-dive, LLP Act & Foreign Exchange Management.', status: 'in-progress' },
      { step: 3, title: 'Group 1: Taxation (Direct & Indirect)', desc: 'Income Tax provisions, GST computation & Input Tax Credit.', status: 'in-progress' },
      { step: 4, title: 'Group 2: Cost & Management Accounting', desc: 'Process costing, standard costing, budgetary control & marginal costing.', status: 'upcoming' },
      { step: 5, title: 'Group 2: Auditing & Ethics', desc: 'SA Standards, Audit risk assessment, internal controls & code of ethics.', status: 'upcoming' },
      { step: 6, title: 'Group 2: Financial Management & Strategic Management', desc: 'Capital budgeting, ratio analysis, SWOT & competitive strategy.', status: 'upcoming' }
    ],
    Final: [
      { step: 1, title: 'Financial Reporting (FR)', desc: 'Comprehensive Ind AS, Valuation, Business Combinations.', status: 'in-progress' },
      { step: 2, title: 'Advanced Financial Management (AFM)', desc: 'Portfolio management, Forex risk, Derivatives, Valuation.', status: 'upcoming' },
      { step: 3, title: 'Advanced Auditing, Assurance & Professional Ethics', desc: 'Audit of Banks, NBFCs, Insurance, Standard on Quality Control.', status: 'upcoming' },
      { step: 4, title: 'Direct Tax Laws & International Taxation', desc: 'Assessment procedures, Transfer Pricing, DTAA provisions.', status: 'upcoming' },
      { step: 5, title: 'Indirect Tax Laws (IDT)', desc: 'Customs duty, Foreign Trade Policy & In-depth GST rules.', status: 'upcoming' }
    ]
  };

  const syllabusData = {
    Foundation: ['Accounting (100 Marks)', 'Business Law (100 Marks)', 'Quantitative Aptitude (100 Marks)', 'Business Economics (100 Marks)'],
    Inter: [
      'Paper 1: Advanced Accounting (100 Marks)',
      'Paper 2: Corporate & Other Laws (100 Marks)',
      'Paper 3: Taxation - Income Tax & GST (100 Marks)',
      'Paper 4: Cost & Management Accounting (100 Marks)',
      'Paper 5: Auditing & Ethics (100 Marks)',
      'Paper 6: Financial Management & Strategic Management (100 Marks)'
    ],
    Final: [
      'Paper 1: Financial Reporting (100 Marks)',
      'Paper 2: Advanced Financial Management (100 Marks)',
      'Paper 3: Advanced Auditing & Professional Ethics (100 Marks)',
      'Paper 4: Direct Tax Laws & International Tax (100 Marks)',
      'Paper 5: Indirect Tax Laws (100 Marks)',
      'Paper 6: Integrated Business Solutions (100 Marks Case Study)'
    ]
  };

  const materialsData = [
    { title: 'ICAI Official Study Module 2026', type: 'PDF Document', size: '24.5 MB', tag: 'Official' },
    { title: 'GST & Direct Taxation Ready Reckoner', type: 'Reference PDF', size: '12.8 MB', tag: 'High Priority' },
    { title: 'Standard Auditing (SA 200-700) Summary Notes', type: 'Revision Sheet', size: '5.2 MB', tag: 'Revision' },
    { title: 'Ind AS Fast Track Cheat Sheet & Formulas', type: 'Cheat Sheet', size: '3.1 MB', tag: 'Formula' },
    { title: 'Past 5 Years Solved Question Papers & RTPs', type: 'Archive Pack', size: '45.0 MB', tag: 'Exam Prep' }
  ];

  return (
    <div className="feature-modal-overlay" onClick={onClose}>
      <div className="feature-modal-card glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="feature-modal-header">
          <div className="feature-modal-tabs">
            <button 
              className={`feature-modal-tab ${activeTab === 'roadmap' ? 'active' : ''}`}
              onClick={() => setActiveTab('roadmap')}
            >
              <Map size={16} />
              <span>Exam Roadmap</span>
            </button>
            <button 
              className={`feature-modal-tab ${activeTab === 'syllabus' ? 'active' : ''}`}
              onClick={() => setActiveTab('syllabus')}
            >
              <BookOpen size={16} />
              <span>Syllabus Breakdown</span>
            </button>
            <button 
              className={`feature-modal-tab ${activeTab === 'materials' ? 'active' : ''}`}
              onClick={() => setActiveTab('materials')}
            >
              <Library size={16} />
              <span>Study Repository</span>
            </button>
          </div>

          <button className="feature-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="feature-modal-body custom-scrollbar">
          {activeTab === 'roadmap' && (
            <div className="tab-content-roadmap">
              <div className="content-meta-bar">
                <span className="stage-tag">{activeStage} Track</span>
                <span className="info-text">Follow this structured preparation path to crack your CA exams.</span>
              </div>
              <div className="roadmap-timeline">
                {(roadmapData[activeStage] || roadmapData['Inter']).map((item) => (
                  <div key={item.step} className={`timeline-card ${item.status}`}>
                    <div className="timeline-status-icon">
                      {item.status === 'completed' ? (
                        <CheckCircle2 size={20} className="icon-completed" />
                      ) : item.status === 'in-progress' ? (
                        <div className="pulse-ring" />
                      ) : (
                        <Circle size={18} className="icon-upcoming" />
                      )}
                    </div>
                    <div className="timeline-info">
                      <div className="timeline-title-row">
                        <span className="step-number">Step {item.step}</span>
                        <h4 className="step-title">{item.title}</h4>
                      </div>
                      <p className="step-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div className="tab-content-syllabus">
              <div className="content-meta-bar">
                <span className="stage-tag">{activeStage} Curriculum</span>
                <span className="info-text">ICAI prescribed papers and weightage breakdown for 2026.</span>
              </div>
              <div className="syllabus-grid">
                {(syllabusData[activeStage] || syllabusData['Inter']).map((paper, idx) => (
                  <div key={idx} className="syllabus-card glass-panel">
                    <div className="syllabus-paper-badge">0{idx + 1}</div>
                    <div className="syllabus-paper-content">
                      <h5>{paper}</h5>
                      <span className="syllabus-subtext">Click AI chat to query any chapter in this paper</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="tab-content-materials">
              <div className="content-meta-bar">
                <span className="stage-tag">Resource Center</span>
                <span className="info-text">Upload or download reference modules to query with AI OCR.</span>
              </div>
              <div className="materials-list">
                {materialsData.map((mat, idx) => (
                  <div key={idx} className="material-item-card glass-panel">
                    <div className="material-icon">
                      <FileText size={22} style={{ color: 'var(--accent-cyan)' }} />
                    </div>
                    <div className="material-details">
                      <h6>{mat.title}</h6>
                      <div className="material-meta">
                        <span>{mat.type}</span> • <span>{mat.size}</span>
                      </div>
                    </div>
                    <span className="material-tag">{mat.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureHubModal;
