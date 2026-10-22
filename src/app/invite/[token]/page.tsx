import { EmptyState } from "@/components/ui";
import { getInvitation } from "@/lib/auth/invitations";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { AcceptInvite } from "./AcceptInvite";
import { MockInvite } from "./MockInvite";

/** 招待リンクの受け先。期限（7日）と使用済みはサーバーとDBで検査する */
export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  if (!isSupabaseConfigured()) return <MockInvite />;
  const { token } = await params;
  const inv = await getInvitation(token);

  if (inv.status === "expired") {
    return (
      <main className="page max-w-xl">
        <EmptyState title="招待リンクの有効期限が切れています">お手数ですが、コタムの担当者に招待の再送をご依頼ください。</EmptyState>
      </main>
    );
  }
  if (inv.status === "used") {
    return (
      <main className="page max-w-xl">
        <EmptyState title="この招待リンクはすでに使われています">ログイン画面から、招待されたメールアドレスでログインしてください。</EmptyState>
      </main>
    );
  }
  if (inv.status !== "valid" || !inv.organizationName || !inv.maskedEmail) {
    return (
      <main className="page max-w-xl">
        <EmptyState title="この招待リンクは使えません">リンクが正しいか確認するか、コタムの担当者にお問い合わせください。</EmptyState>
      </main>
    );
  }
  return <AcceptInvite token={token} organizationName={inv.organizationName} maskedEmail={inv.maskedEmail} />;
}
