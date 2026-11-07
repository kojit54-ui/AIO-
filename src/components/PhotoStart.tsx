"use client";

// 写真1枚から記事を始める（2026-11-07 3AIの検討）。スマホで撮った現場の写真を選ぶと、AIが書けるテーマを3つ出す。
// 写真はこの画面で小さくしてから送り、保存しない。試作（架空データ）では見本を出す。

import { useState } from "react";
import { ShioriTalk } from "@/components/talk";
import { VoiceInput } from "@/components/VoiceInput";
import { useGuideText } from "@/components/useGuide";
import type { PhotoTheme } from "@/lib/ai/growthPrompts";
import { SAMPLE_PHOTO_THEMES, fitSize } from "@/lib/photoStart";
import { useStore } from "@/mock/store";

type Picked = { url: string; data: string };

/** 写真を長い辺1280pxのJPEGにして、base64で返す */
async function shrink(file: File): Promise<Picked> {
  const bitmap = await createImageBitmap(file);
  const { w, h } = fitSize(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const url = canvas.toDataURL("image/jpeg", 0.82);
  return { url, data: url.slice(url.indexOf(",") + 1) };
}

export function PhotoStart({ orgId, busy, onPick }: { orgId: string; busy: boolean; onPick: (t: PhotoTheme) => void }) {
  const { mode } = useStore();
  const g = useGuideText();
  const [photo, setPhoto] = useState<Picked | null>(null);
  const [memo, setMemo] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ seen: string; themes: PhotoTheme[]; sample: boolean } | null>(null);

  async function choose(file: File | undefined) {
    if (!file) return;
    setError(null);
    setResult(null);
    try {
      setPhoto(await shrink(file));
    } catch {
      setError("この写真は開けませんでした。別の写真を選んでください");
    }
  }

  async function ask() {
    if (!photo) return;
    setThinking(true);
    setError(null);
    try {
      if (mode === "mock") {
        await new Promise((r) => setTimeout(r, 900));
        setResult({ ...SAMPLE_PHOTO_THEMES, sample: true });
        return;
      }
      const res = await fetch(`/api/organizations/${encodeURIComponent(orgId)}/photo-themes`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: { mimeType: "image/jpeg", data: photo.data }, memo, idempotencyKey: crypto.randomUUID() }),
      }).catch(() => null);
      const json = ((await res?.json().catch(() => null)) ?? {}) as { seen?: string; themes?: PhotoTheme[]; sample?: boolean; message?: string };
      if (res?.ok && json.themes?.length) setResult({ seen: json.seen ?? "", themes: json.themes, sample: !!json.sample });
      else setError(json.message ?? "写真から考えられませんでした。もう一度お試しください");
    } finally {
      setThinking(false);
    }
  }

  return (
    <section className="card animate-rise space-y-3 border-2 border-sun" aria-labelledby="photo-start-heading">
      <h2 id="photo-start-heading" className="flex items-center gap-2 text-lg font-black">
        <span aria-hidden className="text-2xl">📷</span>
        現場の写真1枚から始める
      </h2>
      {!photo && (
        <>
          <ShioriTalk
            mood="idea"
            size="sm"
            lines={["最近の仕事の写真はありますか？ 作業中でも、できあがりでも大丈夫です。", g("写真を見て、しおりが書けるテーマを3つ考えます。")]}
          />
          <label className="btn-primary min-h-14 w-full cursor-pointer text-lg">
            写真を選ぶ・撮る
            <input type="file" accept="image/*" className="sr-only" disabled={busy} onChange={(e) => choose(e.target.files?.[0])} />
          </label>
          <p className="text-xs text-muted">写真は、テーマを考えるためだけに使い、保存しません。お客様の顔や名前が写っていない写真がおすすめです。</p>
        </>
      )}
      {photo && !result && (
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- 選んだ写真をその場で見せるだけ（data: のURL） */}
          <img src={photo.url} alt="選んだ写真" className="max-h-64 w-full rounded-2xl object-contain bg-canvas" />
          <div>
            <label htmlFor="photo-memo" className="field-label">
              どんな仕事の写真ですか？（書かなくても大丈夫）
            </label>
            <input id="photo-memo" className="field" maxLength={300} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="例：工場の屋根の雨漏りを直したところ" />
            <VoiceInput onText={(t) => setMemo((m) => (m ? `${m}。${t}` : t).slice(0, 300))} disabled={thinking} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary min-h-14 text-lg" disabled={thinking} onClick={ask}>
              {thinking ? g("しおりが写真を見ています…") : g("しおりに見てもらう ✨")}
            </button>
            <button type="button" className="btn-secondary" disabled={thinking} onClick={() => setPhoto(null)}>
              写真を選び直す
            </button>
          </div>
        </div>
      )}
      {result && (
        <div className="space-y-3">
          {result.sample && <p className="inline-block rounded-full bg-sun-soft px-3 text-xs font-bold">サンプル（AIは未接続）</p>}
          <ShioriTalk mood="jersey-cheer" size="sm" lines={[result.seen ? `写真を見ました。${result.seen}` : "写真を見ました！", "この写真で、こんな記事が書けそうです。1つ選んでください。"]} />
          <ul className="grid gap-2 md:grid-cols-3">
            {result.themes.map((t, i) => (
              <li key={i} className="animate-pop" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                <button
                  type="button"
                  disabled={busy}
                  className="group flex h-full w-full flex-col items-start gap-1 rounded-2xl border-2 border-line bg-surface p-3 text-left transition-transform hover:-translate-y-0.5 hover:border-brand disabled:opacity-60"
                  onClick={() => onPick(t)}
                >
                  <span className="font-black">{t.title}</span>
                  <span className="text-sm">{t.readerProblem}</span>
                  {t.why && <span className="text-xs text-muted">📷 {t.why}</span>}
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-brand">
                    このテーマで書く
                    <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="text-sm font-semibold text-muted underline"
            onClick={() => {
              setResult(null);
              setPhoto(null);
              setMemo("");
            }}
          >
            ほかの写真で考える
          </button>
        </div>
      )}
      {error && <p className="text-sm font-bold text-danger">{error}</p>}
    </section>
  );
}
