import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { gsap, ScrollTrigger, scrollToTop, lockScroll } from '../lib/scroll.js'
import Logo from './Logo.jsx'
import './PageTransition.css'

// Blue curtain sweeps up over the old page, the new page mounts underneath, then it lifts away
function PageTransition({ children }) {
  const location = useLocation()
  const [shown, setShown] = useState(location)
  const shownPath = useRef(location.pathname)
  const curtain = useRef(null)

  useEffect(() => {
    if (location.pathname === shownPath.current) return
    shownPath.current = location.pathname
    const el = curtain.current
    lockScroll(true)

    const tl = gsap.timeline({ onComplete: () => lockScroll(false) })
    tl.set(el, { visibility: 'visible' })
      .fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'expo.inOut' })
      .fromTo('.page-curtain__logo', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.35)
      .add(() => setShown(location))
      .to('.page-curtain__logo', { autoAlpha: 0, y: -30, duration: 0.4, ease: 'power3.in' }, '+=0.15')
      .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: 'expo.inOut' }, '-=0.1')
      .set(el, { visibility: 'hidden' })

    return () => {
      tl.progress(1).kill()
    }
  }, [location])

  // New page is in place behind the curtain: start it from the top
  useLayoutEffect(() => {
    scrollToTop()
    ScrollTrigger.refresh()
  }, [shown.pathname])

  return (
    <>
      <div className="page-shell" key={shown.pathname}>
        {children(shown)}
      </div>
      <div ref={curtain} className="page-curtain" aria-hidden="true">
        <Logo variant="white" className="page-curtain__logo" />
      </div>
    </>
  )
}

export default PageTransition
