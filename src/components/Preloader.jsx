import { useEffect, useState } from 'react'
import waveWebm from '../assets/preloader-wave.webm'
import waveMp4 from '../assets/preloader-wave.mp4'
import wavePoster from '../assets/preloader-wave-poster.jpg'
import './Preloader.css'

const MIN_DURATION = 4500 // ms, matches the mockup's 0 → 100% count
const EXIT_DURATION = 2300 // fade, centre line, then the panel opens to full width

function Preloader({ onFinish }) {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('loading') // loading -> ready -> exiting

  useEffect(() => {
    let loaded = document.readyState === 'complete'
    const onLoad = () => (loaded = true)
    window.addEventListener('load', onLoad)

    const start = performance.now()
    let value = 0
    let frame
    let readyTimer
    const tick = (now) => {
      const timeShare = Math.min((now - start) / MIN_DURATION, 1)
      // Hold at 95% until the page has actually finished loading
      const target = loaded ? timeShare * 100 : Math.min(timeShare * 100, 95)
      value += (target - value) * 0.08
      if (loaded && timeShare === 1 && value > 99.5) value = 100
      setProgress(value)
      if (value < 100) frame = requestAnimationFrame(tick)
      else readyTimer = setTimeout(() => setStage('ready'), 450)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(readyTimer)
      window.removeEventListener('load', onLoad)
    }
  }, [])

  const handleContinue = () => {
    setStage('exiting')
    setTimeout(onFinish, EXIT_DURATION)
  }

  const pct = Math.round(progress)

  return (
    <div className={`preloader preloader--${stage}${pct >= 100 ? ' is-complete' : ''}`}>
      <div className="preloader__stage">
        <video
          className="preloader__wave"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={wavePoster}
          aria-hidden="true"
        >
          <source src={waveWebm} type="video/webm" />
          <source src={waveMp4} type="video/mp4" />
        </video>
        {/* Covers the logo baked into the wave footage so it can fade out on exit */}
        <span className="preloader__logo-veil" aria-hidden="true" />
      </div>
      <span className="sr-only">Xceed Biopharma is loading</span>

      <div className="preloader__progress" aria-hidden={stage !== 'loading'}>
        <span className="preloader__count" style={{ '--p': progress / 100 }}>
          {pct}%
        </span>
        <div className="preloader__track">
          <div className="preloader__bar" style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>

      <button
        type="button"
        className="preloader__continue"
        onClick={handleContinue}
        disabled={stage !== 'ready'}
      >
        <span className="preloader__continue-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 12h15M13 5.5l6.5 6.5-6.5 6.5" />
          </svg>
        </span>
        Click to Continue
      </button>

      <div className="preloader__split" />
      <div className="preloader__reveal" />
    </div>
  )
}

export default Preloader
