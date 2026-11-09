// 有料プランの条件と、画面に出す日付・言葉（docs/DECISIONS.md 2026-11-07「料金・お試し・解約の条件」）。
// 申し込みの最終確認・マイページ・お知らせのメールは、ここの値と文を使う。規約（src/lib/legal.ts）と食い違わないよう legal.test.ts でも見張る。

/** 月額（税込）。Stripe には税込の金額で渡す */
export const PRICE_YEN_TAX_INCLUDED = 55_000;
/** 月額（税抜） */
export const PRICE_YEN_TAX_EXCLUDED = 50_000;
export const TRIAL_DAYS = 7;
/** 申し込みの最終確認の画面 */
export const CONFIRM_PATH = "/signup?step=confirm";
export const PLAN_NAME = "AIOえらばれ帳 月額プラン";

export const yen = (n: number) => `${n.toLocaleString("ja-JP")}円`;
export const PRICE_LABEL = `月額${yen(PRICE_YEN_TAX_INCLUDED)}（税込。税抜${yen(PRICE_YEN_TAX_EXCLUDED)}）`;

/** Stripe のサブスクリプションの状態 */
export type BillingStatus = "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "canceled" | "unpaid" | "paused";

export interface BillingRow {
  status: BillingStatus;
  trialEnd: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  trialUsed: boolean;
  hasCustomer: boolean;
}

/** 使える状態か。お試し中・契約中・支払いの再試行中は使える（DBの app.org_entitled と同じ） */
export function isEntitled(status: BillingStatus | null): boolean {
  return status === null || status === "trialing" || status === "active" || status === "past_due";
}

const JST_MS = 9 * 3600_000;

/** 日本時間の日付（年・月・日） */
function jstParts(ms: number) {
  const d = new Date(ms + JST_MS);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() };
}

/** 日本時間のその日の0時（UTCのミリ秒） */
function jstMidnight(y: number, m: number, d: number) {
  return Date.UTC(y, m - 1, d) - JST_MS;
}

export interface TrialSchedule {
  /** お試しの初日（申し込んだ日） */
  startMs: number;
  /** お試しが終わる時刻＝8日目の日本時間0時。この時刻に初めての請求をする */
  trialEndMs: number;
  /** 解約の締め切り（お試しの最終日の日本時間23時59分） */
  cancelByMs: number;
  /** 毎月の請求日（日にち） */
  billingDay: number;
}

/**
 * 申し込んだ日から7日間（申し込んだ日を1日目と数える）がお試し。8日目の日本時間0時に初めての請求をし、以後その日にちに毎月請求する。
 * 例：11月9日に申し込む → 11月15日までお試し → 11月16日に初回 → 毎月16日に請求
 */
export function trialSchedule(nowMs: number): TrialSchedule {
  const { y, m, d } = jstParts(nowMs);
  const trialEndMs = jstMidnight(y, m, d + TRIAL_DAYS);
  return { startMs: nowMs, trialEndMs, cancelByMs: trialEndMs - 60_000, billingDay: jstParts(trialEndMs).d };
}

const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

/** 11月16日（月） */
export function jstDate(ms: number, withYear = false): string {
  const { y, m, d } = jstParts(ms);
  const w = WEEK[new Date(ms + JST_MS).getUTCDay()];
  return `${withYear ? `${y}年` : ""}${m}月${d}日（${w}）`;
}

/** 11月15日（日）23時59分 */
export function jstDateTime(ms: number, withYear = false): string {
  const t = new Date(ms + JST_MS);
  return `${jstDate(ms, withYear)}${t.getUTCHours()}時${String(t.getUTCMinutes()).padStart(2, "0")}分`;
}

/** 毎月の請求日の言い方。29〜31日は、その日が無い月は月末（規約 第3条） */
export function billingDayLabel(day: number): string {
  return day >= 29 ? `毎月${day}日（${day}日が無い月は月末）` : `毎月${day}日`;
}

/** 申し込みの最終確認でボタンの近くに出す項目（DECISIONS 2026-11-07 の必須事項） */
export function confirmRows(nowMs: number, withTrial = true): [string, string][] {
  if (!withTrial) {
    return [
      ["料金", PRICE_LABEL],
      ["初回の請求", `今日（${jstDate(nowMs)}）に ${yen(PRICE_YEN_TAX_INCLUDED)}（税込）`],
      ["毎月の請求", `${billingDayLabel(jstParts(nowMs).d)}に ${yen(PRICE_YEN_TAX_INCLUDED)}（税込）を自動で請求`],
      ["解約", "マイページからいつでも。解約しても、その月の終わりまで使えます"],
      ["返金", "とちゅうで解約しても、日割りの返金はありません"],
    ];
  }
  const s = trialSchedule(nowMs);
  return [
    ["お試し", `今日から${jstDate(s.trialEndMs - 1)}まで（${TRIAL_DAYS}日間）は無料`],
    ["初回の請求", `${jstDate(s.trialEndMs)}に ${yen(PRICE_YEN_TAX_INCLUDED)}（税込）`],
    ["毎月の請求", `そのあと${billingDayLabel(s.billingDay)}に ${yen(PRICE_YEN_TAX_INCLUDED)}（税込）を自動で請求`],
    ["解約の締め切り", `${jstDateTime(s.cancelByMs)}（日本時間）までにマイページで解約すれば、料金はかかりません`],
    ["返金", "有料になったあと、とちゅうで解約しても日割りの返金はありません。解約しても、その月の終わりまで使えます"],
  ];
}

export interface BillingView {
  tone: "ok" | "warn" | "stop";
  title: string;
  detail: string;
}

/** マイページなどに出す、いまの状態のひとこと */
export function billingView(b: BillingRow): BillingView {
  const end = (iso: string | null) => (iso ? jstDate(new Date(iso).getTime()) : "");
  /** 使える最後の日（終わる時刻の1ミリ秒前の日付） */
  const last = (iso: string | null) => (iso ? jstDate(new Date(iso).getTime() - 1) : "");
  switch (b.status) {
    case "trialing":
      return b.cancelAtPeriodEnd
        ? { tone: "warn", title: "お試し中（解約の手続き済み）", detail: `${last(b.trialEnd)}まで使えます。料金はかかりません` }
        : { tone: "ok", title: "お試し中", detail: `${end(b.trialEnd)}に初回の ${yen(PRICE_YEN_TAX_INCLUDED)}（税込）を請求します。それまでに解約すれば料金はかかりません` };
    case "active":
      return b.cancelAtPeriodEnd
        ? { tone: "warn", title: "解約の手続き済み", detail: `${last(b.currentPeriodEnd)}まで使えます。そのあとの請求はありません` }
        : { tone: "ok", title: "ご利用中", detail: `次の請求は${end(b.currentPeriodEnd)}に ${yen(PRICE_YEN_TAX_INCLUDED)}（税込）です` };
    case "past_due":
      return { tone: "warn", title: "カードでのお支払いができていません", detail: "カードを確かめるか、ほかのカードに変えてください。しばらくは、このまま使えます" };
    case "incomplete":
      return { tone: "stop", title: "カードの登録が終わっていません", detail: "カードを登録すると、7日間のお試しが始まります" };
    case "canceled":
    case "incomplete_expired":
      return { tone: "stop", title: "ご契約が終わっています", detail: "もう一度申し込むと、すぐに使えるようになります。書いた記事は残っています" };
    case "unpaid":
    case "paused":
      return { tone: "stop", title: "お支払いが確認できず、止まっています", detail: "カードを変えると、また使えるようになります。書いた記事は残っています" };
  }
}
