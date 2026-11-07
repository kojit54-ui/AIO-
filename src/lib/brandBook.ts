// AIOえらばれ帳のブランド（2026-11-07 田村さん「ロゴ、ロゴガイドライン、ブランドコンセプト、理念、ミッションバリュー」）。
// 正本は docs/BRAND.md。/brand のページはここから表示する。ロゴの元データは public/brand/。
// サービスの定義（AIに選ばれて、これから出会うお客様に選ばれる会社へ）は src/lib/brand.ts と docs/AIO.md に合わせる。

import type { CSSProperties } from "react";
import { SERVICE_PROMISE } from "@/lib/brand";

/** 読み方 */
export const BRAND_READING = "エーアイオー えらばれちょう";

/** ブランドコンセプト（ひとことと、その説明） */
export const BRAND_CONCEPT = {
  title: "「ここに頼みたい」を、1ページずつ書きためる帳面。",
  body: [
    "ものづくりの会社の強みは、現場の人の頭と手の中にあります。どんな工夫をして、どんな失敗を乗りこえて、どんなお客様に喜ばれてきたか。けれど、それはなかなか言葉になりません。",
    "AIOえらばれ帳は、案内役の質問に答えるだけで、その強みを「AIにも、人にも伝わる言葉」に変えて、1ページずつ書きためていく帳面です。",
    "AIに紹介されることは入口です。ゴールは、紹介されて読みに来たお客様が、たくさんのページの中から、あなたの会社のページにしおりをはさむこと。「ここに頼みたい」と思ってもらうことです。",
  ],
};

/** 名前に込めたこと */
export const BRAND_NAME_PARTS = [
  { word: "AIO", text: "AIの答えの中で、会社が紹介されるための工夫。AI時代の新しい入口です。" },
  { word: "えらばれ", text: "AIに選ばれ、そのあと、これから出会うお客様に選ばれる。2つの「選ばれる」です。" },
  { word: "帳", text: "1回で終わらず、毎月書きためていく帳面。続けるほど、会社の厚みになります。" },
];

/** 理念 */
export const BRAND_PHILOSOPHY = {
  title: "まじめな、いい仕事が、ちゃんと選ばれる世の中へ。",
  body: "腕も誠意もあるのに、知られていないだけで選ばれない。そんな会社を、ひとつでも減らしたい。AIが答えを出す時代だからこそ、本当にいい仕事をしている会社が、正しく見つけられ、選ばれるようにします。",
};

/** ミッション（ひとことは SERVICE_PROMISE と同じ） */
export const BRAND_MISSION = {
  title: SERVICE_PROMISE,
  body: "ものづくりの会社が、AIに紹介され、記事を読んだお客様に「ここに頼みたい」と思ってもらえるまで、いっしょに走ります。むずかしいことはこちらが引き受け、会社の人には、答えることと、続けることだけをお願いします。",
};

/** バリュー（大切にすること）。画面・質問・AIへの指示を作るときの判断のよりどころ */
export const BRAND_VALUES: { icon: string; title: string; text: string; inService: string }[] = [
  {
    icon: "🤝",
    title: "人に選ばれることを、いちばんに。",
    text: "AIのための工夫で、読む人の気持ちを置き去りにしません。最後に選ぶのは、いつも人です。",
    inService: "記事の点検は「AIに紹介されるか」と「読んだ人が頼みたくなるか」の2段で見ます。",
  },
  {
    icon: "🔩",
    title: "本当のことだけを書く。",
    text: "経験・数字・お客様の声は、会社の人が話したことだけ。AIに作らせません。",
    inService: "AIには「答えにない経験や数字を作らない」と約束させて書いています。",
  },
  {
    icon: "🌱",
    title: "むずかしい言葉を使わない。",
    text: "専門語より、やることを伝えます。パソコンが苦手な人でも、ひとりで進められるように。",
    inService: "質問には「なぜ聞くのか」を必ず添え、1回に1つだけ聞きます。",
  },
  {
    icon: "🏃",
    title: "一歩ずつ、ずっと伴走する。",
    text: "一度に全部は求めません。月に1本、小さく続けることが、いちばんの近道です。",
    inService: "すごろく・スタンプ帳・しおり通信で、続けたくなる仕組みを用意しています。",
  },
  {
    icon: "🔍",
    title: "最新を、正直に。",
    text: "AIOの情報は、公式の発表だけをもとにします。分からないことは、分からないと言います。",
    inService: "AIOの知識は毎週見直し、出どころのある情報だけを使います。",
  },
];

/** 話し方（ブランドの人柄） */
export const BRAND_VOICE = {
  summary: "明るく、やさしく、ときどきちょっとだけ厳しめ。となりで一緒に考える先輩のように話します。",
  dos: ["です・ます で、短い文で話す", "まず結論、次に理由を1つだけ", "できたことは、ちゃんとほめる", "止まっているときは、はっきり声をかける"],
  donts: ["カタカナの専門語を、そのまま使う（例：コンテンツ、エンゲージメント）", "「必ず上位に」「絶対に紹介される」と約束する", "相手を急かしたり、責めたりする"],
};

