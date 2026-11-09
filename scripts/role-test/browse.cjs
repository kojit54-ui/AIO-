// 役割別テスト：本番にログインして画面を撮る（docs/ROLE_TEST.md）
// node scripts/role-test/browse.cjs <出力フォルダ> <role> <email|-> <ページ,カンマ区切り>
// ログインの6桁の番号は、<出力フォルダ>/code-<role>.txt に書くと読み取って入れる（Gmail で読む）。
// 環境変数：BASE（既定 https://aio-erabare.jp）、FULL=1 で縦に長い全体を撮る、CONTACT=1 で担当のトップの記録ボタンも試す
const { chromium } = require('playwright'); const fs=require('fs');
const BASE = process.env.BASE || 'https://aio-erabare.jp';
const [S, role, email, pagesArg] = process.argv.slice(2); const pages = pagesArg.split(',');
const out = { role, steps: [] }; const log = (k, v) => { out.steps.push({ k, v }); console.log(k, JSON.stringify(v)); };
(async () => {
  const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 1280, height: 900 } }); const p = await c.newPage();
  const errs = []; p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type()==='error') errs.push('console: ' + m.text().slice(0,200)); });
  p.on('response', r => { if (r.status() >= 500) errs.push(r.status() + ' ' + r.url()); });
  if (email !== '-') {
    await p.goto(BASE + '/login', { waitUntil: 'networkidle' });
    await p.fill('input[name=email]', email); await p.locator('input[name=email]').press('Enter');
    await p.waitForTimeout(3000); fs.writeFileSync(S + '/sent-' + role + '.txt', new Date().toISOString());
    let code = null; for (let i = 0; i < 90 && !code; i++) { await p.waitForTimeout(2000); const f = S + '/code-' + role + '.txt'; if (fs.existsSync(f)) code = fs.readFileSync(f, 'utf8').trim(); }
    if (!code) { log('login', 'no code'); process.exit(1); }
    const t0 = Date.now();
    await p.fill('input[name="code"]', code); await p.getByRole('button', { name: '番号でログイン' }).click();
    await p.waitForURL(u => !u.pathname.startsWith('/login'), { timeout: 20000 }).catch(() => {});
    await p.waitForLoadState('networkidle'); await p.waitForTimeout(1500);
    log('after-login', { url: p.url(), ms: Date.now() - t0 });
    await p.screenshot({ path: `${S}/${role}-after-login.png` });
  }
  for (const path of pages) {
    for (const w of [1280, 375]) {
      await p.setViewportSize({ width: w, height: w === 375 ? 812 : 900 });
      const t0 = Date.now(); const r = await p.goto(BASE + path, { waitUntil: 'networkidle' }).catch(e => null);
      await p.waitForTimeout(3500);
      const txt = (await p.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
      const overflow = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      log('page', { path, w, status: r && r.status(), final: new URL(p.url()).pathname, ms: Date.now() - t0, overflow, head: txt.slice(0, 120) });
      await p.screenshot({ path: `${S}/${role}${path.replace(/\//g, '_')}-${w}.png`, fullPage: !!process.env.FULL });
    }
  }
  if (process.env.CONTACT) {
    await p.setViewportSize({ width: 1280, height: 900 });
    await p.goto(BASE + '/coach', { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
    const ib = p.getByRole('button', { name: '入れる', exact: true }).first();
    if (await ib.count()) {
      await ib.click(); await p.getByLabel('お客様の担当者名').first().fill('テスト担当さん'); await p.getByLabel('お客様の電話番号').first().fill('03-0000-0000');
      await p.getByRole('button', { name: '残す' }).first().click(); await p.waitForTimeout(2500);
      log('info', { saved: (await p.getByText('電話 03-0000-0000').count()) > 0 });
    } else log('info', 'no button');
    const btn = p.getByRole('button', { name: '声をかけたら記録する' }).first();
    if (await btn.count()) {
      await btn.click(); await p.getByLabel('声をかけたときのひとこと').first().fill('テスト：電話。来週書くとのこと');
      await p.getByRole('button', { name: '残す' }).first().click(); await p.waitForTimeout(3000);
      const ok = await p.getByText('次に連絡する日：').count();
      log('contact', { saved: ok > 0 });
    } else log('contact', 'no button');
    await p.screenshot({ path: `${S}/${role}_coach-1280.png`, fullPage: true });
  }
  log('errors', errs.slice(0, 20));
  fs.writeFileSync(`${S}/result-${role}.json`, JSON.stringify(out, null, 1));
  await b.close();
})();
