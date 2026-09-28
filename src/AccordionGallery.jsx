import { useRef, useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'

import './AccordionGallery.css'

const DEFAULT_ITEMS = [
  { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon' },
  { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline' },
  { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls' },
  { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour' },
  { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline' },
]

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const isPortraitPhone = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(max-width: 520px) and (orientation: portrait)').matches

const AccordionGallery = ({
  items = DEFAULT_ITEMS,
  defaultIndex = 2,
  accentColor = '#ffffff',
  overlayColor = '#060010',
  textColor = '#ffffff',
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  className = '',
}) => {
  const rootRef = useRef(null)
  const panelRefs = useRef([])
  const mediaRefs = useRef([])
  const barRefs = useRef([])
  const textRefs = useRef([])
  const tlRef = useRef(null)
  const firstRunRef = useRef(true)
  const mediaSizeRef = useRef(320)

  // Keep the same horizontal accordion interaction in the narrow preview.
  // The old breakpoint forced every panel into a vertical strip, so hover
  // could only change height and the selected image still looked collapsed.
  const vertical = orientation === 'vertical'
  const count = items.length
  const isEmbeddedPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('viewportPreview') === '1'
  const [active, setActive] = useState(clamp(defaultIndex, 0, count - 1))
  const [hasInteracted, setHasInteracted] = useState(false)
  const [openedIndex, setOpenedIndex] = useState(null)
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? isEmbeddedPreview || window.matchMedia('(max-width: 700px)').matches
      : false
  )
  const videoRefs = useRef([])
  const touchGestureRef = useRef({ pointerId: null, startX: 0, startY: 0 })
  const suppressClickRef = useRef(false)
  const autoHoldUntilRef = useRef(0)

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  const layoutExpandRatio = isMobileViewport ? Math.min(expandRatio, 0.42) : expandRatio

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined

    const query = window.matchMedia('(max-width: 700px)')
    const updateViewport = () => setIsMobileViewport(isEmbeddedPreview || query.matches)
    updateViewport()
    query.addEventListener?.('change', updateViewport)
    return () => query.removeEventListener?.('change', updateViewport)
  }, [])

  // Keep the ambient phone carousel, but let a manual tap/drag hold the
  // selected panel long enough for the second tap to open its image viewer.
  useEffect(() => {
    if (!isMobileViewport || prefersReduced || count < 2 || openedIndex !== null) return undefined

    let timer = 0
    const advance = () => {
      if (Date.now() < autoHoldUntilRef.current) return
      setActive((current) => (current + 1) % count)
    }
    const start = () => {
      if (!timer) timer = window.setInterval(advance, 2000)
    }
    const observer = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) start()
          else if (timer) {
            window.clearInterval(timer)
            timer = 0
          }
        }, { threshold: 0 })
    if (rootRef.current) observer?.observe(rootRef.current)
    else start()

    return () => {
      if (timer) window.clearInterval(timer)
      observer?.disconnect()
    }
  }, [count, isMobileViewport, openedIndex, prefersReduced])

  const applyLayout = useCallback(
    (animate) => {
      const panels = panelRefs.current
      if (!panels.length) return

      const r = clamp(layoutExpandRatio, 0.2, 0.9)
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1
      const mediaSize = mediaSizeRef.current

      tlRef.current?.kill()
      const dur = animate && !prefersReduced ? duration : 0
      const tl = gsap.timeline()

      panels.forEach((panel, i) => {
        if (!panel) return
        const isActive = i === active
        const media = mediaRefs.current[i]
        const bar = barRefs.current[i]
        const text = textRefs.current[i]

        const rot = isActive ? 0 : i < active ? tilt : -tilt
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot }

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0)

        if (media) {
          const isImageSet = media.classList.contains('ag-panel__media--set')
          const drift = clamp(active - i, -1.5, 1.5)
          const shift = drift * parallax * mediaSize * 0.06
          const gray = grayscale ? (isActive ? 0 : isMobileViewport ? 0.25 : 1) : 0
          tl.to(
            media,
            {
              xPercent: isImageSet ? 0 : -50,
              yPercent: -50,
              x: isImageSet ? 0 : vertical ? 0 : isActive ? 0 : shift,
              y: isImageSet ? 0 : vertical ? (isActive ? 0 : shift) : 0,
              '--ag-gray': gray,
              '--ag-dim': isActive ? 0 : isMobileViewport ? 0.08 : 0.35,
              duration: dur,
              ease,
            },
            0
          )
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0)
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0)
          }
        }
      })

      tlRef.current = tl
    },
    [active, count, layoutExpandRatio, duration, ease, vertical, tilt, parallax, grayscale, showLabels, stagger, prefersReduced, isMobileViewport]
  )

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const measure = () => {
      const rect = el.getBoundingClientRect()
      const total = vertical ? rect.height : rect.width
      const usable = Math.max(total - gap * (count - 1), 120)
      const ratio = clamp(layoutExpandRatio, 0.2, 0.9)
      const size = Math.max(140, usable * ratio * 1.22)
      mediaSizeRef.current = size
      el.style.setProperty('--ag-media-size', `${size}px`)
      applyLayout(!firstRunRef.current)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [applyLayout, gap, count, layoutExpandRatio, vertical, isMobileViewport])

  useEffect(() => {
    applyLayout(!firstRunRef.current)
    firstRunRef.current = false
  }, [applyLayout])

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return

      if (i === active && hasInteracted) {
        try {
          video.currentTime = 0
        } catch {
          // The video metadata may still be loading.
        }
        const playPromise = video.play()
        if (playPromise) playPromise.catch(() => {})
      } else {
        video.pause()
        try {
          video.currentTime = 0
        } catch {
          // Reset only after the source is ready.
        }
      }
    })
  }, [active, hasInteracted, items])

  useEffect(() => () => tlRef.current?.kill(), [])

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, count)
  }, [count])

  useEffect(() => {
    if (openedIndex === null) return undefined

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpenedIndex(null)
    }
    const closeOnResize = () => {
      if (!isPortraitPhone()) setOpenedIndex(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    window.addEventListener('resize', closeOnResize)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('resize', closeOnResize)
    }
  }, [openedIndex])

  const handleEnter = (i) => {
    if (trigger === 'hover' && !isMobileViewport) {
      setHasInteracted(true)
      setActive(i)
    }
  }

  const handlePointerDown = (event) => {
    if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return
    touchGestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    }
    suppressClickRef.current = false
  }

  const handlePointerUp = (event) => {
    const gesture = touchGestureRef.current
    if (gesture.pointerId !== event.pointerId) return
    const deltaX = event.clientX - gesture.startX
    const deltaY = event.clientY - gesture.startY
    touchGestureRef.current.pointerId = null

    // A horizontal finger drag moves the accordion one panel at a time while
    // leaving vertical page scrolling to the browser.
    if (isMobileViewport && Math.abs(deltaX) > 24 && Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault()
      suppressClickRef.current = true
      autoHoldUntilRef.current = Date.now() + 5000
      setHasInteracted(true)
      setActive((current) => (current + (deltaX < 0 ? 1 : -1) + count) % count)
    }
  }

  const handleClick = (i, e) => {
    setHasInteracted(true)
    e.preventDefault()
    autoHoldUntilRef.current = Date.now() + 5000

    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }

    if (isMobileViewport || isPortraitPhone()) {
      // First tap selects/expands the panel. A second tap on the already
      // expanded panel opens its full-screen image viewer.
      if (i !== active) {
        setActive(i)
        setOpenedIndex(null)
        return
      }
      setOpenedIndex(i)
      return
    }

    setActive(i)
    setOpenedIndex(i)
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      setHasInteracted(true)
      setActive((i + 1) % count)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      setHasInteracted(true)
      setActive((i - 1 + count) % count)
    } else if ((e.key === 'Enter' || e.key === ' ') && i === active && isPortraitPhone()) {
      e.preventDefault()
      setOpenedIndex(i)
    }
  }

  const rootStyle = {
    '--ag-accent': accentColor,
    '--ag-overlay': overlayColor,
    '--ag-text': textColor,
    '--ag-gap': `${gap}px`,
    '--ag-radius': `${radius}px`,
    height: vertical ? `${Math.round(height * 1.6) + 15}px` : `${height + 15}px`,
  }
  const openedItem = openedIndex !== null ? items[openedIndex] : null
  const [openedLabelMain, ...openedLabelRest] = String(openedItem?.label || '').split(/\s*\/\s*/)
  const openedLabelSecondary = openedLabelRest.join(' / ')

  return (
    <>
      <div
        ref={rootRef}
        className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${isMobileViewport ? ' is-mobile-preview' : ''}${className ? ` ${className}` : ''}`}
        style={rootStyle}
        role="list"
        aria-label="Media accordion gallery"
      >
        {items.map((item, i) => {
          const isActive = i === active
          const [labelMain, ...labelRest] = String(item.label || '').split(/\s*\/\s*/)
          const labelSecondary = labelRest.join(' / ')
          const Tag = item.link ? 'a' : 'div'
          return (
            <Tag
              key={i}
              ref={(el) => {
                panelRefs.current[i] = el
              }}
              className={`ag-panel${isActive ? ' ag-panel--active' : ''}`}
              style={{ borderRadius: `${radius}px` }}
              href={item.link || undefined}
              onClick={(e) => handleClick(i, e)}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={(event) => {
                if (touchGestureRef.current.pointerId === event.pointerId) touchGestureRef.current.pointerId = null
              }}
              onMouseEnter={() => handleEnter(i)}
              onFocus={() => {
                setHasInteracted(true)
                if (!isMobileViewport) setActive(i)
              }}
              onKeyDown={(e) => handleKeyDown(i, e)}
              role="listitem"
              tabIndex={0}
              aria-current={isActive ? 'true' : undefined}
              aria-label={item.label}
            >
              <span className="ag-panel__frame">
                <span
                  className={`ag-panel__media${item.images?.length ? ' ag-panel__media--set' : ''}`}
                  ref={(el) => {
                    mediaRefs.current[i] = el
                  }}
                >
                  {item.images?.length ? (
                    <span className={`ag-set-collage${item.images.length === 6 ? ' ag-set-collage--six' : ''}${item.images.length === 9 ? ' ag-set-collage--nine' : ''}`} aria-hidden="true">
                      {item.images.map((image, imageIndex) => (
                        <span className="ag-set-collage__cell" key={image}>
                          <img src={image} alt="" loading={isMobileViewport || isActive ? 'eager' : 'lazy'} decoding="async" draggable={false} />
                          {item.imageCaptions?.[imageIndex] ? (
                            <span className="ag-set-collage__caption">
                              {item.imageCaptions[imageIndex]}
                            </span>
                          ) : null}
                        </span>
                      ))}
                    </span>
                  ) : item.image && (
                    <img src={item.image} alt={item.alt || item.label || ''} loading={isMobileViewport || isActive ? 'eager' : 'lazy'} decoding="async" draggable={false} />
                  )}
                  {item.video && (
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el
                      }}
                      className="ag-panel__video"
                      src={item.video}
                      poster={item.poster || item.image}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      tabIndex={-1}
                      draggable={false}
                    />
                  )}
                </span>
                <span className="ag-panel__overlay" aria-hidden="true" />
              </span>
              {showLabels && (
                <span className="ag-panel__label" aria-hidden="true">
                  <span
                    className="ag-panel__bar"
                    ref={(el) => {
                      barRefs.current[i] = el
                    }}
                  />
                  <span
                    className="ag-panel__text"
                    ref={(el) => {
                      textRefs.current[i] = el
                    }}
                  >
                    <span className="ag-panel__textMain">{labelMain}</span>
                    {labelSecondary ? <span className="ag-panel__textSecondary">{labelSecondary}</span> : null}
                  </span>
                </span>
              )}
            </Tag>
          )
        })}
      </div>
      {openedItem && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="ag-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={openedItem.label}
              onClick={() => setOpenedIndex(null)}
            >
              <div className="ag-lightbox__header" onClick={(event) => event.stopPropagation()}>
                <span className="ag-lightbox__headerMain">{openedLabelMain}</span>
                {openedLabelSecondary ? <span className="ag-lightbox__headerSecondary">{openedLabelSecondary}</span> : null}
              </div>
              <button
                type="button"
                className="ag-lightbox__close"
                aria-label="关闭大图"
                onClick={() => setOpenedIndex(null)}
              >
                ×
              </button>
              <div className="ag-lightbox__imageWrap" onClick={() => setOpenedIndex(null)}>
                {openedItem.images?.length ? (
                  <div className={`ag-set-collage ag-set-collage--lightbox${openedItem.images.length === 6 ? ' ag-set-collage--six' : ''}${openedItem.images.length === 9 ? ' ag-set-collage--nine' : ''}`} aria-hidden="true">
                    {openedItem.images.map((image, imageIndex) => (
                      <span className="ag-set-collage__cell" key={image}>
                        <img src={image} alt="" loading="eager" decoding="async" />
                        {openedItem.imageCaptions?.[imageIndex] ? (
                          <span className="ag-set-collage__caption">
                            {openedItem.imageCaptions[imageIndex]}
                          </span>
                        ) : null}
                      </span>
                    ))}
                  </div>
                ) : openedItem.image && (
                  <img
                    src={openedItem.image}
                    alt={openedItem.alt || openedItem.label || ''}
                    loading="eager"
                    decoding="async"
                  />
                )}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  )
}

export default AccordionGallery
