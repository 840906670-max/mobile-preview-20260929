import { useEffect, useRef } from 'react'
import './ParticleText.css'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export default function ParticleText({
  text,
  color = 'rgba(27, 27, 25, .72)',
  highlightColor = 'rgba(238, 63, 18, .9)',
  trigger = 'click',
  className = '',
}) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!container || !canvas || !context) return undefined

    let particles = []
    let frame = null
    let gathering = false
    let startedAt = 0
    let dpr = 1
    let width = 0
    let height = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lines = String(text || '').split('\n')
    const font = '900 9.5px "Arial Narrow", "Bahnschrift Condensed", Arial, sans-serif'

    const draw = (now) => {
      context.clearRect(0, 0, width, height)
      let complete = true

      particles.forEach((particle) => {
        let targetX = particle.targetX
        let targetY = particle.targetY
        if (gathering) {
          const progress = clamp((now - startedAt - particle.delay) / 520, 0, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          targetX = particle.startX + (particle.targetX - particle.startX) * eased
          targetY = particle.startY + (particle.targetY - particle.startY) * eased
          if (progress < 1) complete = false
        }

        particle.x += (targetX - particle.x) * (reducedMotion ? 1 : .34)
        particle.y += (targetY - particle.y) * (reducedMotion ? 1 : .34)
        context.fillStyle = particle.color
        context.fillRect(Math.round(particle.x), Math.round(particle.y), particle.size, particle.size)
      })

      if (gathering && !complete) {
        frame = window.requestAnimationFrame(draw)
      } else {
        gathering = false
        frame = null
      }
    }

    const startGather = (scatter, entrance = false) => {
      if (!particles.length) return
      startedAt = performance.now()
      gathering = true
      particles.forEach((particle, index) => {
        if (scatter && !reducedMotion) {
          const angle = (index * 137.5 * Math.PI) / 180
          const distance = entrance ? 34 + (index % 13) * 7 : 10 + (index % 7) * 3
          particle.x = clamp(particle.targetX + Math.cos(angle) * distance, 0, width)
          particle.y = clamp(particle.targetY + Math.sin(angle) * distance, 0, height)
        }
        particle.startX = particle.x
        particle.startY = particle.y
        particle.delay = reducedMotion ? 0 : (entrance ? (index % 31) * 20 : (index % 17) * 8)
      })
      if (frame === null) frame = window.requestAnimationFrame(draw)
    }

    const build = () => {
      const rect = container.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const sample = document.createElement('canvas')
      const sampleContext = sample.getContext('2d', { willReadFrequently: true })
      if (!sampleContext) return
      sample.width = width * dpr
      sample.height = height * dpr
      sampleContext.setTransform(dpr, 0, 0, dpr, 0, 0)
      sampleContext.font = font
      sampleContext.textBaseline = 'alphabetic'
      sampleContext.fillStyle = '#000'
      const metrics = sampleContext.measureText('FRAME BY FRAME')
      const ascent = metrics.actualBoundingBoxAscent || 8
      const lineHeight = 9.5
      lines.forEach((line, index) => sampleContext.fillText(line, 0, ascent + index * lineHeight))

      const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data
      const nextParticles = []
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const alpha = pixels[(Math.floor(y * dpr) * sample.width + Math.floor(x * dpr)) * 4 + 3]
          if (alpha > 60) {
            const blend = x / Math.max(1, width)
            nextParticles.push({
              x,
              y,
              startX: x,
              startY: y,
              targetX: x,
              targetY: y,
              delay: 0,
              size: 1.4,
              color: blend > .68 ? highlightColor : color,
            })
          }
        }
      }
      particles = nextParticles
      context.clearRect(0, 0, width, height)
      startGather(true, true)
    }

    const observer = new ResizeObserver(build)
    observer.observe(container)
    build()

    const onPointerDown = () => {
      if (trigger === 'click') startGather(true)
    }
    canvas.addEventListener('pointerdown', onPointerDown)

    return () => {
      observer.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [color, highlightColor, text, trigger])

  return (
    <div ref={containerRef} className={`particleText ${className}`} aria-label={text}>
      <canvas ref={canvasRef} className="particleTextCanvas" aria-hidden="true" />
      <span className="particleTextScreenReader">{text}</span>
    </div>
  )
}
