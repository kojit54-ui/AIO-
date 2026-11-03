"use client";

// しおり通信（メール）の見本。来月1日に届くメールと同じ中身を、今月ここまでの記録で見せる（docs/DECISIONS.md 2026-11-03）。

import Link from "next/link";
import { ShioriTalk } from "@/components/talk";
import { EmptyState } from "@/components/ui";
import { newsletterInput, renderNewsletter } from "@/lib/newsletter/content";
import { useStore } from "@/mock/store";

export default function NewsletterPreview() {
  const { db, user, month, api } = useStore();
  if (!user) return null;
  if (user.role !== "client_member") return <main className="page"><EmptyState title="しおり通信は、会社の担当の方に届きます" /></main>;
  const orgId = user.organizationIds[0];
  // 次に届くメール（来月1日）は今月のまとめ。今月ここまでの記録で作る
  const target = month;
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const mail = renderNewsletter(newsletterInput(db, orgId, target), { appUrl: origin, unsubscribeUrl: "#" });

  return (
    <main className="page max-w-3xl space-y-4">
      <Link href="/" className="text-sm text-brand-dark underline">
        ホームへ戻る
      </Link>
      <h1 className="text-2xl font-black">しおり通信（メール）の見本</h1>
      <ShioriTalk
        mood="point"
        lines={["毎月1日の朝に、前の月のまとめをメールでお届けします。", db.newsletterOptOut ? "いまは「受け取らない」になっています。" : "来月1日に届くメールは、こんな感じです（今月ここまでの記録で作っています）。"]}
      >
        {db.newsletterOptOut && (
          <button type="button" className="btn-primary" onClick={() => api.setNewsletterOptOut(false)}>
            受け取るようにする
          </button>
        )}
      </ShioriTalk>
      <p className="text-sm text-muted">件名：{mail.subject}</p>
      <iframe title="しおり通信の見本" srcDoc={mail.html} className="h-[900px] w-full rounded-3xl border-2 border-line bg-surface" />
    </main>
  );
}
