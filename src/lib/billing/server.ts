// 有料プランのサーバー側の処理（申し込み・Stripe の状態の写し・カードと解約の手続き）。
// DB（org_billing）への書き込みは service role だけ。Stripe の状態は、Stripe から読み直したものだけを信じて写す。

import type { SupabaseClient } from "@supabase/supabase-js";
import { LEGAL_VERSION } from "@/lib/legal";
import { SITE_URL } from "@/lib/publicPages";
import { type BillingRow, type BillingStatus, PLAN_NAME, PRICE_YEN_TAX_INCLUDED, trialSchedule } from "./plan";
import { type StripeCheckoutSession, type StripeEvent, type StripeSubscription, isStripeConfigured, isTestMode, periodEnd, stripe } from "./stripe";

/**
 * 申し込める人か。
 * - Stripe の鍵が無いあいだは、だれも申し込めない
 * - テストモード（sk_test_）のあいだは、コタムのアドレス（@co-tam.co.jp）だけ。テストのカードでただで使われないように
 * - 本番の鍵では、SIGNUP_OPEN=on にしたときだけ（田村さんが受付開始を決めてから）
 */
export function signupGate(email: string | null, env: Record<string, string | undefined> = process.env): "ok" | "closed" | "test_only" {
  if (!isStripeConfigured(env)) return "closed";
  if (isTestMode(env)) return !email || /@co-tam\.co\.jp$/i.test(email.trim()) ? "ok" : "test_only";
  return env.SIGNUP_OPEN?.trim() === "on" ? "ok" : "closed";
}

/** 料金の目印。同じ値段の価格を何度も作らない */
export const PRICE_LOOKUP_KEY = "aio_erabare_monthly_55000_jpy";
const APP_TAG = "aio-erabare";

const STATUSES: BillingStatus[] = ["incomplete", "incomplete_expired", "trialing", "active", "past_due", "canceled", "unpaid", "paused"];
const toStatus = (s: string): BillingStatus => (STATUSES.includes(s as BillingStatus) ? (s as BillingStatus) : "incomplete");
const iso = (sec: number | null | undefined) => (sec ? new Date(sec * 1000).toISOString() : null);

export interface OrgBillingRecord extends BillingRow {
  organizationId: string;
  customerId: string | null;
  subscriptionId: string | null;
}

export async function getOrgBilling(db: SupabaseClient, orgId: string): Promise<OrgBillingRecord | null> {
  const { data } = await db.from("org_billing").select("*").eq("organization_id", orgId).maybeSingle();
  if (!data) return null;
  return {
    organizationId: data.organization_id,
    status: toStatus(data.status),
    trialEnd: data.trial_end,
    currentPeriodEnd: data.current_period_end,
    cancelAtPeriodEnd: !!data.cancel_at_period_end,
    trialUsed: !!data.trial_used,
    hasCustomer: !!data.stripe_customer_id,
    customerId: data.stripe_customer_id,
    subscriptionId: data.stripe_subscription_id,
  };
}

/** Stripe のサブスクリプションを org_billing に写す。会社は metadata.org_id、無ければ顧客IDで探す */
export async function syncSubscription(admin: SupabaseClient, sub: StripeSubscription): Promise<string | null> {
  let orgId = sub.metadata?.org_id ?? null;
  if (!orgId) {
    const { data } = await admin.from("org_billing").select("organization_id").eq("stripe_customer_id", sub.customer).maybeSingle();
    orgId = data?.organization_id ?? null;
  }
  if (!orgId) return null;
  const status = toStatus(sub.status);
  const row = {
    organization_id: orgId,
    plan: "stripe",
    status,
    stripe_customer_id: sub.customer,
    stripe_subscription_id: sub.id,
    trial_end: iso(sub.trial_end),
    current_period_end: iso(periodEnd(sub)),
    cancel_at_period_end: !!sub.cancel_at_period_end,
    canceled_at: iso(sub.canceled_at),
    updated_at: new Date().toISOString(),
    ...(sub.trial_end ? { trial_used: true } : {}),
  };
  const { error } = await admin.from("org_billing").upsert(row, { onConflict: "organization_id" });
  if (error) throw new Error("org_billing の更新に失敗しました");
  return orgId;
}

export async function syncSubscriptionById(admin: SupabaseClient, subscriptionId: string): Promise<string | null> {
  return syncSubscription(admin, await stripe<StripeSubscription>("GET", `/subscriptions/${subscriptionId}`));
}

