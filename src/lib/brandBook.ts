// AIOえらばれ帳のブランド。正本は docs/BRAND.md。/brand のページはここから表示する。ロゴは public/brand/。
// 2026-11-07 田村さん「ロゴ、ロゴガイドライン、ブランドコンセプト、理念、ミッションバリュー」。
// 同日「クオリティ低い。AIっぽい」→ GPT・Gemini・Claude にブランドのプロとして批評させ、作り直した（第2版）。
// 4つ角のきらめき・絵文字・角丸カード・「伴走」「〜な世の中へ」のような定型は使わない。
// サービスの定義（AIに選ばれたあと、人に選ばれることがいちばん大切）は src/lib/brand.ts と docs/AIO.md に合わせる。

import type { CSSProperties } from "react";

// 2026-11-07 第4版の言葉：田村さん「3者が9.5点になるまで」→ GPT 9.5・Gemini 9.7・Claude 9.5 で合意。

/** ブランドの芯（社内の判断基準。迷ったらここに戻る） */
export const BRAND_ESSENCE = "頼む人のための、仕事の聞き書き。";

/** ひとこと（ロゴの横・SNSの絵に添える） */
export const BRAND_LINE = "いつもの仕事を、誰かの頼む理由に。";

/** ひとことの下に添える説明（何をするか、どう進むか） */
export const BRAND_DESCRIPTOR = "質問に答えると、AIが記事に。社長が確かめ、自社のホームページへ。毎月1本、仕事の話を書きためます。";

/** 答え方（02の導入に添える） */
export const BRAND_HOW = "声でも文字でも、写真1枚からでも。";

/** ボディコピー（ブランドの考えを、社長に向けて） */
export const BRAND_BODY = [
  "どんな仕事ができるのか。どこを工夫しているのか。どんな条件なら引き受けられるのか。",
  "社長にとっては当たり前のことが、まだ会ったことのないお客様には、いちばん知りたいことです。",
  "案内役の質問に答えると、その話をAIが記事にします。社長が読み、直して、自社のホームページで公開します。",
  "毎月1本ずつ増えていく記事は、AIに会社の仕事を伝える手がかりに。そして、読んだ人が「ここに頼めるか」を判断する材料になります。",
];
export const BRAND_BODY_CLOSE = "毎月1本、綴じた分だけ、会社の厚みになる。それが、えらばれ帳です。";

/** 「帳」とは何か（名前の理由） */
export const BRAND_LEDGER = {
  title: "自社のホームページに毎月書きためていく、会社の「仕事の台帳」。",
  body: "何ができるか、何を工夫しているか、どんな条件で頼めるかを、ひとつずつ残していく。記事は1本で終わる宣伝ではなく、綴じるほど厚くなる会社の記録です。",
};

/** 読み方 */
export const BRAND_READING = "エーアイオー えらばれちょう";

/** 理念（なぜやるか） */
export const BRAND_PHILOSOPHY = {
  title: "いい腕を、知り合いだけのものにしない。",
  body: [
    "長い付き合いのお客様は、その会社の腕をよく知っています。けれど、まだ会ったことのない人には、その腕が見えていません。",
    "宣伝のうまい会社ばかりが目立って、まじめに仕事を積み上げてきた会社が「知られていない」だけで見過ごされる。それを終わらせたいと考えています。",
  ],
};

/** ミッション（何をするか） */
export const BRAND_MISSION = {
  title: "現場の話を聞き、頼む人が判断できる記事を、社長といっしょに書きためる。",
  body: [
    "何ができるのか。どんな材質や数量に応えられるのか。精度を出すために、どこを工夫しているのか。頼む前に知りたいことを、社長や職人さんの話から記事にします。書くのはAIでも、確かめて世に出すのは社長です。",
    "AIの検索で見つけてもらう工夫もします。ただ、最後に「ここに頼もう」と決めるのは人です。AIに選ばれたあと、人に選ばれること。いちばん大切にしているのは、そこです。",
  ],
};

/** 設備の一覧だけでは伝わらないこと（よくある紹介文 → 頼む人が知りたいこと） */
export const BRAND_GAP = {
  common: ["高精度・短納期", "多品種・小ロットに対応", "お客様第一、まごころ込めて", "最新の設備を完備"],
  wanted: [
    { q: "図面が固まる前でも、相談できるか", a: "試作の段階から相談にのった例と、そのときの進め方" },
    { q: "うちの材質・寸法・数量を受けてもらえるか", a: "よく受ける材質と大きさ、1個から何個までか" },
    { q: "精度はどうやって出しているのか", a: "測り方、治具の工夫、ベテランが見ているところ" },
    { q: "難しいと言われたら、どうなるのか", a: "できない条件と、そのときに代わりに出せる案" },
  ],
};

