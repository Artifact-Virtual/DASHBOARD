import React, { useRef, useEffect } from 'react'

// Improved Perlin noise implementation (classic port)
function buildPerlin() {
  const p = new Uint8Array(512)
  const permutation = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161, 1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152, 2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]
  for (let i = 0; i < 256; i++) p[i] = permutation[i]
  for (let i = 0; i < 256; i++) p[256 + i] = p[i]

  function fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }
  function lerp(t: number, a: number, b: number) {
    return a + t * (b - a)
  }
  function grad(hash: number, x: number, y: number, z: number) {
    const h = hash & 15
    const u = h < 8 ? x : y
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }

  return function noise(x: number, y: number, z: number) {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    const Z = Math.floor(z) & 255
    x -= Math.floor(x)
    y -= Math.floor(y)
    z -= Math.floor(z)
    const u = fade(x)
    const v = fade(y)
    const w = fade(z)

    const A = p[X] + Y
    const AA = p[A] + Z
    const AB = p[A + 1] + Z
    const B = p[X + 1] + Y
    const BA = p[B] + Z
    const BB = p[B + 1] + Z

    const res = lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)), lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z))), lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)), lerp(u, grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1))))
    return (res + 1) / 2
  }
}

const noise = buildPerlin()

const NoiseLinesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const tRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const visibleRef = useRef(true)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let width = 0;
    let height = 0;
    let dpr = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      width = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const handleTouch = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.touches[0].clientX - rect.left;
      mouseRef.current.y = e.touches[0].clientY - rect.top;
    };
    const onResize = () => {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      resize();
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('touchmove', handleTouch);
    window.addEventListener('resize', onResize);

    // pause when not visible (saves CPU)
    const obs = new IntersectionObserver((entries) => {
      visibleRef.current = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    obs.observe(canvas);

    let last = performance.now();

    function frame(now: number) {
      const dt = Math.min(40, now - last);
      last = now;
      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      // time increment influenced by mouseX
      const mappedTime = (mouseRef.current.x / (width || 1)) * 0.1;
      tRef.current += 0.001 + mappedTime * 0.002;

      const currentNoiseScale = 0.001 + (1 - (mouseRef.current.y / (height || 1))) * (0.008 - 0.001);
      const currentLineSpacing = 10 + (1 - (mouseRef.current.y / (height || 1))) * (40 - 10);
      const maxDisplacement = 50 + (1 - (mouseRef.current.y / (height || 1))) * (100 - 50);

      ctx.clearRect(0, 0, width, height);
      // AMOLED black background
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(255,255,255,0.066)';
      ctx.lineWidth = 1;

      // draw lines
      for (let y = 0; y < height + currentLineSpacing; y += currentLineSpacing) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 5) {
          const nx = x * currentNoiseScale;
          const ny = y * currentNoiseScale;
          const nz = tRef.current;
          const n = noise(nx, ny, nz);
          const displacement = (n * 2 - 1) * maxDisplacement;
          const px = x;
          const py = y + displacement;
          if (x === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      obs.disconnect();
    };
  }, []);



  // canvas is positioned via parent section; make it cover that region
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

export default NoiseLinesBackground
