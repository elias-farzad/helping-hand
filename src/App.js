/**
 * Helping Hand - Hand Gesture Recognition App
 * Recognizes ASL letters (A, I, L, V, Y) and sends to Arduino robot
 */

import React, { useEffect, useState } from 'react';
import './App.css';
import { useHandTracking } from './hooks/useHandTracking';
import { useWebSerial } from './hooks/useWebSerial';
import { VideoCanvas } from './components/VideoCanvas';
import { ControlPanel } from './components/ControlPanel';
import { StatusDisplay } from './components/StatusDisplay';
import { DebugPanel } from './components/DebugPanel';
import { ErrorBanner } from './components/ErrorBanner';

function App() {
  const [error, setError] = useState(null);

  // Hand tracking hook
  const {
    videoRef,
    canvasRef,
    isInitialized,
    error: trackingError,
    currentPrediction,
    targetLetter,
    confirmationCount,
    confirmFramesRequired,
    isCorrect,
    metrics,
    initialize,
    changeTarget,
    markSent,
    needsToSend
  } = useHandTracking();

  // Web Serial hook
  const {
    isConnected: isSerialConnected,
    isSupported: isSerialSupported,
    lastSent,
    error: serialError,
    connect: connectSerial,
    disconnect: disconnectSerial,
    sendLetter
  } = useWebSerial();

  // Initialize camera and hand tracking on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Send letter to robot when gesture is confirmed
  useEffect(() => {
    if (needsToSend()) {
      sendLetter(targetLetter);
      markSent();
    }
  }, [needsToSend, sendLetter, targetLetter, markSent]);

  // Combine errors
  useEffect(() => {
    const combinedError = trackingError || serialError;
    setError(combinedError);
  }, [trackingError, serialError]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="hand-icon">👋</span>
          Helping Hand
        </h1>
        <p className="app-subtitle">Hand Gesture Recognition for ASL Letters</p>
      </header>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <main className="app-main">
        <div className="app-content">
          <div className="top-section">
            <div className="video-section">
              <VideoCanvas videoRef={videoRef} canvasRef={canvasRef} />
            </div>

            <div className="control-section">
              <StatusDisplay
                currentPrediction={currentPrediction}
                targetLetter={targetLetter}
                confirmationCount={confirmationCount}
                confirmFramesRequired={confirmFramesRequired}
                isCorrect={isCorrect}
              />

              <ControlPanel
                targetLetter={targetLetter}
                onTargetChange={changeTarget}
                isSerialConnected={isSerialConnected}
                isSerialSupported={isSerialSupported}
                onSerialConnect={connectSerial}
                onSerialDisconnect={disconnectSerial}
                lastSentLetter={lastSent}
              />
            </div>
          </div>

          <div className="debug-section">
            <DebugPanel
              metrics={metrics}
              currentPrediction={currentPrediction}
              targetLetter={targetLetter}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Position your hand in view of the camera to detect gestures</p>
        <p className="footer-hint">
          Connect to Arduino via USB to control your robot
        </p>
      </footer>
    </div>
  );
}

export default App;
