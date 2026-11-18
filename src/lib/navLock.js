// Lets a page hold the navbar on screen (e.g. while it covers a photo seam) regardless of scroll direction.
// Shaped as an external store for useSyncExternalStore.
let locked = false
const listeners = new Set()

export function setNavLock(value) {
  if (value === locked) return
  locked = value
  listeners.forEach((fn) => fn())
}

export function onNavLock(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const isNavLocked = () => locked
