import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap, scrollTo } from '../../lib/scroll.js'
import PillButton from '../../components/PillButton.jsx'
import Lines from '../../components/Lines.jsx'
import { AREAS, COLLAB_LINES, IMAGES } from '../../data/site.js'

// Where each circle sits in the diagram, by its role in the cycle
const ROLES = [
  { x: 74, y: 51.8, s: 1, cls: 'is-main' },
  { x: 16.4, y: 19.5, s: 0.63, cls: 'is-next' },
  { x: 16.9, y: 80.6, s: 0.63, cls: 'is-prev' },
]

function FocusCollab() {
  const root = useRef(null)
  const trigger = useRef(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)

    mm.add('(min-height: 560px)', () => {
      const step = { v: 0 }
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 5}`,
          pin: '.focus__stage',
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      trigger.current = tl

      // Focus areas take turns in the centre
      tl.addLabel('area0', 0.2)
        .to(step, {
          v: 2.999,
          duration: 3,
          ease: 'none',
          onUpdate: () => setActive(Math.min(2, Math.floor(step.v))),
        }, 0)
        .addLabel('area1', 1.5)
        .addLabel('area2', 2.6)

      // Blue collaboration panel rises over the diagram
      tl.fromTo('.collab', { yPercent: 100 }, { yPercent: 0, duration: 1.2 }, 3.2)
        .to('.focus__inner', { yPercent: -12, autoAlpha: 0.5, duration: 1.2 }, 3.2)
        .fromTo('.collab__strip--a', { xPercent: -55, yPercent: 55 }, { xPercent: 0, yPercent: 0, duration: 1.3, ease: 'power3.out' }, 3.7)
        .fromTo('.collab__strip--b', { xPercent: -70, yPercent: 70 }, { xPercent: 0, yPercent: 0, duration: 1.3, ease: 'power3.out' }, 3.95)
        .fromTo(
          '.collab__text p',
          { clipPath: 'inset(0% 0% 100% 0%)', y: 30 },
          { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 0.9, stagger: 0.3, ease: 'power3.out' },
          4.1,
        )
        .fromTo(
          '.collab__btn',
          { clipPath: 'inset(46% 50% 46% 50%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' },
          4.7,
        )
        .to({}, { duration: 0.8 }, 5.6)
    })

    return () => {
      trigger.current = null
      mm.revert()
    }
  }, [])

  const go = (i) => {
    const tl = trigger.current
    if (tl?.scrollTrigger) scrollTo(tl.scrollTrigger.labelToScroll(`area${i}`))
    else setActive(i)
  }

  return (
    <section className="focus" ref={root}>
      <div className="focus__stage">
        <div className="focus__inner">
          <div className="focus__diagram" aria-hidden="true">
            <svg className="focus__arrows" viewBox="0 0 835 710">
              <defs>
                <marker id="arrowhead" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0L10 5L0 10z" />
                </marker>
              </defs>
              <path d="M315 150 Q380 150 415 205" markerEnd="url(#arrowhead)" />
              <path d="M415 530 Q385 575 315 582" markerEnd="url(#arrowhead)" />
              <path d="M70 415 Q50 350 78 300" markerEnd="url(#arrowhead)" />
            </svg>
            {AREAS.map((area, i) => {
              const role = ROLES[(i - active + 3) % 3]
              return (
                <div
                  key={area.slug}
                  className={`focus__node ${role.cls}`}
                  style={{ '--x': `${role.x}%`, '--y': `${role.y}%`, '--s': role.s }}
                >
                  <div className="focus__face">
                    <span className="focus__num">{area.num}</span>
                    <span className="focus__label">{area.short}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="focus__content">
            <h2 className="focus__title">Areas of Focus</h2>
            <ol className="focus__list">
              {AREAS.map((area, i) => (
                <li key={area.slug} className={`focus__item${i === active ? ' is-active' : ''}`}>
                  <button type="button" className="focus__head" aria-expanded={i === active} onClick={() => go(i)}>
                    <span className="focus__head-num">{area.num}</span>
                    <span className="focus__head-name">{area.name}</span>
                  </button>
                  <div className="focus__body">
                    <div>
                      <p>
                        <Lines lines={area.lines} />
                      </p>
                      <PillButton to={`/projects/${area.slug}`} variant="ring" tabIndex={i === active ? 0 : -1}>
                        Know More
                      </PillButton>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="collab">
          <div className="collab__media" aria-hidden="true">
            <div className="collab__strip collab__strip--a">
              <img src={IMAGES.aerialImg} alt="" />
            </div>
            <div className="collab__strip collab__strip--b">
              <img src={IMAGES.aerialImg} alt="" />
            </div>
          </div>
          <div className="collab__text">
            {COLLAB_LINES.map((lines) => (
              <p key={lines[0]}>
                <Lines lines={lines} />
              </p>
            ))}
            <Link to="/collaborate" className="collab__btn">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FocusCollab
