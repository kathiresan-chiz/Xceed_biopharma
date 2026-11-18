// Copy set on the exact line breaks of the mockup on wide screens; flows naturally on narrow ones
function Lines({ lines }) {
  return lines.map((line, i) => (
    <span key={i} className="ln">
      {i > 0 && ' '}
      {line}
    </span>
  ))
}

export default Lines
