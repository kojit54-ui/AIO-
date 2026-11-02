// AIに紹介されたかのチェックで聞く質問（画面とサーバーの両方で使う）。src/lib/growth/mentions.ts

import type { HearingAnswer } from "@/prototype/growth";

/** 1社が1か月に調べられる回数（1回で質問を最大3つ） */
export const MONTHLY_MENTION_CHECKS = 4;
export const MAX_MENTION_QUESTIONS = 3;

const first = (s: string) => s.split(/[\n、。,／/]/).map((x) => x.trim()).find(Boolean) ?? "";

/** ヒアリングの答えから、お客様がAIに聞きそうな質問を作る（AIは使わない） */
export function mentionQuestions(hearing: Record<string, HearingAnswer>): string[] {
  const t = (id: string) => (hearing[id] && !hearing[id].draft ? hearing[id].text.trim() : "");
  const clean = (x: string) => x.replace(/^例：/, "").trim();
  // 地域は最初の1つだけ（「さくら市と南町」→「さくら市」）。長いものは地名ではないので使わない
  const areaRaw = clean(first(t("area"))).split(/と|・/)[0].trim();
  const area = areaRaw.length <= 12 ? areaRaw : "";
  const services = t("services")
    .split(/[\n、,／/。]/)
    .map(clean)
    .filter((x) => x && x.length <= 24)
    .slice(0, 2);
  const business = clean(first(t("business")));
  const where = area ? `${area}で` : "";
  const out = services.map((s) => `${where}${s}を頼むなら、どこがおすすめ？`);
  if (business && business.length <= 20) out.push(`${where}${business}でおすすめのところは？`);
  return [...new Set(out)].slice(0, MAX_MENTION_QUESTIONS);
}

