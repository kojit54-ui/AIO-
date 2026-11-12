// 「育つブログ」の試作（第1段階）。docs/DECISIONS.md 2026-10-23「仕切り直し」。
// ヒアリング → キーワードの提案 → ピラーとクラスター → キーワード管理表 → レベルアップ、の考え方だけを持つ。
// AIは未接続。提案と深掘りの質問は、決まった規則で作るサンプル。保存はブラウザの中だけ。

export const SAMPLE_LABEL = "サンプル（AIは未接続）";
/** 答えは4,000字まで、記事の言葉は80字、読む人の疑問は200字まで（DBの決まりと同じ） */
export const MAX_ANSWER = 4000;
export const MAX_ROW_KEYWORD = 80;
export const MAX_ROW_QUESTION = 200;
/** 文字（コードポイント）単位で切る。絵文字の途中で切ると、DBが受け付けない文字になる */
export const cutText = (s: string, n: number) => Array.from(s).slice(0, n).join("");
/** DBの btrim と同じく前後の半角スペースを落とす（PostgreSQL の btrim(x) は半角スペースだけを落とす） */
export const trimSpaces = (s: string) => s.replace(/^ +| +$/g, "");
/** DBに入る形と同じ言葉にする。行は「種類＋言葉」で見分けるので、画面とDBで1字でもずれると対応が取れなくなる */
export const fitText = (s: string, n: number) => trimSpaces(cutText(trimSpaces(s), n));

export { AIO_POINTS, collectedAio } from "@/lib/aio";
export type { AioPoint } from "@/types/domain";

import type { AioPoint } from "@/types/domain";

export interface HearingQuestion {
  id: string;
  label: string;
  /** この質問で集めるAIOの材料 */
  aio: AioPoint;
  example: string;
  /** 答えやすくするためのコツ */
  tip: string;
  /** 答えが短いときに返す深掘りの質問（順に使う） */
  deepDives: string[];
}

export const HEARING_QUESTIONS: HearingQuestion[] = [
  {
    id: "business",
    label: "どんなお仕事をしていますか",
    aio: "entity",
    example: "例：戸建て住宅のリフォーム。断熱、水回り、手すりの取り付けが多い",
    tip: "初めて会う人に30秒で説明するつもりで。業界の言葉でなくて大丈夫です。",
    deepDives: ["いちばん依頼が多いお仕事は何ですか", "このお仕事をしていて、いちばんうれしいのはどんなときですか", "反対に、受けていないお仕事はありますか"],
  },
  {
    id: "services",
    label: "これから特に売りたい商品やサービスは何ですか",
    aio: "action",
    example: "例：内窓の取り付け、浴室の断熱リフォーム",
    tip: "2〜3個までで大丈夫です。利益が出やすいもの、もっと知ってほしいものを優先してください。",
    deepDives: ["それを選んだお客様は、最初にどんな困りごとを話されますか", "おおよその価格帯や工期を教えてください（書ける範囲で）"],
  },
  {
    id: "customers",
    label: "どんなお客様が多いですか",
    aio: "qa",
    example: "例：市内の60代のご夫婦。子どもが独立して、家を住みやすくしたい",
    tip: "実際によく来るお客様の中で、うちがいちばん力になれる人を1人思い浮かべてください。業種や年代、規模、きっかけなど。「どなたでも」より、1人にしぼるほうが選ばれます。",
    deepDives: ["そのお客様は、何がきっかけで相談に来られますか", "依頼の前に、どんなことで迷われたり、不安に思われたりしていましたか"],
  },
  {
    id: "area",
    label: "お仕事をしている地域はどこですか",
    aio: "entity",
    example: "例：さくら市と、となりの南町・北町",
    tip: "市や町の名前で。検索されるときの地名になります。",
    deepDives: ["特に力を入れたい地域はありますか"],
  },
  {
    id: "strengths",
    label: "ほかの会社ではなく、選ばれる理由は何ですか",
    aio: "experience",
    example: "例：一級建築士が現地調査から工事の管理まで担当する。工事後の点検が無料",
    tip: "お客様に言われてうれしかった言葉を思い出すと書きやすいです。「丁寧」「親身」だけでなく、何をしているか・なぜそう言えるか・数字（年数や件数）まで書けると、ほかの会社との違いが伝わります。",
    deepDives: ["その強みが伝わったお客様の、具体的なエピソードを1つ教えてください", "そのとき、お客様はどんな言葉をかけてくれましたか", "その強みを数字で表せますか（年数、件数など）"],
  },
  {
    id: "competitors",
    label: "よく比べられる会社やサービスはありますか",
    aio: "comparison",
    example: "例：大手のリフォームチェーン、ホームセンターの工事受付",
    tip: "会社名でなくても、「ネットの格安業者」のような書き方で大丈夫です。",
    deepDives: ["比べられたとき、お客様はどこを気にされますか"],
  },
  {
    id: "faq",
    label: "お客様からよく聞かれる質問は何ですか",
    aio: "qa",
    example: "例：工事中も住めますか／補助金は使えますか／どのくらい暖かくなりますか",
    tip: "そのまま記事のテーマになります。思いつくだけ箇条書きで並べてください。",
    deepDives: ["その中で、答えるのにいちばん時間がかかる質問はどれですか"],
  },
  {
    id: "avoid",
    label: "記事で使ってほしくない言葉や、気をつけることはありますか",
    aio: "trust",
    example: "例：「業界最安」「絶対」は使わない。お客様の名前は出さない",
    tip: "無ければ「特になし」で大丈夫です。",
    deepDives: [],
  },
];

