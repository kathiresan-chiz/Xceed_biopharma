import { useRef, useState } from 'react'
import PageHero from '../components/PageHero.jsx'
import PillButton from '../components/PillButton.jsx'
import { useReveal } from '../hooks/useReveal.js'
import { CONTACT, IMAGES } from '../data/site.js'
import './Pages.css'

function Field({ label, name, type = 'text', textarea = false, required = false }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <label className="field" data-reveal>
      <Tag className="field__input" name={name} type={textarea ? undefined : type} required={required} placeholder=" " rows={textarea ? 5 : undefined} />
      <span className="field__label">
        {label}
        {required && ' *'}
      </span>
      <span className="field__line" aria-hidden="true" />
    </label>
  )
}

function Collaborate() {
  const ref = useRef(null)
  const [sent, setSent] = useState(false)
  useReveal(ref)

  // No form backend yet: hand the message to the visitor's mail app
  const onSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const subject = `Collaboration enquiry from ${data.get('name')}`
    const body = [
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `Company: ${data.get('company') || '-'}`,
      '',
      data.get('message'),
    ].join('\n')
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <div className="page">
      <PageHero
        eyebrow="Collaborate"
        title="Let's Talk"
        intro="Do you share our vision and drive to innovate? Think there might be an opportunity for a mutually beneficial collaboration? Xceed BioPharma believes in the value of partnership."
        image={IMAGES.aerialImg}
        strips
      />
      <section className="contact" ref={ref}>
        <div className="contact__info">
          <p className="section-kicker" data-reveal>
            Get in touch
          </p>
          <h2 className="section-title" data-reveal-lines>
            Start a conversation
          </h2>
          <dl className="contact__list">
            <div data-reveal>
              <dt>Address</dt>
              <dd>
                {CONTACT.company}
                <br />
                {CONTACT.street}
                <br />
                {CONTACT.city}
              </dd>
            </div>
            <div data-reveal data-delay="0.08">
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </dd>
            </div>
            <div data-reveal data-delay="0.16">
              <dt>Phone</dt>
              <dd>
                <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
              </dd>
            </div>
          </dl>
        </div>

        <form className="contact__form" onSubmit={onSubmit}>
          <Field label="Name" name="name" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Company" name="company" />
          <Field label="How can we collaborate?" name="message" textarea required />
          <div className="contact__submit" data-reveal>
            <PillButton type="submit">Send Message</PillButton>
            {sent && (
              <p className="contact__note" role="status">
                Your email app should open with the message ready to send.
              </p>
            )}
          </div>
        </form>
      </section>
    </div>
  )
}

export default Collaborate
