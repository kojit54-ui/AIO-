// このサービスが目指すこと（2つの「選ばれる」）を、短く1行で見せる札。src/lib/brand.ts
// ホーム・しおりの自己紹介・招待状・30秒でためすの結果で同じものを使い、言葉と見た目をそろえる。

import { CHOSEN_STAGES } from "@/lib/brand";

export function ChosenPath({ className = "", tone = "light" }: { className?: string; tone?: "light" | "onBlue" }) {
  const box = tone === "onBlue" ? "bg-white/15 text-white" : "bg-surface ring-1 ring-line";
  return (
    <div className={`flex flex-wrap items-center gap-x-1.5 gap-y-1.5 rounded-3xl px-3 py-2 text-xs font-black sm:gap-x-2 sm:text-sm ${box} ${className}`} aria-label="このサービスが目指すこと">
      {CHOSEN_STAGES.map((s, i) => (
        <span key={s.key} className="inline-flex items-center gap-1.5 sm:gap-2">
          {i > 0 && (
            <span className="inline-block animate-nudge text-brand" aria-hidden>
              →
            </span>
          )}
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 ${s.key === "people" ? "bg-sun text-ink" : tone === "onBlue" ? "bg-white text-brand-dark" : "bg-brand-soft text-brand-dark"}`}>
            <span aria-hidden>{s.icon}</span>
            {s.label}
          </span>
        </span>
      ))}
      <span className={`w-full text-xs font-bold sm:w-auto ${tone === "onBlue" ? "text-white/85" : "text-muted"}`}>いちばん大切なのは、人に選ばれること</span>
    </div>
  );
}
