import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { angleAtJoint } from './geometry'
import { L } from './landmarks'

export type PoseCheck = {
  id: string
  label: string
  measure: (landmarks: NormalizedLandmark[]) => number | null
  target: number
  tolerance: number
  weight: number
}

export type YogaPose = {
  id: string
  name: string
  description: string
  checks: PoseCheck[]
}

const lm = (landmarks: NormalizedLandmark[], i: number) => landmarks[i]

export const YOGA_POSES: YogaPose[] = [
  {
    id: 'tree',
    name: '木のポーズ',
    description: '片足で立ち、もう一方の足を内ももに当てます。',
    checks: [
      {
        id: 'standing_leg',
        label: '軸足（左）の伸展',
        measure: (p) =>
          angleAtJoint(lm(p, L.leftHip), lm(p, L.leftKnee), lm(p, L.leftAnkle)),
        target: 175,
        tolerance: 18,
        weight: 1,
      },
      {
        id: 'lifted_knee',
        label: '上げた足（右）の膝',
        measure: (p) =>
          angleAtJoint(lm(p, L.rightHip), lm(p, L.rightKnee), lm(p, L.rightAnkle)),
        target: 55,
        tolerance: 28,
        weight: 1.1,
      },
    ],
  },
  {
    id: 'warrior2',
    name: '戦士のポーズ2',
    description: '前足の膝を曲げ、腕を左右に伸ばします。',
    checks: [
      {
        id: 'front_knee',
        label: '前足（左）の膝',
        measure: (p) =>
          angleAtJoint(lm(p, L.leftHip), lm(p, L.leftKnee), lm(p, L.leftAnkle)),
        target: 95,
        tolerance: 22,
        weight: 1.2,
      },
      {
        id: 'back_leg',
        label: '後足（右）の伸展',
        measure: (p) =>
          angleAtJoint(lm(p, L.rightHip), lm(p, L.rightKnee), lm(p, L.rightAnkle)),
        target: 168,
        tolerance: 18,
        weight: 1,
      },
      {
        id: 'left_arm',
        label: '左腕の高さ',
        measure: (p) =>
          angleAtJoint(lm(p, L.leftElbow), lm(p, L.leftShoulder), lm(p, L.leftHip)),
        target: 88,
        tolerance: 28,
        weight: 0.85,
      },
    ],
  },
  {
    id: 'downward_dog',
    name: '下向きの犬',
    description: '逆V字。手と足で床を押し、腰を高く。',
    checks: [
      {
        id: 'hip_fold',
        label: '腰の折り目（左）',
        measure: (p) =>
          angleAtJoint(lm(p, L.leftShoulder), lm(p, L.leftHip), lm(p, L.leftKnee)),
        target: 58,
        tolerance: 22,
        weight: 1.1,
      },
      {
        id: 'left_arm',
        label: '左腕の伸展',
        measure: (p) =>
          angleAtJoint(lm(p, L.leftShoulder), lm(p, L.leftElbow), lm(p, L.leftWrist)),
        target: 168,
        tolerance: 22,
        weight: 1,
      },
      {
        id: 'left_leg',
        label: '左脚の伸展',
        measure: (p) =>
          angleAtJoint(lm(p, L.leftHip), lm(p, L.leftKnee), lm(p, L.leftAnkle)),
        target: 168,
        tolerance: 22,
        weight: 1,
      },
    ],
  },
]

export function getPoseById(id: string): YogaPose {
  return YOGA_POSES.find((p) => p.id === id) ?? YOGA_POSES[0]
}
