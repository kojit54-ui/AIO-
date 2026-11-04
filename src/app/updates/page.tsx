"use client";

// 新しくなったことの一覧（docs/TASKS.md T6-3）

import Link from "next/link";
import { ShioriTalk } from "@/components/talk";
import { UPDATES, updateDateLabel } from "@/lib/updates";

export default function UpdatesPage() {
  return (
    <main className="page max-w-2xl space-y-5">
      <Link href="/" className="text-sm text-brand-dark underline">
        ホームへ戻る
      </Link>
      <h1 className="text-2xl font-black sm:text-3xl">新しくなったこと</h1>
      <ShioriTalk mood="point" lines={["このサービスは、毎週のように良くしています。", "使ってみて困ったことがあれば、コタムの担当者に教えてくださいね。"]} />
      <ol className="space-y-3">
        {UPDATES.map((u, i) => (
          <li key={u.id} className="card animate-rise space-y-1" style={{ animationDelay: `${Math.min(i, 6) * 0.05}s` }}>
            <p className="text-xs font-bold text-muted">{updateDateLabel(u.date)}</p>
            <h2 className="text-lg font-black">{u.title}</h2>
            <p>{u.body}</p>
            {u.href && u.href !== "/updates" && (
              <Link href={u.href} className="inline-block pt-1 text-sm font-bold text-brand-dark underline">
                {u.linkLabel ?? "見てみる"}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </main>
  );
}
