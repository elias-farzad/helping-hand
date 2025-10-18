/**
 * Geometry Utilities for Hand Landmark Analysis
 * All distances are normalized by palm width for scale independence
 */

/**
 * Calculate Euclidean distance between two points
 * @param {Object} a - Point with x, y properties
 * @param {Object} b - Point with x, y properties
 * @returns {number} Distance between points
 */
export function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

/**
 * Calculate palm width (MCP index to MCP pinky)
 * @param {Array} landmarks - Array of 21 hand landmarks
 * @returns {number} Palm width (minimum 1e-6 to avoid division by zero)
 */
export function palmWidth(landmarks) {
  return Math.max(distance(landmarks[5], landmarks[17]), 1e-6);
}

/**
 * Calculate normalized distance (scale-invariant)
 * @param {Array} landmarks - Array of 21 hand landmarks
 * @param {number} i - Index of first landmark
 * @param {number} j - Index of second landmark
 * @param {number} pw - Palm width for normalization
 * @returns {number} Normalized distance
 */
export function normalizedDistance(landmarks, i, j, pw) {
  return distance(landmarks[i], landmarks[j]) / pw;
}

/**
 * Calculate cosine similarity between two vectors
 * @param {number} ax - X component of first vector
 * @param {number} ay - Y component of first vector
 * @param {number} bx - X component of second vector
 * @param {number} by - Y component of second vector
 * @returns {number} Cosine similarity (-1 to 1)
 */
export function cosineSimilarity(ax, ay, bx, by) {
  const dot = ax * bx + ay * by;
  const magA = Math.hypot(ax, ay) || 1e-6;
  const magB = Math.hypot(bx, by) || 1e-6;
  return dot / (magA * magB);
}

/**
 * Calculate angle in degrees between two rays
 * @param {number} ax - X component of first ray
 * @param {number} ay - Y component of first ray
 * @param {number} bx - X component of second ray
 * @param {number} by - Y component of second ray
 * @returns {number} Angle in degrees
 */
export function rayAngleDegrees(ax, ay, bx, by) {
  const cos = Math.max(-1, Math.min(1, cosineSimilarity(ax, ay, bx, by)));
  return (Math.acos(cos) * 180) / Math.PI;
}

/**
 * Calculate normalized thumb spread (tip to base)
 * @param {Array} landmarks - Array of 21 hand landmarks
 * @param {number} pw - Palm width for normalization
 * @returns {number} Normalized thumb spread
 */
export function thumbSpreadNormalized(landmarks, pw) {
  return normalizedDistance(landmarks, 4, 2, pw);
}

/**
 * Determine which fingers are extended
 * @param {Array} landmarks - Array of 21 hand landmarks
 * @param {number} thumbSpreadThreshold - Threshold for thumb extension
 * @returns {Array} [thumb, index, middle, ring, pinky] - 1 if up, 0 if down
 */
export function fingersUp(landmarks, thumbSpreadThreshold = 0.035) {
  const upIndex = landmarks[8].y < landmarks[6].y ? 1 : 0;
  const upMiddle = landmarks[12].y < landmarks[10].y ? 1 : 0;
  const upRing = landmarks[16].y < landmarks[14].y ? 1 : 0;
  const upPinky = landmarks[20].y < landmarks[18].y ? 1 : 0;
  const thumbOut = Math.abs(landmarks[4].x - landmarks[2].x) > thumbSpreadThreshold ? 1 : 0;
  
  return [thumbOut, upIndex, upMiddle, upRing, upPinky];
}

/**
 * Calculate angle at PIP joint
 * @param {Array} landmarks - Array of 21 hand landmarks
 * @param {number} tip - Tip landmark index
 * @param {number} dip - DIP landmark index
 * @param {number} pip - PIP landmark index
 * @returns {number} Angle in degrees
 */
export function angleAtPIP(landmarks, tip, dip, pip) {
  const ax = landmarks[tip].x - landmarks[dip].x;
  const ay = landmarks[tip].y - landmarks[dip].y;
  const bx = landmarks[pip].x - landmarks[dip].x;
  const by = landmarks[pip].y - landmarks[dip].y;
  
  const dot = ax * bx + ay * by;
  const normA = Math.hypot(ax, ay) || 1e-6;
  const normB = Math.hypot(bx, by) || 1e-6;
  const cos = Math.max(-1, Math.min(1, dot / (normA * normB)));
  
  return (Math.acos(cos) * 180) / Math.PI;
}

/**
 * Check if finger is straight based on PIP angle
 * @param {Array} landmarks - Array of 21 hand landmarks
 * @param {number} tip - Tip landmark index
 * @param {number} dip - DIP landmark index
 * @param {number} pip - PIP landmark index
 * @param {number} threshold - Angle threshold in degrees
 * @returns {boolean} True if finger is straight
 */
export function isFingerStraight(landmarks, tip, dip, pip, threshold = 150) {
  return angleAtPIP(landmarks, tip, dip, pip) >= threshold;
}

/**
 * Check if finger is bent based on tip-to-PIP distance
 * @param {Array} landmarks - Array of 21 hand landmarks
 * @param {number} tip - Tip landmark index
 * @param {number} pip - PIP landmark index
 * @param {number} pw - Palm width for normalization
 * @param {number} threshold - Distance threshold
 * @returns {boolean} True if finger is bent
 */
export function isFingerBent(landmarks, tip, pip, pw, threshold = 0.62) {
  return normalizedDistance(landmarks, tip, pip, pw) < threshold;
}
