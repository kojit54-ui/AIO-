// 案内役を選べるようにする（2026-11-07 田村さん「しおりだけじゃなくて、男の人と、キャラクターを選べるようにしたい」）。
// 絵は public/guide/<id>-<表情>.webp（高さ400px、透過）。男の人とオコジョは Gemini（gemini-3.1-flash-image）で作った。
// 男の人は田村さんの参考（落ち着いた大人の男性の雰囲気）をもとにした、オリジナルの人物。実在の作品の人物には似せない。
// 2026-11-07 田村さん「ベテラン職人いいね」「もうちょい白髪」「スーツ着たり、作業着着たり」→ 源さんを白髪まじりの職人にし、服装を選べるようにした。

export type GuideId = "shiori" | "gen" | "koyuki";

export interface GuideCharacter {
  id: GuideId;
  /** 画面での呼び名 */
  name: string;
  /** 選ぶときの説明 */
  note: string;
  /** 絵のファイル名の頭 */
  file: string;
  /** 着がえられる服。最初のものがふだんの服。空なら着がえない */
  outfits: Outfit[];
}

export interface Outfit {
  id: string;
  /** 選ぶときの名前 */
  label: string;
  /** 絵のファイル名の頭（例 shiori-work）。ふだんの服は案内役の file と同じ */
  file: string;
}

/** 季節で着がえる「おまかせ」 */
export const AUTO_OUTFIT = "auto";

export const GUIDES: GuideCharacter[] = [
  {
    id: "shiori",
    name: "しおり",
    note: "ちょっと厳しめの、頼れるお姉さん",
    file: "shiori",
    outfits: [
      { id: "suit", label: "スーツ", file: "shiori" },
      { id: "work", label: "作業着", file: "shiori-work" },
      { id: "casual", label: "カジュアル", file: "shiori-casual" },
      { id: "winter", label: "冬のコート", file: "shiori-winter" },
      { id: "summer", label: "夏の半そで", file: "shiori-summer" },
      { id: "gym", label: "体操着", file: "shiori-gym" },
      { id: "out", label: "お出かけ", file: "shiori-out" },
    ],
  },
  {
    id: "gen",
    name: "源さん",
    note: "白髪まじりの、ベテラン職人",
    file: "gen",
    outfits: [
      { id: "work", label: "作業着", file: "gen" },
      { id: "suit", label: "スーツ", file: "gen-suit" },
      { id: "gym", label: "体操着", file: "gen-gym" },
      { id: "out", label: "お出かけ", file: "gen-out" },
    ],
  },
  { id: "koyuki", name: "こゆき", note: "本物そっくりのオコジョ。怒るとこわい", file: "koyuki", outfits: [] },
];

export const DEFAULT_GUIDE: GuideId = "shiori";

export const isGuideId = (v: unknown): v is GuideId => GUIDES.some((g) => g.id === v);

export const guideOf = (id: GuideId): GuideCharacter => GUIDES.find((g) => g.id === id) ?? GUIDES[0];

/** おまかせのときの服：6〜9月は夏、12〜2月は冬、それ以外はふだんの服（その服がない案内役はふだんの服） */
export function seasonalOutfit(guide: GuideCharacter, month: number): Outfit | undefined {
  const want = month >= 6 && month <= 9 ? "summer" : month === 12 || month <= 2 ? "winter" : "";
  return guide.outfits.find((o) => o.id === want) ?? guide.outfits[0];
}

/** 選んだ服（id か "auto"）から、使う服を決める。知らない id はふだんの服 */
export function resolveOutfit(guide: GuideCharacter, picked: string | undefined, month: number): Outfit | undefined {
  if (picked === AUTO_OUTFIT) return seasonalOutfit(guide, month);
  return guide.outfits.find((o) => o.id === picked) ?? guide.outfits[0];
}

/** 絵のファイル名の頭。ジャージの3つは服に関係なく案内役の file を使う */
export function guideFile(guide: GuideCharacter, outfit: Outfit | undefined, mood: string): string {
  if (!outfit || mood.startsWith("jersey")) return guide.file;
  return outfit.file;
}

/**
 * 画面の言葉の「しおり」を、選んだ案内役の名前にする（2026-11-07 田村さん「これでそれぞれ実装して」）。
 * サービスのメールの名前「しおり通信」はそのまま
 */
export function withGuideName(text: string, name: string): string {
  if (name === "しおり") return text;
  return text.replace(/しおり(?!通信)/g, name);
}
