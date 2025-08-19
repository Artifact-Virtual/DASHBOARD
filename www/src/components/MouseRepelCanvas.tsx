import React, { useRef, useEffect } from 'react';

const MouseRepelCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = canvas.parentElement?.offsetHeight || window.innerHeight;
    let mouse = { x: width/2, y: height/2 };
    let animId: number;
    function resize() {
      width = window.innerWidth;
      height = canvas.parentElement?.offsetHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();
    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    window.addEventListener('mousemove', onMouseMove);
    // Animate a subtle field of points that repel from the mouse
    const points: { x: number; y: number; baseX: number; baseY: number }[] = [];
    const grid = 32;
    for (let x = 0; x < width; x += grid) {
      for (let y = 0; y < height; y += grid) {
        points.push({ x, y, baseX: x, baseY: y });
      }
    }
    function animate() {
      ctx.clearRect(0,0,width,height);
      for (let p of points) {
        // Repel from mouse
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        let repel = 0;
        if (dist < 120) repel = (120-dist)/120*18;
        // Move point
        const angle = Math.atan2(dy, dx);
        const tx = p.baseX + Math.cos(angle) * repel;
        const ty = p.baseY + Math.sin(angle) * repel;
        p.x += (tx - p.x) * 0.12;
        p.y += (ty - p.y) * 0.12;
        // Draw point
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, 2*Math.PI);
        ctx.fillStyle = 'rgba(180,255,220,0.10)';
        ctx.shadowColor = 'rgba(180,255,220,0.08)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      animId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{display:'block'}} aria-hidden="true" />;
};

export default MouseRepelCanvas;
