import React, { useState, useEffect } from 'react';

function WordStyleSelector({ textStyle, onStyleChange }) {
  const [previewText] = useState("This is a sample paragraph showing how your text will appear in the document. The quick brown fox jumps over the lazy dog.");
  const [, forceUpdate] = useState();
  
  // Force re-render when theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      forceUpdate({});
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const fontFamilies = [
    { id: 'calibri', name: 'Calibri', style: 'Calibri, sans-serif' },
    { id: 'arial', name: 'Arial', style: 'Arial, sans-serif' },
    { id: 'times', name: 'Times New Roman', style: '"Times New Roman", serif' },
    { id: 'georgia', name: 'Georgia', style: 'Georgia, serif' },
    { id: 'verdana', name: 'Verdana', style: 'Verdana, sans-serif' },
    { id: 'courier', name: 'Courier New', style: '"Courier New", monospace' }
  ];

  const fontSizes = [
    { id: '10', name: '10pt', value: 10 },
    { id: '11', name: '11pt', value: 11 },
    { id: '12', name: '12pt (Default)', value: 12 },
    { id: '14', name: '14pt', value: 14 },
    { id: '16', name: '16pt', value: 16 },
    { id: '18', name: '18pt', value: 18 }
  ];

  const alignments = [
    { id: 'left', name: 'Left', icon: '⬅️' },
    { id: 'center', name: 'Center', icon: '↔️' },
    { id: 'right', name: 'Right', icon: '➡️' },
    { id: 'justify', name: 'Justify', icon: '⬌' }
  ];

  const imageAlignments = [
    { id: 'top', name: 'Top', icon: '⬆️', description: 'Image above text' },
    { id: 'bottom', name: 'Bottom', icon: '⬇️', description: 'Image below text' },
    { id: 'left', name: 'Left', icon: '⬅️', description: 'Image on left side' },
    { id: 'right', name: 'Right', icon: '➡️', description: 'Image on right side' }
  ];

  const handleChange = (key, value) => {
    onStyleChange({ ...textStyle, [key]: value });
  };

  const getPreviewStyle = () => {
    const font = fontFamilies.find(f => f.id === textStyle.fontFamily);
    const isDarkMode = document.body.classList.contains('dark');
    return {
      fontFamily: font?.style || 'Calibri, sans-serif',
      fontSize: `${textStyle.fontSize || 12}pt`,
      textAlign: textStyle.alignment || 'left',
      lineHeight: '1.6',
      padding: '20px',
      border: `2px solid ${isDarkMode ? '#a1887f' : '#81c784'}`,
      borderRadius: '8px',
      backgroundColor: isDarkMode ? '#efebe9' : '#e8f5e9',
      color: isDarkMode ? '#3e2723' : '#1b5e20',
      minHeight: '120px'
    };
  };

  // Check if dark mode is active
  const isDarkMode = document.body.classList.contains('dark');
  
  // Theme-aware colors
  const colors = {
    text: isDarkMode ? '#d7ccc8' : '#1a202c',
    textSecondary: isDarkMode ? '#d7ccc8' : '#718096',
    textTertiary: isDarkMode ? '#bcaaa4' : '#4a5568',
    border: isDarkMode ? '#a1887f' : '#81c784',
    background: isDarkMode ? '#efebe9' : '#e8f5e9',
    backgroundAlt: isDarkMode ? '#d7ccc8' : '#ffffff',
    buttonBg: isDarkMode ? '#efebe9' : 'white',
    buttonBgSelected: isDarkMode ? '#d7ccc8' : '#c8e6c9',
    buttonBorder: isDarkMode ? '#bcaaa4' : '#c8e6c9',
    buttonBorderSelected: isDarkMode ? '#8d6e63' : '#43a047',
    imagePlaceholder: isDarkMode ? '#bcaaa4' : '#a5d6a7',
    heading: isDarkMode ? '#efebe9' : '#2e7d32'
  };

  return (
    <div className="word-style-selector">
      <h3 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700', color: colors.heading }}>
        Customize Text & Image Style
      </h3>
      <p style={{ marginBottom: '32px', color: colors.textSecondary, fontSize: '16px' }}>
        Choose font, size, alignment, and image placement for your document
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
        {/* Left Column - Text Settings */}
        <div>
          {/* Font Family */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '16px', color: colors.heading }}>
              📝 Font Family
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {fontFamilies.map((font) => (
                <button
                  key={font.id}
                  onClick={() => handleChange('fontFamily', font.id)}
                  className={`style-option ${textStyle.fontFamily === font.id ? 'selected' : ''}`}
                  style={{
                    padding: '12px',
                    border: textStyle.fontFamily === font.id ? `2px solid ${colors.buttonBorderSelected}` : `2px solid ${colors.buttonBorder}`,
                    borderRadius: '8px',
                    background: textStyle.fontFamily === font.id ? colors.buttonBgSelected : colors.buttonBg,
                    color: isDarkMode ? '#3e2723' : '#1a202c',
                    cursor: 'pointer',
                    fontFamily: font.style,
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '16px', color: colors.heading }}>
              📏 Font Size
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {fontSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => handleChange('fontSize', size.value)}
                  className={`style-option ${textStyle.fontSize === size.value ? 'selected' : ''}`}
                  style={{
                    padding: '12px',
                    border: textStyle.fontSize === size.value ? `2px solid ${colors.buttonBorderSelected}` : `2px solid ${colors.buttonBorder}`,
                    borderRadius: '8px',
                    background: textStyle.fontSize === size.value ? colors.buttonBgSelected : colors.buttonBg,
                    color: isDarkMode ? '#3e2723' : '#1a202c',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Text Alignment */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '16px', color: colors.heading }}>
              ↔️ Text Alignment
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {alignments.map((align) => (
                <button
                  key={align.id}
                  onClick={() => handleChange('alignment', align.id)}
                  className={`style-option ${textStyle.alignment === align.id ? 'selected' : ''}`}
                  style={{
                    padding: '12px',
                    border: textStyle.alignment === align.id ? `2px solid ${colors.buttonBorderSelected}` : `2px solid ${colors.buttonBorder}`,
                    borderRadius: '8px',
                    background: textStyle.alignment === align.id ? colors.buttonBgSelected : colors.buttonBg,
                    cursor: 'pointer',
                    fontSize: '20px',
                    transition: 'all 0.2s'
                  }}
                  title={align.name}
                >
                  <div>{align.icon}</div>
                  <div style={{ fontSize: '11px', marginTop: '4px', color: isDarkMode ? '#3e2723' : '#1a202c' }}>{align.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Image Alignment */}
          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '16px', color: colors.heading }}>
              🖼️ Image Placement
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {imageAlignments.map((imgAlign) => (
                <button
                  key={imgAlign.id}
                  onClick={() => handleChange('imageAlignment', imgAlign.id)}
                  className={`style-option ${textStyle.imageAlignment === imgAlign.id ? 'selected' : ''}`}
                  style={{
                    padding: '16px 12px',
                    border: textStyle.imageAlignment === imgAlign.id ? `2px solid ${colors.buttonBorderSelected}` : `2px solid ${colors.buttonBorder}`,
                    borderRadius: '8px',
                    background: textStyle.imageAlignment === imgAlign.id ? colors.buttonBgSelected : colors.buttonBg,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{imgAlign.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: isDarkMode ? '#3e2723' : '#1a202c' }}>{imgAlign.name}</div>
                  <div style={{ fontSize: '11px', color: isDarkMode ? '#5d4037' : '#718096', marginTop: '4px' }}>{imgAlign.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '16px', color: colors.heading }}>
            👁️ Live Preview
          </label>
          <div style={getPreviewStyle()}>
            {previewText}
          </div>

          {/* Image Placement Preview */}
          <div style={{ marginTop: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '14px', color: colors.textSecondary }}>
              Image Layout Preview
            </label>
            <div style={{
              border: `2px solid ${colors.border}`,
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: colors.background,
              minHeight: '200px',
              display: 'flex',
              flexDirection: textStyle.imageAlignment === 'top' ? 'column' : 
                           textStyle.imageAlignment === 'bottom' ? 'column-reverse' :
                           textStyle.imageAlignment === 'left' ? 'row' : 'row-reverse',
              gap: '12px',
              alignItems: textStyle.imageAlignment === 'left' || textStyle.imageAlignment === 'right' ? 'flex-start' : 'stretch'
            }}>
              {/* Image placeholder */}
              <div style={{
                width: textStyle.imageAlignment === 'left' || textStyle.imageAlignment === 'right' ? '40%' : '100%',
                height: textStyle.imageAlignment === 'left' || textStyle.imageAlignment === 'right' ? '120px' : '80px',
                backgroundColor: colors.imagePlaceholder,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: colors.textTertiary,
                flexShrink: 0
              }}>
                📷 Image
              </div>
              {/* Text placeholder */}
              <div style={{
                flex: 1,
                fontSize: '11px',
                lineHeight: '1.4'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '4px', color: isDarkMode ? '#3e2723' : '#1a202c' }}>Section Title</div>
                <div style={{ color: isDarkMode ? '#5d4037' : '#4a5568' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordStyleSelector;
