"use client";

// お支払いの状態で、使えるかどうかを見せる（AppShell の中）。止めるのはDBの guard_billing で、ここは知らせる役。
// 招待の会社（コタムとの個別の契約）は何も出さない。

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONFIRM_PATH, type BillingStatus, type BillingView } from "@/lib/billing/plan";
import { EmptyState, Notice } from "./ui";

export interface BillingState {
  plan: "invited" | "stripe";
  status?: BillingStatus;
  entitled: boolean;
  view?: BillingView;
  canPortal?: boolean;
}

/** /api/billing/status を読む。refresh なら Stripe から読み直す */
export function useBilling(enabled: boolean, refresh = false): [BillingState | null, () => void] {
  const [state, setState] = useState<BillingState | null>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    fetch(`/api/billing/status${refresh || n > 0 ? "?refresh=1" : ""}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => alive && j && setState(j as BillingState))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [enabled, refresh, n]);
  return [state, () => setN((x) => x + 1)];
}

/** カードの変更・解約の画面（Stripe）へ移る */
export async function openBillingPortal(): Promise<string | null> {
  const r = await fetch("/api/billing/portal", { method: "POST" });
  const j = (await r.json().catch(() => ({}))) as { url?: string; message?: string };
  if (j.url) {
    window.location.assign(j.url);
    return null;
  }
  return j.message ?? "お支払いの画面を開けませんでした";
}

export function PortalButton({ label = "カード・解約・領収書", className = "btn-secondary" }: { label?: string; className?: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <>
      <button
        type="button"
        className={className}
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setErr(await openBillingPortal());
          setBusy(false);
        }}
      >
        {busy ? "開いています…" : label}
      </button>
      {err && <p className="text-sm text-danger">{err}</p>}
    </>
  );
}

/** 使えない会社では画面の中身のかわりに案内を出す。支払いの再試行中は上に帯を出す */
export function BillingGate({ active, pathname, children }: { active: boolean; pathname: string; children: React.ReactNode }) {
  const [billing] = useBilling(active);
  if (!active || !billing || billing.plan !== "stripe") return <>{children}</>;
  if (!billing.entitled && pathname !== "/mypage") {
    const restart = billing.status === "canceled" || billing.status === "incomplete" || billing.status === "incomplete_expired";
    return (
      <main className="page max-w-xl">
        <EmptyState
          mood="sad"
          title={billing.view?.title ?? "いまは使えません"}
          action={
            <div className="flex flex-col items-center gap-2">
              {restart ? (
                <Link href={CONFIRM_PATH} className="btn-primary">
                  {billing.status === "incomplete" ? "カードを登録する" : "もう一度申し込む"}
                </Link>
              ) : (
                <PortalButton label="カードを変える" className="btn-primary" />
              )}
              <Link href="/mypage" className="text-sm font-bold text-brand-dark underline">
                マイページを開く
              </Link>
            </div>
          }
        >
          {billing.view?.detail}
        </EmptyState>
      </main>
    );
  }
  return (
    <>
      {billing.status === "past_due" && (
        <div className="mx-auto max-w-6xl px-4 pt-3 sm:px-6">
          <Notice tone="warn" title={billing.view?.title}>
            {billing.view?.detail} <PortalButton label="カードを変える" className="font-bold underline" />
          </Notice>
        </div>
      )}
      {children}
    </>
  );
}
