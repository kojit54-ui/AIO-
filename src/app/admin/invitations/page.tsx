import { AutoSubmitSelect } from "@/components/admin/AutoSubmitSelect";
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
        <EmptyState mood="sad" title="この画面を表示する権限がありません">全社管理者だけが使えます。</EmptyState>
      </main>
    );
  }

  const { org } = await searchParams;
  const { data: orgs } = await supabase.from("organizations").select("id, name").order("name");
  // 会社ごとの「招待中」の人数（会社を切り替えなくても、登録待ちが分かるように）
  const { data: allPending } = await supabase.from("invitations").select("organization_id, email, created_at").is("accepted_at", null).gt("expires_at", new Date().toISOString());
  const pendingCount = new Map<string, number>();
  for (const p of allPending ?? []) pendingCount.set(p.organization_id, (pendingCount.get(p.organization_id) ?? 0) + 1);
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
      <div>
        <h1 className="text-2xl font-black sm:text-3xl">招待と所属の管理</h1>
        <p className="text-sm text-muted">会社を選んで招待を送ります。招待した人が登録するまでは「招待中」に出ます。</p>
      </div>

      {/* 全社の招待中をまとめて（2026-11-08 管理者役「1社ずつ切り替えないと登録待ちが見えない」） */}
      {allPending && (
        <section className="card space-y-2">
          <h2 className="text-lg font-bold">全社の招待中（まだ登録していない人） {allPending.length}人</h2>
          {allPending.length === 0 && <p className="text-sm text-muted">いまはいません。招待した人は、みなさん登録済みです。</p>}
          <ul className="space-y-1 text-sm">
            {[...allPending]
              .sort((a, b) => a.created_at.localeCompare(b.created_at))
              .map((p) => (
                <li key={`${p.organization_id}:${p.email}`} className="flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-xl bg-canvas px-3 py-1.5">
                  <a href={`?org=${p.organization_id}`} className="font-bold text-brand-dark underline">
                    {orgs?.find((o) => o.id === p.organization_id)?.name ?? "（会社）"}
                  </a>
                  <span className="break-all">{p.email}</span>
                  <span className="text-xs text-muted">
                    {new Date(p.created_at).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric", day: "numeric" })}に招待
                  </span>
                </li>
              ))}
          </ul>
          <p className="text-xs text-muted">古い順です。会社名を押すと、その会社の画面で招待を送り直せます。</p>
        </section>
      )}

      <section className="card space-y-3">
        <h2 className="text-lg font-bold">会社を選ぶ</h2>
        {/* 会社が増えても探せるよう、選ぶ欄にする（入力すると頭文字で選べる） */}
        <form method="get" className="flex flex-wrap items-center gap-2">
          <AutoSubmitSelect name="org" defaultValue={current?.id} aria-label="会社を選ぶ" className="field w-auto min-w-[16rem]">
            {orgs?.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
                {pendingCount.get(o.id) ? `（招待中 ${pendingCount.get(o.id)}）` : ""}
              </option>
            ))}
          </AutoSubmitSelect>
          <noscript>
            <button type="submit" className="btn-secondary min-h-10 px-4 py-1">
              この会社を開く
            </button>
          </noscript>
          <span className="text-sm text-muted">全{orgs?.length ?? 0}社・選ぶとすぐ開きます</span>
        </form>
        <h3 className="border-t border-line pt-3 font-bold">新しい会社を登録する</h3>
        <form action={createOrganization} className="flex flex-wrap gap-2">
          <input name="name" required placeholder="会社名" className="field max-w-xs" aria-label="追加する会社名" />
          <button type="submit" className="btn-secondary">会社を追加</button>
        </form>
      </section>

      {current && (
        <>
          <section className="card space-y-3">
            <h2 className="text-lg font-bold">{current.name}に招待する</h2>
            <InviteForm organizationId={current.id} organizationName={current.name} />
            <div className="rounded-2xl bg-canvas p-3">
              <h3 className="font-bold">招待中（まだ登録していない人）</h3>
              {pending && pending.length > 0 ? (
                <ul className="mt-1 space-y-1 text-sm">
                  {pending.map((i) => (
                    <li key={i.id}>
                      {i.email}（{ROLE_LABEL[i.role]}、招待は{date(i.expires_at)}まで有効）
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-muted">いません。</p>
              )}
            </div>
          </section>

          <section className="card space-y-3">
            <h2 className="text-lg font-bold">所属している人</h2>
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
