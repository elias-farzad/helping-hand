/**
 * LetterButton Component
 * Individual letter selection button for the sidebar
 */

import React from 'react';
import './LetterButton.css';

export function LetterButton({ letter, isActive, isCorrect, onClick }) {
  return (
    <button
      className={`letter-button ${isActive ? 'active' : ''} ${isCorrect ? 'correct' : ''}`}
      onClick={onClick}
    >
      <span className="letter-text">{letter}</span>
      {isCorrect && <span className="check-mark">✓</span>}
    </button>
  );
}
