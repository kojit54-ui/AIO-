// メールに載せるリンクの先頭（https://ドメイン）。本番では NEXT_PUBLIC_SITE_URL を設定する。

import { headers } from "next/headers";

export async function siteOrigin(): Promise<string> {
  const fixed = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fixed) return fixed;
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
