import React, { useRef, useEffect } from 'react'

interface ConnectionParticlesProps {
  isConnected: boolean
  intensity?: number
}

const ConnectionParticles: React.FC<ConnectionParticlesProps> = ({ isConnected, intensity = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    size: number
  }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let width = 0
    let height = 0
    let dpr = Math.max(1, window.devicePixelRatio || 1)

    function resize() {
      width = canvas.clientWidth || window.innerWidth
      height = canvas.clientHeight || window.innerHeight
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    let last = performance.now()

    function spawnParticle() {
      if (!isConnected) return
      
      particlesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 0,
        maxLife: 120 + Math.random() * 180,
        size: 1 + Math.random() * 3
      })
    }

    function frame(now: number) {
      const dt = Math.min(40, now - last)
      last = now

      ctx.clearRect(0, 0, width, height)

      // Spawn particles when connected
      if (isConnected && Math.random() < 0.3 * intensity) {
        spawnParticle()
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.life += dt / 16
        p.x += p.vx
        p.y += p.vy
        
        // Fade based on life
        const alpha = Math.max(0, 1 - p.life / p.maxLife)
        
        if (alpha <= 0) return false

        // Draw connection-themed particle (cyan/blue glow)
        ctx.globalAlpha = alpha * 0.6
        ctx.fillStyle = `hsl(${180 + Math.sin(p.life * 0.1) * 40}, 70%, 60%)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Glow effect
        ctx.globalAlpha = alpha * 0.3
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
        ctx.fill()
        
        return true
      })

      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)

    const onResize = () => {
      dpr = Math.max(1, window.devicePixelRatio || 1)
      resize()
    }
    window.addEventListener('resize', onResize)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [isConnected, intensity])

  // Clear particles when disconnected
  useEffect(() => {
    if (!isConnected) {
      particlesRef.current = []
    }
  }, [isConnected])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />
}

export default ConnectionParticles
