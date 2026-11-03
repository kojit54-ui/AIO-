import type { Metadata } from "next";
import { Welcome } from "./Welcome";

export const metadata: Metadata = {
  title: "AIに紹介される会社に｜コタムのブログ執筆支援",
  description: "しおりの質問に答えるだけで、AIに紹介されやすい記事ができる。ものづくりの会社のためのブログ執筆支援。",
};

/** 入口のページ（サービスのご紹介）。ログインしなくても見られる */
export default function WelcomePage() {
  return <Welcome />;
}
