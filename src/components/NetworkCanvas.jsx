import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/scroll.js'

// Drifting plexus of nodes over faint gear rings, drawn for the grey story panel
function NetworkCanvas({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const still = prefersReducedMotion()
    let w = 0
    let h = 0
    let dpr = 1
    let nodes = []
    let frame = 0
    let visible = true
    let rot = 0

    const seed = () => {
      const count = Math.min(120, Math.round((w * h) / 15000))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() < 0.18 ? 3 + Math.random() * 2 : 1.2 + Math.random() * 1.4,
      }))
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const rings = (cx, cy, base, dir) => {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.lineWidth = 1
      for (let i = 0; i < 6; i++) {
        const r = base * (0.55 + i * 0.12)
        ctx.strokeStyle = `rgba(255,255,255,${0.05 + (i % 2) * 0.03})`
        ctx.setLineDash(i % 2 ? [r * 0.18, r * 0.06] : [])
        ctx.beginPath()
        ctx.arc(0, 0, r, rot * dir * (1 + i * 0.15), rot * dir * (1 + i * 0.15) + Math.PI * 2)
        ctx.stroke()
      }
      // Cog teeth
      ctx.setLineDash([])
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      const teeth = 18
      for (let i = 0; i < teeth; i++) {
        const a = (i / teeth) * Math.PI * 2 + rot * dir * 0.6
        ctx.save()
        ctx.rotate(a)
        ctx.fillRect(base * 0.38, -base * 0.035, base * 0.1, base * 0.07)
        ctx.restore()
      }
      ctx.restore()
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const unit = Math.max(w, h)
      rings(w * 0.08, h * 0.55, unit * 0.32, 1)
      rings(w * 0.94, h * 0.42, unit * 0.3, -1)

      const maxD = Math.min(190, unit * 0.12)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.hypot(dx, dy)
          if (d < maxD) {
            ctx.strokeStyle = `rgba(255,255,255,${(1 - d / maxD) * 0.42})`
            ctx.lineWidth = 0.7
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      for (const n of nodes) {
        if (n.r > 2.5) {
          ctx.fillStyle = 'rgba(255,255,255,0.18)'
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.r * 2.2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < -20) n.x = w + 20
        if (n.x > w + 20) n.x = -20
        if (n.y < -20) n.y = h + 20
        if (n.y > h + 20) n.y = -20
      }
      rot += 0.0008
    }

    const loop = () => {
      if (visible) {
        step()
        draw()
      }
      frame = requestAnimationFrame(loop)
    }

    resize()
    draw()
    if (!still) frame = requestAnimationFrame(loop)

    const ro = new ResizeObserver(() => {
      resize()
      draw()
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return <canvas ref={ref} className={`network-canvas ${className}`} aria-hidden="true" />
}

export default NetworkCanvas
