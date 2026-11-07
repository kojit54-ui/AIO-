"use client";

// 会話の記録をまるごと取り込む（ChatGPT・Claude・Gemini の書き出しファイルから。docs/DECISIONS.md 2026-11-03）。
// ファイルはこの画面の中だけで開き、会社に関係ありそうな会話に先に印を付ける。しおりに送るのは、お客様が選んだ会話の文だけ。

import { useMemo, useState } from "react";
import { type GuideStep, StepGuide } from "@/components/talk";
import { type ChatThread, SOURCE_LABEL, readChatExportFile, relevance, relevanceWords, threadsToImportText } from "@/lib/growth/chatExport";
import { GuideName } from "@/components/useGuide";

type Ai = "ChatGPT" | "Claude" | "Gemini";
const OPEN: Record<Ai, { url: string; label: string }> = {
  ChatGPT: { url: "https://chatgpt.com/#settings/DataControls", label: "ChatGPT の設定を開く" },
  Claude: { url: "https://claude.ai/settings/data-privacy-controls", label: "Claude の設定を開く" },
  Gemini: { url: "https://takeout.google.com/", label: "Google データ エクスポートを開く" },
};
/** AIごとの、ファイルを取り出す手順（開く手順のあと）。1つずつ進める */
const HOW_TO: Record<Ai, { title: string; say: string[] }[]> = {
  ChatGPT: [
    { title: "エクスポート", say: ["「データコントロール」の画面が開きましたね。", "「データをエクスポートする」の横の「エクスポート」を押して、次の窓で「エクスポートを確認」を押してください。"] },
    { title: "メール", say: ["ChatGPT から、メールが届きます。数分から、長いと1日ほどかかります。", "届いたら、メールの「データのエクスポートをダウンロード」を押して、ファイルを保存してください。"] },
  ],
  Claude: [
    { title: "エクスポート", say: ["「プライバシー」の画面が開きましたね。", "「データをエクスポート」を押してください。"] },
    { title: "メール", say: ["Claude から、メールが届きます。数分から、長いと1日ほどかかります。", "届いたら、メールのリンクを押して、ファイルを保存してください。"] },
  ],
  Gemini: [
    { title: "選び直す", say: ["Google データ エクスポートの画面が開きましたね。", "まず「選択をすべて解除」を押してから、下のほうの「マイアクティビティ」だけに印を付けてください。"] },
    { title: "Gemini だけ", say: ["「マイアクティビティ」の中の「すべてのアクティビティ データが含まれています」を押して、「Gemini アプリ」だけに印を付けます。", "「複数の形式」を押して、HTML を JSON に変えてください。"] },
    { title: "書き出す", say: ["一番下の「次のステップ」を押して、「エクスポートを作成」を押します。", "メールが届いたら、リンクからファイルを保存してください。"] },
  ],
};
/** 先に印を付ける会話の数 */
const PRESELECT = 10;

