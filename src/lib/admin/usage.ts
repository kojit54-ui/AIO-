// 全社管理者の「利用金額と利用頻度」の集計。画面とは分けて、テストで確かめられるようにする。
// 金額はAIの費用の目安（円）。記事の本文や入力は扱わず、回数・日付・金額だけを使う。

export interface UsageOrg {
  id: string;
  name: string;
}

export interface UsageRun {
  organization_id: string;
  kind: string;
  status: string;
  cost_yen: number | string;
  created_at: string;
}

export interface UsageTrialRun {
  cost_yen: number | string;
  created_at: string;
}

/** 顧客担当者が何かした跡（ログイン、質問に答えた、記事を作った、AIを使った など） */
export interface UsageActivity {
  organization_id: string;
  at: string;
}

export interface UsageArticle {
  organization_id: string;
  status: string;
}

export interface UsageHearing {
  organization_id: string;
  is_draft: boolean;
}

export interface UsageInput {
  now: Date;
  orgs: UsageOrg[];
  runs: UsageRun[];
  trialRuns: UsageTrialRun[];
  activity: UsageActivity[];
  articles: UsageArticle[];
  hearing: UsageHearing[];
  /** 全体の月の予算（記事づくり・ヒアリングなど。30秒でためすは別の予算）。円 */
  budgetYen: number;
}

export type OrgPace = "sleeping" | "slow" | "active" | "never";

export interface OrgUsage {
  id: string;
  name: string;
  costThisMonth: number;
  costLastMonth: number;
  aiRunsThisMonth: number;
  lastActiveAt: string | null;
  daysSinceActive: number | null;
  activeDays7: number;
  activeDays30: number;
  articles: number;
  published: number;
  answered: number;
  pace: OrgPace;
}

export interface UsageSummary {
  monthLabel: string;
  lastMonthLabel: string;
  costThisMonth: number;
  costLastMonth: number;
  trialCostThisMonth: number;
  budgetYen: number;
  /** 0〜1。予算0のときは1 */
  budgetRatio: number;
  byKind: { kind: string; label: string; cost: number; runs: number }[];
  failedThisMonth: number;
  orgs: OrgUsage[];
  /** 日ごとの「使った会社の数」（直近14日、古い順） */
  perDay: { day: string; orgs: number }[];
}

export const KIND_LABEL: Record<string, string> = {
  outline: "記事の組み立て",
  body: "記事を書く",
  rewrite: "書き直し",
  followup_questions: "追加の質問",
  image: "画像",
  keyword_proposal: "書く記事の提案",
  aio_check: "AIOのチェック",
  hearing: "会社のことを教える",
};

export const PACE_LABEL: Record<OrgPace, string> = {
  sleeping: "2週間以上 使っていません",
  slow: "このところ少なめ",
  active: "よく使っています",
  never: "まだ使い始めていません",
};

const DAY = 24 * 3600_000;

/** 日本時間の日付（YYYY-MM-DD） */
export const jstDay = (d: Date) => new Date(d.getTime() + 9 * 3600_000).toISOString().slice(0, 10);

