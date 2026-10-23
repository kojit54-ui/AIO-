// 画面試作用の架空データ。実在の会社・人物ではない。
// 全状態（作成中・確認待ち・修正依頼・承認済み・公開済み）と、初期設定が未完了の会社を含む。

import type {
  Article,
  ArticleVersion,
  CoachingInternalNote,
  CoachingNote,
  FactCheck,
  Organization,
  Question,
  ReferenceArticle,
  Review,
  SessionUser,
  Theme,
} from "@/types/domain";

export const CURRENT_MONTH = "2026-10";

export const QUESTIONS: Question[] = [
  { id: "q1", label: "お客様から何を相談されましたか", example: "例：築30年の家で、冬になると脱衣所が寒くてつらいと相談された", tip: "実際にあった1件を思い出すと書きやすいです。お客様の名前は書かなくて大丈夫です。", aio: "experience" },
  { id: "q2", label: "実際にはどう対応しましたか", example: "例：床下に断熱材を入れ、窓を内窓にした。工事は2日", tip: "箇条書きで、やった順に並べてください。", aio: "qa" },
  { id: "q3", label: "結果はどうなりましたか（数値があれば）", example: "例：入浴前の寒さが気にならなくなったと言われた", tip: "お客様の言葉や、分かる範囲の数字があると説得力が上がります。", aio: "numbers" },
  { id: "q4", label: "注意点や、よくある誤解はありますか", example: "例：暖房器具を増やすだけでは結露が増えることがある", tip: "プロだから知っていることが、記事のいちばんの価値になります。", aio: "expertise" },
  { id: "q5", label: "この記事を読んだ人にしてほしいこと", example: "例：無料の住まい点検に申し込んでほしい", tip: "電話、フォーム、来店など。1つに絞ると伝わりやすいです。", aio: "action" },
];

export const FOLLOW_UP_QUESTION: Question = {
  id: "q2_followup",
  label: "具体的な場面を1つ教えてください",
  example: "例：昨年12月、70代のご夫婦から。見積もりのときに一番気にされていたのは工期",
  tip: "いつ、どんな人が、何に困っていたか。分かる所だけで大丈夫です。",
  aio: "experience",
};

export const USERS: SessionUser[] = [
  { id: "u_sakura", name: "佐藤（さくら住まい工房）", role: "client_member", organizationIds: ["org_sakura"] },
  { id: "u_minato", name: "高橋（みなと会計事務所）", role: "client_member", organizationIds: ["org_minato"] },
  { id: "u_hanamaru", name: "伊藤（はなまる歯科クリニック）", role: "client_member", organizationIds: ["org_hanamaru"] },
  { id: "u_coach", name: "コタム担当者A", role: "coach", organizationIds: ["org_sakura", "org_minato", "org_hanamaru"] },
];

export const ORGANIZATIONS: Organization[] = [
  {
    id: "org_sakura",
    name: "さくら住まい工房",
    profile: {
      business: "戸建て住宅のリフォーム（断熱・水回り・バリアフリー）",
      targetCustomers: "市内在住の50〜70代の持ち家世帯",
      strengths: "一級建築士が現地調査から施工管理まで担当する",
      tone: "ですます調。専門用語には短い説明を添える",
      bannedExpressions: "「業界最安」「絶対に」など根拠を示せない表現",
      contact: "無料の住まい点検（電話またはWebフォーム）",
    },
    profileApprovedAt: "2026-10-02T09:00:00+09:00",
    reviewPolicy: "optional",
    monthlyGenerationLimit: 30,
    generationsUsedThisMonth: 7,
  },
  {
    id: "org_minato",
    name: "みなと会計事務所",
    profile: {
      business: "個人事業主・小規模法人の税務会計",
      targetCustomers: "開業3年以内の個人事業主",
      strengths: "クラウド会計の導入から記帳指導まで対応",
      tone: "ですます調。断定を避け、制度名は正式名称で書く",
      bannedExpressions: "「必ず節税できる」など結果を保証する表現",
      contact: "初回30分の無料相談",
    },
    profileApprovedAt: "2026-10-05T10:00:00+09:00",
    reviewPolicy: "required",
    monthlyGenerationLimit: 30,
    generationsUsedThisMonth: 30,
  },
  {
    id: "org_hanamaru",
    name: "はなまる歯科クリニック",
    profile: null,
    profileApprovedAt: null,
    reviewPolicy: "optional",
    monthlyGenerationLimit: 30,
    generationsUsedThisMonth: 0,
  },
];

export const COACHING_NOTES: CoachingNote[] = [
  {
    id: "cn_sakura_10",
    organizationId: "org_sakura",
    targetMonth: CURRENT_MONTH,
    focus: "冬の住まいの寒さ対策",
    audience: "寒さや結露に悩む持ち家世帯",
    purpose: "住まい点検の申し込みにつなげる",
    avoid: "補助金額の断定、他社の批判",
    clientVisibleNote: "今月は「冬の寒さ」をテーマに、実際の施工事例を1つ取り上げましょう。お客様の言葉をそのまま使うと伝わりやすくなります。",
  },
  {
    id: "cn_minato_10",
    organizationId: "org_minato",
    targetMonth: CURRENT_MONTH,
    focus: "年末調整と確定申告の準備",
    audience: "初めて確定申告を迎える個人事業主",
    purpose: "無料相談の予約につなげる",
    avoid: "個別の税額の断定",
    clientVisibleNote: "12月までに準備できることを、実際の相談事例をもとに3つ程度に絞って紹介しましょう。",
  },
];

