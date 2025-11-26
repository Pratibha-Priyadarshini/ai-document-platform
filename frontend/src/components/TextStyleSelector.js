import React from 'react';

const fontFamilies = [
  { id: 'arial', name: 'Arial', style: 'Arial, sans-serif' },
  { id: 'helvetica', name: 'Helvetica', style: 'Helvetica, sans-serif' },
  { id: 'georgia', name: 'Georgia', style: 'Georgia, serif' },
  { id: 'times', name: 'Times New Roman', style: 'Times New Roman, serif' },
  { id: 'courier', name: 'Courier', style: 'Courier New, monospace' },
  { id: 'verdana', name: 'Verdana', style: 'Verdana, sans-serif' }
];

const alignments = [
  { id: 'left', name: 'Left', icon: '⬅️' },
  { id: 'center', name: 'Center', icon: '↔️' },
  { id: 'right', name: 'Right', icon: '➡️' }
];

const imageAlignments = [
  { id: 'top', name: 'Image Top', icon: '🖼️⬆️', description: 'Image above text' },
  { id: 'bottom', name: 'Image Bottom', icon: '🖼️⬇️', description: 'Image below text' },
  { id: 'left', name: 'Image Left', icon: '🖼️⬅️', description: 'Image on left side' },
  { id: 'right', name: 'Image Right', icon: '🖼️➡️', description: 'Image on right side' }
];

function TextStyleSelector({ textStyle, onStyleChange }) {
  return (
    <div className="text-style-selector">
      <h3 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>
        Customize Text Style
      </h3>
      <p style={{ marginBottom: '32px', color: '#718096', fontSize: '16px' }}>
        Choose font and alignment for your presentation
      </p>

      {/* Font Family */}
      <div className="style-section">
        <label className="style-label">Font Family</label>
        <div className="style-options">
          {fontFamilies.map((font) => (
            <button
              key={font.id}
              className={`style-option ${textStyle.fontFamily === font.id ? 'selected' : ''}`}
              onClick={() => onStyleChange({ ...textStyle, fontFamily: font.id })}
              style={{ fontFamily: font.style }}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>

      {/* Text Alignment */}
      <div className="style-section">
        <label className="style-label">Text Alignment</label>
        <div className="style-options">
          {alignments.map((align) => (
            <button
              key={align.id}
              className={`style-option icon-option ${textStyle.alignment === align.id ? 'selected' : ''}`}
              onClick={() => onStyleChange({ ...textStyle, alignment: align.id })}
            >
              <span className="option-icon">{align.icon}</span>
              <span>{align.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Image Alignment */}
      <div className="style-section">
        <label className="style-label">Text to Image Alignment</label>
        <p style={{ fontSize: '14px', color: '#718096', marginBottom: '16px' }}>
          Choose how images are positioned relative to text
        </p>
        <div className="style-options">
          {imageAlignments.map((imgAlign) => (
            <button
              key={imgAlign.id}
              className={`style-option icon-option ${textStyle.imageAlignment === imgAlign.id ? 'selected' : ''}`}
              onClick={() => onStyleChange({ ...textStyle, imageAlignment: imgAlign.id })}
              title={imgAlign.description}
            >
              <span className="option-icon">{imgAlign.icon}</span>
              <span>{imgAlign.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="style-preview">
        <label className="style-label">Preview</label>
        <div 
          className="preview-box"
          style={{
            fontFamily: fontFamilies.find(f => f.id === textStyle.fontFamily)?.style,
            fontSize: '14pt',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '2px solid #e0e0e0'
          }}
        >
          <h4 style={{ 
            textAlign: textStyle.alignment,
            marginBottom: '15px',
            fontSize: '18pt',
            fontWeight: 'bold'
          }}>
            Slide Title Example
          </h4>
          
          {/* Image and Text Layout Preview */}
          <div style={{
            display: 'flex',
            flexDirection: textStyle.imageAlignment === 'top' ? 'column' : 
                          textStyle.imageAlignment === 'bottom' ? 'column-reverse' :
                          'row',
            gap: '15px',
            alignItems: textStyle.imageAlignment === 'top' || textStyle.imageAlignment === 'bottom' ? 'center' : 'flex-start'
          }}>
            {/* Image Placeholder */}
            <div style={{
              width: textStyle.imageAlignment === 'top' || textStyle.imageAlignment === 'bottom' ? '200px' : '120px',
              height: textStyle.imageAlignment === 'top' || textStyle.imageAlignment === 'bottom' ? '150px' : '100px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12pt',
              flexShrink: 0,
              order: textStyle.imageAlignment === 'right' ? 2 : 1
            }}>
              🖼️ Image
            </div>
            
            {/* Text Content */}
            <div style={{ 
              flex: 1,
              textAlign: textStyle.alignment,
              order: textStyle.imageAlignment === 'right' ? 1 : 2
            }}>
              <p style={{ margin: '0 0 8px 0', lineHeight: '1.6' }}>
                • This is how your text will appear
              </p>
              <p style={{ margin: '0 0 8px 0', lineHeight: '1.6' }}>
                • Content aligned {textStyle.alignment}
              </p>
              <p style={{ margin: '0', lineHeight: '1.6' }}>
                • Image positioned {textStyle.imageAlignment}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextStyleSelector;
