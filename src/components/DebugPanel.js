/**
 * DebugPanel Component
 * Shows detailed metrics for debugging and tuning
 */

import React, { useState } from 'react';
import './DebugPanel.css';

export function DebugPanel({ metrics, currentPrediction, targetLetter }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!metrics) {
    return null;
  }

  const { fingers, distances, angles, shapes } = metrics;

  return (
    <div className="debug-panel">
      <button
        className="debug-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '▼' : '▶'} Debug Info
      </button>

      {isOpen && (
        <div className="debug-content">
          <div className="debug-section">
            <h3>Prediction</h3>
            <div className="debug-row">
              <span>Current:</span>
              <span className="debug-value">{currentPrediction}</span>
            </div>
            <div className="debug-row">
              <span>Target:</span>
              <span className="debug-value">{targetLetter}</span>
            </div>
          </div>

          <div className="debug-section">
            <h3>Fingers</h3>
            <div className="debug-row">
              <span>Thumb:</span>
              <span className="debug-value">{fingers.thumb ? '✓' : '✗'}</span>
            </div>
            <div className="debug-row">
              <span>Index:</span>
              <span className="debug-value">{fingers.index ? '✓' : '✗'}</span>
            </div>
            <div className="debug-row">
              <span>Middle:</span>
              <span className="debug-value">{fingers.middle ? '✓' : '✗'}</span>
            </div>
            <div className="debug-row">
              <span>Ring:</span>
              <span className="debug-value">{fingers.ring ? '✓' : '✗'}</span>
            </div>
            <div className="debug-row">
              <span>Pinky:</span>
              <span className="debug-value">{fingers.pinky ? '✓' : '✗'}</span>
            </div>
          </div>

          <div className="debug-section">
            <h3>Distances (normalized)</h3>
            <div className="debug-row">
              <span>Thumb → Index MCP:</span>
              <span className="debug-value">{distances.thumbToIndexMCP.toFixed(3)}</span>
            </div>
            <div className="debug-row">
              <span>Index ↔ Middle Tips:</span>
              <span className="debug-value">{distances.indexToMiddleTips.toFixed(3)}</span>
            </div>
            <div className="debug-row">
              <span>Thumb Spread:</span>
              <span className="debug-value">{distances.thumbSpread.toFixed(3)}</span>
            </div>
            <div className="debug-row">
              <span>Thumb ↔ Pinky:</span>
              <span className="debug-value">{distances.thumbToPinkyTip.toFixed(3)}</span>
            </div>
          </div>

          <div className="debug-section">
            <h3>Angles</h3>
            <div className="debug-row">
              <span>Index ↔ Thumb:</span>
              <span className="debug-value">{angles.indexThumb.toFixed(1)}°</span>
            </div>
            <div className="debug-row">
              <span>Index ↔ Middle:</span>
              <span className="debug-value">{angles.indexMiddle.toFixed(1)}°</span>
            </div>
            <div className="debug-row">
              <span>Index PIP:</span>
              <span className="debug-value">{angles.indexPIP.toFixed(1)}°</span>
            </div>
          </div>

          <div className="debug-section">
            <h3>Hand Shapes</h3>
            <div className="debug-row">
              <span>All Four Down:</span>
              <span className="debug-value">{shapes.allFourDown ? '✓' : '✗'}</span>
            </div>
            <div className="debug-row">
              <span>Pinky Only:</span>
              <span className="debug-value">{shapes.pinkyUpOnly ? '✓' : '✗'}</span>
            </div>
            <div className="debug-row">
              <span>L Shape:</span>
              <span className="debug-value">{shapes.lShape ? '✓' : '✗'}</span>
            </div>
            <div className="debug-row">
              <span>V Shape:</span>
              <span className="debug-value">{shapes.twoUpIndexMiddle ? '✓' : '✗'}</span>
            </div>
            <div className="debug-row">
              <span>Y Shape:</span>
              <span className="debug-value">{shapes.yShape ? '✓' : '✗'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
