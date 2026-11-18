import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, DESKTOP_MQ, scrollTo } from '../../lib/scroll.js'
import Lines from '../../components/Lines.jsx'
import CollabPanel from '../../components/CollabPanel.jsx'
import {
  TITLE,
  STRATEGY_LINES,
  INITIATIVES_LINES,
  INITIATIVES,
  PILLARS,
  RING_SLOTS,
  RINGS,
  NAVY_DOTS,
  GREEN_DOTS,
  BIG_PLUSES,
  SMALL_PLUSES,
  ARCS,
  BRANCHES,
  OCTAGONS,
} from '../../data/vision.js'
import oceanImg from '../../assets/vision/ocean.jpg'
import podiumImg from '../../assets/vision/podium.webp'
import teamImg from '../../assets/vision/team.jpg'
import icon1 from '../../assets/vision/icon-1.png'
import icon2 from '../../assets/vision/icon-2.png'
import icon3 from '../../assets/vision/icon-3.png'
import './Vision.css'

const tileImgs = import.meta.glob('../../assets/vision/hex-*.webp', { eager: true, import: 'default' })
const tileSrc = (name) => tileImgs[`../../assets/vision/hex-${name}.webp`]
const ICONS = [icon1, icon2, icon3]

// Hero title travels from the hero (cap top 920) to the ocean panel (cap top 122)
const TITLE_DROP = 920 - 122
// Podium + chevron start centred and settle where the reference has them
const SLIDE = 294
const CHEV_LAYERS = 24
const CHEV_DEPTH = 30
// Ring spin: one turn every 7.2 s (left anticlockwise, right clockwise)
const SPIN = 7.2

const bezier = (p) => `M${p[0]} ${p[1]}C${p[2]} ${p[3]} ${p[4]} ${p[5]} ${p[6]} ${p[7]}`
const lerpArr = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)

function Plus({ x, y, size, bar }) {
  const h = size / 2
  const b = bar / 2
  return (
    <path
      d={`M${x - b} ${y - h}h${bar}v${h - b}h${h - b}v${bar}h${-(h - b)}v${h - b}h${-bar}v${-(h - b)}h${-(h - b)}v${-bar}h${h - b}z`}
    />
  )
}

function Chevrons() {
  // Three chevrons in a 287.7 × 253 box, 86.67 apart
  const pts = (dx) =>
    [
      [0, 0],
      [33.4, 0],
      [114.4, 126.5],
      [33.4, 253],
      [0, 253],
      [80, 126.5],
    ]
      .map(([x, y]) => `${x + dx},${y}`)
      .join(' ')
  return [0, 86.67, 173.33].map((dx) => <polygon key={dx} points={pts(dx)} />)
}

