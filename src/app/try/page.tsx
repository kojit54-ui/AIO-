import type { Metadata } from "next";
import { TryOut } from "./TryOut";

export const metadata: Metadata = {
  title: "30秒でためす｜コタムのブログ執筆支援",
  description: "あなたの会社がAIに紹介される準備度を診断し、1問答えるとその場で記事の書き出しができます。",
};

/** 登録の前にためせるページ。ログインなしで見られる */
export default function TryPage() {
  return <TryOut />;
}
