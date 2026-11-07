// 「次に書く日」（2026-11-07 3AIの検討 D）。日にちは日本時間の YYYY-MM-DD で持つ。
// 自分で決めた日に、しおりがメールで知らせる（サーバーは src/lib/reminder/server.ts）。

export type Day = string;

/** 日本時間の今日 */
export function todayJst(now = new Date()): Day {
  return new Date(now.getTime() + 9 * 3600_000).toISOString().slice(0, 10);
}

export function addDays(day: Day, n: number): Day {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

/** 「11月14日（金）」 */
export function dayLabel(day: Day): string {
  const [y, m, d] = day.split("-").map(Number);
  return `${m}月${d}日（${WEEK[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]}）`;
}

export function isDay(v: unknown): v is Day {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));
}

/** えらべる日。考えこまずに押せるよう4つだけ */
export const DAY_CHOICES = [
  { label: "明日", days: 1 },
  { label: "3日後", days: 3 },
  { label: "1週間後", days: 7 },
  { label: "2週間後", days: 14 },
] as const;

export type PlanState = "none" | "upcoming" | "today" | "past";

export function planState(planned: Day | null | undefined, today: Day): PlanState {
  if (!planned) return "none";
  if (planned === today) return "today";
  return planned > today ? "upcoming" : "past";
}

/** 決めた日まで、あと何日か */
export function daysUntil(planned: Day, today: Day): number {
  return Math.round((Date.parse(`${planned}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
}
