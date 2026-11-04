import { redirect } from "next/navigation";
import { KnowledgeBrowser } from "@/components/admin/KnowledgeBrowser";
import { EmptyState } from "@/components/ui";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

// 全社管理者の「製造業の知識表」（docs/TASKS.md T6-5）
export default async function AdminKnowledgePage() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) redirect("/login?next=/admin/knowledge");
    const { data: isAdmin } = await supabase.from("app_admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
    if (!isAdmin) {
      return (
        <main className="page max-w-3xl">
          <EmptyState mood="sad" title="この画面を表示する権限がありません">全社管理者だけが使えます。</EmptyState>
        </main>
      );
    }
  }
  return <KnowledgeBrowser />;
}
