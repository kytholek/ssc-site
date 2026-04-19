// Name formatting utilities for privacy
export function formatDisplayName(fullName) {
  if (!fullName || typeof fullName !== 'string') return ''
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  return `${parts[0]} ${parts[1][0].toUpperCase()}.`
}
