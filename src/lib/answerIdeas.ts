// 記事の質問の「AIの案」で、キーが無いとき・画面試作のときに出すサンプル。どの会社でも思い出すきっかけになる形にする（2026-11-03）

export const SAMPLE_ANSWER_IDEAS = [
  "「何から頼めばいいのか分からない」というご相談が、いちばん多いです。",
  "「前に頼んだところでは、思っていたものと違った」という声をよく聞きます。",
  "「費用がどのくらいかかるか、先に知りたい」と聞かれることがよくあります。",
];

/** 選んだ案を答えに入れる。書いてあればその下に足す */
export function insertIdea(current: string, idea: string): string {
  const now = current.trimEnd();
  return now ? `${now}\n${idea}` : idea;
}

/** タイトル案のサンプル（キーが無いとき・画面試作のとき）。数字や実績は入れない */
export function sampleTitleIdeas(keyword: string): { conclusion: string; titles: string[] } {
  const k = keyword.trim() || "このテーマ";
  return {
    conclusion: "まずは今の困りごとを、そのまま相談してください。お話をうかがってから、いちばん合うやり方をご提案します。",
    titles: [`${k}で迷ったら｜最初に知っておきたいこと`, `${k}は何から始める？相談前に読む答え`, `${k}の失敗を防ぐ、プロが見ている注意点`],
  };
}
