// 強みの帳面（2026-11-07 田村さん「会社ごとに独自のプロンプト。300万円のサービスに勝るサービスを」）。
// その会社の「誰に・どんな強みを・なぜそう言えるか・選ばれた決め手・分野ごとの実績・書き方」を1冊にまとめ、
// お客様が確かめたら、記事・点検・AIOのチェック・キーワードの提案のAIに毎回「この会社だけの指示」として渡す。
// docs/AIO.md「選ばれる決め手」「強みの帳面」。画面とサーバーの両方で使うので、DBに触れない純粋な関数だけにする。

/** 狙うお客様（1つの姿）。困りごとの単位まで絞る */
export interface StrengthTarget {
  who: string;
  problem: string;
}

/** 強み1つ。言い切り・根拠（なぜそう言えるか）・数字 */
export interface StrengthItem {
  claim: string;
  reason: string;
  numbers: string;
}

export interface StrengthBook {
  /** 何の専門家か（ひとことで） */
  specialty: string;
  targets: StrengthTarget[];
  strengths: StrengthItem[];
  /** 実際に選ばれた決め手（事例の核）。「〇〇だから選んでもらえた」 */
  wins: string[];
  /** 分野ごとの実績・対応できる地域や範囲 */
  records: string;
  /** 書き方（文体・よく使う言い方・お客様への呼びかけ） */
  voice: string;
  /** 使わない言葉・書かないこと */
  avoid: string;
}

export const MAX_TARGETS = 3;
export const MAX_STRENGTHS = 6;
export const MAX_WINS = 8;
/** 1つの欄の上限 */
export const MAX_FIELD = 400;
export const MAX_LONG_FIELD = 1200;
/** AIに渡す「この会社だけの指示」の上限。記事の素材（8,000字）とは別に数える */
export const MAX_BOOK_PROMPT_CHARS = 3200;
/** 狙うお客様に合う事例（選ばれた決め手）の目安（docs/AIO.md「選ばれる決め手」） */
export const WIN_GOAL = 3;

export const EMPTY_BOOK: StrengthBook = { specialty: "", targets: [], strengths: [], wins: [], records: "", voice: "", avoid: "" };

const chars = (s: string) => Array.from(s).length;
const clip = (v: unknown, n: number) => {
  if (typeof v !== "string") return "";
  const a = Array.from(v.replace(/\r\n?/g, "\n").trim());
  return a.length > n ? a.slice(0, n).join("") : a.join("");
};

/** DBやAIから来た値を、決まった形と長さにそろえる。形が違う所は空にする */
export function normalizeBook(v: unknown): StrengthBook {
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  const list = (x: unknown) => (Array.isArray(x) ? x : []);
  return {
    specialty: clip(o.specialty, MAX_FIELD),
    targets: list(o.targets)
      .map((t) => ({ who: clip((t as StrengthTarget)?.who, MAX_FIELD), problem: clip((t as StrengthTarget)?.problem, MAX_FIELD) }))
      .filter((t) => t.who || t.problem)
      .slice(0, MAX_TARGETS),
    strengths: list(o.strengths)
      .map((s) => ({ claim: clip((s as StrengthItem)?.claim, MAX_FIELD), reason: clip((s as StrengthItem)?.reason, MAX_FIELD), numbers: clip((s as StrengthItem)?.numbers, MAX_FIELD) }))
      .filter((s) => s.claim)
      .slice(0, MAX_STRENGTHS),
    wins: list(o.wins)
      .map((w) => clip(w, MAX_FIELD))
      .filter(Boolean)
      .slice(0, MAX_WINS),
    records: clip(o.records, MAX_LONG_FIELD),
    voice: clip(o.voice, MAX_FIELD),
    avoid: clip(o.avoid, MAX_FIELD),
  };
}

export const isEmptyBook = (b: StrengthBook) => !b.specialty && !b.targets.length && !b.strengths.length && !b.wins.length && !b.records && !b.voice && !b.avoid;

/** 帳面の文字数（画面で「〇字」と見せる。大手の対策会社は強みの文を約6,000字まで書く） */
export function bookChars(b: StrengthBook): number {
  return chars([b.specialty, ...b.targets.flatMap((t) => [t.who, t.problem]), ...b.strengths.flatMap((s) => [s.claim, s.reason, s.numbers]), ...b.wins, b.records, b.voice, b.avoid].join(""));
}

