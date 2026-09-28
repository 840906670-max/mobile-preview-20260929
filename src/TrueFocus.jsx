import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import './TrueFocus.css'

export default function TrueFocus({
  sentence,
  separator = '｜',
  blurAmount = 3.5,
  borderColor = '#ee4f16',
  glowColor = 'rgba(238, 79, 22, .45)',
  animationDuration = .55,
  pauseBetweenAnimations = 1.4,
}) {
  const words = sentence.split(separator)
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)
  const wordRefs = useRef([])
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 })

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % words.length)
    }, (animationDuration + pauseBetweenAnimations) * 1000)
    return () => window.clearInterval(interval)
  }, [animationDuration, pauseBetweenAnimations, words.length])

  useLayoutEffect(() => {
    const updateRect = () => {
      const parent = containerRef.current
      const activeWord = wordRefs.current[currentIndex]
      if (!parent || !activeWord) return
      const parentRect = parent.getBoundingClientRect()
      const activeRect = activeWord.getBoundingClientRect()
      setFocusRect({
        x: activeRect.left - parentRect.left,
        y: activeRect.top - parentRect.top,
        width: activeRect.width,
        height: activeRect.height,
      })
    }

    updateRect()
    const animationFrame = window.requestAnimationFrame(updateRect)
    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(updateRect)
    if (containerRef.current) resizeObserver?.observe(containerRef.current)
    document.fonts?.ready?.then(updateRect)
    window.addEventListener('resize', updateRect)
    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', updateRect)
    }
  }, [currentIndex, words.length])

  return (
    <div className="trueFocus" ref={containerRef}>
      {words.map((word, index) => (
        <span
          key={word}
          ref={(element) => { wordRefs.current[index] = element }}
          className="trueFocusWord"
          style={{
            filter: index === currentIndex ? 'blur(0)' : `blur(${blurAmount}px)`,
            opacity: index === currentIndex ? 1 : .76,
            transition: `filter ${animationDuration}s ease, opacity ${animationDuration}s ease`,
          }}
        >
          {word}
        </span>
      ))}
      <motion.div
        className="trueFocusFrame"
        animate={{ x: focusRect.x, y: focusRect.y, width: focusRect.width, height: focusRect.height, opacity: 1 }}
        transition={{ duration: animationDuration, ease: 'easeOut' }}
        style={{ '--true-focus-border': borderColor, '--true-focus-glow': glowColor }}
        aria-hidden="true"
      >
        <i className="trueFocusCorner trueFocusCorner--tl" />
        <i className="trueFocusCorner trueFocusCorner--tr" />
        <i className="trueFocusCorner trueFocusCorner--bl" />
        <i className="trueFocusCorner trueFocusCorner--br" />
      </motion.div>
    </div>
  )
}
