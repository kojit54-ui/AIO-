// Googleアナリティクス（GA4）で、入口・読みもの・ためす など「ログインしなくても見られるページ」の見られ方を数える。
// 2026-11-09 田村さん「アナリティクスの登録」。測定IDは Vercel の環境変数 NEXT_PUBLIC_GA_ID（本番だけ）に入れる。
// ログイン後の画面・管理画面・ログイン/招待/認証の画面は送らない（記事の番号・招待の鍵・ログインの番号がアドレスに入るため）。
// アドレスの ? 以降は、広告の効果を見る utm_ だけ残して捨てる。

import { isLegalPath } from "@/lib/legal";
import { isMarketingPath } from "@/lib/publicPages";

/** 測定ID。G- で始まらない値は使わない（設定ミスでおかしな値を読み込まないため） */
export function gaMeasurementId(raw: string | undefined = process.env.NEXT_PUBLIC_GA_ID): string | null {
  const id = raw?.trim();
  return id && /^G-[A-Z0-9]{4,20}$/.test(id) ? id : null;
}

/** 数えてよいページか。ログインしなくても見られるページだけ */
export function isTrackedPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return isMarketingPath(pathname) || isLegalPath(pathname);
}

/** Google に送るアドレス。? 以降は utm_ だけ残し、# は捨てる */
export function cleanPageLocation(origin: string, pathname: string, search: string): string {
  const params = new URLSearchParams(search);
  const kept = new URLSearchParams();
  params.forEach((value, key) => {
    if (key.startsWith("utm_")) kept.append(key, value);
  });
  const q = kept.toString();
  return `${origin}${pathname}${q ? `?${q}` : ""}`;
}

/** 数える行動の名前（GA4の画面にこの名前で出る） */
export type AnalyticsEvent =
  /** 入口などの受付フォームでメールアドレスを送れた（GA4で「キーイベント」にする） */
  | "generate_lead"
  /** 「30秒でためす」でたたき台が出た */
  | "try_result";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** 行動を1つ数える。数えないページや、タグが無いときは何もしない。中身（メールアドレス・答え）は送らない */
export function trackEvent(name: AnalyticsEvent, params: Record<string, string | number> = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (!isTrackedPath(window.location.pathname)) return;
  window.gtag("event", name, params);
}
