import React, { useRef, useEffect } from 'react'

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let dpr = window.devicePixelRatio || 1
    let width = 0
    let height = 0

    const resize = () => {
      width = canvas.clientWidth || window.innerWidth
      height = canvas.clientHeight || window.innerHeight
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    // Create a light set of moving angled lines for a sleek AMOLED look
    const count = Math.min(80, Math.max(24, Math.floor((width * height) / 150000)))
    const lines = new Array(count).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
      len: 80 + Math.random() * 260,
      alpha: 0.03 + Math.random() * 0.18,
    }))

    let raf = 0
    let last = performance.now()

    function frame(now: number) {
      const dt = Math.min(40, now - last)
      last = now

      // soft clear with global alpha to create a subtle trailing effect
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = 'lighter'
      for (const l of lines) {
        l.x += l.vx * dt
        l.y += l.vy * dt

        // wrap
        if (l.x < -l.len) l.x = width + l.len
        if (l.x > width + l.len) l.x = -l.len
        if (l.y < -l.len) l.y = height + l.len
        if (l.y > height + l.len) l.y = -l.len

        const x2 = l.x + l.len
        const y2 = l.y + l.len
        const grad = ctx.createLinearGradient(l.x, l.y, x2, y2)
        grad.addColorStop(0, `rgba(60,200,220,${l.alpha})`)
        grad.addColorStop(0.5, `rgba(40,160,200,${l.alpha * 0.6})`)
        grad.addColorStop(1, `rgba(0,0,0,0)`)

        ctx.strokeStyle = grad as unknown as string
        ctx.lineWidth = 1.1
        ctx.beginPath()
        ctx.moveTo(l.x, l.y)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    const onResize = () => {
      dpr = window.devicePixelRatio || 1
      resize()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none arc-animated-bg" />
}

export default AnimatedBackground
