import { useState, useEffect } from 'react';

export function useLoader(duration = 2000) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    let rafId;

    const update = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 100) {
        rafId = requestAnimationFrame(update);
      } else {
        setTimeout(() => setIsComplete(true), 400);
      }
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [duration]);

  return { progress, isComplete };
}
