import { useLayoutEffect, useRef } from 'react'
import { gsap, DESKTOP_MQ } from '../../lib/scroll.js'
import Lines from '../../components/Lines.jsx'
import CollabPanel from '../../components/CollabPanel.jsx'
import {
  HERO_LINE,
  TITLE,
  NEXUS_TITLE,
  NEXUS_LINES,
  PILLARS,
  FUTURE_TITLE,
  FUTURE_INTRO,
  FUTURE_PANELS,
} from '../../data/biopavilion.js'
import campusImg from '../../assets/biopavilion/campus.jpg'
import playbookImg from '../../assets/biopavilion/slide-playbook.jpg'
import networkImg from '../../assets/biopavilion/slide-network.jpg'
import incubationImg from '../../assets/biopavilion/slide-incubation.jpg'
import labTeamImg from '../../assets/biopavilion/lab-team.jpg'
import labAtriumImg from '../../assets/biopavilion/lab-atrium.jpg'
import labCleanImg from '../../assets/biopavilion/lab-clean.jpg'
import campusSolarImg from '../../assets/biopavilion/campus-solar.jpg'
import './Biopavilion.css'

/*
  The pinned scene is laid out on the mockup's 1728 × 972 frame (design px).
  1 · The full-screen campus photo folds down into a portrait card; "The Biopavilion" rises and slides
      across it (white where it crosses the photo), then the "Nexus" column writes itself in.
  2 · A pale panel covers it: three pillars, each photo wiping up beside a numbered tab.
  3 · "Built For The Future": a horizontal track where each panel opens out as it reaches the front.
*/
const SLIDE_IMGS = [playbookImg, networkImg, incubationImg]
const PANEL_IMGS = [labAtriumImg, labCleanImg, campusSolarImg]

// Track offsets (design px) for intro → 01 → 02 → 03; the last panel stops 49px short of the edge
const TRACK = [0, -1013, -2018, -2548]

const ICONS = {
  target: (
    <svg viewBox="0 0 80 80" aria-hidden="true">
      <path d="M58.4 21.6A30 30 0 1 0 64.6 34" fill="none" stroke="currentColor" strokeWidth="8.4" strokeLinecap="round" />
      <path d="M47.6 31.6A15 15 0 1 0 53.6 41" fill="none" stroke="currentColor" strokeWidth="8.4" strokeLinecap="round" />
      <circle cx="39" cy="41" r="5.2" fill="currentColor" />
      <path d="M39 41 66 14" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M61 8.5 62.6 17.4 71.5 19 78 12.5 70.6 11 69 3.6Z" fill="currentColor" />
    </svg>
  ),
  atom: (
    <svg viewBox="0 0 80 80" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6">
      <ellipse cx="40" cy="42" rx="33" ry="12.5" />
      <ellipse cx="40" cy="42" rx="33" ry="12.5" transform="rotate(60 40 42)" />
      <ellipse cx="40" cy="42" rx="33" ry="12.5" transform="rotate(-60 40 42)" />
      <circle cx="32.5" cy="31" r="6.4" fill="currentColor" stroke="none" />
      <circle cx="55.6" cy="17.2" r="3.4" fill="currentColor" stroke="none" />
      <circle cx="71.4" cy="48.5" r="3.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="66" r="3.6" fill="currentColor" stroke="none" />
      <circle cx="53" cy="69.5" r="3.4" fill="currentColor" stroke="none" />
      <circle cx="12.8" cy="17.5" r="3.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  incubator: (
    <svg viewBox="0 0 80 80" aria-hidden="true">
      <path d="M17 66V33a23 23 0 0 1 46 0v33" fill="none" stroke="currentColor" strokeWidth="5.6" />
      <rect x="6.5" y="63" width="67" height="11" rx="5.5" fill="currentColor" />
      <path d="M40 23.5 53.5 31 40 38.5 26.5 31Z" fill="currentColor" />
      <path d="M25 34.2 38 41.4V56L25 48.8Z" fill="currentColor" />
      <path d="M55 34.2 42 41.4V56L55 48.8Z" fill="currentColor" />
    </svg>
  ),
}

function MaskLines({ lines }) {
  return lines.map((line) => (
    <span key={line} className="ln ln--mask">
      <span>{line}</span>
    </span>
  ))
}

function PillarCopy({ pillar }) {
  return (
    <>
      <span className="bp-pillar__icon">{ICONS[pillar.icon]}</span>
      <h3 className="bp-pillar__title">{pillar.title}</h3>
      <p className="bp-pillar__text">
        <Lines lines={pillar.lines} />
      </p>
    </>
  )
}

function PanelHead({ panel }) {
  return (
    <>
      <span className="bp-panel__num" aria-hidden="true">
        {panel.num}
      </span>
      <h3 className="bp-panel__pill">{panel.title}</h3>
    </>
  )
}

