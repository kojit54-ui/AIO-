// 写真から記事を始める（2026-11-07 3AIの検討）。画面とサーバーで使う見本と、写真を小さくする計算。

import type { PhotoTheme } from "@/lib/ai/growthPrompts";

export const SAMPLE_PHOTO_LABEL = "サンプル（AIは未接続）";

/** AIにつながっていないときの見本。写真を見たように見せず「サンプル」と明示する */
export const SAMPLE_PHOTO_THEMES: { seen: string; themes: PhotoTheme[] } = {
  seen: `${SAMPLE_PHOTO_LABEL}：ここに、写真から分かったことが入ります。`,
  themes: [
    { title: `${SAMPLE_PHOTO_LABEL} 写真の仕事で解決できる悩み`, readerProblem: "同じ悩みを持つお客様が、何から始めればよいか知りたい", why: "実際の仕事の様子として載せられます" },
    { title: `${SAMPLE_PHOTO_LABEL} 頼む前に知っておきたい費用と期間`, readerProblem: "頼む前に、おおよその費用と期間を知りたい人", why: "仕上がりのイメージとして使えます" },
    { title: `${SAMPLE_PHOTO_LABEL} 失敗しない頼み方`, readerProblem: "どこに頼めばよいか迷っている人", why: "プロの手元の写真が信頼につながります" },
  ],
};

/** 長い辺を max に収める大きさ（大きくはしない） */
export function fitSize(w: number, h: number, max = 1280): { w: number; h: number } {
  const s = Math.min(1, max / Math.max(w, h));
  return { w: Math.round(w * s), h: Math.round(h * s) };
}
