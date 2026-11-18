import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Link, useLocation } from 'react-router'
import { lockScroll } from '../lib/scroll.js'
import { isNavLocked, onNavLock } from '../lib/navLock.js'
import { NAV_GROUPS as GROUPS, NAV_PRIMARY as PRIMARY } from '../data/site.js'
import Logo from './Logo.jsx'
import vialsImg from '../assets/menu-vials.jpg'
import './Navbar.css'

const HIDE_AFTER = 120 // px scrolled before the bar may tuck away
// Pages whose design floats the navbar as a light card over the hero
const FLOAT_ROUTES = ['/mission']

function Navbar({ ready = true }) {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navLocked = useSyncExternalStore(onNavLock, isNavLocked)
  const location = useLocation()
  const [path, setPath] = useState(location.pathname)
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  // Close the menu whenever the route changes
  if (path !== location.pathname) {
    setPath(location.pathname)
    setOpen(false)
  }

  // As in the mockup: the bar tucks away while scrolling down and returns only on scroll up
  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const update = () => {
      const y = window.scrollY
      const delta = y - lastY
      setScrolled(y > 8)
      if (Math.abs(delta) > 4) {
        setHidden(delta > 0 && y > HIDE_AFTER)
        lastY = y
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Grow the overlay out of the menu button
  const setOrigin = useCallback(() => {
    const btn = btnRef.current
    const menu = menuRef.current
    if (!btn || !menu) return
    const r = btn.getBoundingClientRect()
    menu.style.setProperty('--cx', `${r.left + r.width / 2}px`)
    menu.style.setProperty('--cy', `${r.top + r.height / 2}px`)
  }, [])

  const toggle = () => {
    setOrigin()
    setOpen((v) => !v)
  }

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const root = document.documentElement
    // Fill the space the scrollbar leaves so nothing jumps when the page locks
    if (open) root.style.setProperty('--sbw', `${window.innerWidth - root.clientWidth}px`)
    root.classList.toggle('menu-open', open)
    lockScroll(open)
    if (!open) return

    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', setOrigin)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', setOrigin)
    }
  }, [open, close, setOrigin])

  const classes = [
    'site-header',
    ready && 'is-ready',
    hidden && !open && !navLocked && 'is-hidden',
    FLOAT_ROUTES.includes(location.pathname) && 'site-header--float',
    scrolled && 'is-scrolled',
    open && 'is-open',
  ]
    .filter(Boolean)
    .join(' ')

  let i = 0 // running index for staggered link reveals

  return (
    <>
      <header className={classes}>
        <Link to="/" className="site-header__brand" aria-label="Xceed Biopharma home" onClick={close}>
          <Logo variant="brand" className="site-header__logo" />
        </Link>

        <nav className="site-header__actions" aria-label="Primary">
          <button
            ref={btnRef}
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={toggle}
          >
            <span className="menu-btn__label" aria-hidden="true">
              <span className="menu-btn__word">Menu</span>
              <span className="menu-btn__word">Close</span>
            </span>
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span className="menu-btn__icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>

          <Link to="/collaborate" className="talk-btn" onClick={close}>
            <span className="talk-btn__text">Let&apos;s Talk</span>
          </Link>
        </nav>
      </header>

      <div
        id="site-menu"
        ref={menuRef}
        className={`site-menu${open ? ' is-open' : ''}`}
        inert={!open}
        aria-hidden={!open}
      >
        <div className="site-menu__inner">
          <figure className="site-menu__media">
            <img src={vialsImg} alt="" />
          </figure>

          <div className="site-menu__nav">
            {GROUPS.map((group) => (
              <div className="site-menu__group" key={group.title}>
                <p className="site-menu__title" style={{ '--i': i++ }}>
                  {group.title}
                </p>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="site-menu__link" style={{ '--i': i++ }} onClick={close}>
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <ul className="site-menu__primary">
              {PRIMARY.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="site-menu__link" style={{ '--i': i++ }} onClick={close}>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="site-menu__footer">
          <a href="mailto:info@xceedbiopharma.com">info@xceedbiopharma.com</a>
          <a href="tel:+17135660885">+1.713.566.0885</a>
          <Link to="/collaborate" className="site-menu__cta" onClick={close}>
            Let&apos;s Talk
          </Link>
        </div>
      </div>
    </>
  )
}

export default Navbar
