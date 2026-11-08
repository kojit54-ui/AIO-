import Link from "next/link";
import { HEARING_QUESTIONS } from "@/prototype/growth";
import { needsCall, orgNudges, PACE_LABEL, type OrgPace, type UsageSummary } from "@/lib/admin/usage";

const yen = (n: number) => `${Math.round(n).toLocaleString()} 円`;
const date = (s: string) => new Date(s).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric", day: "numeric" });

const PACE_STYLE: Record<OrgPace, string> = {
  sleeping: "bg-danger-soft text-danger",
  never: "bg-warn-soft text-warn",
  slow: "bg-canvas-deep text-ink",
  active: "bg-ok-soft text-ok",
};

/** 全社管理者の「利用金額と利用頻度」。数字だけを見せ、記事の本文や入力は出さない */
export function UsageView({ s, sample }: { s: UsageSummary; sample?: boolean }) {
  const pct = Math.round(s.budgetRatio * 100);
  const peak = Math.max(1, ...s.perDay.map((d) => d.orgs));
  const total = HEARING_QUESTIONS.length;
  const waiting = s.orgs.filter((o) => needsCall(o, total));
  // 声をかけたい会社を上に（それ以外の並びは元のまま）
  const orgs = [...waiting, ...s.orgs.filter((o) => !needsCall(o, total))];
  return (
    <main className="page max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-black sm:text-3xl">利用金額と利用頻度</h1>
      </div>

      {sample && (
        <p className="rounded-2xl border-2 border-dashed border-warn bg-warn-soft text-warn px-4 py-3 text-sm font-bold">
          見本の表示です。会社名も数字も架空です。
        </p>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label={`${s.monthLabel}のAIの費用`} value={yen(s.costThisMonth)} note={`${s.lastMonthLabel}は ${yen(s.costLastMonth)}`} />
        <Stat label="30秒でためすの費用" value={yen(s.trialCostThisMonth)} note="ログインなしのお試し。別の予算" />
        <Stat
          label="声をかけたい会社"
          value={`${waiting.length} 社`}
          note={waiting.length ? "使っていない・始めていない・途中で止まっている" : "みなさん順調です"}
        />
      </section>

      <section className="card space-y-2">
        <h2 className="font-black">今月の予算の使い方</h2>
        <div className="h-4 overflow-hidden rounded-full bg-canvas-deep" role="img" aria-label={`${pct}%`}>
          <div className={`h-full rounded-full ${s.budgetRatio >= 0.8 ? "bg-danger" : "bg-brand"}`} style={{ width: `${s.budgetRatio * 100}%` }} />
        </div>
        <p className="text-sm text-muted">
          月の予算 {yen(s.budgetYen)} のうち {pct}% を使いました。上限に着くと、その月はAIで作れなくなります。
          {s.failedThisMonth > 0 && ` 今月、AIで作れなかった回が ${s.failedThisMonth} 回ありました。`}
        </p>
      </section>

      <section className="card space-y-3">
        <h2 className="font-black">会社ごと</h2>
        {s.orgs.length === 0 ? (
          <p className="text-muted">まだ会社がありません。</p>
        ) : (
          <ul className="space-y-3">
            {orgs.map((o) => (
              <li key={o.id} className={`rounded-2xl border bg-surface p-3 ${needsCall(o, total) ? "border-warn" : "border-line"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-lg font-black">{o.name}</p>
                  {/* 使う回数は多くても途中で止まっている会社は、緑の印より「声をかけたい」を先に見せる */}
                  <span className="flex flex-wrap items-center gap-1.5">
                    {needsCall(o, total) && <span className="rounded-full bg-warn px-3 py-1 text-xs font-bold text-white">声をかけたい</span>}
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${needsCall(o, total) && (o.pace === "active" || o.pace === "slow") ? "bg-canvas text-muted" : PACE_STYLE[o.pace]}`}>
                      {needsCall(o, total) && (o.pace === "active" || o.pace === "slow") ? `使う回数：${PACE_LABEL[o.pace]}` : PACE_LABEL[o.pace]}
                    </span>
                  </span>
                </div>
                {orgNudges(o, total).length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="声をかけたいわけ">
                    {orgNudges(o, total).map((n) => (
                      <li key={n} className="rounded-full bg-warn-soft px-3 py-1 text-xs font-bold text-warn">
                        {n}
                      </li>
                    ))}
                  </ul>
                )}
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4">
                  <Item label="最後に使った日" value={o.lastActiveAt ? `${date(o.lastActiveAt)}（${o.daysSinceActive === 0 ? "今日" : `${o.daysSinceActive}日前`}）` : "—"} />
                  <Item label="使った日数" value={`7日で${o.activeDays7}日／30日で${o.activeDays30}日`} />
                  <Item label={`${s.monthLabel}の費用`} value={`${yen(o.costThisMonth)}（${o.aiRunsThisMonth}回）`} />
                  <Item label={`${s.lastMonthLabel}の費用`} value={yen(o.costLastMonth)} />
                  <Item label="会社のこと" value={`${Math.min(o.answered, total)} / ${total} 問`} />
                  <Item label="記事" value={`${o.articles} 本（載せた ${o.published} 本）`} />
                </dl>
                {!sample && (
                  <Link href={`/coach/orgs/${o.id}`} className="mt-2 inline-block text-sm font-bold text-brand-dark underline">
                    この会社の記事とやり取りを見る →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card space-y-3">
          <h2 className="font-black">この2週間、使った会社の数</h2>
          <ol className="flex h-32 items-end gap-1" aria-label="日ごとの会社の数">
            {s.perDay.map((x) => (
              <li key={x.day} className="flex flex-1 flex-col items-center gap-1" title={`${x.day}：${x.orgs}社`}>
                <span className="text-[10px] font-bold text-muted">{x.orgs || ""}</span>
                <span className="w-full rounded-t-md bg-brand" style={{ height: `${(x.orgs / peak) * 88}px`, minHeight: x.orgs ? 3 : 0 }} />
                <span className="text-[10px] text-muted">{Number(x.day.slice(8))}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="card space-y-2">
          <h2 className="font-black">{s.monthLabel}の費用の内訳</h2>
          {s.byKind.length === 0 ? (
            <p className="text-muted">まだありません。</p>
          ) : (
            <ul className="space-y-1">
              {s.byKind.map((k) => (
                <li key={k.kind} className="flex justify-between gap-2 rounded-xl bg-canvas px-3 py-1">
                  <span>{k.label}</span>
                  <b className="whitespace-nowrap">
                    {yen(k.cost)}（{k.runs}回）
                  </b>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <p className="text-xs text-muted">
        費用はAIの提供元の料金から出した目安です。「使った日」は顧客担当者がログインした日、質問に答えた日、記事を作った日、AIを使った日です。記事の本文や答えの中身はこの画面に出しません。
      </p>
    </main>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="card">
      <p className="text-sm font-bold text-muted">{label}</p>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs text-muted">{note}</p>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}
