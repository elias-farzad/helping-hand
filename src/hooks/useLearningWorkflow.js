/**
 * Learning Workflow Hook
 * Manages the step-by-step learning flow: Demo → Practice → Success/Retry
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// Workflow states
export const WORKFLOW_STATES = {
  IDLE: 'idle',                    // No letter selected
  DEMO_SIGNING: 'demo_signing',    // Robot is signing the letter
  DEMO_RESETTING: 'demo_resetting', // Robot is resetting to 'A'
  USER_PRACTICE: 'user_practice',   // User's turn to practice
  SUCCESS: 'success',               // User succeeded!
  TIMEOUT: 'timeout'                // User ran out of time
};

// Timing constants
const DEMO_DURATION = 3000;      // Robot holds letter for 3 seconds
const RESET_DURATION = 1000;     // Robot resets for 1 second
const SUCCESS_DURATION = 3000;   // User must hold correct sign for 3 seconds
const PRACTICE_TIMEOUT = 8000;   // User has 8 seconds to succeed

export function useLearningWorkflow(sendLetter, isCorrect) {
  const [workflowState, setWorkflowState] = useState(WORKFLOW_STATES.IDLE);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [successProgress, setSuccessProgress] = useState(0); // 0-100
  
  const successTimerRef = useRef(null);
  const timeoutTimerRef = useRef(null);
  const correctStartTimeRef = useRef(null);

  /**
   * Clear all timers
   */
  const clearTimers = useCallback(() => {
    if (successTimerRef.current) {
      clearInterval(successTimerRef.current);
      successTimerRef.current = null;
    }
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }
    correctStartTimeRef.current = null;
    setSuccessProgress(0);
  }, []);

  /**
   * Start the workflow when user clicks a letter
   */
  const startWorkflow = useCallback(async (letter) => {
    clearTimers();
    setSelectedLetter(letter);
    setWorkflowState(WORKFLOW_STATES.DEMO_SIGNING);

    // Step 1: Send letter to robot for demo
    await sendLetter(letter);

    // Step 2: Wait 3 seconds (robot holds the sign)
    setTimeout(async () => {
      setWorkflowState(WORKFLOW_STATES.DEMO_RESETTING);
      
      // Step 3: Send 'A' to reset robot
      await sendLetter('A');
      
      // Step 4: Wait 1 second for reset
      setTimeout(() => {
        setWorkflowState(WORKFLOW_STATES.USER_PRACTICE);
        
        // Step 5: Start 8-second timeout for user practice
        timeoutTimerRef.current = setTimeout(() => {
          setWorkflowState(WORKFLOW_STATES.TIMEOUT);
          clearTimers();
        }, PRACTICE_TIMEOUT);
        
      }, RESET_DURATION);
    }, DEMO_DURATION);
  }, [sendLetter, clearTimers]);

  /**
   * Retry the workflow (called when user times out)
   */
  const retry = useCallback(() => {
    if (selectedLetter) {
      startWorkflow(selectedLetter);
    }
  }, [selectedLetter, startWorkflow]);

  /**
   * Reset to idle state
   */
  const reset = useCallback(() => {
    clearTimers();
    setWorkflowState(WORKFLOW_STATES.IDLE);
    setSelectedLetter(null);
    setSuccessProgress(0);
  }, [clearTimers]);

  /**
   * Monitor user's correct sign duration during practice
   */
  useEffect(() => {
    // Only track during practice phase
    if (workflowState !== WORKFLOW_STATES.USER_PRACTICE) {
      return;
    }

    if (isCorrect) {
      // Start or continue timer
      if (!correctStartTimeRef.current) {
        correctStartTimeRef.current = Date.now();
        
        // Update progress every 100ms
        successTimerRef.current = setInterval(() => {
          const elapsed = Date.now() - correctStartTimeRef.current;
          const progress = Math.min((elapsed / SUCCESS_DURATION) * 100, 100);
          setSuccessProgress(progress);
          
          // Success!
          if (progress >= 100) {
            clearInterval(successTimerRef.current);
            successTimerRef.current = null;
            if (timeoutTimerRef.current) {
              clearTimeout(timeoutTimerRef.current);
              timeoutTimerRef.current = null;
            }
            setWorkflowState(WORKFLOW_STATES.SUCCESS);
          }
        }, 100);
      }
    } else {
      // Reset timer if user loses the correct sign
      if (correctStartTimeRef.current) {
        correctStartTimeRef.current = null;
        setSuccessProgress(0);
        if (successTimerRef.current) {
          clearInterval(successTimerRef.current);
          successTimerRef.current = null;
        }
      }
    }

    return () => {
      if (successTimerRef.current) {
        clearInterval(successTimerRef.current);
      }
    };
  }, [isCorrect, workflowState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return {
    workflowState,
    selectedLetter,
    successProgress,
    startWorkflow,
    retry,
    reset
  };
}
