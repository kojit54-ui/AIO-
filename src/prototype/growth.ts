// 「育つブログ」の試作（第1段階）。docs/DECISIONS.md 2026-10-23「仕切り直し」。
// ヒアリング → キーワードの提案 → ピラーとクラスター → キーワード管理表 → レベルアップ、の考え方だけを持つ。
// AIは未接続。提案と深掘りの質問は、決まった規則で作るサンプル。保存はブラウザの中だけ。

export const SAMPLE_LABEL = "サンプル（AIは未接続）";

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
    deepDives: ["いちばん依頼が多いお仕事は何ですか", "反対に、受けていないお仕事はありますか"],
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
    tip: "実際によく来るお客様を1人思い浮かべてください。年代、家族、きっかけなど。",
    deepDives: ["そのお客様は、何がきっかけで相談に来られますか", "依頼の前に、どんなことで迷われていましたか"],
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
    tip: "お客様に言われてうれしかった言葉を思い出すと書きやすいです。",
    deepDives: ["その強みが伝わったお客様の、具体的なエピソードを1つ教えてください", "その強みを数字で表せますか（年数、件数など）"],
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
  /** AIが返した深掘りの質問と、その答え */
  followUps: { question: string; answer: string }[];
}

/** 答えを書き直す。中身が変わったら、前の答えへの深掘りは消して聞き直す */
export function withNewText(prev: HearingAnswer, text: string): HearingAnswer {
  const next = text.trim();
  return { ...prev, text: next, followUps: next === prev.text.trim() ? prev.followUps : [] };
}

/** 深掘りは1問につき2回まで */
export const MAX_DEEP_DIVES = 2;

/**
 * 答えが短いときに返す深掘りの質問。無ければ null。
 * 本物のAIでは答えの中身を読んで質問を作る。試作では「短い（30字未満）」「1行だけ」を目安にする
 */
export function nextDeepDive(question: HearingQuestion, answer: HearingAnswer | undefined): string | null {
  if (!answer || !answer.text.trim()) return null;
  const asked = answer.followUps.length;
  if (asked >= MAX_DEEP_DIVES || asked >= question.deepDives.length) return null;
  const all = [answer.text, ...answer.followUps.map((f) => f.answer)].join("\n").trim();
  const lines = all.split(/\n|、|。|／/).filter((l) => l.trim()).length;
  const thin = Array.from(all).length < 30 * (asked + 1) || lines < 2 + asked;
  return thin ? question.deepDives[asked] : null;
}

export function answeredCount(answers: Record<string, HearingAnswer>) {
  return HEARING_QUESTIONS.filter((q) => answers[q.id]?.text.trim()).length;
}

/** キーワードの提案を作るのに必要な答え */
export const REQUIRED_FOR_PROPOSALS = ["business", "services", "customers", "area"];
export const canPropose = (answers: Record<string, HearingAnswer>) => REQUIRED_FOR_PROPOSALS.every((id) => answers[id]?.text.trim());

export type ProposalReason = "sales" | "competition" | "aio";
export const REASON_LABEL: Record<ProposalReason, string> = {
  sales: "売上につながる",
  competition: "競合に勝てる",
  aio: "AI検索で紹介されやすい",
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
      why: `売りたい「${service}」を、地域名と一緒に探す人に向けた組み立てです。依頼の直前に読まれる記事が中心です。`,
    },
    {
      id: "p_compare",
      pillar: k("p_compare_0", `${service} 選び方`, `${service}の会社をどう選べばよいか`),
      clusters: [
        k("p_compare_1", `${service} 比較`, "頼み先ごとの違い"),
        k("p_compare_2", `${service} 見積もり 見方`, "見積もりで確かめるところ"),
        k("p_compare_3", `${business} 相談 タイミング`, "いつ相談すればよいか"),
        k("p_compare_4", `${service} 保証`, "工事の後の保証や点検"),
      ],
      reasons: ["competition", "sales"],
      why: "よく比べられる相手との違いを、読む人の判断基準として伝える組み立てです。選ばれる理由が生きます。",
    },
    {
      id: "p_faq",
      pillar: k("p_faq_0", `${business} よくある質問`, `${business}を頼む前に知っておきたいこと`),
      clusters: [
        ...faqs.map((f, i) => k(`p_faq_${i + 1}`, f.replace(/[？?]$/, ""), `「${f.replace(/[？?]$/, "")}」への答え`)),
        k(`p_faq_${faqs.length + 1}`, `${business} 流れ`, "相談から完了までの流れ"),
        k(`p_faq_${faqs.length + 2}`, `${business} 注意点`, "頼む前に気をつけること"),
      ],
      reasons: ["aio"],
      why: "お客様の質問にそのまま答える組み立てです。質問と答えがはっきりした記事は、AI検索で紹介されやすくなります。",
    },
  ];
}

export type RowStatus = "todo" | "writing" | "published";
export const ROW_STATUS_LABEL: Record<RowStatus, string> = { todo: "まだ", writing: "書いている", published: "公開済み" };

export interface KeywordRow extends KeywordIdea {
  kind: "pillar" | "cluster";
  status: RowStatus;
}

export interface KeywordPlan {
  proposalId: string;
  rows: KeywordRow[];
}

export function planFromProposal(p: PillarProposal): KeywordPlan {
  return {
    proposalId: p.id,
    rows: [{ ...p.pillar, kind: "pillar", status: "todo" }, ...p.clusters.map((c) => ({ ...c, kind: "cluster" as const, status: "todo" as const }))],
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
  const rows = plan?.rows ?? [];
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
      { id: "hearing", label: "ヒアリングを終えた", earned: hearingDone },
      { id: "first", label: "最初の記事を公開した", earned: published.length > 0 },
      { id: "pillar", label: "柱の記事を公開した", earned: pillarPublished },
      { id: "five", label: "周りの記事を5本公開した", earned: clustersPublished >= 5 },
      { id: "all", label: "設計図を全部埋めた", earned: rows.length > 0 && published.length === rows.length && clusters > 0 },
    ],
  };
}

export interface ArticleQuestion {
  id: string;
  label: string;
  aio: AioPoint;
  example: string;
  tip: string;
}

/** 1本の記事を書くときの一問一答。キーワードの「読む人が知りたいこと」に合わせて言い方を変える */
export function articleQuestions(row: KeywordIdea): ArticleQuestion[] {
  return [
    { id: "a1", label: `「${row.question}」について、お客様からどんな相談がありましたか`, aio: "experience", example: "例：去年の冬、70代のご夫婦から「脱衣所が寒い」と相談された", tip: "実際にあった1件を思い出すと書きやすいです。名前は書かなくて大丈夫です。" },
    { id: "a2", label: "そのとき、どう答えましたか・どう対応しましたか", aio: "qa", example: "例：・まず現地で窓と床を見た\n・内窓を提案した\n・工事は1日", tip: "箇条書きで大丈夫です。順番どおりに並べてください。" },
    { id: "a3", label: "結果はどうでしたか", aio: "numbers", example: "例：お風呂に入る前の寒さが気にならなくなったと言われた", tip: "お客様の言葉や、分かる範囲の数字があると記事の説得力が上がります。" },
    { id: "a4", label: "よくある誤解や、気をつけることはありますか", aio: "expertise", example: "例：暖房を増やすだけでは結露が増えることがある", tip: "プロだから知っていることが、記事のいちばんの価値になります。" },
    { id: "a5", label: "読んだ人に、次に何をしてほしいですか", aio: "action", example: "例：無料の住まい点検に申し込んでほしい", tip: "電話、フォーム、来店など。1つに絞ると伝わりやすいです。" },
  ];
}