export interface HearingAnswer {
  questionId: string;
  text: string;
  /** 深掘りの質問と、その答え。why は聞く理由（AIが添える）、pending は答え待ち */
  followUps: HearingFollowUp[];
  /** 書いている途中で、まだ「次へ」を押していない */
  draft?: boolean;
  /** AIが「もう深掘りは要らない」と決めたか、深掘りを飛ばした */
  deepDiveDone?: boolean;
}

export interface HearingFollowUp {
  question: string;
  answer: string;
  why?: string;
  /** 記入例（薄いグレーで入力欄に出す） */
  example?: string;
  pending?: boolean;
}

/** ヒアリングの続きの位置。まだ答えていない問いか、深掘りが残っている問い。全部済んだら問いの数 */
export function resumeIndex(answers: Record<string, HearingAnswer>): number {
  const i = HEARING_QUESTIONS.findIndex((q) => !isAnswerDone(q, answers[q.id]));
  return i === -1 ? HEARING_QUESTIONS.length : i;
}

/** 答えを書き直す。中身が変わったら、前の答えへの深掘りは消して聞き直す */
export function withNewText(prev: HearingAnswer, text: string): HearingAnswer {
  const next = text.trim();
  const same = next === prev.text.trim();
  return { ...prev, text: next, followUps: same ? prev.followUps : [], // 立っていたときだけ戻す（列を足す SQL の前でも保存できるように）
    deepDiveDone: same ? prev.deepDiveDone : prev.deepDiveDone ? false : undefined, draft: false };
}

/** 決まった深掘り（AIが無いとき）は1問につき2回まで */
export const MAX_DEEP_DIVES = 2;
/** AIの深掘りは1問につき4回まで。かなり深いところまで聞く（2026-11-02 田村さん） */
export const MAX_AI_DEEP_DIVES = 4;

/** 答え待ちの深掘り（AIが作った質問）。無ければ null */
export function pendingDeepDive(answer: HearingAnswer | undefined): HearingFollowUp | null {
  const last = answer?.followUps[answer.followUps.length - 1];
  return last?.pending ? last : null;
}

