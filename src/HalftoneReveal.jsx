import { useRef, useState } from 'react'
import './HalftoneReveal.css'

export default function HalftoneReveal({
  // firstImage is the live-action frame revealed through the interaction;
  // secondImage is the 3D frame shown as the default top layer.
  firstImage,
  secondImage,
  firstLabel,
  secondLabel,
  firstAlt,
  secondAlt,
  mobileFirstImage,
  mobileSecondImage,
}) {
  const [active, setActive] = useState(false)
  const [point, setPoint] = useState({ x: 50, y: 50 })
  const touchPointerRef = useRef(false)
  const pointerDownRef = useRef(false)

  const updatePoint = (event) => {
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    // In the portrait preview the phone frame is visually scaled. When the
    // event target is the reveal root, offsetX/Y stay in that root's own
    // coordinate space and avoid mixing the scaled screen position with the
    // iframe's unscaled layout coordinates.
    const hasLocalOffset = event.target === target && Number.isFinite(event.offsetX) && Number.isFinite(event.offsetY)
    const localX = hasLocalOffset ? event.offsetX : event.clientX - rect.left
    const localY = hasLocalOffset ? event.offsetY : event.clientY - rect.top
    const width = hasLocalOffset ? target.clientWidth : rect.width
    const height = hasLocalOffset ? target.clientHeight : rect.height
    setPoint({
      x: Math.max(0, Math.min(100, (localX / width) * 100)),
      y: Math.max(0, Math.min(100, (localY / height) * 100)),
    })
  }

  const handlePointerDown = (event) => {
    pointerDownRef.current = true
    updatePoint(event)
    setActive(true)
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      touchPointerRef.current = true
    }
    // Mouse clicks place the lens and keep it there. Pointer capture lets a
    // press-drag continue updating the lens even when the pointer leaves the
    // exact spot where the gesture started.
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handlePointerUp = (event) => {
    if (!pointerDownRef.current) return
    // The final point makes a tap or short drag land exactly where released.
    updatePoint(event)
    setActive(true)
    pointerDownRef.current = false
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!pointerDownRef.current) return
    updatePoint(event)
    setActive(true)
  }

  return (
    <div
      className={`halftoneReveal${active ? ' is-revealed' : ''}`}
      style={{ '--reveal-x': `${point.x}%`, '--reveal-y': `${point.y}%` }}
      tabIndex={0}
      role="button"
      aria-label={`${firstLabel}。点击定位并拖动查看${secondLabel}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { pointerDownRef.current = false }}
      onClick={(event) => {
        // Pointer interaction handles mouse hover and touch directly. Keep
        // click for keyboard activation without immediately cancelling a
        // touch reveal through the synthetic click that follows a tap.
        if (touchPointerRef.current) {
          touchPointerRef.current = false
          return
        }
        if (event.detail === 0) setActive((value) => !value)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
        }
      }}
    >
      <div className="halftoneRevealLayer halftoneRevealLayer--base">
        <picture>
          {mobileSecondImage ? <source media="(max-width: 640px)" srcSet={mobileSecondImage} /> : null}
          <img src={secondImage} alt={secondAlt} loading="lazy" decoding="async" draggable={false} />
        </picture>
      </div>
      <div className="halftoneRevealRevealWrap" aria-hidden={!active}>
        <div className="halftoneRevealLayer halftoneRevealLayer--reveal">
          <picture>
            {mobileFirstImage ? <source media="(max-width: 640px)" srcSet={mobileFirstImage} /> : null}
            <img src={firstImage} alt={firstAlt} loading="lazy" decoding="async" draggable={false} />
          </picture>
        </div>
      </div>
      <div className="halftoneRevealFrame" aria-hidden="true" />
      <div className="halftoneRevealLabels">
        <span className="halftoneRevealLabel halftoneRevealLabel--first">{firstLabel}</span>
        <span className="halftoneRevealLabel halftoneRevealLabel--second">{secondLabel}</span>
      </div>
      <span className="halftoneRevealHint">CLICK / DRAG TO REVEAL</span>
    </div>
  )
}
