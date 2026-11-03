import type { Metadata } from "next";
import { ShioriIntro } from "./ShioriIntro";

export const metadata: Metadata = {
  title: "しおりの自己紹介｜コタムのブログ執筆支援",
  description: "あなたの会社の記事づくりを案内する、しおりの自己紹介。",
};

/** しおりの自己紹介。ログインなしで見られる */
export default function ShioriPage() {
  return <ShioriIntro />;
}
