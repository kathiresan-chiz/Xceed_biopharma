// Bundles of hairline curves that drift slowly, like the soft ribbons behind "A Whole"
const lerp = (a, b, t) => a + (b - a) * t

const ribbon = (from, to, count) =>
  Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1)
    const p = from.map((v, k) => lerp(v, to[k], t).toFixed(1))
    return `M${p[0]} ${p[1]} C${p[2]} ${p[3]} ${p[4]} ${p[5]} ${p[6]} ${p[7]}`
  })

const RIBBONS = [
  ribbon([-40, 160, 260, 120, 120, 560, 520, 760], [-40, 260, 300, 260, 180, 640, 600, 820], 26),
  ribbon([-60, 620, 220, 520, 360, 900, 760, 980], [-60, 700, 260, 640, 420, 960, 820, 1060], 22),
  ribbon([120, -40, 60, 300, 420, 420, 260, 1100], [200, -40, 160, 340, 520, 520, 380, 1100], 18),
]

function FlowLines({ className = '' }) {
  return (
    <svg
      className={`flow-lines ${className}`}
      viewBox="0 0 900 1000"
      preserveAspectRatio="xMinYMid slice"
      aria-hidden="true"
    >
      {RIBBONS.map((paths, r) => (
        <g key={r} className={`flow-lines__ribbon flow-lines__ribbon--${r + 1}`}>
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      ))}
    </svg>
  )
}

export default FlowLines