export function ChatExportImport({ hints, busy, onRead }: { hints: string[]; busy: boolean; onRead: (text: string) => void }) {
  const [threads, setThreads] = useState<(ChatThread & { score: number; on: boolean })[] | null>(null);
  const [opening, setOpening] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [ai, setAi] = useState<Ai>("ChatGPT");
  const [step, setStep] = useState(0);
  const words = useMemo(() => relevanceWords(hints), [hints]);

  async function open(file: File | undefined) {
    if (!file) return;
    setOpening(true);
    setProblem(null);
    try {
      const list = await readChatExportFile(file);
      if (!list.length) {
        setThreads(null);
        setProblem("会話が見つかりませんでした。各AIの「データのエクスポート」で届いた zip ファイルを、そのまま選んでください");
      } else {
        const scored = list.map((t) => ({ ...t, score: relevance(t, words) })).sort((a, b) => b.score - a.score || b.createdAt.localeCompare(a.createdAt));
        setThreads(scored.map((t, i) => ({ ...t, on: t.score > 0 && i < PRESELECT })));
        setStep(Number.MAX_SAFE_INTEGER);
      }
    } catch {
      setProblem("ファイルを開けませんでした。zip のまま選んでください");
    }
    setOpening(false);
  }

  const shown = (threads ?? []).filter((t) => !filter.trim() || t.title.includes(filter.trim()) || t.messages.some((m) => m.role === "user" && m.text.includes(filter.trim())));
  const chosen = (threads ?? []).filter((t) => t.on);
  const toggle = (id: string, on: boolean) => setThreads((threads ?? []).map((t) => (t.id === id ? { ...t, on } : t)));

  const fileInput = (
    <div className="space-y-2">
      <label className="btn-primary inline-flex cursor-pointer">
        {opening ? "開いています…" : "ファイルを選ぶ"}
        <input type="file" accept=".zip,.json,application/zip,application/json" className="sr-only" disabled={opening} onChange={(e) => open(e.target.files?.[0])} />
      </label>
      {problem && <p className="text-sm text-warn">{problem}</p>}
    </div>
  );
  const steps: GuideStep[] = [
    {
      title: "AIを選ぶ",
      mood: "ask",
      say: ["いちばんよく使っているAIはどれですか？", "そのAIから、これまでの会話をまとめて取り出します。"],
      body: (
        <div className="flex flex-wrap gap-2">
          {(Object.keys(OPEN) as Ai[]).map((name) => (
            <button
              key={name}
              type="button"
              className="btn-secondary"
              onClick={() => {
                setAi(name);
                setStep(1);
              }}
            >
              {name}
            </button>
          ))}
          <button type="button" className="basis-full text-left text-sm text-brand-dark underline" onClick={() => setStep(99)}>
            もうファイルを保存してある場合は、こちら
          </button>
        </div>
      ),
      next: null,
    },
    {
      title: "開く",
      mood: "point",
      say: [`${ai}ですね！`, "下のボタンで、設定の画面を開いてください。"],
      body: (
        <a href={OPEN[ai].url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          {OPEN[ai].label} ↗
        </a>
      ),
      next: "開けた！",
    },
    ...HOW_TO[ai].map((h) => ({ title: h.title, mood: "right" as const, say: h.say, next: h.title === "メール" || h.title === "書き出す" ? "保存できた！" : "できた！" })),
    {
      title: "選ぶ",
      mood: "jersey-cheer",
      say: ["最後です！保存したファイル（名前の最後が .zip）を選んでください。", "ファイルはこの画面の中だけで開きます。しおりに送るのは、あなたが選んだ会話だけですよ。"],
      body: fileInput,
      next: null,
    },
  ];

  return (
    <div className="space-y-4">
      <StepGuide
        steps={steps}
        step={threads ? Math.min(step, steps.length) : Math.min(step, steps.length - 1)}
        onStep={setStep}
        doneSay={`${threads?.length ?? 0}件の会話がありました！会社に関係ありそうなものに、先に印を付けておきましたよ。`}
      />
      {threads && (
        <div className="animate-pop space-y-3">
          <p className="text-sm font-bold">いま{chosen.length}件を選んでいます。下のボタンで、<GuideName />に読んでもらいます。</p>
          <input className="field" placeholder="例：見積もり（題名とあなたの発言から探します）" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="会話を探す" />
          <ul className="max-h-80 space-y-1 overflow-y-auto rounded-2xl bg-canvas p-2">
            {shown.slice(0, 200).map((t) => (
              <li key={t.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-surface p-2">
                  <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-brand" checked={t.on} onChange={(e) => toggle(t.id, e.target.checked)} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">{t.title}</span>
                    <span className="block text-xs text-muted">
                      {SOURCE_LABEL[t.source]}・{t.createdAt.slice(0, 10)}・発言{t.messages.filter((m) => m.role === "user").length}回{t.score > 0 ? "・関係ありそう" : ""}
                    </span>
                  </span>
                </label>
              </li>
            ))}
            {shown.length > 200 && <li className="p-2 text-xs text-muted">ほかに{shown.length - 200}件あります。上の欄で探してください。</li>}
          </ul>
          <button type="button" className="btn-primary" disabled={busy || chosen.length === 0} onClick={() => onRead(threadsToImportText(chosen))}>
            選んだ{chosen.length}件を、<GuideName />に読んでもらう
            <span className="inline-block animate-nudge" aria-hidden>
              ✨
            </span>
          </button>
          {chosen.length > 20 && <p className="text-xs text-muted">たくさん選ぶと、1つの会話から読める量が少なくなります。20件くらいまでがおすすめです。</p>}
        </div>
      )}
    </div>
  );
}