/** どの会社にも書ける強みの言葉（docs/AIO.md「選ばれる決め手」）。src/lib/aioCheck.ts の VAGUE_STRENGTH と同じ考え */
const VAGUE = /丁寧|豊富な(経験|実績|知識)|親身|寄り添|高品質|お客様第一|誠心誠意|安心・安全|確かな技術|迅速/;
const HAS_NUMBER = /[0-9０-９一二三四五六七八九十百千万]+\s*(年|件|社|日|時間|分|台|個|名|人|%|％|割|倍|円|mm|ミリ|ロット)/;

export interface BookGap {
  key: "specialty" | "targets" | "strengths" | "reason" | "numbers" | "vague" | "wins" | "records";
  /** お客様に見せるひとこと */
  message: string;
  /** 埋めるための質問（一問一答で聞く） */
  ask: string;
  example: string;
}

/**
 * 足りない所を、大事な順に返す。AIに選ばれ、来た人に選ばれるための順番（誰に → 強み → 根拠と数字 → 決め手 → 実績）
 */
export function bookGaps(b: StrengthBook): BookGap[] {
  const gaps: BookGap[] = [];
  if (!b.targets.length)
    gaps.push({ key: "targets", message: "いちばん力になれるお客様が、まだ決まっていません", ask: "ほかの会社より、うちがいちばん力になれるお客様はどんな人ですか。困りごとまで教えてください", example: "例：図面が無い古い機械の部品を、1個だけ作り直したい工場の保全担当" });
  if (!b.specialty) gaps.push({ key: "specialty", message: "「何の専門家か」がひとことで書けていません", ask: "ひとことで言うと、何の専門の会社ですか", example: "例：図面の無い部品の、1個からの作り直し" });
  if (!b.strengths.length)
    gaps.push({ key: "strengths", message: "強みがまだありません", ask: "そのお客様に、ほかではなく選ばれる理由は何ですか", example: "例：現物を測って図面から起こせるので、図面が無くても作れる" });
  const noReason = b.strengths.filter((s) => !s.reason).length;
  if (noReason) gaps.push({ key: "reason", message: `強み${noReason}つに、なぜそう言えるか（根拠）がありません`, ask: "その強みは、なぜそう言えますか。設備・人・やり方など、理由を教えてください", example: "例：3次元測定機があり、測定から図面まで同じ職人がやるから" });
  const noNumber = b.strengths.filter((s) => !HAS_NUMBER.test(`${s.numbers} ${s.reason} ${s.claim}`)).length;
  if (noNumber) gaps.push({ key: "numbers", message: `強み${noNumber}つに、数字がありません`, ask: "その強みを数字で言うと？年数・件数・日数など、分かる範囲で", example: "例：この10年で約300点。最短3日で試作" });
  const vague = b.strengths.filter((s) => VAGUE.test(s.claim) && !s.reason).length;
  if (vague) gaps.push({ key: "vague", message: "「丁寧」「親身」など、どの会社にも書ける言葉だけの強みがあります", ask: "「丁寧」を具体的に言うと、何をしていますか", example: "例：納品前に全数を測り、測った値の表を付けている" });
  if (b.wins.length < WIN_GOAL)
    gaps.push({ key: "wins", message: `選ばれた決め手（事例の核）が${b.wins.length}つ。目安は${WIN_GOAL}つ`, ask: "最近のお仕事で、お客様がうちを選んでくれた決め手は何でしたか。1件だけ教えてください", example: "例：他社で「図面が無いと無理」と断られた部品を、現物から3日で作った" });
  if (!b.records) gaps.push({ key: "records", message: "分野ごとの実績や、対応できる地域が書けていません", ask: "分野ごとの実績の数と、対応できる地域を教えてください", example: "例：ギヤの作り直し 年120点、シャフト 年80点。関東一円、全国は相談" });
  return gaps;
}

/** 帳面の進み具合（0〜100）。足りない所の数から出す */
export function bookScore(b: StrengthBook): number {
  if (isEmptyBook(b)) return 0;
  const total = 8;
  return Math.round(((total - Math.min(total, bookGaps(b).length)) / total) * 100);
}

/**
 * AIに渡す「この会社だけの指示」。記事・点検・AIOのチェック・キーワードの提案で毎回使う。
 * お客様が確かめた帳面だけを渡す（確かめていない下書きは使わない）
 */
