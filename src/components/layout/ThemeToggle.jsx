import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * Theme String Toggle — a draggable pull-string to switch dark/light mode.
 * Adapted from Framer's "Theme String" component.
 * Pull down past the threshold to toggle theme. Springs back on release.
 */
export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  // ─── useState: track if user is currently dragging ───
  const [isDragging, setIsDragging] = useState(false);

  // ─── useRef: prevent double-toggle ───
  const hasToggled = useRef(false);

  // ─── Framer Motion values ───
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();

  // ─── Config ───
  const stringLength = 120;
  const threshold = 100;
  const stiffness = 300;
  const damping = 20;
  const stringThickness = 2.5;
  const handleSize = 44;
  const radius = 12;

  // ─── Colors ───
  const lineColor = isDark ? '#ffffff' : '#333333';
  const bgColor = isDark ? '#222222' : '#ffffff';
  const borderColor = isDark ? '#ffffff' : '#333333';
  const iconColor = lineColor;

  // ─── SVG path from anchor to dragged handle ───
  const path = useTransform([x, y], ([cx, cy]) => `M 50 0 L ${50 + cx} ${stringLength + cy + 1}`);

  const handleDragEnd = () => {
    setIsDragging(false);

    if (y.get() > threshold && !hasToggled.current) {
      hasToggled.current = true;
      toggleTheme();
      if (navigator.vibrate) navigator.vibrate(50);
      setTimeout(() => { hasToggled.current = false; }, 300);
    }

    controls.start({
      x: 0,
      y: 0,
      transition: { type: 'spring', stiffness, damping },
    });
  };

  return (
    <div
      className="fixed top-0 right-8 z-50"
      style={{
        width: 100,
        height: 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflow: 'visible',
        pointerEvents: 'none',
        lineHeight: 0,
      }}
    >
      {/* String line */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
          zIndex: 0,
        }}
      >
        <motion.path
          d={path}
          stroke={lineColor}
          strokeWidth={stringThickness}
          strokeLinecap="round"
          fill="none"
          style={{ transition: 'stroke 0.4s ease' }}
        />
      </svg>

      {/* Draggable handle */}
      <motion.div
        drag
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 200 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{
          x,
          y,
          marginTop: stringLength,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'grab',
          pointerEvents: 'auto',
          zIndex: 10,
          width: handleSize,
          height: handleSize,
          backgroundColor: bgColor,
          border: `2.5px solid ${borderColor}`,
          borderRadius: radius,
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          transition: 'background-color 0.4s ease, border-color 0.4s ease',
        }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {/* Sun / Moon icons */}
        <div style={{ position: 'relative', width: 22, height: 22 }}>
          {/* Sun icon */}
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{
              rotate: isDark ? 180 : 0,
              scale: isDark ? 0 : 1,
              opacity: isDark ? 0 : 1,
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transition: 'stroke 0.4s ease',
            }}
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </motion.svg>

          {/* Moon icon */}
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ scale: 0, rotate: -90 }}
            animate={{
              rotate: isDark ? 0 : -90,
              scale: isDark ? 1 : 0,
              opacity: isDark ? 1 : 0,
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transition: 'stroke 0.4s ease',
            }}
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </motion.svg>
        </div>
      </motion.div>
    </div>
  );
}
