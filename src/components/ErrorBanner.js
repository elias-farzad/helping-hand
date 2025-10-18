/**
 * ErrorBanner Component
 * Displays error messages to the user
 */

import React from 'react';
import './ErrorBanner.css';

export function ErrorBanner({ error, onDismiss }) {
  if (!error) return null;

  return (
    <div className="error-banner">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <span className="error-message">{error}</span>
      </div>
      {onDismiss && (
        <button className="error-dismiss" onClick={onDismiss}>
          ✕
        </button>
      )}
    </div>
  );
}
