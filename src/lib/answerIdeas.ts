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
