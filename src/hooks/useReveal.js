import { useLayoutEffect } from 'react'
import { gsap, SplitText } from '../lib/scroll.js'
import { useReady } from '../lib/ready.js'

/*
  Scroll-in animations for anything inside `ref`:
  - [data-reveal-lines]  text rises line by line from behind a mask
  - [data-reveal]        fades and lifts in (optional data-delay in seconds)
  - [data-reveal-img]    image wipes open from the bottom while settling from a zoom
  - [data-parallax]      drifts against the scroll (value = strength in %)
*/
export function useReveal(ref) {
  const ready = useReady()

  useLayoutEffect(() => {
    if (!ready || !ref.current) return
    let ctx
    let cancelled = false

    document.fonts.ready.then(() => {
      if (cancelled || !ref.current) return
      ctx = gsap.context(() => {
        gsap.utils.toArray('[data-reveal-lines]').forEach((el) => {
          const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' })
          gsap.set(el, { visibility: 'visible' })
          gsap.from(split.lines, {
            yPercent: 115,
            duration: 1.2,
            ease: 'expo.out',
            stagger: 0.09,
            delay: parseFloat(el.dataset.delay || 0),
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })

        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.fromTo(
            el,
            { y: 48, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 1.2,
              ease: 'expo.out',
              delay: parseFloat(el.dataset.delay || 0),
              scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            },
          )
        })

        gsap.utils.toArray('[data-reveal-img]').forEach((el) => {
          const img = el.querySelector('img, video')
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
          tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' })
          if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 2, ease: 'expo.out' }, 0.2)
        })

        gsap.utils.toArray('[data-parallax]').forEach((el) => {
          const amount = parseFloat(el.dataset.parallax || 12)
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })
      }, ref)
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [ready, ref])
}
