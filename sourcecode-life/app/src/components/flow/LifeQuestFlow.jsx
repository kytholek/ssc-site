import { useState, useMemo, useCallback } from 'react'
import ReactFlow, { Handle, Position, Background } from 'reactflow'
import 'reactflow/dist/style.css'
import { fmt } from '../../lib/numerology'
import FlowDetailPanel from './FlowDetailPanel'

const NODE_SIZE = 160
const CENTER_X = 400
const CENTER_Y = 280

// Hourglass/double triangle layout - spaced for 160px nodes
const LIFE_LAYOUT = {
  so: { x: CENTER_X - 240, y: CENTER_Y - 380 },
  ou: { x: CENTER_X + 240, y: CENTER_Y - 380 },
  ex: { x: CENTER_X,       y: CENTER_Y - 190 },
  cl: { x: CENTER_X,       y: CENTER_Y },
  lp: { x: CENTER_X,       y: CENTER_Y + 190 },
  ac: { x: CENTER_X - 240, y: CENTER_Y + 380 },
  th: { x: CENTER_X + 240, y: CENTER_Y + 380 },
}

const LIFE_EDGES = [
  ['so', 'ex'],
  ['ou', 'ex'],
  ['ex', 'cl'],
  ['cl', 'lp'],
  ['lp', 'ac'],
  ['lp', 'th'],
]

const NODE_ICONS = {
  so: '💎',
  ou: '🎭',
  ex: '🔧',
  cl: '⭐',
  lp: '🛤️',
  ac: '🏆',
  th: '📜',
}

// Map CSS variable tokens to hex values for inline styles
const COLOR_HEX = {
  '--teal':   '#00e5b4',
  '--gold':   '#c9a84c',
  '--amber':  '#ff9500',
  '--rose':   '#dc5078',
  '--purple': '#7b61ff',
  '--sage':   '#78b464',
  '--silver': '#c0c0c0',
}
const COLOR_GLOW = {
  '--teal':   '#00e5b466',
  '--gold':   '#c9a84c66',
  '--amber':  '#ff950066',
  '--rose':   '#dc507866',
  '--purple': '#7b61ff66',
  '--sage':   '#78b46466',
  '--silver': '#c0c0c066',
}

function resolveColor(colorToken) {
  if (!colorToken) return { hex: '#c9a84c', glow: '#c9a84c66' }
  if (colorToken.startsWith('#')) return { hex: colorToken, glow: colorToken + '66' }
  return {
    hex:  COLOR_HEX[colorToken]  || '#c9a84c',
    glow: COLOR_GLOW[colorToken] || '#c9a84c66',
  }
}

// ── Life Node ────────────────────────────────────────────────────
const nodeTypes = { lifeNode: null }  // filled below

const LifeNode = function LifeNode({ data }) {
  const icon     = NODE_ICONS[data.nodeKey] || '✦'
  const isActive = data.isSelected && !data.locked
  const state    = isActive ? 'active' : data.locked ? 'innate' : 'default'

  // Calculate progress based on quest completion (simulate with tier progress)
  const stagesDone = data.completedCount || 0
  const progress = (stagesDone / 3) * 100

  // Wire CSS custom properties — all App.css flow classes read these
  const cssVars = {
    '--flow-color':          data.colorHex,
    '--flow-color-dim':      data.colorHex + '33',
    '--flow-color-muted':    data.colorHex + '55',
    '--flow-color-glow':     data.colorHex + '66',
    '--flow-color-glow-dim': data.colorHex + '33',
    '--flow-color-faded':    data.colorHex + '18',
  }

  return (
    <div
      onClick={(e) => { e.stopPropagation(); data.onClick?.() }}
      onMouseDown={(e) => e.stopPropagation()}
      className="flow-node-interactive"
      style={{ ...cssVars, width: 160, height: 160, position: 'relative' }}
    >
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      {/* Glow layers — CSS classes use --flow-color-* vars */}
      {isActive                    && <div className="flow-node-glow--complete" />}
      {!data.locked && !isActive   && <div className="flow-node-glow--partial"  />}
      {data.locked                 && <div className="flow-node-glow--innate"   />}

      <div
        className={`flow-node-base flow-node-base--${state}${data.locked ? ' flow-node-base--locked' : ''}`}
      >
        {isActive && !data.locked && <div className="flow-node-ring-spin"  />}
        <div className="flow-node-ring-outer" />

        {/* Progress arc overlay */}
        {!data.locked && stagesDone > 0 && (
          <svg
            className="flow-node-progress"
            viewBox="0 0 160 160"
          >
            <circle
              cx="80" cy="80" r="74"
              fill="none"
              stroke={data.colorHex}
              strokeWidth="3"
              strokeDasharray={`${(progress / 100) * 465} 465`}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
              opacity="0.7"
            />
          </svg>
        )}

        {/* Lock overlay */}
        {data.locked && (
          <div className="flow-node-lock-overlay">
            <span className="flow-node-icon">🔒</span>
          </div>
        )}

        {/* Icon */}
        <span className="flow-node-icon">{icon}</span>

        {/* Label */}
        {!data.locked && (
          <>
            <span className="flow-node-label">{data.meta?.label || data.nodeKey}</span>
            <span className="flow-node-subtitle">{data.meta?.sub || ''}</span>
          </>
        )}

        {/* Number */}
        {data.locked && (
          <span className={data.locked ? 'flow-node-number flow-node-number--locked' : 'flow-node-number'}>
            {fmt(data.numObj.root, data.numObj.compound)}
          </span>
        )}

        {/* Stage pips */}
        {!data.locked && (
          <div className="flow-node-pips">
            {[0, 1, 2].map((i) => {
              const isDone = i < stagesDone
              const isEligible = i === stagesDone
              return (
                <div
                  key={i}
                  className={`flow-node-pip${isDone ? ' flow-node-pip--done' : ''}${isEligible ? ' flow-node-pip--eligible' : ''}`}
                />
              )
            })}
          </div>
        )}

        {/* Number badge */}
        {!data.locked && (
          <div className="flow-node-badge">{data.numObj?.root || ''}</div>
        )}

        {/* Lock level badge */}
        {data.locked && (
          <div className="flow-node-lock-badge">LV {data.unlockLv}</div>
        )}
      </div>
    </div>
  )
}

