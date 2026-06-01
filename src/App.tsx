import { useCallback, useState } from 'react'
import { PoseCamera } from './components/PoseCamera'
import { usePoseLandmarker } from './hooks/usePoseLandmarker'
import { YOGA_POSES, getPoseById } from './lib/poses'
import type { ScoreResult } from './lib/scoring'
import './App.css'

function scoreLabel(total: number): string {
  if (total >= 85) return '素晴らしい'
  if (total >= 70) return '良い'
  if (total >= 50) return 'もう一息'
  return '調整しましょう'
}

function App() {
  const [poseId, setPoseId] = useState(YOGA_POSES[0].id)
  const [score, setScore] = useState<ScoreResult>({
    total: 0,
    checks: [],
    detected: false,
  })

  const pose = getPoseById(poseId)
  const { landmarkerRef, init, status, error } = usePoseLandmarker()

  const handleInit = useCallback(async () => {
    const lm = await init()
    if (!lm) throw new Error('モデルを初期化できませんでした')
    return lm
  }, [init])

  return (
    <div className="app">
      <header className="header">
        <h1>ヨガポーズ採点</h1>
        <p className="subtitle">
          カメラで姿勢を解析し、リアルタイムでスコアを表示します（処理は端末内のみ）
        </p>
      </header>

      <section className="pose-picker" aria-label="ポーズ選択">
        <label htmlFor="pose-select">練習するポーズ</label>
        <select
          id="pose-select"
          value={poseId}
          onChange={(e) => setPoseId(e.target.value)}
        >
          {YOGA_POSES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <p className="pose-hint">{pose.description}</p>
      </section>

      <main className="main-grid">
        <PoseCamera
          pose={pose}
          landmarkerRef={landmarkerRef}
          landmarkerStatus={status}
          onInitLandmarker={handleInit}
          onScore={setScore}
        />

        <aside className="score-panel" aria-live="polite">
          <div className="score-ring" data-detected={score.detected}>
            <span className="score-value">
              {score.detected ? score.total : '—'}
            </span>
            <span className="score-unit">点</span>
          </div>
          <p className="score-verdict">
            {score.detected ? scoreLabel(score.total) : '全身を映してください'}
          </p>

          <ul className="check-list">
            {pose.checks.map((check) => {
              const result = score.checks.find((c) => c.id === check.id)
              return (
                <li key={check.id}>
                  <div className="check-head">
                    <span>{check.label}</span>
                    <span className="check-score">
                      {result?.measured != null ? `${result.score}点` : '—'}
                    </span>
                  </div>
                  {result?.measured != null && (
                    <p className="check-detail">
                      現在 {Math.round(result.measured)}° / 目標{' '}
                      {check.target}° — {result.feedback}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        </aside>
      </main>

      <footer className="footer">
        <p>
          Vercel 公開時は HTTPS のためカメラが利用できます。初回のみ AI
          モデルのダウンロードがあります。
        </p>
        {error && <p className="error">{error}</p>}
      </footer>
    </div>
  )
}

export default App