/** ロゴの部品と意味 */
export const LOGO_PARTS = [
  { color: "var(--color-brand)", name: "青い帳面", text: "毎月書きためていく記事。会社の強みが1ページずつ厚くなっていきます。" },
  { color: "var(--color-sun)", name: "黄色いしおり", text: "お客様が「ここだ」とはさむ印。そして、ずっと伴走する案内役のしおりです。" },
  { color: "#ffffff", name: "白いきらめき", text: "AI。AIの答えの中で、会社が見つけられることを表します。" },
  { color: "var(--color-sun)", name: "小さな星", text: "これから出会うお客様。AIに選ばれた先に、人との出会いがあります。" },
];

export type LogoFile = { file: string; label: string; use: string; dark?: boolean; tall?: boolean };

/** ロゴの種類（public/brand/ に SVG と PNG がある） */
export const LOGO_VARIANTS: LogoFile[] = [
  { file: "logo-horizontal", label: "横組み（基本）", use: "ホームページ、資料、名刺など。迷ったらこれを使います。" },
  { file: "logo-vertical", label: "縦組み", use: "正方形に近い場所、チラシの中央、看板など。", tall: true },
  { file: "logo-mark", label: "マーク", use: "アイコン、SNSのプロフィール、小さな場所。" },
  { file: "app-icon", label: "アプリのアイコン", use: "スマホのホーム画面、ブラウザのタブ。" },
];

/** 色の種類 */
export const LOGO_COLORWAYS: LogoFile[] = [
  { file: "logo-horizontal", label: "カラー", use: "白・うすい色の背景に。いちばん多く使います。" },
  { file: "logo-horizontal-reverse", label: "カラー反転", use: "紺など、濃い色の背景に。", dark: true },
  { file: "logo-horizontal-white", label: "白1色", use: "ブランドの青や写真の上に。", dark: true },
  { file: "logo-horizontal-ink", label: "黒1色", use: "白黒の印刷、FAX、はんこ。" },
];

/** ブランドの色。割合の目安は 背景60・青30・黄10 */
export const BRAND_COLORS = [
  { name: "えらばれブルー", hex: "#2f6fdb", rgb: "47, 111, 219", role: "ロゴの帳面、ボタン、見出し。いちばん大事な色", dark: true },
  { name: "濃いブルー", hex: "#2258b8", rgb: "34, 88, 184", role: "帳面の背、押したときのボタン", dark: true },
  { name: "しおりイエロー", hex: "#ffc93c", rgb: "255, 201, 60", role: "しおり、星、ほめるとき。少しだけ使う" },
  { name: "そらいろ", hex: "#9bd3ff", rgb: "155, 211, 255", role: "帳面のページ、かざり" },
  { name: "すみいろ", hex: "#1f2b3d", rgb: "31, 43, 61", role: "文字。真っ黒は使わない", dark: true },
  { name: "あさのそら", hex: "#f2f8ff", rgb: "242, 248, 255", role: "画面や資料の背景" },
];

/** 書体 */
export const BRAND_FONTS = [
  { name: "Zen Maru Gothic（ゼン丸ゴシック）", weight: "900（いちばん太い）", use: "ロゴ・見出し", sample: "AIに選ばれて、お客様に選ばれる。", className: "font-black" },
  { name: "Zen Maru Gothic（ゼン丸ゴシック）", weight: "500・700", use: "本文・説明", sample: "質問に答えるだけで、記事ができます。", className: "font-medium" },
];

/** ロゴの使い方のルール */
export const LOGO_RULES = {
  clearSpace: "ロゴのまわりには、マークの高さの4分の1以上の余白をあけます（しおりの幅くらい）。文字や写真、ふちを近づけません。",
  minSize: [
    { label: "横組み", screen: "画面で幅 120px 以上", print: "印刷で幅 25mm 以上" },
    { label: "縦組み", screen: "画面で幅 80px 以上", print: "印刷で幅 18mm 以上" },
    { label: "マーク", screen: "画面で 16px 以上", print: "印刷で 5mm 以上" },
  ],
  writing: [
    { ok: true, text: "AIOえらばれ帳" },
    { ok: false, text: "AIO えらばれ帳（すきまを空けない）" },
    { ok: false, text: "aioえらばれ帳（AIOは大文字）" },
    { ok: false, text: "AIOエラバレ帳／AIO選ばれ帳（ひらがなで書く）" },
  ],
};

/** やってはいけないこと。style はロゴの絵にかける崩し方（見本用） */
export const LOGO_DONTS: { label: string; style: CSSProperties }[] = [
  { label: "伸ばす・つぶす", style: { transform: "scaleX(1.45)" } },
  { label: "かたむける", style: { transform: "rotate(-14deg)" } },
  { label: "色を変える", style: { filter: "hue-rotate(140deg)" } },
  { label: "影やふちを付ける", style: { filter: "drop-shadow(5px 5px 0 #b42318)" } },
  { label: "読みにくい背景に置く", style: { background: "repeating-linear-gradient(45deg,#2f6fdb 0 10px,#ffc93c 10px 20px)" } },
  { label: "うすくする", style: { opacity: 0.3 } },
];