/** 話が記事になるまでの見本（架空の会社） */
export const BRAND_SAMPLE = {
  company: "見本：架空の金属加工会社",
  talk: [
    { who: "guide", text: "最近、お客様に「助かった」と言われた仕事はありますか？" },
    { who: "user", text: "ステンレスの薄い板、1ミリのやつ。溶接すると曲がるって、よそで断られたのをうちでやった" },
    { who: "guide", text: "曲がらないように、どんな工夫をしたんですか？" },
    { who: "user", text: "治具を自分で作って、少しずつ点で付けていく。冷ましながら。時間はかかるけど" },
  ],
  article: {
    heading: "厚さ1mmのステンレスを、ゆがませずに溶接するには",
    body: "厚さ1mmのステンレスは、溶接の熱でゆがみやすい材料です。この仕事では、自分たちで作った治具（部品を動かないように固定する道具）を使い、少しずつ点で溶接しては冷ます方法をとりました。時間はかかりますが、熱のかかり方に気を配りながら進めています。",
  },
};

/** AIと人の2つの段階（工程表の形で見せる） */
export const BRAND_STEPS = [
  { no: "01", title: "AIが探す", text: "発注先をAIに相談する人が増えています。記事では、できる材質・数量・仕事の進め方を具体的に書き、AIが候補を探すときの手がかりを整えます。" },
  { no: "02", title: "人が読む", text: "記事を読んだ人が、できることと、その裏づけを確かめます。" },
  { no: "03", title: "人が決める", text: "「この会社なら話が通じそうだ」と思えるか。記事を読んだ人が、相談するかどうかを判断します。" },
];

/** AIについての正直な説明 */
export const BRAND_AI_NOTE = "AIの回答で紹介されることや、問い合わせが増えることは約束できません。AIの検索は毎週のように変わるため、公式に発表されたことだけをもとに、確かめられたことと、まだわからないことを分けてお伝えします。";

/** 記事づくりの約束 */
export const BRAND_PROMISE_HEADING = "頼む人に、正直な帳面を。";

export const BRAND_PROMISES = [
  { title: "実績や数字は、確かめられたことだけ。", text: "聞いていない経験や、確かめていない数字は書きません。AIにも、作り話をさせません。" },
  { title: "「すごい」より、何ができるかを書く。", text: "材質・大きさ・数量・納期・相談の中身。頼む前に知りたいことを、具体的にします。" },
  { title: "専門の言葉には、説明を添える。", text: "正確さに必要な言葉は残し、はじめて読む人にもわかる一言を添えます。" },
  { title: "公開する前に、社長の目で確かめる。", text: "仕事をいちばん知っているのは、その会社の人です。社長や担当の方が読んで、直してから公開します。" },
  { title: "できないことや条件も、正直に書く。", text: "「ここまではできる」がはっきりしている会社が、いちばん信用されます。" },
];

/** 話し方 */
export const BRAND_VOICE = {
  summary: "現場の人と話すときの言葉で話します。短く、具体的に。できたことはちゃんとほめ、止まっているときは、はっきり声をかけます。",
  dos: ["です・ます で、1文を短く", "まず結論、次に理由を1つ", "数字や材料の名前など、具体的なことばを使う"],
  donts: ["「伴走」「寄り添う」「〜な世の中へ」のような決まり文句", "「必ず上位に」「絶対に紹介される」という約束", "カタカナの専門語だけで済ませる（コンテンツ、エンゲージメント など）"],
};

/** ロゴの成り立ち */
export const LOGO_STORY = "現場で使う帳面（野帳）をもとにしました。仕事の記録に、選ばれた印としてしおりを1本。AIを表す記号は、あえて入れていません。";

export const LOGO_PARTS = [
  { no: "1", name: "藍の表紙", text: "作業着や図面の青。長く使える、頼れる道具の色です。" },
  { no: "2", name: "背の溝", text: "綴じた背。小さくしても帳面に見える目じるしです。" },
  { no: "3", name: "表題欄", text: "会社の名前を書く欄。その会社だけの記録です。" },
  { no: "4", name: "真鍮のしおり", text: "お客様が選んだページの印。案内役「しおり」の名前のもとです。" },
];

export type LogoFile = { file: string; label: string; use: string; bg: "paper" | "white" | "indigo" | "sumi"; tall?: boolean; square?: boolean };

