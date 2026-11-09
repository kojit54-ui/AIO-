import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/ui";
import { getOrgBilling, signupGate } from "@/lib/billing/server";
import { isTestMode } from "@/lib/billing/stripe";
import { isLoginCodeEnabled } from "@/lib/auth/loginCode";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { ConfirmStep, SignupStart } from "./SignupForms";

export const metadata: Metadata = { title: "お申し込み（7日間無料でためす）", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** 申し込みの画面を開いた時刻（毎回サーバーで描く） */
const nowMs = () => new Date().getTime();

const ERRORS: Record<string, string> = {
  agree: "利用規約とお支払いの条件を確かめて、チェックを入れてください",
  org: "会社名（屋号）を入れてください",
  stripe: "カード登録の画面を開けませんでした。少し待ってから、もう一度押してください",
  closed: "いまは新しいお申し込みを受け付けていません",
};

/**
 * 申し込み（docs/DECISIONS.md 2026-11-09）。
 * 1. 会社名・お名前・メール → 6桁の番号でログイン
 * 2. 最終確認（お試しの終わり・初回の請求日と金額・毎月の請求日・解約の締め切り・日割り返金なし・規約への同意）
 * 3. Stripe のカード登録 → /signup/done
 */
export default async function SignupPage({ searchParams }: { searchParams: Promise<{ step?: string; error?: string }> }) {
  if (!isSupabaseConfigured()) {
    return (
      <main className="page max-w-xl">
        <EmptyState title="この画面は本番環境で使います">画面試作（架空データ）では申し込めません。</EmptyState>
      </main>
    );
  }
  const { error } = await searchParams;
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  const testMode = isTestMode();
  const closed = signupGate(auth.user?.email ?? null) === "closed";

  if (!auth.user) return <SignupStart testMode={testMode} closed={closed} codeEnabled={isLoginCodeEnabled()} />;

  // ログイン済み：すでに使える会社にいる人はホームへ
  const admin = createAdminSupabase();
  const { data: member } = await admin.from("memberships").select("organization_id").eq("user_id", auth.user.id).is("revoked_at", null).limit(1).maybeSingle();
  let orgName = String(auth.user.user_metadata?.signup_org_name ?? "");
  let withTrial = true;
  if (member) {
    const billing = await getOrgBilling(admin, member.organization_id);
    if (!billing || ["trialing", "active", "past_due"].includes(billing.status)) redirect("/");
    withTrial = !billing.trialUsed;
    const { data: org } = await admin.from("organizations").select("name").eq("id", member.organization_id).single();
    orgName = org?.name ?? orgName;
  }
  return (
    <ConfirmStep
      nowMs={nowMs()}
      orgName={orgName}
      orgFixed={!!member}
      email={auth.user.email ?? ""}
      withTrial={withTrial}
      testMode={testMode}
      error={error ? (ERRORS[error] ?? null) : null}
    />
  );
}
