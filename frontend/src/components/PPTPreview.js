import React from 'react';

function PPTPreview({ project, sections, metadata }) {
  if (!project || !sections || sections.length === 0) {
    return null;
  }

  const textStyle = metadata?.textStyle || {};
  const theme = metadata?.theme || {};
  const themePreview = theme.preview || {};
  
  const fontFamily = textStyle.fontFamily || 'arial';
  const alignment = textStyle.alignment || 'left';
  const imageAlignment = textStyle.imageAlignment || 'top';
  
  const primaryColor = themePreview.primary || '#667eea';
  const secondaryColor = themePreview.secondary || '#764ba2';

  const fontMap = {
    'arial': 'Arial, sans-serif',
    'helvetica': 'Helvetica, sans-serif',
    'times': 'Times New Roman, serif',
    'georgia': 'Georgia, serif',
    'courier': 'Courier New, monospace',
    'verdana': 'Verdana, sans-serif'
  };

  const slideStyle = {
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
    padding: '40px',
    margin: '20px auto',
    maxWidth: '960px',
    height: '540px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    fontFamily: fontMap[fontFamily] || 'Arial, sans-serif',
    color: 'white',
    position: 'relative',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column'
  };

  const titleSlideStyle = {
    ...slideStyle,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  };

  const renderSlideContent = (section) => {
    const content = section.content || 'Content will be generated here...';
    const lines = content.split('\n').filter(line => line.trim());

    const textContent = (
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: alignment
      }}>
        {lines.slice(0, 5).map((line, idx) => (
          <p key={idx} style={{ 
            margin: '8px 0',
            fontSize: '16pt',
            lineHeight: '1.4',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            {line}
          </p>
        ))}
      </div>
    );

    const imageBox = (
      <div style={{
        width: imageAlignment === 'top' || imageAlignment === 'bottom' ? '400px' : '250px',
        height: imageAlignment === 'top' || imageAlignment === 'bottom' ? '250px' : '200px',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14pt',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        flexShrink: 0,
        margin: imageAlignment === 'top' || imageAlignment === 'bottom' ? '0 auto' : '0'
      }}>
        🖼️ Image: {section.title}
      </div>
    );

    // Render based on image alignment
    if (imageAlignment === 'top') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
          {imageBox}
          {textContent}
        </div>
      );
    } else if (imageAlignment === 'bottom') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
          {textContent}
          {imageBox}
        </div>
      );
    } else if (imageAlignment === 'left') {
      return (
        <div style={{ display: 'flex', gap: '30px', height: '100%', alignItems: 'center' }}>
          {imageBox}
          {textContent}
        </div>
      );
    } else if (imageAlignment === 'right') {
      return (
        <div style={{ display: 'flex', gap: '30px', height: '100%', alignItems: 'center' }}>
          {textContent}
          {imageBox}
        </div>
      );
    }

    return textContent;
  };

  return (
    <div style={{ background: '#2d3748', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h3 style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: 'normal', marginBottom: '10px' }}>
          📊 PowerPoint Preview
        </h3>
        <p style={{ color: '#a0aec0', fontSize: '14px' }}>
          This is how your presentation will look with images and chosen alignment
        </p>
      </div>

      {/* Title Slide */}
      <div style={titleSlideStyle}>
        <h1 style={{ 
          fontSize: '48pt', 
          fontWeight: 'bold',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          {project.title}
        </h1>
        <p style={{ 
          fontSize: '24pt',
          opacity: 0.9,
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}>
          {project.main_topic}
        </p>
      </div>

      {/* Content Slides */}
      {sections
        .sort((a, b) => a.order - b.order)
        .map((section, index) => (
          <div key={section.id} style={{ ...slideStyle, marginTop: '40px' }}>
            <h2 style={{ 
              fontSize: '32pt',
              fontWeight: 'bold',
              marginBottom: '20px',
              textAlign: alignment,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              {section.title}
            </h2>
            {renderSlideContent(section)}
            
            {/* Slide Number */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '30px',
              fontSize: '14pt',
              opacity: 0.7
            }}>
              {index + 2}
            </div>
          </div>
        ))}
    </div>
  );
}

export default PPTPreview;
