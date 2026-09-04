import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader() {
  // ─── useState: current loading percentage (0-100) ───
  const [progress, setProgress] = useState(0);

  // ─── useState: whether loading is fully complete and loader should unmount ───
  const [isComplete, setIsComplete] = useState(false);

  // ─── useRef: store the animation frame id so we can cancel on unmount ───
  const rafRef = useRef(null);

  // ─── useRef: store the start timestamp ───
  const startTimeRef = useRef(Date.now());

  // ─── useEffect: animate the progress counter from 0 to 100 ───
  useEffect(() => {
    const duration = 2000; // 2 seconds
    startTimeRef.current = Date.now();

    const update = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(update);
      } else {
        // Small delay before removing loader
        setTimeout(() => setIsComplete(true), 400);
      }
    };

    rafRef.current = requestAnimationFrame(update);

    // Cleanup: cancel the animation frame on unmount
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-light-surface dark:bg-brand-dark"
        >
          <div className="flex items-baseline gap-1">
            <span className="text-7xl md:text-8xl font-light text-brand-text-primary dark:text-brand-text-dark-primary tabular-nums">
              {progress}
            </span>
            <span className="text-2xl font-light text-brand-text-secondary dark:text-brand-text-dark-secondary">
              %
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