export const INTERNAL_NOTES: CoachingInternalNote[] = [
  {
    organizationId: "org_sakura",
    targetMonth: CURRENT_MONTH,
    note: "社長は事例記事に前向き。担当者の佐藤さんは文章に苦手意識あり。まず1本書き切ることを優先。",
  },
];

export const THEMES: Theme[] = [
  {
    id: "th_sakura_1",
    organizationId: "org_sakura",
    targetMonth: CURRENT_MONTH,
    title: "冬の脱衣所が寒い家でできること",
    readerProblem: "入浴前後の寒さがつらい、家族の体調が心配な人",
    message: "大がかりな工事をしなくても、床と窓の対策で寒さはやわらぐ",
    sortOrder: 1,
    source: "coach",
  },
  {
    id: "th_sakura_2",
    organizationId: "org_sakura",
    targetMonth: CURRENT_MONTH,
    title: "窓の結露を放っておくとどうなるか",
    readerProblem: "毎朝の結露拭きに疲れている人",
    message: "結露はカビや傷みの原因になる。原因に合った対策を選ぶことが大切",
    sortOrder: 2,
    source: "coach",
  },
  {
    id: "th_minato_1",
    organizationId: "org_minato",
    targetMonth: CURRENT_MONTH,
    title: "初めての確定申告、12月までに準備すること",
    readerProblem: "開業1年目で、何から手を付ければいいか分からない人",
    message: "領収書の整理と口座の分け方を今のうちに決めておくと、申告期に慌てない",
    sortOrder: 1,
    source: "coach",
  },
];

export const REFERENCE_ARTICLES: ReferenceArticle[] = [
  {
    id: "ref_sakura_1",
    organizationId: "org_sakura",
    title: "お風呂の段差をなくした事例",
    body: "先日、80代のお母様と暮らすご家族から、浴室の段差についてご相談をいただきました。……",
    url: "https://example.com/sakura/blog/bath-step",
    publishedOn: "2026-08-12",
    usableForAi: true,
  },
];

const sakuraAnswers = [
  { questionId: "q1", text: "築35年の平屋で、冬の脱衣所とお風呂が寒くてつらいと相談された", unknown: false },
  { questionId: "q2", text: "脱衣所の床下に断熱材を入れて、窓を内窓にした。工事は2日間", unknown: false },
  { questionId: "q3", text: "室温が5度ほど上がり、入浴前の寒さが気にならなくなったと言われた", unknown: false },
  { questionId: "q4", text: "ヒーターを足すだけだと結露が増えることがある", unknown: false },
  { questionId: "q5", text: "無料の住まい点検に申し込んでほしい", unknown: false },
];

const sakuraBody: ArticleVersion["body"] = [
  { type: "paragraph", text: "築35年の平屋にお住まいのお客様から、「冬になると脱衣所とお風呂が寒くてつらい」とご相談をいただきました。" },
  { type: "heading", level: 2, text: "ご相談の内容" },
  { type: "paragraph", text: "冬の入浴前後に寒さを強く感じるとのことでした。暖房器具を置くだけでは、なかなか暖まらないそうです。" },
  { type: "heading", level: 2, text: "行った対策" },
  { type: "list", ordered: false, items: ["脱衣所の床下に断熱材を入れる", "窓の内側にもう1枚窓を付ける（内窓）"] },
  { type: "paragraph", text: "工事は2日間で終わりました。" },
  { type: "heading", level: 2, text: "対策のあと" },
  { type: "paragraph", text: "室温が5度ほど上がり、「入浴前の寒さが気にならなくなった」とお声をいただきました。" },
  { type: "heading", level: 2, text: "気をつけたいこと" },
  { type: "paragraph", text: "ヒーターを足すだけだと、かえって結露が増えることがあります。" },
  { type: "heading", level: 2, text: "まずは住まいの点検から" },
  { type: "paragraph", text: "寒さの原因は家によって異なります。無料の住まい点検で、お住まいに合った対策をご提案します。" },
];

function version(id: string, articleId: string, no: number, extra: Partial<ArticleVersion> = {}): ArticleVersion {
  return {
    id,
    articleId,
    versionNo: no,
    title: "冬の脱衣所が寒い家でできること　築35年の平屋の事例",
    titleCandidates: [
      "冬の脱衣所が寒い家でできること　築35年の平屋の事例",
      "脱衣所の寒さは床と窓から　2日間の工事でできた対策",
      "お風呂前の寒さがつらい方へ　実際の対策と注意点",
    ],
    outline: sakuraBody.filter((b) => b.type === "heading").map((b) => ({ heading: (b as { text: string }).text })),
    body: sakuraBody,
    answers: sakuraAnswers,
    frozen: false,
    createdAt: "2026-10-15T10:00:00+09:00",
    createdBy: "u_sakura",
    isSample: true,
    ...extra,
  };
}

