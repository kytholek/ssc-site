import { useEffect, useRef } from 'react'

export default function NumerologyRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resizeCanvas()

    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '22', '33', '44']
    const colWidth = Math.max(40, Math.floor(window.innerWidth / 50))
    const cols = Math.ceil(window.innerWidth / colWidth)

    const particles = Array.from({ length: cols }, (_, i) => ({
      x: i * colWidth + colWidth / 2,
      y: Math.random() * window.innerHeight,
      speed: 0.4 + Math.random() * 0.6,
      char: digits[Math.floor(Math.random() * digits.length)],
      alpha: 0.06 + Math.random() * 0.14,
      frameCount: 0,
    }))

    let animationId
    const animate = () => {
      ctx.fillStyle = '#050508'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      ctx.fillStyle = '#c9a84c'
      ctx.font = '12px "Press Start 2P", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      particles.forEach((p) => {
        p.frameCount++
        if (p.frameCount > 80) {
          p.char = digits[Math.floor(Math.random() * digits.length)]
          p.frameCount = 0
        }

        ctx.globalAlpha = p.alpha
        ctx.fillText(p.char, p.x, p.y)
        p.y += p.speed

        if (p.y > window.innerHeight) {
          p.y = -20
        }
      })

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      resizeCanvas()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="numerology-rain"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
