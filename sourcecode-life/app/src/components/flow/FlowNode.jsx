/**
 * FlowNode — shared circular node for all blueprint flows.
 * Uses CSS classes + CSS custom properties from App.css.
 * Replaces PurposeNode / LessonsNode / IdentityNode (all identical).
 *
 * Required data props:
 *   color      – hex color string
 *   icon       – emoji / string
 *   displayNum – number string
 *   label      – short uppercase label
 *   isMaster   – boolean
 *   isSelected – boolean
 *   onClick    – () => void
 */
import { Handle, Position } from 'reactflow'

const NODE_SIZE = 90

export default function FlowNode({ data }) {
  const { color, isSelected } = data

  // CSS custom properties wired to the CSS system in App.css
  const cssVars = {
    '--flow-color':          color,
    '--flow-color-dim':      color + '33',
    '--flow-color-muted':    color + '55',
    '--flow-color-glow':     color + '66',
    '--flow-color-glow-dim': color + '33',
    '--flow-color-faded':    color + '18',
  }

  return (
    <div
      onClick={(e) => { e.stopPropagation(); data.onClick?.() }}
      onMouseDown={(e) => e.stopPropagation()}
      className="flow-node-interactive"
      style={{ ...cssVars, width: NODE_SIZE, height: NODE_SIZE, position: 'relative' }}
    >
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      {/* Pulsing aura glow when selected */}
      {isSelected && <div className="flow-node-glow--complete" />}

      {/* Base circle — uses CSS classes for all visual states */}
      <div className={`flow-node-base flow-node-base--${isSelected ? 'active' : 'default'}`}>
        {/* Spinning ring (active only) */}
        {isSelected && <div className="flow-node-ring-spin" />}

        {/* Outer dashed ring */}
        <div className="flow-node-ring-outer" />

        {/* Icon */}
        <span className="flow-node-icon">{data.icon}</span>

        {/* Number */}
        <span className="flow-node-number">{data.displayNum}</span>

        {/* Label */}
        <span className="flow-node-subtitle">{data.label}</span>

        {/* Master badge */}
        {data.isMaster && <div className="flow-node-badge">MASTER</div>}
      </div>
    </div>
  )
}

export const flowNodeTypes = { flowNode: FlowNode }
