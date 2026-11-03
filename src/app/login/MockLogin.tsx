"use client";

import { useRouter } from "next/navigation";
import { ShioriFace } from "@/components/fun";
import { LoginStage, useGreeting } from "@/components/landing";
import { USERS } from "@/mock/data";
import { useStore } from "@/mock/store";

export function MockLogin() {
  const { login, db } = useStore();
  const router = useRouter();
  const hello = useGreeting();

  function enter(userId: string, role: string) {
    login(userId);
    const next = new URLSearchParams(window.location.search).get("next");
    // 他サイトへのリダイレクトを防ぐため、同じサイト内のパスだけを受け付ける
    const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
    router.push(safeNext ?? (role === "coach" ? "/coach" : "/"));
  }

  return (
    <LoginStage
      mood="bow"
      title={
        <>
          {hello}！
          <br />
          今日もいっしょに書きましょう
        </>
      }
      lines={["案内役のしおりです。", "本番では、メールアドレスを入れるだけで入れます。パスワードはいりません！"]}
    >
      <div className="card space-y-3 p-6">
        <h2 className="text-xl font-black">ログイン（試作）</h2>
        <p className="text-sm text-muted">試作では、使う人を選んで画面を確認できます。本番では、招待メールのリンクからログインします。</p>
        <ul className="space-y-3">
          {USERS.map((u, i) => {
            const orgs = u.organizationIds.map((id) => db.organizations.find((o) => o.id === id)?.name).filter(Boolean);
            return (
              <li key={u.id} className="animate-rise" style={{ animationDelay: `${0.2 + i * 0.08}s` }}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-3xl border-2 border-line bg-surface p-4 text-left shadow-[0_4px_0_var(--color-line)] transition-transform hover:-translate-y-0.5 hover:border-brand"
                  onClick={() => enter(u.id, u.role)}
                >
                  {u.role === "coach" ? (
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sun-soft text-xl" aria-hidden>
                      🧑‍🏫
                    </span>
                  ) : (
                    <ShioriFace />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block font-black">{u.name}</span>
                    <span className="block text-sm text-muted">{u.role === "coach" ? `コタム担当者（担当：${orgs.join("、")}）` : `顧客担当者（${orgs.join("、")}）`}</span>
                  </span>
                  <span className="text-brand" aria-hidden>
                    →
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </LoginStage>
  );
}
