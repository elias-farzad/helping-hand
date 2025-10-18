/**
 * Hand Gesture Classifier
 * Classifies hand landmarks into letters: A, I, L, V, Y
 */

import {
  palmWidth,
  normalizedDistance,
  rayAngleDegrees,
  thumbSpreadNormalized,
  fingersUp,
  angleAtPIP,
  isFingerStraight,
  isFingerBent
} from './geometry';

/**
 * Configuration thresholds for gesture classification
 * All distances are normalized by palm width for scale independence
 */
export const THRESHOLDS = {
  // General: thumb considered "out" if horizontal spread exceeds this
  thumbSpread: 0.035,

  // A: fist with thumb outside along index
  A_thumbAwayFromIndexMCP: 0.55,

  // I: pinky up only (others down, thumb folded)
  I_pinkyUpGap: 0.05,

  // L: index up + thumb out; ~right angle; others bent; index straight
  L_requiredAngleMinDeg: 25,
  L_requiredAngleMaxDeg: 100,
  L_minThumbSpread: 0.035,
  L_indexStraightDeg: 150,
  L_otherBentTol: 0.62,

  // V: index & middle up; separate tips & angle
  V_sepMin: 0.24,
  V_angleMinDeg: 16,
  V_hyst: 0.02,

  // Y (shaka): thumb + pinky out
  Y_thumbSpread: 0.035,
  Y_spanMin: 0.35
};

// Hysteresis latch for V gesture
let vLatch = 'V';

/**
 * Reset classifier state (useful when changing target gesture)
 */
export function resetClassifierState() {
  vLatch = 'V';
}

/**
 * Classify hand landmarks into a letter gesture
 * @param {Array} landmarks - Array of 21 hand landmarks
 * @returns {string} Classified letter: 'A', 'I', 'L', 'V', 'Y', or '?'
 */
export function classifyGesture(landmarks) {
  const pw = palmWidth(landmarks);
  const fingers = fingersUp(landmarks, THRESHOLDS.thumbSpread);

  // Core measurements
  const thumbToIndexMCP = normalizedDistance(landmarks, 4, 5, pw);
  const indexToMiddleTips = normalizedDistance(landmarks, 8, 12, pw);
  const thumbToPinkyTip = normalizedDistance(landmarks, 4, 20, pw);

  // Ray vectors for angle calculations
  const indexX = landmarks[8].x - landmarks[5].x;
  const indexY = landmarks[8].y - landmarks[5].y;
  const thumbX = landmarks[4].x - landmarks[2].x;
  const thumbY = landmarks[4].y - landmarks[2].y;
  const middleX = landmarks[12].x - landmarks[9].x;
  const middleY = landmarks[12].y - landmarks[9].y;

  const indexThumbAngle = rayAngleDegrees(indexX, indexY, thumbX, thumbY);
  const indexMiddleAngle = rayAngleDegrees(indexX, indexY, middleX, middleY);

  // Macro hand shapes
  const allFourDown = fingers[1] === 0 && fingers[2] === 0 && fingers[3] === 0 && fingers[4] === 0;
  const pinkyUpOnly = fingers[4] === 1 && fingers[1] === 0 && fingers[2] === 0 && fingers[3] === 0;
  const twoUpIndexMiddle = fingers[1] === 1 && fingers[2] === 1 && fingers[3] === 0 && fingers[4] === 0;
  const lShape = fingers[0] === 1 && fingers[1] === 1 && fingers[2] === 0 && fingers[3] === 0 && fingers[4] === 0;
  const yShape = fingers[0] === 1 && fingers[4] === 1 && fingers[1] === 0 && fingers[2] === 0 && fingers[3] === 0;

  // --- Classify A: fist + thumb outside along index ---
  if (allFourDown && fingers[0] === 1 && thumbToIndexMCP >= THRESHOLDS.A_thumbAwayFromIndexMCP) {
    return 'A';
  }

  // --- Classify I: pinky up only (thumb folded) ---
  if (pinkyUpOnly && fingers[0] === 0) {
    return 'I';
  }

  // --- Classify L: index up + thumb out; right-angle-ish; others bent; index straight ---
  if (lShape) {
    const angleInRange = 
      indexThumbAngle >= THRESHOLDS.L_requiredAngleMinDeg &&
      indexThumbAngle <= THRESHOLDS.L_requiredAngleMaxDeg;
    
    if (angleInRange) {
      return 'L';
    }
  }

  // --- Classify V: index + middle up; separated tips & angle ---
  if (twoUpIndexMiddle) {
    const separationOK = indexToMiddleTips >= THRESHOLDS.V_sepMin;
    const angleOK = indexMiddleAngle >= THRESHOLDS.V_angleMinDeg;
    
    if (separationOK && angleOK) {
      vLatch = 'V';
      return 'V';
    }
    
    // Hysteresis: keep V if close to threshold
    if (vLatch === 'V') {
      const keepV = 
        indexToMiddleTips >= (THRESHOLDS.V_sepMin - THRESHOLDS.V_hyst) ||
        indexMiddleAngle >= THRESHOLDS.V_angleMinDeg - 3;
      
      if (keepV) {
        return 'V';
      }
    }
  }

  // --- Classify Y: thumb + pinky out; others down; span check ---
  if (yShape) {
    const thumbOK = thumbSpreadNormalized(landmarks, pw) > THRESHOLDS.Y_thumbSpread;
    const spanOK = thumbToPinkyTip > THRESHOLDS.Y_spanMin;
    
    if (thumbOK && spanOK) {
      return 'Y';
    }
  }

  return '?';
}

