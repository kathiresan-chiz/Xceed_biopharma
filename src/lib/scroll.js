import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

let lenis = null

// Wide landscape screens get the pinned, scroll-scrubbed scenes; everything else stacks
export const DESKTOP_MQ = '(min-width: 1025px) and (min-aspect-ratio: 5/4)'

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// One Lenis instance drives the page; GSAP's ticker keeps it in step with ScrollTrigger
export function initSmoothScroll() {
  if (lenis) return lenis
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !prefersReducedMotion(),
    touchMultiplier: 1.4,
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function lockScroll(locked) {
  if (!lenis) return
  if (locked) lenis.stop()
  else lenis.start()
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  window.scrollTo(0, 0)
}

export function scrollTo(target, options) {
  if (lenis) lenis.scrollTo(target, { duration: 1.2, ...options })
  else window.scrollTo({ top: typeof target === 'number' ? target : 0, behavior: 'smooth' })
}

export { gsap, ScrollTrigger, SplitText }
