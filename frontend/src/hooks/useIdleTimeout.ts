import { useEffect, useRef, useCallback } from "react";

interface UseIdleTimeoutOptions {
  timeout: number; // in milliseconds
  onIdle: () => void;
}

/**
 * Hook to detect user inactivity
 * Triggers onIdle callback after specified timeout of no user activity
 */
export const useIdleTimeout = ({ timeout, onIdle }: UseIdleTimeoutOptions) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(onIdle, timeout);
  }, [timeout, onIdle]);

  useEffect(() => {
    // Events that indicate user activity
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
      "wheel",
    ];

    // Reset timer on any activity
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Start the timer initially
    resetTimer();

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer]);

  // Return a function to manually reset the timer if needed
  return { resetTimer };
};
