// AIOえらばれ帳のブランド。正本は docs/BRAND.md。/brand のページはここから表示する。ロゴは public/brand/。
// 2026-11-07 田村さん「ロゴ、ロゴガイドライン、ブランドコンセプト、理念、ミッションバリュー」。
// 同日「クオリティ低い。AIっぽい」→ GPT・Gemini・Claude にブランドのプロとして批評させ、作り直した（第2版）。
// 4つ角のきらめき・絵文字・角丸カード・「伴走」「〜な世の中へ」のような定型は使わない。
// サービスの定義（AIに選ばれたあと、人に選ばれることがいちばん大切）は src/lib/brand.ts と docs/AIO.md に合わせる。

import type { CSSProperties } from "react";

/** ひとこと（ロゴの横・SNSの絵に添える） */
export const BRAND_LINE = "現場の話を、選ばれる理由に。";

/** 何をするサービスか（ひとことの下に添える説明） */
export const BRAND_DESCRIPTOR = "町工場の仕事を聞きとり、AIにも、頼む人にも伝わる記事にする。";

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
  title: "現場で聞いた仕事の話を、頼む人が判断できる記事にする。",
  body: [
    "何ができるのか。どんな材質や数量に応えられるのか。精度を出すために、どこを工夫しているのか。頼む前に知りたいことを、社長や職人さんの話から記事にします。",
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
  { no: "03", title: "人が決める", text: "「この会社なら話が通じそうだ」と思えたとき、問い合わせが届きます。" },
];

/** AIについての正直な説明 */
export const BRAND_AI_NOTE = "AIの答えにのることや、問い合わせの数を約束することはできません。AIの検索は毎週のように変わるため、公式に発表されたことだけをもとに、確かめられたことと、まだわからないことを分けてお伝えします。";

/** 記事づくりの約束 */
export const BRAND_PROMISES = [
  { title: "実績や数字は、確かめられたものだけを書く。", text: "聞いていない経験や、確かめていない数字は書きません。AIにも、作り話をさせません。" },
  { title: "「すごい」より、何ができるかを書く。", text: "材質・大きさ・数量・納期・相談の中身。頼む前に知りたいことを、具体的にします。" },
  { title: "専門の言葉は、説明を添えて使う。", text: "正確さに必要な言葉は残し、はじめて読む人にもわかる一言を添えます。" },
  { title: "公開する前に、会社の人が確かめる。", text: "仕事をいちばん知っているのは、その会社の人です。読んで、直してから公開します。" },
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
  { file: "logo-horizontal-reverse", label: "カラー反転", use: "墨など、濃い地に。", bg: "sumi" },
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
  { name: "Zen Kaku Gothic New（ゼン角ゴシック）", weight: "Black・Bold", use: "ロゴ、大きな見出し", sample: "いい腕を、知り合いだけのものにしない。", font: "kaku" as const },
  { name: "Barlow Semi Condensed", weight: "Bold", use: "AIO、番号、寸法", sample: "AIO 01 02 03 — 120px", font: "barlow" as const },
  { name: "Zen Maru Gothic（ゼン丸ゴシック）", weight: "Medium・Bold", use: "サービスの画面の文章、案内役のせりふ", sample: "質問に答えるだけで、記事ができます。", font: "maru" as const },
];

/** ロゴの使い方 */
export const LOGO_RULES = {
  clearSpace: "ロゴのまわりには、表題欄の高さ（マークの高さの約5分の1）以上の余白をあけます。",
  minSize: [
    { label: "横組み", screen: "幅 120px 以上", print: "幅 25mm 以上" },
    { label: "縦組み", screen: "幅 80px 以上", print: "幅 18mm 以上" },
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
