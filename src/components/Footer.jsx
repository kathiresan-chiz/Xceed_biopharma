import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router'
import { gsap } from '../lib/scroll.js'
import Logo from './Logo.jsx'
import { CONTACT, IMAGES, NAV_GROUPS, NAV_PRIMARY } from '../data/site.js'
import './Footer.css'

function Footer() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Link panel emerges from beneath the contact card
      gsap.fromTo(
        '.footer__panel-inner',
        { yPercent: -45, autoAlpha: 0.2 },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: 'none',
          // Measured after every page pin (incl. CollabPanel's, priority -1) so it starts where the footer really is
          scrollTrigger: { trigger: '.footer__panel', start: 'top bottom', end: 'bottom bottom', scrub: true, refreshPriority: -10 },
        },
      )
      gsap.fromTo(
        '.footer__card > *',
        { y: 60, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.footer__card', start: 'top 80%', once: true, refreshPriority: -10 },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <footer className="footer" ref={root}>
      <div className="footer__card">
        <Link to="/" className="footer__logo" aria-label="Xceed Biopharma home">
          <Logo variant="white" />
        </Link>

        <div className="footer__grid">
          <div className="footer__col">
            <h3>Address</h3>
            <p>
              {CONTACT.company}
              <br />
              {CONTACT.street}
              <br />
              {CONTACT.city}
            </p>
          </div>
          <div className="footer__col">
            <h3>Email</h3>
            <p>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </p>
            <h3>Phone</h3>
            <p>
              <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            </p>
          </div>
          <div className="footer__col footer__col--cta">
            <Link to="/collaborate" className="footer__talk">
              <span>Let&apos;s Talk</span>
            </Link>
          </div>
        </div>

        <div className="footer__brands">
          <span className="footer__brand">
            <i aria-hidden="true" />
            <Logo variant="muted" sub="VENTURES" />
          </span>
          <span className="footer__brand">
            <i aria-hidden="true" />
            <Logo variant="muted" sub="ADVISORY" />
          </span>
        </div>
      </div>

      <div className="footer__panel">
        <div className="footer__panel-inner">
          <figure className="footer__media">
            <img src={IMAGES.vialsImg} alt="" loading="lazy" />
          </figure>
          <nav className="footer__nav" aria-label="Footer">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="footer__group">
                <p className="footer__group-title">{group.title}</p>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="footer__link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <ul className="footer__primary">
              {NAV_PRIMARY.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="footer__bar">
        <span>&copy; {new Date().getFullYear()} Xceed BioPharma. All Rights Reserved</span>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/cookies-policy">Cookies Policy</Link>
      </div>
    </footer>
  )
}

export default Footer
