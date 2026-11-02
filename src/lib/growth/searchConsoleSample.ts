// 試作（サンプル）で見せる Search Console の数字。本物は src/lib/searchConsole.ts が Google から読む。

import type { Article, ScSnapshot } from "@/types/domain";

export const SAMPLE_SC_EMAIL = "aio-reader@cotam-sample.iam.gserviceaccount.com";

/** 公開した記事のURLと、ヒアリングの売りたいものから、それらしい数字を作る */
export function sampleSnapshot(articles: Article[], services: string[], today = new Date()): ScSnapshot {
  const end = new Date(today);
  end.setUTCDate(end.getUTCDate() - 3);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27);
  const pages = articles
    .filter((a) => a.publishedUrl)
    .map((a, i) => ({ page: a.publishedUrl as string, clicks: 12 - i * 3 > 1 ? 12 - i * 3 : 1, impressions: 420 - i * 90 > 30 ? 420 - i * 90 : 30, position: 8.4 + i * 3 }));
  const words = services.length ? services : ["浴室リフォーム", "手すりの取り付け"];
  const queries = words.flatMap((w, i) => [
    { query: `${w} 費用`, clicks: 6 - i, impressions: 180 - i * 40, position: 9.2 + i },
    { query: `${w} 相談`, clicks: 3, impressions: 95 - i * 20, position: 12.5 + i },
  ]);
  const clicks = pages.reduce((n, p) => n + p.clicks, 0) + 18;
  const impressions = pages.reduce((n, p) => n + p.impressions, 0) + 640;
  return {
    range: { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) },
    totals: { clicks, impressions, ctr: Math.round((clicks / impressions) * 1000) / 10, position: 14.8 },
    queries,
    pages,
  };
}