nodeTypes.lifeNode = LifeNode

// ── Main component ───────────────────────────────────────────────
export default function LifeQuestFlow({
  numMap,
  freqLevel,
  nodeMeta,
  getQuestData,
  lqp,
  onLocked,
  renderPanel,
}) {
  const [selected, setSelected] = useState(null)

  function handleSelect(nodeKey) {
    setSelected((prev) => (prev === nodeKey ? null : nodeKey))
  }

  const selData = selected
    ? {
        nodeKey: selected,
        meta: nodeMeta[selected],
        numObj: numMap[selected],
        qData: getQuestData(numMap[selected]?.root),
        ...resolveColor(getQuestData(numMap[selected]?.root)?.color),
      }
    : null

  // Build node lookup for click handling
  const nodeLookup = useMemo(() => {
    const lookup = {}
    Object.keys(LIFE_LAYOUT).forEach((nodeKey) => {
      const pos = LIFE_LAYOUT[nodeKey]
      const meta = nodeMeta[nodeKey]
      const numObj = numMap[nodeKey]
      if (!numObj) return
      const qData = getQuestData(numObj.root)
      const unlockLv = nodeMeta[nodeKey].unlockLv || 0
      const locked = freqLevel < unlockLv
      lookup[nodeKey] = { meta, numObj, qData, unlockLv, locked }
    })
    return lookup
  }, [numMap, freqLevel, nodeMeta, getQuestData])

  // Handle node click via ReactFlow event
  const onNodeClick = useCallback((event, node) => {
    event.stopPropagation()
    const key = node.id
    const info = nodeLookup[key]
    if (!info) return
    if (info.locked) {
      onLocked?.(`Reach Freq LV ${info.unlockLv} to unlock ${info.meta.title}`)
    } else {
      setSelected((prev) => (prev === key ? null : key))
    }
  }, [nodeLookup, onLocked])

  const nodes = useMemo(() => {
    return Object.keys(LIFE_LAYOUT).map((nodeKey) => {
      const pos = LIFE_LAYOUT[nodeKey]
      const meta = nodeMeta[nodeKey]
      const numObj = numMap[nodeKey]
      if (!numObj) {
        console.warn(`LifeQuestFlow: numObj missing for key "${nodeKey}"`)
        return null
      }
      const qData = getQuestData(numObj.root)
      const unlockLv = nodeMeta[nodeKey].unlockLv || 0
      const locked = freqLevel < unlockLv
      const { hex: colorHex, glow: glowHex } = locked
        ? { hex: '#787878', glow: 'transparent' }
        : resolveColor(qData.color)

      // Count completed tiers (a tier is done when all its objectives are true)
      let completedCount = 0
      const lqpEntry = lqp?.[nodeKey]
      if (lqpEntry) {
        for (let t = 1; t <= 3; t++) {
          const prog = lqpEntry[t] || []
          if (prog.length > 0 && prog.every(Boolean)) completedCount++
          else break
        }
      }

      return {
        id: nodeKey,
        type: 'lifeNode',
        position: { x: pos.x - 80, y: pos.y - 80 },
        draggable: false,
        data: {
          numObj,
          nodeKey,
          meta: {
            label: meta.label,
            sub: meta.sub,
          },
          label: meta.label,
          unlockLv,
          locked,
          colorHex,
          glowHex,
          completedCount,
          isSelected: selected === nodeKey,
          onClick: () => {
            if (locked) {
              onLocked?.(`Reach Freq LV ${unlockLv} to unlock ${meta.title}`)
            } else {
              setSelected((prev) => (prev === nodeKey ? null : nodeKey))
            }
          },
        },
      }
    }).filter(Boolean)
  }, [numMap, selected, freqLevel, nodeMeta, getQuestData, lqp])

  const edges = useMemo(() => {
    return LIFE_EDGES.map(([source, target]) => ({
      id: `${source}-${target}`,
      source,
      target,
      type: 'default',
      style: {
        stroke: 'rgba(201,168,76,0.25)',
        strokeWidth: 2,
        strokeDasharray: '4 4',
      },
      animated: false,
    }))
  }, [])

  return (
    <>
      <div className="lqt-flow-wrap">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          zoomOnDoubleClick={false}
          zoomOnScroll
          zoomOnPinch
          panOnDrag
          panOnScroll={false}
          preventScrolling={false}
          minZoom={0.3}
          maxZoom={3}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#ffffff08" gap={28} size={1} />
        </ReactFlow>
      </div>

      <FlowDetailPanel
        open={!!selected}
        onClose={() => setSelected(null)}
        color={selData?.hex || '#c9a84c'}
        title={selData?.meta?.title || ''}
        subtitle={selData?.meta?.sub || ''}
        icon={NODE_ICONS[selected] || '✦'}
      >
        {selData && renderPanel?.(selected)}
      </FlowDetailPanel>
    </>
  )
}
