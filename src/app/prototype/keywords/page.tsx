"use client";

import Link from "next/link";
import { useState } from "react";
import { Confetti, Shiori, Toast, useFlash } from "@/components/fun";
import { Notice, PageSkeleton } from "@/components/ui";
import { KIND_LABEL, REASON_LABEL, type RowStatus, SAMPLE_LABEL, computeGrowth } from "@/prototype/growth";
import {
  LIST_STATUS_LABEL,
  PRIORITY_LABEL,
  SOURCE_LABEL,
  MAX_KEYWORD,
  countByStatus,
  cycleStatus,
  groupByPillar,
  newKeywordRow,
  nextKeyword,
  normalizeRows,
  sellItemOf,
  sellItemsFromAnswer,
  shioriMessage,
  sortByRecommendation,
  toggleDone,
  type SellItem,
} from "@/prototype/keywords";
import { SellRanking } from "@/prototype/SellRanking";
import { growActions, useGrow } from "@/prototype/store";

type Filter = RowStatus | "all";
type Row = ReturnType<typeof normalizeRows>[number];

const STATUS_PILL: Record<RowStatus, string> = {
  todo: "border-line bg-surface text-muted",
  writing: "border-brand bg-brand-soft text-brand-dark",
  published: "border-ok-bright bg-ok-bright text-white",
};

/** 全体の進み具合の輪っか */
function Ring({ done, total }: { done: number; total: number }) {
  const r = 46;
  const len = 2 * Math.PI * r;
  return (
    <div className="relative h-28 w-28 shrink-0" role="img" aria-label={`${total}本のうち${done}本やった`}>
      <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="55" cy="55" r={r} fill="none" stroke="var(--color-line)" strokeWidth="12" />
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="var(--color-ok-bright)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={total ? len * (1 - done / total) : len}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <p className="absolute inset-0 grid place-items-center text-center leading-tight" aria-hidden>
        <span>
          <b className="text-2xl">
            {done}/{total}
          </b>
          <span className="block text-xs text-muted">やった</span>
        </span>
      </p>
    </div>
  );
}

function Stars({ n }: { n: 1 | 2 | 3 }) {
  return (
    <span className="whitespace-nowrap text-sun-dark" title={PRIORITY_LABEL[n]}>
      <span aria-hidden>
        {"★".repeat(n)}
        <span className="text-line">{"★".repeat(3 - n)}</span>
      </span>
      <span className="sr-only">{PRIORITY_LABEL[n]}</span>
    </span>
  );
}

