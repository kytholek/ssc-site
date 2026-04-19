/**
 * focusQuests.js — Lightweight persistence for pinned/focus quests.
 * 
 * Users can pin one main quest and one side quest to surface them
 * on the Home tab for quick access without opening the Quests tab.
 */

const LS_FOCUS_QUEST = 'scl_focus_quest'

/**
 * Save a focus quest.
 * @param {{ id: string, type: string, title: string, subtitle?: string }} quest
 */
export function saveFocusQuest(quest) {
  try {
    localStorage.setItem(LS_FOCUS_QUEST, JSON.stringify(quest || null))
    window.dispatchEvent(new CustomEvent('scl:focus_quest_changed', { detail: quest }))
  } catch { /* noop */ }
}

/**
 * Load the current focus quest, or null.
 */
export function loadFocusQuest() {
  try {
    return JSON.parse(localStorage.getItem(LS_FOCUS_QUEST) || 'null')
  } catch {
    return null
  }
}

/**
 * Clear the focus quest.
 */
export function clearFocusQuest() {
  try {
    localStorage.removeItem(LS_FOCUS_QUEST)
  } catch { /* noop */ }
}
