import { useLayoutEffect, useRef } from 'react'
import { gsap, DESKTOP_MQ, prefersReducedMotion } from '../../lib/scroll.js'
import { useReady } from '../../lib/ready.js'
import Lines from '../../components/Lines.jsx'
import CollabPanel from '../../components/CollabPanel.jsx'
import {
  HERO_TITLE,
  HERO_BOXES,
  HERO_PANEL,
  CONC_TITLE,
  CONC_CARDS,
  NIKKEI,
  RISK_TITLE,
  RISK_SLIDES,
} from '../../data/ksm.js'
import crystalImg from '../../assets/ksm/crystal.webp'
import whaleImg from '../../assets/ksm/whale.jpg'
import portImg from '../../assets/ksm/port.jpg'
import labImg from '../../assets/ksm/lab-vr.jpg'
import cleanroomImg from '../../assets/ksm/cleanroom.jpg'
import './Ksm.css'

/*
  The pinned scene is laid out on the mockup's 1920 × 1135 frame (design px).
  Hero: the crystal sits in a stepped "cross" window that grows out of the word "Disruption"
  while the photo inside zooms back; the title turns white wherever it crosses the window.
  The backgrounds of the later scenes are revealed with bottom-up wipes, as in the mockup.
*/
const SLIDE_BGS = [portImg, labImg, cleanroomImg]

// Card stack: how far back cards sit (design px / scale), front card first
const DEPTH = [
  { y: 0, s: 1 },
  { y: -72, s: 0.864 },
  { y: -128, s: 0.752 },
]

// Splits each line into a clipped row so it can rise into place
function MaskLines({ lines }) {
  return lines.map((line) => (
    <span key={line} className="ln ln--mask">
      <span>{line}</span>
    </span>
  ))
}

function Paras({ paras }) {
  return paras.map((lines) => (
    <p key={lines[0]}>
      <Lines lines={lines} />
    </p>
  ))
}

function NikkeiCard({ className = '' }) {
  return (
    <div className={`ks-card ks-card--nikkei ${className}`}>
      <p className="ks-card__lead">
        <Lines lines={NIKKEI.lines} />
      </p>
      <a className="ks-read" href={NIKKEI.href} target="_blank" rel="noreferrer">
        <span className="ks-read__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </span>
        <span className="ks-read__label">{NIKKEI.label}</span>
      </a>
    </div>
  )
}

function SlideBody({ slide }) {
  const intro = slide.intro && (
    <p className="ks-rp__intro ks-rp__item">
      <Lines lines={slide.intro} />
    </p>
  )
  return (
    <>
      {slide.introFirst && intro}
      <p className="ks-rp__num ks-rp__item">{slide.num}</p>
      <h3 className="ks-rp__title ks-rp__item">{slide.title}</h3>
      {!slide.introFirst && intro}
      <div className="ks-rp__cols">
        {slide.cols.map((lines) => (
          <p key={lines[0]} className="ks-rp__col ks-rp__item">
            <Lines lines={lines} />
          </p>
        ))}
      </div>
    </>
  )
}

