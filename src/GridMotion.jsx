import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import './GridMotion.css'

const getImageUrl = (item) => {
  const raw = item?.props?.style?.['--workflow-image']
  if (typeof raw !== 'string') return null
  const match = raw.match(/^url\((['"]?)(.*?)\1\)$/)
  return (match ? match[2] : raw).trim()
}

export default function GridMotion({ items = [], gradientColor = '#e45830' }) {
  const rootRef = useRef(null)
  const rowRefs = useRef([])
  const motionRef = useRef({
    offset: 0,
    dragging: false,
    hovered: false,
    pointerX: 0,
    moved: false,
    pendingItem: null,
    openedPointer: false,
  })
  const [activeItem, setActiveItem] = useState(null)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [activeImageSize, setActiveImageSize] = useState(null)
  const activeImageUrl = getImageUrl(activeItem)

  useEffect(() => {
    setActiveImageSize(null)
  }, [activeItem])

  const rowCount = 4
  const displayItems = items.length > 0
    ? items
    : Array.from({ length: 28 }, (_, index) => `项目节点 ${index + 1}`)
  const columnCount = Math.ceil(displayItems.length / rowCount)
  const copyCount = 3

  useEffect(() => {
    const motion = motionRef.current
    let isVisible = false
    let isPageVisible = !document.hidden
    const tick = () => {
      if (!isVisible || !isPageVisible) return
      if (!motion.dragging && !motion.hovered) motion.offset += .34
      rowRefs.current.forEach((row, index) => {
        if (!row) return
        const cycleItems = Number(row.dataset.cycleItems) || Math.max(1, Math.floor(row.children.length / copyCount))
        const firstItem = row.children[0]
        const nextCycleItem = row.children[cycleItems]
        const loopWidth = Math.max(nextCycleItem?.offsetLeft - firstItem?.offsetLeft || row.scrollWidth, 1)
        const phase = (motion.offset + index * 68) % loopWidth
        const shift = (phase + loopWidth) % loopWidth
        gsap.set(row, { x: -shift })
      })
    }
    gsap.ticker.add(tick)
    const observer = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(([entry]) => {
          isVisible = entry.isIntersecting
        }, { threshold: 0 })
    if (rootRef.current) observer?.observe(rootRef.current)
    const onVisibilityChange = () => {
      isPageVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      gsap.ticker.remove(tick)
      observer?.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  const beginDrag = (event) => {
    const motion = motionRef.current
    motion.hovered = true
    if (!event.target.closest?.('.gridMotionItem')) motion.pendingItem = null
    motion.dragging = true
    motion.pointerX = event.clientX
    motion.moved = false
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const drag = (event) => {
    const motion = motionRef.current
    if (!motion.dragging) {
      motion.hovered = true
      return
    }
    const delta = event.clientX - motion.pointerX
    if (Math.abs(delta) > 4) motion.moved = true
    motion.offset -= delta * .9
    motion.pointerX = event.clientX
  }

  const endDrag = (event) => {
    const motion = motionRef.current
    if (!motion.moved && motion.pendingItem) {
      motion.openedPointer = true
      setActiveItem(motion.pendingItem)
    }
    motion.pendingItem = null
    motion.dragging = false
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      motion.hovered = false
      setHoveredItem(null)
    }
    // Pointer-up is also followed by a native click. Keep the small amount of
    // state needed to let that click be consumed without opening twice, then
    // clear it for touch interactions that do not dispatch click.
    setTimeout(() => {
      motion.moved = false
      motion.openedPointer = false
    }, 0)
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <div
      ref={rootRef}
      className="gridMotion"
      style={{ '--grid-motion-glow': gradientColor }}
      onPointerDown={beginDrag}
      onPointerMove={drag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={() => { motionRef.current.hovered = true }}
      onPointerLeave={() => {
        motionRef.current.hovered = false
        setHoveredItem(null)
      }}
      aria-label="可左右拖动的项目流程网格"
    >
      <div className="gridMotionCanvas">
        {Array.from({ length: rowCount }, (_, rowIndex) => {
          const rowItems = Array.from({ length: columnCount }, (_, itemIndex) => displayItems[rowIndex * columnCount + itemIndex]).filter(Boolean)
          const rowColumns = rowItems.reduce((sum, item) => sum + (item?.props?.className?.includes('workflowGridTile--landscape') ? 2 : 1), 0)
          const cells = Array.from({ length: copyCount }, () => rowItems).flat()
          return (
            <div
              className="gridMotionRow"
              key={rowIndex}
              ref={(node) => { rowRefs.current[rowIndex] = node }}
              data-cycle-items={rowItems.length}
              style={{ gridTemplateColumns: `repeat(${Math.max(rowColumns * copyCount, 1)}, minmax(148px, 1fr))` }}
            >
              {cells.map((item, itemIndex) => {
                const landscape = item?.props?.className?.includes('workflowGridTile--landscape')
                const itemKey = `${rowIndex}-${itemIndex}`
                return (
                  <div
                    className={`gridMotionItem${landscape ? ' gridMotionItem--landscape' : ''}${hoveredItem === itemKey ? ' is-hovered' : ''}`}
                    key={itemKey}
                    role="button"
                    tabIndex={0}
                    aria-label="单击放大图片"
                    onPointerEnter={() => {
                      motionRef.current.hovered = true
                      setHoveredItem(itemKey)
                    }}
                    onPointerLeave={() => { setHoveredItem(null) }}
                    onPointerDown={() => {
                      motionRef.current.pendingItem = item
                      motionRef.current.openedPointer = false
                    }}
                    onClick={() => {
                      const motion = motionRef.current
                      if (motion.openedPointer) {
                        motion.openedPointer = false
                        return
                      }
                      if (motion.moved) {
                        motion.moved = false
                        return
                      }
                      setActiveItem(item)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setActiveItem(item)
                      }
                    }}
                  >
                    {item}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      <div className="gridMotionOverlay" aria-hidden="true" />
      <p className="gridMotionHint">
        <span className="gridMotionHintZh">单击查看</span>
        <span className="gridMotionHintEn">CLICK TO VIEW</span>
      </p>
      {activeItem && createPortal(
        <div
          className="gridMotionLightbox"
          role="dialog"
          aria-modal="true"
          aria-label="放大查看作品"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              event.stopPropagation()
              setActiveItem(null)
            }
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveItem(null)
          }}
        >
          <div
            className={`gridMotionLightboxFrame${activeImageUrl ? ' gridMotionLightboxFrame--image' : ''}`}
            style={activeImageSize ? { width: `${activeImageSize.width}px`, height: `${activeImageSize.height}px` } : undefined}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => setActiveItem(null)}
          >
            {activeImageUrl ? (
              <img
                className="gridMotionLightboxImage"
                src={activeImageUrl}
                alt="放大查看作品素材"
                loading="eager"
                decoding="async"
                onLoad={(event) => {
                  const image = event.currentTarget
                  const ratio = image.naturalWidth / image.naturalHeight
                  const maxWidth = Math.min(window.innerWidth * .88, 1000)
                  const maxHeight = Math.min(window.innerHeight * .72, 760)
                  const width = Math.min(maxWidth, maxHeight * ratio)
                  setActiveImageSize({ width, height: width / ratio })
                }}
              />
            ) : activeItem}
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
