/**
 * CenterDisplay Component
 * Large display area showing instructions or hand gesture images
 * Updated to support workflow states
 */

import React from 'react';
import './CenterDisplay.css';

export function CenterDisplay({ 
  workflowState,
  selectedLetter, 
  successProgress,
  onRetry
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
    A: "🤜",
    I: "🤙",
    L: "👌",
    V: "✌️",
    Y: "🤙"
  };

  // Idle state - no letter selected
  if (workflowState === 'idle') {
    return (
      <div className="center-display">
        <div className="welcome-message">
          <h2>👋 Click on a letter and learn!</h2>
          <p>Select a letter from the right to see how to make the hand sign</p>
        </div>
      </div>
    );
  }

  // Demo signing state
  if (workflowState === 'demo_signing') {
    return (
      <div className="center-display">
        <div className="display-content">
          <div className="letter-display">
            <div className="letter-image">
              {letterImages[selectedLetter]}
            </div>
            <h2 className="workflow-title">Watch the robot demonstration</h2>
            <p className="workflow-subtitle">The robot is signing letter "{selectedLetter}"</p>
          </div>
        </div>
      </div>
    );
  }

  // Demo resetting state
  if (workflowState === 'demo_resetting') {
    return (
      <div className="center-display">
        <div className="display-content">
          <div className="letter-display">
            <div className="letter-image">🤖</div>
            <h2 className="workflow-title">Robot is resetting...</h2>
            <p className="workflow-subtitle">Get ready to practice!</p>
          </div>
        </div>
      </div>
    );
  }

  // User practice state
  if (workflowState === 'user_practice') {
    return (
      <div className="center-display">
        <div className="display-content">
          <div className="letter-display">
            <div className="letter-image">
              {letterImages[selectedLetter]}
            </div>
            <h2 className="workflow-title">Your turn!</h2>
            <p className="letter-description">{letterDescriptions[selectedLetter]}</p>
          </div>

          <div className="status-message practicing">
            <div className="progress-info">
              <span>Make the "{selectedLetter}" sign and hold it...</span>
              <div className="success-progress-bar">
                <div 
                  className="success-progress-fill"
                  style={{ width: `${successProgress}%` }}
                />
              </div>
              <span className="progress-text">
                {successProgress > 0 ? `Hold it! ${Math.floor(successProgress)}%` : 'Waiting for correct sign...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (workflowState === 'success') {
    return (
      <div className="center-display">
        <div className="display-content">
          <div className="letter-display">
            <div className="letter-image success-icon">🎉</div>
            <h2 className="workflow-title success-title">Perfect! You got it!</h2>
            <p className="workflow-subtitle">
              You successfully signed letter "{selectedLetter}"
            </p>
          </div>
          <div className="status-message success">
            <span className="status-icon">✓</span>
            <span>Great job!</span>
          </div>
        </div>
      </div>
    );
  }

  // Timeout state
  if (workflowState === 'timeout') {
    return (
      <div className="center-display">
        <div className="display-content">
          <div className="letter-display">
            <div className="letter-image">⏱️</div>
            <h2 className="workflow-title">Need more practice?</h2>
            <p className="workflow-subtitle">
              Click the button below to watch the robot demonstrate letter "{selectedLetter}" again
            </p>
          </div>
          <button className="retry-button" onClick={onRetry}>
            🔄 Watch Demo Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