/** 決まった深掘りで聞く理由。AIの深掘りは質問ごとに理由が付く */
export function deepDiveWhy(question: HearingQuestion, answer: HearingAnswer | undefined): string {
  return pendingDeepDive(answer)?.why || `具体的な場面や数字があると、ほかの会社には書けない記事になり、AIにも紹介されやすくなります。`;
}

/**
 * 答えが短いときに返す深掘りの質問。無ければ null。
 * 本物のAIでは答えの中身を読んで質問を作る。試作では「短い（30字未満）」「1行だけ」を目安にする
 */
export function nextDeepDive(question: HearingQuestion, answer: HearingAnswer | undefined): string | null {
  if (!answer || !answer.text.trim()) return null;
  const pending = pendingDeepDive(answer);
  if (pending) return pending.question;
  if (answer.deepDiveDone) return null;
  const asked = answer.followUps.length;
  if (asked >= MAX_DEEP_DIVES || asked >= question.deepDives.length) return null;
  // 深掘りを飛ばしたら（空の答え）、その問いではもう聞かない
  if (asked && !answer.followUps[asked - 1].answer.trim()) return null;
  const all = [answer.text, ...answer.followUps.map((f) => f.answer)].join("\n").trim();
  const lines = all.split(/\n|、|。|／/).filter((l) => l.trim()).length;
  const thin = Array.from(all).length < 30 * (asked + 1) || lines < 2 + asked;
  return thin ? question.deepDives[asked] : null;
}

/** 答え終わった問いか。書きかけや、深掘りが残っているものは数えない */
export function isAnswerDone(question: HearingQuestion, answer: HearingAnswer | undefined): boolean {
  return !!answer?.text.trim() && !answer.draft && nextDeepDive(question, answer) === null;
}

export function answeredCount(answers: Record<string, HearingAnswer>) {
  return HEARING_QUESTIONS.filter((q) => isAnswerDone(q, answers[q.id])).length;
}

/** キーワードの提案を作るのに必要な答え */
export const REQUIRED_FOR_PROPOSALS = ["business", "services", "customers", "area"];
/** 提案に要る問いが、書きかけや深掘りの残りなく答え終わっているか */
export const canPropose = (answers: Record<string, HearingAnswer>) =>
  REQUIRED_FOR_PROPOSALS.every((id) => {
    const q = HEARING_QUESTIONS.find((x) => x.id === id);
    return !!q && isAnswerDone(q, answers[id]);
  });

export type ProposalReason = "sales" | "competition" | "aio";
export const REASON_LABEL: Record<ProposalReason, string> = {
  sales: "売上につながる",
  competition: "ライバルに勝てる",
  aio: "AIに紹介されやすい",
};

export interface KeywordIdea {
  id: string;
  keyword: string;
  /** 読む人が知りたいこと */
  question: string;
}

export interface PillarProposal {
  id: string;
  /** 柱の記事のキーワード */
  pillar: KeywordIdea;
  clusters: KeywordIdea[];
  reasons: ProposalReason[];
  why: string;
}

