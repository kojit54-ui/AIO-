import type { Metadata } from "next";
import { Barlow_Semi_Condensed, Zen_Kaku_Gothic_New } from "next/font/google";
import { SERVICE_NAME } from "@/lib/brand";
import { LogoGuide } from "./LogoGuide";

// ロゴと同じ書体で組む（docs/BRAND.md「書体」）。作業用のページなので検索には出さない（robots は layout の既定）
const kaku = Zen_Kaku_Gothic_New({ weight: ["400", "500", "700", "900"], subsets: ["latin"], variable: "--font-kaku", display: "swap", preload: false });
const barlow = Barlow_Semi_Condensed({ weight: ["600", "700"], subsets: ["latin"], variable: "--font-barlow", display: "swap" });

export const metadata: Metadata = {
  title: `ロゴの使い方｜${SERVICE_NAME}`,
  description: `${SERVICE_NAME}のロゴの種類・決まり・色・書体と、データのダウンロード。`,
};

/** ロゴを使う人のための作業用ページ */
export default function LogoGuidePage() {
  return (
    <div className={`${kaku.variable} ${barlow.variable}`}>
      <LogoGuide />
    </div>
  );
}
