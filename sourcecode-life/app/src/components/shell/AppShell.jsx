/**
 * AppShell
 *
 * The authenticated app wrapper.
 * Renders the sticky Header, scrollable tab panel, and fixed TabBar.
 * Tab switching is driven by AppContext.activeTab.
 */
import { useEffect, useRef, useCallback } from 'react'
import { useAppState, useAppDispatch } from '../../context/AppContext'
import Header from './Header'
import TabBar from './TabBar'
import Toast from '../ui/Toast'
import PremiumModal from '../ui/PremiumModal'
import HomeTab   from '../tabs/home'
import QuestsTab from '../tabs/QuestsTab'
import MapTab    from '../tabs/MapTab'
import SkillsTab from '../tabs/SkillsTab'
import Profile   from '../tabs/profileTab'

const TABS = ['home', 'quests', 'map', 'profile', 'config']

export default function AppShell() {
  const { activeTab, showPremiumModal } = useAppState()
  const dispatch = useAppDispatch()
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)
  const mainRef = useRef(null)

  const resetTabScroll = useCallback(() => {
    const mainEl = mainRef.current
    if (mainEl) {
      mainEl.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    requestAnimationFrame(() => {
      if (mainEl) mainEl.scrollTop = 0
      window.scrollTo(0, 0)
    })
  }, [])

  // Scroll to top whenever the active tab changes
  useEffect(() => {
    resetTabScroll()
  }, [activeTab, resetTabScroll])

  // Deep-link handler — native bridge can call Native_onOpenTab(tab, subTab?)
  useEffect(() => {
    window.Native_onOpenTab = (tab, subTab) => {
      const valid = new Set(TABS)
      if (valid.has(tab)) {
        dispatch({ type: 'SET_TAB', payload: tab })
        // Dispatch sub-tab event for tabs with sub-tabs
        // Trigger event IMMEDIATELY after tab dispatch so listener fires before component renders
        setTimeout(() => {
          if (subTab) {
            window.dispatchEvent(new CustomEvent('scl:open-sub-tab', { 
              detail: { main: tab, sub: subTab } 
            }))
          }
        }, 50)
      }
    }
    return () => { delete window.Native_onOpenTab }
  }, [dispatch])

  const switchToTab = useCallback((tab) => {
    dispatch({ type: 'SET_TAB', payload: tab })
  }, [dispatch])

  // Swipe handling — disabled on map tab to avoid clashing with map pan
  function handleTouchStart(e) {
    if (activeTab === 'map') return
    if (e.target.closest('.map-container-wrap')) return
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  function handleTouchEnd(e) {
    if (activeTab === 'map') return
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    touchStartX.current = null
    touchStartY.current = null
    // Only trigger if horizontal swipe dominates and exceeds threshold
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    const idx = TABS.indexOf(activeTab)
    if (dx < 0 && idx < TABS.length - 1) switchToTab(TABS[idx + 1]) // swipe left → next
    if (dx > 0 && idx > 0)               switchToTab(TABS[idx - 1]) // swipe right → prev
  }

  return (
    <div className="app-shell">
      <Header onTabChange={switchToTab} />

      {/* Tab panels — only the active one is rendered */}
      <main
        ref={mainRef}
        className="app-main"
        role="main"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <TabPanel key={activeTab}>
          {activeTab === 'home'     && <HomeTab    />}
          {activeTab === 'quests'   && <QuestsTab  />}
          {activeTab === 'map'      && <MapTab     />}
          {activeTab === 'profile'  && <SkillsTab  />}
          {activeTab === 'config'   && <Profile    />}
        </TabPanel>
      </main>

      <TabBar onTabChange={switchToTab} />
      <Toast />
      <PremiumModal open={showPremiumModal} onClose={() => dispatch({ type: 'CLOSE_PREMIUM_MODAL' })} />
    </div>
  )
}

/* ── Animated tab panel wrapper ─────────────────────────────── */
function TabPanel({ children }) {
  return (
    <div className="sm-tab-panel">{children}</div>
  )
}
