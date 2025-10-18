/**
 * StatusDisplay Component
 * Shows current prediction, confirmation progress, and status
 */

import React from 'react';
import './StatusDisplay.css';

export function StatusDisplay({
  currentPrediction,
  targetLetter,
  confirmationCount,
  confirmFramesRequired,
  isCorrect
}) {
  const progressPercentage = (confirmationCount / confirmFramesRequired) * 100;

  return (
    <div className="status-display">
      <div className="prediction-section">
        <div className="prediction-label">Detected Gesture</div>
        <div className="prediction-value">
          {currentPrediction === '?' ? '—' : currentPrediction}
        </div>
      </div>

      <div className="status-section">
        <div className={`status-indicator ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? (
            <>
              <span className="status-icon">✓</span>
              <span className="status-text">Correct!</span>
            </>
          ) : (
            <>
              <span className="status-icon">✗</span>
              <span className="status-text">Show {targetLetter}</span>
            </>
          )}
        </div>
      </div>

      <div className="confirmation-section">
        <div className="confirmation-label">
          Confirmation: {confirmationCount} / {confirmFramesRequired}
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
