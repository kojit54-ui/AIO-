"use client";

// ホームの「製造業のこぼれ話」：製造業の知識表から、その日のひとつをしおりが話す（docs/TASKS.md T6-5）

import { useState } from "react";
import { ShioriTalk } from "@/components/talk";
import { MFG_KIND_LABEL, isManufacturing, mfgTipOfDay } from "@/lib/manufacturing";

const jstDay = (ms: number) => new Date(ms + 9 * 3600_000).toISOString().slice(0, 10);

export function MfgTip({ business }: { business: string | null | undefined }) {
  const [day] = useState(() => jstDay(Date.now()));
  const [offset, setOffset] = useState(0);
  if (!isManufacturing(business)) return null;
  const tip = mfgTipOfDay(`${day}:${offset}`, business);
  if (!tip) return null;
  return (
    <section className="card space-y-2" aria-labelledby="mfg-tip-heading">
      <h2 id="mfg-tip-heading" className="inline-block rounded-full bg-brand-soft px-3 text-sm font-bold text-brand-dark">
        🏭 製造業のこぼれ話（{MFG_KIND_LABEL[tip.kind]}）
      </h2>
      <ShioriTalk key={tip.id} mood="idea" lines={[tip.title, tip.summary]}>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <button type="button" className="btn-secondary min-h-9 px-3 py-1 text-sm" onClick={() => setOffset(offset + 1)}>
            ほかの話も聞く
          </button>
          <a href={tip.source.url} target="_blank" rel="noopener noreferrer" className="text-muted underline">
            出典：{tip.source.publisher || tip.source.title}
          </a>
        </div>
      </ShioriTalk>
      {tip.articleIdea && <p className="text-sm text-muted">💡 記事にするなら：「{tip.articleIdea}」</p>}
    </section>
  );
}
