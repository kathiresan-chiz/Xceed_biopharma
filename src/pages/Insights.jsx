import { useRef } from 'react'
import PageHero from '../components/PageHero.jsx'
import { CtaBand } from '../components/Sections.jsx'
import { useReveal } from '../hooks/useReveal.js'
import { IMAGES } from '../data/site.js'
import './Pages.css'

const TOPICS = [
  { title: 'Medicine Shortages', text: 'Why critical medications go short, and what it takes to keep them in supply.', image: IMAGES.vialsImg },
  { title: 'Process Innovation', text: 'Advances in process chemistry and engineering that change the economics of manufacturing.', image: IMAGES.cleanroomImg },
  { title: 'Life Sciences Facilities', text: 'How purpose-built campuses can shorten the road to market.', image: IMAGES.aerialImg },
]

function Insights() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <div className="page">
      <PageHero
        eyebrow="Insights"
        title="Perspectives on the Future of Care"
        intro="Thinking from our team on the forces reshaping how critical medicines are made and delivered."
        image={IMAGES.machineImg}
      />
      <section className="insights" ref={ref}>
        <header className="numbered__head">
          <p className="section-kicker" data-reveal>
            Topics
          </p>
          <h2 className="section-title" data-reveal-lines>
            What we write about
          </h2>
        </header>
        <div className="insights__grid">
          {TOPICS.map((topic, i) => (
            <article key={topic.title} className="insight-card" data-reveal data-delay={i * 0.1}>
              <div className="insight-card__media" data-reveal-img>
                <img src={topic.image} alt="" loading="lazy" />
              </div>
              <span className="insight-card__tag">Coming soon</span>
              <h3>{topic.title}</h3>
              <p>{topic.text}</p>
            </article>
          ))}
        </div>
      </section>
      <CtaBand />
    </div>
  )
}

export default Insights
