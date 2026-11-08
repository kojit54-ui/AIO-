import { createRequire } from "node:module"; const { chromium } = createRequire(import.meta.url)("playwright");
import { loginCookies } from "./session.mjs";
const env = process.env;
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 1200 } });
await ctx.addCookies(await loginCookies({ url: env.E2E_SUPABASE_URL, anon: env.E2E_ANON, email: env.E2E_EMAIL, password: env.E2E_PASSWORD, domain: new URL(env.E2E_BASE).hostname }));
const p = await ctx.newPage(); await p.goto(env.E2E_BASE + process.argv[2]); await p.waitForTimeout(6000);
console.log((await p.locator("main").innerText()).slice(0, +(process.argv[3] || 3000)));
await p.screenshot({ path: process.argv[4] || "/tmp/claude-0/t.png", fullPage: true }); await b.close();
