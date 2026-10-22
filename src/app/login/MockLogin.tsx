"use client";

import { useRouter } from "next/navigation";
import { USERS } from "@/mock/data";
import { useStore } from "@/mock/store";

export function MockLogin() {
  const { login, db } = useStore();
  const router = useRouter();

  function enter(userId: string, role: string) {
    login(userId);
    const next = new URLSearchParams(window.location.search).get("next");
    // 他サイトへのリダイレクトを防ぐため、同じサイト内のパスだけを受け付ける
    const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
    router.push(safeNext ?? (role === "coach" ? "/coach" : "/"));
  }

  return (
    <main className="page max-w-xl">
      <h1 className="mb-1 text-2xl font-bold">ログイン</h1>
      <p className="mb-6 text-muted">
        本番では、招待メールのリンクからログインします。試作では、使う人を選んで画面を確認できます。
      </p>
      <ul className="space-y-3">
        {USERS.map((u) => {
          const orgs = u.organizationIds.map((id) => db.organizations.find((o) => o.id === id)?.name).filter(Boolean);
          return (
            <li key={u.id}>
              <button type="button" className="card w-full text-left hover:border-brand" onClick={() => enter(u.id, u.role)}>
                <span className="block font-semibold">{u.name}</span>
                <span className="block text-sm text-muted">
                  {u.role === "coach" ? `コタム担当者（担当：${orgs.join("、")}）` : "顧客担当者"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
