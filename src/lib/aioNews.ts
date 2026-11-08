// AIOの知識表：AI検索の最新情報を1件ずつ持つ。docs/AIO.md と同時に直す（docs/AIO.md「更新の決まり」）。
// 1つの表から、顧客の画面（しおりのAIOニュース）と、AIへの指示（書き手・点検役）の両方に使う。

import type { AioPoint } from "@/types/domain";

/** 公式＝提供元（Google・OpenAI など）が自分で発表したもの。報道＝報道や調査会社の集計で、公式の確認が無いもの */
export type AioNewsSource = "official" | "report";

export interface AioNewsItem {
  id: string;
  /** 発表・報道の日（YYYY-MM-DD） */
  date: string;
  source: AioNewsSource;
  /** 出典の名前（例：Google 公式ブログ） */
  sourceName: string;
  url: string;
  /** しおりが話す見出し。やさしい言葉で */
  title: string;
  /** 顧客に伝えるひとこと。何が変わったか */
  forClient: string;
  /** 関係するAIOの材料。質問の「なぜ聞くの？」の下に出る */
  point?: AioPoint;
  /** 「だから、〇〇を聞いています」の〇〇の部分。point と一緒に書く */
  soWeAsk?: string;
  /** 書き手（GPT）への指示に足す1文。公式で、正式に始まったものだけに書く（試験中・報道は書かない） */
  forWriter?: string;
  /** 点検役（Claude）が確かめる1文。forWriter と同じ条件 */
  forReviewer?: string;
}

/** 知識表を最後に見直した日。docs/AIO.md の「最終更新」と同じ日にする（テストで確かめる） */
export const AIO_NEWS_UPDATED = "2026-11-08";

/** 新しい順に並べる */
export const AIO_NEWS: AioNewsItem[] = [
  {
    id: "2026-11-02-chatgpt-search-volume",
    date: "2026-11-04",
    source: "report",
    sourceName: "報道（OpenAI の担当者の話を Gizmodo などが紹介）",
    url: "https://gizmodo.com/chatgpt-claims-to-have-achieved-20-of-googles-search-volume-2000834464",
    title: "ChatGPTで調べる人も、Googleの約2割まで増えたそうです",
    forClient:
      "OpenAI の担当者が「ChatGPTで検索が使われる回数は、Googleの約2割」と話したと報道されました。数え方は公開されていませんが、Googleだけでなく、ChatGPTに相談するお客様も増えています。お客様がふだん聞く言葉そのままの質問に答えておくと、どちらのAIにも紹介されやすくなります。",
    point: "qa",
    soWeAsk: "お客様からよく聞かれる質問と、その答え",
  },
  {
    id: "2026-10-15-google-links",
    date: "2026-10-15",
    source: "official",
    sourceName: "Google 公式ブログ",
    url: "https://blog.google/products-and-platforms/products/search/updates-ai-mode-overviews-explore-web/",
    title: "GoogleのAIの答えで、紹介元のリンクが目立つようになります",
    forClient:
      "GoogleのAIによる概要とAIモードで、答えの中のリンクが、より上に、より多く出るようになると発表されました。AIに紹介されたあと、読んだ人がそのまま問い合わせできるかが、売上の分かれ目になります。",
    point: "action",
    soWeAsk: "読んだ人に次にしてほしいこと（問い合わせ・申し込みの方法）",
    forWriter: "AIの答えのリンクから来た人がすぐ動けるように、次の一歩（問い合わせ・申し込みの方法）を、素材にある範囲で記事の中にはっきり書く。",
    forReviewer: "次の一歩（問い合わせ・申し込みの方法）が、読んだ人に分かる形で書かれているか。",
  },
  {
    id: "2026-09-chatgpt-citations",
    date: "2026-10-16",
    source: "report",
    sourceName: "調査会社の集計（MarketingProfs の紹介）",
    url: "https://www.marketingprofs.com/opinions/2026/56192/ai-update-october-16-2026-ai-news-and-views-from-the-past-week",
    title: "ChatGPTは「実際にやってみた」記事を引用しやすくなった、という調査",
    forClient:
      "ChatGPTの答えで、掲示板や百科事典の引用が減り、実際に試した記事や一次情報の引用が増えた、という調査会社の集計があります。公式の発表ではありませんが、体験を書く大切さは変わりません。",
    point: "experience",
    soWeAsk: "実際にあったご相談と、どう対応したか",
  },
  {
    id: "2026-06-03-search-console-ai-report",
    date: "2026-06-03",
    source: "official",
    sourceName: "Google 検索セントラル ブログ",
    url: "https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports",
    title: "AIの答えに、自分のサイトが何回出たか見られるようになりました",
    forClient:
      "Google の Search Console で、AIによる概要とAIモードに自分のサイトが出た回数を見られるようになりました（2026年8月31日からすべてのサイト）。書いた記事の効果が、少しずつ見えるようになります。",
  },
  {
    id: "2026-05-15-google-ai-is-seo",
    date: "2026-05-15",
    source: "official",
    sourceName: "Google 検索セントラル",
    url: "https://developers.google.com/search/docs/appearance/ai-features",
    title: "Googleは「AI向けの特別な技より、その会社だけの内容が大事」",
    forClient:
      "Google は、AIの答えに出るための工夫もふつうの検索と同じで、AI向けの特別なファイルや、記事を細かく区切る書き方は要らない、と案内しています。大事なのは、ほかでは読めない内容です。",
    point: "experience",
    soWeAsk: "ほかの会社には書けない、実際の体験",
    forWriter: "AI向けの小手先の工夫（記事を不自然に細かく区切る、キーワードを詰め込む、AI専用の書き方）はしない。その会社にしかない体験と答えを、読む人に役立つ形で書く。",
    forReviewer: "AI向けの小手先の工夫（不自然な細切れ、キーワードの詰め込み）になっていないか。その会社にしかない内容が中心になっているか。",
  },
];

