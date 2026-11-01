"use client";

import Link from "next/link";
import { PageSkeleton } from "@/components/ui";
import { GrowthCard, ProgressBar, WhyAio } from "@/prototype/components";
import { HEARING_QUESTIONS, answeredCount, computeGrowth } from "@/prototype/growth";
import { nextKeyword, normalizeRows } from "@/prototype/keywords";
import { useGrow } from "@/prototype/store";

export default function PrototypeHome() {
  const g = useGrow();
  if (!g.ready) return <PageSkeleton />;
  const answered = answeredCount(g.answers);
  const growth = computeGrowth(g.answers, g.plan);
  const rows = normalizeRows(g.plan).filter((r) => !r.parked);
  const published = rows.filter((r) => r.status === "published").length;
  const next = nextKeyword(rows);

  const steps = [
    {
      no: 1,
      title: "会社のことを教える",
      body: "お仕事やお客様のことを、1問ずつ教えてください。箇条書きで大丈夫です。",
      status: `${answered} / ${HEARING_QUESTIONS.length} 問`,
      done: answered === HEARING_QUESTIONS.length,
      href: "/prototype/hearing",
      action: answered === HEARING_QUESTIONS.length ? "答えを見直す" : answered ? "続きに答える" : "答え始める",
      progress: { value: answered, max: HEARING_QUESTIONS.length },
    },
    {
      no: 2,
      title: "書く記事を決める",
      body: "教えてもらった内容から、売上につながりそうな記事のセットを、しおりがおすすめします。",
      status: g.plan ? "決めました" : "まだ",
      done: !!g.plan,
      href: "/prototype/plan",
      action: g.plan ? "決めた記事を見る" : "おすすめを見る",
    },
    {
      no: 3,
      title: "1本ずつ書いて公開する",
      body: "決めた記事を1本ずつ書きます。公開するたびにサイトのレベルが上がります。",
      status: rows.length ? `${published} / ${rows.length} 本 公開` : "書く記事を決めると始められます",
      done: rows.length > 0 && published === rows.length,
      href: next ? `/prototype/write/${next.id}` : rows.length ? "/prototype/keywords" : "/prototype/plan",
      action: next ? `次の記事を書く：${next.keyword}` : rows.length ? "書く記事リストへ" : "書く記事を決める",
      progress: rows.length ? { value: published, max: rows.length } : undefined,
    },
  ];

  return (
    <main className="page space-y-6">
      <GrowthCard growth={growth} />
      <WhyAio />
      <section aria-labelledby="steps-heading" className="space-y-3">
        <h1 id="steps-heading" className="text-lg font-bold">
          やること
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
          これからできるようになること
        </h2>
        <p className="text-muted">
          Google で実際にどんな言葉で探されたか、ホームページを何人が見たかが、ここに出るようになります。
        </p>
      </section>
    </main>
  );
}
