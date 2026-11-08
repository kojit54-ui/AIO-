import type { Metadata } from "next";
import { Barlow_Semi_Condensed, Zen_Kaku_Gothic_New } from "next/font/google";
import { INDEX_ROBOTS } from "@/lib/publicPages";
import { SERVICE_NAME } from "@/lib/brand";
import { mfgShowcase } from "@/lib/manufacturing";
import { Welcome } from "./Welcome";

// 見出しと紙面はブランドと同じ書体（docs/BRAND.md）。案内役の画面の見本は丸ゴシック（layout.tsx で読み込み済み）
const kaku = Zen_Kaku_Gothic_New({ weight: ["400", "500", "700", "900"], subsets: ["latin"], variable: "--font-kaku", display: "swap", preload: false });
const barlow = Barlow_Semi_Condensed({ weight: ["600", "700"], subsets: ["latin"], variable: "--font-barlow", display: "swap", preload: false });

export const metadata: Metadata = {
  robots: INDEX_ROBOTS,
  title: `仕事の話に答えるだけ。毎月1本から、自社サイトの記事に｜${SERVICE_NAME}`,
  description: "製造業の一人親方〜30人の会社へ。案内役の質問に答えると、AIが仕事の工夫や対応できることを記事にまとめます。社長が確かめてから、自社サイトで公開。登録せずに試せます。",
};

/** 入口のページ（サービスのご紹介）。ログインしなくても見られる */
export default function WelcomePage() {
  return (
    <div className={`${kaku.variable} ${barlow.variable}`}>
      <Welcome makers={mfgShowcase()} />
    </div>
  );
}
