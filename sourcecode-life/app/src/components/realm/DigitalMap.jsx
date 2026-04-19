import { useState } from 'react'
import { buildAvatarPixels, loadAvatar } from '../../lib/avatarParts'
import { acceptQuest as qeAcceptQuest } from '../../lib/questEngine'
import { formatDisplayName } from '../../lib/formatters'
import { LS_MAP_QUESTS, QUEST_TYPES, loadQuests, saveQuests } from './sidequestHelpers'

// ── Constants ─────────────────────────────────────────────────────────────────
const LS_ALLIES          = 'scl_allies'
const LS_ACCEPTED_QUESTS = 'scl_accepted_quests'

const QUEST_TYPE_MAP = Object.fromEntries(QUEST_TYPES.map(t => [t.key, t]))

function getNodeColor(questTypes) {
  if (!questTypes || questTypes.length === 0) return '#00e5cc'
  const type = QUEST_TYPE_MAP[questTypes[0]]
  return type?.color || '#00e5cc'
}

const REALM_REGIONS = [
  { id: 'guildhall', title: 'Guildhall',     icon: '⚔', x: '18%', y: '26%', desc: 'Allies, invites, and social quests gather here.',          questTypes: ['connection']  },
  { id: 'wilds',     title: 'Starwilds',     icon: '✦', x: '50%', y: '14%', desc: 'Exploration threads and wandering encounters.',             questTypes: ['exploration'] },
  { id: 'forge',     title: 'Iron Forge',    icon: '▲', x: '80%', y: '28%', desc: 'Achievement quests and mastery trials.',                    questTypes: ['achievement'] },
  { id: 'sanctum',   title: 'Heart Sanctum', icon: '✚', x: '82%', y: '70%', desc: 'Healing, support, and restoration arcs.',                   questTypes: ['healing']    },
  { id: 'loom',      title: 'Story Loom',    icon: '◈', x: '50%', y: '82%', desc: 'Creation paths, expression, and future game portals.',      questTypes: ['creation']   },
  { id: 'oracle',    title: 'Mirror Oracle', icon: '◇', x: '18%', y: '70%', desc: 'Reflection quests, insight, and hidden signals.',           questTypes: ['reflection'] },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function loadAllies()   { try { return JSON.parse(localStorage.getItem(LS_ALLIES)           || '[]') } catch { return [] } }
function loadAccepted() { try { return JSON.parse(localStorage.getItem(LS_ACCEPTED_QUESTS) || '{}') } catch { return {} } }

function hashIndex(seed, modulo) {
  const str = String(seed || 'seed')
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  return modulo ? hash % modulo : 0
}

function regionForQuest(quest) {
  const direct = REALM_REGIONS.find(r => r.questTypes.includes(quest.type))
  if (direct) return direct.id
  return REALM_REGIONS[hashIndex(quest.id || quest.name, REALM_REGIONS.length)].id
}

function regionForAlly(ally, index) {
  return REALM_REGIONS[hashIndex(ally?.uid || ally?.name || index, REALM_REGIONS.length)].id
}

// ── Avatar Sigil ──────────────────────────────────────────────────────────────
function AvatarSigil({ playerData }) {
  const [avatarConfig] = useState(() => loadAvatar())
  const pixels  = avatarConfig ? buildAvatarPixels(avatarConfig) : []
  const initials = (playerData?.name || 'SEEKER').slice(0, 2).toUpperCase()

  return (
    <div className="rm-hero-sigil">
      {pixels.length > 0
        ? (
            <svg viewBox="-1 -3 18 30" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ imageRendering: 'pixelated', display: 'block' }}>
              {pixels.map((pixel, i) => (
                <rect key={i} x={pixel.x} y={pixel.y} width={0.95} height={0.95} fill={pixel.c} />
              ))}
            </svg>
          )
        : <span className="rm-hero-initials">{initials}</span>}
    </div>
  )
}

