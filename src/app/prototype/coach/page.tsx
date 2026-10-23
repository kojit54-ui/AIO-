"use client";

import { useState } from "react";
import { Notice, PageSkeleton } from "@/components/ui";
import { HEARING_QUESTIONS, type HearingAnswer, answeredCount, computeGrowth } from "@/prototype/growth";
import { growActions, useGrow } from "@/prototype/store";

/** コタムの画面。顧客と話しながらヒアリングをまとめて入力でき、顧客が一問一答で答えた内容も同じ欄に出る */
export default function CoachPrototypePage() {
  const g = useGrow();
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  if (!g.ready) return <PageSkeleton />;

  const growth = computeGrowth(g.answers, g.plan);
  const rows = g.plan?.rows ?? [];
  const textOf = (id: string) => edits[id] ?? g.answers[id]?.text ?? "";

  function save() {
    for (const [id, text] of Object.entries(edits)) {
      const prev: HearingAnswer = g.answers[id] ?? { questionId: id, text: "", followUps: [] };
      growActions.saveAnswer({ ...prev, text: text.trim() });
    }
    setEdits({});
    setSaved(true);
  }

  return (
    <main className="page space-y-6">
      <section aria-labelledby="orgs-heading" className="space-y-2">
        <h1 id="orgs-heading" className="text-2xl font-bold">
          担当企業の様子
        </h1>
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[40rem] text-left">
            <thead className="bg-canvas text-sm text-muted">
              <tr>
                <th className="px-4 py-2 font-semibold">企業</th>
                <th className="px-4 py-2 font-semibold">ヒアリング</th>
                <th className="px-4 py-2 font-semibold">設計図</th>
                <th className="px-4 py-2 font-semibold">公開</th>
                <th className="px-4 py-2 font-semibold">レベル</th>
                <th className="px-4 py-2 font-semibold">検索の様子</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line">
                <td className="px-4 py-3 font-semibold">さくら住まい工房（架空）</td>
                <td className="px-4 py-3">
                  {answeredCount(g.answers)} / {HEARING_QUESTIONS.length}
                </td>
                <td className="px-4 py-3">{g.plan ? "選択済み" : "まだ"}</td>
                <td className="px-4 py-3">
                  {rows.filter((r) => r.status === "published").length} / {rows.length || "-"}
                </td>
                <td className="px-4 py-3">レベル {growth.level}</td>
                <td className="px-4 py-3 text-sm text-muted">第2段階で Search Console をつなぎます</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="hearing-heading" className="space-y-3">
        <div>
          <h2 id="hearing-heading" className="text-lg font-bold">
            ヒアリング（コタムが聞きながら入力）
          </h2>
          <p className="text-muted">顧客が一問一答で答えた内容も、ここに出ます。どちらから入力しても同じ答えになります。</p>
        </div>
        {saved && <Notice tone="ok" title="保存しました" />}
        <form
          className="card space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          {HEARING_QUESTIONS.map((q) => {
            const a = g.answers[q.id];
            return (
              <div key={q.id}>
                <label htmlFor={`h-${q.id}`} className="field-label">
                  {q.label}
                </label>
                <textarea
                  id={`h-${q.id}`}
                  className="field min-h-20"
                  placeholder={q.example}
                  value={textOf(q.id)}
                  onChange={(e) => {
                    setSaved(false);
                    setEdits({ ...edits, [q.id]: e.target.value });
                  }}
                />
                {a && a.followUps.some((f) => f.answer) && (
                  <dl className="mt-2 space-y-1 rounded-lg bg-canvas px-3 py-2 text-sm">
                    <p className="font-semibold text-muted">深掘りの質問への答え</p>
                    {a.followUps
                      .filter((f) => f.answer)
                      .map((f, i) => (
                        <div key={i}>
                          <dt className="text-muted">{f.question}</dt>
                          <dd className="whitespace-pre-wrap">{f.answer}</dd>
                        </div>
                      ))}
                  </dl>
                )}
              </div>
            );
          })}
          <button type="submit" className="btn-primary" disabled={Object.keys(edits).length === 0}>
            保存する
          </button>
        </form>
      </section>
    </main>
  );
}
