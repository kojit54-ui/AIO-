/** pain＝経営の悩み、question＝発注する人の疑問、success＝Webで成果が出たやり方、buyer＝買い手の探し方・決め方、trend＝最近の動き */
export type MfgKind = "pain" | "question" | "success" | "buyer" | "trend";

/** question_example＝質問の記入例・記事の提案に、article_idea＝書く記事の案に、writer_hint＝AIの書き手・点検役に、shiori_tip＝しおりのひとことに */
export type MfgUse = "question_example" | "article_idea" | "writer_hint" | "shiori_tip";

export interface MfgItem {
  id: string;
  kind: MfgKind;
  /** trend のとき：国や団体の正式な発表なら true。報道・見通しは false */
  official?: boolean;
  title: string;
  summary: string;
  /** "all" か、業種の名前（切削加工・板金・溶接 など） */
  industries: string[];
  useFor: MfgUse[];
  articleIdea?: string;
  source: { title: string; url: string; publisher: string; date: string | null };
}
