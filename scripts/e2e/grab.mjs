// 使い方: grab.mjs <記事のパス> <出力フォルダ> … 書き終わった記事を開き直して、本文を article.json に保存する
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { loginCookies } from "./session.mjs";
const { chromium } = createRequire(import.meta.url)("playwright");
const env = process.env;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 1200 } });
await ctx.addCookies(await loginCookies({ url: env.E2E_SUPABASE_URL, anon: env.E2E_ANON, email: env.E2E_EMAIL, password: env.E2E_PASSWORD, domain: new URL(env.E2E_BASE).hostname }));
const p = await ctx.newPage();
await p.goto(env.E2E_BASE + process.argv[2], { waitUntil: "load" });
await p.locator("text=読みながら直す").first().waitFor({ timeout: 60000 });
await p.waitForTimeout(3000);
await p.evaluate(() => {
  const main = document.querySelector("main");
  main.querySelectorAll("h2").forEach((h) => h.prepend("## "));
  main.querySelectorAll("h3").forEach((h) => h.prepend("### "));
  main.querySelectorAll("ol").forEach((ol) => ol.querySelectorAll(":scope > li").forEach((li, i) => li.prepend(`${i + 1}. `)));
  main.querySelectorAll("ul > li").forEach((li) => li.prepend("・"));
});
let t = await p.locator("main").innerText();
const s = t.indexOf("そこだけ直せます。"); if (s >= 0) t = t.slice(s + 9);
const e = t.indexOf("もう一度作る（今の文章も残ります）"); if (e >= 0) t = t.slice(0, e);
const title = await p.locator("#title, input[aria-label*=タイトル]").first().inputValue().catch(() => "");
writeFileSync(`${process.argv[3]}/article.json`, JSON.stringify({ url: p.url(), title, text: t.replaceAll("✏️ 直す", "").replace(/\n{3,}/g, "\n\n").trim() }, null, 2));
console.log("saved", t.length);
await b.close();
