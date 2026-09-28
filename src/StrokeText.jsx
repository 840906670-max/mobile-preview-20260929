import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './StrokeText.css'

export default function StrokeText({
  text,
  strokeColor = '#1b1b19',
  fillColor = '#1b1b19',
  strokeWidth = 0.7,
  drawDuration = 0.8,
  fillDelay = 0.08,
  stagger = 0.035,
  ease = 'power2.out',
  fillMode = 'wipe',
  fontSize = 10,
  fontWeight = 900,
  letterSpacing = 0.5,
  className = '',
}) {
  const rootRef = useRef(null)
  const textRef = useRef(null)
  const wipeRef = useRef(null)
  const [box, setBox] = useState(null)
  const rawId = useId()
  const wipeId = `stroke-wipe-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const characters = useMemo(() => Array.from(String(text || '')), [text])
  const dash = Math.max(fontSize * 7, 200)

  useLayoutEffect(() => {
    const node = textRef.current
    if (!node) return undefined
    const measure = () => {
      try {
        const bounds = node.getBBox()
        const pad = Math.max(strokeWidth, fontSize * .1)
        if (bounds.width) setBox({ x: bounds.x - pad, y: bounds.y - pad, width: bounds.width + pad * 2, height: bounds.height + pad * 2 })
      } catch { /* SVG can be unavailable for the first layout frame. */ }
    }
    measure()
    document.fonts?.ready?.then(measure).catch(() => {})
  }, [characters, fontSize, fontWeight, letterSpacing, strokeWidth])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !box) return undefined
    const strokes = gsap.utils.toArray(root.querySelectorAll('[data-stroke-char]'))
    const fills = gsap.utils.toArray(root.querySelectorAll('[data-fill-char]'))
    const wipe = wipeRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = [...strokes, ...fills, wipe].filter(Boolean)
    const setEnd = () => {
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: 0 })
      gsap.set(fills, { opacity: 1 })
      if (wipe) gsap.set(wipe, { attr: { width: box.width } })
    }
    if (reducedMotion) { setEnd(); return undefined }
    gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: dash })
    gsap.set(fills, { opacity: fillMode === 'wipe' ? 1 : 0 })
    if (wipe) gsap.set(wipe, { attr: { width: 0 } })
    const timeline = gsap.timeline()
    timeline.to(strokes, { strokeDashoffset: 0, duration: drawDuration, ease, stagger }, 0)
    if (wipe) timeline.to(wipe, { attr: { width: box.width }, duration: Math.max(.35, drawDuration * .5), ease: 'power2.inOut' }, drawDuration + fillDelay)
    else timeline.to(fills, { opacity: 1, duration: .35, stagger }, drawDuration + fillDelay)
    return () => { timeline.kill(); gsap.killTweensOf(targets) }
  }, [box, dash, drawDuration, ease, fillDelay, fillMode, stagger])

  const style = { fontSize: `${fontSize}px`, fontWeight, letterSpacing: `${letterSpacing}px` }
  const viewBox = box ? `${box.x} ${box.y} ${box.width} ${box.height}` : `0 ${-fontSize} 240 ${fontSize * 1.3}`

  return (
    <span ref={rootRef} className={`stroke-text ${className}`.trim()} role="img" aria-label={text}>
      <svg className="stroke-text__svg" viewBox={viewBox} preserveAspectRatio="xMinYMid meet" aria-hidden="true">
        {fillMode === 'wipe' && box && <defs><clipPath id={wipeId} clipPathUnits="userSpaceOnUse"><rect ref={wipeRef} x={box.x} y={box.y} width="0" height={box.height} /></clipPath></defs>}
        <text ref={textRef} className="stroke-text__stroke" x="0" y="0" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" style={style}>
          {characters.map((character, index) => <tspan data-stroke-char key={`stroke-${index}`}>{character}</tspan>)}
        </text>
        <text className="stroke-text__fill" x="0" y="0" fill={fillColor} style={style} clipPath={fillMode === 'wipe' && box ? `url(#${wipeId})` : undefined}>
          {characters.map((character, index) => <tspan data-fill-char key={`fill-${index}`}>{character}</tspan>)}
        </text>
      </svg>
    </span>
  )
}