/** 公式か報道かの見せ方。報道は「公式の確認なし」と必ず添える */
export const SOURCE_LABEL: Record<AioNewsSource, string> = {
  official: "公式の発表",
  report: "報道・調査（公式の確認なし）",
};

/** 新しい順に n 件 */
export function latestAioNews(n = 3): AioNewsItem[] {
  return [...AIO_NEWS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
}

/** その材料に関係するニュース。公式の発表を優先し、無ければ報道のいちばん新しいもの */
export function aioNewsFor(point: AioPoint): AioNewsItem | undefined {
  const list = latestAioNews(AIO_NEWS.length).filter((n) => n.point === point);
  return list.find((n) => n.source === "official") ?? list[0];
}

/** AIへの指示に使えるのは、公式のものだけ */
const forAi = (key: "forWriter" | "forReviewer") =>
  latestAioNews(AIO_NEWS.length).flatMap((n) => (n.source === "official" && n[key] ? [`- ${n[key]}（${n.date} ${n.sourceName}）`] : []));

/** 書き手の指示に足す「最新の決まり」。無ければ空文字 */
export function aioWriterRules(): string {
  const lines = forAi("forWriter");
  return lines.length ? `\n\nAI検索の最新の決まり（${AIO_NEWS_UPDATED} 時点、公式の発表から）：\n${lines.join("\n")}` : "";
}

/** 点検役の指示に足す「最新の決まり」。無ければ空文字 */
export function aioReviewerRules(): string {
  const lines = forAi("forReviewer");
  return lines.length ? `\n\naio の点検では、AI検索の最新の決まり（${AIO_NEWS_UPDATED} 時点、公式の発表から）も確かめる：\n${lines.join("\n")}` : "";
}

/** 「2026-10-15」→「2026年10月15日」 */
export function formatNewsDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}
