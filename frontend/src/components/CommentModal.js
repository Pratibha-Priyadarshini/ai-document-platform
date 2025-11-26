import React, { useState } from 'react';

function CommentModal({ isOpen, onClose, onSubmit, sectionTitle }) {
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#1a202c'
          }}>
            💬 Add Comment
          </h3>
          <p style={{ 
            color: '#718096',
            fontSize: '14px'
          }}>
            Share your thoughts about: <strong>{sectionTitle}</strong>
          </p>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter your comment here..."
          autoFocus
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '12px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '15px',
            fontFamily: 'inherit',
            resize: 'vertical',
            marginBottom: '20px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />

        <div style={{ 
          display: 'flex', 
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              border: '2px solid #e2e8f0',
              background: 'white',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              color: '#4a5568',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#f7fafc';
              e.target.style.borderColor = '#cbd5e0';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'white';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!comment.trim()}
            style={{
              padding: '10px 24px',
              border: 'none',
              background: comment.trim() ? '#667eea' : '#cbd5e0',
              color: 'white',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: comment.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              if (comment.trim()) {
                e.target.style.background = '#5568d3';
              }
            }}
            onMouseOut={(e) => {
              if (comment.trim()) {
                e.target.style.background = '#667eea';
              }
            }}
          >
            Submit Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
