import { useRef, useState } from 'react'
import './PulseHeart.css'

function PulseHeart({
  defaultLiked = false,
  onChange,
  showCount = false,
  count = 0,
  size = 28,
  corner = 999,
  likedColor = '#ff7a3d',
  idleColor = 'rgba(246,243,237,.58)',
  pillColor = 'transparent',
  textColor = '#f5f5f5',
  duration = 560,
  label = '点赞',
  className = '',
}) {
  const [liked, setLiked] = useState(defaultLiked)
  const [total, setTotal] = useState(count)
  const [running, setRunning] = useState(false)
  const timerRef = useRef(null)

  const handleClick = () => {
    if (running) return
    const nextLiked = !liked
    const nextCount = total + (nextLiked ? 1 : -1)
    setLiked(nextLiked)
    setTotal(nextCount)
    setRunning(true)
    onChange?.(nextLiked, nextCount)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setRunning(false), duration)
  }

  return (
    <button
      type="button"
      className={`pulse-heart${className ? ` ${className}` : ''}`}
      aria-label={label}
      aria-pressed={liked}
      data-liked={String(liked)}
      data-running={running ? '' : undefined}
      style={{
        '--ph-size': `${size}px`,
        '--ph-corner': `${corner}px`,
        '--ph-pill': pillColor,
        '--ph-idle': idleColor,
        '--ph-liked': likedColor,
        '--ph-text': textColor,
        '--ph-duration': `${duration}ms`,
      }}
      onClick={handleClick}
    >
      <span className="pulse-heart__pill">
        <span className="pulse-heart__heart" aria-hidden="true">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
          </svg>
        </span>
        {showCount ? <span className="pulse-heart__count" aria-hidden="true">{total}</span> : null}
        <span className="pulse-heart__sr">{label}</span>
      </span>
    </button>
  )
}

export default PulseHeart