function Vision() {
  const root = useRef(null)
  const assure = useRef(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)

    // Rings turn on their own clock on every layout
    const q = gsap.utils.selector(root)
    const spins = [
      gsap.to(q('.vs-ring--l .vs-ring__spin'), { rotation: -360, duration: SPIN, repeat: -1, ease: 'none' }),
      gsap.to(q('.vs-ring--r .vs-ring__spin'), { rotation: 360, duration: SPIN, repeat: -1, ease: 'none' }),
    ]
    const setSpin = (on) => spins.forEach((t) => t.paused(!on))

    mm.add(DESKTOP_MQ, () => {
      const el = root.current
      const u = () => {
        const w = window.innerWidth
        const h = window.innerHeight
        return Math.min(Math.max(w / 1728, h / 1117), w / 1600)
      }
      const w = () => window.innerWidth / 1728

      /* ---------- Scene 1: hero → ocean ---------- */
      const scene = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: el.querySelector('.vs-scene'),
          start: 'top top',
          end: () => `+=${window.innerHeight * 5.2}`,
          pin: '.vs-stage',
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setSpin(self.progress < 0.33),
          onLeaveBack: () => setSpin(true),
        },
      })

      // Rings drift apart, dots lift a little, the ocean rises over them carrying the title up
      scene
        .to('.vs-ring--l', { x: () => -300 * u(), duration: 1.3, ease: 'power1.in' }, 0)
        .to('.vs-ring--r', { x: () => 300 * u(), duration: 1.3, ease: 'power1.in' }, 0)
        .to('.vs-dots', { y: () => -50 * u(), duration: 1.6, ease: 'none' }, 0)
        .fromTo('.vs-ocean', { yPercent: 100 }, { yPercent: 0, duration: 1.4 }, 0.45)
        .fromTo('.vs-title', { y: () => TITLE_DROP * u() }, { y: 0, duration: 1.4 }, 0.45)

      // Chevron turns a full revolution; it and the podium slide left; the copy card unrolls
      scene
        .fromTo('.vs-chev__spin', { rotationY: 0 }, { rotationY: 360, duration: 2.6, ease: 'power1.inOut' }, 2.0)
        .fromTo(['.vs-chev', '.vs-podium'], { x: () => SLIDE * u() }, { x: 0, duration: 1.3 }, 3.0)
        .fromTo(
          '.vs-card',
          { clipPath: 'inset(0% 0% 100% 0% round 14px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 0.9, ease: 'power2.inOut' },
          3.75,
        )
        .fromTo(
          '.vs-card .ln',
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' },
          4.0,
        )
        .to({}, { duration: 0.5 }, 5.0)

      // Keeps turning as the ocean scrolls away
      gsap.fromTo(
        '.vs-chev__exit',
        { rotationY: 0 },
        {
          rotationY: 180,
          ease: 'none',
          scrollTrigger: { trigger: '.vs-init', start: 'top bottom', end: 'top top', scrub: 1 },
        },
      )

      /* ---------- Scene 2: initiatives ---------- */
      const arcs = gsap.utils.toArray('.vs-arc')
      const morph = { t: 0 }
      const drawArcs = () => arcs.forEach((p, i) => p.setAttribute('d', bezier(lerpArr(ARCS[i].from, ARCS[i].to, morph.t))))
      drawArcs()

      const init = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: '.vs-init',
          start: 'top top',
          end: () => `+=${window.innerHeight * 4}`,
          pin: '.vs-init__stage',
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      init
        .fromTo(arcs, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power1.inOut' }, 0)
        .to(morph, { t: 1, duration: 1.3, ease: 'power2.inOut', onUpdate: drawArcs }, 0.45)
        .fromTo(
          '.vs-photo',
          { clipPath: 'inset(0% 0% 100% 0% round 28px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.0 },
          1.1,
        )
        .fromTo(
          '.vs-init__frame',
          { y: 0 },
          { y: () => Math.min(0, window.innerHeight - 1496 * w()), duration: 1.1, ease: 'power1.inOut' },
          2.3,
        )
      ;[[0], [1, 2], [3]].forEach((branches, i) => {
        const at = 3.2 + i * 0.5
        init
          .fromTo(
            branches.map((b) => `.vs-branch--${b}`),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.35, ease: 'power1.in' },
            at,
          )
          .fromTo(
            `.vs-icard--${i}`,
            { clipPath: 'inset(0% 0% 100% 0% round 10px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 10px)', duration: 0.7, ease: 'power2.out' },
            at + 0.25,
          )
      })
      init.to({}, { duration: 0.5 }, 4.9)

      /* ---------- Scene 3: assuring success ---------- */
      const step = 1.4
      const tabs = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: '.vs-assure',
          start: 'center center',
          end: () => `+=${window.innerHeight * 4.4}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress * tabs.duration()
            setActive(Math.max(0, Math.min(PILLARS.length - 1, Math.floor((t - 0.75) / step) + 1)))
          },
        },
      })
      assure.current = tabs

      tabs
        .addLabel('tab0', 0.75)
        .fromTo('.vs-tab--0 .vs-tab__title span', { y: 0, yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: 'power2.out' }, 0)
        .fromTo('.vs-tab--0 .vs-tab__body', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'none' }, 0.25)
      for (let i = 1; i < PILLARS.length; i++) {
        const at = 0.75 + (i - 1) * step + 0.3
        tabs
          .to(`.vs-tab--${i - 1} .vs-tab__title span`, { yPercent: 110, duration: 0.35, ease: 'power2.in' }, at)
          .to(`.vs-tab--${i - 1} .vs-tab__body`, { autoAlpha: 0, duration: 0.35, ease: 'none' }, at)
          .to(`.vs-oct--${i - 1} .vs-oct__fill`, { opacity: 0, duration: 0.5, ease: 'none' }, at + 0.1)
          .to(`.vs-oct--${i - 1}`, { scale: 1, color: '#1d1d1f', duration: 0.5 }, at + 0.1)
          .fromTo(`.vs-oct--${i} .vs-oct__fill`, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'none' }, at + 0.1)
          .fromTo(`.vs-oct--${i}`, { scale: 1, color: '#1d1d1f' }, { scale: 240 / 232, color: '#ffffff', duration: 0.5 }, at + 0.1)
          .fromTo(
            `.vs-tab--${i} .vs-tab__title span`,
            { y: 0, yPercent: 110, autoAlpha: 1 },
            { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out' },
            at + 0.4,
          )
          .fromTo(`.vs-tab--${i} .vs-tab__body`, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'none' }, at + 0.6)
          .addLabel(`tab${i}`, at + 1.1)
      }
      tabs.to({}, { duration: 0.6 }, 0.75 + (PILLARS.length - 1) * step + 0.4)

      return () => {
        assure.current = null
      }
    })

    mm.add(`not all and ${DESKTOP_MQ}`, () => {
      gsap.utils.toArray('.vs-m-reveal').forEach((node) => {
        gsap.fromTo(
          node,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: node, start: 'top 90%', once: true } },
        )
      })
      // The chevron keeps turning slowly on its own
      gsap.to('.vs-chev__spin', { rotationY: 360, duration: 9, repeat: -1, ease: 'none' })
    })

    return () => {
      spins.forEach((t) => t.kill())
      mm.revert()
    }
  }, [])

  const go = (i) => {
    const tl = assure.current
    if (tl?.scrollTrigger) scrollTo(tl.scrollTrigger.labelToScroll(`tab${i}`))
    else setActive(i)
  }

  return (
    <div className="vision" ref={root}>
      <section className="vs-scene">
        <div className="vs-stage">
          {/* Hero: two turning rings in a field of dots */}
          <div className="vs-hero">
            <div className="vs-box">
              {RINGS.map((ring) => (
                <div key={ring.side} className={`vs-ring vs-ring--${ring.side}`} style={{ '--cx': ring.cx, '--cy': ring.cy }} aria-hidden="true">
                  <div className="vs-ring__spin">
                    {ring.tiles.map(([name, turn], i) => (
                      <img
                        key={i}
                        className="vs-hex"
                        src={tileSrc(name)}
                        alt=""
                        style={{ '--hx': RING_SLOTS[i][0], '--hy': RING_SLOTS[i][1], '--ht': `${turn || 0}deg` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <svg className="vs-dots" viewBox="0 0 1728 1117" aria-hidden="true">
                <g className="vs-dots__navy">
                  {NAVY_DOTS.map(([x, y, r]) => (
                    <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
                  ))}
                  {BIG_PLUSES.map(([x, y]) => (
                    <Plus key={`${x}-${y}`} x={x} y={y} size={63} bar={12.5} />
                  ))}
                  {SMALL_PLUSES.map(([x, y]) => (
                    <Plus key={`${x}-${y}`} x={x} y={y} size={21} bar={4} />
                  ))}
                </g>
                <g className="vs-dots__green">
                  {GREEN_DOTS.map(([x, y, r]) => (
                    <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
                  ))}
                </g>
              </svg>
            </div>
          </div>

          {/* Ocean: chevron over the podium, strategy card */}
          <section className="vs-ocean" aria-label="Our strategy">
            <div className="vs-ocean__bg" style={{ backgroundImage: `url(${oceanImg})` }} />
            <div className="vs-box">
              <img className="vs-podium" src={podiumImg} alt="" />
              <div className="vs-chev" aria-hidden="true">
                <div className="vs-chev__exit">
                  <div className="vs-chev__spin">
                    {Array.from({ length: CHEV_LAYERS }, (_, i) => {
                      const z = CHEV_DEPTH / 2 - (i * CHEV_DEPTH) / (CHEV_LAYERS - 1)
                      const face = i === 0 || i === CHEV_LAYERS - 1
                      return (
                        <svg
                          key={i}
                          className={`vs-chev__layer${face ? ' is-face' : ''}`}
                          viewBox="0 0 287.7 253"
                          style={{ '--z': z }}
                        >
                          <Chevrons />
                        </svg>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="vs-card">
                <p>
                  <Lines lines={STRATEGY_LINES} />
                </p>
              </div>
            </div>
          </section>

          {/* The headline is shared: it rides up from the hero into the ocean panel */}
          <div className="vs-box vs-box--title">
            <h1 className="vs-title">{TITLE}</h1>
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="vs-init" aria-labelledby="vs-init-title">
        <div className="vs-init__stage">
          <div className="vs-init__frame">
            <h2 className="vs-init__title vs-m-reveal" id="vs-init-title">
              <Lines lines={INITIATIVES_LINES} />
            </h2>
            <svg className="vs-arcs" viewBox="0 0 1728 1496" aria-hidden="true">
              {ARCS.map((a, i) => (
                <path key={i} className="vs-arc" d={bezier(a.to)} pathLength="1" />
              ))}
              {BRANCHES.map((d, i) => (
                <path key={d} className={`vs-branch vs-branch--${i}`} d={d} pathLength="1" />
              ))}
            </svg>
            <div className="vs-photo vs-m-reveal">
              <img src={teamImg} alt="Xceed BioPharma clinicians in a hospital corridor" />
            </div>
            <ul className="vs-icards">
              {INITIATIVES.map((lines, i) => (
                <li key={i} className={`vs-icard vs-icard--${i} vs-m-reveal`}>
                  <span className="vs-icard__icon" style={{ '--icon': `url(${ICONS[i]})` }} aria-hidden="true" />
                  <p>
                    <Lines lines={lines} />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Assuring Success */}
      <section className="vs-assure" aria-labelledby="vs-assure-title">
        <div className="vs-assure__frame">
          <h2 className="vs-assure__title vs-m-reveal" id="vs-assure-title">
            Assuring Success
          </h2>
          <div className="vs-octs" role="tablist" aria-label="Assuring success">
            {PILLARS.map((p, i) => (
              <button
                key={p.title}
                type="button"
                role="tab"
                id={`vs-oct-${i}`}
                aria-selected={active === i}
                aria-controls={`vs-tab-${i}`}
                className={`vs-oct vs-oct--${i}${active === i ? ' is-active' : ''}`}
                style={{ '--ox': OCTAGONS[i][0], '--oy': OCTAGONS[i][1] }}
                onClick={() => go(i)}
              >
                <span className="vs-oct__fill" aria-hidden="true" />
                <span className="vs-oct__label">
                  {p.label.map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </span>
              </button>
            ))}
          </div>
          <div className="vs-tabs">
            {PILLARS.map((p, i) => (
              <div
                key={p.title}
                role="tabpanel"
                id={`vs-tab-${i}`}
                aria-labelledby={`vs-oct-${i}`}
                className={`vs-tab vs-tab--${i}${active === i ? ' is-active' : ''}`}
              >
                <h3 className="vs-tab__title">
                  <span>{p.title}</span>
                </h3>
                <div className="vs-tab__body">
                  {p.paragraphs.map((para, k) => (
                    <p key={k}>{Array.isArray(para) ? <Lines lines={para} /> : para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CollabPanel />
    </div>
  )
}

export default Vision
