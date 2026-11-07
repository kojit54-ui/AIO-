// 案内役を選べるようにする（2026-11-07 田村さん「しおりだけじゃなくて、男の人と、キャラクターを選べるようにしたい」）。
// 絵は public/guide/<id>-<表情>.webp（高さ400px、透過）。男の人とオコジョは Gemini（gemini-3.1-flash-image）で作った。
// 男の人は田村さんの参考（落ち着いた大人の男性の雰囲気）をもとにした、オリジナルの人物。実在の作品の人物には似せない。

export type GuideId = "shiori" | "gen" | "koyuki";

export interface GuideCharacter {
  id: GuideId;
  /** 画面での呼び名 */
  name: string;
  /** 選ぶときの説明 */
  note: string;
  /** 絵のファイル名の頭 */
  file: string;
}

export const GUIDES: GuideCharacter[] = [
  { id: "shiori", name: "しおり", note: "ちょっと厳しめの、頼れるお姉さん", file: "shiori" },
  { id: "gen", name: "源さん", note: "落ち着いた、ものづくりの先輩", file: "gen" },
  { id: "koyuki", name: "こゆき", note: "元気なオコジョ。いっしょにがんばる", file: "koyuki" },
];

export const DEFAULT_GUIDE: GuideId = "shiori";

export const isGuideId = (v: unknown): v is GuideId => GUIDES.some((g) => g.id === v);

export const guideOf = (id: GuideId): GuideCharacter => GUIDES.find((g) => g.id === id) ?? GUIDES[0];

/** 男の人とオコジョの絵の幅（高さ400のとき）。しおりの幅は src/components/fun.tsx の SHIORI_WIDTH */
export const GUIDE_WIDTH: Record<"gen" | "koyuki", Record<string, number>> = {"gen": {"ask": 277, "bow": 249, "cheer": 261, "coffee": 292, "idea": 252, "jersey-cheer": 284, "jersey-done": 263, "jersey-stretch": 226, "joy": 227, "point": 274, "right": 256, "sad": 223, "surprise": 289, "think": 223, "welldone": 222}, "koyuki": {"ask": 224, "bow": 284, "cheer": 224, "coffee": 224, "idea": 224, "jersey-cheer": 226, "jersey-done": 231, "jersey-stretch": 257, "joy": 224, "point": 271, "right": 224, "sad": 224, "surprise": 224, "think": 224, "welldone": 229}};
