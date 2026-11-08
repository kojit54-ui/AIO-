// 新しい読みもの（/column）を、公開後すぐ検索エンジンに知らせる。毎朝の Cron（/api/cron/indexing）から呼ぶ。
// 2026-11-08 田村さん「Googleにいち早くインデックスしてもらえるような仕組みを整えたい」。
//
// 公式の案内に沿ってやること（docs/DECISIONS.md 2026-11-08）：
// - Google：サイトマップ（正しい lastmod）と RSS/Atom フィードを用意し、Search Console API でサイトマップを送る。
//   2023年に「サイトマップの ping」は廃止されたので使わない。Indexing API は求人とライブ配信のページ専用なので、記事には使わない。
// - WebSub：フィードの更新をハブ（Google が運営する pubsubhubbub.appspot.com）に知らせる。
// - IndexNow：Bing など IndexNow に参加している検索エンジンへ、新しいURLをすぐ知らせる。Google は IndexNow を使っていない。
// どれも「見つけてもらう」のを早めるだけで、検索結果に載ること・順位は約束されない。

import { newestColumns, todayJst, type Column } from "@/lib/column";
import { SITE_URL } from "@/lib/publicPages";
import { accessToken, scAccount } from "@/lib/searchConsole";

/** IndexNow の鍵。だれでも見られる前提の値（public/<鍵>.txt に同じ値を置く）。秘密情報ではない */
export const INDEXNOW_KEY = "b4f77ea7748029b54c71a34dcb2440b7";
export const FEED_PATH = "/column/feed.xml";
export const WEBSUB_HUB = "https://pubsubhubbub.appspot.com/";

/** 公開日か更新日が、日本時間で直近 days 日（今日を含む）に入る読みもの */
export function freshColumns(now: Date = new Date(), days = 2): Column[] {
  const today = Date.parse(todayJst(now));
  const within = (d: string) => {
    const diff = (today - Date.parse(d)) / 86_400_000;
    return diff >= 0 && diff < days;
  };
  return newestColumns(now).filter((c) => within(c.published) || within(c.updated));
}

/** 知らせるURL。新しい・直した記事と、それが載る一覧・入口 */
export function freshUrls(now: Date = new Date(), days = 2): string[] {
  const cols = freshColumns(now, days);
  if (!cols.length) return [];
  return [...cols.map((c) => `${SITE_URL}/column/${c.slug}`), `${SITE_URL}/column`, `${SITE_URL}/welcome`];
}

export type StepResult = { ok: boolean; status?: number; note?: string };

/** IndexNow（api.indexnow.org は参加している検索エンジンへ共有される） */
export async function submitIndexNow(urls: string[], doFetch: typeof fetch = fetch): Promise<StepResult> {
  if (!urls.length) return { ok: true, note: "知らせるURLなし" };
  const host = new URL(SITE_URL).host;
  const res = await doFetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`, urlList: urls }),
  });
  // 200 と 202（受け付け、鍵の確認待ち）が成功
  return { ok: res.status === 200 || res.status === 202, status: res.status };
}

/** WebSub：フィードが新しくなったことをハブに知らせる */
export async function pingWebSub(doFetch: typeof fetch = fetch): Promise<StepResult> {
  const res = await doFetch(WEBSUB_HUB, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ "hub.mode": "publish", "hub.url": `${SITE_URL}${FEED_PATH}` }),
  });
  return { ok: res.status === 204 || res.status === 200, status: res.status };
}

/** Search Console のプロパティの候補（ドメイン → URL の順） */
export function scProperties(siteUrl: string = SITE_URL): string[] {
  const host = new URL(siteUrl).hostname;
  return [`sc-domain:${host}`, `${siteUrl}/`];
}

/**
 * Search Console にサイトマップとフィードを送る（Search Console API の sitemaps.submit）。
 * コタムのサービス用アカウントが、そのプロパティの「オーナー」になっている必要がある。
 * 権限が無いときは ok:false と、どのプロパティで断られたかを返す（鍵や本文はログに出さない）
 */
export async function submitSitemaps(doFetch: typeof fetch = fetch, env: Record<string, string | undefined> = process.env): Promise<StepResult & { property?: string }> {
  const account = scAccount(env);
  if (!account) return { ok: false, note: "サービス用アカウントの鍵が未設定" };
  const token = await accessToken(account, doFetch, "https://www.googleapis.com/auth/webmasters");
  const feeds = [`${SITE_URL}/sitemap.xml`, `${SITE_URL}${FEED_PATH}`];
  const denied: string[] = [];
  for (const property of scProperties()) {
    let ok = true;
    let last = 0;
    for (const feed of feeds) {
      const res = await doFetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/sitemaps/${encodeURIComponent(feed)}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      last = res.status;
      if (!res.ok) {
        ok = false;
        break;
      }
    }
    if (ok) return { ok: true, status: 200, property };
    denied.push(`${property}=${last}`);
  }
  return { ok: false, note: `送れませんでした（${denied.join(", ")}）。サービス用アカウントをSearch Consoleのオーナーに追加すると送れます` };
}

/** XML に入れる文字を逃がす */
export function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

/** 読みものの Atom フィード（新しい順、最大50件）。WebSub のハブを書いておく */
export function columnFeed(now: Date = new Date(), title = "AIOの読みもの", author = "株式会社コタム"): string {
  const cols = newestColumns(now).slice(0, 50);
  const iso = (d: string) => `${d}T00:00:00+09:00`;
  const updated = cols.map((c) => c.updated).sort().at(-1) ?? todayJst(now);
  const entries = cols
    .map((c) => {
      const url = `${SITE_URL}/column/${c.slug}`;
      return [
        "  <entry>",
        `    <title>${xmlEscape(c.title)}</title>`,
        `    <link rel="alternate" type="text/html" href="${url}"/>`,
        `    <id>${url}</id>`,
        `    <published>${iso(c.published)}</published>`,
        `    <updated>${iso(c.updated)}</updated>`,
        `    <summary>${xmlEscape(c.lead)}</summary>`,
        "  </entry>",
      ].join("\n");
    })
    .join("\n");
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="ja">
  <title>${xmlEscape(title)}</title>
  <link rel="alternate" type="text/html" href="${SITE_URL}/column"/>
  <link rel="self" type="application/atom+xml" href="${SITE_URL}${FEED_PATH}"/>
  <link rel="hub" href="${WEBSUB_HUB}"/>
  <id>${SITE_URL}/column</id>
  <updated>${iso(updated)}</updated>
  <author><name>${xmlEscape(author)}</name></author>
${entries}
</feed>
`;
}
