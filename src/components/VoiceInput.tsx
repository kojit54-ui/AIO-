"use client";

// 声で答える（2026-11-07 3AIの検討：スマホの文字入力が一番の壁。音声なら移動の合間にも答えられる）。
// ブラウザの音声入力（Web Speech API）を使う。使えない端末ではボタンを出さない。
// 聞き取った文は、今の答えの後ろに足す（上書きしない）。音声はブラウザの仕組みで文字にするだけで、この画面では保存しない。

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
}

type RecognitionCtor = new () => Recognition;

function ctor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const noop = () => () => {};

export function VoiceInput({ onText, disabled = false }: { onText: (text: string) => void; disabled?: boolean }) {
  const supported = useSyncExternalStore(noop, () => !!ctor(), () => false);
  const [listening, setListening] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const rec = useRef<Recognition | null>(null);
  const sink = useRef(onText);
  useEffect(() => {
    sink.current = onText;
  }, [onText]);
  useEffect(() => () => rec.current?.stop(), []);

  if (!supported) return null;

  const toggle = () => {
    if (listening) {
      rec.current?.stop();
      return;
    }
    const C = ctor();
    if (!C) return;
    const r = new C();
    r.lang = "ja-JP";
    r.continuous = true;
    r.interimResults = false;
    r.onresult = (e) => {
      let said = "";
      for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) said += e.results[i][0].transcript;
      if (said.trim()) sink.current(said.trim());
    };
    r.onerror = (e) => {
      setProblem(e.error === "not-allowed" || e.error === "service-not-allowed" ? "マイクが使えませんでした。画面の上に出る「マイクの使用」を「許可」にしてから、もう一度押してください。" : "うまく聞き取れませんでした。もう一度押すか、文字で短く書いても大丈夫です。");
    };
    r.onend = () => setListening(false);
    rec.current = r;
    setProblem(null);
    try {
      r.start();
      setListening(true);
    } catch {
      setProblem("うまく始められませんでした。少し待ってから、もう一度押してください。");
    }
  };

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-pressed={listening}
        className={`inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-5 font-black transition ${listening ? "animate-pulse border-red-500 bg-red-50 text-red-700" : "border-brand bg-surface text-brand-dark hover:bg-brand-soft"}`}
      >
        <span aria-hidden>{listening ? "🔴" : "🎤"}</span>
        {listening ? "お聞きしています…（終わったら押す）" : "声で答える（押して話す）"}
      </button>
      <p className="text-xs text-muted">{problem ?? "話した言葉が、答えの後ろに入ります。うまく入らないときは、箇条書きでも大丈夫です。"}</p>
    </div>
  );
}
