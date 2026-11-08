import { redirect } from "next/navigation";
import { EmptyState, Notice } from "@/components/ui";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { markNotified } from "./actions";
import { CopyEmails } from "./CopyEmails";

// 新規受付の案内を受け取りたい人の一覧（入口ページ・試すページから）。全社管理者だけ。
// 受付を始めるときに、ここに並んだ人へ知らせる。メールは画面の外（ログなど）に出さない。

const SOURCE: Record<string, string> = { welcome: "入口ページ", price: "入口ページ（料金）", final: "入口ページ（最後）", try: "試すページ" };

interface Row {
  email: string;
  source: string;
  created_at: string;
  notified_at: string | null;
}

export default async function AdminWaitlistPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="page max-w-3xl">
        <EmptyState title="この画面は検証環境・本番環境で使います">画面試作（架空データ）では使えません。</EmptyState>
      </main>
    );
  }
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?next=/admin/waitlist");
  const { data: isAdmin } = await supabase.from("app_admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (!isAdmin) {
    return (
      <main className="page max-w-3xl">
        <EmptyState mood="sad" title="この画面を表示する権限がありません">全社管理者だけが使えます。</EmptyState>
      </main>
    );
  }

  const { data, error } = await createAdminSupabase().from("signup_waitlist").select("email, source, created_at, notified_at").order("created_at", { ascending: false }).limit(2000);
  if (error) {
    return (
      <main className="page max-w-3xl space-y-4">
        <h1 className="text-2xl font-black">新規受付の案内を待っている人</h1>
        <Notice tone="warn" title="まだ使えません">
          SQL（supabase/migrations/20261107150000_signup_waitlist.sql）を流すと、この画面が使えるようになります。
        </Notice>
      </main>
    );
  }
  const rows = (data ?? []) as Row[];
  const fmt = (s: string) => new Date(s).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
  return (
    <main className="page max-w-3xl space-y-4">
      <h1 className="text-2xl font-black sm:text-3xl">新規受付の案内を待っている人</h1>
      <p className="text-muted">
        いま <b className="text-ink">{rows.length}人</b>。入口ページと試すページの「受付開始の案内を受け取る」から届いたメールです。受付を始めるときに、この人たちへ知らせます。
      </p>
      <div className="card space-y-2">
        <h2 className="font-black">受付を始めるときの手順</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          <li>「まとめてコピー」で、まだ知らせていない人のアドレスをコピーする</li>
          <li>メールソフトの BCC に貼って、受付開始のお知らせを送る</li>
          <li>送ったら「全員を知らせた にする」を押す（1人ずつなら各行の「知らせた」）</li>
        </ol>
        <div className="flex flex-wrap items-center gap-2">
          <CopyEmails emails={rows.filter((r) => !r.notified_at).map((r) => r.email)} />
          {rows.some((r) => !r.notified_at) && (
            <form action={markNotified}>
              <button type="submit" className="btn-secondary min-h-10 px-4 py-1">
                全員を知らせた にする
              </button>
            </form>
          )}
        </div>
      </div>
      {rows.length === 0 ? (
        <EmptyState title="まだいません">届いたら、ここに新しい順に並びます。</EmptyState>
      ) : (
        <ul className="card divide-y divide-line p-0">
          {rows.map((r) => (
            <li key={r.email} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
              <span className="break-all font-bold">{r.email}</span>
              <span className="text-sm text-muted">
                {SOURCE[r.source] ?? r.source}・{fmt(r.created_at)}
              </span>
              {r.notified_at ? (
                <span className="rounded-full bg-ok-soft px-2.5 text-sm font-bold text-ok">知らせた（{fmt(r.notified_at)}）</span>
              ) : (
                <form action={markNotified}>
                  <input type="hidden" name="email" value={r.email} />
                  <button type="submit" className="btn-secondary min-h-9 px-3 py-1 text-sm">
                    知らせた
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
