import { xpInLevel, xpForNext } from '../lib/questEngine'

export const getCharBarPct = s => {
  const next = xpForNext(s.user.charLevel)
  if (!next) return 100
  return Math.round((xpInLevel(s.user.charXP, s.user.charLevel) / next) * 100)
}

export const getFreqBarPct = s => {
  const next = xpForNext(s.user.freqLevel)
  if (!next) return 100
  return Math.round((xpInLevel(s.user.freqXP, s.user.freqLevel) / next) * 100)
}
