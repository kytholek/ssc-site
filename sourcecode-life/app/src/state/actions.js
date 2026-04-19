export const ACTIONS = {
  // XP / rewards
  EARN_CHAR_XP:        'EARN_CHAR_XP',
  EARN_FREQ_XP:        'EARN_FREQ_XP',
  EARN_STAT_XP:        'EARN_STAT_XP',

  // Quests
  COMPLETE_DAILY:      'COMPLETE_DAILY',
  COMPLETE_FREQ:       'COMPLETE_FREQ',
  COMPLETE_SIDE:       'COMPLETE_SIDE',
  ACCEPT_QUEST:        'ACCEPT_QUEST',
  CANCEL_QUEST:        'CANCEL_QUEST',

  // Batch reward — one dispatch covers charXP + freqXP + statXP + lqpMeta
  APPLY_REWARDS:       'APPLY_REWARDS',

  // Quest list refreshes
  REFRESH_DAILY:       'REFRESH_DAILY',
  REFRESH_FREQ_LOG:    'REFRESH_FREQ_LOG',
  REFRESH_SIDE_QUESTS: 'REFRESH_SIDE_QUESTS',
  REFRESH_LQP:         'REFRESH_LQP',

  // UI
  SET_TOAST:           'SET_TOAST',
  CLEAR_TOAST:         'CLEAR_TOAST',
  SET_LEVEL_UP:        'SET_LEVEL_UP',
  CLEAR_LEVEL_UP:      'CLEAR_LEVEL_UP',

  // Premium
  IS_PREMIUM:          'IS_PREMIUM',
  REDEEM_GIFT_CODE:    'REDEEM_GIFT_CODE',

  // Remote sync
  SYNC_FROM_FIRESTORE: 'SYNC_FROM_FIRESTORE',

  // Reset
  RESET_CHAR:          'RESET_CHAR',
}
