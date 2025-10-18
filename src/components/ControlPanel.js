/**
 * ControlPanel Component
 * Contains target selection and robot connection controls
 */

import React from 'react';
import './ControlPanel.css';

export function ControlPanel({
  targetLetter,
  onTargetChange,
  isSerialConnected,
  isSerialSupported,
  onSerialConnect,
  onSerialDisconnect,
  lastSentLetter
}) {
  const handleConnect = () => {
    if (isSerialConnected) {
      onSerialDisconnect();
    } else {
      onSerialConnect();
    }
  };

  return (
    <div className="control-panel">
      <div className="control-group">
        <label htmlFor="target-select" className="control-label">
          Target Letter
        </label>
        <select
          id="target-select"
          className="target-select"
          value={targetLetter}
          onChange={(e) => onTargetChange(e.target.value)}
        >
          <option value="A">A - Fist with thumb out</option>
          <option value="I">I - Pinky up only</option>
          <option value="L">L - Index and thumb</option>
          <option value="V">V - Index and middle</option>
          <option value="Y">Y - Shaka (thumb and pinky)</option>
        </select>
      </div>

      <div className="control-group">
        <div className="serial-info">
          <span className="control-label">Robot Connection</span>
          <span className={`serial-status ${isSerialConnected ? 'connected' : 'disconnected'}`}>
            {isSerialConnected ? '● Connected' : '○ Not connected'}
          </span>
        </div>
        <button
          className={`connect-btn ${isSerialConnected ? 'connected' : ''}`}
          onClick={handleConnect}
          disabled={!isSerialSupported}
        >
          {isSerialConnected ? 'Disconnect Robot' : 'Connect Robot'}
        </button>
        {!isSerialSupported && (
          <p className="warning-text">
            Web Serial not supported. Use Chrome or Edge.
          </p>
        )}
      </div>

      {lastSentLetter && (
        <div className="control-group">
          <span className="control-label">Last Sent</span>
          <span className="last-sent">{lastSentLetter}</span>
        </div>
      )}
    </div>
  );
}
