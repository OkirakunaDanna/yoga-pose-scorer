import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision'
import { useCallback, useEffect, useRef, useState } from 'react'

const WASM_CDN =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'

export type LandmarkerStatus = 'idle' | 'loading' | 'ready' | 'error'

export function usePoseLandmarker() {
  const landmarkerRef = useRef<PoseLandmarker | null>(null)
  const [status, setStatus] = useState<LandmarkerStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const init = useCallback(async () => {
    if (landmarkerRef.current) return landmarkerRef.current

    setStatus('loading')
    setError(null)

    try {
      const vision = await FilesetResolver.forVisionTasks(WASM_CDN)

      const create = (delegate: 'GPU' | 'CPU') =>
        PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_URL,
            delegate,
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        })

      try {
        landmarkerRef.current = await create('GPU')
      } catch {
        landmarkerRef.current = await create('CPU')
      }

      setStatus('ready')
      return landmarkerRef.current
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'ポーズモデルの読み込みに失敗しました'
      setError(message)
      setStatus('error')
      throw e
    }
  }, [])

  useEffect(() => {
    return () => {
      landmarkerRef.current?.close()
      landmarkerRef.current = null
    }
  }, [])

  return { landmarkerRef, init, status, error }
}