/** ロゴの種類（public/brand/ に SVG と PNG がある） */
export const LOGO_VARIANTS: LogoFile[] = [
  { file: "logo-horizontal", label: "横組み（基本）", use: "ホームページ、資料、名刺。迷ったらこれ。", bg: "white" },
  { file: "logo-vertical", label: "縦組み", use: "正方形に近い場所、チラシの中央、看板。", bg: "paper", tall: true },
  { file: "logo-mark", label: "マーク", use: "SNSのアイコン、小さな場所。", bg: "white", square: true },
  { file: "app-icon", label: "アプリのアイコン", use: "スマホのホーム画面、ブラウザのタブ。", bg: "white", square: true },
];

/** 色の種類 */
export const LOGO_COLORWAYS: LogoFile[] = [
  { file: "logo-horizontal", label: "カラー", use: "白・生成りの地に。", bg: "white" },
  { file: "logo-horizontal-reverse", label: "カラー反転", use: "墨など、濃い地に。表紙と文字は生成り、真鍮はしおりだけ。", bg: "sumi" },
  { file: "logo-horizontal-white", label: "白1色", use: "藍の地や、写真の上に。", bg: "indigo" },
  { file: "logo-horizontal-ink", label: "墨1色", use: "白黒の印刷、FAX、ゴム印。", bg: "white" },
];

/** ブランドの色。藍はロゴと骨格、明るい青は画面の中で押す所 */
export const BRAND_COLORS = [
  { name: "藍", hex: "#1e4f7c", rgb: "30, 79, 124", role: "ロゴ、見出し、ヘッダーなどの骨格", text: "#ffffff" },
  { name: "真鍮", hex: "#e9b53b", rgb: "233, 181, 59", role: "しおり、確かめてほしい所。少しだけ", text: "#1f2a33" },
  { name: "生成り", hex: "#f7f4ec", rgb: "247, 244, 236", role: "ブランドの紙面、読みものの地", text: "#1f2a33" },
  { name: "墨", hex: "#1f2a33", rgb: "31, 42, 51", role: "文字、罫線。真っ黒は使わない", text: "#ffffff" },
  { name: "画面の青", hex: "#2f6fdb", rgb: "47, 111, 219", role: "サービスの画面で、押すボタン・リンク", text: "#ffffff" },
];

/** 書体 */
export const BRAND_FONTS = [
  { name: "Zen Kaku Gothic New（ゼン角ゴシック）", weight: "Black・Bold", use: "ロゴと見出し。Regular・Medium はブランドの紙面・資料・記事の見本の本文", sample: "いい腕を、知り合いだけのものにしない。", font: "kaku" as const },
  { name: "Barlow Semi Condensed", weight: "Bold", use: "AIO、番号、寸法", sample: "AIO 01 02 03 — 120px", font: "barlow" as const },
  { name: "Zen Maru Gothic（ゼン丸ゴシック）", weight: "Medium・Bold", use: "サービスの操作案内と、案内役のせりふ。記事や資料の本文には使わない", sample: "質問に答えるだけで、記事ができます。", font: "maru" as const },
];

/** ロゴの使い方 */
export const LOGO_RULES = {
  clearSpace: "ロゴのまわりには、表題欄の高さ（マークの高さの約5分の1）以上の余白をあけます。",
  minSize: [
    { label: "横組み", screen: "幅 160px 以上（それより狭い所はマークだけ）", print: "幅 30mm 以上（実寸で確かめるまでの目安）" },
    { label: "縦組み", screen: "幅 128px 以上", print: "幅 25mm 以上" },
    { label: "マーク", screen: "24px 以上", print: "6mm 以上" },
    { label: "16px用", screen: "ブラウザのタブだけ（favicon-16）", print: "使わない" },
  ],
  writing: [
    { ok: true, text: "AIOえらばれ帳" },
    { ok: false, text: "AIO えらばれ帳（すきまを空けない）" },
    { ok: false, text: "aioえらばれ帳（AIOは大文字）" },
    { ok: false, text: "AIOエラバレ帳／AIO選ばれ帳（ひらがなで書く）" },
  ],
};

/** やってはいけないこと。style はロゴにかける崩し方（見本用） */
export const LOGO_DONTS: { label: string; style: CSSProperties }[] = [
  { label: "伸ばす・つぶす", style: { transform: "scaleX(1.4)" } },
  { label: "かたむける", style: { transform: "rotate(-12deg)" } },
  { label: "色を変える", style: { filter: "hue-rotate(150deg) saturate(1.6)" } },
  { label: "影やふちを付ける", style: { filter: "drop-shadow(4px 4px 0 #b42318)" } },
  { label: "読みにくい地に置く", style: { background: "repeating-linear-gradient(45deg,#1e4f7c 0 8px,#e9b53b 8px 16px)" } },
  { label: "うすくする", style: { opacity: 0.3 } },
];