/**
 * Get detailed metrics for debugging
 * @param {Array} landmarks - Array of 21 hand landmarks
 * @returns {Object} Detailed measurements and finger states
 */
export function getGestureMetrics(landmarks) {
  const pw = palmWidth(landmarks);
  const fingers = fingersUp(landmarks, THRESHOLDS.thumbSpread);

  const indexX = landmarks[8].x - landmarks[5].x;
  const indexY = landmarks[8].y - landmarks[5].y;
  const thumbX = landmarks[4].x - landmarks[2].x;
  const thumbY = landmarks[4].y - landmarks[2].y;
  const middleX = landmarks[12].x - landmarks[9].x;
  const middleY = landmarks[12].y - landmarks[9].y;

  return {
    palmWidth: pw,
    fingers: {
      thumb: fingers[0],
      index: fingers[1],
      middle: fingers[2],
      ring: fingers[3],
      pinky: fingers[4]
    },
    distances: {
      thumbToIndexMCP: normalizedDistance(landmarks, 4, 5, pw),
      indexToMiddleTips: normalizedDistance(landmarks, 8, 12, pw),
      thumbToPinkyTip: normalizedDistance(landmarks, 4, 20, pw),
      thumbSpread: thumbSpreadNormalized(landmarks, pw)
    },
    angles: {
      indexThumb: rayAngleDegrees(indexX, indexY, thumbX, thumbY),
      indexMiddle: rayAngleDegrees(indexX, indexY, middleX, middleY),
      indexPIP: angleAtPIP(landmarks, 8, 7, 6)
    },
    shapes: {
      allFourDown: fingers[1] === 0 && fingers[2] === 0 && fingers[3] === 0 && fingers[4] === 0,
      pinkyUpOnly: fingers[4] === 1 && fingers[1] === 0 && fingers[2] === 0 && fingers[3] === 0,
      twoUpIndexMiddle: fingers[1] === 1 && fingers[2] === 1 && fingers[3] === 0 && fingers[4] === 0,
      lShape: fingers[0] === 1 && fingers[1] === 1 && fingers[2] === 0 && fingers[3] === 0 && fingers[4] === 0,
      yShape: fingers[0] === 1 && fingers[4] === 1 && fingers[1] === 0 && fingers[2] === 0 && fingers[3] === 0
    }
  };
}
