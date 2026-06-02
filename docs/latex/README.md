# 印刷用 PDF（LuaLaTeX）

仕様書・操作説明書の PDF を生成します。Markdown 版（`../仕様書.md` など）と内容を揃えています。

## 必要な環境

- **LuaLaTeX**（TeX Live 2022 以降推奨）
- **ltjsclasses**（通常 TeX Live に同梱）
- **日本語フォント**
  - macOS: ヒラギノ（自動）
  - Linux など: [Noto Sans/Serif CJK JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) をインストール

### macOS で TeX Live を入れる例

```bash
brew install --cask mactex-no-gui
# または軽量版
brew install basictex
sudo tlmgr update --self
sudo tlmgr install collection-luatex collection-langjapanese
```

## ビルド

```bash
cd docs/latex
make
```

生成物:

| PDF | ソース |
|-----|--------|
| `仕様書.pdf` | `仕様書.tex` |
| `操作説明書.pdf` | `操作説明書.tex` |

個別にビルドする場合:

```bash
lualatex 仕様書.tex
lualatex 仕様書.tex   # 目次・相互参照のため2回推奨
```

## 印刷のヒント

- A4 縦・カラー想定（表とリンク色あり）
- モノクロ印刷時は `common.tex` の `linkcolor` を `black` に変更可
- ページ数削減: `\documentclass[a4paper,10pt]{ltjsarticle}` に変更

## フォントが見つからない場合

`common.tex` の `\IfFontExistsTF{Hiragino Mincho ProN}` ブロックを、お使いのフォント名に書き換えてください。例（Noto）:

```latex
\setmainjfont{Noto Serif CJK JP}
\setsansjfont{Noto Sans CJK JP}
```

## クリーン

```bash
make clean
```
