// 月額で書ける記事の本数（2026-11-08 田村さん「最低1本。毎月10本まで」）。
// 入口・料金・よくある質問・読みもの・/about・構造化データ・規約・ブランドの言葉は、ここの文を使う。
// 本数の上限は、DBの start_generation（organizations.monthly_article_limit）でも同じ数で止める。

export const ARTICLES_PER_MONTH_MIN = 1;
export const ARTICLES_PER_MONTH_MAX = 10;

/** 料金の欄などに出す言い方 */
export const ARTICLES_PER_MONTH_LABEL = `毎月${ARTICLES_PER_MONTH_MIN}本から${ARTICLES_PER_MONTH_MAX}本まで`;
