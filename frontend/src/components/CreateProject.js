import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI, aiAPI } from '../services/api';
import ThemeToggle from './ThemeToggle';
import ThemeSelector from './ThemeSelector';
import WordStyleSelector from './WordStyleSelector';

function CreateProject() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('docx');
  const [mainTopic, setMainTopic] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [textStyle, setTextStyle] = useState({
    fontFamily: 'calibri',
    fontSize: 12,
    alignment: 'left',
    imageAlignment: 'top'
  });
  const [sections, setSections] = useState([{ title: '', description: '', order: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddSection = () => {
    setSections([...sections, { title: '', description: '', order: sections.length }]);
  };

  const handleRemoveSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    newSections[index].order = index;
    setSections(newSections);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'));
    if (dragIndex === dropIndex) return;

    const newSections = [...sections];
    const draggedSection = newSections[dragIndex];
    newSections.splice(dragIndex, 1);
    newSections.splice(dropIndex, 0, draggedSection);
    
    // Update order
    newSections.forEach((section, idx) => {
      section.order = idx;
    });
    
    setSections(newSections);
  };

  const handleAISuggest = async () => {
    if (!mainTopic) {
      setError('Please enter a main topic first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await aiAPI.generateTemplate(
        documentType,
        mainTopic,
        documentType === 'pptx' ? 8 : 5
      );
      
      const aiSections = response.data.sections.map((section, index) => ({
        title: section.title,
        description: section.description,
        order: index
      }));
      
      setSections(aiSections);
    } catch (err) {
      setError('Failed to generate AI suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (sections.some(s => !s.title.trim())) {
      setError('All sections must have a title');
      return;
    }

    setLoading(true);

    try {
      const projectData = {
        title,
        document_type: documentType,
        main_topic: mainTopic,
        sections: sections.map((s, i) => ({ 
          title: s.title, 
          description: s.description || '', 
          order: i 
        })),
        metadata: {
          theme: selectedTheme,
          textStyle: textStyle
        }
      };

      const response = await projectsAPI.create(projectData);
      navigate(`/project/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ThemeToggle />
      <nav className="navbar">
        <h1>DocuMind</h1>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary btn-small">
          Back to Dashboard
        </button>
      </nav>

      <div className="container">
        {error && <div className="error-message">{error}</div>}

        {step === 1 && (
          <div className="auth-box" style={{ maxWidth: '700px', margin: '40px auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '36px', marginBottom: '12px' }}>Create Your Document</h2>
              <p style={{ color: '#718096', fontSize: '16px' }}>
                Let AI help you create professional documents in minutes
              </p>
            </div>
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              // Redirect to PPT flow if PowerPoint is selected
              if (documentType === 'pptx') {
                navigate('/create-ppt', { state: { topic: mainTopic, title: title } });
              } else {
                // Go directly to theme selection for Word documents
                setStep(2);
              }
            }}>
              <div className="form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g., Q4 Market Analysis"
                />
              </div>

              <div className="form-group">
                <label>Document Type</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  required
                >
                  <option value="docx">Microsoft Word (.docx)</option>
                  <option value="pptx">Microsoft PowerPoint (.pptx)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Main Topic</label>
                <textarea
                  value={mainTopic}
                  onChange={(e) => setMainTopic(e.target.value)}
                  required
                  placeholder="e.g., A comprehensive market analysis of the electric vehicle industry in 2025"
                  rows="4"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Next: Choose Theme →
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="auth-box" style={{ maxWidth: '1200px', margin: '40px auto' }}>
            <ThemeSelector
              selectedTheme={selectedTheme}
              onSelectTheme={setSelectedTheme}
              documentType={documentType}
            />

            <div className="button-group" style={{ marginTop: '32px' }}>
              <button 
                onClick={() => setStep(1)} 
                className="btn btn-secondary"
              >
                Back
              </button>
              <button 
                onClick={() => {
                  if (!selectedTheme) {
                    setError('Please select a theme');
                    return;
                  }
                  setError('');
                  setStep(2.5); // Go to style selection
                }}
                className="btn btn-primary"
              >
                Next: Customize Style
              </button>
            </div>
          </div>
        )}

        {step === 2.5 && (
          <div className="auth-box" style={{ maxWidth: '1200px', margin: '40px auto' }}>
            <WordStyleSelector
              textStyle={textStyle}
              onStyleChange={setTextStyle}
            />

            <div className="button-group" style={{ marginTop: '32px' }}>
              <button 
                onClick={() => setStep(2)} 
                className="btn btn-secondary"
              >
                Back
              </button>
              <button 
                onClick={() => {
                  setError('');
                  setStep(3);
                }}
                className="btn btn-primary"
              >
                Next: Configure Structure
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="auth-box" style={{ maxWidth: '900px', margin: '40px auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>
                Configure {documentType === 'pptx' ? 'Slides' : 'Sections'}
              </h2>
              <p style={{ color: '#718096', fontSize: '15px' }}>
                Define your document structure or let AI suggest one
              </p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <button 
                onClick={handleAISuggest} 
                className="btn btn-success"
                disabled={loading}
                style={{ marginRight: '10px' }}
              >
                {loading ? 'Generating...' : '✨ AI-Suggest Outline'}
              </button>
              <button 
                onClick={handleAddSection} 
                className="btn btn-secondary"
              >
                + Add {documentType === 'pptx' ? 'Slide' : 'Section'}
              </button>
            </div>

            <div className="outline-builder">
              {sections.map((section, index) => (
                <div 
                  key={index} 
                  className="outline-item-container"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  style={{ cursor: 'move' }}
                >
                  <div className="outline-item">
                    <span style={{ fontWeight: 'bold', minWidth: '30px', cursor: 'grab' }}>
                      ⋮⋮ {index + 1}.
                    </span>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                        className="outline-input"
                        placeholder={`${documentType === 'pptx' ? 'Slide' : 'Section'} title`}
                        required
                        style={{ marginBottom: '8px' }}
                      />
                      <textarea
                        value={section.description || ''}
                        onChange={(e) => handleSectionChange(index, 'description', e.target.value)}
                        className="outline-description"
                        placeholder="Brief description (1-2 lines) - optional"
                        rows="2"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '2px solid #c8e6c9',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          minHeight: '60px'
                        }}
                      />
                    </div>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(index)}
                        className="btn btn-danger btn-small"
                        style={{ marginLeft: '10px', alignSelf: 'flex-start' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="button-group">
              <button 
                onClick={() => setStep(2)} 
                className="btn btn-secondary"
              >
                Back
              </button>
              <button 
                onClick={handleSubmit} 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateProject;
