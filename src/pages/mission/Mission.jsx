import { useLayoutEffect, useRef } from 'react'
import { gsap, DESKTOP_MQ } from '../../lib/scroll.js'
import { setNavLock } from '../../lib/navLock.js'
import Lines from '../../components/Lines.jsx'
import CollabPanel from '../../components/CollabPanel.jsx'
import {
  HERO_LINES,
  PRIMACY_TITLE,
  PRIMACY_LINES,
  OBJECTIVES,
  STRATEGY_LINES,
  DIAGNOSIS,
  PILLARS,
  SHAPES,
} from '../../data/mission.js'
import heroImg from '../../assets/mission/hero.jpg'
import primacy1 from '../../assets/mission/primacy-1.jpg'
import primacy2 from '../../assets/mission/primacy-2.jpg'
import objectivesBg from '../../assets/mission/objectives-bg.jpg'
import objectivesCircle from '../../assets/mission/objectives-circle.jpg'
import strategyBg from '../../assets/mission/strategy-bg.jpg'
import './Mission.css'

// Everything below is laid out on the Figma frame: 1728 × 1117 design pixels
const DW = 1728
const DH = 1117

const poly = (name) => `polygon(${SHAPES[name]})`
const lerp = (a, b, t) => a + (b - a) * t

/* ---------------------------------------------------------------
   Sphere that splits into the two framing arcs (drawn in SVG)
---------------------------------------------------------------- */
const CX = 864.5
const SPHERE = { r0: 247, r1: 360, cy0: 742, cy1: 716, d1: 308 }

