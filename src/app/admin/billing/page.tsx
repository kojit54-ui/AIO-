import { redirect } from "next/navigation";
import { EmptyState, Notice } from "@/components/ui";
import { billingView, jstDate, type BillingStatus } from "@/lib/billing/plan";
import { isStripeConfigured, isTestMode } from "@/lib/billing/stripe";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { registerWebhook, resyncAll } from "./actions";

export const dynamic = "force-dynamic";

// カード払いで申し込んだ会社の一覧（全社管理者だけ）。招待の会社は出さない。カードの情報はここには無い（Stripe だけが持つ）

export default async function AdminBillingPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="page max-w-3xl">
        <EmptyState title="この画面は本番環境で使います">画面試作（架空データ）では使えません。</EmptyState>
      </main>
    );
  }
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?next=/admin/billing");
  const { data: isAdmin } = await supabase.from("app_admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (!isAdmin) {
    return (
      <main className="page max-w-3xl">
        <EmptyState mood="sad" title="この画面を表示する権限がありません">全社管理者だけが使えます。</EmptyState>
      </main>
    );
  }
  const { data, error } = await createAdminSupabase()
    .from("org_billing")
    .select("organization_id, status, trial_end, current_period_end, cancel_at_period_end, terms_agreed_at, created_at, organizations(name)")
    .order("created_at", { ascending: false });
  const rows = data ?? [];
  const count = (s: string[]) => rows.filter((r) => s.includes(r.status as string)).length;
  const mode = !isStripeConfigured() ? "未設定" : isTestMode() ? "テストモード（本物のお金は動きません）" : "本番";

  return (
    <main className="page max-w-4xl space-y-4">
      <h1 className="text-2xl font-black sm:text-3xl">お支払い</h1>
      <p className="text-muted">カード払いで申し込んだ会社です。招待の会社（コタムとの個別の契約）はここに出ません。</p>
      <div className="card flex flex-wrap items-center gap-x-6 gap-y-2">
        <p>
          Stripe：<b>{mode}</b>
        </p>
        <p>
          お試し中 <b>{count(["trialing"])}</b>社 ／ ご利用中 <b>{count(["active"])}</b>社 ／ 支払い待ち <b>{count(["past_due", "unpaid"])}</b>社 ／ 終了 <b>{count(["canceled", "incomplete_expired"])}</b>社
        </p>
        <form action={registerWebhook}>
          <button className="btn-secondary min-h-9 px-3 py-1 text-sm">Stripeからの知らせの届け先を登録</button>
        </form>
        <form action={resyncAll}>
          <button className="btn-secondary min-h-9 px-3 py-1 text-sm">すべて読み直す</button>
        </form>
      </div>
      {error && (
        <Notice tone="warn" title="まだ使えません">
          SQL（supabase/migrations/20261109150000_billing.sql）を流すと、この画面が使えるようになります。
        </Notice>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="py-2 pr-3">会社</th>
              <th className="py-2 pr-3">状態</th>
              <th className="py-2 pr-3">お試しの終わり</th>
              <th className="py-2 pr-3">次の請求</th>
              <th className="py-2">規約の同意</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const v = billingView({ status: r.status as BillingStatus, trialEnd: r.trial_end, currentPeriodEnd: r.current_period_end, cancelAtPeriodEnd: !!r.cancel_at_period_end, trialUsed: true, hasCustomer: true });
              const d = (s: string | null) => (s ? jstDate(new Date(s).getTime()) : "—");
              return (
                <tr key={r.organization_id as string} className="border-b border-line/60">
                  <td className="py-2 pr-3 font-bold">{(r.organizations as unknown as { name: string } | null)?.name ?? "—"}</td>
                  <td className="py-2 pr-3">{v.title}</td>
                  <td className="py-2 pr-3">{d(r.trial_end)}</td>
                  <td className="py-2 pr-3">{r.cancel_at_period_end ? "なし（解約済み）" : d(r.current_period_end)}</td>
                  <td className="py-2">{d(r.terms_agreed_at)}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-muted">
                  まだありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
