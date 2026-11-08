// 本番（またはプレビュー）で、テスト専用アカウントが記事を1本書き上げるまでを自動で通す。
// 使い方: E2E_BASE / E2E_SUPABASE_URL / E2E_ANON / E2E_EMAIL / E2E_PASSWORD を環境変数で渡して
//   node scripts/e2e/article-flow.mjs [hearing|plan|write|all] [出力フォルダ]
// 架空の会社の答えは scripts/e2e/persona.json。記事の本文は出力フォルダの article.json に残す（ログには出さない）。
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { loginCookies } from "./session.mjs";

const { chromium } = createRequire(import.meta.url)("playwright");
const env = process.env;
const stage = process.argv[2] || "all";
const out = process.argv[3] || "/tmp/e2e-out";
mkdirSync(out, { recursive: true });
const persona = JSON.parse(readFileSync(new URL("./persona.json", import.meta.url), "utf8"));
const host = new URL(env.E2E_BASE).hostname;

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 375, height: 1100 } });
await ctx.addCookies(await loginCookies({ url: env.E2E_SUPABASE_URL, anon: env.E2E_ANON, email: env.E2E_EMAIL, password: env.E2E_PASSWORD, domain: host }));
const p = await ctx.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
let shot = 0;
const snap = async (name) => p.screenshot({ path: `${out}/${String(++shot).padStart(2, "0")}-${name}.png`, fullPage: true });
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const go = async (path) => {
  await p.goto(env.E2E_BASE + path, { waitUntil: "load" });
  await p.waitForTimeout(3000);
};
const visible = async (sel) => (await p.locator(sel).count()) > 0 && (await p.locator(sel).first().isVisible());
// 書いた文字のどれかが出るまで待ち、出たものを返す（読み込み・しおりのしゃべるアニメを待つ）
const waitAny = async (texts, ms = 30000) => {
  const t = Date.now();
  while (Date.now() - t < ms) {
    for (const x of texts) if (await visible(`button:has-text("${x}"), a:has-text("${x}")`)) return x;
    await p.waitForTimeout(1000);
  }
  return null;
};
const waitIdle = async (ms = 90000) => {
  // 「考えています」などの待ち表示が消えるまで待つ
  const t = Date.now();
  while (Date.now() - t < ms) {
    const busy = await p.locator("text=/考えています|読んでいます|作っています|書いています|まとめています/").count();
    if (!busy) return;
    await p.waitForTimeout(1500);
  }
};

// 見出しと箇条書きの形を残して画面の文字を取る（## 見出し・1. 番号・「・」）。採点役が形も見られるように
export async function markedText(page) {
  await page.evaluate(() => {
    const main = document.querySelector("main");
    if (!main) return;
    main.querySelectorAll("h2").forEach((h) => h.prepend("## "));
    main.querySelectorAll("h3").forEach((h) => h.prepend("### "));
    main.querySelectorAll("ol").forEach((ol) => ol.querySelectorAll(":scope > li").forEach((li, i) => li.prepend(`${i + 1}. `)));
    main.querySelectorAll("ul > li").forEach((li) => li.prepend("・"));
  });
  return page.locator("main").innerText().catch(() => "");
}

// 画面の文字から本文だけを取り出す（直すボタン・画像・確認の欄を落とす）
function cleanBody(t) {
  const start = t.indexOf("そこだけ直せます。");
  let body = start >= 0 ? t.slice(start + "そこだけ直せます。".length) : t;
  const end = body.indexOf("もう一度作る（今の文章も残ります）");
  if (end >= 0) body = body.slice(0, end);
  return body.replaceAll("✏️ 直す", "").replace(/\n{3,}/g, "\n\n").trim();
}

async function hearing() {
  await go("/prototype/hearing");
  // 深掘り（もう少しだけ）は1回だけ答え、2回目からは「この話はここまでにする」で次へ進む
  for (let i = 0; i < 40; i++) {
    if (!(await visible("#answer"))) break;
    const head = await p.locator("text=/\\d+問目/").first().innerText().catch(() => "");
    const n = Number(head.match(/(\d+)問目/)?.[1] ?? 0);
    const deepNo = Number(head.match(/もう少しだけ\s*(\d+)回目/)?.[1] ?? 0);
    if (deepNo >= 2) {
      log("深掘りを終える:", n);
      await p.click("text=この話はここまでにする");
    } else if (deepNo === 1) {
      log("深掘りに答える:", n);
      await p.fill("#answer", persona.followUps?.[n - 1] ?? persona.followUp);
      await p.click("button[type=submit]");
    } else {
      const key = Object.keys(persona.hearing)[n - 1];
      log("答える:", n, key);
      await p.fill("#answer", persona.hearing[key] ?? "特にありません");
      await p.click("button[type=submit]");
    }
    await p.waitForTimeout(2000);
    await waitIdle();
  }
  await snap("hearing-done");
  log("hearing end:", p.url());
}

