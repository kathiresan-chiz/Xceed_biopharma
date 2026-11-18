import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/scroll.js'
import { useReady } from '../../lib/ready.js'
import PillButton from '../../components/PillButton.jsx'
import Lines from '../../components/Lines.jsx'
import { MISSION_LINES, TEAM_LINES, VISION, IMAGES } from '../../data/site.js'
import dnaWebm from '../../assets/hero-dna.webm'
import dnaMp4 from '../../assets/hero-dna.mp4'
import dnaPoster from '../../assets/hero-dna-poster.jpg'
import machineWebm from '../../assets/mission-machine.webm'
import machineMp4 from '../../assets/mission-machine.mp4'
import cleanroomWebm from '../../assets/vision-cleanroom.webm'
import cleanroomMp4 from '../../assets/vision-cleanroom.mp4'
import networkBg from '../../assets/story-network.jpg'
import wholeBg from '../../assets/whole-bg.jpg'

const WIDE = '(min-width: 1025px) and (orientation: landscape)'
const NARROW = '(max-width: 1024px), (orientation: portrait)'

/*
  Grey panel shapes, as five polygon points (x, y in %).
  The light page shows wherever the grey panel is clipped away.
*/
function shapes(cx, cy, d) {
  return {
    full: [0, 0, 100, 0, 100, 100, 100, 100, 0, 100],
    mission: [0, 0, 100, 0, 100, cy - d, 0, cy + d, 0, cy + d],
    vision: [0, 0, 100, 0, 100, cy + d, 0, cy - d, 0, cy - d],
    cone: [cx, cy, 100, cy + 12, 100, cy + 34, cx, cy, cx, cy],
    sliver: [cx, cy, 100, cy + 18, 100, cy + 24, cx, cy, cx, cy],
    gone: [100, cy + 21, 100, cy + 21, 100, cy + 21, 100, cy + 21, 100, cy + 21],
  }
}

const asProps = (arr) => Object.fromEntries(arr.map((v, i) => [`p${i}`, v]))

