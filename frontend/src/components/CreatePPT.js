import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { projectsAPI, aiAPI } from '../services/api';
import ThemeToggle from './ThemeToggle';
import ThemeSelector from './ThemeSelector';
import TextStyleSelector from './TextStyleSelector';

function CreatePPT() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(location.state?.topic ? 2 : 1);
  const [topic, setTopic] = useState(location.state?.topic || '');
  const [title, setTitle] = useState(location.state?.title || '');
  const [selectedDesignTheme, setSelectedDesignTheme] = useState(null);
  const [textStyle, setTextStyle] = useState({
    fontFamily: 'arial',
    fontSize: 'medium',
    alignment: 'left',
    imageAlignment: 'top'
  });
  const [slides, setSlides] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleThemeSelect = (theme) => {
    setSelectedDesignTheme(theme);
  };

  const handleGenerateOutline = async () => {
    setGenerating(true);
    setError('');

    try {
      const response = await aiAPI.generateTemplate('pptx', topic, 8);
      const aiSlides = response.data.sections.map((section, index) => ({
        title: section.title,
        description: section.description,
        order: index
      }));
      setSlides(aiSlides);
      setStep(3);
    } catch (err) {
      setError('Failed to generate outline');
    } finally {
      setGenerating(false);
    }
  };

  const handleCreatePresentation = async () => {
    setGenerating(true);
    setError('');

    try {
      const projectData = {
        title: title || topic,
        document_type: 'pptx',
        main_topic: topic,
        sections: slides.map((s, i) => ({ title: s.title, order: i })),
        // Store theme and style metadata
        metadata: {
          theme: selectedDesignTheme,
          textStyle: textStyle
        }
      };

      const response = await projectsAPI.create(projectData);
      
      // Generate content immediately
      await projectsAPI.generateContent(response.data.id);
      
      navigate(`/project/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create presentation');
    } finally {
      setGenerating(false);
    }
  };

  const handleSlideChange = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const handleAddSlide = () => {
    setSlides([...slides, { title: '', description: '', order: slides.length }]);
  };

  const handleRemoveSlide = (index) => {
    setSlides(slides.filter((_, i) => i !== index));
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

        {/* Step 1: Enter Topic */}
        {step === 1 && (
          <div className="gamma-container">
            <div className="gamma-hero">
              <h1 className="gamma-title">Create a Presentation</h1>
              <p className="gamma-subtitle">
                Describe your presentation topic and let AI do the rest
              </p>
            </div>

            <form onSubmit={handleTopicSubmit} className="gamma-form">
              <div className="gamma-input-group">
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., A pitch deck for a sustainable fashion startup targeting Gen Z consumers"
                  className="gamma-textarea"
                  rows="4"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary gamma-btn">
                Continue →
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Choose Design Theme */}
        {step === 2 && (
          <div className="gamma-container" style={{ maxWidth: '1200px' }}>
            <div className="gamma-hero">
              <h1 className="gamma-title">Choose Your Design</h1>
              <p className="gamma-subtitle">
                Select a visual theme for your presentation
              </p>
            </div>

            <ThemeSelector
              selectedTheme={selectedDesignTheme}
              onSelectTheme={handleThemeSelect}
            />

            <div className="gamma-actions" style={{ marginTop: '40px' }}>
              <button 
                onClick={() => {
                  // If came from CreateProject form, go back there
                  if (location.state?.topic) {
                    navigate('/create-project');
                  } else {
                    setStep(1);
                  }
                }} 
                className="btn btn-secondary"
              >
                ← Back
              </button>
              <button 
                onClick={() => {
                  if (!selectedDesignTheme) {
                    setError('Please select a design theme');
                    return;
                  }
                  setError('');
                  setStep(2.5); // Go to text style selection
                }}
                className="btn btn-primary"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2.5: Text Style Customization */}
        {step === 2.5 && (
          <div className="gamma-container" style={{ maxWidth: '900px' }}>
            <div className="gamma-hero">
              <h1 className="gamma-title">Customize Text Style</h1>
              <p className="gamma-subtitle">
                Choose font, size, and alignment for your slides
              </p>
            </div>

            <TextStyleSelector
              textStyle={textStyle}
              onStyleChange={setTextStyle}
            />

            <div className="gamma-actions" style={{ marginTop: '40px' }}>
              <button 
                onClick={() => setStep(2)} 
                className="btn btn-secondary"
              >
                ← Back
              </button>
              <button 
                onClick={() => setStep(3)}
                className="btn btn-primary"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generate or Customize Outline */}
        {step === 3 && slides.length === 0 && (
          <div className="gamma-container">
            <div className="gamma-hero">
              <h1 className="gamma-title">Create Your Outline</h1>
              <p className="gamma-subtitle">
                Let AI generate slides or start from scratch
              </p>
            </div>

            <div className="gamma-options">
              <div className="gamma-option-card" onClick={handleGenerateOutline}>
                <div className="gamma-option-icon">✨</div>
                <h3>Generate with AI</h3>
                <p>Let AI create slides based on your topic</p>
                {generating && <div className="gamma-loading">Generating...</div>}
              </div>

              <div className="gamma-option-card" onClick={() => setSlides([{ title: '', description: '', order: 0 }])}>
                <div className="gamma-option-icon">✏️</div>
                <h3>Start from Scratch</h3>
                <p>Manually create your slide structure</p>
              </div>
            </div>

            <button 
              onClick={() => {
                setSlides([]);
                setStep(2.5);
              }} 
              className="btn btn-secondary" 
              style={{ marginTop: '20px' }}
            >
              ← Back
            </button>
          </div>
        )}

        {/* Step 4: Review & Customize Outline */}
        {step === 3 && slides.length > 0 && (
          <div className="gamma-container">
            <div className="gamma-hero">
              <h1 className="gamma-title">Review Your Outline</h1>
              <p className="gamma-subtitle">
                {slides.length} slides • Edit or add more slides
              </p>
            </div>

            <div className="gamma-slides-preview">
              {slides.map((slide, index) => (
                <div key={index} className="gamma-slide-card">
                  <div className="gamma-slide-number">{index + 1}</div>
                  <div className="gamma-slide-content">
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => handleSlideChange(index, 'title', e.target.value)}
                      placeholder="Slide title"
                      className="gamma-slide-title-input"
                    />
                    {slide.description && (
                      <p className="gamma-slide-description">{slide.description}</p>
                    )}
                  </div>
                  {slides.length > 1 && (
                    <button
                      onClick={() => handleRemoveSlide(index)}
                      className="gamma-slide-remove"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={handleAddSlide} className="btn btn-secondary gamma-add-slide">
              + Add Slide
            </button>

            <div className="gamma-actions">
              <button 
                onClick={() => {
                  setSlides([]);
                  setStep(3);
                }} 
                className="btn btn-secondary"
              >
                ← Back
              </button>
              <button 
                onClick={handleCreatePresentation} 
                className="btn btn-primary gamma-btn"
                disabled={generating}
              >
                {generating ? 'Creating...' : 'Create Presentation →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePPT;
