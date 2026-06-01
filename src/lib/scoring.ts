import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import type { YogaPose } from './poses'

export type CheckResult = {
  id: string
  label: string
  measured: number | null
  target: number
  score: number
  feedback: string
}

export type ScoreResult = {
  total: number
  checks: CheckResult[]
  detected: boolean
}

function feedbackFor(
  measured: number,
  target: number,
  tolerance: number,
): string {
  const diff = measured - target
  if (Math.abs(diff) <= tolerance * 0.35) return 'とても良いです'
  if (Math.abs(diff) <= tolerance) return 'もう少し調整してみてください'
  return diff > 0 ? '角度を少し小さく' : '角度を少し大きく'
}

export function scorePose(
  landmarks: NormalizedLandmark[] | undefined,
  pose: YogaPose,
): ScoreResult {
  if (!landmarks?.length) {
    return { total: 0, checks: [], detected: false }
  }

  const checks: CheckResult[] = []
  let weightedSum = 0
  let totalWeight = 0

  for (const check of pose.checks) {
    const measured = check.measure(landmarks)
    let score = 0
    let feedback = '全身がカメラに入るように立ってください'

    if (measured !== null) {
      const diff = Math.abs(measured - check.target)
      score = Math.max(0, Math.min(100, 100 - (diff / check.tolerance) * 100))
      feedback = feedbackFor(measured, check.target, check.tolerance)
      weightedSum += score * check.weight
      totalWeight += check.weight
    }

    checks.push({
      id: check.id,
      label: check.label,
      measured,
      target: check.target,
      score: Math.round(score),
      feedback,
    })
  }

  const total =
    totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0

  return { total, checks, detected: totalWeight > 0 }
}
