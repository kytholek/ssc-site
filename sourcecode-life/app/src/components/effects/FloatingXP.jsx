/**
 * FloatingXP — Animated floating XP numbers that rise and fade
 * ParticleBurst — Burst of small particles on quest completion
 */
import { useEffect, useState } from 'react'

// ─── Floating XP Numbers ─────────────────────────────────────────────────────

let _xpId = 0
const _listeners = []

// Map CSS variables to actual colors for inline style usage
const CSS_VAR_MAP = {
  'var(--teal)': '#00e5cc',
  'var(--gold)': '#c9a84c',
  'var(--rose)': '#dc5078',
  'var(--sage)': '#78b464',
}

function resolveColor(color) {
  if (!color) return '#00e5cc'
  if (CSS_VAR_MAP[color]) return CSS_VAR_MAP[color]
  return color
}

export function showFloatingXP({ xp, color = '#00e5cc', x, y, bonus }) {
  const id = ++_xpId
  _listeners.forEach(fn => fn({ id, xp, color: resolveColor(color), x, y, bonus }))
  return id
}

export function useFloatingXP() {
  const [items, setItems] = useState([])

  useEffect(() => {
    function handle(payload) {
      setItems(prev => [...prev, payload])
      setTimeout(() => {
        setItems(prev => prev.filter(i => i.id !== payload.id))
      }, 2200)
    }
    _listeners.push(handle)
    return () => {
      const idx = _listeners.indexOf(handle)
      if (idx >= 0) _listeners.splice(idx, 1)
    }
  }, [])

  if (!items.length) return null

  return (
    <div className="floating-xp-container">
      {items.map(item => {
        const resolvedColor = item.color.startsWith('var(') ? '#00e5cc' : item.color
        return (
          <div
            key={item.id}
            className={`floating-xp${item.bonus ? ' floating-xp--bonus' : ''}`}
            style={{
              left: item.x,
              top: item.y,
              color: resolvedColor,
            }}
          >
            +{item.xp} XP{item.bonus ? ` (${item.bonus})` : ''}
          </div>
        )
      })}
    </div>
  )
}

// ─── Particle Burst ──────────────────────────────────────────────────────────

let _particleId = 0
const _particleListeners = []

export function showParticleBurst({ color = '#00e5cc', x, y, count = 12 }) {
  const id = ++_particleId
  _particleListeners.forEach(fn => fn({ id, color: resolveColor(color), x, y, count }))
  return id
}

export function useParticleBurst() {
  const [bursts, setBursts] = useState([])

  useEffect(() => {
    function handle(payload) {
      const particles = Array.from({ length: payload.count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / payload.count + (Math.random() - 0.5) * 0.5
        const dist = 40 + Math.random() * 60
        return {
          idx: i,
          px: `${Math.cos(angle) * dist}px`,
          py: `${Math.sin(angle) * dist}px`,
        }
      })
      setBursts(prev => [...prev, { id: payload.id, color: payload.color, x: payload.x, y: payload.y, particles }])
      setTimeout(() => {
        setBursts(prev => prev.filter(b => b.id !== payload.id))
      }, 1200)
    }
    _particleListeners.push(handle)
    return () => {
      const idx = _particleListeners.indexOf(handle)
      if (idx >= 0) _particleListeners.splice(idx, 1)
    }
  }, [])

  if (!bursts.length) return null

  return (
    <div className="particle-burst-container">
      {bursts.map(burst => (
        burst.particles.map(p => (
          <div
            key={`${burst.id}-${p.idx}`}
            className="particle"
            style={{
              left: burst.x,
              top: burst.y,
              background: burst.color,
              boxShadow: `0 0 6px ${burst.color}`,
              '--px': p.px,
              '--py': p.py,
            }}
          />
        ))
      ))}
    </div>
  )
}
