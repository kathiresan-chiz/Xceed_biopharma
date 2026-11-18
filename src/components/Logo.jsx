import { useId } from 'react'

function Logo({ className = '', variant = 'grey', sub = 'BIOPHARMA' }) {
  const gradId = useId()
  // The brand mark's chevrons run from navy into teal
  const fill = variant === 'brand' ? `url(#${CSS.escape(gradId)})` : undefined

  return (
    <div className={`logo logo--${variant} ${className}`}>
      <div className="logo__top">
        <svg className="logo__chevrons" viewBox="0 0 60 40" aria-hidden="true" style={fill ? { fill } : undefined}>
          {variant === 'brand' && (
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#253c94" />
                <stop offset="0.55" stopColor="#2a6fb8" />
                <stop offset="1" stopColor="#2aa7c9" />
              </linearGradient>
            </defs>
          )}
          <path d="M2 2h9l16 18-16 18H2l16-18z" />
          <path d="M18 2h9l16 18-16 18h-9l16-18z" />
          <path d="M34 2h9l16 18-16 18h-9l16-18z" />
        </svg>
        <span className="logo__word">XCEED</span>
      </div>
      <span className="logo__sub">{sub}</span>
    </div>
  )
}

export default Logo
