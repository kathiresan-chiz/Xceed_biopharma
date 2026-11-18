import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap, DESKTOP_MQ } from '../../lib/scroll.js'
import Lines from '../../components/Lines.jsx'
import CollabPanel from '../../components/CollabPanel.jsx'
import {
  HERO_TITLE,
  HERO_LINES,
  DECODING_TITLE,
  DECODING_ITEMS,
  DECODING_CTA,
  RESILIENT_TITLE,
  RESILIENT_BOXES,
  CIDRAP,
  TRANSFORMING_TITLE,
  TRANSFORMING_LINES,
  READY_TITLE,
  READY_LINES,
  STEPS,
} from '../../data/gsi.js'
import sceneImg from '../../assets/gsi/scene.webp'
import headMask from '../../assets/gsi/head-mask.png'
import crescentL from '../../assets/gsi/crescent-l.webp'
import crescentR from '../../assets/gsi/crescent-r.webp'
import syringeImg from '../../assets/gsi/syringe.webp'
import marbleImg from '../../assets/gsi/marble.jpg'
import doctorImg from '../../assets/gsi/doctor.jpg'
import step1 from '../../assets/gsi/step-1.webp'
import step2 from '../../assets/gsi/step-2.webp'
import step3 from '../../assets/gsi/step-3.webp'
import './Gsi.css'

/*
  Everything in the pinned scene is laid out on the mockup's 1728 × 960 frame (design px).
  The hero is one composition (head, bubbles, network) that starts turned 90° and zoomed 2.44×
  so the head reads as a mountain range; scrolling turns it upright. The little globe beside it is
  the two crescents + syringe at 12% scale, which later open up into the "Decoding" illustration.
*/
const SCENE = { left: 779.7, top: 0, ox: 540.4, oy: 516.8 } // box position + pivot (element px)
const TITLE = { left: -22.2, top: 249.4, w: 1000, h: 212 } // final upright title box
const TITLE_C = { x: TITLE.left + TITLE.w / 2, y: TITLE.top + TITLE.h / 2 }

const STATES = {
  // scene: x/y offset, rotation, scale · title: x/y offset, rotation
  rotated: { sx: -411.4, sy: 571.5, sr: 90, ss: 2.44, tx: 378.5, ty: 172.2, tr: 90 },
  upright: { sx: -159.6, sy: 0, sr: 0, ss: 1, tx: 272, ty: 4.5, tr: 0 },
  settled: { sx: 0, sy: 0, sr: 0, ss: 1, tx: 0, ty: 0, tr: 0 },
}

// Crescents / syringe: centre (design px), rotation, scale. Scale 1 = the cut image size.
const ORB = {
  rotated: { l: [643.7, 652.8, 90, 0.124], r: [643.7, 652.8, 90, 0.124], s: [643.7, 652.8, 0, 0.125] },
  globe: { l: [852.2, 569.3, 0, 0.124], r: [852.2, 569.3, 0, 0.124], s: [852.2, 569.3, -90, 0.125] },
  open: { l: [604.7, 604.7, 0, 0.854], r: [1128.7, 614.7, 0, 0.854], s: [852.2, 567.5, -45, 0.834] },
  spread: { l: [355.4, 602.9, 0, 1], r: [1351.7, 614.7, 0, 1], s: [617.4, 568.4, -34, 0.905] },
  edges: { l: [-83.4, 602, 0, 1.3], r: [1755.2, 623.7, 0, 1.3], s: [195.8, 567.5, 0, 1] },
}

const orbVars = ([x, y, r, s]) => ({ '--x': x, '--y': y, '--r': r, '--s': s })

// Box-space matrix (design px) → CSS matrix for an element whose own top-left sits at (ex, ey)
function cssMatrix(m, ex, ey, u) {
  const k = new DOMMatrix().translate(-ex, -ey).multiply(m).translate(ex, ey)
  return `matrix(${k.a},${k.b},${k.c},${k.d},${k.e * u},${k.f * u})`
}

const sceneMatrix = (st) => {
  const px = SCENE.left + SCENE.ox
  const py = SCENE.top + SCENE.oy
  return new DOMMatrix().translate(px + st.sx, py + st.sy).rotate(st.sr).scale(st.ss).translate(-px, -py)
}

const titleMatrix = (st) =>
  new DOMMatrix().translate(TITLE_C.x + st.tx, TITLE_C.y + st.ty).rotate(st.tr).translate(-TITLE_C.x, -TITLE_C.y)

