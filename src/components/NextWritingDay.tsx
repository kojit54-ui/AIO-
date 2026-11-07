"use client";

// 「次に書く日」を自分で決める（2026-11-07 3AIの検討 D）。決めた日の朝9時に、メールで知らせる。
// 人は「いつやるか」を自分で決めると続けやすい。押すのは日にちの札だけで、考えこませない。

import { useState } from "react";
import { useGuideText } from "@/components/useGuide";
import { useStore } from "@/mock/store";
import { DAY_CHOICES, addDays, dayLabel, daysUntil, planState, todayJst } from "@/lib/writingDay";

export function NextWritingDay({ orgId, nowMs }: { orgId: string; nowMs: number }) {
  const { db, api, mode } = useStore();
  const g = useGuideText();
  const today = todayJst(new Date(nowMs));
  const planned = db.nextWritingDay ?? null;
  const state = planState(planned, today);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSet, setJustSet] = useState(false);

  const save = async (day: string | null) => {
    setBusy(true);
    setError(null);
    try {
      await api.setNextWritingDay(orgId, day);
      setEditing(false);
      setJustSet(day !== null);
    } catch {
      setError("保存できませんでした。少し待ってからもう一度お試しください");
    } finally {
      setBusy(false);
    }
  };

  const mailNote = mode === "mock" ? "（試作なので、メールは送りません）" : "";
  const choosing = editing || state === "none" || state === "past";

  return (
    <section aria-labelledby="writing-day-heading" className="card animate-rise space-y-3">
      {choosing ? (
        <>
          <h2 id="writing-day-heading" className="flex items-center gap-2 text-base font-black">
            <span aria-hidden className="text-xl">📅</span>
            {state === "past" && !editing ? "決めていた日は過ぎました。次の日を決めましょう" : "次に書く日を、決めておきませんか？"}
          </h2>
          <p className="text-sm text-muted">
            {g("決めた日の朝9時に、しおりがメールでお知らせします。")}
            {mailNote}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DAY_CHOICES.map((c) => {
              const day = addDays(today, c.days);
              return (
                <button key={c.days} type="button" disabled={busy} onClick={() => save(day)} className="btn-secondary min-h-14 flex-col gap-0 px-2 py-2 leading-tight">
                  <span className="text-base font-black">{c.label}</span>
                  <span className="text-xs font-semibold text-muted">{dayLabel(day)}</span>
                </button>
              );
            })}
          </div>
          {editing && (
            <p className="flex flex-wrap gap-x-5 text-sm">
              <button type="button" className="font-semibold text-muted underline" onClick={() => setEditing(false)}>
                変えずにもどる
              </button>
              <button type="button" disabled={busy} className="font-semibold text-muted underline" onClick={() => save(null)}>
                書く日を取り消す
              </button>
            </p>
          )}
        </>
      ) : (
        <>
          <h2 id="writing-day-heading" className="flex flex-wrap items-center gap-x-2 text-base font-black">
            <span aria-hidden className="text-xl">📅</span>
            {state === "today" ? "今日は、決めていた「書く日」です！" : <>次に書く日：{dayLabel(planned!)}</>}
            {state === "upcoming" && <span className="rounded-full bg-sun-soft px-2 text-sm font-bold">あと{daysUntil(planned!, today)}日</span>}
          </h2>
          <p className="text-sm" role={justSet ? "status" : undefined}>
            {state === "today"
              ? "上のボタンから、今日は1問だけ答えましょう。5分で大丈夫です。"
              : justSet
                ? `決めましたね。自分で決めた日は、続けやすくなります。その日の朝9時に、メールでお知らせします。${mailNote}`
                : `その日の朝9時に、メールでお知らせします。${mailNote}`}
          </p>
          <p className="text-sm">
            <button type="button" className="font-semibold text-muted underline" onClick={() => setEditing(true)}>
              {state === "today" ? "次に書く日を決める" : "日を変える"}
            </button>
          </p>
        </>
      )}
      {error && <p className="text-sm font-bold text-danger">{error}</p>}
    </section>
  );
}
