# ロゴの作り直し方

1. Zen Maru Gothic の 700・900 の TTF を `scripts/brand/../font/zm700.ttf`・`zm900.ttf` に置く（Google Fonts。Git には入れない）
2. `pip install fonttools` → `python3 scripts/brand/build.py public/brand`（SVGを作る。og.svg は src/app/opengraph-image.png 用）
3. PNG は `node scripts/brand/png.js 元.svg 先.png 幅 高さ [背景色]`（横組み 1173x240、縦組み 786x480、マーク 512）
4. ZIP を作り直し、`npm test` を通す
