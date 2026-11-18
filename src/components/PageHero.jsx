import { useLayoutEffect, useRef } from 'react'
import { gsap, SplitText } from '../lib/scroll.js'
import { useReady } from '../lib/ready.js'
import NetworkCanvas from './NetworkCanvas.jsx'

// Inner-page opener: copy on the light side, ringed image on a grey network wedge
function PageHero({ eyebrow, title, intro, image, strips = false, children }) {
  const root = useRef(null)
  const ready = useReady()

  useLayoutEffect(() => {
    if (!ready) return
    let ctx
    let cancelled = false
    document.fonts.ready.then(() => {
      if (cancelled || !root.current) return
      ctx = gsap.context(() => {
        const split = SplitText.create('.page-hero__title', { type: 'lines', mask: 'lines', linesClass: 'split-line' })
        const tl = gsap.timeline({ delay: 0.55, defaults: { ease: 'expo.out' } })
        tl.set('.page-hero__title', { visibility: 'visible' })
          .fromTo('.page-hero__wedge', { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' }, { clipPath: 'polygon(38% 0%, 100% 0%, 100% 100%, 58% 100%)', duration: 1.6, ease: 'expo.inOut' }, 0)
          .fromTo('.page-hero__eyebrow', { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 1.2 }, 0.3)
          .from(split.lines, { yPercent: 115, duration: 1.3, stagger: 0.1 }, 0.4)
        if (strips) {
          tl.fromTo('.page-hero__strip--a', { xPercent: -50, yPercent: 50, autoAlpha: 0 }, { xPercent: 0, yPercent: 0, autoAlpha: 1, duration: 1.8 }, 0.6)
            .fromTo('.page-hero__strip--b', { xPercent: -65, yPercent: 65, autoAlpha: 0 }, { xPercent: 0, yPercent: 0, autoAlpha: 1, duration: 1.8 }, 0.8)
        } else if (image) {
          tl.fromTo('.page-hero__orb', { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.8 }, 0.5)
            .fromTo('.page-hero__orb img', { scale: 1.4 }, { scale: 1, duration: 2.2 }, 0.5)
          gsap.to('.page-hero__orb', {
            yPercent: 18,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
          })
        }
        tl.fromTo('.page-hero__intro, .page-hero__extra', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.15 }, 0.8)
      }, root)
    })
    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [ready, image, strips])

  return (
    <section className="page-hero" ref={root}>
      <div className={`page-hero__wedge${strips ? ' page-hero__wedge--blue' : ''}`}>
        {strips ? (
          <div className="page-hero__strips" aria-hidden="true">
            <div className="page-hero__strip page-hero__strip--a">
              <img src={image} alt="" />
            </div>
            <div className="page-hero__strip page-hero__strip--b">
              <img src={image} alt="" />
            </div>
          </div>
        ) : (
          <NetworkCanvas />
        )}
      </div>
      {image && !strips && (
        <div className="page-hero__orb">
          <img src={image} alt="" />
        </div>
      )}
      <div className="page-hero__copy">
        {eyebrow && <p className="page-hero__eyebrow">{eyebrow}</p>}
        <h1 className="page-hero__title">{title}</h1>
        {intro && <p className="page-hero__intro">{intro}</p>}
        {children && <div className="page-hero__extra">{children}</div>}
      </div>
    </section>
  )
}

export default PageHero
