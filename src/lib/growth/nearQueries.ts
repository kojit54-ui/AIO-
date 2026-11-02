// Search Console の「伸びしろのある言葉」（画面とサーバーの両方で使う。docs/DECISIONS.md 2026-11-03）。
// 検索には出ているが、まだ上位にない言葉。記事を書くと上位を狙いやすい。

import type { ScSnapshot } from "@/types/domain";

/** 上位とみなす順位（これより上は strong） */
export const STRONG_POSITION = 8;
/** 伸びしろとみなす順位の下限（これより下は遠すぎる） */
export const NEAR_POSITION = 30;
/** 表示がこれより少ない言葉は、たまたまのことが多いので外す */
export const MIN_IMPRESSIONS = 5;

/** 伸びしろのある言葉（表示の多い順）。会社名などの言葉は exclude で外す */
export function nearQueries(snapshot: ScSnapshot | null | undefined, opts: { limit?: number; exclude?: string[] } = {}) {
  if (!snapshot) return [];
  const ex = (opts.exclude ?? []).map((w) => w.trim()).filter((w) => w.length >= 2);
  return [...snapshot.queries]
    .filter((q) => q.query.trim() && q.impressions >= MIN_IMPRESSIONS && q.position > STRONG_POSITION && q.position <= NEAR_POSITION)
    .filter((q) => !ex.some((w) => q.query.replace(/\s/g, "").includes(w.replace(/\s/g, ""))))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, opts.limit ?? 3);
}
