import {
  getXPState,
  getDailyQuestState,
  getFreqLog,
  getAcceptedQuests,
  getLQP,
} from '../lib/questEngine'
import { checkPremiumActive, getPremiumExpiry } from '../lib/giftCodes'

/**
 * buildInitialState — called once at GameProvider mount.
 * Hydrates from localStorage via existing questEngine getters,
 * so no data migration is needed.
 */
export function buildInitialState() {
  const xp = getXPState()

  return {
    user: {
      charXP:        xp.charXP,
      charLevel:     xp.charLevel,
      freqXP:        xp.freqXP,
      freqLevel:     xp.freqLevel,
      statXP:        xp.statXP,  // { "0": n, "1": n, ... "9": n }  ← string/int keys
      isPremium:     checkPremiumActive(),
      premiumExpires: getPremiumExpiry(),
    },
    quests: {
      daily:      getDailyQuestState(),
      freqLog:    getFreqLog(),
      sideQuests: getAcceptedQuests(),
      lqp:        getLQP(),
    },
    ui: {
      toast:   null,   // { msg: string, color: string } — cleared after 2.2 s
      levelUp: null,   // { track: 'CHARACTER'|'FREQUENCY', level: number } — cleared after 3.6 s
    },
  }
}
