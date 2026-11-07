// 案内役の絵の幅（高さ400のとき）。public/guide の絵から作る（絵を足したら作り直す）。
// 鍵は絵のファイル名の頭（例 shiori-work）、中は表情ごとの幅。
export const GUIDE_WIDTHS: Record<string, Record<string, number>> = {
  "gen": {"ask": 285, "bow": 260, "cheer": 298, "coffee": 299, "idea": 286, "jersey-cheer": 295, "jersey-done": 287, "jersey-stretch": 206, "joy": 290, "point": 290, "right": 297, "sad": 251, "surprise": 298, "think": 265, "welldone": 284},
  "gen-suit": {"ask": 230, "bow": 238, "cheer": 251, "coffee": 231, "idea": 231, "joy": 220, "point": 242, "right": 231, "sad": 211, "surprise": 277, "think": 213, "welldone": 215},
  "koyuki": {"ask": 224, "bow": 284, "cheer": 224, "coffee": 224, "idea": 224, "jersey-cheer": 226, "jersey-done": 231, "jersey-stretch": 257, "joy": 224, "point": 271, "right": 224, "sad": 224, "surprise": 224, "think": 224, "welldone": 229},
  "shiori": {"ask": 323, "bow": 131, "cheer": 209, "coffee": 212, "idea": 231, "jersey-cheer": 240, "jersey-done": 255, "jersey-stretch": 246, "joy": 232, "point": 250, "right": 241, "sad": 216, "surprise": 266, "think": 201, "welldone": 237},
  "shiori-casual": {"ask": 256, "bow": 237, "cheer": 224, "coffee": 210, "idea": 212, "joy": 197, "point": 245, "right": 218, "sad": 198, "surprise": 289, "think": 191, "welldone": 194},
  "shiori-summer": {"ask": 215, "bow": 156, "cheer": 181, "coffee": 154, "idea": 170, "joy": 153, "point": 250, "right": 161, "sad": 146, "surprise": 187, "think": 154, "welldone": 158},
  "shiori-winter": {"ask": 259, "bow": 224, "cheer": 249, "coffee": 227, "idea": 240, "joy": 226, "point": 260, "right": 243, "sad": 221, "surprise": 275, "think": 215, "welldone": 226},
  "shiori-work": {"ask": 245, "bow": 256, "cheer": 264, "coffee": 243, "idea": 256, "joy": 220, "point": 278, "right": 256, "sad": 241, "surprise": 274, "think": 238, "welldone": 220},
};