function HeroStory() {
  const root = useRef(null)
  const ready = useReady()

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)

    mm.add({ wide: WIDE, narrow: NARROW }, (context) => {
      const { wide } = context.conditions
      const S = wide ? shapes(50, 50, 50) : shapes(50, 28, 18)
      const grey = root.current.querySelector('.story__grey')
      const poly = asProps(S.full)
      const paint = () => {
        const pts = []
        for (let i = 0; i < 10; i += 2) pts.push(`${poly[`p${i}`]}% ${poly[`p${i + 1}`]}%`)
        grey.style.clipPath = `polygon(${pts.join(',')})`
      }
      paint()

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onUpdate: paint,
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 8}`,
          pin: '.story__stage',
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // 1. Grey panel rises over the hero
      tl.fromTo('.story__panel', { yPercent: 100 }, { yPercent: 0, duration: 1.1 }, 0)
        .to('.hero__inner', { yPercent: -14, autoAlpha: 0.4, duration: 1.1 }, 0)
        .fromTo('.orb', { scale: 0.7 }, { scale: 1, duration: 1.1 }, 0)
        .fromTo('.story__net', { scale: 1.22 }, { scale: 1, duration: 2.4, ease: 'power2.out' }, 0)

      // 2. Light wedge sweeps in from the corner, ring opens around the image
      tl.to(poly, { ...asProps(S.mission), duration: 1.3 }, 1.1)
        .fromTo('.orb__ring', { scale: 0.86, xPercent: 0, yPercent: 0 }, { scale: 1, xPercent: 3.7, yPercent: 3.3, duration: 1.3 }, 1.1)

      // 3. Mission copy
      tl.fromTo(
        '.story__mission > *',
        { autoAlpha: 0, y: 50 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.25, ease: 'power3.out' },
        2.2,
      )
        .to('.story__mission > *', { autoAlpha: 0, y: -40, duration: 0.5, stagger: 0.08, ease: 'power2.in' }, 4.2)

      // 4. Diagonal pivots through the image, which wipes to the clean room
      tl.to(poly, { ...asProps(S.vision), duration: 1.4 }, 4.6)
        .to('.orb__ring', { xPercent: -3.5, yPercent: 2.9, duration: 1.4 }, 4.6)
        .fromTo('.orb__img--b', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1 }, 4.75)
        .fromTo('.orb__img--b video', { scale: 1.3 }, { scale: 1, duration: 1.3, ease: 'power3.out' }, 4.75)

      // 5. Vision copy
      tl.fromTo(
        '.story__vision > *',
        { autoAlpha: 0, y: 50 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.18, ease: 'power3.out' },
        6.0,
      )
        .to('.story__vision > *', { autoAlpha: 0, y: -40, duration: 0.5, stagger: 0.06, ease: 'power2.in' }, 8.1)

      // 6. Image closes to a dot while the grey drains into a cone, then vanishes
      tl.to(poly, { ...asProps(S.cone), duration: 1.0 }, 8.6)
        .to('.orb__ring', { xPercent: 0, yPercent: 0, duration: 0.8 }, 8.6)
        .to('.orb__media', { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: 'power2.in' }, 8.6)
        .to('.orb', { scale: 0.05, duration: 1.0, ease: 'power3.inOut' }, 8.7)
        .to(poly, { ...asProps(S.sliver), duration: 0.5 }, 9.6)
        .to(poly, { ...asProps(S.gone), duration: 0.6, ease: 'power2.in' }, 10.1)
        .to('.orb', { scale: 0, duration: 0.4, ease: 'power2.in' }, 10.2)
        .fromTo('.story__flow', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: 'none' }, 10.0)

      // 7. A Whole
      tl.fromTo('.whole__title-line > span', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, 10.6)
        .fromTo('.whole__sub > span', { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out' }, 10.9)
        .fromTo('.whole__text', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 11.2)
        .fromTo('.whole__cta', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 11.5)
        .to({}, { duration: 1.2 }, 12.3)
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="story" ref={root}>
      <div className="story__stage">
        {/* Hero */}
        <div className={`hero${ready ? ' is-ready' : ''}`}>
          <div className="hero__inner">
            <h1 className="hero__title">
              <span className="hero__line">
                <span>Enabling Equitable</span>
              </span>
              <span className="hero__line">
                <span>Delivery of Care</span>
              </span>
            </h1>
            <div className="hero__dna">
              <video autoPlay muted loop playsInline preload="auto" poster={dnaPoster} aria-hidden="true">
                <source src={dnaWebm} type="video/webm" />
                <source src={dnaMp4} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

        {/* Story panel */}
        <div className="story__panel">
          <div className="story__flow" style={{ backgroundImage: `url(${wholeBg})` }} />

          <div className="story__grey">
            <div className="story__net" style={{ backgroundImage: `url(${networkBg})` }} />
          </div>

          <div className="orb" aria-hidden="true">
            <div className="orb__ring" />
            <div className="orb__media">
              <div className="orb__img orb__img--a">
                <video autoPlay muted loop playsInline preload="auto" poster={IMAGES.machineImg}>
                  <source src={machineWebm} type="video/webm" />
                  <source src={machineMp4} type="video/mp4" />
                </video>
              </div>
              <div className="orb__img orb__img--b">
                <video autoPlay muted loop playsInline preload="auto" poster={IMAGES.cleanroomImg}>
                  <source src={cleanroomWebm} type="video/webm" />
                  <source src={cleanroomMp4} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          <div className="story__mission">
            <p>
              <Lines lines={MISSION_LINES} />
            </p>
            <PillButton to="/mission">Explore Our Mission</PillButton>
          </div>

          <div className="story__vision">
            <h2>
              <Lines lines={VISION.titleLines} />
            </h2>
            {VISION.paragraphLines.map((lines) => (
              <p key={lines[0]}>
                <Lines lines={lines} />
              </p>
            ))}
            <PillButton to="/vision">Understand Our Vision</PillButton>
          </div>

          <div className="whole">
            <h2 className="whole__title">
              <span className="whole__title-line">
                <span>A Whole</span>
              </span>
              <span className="whole__sub">
                <span>Greater Than the Sum of Its Parts</span>
              </span>
            </h2>
            <p className="whole__text">
              <Lines lines={TEAM_LINES} />
            </p>
            <PillButton to="/team" className="whole__cta">
              Meet Our Team
            </PillButton>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroStory
