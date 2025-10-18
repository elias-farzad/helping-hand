/**
 * CenterDisplay Component
 * Large display area showing instructions or hand gesture images
 */

import React from 'react';
import './CenterDisplay.css';

export function CenterDisplay({ 
  selectedLetter, 
  isCorrect, 
  confirmationCount, 
  confirmFramesRequired 
}) {
  // Letter descriptions
  const letterDescriptions = {
    A: "Closed fist with thumb alongside index finger",
    I: "Pinky finger up, all others down, thumb folded",
    L: "Index finger and thumb extended at right angle",
    V: "Index and middle fingers up in peace sign",
    Y: "Thumb and pinky extended (shaka/hang loose sign)"
  };

  const letterImages = {
    A: "🤜", // Placeholder - replace with actual image
    I: "🤙",
    L: "👌",
    V: "✌️",
    Y: "🤙"
  };

  if (!selectedLetter) {
    return (
      <div className="center-display">
        <div className="welcome-message">
          <h2>👋 Click on a letter and learn!</h2>
          <p>Select a letter from the right to see how to make the hand sign</p>
        </div>
      </div>
    );
  }

  return (
    <div className="center-display">
      <div className="display-content">
        <div className="letter-display">
          <div className="letter-image">
            {letterImages[selectedLetter]}
          </div>
          <h2 className="letter-title">Letter {selectedLetter}</h2>
          <p className="letter-description">{letterDescriptions[selectedLetter]}</p>
        </div>

        {isCorrect ? (
          <div className="status-message success">
            <span className="status-icon">✓</span>
            <span>Perfect! You got it!</span>
          </div>
        ) : (
          <div className="status-message practicing">
            <div className="progress-info">
              <span>Try making the sign...</span>
              <div className="mini-progress">
                <div 
                  className="mini-progress-fill"
                  style={{ width: `${(confirmationCount / confirmFramesRequired) * 100}%` }}
                />
              </div>
              <span className="progress-text">{confirmationCount} / {confirmFramesRequired}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