function polar(cx, cy, r, deg) {
  const a = (deg * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

function arcPath(cx, cy, r, from, to) {
  const [x0, y0] = polar(cx, cy, r, from)
  const [x1, y1] = polar(cx, cy, r, to)
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`
}

function drawSphere(svg, st) {
  const r = lerp(SPHERE.r0, SPHERE.r1, st.grow)
  const cy = lerp(SPHERE.cy0, SPHERE.cy1, st.grow)
  const d = SPHERE.d1 * st.sep
  const L = CX - d
  const R = CX + d
  const k = r / SPHERE.r0
  const q = (sel) => svg.querySelector(sel)

  q('.sp-base').setAttribute('d', `M${L} ${cy - r}H${R}A${r} ${r} 0 0 1 ${R} ${cy + r}H${L}A${r} ${r} 0 0 1 ${L} ${cy - r}Z`)
  q('.sp-left').setAttribute('d', `M${L + 0.8} ${cy - r}H${L}A${r} ${r} 0 0 0 ${L} ${cy + r}H${L + 0.8}Z`)
  q('.sp-right').setAttribute('d', `M${R - 0.8} ${cy - r}H${R}A${r} ${r} 0 0 1 ${R} ${cy + r}H${R - 0.8}Z`)
  q('.sp-left').style.fillOpacity = st.fill
  q('.sp-right').style.fillOpacity = st.fill
  q('.sp-arc-l').setAttribute('d', arcPath(L, cy, r, lerp(90, 104, st.grow), lerp(270, 256, st.grow)))
  q('.sp-arc-r').setAttribute('d', arcPath(R, cy, r, lerp(-90, -76, st.grow), lerp(90, 76, st.grow)))
  for (const el of svg.querySelectorAll('.sp-arc')) {
    el.style.strokeWidth = lerp(2.5, 5, st.grow)
    el.style.opacity = lerp(0.75, 1, st.grow)
  }
  for (const [id, cx] of [['spg-l', L], ['spg-r', R]]) {
    const g = q(`#${id}`)
    g.setAttribute('cx', cx - 13 * k)
    g.setAttribute('cy', cy + 126 * k)
    g.setAttribute('r', 330 * k)
  }
  // Glints sit on the left half; the small pair at lower right rides the right half
  q('.sp-glint-a').setAttribute('d', arcPath(L, cy, 206 * k, 216, 253))
  q('.sp-glint-b').setAttribute('d', arcPath(L, cy, 201 * k, 195, 205))
  q('.sp-glint-c').setAttribute('d', arcPath(R, cy, 214 * k, 49, 58))
  q('.sp-glint-d').setAttribute('d', arcPath(R, cy, 216 * k, 42.5, 43.5))
  q('.sp-glints').style.opacity = st.glint
}

function Sphere() {
  return (
    <svg className="ms-sphere" viewBox={`0 0 ${DW} ${DH}`} aria-hidden="true">
      <defs>
        {['spg-l', 'spg-r'].map((id) => (
          <radialGradient key={id} id={id} gradientUnits="userSpaceOnUse" cx="851" cy="868" r="330">
            <stop offset="0" stopColor="#061622" />
            <stop offset="0.38" stopColor="#1e2c37" />
            <stop offset="0.78" stopColor="#4a565f" />
            <stop offset="1" stopColor="#6c757c" />
          </radialGradient>
        ))}
      </defs>
      <path className="sp-base" fill="#fff" />
      <path className="sp-left" fill="url(#spg-l)" />
      <path className="sp-right" fill="url(#spg-r)" />
      <path className="sp-arc sp-arc-l" />
      <path className="sp-arc sp-arc-r" />
      <g className="sp-glints">
        <path className="sp-glint-a" strokeWidth="18" />
        <path className="sp-glint-b" strokeWidth="14" />
        <path className="sp-glint-c" strokeWidth="8" />
        <path className="sp-glint-d" strokeWidth="8" />
      </g>
    </svg>
  )
}

/* ---------------------------------------------------------------
   Page
---------------------------------------------------------------- */
function Mission() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)

    mm.add(DESKTOP_MQ, () => {
      const el = root.current
      const svg = el.querySelector('.ms-sphere')
      const sphere = { sep: 0, grow: 0, fill: 1, glint: 1 }
      const redraw = () => drawSphere(svg, sphere)
      redraw()

      // Design space → screen pixels (content box is contained and centred in the viewport)
      const view = () => {
        const w = window.innerWidth
        const h = window.innerHeight
        const u = Math.min(Math.max(w / DW, h / DH), w / 1600)
        return { w, h, u, ox: (w - DW * u) / 2, oy: (h - DH * u) / 2 }
      }
      const insetFor = (x, y, cw, ch, rad) => () => {
        const { w, h, u, ox, oy } = view()
        const l = ox + x * u
        const t = oy + y * u
        return `inset(${t}px ${w - l - cw * u}px ${h - t - ch * u}px ${l}px round ${rad * u}px)`
      }
      const fullInset = () => 'inset(0px 0px 0px 0px round 0px)'

      const shape = el.querySelector('.ms-shape')
      const shapeBox = el.querySelector('.ms-box--shape')
      const setShape = (x, y, size) => ({ '--sx': x, '--sy': y, '--sd': size })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: el.querySelector('.ms-scene'),
          start: 'top top',
          end: () => `+=${window.innerHeight * 12}`,
          pin: '.ms-stage',
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Keep the floating navbar over the hero until the Primacy panel has fully opened
          onUpdate: (self) => setNavLock(self.progress < 2.2 / 16.4),
          onLeaveBack: () => setNavLock(true),
        },
      })

      // 1 · Hero copy dissolves
      tl.to('.ms-hero__title .ln', { autoAlpha: 0, y: -30, stagger: 0.06, duration: 0.5, ease: 'power1.in' }, 0.2)

      // 2 · Primacy opens from a centre slit, its content zooming up to size
      tl.fromTo('.ms-primacy', { clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4 }, 0.8)
        .fromTo('.ms-primacy__zoom', { scale: 0.42 }, { scale: 1, duration: 1.4 }, 0.8)

      // 3 · Sphere splits into the framing arcs; heading settles; copy rises inside
      tl.to(sphere, { sep: 1, duration: 1.1, ease: 'power3.inOut', onUpdate: redraw }, 2.6)
        .to(sphere, { glint: 0, duration: 0.3, ease: 'none', onUpdate: redraw }, 2.6)
        .to(sphere, { grow: 1, duration: 1.3, ease: 'power2.inOut', onUpdate: redraw }, 2.9)
        .to(sphere, { fill: 0, duration: 0.7, ease: 'power1.inOut', onUpdate: redraw }, 3.3)
        .to('.ms-primacy__bg--1', { scale: 1.9, autoAlpha: 0, duration: 1.1 }, 2.6)
        .fromTo('.ms-primacy__bg--2', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.0, ease: 'power1.inOut' }, 3.0)
        .to('.ms-primacy__zoom', { backgroundColor: '#ffffff', duration: 0.9, ease: 'none' }, 2.6)
        .to('.ms-primacy__title', { '--ty': 89, '--ts': 0.5, duration: 1.3 }, 2.9)
        .fromTo(
          '.ms-primacy__text .ln',
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out' },
          3.5,
        )

      // 4 · Defined Objectives panel rises over it
      tl.fromTo('.ms-obj', { yPercent: 100 }, { yPercent: 0, duration: 1.0, ease: 'power2.inOut' }, 4.9)
        .fromTo('.ms-obj__media', { scale: 1.12 }, { scale: 1, duration: 1.2, ease: 'power2.out' }, 4.9)

      // 5 · Title and circle step back; rules draw; three columns appear
      tl.to('.ms-obj__title', { '--tx': 371, '--ty': 274, '--ts': 0.6145, duration: 1.3 }, 6.3)
        .to('.ms-obj__circle', { '--cx': 1460, '--cy': 335, '--cr': 233, duration: 1.3 }, 6.3)
        .to('.ms-obj__shade', { opacity: 0.375, duration: 1.3, ease: 'none' }, 6.3)
        .fromTo('.ms-obj__hline', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, 6.9)
        .fromTo('.ms-obj__vline', { scaleY: 0 }, { scaleY: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out' }, 7.3)
        .fromTo(
          '.ms-obj__col',
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' },
          7.3,
        )

      // 6 · The whole panel folds into a card, then a black disc, on the lavender ground
      tl.fromTo('.ms-lavender', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, ease: 'none' }, 8.35)
        .fromTo('.ms-obj', { clipPath: fullInset }, { clipPath: insetFor(214, 291, 1300, 535, 70), duration: 0.6, ease: 'power2.in' }, 8.4)
        .to('.ms-obj__dark', { opacity: 0.55, duration: 0.6, ease: 'none' }, 8.4)
        .to('.ms-obj', { clipPath: insetFor(264, 300, 560, 380, 150), duration: 0.5, ease: 'none' }, 9.0)
        .to('.ms-obj__dark', { opacity: 0.85, duration: 0.5, ease: 'none' }, 9.0)
        .to('.ms-obj', { clipPath: insetFor(264, 322, 336, 336, 168), duration: 0.4, ease: 'power2.out' }, 9.5)
        .to('.ms-obj__dark', { opacity: 1, duration: 0.4, ease: 'none' }, 9.5)
        .set(shape, { autoAlpha: 1, ...setShape(432, 490, 336) }, 9.9)
        .set('.ms-obj', { autoAlpha: 0 }, 9.9)

      // 7 · The white Strategy sheet rises under the disc, which then rolls into the headline
      tl.fromTo('.ms-strat', { yPercent: 100 }, { yPercent: 0, duration: 1.0, ease: 'power2.inOut' }, 9.9)
        .set(shapeBox, { className: 'ms-box ms-box--shape is-blend' }, 10.75)
        .to(shape, { ...setShape(1030, 538, 418), duration: 0.8, ease: 'power2.inOut' }, 10.9)

      // 8 · Disc becomes a hexagon and drops into the first card; headline lifts away
      tl.to(shape, { clipPath: poly('hexagon'), borderRadius: '0%', duration: 0.5, ease: 'power1.inOut' }, 12.1)
        .to(shape, { ...setShape(749, 861, 180), duration: 1.0, ease: 'power2.inOut' }, 12.3)
        .to('.ms-strat__head', { y: () => -420 * view().u, duration: 1.0, ease: 'power2.inOut' }, 12.3)
        .fromTo('.ms-card', { y: () => 520 * view().u }, { y: 0, duration: 1.0, ease: 'power2.inOut' }, 12.3)

      // 9 · Card content steps through the three pillars as the shape morphs
      ;['diamond', 'octagon'].forEach((name, i) => {
        const at = 13.8 + i * 1.3
        tl.to(shape, { clipPath: poly(name), duration: 0.7, ease: 'power2.inOut' }, at)
          .to(`.ms-card__copy--${i}`, { autoAlpha: 0, y: -24, duration: 0.35, ease: 'power1.in' }, at)
          .fromTo(
            `.ms-card__copy--${i + 1}`,
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' },
            at + 0.3,
          )
      })
      tl.to({}, { duration: 0.6 }, 15.8)

      setNavLock(true)
      return () => setNavLock(false)
    })

    // Narrow / portrait: stacked sections with scroll reveals
    mm.add(`not all and ${DESKTOP_MQ}`, () => {
      gsap.utils.toArray('.ms-m-reveal').forEach((node) => {
        gsap.fromTo(
          node,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: node, start: 'top 88%', once: true } },
        )
      })
      const svg = root.current.querySelector('.ms-sphere')
      const sphere = { sep: 0, grow: 0, fill: 1, glint: 1 }
      drawSphere(svg, sphere)
      gsap.timeline({
        scrollTrigger: { trigger: '.ms-primacy', start: 'top 20%', end: 'bottom 60%', scrub: 1 },
        onUpdate: () => drawSphere(svg, sphere),
      })
        .to(sphere, { sep: 1, glint: 0, duration: 1 })
        .to(sphere, { grow: 1, fill: 0, duration: 1 }, 0.4)
    })

    return () => mm.revert()
  }, [])

  return (
    <div className="mission" ref={root}>
      <section className="ms-scene">
        <div className="ms-stage">
          {/* Hero */}
          <div className="ms-hero">
            <div className="ms-hero__half ms-hero__half--l" style={{ backgroundImage: `url(${heroImg})` }} />
            <div className="ms-hero__half ms-hero__half--r" style={{ backgroundImage: `url(${heroImg})` }} />
            <div className="ms-box">
              <h1 className="ms-hero__title">
                <Lines lines={HERO_LINES} />
              </h1>
            </div>
          </div>

          {/* The Primacy of Values */}
          <section className="ms-primacy" aria-labelledby="ms-primacy-title">
            <div className="ms-primacy__zoom">
              <div className="ms-box">
                <div className="ms-primacy__bg ms-primacy__bg--1" style={{ backgroundImage: `url(${primacy1})` }} />
                <div className="ms-primacy__bg ms-primacy__bg--2" style={{ backgroundImage: `url(${primacy2})` }} />
                <Sphere />
                <h2 className="ms-primacy__title" id="ms-primacy-title">
                  {PRIMACY_TITLE}
                </h2>
                <p className="ms-primacy__text">
                  <Lines lines={PRIMACY_LINES} />
                </p>
              </div>
            </div>
          </section>

          {/* Ground the objectives panel folds onto */}
          <div className="ms-lavender" />

          {/* Defined Objectives */}
          <section className="ms-obj" aria-labelledby="ms-obj-title">
            <div className="ms-obj__media" style={{ backgroundImage: `url(${objectivesBg})` }} />
            <div className="ms-obj__shade" />
            <div className="ms-box">
              <div className="ms-obj__circle" style={{ backgroundImage: `url(${objectivesCircle})` }} />
              <h2 className="ms-obj__title" id="ms-obj-title">
                <span>Defined</span>
                <span>Objectives</span>
              </h2>
              <span className="ms-obj__hline" />
              <span className="ms-obj__vline ms-obj__vline--1" />
              <span className="ms-obj__vline ms-obj__vline--2" />
              {OBJECTIVES.map((text, i) => (
                <p key={i} className={`ms-obj__col ms-obj__col--${i + 1}`}>
                  {text}
                </p>
              ))}
            </div>
            <div className="ms-obj__dark" />
          </section>

          {/* Strategy Informed by Perspective + pillars */}
          <section className="ms-strat" aria-labelledby="ms-strat-title">
            <div className="ms-strat__head">
              <div className="ms-strat__bg" style={{ backgroundImage: `url(${strategyBg})` }} />
              <div className="ms-box">
                <h2 className="ms-strat__title" id="ms-strat-title">
                  {STRATEGY_LINES.map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </h2>
              </div>
            </div>
            <div className="ms-box ms-box--cards">
              <article className="ms-card">
                <p className="ms-card__diag">
                  <Lines lines={DIAGNOSIS} />
                </p>
                {PILLARS.map((p, i) => (
                  <div key={p.title} className={`ms-card__copy ms-card__copy--${i}${p.small ? ' is-small' : ''}`}>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </div>
                ))}
              </article>
            </div>
          </section>

          {/* Travelling shape: disc → hexagon → diamond → octagon */}
          <div className="ms-box ms-box--shape" aria-hidden="true">
            <span className="ms-shape" style={{ clipPath: poly('square') }} />
          </div>
        </div>
      </section>

      {/* Phone / portrait: the pillars as plain cards */}
      <section className="ms-m-pillars">
        {PILLARS.map((p) => (
          <article key={p.title} className="ms-m-card ms-m-reveal">
            <p className="ms-card__diag">
              <Lines lines={DIAGNOSIS} />
            </p>
            <span className="ms-m-card__shape" style={{ clipPath: poly(p.shape) }} />
            <div className={`ms-m-card__copy${p.small ? ' is-small' : ''}`}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          </article>
        ))}
      </section>

      <CollabPanel />
    </div>
  )
}

export default Mission
