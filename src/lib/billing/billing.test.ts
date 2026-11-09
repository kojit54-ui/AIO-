import { describe, expect, it } from "vitest";
import { TERMS, TOKUSHOHO } from "@/lib/legal";
import { billingView, confirmRows, isEntitled, jstDate, jstDateTime, trialSchedule, PRICE_YEN_TAX_INCLUDED, TRIAL_DAYS } from "./plan";
import { renderTrialReminder } from "./reminder";
import { signupGate, subscriptionIdOf } from "./server";
import { formEncode } from "./stripe";

// 2026-11-09 15:00 JST
const NOV9 = Date.UTC(2026, 10, 9, 6, 0);

describe("お試しの日付（日本時間）", () => {
  it("申し込んだ日を1日目として7日間。8日目の0時に初回の請求", () => {
    const s = trialSchedule(NOV9);
    expect(jstDate(s.trialEndMs)).toBe("11月16日（月）");
    expect(new Date(s.trialEndMs).toISOString()).toBe("2026-11-15T15:00:00.000Z");
    expect(jstDateTime(s.cancelByMs)).toBe("11月15日（日）23時59分");
    expect(s.billingDay).toBe(16);
  });
  it("夜遅く（日本時間23時半）に申し込んでも、日本の日付で数える", () => {
    const late = Date.UTC(2026, 10, 9, 14, 30); // 11/9 23:30 JST
    expect(jstDate(trialSchedule(late).trialEndMs)).toBe("11月16日（月）");
    const early = Date.UTC(2026, 10, 9, 15, 30); // 11/10 0:30 JST
    expect(jstDate(trialSchedule(early).trialEndMs)).toBe("11月17日（火）");
  });
  it("月をまたいでも日付がずれない", () => {
    const s = trialSchedule(Date.UTC(2026, 0, 28, 3)); // 1/28 JST
    expect(jstDate(s.trialEndMs, true)).toBe("2026年2月4日（水）");
  });
});

describe("申し込みの最終確認（DECISIONS 2026-11-07 の必須事項）", () => {
  const rows = Object.fromEntries(confirmRows(NOV9));
  it("お試しの終わり・初回の請求日と税込の金額・毎月の請求日・解約の締め切り・日割り返金なしを出す", () => {
    expect(rows["お試し"]).toContain("11月15日（日）まで");
    expect(rows["初回の請求"]).toBe("11月16日（月）に 55,000円（税込）");
    expect(rows["毎月の請求"]).toContain("毎月16日");
    expect(rows["解約の締め切り"]).toContain("11月15日（日）23時59分（日本時間）");
    expect(rows["返金"]).toContain("日割りの返金はありません");
  });
  it("2回目の申し込みはお試しなし", () => {
    const r = Object.fromEntries(confirmRows(NOV9, false));
    expect(r["お試し"]).toBeUndefined();
    expect(r["初回の請求"]).toContain("今日");
  });
  it("規約・特商法と同じ条件（7日・55,000円・日割り返金なし）", () => {
    const terms = JSON.stringify(TERMS);
    expect(terms).toContain(`${TRIAL_DAYS}日間`);
    expect(terms).toContain(PRICE_YEN_TAX_INCLUDED.toLocaleString("ja-JP"));
    expect(terms).toContain("日割りの返金はしません");
    expect(JSON.stringify(TOKUSHOHO)).toContain("55,000");
  });
});

describe("使えるかどうか", () => {
  it("お試し中・契約中・支払いの再試行中は使える。終わった・止まったは使えない", () => {
    expect(["trialing", "active", "past_due"].every((s) => isEntitled(s as never))).toBe(true);
    expect(["incomplete", "incomplete_expired", "canceled", "unpaid", "paused"].some((s) => isEntitled(s as never))).toBe(false);
    expect(isEntitled(null)).toBe(true);
  });
  it("解約の手続き済みは、使える最後の日を出す", () => {
    const v = billingView({ status: "active", trialEnd: null, currentPeriodEnd: "2026-12-15T15:00:00Z", cancelAtPeriodEnd: true, trialUsed: true, hasCustomer: true });
    expect(v.detail).toContain("12月15日（火）まで使えます");
    const t = billingView({ status: "trialing", trialEnd: "2026-11-15T15:00:00Z", cancelAtPeriodEnd: false, currentPeriodEnd: null, trialUsed: true, hasCustomer: true });
    expect(t.detail).toContain("11月16日（月）に初回");
  });
});

describe("申し込める人", () => {
  it("鍵が無ければだれも、テストの鍵ではコタムのアドレスだけ、本番の鍵は SIGNUP_OPEN=on のときだけ", () => {
    expect(signupGate("a@example.com", {})).toBe("closed");
    expect(signupGate("tamura+t@co-tam.co.jp", { STRIPE_SECRET_KEY: "sk_test_x" })).toBe("ok");
    expect(signupGate("a@example.com", { STRIPE_SECRET_KEY: "sk_test_x" })).toBe("test_only");
    expect(signupGate("a@example.com", { STRIPE_SECRET_KEY: "sk_live_x" })).toBe("closed");
    expect(signupGate("a@example.com", { STRIPE_SECRET_KEY: "sk_live_x", SIGNUP_OPEN: "on" })).toBe("ok");
  });
});

describe("Stripe とのやりとり", () => {
  it("入れ子の値を Stripe の書式にする", () => {
    expect(formEncode({ a: 1, b: { c: "x y", d: [{ e: true }] }, skip: undefined })).toBe("a=1&b%5Bc%5D=x%20y&b%5Bd%5D%5B0%5D%5Be%5D=true");
  });
  it("出来事からサブスクリプションのIDを取り出す（請求書は新旧どちらの形でも）", () => {
    expect(subscriptionIdOf({ id: "evt_1", type: "customer.subscription.updated", data: { object: { id: "sub_1" } } })).toBe("sub_1");
    expect(subscriptionIdOf({ id: "evt_1", type: "checkout.session.completed", data: { object: { subscription: "sub_2" } } })).toBe("sub_2");
    expect(subscriptionIdOf({ id: "evt_1", type: "invoice.paid", data: { object: { parent: { subscription_details: { subscription: "sub_3" } } } } })).toBe("sub_3");
    expect(subscriptionIdOf({ id: "evt_1", type: "invoice.payment_failed", data: { object: { subscription: "sub_4" } } })).toBe("sub_4");
    expect(subscriptionIdOf({ id: "evt_1", type: "charge.refunded", data: { object: {} } })).toBeNull();
  });
});

describe("初回の請求の前の日のメール", () => {
  it("請求日・金額・解約の締め切り・マイページのリンクを書く", () => {
    const m = renderTrialReminder({ orgName: "田中精工", trialEndMs: trialSchedule(NOV9).trialEndMs, appUrl: "https://aio-erabare.jp" });
    expect(m.subject).toContain("11月16日（月）");
    expect(m.text).toContain("55,000円（税込）");
    expect(m.text).toContain("11月15日（日）23時59分");
    expect(m.text).toContain("https://aio-erabare.jp/mypage");
    expect(m.html).not.toContain("<script");
  });
});