export function bookToPrompt(b: StrengthBook): string {
  if (isEmptyBook(b)) return "";
  const lines: string[] = [];
  if (b.specialty) lines.push(`この会社の専門：${b.specialty}`);
  if (b.targets.length) {
    lines.push("狙うお客様（記事はこの人たちに向けて書く。テーマもここから外れない）：");
    b.targets.forEach((t, i) => lines.push(`${i + 1}. ${t.who}${t.problem ? `／困りごと：${t.problem}` : ""}`));
  }
  if (b.strengths.length) {
    lines.push("この会社の強み（使うときは根拠と数字を添える。ここに無い強みを作らない）：");
    b.strengths.forEach((s, i) => lines.push(`${i + 1}. ${s.claim}${s.reason ? `／根拠：${s.reason}` : ""}${s.numbers ? `／数字：${s.numbers}` : ""}`));
  }
  if (b.wins.length) {
    lines.push("実際に選ばれた決め手（事例を書くときの核。記事のテーマに合うものだけ使う）：");
    b.wins.forEach((w) => lines.push(`- ${w}`));
  }
  if (b.records) lines.push(`分野ごとの実績・対応できる範囲：${b.records}`);
  if (b.voice) lines.push(`書き方：${b.voice}`);
  if (b.avoid) lines.push(`使わない言葉・書かないこと：${b.avoid}`);
  const text = lines.join("\n");
  const a = Array.from(text);
  return a.length > MAX_BOOK_PROMPT_CHARS ? `${a.slice(0, MAX_BOOK_PROMPT_CHARS - 1).join("")}…` : text;
}

/** 一問一答の答えを、帳面の合う所に足す（AIを使わない。本物でも、この足し方でお客様がすぐ見られる） */
export function applyGapAnswer(b: StrengthBook, key: BookGap["key"], answer: string): StrengthBook {
  const t = clip(answer, MAX_FIELD);
  if (!t) return b;
  switch (key) {
    case "targets":
      return { ...b, targets: [...b.targets, { who: t, problem: "" }].slice(0, MAX_TARGETS) };
    case "specialty":
      return { ...b, specialty: t };
    case "strengths":
    case "vague":
      return { ...b, strengths: [...b.strengths, { claim: t, reason: "", numbers: "" }].slice(0, MAX_STRENGTHS) };
    case "reason": {
      const i = b.strengths.findIndex((s) => !s.reason);
      return i < 0 ? b : { ...b, strengths: b.strengths.map((s, j) => (j === i ? { ...s, reason: t } : s)) };
    }
    case "numbers": {
      const i = b.strengths.findIndex((s) => !HAS_NUMBER.test(`${s.numbers} ${s.reason} ${s.claim}`));
      return i < 0 ? b : { ...b, strengths: b.strengths.map((s, j) => (j === i ? { ...s, numbers: s.numbers ? `${s.numbers}。${t}` : t } : s)) };
    }
    case "wins":
      return { ...b, wins: [...b.wins, t].slice(0, MAX_WINS) };
    case "records":
      return { ...b, records: clip(b.records ? `${b.records}\n${t}` : t, MAX_LONG_FIELD) };
  }
}

/** AIを使わない下書き（キーが無いときと試作）。ヒアリングの答えを、帳面の欄にそのまま置く */
export function sampleBookFromHearing(answers: Record<string, string>): StrengthBook {
  const a = (id: string) => (answers[id] ?? "").trim();
  return normalizeBook({
    specialty: a("business").split(/[。\n]/)[0] ?? "",
    targets: a("customers") ? [{ who: a("customers"), problem: "" }] : [],
    strengths: a("strengths")
      ? a("strengths")
          .split(/\n|。/)
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, MAX_STRENGTHS)
          .map((claim) => ({ claim, reason: "", numbers: "" }))
      : [],
    wins: [],
    records: a("area") ? `対応できる地域：${a("area")}` : "",
    voice: "",
    avoid: a("avoid"),
  });
}

/** すでに書いてある欄は残し、空の欄だけを下書きで埋める（お客様が書いたことをAIが消さない） */
export function fillEmpty(current: StrengthBook, draft: StrengthBook): StrengthBook {
  return {
    specialty: current.specialty || draft.specialty,
    targets: current.targets.length ? current.targets : draft.targets,
    strengths: current.strengths.length ? current.strengths : draft.strengths,
    wins: current.wins.length ? current.wins : draft.wins,
    records: current.records || draft.records,
    voice: current.voice || draft.voice,
    avoid: current.avoid || draft.avoid,
  };
}
