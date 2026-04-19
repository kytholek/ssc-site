/**
 * DailyCountdown — Shows time remaining until next daily reset (midnight)
 */
import { useState, useEffect } from 'react'

function msUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return midnight.getTime() - now.getTime()
}

function formatCountdown(ms) {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function DailyCountdown() {
  const [remaining, setRemaining] = useState(msUntilMidnight())

  useEffect(() => {
    const interval = setInterval(() => {
      const ms = msUntilMidnight()
      if (ms <= 0) {
        // Reset at midnight
        setRemaining(0)
        // Trigger a page reload or quest refresh
        window.dispatchEvent(new CustomEvent('scl:daily_reset'))
        return
      }
      setRemaining(ms)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (remaining <= 0) return null

  return (
    <div className="daily-countdown">
      <span className="daily-countdown-icon">⏳</span>
      <span>Next reset in</span>
      <span className="daily-countdown-time">{formatCountdown(remaining)}</span>
    </div>
  )
}
