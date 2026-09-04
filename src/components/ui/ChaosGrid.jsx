import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ChaosGrid — Canvas particle system showing order & chaos interaction.
 * Adapted from Framer's ChaosGrid component for standalone React usage.
 */
export default function ChaosGrid({
  particleSpacing = 30,
  chaosStrength = 2,
  connectionDistance = 50,
  showDivider = true,
  mouseInteraction = true,
  mouseRadius = 100,
  mouseStrength = 0.5,
  orderPercentage = 50,
  className = '',
}) {
  const { isDark } = useTheme();

  const particleColor = isDark ? '#ffffff' : '#1a1a1a';
  const backgroundColor = isDark ? '#141414' : '#f5f5f7';
  const dividerColor = isDark ? '#333333' : '#cccccc';

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Convert color string to hex
    const colorToHex = (color) => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return '#FFFFFF';
      tempCtx.fillStyle = color;
      return tempCtx.fillStyle;
    };

    const particleHex = colorToHex(particleColor);
    const dividerHex = colorToHex(dividerColor);

    class Particle {
      constructor(x, y, order) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.size = 2;
        this.order = order;
        this.velocity = {
          x: (Math.random() - 0.5) * chaosStrength,
          y: (Math.random() - 0.5) * chaosStrength,
        };
        this.influence = 0;
        this.neighbors = [];
      }

      update(canvasWidth, canvasHeight, dividerX) {
        // Mouse interaction
        if (mouseInteraction && mouseRef.current.active) {
          const dx = this.x - mouseRef.current.x;
          const dy = this.y - mouseRef.current.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouseRadius) {
            const force = (1 - distance / mouseRadius) * mouseStrength;
            const angle = Math.atan2(dy, dx);
            this.velocity.x += Math.cos(angle) * force;
            this.velocity.y += Math.sin(angle) * force;

            if (this.order) {
              this.influence = Math.max(this.influence, force);
            }
          }
        }

        if (this.order) {
          const dx = this.originalX - this.x;
          const dy = this.originalY - this.y;
          const chaosInfluence = { x: 0, y: 0 };

          this.neighbors.forEach((neighbor) => {
            if (!neighbor.order) {
              const distance = Math.hypot(this.x - neighbor.x, this.y - neighbor.y);
              const strength = Math.max(0, 1 - distance / 100);
              chaosInfluence.x += neighbor.velocity.x * strength;
              chaosInfluence.y += neighbor.velocity.y * strength;
              this.influence = Math.max(this.influence, strength);
            }
          });

          this.x +=
            dx * 0.05 * (1 - this.influence) +
            chaosInfluence.x * this.influence +
            this.velocity.x * this.influence;
          this.y +=
            dy * 0.05 * (1 - this.influence) +
            chaosInfluence.y * this.influence +
            this.velocity.y * this.influence;

          this.velocity.x *= 0.9;
          this.velocity.y *= 0.9;
          this.influence *= 0.99;
        } else {
          this.velocity.x += (Math.random() - 0.5) * 0.5;
          this.velocity.y += (Math.random() - 0.5) * 0.5;
          this.velocity.x *= 0.95;
          this.velocity.y *= 0.95;
          this.x += this.velocity.x;
          this.y += this.velocity.y;

          if (this.x < dividerX || this.x > canvasWidth) this.velocity.x *= -1;
          if (this.y < 0 || this.y > canvasHeight) this.velocity.y *= -1;

          this.x = Math.max(dividerX, Math.min(canvasWidth, this.x));
          this.y = Math.max(0, Math.min(canvasHeight, this.y));
        }
      }

      draw(ctx) {
        const alpha = this.order ? 0.8 - this.influence * 0.5 : 0.8;
        ctx.fillStyle = `${particleHex}${Math.round(alpha * 255)
          .toString(16)
          .padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize canvas
    const initializeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return false;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      dimensionsRef.current = { width: w, height: h };

      const columns = Math.floor(w / particleSpacing);
      const rows = Math.floor(h / particleSpacing);
      const dividerX = w * (orderPercentage / 100);
      particlesRef.current = [];

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          const x = particleSpacing * i + particleSpacing / 2;
          const y = particleSpacing * j + particleSpacing / 2;
          const order = x < dividerX;
          particlesRef.current.push(new Particle(x, y, order));
        }
      }
      return true;
    };

    if (!initializeCanvas()) return;

    const updateNeighbors = () => {
      particlesRef.current.forEach((particle) => {
        particle.neighbors = particlesRef.current.filter((other) => {
          if (other === particle) return false;
          return Math.hypot(particle.x - other.x, particle.y - other.y) < 100;
        });
      });
    };

    let time = 0;
    const animate = () => {
      const { width: cw, height: ch } = dimensionsRef.current;
      const dividerX = cw * (orderPercentage / 100);
      ctx.clearRect(0, 0, cw, ch);

      if (time % 30 === 0) updateNeighbors();

      particlesRef.current.forEach((particle) => {
        particle.update(cw, ch, dividerX);
        particle.draw(ctx);

        particle.neighbors.forEach((neighbor) => {
          const distance = Math.hypot(particle.x - neighbor.x, particle.y - neighbor.y);
          if (distance < connectionDistance) {
            const alpha = 0.2 * (1 - distance / connectionDistance);
            ctx.strokeStyle = `${particleHex}${Math.round(alpha * 255)
              .toString(16)
              .padStart(2, '0')}`;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(neighbor.x, neighbor.y);
            ctx.stroke();
          }
        });
      });

      if (showDivider) {
        ctx.strokeStyle = `${dividerHex}4D`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(dividerX, 0);
        ctx.lineTo(dividerX, ch);
        ctx.stroke();
      }

      time++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse events
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const { width: cw, height: ch } = dimensionsRef.current;
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * cw;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * ch;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // Resize handling
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => initializeCanvas(), 150);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    if (mouseInteraction) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (mouseInteraction && canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      resizeObserver.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, [
    particleColor,
    backgroundColor,
    dividerColor,
    particleSpacing,
    chaosStrength,
    connectionDistance,
    showDivider,
    mouseInteraction,
    mouseRadius,
    mouseStrength,
    orderPercentage,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ cursor: mouseInteraction ? 'pointer' : 'default' }}
      />
    </div>
  );
}
