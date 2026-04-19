import { useState } from 'react'
import { useGameDispatch } from '../../state/GameContext'
import { ACTIONS } from '../../state/actions'
import { checkGiftCode, redeemGiftCode } from '../../lib/giftCodes'

export default function GiftCodeRedeemer({ uid, onSuccess }) {
  const gameDispatch = useGameDispatch()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  async function handlePreview() {
    if (!code.trim()) return
    const result = await checkGiftCode(code)
    if (result.valid) {
      const label = {
        'premium_3d': '3 days',
        'premium_7d': '7 days',
        'premium_30d': '30 days',
        'premium_90d': '90 days',
        'premium_365d': '365 days',
        'premium_lifetime': 'Lifetime',
      }[result.type] || '?'
      setPreview({ valid: true, label, type: result.type })
      setError('')
    } else {
      setPreview({ valid: false })
      setError(result.error)
    }
  }

  async function handleRedeem() {
    if (!code.trim()) return
    setLoading(true)
    setError('')
    const result = await redeemGiftCode(uid, code)
    console.log('📦 redeemGiftCode result:', result)
    if (result.ok) {
      console.log('🚀 Dispatching REDEEM_GIFT_CODE with daysGranted:', result.daysGranted)
      gameDispatch({ type: ACTIONS.REDEEM_GIFT_CODE, payload: { daysGranted: result.daysGranted } })
      setSuccess(`✓ ${result.daysGranted ? result.daysGranted + ' days' : 'Lifetime'} of premium activated!`)
      setCode('')
      setPreview(null)
      if (onSuccess) onSuccess(result)
    } else {
      setError(result.error)
      setPreview(null)
    }
    setLoading(false)
  }

  return (
    <div className="gift-redeemer">
      <div className="gift-redeemer-title">✦ REDEEM A CODE</div>
      <div className="gift-redeemer-input-row" style={{ flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          className="gift-redeemer-input"
          placeholder="SCL-GIFT-XXXXXXXX"
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); setPreview(null) }}
          onBlur={handlePreview}
          disabled={loading}
        />
        <button
          className="gift-redeemer-btn"
          onClick={handleRedeem}
          disabled={!code.trim() || loading || !preview?.valid}
          style={{ marginTop: '8px' }}
        >
          {loading ? 'REDEEMING…' : 'REDEEM'}
        </button>
      </div>
      {preview?.valid && (
        <div className="gift-redeemer-preview">✓ {preview.label} of premium</div>
      )}
      {error && <div className="gift-redeemer-error">{error}</div>}
      {success && <div className="gift-redeemer-success">{success}</div>}
    </div>
  )
}
