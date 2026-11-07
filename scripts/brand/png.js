/* eslint-disable @typescript-eslint/no-require-imports -- ロゴのPNGを作る使い捨ての台本（node で直接動かす） */
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
// 使い方: node png.js src.svg dst.png 幅 高さ [背景色]
const [src, dst, w, h, bg] = process.argv.slice(2);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
  const html = path.resolve(path.dirname(src), '_png.html');
  fs.writeFileSync(html, `<html><body style="margin:0;background:${bg||'transparent'}"><img src="${path.basename(src)}" style="width:${w}px;height:${h}px;display:block"></body></html>`);
  await p.goto('file://' + html); await p.waitForTimeout(150); await p.screenshot({ path: dst, omitBackground: !bg }); await b.close(); })();