/** 申し込みの会社を作る。すでにどこかの会社に入っている人は、その会社を返す（2つ目は作らない） */
export async function createSignupOrg(
  admin: SupabaseClient,
  input: { userId: string; orgName: string; personName: string },
): Promise<{ orgId: string; invited: boolean }> {
  const { data: mine } = await admin
    .from("memberships")
    .select("organization_id, role")
    .eq("user_id", input.userId)
    .is("revoked_at", null)
    .limit(1)
    .maybeSingle();
  if (mine) {
    const { data: b } = await admin.from("org_billing").select("organization_id").eq("organization_id", mine.organization_id).maybeSingle();
    return { orgId: mine.organization_id, invited: !b };
  }
  const { data: org, error } = await admin.from("organizations").insert({ name: input.orgName }).select("id").single();
  if (error || !org) throw new Error("会社を作れませんでした");
  const steps = await Promise.all([
    admin.from("memberships").insert({ user_id: input.userId, organization_id: org.id, role: "client_member" }),
    admin.from("org_billing").insert({ organization_id: org.id, plan: "stripe", status: "incomplete" }),
    admin.from("audit_logs").insert({ actor_id: input.userId, organization_id: org.id, action: "signup.created", target: {} }),
  ]);
  if (steps.slice(0, 2).some((s) => s.error)) throw new Error("会社を作れませんでした");
  if (input.personName) await admin.auth.admin.updateUserById(input.userId, { user_metadata: { name: input.personName } });
  return { orgId: org.id, invited: false };
}

async function ensurePrice(): Promise<string> {
  const found = await stripe<{ data: { id: string }[] }>("GET", "/prices", { "lookup_keys[]": PRICE_LOOKUP_KEY, active: true, limit: 1 });
  if (found.data[0]) return found.data[0].id;
  const price = await stripe<{ id: string }>(
    "POST",
    "/prices",
    {
      currency: "jpy",
      unit_amount: PRICE_YEN_TAX_INCLUDED,
      recurring: { interval: "month" },
      lookup_key: PRICE_LOOKUP_KEY,
      tax_behavior: "inclusive",
      product_data: { name: PLAN_NAME, metadata: { app: APP_TAG } },
    },
    { idempotencyKey: `price-${PRICE_LOOKUP_KEY}` },
  );
  return price.id;
}

/**
 * 最終確認のあと、Stripe のカード登録の画面（Checkout）を作る。規約への同意をここで記録する。
 * お試しを使っていない会社は、申し込んだ日から7日間お試し（8日目の日本時間0時に初回の請求）
 */
export async function startCheckout(
  admin: SupabaseClient,
  input: { orgId: string; orgName: string; userId: string; email: string; origin: string; nowMs?: number },
): Promise<{ url: string; withTrial: boolean }> {
  const billing = await getOrgBilling(admin, input.orgId);
  if (!billing) throw new Error("not_signup_org");
  const withTrial = !billing.trialUsed;
  let customerId = billing.customerId;
  if (!customerId) {
    const c = await stripe<{ id: string }>(
      "POST",
      "/customers",
      { email: input.email, name: input.orgName, preferred_locales: ["ja"], metadata: { org_id: input.orgId, app: APP_TAG } },
      { idempotencyKey: `customer-${input.orgId}` },
    );
    customerId = c.id;
  }
  const now = new Date(input.nowMs ?? Date.now());
  await admin
    .from("org_billing")
    .update({ stripe_customer_id: customerId, terms_version: LEGAL_VERSION, terms_agreed_at: now.toISOString(), terms_agreed_by: input.userId, updated_at: now.toISOString() })
    .eq("organization_id", input.orgId);

  // Webhook の届け先が無ければ登録する（本番のアドレスのときだけ。管理画面を開かなくても連動するように）
  if (input.origin === SITE_URL) await ensureWebhookEndpoint(input.origin).catch(() => undefined);
  const price = await ensurePrice();
  const session = await stripe<StripeCheckoutSession>("POST", "/checkout/sessions", {
    mode: "subscription",
    customer: customerId,
    client_reference_id: input.orgId,
    line_items: [{ price, quantity: 1 }],
    payment_method_types: ["card"],
    payment_method_collection: "always",
    locale: "ja",
    metadata: { org_id: input.orgId, app: APP_TAG },
    subscription_data: {
      metadata: { org_id: input.orgId, app: APP_TAG },
      ...(withTrial ? { trial_end: Math.floor(trialSchedule(now.getTime()).trialEndMs / 1000) } : {}),
    },
    success_url: `${input.origin}/signup/done?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.origin}/signup?step=confirm`,
  });
  if (!session.url) throw new Error("checkout_failed");
  return { url: session.url, withTrial };
}

/** カードの登録から戻ってきたとき。Webhook を待たずに状態を写す */
export async function syncCheckoutSession(admin: SupabaseClient, sessionId: string, orgId: string): Promise<boolean> {
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return false;
  const s = await stripe<StripeCheckoutSession>("GET", `/checkout/sessions/${sessionId}`);
  if (s.client_reference_id !== orgId || !s.subscription) return false;
  await syncSubscriptionById(admin, s.subscription);
  return true;
}

