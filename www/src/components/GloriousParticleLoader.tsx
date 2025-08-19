import React, { useRef, useEffect } from "react";

// Fullscreen, screen-responsive, immersive particle loader animation
// Sits behind thesis text, slightly offset to the right
const GloriousParticleLoader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Animation state refs
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);
  const phaseRef = useRef({
    currentPhase: 0,
    phaseTimer: 0,
    glowRadius: 0,
    glowOpacity: 0,
    width: 0,
    height: 0,
    centerX: 0,
    centerY: 0,
    maxGlowRadius: 0,
  });

  // Animation constants
  const numParticles = 150;
  const particleMinRadius = 1;
  const particleMaxRadius = 3;
  const PHASE_COMPRESS = 0;
  const PHASE_HOLD_GLOW = 1;
  const PHASE_EXPLODE = 2;
  const PHASE_RETURN_GRAVITY = 3;
  const phaseDurations = {
    [PHASE_COMPRESS]: 120,
    [PHASE_HOLD_GLOW]: 180,
    [PHASE_EXPLODE]: 150,
    [PHASE_RETURN_GRAVITY]: 250,
  };

  // Mouse state
  const mouse = useRef({ x: null as null | number, y: null as null | number });

  // Particle class
  class Particle {
    x: number;
    y: number;
    radius: number;
    color: [number, number, number];
    alpha: number;
    vx: number;
    vy: number;
    constructor(x: number, y: number, radius: number, color: [number, number, number]) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.alpha = 1;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
    }
    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.alpha})`;
      ctx.shadowBlur = this.radius * 2;
      ctx.shadowColor = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.alpha * 0.8})`;
      ctx.fill();
      ctx.restore();
    }
    update(phase: number, phaseTimer: number, phaseDurations: any, centerX: number, centerY: number) {
      switch (phase) {
        case PHASE_COMPRESS: {
          const angleToCenter = Math.atan2(centerY - this.y, centerX - this.x);
          const distToCenter = Math.hypot(centerX - this.x, centerY - this.y);
          if (distToCenter < 1) {
            this.x = centerX;
            this.y = centerY;
            this.vx = 0;
            this.vy = 0;
          } else {
            const compressionSpeed = 3;
            this.x += Math.cos(angleToCenter) * compressionSpeed;
            this.y += Math.sin(angleToCenter) * compressionSpeed;
          }
          this.alpha = 1;
          break;
        }
        case PHASE_HOLD_GLOW: {
          this.x += (Math.random() - 0.5) * 0.1;
          this.y += (Math.random() - 0.5) * 0.1;
          this.vx = 0;
          this.vy = 0;
          this.alpha = 1;
          break;
        }
        case PHASE_EXPLODE: {
          this.x += this.vx;
          this.y += this.vy;
          this.vx *= 0.98;
          this.vy *= 0.98;
          this.alpha = Math.max(0, 1 - (phaseTimer / phaseDurations[PHASE_EXPLODE]));
          break;
        }
        case PHASE_RETURN_GRAVITY: {
          const dx = centerX - this.x;
          const dy = centerY - this.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 1) {
            const gravityForce = 0.5;
            this.vx += (dx / distance) * gravityForce;
            this.vy += (dy / distance) * gravityForce;
          } else {
            this.x = centerX;
            this.y = centerY;
            this.vx = 0;
            this.vy = 0;
          }
          this.x += this.vx;
          this.y += this.vy;
          this.vx *= 0.95;
          this.vy *= 0.95;
          this.alpha = Math.min(1, phaseTimer / phaseDurations[PHASE_RETURN_GRAVITY]);
          break;
        }
      }
    }
  }

  // Initialize or re-initialize particles
  const initParticles = (width: number, height: number, centerX: number, centerY: number, maxGlowRadius: number) => {
    const arr = [];
    for (let i = 0; i < numParticles; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * (particleMaxRadius - particleMinRadius) + particleMinRadius;
      const color: [number, number, number] = [
        Math.floor(Math.random() * 50) + 100,
        Math.floor(Math.random() * 100) + 150,
        Math.floor(Math.random() * 100) + 200,
      ];
      arr.push(new Particle(x, y, radius, color));
    }
    particlesRef.current = arr;
  };

  // Resize canvas and re-init particles
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    // CenterX offset to the right (65% of width)
    const centerX = width * 0.65;
    const centerY = height / 2;
    const maxGlowRadius = Math.min(width, height) * 0.2;
    phaseRef.current.width = width * dpr;
    phaseRef.current.height = height * dpr;
    phaseRef.current.centerX = centerX * dpr;
    phaseRef.current.centerY = centerY * dpr;
    phaseRef.current.maxGlowRadius = maxGlowRadius * dpr;
    initParticles(width * dpr, height * dpr, centerX * dpr, centerY * dpr, maxGlowRadius * dpr);
  };

  // Main animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const {
      width,
      height,
      centerX,
      centerY,
      maxGlowRadius,
    } = phaseRef.current;
    let { currentPhase, phaseTimer, glowRadius, glowOpacity } = phaseRef.current;

    ctx.clearRect(0, 0, width, height);

    // Mouse repulsion: apply a force to particles near the center if mouse is present
    if (mouse.current.x !== null && mouse.current.y !== null) {
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const repelRadius = Math.min(width, height) * 0.32; // Larger radius
      const repelStrength = 7.5; // Stronger repulsion
      let repelled = false;
      particlesRef.current.forEach((p: any) => {
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const dist = Math.hypot(dx, dy);
        // Only repel if mouse is close to center
        const mouseDist = Math.hypot(mx - centerX, my - centerY);
        if (mouseDist < repelRadius && dist < repelRadius * 1.2) {
          // Repel away from mouse
          const angle = Math.atan2(p.y - my, p.x - mx);
          const force = (repelRadius - mouseDist) / repelRadius * repelStrength;
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
          repelled = true;
        }
      });
      if (repelled) {
        // eslint-disable-next-line no-console
        console.log('Mouse repulsion active at', mx, my);
      }
    }

    // Phase logic
    phaseTimer++;
    if (phaseTimer > phaseDurations[currentPhase]) {
      phaseTimer = 0;
      currentPhase = (currentPhase + 1) % Object.keys(phaseDurations).length;
      // Phase entry actions
      if (currentPhase === PHASE_EXPLODE) {
        particlesRef.current.forEach((p: any) => {
          const angle = Math.atan2(p.y - centerY, p.x - centerX) + (Math.random() - 0.5) * 0.5;
          const speed = Math.random() * 5 + 3;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.alpha = 1;
        });
      } else if (currentPhase === PHASE_RETURN_GRAVITY) {
        particlesRef.current.forEach((p: any) => {
          p.alpha = 0;
        });
      }
    }

    // Glow logic
    if (currentPhase === PHASE_HOLD_GLOW) {
      glowRadius = maxGlowRadius * (phaseTimer / phaseDurations[PHASE_HOLD_GLOW]);
      glowOpacity = 0.5 * (phaseTimer / phaseDurations[PHASE_HOLD_GLOW]);
    } else if (currentPhase === PHASE_EXPLODE) {
      glowRadius = maxGlowRadius * (1 - (phaseTimer / phaseDurations[PHASE_EXPLODE]));
      glowOpacity = 0.5 * (1 - (phaseTimer / phaseDurations[PHASE_EXPLODE]));
      if (glowRadius < 0) glowRadius = 0;
      if (glowOpacity < 0) glowOpacity = 0;
    } else {
      glowRadius = 0;
      glowOpacity = 0;
    }

    // Draw glow
    if (glowRadius > 0 && glowOpacity > 0) {
      ctx.save();
      const gradient = ctx.createRadialGradient(centerX, centerY, glowRadius * 0.1, centerX, centerY, glowRadius);
      gradient.addColorStop(0, `rgba(0, 255, 255, ${glowOpacity * 0.8})`);
      gradient.addColorStop(0.5, `rgba(100, 200, 255, ${glowOpacity * 0.4})`);
      gradient.addColorStop(1, `rgba(0, 150, 255, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
      ctx.fill();
      // Inner glow
      const innerGlowRadius = glowRadius * 0.4;
      const innerGradient = ctx.createRadialGradient(centerX, centerY, innerGlowRadius * 0.1, centerX, centerY, innerGlowRadius);
      innerGradient.addColorStop(0, `rgba(255, 255, 200, ${glowOpacity * 1.5})`);
      innerGradient.addColorStop(1, `rgba(255, 255, 0, 0)`);
      ctx.fillStyle = innerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerGlowRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Update and draw particles
    particlesRef.current.forEach((p: any) => {
      p.update(currentPhase, phaseTimer, phaseDurations, centerX, centerY);
      p.draw(ctx);
    });

    // Save phase state
    phaseRef.current.currentPhase = currentPhase;
    phaseRef.current.phaseTimer = phaseTimer;
    phaseRef.current.glowRadius = glowRadius;
    phaseRef.current.glowOpacity = glowOpacity;

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    phaseRef.current.currentPhase = PHASE_COMPRESS;
    phaseRef.current.phaseTimer = 0;
    phaseRef.current.glowRadius = 0;
    phaseRef.current.glowOpacity = 0;
    animationFrameRef.current = requestAnimationFrame(animate);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = (e.clientX - rect.left) * (canvas.width / rect.width);
      mouse.current.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    };
    const handleMouseLeave = () => {
      mouse.current.x = null;
      mouse.current.y = null;
    };
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
    // eslint-disable-next-line
  }, []);

  // Style: fill parent, absolute, pointer-events none
  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.95,
        }}
        aria-hidden="true"
      />
    </div>
  );
};

export default GloriousParticleLoader;