function Ksm() {
  const root = useRef(null)
  const ready = useReady()

  // Scroll-scrubbed scene
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)

    mm.add(DESKTOP_MQ, () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: '.ks-wrap',
          start: 'top top',
          end: () => `+=${window.innerHeight * 15}`,
          pin: '.ks-stage',
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // 1 · Hero drifts up; the window travels faster than the title
      tl.fromTo('.ks-hero', { '--cy': 0, '--ty': 0 }, { '--cy': -238.2, '--ty': -114.5, duration: 1, ease: 'power1.inOut' }, 0)

      // 2 · The two outlined notes glide in from the right as one train
      tl.fromTo('.ks-boxes__track', { '--bx': 1620 }, { '--bx': 0, duration: 1.4, ease: 'power2.out' }, 0.7)

      // 3 · Blue statement panel rises; the hero steps back
      tl.fromTo('.ks-hpanel', { '--py': 800 }, { '--py': 0, duration: 1, ease: 'power2.out' }, 2.3)
        .fromTo('.ks-hero', { scale: 1 }, { scale: 0.85, duration: 1, ease: 'power2.out' }, 2.3)

      // 4 · The crystal-ball scene wipes up over it, settling from a slight zoom
      tl.fromTo('.ks-conc', { '--wipe': 1 }, { '--wipe': 0, duration: 1.1, ease: 'power2.inOut' }, 3.6)
        .fromTo('.ks-conc__bg', { scale: 1.35 }, { scale: 1, duration: 1.3, ease: 'power2.out' }, 3.6)
        .fromTo('.ks-conc__title .ln > span', { yPercent: 110 }, { yPercent: 0, duration: 0.5, stagger: 0.18, ease: 'power3.out' }, 4.75)

      // 5 · Cards rise one after another; earlier ones step back into a stack
      const cards = gsap.utils.toArray('.ks-stage .ks-card')
      cards.forEach((card, i) => {
        const at = 5.4 + i * 1.15
        tl.fromTo(card, { '--cy': 900 }, { '--cy': 0, duration: 0.8, ease: 'power2.out' }, at)
        for (let j = 0; j < i; j++) {
          const from = DEPTH[i - j - 1]
          const to = DEPTH[i - j]
          tl.fromTo(cards[j], { '--cy': from.y, '--cs': from.s }, { '--cy': to.y, '--cs': to.s, duration: 0.8, ease: 'power2.out', immediateRender: false }, at)
        }
      })

      // 6 · Port scene wipes up; its title fades in, then the blue panel rises with its copy
      tl.fromTo('.ks-risk', { '--wipe': 1 }, { '--wipe': 0, duration: 1.1 }, 9.3)
        .fromTo('.ks-risk__title', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: 'power1.out' }, 10.3)

      gsap.utils.toArray('.ks-stage .ks-slide').forEach((slide, i) => {
        const at = 11.0 + i * 2.6
        if (i > 0) {
          tl.fromTo(slide, { '--wipe': 1 }, { '--wipe': 0, duration: 1, ease: 'power2.inOut' }, at - 1.1)
        }
        tl.fromTo(slide.querySelector('.ks-rp'), { '--py': 1200 }, { '--py': 0, duration: 0.9, ease: 'power2.out' }, at)
          .fromTo(
            slide.querySelectorAll('.ks-rp__item'),
            { autoAlpha: 0, y: 70 },
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.14, ease: 'power2.out' },
            at + 0.5,
          )
      })

      tl.to({}, { duration: 0.8 }, '>')
    })

    // Narrow / portrait: stacked sections with scroll reveals
    mm.add(`not all and ${DESKTOP_MQ}`, () => {
      gsap.utils.toArray('.ks-m-reveal').forEach((node) => {
        gsap.fromTo(
          node,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: node, start: 'top 88%', once: true } },
        )
      })
    })

    return () => mm.revert()
  }, [])

  // Opening: the title rises line by line, then the window opens out of "Disruption"
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)
    mm.add(DESKTOP_MQ, () => {
      const hero = root.current.querySelector('.ks-hero')
      const lines = root.current.querySelectorAll('.ks-hero .ks-title .ln > span')
      const end = { '--tx': 0, '--ti': 0, '--ws': 1, '--is': 1 }
      if (prefersReducedMotion()) {
        gsap.set(hero, end)
        gsap.set(lines, { yPercent: 0 })
        return
      }
      gsap.set(hero, { '--tx': 240, '--ti': 45, '--ws': 0, '--is': 1.7 })
      gsap.set(lines, { yPercent: 115 })
      if (!ready) return

      const line = (n) => root.current.querySelectorAll(`.ks-hero .ks-title .ln:nth-child(${n}) > span`)
      gsap
        .timeline({ delay: 0.25 })
        .to(line(1), { yPercent: 0, duration: 0.8, ease: 'power3.out' }, 0)
        .to(line(2), { yPercent: 0, duration: 0.8, ease: 'power3.out' }, 0.38)
        .to(hero, { '--ti': 0, duration: 0.9, ease: 'power2.inOut' }, 0.3)
        .fromTo(hero, { '--ws': 0.06 }, { '--ws': 1, duration: 1.15, ease: 'power3.inOut' }, 1.55)
        .to(hero, { '--is': 1, duration: 1.3, ease: 'power3.out' }, 1.55)
        .to(hero, { '--tx': 0, duration: 1.15, ease: 'power3.inOut' }, 1.55)
    })
    return () => mm.revert()
  }, [ready])

  return (
    <div className="ksm" ref={root}>
      {/* ---------- Desktop: one pinned, scroll-scrubbed scene ---------- */}
      <section className="ks-wrap">
        <div className="ks-stage">
          <div className="ks-box">
            {/* A Dynamic in Need of Disruption */}
            <div className="ks-hero">
              <h1 className="ks-title">
                <MaskLines lines={HERO_TITLE} />
              </h1>
              <div className="ks-window" aria-hidden="true">
                <img className="ks-window__img" src={crystalImg} alt="" />
                <p className="ks-title ks-title--white">
                  <MaskLines lines={HERO_TITLE} />
                </p>
              </div>
              <div className="ks-boxes">
                <div className="ks-boxes__track">
                  {HERO_BOXES.map((lines, i) => (
                    <div key={i} className={`ks-note ks-note--${i + 1}`}>
                      <p>
                        <Lines lines={lines} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="ks-hpanel">
              {HERO_PANEL.map((lines, i) => (
                <p key={i} className={`ks-hpanel__col ks-hpanel__col--${i + 1}`}>
                  <Lines lines={lines} />
                </p>
              ))}
              <span className="ks-hpanel__rule" aria-hidden="true" />
            </div>

            {/* Over Concentration of Production */}
            <section className="ks-conc" aria-labelledby="ks-conc-title">
              <img className="ks-conc__bg" src={whaleImg} alt="" aria-hidden="true" />
              <h2 className="ks-conc__title" id="ks-conc-title">
                <MaskLines lines={CONC_TITLE} />
              </h2>
              {CONC_CARDS.map((paras, i) => (
                <div key={i} className={`ks-card ks-card--${i + 1}`}>
                  <Paras paras={paras} />
                </div>
              ))}
              <NikkeiCard className="ks-card--3" />
            </section>

            {/* Risk Mitigation via Strategic Diversification */}
            <section className="ks-risk" aria-labelledby="ks-risk-title">
              {RISK_SLIDES.map((slide, i) => (
                <div key={slide.num} className={`ks-slide ks-slide--${i + 1}`}>
                  <img className="ks-slide__bg" src={SLIDE_BGS[i]} alt="" aria-hidden="true" />
                  <div className="ks-rp">
                    <SlideBody slide={slide} />
                  </div>
                </div>
              ))}
              <h2 className="ks-risk__title" id="ks-risk-title">
                <Lines lines={RISK_TITLE} />
              </h2>
            </section>
          </div>
        </div>
      </section>

      {/* ---------- Phone / portrait: the same story, stacked ---------- */}
      <div className="ks-m">
        <section className="ks-m-hero">
          <h1 className="ks-m-hero__title">
            <Lines lines={HERO_TITLE} />
          </h1>
          <div className="ks-m-window ks-m-reveal" aria-hidden="true">
            <img src={crystalImg} alt="" />
          </div>
          {HERO_BOXES.map((lines, i) => (
            <div key={i} className="ks-note ks-m-reveal">
              <p>
                <Lines lines={lines} />
              </p>
            </div>
          ))}
          <div className="ks-m-panel ks-m-reveal">
            {HERO_PANEL.map((lines, i) => (
              <p key={i}>
                <Lines lines={lines} />
              </p>
            ))}
          </div>
        </section>

        <section className="ks-m-conc" style={{ backgroundImage: `url(${whaleImg})` }}>
          <h2 className="ks-m-conc__title ks-m-reveal">
            <Lines lines={CONC_TITLE} />
          </h2>
          {CONC_CARDS.map((paras, i) => (
            <div key={i} className="ks-card ks-m-reveal">
              <Paras paras={paras} />
            </div>
          ))}
          <NikkeiCard className="ks-m-reveal" />
        </section>

        <section className="ks-m-risk">
          <div className="ks-m-risk__head" style={{ backgroundImage: `url(${portImg})` }}>
            <h2 className="ks-m-risk__title ks-m-reveal">
              <Lines lines={RISK_TITLE} />
            </h2>
          </div>
          {RISK_SLIDES.map((slide, i) => (
            <div key={slide.num} className="ks-m-slide">
              {i > 0 && <div className="ks-m-slide__img" style={{ backgroundImage: `url(${SLIDE_BGS[i]})` }} aria-hidden="true" />}
              <div className="ks-rp ks-m-reveal">
                <SlideBody slide={slide} />
              </div>
            </div>
          ))}
        </section>
      </div>

      <CollabPanel title="Let’s Collaborate" cta="Get In Touch" variant="home" />
    </div>
  )
}

export default Ksm
