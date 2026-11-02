"use client";

// 会社の情報がまだ無いときの案内（docs/DECISIONS.md 2026-11-02「コタムを待たずに書き始める」）。
// コタムの登録を待たずに、お客様が「会社のことを教える」に答え、その答えからAIが会社の情報をまとめる。

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shiori } from "@/components/fun";
import { GeneratingOverlay, Notice } from "@/components/ui";
import { ApiError, useStore } from "@/mock/store";

export function ProfileSetup({ orgId }: { orgId: string }) {
  const { api } = useStore();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function build() {
    setBusy(true);
    setError(null);
    try {
      await api.buildProfileFromHearing(orgId);
      router.push("/profile");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "会社の情報をまとめられませんでした。もう一度お試しください");
      setBusy(false);
    }
  }

  const steps = [
    { title: "会社のことを教える", body: "しおりの質問に答えます。答えるたびに、AIが理由を添えてくわしく聞き返します。" },
    { title: "会社の情報をまとめる", body: "答えから、記事づくりに使う会社の情報をAIがまとめます。" },
    { title: "確かめる", body: "まとめた内容を読んで、問題なければ「この内容で問題ありません」を押します。" },
  ];

  return (
    <section className="card animate-rise space-y-4">
      {busy && <GeneratingOverlay label="会社の情報をまとめています" />}
      <div className="flex flex-wrap items-end gap-4">
        <Shiori mood="bow" className="h-32 w-auto shrink-0 animate-float" />
        <div className="min-w-0 flex-1 basis-60">
          <h1 className="text-2xl font-black">まず、会社のことを教えてください</h1>
          <p className="text-muted">
            AIに「どこの、どんな会社か」が伝わると、AIの検索に紹介されやすい記事になります。答えた内容から会社の情報をまとめるので、そのあとすぐに記事を書き始められます。
          </p>
        </div>
      </div>
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="flex animate-rise gap-2 rounded-2xl bg-canvas p-3" style={{ animationDelay: `${i * 0.08}s` }}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand font-black text-white">{i + 1}</span>
            <span>
              <b className="block">{s.title}</b>
              <span className="text-sm text-muted">{s.body}</span>
            </span>
          </li>
        ))}
      </ol>
      {error && <Notice tone="warn" title={error} />}
      <div className="flex flex-wrap gap-2">
        <Link href="/prototype/hearing" className="btn-primary text-lg">
          会社のことを教える
          <span className="inline-block animate-nudge" aria-hidden>
            →
          </span>
        </Link>
        <button type="button" className="btn-secondary" disabled={busy} onClick={build}>
          答え終わったら：会社の情報をまとめる
        </button>
      </div>
    </section>
  );
}
