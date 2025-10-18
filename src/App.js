/**
 * Helping Hand - Hand Gesture Recognition App
 * Recognizes ASL letters (A, I, L, V, Y) and sends to Arduino robot
 */

import React, { useEffect, useState } from 'react';
import './App.css';
import { useHandTracking } from './hooks/useHandTracking';
import { useWebSerial } from './hooks/useWebSerial';
import { useLearningWorkflow } from './hooks/useLearningWorkflow';
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
    changeTarget,
    isCorrect,
    metrics,
    initialize
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

  // Learning workflow hook
  const {
    workflowState,
    selectedLetter,
    successProgress,
    startWorkflow,
    retry
  } = useLearningWorkflow(sendLetter, isCorrect);

  // When the selected letter in the workflow changes, update the hand-tracking target
  useEffect(() => {
    if (selectedLetter && changeTarget) {
      changeTarget(selectedLetter);
    }
  }, [selectedLetter, changeTarget]);

  // Initialize camera and hand tracking on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Combine errors
  useEffect(() => {
    const combinedError = trackingError || serialError;
    setError(combinedError);
  }, [trackingError, serialError]);

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
            {isSerialConnected ? '🔌 Connected to Robot Arm' : '🔗 Connect to Robot Arm'}
          </button>
        </div>
      </div>

      {/* Main content area */}
      <main className="app-main-new">
        <div className="main-grid">
          {/* Large center display */}
          <div className="center-section">
            <CenterDisplay
              workflowState={workflowState}
              selectedLetter={selectedLetter}
              successProgress={successProgress}
              onRetry={retry}
            />
          </div>

          {/* Right sidebar with letter buttons */}
          <div className="letter-sidebar">
            <h3 className="sidebar-title">Select a Letter</h3>
            {availableLetters.map(letter => (
              <LetterButton
                key={letter}
                letter={letter}
                isActive={selectedLetter === letter}
                isCorrect={false}
                onClick={() => startWorkflow(letter)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Bottom description */}
      <footer className="description-bar">
        <p>
          {selectedLetter 
            ? `Learning the "${selectedLetter}" sign!`
            : 'Select a letter to start leaning!'}
        </p>
      </footer>
    </div>
  );
}

export default App;