export const VERSIONS: ArticleVersion[] = [
  version("v_a2_1", "a2", 1, { frozen: true }),
  version("v_a3_1", "a3", 1, { frozen: true, title: "窓の結露を放っておくとどうなるか" }),
  version("v_a4_1", "a4", 1, { frozen: true, title: "結露対策の内窓、選び方のポイント" }),
  version("v_a5_1", "a5", 1, { frozen: true, title: "お風呂の段差をなくした事例" }),
  {
    ...version("v_a6_1", "a6", 1),
    title: "初めての確定申告、12月までに準備すること",
    titleCandidates: ["初めての確定申告、12月までに準備すること"],
    createdBy: "u_minato",
    body: [
      { type: "paragraph", text: "開業1年目のお客様から「確定申告の準備を何から始めればいいか分からない」とご相談をいただきました。" },
      { type: "heading", level: 2, text: "12月までに決めておきたいこと" },
      { type: "list", ordered: true, items: ["事業用の口座を分ける", "領収書の保管方法を決める"] },
    ],
    outline: [{ heading: "12月までに決めておきたいこと" }],
    answers: [],
  },
];

export const FACT_CHECKS: FactCheck[] = [
  ...["v_a2_1", "v_a3_1", "v_a4_1", "v_a5_1"].flatMap((v) => [
    { id: `fc_${v}_1`, versionId: v, excerpt: "築35年", kind: "number" as const, status: "confirmed" as const },
    { id: `fc_${v}_2`, versionId: v, excerpt: "室温が5度ほど上がり", kind: "number" as const, status: "unchecked" as const },
    { id: `fc_${v}_3`, versionId: v, excerpt: "工事は2日間", kind: "number" as const, status: "confirmed" as const },
  ]),
];

export const REVIEWS: Review[] = [
  {
    id: "r_a3_1",
    articleId: "a3",
    versionId: "v_a3_1",
    reviewerName: "コタム担当者A",
    comment: "結露がカビにつながる理由を、お客様のお宅で実際に見た様子で1文足してください。「5度」は測った値か体感か確認をお願いします。",
    decision: "changes_requested",
    createdAt: "2026-10-17T15:00:00+09:00",
  },
  {
    id: "r_a4_1",
    articleId: "a4",
    versionId: "v_a4_1",
    reviewerName: "コタム担当者A",
    comment: "とても読みやすいです。このまま公開して大丈夫です。",
    decision: "approved",
    createdAt: "2026-10-12T11:00:00+09:00",
  },
];

function article(id: string, org: string, theme: string, extra: Partial<Article>): Article {
  return {
    id,
    organizationId: org,
    themeId: theme,
    status: "drafting",
    currentVersionId: null,
    approvedVersionId: null,
    reviewRequestedVersionId: null,
    publishedUrl: null,
    publishedAt: null,
    publishedWithoutApproval: false,
    lockVersion: 0,
    updatedAt: "2026-10-18T09:00:00+09:00",
    ...extra,
  };
}

export const ARTICLES: Article[] = [
  // 書きかけ（質問の途中）
  article("a1", "org_sakura", "th_sakura_1", { updatedAt: "2026-10-19T18:00:00+09:00" }),
  article("a2", "org_sakura", "th_sakura_1", {
    status: "in_review",
    currentVersionId: "v_a2_1",
    reviewRequestedVersionId: "v_a2_1",
    updatedAt: "2026-10-18T12:00:00+09:00",
  }),
  article("a3", "org_sakura", "th_sakura_2", {
    status: "changes_requested",
    currentVersionId: "v_a3_1",
    updatedAt: "2026-10-17T15:00:00+09:00",
  }),
  article("a4", "org_sakura", "th_sakura_2", {
    status: "approved",
    currentVersionId: "v_a4_1",
    approvedVersionId: "v_a4_1",
    updatedAt: "2026-10-12T11:00:00+09:00",
  }),
  article("a5", "org_sakura", "th_sakura_1", {
    status: "published",
    currentVersionId: "v_a5_1",
    approvedVersionId: "v_a5_1",
    publishedUrl: "https://example.com/sakura/blog/bath-step",
    publishedAt: "2026-08-12T09:00:00+09:00",
    updatedAt: "2026-08-12T09:00:00+09:00",
  }),
  article("a6", "org_minato", "th_minato_1", {
    status: "drafting",
    currentVersionId: "v_a6_1",
    updatedAt: "2026-10-16T09:00:00+09:00",
  }),
];

/** 書きかけ記事 a1 の回答途中データ */
export const DRAFT_ANSWERS: Record<string, { answers: { questionId: string; text: string; unknown: boolean }[]; step: number }> = {
  a1: {
    answers: [{ questionId: "q1", text: "冬にお風呂場が寒いという相談が増えている", unknown: false }],
    step: 1,
  },
};