/** カードの変更・解約・領収書の画面（Stripe のカスタマーポータル）。設定はこのサービス用のものを1つ作って使い回す */
async function ensurePortalConfiguration(origin: string): Promise<string> {
  const list = await stripe<{ data: { id: string; active: boolean; metadata: Record<string, string> }[] }>("GET", "/billing_portal/configurations", { active: true, limit: 100 });
  const found = list.data.find((c) => c.metadata?.app === APP_TAG && c.metadata?.version === "1");
  if (found) return found.id;
  const created = await stripe<{ id: string }>("POST", "/billing_portal/configurations", {
    business_profile: { headline: "AIOえらばれ帳のお支払い", privacy_policy_url: `${origin}/privacy`, terms_of_service_url: `${origin}/terms` },
    default_return_url: `${origin}/mypage`,
    features: {
      payment_method_update: { enabled: true },
      invoice_history: { enabled: true },
      // 解約は「いまの期間の終わり」に。日割りの返金はしない（規約 第8条）
      subscription_cancel: { enabled: true, mode: "at_period_end", proration_behavior: "none" },
      customer_update: { enabled: false },
    },
    metadata: { app: APP_TAG, version: "1" },
  });
  return created.id;
}

export async function openPortal(admin: SupabaseClient, orgId: string, origin: string): Promise<string> {
  const b = await getOrgBilling(admin, orgId);
  if (!b?.customerId) throw new Error("no_customer");
  const configuration = await ensurePortalConfiguration(origin);
  const s = await stripe<{ url: string }>("POST", "/billing_portal/sessions", { customer: b.customerId, configuration, locale: "ja", return_url: `${origin}/mypage?billing=back` });
  return s.url;
}

/** マイページに戻ってきたときなど、Stripe の今の状態を読み直す */
export async function refreshOrgBilling(admin: SupabaseClient, orgId: string): Promise<void> {
  const b = await getOrgBilling(admin, orgId);
  if (b?.subscriptionId) await syncSubscriptionById(admin, b.subscriptionId);
}

/** Webhook で知らせる出来事 */
export const WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.trial_will_end",
  "invoice.paid",
  "invoice.payment_failed",
] as const;

/** 出来事から、対象のサブスクリプションのIDを取り出す（版によって置き場所がちがう） */
export function subscriptionIdOf(event: StripeEvent): string | null {
  const o = event.data.object as Record<string, unknown>;
  if (event.type.startsWith("customer.subscription.")) return (o.id as string) ?? null;
  if (event.type === "checkout.session.completed") return (o.subscription as string) ?? null;
  if (event.type.startsWith("invoice.")) {
    const parent = o.parent as { subscription_details?: { subscription?: string } } | undefined;
    return parent?.subscription_details?.subscription ?? (o.subscription as string | undefined) ?? null;
  }
  return null;
}

/**
 * Webhook。届いた中身は信じず、イベントのIDで Stripe から読み直す（署名の鍵を持たずに本物か確かめられる）。
 * そのうえで、サブスクリプションの今の状態を読み直して写す。何度届いても同じ結果になる
 */
export async function handleWebhookEvent(admin: SupabaseClient, eventId: string): Promise<{ handled: boolean; type?: string }> {
  if (!/^evt_[A-Za-z0-9_]+$/.test(eventId)) return { handled: false };
  const event = await stripe<StripeEvent>("GET", `/events/${eventId}`);
  if (!(WEBHOOK_EVENTS as readonly string[]).includes(event.type)) return { handled: false, type: event.type };
  const subId = subscriptionIdOf(event);
  if (!subId) return { handled: false, type: event.type };
  await syncSubscriptionById(admin, subId);
  return { handled: true, type: event.type };
}

/** Webhook の届け先を Stripe に登録する（管理画面のボタンから。何度押しても1つだけ） */
export async function ensureWebhookEndpoint(origin: string): Promise<{ id: string; created: boolean; url: string }> {
  const url = `${origin}/api/stripe/webhook`;
  const list = await stripe<{ data: { id: string; url: string; enabled_events: string[]; status: string }[] }>("GET", "/webhook_endpoints", { limit: 100 });
  const found = list.data.find((w) => w.url === url);
  if (found) {
    const missing = WEBHOOK_EVENTS.some((e) => !found.enabled_events.includes(e) && !found.enabled_events.includes("*"));
    if (missing || found.status !== "enabled") await stripe("POST", `/webhook_endpoints/${found.id}`, { enabled_events: [...WEBHOOK_EVENTS], disabled: false });
    return { id: found.id, created: false, url };
  }
  const created = await stripe<{ id: string }>("POST", "/webhook_endpoints", { url, enabled_events: [...WEBHOOK_EVENTS], description: "AIOえらばれ帳（利用状態の連動）", metadata: { app: APP_TAG } });
  return { id: created.id, created: true, url };
}
