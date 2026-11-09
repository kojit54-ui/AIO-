import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginStage } from "@/components/landing";
import { Notice } from "@/components/ui";
import { billingView } from "@/lib/billing/plan";
import { getOrgBilling, syncCheckoutSession } from "@/lib/billing/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "お申し込みありがとうございます", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Stripe でカードを登録したあとに戻ってくる画面。Webhook を待たずに、ここで状態を読み直す */
export default async function SignupDonePage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  if (!isSupabaseConfigured()) redirect("/");
  const { session_id } = await searchParams;
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect(`/login?next=${encodeURIComponent("/signup/done" + (session_id ? `?session_id=${session_id}` : ""))}`);
  const admin = createAdminSupabase();
  const { data: member } = await admin.from("memberships").select("organization_id").eq("user_id", auth.user.id).is("revoked_at", null).limit(1).maybeSingle();
  if (!member) redirect("/signup");
  if (session_id) await syncCheckoutSession(admin, session_id, member.organization_id).catch(() => false);
  const billing = await getOrgBilling(admin, member.organization_id);
  if (!billing) redirect("/");
  const ok = ["trialing", "active", "past_due"].includes(billing.status);
  const view = billingView(billing);

  return (
    <LoginStage
      mood={ok ? "welldone" : "think"}
      title={ok ? "ようこそ！準備ができました" : "カードの登録を確かめています"}
      lines={ok ? ["最初に、会社のことをいくつか聞かせてください。", "答えるほど、記事が会社らしくなりますよ。"] : ["少し時間がかかっているみたいです。", "1分ほど待って、もう一度開いてみてください。"]}
    >
      <div className="card space-y-4 p-6">
        <Notice tone={ok ? "ok" : "warn"} title={view.title}>
          {view.detail}
        </Notice>
        {ok ? (
          <>
            <p className="text-sm leading-relaxed text-muted">
              お支払いの状態、カードの変更、解約は、いつでも
              <b className="text-ink">マイページの「お支払い」</b>からできます。確認のメールは Stripe から届きます。
            </p>
            <Link href="/" className="btn-primary min-h-14 w-full text-lg">
              はじめる →
            </Link>
          </>
        ) : (
          <Link href={`/signup/done${session_id ? `?session_id=${encodeURIComponent(session_id)}` : ""}`} className="btn-secondary min-h-12 w-full">
            もう一度確かめる
          </Link>
        )}
      </div>
    </LoginStage>
  );
}
