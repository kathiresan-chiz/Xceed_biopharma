import { useRef } from 'react'
import { Link } from 'react-router'
import { useReveal } from '../hooks/useReveal.js'
import PillButton from './PillButton.jsx'
import FlowLines from './FlowLines.jsx'
import { IMAGES } from '../data/site.js'

export function Statement({ children, kicker, long = false }) {
  const ref = useRef(null)
  useReveal(ref)
  return (
    <section className={`statement${long ? ' statement--long' : ''}`} ref={ref}>
      <FlowLines className="statement__lines" />
      {kicker && (
        <p className="section-kicker" data-reveal>
          {kicker}
        </p>
      )}
      <blockquote className="statement__text" data-reveal-lines>
        {children}
      </blockquote>
    </section>
  )
}

export function NumberedList({ kicker, title, items }) {
  const ref = useRef(null)
  useReveal(ref)
  return (
    <section className="numbered" ref={ref}>
      <header className="numbered__head">
        {kicker && (
          <p className="section-kicker" data-reveal>
            {kicker}
          </p>
        )}
        {title && (
          <h2 className="section-title" data-reveal-lines>
            {title}
          </h2>
        )}
      </header>
      <ol className="numbered__list">
        {items.map((item, i) => (
          <li key={item.title} className="numbered__item" data-reveal data-delay={(i % 3) * 0.08}>
            <span className="numbered__num">{String(i + 1).padStart(2, '0')}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function AreaCards({ kicker = 'Projects', title = 'Areas of Focus', areas }) {
  const ref = useRef(null)
  useReveal(ref)
  return (
    <section className="area-cards" ref={ref}>
      <header className="numbered__head">
        <p className="section-kicker" data-reveal>
          {kicker}
        </p>
        <h2 className="section-title" data-reveal-lines>
          {title}
        </h2>
      </header>
      <div className="area-cards__grid">
        {areas.map((area, i) => (
          <Link key={area.slug} to={`/projects/${area.slug}`} className="area-card" data-reveal data-delay={i * 0.1}>
            <div className="area-card__media" data-reveal-img>
              <img src={area.image} alt="" loading="lazy" />
            </div>
            <span className="area-card__num">{area.num}</span>
            <h3 className="area-card__name">{area.short}</h3>
            <p className="area-card__text">{area.text}</p>
            <span className="area-card__more">
              Know More
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h15M13 5.5l6.5 6.5-6.5 6.5" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function CtaBand() {
  const ref = useRef(null)
  useReveal(ref)
  return (
    <section className="cta-band" ref={ref}>
      <div className="cta-band__media" aria-hidden="true" data-parallax="6">
        <div className="cta-band__strip cta-band__strip--a">
          <img src={IMAGES.aerialImg} alt="" loading="lazy" />
        </div>
        <div className="cta-band__strip cta-band__strip--b">
          <img src={IMAGES.aerialImg} alt="" loading="lazy" />
        </div>
      </div>
      <div className="cta-band__text">
        <p data-reveal-lines>
          Do you share our vision and drive to innovate? Think there might be an opportunity for a mutually
          beneficial collaboration?
        </p>
        <p data-reveal-lines data-delay="0.15">
          Xceed BioPharma believes in the value of partnership - Let&rsquo;s Talk
        </p>
        <div data-reveal data-delay="0.3">
          <PillButton to="/collaborate" variant="light">
            Contact Us
          </PillButton>
        </div>
      </div>
    </section>
  )
}
