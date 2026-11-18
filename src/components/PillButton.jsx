import { Link } from 'react-router'

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 12h15M13 5.5l6.5 6.5-6.5 6.5" />
  </svg>
)

// Navy pill with a round arrow badge, as used for every call to action in the design
function PillButton({ to, href, children, variant = 'solid', className = '', ...rest }) {
  const classes = `pill pill--${variant} ${className}`
  const content = (
    <>
      <span className="pill__icon">
        <span className="pill__arrows">
          <Arrow />
          <Arrow />
        </span>
      </span>
      <span className="pill__label">{children}</span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  )
}

export default PillButton