/** 日本時間の前の月（YYYY-MM） */
export function previousMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`;
}

/** 前の月の1日0時（日本時間）。集めるデータの始まり */
export function lastMonthStart(now: Date): Date {
  const [y, m] = previousMonth(jstDay(now).slice(0, 7)).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1) - 9 * 3600_000);
}

const yen = (v: number | string) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const monthLabel = (month: string) => `${Number(month.slice(5))}月`;

export function summarizeUsage(input: UsageInput): UsageSummary {
  const today = jstDay(input.now);
  const month = today.slice(0, 7);
  const lastMonth = previousMonth(month);
  const monthOf = (iso: string) => jstDay(new Date(iso)).slice(0, 7);

  const kinds = new Map<string, { cost: number; runs: number }>();
  let costThisMonth = 0;
  let costLastMonth = 0;
  let failedThisMonth = 0;
  const orgCost = new Map<string, { now: number; last: number; runs: number }>();
  for (const r of input.runs) {
    const m = monthOf(r.created_at);
    const c = yen(r.cost_yen);
    const o = orgCost.get(r.organization_id) ?? { now: 0, last: 0, runs: 0 };
    if (m === month) {
      costThisMonth += c;
      o.now += c;
      o.runs += 1;
      const k = kinds.get(r.kind) ?? { cost: 0, runs: 0 };
      k.cost += c;
      k.runs += 1;
      kinds.set(r.kind, k);
      if (r.status === "failed") failedThisMonth += 1;
    } else if (m === lastMonth) {
      costLastMonth += c;
      o.last += c;
    }
    orgCost.set(r.organization_id, o);
  }
  const trialCostThisMonth = input.trialRuns.filter((r) => monthOf(r.created_at) === month).reduce((s, r) => s + yen(r.cost_yen), 0);

  // 会社ごとの「使った日」
  const daysByOrg = new Map<string, Set<string>>();
  const lastByOrg = new Map<string, number>();
  for (const a of input.activity) {
    const t = new Date(a.at).getTime();
    if (!Number.isFinite(t) || t > input.now.getTime() + 60_000) continue;
    const set = daysByOrg.get(a.organization_id) ?? new Set<string>();
    set.add(jstDay(new Date(t)));
    daysByOrg.set(a.organization_id, set);
    lastByOrg.set(a.organization_id, Math.max(lastByOrg.get(a.organization_id) ?? 0, t));
  }
  const recentDays = (n: number) => new Set(Array.from({ length: n }, (_, i) => jstDay(new Date(input.now.getTime() - i * DAY))));
  const last7 = recentDays(7);
  const last30 = recentDays(30);

  const orgs: OrgUsage[] = input.orgs.map((org) => {
    const days = daysByOrg.get(org.id) ?? new Set<string>();
    const last = lastByOrg.get(org.id);
    const daysSinceActive = last ? Math.max(0, Math.floor((input.now.getTime() - last) / DAY)) : null;
    const activeDays7 = [...days].filter((d) => last7.has(d)).length;
    const activeDays30 = [...days].filter((d) => last30.has(d)).length;
    const pace: OrgPace = daysSinceActive === null ? "never" : daysSinceActive >= 14 ? "sleeping" : activeDays7 === 0 ? "slow" : "active";
    const arts = input.articles.filter((a) => a.organization_id === org.id);
    const c = orgCost.get(org.id);
    return {
      id: org.id,
      name: org.name,
      costThisMonth: c?.now ?? 0,
      costLastMonth: c?.last ?? 0,
      aiRunsThisMonth: c?.runs ?? 0,
      lastActiveAt: last ? new Date(last).toISOString() : null,
      daysSinceActive,
      activeDays7,
      activeDays30,
      articles: arts.length,
      published: arts.filter((a) => a.status === "published").length,
      answered: input.hearing.filter((h) => h.organization_id === org.id && !h.is_draft).length,
      pace,
    };
  });
  // 声をかけたい会社（長く使っていない・まだ始めていない）を上に
  const order: Record<OrgPace, number> = { sleeping: 0, never: 1, slow: 2, active: 3 };
  orgs.sort((a, b) => order[a.pace] - order[b.pace] || (b.daysSinceActive ?? 0) - (a.daysSinceActive ?? 0) || a.name.localeCompare(b.name, "ja"));

  const perDay = Array.from({ length: 14 }, (_, i) => {
    const day = jstDay(new Date(input.now.getTime() - (13 - i) * DAY));
    return { day, orgs: [...daysByOrg.values()].filter((s) => s.has(day)).length };
  });

  return {
    monthLabel: monthLabel(month),
    lastMonthLabel: monthLabel(lastMonth),
    costThisMonth,
    costLastMonth,
    trialCostThisMonth,
    budgetYen: input.budgetYen,
    budgetRatio: input.budgetYen > 0 ? Math.min(1, costThisMonth / input.budgetYen) : 1,
    byKind: [...kinds.entries()]
      .map(([kind, v]) => ({ kind, label: KIND_LABEL[kind] ?? kind, ...v }))
      .sort((a, b) => b.cost - a.cost),
    failedThisMonth,
    orgs,
    perDay,
  };
}
