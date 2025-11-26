import React, { useEffect } from 'react';

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      case 'like': return '👍';
      case 'dislike': return '👎';
      case 'comment': return '💬';
      default: return '✅';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      case 'like': return '#10b981';
      case 'dislike': return '#f59e0b';
      case 'comment': return '#8b5cf6';
      default: return '#10b981';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      padding: '16px 24px',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 10000,
      minWidth: '300px',
      animation: 'slideIn 0.3s ease-out',
      borderLeft: `4px solid ${getColor()}`
    }}>
      <span style={{ fontSize: '24px' }}>{getIcon()}</span>
      <span style={{ 
        flex: 1, 
        fontSize: '15px',
        fontWeight: '500',
        color: '#1a202c'
      }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#718096',
          padding: '0',
          lineHeight: '1'
        }}
      >
        ×
      </button>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Toast;
