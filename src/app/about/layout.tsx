import { Barlow_Semi_Condensed, Zen_Kaku_Gothic_New } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site";

// 運営会社と編集方針も、読みものと同じ紙面（生成り・墨・角ゴシック・罫線。docs/BRAND.md）。案内役のせりふだけ丸ゴシック
const kaku = Zen_Kaku_Gothic_New({ weight: ["400", "500", "700", "900"], subsets: ["latin"], variable: "--font-kaku", display: "swap", preload: false });
const barlow = Barlow_Semi_Condensed({ weight: ["600", "700"], subsets: ["latin"], variable: "--font-barlow", display: "swap", preload: false });

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${kaku.variable} ${barlow.variable} overflow-x-clip bg-paper text-sumi`}>
      <SiteHeader />
      <div className="font-[family-name:var(--font-kaku)] font-medium">{children}</div>
      <SiteFooter />
    </div>
  );
}
