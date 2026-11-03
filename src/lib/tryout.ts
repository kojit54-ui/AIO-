// 入口の「30秒でためす」（/try）。登録の前に、AIとお客様に選ばれる準備度を診断し、1問答えると記事の書き出しができる。
// 2026-11-03 田村さん「え？楽しそう。やってみたい。とついつい登録しちゃうような案」→ 案1（診断）と案2（その場で書き出し）を続けて。
// いまはサンプル：AIにはつながない。診断は答えから点数を出し、書き出しは答えをそのまま使って組み立てる。
// 作り話をしない（docs/AIO.md）：書き出しに、答えにない数字や実績を足さない。

import type { AioPoint } from "@/types/domain";

export interface ReadinessQuestion {
  id: string;
  point: AioPoint;
  /** 質問（はい・少し・いいえで答えられる形） */
  q: string;
  /** 「いいえ」「少し」のときに見せる、足りない材料の短い名前 */
  missing: string;
}

/** 診断の質問。docs/AIO.md の材料から、ホームページを見れば答えられる6つ */
export const READINESS_QUESTIONS: ReadinessQuestion[] = [
  { id: "case", point: "experience", q: "ホームページに、実際にやった仕事の例を載せていますか？", missing: "実際の仕事の例" },
  { id: "numbers", point: "numbers", q: "値段・納期・個数などの「数字」を載せていますか？", missing: "数字（値段・納期・個数）" },
  { id: "area", point: "entity", q: "会社のある地域や、対応できる地域を書いていますか？", missing: "地域のこと" },
  { id: "faq", point: "qa", q: "お客様によく聞かれる質問に、答えを書いていますか？", missing: "よくある質問の答え" },
  { id: "tips", point: "expertise", q: "注意点や、よくある勘違いを書いた記事がありますか？", missing: "プロならではの注意点" },
  { id: "contact", point: "action", q: "どのページからも、問い合わせの方法がすぐ分かりますか？", missing: "問い合わせへの道" },
];

export type ReadinessAnswer = "yes" | "some" | "no";
export const ANSWER_VALUE: Record<ReadinessAnswer, number> = { yes: 2, some: 1, no: 0 };

/** 準備度（0〜100点） */
export function readinessScore(answers: Record<string, ReadinessAnswer | undefined>): number {
  const max = READINESS_QUESTIONS.length * 2;
  const sum = READINESS_QUESTIONS.reduce((s, q) => s + (answers[q.id] ? ANSWER_VALUE[answers[q.id]!] : 0), 0);
  return Math.round((sum / max) * 100);
}

/** 足りない材料（「はい」でなかったもの） */
export function missingMaterials(answers: Record<string, ReadinessAnswer | undefined>): ReadinessQuestion[] {
  return READINESS_QUESTIONS.filter((q) => answers[q.id] !== "yes");
}

export interface Rank {
  icon: string;
  name: string;
  /** しおりのひとこと */
  say: string;
}

/** 点数の段。どの段でも、書けば伸びると励ます */
export function readinessRank(score: number): Rank {
  if (score >= 85) return { icon: "🏆", name: "エース級", say: "すごい！準備はばっちりです。あとは書き続けて、AIに覚えてもらいましょう。" };
  if (score >= 60) return { icon: "🌿", name: "わかば級", say: "いい線いってます！足りない材料をそろえれば、ぐんと伸びますよ。" };
  if (score >= 30) return { icon: "🐣", name: "ひよこ級", say: "伸びしろたっぷりです！足りない材料は、しおりの質問に答えればそろいます。" };
  return { icon: "🥚", name: "たまご級", say: "ここからがスタートです！どの会社も最初はここから。いっしょに育てましょう。" };
}

/** お客様がAIに聞きそうな質問 */
export function customerQuestion(region: string, job: string): string {
  const r = region.trim() || "近く";
  const j = job.trim() || "仕事";
  return `${r}で${j}を頼むなら、どこがいい？`;
}

export interface TryInput {
  company: string;
  region: string;
  job: string;
  /** 「最近うれしかった仕事は？」への答え */
  answer: string;
}

