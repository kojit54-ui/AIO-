// Search Console の読み込み（サーバー側だけで使う。docs/DECISIONS.md 2026-11-02、つなぎ方A）。
// コタムのサービス用アカウント（GOOGLE_SERVICE_ACCOUNT_EMAIL・GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY）で、
// お客様が「閲覧のみ」で足してくれたプロパティの検索の数字を読む。鍵はサーバーの環境変数だけにあり、画面やログに出さない。
// SDK を入れずに、JWT を自分で署名してアクセストークンをもらう（Google の OAuth 2.0 サービスアカウントの手順）。

import { createPrivateKey, createSign } from "node:crypto";
import type { ScSnapshot } from "@/types/domain";

export type { ScSnapshot };

export class ScError extends Error {
  constructor(
    public readonly code: "not_configured" | "no_access" | "not_found" | "unavailable",
    message: string,
  ) {
    super(message);
  }
}

/** 貼り付けのゆれ（前後の " や , 、\n の2文字、JSON を丸ごと）を吸収して、鍵の文字列に戻す */
export function cleanPrivateKey(raw: string | undefined): string | undefined {
  let k = raw?.trim();
  if (!k) return undefined;
  if (k.startsWith("{")) {
    try {
      k = String((JSON.parse(k) as { private_key?: unknown }).private_key ?? "");
    } catch {
      return undefined;
    }
  }
  k = k.replace(/,\s*$/, "").replace(/^"+|"+$/g, "");
  // Vercel の環境変数では改行が \n の2文字になることがあるので戻す
  return k.replace(/\\r/g, "").replace(/\\n/g, "\n").replace(/\r/g, "").trim();
}

export function scAccount(env: Record<string, string | undefined> = process.env) {
  const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim().replace(/^"+|"+$/g, "");
  const key = cleanPrivateKey(env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
  return email && key ? { email, key } : null;
}

const b64url = (s: string | Buffer) => Buffer.from(s).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

const READONLY_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

/** サービスアカウントで Google のアクセストークンをもらう。scope は読むだけ（既定）か、サイトマップの送信（webmasters）か */
export async function accessToken(account: { email: string; key: string }, doFetch: typeof fetch, scope: string = READONLY_SCOPE): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({ iss: account.email, scope, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }),
  );
  let privateKey;
  try {
    privateKey = createPrivateKey(account.key);
  } catch {
    // 鍵の中身はログにも出さない
    throw new ScError("not_configured", "コタムの鍵（GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY）の形が読めません。BEGIN から END PRIVATE KEY までを入れ直してください");
  }
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const jwt = `${header}.${claims}.${b64url(signer.sign(privateKey))}`;
  const res = await doFetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
  });
  if (!res.ok) throw new ScError("unavailable", `Googleにつながりませんでした（${res.status}）`);
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new ScError("unavailable", "Googleにつながりませんでした");
  return json.access_token;
}

/** 入力されたサイトのURLを、Search Console のプロパティの形にそろえる */
export function normalizeSite(input: string): string | null {
  const s = input.trim();
  if (/^sc-domain:[a-z0-9.-]+\.[a-z]{2,}$/i.test(s)) return s.toLowerCase();
  try {
    const u = new URL(/^https?:\/\//.test(s) ? s : `https://${s}`);
    if (!/^https?:$/.test(u.protocol) || !u.hostname.includes(".")) return null;
    return `${u.protocol}//${u.hostname}/`;
  } catch {
    return null;
  }
}

const day = (d: Date) => d.toISOString().slice(0, 10);

/** 28日分の検索の数字を読む。権限が無ければ no_access */
export async function fetchSnapshot(site: string, opts: { env?: Record<string, string | undefined>; fetch?: typeof fetch; now?: Date } = {}): Promise<ScSnapshot> {
  const account = scAccount(opts.env);
  if (!account) throw new ScError("not_configured", "コタムの準備（サービス用アカウント）がまだです");
  const doFetch = opts.fetch ?? fetch;
  const token = await accessToken(account, doFetch);
  // Search Console のデータは2〜3日遅れて入るので、3日前までの28日間にする
  const end = new Date(opts.now ?? Date.now());
  end.setUTCDate(end.getUTCDate() - 3);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27);
  const range = { start: day(start), end: day(end) };
  const query = async (dimensions: string[], rowLimit: number) => {
    const res = await doFetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ startDate: range.start, endDate: range.end, dimensions, rowLimit }),
    });
    if (res.status === 403) throw new ScError("no_access", "まだ権限がありません。Search Console にコタムのアドレスを足してから、もう一度お試しください");
    if (res.status === 404) throw new ScError("not_found", "このサイトが Search Console に見つかりません。URLを確かめてください");
    if (!res.ok) throw new ScError("unavailable", `Search Console を読めませんでした（${res.status}）`);
    return ((await res.json()) as { rows?: { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }[] }).rows ?? [];
  };
  const [total, queries, pages] = await Promise.all([query([], 1), query(["query"], 30), query(["page"], 50)]);
  const t = total[0];
  const round = (n: number) => Math.round(n * 10) / 10;
  return {
    range,
    totals: { clicks: t?.clicks ?? 0, impressions: t?.impressions ?? 0, ctr: round((t?.ctr ?? 0) * 100), position: round(t?.position ?? 0) },
    queries: queries.map((r) => ({ query: r.keys?.[0] ?? "", clicks: r.clicks, impressions: r.impressions, position: round(r.position) })),
    pages: pages.map((r) => ({ page: r.keys?.[0] ?? "", clicks: r.clicks, impressions: r.impressions, position: round(r.position) })),
  };
}