async function profile() {
  await go("/profile");
  let seen = await waitAny(["会社の情報をまとめる", "この内容で問題ありません", "記事づくりに戻る"]);
  log("profile:", seen);
  if (seen === "会社の情報をまとめる") {
    await p.click('button:has-text("会社の情報をまとめる")');
    seen = await waitAny(["この内容で問題ありません"], 240000);
  }
  await snap("profile");
  if (seen === "この内容で問題ありません") {
    await p.click('button:has-text("この内容で問題ありません")');
    log("会社の情報を確かめた");
    await p.waitForTimeout(3000);
  }
  await snap("profile-done");
}

async function plan() {
  await go("/prototype/plan");
  let seen = await waitAny(["しおりにおすすめを出してもらう", "このセットで書いていく", "この記事を書く", "続きを書く"], 60000);
  log("plan:", seen);
  if (seen === "しおりにおすすめを出してもらう") {
    await p.click('button:has-text("しおりにおすすめを出してもらう")');
    seen = await waitAny(["このセットで書いていく"], 240000);
  }
  if (seen === "このセットで書いていく") {
    await p.locator('button:has-text("このセットで書いていく")').first().click();
    seen = await waitAny(["この記事を書く"], 60000);
  }
  await snap("plan-done");
  if (!seen) throw new Error("書く記事リストができなかった");
}

async function write() {
  await go("/prototype/plan");
  await waitAny(["この記事を書く", "続きを書く"], 60000);
  const link = p.locator('a:has-text("この記事を書く"), a:has-text("続きを書く")').first();
  await link.click();
  await p.locator('#answer, button:has-text("答えを見直す")').first().waitFor({ timeout: 60000 }).catch(() => {});
  // 前に答えた記事なら、答えを見直して今の persona の答えに入れ替える
  if (!(await visible("#answer")) && (await visible('button:has-text("答えを見直す")'))) await p.locator('button:has-text("答えを見直す")').first().click();
  await p.locator("#answer").waitFor({ timeout: 10000 }).catch(() => {});
  log("write:", p.url());
  for (let i = 0; i < 12; i++) {
    if (!(await visible("#answer"))) break;
    const label = (await p.locator("label[for=answer]").innerText()).trim();
    const cur = await p.inputValue("#answer");
    const key = label.includes("誰のどんな悩み") ? null : label.includes("どんな相談") ? "a1" : label.includes("どう対応") ? "a2" : label.includes("結果") ? "a3" : label.includes("誤解") ? "a4" : label.includes("喜んで") ? "a6" : label.includes("次に何を") ? "a5" : null;
    if (key) await p.fill("#answer", persona.article[key]);
    else if (!cur.trim()) await p.fill("#answer", "図面がなくて部品を作り直せず困っている、工場の保全担当の人");
    log("記事の質問:", label.slice(0, 24), key ?? "(読む人)");
    await p.click("button[type=submit]");
    await p.waitForTimeout(1200);
  }
  await p.waitForTimeout(2000);
  await waitIdle(120000);
  // 答えを入れ替えたので、答えとタイトルの案も作り直してもらう
  if (await visible('button:has-text("別の案を作ってもらう")')) {
    await p.click('button:has-text("別の案を作ってもらう")');
    await p.waitForTimeout(3000);
    await waitIdle(120000);
  }
  await snap("plan-step");
  if (await visible('a:has-text("会社の情報を確かめる")')) throw new Error("会社の情報がまだ確かめられていない");
  await p.click('button:has-text("AIに記事を書いてもらう")');
  await p.waitForURL(/\/articles\//, { timeout: 180000 });
  await p.waitForTimeout(3000);
  await snap("outline");
  log("outline:", p.url());
  await p.click('button:has-text("この流れで本文を書く")');
  await p.waitForTimeout(5000);
  // 本文ができると「読みながら直す」が出る（点検と書き直しまで入れて数分かかる）
  await p.locator("text=読みながら直す").first().waitFor({ timeout: 900000 });
  await p.waitForTimeout(3000);
  await snap("body");
  const article = {
    url: p.url(),
    title: await p.locator("#title, input[aria-label*=タイトル]").first().inputValue().catch(() => ""),
    text: cleanBody(await markedText(p)),
  };
  writeFileSync(`${out}/article.json`, JSON.stringify(article, null, 2));
  log("body saved:", article.text.length, "chars");
}

try {
  if (stage === "hearing" || stage === "all") await hearing();
  if (stage === "profile" || stage === "all") await profile();
  if (stage === "plan" || stage === "all") await plan();
  if (stage === "write" || stage === "all") await write();
} catch (e) {
  log("ERROR", e.message);
  await snap("error");
  process.exitCode = 1;
} finally {
  if (errors.length) log("page errors:", errors.slice(0, 5));
  await b.close();
}
