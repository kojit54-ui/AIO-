// 「新しくなったこと」の一覧（docs/TASKS.md T6-3）。
// 利用者に関わる変更をマージしたら、いちばん上に1つ足す。足すとホームのしおりの吹き出し・/updates・しおり通信に出る。
// 書き方：title は「〜できるようになりました」のように、利用者がやれることで書く。専門語や中の仕組みの名前は使わない。

export interface AppUpdate {
  /** 変えない。見たかどうかを覚えるのに使う */
  id: string;
  /** YYYY-MM-DD（日本時間） */
  date: string;
  title: string;
  body: string;
  /** その機能の場所（あれば） */
  href?: string;
  linkLabel?: string;
}

export const UPDATES: AppUpdate[] = [
  {
    id: "2026-11-04-manufacturing-2",
    date: "2026-11-04",
    title: "しおりが、製造業のことをもっと深く勉強しました",
    body: "印刷・製本・印刷機械から、ばね・ねじ・医療機器の部品まで、50の業種について、発注する人の疑問や、つまずきやすい言葉のやさしい説明など、2,500件以上に増やしました。記事では、お客様がつまずきそうな言葉に短い説明を添えやすくなります。",
  },
  {
    id: "2026-11-04-manufacturing",
    date: "2026-11-04",
    title: "しおりが、製造業のことをたくさん勉強しました",
    body: "発注する人がよく抱く疑問や、Webでうまくいったやり方など、200件以上を集めて、記事を書くAIに教えました。ホームでは「製造業のこぼれ話」も聞けます。",
  },
  {
    id: "2026-11-04-tone",
    date: "2026-11-04",
    title: "しおりの話し方を選べるようになりました",
    body: "しおりは少し厳しめになりました。さぼりは見逃しません。マイページで「やさしめ／ふつう／きびしめ」に変えられます。",
    href: "/mypage",
    linkLabel: "話し方を選ぶ",
  },
  {
    id: "2026-11-04-name",
    date: "2026-11-04",
    title: "サービスの名前が「AIOえらばれ帳」になりました",
    body: "AI時代に、AIにもお客様にも選ばれる会社になるための帳面です。アドレスも https://aio-erabare.jp になりました。前のアドレスも、しばらくそのまま開けます。",
  },
  {
    id: "2026-11-04-updates",
    date: "2026-11-04",
    title: "新しくなったことを、しおりがお知らせします",
    body: "毎週のように良くしていきます。新しくなったことは、ホームでしおりが1つずつ教えます。まとめて見たいときは「新しくなったこと」の一覧へどうぞ。",
    href: "/updates",
    linkLabel: "一覧を見る",
  },
  {
    id: "2026-11-04-mypage",
    date: "2026-11-04",
    title: "マイページで社名を直せるようになりました",
    body: "画面の右上「マイページ」から、社名やしおり通信の受け取りを変えられます。直した社名は、これからの記事にも使います。",
    href: "/mypage",
    linkLabel: "マイページへ",
  },
  {
    id: "2026-11-03-article-order",
    date: "2026-11-03",
    title: "記事づくりが「読む人の悩み → 答え → タイトル」の順になりました",
    body: "はじめに、誰のどんな悩みに答えるかを決めます。答えを先に書く記事は、AIにもお客様にも伝わりやすくなります。",
  },
  {
    id: "2026-11-03-answer-ideas",
    date: "2026-11-03",
    title: "質問の答えに迷ったら、AIが案を出します",
    body: "記事の質問で「AIに案を出してもらう」を押すと、答えのたたき台が出ます。会社に合うように直して使ってください。",
  },
  {
    id: "2026-11-03-newsletter",
    date: "2026-11-03",
    title: "毎月1日に「しおり通信」が届きます",
    body: "前の月に書いた記事やスタンプを、メールでまとめてお届けします。",
    href: "/newsletter",
    linkLabel: "見本を見る",
  },
  {
    id: "2026-11-03-stamps",
    date: "2026-11-03",
    title: "ホームに「しおりのスタンプ帳」ができました",
    body: "記事を書いたり、ブログに載せたりするとスタンプがもらえます。全部で10個です。",
  },
];

/** まだ見ていない新しいこと（新しい順）。lastSeenId が無ければ直近の3つまで */
export function unseenUpdates(lastSeenId: string | null, list: AppUpdate[] = UPDATES): AppUpdate[] {
  if (!lastSeenId) return list.slice(0, 3);
  const i = list.findIndex((u) => u.id === lastSeenId);
  // 覚えていた id が一覧から消えていたら、出しすぎないよう直近の1つだけ
  if (i === -1) return list.slice(0, 1);
  return list.slice(0, i);
}

/** その月（YYYY-MM）に新しくなったこと。しおり通信に入れる */
export function updatesInMonth(month: string, list: AppUpdate[] = UPDATES): AppUpdate[] {
  return list.filter((u) => u.date.startsWith(`${month}-`));
}

/** 日付の見せ方（11月4日） */
export const updateDateLabel = (date: string) => `${Number(date.slice(5, 7))}月${Number(date.slice(8, 10))}日`;