/* ---------------------------------------------------------------
   Ready-to-use / Ready-to-mix / CDMO — the three-step roadmap
---------------------------------------------------------------- */
const STEP_ICONS = [step1, step2, step3]

function Roadmap() {
  const [active, setActive] = useState(1)
  const step = STEPS[active]

  return (
    <section className="gs-ready" aria-labelledby="gs-ready-title">
      <h2 className="gs-ready__title" id="gs-ready-title">
        {READY_TITLE}
      </h2>
      <p className="gs-ready__text">
        <Lines lines={READY_LINES} />
      </p>
      <div className="gs-steps" role="tablist" aria-label="Development roadmap">
        {STEPS.map((s, i) => (
          <div key={s.label} className="gs-steps__item">
            {i > 0 && <span className="gs-steps__arrow" aria-hidden="true" />}
            <button
              type="button"
              role="tab"
              id={`gs-step-${i}`}
              aria-selected={i === active}
              aria-controls="gs-step-panel"
              className={`gs-step${i === active ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              <img src={STEP_ICONS[i]} alt="" />
              <span>{s.label}</span>
            </button>
          </div>
        ))}
      </div>
      <div className="gs-ready__panel" id="gs-step-panel" role="tabpanel" aria-labelledby={`gs-step-${active}`}>
        <h3 key={step.title} className="gs-ready__step-title">
          {step.title}
        </h3>
        <p key={`${step.title}-p`} className="gs-ready__step-text">
          <Lines lines={step.lines} />
        </p>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------
   Shared blocks (used by the pinned scene and the stacked layout)
---------------------------------------------------------------- */
function DecodingList({ prefix = 'gs' }) {
  return (
    <ol className={`${prefix}-dec__list`}>
      {DECODING_ITEMS.map((lines, i) => (
        <li key={i} className={`${prefix}-dec__item ${prefix}-dec__item--${i + 1}`}>
          <span className="gs-dec__num">{String(i + 1).padStart(2, '0')}</span>
          <p className="gs-dec__text">
            <Lines lines={lines} />
          </p>
        </li>
      ))}
    </ol>
  )
}

function DecodingCta() {
  return (
    <div className="gs-dec__cta">
      <p>{DECODING_CTA.text}</p>
      <a href={DECODING_CTA.href} target="_blank" rel="noreferrer" className="gs-btn gs-btn--soft">
        {DECODING_CTA.label}
      </a>
    </div>
  )
}

function CidrapCard() {
  return (
    <div className="gs-res__card">
      <p>
        <Lines lines={CIDRAP.lines} />
      </p>
      <a href={CIDRAP.href} target="_blank" rel="noreferrer" className="gs-res__card-btn">
        {CIDRAP.label}
      </a>
    </div>
  )
}

function TransformingCard({ className = '' }) {
  return (
    <article className={`gs-tr ${className}`} aria-labelledby={className ? undefined : 'gs-tr-title'}>
      <h2 className="gs-tr__title" id={className ? undefined : 'gs-tr-title'}>
        <Lines lines={TRANSFORMING_TITLE} />
      </h2>
      <img className="gs-tr__img" src={doctorImg} alt="Doctor holding a phone surrounded by digital health icons" />
      <p className="gs-tr__text">
        <Lines lines={TRANSFORMING_LINES} />
      </p>
      <Link to="/insights" className="gs-btn gs-tr__btn">
        Read More
      </Link>
    </article>
  )
}

/* ---------------------------------------------------------------
   Page
---------------------------------------------------------------- */
function Gsi() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)

    mm.add(DESKTOP_MQ, () => {
      const el = root.current
      const q = (s) => el.querySelector(s)
      const scenes = [q('.gs-scene'), q('.gs-mask')]
      const title = q('.gs-hero__title')
      const white = q('.gs-hero__title--white')
      const box = q('.gs-box')
      const st = { ...STATES.rotated }

      const apply = () => {
        const u = box.offsetWidth / 1728
        const ms = sceneMatrix(st)
        const mt = titleMatrix(st)
        const sceneCss = cssMatrix(ms, SCENE.left, SCENE.top, u)
        scenes[0].style.transform = sceneCss
        scenes[1].style.transform = sceneCss
        title.style.transform = cssMatrix(mt, TITLE.left, TITLE.top, u)
        // The white copy lives inside the head mask, so undo the scene's transform first
        const local = ms.inverse().multiply(mt)
        white.style.transform = cssMatrix(local, TITLE.left, TITLE.top, u)
      }
      apply()
      window.addEventListener('resize', apply)

      const setOrb = (name) => {
        const o = ORB[name]
        gsap.set('.gs-cres--l', orbVars(o.l))
        gsap.set('.gs-cres--r', orbVars(o.r))
        gsap.set('.gs-syringe', orbVars(o.s))
      }
      // Explicit from-states keep every leg exact when the scrub runs backwards
      const toOrb = (tl, from, name, at, vars) => {
        const a = ORB[from]
        const o = ORB[name]
        tl.fromTo('.gs-cres--l', orbVars(a.l), { ...orbVars(o.l), ...vars, immediateRender: false }, at)
          .fromTo('.gs-cres--r', orbVars(a.r), { ...orbVars(o.r), ...vars, immediateRender: false }, at)
          .fromTo('.gs-syringe', orbVars(a.s), { ...orbVars(o.s), ...vars, immediateRender: false }, at)
      }
      setOrb('rotated')

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: q('.gs-scene-wrap'),
          start: 'top top',
          end: () => `+=${window.innerHeight * 11}`,
          pin: '.gs-stage',
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // 1 · The landscape turns upright into the head; the title turns with it
      tl.to(st, { ...STATES.upright, duration: 1.6, ease: 'power1.inOut', onUpdate: apply }, 0)
      toOrb(tl, 'rotated', 'globe', 0, { duration: 1.6, ease: 'power1.inOut' })

      // 2 · Head steps right, title settles left, intro copy rises in
      tl.to(st, { ...STATES.settled, duration: 0.8, onUpdate: apply }, 1.75)
        .fromTo('.gs-hero__text', { autoAlpha: 0, '--y': 26 }, { autoAlpha: 1, '--y': 0, duration: 0.6, ease: 'power2.out' }, 2.15)

      // 3 · Hero parts slide off; the globe opens into the two crescents and syringe
      tl.to(st, { sx: 1150, tx: -1100, ty: -150, duration: 1.1, ease: 'power2.in', onUpdate: apply }, 3.0)
        .to('.gs-hero__text', { '--hx': -1100, '--y': 150, duration: 1.1, ease: 'power2.in' }, 3.0)
      toOrb(tl, 'globe', 'open', 3.1, { duration: 1.1, ease: 'power2.inOut' })

      // 4 · Section title unmasks line by line
      tl.fromTo('.gs-dec__title .ln > span', { yPercent: 110 }, { yPercent: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }, 4.0)

      // 5 · Crescents drift apart and out to the edges; syringe stands up on the left
      toOrb(tl, 'open', 'spread', 5.0, { duration: 0.6, ease: 'power1.in' })
      toOrb(tl, 'spread', 'edges', 5.6, { duration: 0.6, ease: 'power2.out' })

      // 6 · The four points fade up in turn, then the report link
      tl.fromTo(
        '.gs-dec__item',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.38, ease: 'power2.out' },
        6.2,
      ).fromTo('.gs-dec__cta', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 7.75)

      // 7 · Blue "Resilient Drug Supply" panel rises over it
      tl.fromTo('.gs-res', { '--py': 960 }, { '--py': 0, duration: 1.0, ease: 'power2.inOut' }, 8.6)
        .set(['.gs-dec__title', '.gs-dec__list', '.gs-dec__cta', '.gs-orb'], { autoAlpha: 0 }, 9.65)
        .fromTo('.gs-res__title', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 9.5)

      // 8 · Each box draws its top rule, then opens downward; the CIDRAP card follows
      tl.fromTo('.gs-res__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.4, stagger: 0.3, ease: 'power2.inOut' }, 9.9)
        .fromTo(
          '.gs-res__box',
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, stagger: 0.3, ease: 'power2.inOut' },
          10.2,
        )
        .fromTo(
          '.gs-res .gs-res__card',
          { clipPath: 'inset(0% 0% 100% 0%)', y: 50 },
          { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 0.8, ease: 'power2.inOut' },
          10.9,
        )

      // 9 · The Transforming card rises inside the blue frame
      tl.fromTo('.gs-stage .gs-tr', { '--py': 960 }, { '--py': 0, duration: 1.1, ease: 'power2.inOut' }, 12.2)
        .to({}, { duration: 0.5 }, 13.3)

      return () => window.removeEventListener('resize', apply)
    })

    // Narrow / portrait: stacked sections with scroll reveals
    mm.add(`not all and ${DESKTOP_MQ}`, () => {
      gsap.utils.toArray('.gs-m-reveal').forEach((node) => {
        gsap.fromTo(
          node,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: node, start: 'top 88%', once: true } },
        )
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <div className="gsi" ref={root}>
      {/* ---------- Desktop: one pinned, scroll-scrubbed scene ---------- */}
      <section className="gs-scene-wrap">
        <div className="gs-stage">
          <div className="gs-box">
            {/* Hero */}
            <img className="gs-scene" src={sceneImg} alt="" aria-hidden="true" />
            <h1 className="gs-hero__title">
              <Lines lines={HERO_TITLE} />
            </h1>
            <div className="gs-mask" aria-hidden="true" style={{ maskImage: `url(${headMask})`, WebkitMaskImage: `url(${headMask})` }}>
              <p className="gs-hero__title gs-hero__title--white">
                <Lines lines={HERO_TITLE} />
              </p>
            </div>
            <p className="gs-hero__text">
              <Lines lines={HERO_LINES} />
            </p>

            {/* Decoding Generic Sterile Injectables */}
            <h2 className="gs-dec__title">
              {DECODING_TITLE.map((l) => (
                <span key={l} className="ln">
                  <span>{l}</span>
                </span>
              ))}
            </h2>
            <DecodingList />
            <DecodingCta />

            {/* Globe → crescents + syringe */}
            <img className="gs-orb gs-cres gs-cres--l" src={crescentL} alt="" aria-hidden="true" />
            <img className="gs-orb gs-cres gs-cres--r" src={crescentR} alt="" aria-hidden="true" />
            <img className="gs-orb gs-syringe" src={syringeImg} alt="" aria-hidden="true" />

            {/* Resilient Drug Supply, with the Transforming card rising inside it */}
            <section className="gs-res" style={{ backgroundImage: `url(${marbleImg})` }} aria-labelledby="gs-res-title">
              <h2 className="gs-res__title" id="gs-res-title">
                {RESILIENT_TITLE}
              </h2>
              {RESILIENT_BOXES.map((lines, i) => (
                <div key={i} className={`gs-res__slot gs-res__slot--${i + 1}`}>
                  <span className="gs-res__rule" />
                  <div className="gs-res__box">
                    <p>
                      <Lines lines={lines} />
                    </p>
                  </div>
                </div>
              ))}
              <CidrapCard />
              <TransformingCard />
            </section>
          </div>
        </div>
      </section>

      {/* ---------- Phone / portrait: the same story, stacked ---------- */}
      <div className="gs-m">
        <section className="gs-m-hero">
          <img className="gs-m-hero__img" src={sceneImg} alt="" aria-hidden="true" />
          <h1 className="gs-m-hero__title">
            <Lines lines={HERO_TITLE} />
          </h1>
          <p className="gs-m-hero__text">
            <Lines lines={HERO_LINES} />
          </p>
        </section>

        <section className="gs-m-dec">
          <div className="gs-m-dec__art gs-m-reveal" aria-hidden="true">
            <img src={crescentL} alt="" />
            <img className="gs-m-dec__syringe" src={syringeImg} alt="" />
            <img src={crescentR} alt="" />
          </div>
          <h2 className="gs-m-dec__title gs-m-reveal">
            <Lines lines={DECODING_TITLE} />
          </h2>
          <div className="gs-m-reveal">
            <DecodingList prefix="gs-m" />
          </div>
          <div className="gs-m-reveal">
            <DecodingCta />
          </div>
        </section>

        <section className="gs-m-res" style={{ backgroundImage: `url(${marbleImg})` }}>
          <h2 className="gs-res__title">{RESILIENT_TITLE}</h2>
          {RESILIENT_BOXES.map((lines, i) => (
            <div key={i} className="gs-res__box gs-m-reveal">
              <p>
                <Lines lines={lines} />
              </p>
            </div>
          ))}
          <div className="gs-m-reveal">
            <CidrapCard />
          </div>
        </section>

        <div className="gs-m-tr">
          <TransformingCard className="gs-m-reveal" />
        </div>
      </div>

      <Roadmap />
      <CollabPanel cta="Contact Us" variant="home" />
    </div>
  )
}

export default Gsi
