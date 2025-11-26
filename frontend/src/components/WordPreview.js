import React from 'react';

function WordPreview({ project, sections, metadata }) {
  if (!project || !sections || sections.length === 0) {
    return null;
  }

  const textStyle = metadata?.textStyle || {};
  const theme = metadata?.theme || {};
  const themePreview = theme.preview || {};
  
  const fontFamily = textStyle.fontFamily || 'calibri';
  const fontSize = textStyle.fontSize || 12;
  const alignment = textStyle.alignment || 'left';
  const imageAlignment = textStyle.imageAlignment || 'top';
  
  const primaryColor = themePreview.primary || '#0078D4';
  const secondaryColor = themePreview.secondary || '#106EBE';
  const accentColor = themePreview.accent || '#50E6FF';

  // Helper function to ensure color has good contrast on white background
  const ensureContrast = (color) => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // If too light (luminance > 0.7), darken it
    if (luminance > 0.7) {
      const darkenFactor = 0.5;
      const newR = Math.floor(r * darkenFactor);
      const newG = Math.floor(g * darkenFactor);
      const newB = Math.floor(b * darkenFactor);
      return `rgb(${newR}, ${newG}, ${newB})`;
    }
    
    return color;
  };

  const fontMap = {
    'calibri': 'Calibri, sans-serif',
    'arial': 'Arial, sans-serif',
    'times': 'Times New Roman, serif',
    'georgia': 'Georgia, serif',
    'courier': 'Courier New, monospace',
    'verdana': 'Verdana, sans-serif'
  };

  const previewStyle = {
    background: 'white',
    padding: '60px 80px',
    margin: '20px auto',
    maxWidth: '850px',
    minHeight: '1100px',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    fontFamily: fontMap[fontFamily] || 'Calibri, sans-serif',
    fontSize: `${fontSize}pt`,
    textAlign: alignment,
    color: '#1a1a1a'  // Slightly softer than pure black
  };

  const titleStyle = {
    fontSize: '28pt',
    fontWeight: 'bold',
    color: ensureContrast(primaryColor),
    textAlign: 'center',
    marginBottom: '10px'
  };

  const subtitleStyle = {
    fontSize: '14pt',
    fontStyle: 'italic',
    color: ensureContrast(secondaryColor),
    textAlign: 'center',
    marginBottom: '30px'
  };

  const headingStyle = {
    fontSize: '18pt',
    fontWeight: 'bold',
    color: ensureContrast(accentColor),
    marginTop: '30px',
    marginBottom: '15px'
  };

  const imagePlaceholderStyle = {
    width: '100%',
    maxWidth: '500px',
    height: '300px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '14pt',
    borderRadius: '4px',
    margin: '15px 0'
  };

  const renderSectionContent = (section) => {
    const content = section.content || 'Content will be generated here...';
    const lines = content.split('\n').filter(line => line.trim());

    const contentDiv = (
      <div style={{ flex: 1 }}>
        {lines.map((line, idx) => (
          <p key={idx} style={{ 
            marginBottom: '10px', 
            lineHeight: '1.6',
            color: '#1a1a1a'  // Ensure body text is always dark and readable
          }}>
            {line}
          </p>
        ))}
      </div>
    );

    const imageDiv = (
      <div style={imagePlaceholderStyle}>
        <span>🖼️ Image: {section.title}</span>
      </div>
    );

    // Render based on image alignment
    if (imageAlignment === 'top') {
      return (
        <>
          {imageDiv}
          {contentDiv}
        </>
      );
    } else if (imageAlignment === 'bottom') {
      return (
        <>
          {contentDiv}
          {imageDiv}
        </>
      );
    } else if (imageAlignment === 'left') {
      return (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ ...imagePlaceholderStyle, width: '280px', height: '200px', flex: 'none' }}>
            <span style={{ fontSize: '10pt' }}>🖼️ {section.title}</span>
          </div>
          {contentDiv}
        </div>
      );
    } else if (imageAlignment === 'right') {
      return (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {contentDiv}
          <div style={{ ...imagePlaceholderStyle, width: '280px', height: '200px', flex: 'none' }}>
            <span style={{ fontSize: '10pt' }}>🖼️ {section.title}</span>
          </div>
        </div>
      );
    }

    return contentDiv;
  };

  return (
    <div style={{ background: '#f5f5f5', padding: '20px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#666', fontSize: '16px', fontWeight: 'normal' }}>
          📄 Document Preview
        </h3>
        <p style={{ color: '#999', fontSize: '12px' }}>
          This is how your Word document will look with images and chosen alignment
        </p>
      </div>
      
      <div style={previewStyle}>
        {/* Title with background */}
        <div style={{
          background: ensureContrast(primaryColor),
          padding: '15px 20px',
          textAlign: 'center',
          marginBottom: '0'
        }}>
          <h1 style={{
            ...titleStyle,
            color: 'white',
            margin: 0
          }}>{project.title}</h1>
        </div>
        

        

        
        {/* Separator line */}
        <div style={{
          textAlign: 'center',
          color: ensureContrast(primaryColor),
          fontSize: '8pt',
          marginBottom: '20px'
        }}>
          {'_'.repeat(80)}
        </div>
        
        {/* Sections */}
        {sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div key={section.id} style={{ marginBottom: '40px' }}>
              <div style={{
                background: ensureContrast(accentColor),
                padding: '10px 15px',
                marginBottom: '15px'
              }}>
                <h2 style={{
                  ...headingStyle,
                  color: 'white',
                  margin: 0
                }}>{section.title}</h2>
              </div>
              {renderSectionContent(section)}
            </div>
          ))}
      </div>
    </div>
  );
}

export default WordPreview;
