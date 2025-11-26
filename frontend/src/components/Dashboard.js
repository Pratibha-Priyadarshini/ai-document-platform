import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import ThemeToggle from './ThemeToggle';
import ConfirmModal from './ConfirmModal';

function Dashboard({ onLogout }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, projectId: null, projectTitle: '' });
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserNameFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email = payload.sub || '';
        // Extract username from email (before @)
        let username = email.split('@')[0];
        
        // Remove numbers from the end
        username = username.replace(/\d+$/, '');
        
        // Split by common separators (., _, -)
        const nameParts = username.split(/[._-]/);
        
        // Get first part
        let firstName = nameParts[0];
        
        // If name is too long (likely concatenated), try to extract first name
        if (firstName.length > 12) {
          // Look for common Indian name patterns or take reasonable first name length
          // Most first names are 4-10 characters
          const possibleFirstName = firstName.substring(0, 8);
          firstName = possibleFirstName;
        }
        
        // Capitalize first letter, lowercase rest
        return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      }
    } catch (err) {
      console.error('Error parsing token:', err);
    }
    return 'there';
  };

  useEffect(() => {
    setUserName(getUserNameFromToken());
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = (projectId, projectTitle, e) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, projectId, projectTitle });
  };

  const confirmDelete = async () => {
    try {
      await projectsAPI.delete(deleteModal.projectId);
      setProjects(projects.filter(p => p.id !== deleteModal.projectId));
      setDeleteModal({ isOpen: false, projectId: null, projectTitle: '' });
    } catch (err) {
      alert('Failed to delete project');
      setDeleteModal({ isOpen: false, projectId: null, projectTitle: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, projectId: null, projectTitle: '' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <ThemeToggle />
      <nav className="navbar">
        <h1>DocuMind</h1>
        <button onClick={onLogout} className="btn btn-secondary btn-small">
          Logout
        </button>
      </nav>

      <div className="container">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-content">
            <div className="welcome-text">
              <h1 className="welcome-greeting">
                {getGreeting()}, {userName}! 👋
              </h1>
              <p className="welcome-subtitle">
                Ready to create something amazing? Let AI help you craft professional documents in minutes.
              </p>
            </div>
            <button 
              onClick={() => navigate('/create-project')} 
              className="btn btn-primary welcome-cta"
            >
              ✨ Create New Document
            </button>
          </div>
        </div>

        {/* Documents Section */}
        <div className="projects-header">
          <div>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: 'inherit',
              marginBottom: '8px'
            }}>Your Documents</h2>
            <p style={{ color: '#718096', fontSize: '15px' }}>
              {projects.length === 0 ? 'No documents yet' : `${projects.length} document${projects.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading documents...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <h3>No documents yet</h3>
            <p>Click the "✨ Create New Document" button above to create your first AI-powered document</p>
          </div>
        ) : (
          <>
            {/* PowerPoint Presentations Section */}
            {projects.filter(p => p.document_type === 'pptx').length > 0 && (
              <div className="document-section">
                <div className="section-title">
                  <span className="section-icon">📊</span>
                  <h3>PowerPoint Presentations</h3>
                  <span className="section-count">
                    {projects.filter(p => p.document_type === 'pptx').length}
                  </span>
                </div>
                <div className="projects-grid">
                  {projects
                    .filter(project => project.document_type === 'pptx')
                    .map(project => (
                      <div 
                        key={project.id} 
                        className="project-card"
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        <h3>{project.title}</h3>
                        <p>{project.main_topic}</p>
                        <p style={{ fontSize: '12px', color: '#999' }}>
                          Created: {formatDate(project.created_at)}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className={`badge badge-${project.document_type}`}>
                            {project.document_type.toUpperCase()}
                          </span>
                          <button
                            onClick={(e) => handleDeleteProject(project.id, project.title, e)}
                            className="btn btn-danger btn-small"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Word Documents Section */}
            {projects.filter(p => p.document_type === 'docx').length > 0 && (
              <div className="document-section">
                <div className="section-title">
                  <span className="section-icon">📄</span>
                  <h3>Word Documents</h3>
                  <span className="section-count">
                    {projects.filter(p => p.document_type === 'docx').length}
                  </span>
                </div>
                <div className="projects-grid">
                  {projects
                    .filter(project => project.document_type === 'docx')
                    .map(project => (
                      <div 
                        key={project.id} 
                        className="project-card"
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        <h3>{project.title}</h3>
                        <p>{project.main_topic}</p>
                        <p style={{ fontSize: '12px', color: '#999' }}>
                          Created: {formatDate(project.created_at)}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className={`badge badge-${project.document_type}`}>
                            {project.document_type.toUpperCase()}
                          </span>
                          <button
                            onClick={(e) => handleDeleteProject(project.id, project.title, e)}
                            className="btn btn-danger btn-small"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteModal.projectTitle}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default Dashboard;
