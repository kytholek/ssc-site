export default function PremiumBadge({ size = 'sm', className = '' }) {
  const dim = { sm: 22, md: 40, lg: 80 }[size]

  return (
    <svg
      className={`premium-badge-svg ${className}`}
      width={dim}
      height={dim}
      viewBox="0 0 300 310"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Lines */}
      <line x1="150" y1="40" x2="90" y2="100" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" />
      <line x1="150" y1="40" x2="210" y2="100" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" />
      <line x1="90" y1="100" x2="150" y2="160" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" />
      <line x1="210" y1="100" x2="150" y2="160" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" />
      <line x1="150" y1="160" x2="50" y2="160" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" />
      <line x1="150" y1="160" x2="250" y2="160" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" />
      <line x1="150" y1="160" x2="90" y2="220" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" />
      <line x1="150" y1="160" x2="210" y2="220" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" />
      <line x1="90" y1="220" x2="150" y2="270" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" />
      <line x1="210" y1="220" x2="150" y2="270" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" />

      {/* Nodes */}
      <g fontSize="20" textAnchor="middle" dominantBaseline="middle" fill="#c9a84c" fontWeight="bold" fontFamily="'Courier New', monospace">
        <circle cx="150" cy="40" r="16" fill="none" stroke="#c9a84c" strokeWidth="3" />
        <text x="150" y="42">2</text>

        <circle cx="90" cy="100" r="16" fill="none" stroke="#c9a84c" strokeWidth="3" />
        <text x="90" y="102">1</text>

        <circle cx="210" cy="100" r="16" fill="none" stroke="#c9a84c" strokeWidth="3" />
        <text x="210" y="102">3</text>

        <circle cx="50" cy="160" r="16" fill="none" stroke="#c9a84c" strokeWidth="3" />
        <text x="50" y="162">4</text>

        <circle cx="150" cy="160" r="18" fill="none" stroke="#c9a84c" strokeWidth="3" />
        <text x="150" y="162">5</text>

        <circle cx="250" cy="160" r="16" fill="none" stroke="#c9a84c" strokeWidth="3" />
        <text x="250" y="162">6</text>

        <circle cx="90" cy="220" r="16" fill="none" stroke="#c9a84c" strokeWidth="3" />
        <text x="90" y="222">7</text>

        <circle cx="210" cy="220" r="16" fill="none" stroke="#c9a84c" strokeWidth="3" />
        <text x="210" y="222">9</text>

        <circle cx="150" cy="270" r="16" fill="none" stroke="#c9a84c" strokeWidth="3" />
        <text x="150" y="272">8</text>
      </g>
    </svg>
  )
}