function Biopavilion() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)

    mm.add(DESKTOP_MQ, () => {
      const el = root.current
      const hero = el.querySelector('.bp-hero')

      // The card starts as exactly the visible screen (in design px), whatever its shape
      const measure = () => {
        const box = el.querySelector('.bp-box').getBoundingClientRect()
        const stage = el.querySelector('.bp-stage').getBoundingClientRect()
        const u = box.width / 1728
        gsap.set(hero, {
          '--v0x': (stage.left - box.left) / u,
          '--v0y': (stage.top - box.top) / u,
          '--v0w': stage.width / u,
          '--v0h': stage.height / u,
        })
      }
      measure()
      window.addEventListener('resize', measure)

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: '.bp-wrap',
          start: 'top top',
          end: () => `+=${window.innerHeight * 16}`,
          pin: '.bp-stage',
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: measure,
        },
      })

      // 1 · Headline lifts out; the photo folds into the portrait card
      tl.fromTo('.bp-hero__line .ln > span', { yPercent: 0 }, { yPercent: -112, duration: 0.45, ease: 'power2.in' }, 0)
        .fromTo(hero, { '--p': 0 }, { '--p': 1, duration: 1.2, ease: 'sine.inOut' }, 0.35)

      // 2 · Rules draw out from the centre; the title rises on the right, then slides across the card
      tl.fromTo('.bp-rule', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, 1.5)
        .fromTo('.bp-title .ln > span', { yPercent: 110 }, { yPercent: 0, duration: 0.55, ease: 'power3.out' }, 1.6)
        .fromTo(hero, { '--tx': 695 }, { '--tx': 0, duration: 1, ease: 'power2.inOut' }, 2.4)

      // 3 · Divider grows; the Nexus heading unmasks and its copy follows line by line
      tl.fromTo('.bp-divider', { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power2.out' }, 3.3)
        .fromTo('.bp-nexus__title .ln > span', { yPercent: 110 }, { yPercent: 0, duration: 0.45, stagger: 0.12, ease: 'power3.out' }, 3.7)
        .fromTo(
          '.bp-nexus__text .ln',
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.035, ease: 'power2.out' },
          3.95,
        )
        .to({}, { duration: 0.4 }, 4.9)

      // 4 · Pillars: the pale panel rises over the hero
      tl.fromTo('.bp-pillars', { '--sy': 1 }, { '--sy': 0, duration: 0.8 }, 5.4)
        .fromTo('.bp-pillars__rule', { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: 'power2.out' }, 6.15)
        .fromTo('.bp-tab', { autoAlpha: 0, y: 100 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 6.35)

      const pillars = gsap.utils.toArray('.bp-stage .bp-pillar')
      const nums = gsap.utils.toArray('.bp-stage .bp-tab__num')
      const shots = gsap.utils.toArray('.bp-stage .bp-pillar__img')
      const reveal = (i, at) =>
        tl.fromTo(
          pillars[i].children,
          { autoAlpha: 0, y: 14, filter: 'blur(6px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.1, ease: 'power2.out' },
          at,
        )
      reveal(0, 6.5)
      tl.fromTo(shots[0], { '--wipe': 1 }, { '--wipe': 0, duration: 0.8 }, 6.8)
      ;[1, 2].forEach((i) => {
        const at = 6.6 + i * 1.9
        tl.to(pillars[i - 1].children, { autoAlpha: 0, filter: 'blur(6px)', duration: 0.35, ease: 'power1.in' }, at)
          .fromTo(shots[i], { '--wipe': 1 }, { '--wipe': 0, duration: 0.8 }, at)
          .to(nums[i - 1], { autoAlpha: 0, duration: 0.25 }, at + 0.25)
          .fromTo(nums[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, at + 0.4)
        reveal(i, at + 0.45)
      })
      tl.to({}, { duration: 0.6 }, '>')

      // 5 · Built For The Future rises; the track carries each panel to the front as it opens out
      tl.fromTo('.bp-future', { '--sy': 1 }, { '--sy': 0, duration: 0.8 }, 12.1)
      const panels = gsap.utils.toArray('.bp-stage .bp-panel--item')
      panels.forEach((panel, i) => {
        const at = 13.4 + i * 2.2
        tl.fromTo('.bp-track', { '--x': TRACK[i] }, { '--x': TRACK[i + 1], duration: 1.2, immediateRender: false }, at)
          .fromTo(panel, { '--o': 0 }, { '--o': 1, duration: 1.2, immediateRender: false }, at)
          .fromTo(
            panel.querySelector('.bp-panel__text'),
            { autoAlpha: 0, filter: 'blur(5px)' },
            { autoAlpha: 1, filter: 'blur(0px)', duration: 0.45, ease: 'power1.out' },
            at + 1.2,
          )
      })
      tl.to({}, { duration: 0.7 }, '>')

      return () => window.removeEventListener('resize', measure)
    })

    // Narrow / portrait: stacked sections with scroll reveals
    mm.add(`not all and ${DESKTOP_MQ}`, () => {
      gsap.utils.toArray('.bp-m-reveal').forEach((node) => {
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
    <div className="biopav" ref={root}>
      {/* ---------- Desktop: one pinned, scroll-scrubbed scene ---------- */}
      <section className="bp-wrap">
        <div className="bp-stage">
          <div className="bp-box">
            {/* Hero → The Biopavilion */}
            <div className="bp-hero">
              <span className="bp-rule bp-rule--top" aria-hidden="true" />
              <span className="bp-rule bp-rule--bottom" aria-hidden="true" />
              <h1 className="bp-title">
                <span className="ln ln--mask">
                  <span>{TITLE}</span>
                </span>
              </h1>
              <div className="bp-card" aria-hidden="true">
                <img className="bp-card__img" src={campusImg} alt="" />
                <p className="bp-title bp-title--white">
                  <span className="ln ln--mask">
                    <span>{TITLE}</span>
                  </span>
                </p>
              </div>
              <p className="bp-hero__line">
                <span className="ln ln--mask">
                  <span>{HERO_LINE}</span>
                </span>
              </p>
              <span className="bp-divider" aria-hidden="true" />
              <div className="bp-nexus">
                <h2 className="bp-nexus__title">
                  <MaskLines lines={NEXUS_TITLE} />
                </h2>
                <p className="bp-nexus__text">
                  <Lines lines={NEXUS_LINES} />
                </p>
              </div>
            </div>

            {/* Proven Playbook · Network Effects · From Incubation to Manufacturing */}
            <section className="bp-pillars" aria-label="How the Biopavilion works">
              {SLIDE_IMGS.map((src, i) => (
                <img key={src} className={`bp-pillar__img bp-pillar__img--${i + 1}`} src={src} alt="" aria-hidden="true" />
              ))}
              <span className="bp-pillars__rule" aria-hidden="true" />
              {PILLARS.map((pillar) => (
                <div key={pillar.num} className="bp-pillar">
                  <PillarCopy pillar={pillar} />
                </div>
              ))}
              <div className="bp-tab" aria-hidden="true">
                {PILLARS.map((pillar) => (
                  <span key={pillar.num} className="bp-tab__num">
                    {pillar.num}
                  </span>
                ))}
                <span className="bp-tab__of">/03</span>
              </div>
            </section>

            {/* Built For The Future */}
            <section className="bp-future" aria-labelledby="bp-future-title">
              <span className="bp-future__rule" aria-hidden="true" />
              <div className="bp-track-clip">
                <div className="bp-track">
                  <div className="bp-panel bp-panel--intro">
                    <p className="bp-panel__intro">
                      <Lines lines={FUTURE_INTRO} />
                    </p>
                    <img className="bp-panel__img" src={labTeamImg} alt="" aria-hidden="true" />
                  </div>
                  {FUTURE_PANELS.map((panel, i) => (
                    <div key={panel.num} className={`bp-panel bp-panel--item bp-panel--${i + 1}`}>
                      <PanelHead panel={panel} />
                      <p className="bp-panel__text">
                        <Lines lines={panel.lines} />
                      </p>
                      <span className="bp-panel__win" aria-hidden="true">
                        <img className="bp-panel__img" src={PANEL_IMGS[i]} alt="" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bp-future__side">
                <h2 className="bp-future__title" id="bp-future-title">
                  {FUTURE_TITLE}
                </h2>
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* ---------- Phone / portrait: the same story, stacked ---------- */}
      <div className="bp-m">
        <section className="bp-m-hero" style={{ backgroundImage: `url(${campusImg})` }}>
          <p className="bp-m-hero__line">{HERO_LINE}</p>
        </section>
        <section className="bp-m-intro">
          <h1 className="bp-m-intro__title bp-m-reveal">{TITLE}</h1>
          <h2 className="bp-m-intro__head bp-m-reveal">
            <Lines lines={NEXUS_TITLE} />
          </h2>
          <p className="bp-m-intro__text bp-m-reveal">
            <Lines lines={NEXUS_LINES} />
          </p>
        </section>
        <section className="bp-m-pillars">
          {PILLARS.map((pillar, i) => (
            <article key={pillar.num} className="bp-m-pillar">
              <div className="bp-m-pillar__media bp-m-reveal">
                <span className="bp-m-pillar__clip">
                  <img src={SLIDE_IMGS[i]} alt="" />
                </span>
                <span className="bp-m-pillar__tab" aria-hidden="true">
                  {pillar.num}
                  <small>/03</small>
                </span>
              </div>
              <div className="bp-pillar bp-m-reveal">
                <PillarCopy pillar={pillar} />
              </div>
            </article>
          ))}
        </section>
        <section className="bp-m-future">
          <h2 className="bp-m-future__title bp-m-reveal">{FUTURE_TITLE}</h2>
          <p className="bp-m-future__intro bp-m-reveal">
            <Lines lines={FUTURE_INTRO} />
          </p>
          <img className="bp-m-future__img bp-m-reveal" src={labTeamImg} alt="" />
          {FUTURE_PANELS.map((panel, i) => (
            <article key={panel.num} className="bp-m-panel bp-m-reveal">
              <PanelHead panel={panel} />
              <p className="bp-panel__text">
                <Lines lines={panel.lines} />
              </p>
              <img src={PANEL_IMGS[i]} alt="" />
            </article>
          ))}
        </section>
      </div>

      <CollabPanel title="Let’s Collaborate" cta="Get In Touch" variant="home" />
    </div>
  )
}

export default Biopavilion
