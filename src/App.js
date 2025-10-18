/**
 * Helping Hand - Hand Gesture Recognition App
 * Recognizes ASL letters (A, I, L, V, Y) and sends to Arduino robot
 */

import React, { useEffect, useState } from 'react';
import './App.css';
import { useHandTracking } from './hooks/useHandTracking';
import { useWebSerial } from './hooks/useWebSerial';
import { VideoCanvas } from './components/VideoCanvas';
import { LetterButton } from './components/LetterButton';
import { CenterDisplay } from './components/CenterDisplay';
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

  // Handle letter selection
  const handleLetterClick = (letter) => {
    changeTarget(letter);
  };

  const availableLetters = ['A', 'I', 'L', 'V', 'Y'];

  return (
    <div className="app">
      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      {/* Top bar with camera and connect button */}
      <div className="top-bar">
        <div className="camera-corner">
          <VideoCanvas videoRef={videoRef} canvasRef={canvasRef} />
        </div>

        <div className="connect-corner">
          <button
            className={`connect-btn-large ${isSerialConnected ? 'connected' : ''}`}
            onClick={isSerialConnected ? disconnectSerial : connectSerial}
            disabled={!isSerialSupported}
          >
            {isSerialConnected ? '🔌 Connected to Robot' : '🔗 Connect to Arduino'}
          </button>
        </div>
      </div>

      {/* Main content area */}
      <main className="app-main-new">
        <div className="main-grid">
          {/* Large center display */}
          <div className="center-section">
            <CenterDisplay
              selectedLetter={targetLetter}
              isCorrect={isCorrect}
              confirmationCount={confirmationCount}
              confirmFramesRequired={confirmFramesRequired}
            />
          </div>

          {/* Right sidebar with letter buttons */}
          <div className="letter-sidebar">
            <h3 className="sidebar-title">Select a Letter</h3>
            {availableLetters.map(letter => (
              <LetterButton
                key={letter}
                letter={letter}
                isActive={targetLetter === letter}
                isCorrect={false}
                onClick={() => handleLetterClick(letter)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Bottom description */}
      <footer className="description-bar">
        <p>
          {targetLetter 
            ? `Make the "${targetLetter}" sign with your hand in front of the camera to practice!`
            : 'Select a letter above to start learning ASL hand signs'}
        </p>
      </footer>
    </div>
  );
}

export default App;
