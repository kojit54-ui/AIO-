// 役割別テスト：ログイン画面と「メールを送りました」画面を、スマホの幅で撮る（docs/ROLE_TEST.md）
// node scripts/role-test/sent.cjs <出力フォルダ> <email>
// 番号のメールが1通届くので、直前のログインから1分あける（続けて送ると 429）
const { chromium } = require("playwright");
const BASE = process.env.BASE || "https://aio-erabare.jp";
const [S, email] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 375, height: 812 } });
  await p.goto(BASE + "/login", { waitUntil: "networkidle" });
  await p.screenshot({ path: `${S}/v-login-375.png` });
  await p.fill("input[name=email]", email);
  await p.locator("input[name=email]").press("Enter");
  await p.waitForTimeout(4000);
  await p.screenshot({ path: `${S}/v-sent-375.png` });
  await b.close();
})();
