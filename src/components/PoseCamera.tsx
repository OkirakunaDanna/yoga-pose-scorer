import { PoseLandmarker, type NormalizedLandmark } from '@mediapipe/tasks-vision'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { LandmarkerStatus } from '../hooks/usePoseLandmarker'
import { scorePose, type ScoreResult } from '../lib/scoring'
import type { YogaPose } from '../lib/poses'

type Props = {
  pose: YogaPose
  landmarkerRef: React.RefObject<PoseLandmarker | null>
  landmarkerStatus: LandmarkerStatus
  onInitLandmarker: () => Promise<PoseLandmarker>
  onScore: (result: ScoreResult) => void
}

export function PoseCamera({
  pose,
  landmarkerRef,
  landmarkerStatus,
  onInitLandmarker,
  onScore,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)
  const lastVideoTimeRef = useRef(-1)

  const [cameraOn, setCameraOn] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    const video = videoRef.current
    if (video) video.srcObject = null
    setCameraOn(false)
  }, [])

  const startCamera = useCallback(async () => {
    setCameraError(null)
    try {
      await onInitLandmarker()
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      const video = videoRef.current
      if (!video) return
      video.srcObject = stream
      await video.play()
      setCameraOn(true)
    } catch (e) {
      const message =
        e instanceof Error
          ? e.name === 'NotAllowedError'
            ? 'カメラの使用が許可されていません'
            : e.message
          : 'カメラを起動できませんでした'
      setCameraError(message)
      stopCamera()
    }
  }, [onInitLandmarker, stopCamera])

  useEffect(() => {
    if (!cameraOn) return

    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawMirrored = (
      landmarks: NormalizedLandmark[],
      connections: { start: number; end: number }[],
    ) => {
      const w = canvas.width
      const h = canvas.height
      const mirror = (p: NormalizedLandmark) => ({
        x: (1 - p.x) * w,
        y: p.y * h,
      })

      ctx.strokeStyle = '#5eead4'
      ctx.lineWidth = 3
      for (const { start, end } of connections) {
        const a = mirror(landmarks[start])
        const b = mirror(landmarks[end])
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      for (const p of landmarks) {
        const m = mirror(p)
        ctx.fillStyle = '#99f6e4'
        ctx.beginPath()
        ctx.arc(m.x, m.y, 4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const tick = () => {
      const landmarker = landmarkerRef.current
      if (
        !landmarker ||
        video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime

        const result = landmarker.detectForVideo(video, performance.now())
        const landmarks = result.landmarks[0]

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (landmarks) {
          drawMirrored(landmarks, PoseLandmarker.POSE_CONNECTIONS)
          onScore(scorePose(landmarks, pose))
        } else {
          onScore({ total: 0, checks: [], detected: false })
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [cameraOn, landmarkerRef, onScore, pose])

  useEffect(() => () => stopCamera(), [stopCamera])

  const loadingModel = landmarkerStatus === 'loading'

  return (
    <div className="camera-panel">
      <div className="camera-stage">
        <video
          ref={videoRef}
          className="camera-video"
          playsInline
          muted
          aria-hidden
        />
        <canvas ref={canvasRef} className="camera-overlay" />
        {!cameraOn && (
          <div className="camera-placeholder">
            <p>カメラをオンにしてポーズをとってください</p>
          </div>
        )}
      </div>

      <div className="camera-actions">
        {!cameraOn ? (
          <button
            type="button"
            className="btn primary"
            onClick={() => void startCamera()}
            disabled={loadingModel || landmarkerStatus === 'error'}
          >
            {loadingModel ? 'モデル読み込み中…' : 'カメラを開始'}
          </button>
        ) : (
          <button type="button" className="btn secondary" onClick={stopCamera}>
            カメラを停止
          </button>
        )}
      </div>

      {(cameraError || landmarkerStatus === 'error') && (
        <p className="error" role="alert">
          {cameraError ?? 'ポーズモデルを読み込めませんでした'}
        </p>
      )}
    </div>
  )
}
