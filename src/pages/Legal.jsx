import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal.js'
import { CONTACT } from '../data/site.js'
import './Pages.css'

function Legal({ title }) {
  const ref = useRef(null)
  useReveal(ref)
  return (
    <div className="page">
      <section className="legal" ref={ref}>
        <p className="section-kicker" data-reveal>
          Legal
        </p>
        <h1 className="section-title legal__title" data-reveal-lines>
          {title}
        </h1>
        <p data-reveal>
          This policy is being finalised. For any question about how Xceed BioPharma handles your information, please
          contact us at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>
      </section>
    </div>
  )
}

export default Legal
