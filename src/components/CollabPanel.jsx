import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router'
import { gsap, DESKTOP_MQ } from '../lib/scroll.js'
import Lines from './Lines.jsx'
import { COLLAB_LINES, IMAGES } from '../data/site.js'
import collabStrips from '../assets/collab-strips.jpg'
import './CollabPanel.css'

// Pinned like the homepage panel: strips glide in, copy unmasks, button grows open.
// variant="home" copies the homepage band: full screen height, aerial photo, its type and button.
// title adds a display heading above the copy (KSM & API mockup: “Let’s Collaborate”).
function CollabPanel({ cta = 'Let’s Talk', variant, title }) {
  const home = variant === 'home'
  const strips = home ? IMAGES.aerialImg : collabStrips
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)

    mm.add(DESKTOP_MQ, () => {
      const tl = gsap
        .timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * 1.4}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // Child effects run before the page's own pins are created: measure this one last
            refreshPriority: -1,
          },
        })
        .fromTo('.cp__strip--a', { xPercent: -55, yPercent: 55 }, { xPercent: 0, yPercent: 0, duration: 1.3 }, 0)
        .fromTo('.cp__strip--b', { xPercent: -70, yPercent: 70 }, { xPercent: 0, yPercent: 0, duration: 1.3 }, 0.25)
        .fromTo(
          '.cp__text p',
          { clipPath: 'inset(0% 0% 100% 0%)', y: 30 },
          { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 0.9, stagger: 0.3 },
          0.4,
        )
        .fromTo(
          '.cp__btn',
          { clipPath: 'inset(46% 50% 46% 50%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' },
          1.0,
        )
        .to({}, { duration: 0.6 }, 1.9)

      if (title) {
        tl.fromTo('.cp__title', { clipPath: 'inset(0% 0% 100% 0%)', y: 40 }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 0.9 }, 0.2)
      }
    })

    mm.add(`not all and ${DESKTOP_MQ}`, () => {
      gsap.utils.toArray('.cp__text > *').forEach((node) => {
        gsap.fromTo(
          node,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: node, start: 'top 88%', once: true } },
        )
      })
    })

    return () => mm.revert()
  }, [title])

  return (
    <section className={['cp', home && 'cp--home', title && 'cp--titled'].filter(Boolean).join(' ')} ref={root}>
      <div className="cp__strips" aria-hidden="true">
        <div className="cp__strip cp__strip--a" style={{ backgroundImage: `url(${strips})` }} />
        <div className="cp__strip cp__strip--b" style={{ backgroundImage: `url(${strips})` }} />
      </div>
      <div className="cp__text">
        {title && <h2 className="cp__title">{title}</h2>}
        {COLLAB_LINES.map((lines) => (
          <p key={lines[0]}>
            <Lines lines={lines} />
          </p>
        ))}
        <Link to="/collaborate" className="cp__btn">
          {cta}
        </Link>
      </div>
    </section>
  )
}

export default CollabPanel
