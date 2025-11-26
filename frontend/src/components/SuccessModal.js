import React, { useEffect } from 'react';
import '../SuccessModal.css';

function SuccessModal({ isOpen, message, onClose, autoClose = true }) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  if (!isOpen) return null;

  return (
    <div className="success-overlay" onClick={onClose}>
      <div className="success-content" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">✓</div>
        <div className="success-message">{message}</div>
      </div>
    </div>
  );
}

export default SuccessModal;
