/**
 * giftCodes.js — Premium gift code system
 *
 * Supports:
 * - Admin/campaign codes (lifetime, any duration) — created in Firebase console
 * - Earned gift codes (3d, 7d only) — created client-side when user earns gift tokens
 * - Single-use redemption with Firestore tracking
 * - Timed and lifetime premium grants
 */

import { db } from './firebase'
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore'
import { fetchUserProfile, updateUserProfileFields } from '../components/auth/firestoreprofile'

// ── localStorage keys ───────────────────────────────────────────────────────
export const LS_GIFT_TOKENS = 'scl_gift_tokens'
export const LS_PREMIUM_EXPIRES = 'scl_premium_expires'

// ── Premium State Helpers ───────────────────────────────────────────────────
export function checkPremiumActive() {
  if (localStorage.getItem('scl_premium') === '1') return true
  const exp = localStorage.getItem(LS_PREMIUM_EXPIRES)
  if (exp && new Date(exp) > new Date()) return true
  return false
}

export function getPremiumExpiry() {
  return localStorage.getItem(LS_PREMIUM_EXPIRES) || null
}

// ── Code Generation ────────────────────────────────────────────────────────
export function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `SCL-GIFT-${code}`
}

// ── Code Validation ────────────────────────────────────────────────────────
export async function checkGiftCode(code) {
  try {
    const upperCode = code.toUpperCase()
    console.log('🔍 Checking code:', upperCode)
    const ref = doc(db, 'giftCodes', upperCode)
    console.log('📍 Reference path:', ref.path)
    const snap = await getDoc(ref)
    console.log('📦 Document exists:', snap.exists(), 'Data:', snap.data())
    if (!snap.exists()) {
      return { valid: false, error: '⚠ Code not found' }
    }
    const data = snap.data()
    if (data.redeemedBy) {
      return { valid: false, error: '⚠ This code has already been redeemed' }
    }
    if (data.expiresAt && new Date(data.expiresAt.toDate()) < new Date()) {
      return { valid: false, error: '⚠ This code has expired' }
    }
    return {
      valid: true,
      type: data.type,
      daysGranted: data.daysGranted,
      createdBy: data.createdBy,
    }
  } catch (e) {
    return { valid: false, error: 'Error checking code: ' + e.message }
  }
}

// ── Create Earned Gift Code ────────────────────────────────────────────────
export async function createEarnedGiftCode(creatorUid, type) {
  try {
    // Only allow 3d and 7d for earned codes
    if (!['premium_3d', 'premium_7d'].includes(type)) {
      return { ok: false, error: 'Invalid earned gift type' }
    }

    const daysMap = { 'premium_3d': 3, 'premium_7d': 7 }
    const daysGranted = daysMap[type]
    const code = generateCode()

    // Write to Firestore
    const ref = doc(db, 'giftCodes', code)
    await setDoc(ref, {
      code,
      type,
      daysGranted,
      createdBy: creatorUid,
      redeemedBy: null,
      redeemedAt: null,
      expiresAt: null,
      metadata: {
        source: 'earned_gift',
        createdAt: new Date(),
      },
    })

    // Update user's giftTokensUsed
    await updateUserProfileFields(creatorUid, {
      giftTokensUsed: (await fetchUserProfile(creatorUid)).giftTokensUsed || 0 + 1,
    })

    return { ok: true, code }
  } catch (e) {
    return { ok: false, error: 'Error creating gift code: ' + e.message }
  }
}

// ── Redeem Gift Code ────────────────────────────────────────────────────────
export async function redeemGiftCode(uid, code) {
  try {
    const codeUpper = code.toUpperCase()

    // Validate code exists and is redeemable
    const validation = await checkGiftCode(codeUpper)
    if (!validation.valid) {
      return { ok: false, error: validation.error }
    }

    // Stamp as redeemed
    const ref = doc(db, 'giftCodes', codeUpper)
    await updateDoc(ref, {
      redeemedBy: uid,
      redeemedAt: new Date(),
    })

    const { type, daysGranted } = validation

    // Add to user's entitlements
    const profile = await fetchUserProfile(uid)
    const entitlements = profile.entitlements || []

    if (!daysGranted) {
      // Lifetime
      if (!entitlements.includes('premium_lifetime')) {
        entitlements.push('premium_lifetime')
      }
    } else {
      // Timed (3, 7, 30, 90, 365 days)
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + daysGranted)
      const expiryStr = expiryDate.toISOString()
      const timedEntry = `${type}:${expiryStr}`
      entitlements.push(timedEntry)
    }

    await updateUserProfileFields(uid, { entitlements })

    return { ok: true, type, daysGranted }
  } catch (e) {
    return { ok: false, error: 'Error redeeming code: ' + e.message }
  }
}
