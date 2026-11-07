// 案内役の絵の幅（高さ400のとき）。public/guide の絵から作る（絵を足したら作り直す）。
// 鍵は絵のファイル名の頭（例 shiori-work）、中は表情ごとの幅。
export const GUIDE_WIDTHS: Record<string, Record<string, number>> = {
  "gen": {"angry": 298, "ask": 285, "bow": 260, "cheer": 298, "coffee": 299, "idea": 286, "jersey-cheer": 295, "jersey-done": 287, "jersey-stretch": 206, "joy": 290, "point": 290, "right": 297, "sad": 251, "surprise": 298, "think": 265, "welldone": 284},
  "gen-gym": {"angry": 301, "ask": 243, "bow": 237, "cheer": 256, "coffee": 243, "idea": 264, "joy": 236, "point": 239, "right": 246, "sad": 231, "surprise": 299, "think": 234, "welldone": 237},
  "gen-out": {"angry": 265, "ask": 248, "bow": 249, "cheer": 266, "coffee": 248, "idea": 258, "joy": 242, "point": 276, "right": 254, "sad": 244, "surprise": 288, "think": 228, "welldone": 240},
  "gen-suit": {"angry": 279, "ask": 230, "bow": 238, "cheer": 251, "coffee": 231, "idea": 231, "joy": 220, "point": 242, "right": 231, "sad": 211, "surprise": 277, "think": 213, "welldone": 215},
  "koyuki": {"angry": 288, "ask": 224, "bow": 232, "cheer": 218, "coffee": 220, "idea": 250, "jersey-cheer": 223, "jersey-done": 234, "jersey-stretch": 204, "joy": 215, "point": 217, "right": 259, "sad": 232, "surprise": 252, "think": 212, "welldone": 225},
  "shiori": {"angry": 250, "ask": 193, "bow": 153, "cheer": 239, "coffee": 188, "idea": 209, "jersey-cheer": 238, "jersey-done": 200, "jersey-stretch": 295, "joy": 173, "point": 230, "right": 208, "sad": 191, "surprise": 241, "think": 186, "welldone": 173},
  "shiori-casual": {"angry": 284, "ask": 256, "bow": 237, "cheer": 224, "coffee": 210, "idea": 212, "joy": 197, "point": 245, "right": 218, "sad": 198, "surprise": 289, "think": 191, "welldone": 194},
  "shiori-gym": {"angry": 266, "ask": 245, "bow": 175, "cheer": 267, "coffee": 175, "idea": 202, "joy": 167, "point": 243, "right": 212, "sad": 169, "surprise": 250, "think": 163, "welldone": 170},
  "shiori-out": {"angry": 216, "ask": 235, "bow": 185, "cheer": 201, "coffee": 183, "idea": 184, "joy": 184, "point": 225, "right": 189, "sad": 184, "surprise": 254, "think": 184, "welldone": 184},
  "shiori-summer": {"angry": 223, "ask": 215, "bow": 156, "cheer": 181, "coffee": 154, "idea": 170, "joy": 153, "point": 250, "right": 161, "sad": 146, "surprise": 187, "think": 154, "welldone": 158},
  "shiori-winter": {"angry": 299, "ask": 259, "bow": 224, "cheer": 249, "coffee": 227, "idea": 240, "joy": 226, "point": 260, "right": 243, "sad": 221, "surprise": 275, "think": 215, "welldone": 226},
  "shiori-work": {"angry": 278, "ask": 245, "bow": 256, "cheer": 264, "coffee": 243, "idea": 256, "joy": 220, "point": 278, "right": 256, "sad": 241, "surprise": 274, "think": 238, "welldone": 220},
};
