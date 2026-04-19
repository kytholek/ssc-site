// sidequestHelpers.js — shared constants and utilities for side quest components

export const LS_MAP_QUESTS = 'scl_map_quests'

export const QUEST_TYPES = [
  { key: 'exploration', label: '🗺 EXPLORE' },
  { key: 'connection',  label: '⚔ CONNECT'  },
  { key: 'achievement', label: '▲ ACHIEVE'  },
  { key: 'healing',     label: '✦ HEAL'     },
  { key: 'creation',    label: '◈ CREATE'   },
  { key: 'reflection',  label: '◇ REFLECT'  },
]

export const SEEKER_TYPES = ['solo', 'partner', 'group']

export const REWARD_NAMES = {
  1:'INITIATION', 2:'UNION', 3:'EXPRESSION', 4:'FOUNDATION', 5:'FREEDOM',
  6:'HARMONY', 7:'TRUTH', 8:'POWER', 9:'MASTERY',
}

export function loadQuests() {
  try {
    return JSON.parse(localStorage.getItem(LS_MAP_QUESTS) || '[]')
  } catch {
    return []
  }
}

export function saveQuests(quests) {
  try {
    localStorage.setItem(LS_MAP_QUESTS, JSON.stringify(quests))
  } catch {
    /* quota exceeded */
  }
}
