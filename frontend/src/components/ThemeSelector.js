import React from 'react';
import { pptDesignThemes } from '../data/pptThemes';
import { wordDesignThemes } from '../data/wordThemes';

function ThemeSelector({ selectedTheme, onSelectTheme, documentType = 'pptx' }) {
  // Select themes based on document type
  const allThemes = documentType === 'docx' ? wordDesignThemes : pptDesignThemes;
  
  // Group themes by type
  const microsoftThemes = allThemes.filter(t => t.type === 'microsoft');
  const customThemes = allThemes.filter(t => t.type === 'custom');
  
  // For Word documents, only show Microsoft themes
  const showCustomThemes = documentType !== 'docx' && customThemes.length > 0;
  
  return (
    <div className="theme-selector">
      <h3 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>
        Choose Your Design Theme
      </h3>
      <p style={{ marginBottom: '32px', color: '#718096', fontSize: '16px' }}>
        Select a professional Microsoft {documentType === 'docx' ? 'Word' : 'PowerPoint'} theme
      </p>
      
      {/* Microsoft Office Themes */}
      <div style={{ marginBottom: showCustomThemes ? '40px' : '0' }}>
        <h4 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#0078D4' }}>
          🎨 Microsoft Office Themes
        </h4>
        <div className="theme-grid">
          {microsoftThemes.map((theme) => (
            <div
              key={theme.id}
              className={`theme-card ${selectedTheme?.id === theme.id ? 'selected' : ''}`}
              onClick={() => onSelectTheme(theme)}
            >
              {/* Visual Preview */}
              <div className="theme-preview" style={{ background: theme.gradient }}>
                <div className="theme-preview-content">
                  <div className="preview-title-bar" style={{ background: 'rgba(255,255,255,0.9)' }}>
                    <div className="preview-title-text" style={{ background: theme.preview.primary }}></div>
                  </div>
                  <div className="preview-content-area">
                    <div className="preview-text-line" style={{ background: 'rgba(255,255,255,0.7)' }}></div>
                    <div className="preview-text-line short" style={{ background: 'rgba(255,255,255,0.5)' }}></div>
                    <div className="preview-text-line" style={{ background: 'rgba(255,255,255,0.6)' }}></div>
                  </div>
                </div>
              </div>

              {/* Theme Info */}
              <div className="theme-info">
                <h4>{theme.name}</h4>
                <p>{theme.description}</p>
                
                {/* Color Palette */}
                <div className="theme-colors">
                  <div 
                    className="theme-color" 
                    style={{ background: theme.preview.primary }}
                    title="Primary"
                  ></div>
                  <div 
                    className="theme-color" 
                    style={{ background: theme.preview.secondary }}
                    title="Secondary"
                  ></div>
                  <div 
                    className="theme-color" 
                    style={{ background: theme.preview.accent }}
                    title="Accent"
                  ></div>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedTheme?.id === theme.id && (
                <div className="theme-selected-badge">
                  <span>✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Custom Themes - Only show for PowerPoint */}
      {showCustomThemes && (
        <div>
          <h4 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#667eea' }}>
            ✨ Custom Themes
          </h4>
          <div className="theme-grid">
            {customThemes.map((theme) => (
            <div
              key={theme.id}
              className={`theme-card ${selectedTheme?.id === theme.id ? 'selected' : ''}`}
              onClick={() => onSelectTheme(theme)}
            >
              {/* Visual Preview */}
              <div className="theme-preview" style={{ background: theme.gradient }}>
                <div className="theme-preview-content">
                  <div className="preview-title-bar" style={{ background: 'rgba(255,255,255,0.9)' }}>
                    <div className="preview-title-text" style={{ background: theme.preview.primary }}></div>
                  </div>
                  <div className="preview-content-area">
                    <div className="preview-text-line" style={{ background: 'rgba(255,255,255,0.7)' }}></div>
                    <div className="preview-text-line short" style={{ background: 'rgba(255,255,255,0.5)' }}></div>
                    <div className="preview-text-line" style={{ background: 'rgba(255,255,255,0.6)' }}></div>
                  </div>
                </div>
              </div>

              {/* Theme Info */}
              <div className="theme-info">
                <h4>{theme.name}</h4>
                <p>{theme.description}</p>
                
                {/* Color Palette */}
                <div className="theme-colors">
                  <div 
                    className="theme-color" 
                    style={{ background: theme.preview.primary }}
                    title="Primary"
                  ></div>
                  <div 
                    className="theme-color" 
                    style={{ background: theme.preview.secondary }}
                    title="Secondary"
                  ></div>
                  <div 
                    className="theme-color" 
                    style={{ background: theme.preview.accent }}
                    title="Accent"
                  ></div>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedTheme?.id === theme.id && (
                <div className="theme-selected-badge">
                  <span>✓</span>
                </div>
              )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeSelector;
