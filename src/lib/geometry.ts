import type { NormalizedLandmark } from '@mediapipe/tasks-vision'

const MIN_VISIBILITY = 0.5

export function isVisible(...points: NormalizedLandmark[]): boolean {
  return points.every((p) => (p.visibility ?? 1) >= MIN_VISIBILITY)
}

/** 関節 b を頂点とする角度（度） */
export function angleAtJoint(
  a: NormalizedLandmark,
  b: NormalizedLandmark,
  c: NormalizedLandmark,
): number | null {
  if (!isVisible(a, b, c)) return null

  const v1 = {
    x: a.x - b.x,
    y: a.y - b.y,
    z: (a.z ?? 0) - (b.z ?? 0),
  }
  const v2 = {
    x: c.x - b.x,
    y: c.y - b.y,
    z: (c.z ?? 0) - (b.z ?? 0),
  }

  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
  const m1 = Math.hypot(v1.x, v1.y, v1.z)
  const m2 = Math.hypot(v2.x, v2.y, v2.z)
  if (m1 === 0 || m2 === 0) return null

  const cos = Math.max(-1, Math.min(1, dot / (m1 * m2)))
  return (Math.acos(cos) * 180) / Math.PI
}
