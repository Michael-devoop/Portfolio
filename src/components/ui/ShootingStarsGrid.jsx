import { useRef, useEffect, useState, useCallback, useMemo } from 'react';

/**
 * ShootingStarsGrid — React port of the Framer "Shooting Stars Grid" component.
 * Renders a pulsing grid with animated shooting stars travelling along grid lines.
 */
export default function ShootingStarsGrid({
  backgroundColor = 'transparent',
  gridSize = 64,
  gridLineColor = 'rgba(255, 255, 255, 0.05)',
  gridLineOpacity = 1,
  pulseMinOpacity = 0.8,
  pulseMaxOpacity = 1,
  pulseDuration = 8,
  maskInnerStop = 20,
  maskOuterStop = 80,
  glowColor = 'rgba(22, 163, 74, 1)',
  glowOpacity = 0.1,
  glowBlur = 120,
  glowWidth = 800,
  glowHeight = 600,
  spawnRateMin = 200,
  spawnRateMax = 600,
  speedMin = 2000,
  speedMax = 4500,
  maxActiveStars = 15,
  trailLength = 150,
  thickness = 1,
  color1 = 'rgba(6, 182, 212, 1)',
  color2 = 'rgba(139, 92, 246, 1)',
  color3 = 'rgba(244, 244, 245, 0.9)',
  className = '',
  style = {},
}) {
  const containerRef = useRef(null);
  const starsLayerRef = useRef(null);
  const timeoutIdRef = useRef(null);
  const activeStarsRef = useRef(0);
  const [inView, setInView] = useState(false);

  const colors = useMemo(() => [color1, color2, color3], [color1, color2, color3]);
  const clampedGridSize = Math.max(4, Math.round(gridSize));
  const clampedThickness = Math.max(1, thickness);

  // ─── Intersection observer ───
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px 0px 200px 0px', threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ─── Mask CSS ───
  const maskCss = useMemo(() => {
    const inner = Math.min(
      Math.max(0, Math.min(100, maskInnerStop)),
      Math.max(0, Math.min(100, maskOuterStop))
    );
    const outer = Math.max(
      Math.max(0, Math.min(100, maskInnerStop)),
      Math.max(0, Math.min(100, maskOuterStop))
    );
    return `radial-gradient(ellipse at center, rgba(0,0,0,1) ${inner}%, rgba(0,0,0,0) ${outer}%)`;
  }, [maskInnerStop, maskOuterStop]);

  // ─── Keyframe CSS ───
  const keyframesCss = useMemo(() => {
    const safeDur = Math.max(0.1, pulseDuration);
    const minO = Math.max(0, Math.min(1, pulseMinOpacity));
    const maxO = Math.max(0, Math.min(1, pulseMaxOpacity));
    return `
@keyframes framer-shooting-stars-pulse-opacity {
  0%, 100% { opacity: ${minO}; }
  50% { opacity: ${maxO}; }
}
.framer-shooting-stars-grid-pulse {
  animation: framer-shooting-stars-pulse-opacity ${safeDur}s ease-in-out infinite;
}`;
  }, [pulseDuration, pulseMinOpacity, pulseMaxOpacity]);

  // ─── Cleanup helpers ───
  const cleanupStars = useCallback(() => {
    const layer = starsLayerRef.current;
    if (!layer) return;
    layer.innerHTML = '';
    activeStarsRef.current = 0;
  }, []);

  const stopLoop = useCallback(() => {
    if (timeoutIdRef.current != null) {
      window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(
    (fn) => {
      const min = Math.max(0, spawnRateMin);
      const max = Math.max(min, spawnRateMax);
      const next = Math.random() * (max - min) + min;
      timeoutIdRef.current = window.setTimeout(fn, next);
    },
    [spawnRateMin, spawnRateMax]
  );

  // ─── Animate a single star element via WAAPI ───
  const animateStar = useCallback((element, kfStart, kfEnd, duration) => {
    const layer = starsLayerRef.current;
    if (!layer) return;
    layer.appendChild(element);
    activeStarsRef.current += 1;
    const safeDuration = Math.max(16, duration);
    if (typeof element.animate !== 'function') {
      setTimeout(() => {
        element.remove();
        activeStarsRef.current = Math.max(0, activeStarsRef.current - 1);
      }, 500);
      return;
    }
    const anim = element.animate([kfStart, kfEnd], {
      duration: safeDuration,
      easing: 'linear',
      fill: 'forwards',
    });
    anim.onfinish = () => {
      element.remove();
      activeStarsRef.current = Math.max(0, activeStarsRef.current - 1);
    };
  }, []);

  // ─── Create a shooting star DOM element and animate it ───
  const createShootingStar = useCallback(() => {
    if (!inView) return;
    const layer = starsLayerRef.current;
    const container = containerRef.current;
    if (!layer || !container) return;
    if (activeStarsRef.current >= Math.max(0, maxActiveStars)) return;

    const rect = container.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const isHorizontal = Math.random() > 0.5;
    const isForward = Math.random() > 0.5;
    const color = colors[Math.floor(Math.random() * colors.length)] ?? 'rgba(6,182,212,1)';

    const star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.zIndex = '1';
    star.style.pointerEvents = 'none';
    star.style.willChange = 'transform';
    star.style.borderRadius = '999px';

    const durMin = Math.max(16, speedMin);
    const durMax = Math.max(durMin, speedMax);
    const duration = Math.random() * (durMax - durMin) + durMin;
    const tl = Math.max(1, trailLength);
    const t = Math.max(1, clampedThickness);

    if (isHorizontal) {
      const maxRows = Math.floor(height / clampedGridSize);
      const row = Math.floor(Math.random() * (maxRows + 1));
      const yPos = row * clampedGridSize - t / 2 + 0.5;
      star.style.top = `${yPos}px`;
      star.style.height = `${t}px`;
      star.style.width = `${tl}px`;
      if (isForward) {
        star.style.left = `-${tl}px`;
        star.style.background = `linear-gradient(to right, transparent, ${color} 80%, rgba(255,255,255,1) 100%)`;
        star.style.boxShadow = `10px 0 15px -2px ${color}`;
        animateStar(star, { transform: 'translateX(0px)' }, { transform: `translateX(${width + tl * 2}px)` }, duration);
      } else {
        star.style.right = `-${tl}px`;
        star.style.background = `linear-gradient(to left, transparent, ${color} 80%, rgba(255,255,255,1) 100%)`;
        star.style.boxShadow = `-10px 0 15px -2px ${color}`;
        animateStar(star, { transform: 'translateX(0px)' }, { transform: `translateX(-${width + tl * 2}px)` }, duration);
      }
    } else {
      const maxCols = Math.floor(width / clampedGridSize);
      const col = Math.floor(Math.random() * (maxCols + 1));
      const xPos = col * clampedGridSize - t / 2 + 0.5;
      star.style.left = `${xPos}px`;
      star.style.width = `${t}px`;
      star.style.height = `${tl}px`;
      if (isForward) {
        star.style.top = `-${tl}px`;
        star.style.background = `linear-gradient(to bottom, transparent, ${color} 80%, rgba(255,255,255,1) 100%)`;
        star.style.boxShadow = `0 10px 15px -2px ${color}`;
        animateStar(star, { transform: 'translateY(0px)' }, { transform: `translateY(${height + tl * 2}px)` }, duration);
      } else {
        star.style.bottom = `-${tl}px`;
        star.style.background = `linear-gradient(to top, transparent, ${color} 80%, rgba(255,255,255,1) 100%)`;
        star.style.boxShadow = `0 -10px 15px -2px ${color}`;
        animateStar(star, { transform: 'translateY(0px)' }, { transform: `translateY(-${height + tl * 2}px)` }, duration);
      }
    }
  }, [animateStar, clampedGridSize, clampedThickness, colors, inView, maxActiveStars, speedMax, speedMin, trailLength]);

  // ─── Spawn loop ───
  const spawnLoop = useCallback(() => {
    if (document.visibilityState !== 'visible') {
      scheduleNext(spawnLoop);
      return;
    }
    createShootingStar();
    scheduleNext(spawnLoop);
  }, [createShootingStar, scheduleNext]);

  // ─── Start / stop based on visibility ───
  useEffect(() => {
    if (!inView) {
      stopLoop();
      return;
    }
    stopLoop();
    timeoutIdRef.current = window.setTimeout(() => spawnLoop(), 500);
    return () => stopLoop();
  }, [inView, spawnLoop, stopLoop]);

  // ─── Cleanup stars on resize ───
  useEffect(() => {
    const onResize = () => cleanupStars();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [cleanupStars]);

  // ─── Grid background CSS ───
  const gridBg = `
    linear-gradient(to right, ${gridLineColor} 1px, transparent 1px),
    linear-gradient(to bottom, ${gridLineColor} 1px, transparent 1px)
  `.trim();

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        position: 'relative',
        width: '100%',
        height: '100%',
        minWidth: 5,
        minHeight: 5,
        overflow: 'hidden',
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-hidden="true"
    >
      <style>{keyframesCss}</style>

      {/* Pulsing grid */}
      <div
        className="framer-shooting-stars-grid-pulse"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: gridBg,
          backgroundPosition: 'top left',
          backgroundSize: `${clampedGridSize}px ${clampedGridSize}px`,
          WebkitMaskImage: maskCss,
          maskImage: maskCss,
        }}
      />

      {/* Stars layer */}
      <div
        ref={starsLayerRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          WebkitMaskImage: maskCss,
          maskImage: maskCss,
        }}
      />

      {/* Center glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${Math.max(1, glowWidth)}px`,
          height: `${Math.max(1, glowHeight)}px`,
          background: glowColor,
          opacity: Math.max(0, Math.min(1, glowOpacity)),
          filter: `blur(${Math.max(0, glowBlur)}px)`,
          borderRadius: 9999,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
