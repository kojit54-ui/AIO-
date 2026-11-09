// Stripe の API をサーバーから直接呼ぶ（SDKは入れない）。鍵は STRIPE_SECRET_KEY（サーバーの環境変数だけ。画面・ログに出さない）。
// テストモードの鍵（sk_test_）なら本物のお金は動かない。

const API = "https://api.stripe.com/v1";
/** 使う API の版を固定し、Stripe 側の既定が変わっても形が変わらないようにする */
const STRIPE_VERSION = "2025-03-31.basil";

export function stripeKey(env: Record<string, string | undefined> = process.env): string | null {
  const k = env.STRIPE_SECRET_KEY?.trim();
  return k && /^(sk|rk)_(test|live)_/.test(k) ? k : null;
}

export const isStripeConfigured = (env: Record<string, string | undefined> = process.env) => stripeKey(env) !== null;
export const isTestMode = (env: Record<string, string | undefined> = process.env) => !!stripeKey(env)?.includes("_test_");

type Param = string | number | boolean | null | undefined | Param[] | { [k: string]: Param };

/** Stripe の書式（a[b][0]=c）にする */
export function formEncode(params: Record<string, Param>): string {
  const out: string[] = [];
  const walk = (key: string, v: Param) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) v.forEach((x, i) => walk(`${key}[${i}]`, x));
    else if (typeof v === "object") Object.entries(v).forEach(([k, x]) => walk(`${key}[${k}]`, x));
    else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
  };
  Object.entries(params).forEach(([k, v]) => walk(k, v));
  return out.join("&");
}

export class StripeError extends Error {
  constructor(
    readonly status: number,
    readonly code: string | undefined,
    message: string,
  ) {
    super(message);
  }
}

export async function stripe<T = Record<string, unknown>>(
  method: "GET" | "POST" | "DELETE",
  path: string,
  params: Record<string, Param> = {},
  opts: { idempotencyKey?: string; env?: Record<string, string | undefined> } = {},
): Promise<T> {
  const key = stripeKey(opts.env);
  if (!key) throw new StripeError(0, "not_configured", "Stripe is not configured");
  const body = formEncode(params);
  const url = method === "GET" && body ? `${API}${path}?${body}` : `${API}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Stripe-Version": STRIPE_VERSION,
      ...(method === "POST" ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
      ...(opts.idempotencyKey ? { "Idempotency-Key": opts.idempotencyKey } : {}),
    },
    body: method === "POST" ? body : undefined,
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as { error?: { code?: string; message?: string } };
  if (!res.ok) throw new StripeError(res.status, json.error?.code, json.error?.message ?? `Stripe ${res.status}`);
  return json as T;
}

/** サブスクリプションの、使う所だけ */
export interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  trial_end: number | null;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  metadata: Record<string, string>;
  /** 2025-03-31 以降の版では、期間の終わりは明細の行にある */
  items: { data: { current_period_end?: number }[] };
  current_period_end?: number;
}

export function periodEnd(sub: StripeSubscription): number | null {
  return sub.items?.data?.[0]?.current_period_end ?? sub.current_period_end ?? null;
}

export interface StripeCheckoutSession {
  id: string;
  url: string | null;
  status: string;
  customer: string | null;
  subscription: string | null;
  client_reference_id: string | null;
  metadata: Record<string, string>;
}

export interface StripeEvent {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
}
