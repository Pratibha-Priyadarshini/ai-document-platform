import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';

function FeedbackHistory({ projectId }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [refinements, setRefinements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feedback'); // 'feedback' or 'history'
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchFeedbackData();
  }, [projectId]);

  const fetchFeedbackData = async () => {
    try {
      // Fetch project with all related data
      const response = await projectsAPI.getById(projectId);
      const project = response.data;
      
      // Extract feedbacks and refinements from sections
      const allFeedbacks = [];
      const allRefinements = [];
      
      if (project.sections) {
        project.sections.forEach(section => {
          if (section.feedbacks) {
            section.feedbacks.forEach(fb => {
              allFeedbacks.push({
                ...fb,
                sectionTitle: section.title,
                sectionId: section.id
              });
            });
          }
          if (section.refinements) {
            section.refinements.forEach(ref => {
              allRefinements.push({
                ...ref,
                sectionTitle: section.title,
                sectionId: section.id
              });
            });
          }
        });
      }
      
      // Sort by date (newest first)
      allFeedbacks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      allRefinements.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setFeedbacks(allFeedbacks);
      setRefinements(allRefinements);
    } catch (err) {
      console.error('Failed to fetch feedback data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFeedbackIcon = (type) => {
    switch (type) {
      case 'like': return '👍';
      case 'dislike': return '👎';
      case 'comment': return '💬';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <div className="feedback-history-panel">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="feedback-history-panel">
      <div className="panel-header">
        <h3>📊 Document Activity</h3>
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            💬 Feedback ({feedbacks.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📜 History ({refinements.length})
          </button>
        </div>
      </div>

      <div className="panel-content">
        {activeTab === 'feedback' && (
          <div className="feedback-list">
            {feedbacks.length === 0 ? (
              <div className="empty-state-small">
                <p>No feedback yet</p>
                <small>Use 👍 👎 buttons to provide feedback on sections</small>
              </div>
            ) : (
              feedbacks.map((feedback, index) => (
                <div key={index} className="feedback-item">
                  <div className="feedback-header">
                    <span className="feedback-icon">{getFeedbackIcon(feedback.feedback_type)}</span>
                    <span className="feedback-section">{feedback.sectionTitle}</span>
                    <span className="feedback-date">{formatDate(feedback.created_at)}</span>
                  </div>
                  {feedback.comment && (
                    <div className="feedback-comment">
                      "{feedback.comment}"
                    </div>
                  )}
                  <div className="feedback-type">
                    {feedback.feedback_type === 'like' && 'Positive feedback'}
                    {feedback.feedback_type === 'dislike' && 'Needs improvement'}
                    {feedback.feedback_type === 'comment' && 'Comment added'}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-list">
            {refinements.length === 0 ? (
              <div className="empty-state-small">
                <p>No changes yet</p>
                <small>Content refinements will appear here</small>
              </div>
            ) : (
              refinements.map((refinement, index) => (
                <div key={index} className="history-item">
                  <div className="history-header">
                    <span className="history-icon">✏️</span>
                    <span className="history-section">{refinement.sectionTitle}</span>
                    <span className="history-date">{formatDate(refinement.created_at)}</span>
                  </div>
                  <div className="history-prompt">
                    <strong>Request:</strong> {refinement.prompt}
                  </div>
                  {refinement.previous_content && (
                    <div className="history-diff">
                      <details>
                        <summary>View full changes</summary>
                        <div className="diff-content">
                          <div className="diff-old">
                            <strong>Before:</strong>
                            <p style={{ 
                              whiteSpace: 'pre-wrap', 
                              maxHeight: '300px', 
                              overflowY: 'auto',
                              padding: '10px',
                              background: isDarkMode ? '#4a3a1a' : '#fff3cd',
                              color: isDarkMode ? '#ffd966' : '#856404',
                              border: isDarkMode ? '1px solid #8b7355' : '1px solid #ffc107',
                              borderRadius: '4px',
                              fontSize: '13px',
                              lineHeight: '1.6'
                            }}>
                              {refinement.previous_content}
                            </p>
                          </div>
                          <div className="diff-new">
                            <strong>After:</strong>
                            <p style={{ 
                              whiteSpace: 'pre-wrap', 
                              maxHeight: '300px', 
                              overflowY: 'auto',
                              padding: '10px',
                              background: isDarkMode ? '#1a3a2a' : '#d4edda',
                              color: isDarkMode ? '#90ee90' : '#155724',
                              border: isDarkMode ? '1px solid #4a7c59' : '1px solid #28a745',
                              borderRadius: '4px',
                              fontSize: '13px',
                              lineHeight: '1.6'
                            }}>
                              {refinement.new_content}
                            </p>
                          </div>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackHistory;
