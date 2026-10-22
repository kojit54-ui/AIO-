import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/ui";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { createOrganization, revokeMember } from "./actions";
import { InviteForm } from "./InviteForm";

const ROLE_LABEL: Record<string, string> = { client_member: "顧客担当者", coach: "コタム担当者" };
const date = (s: string) => new Date(s).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" });

/** 全社管理者の画面：会社の追加、招待リンクの発行、所属の解除（退会） */
export default async function AdminInvitationsPage({ searchParams }: { searchParams: Promise<{ org?: string }> }) {
  if (!isSupabaseConfigured()) {
    return (
      <main className="page max-w-3xl">
        <EmptyState title="この画面は検証環境・本番環境で使います">画面試作（架空データ）では招待を作れません。</EmptyState>
      </main>
    );
  }
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?next=/admin/invitations");
  const { data: admin } = await supabase.from("app_admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (!admin) {
    return (
      <main className="page max-w-3xl">
        <EmptyState title="この画面を表示する権限がありません">全社管理者だけが使えます。</EmptyState>
      </main>
    );
  }

  const { org } = await searchParams;
  const { data: orgs } = await supabase.from("organizations").select("id, name").order("name");
  const current = orgs?.find((o) => o.id === org) ?? orgs?.[0];
  const [{ data: members }, { data: pending }] = current
    ? await Promise.all([
        supabase.rpc("list_members", { p_organization_id: current.id }),
        supabase
          .from("invitations")
          .select("id, email, role, expires_at")
          .eq("organization_id", current.id)
          .is("accepted_at", null)
          .gt("expires_at", new Date().toISOString())
          .order("created_at", { ascending: false }),
      ])
    : [{ data: [] }, { data: [] }];

  return (
    <main className="page max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">招待と所属の管理</h1>
        <form action="/auth/signout" method="post" className="flex items-center gap-3 text-sm">
          <span className="text-muted">{auth.user.email}</span>
          <button type="submit" className="btn-secondary min-h-9 px-3 py-1 text-sm">ログアウト</button>
        </form>
      </div>

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold">会社</h2>
        <ul className="flex flex-wrap gap-2">
          {orgs?.map((o) => (
            <li key={o.id}>
              <Link href={`?org=${o.id}`} className={o.id === current?.id ? "btn-primary min-h-9 px-3 py-1" : "btn-secondary min-h-9 px-3 py-1"}>
                {o.name}
              </Link>
            </li>
          ))}
        </ul>
        <form action={createOrganization} className="flex flex-wrap gap-2">
          <input name="name" required placeholder="会社名" className="field max-w-xs" aria-label="追加する会社名" />
          <button type="submit" className="btn-secondary">会社を追加</button>
        </form>
      </section>

      {current && (
        <>
          <section className="card space-y-3">
            <h2 className="text-lg font-semibold">{current.name}に招待する</h2>
            <InviteForm organizationId={current.id} />
            {pending && pending.length > 0 && (
              <div>
                <h3 className="font-semibold">未使用の招待</h3>
                <ul className="text-sm text-muted">
                  {pending.map((i) => (
                    <li key={i.id}>
                      {i.email}（{ROLE_LABEL[i.role]}、{date(i.expires_at)}まで）
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="card space-y-3">
            <h2 className="text-lg font-semibold">所属している人</h2>
            {!members?.length && <p className="text-muted">まだいません。</p>}
            <ul className="divide-y divide-line">
              {members?.map((m: { membership_id: string; email: string; role: string; revoked_at: string | null }) => (
                <li key={m.membership_id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <span>
                    {m.email}（{ROLE_LABEL[m.role]}）{m.revoked_at && <span className="text-muted"> ・{date(m.revoked_at)}に外しました</span>}
                  </span>
                  {!m.revoked_at && (
                    <form action={revokeMember}>
                      <input type="hidden" name="membershipId" value={m.membership_id} />
                      <button type="submit" className="btn-danger min-h-9 px-3 py-1 text-sm">所属を外す</button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
