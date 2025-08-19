import React, { useRef, useEffect } from 'react';

// GloriousParticleLoader: Ambient, immersive, physics-based loader
const GloriousParticleLoader: React.FC<{ size?: number; className?: string }> = ({ size = 320, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dpr = window.devicePixelRatio || 1;
  const [dynamicSize, setDynamicSize] = React.useState(size);

  useEffect(() => {
    if (size === 0) {
      const handleResize = () => {
        if (containerRef.current) {
          setDynamicSize(containerRef.current.offsetWidth);
        }
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
    // If not responsive, do nothing
    return undefined;
  }, [size]);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let width = size;
    let height = size;
    let running = true;
    let frameId: number;

    // Particle system config
    const PARTICLE_COUNT = 64;
    const CYCLE_DURATION = 2.8; // seconds per cycle
    const GLOW_MAX = 0.45;
    const GLOW_MIN = 0.08;
    const RADIUS = size * 0.32;
    const CENTER = { x: width / 2, y: height / 2 };
    const PARTICLE_BASE = size * 0.13;
    const PARTICLE_COLOR = 'rgba(0,255,136,0.85)';
    const PARTICLE_SHADOW = '#00ff88';
    const BG_GRAD = ctx.createRadialGradient(CENTER.x, CENTER.y, 0, CENTER.x, CENTER.y, size * 0.5);
    BG_GRAD.addColorStop(0, 'rgba(0,0,0,0.0)');
    BG_GRAD.addColorStop(1, 'rgba(0,0,0,0.7)');

    // Particle state
    let particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: PARTICLE_BASE + Math.random() * (RADIUS - PARTICLE_BASE),
      vx: 0,
      vy: 0,
      phase: 0,
    }));

    function resetParticle(p: any, phase: number) {
      p.angle = Math.random() * Math.PI * 2;
      p.radius = PARTICLE_BASE + Math.random() * (RADIUS - PARTICLE_BASE);
      p.vx = 0;
      p.vy = 0;
      p.phase = phase;
    }

    function animate(now: number) {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle = BG_GRAD;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Animation cycle
      const t = ((now / 1000) % CYCLE_DURATION) / CYCLE_DURATION;
      // 0-0.2: compress, 0.2-0.4: glow, 0.4-0.6: explode, 0.6-1: gravity return
      let glow = GLOW_MIN;
      if (t < 0.2) {
        // compress
        glow = GLOW_MIN + (GLOW_MAX - GLOW_MIN) * (t / 0.2);
      } else if (t < 0.4) {
        // glow max
        glow = GLOW_MAX;
      } else if (t < 0.6) {
        // explode
        glow = GLOW_MAX - (GLOW_MAX - GLOW_MIN) * ((t - 0.4) / 0.2);
      } else {
        // fade
        glow = GLOW_MIN;
      }

  // (Removed central green ball/glow)

      // Animate particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        let p = particles[i];
        // Cycle phase
        if (t < 0.2) {
          // Compress: move toward center
          p.radius -= (p.radius - 0) * 0.18;
          p.vx *= 0.7;
          p.vy *= 0.7;
        } else if (t < 0.4) {
          // Glow: stay at center
          p.radius *= 0.7;
          p.vx *= 0.7;
          p.vy *= 0.7;
        } else if (t < 0.6) {
          // Explode: shoot outward
          if (p.phase < 1) {
            const speed = 6.5 + Math.random() * 3.5;
            p.vx = Math.cos(p.angle) * speed;
            p.vy = Math.sin(p.angle) * speed;
            p.phase = 1;
          }
          p.radius += Math.sqrt(p.vx * p.vx + p.vy * p.vy) * 7.2;
          p.vx *= 0.98;
          p.vy *= 0.98;
        } else {
          // Gravity: pull back to center
          const dx = CENTER.x - (CENTER.x + Math.cos(p.angle) * p.radius);
          const dy = CENTER.y - (CENTER.y + Math.sin(p.angle) * p.radius);
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const gravity = 0.18 + 0.22 * (1 - (t - 0.6) / 0.4);
          p.vx += (dx / dist) * gravity;
          p.vy += (dy / dist) * gravity;
          p.vx *= 0.92;
          p.vy *= 0.92;
          p.radius += Math.sqrt(p.vx * p.vx + p.vy * p.vy) * 0.7;
          // Reset if close to center
          if (Math.abs(p.radius) < 2 && Math.abs(p.vx) < 0.2 && Math.abs(p.vy) < 0.2) {
            resetParticle(p, 0);
          }
        }
        // Draw particle
        const px = CENTER.x + Math.cos(p.angle) * p.radius;
        const py = CENTER.y + Math.sin(p.angle) * p.radius;
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, 6 + 4 * glow, 0, Math.PI * 2);
        ctx.fillStyle = PARTICLE_COLOR;
        ctx.shadowColor = PARTICLE_SHADOW;
        ctx.shadowBlur = 16 + 32 * glow;
        ctx.globalAlpha = 0.7 + 0.3 * glow;
        ctx.fill();
        ctx.restore();
      }

      frameId = requestAnimationFrame(animate);
    }

    // Responsive resize
    function handleResize() {
      width = size;
      height = size;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    running = true;
    frameId = requestAnimationFrame(animate);
    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };

  }, [size]);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`} style={{ overflow: 'visible', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        width={dynamicSize * dpr}
        height={dynamicSize * dpr}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          background: 'transparent',
          position: 'absolute',
          left: 0,
          top: 0,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      />
    </div>
  );
};

export default GloriousParticleLoader;