/** 答えの最初の項目（読点・改行・「／」で区切った先頭）。長すぎるときは切る */
function firstItem(text: string, fallback: string) {
  const item = text.split(/\n|、|，|,|／|\//).map((s) => s.replace(/^例：|^[-・\s]+/, "").trim()).find(Boolean) ?? "";
  const chars = Array.from(item || fallback);
  return chars.length > 16 ? chars.slice(0, 16).join("") : chars.join("");
}

function items(text: string, max: number) {
  return text
    .split(/\n|／|\//)
    .map((s) => s.replace(/^[-・\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, max);
}

/**
 * ヒアリングからピラーとクラスターの提案を3つ作る（サンプル）。
 * 本物では、AIがヒアリング全体を読み、第2段階から Search Console、第3段階からキーワードツールの数字を足す
 */
export function sampleProposals(answers: Record<string, HearingAnswer>): PillarProposal[] {
  const service = firstItem(answers.services?.text ?? "", "サービス");
  const business = firstItem(answers.business?.text ?? "", "お仕事");
  const area = firstItem(answers.area?.text ?? "", "地域");
  const faqs = items(answers.faq?.text ?? "", 2);
  const k = (id: string, keyword: string, question: string): KeywordIdea => ({ id, keyword, question });
  return [
    {
      id: "p_sales",
      pillar: k("p_sales_0", `${area} ${service}`, `${area}で${service}を頼むなら、何から始めればよいか`),
      clusters: [
        k("p_sales_1", `${service} 費用`, "費用の目安と、何で金額が変わるか"),
        k("p_sales_2", `${service} 期間`, "工事や準備にどのくらいかかるか"),
        k("p_sales_3", `${service} 失敗`, "よくある失敗と、避けるための確認"),
        k("p_sales_4", `${service} 補助金`, "使える補助や制度はあるか"),
        k("p_sales_5", `${service} 事例`, "実際に頼んだ人はどう変わったか"),
      ],
      reasons: ["sales", "aio"],
      why: `売りたい「${service}」を、地域名と一緒に探す人に向けた記事のセットです。頼む直前に読まれる記事が中心です。`,
    },
    {
      id: "p_compare",
      pillar: k("p_compare_0", `${service} 選び方`, `${service}の会社をどう選べばよいか`),
      clusters: [
        k("p_compare_1", `${service} 比較`, "頼み先ごとの違い"),
        k("p_compare_2", `${service} 見積もり 見方`, "見積もりで確かめるところ"),
        k("p_compare_3", `${business} 相談 タイミング`, "いつ相談すればよいか"),
        k("p_compare_4", `${service} 保証`, "工事の後の保証や点検"),
        k("p_compare_5", `${service} 選ばれた理由 事例`, "どんなお客様の、どんな困りごとが、どう変わったか"),
      ],
      reasons: ["competition", "sales"],
      why: "よく比べられる相手との違いを伝える記事のセットです。選ばれる理由が生きます。",
    },
    {
      id: "p_faq",
      pillar: k("p_faq_0", `${business} よくある質問`, `${business}を頼む前に知っておきたいこと`),
      clusters: [
        ...faqs.map((f, i) => k(`p_faq_${i + 1}`, f.replace(/[？?]$/, ""), `「${f.replace(/[？?]$/, "")}」への答え`)),
        k(`p_faq_${faqs.length + 1}`, `${business} 流れ`, "相談から完了までの流れ"),
        k(`p_faq_${faqs.length + 2}`, `${business} 注意点`, "頼む前に気をつけること"),
        k(`p_faq_${faqs.length + 3}`, `${business} 相談 事例`, "相談したお客様が、どう解決したか"),
      ],
      reasons: ["aio"],
      why: "お客様の質問にそのまま答える記事のセットです。質問と答えがはっきりした記事は、AIに紹介されやすくなります。",
    },
  ];
}

export type RowStatus = "todo" | "writing" | "published";
/** 「公開済み」は、利用者の言葉に合わせて「やった」と出す（docs/LESSONS.md 用語集） */
export const ROW_STATUS_LABEL: Record<RowStatus, string> = { todo: "まだ", writing: "書いている", published: "やった" };

/** 柱（ピラー）／周り（クラスター）の、顧客向けの呼び方 */
export const KIND_LABEL: Record<"pillar" | "cluster", string> = { pillar: "まとめ記事", cluster: "くわしい記事" };

/** キーワードがどこから来たか。SEMrush・Search Console は後からつなぐ（docs/DATA.md「キーワード管理表」） */
export type KeywordSource = "proposal" | "customer" | "cotam" | "site" | "search_console" | "semrush" | "rakko" | "keyword_planner";

/** 優先度。3 がいちばん高い */
export type KeywordPriority = 1 | 2 | 3;

export interface KeywordRow extends KeywordIdea {
  kind: "pillar" | "cluster";
  status: RowStatus;
  /** 以下は管理表で使う。前の試作で保存した行には無いので、src/prototype/keywords.ts の normalizeRow で補う */
  /** 属する柱の記事の行 id（柱の記事は自分の id） */
  pillarId?: string;
  priority?: KeywordPriority;
  reasons?: ProposalReason[];
  source?: KeywordSource;
  /** 月間検索数。キーワードツールをつなぐまでは null（数字を作らない） */
  monthlySearches?: number | null;
  /** 「やめておく」にしたもの。消さずに残す */
  parked?: boolean;
  /** どの「今売りたいもの」の記事か（src/prototype/keywords.ts の SellItem の id）。null なら記事の言葉から自動で決める */
  sellItemId?: string | null;
}

export interface KeywordPlan {
  proposalId: string;
  rows: KeywordRow[];
}

/**
 * 選んだ提案から管理表を作る。優先度はサンプルの決まり：柱の記事と最初の2本は 3、次の2本は 2、残りは 1。
 * 本物では、AIが売上への近さ・競合・AI検索で紹介されやすさから付け、キーワードツールの数字も加える
 */
export function planFromProposal(p: PillarProposal): KeywordPlan {
  const base = { pillarId: p.pillar.id, reasons: p.reasons, source: "proposal" as const, monthlySearches: null, parked: false };
  const clusterPriority = (i: number): KeywordPriority => (i < 2 ? 3 : i < 4 ? 2 : 1);
  // DBに入る長さにここでそろえる（保存のときに切ると、画面の行とDBの行が別物になる）
  const fit = <T extends { keyword: string; question: string }>(x: T): T => ({ ...x, keyword: fitText(x.keyword, MAX_ROW_KEYWORD), question: cutText(x.question, MAX_ROW_QUESTION) });
  // 切りそろえて同じ言葉になったものは1つにする（行は「種類＋言葉」で見分けるため）
  const seen = new Set([fit(p.pillar).keyword]);
  const clusters = p.clusters.map(fit).filter((c) => c.keyword && !seen.has(c.keyword) && seen.add(c.keyword));
  return {
    proposalId: p.id,
    rows: [
      { ...fit(p.pillar), ...base, kind: "pillar", status: "todo", priority: 3 },
      ...clusters.map((c, i) => ({ ...c, ...base, kind: "cluster" as const, status: "todo" as const, priority: clusterPriority(i) })),
    ],
  };
}

export interface Badge {
  id: string;
  label: string;
  earned: boolean;
}

export interface Growth {
  level: number;
  name: string;
  points: number;
  /** 次のレベルに必要な点。最高レベルでは null */
  nextAt: number | null;
  /** 今のレベルの始まりの点 */
  levelStart: number;
  badges: Badge[];
}

export const LEVELS: { at: number; name: string }[] = [
  { at: 0, name: "種をまいた" },
  { at: 10, name: "芽が出た" },
  { at: 30, name: "根を張った" },
  { at: 60, name: "枝が伸びた" },
  { at: 100, name: "花が咲いた" },
  { at: 150, name: "森になった" },
];

/** 点の付け方：ヒアリングを終えた 5点、書き始めた記事 1本 2点、公開したクラスター 1本 10点、公開した柱の記事 30点 */
export function computeGrowth(answers: Record<string, HearingAnswer>, plan: KeywordPlan | null): Growth {
  // 「やめておく」にしたキーワードは数えない
  const rows = (plan?.rows ?? []).filter((r) => !r.parked);
  const hearingDone = answeredCount(answers) === HEARING_QUESTIONS.length;
  const published = rows.filter((r) => r.status === "published");
  const pillarPublished = published.some((r) => r.kind === "pillar");
  const clustersPublished = published.filter((r) => r.kind === "cluster").length;
  const writing = rows.filter((r) => r.status === "writing").length;
  const points = (hearingDone ? 5 : 0) + writing * 2 + clustersPublished * 10 + (pillarPublished ? 30 : 0);
  const idx = LEVELS.reduce((n, l, i) => (points >= l.at ? i : n), 0);
  const clusters = rows.filter((r) => r.kind === "cluster").length;
  return {
    level: idx + 1,
    name: LEVELS[idx].name,
    points,
    levelStart: LEVELS[idx].at,
    nextAt: idx + 1 < LEVELS.length ? LEVELS[idx + 1].at : null,
    badges: [
      { id: "hearing", label: "会社のことを教えた", earned: hearingDone },
      { id: "first", label: "最初の記事を公開した", earned: published.length > 0 },
      { id: "pillar", label: "まとめ記事を公開した", earned: pillarPublished },
      { id: "five", label: "くわしい記事を5本公開した", earned: clustersPublished >= 5 },
      { id: "all", label: "記事リストを全部やった", earned: rows.length > 0 && published.length === rows.length && clusters > 0 },
    ],
  };
}

export interface ArticleQuestion {
  id: string;
  label: string;
  aio: AioPoint;
  example: string;
  tip: string;
  /** 分からなければ空けて次へ進める問い（目安の数字など） */
  optional?: boolean;
}

/** 1本の記事を書くときの一問一答。キーワードの「読む人が知りたいこと」に合わせて言い方を変える */
/**
 * どの業種でも当てはまる記入例。本物の会社（試作の架空会社でない）では、リフォーム向けの例だと
 * 「うちの話じゃない」と感じるので、こちらを使う（2026-11-03 昇文堂さんで「脱衣所が寒い」が出ていた）
 */
export const GENERIC_ARTICLE_EXAMPLES: Record<string, string> = {
  a1: "例：去年の秋、地元の会社の社長から「何から頼めばいいか分からない」と相談された",
  a2: "例：・まず今の困りごとを聞いた\n・できること、できないことを説明した\n・見積もりを2案出した",
  a3: "例：「思っていたより早く、分かりやすかった」と言われた。問い合わせが前より増えた",
  a8: "例：ほかで「うちでは難しい」と言われていた。最初の電話で、できる方法と日数をすぐ伝えたら決まった",
  a7: "例：ふつうは1個から。費用は大きさで変わり、多いのは3〜5万円。日数は2週間ほど",
  a4: "例：安さだけで選ぶと、あとで直す手間とお金がかかることがある",
  a6: "例：「相談してよかった」と言われた。相手の言葉をそのまま形にすることを大切にした",
  a5: "例：まずは電話かフォームで、気軽に相談してほしい",
};

export function articleQuestions(row: KeywordIdea, opts: { generic?: boolean } = {}): ArticleQuestion[] {
  const qs: ArticleQuestion[] = [
    { id: "a1", label: `「${row.question || row.keyword}」について、どんなお客様から、どんな相談がありましたか（業種や規模・困っていたこと）`, aio: "experience", example: "例：去年の冬、70代のご夫婦から「脱衣所が寒い」と相談された", tip: "実際にあった1件を思い出すと書きやすいです。名前は書かなくて大丈夫です。" },
    { id: "a2", label: "そのとき、どう答えましたか・どう対応しましたか（なぜそうしたかも）", aio: "qa", example: "例：・まず現地で窓と床を見た\n・内窓を提案した\n・工事は1日", tip: "箇条書きで大丈夫です。やった順番と、材料ややり方を選んだ理由があると、プロの記事になります。食品や安全に関わる変更なら、確かめたことも書いてください。" },
    { id: "a3", label: "結果はどうでしたか（頼まれる前と比べて）", aio: "numbers", example: "例：お風呂に入る前の寒さが気にならなくなったと言われた", tip: "お客様の言葉や、分かる範囲の数字（縦・横・奥行きの大きさ・日数・だいたいの費用）があると記事の説得力が上がります。費用に何が含まれるか（材料・取り付け・運賃）、日数はいつから数えたかも分かれば書いてください。" },
    { id: "a8", optional: true, label: "このお客様は、なぜほかではなく、あなたの会社に頼んでくれたのでしょう（選ばれた決め手）", aio: "comparison", example: "例：ほかの会社で「図面が無いと無理」と断られていた。うちは現物を測って1個から作れると伝えたら、その場で決まった", tip: "AIに「どこに頼めばいい？」と聞く人は、選ぶ理由も知りたがっています。お客様が言っていたことや、ほかで断られた事情など、分かる範囲で大丈夫です。" },
    { id: "a7", optional: true, label: "同じような相談なら、いつもはどれくらいですか（何個から・費用・日数の目安）", aio: "numbers", example: "例：ふつうは1個から。費用は大きさで変わり、多いのは3〜5万円。図面がなければ採寸から2週間ほど", tip: "AIに紹介されて来た人が、いちばん知りたいのがこの目安です。決まった数字が無ければ「ふつうは」「多いのは」で大丈夫です。分からなければ空けておいてください。" },
    { id: "a4", label: "よくある誤解や、気をつけることはありますか", aio: "expertise", example: "例：暖房を増やすだけでは結露が増えることがある", tip: "プロだから知っていることが、記事のいちばんの価値になります。" },
    { id: "a6", label: "お客様が喜んでくれた言葉や、この仕事で大切にしたことはありますか", aio: "feeling", example: "例：「朝のお風呂が怖くなくなった」と言われた。お年寄りの家なので段差に特に気をつけた", tip: "そのときの気持ちや、お客様の言葉そのままが、読んだ人の心を動かします。" },
    { id: "a5", label: "読んだ人に、次に何をしてほしいですか（連絡のしかたと、送ってほしいもの）", aio: "action", example: "例：無料の住まい点検に申し込んでほしい", tip: "電話、フォーム、来店など。相談から納品までの流れと、それぞれの日数も書くと、読んだ人が安心して連絡できます。" },
  ];
  return opts.generic ? qs.map((q) => ({ ...q, example: GENERIC_ARTICLE_EXAMPLES[q.id] ?? q.example })) : qs;
}


/**
 * ヒアリングの進み具合（問いの数で数える）。深掘りに答えるたびにも少しずつ進む。
 * 深掘りでバーが止まって見えると、やめたくなる（2026-11-03 田村さん）
 * @param deepNo いま見せている深掘りが何回目か（元の問いなら 0）
 */
export function hearingProgress(current: number, total: number, deepNo: number, maxDeep: number): number {
  const inner = Math.min(Math.max(deepNo, 0), maxDeep) / (maxDeep + 1);
  return Math.min(total, Math.max(0, current) + inner);
}

/** 答えている人への励まし。答えるたびに言葉が変わる（count は答えた回数） */
export function hearingCheer({ remaining, deepNo, count }: { remaining: number; deepNo: number; count: number }): string {
  if (deepNo > 0) {
    const lines = [
      "いい答えです！しおりがもっと知りたくなっています",
      "その調子です。ほかの会社には書けないお話が集まっています",
      "この質問はもうすぐおしまいです。あと少しだけ",
      "答えは保存されています。疲れたら、あとからでも大丈夫です",
    ];
    return lines[count % lines.length];
  }
  if (remaining <= 1) return "これが最後の質問です！ここまで本当におつかれさまです";
  if (count === 0) return "1問ずつで大丈夫です。答えは自動で保存されます";
  const lines = [
    `進んでいますよ！あと${remaining}問です`,
    `がんばっていますね。あと${remaining}問で、記事の材料がそろいます`,
    "答えは保存されています。続きはあとからでも大丈夫です",
    `いいペースです。あと${remaining}問です`,
  ];
  return lines[count % lines.length];
}
