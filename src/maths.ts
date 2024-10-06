export function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max)
}

export function lerp(x: number, from: number, to: number) {
  return from + x * (to - from)
}
