// ログインしなくても見られ、検索やAIに見つけてもらいたいページ（入口・ためす・しおりの自己紹介・読みもの）。
// 2026-11-07 田村さん「AIOもとっていきたい」。アプリの中の画面（記事・管理）は、これまでどおり検索に出さない（src/app/layout.tsx）。

import type { Metadata } from "next";

/** 検索やAIに伝える、このサービスの正式なアドレス */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://aio-erabare.jp").replace(/\/$/, "");

/** 検索に出すページ。sitemap.xml にもこの順で載せる */
export const INDEXABLE_PATHS = ["/welcome", "/column", "/try", "/shiori", "/brand"] as const;

/** 入口と同じ、メニュー付きの見た目で出すページ（ログインの確認をしない） */
export function isMarketingPath(pathname: string | null): boolean {
  return !!pathname && INDEXABLE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** ページの metadata に足すと、検索に出るようになる */
export const INDEX_ROBOTS: Metadata["robots"] = { index: true, follow: true };
