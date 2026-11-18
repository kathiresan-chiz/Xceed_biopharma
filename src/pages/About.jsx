import PageHero from '../components/PageHero.jsx'
import { Statement, NumberedList, CtaBand } from '../components/Sections.jsx'
import { IMAGES, TEAM_TEXT } from '../data/site.js'
import './Pages.css'

export function Team() {
  return (
    <div className="page">
      <PageHero
        eyebrow="About Us"
        title="A Whole, Greater Than the Sum of Its Parts"
        intro={TEAM_TEXT}
        image={IMAGES.vialsImg}
      />
      <NumberedList
        kicker="Who we are"
        title="A wide range of backgrounds"
        items={[
          { title: 'Academics', text: 'Research depth that grounds every decision in evidence.' },
          { title: 'Entrepreneurs', text: 'Builders who turn bold ideas into working enterprises.' },
          { title: 'Scientists', text: 'Expertise across chemistry, engineering and manufacturing.' },
          { title: 'Former Regulators', text: 'First-hand understanding of what quality and compliance require.' },
          { title: 'Executives', text: 'Leadership experience from across the life sciences industry.' },
        ]}
      />
      <Statement kicker="Shared vision">United by how to deliver equity and resilience of care.</Statement>
      <CtaBand />
    </div>
  )
}
