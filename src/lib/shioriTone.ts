// しおりの話し方（厳しさ）。2026-11-04 田村さん「ふつう（少し厳しめ）＋選べる」。
// あすけんの栄養士のように、ほめるだけでなく、はっきり言う。ただし責めない・人を否定しない・脅さない・約束しない。

export type ShioriTone = "gentle" | "normal" | "strict";

export const DEFAULT_TONE: ShioriTone = "normal";

export const TONES: { id: ShioriTone; label: string; note: string; sample: string }[] = [
  { id: "gentle", label: "やさしめ", note: "ゆっくり、ほめて伸ばします", sample: "今月はまだですね。気が向いたときに、1問だけでも大丈夫ですよ。" },
  { id: "normal", label: "ふつう（少し厳しめ）", note: "ほめつつ、さぼりは見逃しません", sample: "今月はまだ1本もありませんよ。5分だけ、いっしょに始めましょう。" },
  { id: "strict", label: "きびしめ", note: "はっきり言います。本気で続けたい方に", sample: "今月はまだゼロです。書かない月が続くと、AIにもお客様にも見つけてもらえません。今日1問、答えましょう。" },
];

export function isTone(v: unknown): v is ShioriTone {
  return v === "gentle" || v === "normal" || v === "strict";
}

export interface HomeSituation {
  /** 今月ブログに載せた記事の数 */
  publishedThisMonth: number;
  /** 今月さわった（作った・直した）記事の数 */
  workedThisMonth: number;
  /** 書きかけの記事があるか */
  inProgress: boolean;
  /** これまでの記事の数 */
  totalArticles: number;
  /** 最後に記事をさわってからの日数（記事が無ければ null） */
  daysSinceLastWork: number | null;
}

export type HomeCase = "first" | "published" | "inProgressStale" | "inProgress" | "away" | "notYet";

export function homeCase(s: HomeSituation): HomeCase {
  if (s.totalArticles === 0) return "first";
  if (s.publishedThisMonth > 0) return "published";
  if (s.inProgress) return (s.daysSinceLastWork ?? 0) >= 7 ? "inProgressStale" : "inProgress";
  if ((s.daysSinceLastWork ?? 0) >= 30) return "away";
  return "notYet";
}

const LINES: Record<HomeCase, Record<ShioriTone, string[]>> = {
  first: {
    gentle: ["はじめまして、しおりです！", "質問に答えるだけで記事になります。ゆっくりで大丈夫ですよ。"],
    normal: ["はじめまして、しおりです。", "最初の1本は、質問に答えるだけ。今日のうちに始めてしまいましょう。"],
    strict: ["しおりです。最初の1本を、今日書きましょう。", "AIに選ばれる会社は、まず書いている会社です。質問に答えるところからです。"],
  },
  published: {
    gentle: ["今月もブログに載せましたね。すごいです！", "この調子で、ゆっくり続けていきましょう。"],
    normal: ["今月の1本、ブログに載せましたね。よくできました！", "続けて書くほど、AIにもお客様にも見つけてもらいやすくなります。次の1本もいきましょう。"],
    strict: ["今月の1本、載せましたね。合格です。", "ここで止めると、もったいないです。次の1本の質問に、もう答えておきましょう。"],
  },
  inProgress: {
    gentle: ["書きかけの記事がありますよ。", "答えは残っています。続きからいつでも始められます。"],
    normal: ["書きかけの記事、前回の続きからできます。", "あと少しです。今日は1問だけでも進めましょう。"],
    strict: ["書きかけの記事が止まっています。", "ブログに載せるまでは、お客様には届きません。今日、続きをやりましょう。"],
  },
  inProgressStale: {
    gentle: ["書きかけの記事、覚えていますよ。", "答えはちゃんと残っています。思い出したときに、続きをやってみましょうね。"],
    normal: ["おかえりなさい。書きかけの記事、前回の続きからできます。", "答えは残っています。今日は1問だけ、5分で進めましょう。"],
    strict: ["書きかけの記事が1週間以上止まっています。", "書いた答えがもったいないです。今日、ブログに載せるところまで進めましょう。"],
  },
  away: {
    gentle: ["おかえりなさい！ お待ちしていました。", "久しぶりでも大丈夫。1問だけ答えてみませんか？"],
    normal: ["おかえりなさい。1か月以上空きましたね。", "責めませんよ。でも、今日1問だけ答えて、また始めましょう。"],
    strict: ["1か月以上、空いてしまいましたね。", "ここから取り戻しましょう。今日、1問答えるところまでやりましょう。"],
  },
  notYet: {
    gentle: ["今月も1本、いっしょに書きましょう！", "質問に答えるだけで、できますよ。"],
    normal: ["今月はまだ1本もありませんよ。", "AIに選ばれて、お客様に「ここに頼みたい」と思ってもらえる記事に。5分だけ、いっしょに始めましょう。"],
    strict: ["今月はまだゼロです。", "書かない月が続くと、AIにもお客様にも見つけてもらえません。今日1問、答えましょう。"],
  },
};

/** 「今」の時刻。見ている月が今月でなければ（試作の架空データなど）その月の終わりにする */
export function referenceTime(month: string, nowMs: number): number {
  const jstMonth = new Date(nowMs + 9 * 3600_000).toISOString().slice(0, 7);
  if (jstMonth === month) return nowMs;
  const [y, m] = month.split("-").map(Number);
  return Math.min(nowMs, Date.UTC(y, m, 1) - 9 * 3600_000 - 1);
}

/** ホームのしおりのひとこと */
export function homeLines(tone: ShioriTone, s: HomeSituation): string[] {
  return LINES[homeCase(s)][tone];
}

export const ALL_HOME_LINES = LINES;

/** コタムから「直してほしい所」が届いているとき。ホームのボタンと同じことを話す */
export const FIX_LINES: Record<ShioriTone, string[]> = {
  gentle: ["コタムから、直してほしい所が届いていますよ。", "見てみて、できるところから直していきましょうね。"],
  normal: ["コタムから、直してほしい所が届いています。", "直せばブログに載せられます。先にこちらを片づけましょう。"],
  strict: ["コタムから、直してほしい所が届いています。", "直さないと、ブログに載せられません。今日、片づけましょう。"],
};

/** ホームの案内役の表情。きびしめで書く手が止まっているときは本気で怒る。ほかはいつものジャージで応援 */
export function homeMood(tone: ShioriTone, s: HomeSituation): "angry" | "jersey-cheer" {
  const c = homeCase(s);
  return tone === "strict" && (c === "inProgressStale" || c === "away" || c === "notYet") ? "angry" : "jersey-cheer";
}
