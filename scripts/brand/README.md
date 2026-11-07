# ロゴの作り直し方（第2版：現場の野帳）

1. Google Fonts の TTF を リポジトリ直下の `font/` に置く（Git には入れない）：Zen Kaku Gothic New の 900・700（zk900.ttf・zk700.ttf）、Barlow Semi Condensed の 700・600（barlow700.ttf・barlow600.ttf）
2. `pip install fonttools` → `python3 scripts/brand/build.py public/brand`（SVGを作る。og.svg は src/app/opengraph-image.png 用なので public から外す）
3. PNG は `node scripts/brand/png.js 元.svg 先.png 幅 高さ [背景色]`（横組み・縦組みは3倍、マーク 512、apple-icon 180、OG 1200x630）
4. ZIP を作り直し、`npm test`（src/lib/brandBook.test.ts）を通す