export interface SampleOpening {
  title: string;
  /** 書き出しの段落。答えはそのまま載せない（AIが整えた文が入る場所を storyAt で示す） */
  paragraphs: string[];
  /** AIが整えたお話が入る段落の番号 */
  storyAt: number;
  /** 続きを書くために、しおりが次に聞くこと */
  nextAsks: string[];
}

const clip = (s: string, n: number) => {
  const t = s.trim().replace(/\s+/g, " ");
  return Array.from(t).length > n ? `${Array.from(t).slice(0, n).join("")}…` : t;
};

/** 見本で、答えの代わりに置く文。答えをそのまま載せると「AIが整える」ことが伝わらないため（2026-11-03 田村さん） */
export const SAMPLE_STORY_SLOT = "ここに、あなたのお話をAIが読みやすく整えた文が入ります。";

/**
 * 「最近うれしかった仕事」の答えが、記事にできる文になっているか。だめなときは、直し方を返す。
 * 意味のない文字（aaaa、ああああ、記号だけ）をAIに送らない・画面に載せないため
 */
export function storyProblem(answer: string): string | null {
  const t = answer.replace(/[\s、。，．,.！!？?・ー〜~\-]/g, "");
  const chars = Array.from(t);
  if (chars.length < 5) return "もう少しだけ、くわしく書いてください。";
  if (!/[\u3041-\u3096\u30a1-\u30fa\u4e00-\u9fff]/.test(t)) return "日本語で、お仕事のことを書いてください。";
  const counts = new Map<string, number>();
  for (const c of chars) counts.set(c, (counts.get(c) ?? 0) + 1);
  const most = Math.max(...counts.values());
  if (counts.size <= 3 || most / chars.length > 0.5) return "お仕事のことを、話すように書いてください。例）急ぎの試作を間に合わせて、お客様に喜ばれた。";
  return null;
}

/** 記事の書き出し（サンプル）。答えにない事実は足さない。答えそのものも載せない */
export function sampleOpening(input: TryInput): SampleOpening {
  const company = clip(input.company, 30) || "わたしたち";
  const region = clip(input.region, 20);
  const job = clip(input.job, 30) || "ものづくり";
  const where = region ? `${region}で` : "";
  return {
    title: `${region ? `【${region}】` : ""}${job}の現場から｜${company}が最近うれしかった仕事`,
    paragraphs: [
      `こんにちは、${where}${job}をしている${company}です。`,
      "今日は、最近あったお仕事の中から、うれしかったことをお話しします。",
      SAMPLE_STORY_SLOT,
      "どんなご相談で、どこが難しくて、どう工夫したのか。現場の言葉で、くわしくご紹介します。",
    ],
    storyAt: 2,
    nextAsks: ["どんなお客様から、どんな相談でしたか？", "いちばん難しかったところは？", "個数・日数・大きさなど、数字で言えることは？"],
  };
}

export interface FutureScene {
  /** お客様がAIに聞くこと */
  ask: string;
  /** AIの答え（イメージ）。会社の名前の前後に分ける */
  before: string;
  company: string;
  after: string;
  /** 記事を読んだ人の気持ち */
  readerThinks: string;
}

/**
 * 「1年後、お客様がAIに相談したら」のイメージ（案3、2026-11-03）。
 * 入力した言葉だけで組み立て、数字や実績は足さない。画面では「イメージ」と必ず書く
 */
export function futureScene(input: TryInput): FutureScene {
  const company = clip(input.company, 30) || "あなたの会社";
  const region = clip(input.region, 20);
  const job = clip(input.job, 30) || "お仕事";
  return {
    ask: customerQuestion(region, job),
    before: `${region ? `${region}で` : ""}${job}なら、`,
    company,
    after: `がよさそうです。ブログに実際のお仕事の話が、現場の人の言葉で書かれていて、どんなふうに対応してくれるかが分かります。相談の窓口もあります。`,
    readerThinks: "現場の人の言葉で書いてあって、安心できそう。ここに相談してみよう！",
  };
}
