import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import ThemeToggle from './ThemeToggle';
import SuccessModal from './SuccessModal';
import FeedbackHistory from './FeedbackHistory';
import WordPreview from './WordPreview';
import PPTPreview from './PPTPreview';
import Toast from './Toast';
import CommentModal from './CommentModal';

function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [activeRefinement, setActiveRefinement] = useState({});
  const [refinementPrompts, setRefinementPrompts] = useState({});
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState(null);
  const [commentModal, setCommentModal] = useState({ isOpen: false, sectionId: null, sectionTitle: '' });

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectsAPI.getById(id);
      setProject(response.data);
    } catch (err) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAll = async () => {
    setGenerating(true);
    setError('');

    try {
      await projectsAPI.generateContent(id);
      await fetchProject();
    } catch (err) {
      setError('Failed to generate content');
    } finally {
      setGenerating(false);
    }
  };



  const handleRefine = async (sectionId) => {
    const prompt = refinementPrompts[sectionId];
    if (!prompt || !prompt.trim()) {
      alert('Please enter a refinement prompt');
      return;
    }

    setActiveRefinement({ ...activeRefinement, [sectionId]: true });
    setError('');

    try {
      const response = await projectsAPI.refineContent(id, sectionId, prompt);
      
      // Update the section content locally
      setProject(prev => ({
        ...prev,
        sections: prev.sections.map(s => 
          s.id === sectionId ? { ...s, content: response.data.new_content } : s
        )
      }));
      
      setRefinementPrompts({ ...refinementPrompts, [sectionId]: '' });
    } catch (err) {
      setError('Failed to refine content');
    } finally {
      setActiveRefinement({ ...activeRefinement, [sectionId]: false });
    }
  };

  const handleFeedback = async (sectionId, feedbackType) => {
    try {
      await projectsAPI.submitFeedback(id, sectionId, feedbackType);
      setToast({
        message: feedbackType === 'like' ? 'Thanks for the positive feedback!' : 'Thanks for your feedback!',
        type: feedbackType
      });
      // Refresh project to update feedback history
      await fetchProject();
    } catch (err) {
      setToast({
        message: 'Failed to submit feedback',
        type: 'error'
      });
    }
  };

  const handleCommentClick = (sectionId, sectionTitle) => {
    setCommentModal({ isOpen: true, sectionId, sectionTitle });
  };

  const handleCommentSubmit = async (comment) => {
    try {
      await projectsAPI.submitFeedback(id, commentModal.sectionId, 'comment', comment);
      setToast({
        message: 'Comment saved successfully!',
        type: 'comment'
      });
      // Refresh project to update feedback history
      await fetchProject();
    } catch (err) {
      setToast({
        message: 'Failed to save comment',
        type: 'error'
      });
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      console.log('Starting export for project:', id);
      const response = await projectsAPI.export(id);
      console.log('Export response received:', response);
      
      // Create blob from response data
      const blob = new Blob([response.data], {
        type: project.document_type === 'pptx' 
          ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${project.title}.${project.document_type}`);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      console.log('Export completed successfully');
      setSuccessModal({ 
        isOpen: true, 
        message: `${project.document_type.toUpperCase()} downloaded successfully!` 
      });
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export document: ' + (err.response?.data?.detail || err.message));
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading project...</div>;
  }

  if (!project) {
    return <div className="error-message">Project not found</div>;
  }

  const hasContent = project.sections.some(s => s.content);

  return (
    <div>
      <ThemeToggle />
      <nav className="navbar">
        <h1>DocuMind</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          {hasContent && (
            <button 
              onClick={() => setShowPreview(!showPreview)} 
              className="btn btn-secondary btn-small"
            >
              {showPreview ? '📝 Hide Preview' : '👁️ Show Preview'}
            </button>
          )}
          {hasContent && (
            <button 
              onClick={handleExport} 
              className="btn btn-success btn-small"
              disabled={exporting}
            >
              {exporting ? '⏳ Exporting...' : `📥 Export ${project.document_type.toUpperCase()}`}
            </button>
          )}
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary btn-small">
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="project-info-box">
          <p><strong>Topic:</strong> {project.main_topic}</p>
          <p><strong>Type:</strong> {project.document_type === 'pptx' ? 'PowerPoint Presentation' : 'Word Document'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Document Preview */}
        {showPreview && hasContent && (
          <>
            {project.document_type === 'docx' ? (
              <WordPreview 
                project={project} 
                sections={project.sections}
                metadata={project.metadata_json ? JSON.parse(project.metadata_json) : {}}
              />
            ) : (
              <PPTPreview 
                project={project} 
                sections={project.sections}
                metadata={project.metadata_json ? JSON.parse(project.metadata_json) : {}}
              />
            )}
          </>
        )}

        {!hasContent && (
          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <button 
              onClick={handleGenerateAll} 
              className="btn btn-primary"
              disabled={generating}
              style={{ fontSize: '16px', padding: '15px 30px' }}
            >
              {generating ? '🤖 Generating Content...' : '🚀 Generate All Content'}
            </button>
          </div>
        )}

        <div className="section-list">
          {project.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <div key={section.id} className="section-item">
                <div className="section-header">
                  <h3>{section.order + 1}. {section.title}</h3>
                </div>

                {section.content ? (
                  <>
                    <div className="section-content">
                      {section.content}
                    </div>

                    <div className="section-actions">
                      <button
                        onClick={() => handleFeedback(section.id, 'like')}
                        className="btn btn-success btn-small"
                      >
                        👍 Like
                      </button>
                      <button
                        onClick={() => handleFeedback(section.id, 'dislike')}
                        className="btn btn-danger btn-small"
                      >
                        👎 Dislike
                      </button>
                      <button
                        onClick={() => handleCommentClick(section.id, section.title)}
                        className="btn btn-secondary btn-small"
                      >
                        💬 Comment
                      </button>
                    </div>

                    <div className="refinement-box">
                      <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                        Refine this {project.document_type === 'pptx' ? 'slide' : 'section'}:
                      </label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          type="text"
                          value={refinementPrompts[section.id] || ''}
                          onChange={(e) => setRefinementPrompts({
                            ...refinementPrompts,
                            [section.id]: e.target.value
                          })}
                          placeholder="e.g., Make this more formal, Add bullet points, Shorten to 100 words"
                          style={{ flex: 1 }}
                        />
                        <button
                          onClick={() => handleRefine(section.id)}
                          className="btn btn-primary btn-small"
                          disabled={activeRefinement[section.id]}
                        >
                          {activeRefinement[section.id] ? 'Refining...' : '✨ Refine'}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                    Content not generated yet
                  </div>
                )}
              </div>
            ))}
        </div>

        {hasContent && (
          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <button 
              onClick={handleExport} 
              className="btn btn-success"
              style={{ fontSize: '16px', padding: '15px 30px' }}
              disabled={exporting}
            >
              {exporting ? '⏳ Exporting... Please wait' : `📥 Download ${project.document_type.toUpperCase()}`}
            </button>
          </div>
        )}

        {/* Feedback and History Panel */}
        {hasContent && (
          <FeedbackHistory projectId={id} />
        )}
      </div>

      <SuccessModal
        isOpen={successModal.isOpen}
        message={successModal.message}
        onClose={() => setSuccessModal({ isOpen: false, message: '' })}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Comment Modal */}
      <CommentModal
        isOpen={commentModal.isOpen}
        sectionTitle={commentModal.sectionTitle}
        onClose={() => setCommentModal({ isOpen: false, sectionId: null, sectionTitle: '' })}
        onSubmit={handleCommentSubmit}
      />
    </div>
  );
}

export default ProjectEditor;
