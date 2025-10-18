/**
 * VideoCanvas Component
 * Displays video feed and hand landmark overlay
 */

import React from 'react';
import './VideoCanvas.css';

export function VideoCanvas({ videoRef, canvasRef }) {
  return (
    <div className="video-container">
      <video
        ref={videoRef}
        className="video-feed"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="video-canvas"
      />
    </div>
  );
}
