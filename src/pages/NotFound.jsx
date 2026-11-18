import { useRef } from 'react'
import PillButton from '../components/PillButton.jsx'
import { useReveal } from '../hooks/useReveal.js'
import './Pages.css'

function NotFound() {
  const ref = useRef(null)
  useReveal(ref)
  return (
    <div className="page">
      <section className="legal legal--center" ref={ref}>
        <p className="section-kicker" data-reveal>
          404
        </p>
        <h1 className="section-title legal__title" data-reveal-lines>
          This page could not be found
        </h1>
        <div data-reveal>
          <PillButton to="/">Back to Home</PillButton>
        </div>
      </section>
    </div>
  )
}

export default NotFound
