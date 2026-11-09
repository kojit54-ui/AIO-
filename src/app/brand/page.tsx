import type { Metadata } from "next";
import { Barlow_Semi_Condensed, Zen_Kaku_Gothic_New } from "next/font/google";
import { SERVICE_NAME } from "@/lib/brand";
import { BRAND_DESCRIPTOR, BRAND_LINE } from "@/lib/brandBook";
import { INDEX_ROBOTS } from "@/lib/publicPages";
import { BrandBook } from "./BrandBook";

// ロゴと同じ書体で見出しを組む（docs/BRAND.md「書体」）。このページだけで読みこむ
const kaku = Zen_Kaku_Gothic_New({ weight: ["400", "500", "700", "900"], subsets: ["latin"], variable: "--font-kaku", display: "swap", preload: false });
const barlow = Barlow_Semi_Condensed({ weight: ["600", "700"], subsets: ["latin"], variable: "--font-barlow", display: "swap" });

export const metadata: Metadata = {
  robots: INDEX_ROBOTS,
  title: `えらばれ帳が大切にしていること｜${SERVICE_NAME}`,
  description: `${BRAND_LINE}${BRAND_DESCRIPTOR}${SERVICE_NAME}の理念・ミッション・記事づくりの約束と、運営する会社のこと。`,
  alternates: { canonical: "/brand" },
};

/** えらばれ帳が大切にしていること（/brand）。ログインなしで見られる */
export default function BrandPage() {
  return (
    <div className={`${kaku.variable} ${barlow.variable}`}>
      <BrandBook />
    </div>
  );
}
