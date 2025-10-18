import React from 'react';
import './Welcome.css';

export function Welcome({ onStart, onDontShowChange, dontShow }) {
  return (
    <div className="welcome-overlay">
      <div className="welcome-card">
        <h1 className="welcome-title">Helping Hand</h1>
        <p className="welcome-text">
          Learn and practice a few ASL letters!
          Select a letter, watch the demo, then practice the sign in front of your camera.
        </p>

        <div className="welcome-actions">
          <button className="welcome-start" onClick={onStart}>Get Started</button>
          <label className="welcome-dontshow">
            <input
              type="checkbox"
              checked={dontShow}
              onChange={(e) => onDontShowChange(e.target.checked)}
            />
            Don't show this again
          </label>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
