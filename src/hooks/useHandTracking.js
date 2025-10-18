/**
 * Hand Tracking Hook using MediaPipe Hands
 * Manages camera, hand detection, and gesture classification
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { classifyGesture, getGestureMetrics, resetClassifierState } from '../utils/handClassifier';

const SMOOTH_WINDOW = 5; // Frames to smooth predictions
const CONFIRM_FRAMES = 1; // Consecutive frames needed for confirmation

/**
 * Get majority prediction from history
 * @param {Array} history - Array of recent predictions
 * @returns {string} Most common prediction
 */
function getMajorityPrediction(history) {
  const counts = {};
  for (const pred of history) {
    counts[pred] = (counts[pred] || 0) + 1;
  }
  
  let maxCount = 0;
  let majority = '?';
  for (const [pred, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      majority = pred;
    }
  }
  
  return majority;
}

/**
 * Custom hook for hand tracking and gesture recognition
 * @returns {Object} Hand tracking state and control functions
 */
export function useHandTracking() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);
  const historyRef = useRef([]);
  const streakRef = useRef(0);
  const sentRef = useRef(false);

  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [currentPrediction, setCurrentPrediction] = useState('?');
  const [targetLetter, setTargetLetter] = useState('A');
  const [confirmationCount, setConfirmationCount] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [landmarks, setLandmarks] = useState(null);

  /**
   * Handle MediaPipe results
   */
  const handleResults = useCallback((results) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Ensure canvas matches video dimensions
    if (canvas.width !== results.image.width) {
      canvas.width = results.image.width;
      canvas.height = results.image.height;
    }

    // Draw video frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    // Process hand landmarks
    let prediction = '?';
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const handLandmarks = results.multiHandLandmarks[0];
      setLandmarks(handLandmarks);

      // Classify gesture
      prediction = classifyGesture(handLandmarks);
      
      // Get metrics for debugging
      const gestureMetrics = getGestureMetrics(handLandmarks);
      setMetrics(gestureMetrics);

      // Draw hand landmarks
      drawHandLandmarks(ctx, handLandmarks);
    } else {
      setLandmarks(null);
      setMetrics(null);
    }

    // Update prediction history
    historyRef.current.push(prediction);
    if (historyRef.current.length > SMOOTH_WINDOW) {
      historyRef.current.shift();
    }

    // Get smoothed prediction
    const smoothedPrediction = getMajorityPrediction(historyRef.current);
    setCurrentPrediction(smoothedPrediction);

    // Check if matches target
    if (smoothedPrediction === targetLetter) {
      streakRef.current++;
      setConfirmationCount(Math.min(streakRef.current, CONFIRM_FRAMES));
      
      if (streakRef.current >= CONFIRM_FRAMES) {
        setIsCorrect(true);
      }
    } else {
      streakRef.current = 0;
      sentRef.current = false;
      setConfirmationCount(0);
      setIsCorrect(false);
    }
  }, [targetLetter]);

  /**
   * Draw hand landmarks on canvas
   */
  const drawHandLandmarks = (ctx, landmarks) => {
    // Draw connections
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17] // Palm
    ];

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    
    for (const [start, end] of connections) {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];
      
      ctx.beginPath();
      ctx.moveTo(startPoint.x * ctx.canvas.width, startPoint.y * ctx.canvas.height);
      ctx.lineTo(endPoint.x * ctx.canvas.width, endPoint.y * ctx.canvas.height);
      ctx.stroke();
    }

    // Draw landmarks
    ctx.fillStyle = '#111';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    
    for (const landmark of landmarks) {
      const x = landmark.x * ctx.canvas.width;
      const y = landmark.y * ctx.canvas.height;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  };

  /**
   * Initialize MediaPipe and camera
   */
  const initialize = useCallback(async () => {
    try {
      setError(null);

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 960, height: 540 }
      });

      const video = videoRef.current;
      if (!video) throw new Error('Video element not ready');

      video.srcObject = stream;

      // Initialize MediaPipe Hands
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
      });

      hands.onResults(handleResults);
      handsRef.current = hands;

      // Initialize camera
      const camera = new Camera(video, {
        onFrame: async () => {
          await hands.send({ image: video });
        },
        width: 960,
        height: 540
      });

      await camera.start();
      cameraRef.current = camera;

      setIsInitialized(true);
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Camera access denied or not available. Please allow camera access.');
      setIsInitialized(false);
    }
  }, [handleResults]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  /**
   * Change target letter
   */
  const changeTarget = useCallback((newTarget) => {
    setTargetLetter(newTarget);
    streakRef.current = 0;
    sentRef.current = false;
    setConfirmationCount(0);
    setIsCorrect(false);
    resetClassifierState();
  }, []);

  /**
   * Mark that we've sent this success
   */
  const markSent = useCallback(() => {
    sentRef.current = true;
  }, []);

  /**
   * Check if we need to send
   */
  const needsToSend = () => {
    return isCorrect && !sentRef.current;
  };

  return {
    videoRef,
    canvasRef,
    isInitialized,
    error,
    currentPrediction,
    targetLetter,
    confirmationCount,
    confirmFramesRequired: CONFIRM_FRAMES,
    isCorrect,
    metrics,
    landmarks,
    initialize,
    changeTarget,
    markSent,
    needsToSend
  };
}