// ── Digital Map ───────────────────────────────────────────────────────────────
export default function DigitalMapView({ playerData }) {
  const [quests, setQuests]       = useState(() => loadQuests())
  const [allies]                  = useState(() => loadAllies())
  const [selectedRegion, setSelectedRegion] = useState('guildhall')
  const myUid = playerData?.uid || playerData?.name || 'me'

  function handleAccept(questId) {
    const quest = quests.find(q => q.id === questId) || { id: questId }
    qeAcceptQuest(quest)
    setQuests([...loadQuests()])
  }

  const questsByRegion = REALM_REGIONS.reduce((acc, r) => { acc[r.id] = []; return acc }, {})
  quests.forEach(quest => { questsByRegion[regionForQuest(quest)].push(quest) })

  const alliesByRegion = REALM_REGIONS.reduce((acc, r) => { acc[r.id] = []; return acc }, {})
  allies.forEach((ally, i) => { alliesByRegion[regionForAlly(ally, i)].push(ally) })

  const activeRegion  = REALM_REGIONS.find(r => r.id === selectedRegion) || REALM_REGIONS[0]
  const regionQuests  = questsByRegion[activeRegion.id] || []
  const regionAllies  = alliesByRegion[activeRegion.id] || []
  const acceptedQuests = loadAccepted()

  return (
    <div className="rm-digital-view rm-realm-view">
      <div className="rm-realm-banner">
        <div>
          <div className="rm-realm-kicker">OVERWORLD INSTANCE</div>
          <div className="rm-realm-title">The Digital Realm</div>
          <div className="rm-realm-copy">A quest-layered fantasy map for your allies, social missions, and the future 2D character world.</div>
        </div>
        <div className="rm-realm-counts">
          <div className="rm-realm-count-pill">QUESTS {quests.length}</div>
          <div className="rm-realm-count-pill">ALLIES {allies.length}</div>
        </div>
      </div>

      <div className="rm-realm-stage-wrap">
        <div className="rm-digital-stage">
          <div className="rm-realm-aura rm-realm-aura-1" />
          <div className="rm-realm-aura rm-realm-aura-2" />
          <div className="rm-realm-path rm-realm-path-1" />
          <div className="rm-realm-path rm-realm-path-2" />
          <div className="rm-realm-path rm-realm-path-3" />

          {REALM_REGIONS.map(region => {
            const nodeColor = getNodeColor(region.questTypes)
            return (
              <button
                key={region.id}
                className={`rm-region-node${selectedRegion === region.id ? ' rm-region-node--selected' : ''}`}
                style={{ left: region.x, top: region.y, '--node-color': nodeColor }}
                onClick={() => setSelectedRegion(region.id)}
              >
                <span className="rm-region-node-icon">{region.icon}</span>
                <span className="rm-region-node-label">{region.title}</span>
              </button>
            )
          })}

          <div className="rm-realm-hero">
            <div className="rm-realm-hero-ring" />
            <AvatarSigil playerData={playerData} />
            <div className="rm-realm-hero-name">{formatDisplayName(playerData?.name || 'Seeker').toUpperCase()}</div>
            <div className="rm-realm-hero-stats">
              {playerData?.cl && <span>CL {playerData.cl.root}</span>}
              {playerData?.lp && <span>LP {playerData.lp.root}</span>}
              {playerData?.ex && <span>EX {playerData.ex.root}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="rm-realm-grid">
        <div className="rm-panel rm-region-panel" style={{ '--node-color': getNodeColor(activeRegion.questTypes) }}>
          <div className="rm-region-panel-title">{activeRegion.icon} {activeRegion.title.toUpperCase()}</div>
          <div className="rm-panel-body">
            <div className="rm-realm-panel-copy">{activeRegion.desc}</div>

            {regionQuests.length === 0 && (
              <div className="rm-empty">No quests are anchored here yet. Social quest drops will appear as beacons in this region.</div>
            )}

            {regionQuests.map(quest => (
              <div key={quest.id} className="rm-quest-card">
                <div className="rm-realm-quest-top">
                  <div>
                    <div className="rm-realm-quest-type">{(QUEST_TYPE_MAP[quest.type] || QUEST_TYPES[0]).label}</div>
                    <div className="rm-realm-quest-name">{quest.name}</div>
                  </div>
                  {quest.rewardNum && <div className="rm-realm-quest-reward">{quest.rewardNum}</div>}
                </div>
                {quest.description && <div className="rm-realm-quest-desc">{quest.description}</div>}
                <div className="rm-realm-quest-meta">
                  <span>{formatDisplayName(quest.playerName) || 'Unknown Seeker'}</span>
                  <span>{quest.uid === myUid ? 'YOUR BEACON' : 'ALLY QUEST'}</span>
                </div>
                <button
                  className={`rm-nearby-accept${acceptedQuests[quest.id] ? ' accepted' : ''}`}
                  onClick={() => !acceptedQuests[quest.id] && handleAccept(quest.id)}
                  disabled={!!acceptedQuests[quest.id]}
                >
                  {acceptedQuests[quest.id] ? '✓ IN YOUR LOG' : '▶ ACCEPT QUEST'}
                </button>
              </div>
            ))}

            {regionAllies.length > 0 && (
              <div className="rm-realm-ally-row">
                {regionAllies.map((ally, i) => (
                  <div key={ally.uid || ally.name || i} className="rm-realm-ally-chip">⚔ {formatDisplayName(ally.name) || 'Unknown Seeker'}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rm-panel rm-realm-panel">
          <div className="rm-panel-label">◈ FUTURE GATE</div>
          <div className="rm-panel-body">
            <div className="rm-realm-gate-card">
              <div className="rm-realm-gate-title">2D Realm Portal</div>
              <div className="rm-realm-gate-copy">This gate will eventually launch the 2D game using your avatar, numerology stats, and equipped build.</div>
              <div className="rm-realm-gate-stats">
                {playerData?.cl && <span>CALLING {playerData.cl.root}</span>}
                {playerData?.lp && <span>LIFE PATH {playerData.lp.root}</span>}
                {playerData?.ex && <span>EXPRESSION {playerData.ex.root}</span>}
                {playerData?.th && <span>THEME {playerData.th.root}</span>}
              </div>
              <button className="rm-realm-gate-btn" disabled>ENTER 2D REALM SOON</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
