import { useState, useRef, useEffect } from "react";

export function useStopwatch() {
  const [millis, setMillis] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  function startTiming() {
    // Always clear any existing interval first
    if (interval.current) {
      clearInterval(interval.current);
    }
    
    // Reset and start fresh
    setMillis(0);
    setIsActive(true);
    
    const startTime = Date.now();
    interval.current = setInterval(() => {
      setMillis(Date.now() - startTime);
    }, 10);
  }

  function stopTiming() {
    setIsActive(false);
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
  }

  function resetTimer() {
    stopTiming();
    setMillis(0);
  }

  return { millis, isActive, startTiming, stopTiming, resetTimer };
}