export default function KeywordsPage() {
  const g = useGrow();
  const [filter, setFilter] = useState<Filter>("all");
  const [order, setOrder] = useState<"pillar" | "recommend">("recommend");
  const [draft, setDraft] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [showParked, setShowParked] = useState(false);
  const [flash, fire] = useFlash();
  const [cheer, setCheer] = useState("");
  const [party, setParty] = useState(false);
  const [sellFor, setSellFor] = useState("");
  if (!g.ready) return <PageSkeleton />;

  if (!g.plan) {
    return (
      <main className="page max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold">書く記事リスト</h1>
        <Notice tone="info" title="先に書く記事を決めてください">
          書く記事を決めると、ここに並びます。やった・まだを見ながら、1本ずつ進められます。
        </Notice>
        <Link href="/prototype/plan" className="btn-primary">
          書く記事を決める
        </Link>
      </main>
    );
  }

  const plan = g.plan;
  const rows = normalizeRows(plan);
  const counts = countByStatus(rows);
  const sellItems = g.sellItems ?? sellItemsFromAnswer(g.answers.services?.text ?? "");
  const next = nextKeyword(rows, sellItems);
  const nextSell = next ? sellItemOf(next, sellItems) : null;
  const parked = rows.filter((r) => r.parked);
  const visible = (list: Row[]) => list.filter((r) => filter === "all" || r.status === filter);
  const groups = groupByPillar(rows);
  const pillarIdForNew = groups[0]?.pillar?.id ?? rows[0]?.pillarId ?? "";

  function changeStatus(r: Row, status: RowStatus) {
    const before = computeGrowth(g.answers, plan).level;
    growActions.setRowStatus(r.id, status);
    if (status !== "published") return;
    const after = computeGrowth(g.answers, { ...plan, rows: plan.rows.map((x) => (x.id === r.id ? { ...x, status } : x)) });
    setParty(true);
    setCheer(after.level > before ? `「${r.keyword}」やったね！サイトがレベル ${after.level}「${after.name}」に上がったよ` : `「${r.keyword}」やったね！`);
    fire();
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    const row = newKeywordRow(plan.rows, draft, pillarIdForNew, "customer", sellFor || null);
    if (!row) {
      setAddError(!draft.trim() ? "書きたいことを入れてください。" : draft.trim().length > MAX_KEYWORD ? `${MAX_KEYWORD}字までの短い言葉にしてください。` : "その記事は、もうリストにあります。");
      return;
    }
    // 答えから作った売りたいもの（まだ保存していない）を選んだときは、先に保存して記事との札を残す
    if (sellFor && g.sellItems === null) growActions.setSellItems(sellItems);
    growActions.addRow(row);
    setDraft("");
    setAddError(null);
  }

  function moved(top: SellItem) {
    setParty(false);
    setCheer(`1位は「${top.name}」。おすすめ順を入れかえたよ`);
    fire();
  }

  const row = (r: Row, i: number) => (
    <li
      key={r.id}
      className={`flex animate-rise flex-wrap items-center gap-3 rounded-2xl border px-3 py-3 transition-colors duration-300 sm:flex-nowrap ${
        r.status === "published" ? "border-ok-soft bg-ok-soft" : "border-line bg-surface"
      }`}
      style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
    >
      <button
        type="button"
        onClick={() => changeStatus(r, toggleDone(r.status))}
        aria-pressed={r.status === "published"}
        aria-label={`${r.keyword}を${r.status === "published" ? "まだに戻す" : "やったにする"}`}
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border-[3px] text-xl font-black text-white transition-all ${
          r.status === "published"
            ? "animate-pop border-ok-bright bg-ok-bright"
            : r.status === "writing"
              ? "border-brand bg-surface hover:bg-brand-soft"
              : "border-line bg-surface hover:border-ok-bright"
        }`}
      >
        {r.status === "published" ? "✓" : ""}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`font-bold ${r.status === "published" ? "text-ok" : ""}`}>{r.keyword}</p>
        {r.question && <p className="text-sm text-muted">お客様が知りたいこと：{r.question}</p>}
        <ul className="mt-1 flex flex-wrap gap-1 text-xs" aria-label="この記事について">
          <li className={`rounded px-1.5 py-0.5 ${r.kind === "pillar" ? "bg-sun font-bold text-ink" : "bg-canvas text-muted"}`}>
            {KIND_LABEL[r.kind]}
          </li>
          {r.reasons.map((x) => (
            <li key={x} className="rounded bg-brand-soft px-1.5 py-0.5 text-brand-dark">
              {REASON_LABEL[x]}
            </li>
          ))}
          {(() => {
            const sell = sellItemOf(r, sellItems);
            return sell ? (
              <li className="rounded bg-sun-soft px-1.5 py-0.5 font-bold text-warn">
                売りたい {sell.rank + 1}位：{sell.item.name}
              </li>
            ) : null;
          })()}
          <li className="rounded border border-dashed border-line px-1.5 py-0.5 text-muted">{SOURCE_LABEL[r.source]}</li>
        </ul>
      </div>
      <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 pl-14 sm:w-auto sm:flex-col sm:flex-nowrap sm:items-end sm:pl-0">
        <Stars n={r.priority} />
        <span className="whitespace-nowrap text-xs text-muted">月の検索回数 {r.monthlySearches === null ? "—" : r.monthlySearches.toLocaleString()}</span>
        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <button
            type="button"
            onClick={() => changeStatus(r, cycleStatus(r.status))}
            className={`whitespace-nowrap rounded-full border px-3 py-0.5 text-sm font-semibold ${STATUS_PILL[r.status]}`}
            aria-label={`${r.keyword}の状態：${LIST_STATUS_LABEL[r.status]}（押すと次の状態へ）`}
          >
            {LIST_STATUS_LABEL[r.status]}
          </button>
          {r.status !== "published" && (
            <button type="button" className="whitespace-nowrap px-1 text-xs text-muted underline" onClick={() => growActions.setRowParked(r.id, true)}>
              やめておく
            </button>
          )}
        </div>
      </div>
    </li>
  );

  const FILTERS: Filter[] = ["all", "todo", "writing", "published"];

  return (
    <main className="page space-y-5">
      {flash > 0 && (
        <>
          {party && <Confetti key={`c${flash}`} />}
          <Toast key={`t${flash}`}>{cheer}</Toast>
        </>
      )}

      <h1 className="sr-only">書く記事リスト</h1>
      <section className="card flex animate-rise flex-wrap items-center gap-4" aria-label="しおりから">
        <Shiori mood={counts.all > 0 && counts.published === counts.all ? "welldone" : counts.published > 0 ? "cheer" : "point"} className="h-28 w-auto animate-float sm:h-32" />
        <p className="relative min-w-[12rem] flex-1 rounded-2xl bg-sun-soft px-4 py-3 font-bold" role="status">
          {shioriMessage(rows, sellItems)}
        </p>
        <Ring done={counts.published} total={counts.all} />
      </section>

      {next && (
        <section className="flex animate-rise flex-wrap items-center gap-3 rounded-2xl border-2 border-brand bg-gradient-to-r from-brand-soft to-surface p-4" aria-labelledby="next-heading">
          <div className="min-w-0 flex-1">
            <h2 id="next-heading" className="text-sm text-muted">
              しおりのおすすめ：次に書くならこれ
            </h2>
            <p className="text-xl font-bold">{next.keyword}</p>
            {next.question && <p className="text-sm text-muted">お客様が知りたいこと：{next.question}</p>}
            {nextSell && <p className="text-sm font-bold text-warn">今売りたい {nextSell.rank + 1}位「{nextSell.item.name}」の記事です</p>}
          </div>
          <Link href={`/prototype/write/${next.id}`} className="btn-primary">
            {next.status === "writing" ? "続きを書く" : "この記事を書く"}
          </Link>
        </section>
      )}

      <section className="card space-y-2" aria-labelledby="sell-heading">
        <h2 id="sell-heading" className="font-bold">
          今売りたいものの順番を決める
        </h2>
        <p className="text-sm text-muted">上にあるものほど、関係する記事がおすすめの上に来ます。つまみ（⠿）をドラッグするか、▲▼で入れかえてください。季節や忙しさに合わせて、いつでも変えられます。</p>
        <SellRanking items={sellItems} onChange={(items) => growActions.setSellItems(items)} onMoved={moved} />
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="絞り込み">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-sm ${filter === f ? "border-brand bg-brand font-semibold text-white" : "border-line bg-surface"}`}
            >
              {f === "all" ? "すべて" : LIST_STATUS_LABEL[f]} {counts[f]}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1.5" role="group" aria-label="並べ方">
          {(["recommend", "pillar"] as const).map((o) => (
            <button
              key={o}
              type="button"
              aria-pressed={order === o}
              onClick={() => setOrder(o)}
              className={`rounded-full border px-3 py-1 text-sm ${order === o ? "border-brand bg-brand font-semibold text-white" : "border-line bg-surface"}`}
            >
              {o === "pillar" ? "テーマごと" : "おすすめ順"}
            </button>
          ))}
        </div>
      </div>

      {order === "pillar" ? (
        groups.map((gr, gi) => {
          const list = visible(gr.rows);
          return (
            <section key={gr.pillar?.id ?? gi} className="card space-y-3" aria-label={`テーマ ${gi + 1}：${gr.pillar?.keyword ?? ""}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-muted">テーマ {gi + 1}</p>
                  <h2 className="text-lg font-bold">{gr.pillar?.keyword ?? "そのほか"}</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  {gr.done}/{gr.rows.length}本
                  <span className="h-2 w-32 overflow-hidden rounded-full bg-line" aria-hidden>
                    <span className="block h-full bg-ok-bright transition-[width] duration-700" style={{ width: `${(gr.done / gr.rows.length) * 100}%` }} />
                  </span>
                </div>
              </div>
              {list.length ? <ul className="grid gap-2">{list.map(row)}</ul> : <p className="text-sm text-muted">ここに入る記事はありません。</p>}
            </section>
          );
        })
      ) : (
        <section className="card" aria-label="おすすめ順">
          {visible(sortByRecommendation(rows.filter((r) => !r.parked), sellItems)).length ? (
            <ul className="grid gap-2">{visible(sortByRecommendation(rows.filter((r) => !r.parked), sellItems)).map(row)}</ul>
          ) : (
            <p className="text-sm text-muted">ここに入る記事はありません。</p>
          )}
        </section>
      )}

      <section className="card space-y-2" aria-labelledby="add-heading">
        <h2 id="add-heading" className="font-bold">
          書きたい記事を足す
        </h2>
        <p className="text-sm text-muted">思いついたことや、お客様によく聞かれることを、短い言葉で足せます。足したものは「しおりのおすすめ度 中」で入ります。</p>
        <form onSubmit={add} className="flex flex-wrap gap-2">
          <label htmlFor="new-keyword" className="sr-only">
            足す記事
          </label>
          <input
            id="new-keyword"
            className="field min-w-[12rem] flex-1"
            placeholder="例：内窓 結露"
            value={draft}
            maxLength={MAX_KEYWORD}
            onChange={(e) => setDraft(e.target.value)}
            aria-invalid={!!addError}
            aria-describedby={addError ? "add-error" : undefined}
          />
          {sellItems.length > 0 && (
            <>
              <label htmlFor="new-keyword-sell" className="sr-only">
                どの売りたいものの記事か
              </label>
              <select id="new-keyword-sell" className="field w-auto" value={sellFor} onChange={(e) => setSellFor(e.target.value)}>
                <option value="">売りたいもの：おまかせ</option>
                {sellItems.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>
            </>
          )}
          <button type="submit" className="btn-primary">
            足す
          </button>
        </form>
        {addError && (
          <p id="add-error" className="text-sm text-danger">
            {addError}
          </p>
        )}
      </section>

      {parked.length > 0 && (
        <section className="space-y-2">
          <button type="button" className="text-sm text-muted underline" aria-expanded={showParked} onClick={() => setShowParked(!showParked)}>
            やめておいた記事（{parked.length}）を{showParked ? "閉じる" : "見る"}
          </button>
          {showParked && (
            <ul className="grid gap-2">
              {parked.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-line bg-surface px-3 py-2">
                  <span className="text-muted">{r.keyword}</span>
                  <button type="button" className="btn-secondary min-h-9 px-3 py-1 text-sm" onClick={() => growActions.setRowParked(r.id, false)}>
                    リストに戻す
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <p className="text-sm text-muted">
        記事としおりのおすすめ度は{SAMPLE_LABEL}。おすすめ順は、しおりのおすすめ度（★）と、今売りたいものの順番を合わせて決めます。月の検索回数は、検索の数を調べる道具（SEMrush など）をつなぐと入ります。それまでは数字を作らず「—」と出します。
      </p>
    </main>
  );
}
