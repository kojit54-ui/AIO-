"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MFG_COLLECTED_AT, MFG_ITEMS, MFG_KIND_LABEL, mfgCounts, type MfgKind } from "@/lib/manufacturing";

const KINDS = Object.keys(MFG_KIND_LABEL) as MfgKind[];
const USE_LABEL: Record<string, string> = {
  question_example: "質問の記入例",
  article_idea: "記事の案",
  writer_hint: "AIへの指示",
  shiori_tip: "しおりのひとこと",
};

/** 全社管理者向け：製造業の知識表を見る */
export function KnowledgeBrowser() {
  const [kind, setKind] = useState<MfgKind | "all">("all");
  const [q, setQ] = useState("");
  const counts = mfgCounts();
  const list = useMemo(() => {
    const words = q.trim().split(/\s+/).filter(Boolean);
    return MFG_ITEMS.filter((x) => (kind === "all" || x.kind === kind) && words.every((w) => `${x.title}${x.summary}${x.industries.join("")}${x.source.publisher}`.includes(w)));
  }, [kind, q]);
  return (
    <main className="page max-w-4xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-black sm:text-3xl">製造業の知識表</h1>
        <nav className="flex flex-wrap gap-3 text-sm font-bold">
          <Link href="/admin/usage" className="text-brand-dark underline">
            利用金額と利用頻度
          </Link>
          <Link href="/admin/invitations" className="text-brand-dark underline">
            招待と所属
          </Link>
        </nav>
      </div>
      <section className="card space-y-2">
        <p>
          製造業の悩み・発注する人の疑問・うまくいったやり方・買い手の探し方・最近の動きを、公的機関や業界メディア、調査の公開情報から <b>{MFG_ITEMS.length}件</b> 集めました（{MFG_COLLECTED_AT} 時点）。文章は写さず、要点だけを言いかえて、出典を残しています。
        </p>
        <p className="text-sm text-muted">
          使い道：製造業の会社の記事を書くとき、AIに「読む人がよく抱く疑問」と書き方のコツとして渡します（記事の中の数字や事例としては使いません）。書く記事の提案の参考、ホームの「製造業のこぼれ話」にも使います。外したいものや、足したいサイトがあれば、担当のClaudeに伝えてください。
        </p>
      </section>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="種類">
        <Chip on={kind === "all"} onClick={() => setKind("all")}>
          すべて（{MFG_ITEMS.length}）
        </Chip>
        {KINDS.map((k) => (
          <Chip key={k} on={kind === k} onClick={() => setKind(k)}>
            {MFG_KIND_LABEL[k]}（{counts[k]}）
          </Chip>
        ))}
      </div>
      <label className="block">
        <span className="field-label text-sm">言葉でしぼる（例：板金、見積もり、AI）</span>
        <input className="field" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <p className="text-sm text-muted">{list.length}件</p>
      <ul className="space-y-3">
        {list.map((x) => (
          <li key={x.id} className="card space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-brand-dark">{MFG_KIND_LABEL[x.kind]}</span>
              {x.kind === "trend" && (
                <span className={`rounded-full px-2 py-0.5 ${x.official ? "bg-ok-soft text-ok" : "bg-warn-soft text-warn"}`}>{x.official ? "公式の発表" : "報道・見通し"}</span>
              )}
              <span className="text-muted">{x.industries.includes("all") ? "どの業種にも" : x.industries.join("・")}</span>
            </div>
            <h2 className="font-black">{x.title}</h2>
            <p className="text-sm">{x.summary}</p>
            {x.articleIdea && <p className="text-sm text-muted">💡 記事の案：{x.articleIdea}</p>}
            <p className="text-xs text-muted">
              使い道：{x.useFor.map((u) => USE_LABEL[u] ?? u).join("・")} ／ 出典：
              <a href={x.source.url} target="_blank" rel="noopener noreferrer" className="break-all underline">
                {x.source.publisher ? `${x.source.publisher}「${x.source.title}」` : x.source.title}
              </a>
              {x.source.date ? `（${x.source.date}）` : ""}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" role="tab" aria-selected={on} onClick={onClick} className={`rounded-full border-2 px-3 py-1 text-sm font-bold ${on ? "border-brand bg-brand text-white" : "border-line bg-surface"}`}>
      {children}
    </button>
  );
}
