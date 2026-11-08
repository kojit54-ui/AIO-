// 声をかけたい会社の並び（2026-11-08 管理者役の採点「次に連絡する日の順に」）
// 1. 次に連絡する日が今日まで（古い順） 2. まだ声をかけていない 3. 日を決めずに声をかけた（前回が古い順） 4. 次に連絡する日が先（近い順）
// 同じなら理由の多い会社から

export interface CallOrderItem {
  reasons: string[];
  lastContact?: { at: string; nextOn?: string | null } | null;
}

function rank(x: CallOrderItem, today: string): [number, string] {
  const c = x.lastContact;
  if (!c) return [1, ""];
  if (c.nextOn && c.nextOn <= today) return [0, c.nextOn];
  if (c.nextOn) return [3, c.nextOn];
  return [2, c.at];
}

export function sortCalls<T extends CallOrderItem>(list: T[], today: string): T[] {
  return [...list].sort((a, b) => {
    const [ra, ka] = rank(a, today);
    const [rb, kb] = rank(b, today);
    return ra - rb || ka.localeCompare(kb) || b.reasons.length - a.reasons.length;
  });
}

/** 次に連絡する日の言い方。today は YYYY-MM-DD（日本時間） */
export function nextOnLabel(nextOn: string, today: string): { text: string; due: boolean } {
  const days = Math.round((Date.parse(nextOn) - Date.parse(today)) / 86_400_000);
  const md = `${Number(nextOn.slice(5, 7))}/${Number(nextOn.slice(8, 10))}`;
  if (days < 0) return { text: `次に連絡する日：${md}（${-days}日過ぎています）`, due: true };
  if (days === 0) return { text: `次に連絡する日：${md}（今日）`, due: true };
  return { text: `次に連絡する日：${md}（あと${days}日）`, due: false };
}

export function jstToday(now = new Date()): string {
  return new Date(now.getTime() + 9 * 3600_000).toISOString().slice(0, 10);
}
