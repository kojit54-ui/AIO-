// 新規受付の案内（/api/waitlist）。入力の検査は画面とサーバーで同じものを使う。
export const WAITLIST_SOURCES = ["welcome", "try", "price", "final"] as const;
export type WaitlistSource = (typeof WAITLIST_SOURCES)[number];

/** メールの形だけ確かめる（届くかどうかは確かめない）。小文字にそろえて返す。だめなら null */
export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim().toLowerCase();
  if (v.length < 6 || v.length > 254) return null;
  if (!/^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/.test(v)) return null;
  return v;
}

export function normalizeSource(raw: unknown): WaitlistSource {
  return (WAITLIST_SOURCES as readonly string[]).includes(raw as string) ? (raw as WaitlistSource) : "welcome";
}
