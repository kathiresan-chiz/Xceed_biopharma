import { useParams } from 'react-router'
import PageHero from '../components/PageHero.jsx'
import PillButton from '../components/PillButton.jsx'
import { Statement, AreaCards, CtaBand } from '../components/Sections.jsx'
import NotFound from './NotFound.jsx'
import { AREAS } from '../data/site.js'
import './Pages.css'

function Project() {
  const { slug } = useParams()
  const index = AREAS.findIndex((a) => a.slug === slug)
  if (index === -1) return <NotFound />

  const area = AREAS[index]
  const next = AREAS[(index + 1) % AREAS.length]

  return (
    <div className="page">
      <PageHero eyebrow={`Projects · ${area.num}`} title={area.short} intro={area.text} image={area.image} strips={area.slug === 'biopavilion'}>
        <PillButton to="/collaborate">Partner With Us</PillButton>
      </PageHero>
      <Statement long kicker={`${area.num} — ${area.short}`}>{area.text}</Statement>
      <AreaCards kicker="Keep exploring" title="Other Areas of Focus" areas={AREAS.filter((a) => a.slug !== slug)} />
      <section className="next-project">
        <PillButton to={`/projects/${next.slug}`}>Next: {next.short}</PillButton>
      </section>
      <CtaBand />
    </div>
  )
}

export default Project
