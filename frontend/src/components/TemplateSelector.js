import React from 'react';
import { pptTemplates, docxTemplates } from '../data/templates';

function TemplateSelector({ documentType, onSelectTemplate, selectedTemplate }) {
  const templates = documentType === 'pptx' ? pptTemplates : docxTemplates;

  return (
    <div className="template-selector">
      <h3 style={{ marginBottom: '20px', color: 'inherit', fontSize: '20px' }}>
        Choose a Template
      </h3>
      <p style={{ marginBottom: '24px', color: '#718096', fontSize: '14px' }}>
        Select a pre-built template or start from scratch
      </p>
      
      <div className="template-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
            onClick={() => onSelectTemplate(template)}
          >
            <div className="template-icon" style={{ background: template.color }}>
              {template.icon}
            </div>
            <div className="template-info">
              <h4>{template.name}</h4>
              <p>{template.description}</p>
              {template.slides && template.slides.length > 0 && (
                <span className="template-count">
                  {template.slides.length} slides
                </span>
              )}
              {template.sections && template.sections.length > 0 && (
                <span className="template-count">
                  {template.sections.length} sections
                </span>
              )}
            </div>
            {selectedTemplate?.id === template.id && (
              <div className="template-checkmark">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemplateSelector;
