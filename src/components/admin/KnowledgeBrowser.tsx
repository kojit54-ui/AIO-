"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  MFG_COLLECTED_AT,
  MFG_DOMESTIC,
  MFG_KIND_LABEL,
  MFG_OVERSEAS,
  mfgCounts,
  type MfgItem,
  type MfgKind,
} from "@/lib/manufacturing";

const PAGE = 100;
const KINDS = Object.keys(MFG_KIND_LABEL) as MfgKind[];
const USE_LABEL: Record<string, string> = {
  question_example: "質問の記入例",
  article_idea: "記事の案",
  writer_hint: "AIへの指示",
  shiori_tip: "しおりのひとこと",
};

/** 業種の名前と件数（多い順）。「どの業種にも」は業種でしぼらないときに出る */
function industriesOf(items: MfgItem[]): [string, number][] {
  const m = new Map<string, number>();
  for (const x of items)
    for (const i of x.industries)
      if (i !== "all") m.set(i, (m.get(i) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
const DOMESTIC_INDUSTRIES = industriesOf(MFG_DOMESTIC);
const OVERSEAS_INDUSTRIES = industriesOf(MFG_OVERSEAS);

/** 全社管理者向け：製造業の知識表を見る */
export function KnowledgeBrowser() {
  const [region, setRegion] = useState<"domestic" | "overseas">("domestic");
  const [kind, setKind] = useState<MfgKind | "all">("all");
  const [q, setQ] = useState("");
  const [ind, setInd] = useState("");
  const [shown, setShown] = useState(PAGE);
  const base = region === "overseas" ? MFG_OVERSEAS : MFG_DOMESTIC;
  const INDUSTRIES = region === "overseas" ? OVERSEAS_INDUSTRIES : DOMESTIC_INDUSTRIES;
  const counts = mfgCounts(base);
  const list = useMemo(() => {
    const words = q.trim().split(/\s+/).filter(Boolean);
    return base.filter(
      (x) =>
        (kind === "all" || x.kind === kind) &&
        (!ind || x.industries.includes(ind)) &&
        words.every((w) =>
          `${x.title}${x.summary}${x.industries.join("")}${x.source.publisher}`.includes(
            w,
          ),
        ),
    );
  }, [base, kind, q, ind]);
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
          製造業の悩み・発注する人の疑問・うまくいったやり方・買い手の探し方・最近の動き・つまずく言葉のやさしい説明を、公的機関や業界メディア、調査の公開情報から{" "}
          <b>国内 {MFG_DOMESTIC.length.toLocaleString()}件</b>（{DOMESTIC_INDUSTRIES.length}の業種）と、
          <b>海外 {MFG_OVERSEAS.length.toLocaleString()}件</b> 集めました（{MFG_COLLECTED_AT}{" "}
          時点）。文章は写さず、要点だけを言いかえて、出典を残しています。
        </p>
        <p className="text-sm text-muted">
          海外のものは、日本と前提（発注の仕方・法律・値段・数字）が違うので分けています。読む人の疑問・しおりのこぼれ話・記事を書くAIへの指示には使いません。
        </p>
        <p className="text-sm text-muted">
          使い道：製造業の会社の記事を書くとき、AIに「読む人がよく抱く疑問」「つまずきやすい言葉」と書き方のコツとして渡します（記事の中の数字や事例としては使いません）。書く記事の提案の参考、ホームの「製造業のこぼれ話」にも使います。外したいものや、足したいサイトがあれば、担当のClaudeに伝えてください。
        </p>
      </section>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="国内と海外">
        {(["domestic", "overseas"] as const).map((r) => (
          <Chip
            key={r}
            on={region === r}
            onClick={() => {
              setRegion(r);
              setKind("all");
              setInd("");
              setShown(PAGE);
            }}
          >
            {r === "domestic" ? "国内" : "海外"}（{(r === "domestic" ? MFG_DOMESTIC : MFG_OVERSEAS).length.toLocaleString()}）
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="種類">
        <Chip
          on={kind === "all"}
          onClick={() => {
            setKind("all");
            setShown(PAGE);
          }}
        >
          すべて（{base.length}）
        </Chip>
        {KINDS.map((k) => (
          <Chip
            key={k}
            on={kind === k}
            onClick={() => {
              setKind(k);
              setShown(PAGE);
            }}
          >
            {MFG_KIND_LABEL[k]}（{counts[k]}）
          </Chip>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <label className="block">
          <span className="field-label text-sm">
            言葉でしぼる（例：見積もり、公差、AI）
          </span>
          <input
            className="field"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setShown(PAGE);
            }}
          />
        </label>
        <label className="block">
          <span className="field-label text-sm">業種でしぼる</span>
          <select
            className="field"
            value={ind}
            onChange={(e) => {
              setInd(e.target.value);
              setShown(PAGE);
            }}
          >
            <option value="">すべての業種</option>
            {INDUSTRIES.map(([name, n]) => (
              <option key={name} value={name}>
                {name}（{n}）
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="text-sm text-muted">{list.length}件</p>
      <ul className="space-y-3">
        {list.slice(0, shown).map((x) => (
          <li key={x.id} className="card space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-brand-dark">
                {MFG_KIND_LABEL[x.kind]}
              </span>
              {x.region === "overseas" && (
                <span className="rounded-full bg-warn-soft px-2 py-0.5 text-warn">
                  海外
                </span>
              )}
              {x.kind === "trend" && (
                <span
                  className={`rounded-full px-2 py-0.5 ${x.official ? "bg-ok-soft text-ok" : "bg-warn-soft text-warn"}`}
                >
                  {x.official ? "公式の発表" : "報道・見通し"}
                </span>
              )}
              <span className="text-muted">
                {x.industries.includes("all")
                  ? "どの業種にも"
                  : x.industries.join("・")}
              </span>
            </div>
            <h2 className="font-black">{x.title}</h2>
            <p className="text-sm">{x.summary}</p>
            {x.articleIdea && (
              <p className="text-sm text-muted">💡 記事の案：{x.articleIdea}</p>
            )}
            <p className="text-xs text-muted">
              使い道：{x.useFor.map((u) => USE_LABEL[u] ?? u).join("・")} ／
              出典：
              <a
                href={x.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all underline"
              >
                {x.source.publisher
                  ? `${x.source.publisher}「${x.source.title}」`
                  : x.source.title}
              </a>
              {x.source.date ? `（${x.source.date}）` : ""}
            </p>
          </li>
        ))}
      </ul>
      {list.length > shown && (
        <button
          type="button"
          className="btn-secondary w-full"
          onClick={() => setShown((n) => n + PAGE)}
        >
          もっと見る（あと {list.length - shown}件）
        </button>
      )}
    </main>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={on}
      onClick={onClick}
      className={`rounded-full border-2 px-3 py-1 text-sm font-bold ${on ? "border-brand bg-brand text-white" : "border-line bg-surface"}`}
    >
      {children}
    </button>
  );
}
