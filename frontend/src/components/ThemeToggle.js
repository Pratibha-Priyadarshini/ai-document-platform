import React from 'react';
import { useTheme } from '../ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <span className="theme-icon">🌙</span>
      ) : (
        <span className="theme-icon">🌿</span>
      )}
    </button>
  );
}

export default ThemeToggle;
