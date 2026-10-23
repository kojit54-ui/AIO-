// AIO（AI検索に紹介されるための工夫）の材料。docs/AIO.md と合わせる。
// 画面の「なぜ聞くの？」、AIへの指示（src/lib/ai/prompt.ts）、点検で同じ言葉を使う。

import type { AioPoint } from "@/types/domain";

/**
 * AIO（AI検索に紹介されるための工夫）で集めたい材料。docs/AIO.md。
 * 質問ごとに「どの材料のために聞いているか」を画面で伝え、書く人にもAIOを分かってもらう
 */
export const AIO_POINTS: Record<AioPoint, { label: string; why: string; cheer: string }> = {
  experience: {
    label: "体験（一次情報）",
    why: "AIは一般論よりも、その会社にしかない体験を紹介したがります。ほかの会社には書けない、いちばんの武器です。",
    cheer: "いいですね！ほかの会社には書けない体験です。AIが紹介したくなる材料が増えました。",
  },
  numbers: {
    label: "具体的な数字",
    why: "価格、期間、件数などの数字は、AIが答えの中で引用しやすい材料です。分かる範囲で大丈夫です。",
    cheer: "数字が入りました！AIが答えに使いやすい形になっています。",
  },
  entity: {
    label: "誰が・どこで",
    why: "会社のこと、地域、資格がはっきりしていると、AIが「この地域ならこの会社」と紹介しやすくなります。",
    cheer: "会社と地域のことが伝わりました。AIに「どこの誰か」を覚えてもらう第一歩です。",
  },
  qa: {
    label: "質問と答え",
    why: "お客様がAIに聞く質問は、ふだん会社が聞かれている質問と同じです。そのまま答える記事は、AIの答えに使われやすくなります。",
    cheer: "お客様の質問が集まりました。そのままAIに聞かれる質問です。",
  },
  comparison: {
    label: "比べる材料",
    why: "「どこに頼むか」で迷っている人は、AIに違いや選び方を聞きます。比べる材料があると、選ばれる理由が伝わります。",
    cheer: "選ばれる理由がはっきりしてきました。比べて迷っている人に届きます。",
  },
  expertise: {
    label: "プロの知見",
    why: "注意点やよくある誤解は、プロだから書けることです。AIは信頼できる情報源として扱いやすくなります。",
    cheer: "プロならではの知見です。記事の信頼がぐっと上がります。",
  },
  action: {
    label: "次の一歩",
    why: "AIに紹介されて来た人が、迷わず問い合わせできるようにします。ここが売上につながる出口です。",
    cheer: "出口ができました。読んだ人が問い合わせしやすくなります。",
  },
  trust: {
    label: "信頼",
    why: "大げさな言葉や根拠のない言い切りは、読む人にもAIにも信頼されにくくなります。正確さが紹介される近道です。",
    cheer: "ありがとうございます。正確で信頼される記事にします。",
  },
};

/** 答えた問いから、集まったAIOの材料 */
export function collectedAio(questions: { id: string; aio?: AioPoint }[], answered: (id: string) => boolean): AioPoint[] {
  return [...new Set(questions.filter((q) => q.aio && answered(q.id)).map((q) => q.aio!))];
}

/** AIへの指示に入れる材料の一覧（「体験（一次情報）」→「体験」） */
export const AIO_MATERIAL_NAMES = (Object.keys(AIO_POINTS) as AioPoint[]).map((k) => AIO_POINTS[k].label.split("（")[0]);
