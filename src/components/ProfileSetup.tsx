"use client";

// 会社の情報がまだ無いときの案内（docs/DECISIONS.md 2026-11-02「コタムを待たずに書き始める」）。
// コタムの登録を待たずに、お客様が「会社のことを教える」に答え、その答えからAIが会社の情報をまとめる。
// 手順は1つずつ進める（2026-11-02 田村さん）。答え終わっていれば、2つめから始める。

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type GuideStep, StepGuide } from "@/components/talk";
import { GeneratingOverlay, Notice } from "@/components/ui";
import { localHearing } from "@/lib/growth/localKnowledge";
import { ApiError, useStore } from "@/mock/store";
import { canPropose } from "@/prototype/growth";

export function ProfileSetup({ orgId }: { orgId: string }) {
  const { db, api } = useStore();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const answered = canPropose(db.hearing ?? localHearing());
  const [step, setStep] = useState(answered ? 1 : 0);

  async function build() {
    setBusy(true);
    setError(null);
    try {
      await api.buildProfileFromHearing(orgId);
      setStep(2);
      router.push("/profile");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "会社の情報をまとめられませんでした。もう一度お試しください");
      setBusy(false);
    }
  }

  const steps: GuideStep[] = [
    {
      title: "会社のことを教える",
      mood: "bow",
      say: ["はじめまして、しおりです！", "AIに「どこの、どんな会社か」が伝わると、AIの検索に紹介されやすい記事になります。", "まず、しおりの質問に答えてください。答えるたびに、理由を添えてくわしく聞き返しますね。"],
      body: (
        <Link href="/prototype/hearing" className="btn-primary text-lg">
          会社のことを教える
          <span className="inline-block animate-nudge" aria-hidden>
            →
          </span>
        </Link>
      ),
      next: answered ? "答え終わった！" : null,
    },
    {
      title: "まとめる",
      mood: "jersey-cheer",
      say: ["答えてくれて、ありがとうございます！", "答えから、記事づくりに使う会社の情報を、しおりがまとめますね。下のボタンを押してください。"],
      body: (
        <div className="space-y-2">
          {error && <Notice tone="warn" title={error} />}
          <button type="button" className="btn-primary" disabled={busy} onClick={build}>
            会社の情報をまとめる ✨
          </button>
        </div>
      ),
      next: null,
    },
    { title: "確かめる", mood: "point", say: "まとめた内容を読んで、問題なければ「この内容で問題ありません」を押してください。", next: null },
  ];

  return (
    <section className="card animate-rise space-y-4">
      {busy && <GeneratingOverlay label="会社の情報をまとめています" />}
      <h1 className="text-2xl font-black">まず、会社のことを教えてください</h1>
      <StepGuide steps={steps} step={step} onStep={setStep} />
      {!answered && step === 0 && <p className="text-xs text-muted">答え終わると、ここに「答え終わった！」のボタンが出ます。</p>}
    </section>
  );
}
