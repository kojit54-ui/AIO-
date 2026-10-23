"use client";

import Link from "next/link";
import { PageSkeleton } from "@/components/ui";
import { GrowthCard, ProgressBar } from "@/prototype/components";
import { HEARING_QUESTIONS, answeredCount, computeGrowth } from "@/prototype/growth";
import { useGrow } from "@/prototype/store";

export default function PrototypeHome() {
  const g = useGrow();
  if (!g.ready) return <PageSkeleton />;
  const answered = answeredCount(g.answers);
  const growth = computeGrowth(g.answers, g.plan);
  const rows = g.plan?.rows ?? [];
  const published = rows.filter((r) => r.status === "published").length;
  const next = rows.find((r) => r.status === "writing") ?? rows.find((r) => r.status === "todo");

  const steps = [
    {
      no: 1,
      title: "ヒアリングに答える",
      body: "お仕事やお客様のことを、1問ずつ教えてください。箇条書きで大丈夫です。",
      status: `${answered} / ${HEARING_QUESTIONS.length} 問`,
      done: answered === HEARING_QUESTIONS.length,
      href: "/prototype/hearing",
      action: answered === HEARING_QUESTIONS.length ? "答えを見直す" : answered ? "続きに答える" : "答え始める",
      progress: { value: answered, max: HEARING_QUESTIONS.length },
    },
    {
      no: 2,
      title: "記事の設計図を選ぶ",
      body: "ヒアリングをもとに、売上や集客につながるキーワードと記事の組み立てを提案します。",
      status: g.plan ? "選びました" : "まだ",
      done: !!g.plan,
      href: "/prototype/plan",
      action: g.plan ? "設計図を見る" : "提案を見る",
    },
    {
      no: 3,
      title: "1本ずつ書いて公開する",
      body: "設計図の記事を1本ずつ書きます。公開するたびにサイトのレベルが上がります。",
      status: rows.length ? `${published} / ${rows.length} 本 公開` : "設計図を選ぶと始められます",
      done: rows.length > 0 && published === rows.length,
      href: next ? `/prototype/write/${next.id}` : "/prototype/plan",
      action: next ? `次の記事を書く：${next.keyword}` : "設計図へ",
      progress: rows.length ? { value: published, max: rows.length } : undefined,
    },
  ];

  return (
    <main className="page space-y-6">
      <GrowthCard growth={growth} />
      <section aria-labelledby="steps-heading" className="space-y-3">
        <h1 id="steps-heading" className="text-lg font-bold">
          進め方
        </h1>
        <ol className="grid gap-3 lg:grid-cols-3">
          {steps.map((s) => (
            <li key={s.no} className="card flex min-w-0 flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold">
                  {s.no}. {s.title}
                </p>
                <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-sm ${s.done ? "bg-ok-soft font-semibold text-ok" : "bg-canvas text-muted"}`}>
                  {s.done ? "完了" : s.status}
                </span>
              </div>
              <p className="flex-1 text-muted">{s.body}</p>
              {s.progress && <ProgressBar value={s.progress.value} max={s.progress.max} label={`${s.title}の進み具合`} />}
              <Link href={s.href} className={s.done ? "btn-secondary" : "btn-primary"}>
                <span className="min-w-0 truncate">{s.action}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <section className="card space-y-1" aria-labelledby="later-heading">
        <h2 id="later-heading" className="font-semibold">
          これから足すもの（第2・第3段階）
        </h2>
        <p className="text-muted">
          Google の Search Console をつなぐと、実際に検索された言葉と表示回数がここに出て、レベルにも加わります。アナリティクスとキーワードツールは第3段階でつなぎます。
        </p>
      </section>
    </main>
  );
}
