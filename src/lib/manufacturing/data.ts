// 製造業の知識表（データ）。2026-11-04 に（第1弾・第2弾）公的機関・業界メディア・調査の公開情報を検索で集め、要点だけを自分の言葉でまとめた。
// 文章は写さず、出典を残す。中小の会社名や個人が分かる情報は入れない。使い方は ./index.ts。
// 直すときは ./index.ts のテスト（形・長さ・URL）が通ること。

import type { MfgItem } from "./types";
import items from "./data.json";

export const MFG_COLLECTED_AT = "2026-11-04";

// 中身は ./data.json（TSの配列にすると、ビルドのたびに5MBを変換して本番の公開に8分かかったため。2026-11-07）
export const MFG_ITEMS = items as MfgItem[];
