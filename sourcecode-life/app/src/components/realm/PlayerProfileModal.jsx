import { useState, useEffect } from 'react'
import { fetchCreatorReputation, fetchTakerReputation } from '../auth/firestoreprofile'
import { formatDisplayName } from '../../lib/formatters'
import PremiumBadge from '../ui/PremiumBadge'

export default function PlayerProfileModal({ player, onClose }) {
  const [creatorRep, setCreatorRep] = useState(null)
  const [takerRep, setTakerRep] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!player?.uid) {
      setLoading(false)
      return
    }

    const loadReps = async () => {
      setLoading(true)
      const [cRep, tRep] = await Promise.all([
        fetchCreatorReputation(player.uid),
        fetchTakerReputation(player.uid),
      ])
      setCreatorRep(cRep)
      setTakerRep(tRep)
      setLoading(false)
    }

    loadReps()
  }, [player?.uid])

  if (!player) return null

  const creatorAvg = creatorRep && creatorRep.ratingCount > 0
    ? (creatorRep.totalRating / creatorRep.ratingCount).toFixed(1)
    : null

  const takerAvg = takerRep && takerRep.ratingCount > 0
    ? (takerRep.totalRating / takerRep.ratingCount).toFixed(1)
    : null

  const completionPct = creatorRep && (creatorRep.completions + creatorRep.noShows) > 0
    ? Math.round(creatorRep.completions / (creatorRep.completions + creatorRep.noShows) * 100)
    : null

  return (
    <div className="ppm-overlay" onClick={onClose}>
      <div className="ppm-modal" onClick={e => e.stopPropagation()}>
        <button className="ppm-close" onClick={onClose}>✕</button>

        <div className="ppm-header">
          <div className="ppm-name">{formatDisplayName(player.name) || 'Unknown Seeker'}</div>
          {player.isPremium && (
            <div className="ppm-premium-badge">
              <PremiumBadge size="sm" /> PREMIUM
            </div>
          )}
        </div>

        <div className="ppm-stats">
          {[['CL', player.cl, '#00e5cc'], ['LP', player.lp, '#d4a843'],
            ['EX', player.ex, '#a070ff']].filter(([, v]) => v).map(([k, v, c]) => (
            <div key={k} className="ppm-stat">
              <div className="ppm-stat-label">{k}</div>
              <div className="ppm-stat-value" style={{ color: c }}>{v}</div>
            </div>
          ))}
        </div>

        <div className="ppm-rep-section">
          <div className="ppm-rep-label">⭐ CREATOR REPUTATION</div>
          {loading ? (
            <div className="ppm-rep-loading">…</div>
          ) : creatorRep && creatorRep.ratingCount > 0 ? (
            <div className="ppm-rep-content">
              <div className="ppm-rep-stars">
                {[1,2,3,4,5].map(n => (
                  <span key={n} className={`ppm-rep-star${Math.ceil(creatorAvg) >= n ? ' filled' : ''}`}>★</span>
                ))}
              </div>
              <div className="ppm-rep-text">
                <span>{creatorAvg} rating · {creatorRep.ratingCount} quests</span>
                {completionPct !== null && <span>✔ {completionPct}% completion</span>}
              </div>
            </div>
          ) : (
            <div className="ppm-rep-empty">◈ No ratings yet</div>
          )}
        </div>

        <div className="ppm-rep-section">
          <div className="ppm-rep-label">⭐ SEEKER REPUTATION</div>
          {loading ? (
            <div className="ppm-rep-loading">…</div>
          ) : takerRep && takerRep.ratingCount > 0 ? (
            <div className="ppm-rep-content">
              <div className="ppm-rep-stars">
                {[1,2,3,4,5].map(n => (
                  <span key={n} className={`ppm-rep-star${Math.ceil(takerAvg) >= n ? ' filled' : ''}`}>★</span>
                ))}
              </div>
              <div className="ppm-rep-text">
                <span>{takerAvg} rating · {takerRep.ratingCount} rated</span>
              </div>
            </div>
          ) : (
            <div className="ppm-rep-empty">◈ No ratings yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
