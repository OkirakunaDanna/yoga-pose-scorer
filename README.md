# ヨガポーズ採点（yoga-pose-scorer）

カメラでヨガのポーズをリアルタイム採点する Web アプリです。処理はブラウザ内のみで完結し、[Vercel](https://yoga-pose-scorer.vercel.app) で公開しています。

## ドキュメント

| 文書 | 内容 |
|------|------|
| [操作説明書](./docs/操作説明書.md) | 利用者向けの使い方・トラブルシュート |
| [仕様書](./docs/仕様書.md) | 機能・採点ロジック・技術構成 |
| [印刷用 PDF（LuaLaTeX）](./docs/latex/README.md) | `仕様書.pdf` / `操作説明書.pdf` の生成手順 |

## クイックスタート

```bash
npm install
npm run dev
```

`http://localhost:5173` を開き、「カメラを開始」から利用します。

## ビルド・デプロイ

```bash
npm run build
vercel --prod
```

## 技術スタック

- React + TypeScript + Vite
- MediaPipe Pose Landmarker（`@mediapipe/tasks-vision`）
