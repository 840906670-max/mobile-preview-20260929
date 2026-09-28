import { useEffect, useRef } from 'react'
import './PixelCard.css'

class Pixel {
  constructor(canvas, ctx, x, y, color, speed, delay) {
    this.ctx = ctx
    this.x = x
    this.y = y
    this.color = color
    this.speed = (Math.random() * .8 + .1) * speed
    this.size = 0
    this.step = Math.random() * .4
    this.min = .5
    this.max = Math.random() * 1.5 + .5
    this.delay = delay
    this.counter = 0
    this.counterStep = Math.random() * 4 + (canvas.width + canvas.height) * .01
    this.idle = false
    this.reverse = false
  }

  draw() {
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.x + 1 - this.size / 2, this.y + 1 - this.size / 2, this.size, this.size)
  }

  appear() {
    this.idle = false
    if (this.counter <= this.delay) {
      this.counter += this.counterStep
      return
    }
    if (this.size >= this.max) {
      this.reverse = true
    } else if (this.size <= this.min) {
      this.reverse = false
    }
    this.size += this.reverse ? -this.speed : this.step
    this.draw()
  }

  disappear() {
    this.counter = 0
    this.reverse = false
    if (this.size <= 0) {
      this.size = 0
      this.idle = true
      return
    }
    this.size -= .1
    this.draw()
  }
}

export default function PixelCard({
  gap = 7,
  speed = 32,
  colors = '#f8fafc,#f1f5f9,#cbd5e1',
  noFocus = false,
  autoHideMs = 0,
  className = '',
  children,
}) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const pixelsRef = useRef([])
  const animationRef = useRef(null)
  const hideTimerRef = useRef(null)
  const previousRef = useRef(performance.now())
  const reducedMotion = useRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches).current

  const initPixels = () => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const rect = container.getBoundingClientRect()
    const width = Math.floor(rect.width)
    const height = Math.floor(rect.height)
    const ctx = canvas.getContext('2d')
    if (!ctx || !width || !height) return
    canvas.width = width
    canvas.height = height
    const palette = colors.split(',')
    const pxs = []
    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        const distance = Math.hypot(x - width / 2, y - height / 2)
        pxs.push(new Pixel(canvas, ctx, x, y, palette[Math.floor(Math.random() * palette.length)], reducedMotion ? 0 : speed * .001, distance))
      }
    }
    pixelsRef.current = pxs
  }

  const animate = (method) => {
    animationRef.current = requestAnimationFrame(() => animate(method))
    const now = performance.now()
    if (now - previousRef.current < 1000 / 60) return
    previousRef.current = now
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let idle = true
    pixelsRef.current.forEach((pixel) => {
      pixel[method]()
      if (!pixel.idle) idle = false
    })
    if (idle) cancelAnimationFrame(animationRef.current)
  }

  const trigger = (method) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    animationRef.current = requestAnimationFrame(() => animate(method))
  }

  const startAppearance = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    trigger('appear')
    if (autoHideMs > 0) {
      hideTimerRef.current = setTimeout(() => {
        trigger('disappear')
        hideTimerRef.current = null
      }, autoHideMs)
    }
  }

  const stopAppearance = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = null
    trigger('disappear')
  }

  useEffect(() => {
    initPixels()
    const observer = new ResizeObserver(initPixels)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => {
      observer.disconnect()
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [gap, speed, colors, autoHideMs])

  return (
    <div
      ref={containerRef}
      className={`pixel-card ${className}`}
      onMouseEnter={startAppearance}
      onMouseLeave={stopAppearance}
      onFocus={noFocus ? undefined : (event) => { if (!event.currentTarget.contains(event.relatedTarget)) startAppearance() }}
      onBlur={noFocus ? undefined : (event) => { if (!event.currentTarget.contains(event.relatedTarget)) stopAppearance() }}
      tabIndex={noFocus ? -1 : 0}
    >
      <canvas className="pixel-canvas" ref={canvasRef} aria-hidden="true" />
      {children}
    </div>
  )
}
