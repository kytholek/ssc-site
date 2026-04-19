/**
 * useFocusTrap — traps keyboard focus within a container element.
 * Also handles Escape key to call onClose.
 *
 * Usage:
 *   const ref = useFocusTrap({ open, onClose })
 *   <div ref={ref}>...</div>
 */
import { useEffect, useRef, useCallback } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export function useFocusTrap({ open, onClose }) {
  const containerRef = useRef(null)
  const previousFocusRef = useRef(null)

  const handleKeyDown = useCallback((e) => {
    if (!open || !containerRef.current) return

    // Escape key
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      if (onClose) onClose()
      return
    }

    // Tab trapping
    if (e.key !== 'Tab') return

    const focusable = containerRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
    if (!focusable.length) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      // Shift+Tab: if on first element, wrap to last
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      // Tab: if on last element, wrap to first
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return

    // Store the previously focused element
    previousFocusRef.current = document.activeElement

    // Focus the first focusable element in the container
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const focusable = containerRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
        if (focusable.length) {
          focusable[0].focus()
        } else {
          // If nothing focusable, focus the container itself
          containerRef.current.setAttribute('tabindex', '-1')
          containerRef.current.focus()
        }
      }
    }, 50)

    // Add keydown listener
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown, true)

      // Restore focus
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus()
      }
    }
  }, [open, handleKeyDown])

  return containerRef
}
