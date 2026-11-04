// 製造業の知識表（データ）。2026-11-04 に（第1弾・第2弾）公的機関・業界メディア・調査の公開情報を検索で集め、要点だけを自分の言葉でまとめた。
// 文章は写さず、出典を残す。中小の会社名や個人が分かる情報は入れない。使い方は ./index.ts。
// 直すときは ./index.ts のテスト（形・長さ・URL）が通ること。

import type { MfgItem } from "./types";

export const MFG_COLLECTED_AT = "2026-11-04";

export const MFG_ITEMS: MfgItem[] = [
  {
    "id": "trend-001",
    "kind": "trend",
    "title": "コスト削減だけでは限界",
    "summary": "2025年版中小企業白書は、節約だけの経営は限界で、設備投資・デジタル化・適正な価格設定で稼ぐ力を高め、賃上げの余力を作る必要があるとしている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "値下げ競争をやめた町工場が最初に見直したこと",
    "source": {
      "title": "2025年版 中小企業白書(HTML版)",
      "url": "https://www.chusho.meti.go.jp/pamflet/hakusyo/2025/chusho/index.html",
      "publisher": "中小企業庁",
      "date": "2025-04"
    }
  },
  {
    "id": "pain-001",
    "kind": "pain",
    "title": "製造業の景況がコロナ前水準に",
    "summary": "2025年版中小企業白書では、景気の回復が足踏みする中、製造業と建設業の業況はコロナ前の水準まで落ち込んでいると分析されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "2025年版 中小企業白書(HTML版)",
      "url": "https://www.chusho.meti.go.jp/pamflet/hakusyo/2025/chusho/index.html",
      "publisher": "中小企業庁",
      "date": "2025-04"
    }
  },
  {
    "id": "trend-002",
    "kind": "trend",
    "title": "現状維持が最大のリスク",
    "summary": "2026年版中小企業白書は、人手不足・インフレ・金利のある時代への転換期で「現状維持は最大のリスク」とし、稼ぐ力と経営者の経営リテラシーを強化するよう求めている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "2026年版 中小企業白書をやさしく解説",
      "url": "https://sogyotecho.jp/?p=261494",
      "publisher": "創業手帳",
      "date": "2026-05"
    }
  },
  {
    "id": "pain-002",
    "kind": "pain",
    "title": "材料費も人件費も同時に上がる",
    "summary": "人件費と材料費の上昇、人手不足が同時に進み、これまでの価格・働き方・商品構成のままでは経営が続かなくなりつつある、と2026年版白書の解説は整理している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "材料も人件費も上がる中で、うちが価格を見直した理由",
    "source": {
      "title": "2026年版 中小企業白書・小規模企業白書の概要",
      "url": "https://sogyotecho.jp/news/20260501whitepaper/",
      "publisher": "創業手帳",
      "date": "2026-05"
    }
  },
  {
    "id": "pain-003",
    "kind": "pain",
    "title": "価格転嫁率は約5割どまり",
    "summary": "中小企業庁の2025年9月調査で、コスト上昇分のうち価格に上乗せできた割合は53.5%。労務費は初めて5割に届いたが、エネルギー費は48.9%で、残りは自社でかぶっている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "9月の「価格交渉促進月間」フォローアップ調査の結果を公表",
      "url": "https://sogyotecho.jp/news/20251204kakakutenka/",
      "publisher": "創業手帳",
      "date": "2025-12"
    }
  },
  {
    "id": "pain-004",
    "kind": "pain",
    "title": "転嫁できる会社とできない会社に二極化",
    "summary": "2025年3月の価格交渉促進月間調査では価格転嫁率52.4%。転嫁できた企業とできない企業に分かれる状態が続いていると報じられた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "価格交渉促進月間(2025年3月)フォローアップ調査結果",
      "url": "https://www.meti.go.jp/press/2025/06/20250620003/20250620003.html",
      "publisher": "経済産業省",
      "date": "2025-06"
    }
  },
  {
    "id": "question-001",
    "kind": "question",
    "title": "値上げ交渉に何を用意すればいい？",
    "summary": "価格交渉では原価の中身を示すのが効果的。材料費・労務費・経費に分けて月ごとの推移をつかみ、自社で管理できる部分と外の要因を分けると説明しやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "値上げをお願いする前に、私たちが原価を分解した話",
    "source": {
      "title": "価格転嫁のための原価把握(Q&A)",
      "url": "https://j-net21.smrj.go.jp/qa/org/Q1491.html",
      "publisher": "J-Net21(中小機構)",
      "date": "2024-04"
    }
  },
  {
    "id": "trend-003",
    "kind": "trend",
    "title": "下請法が取適法に変わった",
    "summary": "2026年1月から下請法は「取適法」になり、協議に応じず一方的に代金を決めることや手形払いが禁止に。発注側に価格の相談を持ちかけやすい環境が整った。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "取適法で何が変わった？加工を頼む側が知っておきたいこと",
    "source": {
      "title": "取適法とは？下請法改正のポイント",
      "url": "https://biz.moneyforward.com/contract/basic/23235/",
      "publisher": "マネーフォワード クラウド",
      "date": "2026-03"
    }
  },
  {
    "id": "trend-004",
    "kind": "trend",
    "title": "値上げ交渉の無料相談窓口",
    "summary": "全国のよろず支援拠点に価格転嫁サポート窓口があり、原価計算や交渉の基本を無料で教われる。中小企業庁は交渉前の準備をまとめたハンドブックも出している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "価格交渉ハンドブック",
      "url": "https://mirasapo-plus.go.jp/chinage/price-negotiation/",
      "publisher": "ミラサポplus(中小企業庁)",
      "date": null
    }
  },
  {
    "id": "pain-005",
    "kind": "pain",
    "title": "技能継承は3社に2社が苦戦",
    "summary": "ものづくり白書2026の解説によると、技能継承が「うまくいっている」企業は約3分の1。継ぎたいのは精密な作業、カンやコツ、トラブル対応力など。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "question_example",
      "article_idea"
    ],
    "articleIdea": "職人のカンを言葉にする。うちの技能継承のやり方",
    "source": {
      "title": "技能継承は3社に2社が苦戦 ものづくり白書が示す製造業の人材危機",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2607/03/news055.html",
      "publisher": "MONOist",
      "date": "2026-07"
    }
  },
  {
    "id": "pain-006",
    "kind": "pain",
    "title": "教える人もいない",
    "summary": "人が足りないだけでなく、教える側の人もいない状況が広がっている。多くの会社は再雇用などでベテランに長く働いてもらい、技能をつないでいる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "技能継承は3社に2社が苦戦(2/3)",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2607/03/news055_2.html",
      "publisher": "MONOist",
      "date": "2026-07"
    }
  },
  {
    "id": "trend-005",
    "kind": "trend",
    "title": "技能継承へのデジタル活用はまだ少数",
    "summary": "ものづくり白書2026の解説では、技能継承にデジタル技術を使っている企業は21.7%にとどまる。動画や記録で技を残す取り組みには伸びしろがある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ベテランの手元を動画に残したら、新人の覚えが早くなった",
    "source": {
      "title": "技能継承は3社に2社が苦戦(3/3)",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2607/03/news055_3.html",
      "publisher": "MONOist",
      "date": "2026-07"
    }
  },
  {
    "id": "pain-007",
    "kind": "pain",
    "title": "製造業で働く人が減っている",
    "summary": "MONOistによると、製造業の就業者は2023年の1055万人から2025年は1033万人に減少。34歳以下の若い人は2025年で258万人。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ものづくり白書2025 解説",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2506/11/news053_3.html",
      "publisher": "MONOist",
      "date": "2025-06"
    }
  },
  {
    "id": "pain-008",
    "kind": "pain",
    "title": "人手不足倒産が過去最多",
    "summary": "東京商工リサーチの集計で、2025年の人手不足による倒産は397件で過去最多。人件費の高騰152件、求人難135件、従業員の退職110件。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "“人手不足”による倒産が過去最多を更新",
      "url": "https://webtan.impress.co.jp/n/2026/01/15/52005",
      "publisher": "Web担当者Forum",
      "date": "2026-01"
    }
  },
  {
    "id": "pain-009",
    "kind": "pain",
    "title": "採れないより辞めるが深刻",
    "summary": "帝国データバンクによると、2025年の人手不足倒産のうち従業員が辞めて続けられなくなった型は124件で、前年90件から増え集計開始以来最多。定着が課題に。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "小さな工場で若手が辞めずに続いている理由",
    "source": {
      "title": "人手不足倒産 2025年",
      "url": "https://www.logi-today.com/838570",
      "publisher": "LOGISTICS TODAY",
      "date": "2026-01"
    }
  },
  {
    "id": "pain-010",
    "kind": "pain",
    "title": "物価高倒産、製造業は174件",
    "summary": "帝国データバンクの集計として、2025年の物価高による倒産は949件で5年連続最多と報じられ、そのうち製造業は174件だった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "物価高倒産 2025年",
      "url": "https://www.logi-today.com/952373",
      "publisher": "LOGISTICS TODAY",
      "date": "2026-01"
    }
  },
  {
    "id": "trend-006",
    "kind": "trend",
    "title": "設備投資は更新・修理が中心",
    "summary": "日本政策金融公庫の調査で、中小製造業の2025年度国内設備投資は前年度比3.5%減。目的では古い設備の入れ替えや修理が最も多い。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小製造業設備投資動向調査(2026年6月)",
      "url": "https://www.jfc.go.jp/n/findings/pdf/news2026_6b.pdf",
      "publisher": "日本政策金融公庫",
      "date": "2026-06"
    }
  },
  {
    "id": "pain-011",
    "kind": "pain",
    "title": "古い機械は部品が手に入らない",
    "summary": "老朽化した設備は維持費がかさみ、部品の取り寄せに時間がかかったり廃番で手に入らず、修理をあきらめることも。突然の故障は経営を揺るがす。",
    "industries": [
      "切削加工",
      "印刷",
      "樹脂成形",
      "金属加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "30年使った機械をどう守るか。古い設備との付き合い方",
    "source": {
      "title": "老朽設備の部品調達に関するリリース",
      "url": "https://ascii.jp/elem/000/004/191/4191817/",
      "publisher": "ASCII.jp",
      "date": null
    }
  },
  {
    "id": "pain-012",
    "kind": "pain",
    "title": "設備更新はお金と先行き不安で迷う",
    "summary": "中小企業は大きな設備投資を融資や自己資金だけでまかなうのが難しく、将来の受注が読めないため、更新の判断に慎重になりやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "製造業の設備投資の課題",
      "url": "https://crexgroup.com/ja/manufacturing/?p=5434",
      "publisher": "CREX",
      "date": null
    }
  },
  {
    "id": "trend-007",
    "kind": "trend",
    "title": "省力化投資補助金で機械化",
    "summary": "中小企業省力化投資補助金は、ロボットやIoT機器などの導入を支える制度。カタログから選ぶ型と、オーダーメイドの一般型がある。人手不足が条件。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "article_idea"
    ],
    "articleIdea": "補助金で自動化した工程と、人に残した工程",
    "source": {
      "title": "中小企業省力化投資補助金",
      "url": "https://mirasapo-plus.go.jp/infomation/30407/",
      "publisher": "ミラサポplus(中小企業庁)",
      "date": null
    }
  },
  {
    "id": "pain-013",
    "kind": "pain",
    "title": "DXは必要だと思うが進まない",
    "summary": "中小機構の2023年調査で約7割がDXは必要と答えたが、取り組めている企業はわずか。人材不足、効果が見えない、予算がないが主な壁とされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "中小企業のDX推進に関する調査の紹介",
      "url": "https://www.sbbit.jp/article/sp/158464",
      "publisher": "ビジネス+IT",
      "date": null
    }
  },
  {
    "id": "pain-014",
    "kind": "pain",
    "title": "まだFAXが毎日現役",
    "summary": "Chatworkの調査では、製造業のおよそ2人に1人が社外とのやり取りで毎日FAXを使っていると答えた。取引先とのやり方を変えにくいのが背景。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "FAX注文を続けながら、少しずつデジタル化した方法",
    "source": {
      "title": "製造業のFAX利用に関する調査",
      "url": "https://dxmagazine.jp/?p=150217",
      "publisher": "DXマガジン",
      "date": null
    }
  },
  {
    "id": "pain-015",
    "kind": "pain",
    "title": "後継者がいない会社は約半数",
    "summary": "帝国データバンクの集計(2025年)で、後継者がいない企業の割合は50.1%。年々下がってはいるが、まだ半分の会社で次の担い手が決まっていない。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "後継者不在率 2025年",
      "url": "https://dxmagazine.jp/news/2553to80/",
      "publisher": "DXマガジン",
      "date": "2025-11"
    }
  },
  {
    "id": "pain-016",
    "kind": "pain",
    "title": "金型は小さな会社ほど廃業",
    "summary": "金型の事業所は6割超が9人以下の小規模。自動車の電動化でエンジン部品の金型の仕事が減り、小さなメーカーの廃業が相次いでいると報じられている。",
    "industries": [
      "金型"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "金型業界の現状",
      "url": "https://newswitch.jp/p/38323",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "pain-017",
    "kind": "pain",
    "title": "金型の4つの経営課題",
    "summary": "日本政策金融公庫の調査では、中小金型メーカーの課題は受注単価の下落、受注量の減少、最終製品の市場縮小、人材育成と技能承継の4つとされている。",
    "industries": [
      "金型"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小金型製造業の調査レポート",
      "url": "https://www.jfc.go.jp/n/findings/pdf/tyuusyourepo_03_05.pdf",
      "publisher": "日本政策金融公庫",
      "date": null
    }
  },
  {
    "id": "pain-018",
    "kind": "pain",
    "title": "食品工場は人が集まりにくい",
    "summary": "みずほ銀行の2025年5月の調査では、食品製造業は賃金が低めで人が集まりにくく、欠員の割合が製造業全体より高い状態が続いている。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "食品製造業の産業調査",
      "url": "https://www.mizuhobank.co.jp/corporate/industry/sangyou/pdf/1078_01.pdf",
      "publisher": "みずほ銀行",
      "date": "2025-05"
    }
  },
  {
    "id": "pain-019",
    "kind": "pain",
    "title": "小さな食品工場は情報が届かない",
    "summary": "農林水産省の資料では、中小の食品工場は生産技術者が1人以下で設備が古いまま、投資資金も少なく、機械メーカーの情報も届きにくいと指摘されている。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "食品製造業の自動化に関する資料",
      "url": "https://www.maff.go.jp/j/shokusan/sanki/soumu/attach/pdf/meguzi-27.pdf",
      "publisher": "農林水産省",
      "date": null
    }
  },
  {
    "id": "buyer-001",
    "kind": "buyer",
    "title": "外注先探しは紹介と検索",
    "summary": "大手メーカーの購買・設計担当111人の調査で、新しい外注先の探し方は商社などの紹介64.0%、検索エンジン54.1%、展示会29.7%。検索は製品名や加工名で行う。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "「シャフト加工 少量」で探している設計者の方へ",
    "source": {
      "title": "大手メーカーからの問い合わせを増やすには? 担当者に聞いた「外注先の見つけ方」",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2410/01/news003.html",
      "publisher": "MONOist",
      "date": "2024-10"
    }
  },
  {
    "id": "buyer-002",
    "kind": "buyer",
    "title": "発注側が見るのは加工実績",
    "summary": "同じ調査で、発注担当者がサイトで重視するのは加工実績だった。何を・どの材質で・どれくらいの精度で作ったかを具体的に載せると選ばれやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "担当者に聞いた「外注先の見つけ方」(2/3)",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2410/01/news003.html",
      "publisher": "MONOist",
      "date": "2024-10"
    }
  },
  {
    "id": "buyer-003",
    "kind": "buyer",
    "title": "技術者の情報収集がAIへ",
    "summary": "MONOistの2025年7月の記事では、技術者の24.9%が生成AIを使い、Google検索は減る傾向。AIに引用されるような情報の出し方が大事になるとしている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "技術者のChatGPT利用が本格化 24.9%が生成AIを使用",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2507/10/news003.html",
      "publisher": "MONOist",
      "date": "2025-07"
    }
  },
  {
    "id": "buyer-004",
    "kind": "buyer",
    "title": "AIの答えを稟議にそのまま使う",
    "summary": "HubSpot Japanの2026年調査で、BtoBの購買担当の約4人に1人がAIの情報をほぼそのまま社内稟議に使う。AIは候補の洗い出しや違いの整理に使われている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "AIに聞かれても答えられる、うちの加工の得意・不得意",
    "source": {
      "title": "BtoB購買もAI頼みに? 4人に1人がAI情報を“ほぼそのまま”稟議で使用",
      "url": "https://webtan.impress.co.jp/n/2026/07/23/53000",
      "publisher": "Web担当者Forum",
      "date": "2026-07"
    }
  },
  {
    "id": "buyer-005",
    "kind": "buyer",
    "title": "社内で説明できる材料がほしい",
    "summary": "BtoBでは問い合わせ後に他社比較や社内稟議がある。担当者が「なぜこの会社か」を上司に説明できる情報がないと、問い合わせが受注につながりにくい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業ホームページの集客",
      "url": "https://www.shopowner-support.net/attracting_customers/manufacturing/manufacturingindustry-hp/",
      "publisher": "船井総研 ショップオーナー支援",
      "date": null
    }
  },
  {
    "id": "pain-020",
    "kind": "pain",
    "title": "HPがあっても問い合わせが来ない",
    "summary": "ホームページを持つ製造業は多いが、Webから問い合わせが来る会社は少ないと言われる。原因は見た目より中身で、技術や実績の情報が足りないことが多い。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "articleIdea": "ホームページに載せていなかった「当たり前」の技術",
    "source": {
      "title": "製造業のホームページ BtoB",
      "url": "https://jinrai.co.jp/blog/seizougyou-homepage-btob/",
      "publisher": "神雷",
      "date": null
    }
  },
  {
    "id": "success-001",
    "kind": "success",
    "title": "技術コラム月2本で問い合わせ増",
    "summary": "ある精密加工メーカーは月2本の技術コラムを1年続け、月のアクセスが150から3,200に、問い合わせが0件から4件に増えたと支援会社が紹介している(第三者検証なし)。",
    "industries": [
      "切削加工",
      "金属加工"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "製造業のホームページ BtoB",
      "url": "https://jinrai.co.jp/blog/seizougyou-homepage-btob/",
      "publisher": "神雷",
      "date": null
    }
  },
  {
    "id": "pain-021",
    "kind": "pain",
    "title": "問い合わせが相見積もりばかり",
    "summary": "問い合わせは来ても質が低い原因として、相見積もり目的や情報集めの段階の客が多いこと、狙った客と実際に見ている人がずれていることが挙げられている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "問い合わせの質が低い(Q&A)",
      "url": "https://j-net21.smrj.go.jp/qa/development/Q0874.html",
      "publisher": "J-Net21(中小機構)",
      "date": null
    }
  },
  {
    "id": "success-002",
    "kind": "success",
    "title": "技術そのものを発信して海外受注",
    "summary": "中小企業庁の事例集では、ある研磨加工会社が研磨のコンサルティングという自社の技術を発信し、国内だけでなく海外の需要も取り込んだと紹介されている。",
    "industries": [
      "表面処理",
      "金属加工"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "磨きの相談で多い3つの困りごとと、その答え",
    "source": {
      "title": "はばたく中小企業・小規模事業者300社 事例",
      "url": "https://www.chusho.meti.go.jp/keiei/sapoin/monozukuri300sha/2020/juyou/juyou015.pdf",
      "publisher": "中小企業庁",
      "date": "2020"
    }
  },
  {
    "id": "pain-022",
    "kind": "pain",
    "title": "新規開拓が後回しになる",
    "summary": "従業員299人以下の企業の調査で、経営層の8割近くが営業の人手不足で新しい顧客の開拓が後回しになっていると答えた。既存客の対応で手一杯になりがち。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "中小企業の営業人手不足調査",
      "url": "https://markezine.jp/news/detail/52414",
      "publisher": "MarkeZine",
      "date": null
    }
  },
  {
    "id": "pain-023",
    "kind": "pain",
    "title": "営業が社長や1人に頼りきり",
    "summary": "中小製造業は営業が個人の経験に頼りがちで、その人が辞めると受注が落ちる。売り込むより、見つけてもらえる仕組みを作ることが大事とされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業の新規顧客開拓",
      "url": "https://www.shopowner-support.net/attracting_customers/manufacturing/manufacturing-general/cultivate-newcustomers/",
      "publisher": "船井総研 ショップオーナー支援",
      "date": null
    }
  },
  {
    "id": "pain-024",
    "kind": "pain",
    "title": "大口1社への依存は危ない",
    "summary": "取引先を1社に偏らせると、その会社の海外移転や発注減で一気に売上が落ちる。中小企業は資源が少なく分散しにくいが、少しずつ取引先を広げることが勧められる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "取引先が1社に偏っていた頃と、今の違い",
    "source": {
      "title": "大口顧客への依存はリスク",
      "url": "https://toyokeizai.net/articles/-/877530?display=b",
      "publisher": "東洋経済オンライン",
      "date": null
    }
  },
  {
    "id": "success-003",
    "kind": "success",
    "title": "下請けの強みで自社ブランド",
    "summary": "金属加工の下請けから始めた会社が、自社ブランド製品を収益の柱に育てた例がある。下請けをやめるのではなく、下請けで磨いた技術を生かしたと語られている。",
    "industries": [
      "金属加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "下請けで磨いた技術を、自社製品にどう生かしたか",
    "source": {
      "title": "自社製品のブランディング事例",
      "url": "https://forbesjapan.com/articles/detail/36085",
      "publisher": "Forbes JAPAN",
      "date": null
    }
  },
  {
    "id": "success-004",
    "kind": "success",
    "title": "町工場とデザイナーで共同ブランド",
    "summary": "中小企業3社とデザイナーが組んで町工場発の文房具ブランドを作った例。企画とデザインを外の力で補い、展示会でも1社単独より目立つ発信ができた。",
    "industries": [
      "印刷",
      "樹脂成形",
      "金属加工"
    ],
    "useFor": [
      "article_idea"
    ],
    "source": {
      "title": "企画・デザイン×技術力が決め手! 中小企業が「脱下請け」を図る方法",
      "url": "https://newswitch.jp/p/4492",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "success-005",
    "kind": "success",
    "title": "町工場どうしの横請けで受注増",
    "summary": "大阪商工会議所は町工場どうしが得意分野を持ち寄る「横請け」を後押し。1社ではできない一貫加工を受けられるようにして、受注を増やす狙い。",
    "industries": [
      "切削加工",
      "板金",
      "溶接",
      "金属加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "うちでできない工程は、仲間の工場とこう組んでいます",
    "source": {
      "title": "町工場の連携強める 「横請け」で受注増狙う 大阪商工会議所",
      "url": "https://www.rodo.co.jp/news/23225/",
      "publisher": "労働新聞社",
      "date": null
    }
  },
  {
    "id": "pain-025",
    "kind": "pain",
    "title": "若手が応募してくれない",
    "summary": "中小製造業は知名度が低く、求人を出しても若手の応募が集まりにくい。ただ規模が原因というより、仕事の中身や会社の良さを求職者目線で伝えられていないことが大きい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "入社1年目の社員に聞いた、うちの工場の一日",
    "source": {
      "title": "中小企業の採用がうまくいかない理由",
      "url": "https://career-research.mynavi.jp/column/20260512_110124/",
      "publisher": "マイナビキャリアリサーチLab",
      "date": "2026-05"
    }
  },
  {
    "id": "question-002",
    "kind": "question",
    "title": "1個だけでも作ってもらえますか？",
    "summary": "金型不要の切削なら1個から作れる理由、1個だと単価が上がる理由（段取り費）、何個から割安になるかの目安を自社の実例で示す。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "1個からの切削加工、いくらかかる？単価が下がる個数の目安",
    "source": {
      "title": "研究開発・試作向け切削加工の解説",
      "url": "https://active.nikkeibp.co.jp/atcl/wp/b/20/07/09/00690/",
      "publisher": "日経クロステック Active",
      "date": null
    }
  },
  {
    "id": "question-003",
    "kind": "question",
    "title": "試作で数個だけ頼むのは迷惑？",
    "summary": "試作・小ロット専門で受ける姿勢を明言し、1個・5個など少数の受け方、試作でも量産同等の精度を出す工夫、問い合わせの仕方を書く。",
    "industries": [
      "切削加工",
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "数個の試作、遠慮なくご相談ください｜少量でも受ける理由",
    "source": {
      "title": "1個からの小ロット対応（三重県の企業紹介資料）",
      "url": "https://www.pref.mie.lg.jp/common/content/001245390.pdf",
      "publisher": "三重県",
      "date": null
    }
  },
  {
    "id": "question-004",
    "kind": "question",
    "title": "図面がなくても相談できますか？",
    "summary": "手書きスケッチ・写真・現物・寸法メモでも受けられるか、図面化を誰が担うか、その費用、最初に伝えてほしい情報（材質・数量・用途・納期）を書く。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "図面なしでもOK｜手書きスケッチから部品ができるまで",
    "source": {
      "title": "図面がない個人でも金属加工を依頼できる仕組み",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2512/24/news005.html",
      "publisher": "MONOist",
      "date": "2025-12"
    }
  },
  {
    "id": "question-005",
    "kind": "question",
    "title": "手描きのポンチ絵で見積もりできる？",
    "summary": "ポンチ絵で概算は出せるが、正式見積もりには寸法と公差が要ること、図面を起こす流れと追加費用の有無を説明する。",
    "industries": [
      "切削加工",
      "板金",
      "溶接"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "articleIdea": "ポンチ絵から見積もりまでの流れと、伝えるべき5項目",
    "source": {
      "title": "ものづくり相談室の利用案内（ポンチ絵受付）",
      "url": "https://www.waseda.jp/inst/twins/assets/uploads/2017/01/20120911_manufacture.pdf",
      "publisher": "早稲田大学TWIns",
      "date": null
    }
  },
  {
    "id": "question-006",
    "kind": "question",
    "title": "現物しかない部品を作り直せる？",
    "summary": "図面のない古い部品を採寸・3D化して再製作できるか、摩耗部の寸法の決め方、元の材質が不明な場合の対応を書く。",
    "industries": [
      "切削加工",
      "板金",
      "樹脂成形"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "図面のない壊れた部品、現物から作り直せます",
    "source": {
      "title": "現物から3D CAD・2D図面を作成するサービス例",
      "url": "https://coconala.com/services/4328435",
      "publisher": "ココナラ",
      "date": null
    }
  },
  {
    "id": "question-007",
    "kind": "question",
    "title": "見積もり依頼に何を書けばいい？",
    "summary": "図面（版数）、材質、数量（試作か量産か）、加工内容、表面処理、検査、納期、予算を並べると聞き返しが減ることを、チェックリストで示す。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "見積もりが早く返ってくる依頼の書き方チェックリスト",
    "source": {
      "title": "製造業の見積もり依頼フォームで抜け漏れを防ぐ",
      "url": "https://claudecode-lab.com/blog/manufacturing-quote-request-form-claude-code/",
      "publisher": "claudecode-lab",
      "date": null
    }
  },
  {
    "id": "question-008",
    "kind": "question",
    "title": "鋼材の見積もり、何を伝えれば？",
    "summary": "規格寸法か仕上がり寸法か、数量、材質名、切断・穴あけなどの加工内容を伝えること、図面や写真を添えると早いことを書く。",
    "industries": [
      "切削加工",
      "板金",
      "溶接"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "articleIdea": "材料と加工をまとめて頼むときの見積もり依頼のコツ",
    "source": {
      "title": "鋼材の見積もり依頼に必要な情報",
      "url": "https://cad-kenkyujo.com/kouzai-mitsumori/",
      "publisher": "CAD研究所",
      "date": null
    }
  },
  {
    "id": "question-009",
    "kind": "question",
    "title": "3Dデータを送ればすぐ値段が分かる？",
    "summary": "ネットの自動見積もりの仕組みと限界（ピン角など自動で出せない形状）を説明し、人が見る見積もりとの違い・自社の強みを書く。",
    "industries": [
      "切削加工",
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "自動見積もりと町工場の見積もり、どう使い分ける？",
    "source": {
      "title": "meviyのピン角へのR提案機能",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2402/16/news009.html",
      "publisher": "MONOist",
      "date": "2024-02"
    }
  },
  {
    "id": "question-010",
    "kind": "question",
    "title": "最短何日で出荷できますか？",
    "summary": "通常納期と特急の目安、短納期にできる条件（材料在庫・表面処理なし）、めっきや塗装を足すと何日延びるかを示す。",
    "industries": [
      "切削加工",
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "短納期で頼みたい時に知っておくこと｜納期が延びる要因",
    "source": {
      "title": "meviy板金部品の短納期対象拡大",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2201/28/news019.html",
      "publisher": "MONOist",
      "date": "2022-01"
    }
  },
  {
    "id": "question-011",
    "kind": "question",
    "title": "なぜ1個だと単価が高いの？",
    "summary": "段取り時間は数量に関係なくかかり、少量だと1個あたりに重く乗ることを、数量別の見積もり例で分かりやすく示す。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "1個と100個で単価が違う理由｜見積もりの内訳を公開",
    "source": {
      "title": "設計見積もりの考え方（材料費＋加工費）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2301/16/news006.html",
      "publisher": "MONOist",
      "date": "2023-01"
    }
  },
  {
    "id": "question-012",
    "kind": "question",
    "title": "見積もりの加工費はどう決まる？",
    "summary": "加工費は機械と人の時間単価（賃率）×時間で決まること、公差や検査が厳しいと時間が増えることを説明する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "見積もり金額はこう決まる｜賃率と加工時間の話",
    "source": {
      "title": "見積価格の賃率（加工レート）の決め方",
      "url": "https://mono.ipros.com/product/detail/2000733031",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-013",
    "kind": "question",
    "title": "公差はどこまで出せますか？",
    "summary": "自社の得意な精度帯、普通公差で足りる寸法と個別公差が要る寸法の違い、精度を上げるとコストが増えることを書く。",
    "industries": [
      "切削加工",
      "研削"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "その公差、本当に必要？精度とコストの関係",
    "source": {
      "title": "JIS製図法と普通公差の等級指定",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2504/02/news033_2.html",
      "publisher": "MONOist",
      "date": "2025-04"
    }
  },
  {
    "id": "question-014",
    "kind": "question",
    "title": "図面の普通公差、指定しないとどうなる？",
    "summary": "等級（精級・中級・粗級）を書かないと長い部品で解釈がずれること、受注側が確認する点と事前のすり合わせ方を書く。",
    "industries": [
      "切削加工",
      "板金",
      "溶接"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "普通公差の等級、書き忘れていませんか？トラブル事例",
    "source": {
      "title": "2Dと3Dの融合と公差設計の重要性",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1611/24/news018_3.html",
      "publisher": "MONOist",
      "date": "2016-11"
    }
  },
  {
    "id": "question-015",
    "kind": "question",
    "title": "表面粗さRaはどう指定すれば？",
    "summary": "機能に必要な面だけ厳しくし、他は緩めるとコストが下がること、シール面はRzを使う場合、古い▽記号の読み替えを説明する。",
    "industries": [
      "切削加工",
      "研削"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "表面粗さの指定でコストが変わる｜Raの決め方",
    "source": {
      "title": "表面粗さ記号の新旧（技術の森レビュー）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/0911/30/news085_2.html",
      "publisher": "MONOist",
      "date": "2009-11"
    }
  },
  {
    "id": "question-016",
    "kind": "question",
    "title": "鏡面研磨すると寸法は変わる？",
    "summary": "研磨で少し削れるため寸法公差を見込む必要があること、どの面をどこまで光らせるかを先に決めることを書く。",
    "industries": [
      "研削"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "articleIdea": "鏡面仕上げを頼む前に｜寸法と仕上がりの決め方",
    "source": {
      "title": "研磨仕上げサービスの解説",
      "url": "https://www.rapiddirect.com/ja/surface-finish/polishing-finish-services/",
      "publisher": "RapidDirect",
      "date": null
    }
  },
  {
    "id": "question-017",
    "kind": "question",
    "title": "アルミとステンレス、どっちがいい？",
    "summary": "重さ・強さ・錆びにくさ・熱・加工のしやすさ・価格で比べ、用途別のおすすめと、迷ったときの相談方法を書く。",
    "industries": [
      "切削加工",
      "板金",
      "溶接"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "アルミかステンレスか｜用途別の選び方をやさしく解説",
    "source": {
      "title": "機械材料の基本と試作（材料は適材適所）",
      "url": "https://monoist.itmedia.co.jp/mn/spv/1703/29/news035_2.html",
      "publisher": "MONOist",
      "date": "2017-03"
    }
  },
  {
    "id": "question-018",
    "kind": "question",
    "title": "SS400とS45C、何が違う？",
    "summary": "SS400は溶接しやすい構造用、S45Cは焼入れで硬くできる機械部品用という違いと、錆止めの要否、用途例を書く。",
    "industries": [
      "切削加工",
      "溶接",
      "熱処理"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "SS400とS45Cの使い分け｜架台とシャフトで考える",
    "source": {
      "title": "JISから見た機械材料 鋼の種類と違い",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2512/03/news006.html",
      "publisher": "MONOist",
      "date": "2025-12"
    }
  },
  {
    "id": "question-019",
    "kind": "question",
    "title": "ステンレスの種類はどう選ぶ？",
    "summary": "錆びにくさ・磁性・熱処理で硬くなるかで系統が違うこと、塩分のある環境で割れが起こる場合があることを書く。",
    "industries": [
      "切削加工",
      "板金",
      "溶接"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "articleIdea": "SUS304だけじゃない｜ステンレスの種類と選び方",
    "source": {
      "title": "ステンレスに関するよくある質問",
      "url": "https://www.nipponsteel.com/product/faq/stainless/",
      "publisher": "日本製鉄",
      "date": null
    }
  },
  {
    "id": "question-020",
    "kind": "question",
    "title": "樹脂はABS・POM・ナイロンどれ？",
    "summary": "筐体はABS、透明や耐衝撃はPC、歯車や摺動はPOM、強度部品はナイロン（吸水で寸法変化）と、用途から選ぶ目安を書く。",
    "industries": [
      "3Dプリンタ",
      "切削加工",
      "樹脂成形"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "樹脂部品の材料選び｜ABS・PC・POM・ナイロンの違い",
    "source": {
      "title": "射出成形部品の樹脂の選び方",
      "url": "https://www.protolabs.com/resources/design-tips/selecting-the-right-plastic-for-your-parts/",
      "publisher": "Protolabs",
      "date": null
    }
  },
  {
    "id": "question-021",
    "kind": "question",
    "title": "樹脂の試作は切削？成形？",
    "summary": "数個なら切削、成形での反りやヒケを確かめたいなら簡易金型、と目的と数量で選ぶ考え方を書く。",
    "industries": [
      "切削加工",
      "樹脂成形"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "樹脂試作は切削か射出成形か｜個数と目的で決める",
    "source": {
      "title": "短納期射出成形の解説",
      "url": "https://news.mynavi.jp/techplus/article/protolabs-13/",
      "publisher": "マイナビニュース TECH+",
      "date": null
    }
  },
  {
    "id": "question-022",
    "kind": "question",
    "title": "切削の試作品は量産品と同じ？",
    "summary": "切削や3Dプリンタは材料や成形性が量産と異なり、成形できない形も作れてしまう点、評価で注意すべきことを書く。",
    "industries": [
      "3Dプリンタ",
      "切削加工",
      "樹脂成形"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "試作品で確かめられること・確かめられないこと",
    "source": {
      "title": "樹脂の試作と小ロット生産の研究報告",
      "url": "https://www.pref.yamanashi.jp/documents/99604/p23_02-11.pdf",
      "publisher": "山梨県産業技術センター",
      "date": null
    }
  },
  {
    "id": "question-023",
    "kind": "question",
    "title": "金型代はいくらかかりますか？",
    "summary": "金型代は形状・サイズ・取り数で大きく変わること、金型代を数量で割った1個あたりの負担、簡易型やアルミ型の選択肢を書く。",
    "industries": [
      "プレス",
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "金型代の考え方｜数量で割ると1個いくら？",
    "source": {
      "title": "コストは金型代だけじゃない 射出成形のフロントローディング",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1504/24/news001.html",
      "publisher": "MONOist",
      "date": "2015-04"
    }
  },
  {
    "id": "question-024",
    "kind": "question",
    "title": "少量なら簡易金型で安くできる？",
    "summary": "簡易型・アルミ型が向く数量帯と、形状・材料によっては使えない場合、量産型との寿命や精度の違いを書く。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "簡易金型とは？少量生産で金型費を抑える方法",
    "source": {
      "title": "少量多品種対応金型で成形品を納入",
      "url": "https://mono.ipros.com/product/detail/2000033153",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-025",
    "kind": "question",
    "title": "プレスは何個から頼める？",
    "summary": "受けられる最小ロットと、金型費を回収できる数量の考え方、少ないときはレーザー＋曲げの板金に切り替える選択肢を書く。",
    "industries": [
      "プレス",
      "板金",
      "金型"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "プレス加工は何個から？板金との分かれ目",
    "source": {
      "title": "順送プレスのロットと価格メリット",
      "url": "https://special.nikkeibp.co.jp/atclh/NXT/25/OSAKA2025/tange/",
      "publisher": "日経クロステック Special",
      "date": "2025"
    }
  },
  {
    "id": "question-026",
    "kind": "question",
    "title": "金型は誰のもの？保管料は？",
    "summary": "金型の所有者、保管期間と費用負担、使わなくなった型の返却・廃棄のルールを最初に決めておくことを書く。",
    "industries": [
      "プレス",
      "樹脂成形",
      "金型",
      "鋳造",
      "鍛造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "金型の所有と保管、発注前に決めておくこと",
    "source": {
      "title": "型取引の適正化に関する資料",
      "url": "https://www.chusho.meti.go.jp/koukai/kenkyukai/katatorihiki/2019/download/190806katatorihiki06.pdf",
      "publisher": "中小企業庁",
      "date": "2019-08"
    }
  },
  {
    "id": "question-027",
    "kind": "question",
    "title": "板金の切断はレーザー？タレパン？",
    "summary": "レーザーは金型不要で少量や試作向き、タレパンは穴の多い量産向き、銅やアルミの対応可否など違いを説明する。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "レーザー加工とタレパンの違い｜少量ならどっち？",
    "source": {
      "title": "レーザー加工機の種類と特徴",
      "url": "https://cad-kenkyujo.com/laser-machine/",
      "publisher": "CAD研究所",
      "date": null
    }
  },
  {
    "id": "question-028",
    "kind": "question",
    "title": "溶接とボルト、どっちがいい？",
    "summary": "ボルトは分解できる、溶接は部品が減り一体で強いが熱で歪む、余計な溶接は疲労割れの元、と使い分けを書く。",
    "industries": [
      "板金",
      "溶接"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "溶接かボルトか｜分解・強度・コストで選ぶ",
    "source": {
      "title": "余計な溶接が疲労破断を招く L金具の取り付け",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2610/27/news003_3.html",
      "publisher": "MONOist",
      "date": "2026-10"
    }
  },
  {
    "id": "question-029",
    "kind": "question",
    "title": "ネジを減らすと安くなる？",
    "summary": "ネジ本数は部品点数と組立時間に直結すること、溶接・かしめ・形状の工夫で減らせる例を書く。",
    "industries": [
      "プレス",
      "板金",
      "溶接"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ネジを減らしてコストダウン｜組立を楽にする設計",
    "source": {
      "title": "組み付けるネジ本数を減らしてコストダウン",
      "url": "https://monoist.itmedia.co.jp/mn/articles/0806/25/news133.html",
      "publisher": "MONOist",
      "date": "2008-06"
    }
  },
  {
    "id": "question-030",
    "kind": "question",
    "title": "ステンレス溶接の焼けや歪みは？",
    "summary": "焼けを残すと錆びやすくなること、電解や酸洗での焼け取り、治具・溶接順序・レーザー溶接で歪みを抑える方法を書く。",
    "industries": [
      "板金",
      "溶接",
      "表面処理"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ステンレス溶接の焼けと歪み、うちはこう抑えます",
    "source": {
      "title": "ステンレス鋼の溶接焼けの電気化学的除去方法",
      "url": "https://www.pref.kagawa.lg.jp/sangyo/jinzaiikuse/gijutsu_seminar/r06/r6_monozukuri_4rd_benkyoukai_sutenresu.html",
      "publisher": "香川県",
      "date": null
    }
  },
  {
    "id": "question-031",
    "kind": "question",
    "title": "めっきは何を選べばいい？",
    "summary": "防錆なら亜鉛（＋クロメート）、見た目や防食ならニッケル・クロムなど目的別の選び方と、使う環境を伝える大切さを書く。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "めっきの種類と選び方｜亜鉛・ニッケル・クロム",
    "source": {
      "title": "めっきの耐食性に関する技術資料",
      "url": "https://orist.jp/dl/izumi/archive/Gijutsu_shiryo/plating_Corr.pdf",
      "publisher": "大阪産業技術研究所",
      "date": null
    }
  },
  {
    "id": "question-032",
    "kind": "question",
    "title": "ユニクロとクロメートの違いは？",
    "summary": "同じ三価でも見た目重視と防錆重視で種類が違うこと、色の違い、図面にどう書けば伝わるかを書く。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "articleIdea": "三価ユニクロと三価クロメート、何が違う？",
    "source": {
      "title": "めっきの種類解説（ミスミ技術情報）",
      "url": "https://jp.misumi-ec.com/tech-info/work-knowledge/machining/plating/3",
      "publisher": "ミスミ",
      "date": null
    }
  },
  {
    "id": "question-033",
    "kind": "question",
    "title": "アルマイトで寸法は変わる？",
    "summary": "皮膜の約半分が外側に増えるため、はめあい部は仕上げ寸法を見込む必要があること、再処理で寸法が減ることを書く。",
    "industries": [
      "切削加工",
      "表面処理"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "アルマイトで寸法が変わる？設計で見込む量",
    "source": {
      "title": "アルマイトの解説（ミスミ技術情報）",
      "url": "https://jp.misumi-ec.com/tech-info/work-knowledge/machining/anodizing",
      "publisher": "ミスミ",
      "date": null
    }
  },
  {
    "id": "question-034",
    "kind": "question",
    "title": "アルマイトの色はそろう？",
    "summary": "合金の種類と膜厚で色が変わること、黒を濃くするには膜厚が要る、硬質は色が限られることを説明する。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "articleIdea": "アルマイトの色ムラはなぜ起きる？色指定のコツ",
    "source": {
      "title": "アルマイト処理の製品情報",
      "url": "https://mono.ipros.com/product/detail/2000146451",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-035",
    "kind": "question",
    "title": "粉体塗装と普通の塗装の違いは？",
    "summary": "粉体は厚膜で屋外や錆対策に強いが高温で焼くため木や樹脂は不可、少量や色合わせは溶剤塗装が有利な場合を書く。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "粉体塗装と溶剤塗装、どちらを選ぶ？用途別ガイド",
    "source": {
      "title": "設計者のためのインダストリアルデザイン入門 加工技術10選",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2308/07/news013_3.html",
      "publisher": "MONOist",
      "date": "2023-08"
    }
  },
  {
    "id": "question-036",
    "kind": "question",
    "title": "熱処理を頼むとき何を伝える？",
    "summary": "鋼種、狙いの硬さ、焼戻し条件、研磨代の有無、歪みの許容値を伝えると手戻りが減ることを書く。",
    "industries": [
      "熱処理"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "熱処理を頼む前に決めること｜硬さ・歪み・研磨代",
    "source": {
      "title": "熱処理と研磨しろに関する研究報告",
      "url": "https://www.chusho.meti.go.jp/keiei/sapoin/portal/seika/2010/22h-149.pdf",
      "publisher": "中小企業庁",
      "date": "2010"
    }
  },
  {
    "id": "question-037",
    "kind": "question",
    "title": "焼入れで部品は歪みますか？",
    "summary": "熱処理では歪みが避けにくいこと、局部焼入れや前の応力除去で抑える方法、歪みを見込んだ工程順を書く。",
    "industries": [
      "切削加工",
      "熱処理",
      "研削"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "焼入れの歪み、どこまで抑えられる？",
    "source": {
      "title": "熱処理ひずみ低減技術の紹介",
      "url": "https://mono.ipros.com/product/detail/2000759229",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-038",
    "kind": "question",
    "title": "鋳造と鍛造、どちらが向いてる？",
    "summary": "鋳造は形の自由度が高く大量・複雑形状向き、鍛造は組織が締まり強い部品向き、と強度とコストの違いを書く。",
    "industries": [
      "鋳造",
      "鍛造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "鋳造と鍛造の違い｜強さ・形・コストで選ぶ",
    "source": {
      "title": "鉄鋼材料の成形加工法（鋳造、圧延、鍛造）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2601/20/news006_3.html",
      "publisher": "MONOist",
      "date": "2026-01"
    }
  },
  {
    "id": "question-039",
    "kind": "question",
    "title": "鋳物の試作、少量でもできる？",
    "summary": "砂型や石こう型なら金型なしで少量試作ができること、量産のダイカストと材質が違い評価がずれる点を書く。",
    "industries": [
      "鋳造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "アルミ鋳物を少量で作るには｜砂型・石こう型・ダイカスト",
    "source": {
      "title": "ダイカストの特徴と初期費用",
      "url": "https://active.nikkeibp.co.jp/atcl/wp/b/20/06/18/00641/",
      "publisher": "日経クロステック Active",
      "date": "2020-06"
    }
  },
  {
    "id": "question-040",
    "kind": "question",
    "title": "鍛造の試作に金型は必要？",
    "summary": "型鍛造は金型が要り精度が高く量産向き、自由鍛造は型を使わず一品物向き、試作時の選び方を書く。",
    "industries": [
      "鍛造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "自由鍛造と型鍛造の違い｜試作・少量の進め方",
    "source": {
      "title": "鍛造試作の案内",
      "url": "https://pr.mono.ipros.com/matsui-ss/product/detail/2000575945/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-041",
    "kind": "question",
    "title": "3Dプリンタと切削、どちらで作る？",
    "summary": "複雑形状・少量は3Dプリンタ、材料特性の安定や強度が要るなら切削、と目的別の選び方と費用の決まり方を書く。",
    "industries": [
      "3Dプリンタ",
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "3Dプリンタか切削か｜試作の目的で選ぶ",
    "source": {
      "title": "3Dプリンター出力の料金相場",
      "url": "https://imitsu.jp/cost/printing/3d-printer-price",
      "publisher": "アイミツ",
      "date": null
    }
  },
  {
    "id": "question-042",
    "kind": "question",
    "title": "3Dプリントの料金はどう決まる？",
    "summary": "体積と造形時間、材料、サポート除去や表面仕上げなどの後処理で決まることを、見積もりの読み方として書く。",
    "industries": [
      "3Dプリンタ"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "articleIdea": "3Dプリント出力の見積もり、何で金額が変わる？",
    "source": {
      "title": "3Dプリント費用の比較",
      "url": "https://jlc3dp.com/jp/blog/3d-printing-cost-comparison",
      "publisher": "JLC3DP",
      "date": null
    }
  },
  {
    "id": "question-043",
    "kind": "question",
    "title": "3Dデータだけで発注できる？",
    "summary": "STEP推奨・IGESは指定時、寸法公差や材質を書いた2D図面も添えると見積もりと検査が確実になることを書く。",
    "industries": [
      "3Dプリンタ",
      "切削加工",
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "3Dデータと2D図面、両方必要？送るファイルの正解",
    "source": {
      "title": "2Dと3Dの融合（図面が必要な理由）",
      "url": "https://monoist.itmedia.co.jp/mn/spv/1609/28/news028_2.html",
      "publisher": "MONOist",
      "date": "2016-09"
    }
  },
  {
    "id": "question-044",
    "kind": "question",
    "title": "検査成績書は出してもらえる？",
    "summary": "寸法の検査成績書とミルシート（材料証明）の違い、加工後の品質はミルシートでは示せないこと、発行の可否と日数を書く。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "検査成績書とミルシートの違い｜何が証明される？",
    "source": {
      "title": "検査成績書・試験成績書・ミルシートの違い",
      "url": "https://www.issoh.co.jp/column/details/16895/",
      "publisher": "issoh",
      "date": null
    }
  },
  {
    "id": "question-045",
    "kind": "question",
    "title": "三次元測定の結果も付けられる？",
    "summary": "どの測定機で何を測れるか、成績書付き納品の条件、依頼時に要否を伝えることを書く。",
    "industries": [
      "切削加工",
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "三次元測定で品質を見える化｜成績書付き納品",
    "source": {
      "title": "加工・組立・三次元測定の一貫対応",
      "url": "https://mono.ipros.com/product/detail/2001522953",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-046",
    "kind": "question",
    "title": "試作から量産まで同じ会社で？",
    "summary": "窓口が一本化され説明の手間と伝達ミスが減ること、量産を見据えた試作ができること、外注工程の有無を確認する点を書く。",
    "industries": [
      "プレス",
      "切削加工",
      "板金",
      "樹脂成形"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "試作と量産を同じ会社に頼むメリットと確認点",
    "source": {
      "title": "ものづくり300社 切削試作から射出成形量産までの一貫体制",
      "url": "https://www.chusho.meti.go.jp/keiei/sapoin/monozukuri300sha/2020/seisan/seisan040.pdf",
      "publisher": "中小企業庁",
      "date": "2020"
    }
  },
  {
    "id": "question-047",
    "kind": "question",
    "title": "海外に頼むのと国内、どう違う？",
    "summary": "価格は海外が有利な場合が多いが、品質のばらつき・図面解釈のずれ・物流遅延・時差の連絡がある点を比べ、国内の強みを書く。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "海外調達と国内加工の違い｜安さ以外で比べる",
    "source": {
      "title": "図面表記の曖昧さが生む現地調達部品のトラブル",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2208/10/news004_2.html",
      "publisher": "MONOist",
      "date": "2022-08"
    }
  },
  {
    "id": "question-048",
    "kind": "question",
    "title": "海外で作ると納期は安定する？",
    "summary": "国際物流の停滞で納期が読めなくなった例を示し、国内調達で在庫や急な変更に対応しやすい点を書く。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "国内加工に切り替えるべき？納期と在庫から考える",
    "source": {
      "title": "JETRO海外発トレンドレポート（北京）",
      "url": "https://www.jetro.go.jp/biz/trendreports/2023/9a05908a3717c906.html",
      "publisher": "JETRO",
      "date": "2023"
    }
  },
  {
    "id": "question-049",
    "kind": "question",
    "title": "加工先はどうやって探せばいい？",
    "summary": "得意分野が細かく分かれていること、マッチングサイトや自治体の受発注相談の使い方、問い合わせ前に見るべき点を書く。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "町工場の探し方｜得意分野の見分け方と相談窓口",
    "source": {
      "title": "町工場の受発注と調達の課題（インタビュー）",
      "url": "https://kawasaki-net.ne.jp/audition/wp-content/uploads/2024/09/R1_interview1_119_キャディ.pdf",
      "publisher": "川崎市産業振興財団",
      "date": "2024-09"
    }
  },
  {
    "id": "question-050",
    "kind": "question",
    "title": "材質や加工法から相談できる？",
    "summary": "作りたい物と用途を伝えれば材質・工法・形状を提案できるか、設計段階で相談するとコストが下がる理由を書く。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "設計の前に相談を｜材質と加工法の提案でコスト削減",
    "source": {
      "title": "加工会社の選び方（日経クロステック Active）",
      "url": "https://active.nikkeibp.co.jp/atcl/wp/b/22/03/24/02465/",
      "publisher": "日経クロステック Active",
      "date": "2022-03"
    }
  },
  {
    "id": "question-051",
    "kind": "question",
    "title": "個人でも頼めますか？",
    "summary": "個人・1個からの依頼を受けるか最初に明記し、断られやすい理由（段取り費）と、受けられる条件・頼み方を書く。",
    "industries": [
      "切削加工",
      "板金",
      "溶接"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "個人の方の1個のご依頼も受けています｜頼み方ガイド",
    "source": {
      "title": "個人でも1個から注文できる金属加工サイト",
      "url": "https://www.value-press.com/pressrelease/69455",
      "publisher": "valuePress",
      "date": "2010"
    }
  },
  {
    "id": "question-052",
    "kind": "question",
    "title": "図面を渡しても秘密は守られる？",
    "summary": "秘密保持契約（NDA）を結べるか、図面・データの管理方法、目的外に使わないことを具体的に書く。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "試作図面の秘密保持｜NDAと情報管理の取り組み",
    "source": {
      "title": "いまさら聞けないNDAの結び方 目的外使用禁止",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1605/31/news009.html",
      "publisher": "MONOist",
      "date": "2016-05"
    }
  },
  {
    "id": "question-053",
    "kind": "question",
    "title": "食品OEMは何個から作れる？",
    "summary": "最低ロットが原材料の仕入れ単位や設備で決まること、自社の最小ロット、試作と賞味期限検査を含む初回の流れを書く。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "食品OEMは小ロットからできる？初回の流れと費用",
    "source": {
      "title": "みやぎOEMマッチング 事業者情報",
      "url": "https://www.pref.miyagi.jp/site/miyagi_oem/jigyosha/detail17.html",
      "publisher": "宮城県",
      "date": null
    }
  },
  {
    "id": "question-054",
    "kind": "question",
    "title": "オリジナル箱は何個から？",
    "summary": "小ロット対応の最小数、木型代・版代の有無、印刷方式による違い、総額と納期の数え方を書く。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "オリジナル箱を少量で作る｜版代・木型代の考え方",
    "source": {
      "title": "小ロット対応のオリジナル箱の業者選び",
      "url": "https://imitsu.jp/list/printing/original-box-small-lot",
      "publisher": "アイミツ",
      "date": null
    }
  },
  {
    "id": "question-055",
    "kind": "question",
    "title": "箱のサンプルを作ってから決めたい",
    "summary": "小ロットで複数サンプルを作って比べられるか、サンプル費用と本生産への引き継ぎを書く。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "貼箱は試作して比べよう｜サンプルから量産まで",
    "source": {
      "title": "貼箱の業者選び",
      "url": "https://imitsu.jp/list/printing/paste-box",
      "publisher": "アイミツ",
      "date": null
    }
  },
  {
    "id": "question-056",
    "kind": "question",
    "title": "特注家具・什器はどこまで頼める？",
    "summary": "設計から製作・塗装・取付まで一貫で受けるか、フル／セミオーダーの違い、法人の納入事例、施工を伴う場合の確認点を書く。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "店舗什器・特注家具の頼み方｜設計から取付まで",
    "source": {
      "title": "特注家具・什器の製品一覧",
      "url": "https://mono.ipros.com/cg2/特注家具/什器",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-057",
    "kind": "question",
    "title": "板厚はどこまで対応できる？",
    "summary": "自社で扱える板厚・材質・サイズの範囲を表で示し、範囲外のときの対応（協力会社・別工法）を書く。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "articleIdea": "対応できる板厚・サイズ一覧｜範囲外のご相談も",
    "source": {
      "title": "meviyサービス案内パンフレット",
      "url": "https://jp.meviy.misumi-ec.com/info/ja/wp-content/uploads/2024/06/meviy_brochure20240601.pdf",
      "publisher": "ミスミ",
      "date": "2024-06"
    }
  },
  {
    "id": "success-006",
    "kind": "success",
    "title": "営業なしでWeb経由の受注",
    "summary": "経営危機を経た精密切削の町工場が、公式サイトに加え切削加工の解説サイトやSNSを運営。航空機部品の受注がサイトからの問い合わせから始まった。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "自社の加工を解説する専門ページを作った理由",
    "source": {
      "title": "「営業ゼロ」でも顧客接点を創る、航空宇宙業界に進出した町工場のWeb戦略",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2108/25/news007.html",
      "publisher": "MONOist",
      "date": "2021-08"
    }
  },
  {
    "id": "success-007",
    "kind": "success",
    "title": "会社サイトと技術解説サイトを分ける",
    "summary": "会社案内のサイトとは別に、加工の悩みに答える技術解説サイトを持つと、自社を知らない発注者の検索に見つかりやすくなる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "「営業ゼロ」でも顧客接点を創る、航空宇宙業界に進出した町工場のWeb戦略",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2108/25/news007.html",
      "publisher": "MONOist",
      "date": "2021-08"
    }
  },
  {
    "id": "success-008",
    "kind": "success",
    "title": "20人規模でネット経由500社超と取引",
    "summary": "従業員約20名の旋盤・フライス加工の町工場が、ネット集客で500社を超える取引を実現し、100社超の協力会社と連携していると紹介されている。",
    "industries": [
      "切削加工",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "協力会社と組んで対応できる加工範囲",
    "source": {
      "title": "勉強会案内状（Webセミナー）",
      "url": "https://www.jdmia.or.jp/wp/wp-content/uploads/2022/03/20220407勉強会案内状（Webｾﾐﾅｰ）.pdf",
      "publisher": "日本金型工業会 西部支部",
      "date": "2022-03"
    }
  },
  {
    "id": "success-009",
    "kind": "success",
    "title": "試行錯誤をそのままブログで公開",
    "summary": "金属加工などを営む会社が、ネット集客で8年間に約500社と取引したと発表。集客の試行錯誤の事例をブログで公開し、それ自体が問い合わせを呼んでいる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "うまくいかなかった工夫と、その後の改善",
    "source": {
      "title": "ネット集客ノウハウブログに関するプレスリリース",
      "url": "https://pc.watch.impress.co.jp/docs/release/atpress/1349757.html",
      "publisher": "PC Watch（@Press配信）",
      "date": null
    }
  },
  {
    "id": "success-010",
    "kind": "success",
    "title": "数字で見て直すとサイトが働く",
    "summary": "国の支援で技術開発した企業のサイトを、アクセスなどの数字で見える化し、課題を改修。訪問数や滞在時間が伸び、問い合わせや受注につながった例があった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "サポイン事業発信力向上支援事業",
      "url": "https://www.tohoku.meti.go.jp/s_sangi/pdf/supoin_2018.pdf",
      "publisher": "東北経済産業局",
      "date": "2018"
    }
  },
  {
    "id": "pain-026",
    "kind": "pain",
    "title": "サイトはあるが営業に使えていない",
    "summary": "技術開発の支援を受けた企業の多くが自社サイトを持つものの、使い方や効果が分からず、営業の道具として十分に生かせていなかった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "サポイン事業発信力向上支援事業",
      "url": "https://www.tohoku.meti.go.jp/s_sangi/pdf/supoin_2018.pdf",
      "publisher": "東北経済産業局",
      "date": "2018"
    }
  },
  {
    "id": "pain-027",
    "kind": "pain",
    "title": "「1個から・格安」で客層がずれる",
    "summary": "サイト刷新で問い合わせは途切れなくなったが、「1個から」「格安」を前に出したため少量・短納期・図面なしの見積もりばかりになり、売上に結びつかなかった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "小さなものづくり企業の営業改革大作戦 #2",
      "url": "https://newswitch.jp/p/35760",
      "publisher": "ニュースイッチ（日刊工業新聞）",
      "date": null
    }
  },
  {
    "id": "success-011",
    "kind": "success",
    "title": "来てほしい客を先に決めて書く",
    "summary": "問い合わせの数より、強みが生きる仕事を呼べるかが大事。誰に来てほしいかを絞り、その相手に向けた言葉で強みを伝えると受注につながりやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "うちが得意な仕事・お断りしている仕事",
    "source": {
      "title": "小さなものづくり企業の営業改革大作戦 #2",
      "url": "https://newswitch.jp/p/35760",
      "publisher": "ニュースイッチ（日刊工業新聞）",
      "date": null
    }
  },
  {
    "id": "success-012",
    "kind": "success",
    "title": "加工事例ページが一番効く",
    "summary": "受注型の中小製造業では、加工事例のページが問い合わせ獲得に特に効くと、支援経験から述べられている。費用をかけず自社の知恵で充実できる対策でもある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "この部品をこう加工しました（加工事例）",
    "source": {
      "title": "中小製造業のWebマーケティング（加工事例コンテンツ）",
      "url": "https://www.sbbit.jp/article/cont1/47900",
      "publisher": "ビジネス+IT（SBクリエイティブ）",
      "date": null
    }
  },
  {
    "id": "success-013",
    "kind": "success",
    "title": "事例には部品名・素材・公差を書く",
    "summary": "発注者は図面の情報を手がかりに検索し、事例ページで技術力を判断する。部品名、加工方法、素材名、寸法公差を具体的に書くと見つかりやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小製造業のWebマーケティング（加工事例コンテンツ）",
      "url": "https://www.sbbit.jp/article/cont1/47900",
      "publisher": "ビジネス+IT（SBクリエイティブ）",
      "date": null
    }
  },
  {
    "id": "pain-028",
    "kind": "pain",
    "title": "社名検索の客しか来ていない",
    "summary": "多くの製造業サイトは、すでに社名を知る人の検索ばかりで、自社を知らない会社に見られていない。まず検索語の流入を確かめることが第一歩とされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "新規顧客が集まらない製造業のWebサイト、活用を阻む3つの壁",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2303/22/news005.html",
      "publisher": "MONOist",
      "date": "2023-03"
    }
  },
  {
    "id": "pain-029",
    "kind": "pain",
    "title": "見られても問い合わせ・受注に届かない",
    "summary": "新規の訪問が増えても問い合わせにならない壁、問い合わせが受注にならない壁がある。後者は営業の体制まで含めて原因を探る必要があるとされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "新規顧客が集まらない製造業のWebサイト、活用を阻む3つの壁（2/2）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2303/22/news005_2.html",
      "publisher": "MONOist",
      "date": "2023-03"
    }
  },
  {
    "id": "pain-030",
    "kind": "pain",
    "title": "経営者が納得しないと続かない",
    "summary": "経営者がWeb活用の価値を理解していないと取り組みが消極的になり、担当者が孤立しがち。「マーケティング」ではなく「営業をどうするか」から話すとよい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "製造業のWebマーケティング推進に関する記事",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2403/12/news003.html",
      "publisher": "MONOist",
      "date": "2024-03"
    }
  },
  {
    "id": "pain-031",
    "kind": "pain",
    "title": "9割が失敗、7割がネタ切れ",
    "summary": "専任3名未満のIT・製造業の中小企業担当者111名の調査で、約9割が失敗を経験し、7割以上がネタ切れに苦しんでいると報告された。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "article_idea"
    ],
    "source": {
      "title": "コンテンツマーケティングの失敗パターン調査",
      "url": "https://www.commercepick.com/archives/76762",
      "publisher": "CommercePick（イノーバ調査）",
      "date": "2025-10"
    }
  },
  {
    "id": "success-014",
    "kind": "success",
    "title": "技術の棚卸しから発信ネタを探す",
    "summary": "SNSが続かない町工場向けに、自治体が講座を開催。自社の技術や製品を棚卸しして発信ネタを見つけ、動画にして社内で無理なく続ける仕組みを学ぶ内容。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "article_idea"
    ],
    "articleIdea": "社内の設備と技術の棚卸し一覧",
    "source": {
      "title": "町工場のためのSNS実践講座 チラシ",
      "url": "https://www.city.yao.osaka.jp/_res/projects/default_project/_page_/001/024/753/tirashi.pdf",
      "publisher": "八尾市",
      "date": null
    }
  },
  {
    "id": "success-015",
    "kind": "success",
    "title": "340件投稿して大手から1件",
    "summary": "製造業向けセミナーの案内で、340件の投稿を重ねた結果、大手から1件の引き合いが生まれた事例が紹介されている。量を続けることが前提になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "展示会営業・商談獲得セミナーのご案内",
      "url": "https://www.ipros.com/news/detail/168677",
      "publisher": "イプロス",
      "date": "2025-01"
    }
  },
  {
    "id": "success-016",
    "kind": "success",
    "title": "下請け町工場が直接受注",
    "summary": "下請けの町工場が展示会で世界的企業から直接受注した事例や、手書きDMで展示会前に商談を取り付けた事例が紹介されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "展示会で何を見せ、どう声をかけたか",
    "source": {
      "title": "展示会営業・商談獲得セミナーのご案内",
      "url": "https://www.ipros.com/news/detail/168677",
      "publisher": "イプロス",
      "date": "2025-01"
    }
  },
  {
    "id": "success-017",
    "kind": "success",
    "title": "ポータルは資料DLで引き合いを取る",
    "summary": "製造業ポータルでは、製品・サービスを登録し、資料ダウンロードや問い合わせの形で引き合いを得る。無料掲載では引き合いデータの閲覧期間が短い点に注意。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "イプロス活用の考え方",
      "url": "https://www.shopowner-support.net/attracting_customers/manufacturing/ipros/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "success-018",
    "kind": "success",
    "title": "基礎知識とVA/VEを無料資料に",
    "summary": "中小の加工会社が、旋盤・マシニング・5軸加工の基礎、素材の違い、VA/VEとコストダウンの考え方をまとめた資料を無料配布し、引き合いの入口にしている。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "材質を変えて安くできた例（VA/VE）",
    "source": {
      "title": "加工技術の基礎・VA/VE資料",
      "url": "https://pr.mono.ipros.com/toyamask/product/detail/2000364618/",
      "publisher": "イプロス掲載ページ",
      "date": null
    }
  },
  {
    "id": "success-019",
    "kind": "success",
    "title": "文字で伝わらない技を動画で",
    "summary": "写真や文章では伝わりにくい加工技術、工程、品質管理の取り組みを動画で見せると、見込み取引先の信頼を得やすいとされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "加工の様子を30秒で見せる",
    "source": {
      "title": "製造業のYouTube活用",
      "url": "https://www.shopowner-support.net/attracting_customers/manufacturing/manufacturing-general/youtube_manufacture/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "pain-032",
    "kind": "pain",
    "title": "動画を上げるだけでは問い合わせ0",
    "summary": "動画を投稿するだけでは見込み客は生まれない。動画から問い合わせへの道筋を設計しないと、再生されても仕事につながらないと指摘されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "製造業のYouTube活用",
      "url": "https://www.shopowner-support.net/attracting_customers/manufacturing/manufacturing-general/youtube_manufacture/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "pain-033",
    "kind": "pain",
    "title": "SNSを始めても応募は増えない",
    "summary": "採用目的のSNSは始めただけでは応募は増えない。誰に向けるか、投稿テーマ、採用ページへの導線、効果の測り方まで決める必要があるとされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "Instagram採用の進め方",
      "url": "https://www.shopowner-support.net/hr/recruitment-measures/social-recruiting/instagram-recruiting/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "success-020",
    "kind": "success",
    "title": "若手社員の姿を地域ぐるみで発信",
    "summary": "県の事業で、大学生が地域企業の若手社員を取材し、その地域で働き暮らす良さをSNSで発信。若い人に届く見せ方として参考になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "入社3年目の社員の1日",
    "source": {
      "title": "よしよしプレス（村山地域の若手社員発信）",
      "url": "https://www.pref.yamagata.jp/documents/29339/yoshiyoshipress050815.pdf",
      "publisher": "山形県",
      "date": null
    }
  },
  {
    "id": "success-021",
    "kind": "success",
    "title": "採用は写真中心のサイト充実から",
    "summary": "商工会議所の支部が、製造業などの中小企業向けに採用の手引きを作成。写真などの見た目を中心にホームページを充実させる必要性を示した。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "工場の中を写真で案内",
    "source": {
      "title": "建設・運輸・製造業の採用活動はホームページの充実から",
      "url": "https://www.rodo.co.jp/news/3142/",
      "publisher": "労働新聞社",
      "date": "2016"
    }
  },
  {
    "id": "success-022",
    "kind": "success",
    "title": "毎朝ブログを書き続けた社長",
    "summary": "町工場の社長が毎朝静かな工場でブログを365日書き続けた経験を紹介。続ける中で、自社が大切にしていることに改めて気づいたという。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "365日ブログを書いた町工場の社長が気づいた「本当に大切なこと」",
      "url": "https://www.nna-osaka.co.jp/about-nna/sato-blog/post-21192/",
      "publisher": "町工場の社長ブログ",
      "date": null
    }
  },
  {
    "id": "pain-034",
    "kind": "pain",
    "title": "半年は反応がなくて当たり前",
    "summary": "町工場の広報は効果が出るまで時間がかかり、早くても半年ほどは目立った反応がないと考えておくのがよいとされる。早く諦めるのが失敗の典型。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "これからの町工場は広報が大事！？",
      "url": "https://machi-mika.com/useful/entry-422.html",
      "publisher": "machi-mika",
      "date": null
    }
  },
  {
    "id": "pain-035",
    "kind": "pain",
    "title": "専門用語は検索が分散する",
    "summary": "製造業は専門用語が多く検索が分かれやすい。具体的な技術名でも検索数が少ない場合があり、相手が実際に使う言葉を調べて選ぶ必要がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業のSEO対策",
      "url": "https://stock-sun.com/column/manufacturing-industry-seo/",
      "publisher": "ストックサン",
      "date": null
    }
  },
  {
    "id": "success-023",
    "kind": "success",
    "title": "商談後に読まれる受け皿を作る",
    "summary": "自社メディアは商談後に顧客が調べる時の受け皿になる。商談で伝えきれなかった強み、導入事例、利点を載せると、商談を前に進める後押しになる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "よくいただく質問と答え",
    "source": {
      "title": "製造業のオウンドメディア",
      "url": "https://www.shopowner-support.net/attracting_customers/manufacturing/manufacturing-general/manufacturing-industry-oundomedia/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "success-024",
    "kind": "success",
    "title": "技術解説で技術ブログ経由が増加",
    "summary": "精密機械メーカーが技術解説ページを作り社内で更新できる仕組みを入れ、技術ブログ経由の見込み客が3.2倍になったと支援会社が発表している。",
    "industries": [
      "機械部品"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "BtoB製造業向け「AI & SEO対策支援サービス」を提供開始",
      "url": "https://webtan.impress.co.jp/r/prtimes/items/000000061.000055603",
      "publisher": "Web担当者Forum（PR TIMES配信）",
      "date": null
    }
  },
  {
    "id": "success-025",
    "kind": "success",
    "title": "地域団体が企業取材記事を月1発信",
    "summary": "区の産業振興団体が、区内中小企業の先進的な取り組みを取材した記事を月に一度サイトで発信し、企業PR動画の制作も支援した。自社発信と合わせて使える。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "令和3年度 事業報告書",
      "url": "https://www.pio-ota.jp/wp/wp-content/uploads/2025/02/r3_houkokusyo.pdf",
      "publisher": "大田区産業振興協会",
      "date": "2021"
    }
  },
  {
    "id": "success-026",
    "kind": "success",
    "title": "技術と設備を「商品」として載せる",
    "summary": "町工場の減少と新規取引先探しの難しさに向け、町工場が持つ技術や設備を商品のように掲載し、探して発注できる仕組みが表彰資料で紹介された。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "うちの設備でできること一覧",
    "source": {
      "title": "DX推進アワード 応募資料",
      "url": "https://dxpiaward.nagoya-cci.or.jp/pdf/40.pdf",
      "publisher": "名古屋商工会議所",
      "date": null
    }
  },
  {
    "id": "success-027",
    "kind": "success",
    "title": "目的は良い取引先との出会い",
    "summary": "中小製造業のホームページの大事な役割は良質な取引先の獲得であり、地域を越えて全国の企業と出会える点が強みだと論じられている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "中小製造業のホームページ活用",
      "url": "https://weekly.ascii.jp/elem/000/001/778/1778538/",
      "publisher": "週刊アスキー",
      "date": null
    }
  },
  {
    "id": "success-028",
    "kind": "success",
    "title": "小規模事業者のDXは自社HPから",
    "summary": "小規模企業白書2024によれば、小規模事業者がDXに向けて取り組む内容の上位に自社ホームページの作成が挙がっていると紹介されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "ハイブリッドマーケティング",
      "url": "https://canon.jp/biz/trend/hybridmarketing",
      "publisher": "キヤノンマーケティングジャパン",
      "date": null
    }
  },
  {
    "id": "pain-036",
    "kind": "pain",
    "title": "更新の担当と仕組みが決まっていない",
    "summary": "公開後に誰が更新するかを決めていない、社内で更新しにくい作りになっている、といった理由でサイトの運用が止まるのが典型的な失敗とされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "ホームページ制作の失敗事例",
      "url": "https://unima.co.jp/columns/failure-case-website-production/",
      "publisher": "ユニマ",
      "date": null
    }
  },
  {
    "id": "pain-037",
    "kind": "pain",
    "title": "技術紹介と実績がないと来ない",
    "summary": "製造業サイトでは技術紹介が問い合わせの核になる要素とされる。設備や加工実績、事例が見えないと信頼が伝わらず、問い合わせが来にくい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ホームページ制作 業種別完全ガイド2026",
      "url": "https://www.onamae.com/column/hp/63/",
      "publisher": "お名前.com",
      "date": "2026"
    }
  },
  {
    "id": "success-029",
    "kind": "success",
    "title": "作業日報をそのまま技術ブログに",
    "summary": "ワイヤ放電加工の町工場が、日々の作業内容や測定結果を業務日報ブログとして公開し、変わった加工方法の技術メモも載せている。",
    "industries": [
      "放電加工"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "今日の加工と測定結果の記録",
    "source": {
      "title": "業務日報ブログ",
      "url": "https://tatiban.com/news/",
      "publisher": "町工場の公式ブログ",
      "date": null
    }
  },
  {
    "id": "success-030",
    "kind": "success",
    "title": "町工場が集まって発信する場",
    "summary": "東京の町工場が集まり、技術や経営の情報をブログで発信する取り組みがある。1社では続けにくい発信を仲間と分担できる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "町工場ブログ",
      "url": "https://tokyo-fabhub.com/blogs/5/",
      "publisher": "TOKYO町工場HUB",
      "date": null
    }
  },
  {
    "id": "pain-038",
    "kind": "pain",
    "title": "狙う言葉が本文でぶれている",
    "summary": "会社で決めた狙いの検索語が、記事のタイトル・冒頭・本文で統一されていないのが、コンテンツの典型的な失敗例として挙げられている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "Webマーケティングの失敗例",
      "url": "https://blogs.itmedia.co.jp/yoshimasa/2018/11/web_16.html",
      "publisher": "ITmedia オルタナティブ・ブログ",
      "date": "2018-11"
    }
  },
  {
    "id": "success-031",
    "kind": "success",
    "title": "SNSで協力者を募り自社製品化",
    "summary": "金型の会社がSNSで協力者を集め、取りまとめて最終製品を開発した事例が、町工場の自社製品開発の連載で紹介されている。",
    "industries": [
      "金型"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "自社製品が生まれるまで",
    "source": {
      "title": "金型屋さんがSNSで協力者を仕切って商品開発するマイクロモノづくり",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1103/25/news002_2.html",
      "publisher": "MONOist",
      "date": "2011-03"
    }
  },
  {
    "id": "buyer-006",
    "kind": "buyer",
    "title": "技術者の約4人に1人が生成AIで技術課題を調査",
    "summary": "テクノポートが2025年4月に行った調査で、技術者の24.9%が生成AIで技術的な課題を調べた経験ありと答えた。調べ方の一つとして定着しつつある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "技術者のChatGPT利用が本格化 24.9%が生成AIを使用、Google検索は減少傾向に（間違いだらけの製造業デジタルマーケティング29）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2507/10/news003.html",
      "publisher": "MONOist（執筆：テクノポート）",
      "date": "2025-07"
    }
  },
  {
    "id": "buyer-007",
    "kind": "buyer",
    "title": "技術者の情報源は展示会が今も上位",
    "summary": "同じ2025年4月の調査で、展示会は48.7%、論文・特許は36.4%。生成AIは新しい入口だが、展示会や文献と併用されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "技術者のChatGPT利用が本格化 24.9%が生成AIを使用、Google検索は減少傾向に（間違いだらけの製造業デジタルマーケティング29）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2507/10/news003.html",
      "publisher": "MONOist（執筆：テクノポート）",
      "date": "2025-07"
    }
  },
  {
    "id": "buyer-008",
    "kind": "buyer",
    "title": "生成AIは探し始めの見取り図づくりに使われる",
    "summary": "技術者は生成AIを一般知識の確認や概念整理など、探索のごく初期に使っている。概要をつかんでから展示会や論文、企業サイトで詳しく確かめる流れ。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "「◯◯加工とは」を初心者の設計者向けに一から整理する記事",
    "source": {
      "title": "技術者のChatGPT利用が本格化 24.9%が生成AIを使用、Google検索は減少傾向に（間違いだらけの製造業デジタルマーケティング29）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2507/10/news003_2.html",
      "publisher": "MONOist（執筆：テクノポート）",
      "date": "2025-07"
    }
  },
  {
    "id": "buyer-009",
    "kind": "buyer",
    "title": "専門用語・課題語・社名での検索も残る",
    "summary": "2025年の同調査では、技術の専門用語や課題キーワードに加え、製品名・企業名での指名検索も一定数あった。検索は消えず入口が増えた形。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "現場の困りごとの言葉（例：バリが出る、反りが出る）を見出しにした記事",
    "source": {
      "title": "技術者のChatGPT利用が本格化 24.9%が生成AIを使用、Google検索は減少傾向に（間違いだらけの製造業デジタルマーケティング29）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2507/10/news003.html",
      "publisher": "MONOist（執筆：テクノポート）",
      "date": "2025-07"
    }
  },
  {
    "id": "buyer-010",
    "kind": "buyer",
    "title": "購買でも「最初からAIに聞く」人が増加",
    "summary": "テクノポートの2026年1〜2月の調査（製造業317名＋6名面談）で、以前は検索エンジンを使っていた人が初手からAIで情報を集めるようになったという声が多かった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業の購買プロセスにおける生成AI活用の実態調査【2026年版】（PR TIMES転載）",
      "url": "https://webtan.impress.co.jp/r/prtimes/items/000000062.000055603",
      "publisher": "テクノポート株式会社（Web担当者Forum掲載）",
      "date": "2026-03"
    }
  },
  {
    "id": "buyer-011",
    "kind": "buyer",
    "title": "AIの提示をきっかけに問い合わせた例もある",
    "summary": "同じテクノポート2026年調査では、AIが示した情報を手がかりに問い合わせや導入まで進んだ担当者もいた。AIに名前が出ることが接点になりうる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業の購買プロセスにおける生成AI活用の実態調査【2026年版】（PR TIMES転載）",
      "url": "https://webtan.impress.co.jp/r/prtimes/items/000000062.000055603",
      "publisher": "テクノポート株式会社（Web担当者Forum掲載）",
      "date": "2026-03"
    }
  },
  {
    "id": "buyer-012",
    "kind": "buyer",
    "title": "設計者の外注先探しは3つの経路",
    "summary": "2024年のMONOist連載の設計者調査では、外部の仕入れ先探しは①購買部門や商社など既存の伝手、②展示会、③Web検索の3つが中心だった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業のマーケティング担当者必見、「サプライヤーの探し方と選定基準」の本音（間違いだらけの製造業デジタルマーケティング15）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2404/19/news005.html",
      "publisher": "MONOist（執筆：テクノポート）",
      "date": "2024-04"
    }
  },
  {
    "id": "buyer-013",
    "kind": "buyer",
    "title": "新しい外注先を探すのは既存先で無理なとき",
    "summary": "設計者が新規の仕入れ先を探すのは、主に「今の取引先では対応できないとき」。不具合や新規開発で困った場面に検索が始まる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "「他社で断られた◯◯」に対応できた事例と、その理由を書く記事",
    "source": {
      "title": "製造業のマーケティング担当者必見、「サプライヤーの探し方と選定基準」の本音（間違いだらけの製造業デジタルマーケティング15）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2404/19/news005.html",
      "publisher": "MONOist（執筆：テクノポート）",
      "date": "2024-04"
    }
  },
  {
    "id": "buyer-014",
    "kind": "buyer",
    "title": "設計者がサイトで見るのは作れるか・信用できるか",
    "summary": "2024年の設計者インタビューでは、知りたいのは「本当に作れるか」と「信用できる会社か」の2点。4人全員がまず実績を確認すると答えた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "加工実績を材質・サイズ・数量・公差つきで一覧にした記事",
    "source": {
      "title": "製造業のマーケティング担当者必見、「サプライヤーの探し方と選定基準」の本音（間違いだらけの製造業デジタルマーケティング15）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2404/19/news005_2.html",
      "publisher": "MONOist（執筆：テクノポート）",
      "date": "2024-04"
    }
  },
  {
    "id": "buyer-015",
    "kind": "buyer",
    "title": "「何でもできる」より得意分野を絞る",
    "summary": "同インタビューでは、何でも対応可と書く会社より特定の技術に特化した会社の方が目に留まり、技術を丁寧に説明していると安心できるという声があった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業のマーケティング担当者必見、「サプライヤーの探し方と選定基準」の本音（間違いだらけの製造業デジタルマーケティング15）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2404/19/news005_2.html",
      "publisher": "MONOist（執筆：テクノポート）",
      "date": "2024-04"
    }
  },
  {
    "id": "buyer-016",
    "kind": "buyer",
    "title": "性能データ・工場写真・不具合対応が安心材料",
    "summary": "設計者は技術情報を重視し、性能データや工場の写真、不具合時にどう対応したかの実績があると安心するという。2024年MONOist連載より。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "不良が出たときの原因調査と再発防止の流れを紹介する記事",
    "source": {
      "title": "製造業のマーケティング担当者必見、「サプライヤーの探し方と選定基準」の本音（間違いだらけの製造業デジタルマーケティング15）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2404/19/news005.html",
      "publisher": "MONOist（執筆：テクノポート）",
      "date": "2024-04"
    }
  },
  {
    "id": "buyer-017",
    "kind": "buyer",
    "title": "見た目より探しやすさ、古いと悪印象も",
    "summary": "設計者は凝ったデザインより欲しい情報にすぐ届く構成を好む。一方で古いデザインは業績が悪い・営業意欲がない印象を与えるという声もあった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業のマーケティング担当者必見、「サプライヤーの探し方と選定基準」の本音（間違いだらけの製造業デジタルマーケティング15）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2404/19/news005_2.html",
      "publisher": "MONOist（執筆：テクノポート）",
      "date": "2024-04"
    }
  },
  {
    "id": "buyer-018",
    "kind": "buyer",
    "title": "問い合わせへの返信の早さも見られる",
    "summary": "同記事では、問い合わせにできるだけ早く返す体制も必要とされた。初回の反応の速さが対応力の判断材料になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "製造業のマーケティング担当者必見、「サプライヤーの探し方と選定基準」の本音（間違いだらけの製造業デジタルマーケティング15）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2404/19/news005.html",
      "publisher": "MONOist（執筆：テクノポート）",
      "date": "2024-04"
    }
  },
  {
    "id": "buyer-019",
    "kind": "buyer",
    "title": "候補は5社以内に絞ってから比べる",
    "summary": "イントリックスが2024年12月に製造業の選定・購買担当200名に行った調査では、企業サイトほか複数の媒体で情報を集め、5社以内に絞って検討する傾向だった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業の購買行動に関する調査2025年版（PR TIMES転載）",
      "url": "https://webtan.impress.co.jp/r/prtimes/items/000000043.000027606",
      "publisher": "株式会社イントリックス（Web担当者Forum掲載）",
      "date": null
    }
  },
  {
    "id": "buyer-020",
    "kind": "buyer",
    "title": "未接触の会社へは約7割がネットで問い合わせ",
    "summary": "同調査で、まだ接点のない会社には約7割がインターネット経由で問い合わせると回答。方法はフォーム経由が45%だった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業の購買行動に関する調査2025年版（PR TIMES転載）",
      "url": "https://webtan.impress.co.jp/r/prtimes/items/000000043.000027606",
      "publisher": "株式会社イントリックス（Web担当者Forum掲載）",
      "date": null
    }
  },
  {
    "id": "buyer-021",
    "kind": "buyer",
    "title": "日常の情報収集で企業サイトを見る人が7割",
    "summary": "同調査（2024年12月）で、日常の情報収集に企業の公式サイトを使う人は70%。前回（2023年12月）の59%から11ポイント増えた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業の購買行動に関する調査2025年版（PR TIMES転載）",
      "url": "https://webtan.impress.co.jp/r/prtimes/items/000000043.000027606",
      "publisher": "株式会社イントリックス（Web担当者Forum掲載）",
      "date": null
    }
  },
  {
    "id": "buyer-022",
    "kind": "buyer",
    "title": "2023年は検索エンジン62%、展示会41%",
    "summary": "イントリックスの2023年12月調査では、情報収集手段の最多はGoogleなどの検索エンジン62%、企業サイト59%、営業への相談52%、展示会41%だった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業の購買行動に関する調査2025年版（PR TIMES転載）",
      "url": "https://webtan.impress.co.jp/r/prtimes/items/000000043.000027606",
      "publisher": "株式会社イントリックス（Web担当者Forum掲載）",
      "date": null
    }
  },
  {
    "id": "buyer-023",
    "kind": "buyer",
    "title": "情報収集は資料ダウンロードが最多",
    "summary": "2021年の製造業向け調査（約100名）では、情報収集手段は資料請求・ダウンロード60.6%、サービスサイト53.8%、比較サイトと展示会が各46.2%。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業の情報収集は「検討前」ではない。約7割が情報収集段階で本命を決めている理由",
      "url": "https://www.shopowner-support.net/attracting_customers/manufacturing/manufacturing-general/search-service-choice/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "buyer-024",
    "kind": "buyer",
    "title": "困りごと1位は条件に合う商品が見つからない",
    "summary": "同じ2021年の調査で、情報収集の課題は「条件に合う商品が見つかりづらい」が54.9%で最多。仕様や対応範囲がはっきり書かれていないと候補に入らない。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip",
      "article_idea"
    ],
    "articleIdea": "対応できる材質・サイズ・数量・公差の範囲を表にまとめた記事",
    "source": {
      "title": "製造業の情報収集は「検討前」ではない。約7割が情報収集段階で本命を決めている理由",
      "url": "https://www.shopowner-support.net/attracting_customers/manufacturing/manufacturing-general/search-service-choice/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "buyer-025",
    "kind": "buyer",
    "title": "検討の土台に乗るのは事例と説明",
    "summary": "同調査では、検討候補に上がる要因として導入事例のコンテンツ66.3%、商品の説明コンテンツ62.4%が挙がった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "お客様の課題→提案→結果の順で書く加工事例記事",
    "source": {
      "title": "製造業の情報収集は「検討前」ではない。約7割が情報収集段階で本命を決めている理由",
      "url": "https://www.shopowner-support.net/attracting_customers/manufacturing/manufacturing-general/search-service-choice/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "buyer-026",
    "kind": "buyer",
    "title": "買い手の6割超は接触前に候補を並べ済み",
    "summary": "HubSpot Japanの2026年6月調査（BtoB購買関与者1,573名）で、売り手に連絡する時点で複数候補のリストアップ以降まで進んでいる人は63.5%だった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "HubSpot Japan、BtoB購買調査で生成AI活用が41.6%に影響と判明",
      "url": "https://www.commercepick.com/archives/98032",
      "publisher": "コマースピック（HubSpot Japan調査）",
      "date": "2026-07"
    }
  },
  {
    "id": "buyer-027",
    "kind": "buyer",
    "title": "増えた情報収集行動の1位は生成AI",
    "summary": "同調査で、買い手が増えたと感じる情報収集行動は「生成AIサービスやAI検索を使う」が33.5%で最多。購買判断への影響が増えたは41.6%。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "HubSpot Japan、BtoB購買調査で生成AI活用が41.6%に影響と判明",
      "url": "https://www.commercepick.com/archives/98032",
      "publisher": "コマースピック（HubSpot Japan調査）",
      "date": "2026-07"
    }
  },
  {
    "id": "buyer-028",
    "kind": "buyer",
    "title": "ChatGPTは約6割、Geminiは約5割が利用",
    "summary": "HubSpot Japanの2026年調査で、BtoB購買での利用（頻繁＋ときどき）はChatGPT58.0%、Gemini51.2%、Microsoft Copilot40.1%だった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "HubSpot Japan、BtoB購買調査で生成AI活用が41.6%に影響と判明",
      "url": "https://www.commercepick.com/archives/98032",
      "publisher": "コマースピック（HubSpot Japan調査）",
      "date": "2026-07"
    }
  },
  {
    "id": "buyer-029",
    "kind": "buyer",
    "title": "AIで候補を並べ、違いを整理し社内説明に使う",
    "summary": "同調査では、生成AIは探すだけでなく候補の比較、違いの整理、社内説明の準備にも使われていた。比べやすい書き方の情報が使われやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "工法Aと工法Bの違いを表で比べる記事",
    "source": {
      "title": "HubSpot Japan、BtoB購買調査で生成AI活用が41.6%に影響と判明",
      "url": "https://www.commercepick.com/archives/98032",
      "publisher": "コマースピック（HubSpot Japan調査）",
      "date": "2026-07"
    }
  },
  {
    "id": "buyer-030",
    "kind": "buyer",
    "title": "AI情報を稟議にほぼそのまま使う人が約4分の1",
    "summary": "HubSpot Japan 2026年調査で、AI情報を社内説明や稟議に使った人のうち24.9%はほぼそのまま利用。48.3%は自分で事実確認や加筆をしてから使った。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "BtoB購買もAI頼みに? 4人に1人がAI情報を“ほぼそのまま”稟議で使用【HubSpot Japan調べ】",
      "url": "https://webtan.impress.co.jp/n/2026/07/23/53000",
      "publisher": "Web担当者Forum（HubSpot Japan調査）",
      "date": "2026-07"
    }
  },
  {
    "id": "buyer-031",
    "kind": "buyer",
    "title": "最も信頼されるのは価格・条件が明確な情報",
    "summary": "同調査で信頼される情報の1位は価格や契約条件が明瞭な情報60.6%。AIがまとめた情報は37.8%で10項目中最下位だった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip",
      "article_idea"
    ],
    "articleIdea": "価格が決まる要素と目安、納期の決まり方を正直に書く記事",
    "source": {
      "title": "BtoB購買もAI頼みに? 4人に1人がAI情報を“ほぼそのまま”稟議で使用【HubSpot Japan調べ】",
      "url": "https://webtan.impress.co.jp/n/2026/07/23/53000",
      "publisher": "Web担当者Forum（HubSpot Japan調査）",
      "date": "2026-07"
    }
  },
  {
    "id": "buyer-032",
    "kind": "buyer",
    "title": "展示会がきっかけで取引した経験は7割超",
    "summary": "アペルザが同社サービス利用者1,300名超に行った調査で、7割以上が展示会をきっかけに取引が成立した経験を持っていた。コロナ禍の時期の調査。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "アペルザ 製造業の展示会参加に関する調査",
      "url": "https://markezine.jp/news/detail/54958",
      "publisher": "MarkeZine（アペルザ調査）",
      "date": null
    }
  },
  {
    "id": "buyer-033",
    "kind": "buyer",
    "title": "展示会では直接説明を聞きたい人が8割超",
    "summary": "同アペルザ調査で、来場者は市場動向など広い情報収集が目的の一方、8割以上が出展企業から直接説明を聞く・特定の企業や製品を見ることを挙げ、4割以上が商談目的。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "展示会で多かった質問とその答えをまとめた記事",
    "source": {
      "title": "アペルザ 製造業の展示会参加に関する調査",
      "url": "https://markezine.jp/news/detail/54958",
      "publisher": "MarkeZine（アペルザ調査）",
      "date": null
    }
  },
  {
    "id": "buyer-034",
    "kind": "buyer",
    "title": "展示会や営業だけでは届かない相手がいる",
    "summary": "MONOist連載（2025年2月）は、展示会は来場しない企業に届かず、直接営業は自社を知らない企業への壁が高いと指摘。Webサイトがそれを補う。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "展示会や営業“だけ”ではダメ B2B製造業が認知されるための戦略（間違いだらけの製造業デジタルマーケティング24）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2502/19/news007.html",
      "publisher": "MONOist（執筆：テクノポート）",
      "date": "2025-02"
    }
  },
  {
    "id": "buyer-035",
    "kind": "buyer",
    "title": "設計者の負担は図面作成と見積り待ち",
    "summary": "ミスミはmeviyについて、紙図面の作図、見積依頼、見積・納期の回答待ちが調達の大きなボトルネックだと説明。即時見積りで時間を減らすとしている。",
    "industries": [
      "機械部品",
      "金属加工"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "見積りを早く出すために図面に書いてほしいことをまとめた記事",
    "source": {
      "title": "「時間」を創出できる機械部品調達サービス「meviy」の進化を支える3つの鍵",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2306/06/news055.html",
      "publisher": "MONOist",
      "date": "2023-06"
    }
  },
  {
    "id": "buyer-036",
    "kind": "buyer",
    "title": "ポータルでは設備・技術で条件検索される",
    "summary": "NCネットワークのエミダスは、中小製造業が基本情報・設備・技術情報を登録し、発注側が条件で加工先を探せる仕組み。設備一覧の書き方が見つかりやすさを左右する。",
    "industries": [
      "機械部品",
      "金属加工"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "エミダスとは（製造業向けサービス解説）",
      "url": "https://crexgroup.com/ja/manufacturing/sales/emidas-manufacturing-service-guide/",
      "publisher": "CREX GROUP",
      "date": null
    }
  },
  {
    "id": "buyer-037",
    "kind": "buyer",
    "title": "大手の外注選定は設備と検査機器を確認",
    "summary": "宮城県の商談会資料で、大手製造業は社内規定の調査と認定評価を経て外注先を選び、旋盤・マシニング・5軸機・三次元測定器など設備と検査機器を具体的に求めていた。",
    "industries": [
      "機械部品",
      "金属加工"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "自社の測定機器と、何をどこまで測れるかを紹介する記事",
    "source": {
      "title": "商談会 発注企業資料",
      "url": "https://www.joho-miyagi.or.jp/wp-content/uploads/2023/09/c50b6b5e2fd9e59e09d1e7db015fea25.pdf",
      "publisher": "みやぎ産業振興機構",
      "date": "2023-09"
    }
  },
  {
    "id": "buyer-038",
    "kind": "buyer",
    "title": "AIに「◯◯対応の会社を5社」と聞く発注者",
    "summary": "AIO解説記事は、発注担当者がAIに特定加工に対応する会社を挙げさせ、その一覧から問い合わせ先を選ぶ流れを紹介。海外の調達担当も同様に探すと指摘。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業のAIO対策（ブログ記事）",
      "url": "https://0120.co.jp/blog/aio-144/",
      "publisher": "0120.co.jp",
      "date": null
    }
  },
  {
    "id": "buyer-039",
    "kind": "buyer",
    "title": "先回りの一問一答はAIに引用されやすい",
    "summary": "MONOist連載（2025年6月）は、読者の疑問を想定した一問一答をAIが引用しやすい形で記事に置くことを、AI時代のコンテンツ対策の一つに挙げた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "お客様からよく聞かれる質問10個に答える記事",
    "source": {
      "title": "AI時代における製造業のコンテンツ戦略（間違いだらけの製造業デジタルマーケティング28）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2506/12/news004_2.html",
      "publisher": "MONOist（執筆：テクノポート）",
      "date": "2025-06"
    }
  },
  {
    "id": "buyer-040",
    "kind": "buyer",
    "title": "製造業でよくDLされるのは導入事例集",
    "summary": "PRIZMAの1,020名調査で、製造業で実際にダウンロードされたコンテンツは導入事例集が61.5%と突出していた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "業界別｜読まれるBtoB企業向けコンテンツの条件に関する調査（PR TIMES転載）",
      "url": "https://webtan.impress.co.jp/r/prtimes/items/000000205.000149156",
      "publisher": "株式会社PRIZMA（Web担当者Forum掲載）",
      "date": null
    }
  },
  {
    "id": "buyer-041",
    "kind": "buyer",
    "title": "AIによる概要が出ると1位のクリックが減る",
    "summary": "Ahrefsの2025年12月の再調査では、Googleの「AIによる概要」が出る検索で1位ページの平均クリック率が58%低いという相関が見られた。業種横断のデータ。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "AIによる概要はクリック数を減らす（更新版）",
      "url": "https://ahrefs.com/ja/blog/ai-overviews-reduce-clicks-update/",
      "publisher": "Ahrefs",
      "date": "2025-12"
    }
  },
  {
    "id": "buyer-042",
    "kind": "buyer",
    "title": "BtoB買い手の67%は営業なしで買いたい",
    "summary": "Gartnerの2025年8〜9月の調査で、BtoB買い手の67%が営業担当を介さない購買体験を好むと回答。自分で調べて決める前提で情報を用意する必要がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "Gartner Sales Survey Finds 67% of B2B Buyers Prefer a Rep-Free Experience",
      "url": "https://www.gartner.com/en/newsroom/press-releases/2026-03-09-gartner-sales-survey-finds-67-percent-of-b2b-buyers-prefer-a-rep-free-experience",
      "publisher": "Gartner",
      "date": "2026-03"
    }
  },
  {
    "id": "buyer-043",
    "kind": "buyer",
    "title": "AIの答えを人に確かめたい買い手が69%",
    "summary": "Gartnerの2026年5月発表で、BtoB買い手の69%がAIが出した情報を営業担当に確認したいと回答。AIで候補に入った後、人の説明が決め手になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "Gartner Survey Finds 69% of B2B Buyers Turn to Sales Reps to Validate AI-Generated Insights",
      "url": "https://www.gartner.com/en/newsroom/press-releases/2026-05-20-gartner-survey-finds-sixty-nine-percent-of-b-two-b-buyers-turn-to-sales-reps-to-validate-ai-generated-insights",
      "publisher": "Gartner",
      "date": "2026-05"
    }
  },
  {
    "id": "buyer-044",
    "kind": "buyer",
    "title": "米国技術者の7割はAIで業者評価をほぼしない",
    "summary": "TREW Marketing等の2025年調査で、技術者の70%はAIで仕入れ先を評価することがほとんどない・ないと回答。AI生成情報への信頼は10点中4.4と低め。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "2025 State of Marketing to Engineers Research",
      "url": "https://www.trewmarketing.com/blog/2025-state-of-marketing-to-engineers-research",
      "publisher": "TREW Marketing / GlobalSpec",
      "date": "2025-03"
    }
  },
  {
    "id": "buyer-045",
    "kind": "buyer",
    "title": "英国の購買責任者の66%がAIで仕入れ先探し",
    "summary": "Magenta Associatesの英国300名調査で、66%がChatGPT等で仕入れ先を探し評価。71%は情報が分かりにくい仕入れ先を避けると答えた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "The New Supply Chain Battle: AI Discoverability",
      "url": "https://supplychaindigital.com/news/supply-chain-battle-ai-discoverability-b2b-buyers",
      "publisher": "Supply Chain Digital（Magenta Associates調査）",
      "date": null
    }
  },
  {
    "id": "trend-008",
    "kind": "trend",
    "official": true,
    "title": "下請法が取適法に（2026年1月施行）",
    "summary": "下請法が改正され、2026年1月1日から「中小受託取引適正化法（取適法）」として施行。発注側と受注側が対等な立場で価格を決め、取引全体で価格転嫁を根付かせるのがねらい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "取適法の施行を受けて、当社が見積もりと価格協議で大切にしていること",
    "source": {
      "title": "中小受託取引適正化法(取適法)・受託中小企業振興法について(令和8年1月1日施行)",
      "url": "https://www.pref.saitama.lg.jp/a0801/shitaukehoukaisei.html",
      "publisher": "埼玉県",
      "date": "2026-01"
    }
  },
  {
    "id": "trend-009",
    "kind": "trend",
    "official": true,
    "title": "「下請」の呼び方が変わった",
    "summary": "取適法では「親事業者」は「委託事業者」、「下請事業者」は「中小受託事業者」と呼ぶ。記事でも新しい用語に合わせると、取引のルールを理解している会社だと伝わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "2026年1月から下請法が「取適法」に！委託取引のルールが大きく変わります",
      "url": "https://www.gov-online.go.jp/article/202511/entry-9983.html",
      "publisher": "政府広報オンライン",
      "date": "2025-11"
    }
  },
  {
    "id": "trend-010",
    "kind": "trend",
    "official": true,
    "title": "取適法は従業員数でも対象に",
    "summary": "取適法では資本金に加えて従業員数の基準ができ、運送の委託も対象に加わった。これまで対象外だった取引先との関係も、ルールの中に入る可能性がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "取適法で変わった取引の範囲と、当社の受発注で確認したこと",
    "source": {
      "title": "2026年1月から下請法が「取適法」に！委託取引のルールが大きく変わります",
      "url": "https://www.gov-online.go.jp/article/202511/entry-9983.html",
      "publisher": "政府広報オンライン",
      "date": "2025-11"
    }
  },
  {
    "id": "trend-011",
    "kind": "trend",
    "official": true,
    "title": "一方的な代金決定や手形払いが禁止に",
    "summary": "取適法では、協議に応じず一方的に代金を決めることや、手形での支払いが禁止された。受注側は「価格の相談ができる」「現金で受け取れる」ことを前提に交渉できる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "取引先に価格の相談をするとき、当社が用意している資料",
    "source": {
      "title": "2026年1月施行！知っておきたい取適法の改正ポイント",
      "url": "https://www.chusho.meti.go.jp/keiei/torihiki/seminar/jftc.pdf",
      "publisher": "公正取引委員会・中小企業庁",
      "date": "2025-10"
    }
  },
  {
    "id": "trend-012",
    "kind": "trend",
    "official": true,
    "title": "約束手形の廃止に向け支払い適正化を要請",
    "summary": "公取委と中小企業庁は2026年9月、約束手形の利用廃止を見据え、支払いサイトの短縮や現金払いへの切り替えを業界団体などに求めた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "約束手形の利用廃止を踏まえた支払の適正化に関する要請",
      "url": "https://www.jftc.go.jp/yakusokutegata_yousei.html",
      "publisher": "公正取引委員会",
      "date": "2026-09"
    }
  },
  {
    "id": "trend-013",
    "kind": "trend",
    "official": true,
    "title": "2027年4月から「支払告示」施行",
    "summary": "独占禁止法の新しい告示が2027年4月に施行予定。取適法の対象外の取引でも、受け取ってから60日を超えて代金を払わないことを禁じる趣旨。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造委託等に係る代金の支払に関する特定の不公正な取引方法の公表について",
      "url": "https://www.jftc.go.jp/houdou/pressrelease/2026/jun/260617_kokuji.html",
      "publisher": "公正取引委員会",
      "date": "2026-06"
    }
  },
  {
    "id": "trend-014",
    "kind": "trend",
    "official": true,
    "title": "勧告の多くは製造委託の取引",
    "summary": "公取委によると、2025年度の取適法（下請法）に基づく勧告は39件で、うち37件が製造委託など。不当な経済上の利益の提供要請が最も多かった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "令和7年度における取適法の運用状況及び中小事業者等の取引適正化に向けた取組",
      "url": "https://www.jftc.go.jp/houdou/pressrelease/2026/jun/260610.html",
      "publisher": "公正取引委員会",
      "date": "2026-06"
    }
  },
  {
    "id": "trend-015",
    "kind": "trend",
    "official": true,
    "title": "支払い遅延で中企庁が措置請求",
    "summary": "2026年9月、中小企業庁は支払いが遅れた代金の支払いを求め、ある製造業者について公取委に措置請求した。支払期日を守ることは取引先の信用に直結する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "株式会社不二製作所に対する取適法に基づく勧告が行われました",
      "url": "https://www.meti.go.jp/press/2026/09/20260929001.html",
      "publisher": "経済産業省",
      "date": "2026-09"
    }
  },
  {
    "id": "trend-016",
    "kind": "trend",
    "official": true,
    "title": "価格転嫁率は53.5%（2025年9月）",
    "summary": "2025年9月の価格交渉促進月間の調査で、価格転嫁率は53.5%。労務費の転嫁率が初めて50%に届いた。改善傾向だが、まだ道半ばとされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "人件費の上昇分を、取引先にどう説明して価格に反映しているか",
    "source": {
      "title": "価格交渉促進月間（2025年9月）フォローアップ調査の結果",
      "url": "https://www.meti.go.jp/press/2025/11/20251128002/20251128002.html",
      "publisher": "経済産業省・中小企業庁",
      "date": "2025-11"
    }
  },
  {
    "id": "trend-017",
    "kind": "trend",
    "official": true,
    "title": "価格転嫁率54.2%、交渉実施は9割",
    "summary": "2026年3月の調査では、価格転嫁率54.2%、価格交渉が行われた割合は90.7%。原材料費55.7%、労務費50.0%、エネルギー48.9%の転嫁率だった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "原材料・電気代・人件費、それぞれの値上がりにどう対応しているか",
    "source": {
      "title": "価格交渉促進月間（2026年3月）フォローアップ調査の結果を公表します",
      "url": "https://www.meti.go.jp/press/2026/06/20260626003/20260626003.html",
      "publisher": "経済産業省・中小企業庁",
      "date": "2026-06"
    }
  },
  {
    "id": "trend-018",
    "kind": "trend",
    "official": true,
    "title": "発注者リストと都道府県別の転嫁率",
    "summary": "中小企業庁は調査結果をもとに、発注者ごとの評価リストや都道府県別の転嫁率を公表している。地域による差は20%以上ある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "価格交渉促進月間の実施とフォローアップ調査結果",
      "url": "https://www.chusho.meti.go.jp/keiei/torihiki/follow-up/index.html",
      "publisher": "中小企業庁",
      "date": "2026-06"
    }
  },
  {
    "id": "trend-019",
    "kind": "trend",
    "official": true,
    "title": "労務費転嫁の指針と12の行動",
    "summary": "内閣官房と公取委の指針は、発注者・受注者・双方がとるべき12の行動を示す。受注側は最低賃金など公表資料を根拠に、自分から希望額を示すことが勧められている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "値上げのお願いをするときに当社が使う根拠資料",
    "source": {
      "title": "労務費の適切な転嫁のための価格交渉に関する指針",
      "url": "https://www.jftc.go.jp/dk/guideline/unyoukijun/romuhitenka.html",
      "publisher": "内閣官房・公正取引委員会",
      "date": "2023-11"
    }
  },
  {
    "id": "trend-020",
    "kind": "trend",
    "official": false,
    "title": "最低賃金、2025年度は66円上げ",
    "summary": "2025年度の最低賃金は全国加重平均で1121円、66円の引き上げで目安制度が始まって以来最大と報じられた。人件費が上がる根拠として取引先への説明に使える。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "最賃1121円に 過去最大66円引上げへ 厚労省・地賃審答申結果",
      "url": "https://www.rodo.co.jp/news/205435/",
      "publisher": "労働新聞社",
      "date": "2025-09"
    }
  },
  {
    "id": "trend-021",
    "kind": "trend",
    "official": false,
    "title": "最低賃金、2026年度は1177円へ",
    "summary": "2026年度の最低賃金は全国加重平均1177円（56円増）となり、過去2番目の上げ幅と伝えられている。10月以降に都道府県ごとに順次発効。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "賃上げを続けるために、当社が生産性を上げている工夫",
    "source": {
      "title": "【2026年最新】最低賃金はいくら？47都道府県一覧",
      "url": "https://hojyokin-portal.jp/columns/saitei_chingin",
      "publisher": "補助金ポータル",
      "date": "2026-09"
    }
  },
  {
    "id": "trend-022",
    "kind": "trend",
    "official": false,
    "title": "2026年春闘、中小は4.69%",
    "summary": "連合の最終集計で2026年春闘の賃上げ率は5.01%、300人未満の中小組合は4.69%だった。同じ業種でも価格転嫁の可否で差が出ていると指摘された。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "当社の賃上げと、働く人に伝えたい処遇の考え方（求職者向け）",
    "source": {
      "title": "今春闘の平均賃上げ率5・01% 3年連続大台、連合集計",
      "url": "https://kumanichi.com/articles/2009784",
      "publisher": "熊本日日新聞（共同通信）",
      "date": "2026-07"
    }
  },
  {
    "id": "trend-023",
    "kind": "trend",
    "official": false,
    "title": "人手不足倒産が3年連続最多",
    "summary": "帝国データバンクによると、2025年の人手不足倒産は427件で3年連続の過去最多。従業員の退職がきっかけの倒産も増え、製造業も初めて20件を超えた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "人が辞めない職場にするために続けていること",
    "source": {
      "title": "従業員「退職」で倒産、2025年は124件 過去最多を大幅更新",
      "url": "https://www.zaikei.co.jp/releases/3294587/",
      "publisher": "帝国データバンク（財経新聞掲載）",
      "date": "2026-01"
    }
  },
  {
    "id": "trend-024",
    "kind": "trend",
    "official": false,
    "title": "外国人労働者257万人、製造業が最多",
    "summary": "2025年10月末の外国人労働者は257万人余りで過去最多と報じられた。業種別では製造業が約4分の1で最も多い。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "外国人スタッフと一緒に働く現場で工夫していること",
    "source": {
      "title": "外国人労働者、最多の257万人 受け入れ厳格化、衆院選争点",
      "url": "https://www.sakigake.jp/news/article/20260130CO0070/",
      "publisher": "秋田魁新報（共同通信）",
      "date": "2026-01"
    }
  },
  {
    "id": "trend-025",
    "kind": "trend",
    "official": false,
    "title": "技能実習は2027年4月に育成就労へ",
    "summary": "外国人材の新制度「育成就労」が2027年4月に始まり、技能実習制度は廃止されると報じられた。目的が技能移転から人材の育成と確保に変わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "育成就労の開始に向けて、当社の受け入れ・教育体制",
    "source": {
      "title": "「育成就労」2027年4月から 外国人材受け入れ新制度",
      "url": "https://kumanichi.com/articles/1902918",
      "publisher": "熊本日日新聞（共同通信）",
      "date": "2025-09"
    }
  },
  {
    "id": "trend-026",
    "kind": "trend",
    "official": false,
    "title": "日米関税合意で税率15%に",
    "summary": "2025年7月、日米は関税交渉で合意し、相互関税を15%、日本車への関税も合計15%にする内容と報じられた。輸出企業の取引先を通じて影響が及ぶ。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "日米関税交渉が合意、税率15% 自動車半減、日本はコメ輸入拡大",
      "url": "https://www.sakigake.jp/news/article/20250723CO0037/",
      "publisher": "秋田魁新報（共同通信）",
      "date": "2025-07"
    }
  },
  {
    "id": "trend-027",
    "kind": "trend",
    "official": false,
    "title": "米大統領令で自動車関税15%へ",
    "summary": "2025年9月、米大統領が日本車の関税を27.5%から15%に下げる大統領令に署名したと報じられた。自動車部品の受注見通しに関わる。",
    "industries": [
      "機械部品",
      "金属加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "対日関税、米大統領令に署名 2週間以内に自動車15%へ下げ",
      "url": "https://www.sakigake.jp/news/article/20250905CO0063/",
      "publisher": "秋田魁新報（共同通信）",
      "date": "2025-09"
    }
  },
  {
    "id": "trend-028",
    "kind": "trend",
    "official": false,
    "title": "米最高裁が相互関税を違法と判断",
    "summary": "2026年2月、米最高裁はIEEPAに基づく関税を違法と判断したと報じられた。鉄鋼・自動車などの232条関税は別扱いで、関税の先行きはなお不透明。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "トランプ関税、違憲判決で税金戻るか 日本企業は「情報整理」急務に",
      "url": "https://www.nikkei.com/article/DGXZQOGN20CED0Q6A220C2000000/",
      "publisher": "日本経済新聞",
      "date": "2026-02"
    }
  },
  {
    "id": "trend-029",
    "kind": "trend",
    "official": false,
    "title": "関税でマイナス影響は約35%",
    "summary": "日本政策金融公庫の2025年4〜6月期の特別調査で、米関税で「マイナスの影響」と答えた中小企業は34.9%。対策は経費削減や価格転嫁が多かった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "関税や景気の変化に左右されにくい受注づくり",
    "source": {
      "title": "米国の関税引き上げによる影響に関する特別調査",
      "url": "https://www.jfc.go.jp/n/findings/pdf/tokubetu_250725.pdf",
      "publisher": "日本政策金融公庫総合研究所",
      "date": "2025-07"
    }
  },
  {
    "id": "trend-030",
    "kind": "trend",
    "official": false,
    "title": "関税と物価高が中小の経営を揺さぶる",
    "summary": "日刊工業新聞は2025年版中小企業白書を紹介し、米関税政策と物価高の長期化が中小企業の経営基盤を揺さぶっていると伝えた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ニュースイッチ（2025年版中小企業白書の記事）",
      "url": "https://newswitch.jp/p/45898",
      "publisher": "日刊工業新聞（ニュースイッチ）",
      "date": "2025-05"
    }
  },
  {
    "id": "trend-031",
    "kind": "trend",
    "official": true,
    "title": "2026年版白書のテーマは「稼ぐ力」",
    "summary": "2026年版の中小企業白書は4月に閣議決定。生産性を上げる取り組みや経営者の基本知識（経営リテラシー）、企業同士の連携による事業の維持がテーマ。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "協力会社との連携で、当社だけではできない仕事を受ける",
    "source": {
      "title": "中小企業白書・小規模企業白書",
      "url": "https://www.chusho.meti.go.jp/pamflet/hakusyo/",
      "publisher": "中小企業庁",
      "date": "2026-04"
    }
  },
  {
    "id": "trend-032",
    "kind": "trend",
    "official": false,
    "title": "省力化投資補助金（一般型）の公募続く",
    "summary": "ロボットやIoTなど、現場に合わせた省力化設備の導入を支援する補助金。2026年も一般型の公募が複数回行われていると伝えられている。次回日程は公式で確認が必要。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "補助金を使って入れた設備で、現場の作業がどう変わったか",
    "source": {
      "title": "中小企業省力化投資補助金 一般型 第8回公募",
      "url": "https://sogyotecho.jp/news/20260818shoryokuka/",
      "publisher": "創業手帳",
      "date": "2026-08"
    }
  },
  {
    "id": "trend-033",
    "kind": "trend",
    "official": true,
    "title": "ものづくり補助金が新事業進出と統合",
    "summary": "ものづくり補助金と新事業進出補助金が一本化され「新事業進出・ものづくり商業サービス補助金」に。2026年6月に第1回公募が始まった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "新しい設備で広がった加工の幅と、お受けできる仕事",
    "source": {
      "title": "新事業進出・ものづくり商業サービス補助金 第1回公募",
      "url": "https://mirasapo-plus.go.jp/infomation/33311/",
      "publisher": "ミラサポplus（中小企業庁）",
      "date": "2026-06"
    }
  },
  {
    "id": "trend-034",
    "kind": "trend",
    "official": false,
    "title": "取引先からの脱炭素要請は約2割",
    "summary": "日本商工会議所などの2025年度調査で、取引先から脱炭素への対応を求められた中小企業は約2割。支援を受けているのはその3割ほどにとどまる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "取引先からCO2排出量を聞かれたときに、当社がお答えできること",
    "source": {
      "title": "中小企業の省エネ・脱炭素に関する実態調査（J-Net21ニュース）",
      "url": "https://j-net21.smrj.go.jp/news/cek71k000001rdpw.html",
      "publisher": "J-Net21（中小企業基盤整備機構）",
      "date": "2025-07"
    }
  },
  {
    "id": "trend-035",
    "kind": "trend",
    "official": true,
    "title": "排出量取引制度が2026年度に本格稼働",
    "summary": "国の排出量取引制度（GX-ETS）が2026年度から本格稼働。CO2を多く出す大企業が対象で、その取引先にも排出量の把握を求める動きが広がる可能性がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "排出量取引制度 リーフレット",
      "url": "https://www.meti.go.jp/policy/energy_environment/global_warming/ets_leaflet.pdf",
      "publisher": "経済産業省",
      "date": "2026-03"
    }
  },
  {
    "id": "trend-036",
    "kind": "trend",
    "official": true,
    "title": "BCPの計画認定で税の優遇",
    "summary": "事業継続力強化計画の認定を受けると、防災・減災設備の特別償却などの支援がある。税制の対象は2027年3月末までの認定。取引先へのBCP説明にも使える。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "災害時でも納品を続けるための当社の備え",
    "source": {
      "title": "事業継続力強化計画",
      "url": "https://www.chusho.meti.go.jp/keiei/antei/bousai/keizokuryoku.html",
      "publisher": "中小企業庁",
      "date": "2026-04"
    }
  },
  {
    "id": "trend-037",
    "kind": "trend",
    "official": true,
    "title": "技能五輪全国大会は愛知で開催",
    "summary": "2025年10月、第63回技能五輪全国大会が愛知で開かれ、42職種に約1000人が参加。若手の技能を発信する機会として、人材育成の記事に使える。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "若手社員の技能検定・技能五輪への挑戦",
    "source": {
      "title": "第63回技能五輪全国大会 結果",
      "url": "https://waza.mhlw.go.jp/info/2025/1020-63-10171021.html",
      "publisher": "厚生労働省・中央職業能力開発協会",
      "date": "2025-10"
    }
  },
  {
    "id": "trend-038",
    "kind": "trend",
    "official": true,
    "title": "技能五輪国際大会、2028年は愛知",
    "summary": "2026年9月に上海で第48回技能五輪国際大会が開かれ、日本から64人が出場。2028年の国際大会は愛知県で開かれる予定。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "第48回技能五輪国際大会 日本代表選手決定",
      "url": "https://www.pref.aichi.jp/soshiki/gorin/wsc2026kettei.html",
      "publisher": "愛知県",
      "date": "2026-01"
    }
  },
  {
    "id": "trend-039",
    "kind": "trend",
    "official": false,
    "title": "製造業の生成AI導入は約65%",
    "summary": "MONOistの調査で製造業の約65%が生成AIを導入済みとされた一方、従業員10人未満の企業では導入が1割以下という調査も紹介されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "小さな工場でのAIやIoTの使い方（見積もり・日報・検査）",
    "source": {
      "title": "製造業で進む生成AI活用――65%が導入済み",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2509/18/news024.html",
      "publisher": "MONOist",
      "date": "2025-09"
    }
  },
  {
    "id": "trend-040",
    "kind": "trend",
    "official": false,
    "title": "無料AIの利用で情報流出に注意",
    "summary": "東京商工会議所の調査で、生成AIを使う中小企業の4割強が無料版のみを利用していると報じられた。図面や顧客情報を入力する際の管理が課題。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "お客様の図面・情報を守るための当社のルール",
    "source": {
      "title": "中小の4割が無料版 AI学習で流出リスク 東商",
      "url": "https://www.rodo.co.jp/news/221692/",
      "publisher": "労働新聞社",
      "date": "2026-07"
    }
  },
  {
    "id": "trend-041",
    "kind": "trend",
    "official": false,
    "title": "大手で品質不正の疑いが判明",
    "summary": "2026年5月、大手モーターメーカーで顧客の承認なしに材料や工程を変更した疑いが1000件超あると報じられた。変更管理と記録の大切さが改めて注目されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "材料や工程を変えるとき、当社がお客様に必ず確認すること",
    "source": {
      "title": "Nidec Suspected of Product Quality Fraud",
      "url": "https://english.adnkronos.com/2026/05/13/nidec-suspected-of-product-quality-fraud-3/",
      "publisher": "Adnkronos",
      "date": "2026-05"
    }
  },
  {
    "id": "trend-042",
    "kind": "trend",
    "official": false,
    "title": "電気・ガス料金の補助は時期限定",
    "summary": "国の電気・ガス料金補助は冬の一部期間に限って実施されてきた。補助がない月は負担が増えるため、省エネやエネルギー費の価格転嫁が引き続き課題。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "電気・ガス料金補助、3カ月で約7000円の負担減 26年1〜2月に重点",
      "url": "https://www.nikkei.com/article/DGXZQOUA213RP0R21C25A1000000/",
      "publisher": "日本経済新聞",
      "date": "2025-11"
    }
  },
  {
    "id": "term-001",
    "kind": "term",
    "title": "はめあいとは",
    "summary": "穴と軸を組むときの「きつさ」の決まり。穴が大きければすきまばめ、軸が大きければしまりばめ、ほぼ同じなら中間ばめと呼ぶ。",
    "industries": [
      "切削加工",
      "機械部品"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "はめあいを図面で頼むときの3つの基本",
    "source": {
      "title": "はめあい（講義資料）",
      "url": "https://www.tsd.saitama-u.ac.jp/content/files/ghi/paper24-04.pdf",
      "publisher": "埼玉大学",
      "date": null
    }
  },
  {
    "id": "term-002",
    "kind": "term",
    "title": "H7は穴、g6は軸の記号",
    "summary": "はめあい記号は大文字が穴、小文字が軸を表す。H7/g6のように並べて書き、実際の寸法差はJISの許容差表で確かめる。",
    "industries": [
      "切削加工",
      "機械部品"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "H7・g6・h6、記号の読み方早わかり",
    "source": {
      "title": "はめあい公差表",
      "url": "https://www.osg.co.jp/media_dl/technical/file/hameai.pdf",
      "publisher": "オーエスジー",
      "date": null
    }
  },
  {
    "id": "question-058",
    "kind": "question",
    "title": "はめあいはどう選べばいい？",
    "summary": "回して使うなら少しゆるめ、動かず固定するならすきまの少ない側を選ぶ。用途を伝えれば加工側が記号の相談にのれると書くと親切。",
    "industries": [
      "切削加工",
      "機械部品"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "「回す・固定する」で選ぶはめあい入門",
    "source": {
      "title": "はめあいの種類：適切なはめあいを選択する方法",
      "url": "https://www.rapiddirect.com/ja/blog/types-of-fits/",
      "publisher": "RapidDirect",
      "date": null
    }
  },
  {
    "id": "term-003",
    "kind": "term",
    "title": "すきまばめ・しまりばめ",
    "summary": "すきまばめは手で入る・回る組み方、しまりばめは圧入や焼きばめで固定する組み方。どちらにするかで加工と組立の手間が変わる。",
    "industries": [
      "切削加工",
      "機械部品",
      "組立"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "はめあい（講義資料）",
      "url": "https://www.tsd.saitama-u.ac.jp/content/files/ghi/paper24-04.pdf",
      "publisher": "埼玉大学",
      "date": null
    }
  },
  {
    "id": "question-059",
    "kind": "question",
    "title": "市販部品に合わせる穴の公差は？",
    "summary": "リニアブッシュなど市販部品には推奨のはめあいがメーカー資料に書かれている。図面に入れる前に部品メーカーの注意点を見るよう勧めると良い。",
    "industries": [
      "切削加工",
      "機械部品",
      "装置"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "市販部品を入れる穴、公差はどこを見る？",
    "source": {
      "title": "リニアブッシュ 設計時の注意点",
      "url": "https://jp.misumi-ec.com/special/linearbushing/notes/assemble/",
      "publisher": "ミスミ",
      "date": null
    }
  },
  {
    "id": "term-004",
    "kind": "term",
    "title": "公差のない寸法は普通公差",
    "summary": "図面に公差を書かない寸法には普通公差が使われる。はめあい部だけ個別に公差を入れ、他は普通公差に任せると費用を抑えやすい。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "図面の読み描き超入門(5) 図面に寸法を入れて仕上げてみよう",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1512/04/news009_4.html",
      "publisher": "MONOist",
      "date": "2015-12"
    }
  },
  {
    "id": "question-060",
    "kind": "question",
    "title": "チタンの加工費が高いのはなぜ？",
    "summary": "チタンは熱が逃げにくく刃先が高温になり、工具とくっつく摩耗や表面の硬化が起きやすい。工具が早く傷み、ゆっくり削るため費用が上がる。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "チタン部品の見積が高い理由を正直に説明",
    "source": {
      "title": "チタンの加工",
      "url": "https://www.nipponsteel.com/product/trantixxii/column/titanium-processing.html",
      "publisher": "日本製鉄",
      "date": null
    }
  },
  {
    "id": "term-005",
    "kind": "term",
    "title": "熱伝導率が低い材料",
    "summary": "削ったときの熱が材料側に逃げず刃先にたまる性質。チタンやインコネルが削りにくい大きな理由で、工具寿命と加工時間に響く。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "チタン：大きな可能性を持つハイテク素材",
      "url": "https://cemecon.com/jp/ja/facts-stories/titanium-high-tech-material-with-enormous-potential/pdf",
      "publisher": "CemeCon",
      "date": null
    }
  },
  {
    "id": "question-061",
    "kind": "question",
    "title": "チタンは工具がどれくらい減る？",
    "summary": "ある海外メーカーの社内テストでは、チタン合金Ti-6Al-4Vの工具寿命はアルミ6061の1割未満とされる。工具代が見積に乗る理由の説明に使える。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "チタン加工の解説",
      "url": "https://www.ptsmake.com/ja/?p=13133",
      "publisher": "PTSMAKE",
      "date": null
    }
  },
  {
    "id": "term-006",
    "kind": "term",
    "title": "加工硬化とは",
    "summary": "削ると表面が元の材料より硬くなる現象。ステンレスやチタンで起きやすく、次の刃がさらに削りにくくなり工具が早く減る。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ステンレス・チタンの「加工硬化」をやさしく",
    "source": {
      "title": "チタンの加工",
      "url": "https://www.nipponsteel.com/product/trantixxii/column/titanium-processing.html",
      "publisher": "日本製鉄",
      "date": null
    }
  },
  {
    "id": "pain-039",
    "kind": "pain",
    "title": "チタンは削る量が多いほど高い",
    "summary": "摂南大学の研究では、複雑なチタン製航空機部品は材料の多くを削り落とすため、速く削る方法ができれば加工費を大きく下げられるとしている。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "チタン合金の高効率切削に関する研究",
      "url": "https://www.setsunan.ac.jp/kenkyu/shien/files/033_y.hara.pdf",
      "publisher": "摂南大学",
      "date": null
    }
  },
  {
    "id": "term-007",
    "kind": "term",
    "title": "インコネルとは",
    "summary": "ニッケルを主にクロムや鉄などを加えた合金。熱に強くさびにくいが、熱を伝えにくく高温でも強いため、切削では代表的な難削材。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "インコネル部品を頼む前に知りたいこと",
    "source": {
      "title": "難削材切削加工 カテゴリ",
      "url": "https://mono.ipros.com/cg2/難削材切削加工/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-032",
    "kind": "success",
    "title": "難削材×5軸の事例を載せる",
    "summary": "イプロスには、5軸マシニングでインコネルを削り出した事例を形状写真付きで載せる加工会社がある。材料名と加工法の組み合わせは検索で探されやすい。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "インコネルを5軸で削った事例の書き方",
    "source": {
      "title": "5軸マシニングによるインコネル削り出し事例",
      "url": "https://mono.ipros.com/product/detail/2000749550",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-008",
    "kind": "term",
    "title": "細穴放電加工とは",
    "summary": "細い電極で小さな穴を放電であける加工。材料の硬さに左右されないため、インコネル製タービンブレードの冷却穴などに使われる。",
    "industries": [
      "放電加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "硬い材料の細い穴は放電で",
    "source": {
      "title": "戦略的基盤技術高度化支援事業 成果報告（細穴放電加工）",
      "url": "https://www.chusho.meti.go.jp/keiei/sapoin/portal/seika/2007/19-41-13-4.pdf",
      "publisher": "中小企業庁",
      "date": "2007"
    }
  },
  {
    "id": "buyer-046",
    "kind": "buyer",
    "title": "難削材はカテゴリで探される",
    "summary": "イプロスには「難削材切削加工」「難削材加工製品」というカテゴリがあり、発注者は材料の難しさから加工先を探す。対応材料名をページに並べておくとよい。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "難削材切削加工 カテゴリ",
      "url": "https://mono.ipros.com/cg2/難削材切削加工/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-009",
    "kind": "term",
    "title": "C面取りとは",
    "summary": "角を45度にまっすぐ落とす面取り。図面ではC0.5のように書く。加工しやすいので、特に理由がなければC面が一般的。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "C面・R面・糸面取り、図面での書き分け",
    "source": {
      "title": "C面・R面の図面指示ガイド 2026",
      "url": "https://renue.co.jp/posts/chamfer-fillet-c-r-drawing-notation-guide-2026",
      "publisher": "renue",
      "date": "2026"
    }
  },
  {
    "id": "term-010",
    "kind": "term",
    "title": "R面取りとは",
    "summary": "角を決めた半径の丸みにする面取り。R0.5のように書く。力が一点に集まるのを和らげる効果が高く、手が触れる部分にも向く。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "C面・R面の図面指示ガイド 2026",
      "url": "https://renue.co.jp/posts/chamfer-fillet-c-r-drawing-notation-guide-2026",
      "publisher": "renue",
      "date": "2026"
    }
  },
  {
    "id": "term-011",
    "kind": "term",
    "title": "糸面取りとは",
    "summary": "寸法を細かく決めず、けが防止にごく小さく角を落とす指示。金属ではおよそC0.2程度だが会社で差があるので、数値を添えると安全。",
    "industries": [
      "切削加工",
      "金属加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "「糸面取り」は何ミリ？会社で違う理由",
    "source": {
      "title": "中学校技術／材料と加工に関する技術",
      "url": "https://ja.wikibooks.org/wiki/%E4%B8%AD%E5%AD%A6%E6%A0%A1%E6%8A%80%E8%A1%93/%E6%9D%90%E6%96%99%E3%81%A8%E5%8A%A0%E5%B7%A5%E3%81%AB%E9%96%A2%E3%81%99%E3%82%8B%E6%8A%80%E8%A1%93%E3%82%92%E5%88%A9%E7%94%A8%E3%81%97%E3%81%9F%E8%A3%BD%E4%BD%9C%E5%93%81%E3%81%AE%E8%A8%AD%E8%A8%88%E3%83%BB%E8%A3%BD%E4%BD%9C",
      "publisher": "Wikibooks",
      "date": null
    }
  },
  {
    "id": "question-062",
    "kind": "question",
    "title": "面取りの指示がない角はどうなる？",
    "summary": "「指示のない角は糸面取り(C0.1〜C0.3)」のように図面に注記して範囲を決める例がある。注記がないと仕上がりの解釈がずれやすい。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "旋盤作業部門 部品図α",
      "url": "https://www.education.saga.jp/hp/sagakougyoukoukou/wp-content/uploads/sites/270/2024/05/14-1旋盤作業部門［部品図_α］.pdf",
      "publisher": "佐賀県立佐賀工業高等学校",
      "date": "2024-05"
    }
  },
  {
    "id": "question-063",
    "kind": "question",
    "title": "C面とR面、どちらが安い？",
    "summary": "C面は45度の直線なので加工が比較的かんたん。機能上丸みが必要な所だけR面にすると、費用を抑えやすいと伝えられる。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "面取りの選び方でコストを下げる",
    "source": {
      "title": "中学校技術／材料と加工に関する技術",
      "url": "https://ja.wikibooks.org/wiki/%E4%B8%AD%E5%AD%A6%E6%A0%A1%E6%8A%80%E8%A1%93/%E6%9D%90%E6%96%99%E3%81%A8%E5%8A%A0%E5%B7%A5%E3%81%AB%E9%96%A2%E3%81%99%E3%82%8B%E6%8A%80%E8%A1%93%E3%82%92%E5%88%A9%E7%94%A8%E3%81%97%E3%81%9F%E8%A3%BD%E4%BD%9C%E5%93%81%E3%81%AE%E8%A8%AD%E8%A8%88%E3%83%BB%E8%A3%BD%E4%BD%9C",
      "publisher": "Wikibooks",
      "date": null
    }
  },
  {
    "id": "term-012",
    "kind": "term",
    "title": "RaとRzの違い",
    "summary": "Raは表面の凸凹の平均、Rzは山と谷の差の大きさ。Rzは傷や工具の跡など一部の凸凹に敏感で、同じ面ならRzの値の方が大きく出る。",
    "industries": [
      "切削加工",
      "研削"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "RaとRz、どちらで指示すればいい？",
    "source": {
      "title": "Ra vs Rz: Understanding Surface Roughness Parameters",
      "url": "https://www.wevolver.com/article/ra-vs-rz-understanding-surface-roughness-parameters-in-engineering",
      "publisher": "Wevolver",
      "date": null
    }
  },
  {
    "id": "question-064",
    "kind": "question",
    "title": "RaとRzは換算できる？",
    "summary": "おおよその目安で一方から他方を推し量ることはできるが、重要な部品にこの換算を使うべきではないとされる。測る項目は図面で決めておく。",
    "industries": [
      "切削加工",
      "研削"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "Ra vs Rz: Understanding Surface Roughness Parameters",
      "url": "https://www.wevolver.com/article/ra-vs-rz-understanding-surface-roughness-parameters-in-engineering",
      "publisher": "Wevolver",
      "date": null
    }
  },
  {
    "id": "term-013",
    "kind": "term",
    "title": "RzJISは昔の十点平均粗さ",
    "summary": "旧JISの十点平均粗さ(RzJIS)は高い山5つと深い谷5つの平均。今のRzとは定義が違うので、古い図面の記号は確認が必要。",
    "industries": [
      "切削加工",
      "研削"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "古い図面の三角記号と今の粗さ記号",
    "source": {
      "title": "表面粗さ記号 Ra・Rz JIS図面ガイド 2026",
      "url": "https://renue.co.jp/posts/surface-roughness-symbols-ra-rz-jis-drawing-guide-2026",
      "publisher": "renue",
      "date": "2026"
    }
  },
  {
    "id": "question-065",
    "kind": "question",
    "title": "Raだけで十分ですか？",
    "summary": "Raは平均なので、ぽつんとある突起を見落とすことがある。シール面や滑る面などは、RaとRzを両方書く選択肢があると答えに入れる。",
    "industries": [
      "切削加工",
      "研削"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "How Surface Height Is Quantified — From Ra to Rz",
      "url": "https://www.keyence.com/products/microscope/laser-microscope/resources/laser-microscope-resources/how-surface-height-is-quantified-from-ra-to-rz.jsp",
      "publisher": "キーエンス",
      "date": null
    }
  },
  {
    "id": "question-066",
    "kind": "question",
    "title": "旋盤で削るだけでどこまで滑らか？",
    "summary": "MONOistの記事の専門家の話では、旋盤で削るだけでRa6.3程度、条件によりRa1.6程度になることもあるという。経験談で条件により変わる点も添える。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "面粗さ指示についての解説",
      "url": "https://monoist.itmedia.co.jp/mn/spv/0911/30/news085_2.html",
      "publisher": "MONOist",
      "date": "2009-11"
    }
  },
  {
    "id": "question-067",
    "kind": "question",
    "title": "面粗さは全部の面に書くべき？",
    "summary": "必要な面だけに面粗さを指定すると費用を抑えられる、と加工会社のVA/VE事例集は勧める。全面に細かい粗さを書くと仕上げの工程が増える。",
    "industries": [
      "切削加工",
      "研削"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "面粗さ指定を減らして安くする",
    "source": {
      "title": "切削加工のVA/VE事例集",
      "url": "https://pr.mono.ipros.com/daishin-s/product/detail/2000530424/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-014",
    "kind": "term",
    "title": "止まり穴と通り穴",
    "summary": "通り穴は向こうまで貫通した穴、止まり穴は途中で止まる穴。タップ（ねじ立て工具）は種類によって止まり穴に使えないものがある。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "止まり穴・通り穴でねじ加工が変わる理由",
    "source": {
      "title": "ポイントタップの使用範囲 FAQ",
      "url": "https://faq.osg.co.jp/faq/show/618",
      "publisher": "オーエスジー",
      "date": null
    }
  },
  {
    "id": "term-015",
    "kind": "term",
    "title": "下穴とは",
    "summary": "ねじを立てる前にあける穴。タップは下穴の大きさや深さの影響を受けるので、下穴が合わないとねじ精度が落ちたり工具が折れたりする。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "Internal Thread Processing with Taps and Recent Trends",
      "url": "https://tech.jsae.or.jp/paperinfo/en/content/jk202204.06/",
      "publisher": "自動車技術会",
      "date": "2022-04"
    }
  },
  {
    "id": "question-068",
    "kind": "question",
    "title": "止まり穴のねじ、奥まで切れる？",
    "summary": "下穴の深さに余裕がないときは、食付きの短いタップで有効ねじ長さを確保できる。ただし工具の持ちは悪くなるので、下穴は少し深めが無難。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "止まり穴のねじ深さ、図面でどう書く？",
    "source": {
      "title": "止まり穴のタップ選定 FAQ",
      "url": "https://faq.osg.co.jp/faq/show/616",
      "publisher": "オーエスジー",
      "date": null
    }
  },
  {
    "id": "term-016",
    "kind": "term",
    "title": "有効ねじ長さ",
    "summary": "ねじ山が完全にできている長さ。止まり穴では穴底の手前でねじ山が不完全になるので、有効ねじ長さと下穴深さを図面でそろえる。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "止まり穴のタップ選定 FAQ",
      "url": "https://faq.osg.co.jp/faq/show/616",
      "publisher": "オーエスジー",
      "date": null
    }
  },
  {
    "id": "term-017",
    "kind": "term",
    "title": "食付き部とは",
    "summary": "タップの先端にある細くなった部分。ここで少しずつねじ山を作る。食付きが長いほど工具は長持ちするが、穴底近くまでねじを切れない。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "タップ技術資料",
      "url": "https://www.nachi-fujikoshi.co.jp/tec/pdf/30B1.pdf",
      "publisher": "不二越",
      "date": null
    }
  },
  {
    "id": "term-018",
    "kind": "term",
    "title": "熱処理後加工とは",
    "summary": "焼入れなどの熱処理をした後に研削や切削で仕上げること。熱で生じた変形や寸法の変化を直し、硬い状態で精度を出すために行う。",
    "industries": [
      "切削加工",
      "研削",
      "熱処理"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "熱処理後加工が必要になる部品とは",
    "source": {
      "title": "高周波焼入れ後の後加工に関する事例",
      "url": "https://mono.ipros.com/product/detail/2000739523",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-069",
    "kind": "question",
    "title": "焼入れ後にまた加工が要るのは？",
    "summary": "三重県の研究では焼入れ焼戻しで試験片の真円度が9μmから18μmに悪化した。精度が要る面は熱処理後に研削で仕上げると説明できる。",
    "industries": [
      "切削加工",
      "研削",
      "熱処理"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "焼入れ後に研削する理由を数字で",
    "source": {
      "title": "焼入れ焼戻しと研削精度に関する研究報告",
      "url": "https://www.pref.mie.lg.jp/common/content/000171703.pdf",
      "publisher": "三重県工業研究所",
      "date": null
    }
  },
  {
    "id": "question-070",
    "kind": "question",
    "title": "高周波焼入れで寸法は変わる？",
    "summary": "高周波焼入れでは外径・内径が変わることがあり、焼入れ後の後加工が必要だった事例がある。仕上げ代(削り代)を見込んだ工程を伝えると良い。",
    "industries": [
      "切削加工",
      "研削",
      "熱処理"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "高周波焼入れ後の後加工に関する事例",
      "url": "https://mono.ipros.com/product/detail/2000739523",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-019",
    "kind": "term",
    "title": "残留オーステナイト",
    "summary": "焼入れで硬くなりきらずに残った組織。時間とともに寸法が縮むなど変化し、研削時の割れの原因にもなる。サブゼロ処理で減らす。",
    "industries": [
      "切削加工",
      "研削",
      "熱処理"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "精密部品が後から寸法変化する原因",
    "source": {
      "title": "工具と表面処理 読みものシリーズ",
      "url": "https://www.monotaro.com/note/readingseries/kouguhyomensyori/0204",
      "publisher": "モノタロウ",
      "date": null
    }
  },
  {
    "id": "term-020",
    "kind": "term",
    "title": "研削焼け・研削割れ",
    "summary": "研削の熱で表面が変色したり硬さが落ちたり、細かい割れが出たりする不具合。歯車では研削後に表面の焼け検査をする規格がある。",
    "industries": [
      "研削",
      "熱処理"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "研削焼けとは？見つけ方と防ぎ方",
    "source": {
      "title": "Gears. Surface temper etch inspection after grinding",
      "url": "https://shop-checkout.bsigroup.com/products/gears-surface-temper-etch-inspection-after-grinding-chemical-method_hard-copy",
      "publisher": "BSI",
      "date": null
    }
  },
  {
    "id": "trend-043",
    "kind": "trend",
    "official": true,
    "title": "焼入れ鋼を研削せず削る動き",
    "summary": "焼入れ後の仕上げは研削が中心だったが、効率と費用の面から硬い鋼をエンドミルやCBN工具で直接削る研究・取組みが進んでいる。",
    "industries": [
      "切削加工",
      "研削"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "焼入れ後は研削？切削？選び方",
    "source": {
      "title": "高硬度焼き入れ鋼のエンドミル加工における加工精度と加工面特性の研究",
      "url": "https://www.oita-ri.jp/wp-content/uploads/高硬度焼き入れ鋼のエンドミル加工における加工精度と加工面特性の研究-1.pdf",
      "publisher": "大分県産業科学技術センター",
      "date": null
    }
  },
  {
    "id": "term-021",
    "kind": "term",
    "title": "ワイヤーカットとは",
    "summary": "細い金属線(太さ0.02〜0.2mm程度)に電気を流し、糸のこのように材料を切る放電加工。決まった形の電極を作らなくてよい。",
    "industries": [
      "放電加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ワイヤーカットで何ができる？",
    "source": {
      "title": "ワイヤカット放電加工方法（特許）",
      "url": "https://patents.google.com/patent/JP2887635B2/ja",
      "publisher": "Google Patents",
      "date": null
    }
  },
  {
    "id": "question-071",
    "kind": "question",
    "title": "形彫り放電とワイヤー、どう違う？",
    "summary": "形彫りは形をうつした電極を沈めて掘る方法で、止まり穴や立体の凹みに向く。ワイヤーは突き抜けた形の切り抜きや抜き型に向く。",
    "industries": [
      "放電加工",
      "金型"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "放電加工2種類の使い分け",
    "source": {
      "title": "ワイヤカット放電加工方法（特許）",
      "url": "https://patents.google.com/patent/JP2887635B2/ja",
      "publisher": "Google Patents",
      "date": null
    }
  },
  {
    "id": "question-072",
    "kind": "question",
    "title": "放電加工はどんな材料でも？",
    "summary": "ワイヤーカットは電気を通す材料なら硬さに関係なく加工できる。樹脂など電気を通さない材料は基本的にできない、と答えに入れるとよい。",
    "industries": [
      "放電加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "ワイヤーカット加工 製品紹介",
      "url": "https://pr.mono.ipros.com/maruwakikai/product/detail/2001505943/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-073",
    "kind": "question",
    "title": "ワイヤーカットの精度はどのくらい？",
    "summary": "加工会社の公開情報では±0.005mmをうたう例がある。ただし自己申告の値なので、形・板厚・材料ごとに確認するよう書くのが誠実。",
    "industries": [
      "放電加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "ワイヤーカット加工の紹介",
      "url": "https://mono.ipros.com/product/detail/2000522862",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-074",
    "kind": "question",
    "title": "放電加工も1個から頼める？",
    "summary": "最小ロットは「ひとつ」から、1〜10個大歓迎と掲げる放電・ワイヤー加工の会社がある。試作の発注者には個数の下限をはっきり書くと安心。",
    "industries": [
      "放電加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "ワイヤーカット、1個だけでも頼める？",
    "source": {
      "title": "ワイヤーカット・細穴放電加工で細穴打抜金型を製作。最小ロットはひとつから",
      "url": "https://mono.ipros.com/product/detail/2000329755",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-047",
    "kind": "buyer",
    "title": "台数が多い会社にまとめたい",
    "summary": "ワイヤーカットを複数社に分けると、納期交渉や打合せ、進み具合の確認が増える。設備台数が多い会社にまとめて頼みたい買い手がいる。",
    "industries": [
      "放電加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ワイヤーカット加工 製品紹介",
      "url": "https://pr.mono.ipros.com/maruwakikai/product/detail/2001505943/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-033",
    "kind": "success",
    "title": "保有機と加工範囲を数字で出す",
    "summary": "ワイヤーカット機の機種・台数・最大加工範囲・精度を一覧で載せる加工会社がある。発注者は「自分の部品が入るか」をまず見る。",
    "industries": [
      "放電加工"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "設備一覧ページに書くべき数字",
    "source": {
      "title": "ワイヤーカット加工の紹介",
      "url": "https://mono.ipros.com/product/detail/2000522862",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-022",
    "kind": "term",
    "title": "5軸加工とは",
    "summary": "材料を傾けたり回したりしながら削る加工。複数の面を1回の固定で削れるため、付け替えによるずれが減り精度と効率が上がりやすい。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "5軸加工で何が変わる？発注者向け解説",
    "source": {
      "title": "5軸加工についての技術資料",
      "url": "https://www.hro.or.jp/upload/28834/190201gojiku.pdf",
      "publisher": "北海道立総合研究機構",
      "date": "2019-02"
    }
  },
  {
    "id": "term-023",
    "kind": "term",
    "title": "アンダーカットとは",
    "summary": "真上から刃が届かない、えぐれた形。3軸機では1回の固定で削れず何度も付け替えが要る。5軸加工はこの解決策の一つ。",
    "industries": [
      "切削加工",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "5軸マシニングセンタとは",
      "url": "https://cad-kenkyujo.com/5ziku-machining-center/",
      "publisher": "CAD研究所",
      "date": null
    }
  },
  {
    "id": "term-024",
    "kind": "term",
    "title": "工程集約とは",
    "summary": "複数の機械で分けていた工程を1台にまとめること。治具や工具が1台分で済み、準備の時間と費用を減らせる。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "工程集約で短納期になる仕組み",
    "source": {
      "title": "DMG森精機 工程集約の提案資料",
      "url": "https://www.iwaikikai.co.jp/cms/wp-content/uploads/2022/02/202202_dmgmori_process.pdf",
      "publisher": "岩井機械",
      "date": "2022-02"
    }
  },
  {
    "id": "trend-044",
    "kind": "trend",
    "official": false,
    "title": "少量品は5軸機に置き換わる見方",
    "summary": "MONOistの2026年8月の記事では、車部品の少量品が専用機から5軸機へ移ると予想。3軸に慣れた現場の不安や計測が導入の壁ともある。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "5軸加工機の導入動向に関する記事",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2608/27/news017.html",
      "publisher": "MONOist",
      "date": "2026-08"
    }
  },
  {
    "id": "pain-040",
    "kind": "pain",
    "title": "5軸は扱える人が限られる",
    "summary": "5軸機は操作が複雑で高度な技術が要るとされ、操作への不安や測り方・精度の確保が導入の壁になる。人が育つまでの時間も悩み。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "5軸機を入れた町工場の最初の1年",
    "source": {
      "title": "5軸加工機の導入動向に関する記事",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2608/27/news017.html",
      "publisher": "MONOist",
      "date": "2026-08"
    }
  },
  {
    "id": "question-075",
    "kind": "question",
    "title": "5軸で頼むと高くならない？",
    "summary": "付け替えが減り治具も少なくなるため、複雑な形や多面加工ではかえって安く早くなる場合がある。単純な形なら3軸の方が向く点も添える。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "5軸と3軸、見積が安いのはどっち？",
    "source": {
      "title": "DMG森精機 工程集約の提案資料",
      "url": "https://www.iwaikikai.co.jp/cms/wp-content/uploads/2022/02/202202_dmgmori_process.pdf",
      "publisher": "岩井機械",
      "date": "2022-02"
    }
  },
  {
    "id": "trend-045",
    "kind": "trend",
    "official": false,
    "title": "工作機械メーカーが5軸の普及を後押し",
    "summary": "DMG森精機が顧客約70社と連携して5軸加工の普及を目指すとニュースイッチが報じた。メーカー主導で使いこなしの事例共有が進む。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "「日本に5軸加工機のブームを」DMG森精機が顧客70社と連携するワケ",
      "url": "https://newswitch.jp/p/14040",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "term-025",
    "kind": "term",
    "title": "複合加工機とは",
    "summary": "旋盤とフライス盤などの機能を1台にまとめた機械。旋削・フライス・穴あけ・ねじ切りを段取り替えなしで行え、付け替えの時間が減る。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "複合加工機で何が1回で終わる？",
    "source": {
      "title": "複合加工機とは（マシナリーお役立ちNAVI）",
      "url": "https://www.brother.co.jp/product/machine/speedio-navi/articles/a0031/index.aspx",
      "publisher": "ブラザー工業",
      "date": null
    }
  },
  {
    "id": "trend-046",
    "kind": "trend",
    "official": false,
    "title": "町工場向けの小型複合機",
    "summary": "村田機械はY軸付きの正面型CNCターニングセンターを、多品種少量の町工場向けに発表した(MONOist、2026年4月)。工程集約と省人化が狙い。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "村田機械、町工場向け正面型CNCターニングセンター",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2604/21/news061.html",
      "publisher": "MONOist",
      "date": "2026-04"
    }
  },
  {
    "id": "success-034",
    "kind": "success",
    "title": "5軸の小ロット試作を前に出す",
    "summary": "5軸加工で難削材や航空機関係の部品を小ロット試作でき、と掲げる加工会社がある。「試作×材料×業界」をそろえて書くと探されやすい。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "source": {
      "title": "小ロット試作対応の5軸加工",
      "url": "https://mono.ipros.com/product/detail/2000549100",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-076",
    "kind": "question",
    "title": "内側の角のRを大きくすると安い？",
    "summary": "内側の角Rが小さいと細い工具で何度も削る必要がある。設計で問題ない範囲で角Rを大きくすると、工具が太くでき加工時間が短くなる。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "内角Rを0.5→3にすると何が変わる？",
    "source": {
      "title": "角Rの見直しによるコストダウン事例",
      "url": "https://mono.ipros.com/product/detail/2001234099",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-026",
    "kind": "term",
    "title": "隅R（すみアール）とは",
    "summary": "ポケットなど内側の角にどうしても残る丸み。エンドミルは丸いので完全な直角は作れず、なくすには放電加工など別工程が要り時間がかかる。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "隅Rを残すコストダウン事例",
      "url": "https://mono.ipros.com/product/detail/2001234094",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-077",
    "kind": "question",
    "title": "平らな穴底は高くなる？",
    "summary": "小さく深い穴の底を平らにすると特別な加工が要る。ドリルの先の角度のままでよければ安くなる、とVA/VE事例で紹介されている。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "穴底の形で変わる加工費",
    "source": {
      "title": "切削加工のVA/VE事例集",
      "url": "https://pr.mono.ipros.com/daishin-s/product/detail/2000530424/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-078",
    "kind": "question",
    "title": "単価は設計でどこまで決まる？",
    "summary": "製品単価の7割は設計で決まると言われる、と加工会社が紹介している（根拠の調査は示されていない）。設計段階の相談が効く理由の説明に使える。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "切削加工のVA/VE事例集",
      "url": "https://pr.mono.ipros.com/daishin-s/product/detail/2000530424/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-035",
    "kind": "success",
    "title": "VA/VE事例集で設計者と話す",
    "summary": "角R・穴底・面粗さなど、図面のどこを変えると安くなるかを事例集にまとめて配る加工会社がある。設計者が社内で説明する材料にもなる。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "設計者に喜ばれるコストダウン事例の書き方",
    "source": {
      "title": "切削加工のVA/VE事例集",
      "url": "https://pr.mono.ipros.com/daishin-s/product/detail/2000530424/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "pain-041",
    "kind": "pain",
    "title": "値下げ要求に根拠で返したい",
    "summary": "角Rなどを見直すと工数と費用がどれだけ下がるか根拠を示せると交渉しやすい、と加工会社は言う。根拠がないと一方的な値下げになりがち。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "角Rの見直しによるコストダウン事例",
      "url": "https://mono.ipros.com/product/detail/2001234099",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-027",
    "kind": "term",
    "title": "削り残りとは",
    "summary": "工具の丸みや届かない場所のために、図面どおりに削りきれず材料が残る部分。設計時に工具の制約を知っておくと手戻りが減る。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "meviy 切削加工 削り残りが発生する形状もそのまま注文可能に",
      "url": "https://netshop.impress.co.jp/r/prtimes/items/000000378.000012100",
      "publisher": "ネットショップ担当者フォーラム（PR TIMES）",
      "date": "2026-10"
    }
  },
  {
    "id": "question-079",
    "kind": "question",
    "title": "A5052はどんなときに選ぶ？",
    "summary": "A5052はさびに強く、特に海水に強い中強度のアルミ。曲げなどの成形や溶接もしやすい。強さより耐食性と加工しやすさを重視するときに向く。",
    "industries": [
      "切削加工",
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "A5052・A6061・A7075の選び方",
    "source": {
      "title": "アルミA5052の切削加工",
      "url": "https://mono.ipros.com/product/detail/2000529272",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-080",
    "kind": "question",
    "title": "A6061はどんな材料？",
    "summary": "熱処理で強さを上げるアルミ合金で、強さ・削りやすさ・価格のつり合いがよい。汎用の機械部品で迷ったときの候補になる。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "Comprehensive Comparison of 5052, 6061, and 7075 Aluminum Alloys",
      "url": "https://shop.machinemfg.com/comprehensive-comparison-of-5052-6061-and-7075-aluminum-alloys/",
      "publisher": "MachineMFG",
      "date": null
    }
  },
  {
    "id": "term-028",
    "kind": "term",
    "title": "超々ジュラルミンA7075",
    "summary": "アルミ合金の中でも最高クラスの強さを持つ。航空機など大きな力のかかる部品に使うが、さびに弱いのでアルマイトなどの防食が要ることも。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "A7075を選ぶ前に知りたい弱点",
    "source": {
      "title": "What are the Differences Between 6061 and 7075 Aluminum?",
      "url": "https://shop.machinemfg.com/what-are-the-differences-between-6061-and-7075-aluminum/",
      "publisher": "MachineMFG",
      "date": null
    }
  },
  {
    "id": "term-029",
    "kind": "term",
    "title": "快削ステンレスSUS303",
    "summary": "SUS304に硫黄を加えて削りやすくしたステンレス。工具が長持ちし加工が速い一方、さびにくさや粘り強さは304より少し劣る。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "SUS303と304、切削で選ぶならどっち",
    "source": {
      "title": "快削ステンレス NAS303AM",
      "url": "https://www.nyk.co.jp/pdf/products/NAS_303AM_J.pdf",
      "publisher": "日本冶金工業",
      "date": null
    }
  },
  {
    "id": "question-081",
    "kind": "question",
    "title": "SUS304は削りにくい？",
    "summary": "材料メーカーのドリル試験では、SUS304は途中でドリルが折れたが、快削の303系は625穴あけても折れなかった。削る量が多い部品では材料で費用が変わる。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "快削ステンレス NAS303AM",
      "url": "https://www.nyk.co.jp/pdf/products/NAS_303AM_J.pdf",
      "publisher": "日本冶金工業",
      "date": null
    }
  },
  {
    "id": "term-030",
    "kind": "term",
    "title": "快削鋼とは",
    "summary": "硫黄などを加えて切りくずを細かく切れやすくし、削りやすくした鋼。被削性(削りやすさ)は鋼の硫黄量に大きく左右される。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "快削ステンレス スターカット13Cr",
      "url": "https://www.daido.co.jp/products/stainless/starcut13cr/starcut13cr.pdf",
      "publisher": "大同特殊鋼",
      "date": null
    }
  },
  {
    "id": "term-031",
    "kind": "term",
    "title": "研削加工とは",
    "summary": "砥石を高速で回し、表面を少しずつ削って精度と滑らかさを出す加工。平面研削・円筒研削・心なし研削・内面研削などがある。",
    "industries": [
      "研削"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "切削と研削、何が違う？",
    "source": {
      "title": "研削とは",
      "url": "https://www.weblio.jp/content/研削",
      "publisher": "Weblio",
      "date": null
    }
  },
  {
    "id": "term-032",
    "kind": "term",
    "title": "平面研削と円筒研削",
    "summary": "平面研削は板などの平らな面、円筒研削は丸い部品の外側を削る。円筒研削は軸の中心穴を支えて回し、速くはないが高い精度が出る。",
    "industries": [
      "研削"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "平面研削・円筒研削の頼み分け",
    "source": {
      "title": "平面研削盤 実習資料",
      "url": "https://www.eng.niigata-u.ac.jp/~tmfact001/01/hiraken01.PDF",
      "publisher": "新潟大学",
      "date": null
    }
  },
  {
    "id": "question-082",
    "kind": "question",
    "title": "研削でどこまで精度が出る？",
    "summary": "加工会社の実績例では外径公差±0.001mm、真円度0.001mm以下などが挙がる。各社の実績値なので、形と材料を伝えて確かめるよう書く。",
    "industries": [
      "研削"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "研削でミクロンが出る部品・出ない部品",
    "source": {
      "title": "精密研削加工 カテゴリ",
      "url": "https://mono.ipros.com/cg3/精密研削加工",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-083",
    "kind": "question",
    "title": "研削を頼むとき何を伝える？",
    "summary": "寸法公差に加え、平行度・直角度・真円度・同軸度などの幾何公差と面粗さを図面に書くと、可否と見積が早い。測り方も確認するとよい。",
    "industries": [
      "研削"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "研削の見積依頼に書くことリスト",
    "source": {
      "title": "平面研削加工 カテゴリ",
      "url": "https://mono.ipros.com/cg3/平面研削/加工",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-048",
    "kind": "buyer",
    "title": "研削は大きさと方式で探す",
    "summary": "大型プレートや長尺物が得意、両端面を同時に削り平行度を保証、など研削会社は大きさと方式で強みを分ける。買い手は機械の大きさで絞る。",
    "industries": [
      "研削"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "研削加工 事業紹介",
      "url": "https://pr.mono.ipros.com/maruwakikai/news/detail/175994/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-033",
    "kind": "term",
    "title": "真円度・同軸度",
    "summary": "真円度は丸がどれだけ正しい円か、同軸度は2つの丸の中心がどれだけそろっているか。回る軸部品の研削でよく指定される幾何公差。",
    "industries": [
      "研削",
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "精密研削加工 カテゴリ",
      "url": "https://mono.ipros.com/cg3/精密研削加工",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-034",
    "kind": "term",
    "title": "穴位置度とは",
    "summary": "穴の中心が狙った位置からどれだけずれてよいかを表す幾何公差。組み付けで穴を合わせる部品で使われる。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "meviy 切削加工「穴位置度」の自動見積もり開始",
      "url": "https://netshop.impress.co.jp/r/prtimes/items/000000380.000012100",
      "publisher": "ネットショップ担当者フォーラム（PR TIMES）",
      "date": "2026-10"
    }
  },
  {
    "id": "pain-042",
    "kind": "pain",
    "title": "見積が社長や熟練者に頼りきり",
    "summary": "図面を読み材料費と工数を積み、過去の似た案件を思い出して金額を出す作業は人に頼りがち。担当で金額がぶれ、引き継ぎも難しい。",
    "industries": [
      "切削加工",
      "金属加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "見積を属人化させない町工場の工夫",
    "source": {
      "title": "製造業の見積業務の課題とAI活用",
      "url": "https://www.aspicjapan.org/asu/article/19330",
      "publisher": "ASPIC",
      "date": null
    }
  },
  {
    "id": "pain-043",
    "kind": "pain",
    "title": "図面ごとの手計算で見積が遅い",
    "summary": "図面1枚ごとに手で計算するため見積に時間がかかり、返事が遅れる。返信の早さは発注者に見られている点とあわせて書ける。",
    "industries": [
      "切削加工",
      "金属加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業の見積業務の課題とAI活用",
      "url": "https://www.aspicjapan.org/asu/article/19330",
      "publisher": "ASPIC",
      "date": null
    }
  },
  {
    "id": "trend-047",
    "kind": "trend",
    "official": false,
    "title": "図面から見積案を出すAI",
    "summary": "過去の実績からAIが材料費・加工費の見積案を出し、人が根拠を見て直す仕組みが展示会で提案された(2026年)。直した内容を学んで精度が上がる。",
    "industries": [
      "切削加工",
      "金属加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "AI見積、最後に決めるのは人",
    "source": {
      "title": "AIと人が協働する新しい見積業務のカタチを提案 ものづくりワールド[東京]2026出展",
      "url": "https://prtimes.jp/main/html/rd/p/000000030.000057137.html",
      "publisher": "PR TIMES",
      "date": "2026"
    }
  },
  {
    "id": "trend-048",
    "kind": "trend",
    "official": false,
    "title": "類似図面検索で過去の見積を探す",
    "summary": "形・寸法・文字をAIで読み、似た図面を順に並べる類似図面検索が広がる。テクノアの製品は1万枚以下・2人までで初期100万円、月3万円(2022年)。",
    "industries": [
      "切削加工",
      "金属加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "テクノア、AI類似図面検索を発売",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2209/01/news039.html",
      "publisher": "MONOist",
      "date": "2022-09"
    }
  },
  {
    "id": "question-084",
    "kind": "question",
    "title": "AI見積ツールはどう選ぶ？",
    "summary": "サービスごとに想定する図面の種類が違うので、自社の図面と合うかを確かめることが勧められる。効果の数字の多くは提供会社の発表なので試用が安全。",
    "industries": [
      "切削加工",
      "金属加工"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "AI見積ツールを試す前のチェック",
    "source": {
      "title": "金属加工職人向けAI見積もりツールの比較 2026",
      "url": "https://atsoho.com/blog/metalworker-ai-quotation-tool-comparison",
      "publisher": "atsoho",
      "date": "2026"
    }
  },
  {
    "id": "trend-049",
    "kind": "trend",
    "official": false,
    "title": "図面を読み約10秒で見積",
    "summary": "材質や大きさを入れ図面を読み込むと約10秒で見積を作るシステムが報じられた(ニュースイッチ)。見積の速さが受注の差になりつつある。",
    "industries": [
      "切削加工",
      "金属加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "図面を読み込み約10秒で見積を作るシステム",
      "url": "https://newswitch.jp/p/28177",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "question-085",
    "kind": "question",
    "title": "類似図面検索は丸物にも使える？",
    "summary": "製品によっては板金や溶接品など丸物(切削)以外も登録できるが、見積額の計算はしないものもある。検索と見積が一体かは製品ごとに確認。",
    "industries": [
      "切削加工",
      "金属加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "類似図面検索システムの記事",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2204/19/news022.html",
      "publisher": "MONOist",
      "date": "2022-04"
    }
  },
  {
    "id": "trend-050",
    "kind": "trend",
    "official": true,
    "title": "工作機械の内需は横ばい",
    "summary": "日本工作機械工業会の2026年2月分では内需371億円で前年比10.1%増だが、外需に比べ力強さに欠け、中小が発注の時期を見計らう様子とした。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "工作機械受注統計 2026年2月分 まとめ",
      "url": "https://www.jmtba.or.jp/member/wp-content/uploads/2026/03/matome202602.pdf",
      "publisher": "日本工作機械工業会",
      "date": "2026-03"
    }
  },
  {
    "id": "trend-051",
    "kind": "trend",
    "official": true,
    "title": "工作機械受注は海外がけん引",
    "summary": "日本工作機械工業会の2026年4月分では受注総額が前年比45.1%増。北米とアジアの需要が強く、日本はやや出遅れ感があるとされた。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "工作機械受注統計 2026年4月分 まとめ",
      "url": "https://www.jmtba.or.jp/member/wp-content/uploads/2026/05/matome202604.pdf",
      "publisher": "日本工作機械工業会",
      "date": "2026-05"
    }
  },
  {
    "id": "trend-052",
    "kind": "trend",
    "official": false,
    "title": "9月の工作機械受注は2232億円",
    "summary": "第一生命経済研究所のレポート(2026年10月)は、9月の工作機械受注額を2,232億円と紹介している。設備投資の空気をつかむ材料になる。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "工作機械受注に関するマクロレポート",
      "url": "https://www.dlri.co.jp/files/macro/666459.pdf",
      "publisher": "第一生命経済研究所",
      "date": "2026-10"
    }
  },
  {
    "id": "trend-053",
    "kind": "trend",
    "official": false,
    "title": "meviyが削り残り形状にも対応",
    "summary": "ミスミのmeviyは2026年10月、削り残りが出る形でも設計を変えずに切削部品を注文できるようにした。3D画面で仕上がりを確かめられる。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "meviy 切削加工 削り残りが発生する形状もそのまま注文可能に",
      "url": "https://netshop.impress.co.jp/r/prtimes/items/000000378.000012100",
      "publisher": "ネットショップ担当者フォーラム（PR TIMES）",
      "date": "2026-10"
    }
  },
  {
    "id": "trend-054",
    "kind": "trend",
    "official": false,
    "title": "穴位置度も自動で見積",
    "summary": "meviyは2026年10月、穴位置の精度が要る切削部品でも価格と納期をその場で確認して発注できるようにした。即答の見積が当たり前になりつつある。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "meviy 切削加工「穴位置度」の自動見積もり開始",
      "url": "https://netshop.impress.co.jp/r/prtimes/items/000000380.000012100",
      "publisher": "ネットショップ担当者フォーラム（PR TIMES）",
      "date": "2026-10"
    }
  },
  {
    "id": "buyer-049",
    "kind": "buyer",
    "title": "設計者は見積待ちを減らしたい",
    "summary": "meviyの切削プレートは提供開始時(2019年)、見積から調達までの時間を従来比80%減らせるとうたった。返事の早さは選ばれる理由になる。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "見積回答を早くする町工場の工夫",
    "source": {
      "title": "ミスミ meviy 切削プレートの提供開始",
      "url": "https://monoist.itmedia.co.jp/mn/spv/1904/10/news005.html",
      "publisher": "MONOist",
      "date": "2019-04"
    }
  },
  {
    "id": "pain-044",
    "kind": "pain",
    "title": "高精度・低コスト・短納期を同時に",
    "summary": "中小企業庁の切削加工の高度化指針は、発注側の共通ニーズとして高精度化・低コスト化・短納期化を挙げる。三つを同時に求められるのが現場の悩み。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "切削加工に係る技術に関する高度化指針",
      "url": "https://www.chusho.meti.go.jp/keiei/sapoin/2012/download/shishin_image/i14.pdf",
      "publisher": "中小企業庁",
      "date": "2012"
    }
  },
  {
    "id": "success-036",
    "kind": "success",
    "title": "「外注するメリット」をコラムに",
    "summary": "切削加工の難しさと、外注するとどう楽になるかを技術コラムで解説する加工会社がある。発注をためらう読者の背中を押す記事になる。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "切削加工を外注するメリットを書く",
    "source": {
      "title": "加工技術コラム（切削加工の外注メリット）",
      "url": "https://www.ipros.com/product/detail/2000474760",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "pain-045",
    "kind": "pain",
    "title": "熟練工を待てず機械に投資",
    "summary": "熟練工が育つのを待てないため、高価な加工機を入れて仕事を守る町工場があると北海道新聞が報じた。人手不足が設備投資の動機になっている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "町工場が高価な加工機を導入（札幌）",
      "url": "https://www.hokkaido-np.co.jp/article/1313153/",
      "publisher": "北海道新聞",
      "date": null
    }
  },
  {
    "id": "success-037",
    "kind": "success",
    "title": "複合加工機を設備紹介の柱に",
    "summary": "佐賀県の企業紹介資料では、切削会社が門型・立型マシニングと複合加工機を並べて紹介している。設備の組合せで「一貫でできる」と伝わる。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "佐賀県 企業紹介資料",
      "url": "https://www.pref.saga.lg.jp/kiji00386213/3_86213_244309_up_b2ks0b7n.pdf",
      "publisher": "佐賀県",
      "date": null
    }
  },
  {
    "id": "term-035",
    "kind": "term",
    "title": "CAMと加工機の制約",
    "summary": "CAMは削る道筋を作るソフト。工具の届く範囲や丸みなど機械の制約を設計者が知ると、作れない形を減らせるとMONOistの記事は説く。",
    "industries": [
      "切削加工",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "メカ設計者も金型加工機の制約を理解しよう",
      "url": "https://monoist.itmedia.co.jp/mn/articles/0709/07/news151_2.html",
      "publisher": "MONOist",
      "date": "2007-09"
    }
  },
  {
    "id": "question-086",
    "kind": "question",
    "title": "展開図も付けて頼むべき？",
    "summary": "完成形の図だけだと加工側が展開を計算し直すので、思った寸法とずれやすい。板厚・材質・曲げの向きと角度・内R・表面処理まで書くと話が早い、という解説がある。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "板金図面に最低限書いてほしい6項目",
    "source": {
      "title": "板金図面の書き方 完全ガイド（展開図・曲げ指示・加工限界）",
      "url": "https://renue.co.jp/posts/sheet-metal-drawing-development-bending-guide-2026",
      "publisher": "RENUE",
      "date": "2026"
    }
  },
  {
    "id": "term-036",
    "kind": "term",
    "title": "展開図（てんかいず）",
    "summary": "曲げる前の平らな板の形。板金工場はこれを元に切断や穴あけのNCプログラムを作るので、全ての工程の出発点になる。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "展開図ってなに？板金の最初の一歩",
    "source": {
      "title": "板金設計の展開図とNCプログラム",
      "url": "https://monoist.itmedia.co.jp/mn/spv/1911/20/news015.html",
      "publisher": "MONOist",
      "date": "2019-11"
    }
  },
  {
    "id": "term-037",
    "kind": "term",
    "title": "中立面と伸び（展開長）",
    "summary": "曲げると内側は縮み外側は伸びるため、展開長は外寸の足し算では合わない。伸び縮みしない中立面を基準に計算する。工場ごとに伸び値の持ち方が違う。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "展開寸法が外寸の合計にならない理由",
    "source": {
      "title": "板金図面の書き方 完全ガイド（展開図・曲げ指示・加工限界）",
      "url": "https://renue.co.jp/posts/sheet-metal-drawing-development-bending-guide-2026",
      "publisher": "RENUE",
      "date": "2026"
    }
  },
  {
    "id": "question-087",
    "kind": "question",
    "title": "曲げの内Rはいくつにすれば？",
    "summary": "内Rは板厚以上を目安にする設計条件の例がある。小さすぎると割れや寸法のばらつきの元になるので、迷ったら工場の標準Rを聞いて合わせると安い。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "曲げRは工場の標準に合わせると安くなる",
    "source": {
      "title": "板金部品の設計演習（制約条件）",
      "url": "https://www.fml.t.u-tokyo.ac.jp/multiphysics/prob/P3-8.pdf",
      "publisher": "東京大学",
      "date": null
    }
  },
  {
    "id": "question-088",
    "kind": "question",
    "title": "外寸と内寸、どちらで寸法を書く？",
    "summary": "曲げ品は寸法を外側基準か内側基準かで数値が変わる。図面にどちらか明記しないと、板厚分ずれたまま作られることがある。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "articleIdea": "板金の寸法は外寸？内寸？図面の決め方",
    "source": {
      "title": "板金図面の書き方 完全ガイド（展開図・曲げ指示・加工限界）",
      "url": "https://renue.co.jp/posts/sheet-metal-drawing-development-bending-guide-2026",
      "publisher": "RENUE",
      "date": "2026"
    }
  },
  {
    "id": "pain-046",
    "kind": "pain",
    "title": "展開してみたら作れない形",
    "summary": "CADで展開すると板が重なる・金型が入らない形状が、図面の段階では気づかれずに届くことがある。加工前に展開して確かめる手間が作り手側に乗る。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "作れない図面を受け取ったときの返し方",
    "source": {
      "title": "板金図面の書き方 完全ガイド（展開図・曲げ指示・加工限界）",
      "url": "https://renue.co.jp/posts/sheet-metal-drawing-development-bending-guide-2026",
      "publisher": "RENUE",
      "date": "2026"
    }
  },
  {
    "id": "question-089",
    "kind": "question",
    "title": "フランジは短くできる？",
    "summary": "曲げられるフランジの長さには金型（V幅）からくる下限がある。実寸と金型の許容寸法を比べて可否を決めるため、短すぎる立ち上がりは形を変える相談になる。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "曲げられないフランジの長さと対策",
    "source": {
      "title": "板金図面の書き方 完全ガイド（展開図・曲げ指示・加工限界）",
      "url": "https://renue.co.jp/posts/sheet-metal-drawing-development-bending-guide-2026",
      "publisher": "RENUE",
      "date": "2026"
    }
  },
  {
    "id": "question-090",
    "kind": "question",
    "title": "「バリなし」と書けば大丈夫？",
    "summary": "バリ（かえり）とダレは切断面の向きで出る面が決まる。「バリなし」の一言より、どの面にダレを出すかやバリ取りの要否を書く方が確実だと解説されている。",
    "industries": [
      "板金",
      "プレス"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "articleIdea": "図面の『バリなし』が伝わらない理由",
    "source": {
      "title": "板金図面の抜きダレ方向の指示",
      "url": "https://monoist.itmedia.co.jp/mn/spv/0806/18/news139.html",
      "publisher": "MONOist",
      "date": "2008-06"
    }
  },
  {
    "id": "term-038",
    "kind": "term",
    "title": "ダレとかえり（バリ）",
    "summary": "抜いた板の切り口で、刃が入った側は丸く垂れ（ダレ）、抜けた側にとがった出っ張り（かえり）が出る。手が触れる面にかえりを向けないのが安全の基本。",
    "industries": [
      "板金",
      "プレス"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ケガしない板金部品はダレの向きで決まる",
    "source": {
      "title": "板金図面の抜きダレ方向の指示",
      "url": "https://monoist.itmedia.co.jp/mn/spv/0806/18/news139.html",
      "publisher": "MONOist",
      "date": "2008-06"
    }
  },
  {
    "id": "term-039",
    "kind": "term",
    "title": "バリ取り",
    "summary": "切断後の端部を削ってかえりを除く工程。レーザーやタレパンで切った後の一般的な工程で、手作業が多いと費用や納期に効く。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "バリ取りは別料金？工程から見る見積り",
    "source": {
      "title": "板金加工の基礎",
      "url": "https://cad-kenkyujo.com/bankin/",
      "publisher": "CAD研究所",
      "date": null
    }
  },
  {
    "id": "question-091",
    "kind": "question",
    "title": "SPCCとSECC、どちらを選ぶ？",
    "summary": "SPCCは冷間圧延の普通鋼板で加工しやすいが錆びるので塗装やめっき前提。SECCはSPCCに薄い電気亜鉛めっきをした板で、塗装しやすく後処理なしの筐体に使われる。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "SPCC・SECC・SGCC、筐体はどれ？",
    "source": {
      "title": "The Difference Between SECC and SGCC",
      "url": "https://de.meviy.misumi-ec.com/info/en/?p=25947",
      "publisher": "ミスミ meviy",
      "date": null
    }
  },
  {
    "id": "term-040",
    "kind": "term",
    "title": "SECCとSGCCの違い",
    "summary": "どちらも亜鉛めっき鋼板。SECCは電気めっきで皮膜が薄く見た目と塗装性がよい。SGCCは溶融めっきで皮膜が厚く錆に強いが、溶接はしにくい。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "屋外ならSGCC？めっき鋼板の選び方",
    "source": {
      "title": "The Difference Between SECC and SGCC",
      "url": "https://de.meviy.misumi-ec.com/info/en/?p=25947",
      "publisher": "ミスミ meviy",
      "date": null
    }
  },
  {
    "id": "question-092",
    "kind": "question",
    "title": "SECCは溶接しても平気？",
    "summary": "めっき鋼板は溶接で亜鉛が焼け、防錆が落ちたりしやすい。溶接が多い・屋外で使うなら、材料と後処理を最初に工場と決めておくとよい。",
    "industries": [
      "板金",
      "溶接"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "articleIdea": "めっき鋼板を溶接するときの注意",
    "source": {
      "title": "The Difference Between SECC and SGCC",
      "url": "https://de.meviy.misumi-ec.com/info/en/?p=25947",
      "publisher": "ミスミ meviy",
      "date": null
    }
  },
  {
    "id": "question-093",
    "kind": "question",
    "title": "板金の見積りは何で決まる？",
    "summary": "材料費・加工費・ロット倍率・型費を一つずつ足す。加工費は工程数と展開寸法の大きさで目安を出す方法がMONOistの連載で紹介されている。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "板金見積りの内訳を工場側から公開する",
    "source": {
      "title": "超カンタン! 板金部品の設計見積もりをしてみようぜぃ",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1209/12/news010_3.html",
      "publisher": "MONOist",
      "date": "2012-09"
    }
  },
  {
    "id": "question-094",
    "kind": "question",
    "title": "ロットが増えると何割安い？",
    "summary": "MONOistの連載の例では、ロット1000個を基準にすると1万個のロット倍率は約0.81で、加工費が約2割下がる計算になっている。",
    "industries": [
      "板金",
      "プレス"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "数量で単価が変わる仕組みを図で説明",
    "source": {
      "title": "超カンタン! 板金部品の設計見積もりをしてみようぜぃ",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1209/12/news010_3.html",
      "publisher": "MONOist",
      "date": "2012-09"
    }
  },
  {
    "id": "term-041",
    "kind": "term",
    "title": "ロット倍率",
    "summary": "生産数による加工費の掛け率。少ないほど段取りの割合が増えて1個あたりが高くなる。見積りで「数量を変えると単価が変わる」理由の正体。",
    "industries": [
      "板金",
      "プレス"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ロット倍率とは？小ロットが高い理由",
    "source": {
      "title": "超カンタン! 板金部品の設計見積もりをしてみようぜぃ",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1209/12/news010_3.html",
      "publisher": "MONOist",
      "date": "2012-09"
    }
  },
  {
    "id": "question-095",
    "kind": "question",
    "title": "型費は1個いくらに乗る？",
    "summary": "型費は総額を生産数で割って1個あたりに乗せる。連載の例では総型費23万円を1万台で割り、1台23円としている。数量見込みを伝えると比べやすい。",
    "industries": [
      "プレス"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "金型費を1個あたりに直す計算",
    "source": {
      "title": "超カンタン! 板金部品の設計見積もりをしてみようぜぃ",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1209/12/news010_3.html",
      "publisher": "MONOist",
      "date": "2012-09"
    }
  },
  {
    "id": "question-096",
    "kind": "question",
    "title": "切削部品を板金に替えると安い？",
    "summary": "強度や精度が要らない部分なら、削り出しブロックを曲げ板金に替えて工数を減らす事例がある。精度が要る所だけ切削で出し、残りを板金にする組み方もある。",
    "industries": [
      "板金",
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "削り出しを板金に替えたVA事例",
    "source": {
      "title": "板金部品化検討で工数削減&コストダウン（VA・VE）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/0807/25/news138_2.html",
      "publisher": "MONOist",
      "date": "2008-07"
    }
  },
  {
    "id": "term-042",
    "kind": "term",
    "title": "VA/VE（板金化）",
    "summary": "機能を落とさずに作り方を変えて原価を下げる考え方。板金では、形を少し変えて工程や型を減らす提案が多い。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "設計者が喜ぶ板金化の提案",
    "source": {
      "title": "板金部品化検討で工数削減&コストダウン（VA・VE）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/0807/25/news138_2.html",
      "publisher": "MONOist",
      "date": "2008-07"
    }
  },
  {
    "id": "question-097",
    "kind": "question",
    "title": "樹脂・板金・切削で安いのは？",
    "summary": "一般的には樹脂→板金→金属（削り出し）の順にコストが上がると整理されている。ただ樹脂は金型代が先にかかるので、数量で順番は変わる。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "同じ形を樹脂・板金・切削で作ると",
    "source": {
      "title": "「コスト」を考える上で絶対に欠かせない6つの視点",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2107/21/news004_3.html",
      "publisher": "MONOist",
      "date": "2021-07"
    }
  },
  {
    "id": "buyer-050",
    "kind": "buyer",
    "title": "まず相場を知る相見積り",
    "summary": "単品〜小ロットの板金は相場が見えにくく、相場を知るために複数社へ見積りを取る流れが紹介されている。単価の内訳を示す工場は比べやすい。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "相見積りで比べられても選ばれる見積書",
    "source": {
      "title": "板金部品の設計見積もり（2ページ）",
      "url": "https://monoist.itmedia.co.jp/mn/spv/1209/12/news010_2.html",
      "publisher": "MONOist",
      "date": "2012-09"
    }
  },
  {
    "id": "pain-047",
    "kind": "pain",
    "title": "工程が増えるほど見積りが上がる",
    "summary": "板金の基準加工費は工程数に比例して上がる。曲げ回数・溶接・タップ・仕上げが重なる図面は、形の工夫で減らせる場合でも、そのまま高い見積りになりがち。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "曲げを1回減らすと見積りはどう変わる",
    "source": {
      "title": "超カンタン! 板金部品の設計見積もりをしてみようぜぃ",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1209/12/news010_3.html",
      "publisher": "MONOist",
      "date": "2012-09"
    }
  },
  {
    "id": "term-043",
    "kind": "term",
    "title": "タレットパンチプレス（タレパン）",
    "summary": "多数のパンチ金型を円盤に並べ、穴や切り欠きを打ち抜く機械。少量なら専用金型を作らずに済み、ルーバーなどの成形やタップも打てる機種がある。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "タレパンで何ができる？",
    "source": {
      "title": "ファイバーレーザーパンチプレス複合機の発表",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2207/12/news053.html",
      "publisher": "MONOist",
      "date": "2022-07"
    }
  },
  {
    "id": "trend-055",
    "kind": "trend",
    "official": false,
    "title": "レーザーとパンチの複合機",
    "summary": "タレパンにファイバーレーザー切断を載せ、穴あけ・成形・タップ・外形切断を1台でこなす機種が出ている。載せ替えが減り、工程集約と品質向上をうたう。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "複合機で工程を1つにまとめると",
    "source": {
      "title": "ファイバーレーザーパンチプレス複合機の発表",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2207/12/news053.html",
      "publisher": "MONOist",
      "date": "2022-07"
    }
  },
  {
    "id": "trend-056",
    "kind": "trend",
    "official": false,
    "title": "アルミ・銅もレーザーで切れる",
    "summary": "光を反射しやすいアルミ・銅・真鍮は従来のレーザーで切りにくかったが、ファイバーレーザー機の登場で安定して切れるようになったと発表されている。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "アルミや銅の板もレーザーで切れる？",
    "source": {
      "title": "新型ファイバーレーザー加工機、高反射材も安定加工",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1510/26/news031.html",
      "publisher": "MONOist",
      "date": "2015-10"
    }
  },
  {
    "id": "term-044",
    "kind": "term",
    "title": "アシストガス",
    "summary": "レーザー切断で吹き付けるガス。材料や目的で選び、仕上がりやコストが変わる。切り口の色や酸化膜が気になるなら、どのガスで切るか聞いてみるとよい。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "レーザー切断の切り口の色はなぜ違う",
    "source": {
      "title": "新型ファイバーレーザー加工機、高反射材も安定加工",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1510/26/news031.html",
      "publisher": "MONOist",
      "date": "2015-10"
    }
  },
  {
    "id": "success-038",
    "kind": "success",
    "title": "「少量から」「アルミ可」を明記",
    "summary": "ポータルの製品ページで、少量多品種の受託とアルミのレーザー加工対応を見出しに出す加工会社がある。対応範囲を最初に言い切ると探す人が判断しやすい。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "自社ページの見出しに対応範囲を書く",
    "source": {
      "title": "少量多品種の製造・加工委託、アルミ材のレーザー加工も可能",
      "url": "https://mono.ipros.com/product/detail/2000247151",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-045",
    "kind": "term",
    "title": "JIS B 0408（プレス品の普通許容差）",
    "summary": "板金をプレス加工した部品の一般寸法公差の規格。打抜き・曲げ・絞りの部品が対象で、せん断だけの部品は含まない。1991年制定、2015年に再確認とされる。",
    "industries": [
      "板金",
      "プレス"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "板金の普通公差はJIS B 0408",
    "source": {
      "title": "JIS B 0408:1991",
      "url": "https://webstore.ansi.org/standards/jis/jis04081991",
      "publisher": "ANSI Webstore",
      "date": null
    }
  },
  {
    "id": "question-098",
    "kind": "question",
    "title": "板金の曲げ寸法はどこまで合う？",
    "summary": "ミスミの資料はJIS B 0408のB級を採用し、曲げ品は6mm以下±0.3、30mm以下±0.5、120mm以下±0.8、400mm以下±1.2としている。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "曲げ寸法の公差、目安の一覧",
    "source": {
      "title": "取付板 技術資料（板金の普通許容差）",
      "url": "https://vn.misumi-ec.com/pdf/fa/2012/p2_1719.pdf",
      "publisher": "ミスミ",
      "date": "2012"
    }
  },
  {
    "id": "question-099",
    "kind": "question",
    "title": "曲げをまたぐ穴の位置は保証される？",
    "summary": "普通許容差は同じ面上の穴間などに使い、複数の曲げをまたぐ穴と穴の寸法には当てはまらないと説明されている。大事な穴は1つの面にまとめるか、公差を個別に書く。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "articleIdea": "曲げをまたいだ穴位置がずれる理由",
    "source": {
      "title": "取付板 技術資料（板金の普通許容差）",
      "url": "https://vn.misumi-ec.com/pdf/fa/2012/p2_1719.pdf",
      "publisher": "ミスミ",
      "date": "2012"
    }
  },
  {
    "id": "pain-048",
    "kind": "pain",
    "title": "公差等級の扱いが会社で違う",
    "summary": "同じミスミでも、取付板の資料はB級、meviyは板厚6mm超やR曲げはC級と、等級の扱いが異なる。取引先ごとに何級を前提にしているか確認が要る。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "普通公差は何級？取引先と決めておく",
    "source": {
      "title": "meviy ヘルプ：板金の公差等級",
      "url": "https://de.meviy.misumi-ec.com/help/en/?p=9705",
      "publisher": "ミスミ meviy",
      "date": null
    }
  },
  {
    "id": "trend-057",
    "kind": "trend",
    "official": false,
    "title": "3Dを上げると即見積りの板金",
    "summary": "ミスミのmeviyは3D CADデータを上げると即時見積りし、板金部品を最短1日で出荷するサービスとして2019年に打ち出された。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "即時見積りサービスと町工場の違い",
    "source": {
      "title": "meviy 板金部品の出荷納期を最短1日に短縮",
      "url": "https://kyodonewsprwire.jp/release/201907319310",
      "publisher": "共同通信PRワイヤー",
      "date": "2019-07"
    }
  },
  {
    "id": "trend-058",
    "kind": "trend",
    "official": false,
    "title": "オンライン板金は厚板まで",
    "summary": "meviyは2021年8月、FA板金部品の板厚を最大16mmまで広げ、フレームや装置の土台向けにも対応した。",
    "industries": [
      "板金",
      "製缶"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "meviy、FA板金部品の板厚を最大16mmに拡大",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2108/05/news017.html",
      "publisher": "MONOist",
      "date": "2021-08"
    }
  },
  {
    "id": "trend-059",
    "kind": "trend",
    "official": false,
    "title": "オンライン板金は薄板シムも",
    "summary": "2020年1月、meviyは0.05〜1.0mmの薄い板（SPCCとSUS304）を追加し、シムプレート向けに対応した。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "meviy 板金部品の板厚バリエーション拡大",
      "url": "https://kyodonewsprwire.jp/release/202001085516",
      "publisher": "共同通信PRワイヤー",
      "date": "2020-01"
    }
  },
  {
    "id": "trend-060",
    "kind": "trend",
    "official": false,
    "title": "めっき・塗装品も短納期に",
    "summary": "meviyは2022年1月、めっき・塗装品やR曲げ部品なども含め、全ての部品形状で短納期を選べるようにしたと発表した。",
    "industries": [
      "板金",
      "表面処理"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "meviy 全形状で短納期を選択可能に",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2201/28/news019.html",
      "publisher": "MONOist",
      "date": "2022-01"
    }
  },
  {
    "id": "trend-061",
    "kind": "trend",
    "official": false,
    "title": "溶接付き板金もネット見積り",
    "summary": "2023年11月、meviyは板金と溶接をまとめて頼めるサービスを始めた。AIが溶接箇所を判定し、溶接の種類と仕上げを選ぶと即時に見積りが出る。",
    "industries": [
      "板金",
      "溶接"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "ネット即見積りと相談型工場の使い分け",
    "source": {
      "title": "meviy 板金溶接加工サービス開始",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2311/22/news014.html",
      "publisher": "MONOist",
      "date": "2023-11"
    }
  },
  {
    "id": "buyer-051",
    "kind": "buyer",
    "title": "定番部品はネット、相談はWeb検索",
    "summary": "設計者は定型の板金部品をオンライン調達で即見積りする手段を持つ。町工場は、ネットで値段が出ない難形状・大物・相談型の仕事を前に出すと比べられにくい。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "ネットで見積れない仕事こそ載せる",
    "source": {
      "title": "meviy 板金溶接加工サービス開始",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2311/22/news014.html",
      "publisher": "MONOist",
      "date": "2023-11"
    }
  },
  {
    "id": "term-046",
    "kind": "term",
    "title": "単発型と順送型",
    "summary": "単発型は1回のプレスで1工程。順送型はコイル材を送りながら複数工程を1つの型で続けて加工し量産向き。形状と数量で使い分けると解説されている。",
    "industries": [
      "プレス",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "単発型・順送型・トランスファーの違い",
    "source": {
      "title": "「抜き型」とその加工技術（設計者のための部品加工技術の世界）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1912/24/news007.html",
      "publisher": "MONOist",
      "date": "2019-12"
    }
  },
  {
    "id": "term-047",
    "kind": "term",
    "title": "トランスファー型",
    "summary": "単発型を並べ、フィンガーで部品を工程間に移しながら加工する方式。工程を増やせて絞りなど複雑な形に向くが、搬送の設計が難しく金型代は高めになる。",
    "industries": [
      "プレス",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "トランスファー加工が向く部品",
    "source": {
      "title": "トランスファー金型の特徴（加工会社のコラム）",
      "url": "https://mono.ipros.com/product/detail/2000394483",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-100",
    "kind": "question",
    "title": "順送とトランスファー、どちら？",
    "summary": "どちらも量産向けだが、材料歩留まりや加工速度にそれぞれ課題がある。製品形状と生産量で精密順送・トランスファー・冷間鍛造などから選ぶ考え方が示されている。",
    "industries": [
      "プレス"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "量産プレスの工法はこう選ぶ",
    "source": {
      "title": "トランスファー金型の特徴（加工会社のコラム）",
      "url": "https://mono.ipros.com/product/detail/2000394483",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-048",
    "kind": "term",
    "title": "深絞り（ふかしぼり）",
    "summary": "平板を型で押し込み、継ぎ目のないカップや筒にする加工。変形が大きく、割れやしわが出やすいので、工程数や金型・条件決めに経験が要る。",
    "industries": [
      "プレス"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "深絞りで作れる形・作れない形",
    "source": {
      "title": "深絞り加工に関する研究成果報告",
      "url": "https://www.aichisr.jp/content/files/seikahoukoku/2020/2020P0108.pdf",
      "publisher": "あいちシンクロトロン光センター",
      "date": "2020"
    }
  },
  {
    "id": "term-049",
    "kind": "term",
    "title": "絞り比",
    "summary": "素板の直径を成形後の容器の直径で割った値。大きいほど側壁が割れやすい。1回で無理なら工程を分けて何回かで絞る。",
    "industries": [
      "プレス"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "深い容器ほど工程が増える理由",
    "source": {
      "title": "深絞りの絞り比と割れの研究ポスター",
      "url": "https://web.tuat.ac.jp/~kuwabara/about/poster/2012/Tanaka.pdf",
      "publisher": "東京農工大学",
      "date": "2012"
    }
  },
  {
    "id": "term-050",
    "kind": "term",
    "title": "しわ（深絞りの不良）",
    "summary": "側壁やフランジで板が押し縮められて波打つ不良。しわ押さえの力など型と条件で抑える。",
    "industries": [
      "プレス"
    ],
    "useFor": [
      "article_idea"
    ],
    "source": {
      "title": "深絞りのしわに関する研究概要",
      "url": "https://ars.eng.shizuoka.ac.jp/~plasticity/yoshida/pdf_alumni/2018ishikawa.pdf",
      "publisher": "静岡大学",
      "date": "2018"
    }
  },
  {
    "id": "question-101",
    "kind": "question",
    "title": "深絞りの試作はなぜ時間がかかる？",
    "summary": "しわ・割れを避けるために絞り工程数や金型・条件を探るため、試作や調整に時間と費用がかかりやすいと報告されている。許せるしわ・割れの基準を先に共有するとよい。",
    "industries": [
      "プレス"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "深絞り試作の期間と費用の内訳",
    "source": {
      "title": "深絞り加工に関する研究成果報告",
      "url": "https://www.aichisr.jp/content/files/seikahoukoku/2020/2020P0108.pdf",
      "publisher": "あいちシンクロトロン光センター",
      "date": "2020"
    }
  },
  {
    "id": "buyer-052",
    "kind": "buyer",
    "title": "工法名でポータルを探す",
    "summary": "イプロスには「深絞り加工サービス」のような工法別カテゴリがあり、発注者は工法名で受託先を一覧から探せる。自社ページの工法名をそろえておくと見つかりやすい。",
    "industries": [
      "プレス"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "工法名を正しく書くと見つかる",
    "source": {
      "title": "深絞り加工サービス（カテゴリ）",
      "url": "https://mono.ipros.com/cg2/深絞り加工サービス",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-051",
    "kind": "term",
    "title": "クリアランス（パンチとダイの隙間）",
    "summary": "抜き型のパンチとダイの隙間。切り口のダレ・せん断面・かえりの量を左右する。材質・板厚・硬さに合わせて選ぶ。",
    "industries": [
      "プレス",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "切り口がきれいな部品は隙間で決まる",
    "source": {
      "title": "打抜き加工のクリアランスと切口面",
      "url": "https://www.gitec.rd.pref.gifu.lg.jp/files/reports/2014/metal_2014_08.pdf",
      "publisher": "岐阜県工業技術研究所",
      "date": "2014"
    }
  },
  {
    "id": "term-052",
    "kind": "term",
    "title": "せん断面と破断面",
    "summary": "抜いた切り口のうち、刃でなめらかに切れた光る部分がせん断面、ちぎれてザラつく部分が破断面。精度が要る部品はせん断面を長くしたい。",
    "industries": [
      "プレス"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "切り口の光る部分とザラつく部分",
    "source": {
      "title": "精密せん断の技術（企業紹介）",
      "url": "https://j-net21.smrj.go.jp/special/webmagazine/enterprise/20190314.html",
      "publisher": "J-Net21（中小機構）",
      "date": "2019-03"
    }
  },
  {
    "id": "question-102",
    "kind": "question",
    "title": "クリアランスは小さいほどいい？",
    "summary": "小さいとダレが減り切り口が良くなる報告がある一方、別の報告では隙間を増やすと割れが増え10〜15%で最大とされる。最適値は材料ごとに確かめる。",
    "industries": [
      "プレス"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "せん断端面の割れとクリアランス",
      "url": "https://www.kobelco.co.jp/r-d/technology-review/pdf/73_2/077-082.pdf",
      "publisher": "神戸製鋼所",
      "date": null
    }
  },
  {
    "id": "term-053",
    "kind": "term",
    "title": "シェービング",
    "summary": "打ち抜いた後に切り口をもう一度薄く削り取り、破断面を減らす2工程の方法。切り口の品質が要る精密部品で使う。",
    "industries": [
      "プレス"
    ],
    "useFor": [
      "article_idea"
    ],
    "source": {
      "title": "サポイン成果：プレスシェービング",
      "url": "https://www.chusho.meti.go.jp/keiei/sapoin/portal/seika/2012/24131011042.pdf",
      "publisher": "中小企業庁",
      "date": "2012"
    }
  },
  {
    "id": "pain-049",
    "kind": "pain",
    "title": "調査が重なり回答がつらい",
    "summary": "日本金属プレス工業協会の会員調査（2023年度）は276社中60社の回答で、回答率は21.73%に下がった。似た調査が重なって負担という声も記録されている。",
    "industries": [
      "プレス"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "自主行動計画フォローアップ（日本金属プレス工業協会）",
      "url": "https://www.meti.go.jp/policy/mono_info_service/mono/sokeizai/pdf/document1-08.pdf",
      "publisher": "経済産業省",
      "date": null
    }
  },
  {
    "id": "question-103",
    "kind": "question",
    "title": "TIGとMIG、どちらで頼む？",
    "summary": "TIGは溶けない電極で薄板やステンレス・アルミの精密な溶接向き、ビードがきれい。MIGはワイヤーが溶けて溶着が速く、厚めの材料や効率重視に向くと整理されている。",
    "industries": [
      "溶接"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "TIGとMIG、仕上がりと費用の違い",
    "source": {
      "title": "スポット・MIG・TIG溶接ロボット比較 2026",
      "url": "https://www.evsint.com/ja/spot-vs-mig-vs-tig-welding-robots-2026-process-comparison-selection/",
      "publisher": "EVS",
      "date": "2026"
    }
  },
  {
    "id": "term-054",
    "kind": "term",
    "title": "ステンレスはTIGが基本",
    "summary": "ステンレスは割れや粘り低下を防ぐため純アルゴンのTIGが一般的。MIGは純アルゴンだとアークが不安定で、少し活性ガスを混ぜて使うのが現状とされる。",
    "industries": [
      "溶接"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ステンレス溶接はなぜTIGが多い",
    "source": {
      "title": "ステンレス溶接とハイブリッドワイヤ",
      "url": "https://www.nims.go.jp/wmg/sub1/hybrid_wire_ja.pdf",
      "publisher": "物質・材料研究機構",
      "date": null
    }
  },
  {
    "id": "question-104",
    "kind": "question",
    "title": "溶接の方法は誰が決める？",
    "summary": "溶接方法は機械の都合より、溶接する物の材質・板厚・求める品質で決まるという見方がある。用途と見た目の要求を伝えれば、工場が方法を選べる。",
    "industries": [
      "溶接"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "articleIdea": "溶接方法は図面に書くべき？",
    "source": {
      "title": "スポット・MIG・TIG溶接ロボット比較 2026",
      "url": "https://www.evsint.com/ja/spot-vs-mig-vs-tig-welding-robots-2026-process-comparison-selection/",
      "publisher": "EVS",
      "date": "2026"
    }
  },
  {
    "id": "term-055",
    "kind": "term",
    "title": "スポット溶接",
    "summary": "重ねた板を電極で挟み、電流の熱で点状に溶かしてつなぐ方法。溶けた部分（ナゲット）の径は板厚の平方根の5倍が目標とされる。",
    "industries": [
      "溶接",
      "板金"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "スポット溶接の強さは点の大きさ",
    "source": {
      "title": "スポット溶接とろう付け継ぎ手",
      "url": "https://ims.evidentscientific.com/ja/learn/ndt-tutorials/flaw-detection/spot-welds",
      "publisher": "Evident",
      "date": null
    }
  },
  {
    "id": "question-105",
    "kind": "question",
    "title": "スポットの打点は詰めれば強い？",
    "summary": "板厚1〜2mmで打点の間が20mmを切ると電流が前の点へ逃げ（分流）、溶け込み不足になることがある。打点を増やせば強いとは限らない。",
    "industries": [
      "溶接",
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "スポット溶接のピッチの決め方",
    "source": {
      "title": "スポット溶接加工 基礎編",
      "url": "https://mono.ipros.com/product/detail/288191019",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "trend-062",
    "kind": "trend",
    "official": false,
    "title": "短い間隔のスポット溶接",
    "summary": "Hondaの技術報告では、隣の点へ逃げる電流による熱ロスを見込んで投入エネルギーを増やすと、短い間隔でも溶けた部分の径を保てると検証している。",
    "industries": [
      "溶接"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "短ピッチ抵抗スポット溶接の研究",
      "url": "https://global.honda/jp/technical-review/PDF/025-2/025-2_81.pdf",
      "publisher": "Honda R&D Technical Review",
      "date": null
    }
  },
  {
    "id": "term-056",
    "kind": "term",
    "title": "スポット溶接の主な不良",
    "summary": "よくある不良は、融合不良、小さすぎるナゲット、表面だけくっついた状態など。外から見えにくいので検査方法を決めておく。",
    "industries": [
      "溶接"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "見えない溶接不良をどう確かめる",
    "source": {
      "title": "スポット溶接とろう付け継ぎ手",
      "url": "https://ims.evidentscientific.com/ja/learn/ndt-tutorials/flaw-detection/spot-welds",
      "publisher": "Evident",
      "date": null
    }
  },
  {
    "id": "term-057",
    "kind": "term",
    "title": "溶接記号（矢と基線）",
    "summary": "図面の溶接記号は、溶接する場所を指す矢と、水平な基線でできている。基線の上下どちらに記号を置くかで、矢の側か反対側かを表す。",
    "industries": [
      "溶接",
      "製缶"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "図面の溶接記号の読み方入門",
    "source": {
      "title": "溶接記号の書き方ガイド（すみ肉・突合せ）",
      "url": "https://renue.co.jp/posts/welding-symbols-jis-fillet-butt-drawing-guide-2026",
      "publisher": "RENUE",
      "date": "2026"
    }
  },
  {
    "id": "pain-050",
    "kind": "pain",
    "title": "開先記号の矢の向きが違う",
    "summary": "開先を取る板に矢を折り曲げて指す決まりがあり、矢の向きや指す位置の誤りは図面の不備になりやすいと鉄骨工事の手引きで注意されている。",
    "industries": [
      "溶接",
      "製缶"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "よくある溶接記号の書き間違い",
    "source": {
      "title": "鉄骨工事Q&A 溶接記号",
      "url": "https://nikkenren.com/kenchiku/sekou/steel_frame_Q&A/A-1-7.pdf",
      "publisher": "日本建設業連合会",
      "date": null
    }
  },
  {
    "id": "term-058",
    "kind": "term",
    "title": "開先（かいさき）",
    "summary": "厚い板どうしを突き合わせるとき、奥まで溶かすために端を斜めに削った溝。V型・X型・K型・U型など形ごとに記号がある。",
    "industries": [
      "溶接",
      "製缶"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "開先とは？厚板溶接の下ごしらえ",
    "source": {
      "title": "溶接記号の書き方ガイド（すみ肉・突合せ）",
      "url": "https://renue.co.jp/posts/welding-symbols-jis-fillet-butt-drawing-guide-2026",
      "publisher": "RENUE",
      "date": "2026"
    }
  },
  {
    "id": "question-106",
    "kind": "question",
    "title": "溶接ひずみはどう防ぐ？",
    "summary": "熱を減らす・逃がす（銅やアルミの治具）、溶接の順番で熱を散らす、固定する（拘束）、先に逆へ曲げておく（逆ひずみ）がある。直すのは熟練が要り、起こさない工夫が大事。",
    "industries": [
      "溶接",
      "製缶"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "溶接で曲がる理由と4つの防ぎ方",
    "source": {
      "title": "技術職員研修：溶接と熱ひずみ",
      "url": "https://www.icer.kyushu-u.ac.jp/docs/tecstaff_training/h27/14.pdf",
      "publisher": "九州大学",
      "date": "2015"
    }
  },
  {
    "id": "term-059",
    "kind": "term",
    "title": "逆ひずみ法",
    "summary": "溶接で曲がる向きと量を見込み、先に反対向きへ曲げてから溶接する方法。溶接後にちょうど平らになるよう狙う。",
    "industries": [
      "溶接"
    ],
    "useFor": [
      "article_idea"
    ],
    "source": {
      "title": "技術職員研修：溶接と熱ひずみ",
      "url": "https://www.icer.kyushu-u.ac.jp/docs/tecstaff_training/h27/14.pdf",
      "publisher": "九州大学",
      "date": "2015"
    }
  },
  {
    "id": "trend-063",
    "kind": "trend",
    "official": false,
    "title": "治具を外すタイミングも効く",
    "summary": "自動車技術会の論文（2026年）は、高張力薄鋼板の重ね溶接で、室温まで冷えてから治具を外すことと、拘束する位置の選び方が変形を抑えると数値解析で確かめた。",
    "industries": [
      "溶接",
      "板金"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "高張力薄鋼板の重ね溶接の変形と治具拘束",
      "url": "https://tech.jsae.or.jp/paperinfo/ja/content/jt202602.10/",
      "publisher": "自動車技術会",
      "date": "2026-02"
    }
  },
  {
    "id": "pain-051",
    "kind": "pain",
    "title": "ひずみ取りは失敗すると悪化",
    "summary": "できてしまったひずみを叩いたり焼いたりして直す作業は熟練が要り、失敗するとかえってひずみが増えることもある。工数が読めず見積りに乗せにくい。",
    "industries": [
      "溶接",
      "製缶"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "ひずみ取りの手間を見積りにどう書く",
    "source": {
      "title": "技術職員研修：溶接と熱ひずみ",
      "url": "https://www.icer.kyushu-u.ac.jp/docs/tecstaff_training/h27/14.pdf",
      "publisher": "九州大学",
      "date": "2015"
    }
  },
  {
    "id": "trend-064",
    "kind": "trend",
    "official": false,
    "title": "協働ロボは単純作業から",
    "summary": "協働ロボットは溶接や穴あけでも導入例が増えているが、基本は小型・軽量で決まった繰り返し作業向き。多品種少量や重い物はまだハードルが高いと整理されている。",
    "industries": [
      "溶接"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "うちの溶接はロボットにできる？",
    "source": {
      "title": "協働ロボットの導入時における注意点（中堅中小製造業の自動化 虎の巻5）",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2601/16/news015_2.html",
      "publisher": "MONOist",
      "date": "2026-01"
    }
  },
  {
    "id": "pain-052",
    "kind": "pain",
    "title": "専用ロボは遊ぶ時間が長い",
    "summary": "中小は少量多品種が多く、専用ロボットだと止まっている時間が長くなり、費用に見合わないことが導入をためらう理由になっている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "協働ロボットを用いた移動式搬入出システム",
      "url": "https://www.aomori-itc.or.jp/_files/00246224/070901.pdf",
      "publisher": "青森県産業技術センター",
      "date": null
    }
  },
  {
    "id": "trend-065",
    "kind": "trend",
    "official": true,
    "title": "カメラ付き協働ロボで多品種",
    "summary": "地域のロボットDX拠点では、少量多品種の自動化や、カメラ付き協働ロボットの使い方をテーマにした中小向けセミナーが開かれている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ロボットDX 提携セミナー案内",
      "url": "https://www.ksrp.or.jp/robo-dx/%EF%BC%88%E6%9C%80%E7%B5%82%E7%89%88%EF%BC%890717%E6%8F%90%E6%90%BA%E3%82%BB%E3%83%9F%E3%83%8A%E3%83%BC%E3%83%81%E3%83%A9%E3%82%B7.pdf",
      "publisher": "北九州産業学術推進機構",
      "date": null
    }
  },
  {
    "id": "trend-066",
    "kind": "trend",
    "official": true,
    "title": "ロボット導入の補助は2/3",
    "summary": "経済産業省のロボット導入実証事業では、補助率が大企業2分の1、中小企業3分の2とされていた（2020年の事例紹介セミナー資料）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ロボット導入実証事業 事例紹介セミナー",
      "url": "https://www.jarsia.jp/doc/20201005.pdf",
      "publisher": "日本ロボットシステムインテグレータ協会",
      "date": "2020-10"
    }
  },
  {
    "id": "question-107",
    "kind": "question",
    "title": "板厚はどこまで薄く頼める？",
    "summary": "オンライン調達でも0.05〜1.0mmの薄板シムに対応する例がある。薄い板は反りやすく扱いも難しいため、平面度の要求があるなら先に伝える。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "meviy 板金部品の板厚バリエーション拡大",
      "url": "https://kyodonewsprwire.jp/release/202001085516",
      "publisher": "共同通信PRワイヤー",
      "date": "2020-01"
    }
  },
  {
    "id": "question-108",
    "kind": "question",
    "title": "板金で装置のフレームも作れる？",
    "summary": "FA板金部品で板厚16mmまで扱うオンライン調達もあり、フレームや装置の土台を板金で作る選択肢が広がっている。大物・溶接構造は製缶工場の出番になる。",
    "industries": [
      "板金",
      "製缶",
      "装置"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "板金フレームと製缶フレームの境目",
    "source": {
      "title": "meviy、FA板金部品の板厚を最大16mmに拡大",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2108/05/news017.html",
      "publisher": "MONOist",
      "date": "2021-08"
    }
  },
  {
    "id": "pain-053",
    "kind": "pain",
    "title": "型が要る形かの判断が先",
    "summary": "板金は少量ならタレパンで型を作らず、量産ではプレス型を作るので型費が効く。数量が見えないと、どちらの工法で見積るかで値段が大きく変わる。",
    "industries": [
      "板金",
      "プレス"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "数量で工法が変わる板金の見積り",
    "source": {
      "title": "板金部品の設計見積もり（2ページ）",
      "url": "https://monoist.itmedia.co.jp/mn/spv/1209/12/news010_2.html",
      "publisher": "MONOist",
      "date": "2012-09"
    }
  },
  {
    "id": "term-060",
    "kind": "term",
    "title": "プレス図面のバリ方向",
    "summary": "プレス品は金型で作る前提なので、バリが出る向きを図面に入れておく必要があると解説されている。後から変えると型の作り直しになりかねない。",
    "industries": [
      "プレス"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "プレス図面で最初に決めること",
    "source": {
      "title": "プレス加工の図面ガイド（抜き・曲げ・深絞り・バリ）",
      "url": "https://renue.co.jp/posts/press-stamping-drawing-blanking-bending-deep-drawing-burr-guide-2026",
      "publisher": "RENUE",
      "date": "2026"
    }
  },
  {
    "id": "question-109",
    "kind": "question",
    "title": "プレスの穴はどこまで小さく？",
    "summary": "プレス品には最小の穴径や穴と穴の間隔の目安があり、図面ガイドでも紹介されている。板厚に比べて小さすぎる穴は型が折れやすい。",
    "industries": [
      "プレス"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "プレスで抜ける穴の大きさの目安",
    "source": {
      "title": "プレス加工の図面ガイド（抜き・曲げ・深絞り・バリ）",
      "url": "https://renue.co.jp/posts/press-stamping-drawing-blanking-bending-deep-drawing-burr-guide-2026",
      "publisher": "RENUE",
      "date": "2026"
    }
  },
  {
    "id": "term-061",
    "kind": "term",
    "title": "ヒケとは？表面のへこみ",
    "summary": "成形品の厚い所で、表面と中の固まる時間がずれて表面がエクボのようにへこむ不良。樹脂は縮むので完全には消せず、設計と成形条件で小さくする。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ヒケはなぜ出る？図で見る原因と3つの対策",
    "source": {
      "title": "射出成形の外観不良ヒケ対策（2代目設計屋の事件簿2）",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2012/14/news003_2.html",
      "publisher": "MONOist",
      "date": "2020-12"
    }
  },
  {
    "id": "question-110",
    "kind": "question",
    "title": "リブやボスはどのくらいの厚さ？",
    "summary": "リブやボスを本体の肉厚と同じにするとヒケが出やすい。本体の約7割の厚さにするのが目安と解説されている。図面段階で相談すると手戻りが減る。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "射出成形の外観不良ヒケ対策（2代目設計屋の事件簿2）",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2012/14/news003_2.html",
      "publisher": "MONOist",
      "date": "2020-12"
    }
  },
  {
    "id": "term-062",
    "kind": "term",
    "title": "肉盗みとは",
    "summary": "厚くなる所の中身をくり抜いて肉厚をそろえる設計の工夫。ヒケを減らせるが、金型の加工が増えて費用が上がることもある。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "射出成形の外観不良ヒケ対策（2代目設計屋の事件簿2）",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2012/14/news003_2.html",
      "publisher": "MONOist",
      "date": "2020-12"
    }
  },
  {
    "id": "term-063",
    "kind": "term",
    "title": "ウェルドラインとは",
    "summary": "金型の中で分かれた樹脂の流れが合流した所に出る細い線。穴の周りなどで起きやすく、見た目だけでなく強度も下がることがある。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "成形品の細い線、ウェルドラインの正体",
    "source": {
      "title": "ウェルドラインの仕組みとその対策（2代目設計屋の事件簿5）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2104/08/news004.html",
      "publisher": "MONOist",
      "date": "2021-04"
    }
  },
  {
    "id": "question-111",
    "kind": "question",
    "title": "ウェルドは消せる？",
    "summary": "完全に消すのは難しい。ゲート位置を変えて、合流点を目立たず強度に響かない場所へ寄せるのが基本。外観面と強度が要る所を最初に伝えると良い。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "ウェルドラインの仕組みとその対策（3/3）",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2104/08/news004_3.html",
      "publisher": "MONOist",
      "date": "2021-04"
    }
  },
  {
    "id": "term-064",
    "kind": "term",
    "title": "会合角とは",
    "summary": "ウェルドで合流する2つの樹脂の流れがぶつかる角度。角度によって線の目立ち方や強さが変わり、流動解析で事前に検討できる。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "会合角を心得て、ウェルドラインを緩和する",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1005/21/news097.html",
      "publisher": "MONOist",
      "date": "2010-05"
    }
  },
  {
    "id": "term-065",
    "kind": "term",
    "title": "ソリ（反り）とは",
    "summary": "成形品が冷えるときに縮み方がそろわず曲がる不良。主な原因は肉厚の差、冷え方の差、ガラス繊維の向きの3つと解説されている。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "平らなはずの部品が反る3つの理由",
    "source": {
      "title": "射出成形した製品が反ってしまった!! その原因と対策アプローチ",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2103/10/news004_2.html",
      "publisher": "MONOist",
      "date": "2021-03"
    }
  },
  {
    "id": "pain-054",
    "kind": "pain",
    "title": "リブで反りを止めるとヒケが出る",
    "summary": "反り対策で補強のリブを足すと、今度はリブの付け根にヒケが出やすい。一つの不良を直すと別の不良が出るため、形と条件を両方見て落とし所を探す。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "射出成形した製品が反ってしまった!! その原因と対策アプローチ",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2103/10/news004_2.html",
      "publisher": "MONOist",
      "date": "2021-03"
    }
  },
  {
    "id": "term-066",
    "kind": "term",
    "title": "繊維配向とは",
    "summary": "ガラス繊維入り樹脂で、繊維が流れの向きにそろうこと。流れの向きと直角の向きで縮み方が違うため、反りの原因になる。充填の流れ方を意識した設計が要る。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "繊維入り樹脂は充填パターンを意識しよう",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1007/22/news104.html",
      "publisher": "MONOist",
      "date": "2010-07"
    }
  },
  {
    "id": "term-067",
    "kind": "term",
    "title": "樹脂流動解析とは",
    "summary": "金型を作る前に、樹脂がどう流れ、どこで合流し、どう縮むかをコンピュータで予測すること。ウェルドや反りを設計段階で見つけやすくなる。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "金型を削る前に不良を見つける流動解析",
    "source": {
      "title": "繊維入り樹脂は充填パターンを意識しよう",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1007/22/news104.html",
      "publisher": "MONOist",
      "date": "2010-07"
    }
  },
  {
    "id": "question-112",
    "kind": "question",
    "title": "冷却の温度差はどれほど効く？",
    "summary": "ある成形会社の解説では、金型内の温度差が5〜10℃でも反りの大半を引き起こし、冷却の不均一が多くの成形で最大の要因だとしている。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "射出成形の反りの原因",
      "url": "https://zetarmold.com/ja/%e5%b0%84%e5%87%ba%e6%88%90%e5%bd%a2%e3%81%ae%e5%8f%8d%e3%82%8a%e3%81%ae%e5%8e%9f%e5%9b%a0",
      "publisher": "ZetarMold",
      "date": null
    }
  },
  {
    "id": "term-068",
    "kind": "term",
    "title": "流動距離とゲート数",
    "summary": "ゲートから樹脂が流れる距離が長いほど中に応力が残りやすく、反りにつながるとされる。ゲートの位置や数の決め方が品質を左右する。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "反り変形に影響する要因",
      "url": "https://zetarmold.com/ja/%e5%8f%8d%e3%82%8a%e5%a4%89%e5%bd%a2%e3%81%ab%e5%bd%b1%e9%9f%bf%e3%81%99%e3%82%8b%e8%a6%81%e5%9b%a0/",
      "publisher": "ZetarMold",
      "date": null
    }
  },
  {
    "id": "term-069",
    "kind": "term",
    "title": "冷却時間とは",
    "summary": "樹脂を金型の中で固めておく時間。短いと取り出した後に変形しやすく、延ばしたり冷却条件を改善したりするのが変形対策の一つとされる。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "射出成形品の変形の原因",
      "url": "https://www.jasonmolding.com/?p=2351",
      "publisher": "JasonMould",
      "date": null
    }
  },
  {
    "id": "question-113",
    "kind": "question",
    "title": "反りは作る前に予測できる？",
    "summary": "国の支援事業の報告書で、反りの解析結果を保圧や冷却の条件決めにつなげる取り組みが紹介されている。試し打ちの回数を減らす考え方として記事にできる。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "戦略的基盤技術高度化支援事業 研究開発成果報告書",
      "url": "https://www.chusho.meti.go.jp/keiei/sapoin/portal/seika/2015/2742103010h.pdf",
      "publisher": "中小企業庁",
      "date": "2015"
    }
  },
  {
    "id": "term-070",
    "kind": "term",
    "title": "抜き勾配とは",
    "summary": "金型から製品を抜きやすくするために側面へ付ける小さな傾き。一般に1度前後、表面にシボを入れる場合は2度以上が目安と解説されている。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "図面の「抜き勾配」って何度にすればいい？",
    "source": {
      "title": "抜き勾配の設定に欠かせない3つのルール",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2101/25/news004.html",
      "publisher": "MONOist",
      "date": "2021-01"
    }
  },
  {
    "id": "pain-055",
    "kind": "pain",
    "title": "勾配不足で擦り傷が出る",
    "summary": "樹脂は冷えると縮んで型に張り付く。勾配が小さいと取り出すときに擦れて傷になる。外周の勾配はなるべく一定にそろえるのがルールとされる。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "抜き勾配の設定に欠かせない3つのルール（2/2）",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2101/25/news004_2.html",
      "publisher": "MONOist",
      "date": "2021-01"
    }
  },
  {
    "id": "question-114",
    "kind": "question",
    "title": "シボ加工にすると何が変わる？",
    "summary": "表面に梨地などのシボを入れると型との引っかかりが増えるので、抜き勾配を大きめ（目安2度以上）に取る必要がある。デザインと勾配はセットで決める。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "抜き勾配の設定に欠かせない3つのルール",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2101/25/news004.html",
      "publisher": "MONOist",
      "date": "2021-01"
    }
  },
  {
    "id": "term-071",
    "kind": "term",
    "title": "スライドコアとは",
    "summary": "型が開く動きに合わせて横方向に動く部品で、アンダーカットを抜く最も一般的な方法。ただし製品の内側への引っかかりには使えない。",
    "industries": [
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "スライドコアでアンダーカット形状を抜く",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1304/17/news019.html",
      "publisher": "MONOist",
      "date": "2013-04"
    }
  },
  {
    "id": "term-072",
    "kind": "term",
    "title": "傾斜コアとは",
    "summary": "製品を押し出す動きを使って斜めに逃げ、内側のアンダーカットを抜く仕掛け。ほかに弾性コア、置き中子、無理抜きなどの方法もあり、形と数量で選ぶ。",
    "industries": [
      "金型"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "スライドで処理できないアンダーカットはどうするの?",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1307/05/news010.html",
      "publisher": "MONOist",
      "date": "2013-07"
    }
  },
  {
    "id": "question-115",
    "kind": "question",
    "title": "横穴やツメは付けられる？",
    "summary": "付けられるが、金型にスライドなどの仕掛けが要り費用と納期が増える。形を少し変えて仕掛けなしで抜けないか、見積もり前に相談すると安くなることがある。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "アンダーカット（用語解説）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2003/27/news002.html",
      "publisher": "MONOist",
      "date": "2020-03"
    }
  },
  {
    "id": "term-073",
    "kind": "term",
    "title": "サブマリンゲートとは",
    "summary": "型が開くときに製品とゲートが自動で切り離される入り口の方式。裏側や内側から入れるのでゲート跡が見えにくく、外観が大事な量産品で好まれる。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "Submarine Gate vs Edge Gate",
      "url": "https://www.boxumold.com/comparisons/submarine-gate-vs-edge-gate",
      "publisher": "Boxu Mold",
      "date": null
    }
  },
  {
    "id": "term-074",
    "kind": "term",
    "title": "ゲート・ゲート跡とは",
    "summary": "ゲートは溶けた樹脂が製品に入る入り口。切った跡が製品に残るため、どこに置くかで見た目やウェルドの位置が変わる。発注時に跡を嫌う面を伝える。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "Submarine Gate vs Edge Gate",
      "url": "https://www.boxumold.com/comparisons/submarine-gate-vs-edge-gate",
      "publisher": "Boxu Mold",
      "date": null
    }
  },
  {
    "id": "term-075",
    "kind": "term",
    "title": "PP（ポリプロピレン）の特徴",
    "summary": "安く、酸やアルカリに強く、曲げに強いのでヒンジにも使われる。一方で寒さでもろくなるグレードがあり、厚い部分はヒケや反りが出やすい。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "Selecting a Thermoplastic for Your Injection-Molded Part",
      "url": "https://www.protolabs.com/resources/design-tips/selecting-the-right-plastic-for-your-parts/",
      "publisher": "Protolabs",
      "date": null
    }
  },
  {
    "id": "term-076",
    "kind": "term",
    "title": "ABSの特徴",
    "summary": "粘り強く、加工しやすく、表面がきれいに仕上がる。熱にはあまり強くないので、高温になる場所では別の材料を検討する。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "Selecting a Thermoplastic for Your Injection-Molded Part",
      "url": "https://www.protolabs.com/resources/design-tips/selecting-the-right-plastic-for-your-parts/",
      "publisher": "Protolabs",
      "date": null
    }
  },
  {
    "id": "term-077",
    "kind": "term",
    "title": "PC（ポリカーボネート）の特徴",
    "summary": "衝撃にとても強く、縮みが小さく寸法が安定し、透明品もある。厚い部分は気泡やヒケが出やすく、薬品には弱いと解説されている。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "Selecting a Thermoplastic for Your Injection-Molded Part",
      "url": "https://www.protolabs.com/resources/design-tips/selecting-the-right-plastic-for-your-parts/",
      "publisher": "Protolabs",
      "date": null
    }
  },
  {
    "id": "term-078",
    "kind": "term",
    "title": "PC/ABSとは",
    "summary": "ABSの作りやすさとPCの強さを合わせたブレンド材。単独で成形すると出やすい厚肉の問題も抑えやすく、車や電子機器の筐体に多い。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "Selecting a Thermoplastic for Your Injection-Molded Part",
      "url": "https://www.protolabs.com/resources/design-tips/selecting-the-right-plastic-for-your-parts/",
      "publisher": "Protolabs",
      "date": null
    }
  },
  {
    "id": "term-079",
    "kind": "term",
    "title": "POM（ジュラコン等）の特徴",
    "summary": "硬く、強く、滑りが良いので歯車やねじ部品に向く。アルカリや塩素、熱湯で傷みやすく、接着が難しい点に注意する。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "Selecting a Thermoplastic for Your Injection-Molded Part",
      "url": "https://www.protolabs.com/resources/design-tips/selecting-the-right-plastic-for-your-parts/",
      "publisher": "Protolabs",
      "date": null
    }
  },
  {
    "id": "question-116",
    "kind": "question",
    "title": "ナイロンは寸法が変わる？",
    "summary": "ナイロン（PA）は水分を吸うと寸法や性質が変わる。PA6やPA66など種類が多く、PA66は摩耗に強く高強度の用途向け。使う環境を伝えると選びやすい。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "Selecting a Thermoplastic for Your Injection-Molded Part",
      "url": "https://www.protolabs.com/resources/design-tips/selecting-the-right-plastic-for-your-parts/",
      "publisher": "Protolabs",
      "date": null
    }
  },
  {
    "id": "term-080",
    "kind": "term",
    "title": "汎用プラとエンプラの違い",
    "summary": "PP・PEなどの汎用プラは安く作りやすいが荷重に弱い。ABS・PC・PAなどは強さ・耐熱・寸法のバランスが良く、値段は上がる、と整理されている。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "その部品、汎用プラで足りる？エンプラが要る？",
    "source": {
      "title": "Injection Molding Material Selection Guide",
      "url": "https://www.protolabs.com/resources/guides-and-trend-reports/thermoplastic-material-selection-for-injection-molding/",
      "publisher": "Protolabs",
      "date": null
    }
  },
  {
    "id": "term-081",
    "kind": "term",
    "title": "スーパーエンプラとは",
    "summary": "熱可塑性樹脂の中で耐熱性などが最高水準のグループ。PPSは値段がこなれ流れやすく成形しやすいため、エンジン周りや電装品の筐体で採用が広がる。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "スーパーエンプラの採用拡大",
      "url": "https://newswitch.jp/p/158",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "term-082",
    "kind": "term",
    "title": "PEEKとは",
    "summary": "熱と薬品に強く、金属部品の置き換えや医療機器にも使われる高性能樹脂。値段が高いため航空機や半導体装置など高価格の用途が中心。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "グンゼの熱収縮チューブ（PEEK）",
      "url": "https://www.gunze.co.jp/epd/wpcms/wp-content/uploads/2025/06/グンゼの熱収縮チューブ（PEEK）.pdf",
      "publisher": "グンゼ",
      "date": "2025-06"
    }
  },
  {
    "id": "trend-067",
    "kind": "trend",
    "official": false,
    "title": "PEEKを3Dプリンタ材料に",
    "summary": "化学メーカーの調査レポートで、PEEKが3Dプリンタの材料としても使われ、需要が伸びていると報告されている。高機能樹脂の試作の選択肢が増えている。",
    "industries": [
      "樹脂成形",
      "3Dプリンタ"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ARCレポート rs-1003",
      "url": "https://arc.asahi-kasei.co.jp/report/arc_report/pdf/rs-1003.pdf",
      "publisher": "旭化成 ARC",
      "date": null
    }
  },
  {
    "id": "term-083",
    "kind": "term",
    "title": "ブロー成形とは",
    "summary": "加熱した樹脂の筒に空気を吹き込み、金型に沿って膨らませて中空品を作る工法。ボトルやタンクなど中が空洞の製品を量産するのに使う。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ボトルはどう作る？ブロー成形のきほん",
    "source": {
      "title": "ブロー成形の解説",
      "url": "https://formlabs.com/jp/blog/blow-molding/",
      "publisher": "Formlabs",
      "date": null
    }
  },
  {
    "id": "term-084",
    "kind": "term",
    "title": "ブロー成形の3つの方式",
    "summary": "押出ブロー（EBM）、射出ブロー（IBM）、射出延伸ブロー（ISBM）がある。EBMは1個あたりが安く、ISBMは強くて透明なボトル向きとされる。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ブロー成形の解説",
      "url": "https://formlabs.com/jp/blog/blow-molding/",
      "publisher": "Formlabs",
      "date": null
    }
  },
  {
    "id": "term-085",
    "kind": "term",
    "title": "真空成形とは",
    "summary": "加熱して柔らかくした樹脂シートと型の間の空気を抜き、型に密着させて形を作る工法。型が片側だけで済み、大きなカバーや多品種少量に向く。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "型代を抑えたいなら真空成形という選択肢",
    "source": {
      "title": "真空成形入門",
      "url": "https://formlabs.com/jp/blog/introduction-to-vacuum-forming/",
      "publisher": "Formlabs",
      "date": null
    }
  },
  {
    "id": "question-117",
    "kind": "question",
    "title": "真空成形と圧空成形の違いは？",
    "summary": "真空成形は大気圧で押し付け、圧空成形はさらに強い圧をかけるので角がシャープに出る。型の凸凹どちらを使うかで、内側か外側の寸法が正確になる。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "真空成形 カテゴリ一覧",
      "url": "https://mono.ipros.com/cg3/真空成形/インジェクション",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-118",
    "kind": "question",
    "title": "真空成形の弱点は？",
    "summary": "1個あたりの値段は射出成形より高めで、深い形は苦手、底の角が薄くなりやすい。型の傷やゴミが表面に出やすいので外観品は型の管理が大切。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "真空成形 カテゴリ一覧",
      "url": "https://mono.ipros.com/cg3/真空成形/インジェクション",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-039",
    "kind": "success",
    "title": "板金カバーとの比較で訴える",
    "summary": "真空・圧空成形の専門ページを作り「板金では難しい曲線のデザインもできる」と、発注者がいま使う工法と比べて利点を見せる発信の例がある。",
    "industries": [
      "樹脂成形",
      "板金"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "板金カバーを樹脂にしたら何が変わる？",
    "source": {
      "title": "真空成形・圧空成形.com 板金では難しい曲線のデザインも可能",
      "url": "https://mono.ipros.com/product/detail/2000195544",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-086",
    "kind": "term",
    "title": "3Dプリントの型で熱成形",
    "summary": "真空成形などの型を3Dプリンタで作り、数十〜数百個の小ロットを安く作る方法が紹介されている。試作や設計変更が多い段階に向く。",
    "industries": [
      "樹脂成形",
      "3Dプリンタ"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "熱成形（3Dプリント型の活用）",
      "url": "https://formlabs.com/jp/applications/thermoforming/",
      "publisher": "Formlabs",
      "date": null
    }
  },
  {
    "id": "term-087",
    "kind": "term",
    "title": "インサート成形とは",
    "summary": "先に作った金属部品などを金型に入れ、その周りに樹脂を流して一体にする工法。組立の手間と費用を減らせ、組み付けより強く結合できる。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ナットを埋め込むインサート成形のメリット",
    "source": {
      "title": "オーバーモールドとインサート成形",
      "url": "https://formlabs.com/jp/blog/overmolding-insert-molding/",
      "publisher": "Formlabs",
      "date": null
    }
  },
  {
    "id": "term-088",
    "kind": "term",
    "title": "オーバーモールドとの違い",
    "summary": "オーバーモールドは成形した部品の上に別の材料を重ねて成形する工法で、インサート成形とよく混同される。目的や利点が違うので言葉をそろえて話す。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "オーバーモールドとインサート成形",
      "url": "https://formlabs.com/jp/blog/overmolding-insert-molding/",
      "publisher": "Formlabs",
      "date": null
    }
  },
  {
    "id": "term-089",
    "kind": "term",
    "title": "二色成形とは",
    "summary": "2種類の樹脂を1回の成形の中で金型内でくっつけて一体にする工法。別々に作って組み立てていた部品を1つにでき、工程と品質が安定する。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "組立をなくす二色成形、向く部品・向かない部品",
    "source": {
      "title": "2色成形は2種類の材質を金型内で接着する成形技術",
      "url": "https://mono.ipros.com/product/detail/2000555707",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-119",
    "kind": "question",
    "title": "硬い樹脂と柔らかい樹脂を一体に？",
    "summary": "二色成形なら硬い樹脂と柔らかいエラストマーを組み合わせ、シール部や防振部を一体にできる。必要な所だけ高い材料を使い、材料費を抑える余地もある。",
    "industries": [
      "樹脂成形",
      "ゴム"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "二色射出成形 材 一覧",
      "url": "https://mono.ipros.com/cg3/二色射出成形/材/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-090",
    "kind": "term",
    "title": "回転式の二色成形",
    "summary": "1色めを成形した後、金型を180度回して閉じ、2色めを流す方式が代表例。射出装置を2つ持つ専用機が要るので、対応できる会社は限られる。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "二色射出成形 金型 一覧",
      "url": "https://mono.ipros.com/cg3/二色射出成形/金型/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-091",
    "kind": "term",
    "title": "異形押出成形とは",
    "summary": "口金から樹脂を押し出し、レール・枠材・カバーなど断面が同じ長い形を連続して作る工法。建材・家電・照明・農業・医療など用途が広い。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "プラスチック異形押出成形",
      "url": "https://mono.ipros.com/product/detail/2000582588",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-040",
    "kind": "success",
    "title": "保有している型の数を見せる",
    "summary": "ある異形押出の会社は、保有する型が約6,000あると紹介し、射出成形品や加工との組み合わせもできると発信している。実績の量を数字で伝える例。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "プラスチック異形押出成形",
      "url": "https://mono.ipros.com/product/detail/2000582588",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-120",
    "kind": "question",
    "title": "少量でも射出成形できる？",
    "summary": "試作や数百〜数千個向けに、安い型を使う少量射出成形のサービスが増えている。最低注文数なしや、無料の作りやすさ診断を掲げる会社もある。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "少量の射出成形",
      "url": "https://formlabs.com/jp/blog/low-volume-injection-molding/",
      "publisher": "Formlabs",
      "date": null
    }
  },
  {
    "id": "term-092",
    "kind": "term",
    "title": "DFM（作りやすさの検討）とは",
    "summary": "Design for Manufacturingの略。図面を見て、成形しやすく不良が出にくい形かを製造側が確認し改善案を出すこと。見積もりと一緒に出す会社もある。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "低量射出成形サービス",
      "url": "https://www.rapiddirect.com/ja/services/low-volume-injection-molding-service/",
      "publisher": "RapidDirect",
      "date": null
    }
  },
  {
    "id": "term-093",
    "kind": "term",
    "title": "MOQ（最小注文数）とは",
    "summary": "1回に注文できる最小の数量。金型を使う加工では段取りの手間があるため設ける会社が多いが、少量向けでMOQなしをうたう会社もある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "少量の射出成形: 小ロットの注文に合わせて",
      "url": "https://www.rapiddirect.com/ja/blog/low-volume-injection-molding/",
      "publisher": "RapidDirect",
      "date": null
    }
  },
  {
    "id": "success-041",
    "kind": "success",
    "title": "設計段階から相談に乗る",
    "summary": "射出成形の費用は金型代だけでなく、形の決め方で大きく変わる。設計の早い段階でエンジニアに相談できる体制（フロントローディング）を強みとして語る例。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "図面ができる前に相談してほしい理由",
    "source": {
      "title": "コストは「金型代」だけじゃない! 射出成形のカギはエンジニアに相談できるフロントローディング",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1504/24/news001.html",
      "publisher": "MONOist",
      "date": "2015-04"
    }
  },
  {
    "id": "term-094",
    "kind": "term",
    "title": "樹脂型・アルミ型・鋼型の寿命",
    "summary": "大分県の公設試の資料では、耐久成形数の目安を樹脂型で約2,000、アルミ型で約1万、一般の鋼の金型で約30万としている。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "何個作るかで選ぶ金型の材料",
    "source": {
      "title": "簡易金型による射出成形手法",
      "url": "https://www.oita-ri.jp/wp-content/uploads/簡易金型による射出成形手法.pdf",
      "publisher": "大分県産業科学技術センター",
      "date": null
    }
  },
  {
    "id": "pain-056",
    "kind": "pain",
    "title": "簡易型は細かい所が欠ける",
    "summary": "大分県の公設試の試験では、樹脂型が約100ショットでゲートや細かい凸部が欠けた。簡易型は射出の圧を受ける所の設計に工夫が要る。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "簡易金型による射出成形手法",
      "url": "https://www.oita-ri.jp/wp-content/uploads/簡易金型による射出成形手法.pdf",
      "publisher": "大分県産業科学技術センター",
      "date": null
    }
  },
  {
    "id": "question-121",
    "kind": "question",
    "title": "アルミ型は量産に使える？",
    "summary": "アルミは熱を伝えやすく早く冷えるが、鋼より柔らかい。少量や試作には向くが、数が多い量産や削れやすい材料には鋼の型が向く、と考えるのが基本。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "簡易金型による射出成形手法",
      "url": "https://www.oita-ri.jp/wp-content/uploads/簡易金型による射出成形手法.pdf",
      "publisher": "大分県産業科学技術センター",
      "date": null
    }
  },
  {
    "id": "success-042",
    "kind": "success",
    "title": "短い納期を数字で示す",
    "summary": "アルミ金型の試作・小ロット成形を紹介するページで「成形品の納品は最短2週間」など、納期を具体的に書いて試作の相談を集める例がある。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "アルミ金型による試作・小ロット成形",
      "url": "https://mono.ipros.com/product/detail/2000012076",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "trend-068",
    "kind": "trend",
    "official": true,
    "title": "3Dプリンタで成形用の型を作る",
    "summary": "山梨県の公設試が、樹脂3Dプリンタで射出成形用の型を作り、少量の成形で金型の代わりになるかを試している。試作型の新しい選択肢になりつつある。",
    "industries": [
      "金型",
      "3Dプリンタ",
      "樹脂成形"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "3Dプリンタによる樹脂型の検討",
      "url": "https://www.pref.yamanashi.jp/documents/99604/p23_02-11.pdf",
      "publisher": "山梨県産業技術センター",
      "date": null
    }
  },
  {
    "id": "term-095",
    "kind": "term",
    "title": "ショット数とは",
    "summary": "金型で成形した回数。金型の寿命や点検の時期を決める基準になる。何ショットごとに清掃・点検するかを決めて管理する方法が一般的。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "金型の健康診断はショット数で決める",
    "source": {
      "title": "金型メンテナンススケジュール（用語集）",
      "url": "https://sgsystemsglobal.com/ja/%E7%94%A8%E8%AA%9E%E9%9B%86/%E9%87%91%E5%9E%8B%E3%83%A1%E3%83%B3%E3%83%86%E3%83%8A%E3%83%B3%E3%82%B9%E3%82%B9%E3%82%B1%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB/",
      "publisher": "SG Systems Global",
      "date": null
    }
  },
  {
    "id": "term-096",
    "kind": "term",
    "title": "金型の予防保全",
    "summary": "ショット数で決める、期間で決める（年1回のオーバーホール等）、データで状態を見て決める、の3つを組み合わせて計画するのが一般的とされる。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "金型メンテナンススケジュール（用語集）",
      "url": "https://sgsystemsglobal.com/ja/%E7%94%A8%E8%AA%9E%E9%9B%86/%E9%87%91%E5%9E%8B%E3%83%A1%E3%83%B3%E3%83%86%E3%83%8A%E3%83%B3%E3%82%B9%E3%82%B9%E3%82%B1%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB/",
      "publisher": "SG Systems Global",
      "date": null
    }
  },
  {
    "id": "question-122",
    "kind": "question",
    "title": "金型の手入れ費用はいくら？",
    "summary": "内容で大きく変わる。あるプレス金型の保守業者の掲載では10万〜50万円の価格帯とされている。定期的な手入れで大きな修理を防ぐ話と合わせて書く。",
    "industries": [
      "金型",
      "プレス"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "金型メンテナンス",
      "url": "https://pr.mono.ipros.com/somax/product/detail/2000152453/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "trend-069",
    "kind": "trend",
    "official": false,
    "title": "ショット数を自動で数える",
    "summary": "金型に付けて成形回数を記録するショットカウンターの無料お試しが2021年に始まるなど、型の稼働を見える化する道具が出ている。保管型の管理にも役立つ。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "『Smart Shot Counter』無料お試しサービス開始",
      "url": "https://kyodonewsprwire.jp/release/202106286862",
      "publisher": "共同通信PRワイヤー",
      "date": "2021-06"
    }
  },
  {
    "id": "question-123",
    "kind": "question",
    "title": "金型ができるまでの流れ",
    "summary": "仕様確認、設計、加工、組立、試し打ち（トライ）、修正、量産と進む。期間と費用は形や大きさで変わるので、依頼先を選ぶときは工程ごとに確認する。",
    "industries": [
      "金型"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "金型製作の流れとは?費用や期間 依頼先の選び方",
      "url": "https://crexgroup.com/ja/manufacturing/operation/mold-making-process-cost/",
      "publisher": "CREX",
      "date": null
    }
  },
  {
    "id": "trend-070",
    "kind": "trend",
    "official": false,
    "title": "金型の無償保管に勧告が急増",
    "summary": "公取委の金型保管に関する勧告は、2022年度の1件から2025年度は39件中26件に増えたとMONOistが報じた。昔の慣習が法令違反として扱われている。",
    "industries": [
      "金型",
      "樹脂成形",
      "プレス"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "何年も預かっている金型、保管料を相談していい",
    "source": {
      "title": "あの金型今どこ? もう何年使ってない? かつての慣習が法令違反になる理由",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2604/20/news043.html",
      "publisher": "MONOist",
      "date": "2026-04"
    }
  },
  {
    "id": "trend-071",
    "kind": "trend",
    "official": false,
    "title": "取適法で型管理のリスクが上がる",
    "summary": "2026年1月に下請法を改めた中小受託取引適正化法（取適法）が施行され、金型の管理を怠ると法令違反になるリスクが高まると指摘されている。",
    "industries": [
      "金型",
      "樹脂成形",
      "プレス"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "あの金型今どこ? もう何年使ってない? かつての慣習が法令違反になる理由",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2604/20/news043.html",
      "publisher": "MONOist",
      "date": "2026-04"
    }
  },
  {
    "id": "trend-072",
    "kind": "trend",
    "official": false,
    "title": "受注側が持つ型も対象に",
    "summary": "2025年の運用基準見直しで、受注側の会社が所有する金型でも、発注側が実質的に管理していれば規制の対象になったと報じられている。",
    "industries": [
      "金型",
      "樹脂成形"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "あの金型今どこ?（2/2）",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2604/20/news043_2.html",
      "publisher": "MONOist",
      "date": "2026-04"
    }
  },
  {
    "id": "trend-073",
    "kind": "trend",
    "official": false,
    "title": "半数の会社で型の無償保管",
    "summary": "Resilireの調査（MONOist 2026年10月報道）で、製造業の51.3%で委託先による金型の無償保管が起きており、約2割が公取委の指導を経験していた。",
    "industries": [
      "金型",
      "樹脂成形",
      "プレス"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業の51.3%で「委託先による金型無償保管」が発生 約2割が公取委指導を経験",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2610/09/news037.html",
      "publisher": "MONOist",
      "date": "2026-10"
    }
  },
  {
    "id": "pain-057",
    "kind": "pain",
    "title": "動かない型が工場を圧迫",
    "summary": "Resilireの調査では、約7割が1年以上使っていない金型を保管しているとされる。置き場所と管理の手間が作り手の負担になっている。",
    "industries": [
      "金型",
      "樹脂成形",
      "プレス"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "あの金型今どこ? もう何年使ってない? かつての慣習が法令違反になる理由",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2604/20/news043.html",
      "publisher": "MONOist",
      "date": "2026-04"
    }
  },
  {
    "id": "buyer-053",
    "kind": "buyer",
    "title": "発注側も型の棚卸しを始める",
    "summary": "勧告の増加を受け、発注側でも「あの金型は今どこで、何年使っていないか」を把握し、廃棄や保管料の取り決めを見直す動きが出ている。",
    "industries": [
      "金型",
      "樹脂成形"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "製造業の51.3%で「委託先による金型無償保管」が発生（2/2）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2610/09/news037_2.html",
      "publisher": "MONOist",
      "date": "2026-10"
    }
  },
  {
    "id": "trend-074",
    "kind": "trend",
    "official": false,
    "title": "大手が型代を一括払いへ",
    "summary": "大手自動車メーカーが、部品メーカーが負担した金型製作費の支払いを24カ月の分割から一括払いに切り替えたと2025年7月に報じられた。資金繰り負担が背景。",
    "industries": [
      "金型",
      "樹脂成形",
      "プレス"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "トヨタ、金型製作費を一括払いに",
      "url": "https://www.oanda.jp/lab-education/market_news/kn_2025071001001702/",
      "publisher": "OANDA（共同通信配信）",
      "date": "2025-07"
    }
  },
  {
    "id": "term-097",
    "kind": "term",
    "title": "金型償却とは",
    "summary": "金型代を一度に払わず、部品の単価に少しずつ上乗せして回収するやり方。数量が予定より減ると回収しきれないため、実績を見て定期的に見直すことが要る。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "金型代は一括？単価に乗せる？違いと注意点",
    "source": {
      "title": "自動車産業の取引実態に関する資料",
      "url": "https://www.meti.go.jp/shingikai/mono_info_service/automotive_supply_chain/pdf/002_b03_00.pdf",
      "publisher": "経済産業省",
      "date": null
    }
  },
  {
    "id": "question-124",
    "kind": "question",
    "title": "金型代を分割で受けたら税金は？",
    "summary": "発注者から一括で受けた金型費相当額を24カ月に分けて益金にした処理が、2023年12月の審判所の裁決で認められた例がある。契約の中身次第なので専門家に確認。",
    "industries": [
      "金型"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "一括払いされた費用の分割益金算入容認",
      "url": "https://www.sn-hoki.co.jp/article/tamasters/tamaster3642158/",
      "publisher": "税務通信（税務研究会）",
      "date": "2024-07"
    }
  },
  {
    "id": "term-098",
    "kind": "term",
    "title": "金型図面・データは誰のもの？",
    "summary": "日本金型工業会のガイドライン（2026年版）は、金型の図面や加工データの権利は作った金型メーカーにあり、通常は譲渡を求めないのが基本としている。",
    "industries": [
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "金型の図面をください、と言われたら",
    "source": {
      "title": "金型取引ガイドライン Ver3（2026）",
      "url": "https://www.jdmia.or.jp/wp/wp-content/uploads/2026/02/金型取引ガイドラインVer３＿2026_A4.pdf",
      "publisher": "日本金型工業会",
      "date": "2026-02"
    }
  },
  {
    "id": "question-125",
    "kind": "question",
    "title": "金型の修理代は誰が払う？",
    "summary": "同ガイドラインでは、量産中の摩耗などによる修理や、試作後の図面変更による改造の費用は発注者負担が基本とされる。事前に取り決めておくと揉めない。",
    "industries": [
      "金型"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "金型取引ガイドライン Ver3（2026）",
      "url": "https://www.jdmia.or.jp/wp/wp-content/uploads/2026/02/金型取引ガイドラインVer３＿2026_A4.pdf",
      "publisher": "日本金型工業会",
      "date": "2026-02"
    }
  },
  {
    "id": "pain-058",
    "kind": "pain",
    "title": "口頭の改造依頼で費用が回収できない",
    "summary": "同ガイドラインは、改造や修理などお金がかかる作業は注文書を受け取ってから行い、書面がなければ作業しないよう勧めている。",
    "industries": [
      "金型"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "金型取引ガイドライン Ver3（2026）",
      "url": "https://www.jdmia.or.jp/wp/wp-content/uploads/2026/02/金型取引ガイドラインVer３＿2026_A4.pdf",
      "publisher": "日本金型工業会",
      "date": "2026-02"
    }
  },
  {
    "id": "term-099",
    "kind": "term",
    "title": "支払いの起算日は納品日",
    "summary": "日本金型工業会のガイドラインでは、下請法の考え方から支払期日は検収日ではなく納品日から数え、60日以内とされている。前金払いも勧めている。",
    "industries": [
      "金型"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "金型取引ガイドライン",
      "url": "https://www.jdmia.or.jp/wp/wp-content/uploads/2022/09/金型取引ガイドライン_A3.pdf",
      "publisher": "日本金型工業会",
      "date": "2022-09"
    }
  },
  {
    "id": "trend-075",
    "kind": "trend",
    "official": false,
    "title": "型代の手形払いは禁止に",
    "summary": "日本金型工業会のガイドライン（2026年版）は、取適法の対象取引では代金の支払いに手形を使うことが禁止されていると記している。",
    "industries": [
      "金型",
      "樹脂成形",
      "プレス"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "金型取引ガイドライン Ver3（2026）",
      "url": "https://www.jdmia.or.jp/wp/wp-content/uploads/2026/02/金型取引ガイドラインVer３＿2026_A4.pdf",
      "publisher": "日本金型工業会",
      "date": "2026-02"
    }
  },
  {
    "id": "trend-076",
    "kind": "trend",
    "official": true,
    "title": "前金で型代の一部を受け取る",
    "summary": "中小企業庁の型取引の協議会資料では、契約時に型代の1/3〜1/2以上を前金で、残りを納品日に払う仕組みの検討例が示されている。",
    "industries": [
      "金型"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "型取引の適正化推進協議会 資料（2020年12月）",
      "url": "https://www.chusho.meti.go.jp/koukai/kenkyukai/katatorihiki/2020/download/201210katatorihiki13.pdf",
      "publisher": "中小企業庁",
      "date": "2020-12"
    }
  },
  {
    "id": "pain-059",
    "kind": "pain",
    "title": "型の保管・廃棄ルールが曖昧",
    "summary": "中小企業庁の型取引の協議会資料では、型の廃棄や保管の取り決めがはっきりせず、保管やメンテナンスの費用が受注側の負担になっていることが課題とされた。",
    "industries": [
      "金型",
      "樹脂成形",
      "プレス"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "型取引の適正化推進協議会 資料",
      "url": "https://www.chusho.meti.go.jp/koukai/kenkyukai/katatorihiki/2019/download/190806katatorihiki04.pdf",
      "publisher": "中小企業庁",
      "date": "2019-08"
    }
  },
  {
    "id": "trend-077",
    "kind": "trend",
    "official": true,
    "title": "振興基準が型の一生を対象に",
    "summary": "下請中小企業振興法の振興基準は2020年1月に改正され、型の製作から廃棄までを対象に取引のあり方を示すようになった。",
    "industries": [
      "金型",
      "樹脂成形",
      "プレス"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "型取引の適正化推進協議会 資料（2020年8月）",
      "url": "https://www.chusho.meti.go.jp/koukai/kenkyukai/katatorihiki/2020/download/200827katatorihiki03.pdf",
      "publisher": "中小企業庁",
      "date": "2020-08"
    }
  },
  {
    "id": "buyer-054",
    "kind": "buyer",
    "title": "返却・廃棄の手順を先に決める",
    "summary": "経済産業省のパンフレットは、型の返却・廃棄の基準や申し出の方法を取引先と話し合って合意しておくよう勧めている。発注時に決める項目として記事にできる。",
    "industries": [
      "金型",
      "樹脂成形"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "部品取引・型取引のパンフレット",
      "url": "https://www.meti.go.jp/publication/pdf/pamph_buhin02.pdf",
      "publisher": "経済産業省",
      "date": null
    }
  },
  {
    "id": "question-126",
    "kind": "question",
    "title": "見積もり依頼に何を書く？",
    "summary": "情報が少ないと、受ける側は余裕を見て高めに出すか、何度も質問を返すことになる。何を・いくつ・いつまでに、をそろえて送ると早く正確になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "成形の見積もりが早く安くなる依頼の書き方",
    "source": {
      "title": "見積もり依頼の書き方",
      "url": "https://bakuraku.jp/knowledge/knowledge-invoice/estimate-mail-first/",
      "publisher": "バクラク",
      "date": null
    }
  },
  {
    "id": "question-127",
    "kind": "question",
    "title": "成形の見積もりに図面は要る？",
    "summary": "成形や金型の見積もりでは、まず3D CADデータか現物サンプルがあるかを聞かれる。どちらもない場合は、スケッチと寸法・用途から相談を始める。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "How to get injection mold quotation from mold maker",
      "url": "https://www.jasonmolding.com/ja/how-to-get-injection-mold-quotation-from-mold-maker/",
      "publisher": "JasonMould",
      "date": null
    }
  },
  {
    "id": "success-043",
    "kind": "success",
    "title": "不良の原因を連載で解説する",
    "summary": "金型設計会社の2代目が、ヒケ・反り・ウェルドなど現場のトラブルと対策を業界メディアで連載し、設計者に頼られる発信になっている例がある。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "うちで実際にあった不良と直し方",
    "source": {
      "title": "ウェルドラインの仕組みとその対策（2代目設計屋の事件簿5）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2104/08/news004.html",
      "publisher": "MONOist",
      "date": "2021-04"
    }
  },
  {
    "id": "term-100",
    "kind": "term",
    "title": "鋳巣（ひけ巣）ってなに？",
    "summary": "溶けた金属が固まるときに縮んで中にできるすき間。ダイカストでは部分的に圧をかけて防ぐ方法もある。外から見えない欠陥なので、検査や対策を記事で説明すると安心される。",
    "industries": [
      "鋳造"
    ],
    "useFor": [
      "article_idea",
      "writer_hint",
      "question_example"
    ],
    "articleIdea": "鋳巣はなぜできる？当社の防ぎ方と検査",
    "source": {
      "title": "ダイカスト方法およびその装置（特許文献）",
      "url": "https://patents.google.com/patent/JPH08281408A/ja",
      "publisher": "Google Patents",
      "date": null
    }
  },
  {
    "id": "question-128",
    "kind": "question",
    "title": "鋳巣から水や油が漏れない？",
    "summary": "耐圧・気密の部品は、鋳巣で中の液体やガスが漏れることがある。漏れ検査や含浸処理で対応できることを、どの部品に必要かと合わせて答える。",
    "industries": [
      "鋳造",
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "耐圧部品の鋳物、漏れはどう防ぐ？",
    "source": {
      "title": "アルミダイカストの切削加工（鋳巣・含浸・検査）",
      "url": "https://mono.ipros.com/product/detail/2000533227",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-101",
    "kind": "term",
    "title": "含浸処理とは",
    "summary": "鋳物の細かい巣に専用の液をしみこませてふさぎ、液漏れを防ぐ処理。加工後に巣が出たときの手当てとして発注者が知らないことが多い。",
    "industries": [
      "鋳造",
      "表面処理"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "含浸処理って何？鋳巣が出たときの選択肢",
    "source": {
      "title": "アルミダイカストの切削加工（鋳巣・含浸・検査）",
      "url": "https://mono.ipros.com/product/detail/2000533227",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-102",
    "kind": "term",
    "title": "巻込み巣・湯境ってなに？",
    "summary": "ダイカストで溶けた金属を押し込む速さや波形しだいで、空気を巻き込んだ巣や、湯同士がうまく混ざらない境目ができる。射出の記録から原因を探る方法もある。",
    "industries": [
      "鋳造"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "ダイカスト不良の名前と原因をやさしく",
    "source": {
      "title": "ダイカストの評価に関する技術資料",
      "url": "https://ubemachinery.co.jp/company/rd/pdf/diecast/200602_evaluation.pdf",
      "publisher": "UBEマシナリー",
      "date": null
    }
  },
  {
    "id": "term-103",
    "kind": "term",
    "title": "鋳造欠陥を英語で伝えるには",
    "summary": "porosity（鋳巣）など欠陥名と、湯口の見直し・冷却の工夫など対策の英語表現の一覧がある。海外の発注者向けページに英語を添えると問い合わせの入口が広がる。",
    "industries": [
      "鋳造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "鋳造欠陥、ダイカスト不良を英語で一覧",
      "url": "https://businessenglish.hateblo.jp/entry/2020/07/20/鋳造欠陥、ダイカスト不良を英語で一覧_英語で",
      "publisher": "ビジネス英語ブログ",
      "date": "2020-07"
    }
  },
  {
    "id": "term-104",
    "kind": "term",
    "title": "ロストワックスってどんな作り方？",
    "summary": "ろうの原型を作り、まわりを鋳型で固めてろうを溶かし出し、金属を流しこむ。削りでは難しい複雑な形やアンダーカットも作れ、炭素鋼・ステンレス・アルミ・銅合金など材料も広い。",
    "industries": [
      "鋳造"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ロストワックスとは？向く形・向かない形",
    "source": {
      "title": "ロストワックス精密鋳造の紹介",
      "url": "https://pr.mono.ipros.com/daiichi-s/product/detail/2001143945",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-129",
    "kind": "question",
    "title": "溶接やネジ止めの部品をまとめられる？",
    "summary": "複数部品を溶接・ネジ止めしている構造を、ロストワックスで一体にしてコストを下げた事例がある。くり返し注文のある複雑な削り品も候補になると答える。",
    "industries": [
      "鋳造",
      "溶接",
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "部品をまとめて安く：一体鋳造の見直し例",
    "source": {
      "title": "ロストワックス精密鋳造の紹介",
      "url": "https://pr.mono.ipros.com/daiichi-s/product/detail/2001143945",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-130",
    "kind": "question",
    "title": "ロストワックスは何個から頼める？",
    "summary": "型を使う作り方でも、5個ほどの少量から受け、数が増えたら多数個取りに切り替えると案内する会社がある。最低数と、数が増えたときの単価の下がり方を書くとよい。",
    "industries": [
      "鋳造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "精密鋳造は何個から？少量と量産の違い",
    "source": {
      "title": "ロストワックス精密鋳造の紹介",
      "url": "https://pr.mono.ipros.com/daiichi-s/product/detail/2001143945",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-131",
    "kind": "question",
    "title": "鋳物の型代を安くできる？",
    "summary": "砂型鋳造は、金型ではなく木型や樹脂型を使えば型代を抑えやすく、1個から受ける会社もある。型の種類ごとの費用感と寿命の違いを説明する。",
    "industries": [
      "鋳造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "木型・樹脂型・金型、鋳物の型はどれを選ぶ？",
    "source": {
      "title": "砂型鋳造（木型・樹脂型）の紹介",
      "url": "https://mono.ipros.com/product/detail/2000704492",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "pain-060",
    "kind": "pain",
    "title": "木型は使ううちに傷む",
    "summary": "木型は砂との摩耗や水分で形が変わり、品質が落ちるので直しが必要になる。預かり型の手入れや作り直しの費用を、発注者と事前に決めておく話題になる。",
    "industries": [
      "鋳造",
      "木工"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "お預かりした木型、どう手入れしている？",
    "source": {
      "title": "木型に関する県の研究報告",
      "url": "https://www.pref.nagasaki.jp/shared/uploads/2023/10/1697001445.pdf",
      "publisher": "長崎県",
      "date": "2023-10"
    }
  },
  {
    "id": "trend-078",
    "kind": "trend",
    "official": true,
    "title": "3Dプリンタの樹脂模型が木型の代わりに",
    "summary": "県の試験研究機関が、樹脂3Dプリンタで出した模型を鋳造用の木型の代わりに使えると報告。型づくりの手間と期間を減らせる。",
    "industries": [
      "鋳造",
      "3Dプリンタ"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "3Dプリンタ模型で鋳物の試作を早く",
    "source": {
      "title": "岐阜県産業技術総合センター研究報告",
      "url": "https://www.gitec.rd.pref.gifu.lg.jp/files/reports/2020/gitec_2020_09.pdf",
      "publisher": "岐阜県産業技術総合センター",
      "date": "2020"
    }
  },
  {
    "id": "trend-079",
    "kind": "trend",
    "official": true,
    "title": "型なしで砂型を作る砂型AM",
    "summary": "経産省の資料では、木型・金型を使わず砂型を3Dプリンタで作る方法が、試作期間の短縮や少量生産に役立つとされる。",
    "industries": [
      "鋳造",
      "3Dプリンタ"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "型を作らずに鋳物の試作はできる？",
    "source": {
      "title": "素形材産業とAM（積層造形）に関する資料",
      "url": "https://www.meti.go.jp/policy/mono_info_service/mono/sokeizai/pdf/am03-05.pdf",
      "publisher": "経済産業省",
      "date": null
    }
  },
  {
    "id": "pain-061",
    "kind": "pain",
    "title": "鋳造は電気をとても使う",
    "summary": "鋳造業は中小が多い電力多消費産業で、産業用電気料金の上昇や再エネ賦課金の負担が重いと、経産省の会議で業界側が説明した（2024年7月）。",
    "industries": [
      "鋳造"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "鋳造産業を取り巻く課題（経産省会議資料）",
      "url": "https://www.meti.go.jp/policy/mono_info_service/mono/sokeizai/pdf/document1-07.pdf",
      "publisher": "経済産業省",
      "date": "2024-07"
    }
  },
  {
    "id": "pain-062",
    "kind": "pain",
    "title": "人件費の値上げを転嫁しにくい",
    "summary": "同じ資料で、人手不足による労務費の上昇分を価格に反映するのが難しいことが課題に挙げられた。値上げの理由を発注者に分かりやすく伝える記事の需要がある。",
    "industries": [
      "鋳造"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "価格改定のお願い：電気代と人件費の内訳",
    "source": {
      "title": "鋳造産業を取り巻く課題（経産省会議資料）",
      "url": "https://www.meti.go.jp/policy/mono_info_service/mono/sokeizai/pdf/document1-07.pdf",
      "publisher": "経済産業省",
      "date": "2024-07"
    }
  },
  {
    "id": "pain-063",
    "kind": "pain",
    "title": "CO2を減らす取り組みも求められる",
    "summary": "鋳造業では、電気代・人件費に加えてCO2排出を抑える取り組みの本格化も課題とされた（2024年経産省資料）。省エネ炉や取り組みを発信すると取引先の評価につながる。",
    "industries": [
      "鋳造"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "当社の省エネとCO2削減の取り組み",
    "source": {
      "title": "鋳造産業を取り巻く課題（経産省会議資料）",
      "url": "https://www.meti.go.jp/policy/mono_info_service/mono/sokeizai/pdf/document1-07.pdf",
      "publisher": "経済産業省",
      "date": "2024-07"
    }
  },
  {
    "id": "pain-064",
    "kind": "pain",
    "title": "売上の約1割が電気代という試算",
    "summary": "日本鋳造協会の2015年の要望書で、鋳造業は売上高に占める購入電力代が約10%まで増えたという試算が示された。安く安定した電気が事業の前提だと訴えている。",
    "industries": [
      "鋳造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "日本鋳造協会 要望書（2015年総会提出）",
      "url": "https://www.shindo.gr.jp/cms/wp-content/uploads/2015/06/日本鋳造協会　要望書　20150603総会提出.pdf",
      "publisher": "日本鋳造協会",
      "date": "2015-06"
    }
  },
  {
    "id": "trend-080",
    "kind": "trend",
    "official": false,
    "title": "日本の鋳物業界は再編へ",
    "summary": "海外の業界メディアは、日本の鋳物業界は中小が中心で、経営者や熟練工の高齢化により再編が進むと見ている。仕入れ先を選ぶ側にも、続く会社かどうかが関心になる。",
    "industries": [
      "鋳造"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "10年後も頼める鋳物屋であるために",
    "source": {
      "title": "Japan's foundry industry: an early indicator of structural change",
      "url": "https://www.foundry-planet.com/d/japans-foundry-industry-an-early-indicator-of-structural-change-in-the-global-casting-industry/",
      "publisher": "Foundry Planet",
      "date": null
    }
  },
  {
    "id": "buyer-055",
    "kind": "buyer",
    "title": "鋳物の仕入れ先が続くか確かめる",
    "summary": "鋳物業界は高齢化で再編が見込まれるため、買い手は技術だけでなく後継者や設備更新の様子も見ている。事業承継や若手の様子を発信すると安心材料になる。",
    "industries": [
      "鋳造"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "後継者と若手がいます：長く頼める理由",
    "source": {
      "title": "Japan's foundry industry: an early indicator of structural change",
      "url": "https://www.foundry-planet.com/d/japans-foundry-industry-an-early-indicator-of-structural-change-in-the-global-casting-industry/",
      "publisher": "Foundry Planet",
      "date": null
    }
  },
  {
    "id": "pain-065",
    "kind": "pain",
    "title": "若手が来ない：地域でインターン",
    "summary": "三重県桑名市では、商工会議所の鋳物部会の3社から始めた現場体験が、学校・企業・会議所の三者で進む仕組みとなり各地に広がった。",
    "industries": [
      "鋳造"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "鋳物工場の職場体験レポート",
    "source": {
      "title": "中部だより（桑名方式インターンシップ）",
      "url": "https://www.chukeiren.or.jp/wp/wp-content/uploads/assets/magazine/pdf/chubudayori%20201709.pdf",
      "publisher": "中部経済連合会",
      "date": "2017-09"
    }
  },
  {
    "id": "pain-066",
    "kind": "pain",
    "title": "熟練者が辞めると納期と品質が乱れる",
    "summary": "鋳造業では人手不足・技術継承・設備の古さ・原料高・脱炭素・EV化が同時に進み、熟練者が抜けると納期遅れや品質のばらつきが出やすいと指摘されている。",
    "industries": [
      "鋳造"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業（鋳造）の課題解説",
      "url": "https://crexgroup.com/ja/manufacturing/?p=4275",
      "publisher": "CREX",
      "date": null
    }
  },
  {
    "id": "trend-081",
    "kind": "trend",
    "official": false,
    "title": "ギガキャストで金型需要に危機感",
    "summary": "大きな車体部品を一度に鋳造するギガキャストの採用で、金型需要が減るとの危機感が金型業界で強まっていると報道。差別化を探る動きも紹介された。",
    "industries": [
      "鋳造",
      "金型"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "ギガキャストは町工場にどう響く？",
    "source": {
      "title": "ギガキャストと金型業界",
      "url": "https://newswitch.jp/p/45555",
      "publisher": "ニュースイッチ（日刊工業新聞）",
      "date": null
    }
  },
  {
    "id": "pain-067",
    "kind": "pain",
    "title": "金型・鋳造の中小は研究費が足りない",
    "summary": "金型業界の多くは従業員数十人の中小で、人材確保の難しさ、研究開発の予算不足、価格競争の激化を抱えるとニュースイッチが報じた。",
    "industries": [
      "金型",
      "鋳造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ギガキャストと金型業界",
      "url": "https://newswitch.jp/p/45555",
      "publisher": "ニュースイッチ（日刊工業新聞）",
      "date": null
    }
  },
  {
    "id": "trend-082",
    "kind": "trend",
    "official": true,
    "title": "公設試がギガキャストの講演会",
    "summary": "静岡県工業技術研究所が2026年1月にギガキャストをテーマにした催しを案内。地域の中小にも大型一体鋳造への関心が広がっている。",
    "industries": [
      "鋳造",
      "金型"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ギガキャストに関する開催案内",
      "url": "https://www.iri.pref.shizuoka.jp/wp/wp-content/uploads/2026/01/kaisaiannnai_gigacast.pdf",
      "publisher": "静岡県工業技術研究所",
      "date": "2026-01"
    }
  },
  {
    "id": "question-132",
    "kind": "question",
    "title": "冷間鍛造と熱間鍛造、何が違う？",
    "summary": "熱間は温めて形を変えるため寸法変化が大きく表面も粗く、後で削り直しが要る。冷間は常温で精密な形にでき仕上げを減らせる。大きさと精度で選ぶと答える。",
    "industries": [
      "鍛造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "冷間・熱間・温間鍛造の選び方",
    "source": {
      "title": "鍛造の種類と特徴",
      "url": "https://www.tecnoloblog.com/ja/?p=2696",
      "publisher": "Tecnoloblog",
      "date": null
    }
  },
  {
    "id": "term-105",
    "kind": "term",
    "title": "熱間型鍛造は大量生産向き",
    "summary": "型鍛造は金型代が高い一方、余肉が少なく材料の歩留まりがよいので、数が多いほど経済的になる。発注数で工法が変わる理由として使える。",
    "industries": [
      "鍛造"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "articleIdea": "鍛造は何個から得になる？",
    "source": {
      "title": "鍛造（コトバンク）",
      "url": "https://kotobank.jp/word/鍛造",
      "publisher": "コトバンク",
      "date": null
    }
  },
  {
    "id": "term-106",
    "kind": "term",
    "title": "鍛流線（ファイバーフロー）とは",
    "summary": "金属に圧をかけると結晶がつぶれて線のように伸びる。この流れが形に沿っていると強くなる。断面を観察して流れを確かめる方法もある。",
    "industries": [
      "鍛造"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "鍛造品が強い理由：鍛流線を見てみよう",
    "source": {
      "title": "Observing the metal flow in forged products",
      "url": "https://evidentscientific.com/en/applications/observing-the-metal-flow-in-forged-products",
      "publisher": "Evident",
      "date": null
    }
  },
  {
    "id": "question-133",
    "kind": "question",
    "title": "削り出しより鍛造が強いのはなぜ？",
    "summary": "削り出しは材料の流れを途中で切ってしまうが、鍛造は形に沿って流れが続くため強度や疲れに強いとされる。ただし数値は材料と形しだいなので試験で確かめると添える。",
    "industries": [
      "鍛造",
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "削り出しから鍛造に変えると何が変わる？",
    "source": {
      "title": "Observing the metal flow in forged products",
      "url": "https://evidentscientific.com/en/applications/observing-the-metal-flow-in-forged-products",
      "publisher": "Evident",
      "date": null
    }
  },
  {
    "id": "term-107",
    "kind": "term",
    "title": "自由鍛造と型鍛造の違い",
    "summary": "型鍛造は金型で押しつぶし形に近いものを速く作れる。自由鍛造は型を使わず台の上でたたき、曲げやねじりなど自由が利き大きな品にも向く。",
    "industries": [
      "鍛造"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "型を作らない自由鍛造とは",
    "source": {
      "title": "鉄鋼材料の成形加工法（鋳造、圧延、鍛造）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2601/20/news006_3.html",
      "publisher": "MONOist",
      "date": "2026-01"
    }
  },
  {
    "id": "question-134",
    "kind": "question",
    "title": "鍛造は少量・多品種でも頼める？",
    "summary": "エアスタンプハンマーを使い、自由鍛造と型打ちを組み合わせて小ロット・多品種・多鋼種に対応する工場もある。数と鋼種を先に伝えると話が早い。",
    "industries": [
      "鍛造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "1個から相談できる鍛造品",
    "source": {
      "title": "小ロット鍛鋼品の紹介",
      "url": "https://mono.ipros.com/product/detail/2000501386",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-108",
    "kind": "term",
    "title": "抜き勾配ってなに？",
    "summary": "型から品物を抜くためにつける小さな傾き。後方押出しの鍛造で内外とも勾配なしにできる例もあり、勾配が小さいほど後の削りを減らせる。",
    "industries": [
      "鍛造",
      "鋳造",
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "抜き勾配とは？削りを減らす形の工夫",
    "source": {
      "title": "抜き勾配なしの鍛造品の紹介",
      "url": "https://mono.ipros.com/product/detail/2000147912",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "trend-083",
    "kind": "trend",
    "official": false,
    "title": "大手も鍛造の加工費を値上げ",
    "summary": "愛知製鋼は2022年、電力・燃料、金型、物流などの費用上昇を理由に鍛造品の加工費を約10%上げると発表した。中小が値上げを説明するときの背景になる。",
    "industries": [
      "鍛造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "鍛造品加工費の価格改定について",
      "url": "https://www.aichi-steel.co.jp/news/mt-assets/docs/20220530_news1.pdf",
      "publisher": "愛知製鋼",
      "date": "2022-05"
    }
  },
  {
    "id": "trend-084",
    "kind": "trend",
    "official": true,
    "title": "価格転嫁した製造業は8割超",
    "summary": "ものづくり白書2026の解説で、原材料高や米国関税への対応として価格転嫁を行った製造業が8割を超えたと紹介された。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "ものづくり白書2026を読み解く（1）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2606/05/news069.html",
      "publisher": "MONOist",
      "date": "2026-06"
    }
  },
  {
    "id": "question-135",
    "kind": "question",
    "title": "熱処理は図面に何を書けばいい？",
    "summary": "処理名や温度だけでは性能は決まらない。必要な硬さ、処理する範囲、硬化層の深さ、どこでどう測るかをそろえて書くと、行き違いが減る。",
    "industries": [
      "熱処理"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "熱処理の図面指示、これだけは書いて",
    "source": {
      "title": "熱処理の図面指示ガイド（焼入れ・浸炭・窒化）",
      "url": "https://renue.co.jp/posts/heat-treatment-drawing-hrc-quenching-carburizing-nitriding-guide-2026",
      "publisher": "renue",
      "date": "2026-10"
    }
  },
  {
    "id": "question-136",
    "kind": "question",
    "title": "高周波焼入れの指示で注意する点",
    "summary": "処理する範囲と境目、硬さ、深さの決め方、測る位置をはっきりさせる。どこまで硬くしてよいかの境目を図で示すとよい。",
    "industries": [
      "熱処理"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "高周波焼入れの範囲指示のしかた",
    "source": {
      "title": "熱処理の図面指示ガイド（焼入れ・浸炭・窒化）",
      "url": "https://renue.co.jp/posts/heat-treatment-drawing-hrc-quenching-carburizing-nitriding-guide-2026",
      "publisher": "renue",
      "date": "2026-10"
    }
  },
  {
    "id": "question-137",
    "kind": "question",
    "title": "浸炭焼入れの指示で忘れがちなこと",
    "summary": "表面の硬さだけでなく、中心部に必要な硬さ、硬化層の深さ、浸炭させたくない部分（防炭範囲）も確認する。後で削る面は防炭を検討する。",
    "industries": [
      "熱処理"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "浸炭焼入れの防炭とは？",
    "source": {
      "title": "熱処理の図面指示ガイド（焼入れ・浸炭・窒化）",
      "url": "https://renue.co.jp/posts/heat-treatment-drawing-hrc-quenching-carburizing-nitriding-guide-2026",
      "publisher": "renue",
      "date": "2026-10"
    }
  },
  {
    "id": "term-109",
    "kind": "term",
    "title": "HRC・HV・HBWは同じ硬さ？",
    "summary": "硬さの測り方の違いで、単位を換算するときは注意が要る。薄い層を測るのか全体を測るのかで向く方法が変わる。",
    "industries": [
      "熱処理"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "HRCとHVの違いをやさしく",
    "source": {
      "title": "熱処理の図面指示ガイド（焼入れ・浸炭・窒化）",
      "url": "https://renue.co.jp/posts/heat-treatment-drawing-hrc-quenching-carburizing-nitriding-guide-2026",
      "publisher": "renue",
      "date": "2026-10"
    }
  },
  {
    "id": "term-110",
    "kind": "term",
    "title": "高周波焼入れとは",
    "summary": "電磁誘導で部品の表面だけを短時間で熱し、水などで冷やして表層を硬くする。必要な所だけ硬くでき、表面硬化には複数の方法があり用途で選ぶ。",
    "industries": [
      "熱処理"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "高周波焼入れはどんな部品に向く？",
    "source": {
      "title": "鉄鋼材料の各種熱処理（鉄鋼材料の基礎知識10）",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2605/20/news004_3.html",
      "publisher": "MONOist",
      "date": "2026-05"
    }
  },
  {
    "id": "term-111",
    "kind": "term",
    "title": "窒化は歪みが少ないが層が薄い",
    "summary": "窒化は焼入れのような変態を使わないので寸法の変化が小さく、熱にも強い。一方で硬い層は0.1mm程度と薄く、大きな衝撃には向かない。",
    "industries": [
      "熱処理"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "歪みを嫌う部品は窒化？選び方",
    "source": {
      "title": "nitriding（Weblio辞書）",
      "url": "https://www.weblio.jp/content/nitriding",
      "publisher": "Weblio",
      "date": null
    }
  },
  {
    "id": "term-112",
    "kind": "term",
    "title": "焼戻しはなぜ必要？",
    "summary": "焼入れで硬くなった鋼はもろいので、もう一度温めて粘り強さを戻し組織を落ち着かせる。焼入れと焼戻しはセットで考える。",
    "industries": [
      "熱処理"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "焼入れ・焼戻しをセットで頼む理由",
    "source": {
      "title": "Tempering（Weblio辞書）",
      "url": "https://www.weblio.jp/content/Tempering",
      "publisher": "Weblio",
      "date": null
    }
  },
  {
    "id": "term-113",
    "kind": "term",
    "title": "焼なましと焼ならしの違い",
    "summary": "焼なましは熱してゆっくり冷やし、柔らかく加工しやすくする。焼ならしは少し速く冷やし、鋳造や鍛造で乱れた組織を整えて適度な硬さと粘りを与える。",
    "industries": [
      "熱処理",
      "鍛造",
      "鋳造"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "焼なまし・焼ならし・焼入れ・焼戻しの違い",
    "source": {
      "title": "Normalizing（Weblio辞書）",
      "url": "https://www.weblio.jp/content/Normalizing",
      "publisher": "Weblio",
      "date": null
    }
  },
  {
    "id": "question-138",
    "kind": "question",
    "title": "焼入れ割れを防ぐ形の工夫は？",
    "summary": "割れは角・穴・溝など力が集まる所から始まりやすい。鋭い角に丸みをつけ、厚さの差をゆるやかにし、場合によっては分けて作って後で組む。",
    "industries": [
      "熱処理",
      "切削加工",
      "金型"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "焼入れで割れない部品の形",
    "source": {
      "title": "Cracks in die steel quenching",
      "url": "https://machinemfg.com/cracks-in-die-steel-quenching",
      "publisher": "MachineMFG",
      "date": null
    }
  },
  {
    "id": "pain-068",
    "kind": "pain",
    "title": "大きく複雑な品ほど焼割れが心配",
    "summary": "大型の鍛鋼品では、体積が大きく形が複雑なほど焼入れで割れやすく、冷える速さの大きい冷却液では特に注意が要るとされる。",
    "industries": [
      "熱処理",
      "鍛造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "大型鋳鍛鋼品の熱処理に関する技術資料",
      "url": "https://www.kobelco.co.jp/products/advanced-materials/casting-and-forging/pdf/068-074.pdf",
      "publisher": "神戸製鋼所",
      "date": null
    }
  },
  {
    "id": "question-139",
    "kind": "question",
    "title": "熱処理の特急はなぜ高い？",
    "summary": "真空熱処理は炉にまとめて入れる処理なので、特急だと炉を一回分貸し切ることになり費用がかかる。通常納期とまとめ待ちの理由を説明する。",
    "industries": [
      "熱処理"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "熱処理の納期と特急料金のしくみ",
    "source": {
      "title": "真空熱処理の紹介",
      "url": "https://pr.mono.ipros.com/chuen-ht/product/detail/2000462184/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-114",
    "kind": "term",
    "title": "真空熱処理と光輝処理",
    "summary": "空気の中で熱すると表面が酸化して黒くなるが、真空中なら汚れも抜けて金属本来の光った面のまま仕上がり、酸洗いなどを省ける。金型の焼入れで広く使われる。",
    "industries": [
      "熱処理",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "黒くならない熱処理：真空熱処理とは",
    "source": {
      "title": "工具の表面処理・熱処理講座",
      "url": "https://www.monotaro.com/note/readingseries/kouguhyomensyori/0306/",
      "publisher": "モノタロウ",
      "date": null
    }
  },
  {
    "id": "trend-085",
    "kind": "trend",
    "official": false,
    "title": "中小の価格転嫁率は53.5%",
    "summary": "2025年9月の国のフォローアップ調査で、中小企業のコスト全般の価格転嫁率は53.5%と前回から1.1ポイント上がったが、上昇分の半分強にとどまると報じられた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "中小企業の価格転嫁率は改善",
      "url": "https://www.fptrendy.com/2026/06/03/20260603-020-sme-price-pass-through/",
      "publisher": "FPトレンディ",
      "date": "2026-06"
    }
  },
  {
    "id": "term-115",
    "kind": "term",
    "title": "「HACCPの考え方」とは",
    "summary": "小規模な食品事業者は、7原則どおりの本格HACCPではなく、業界団体が作り国が確認した手引書に沿う「HACCPの考え方を取り入れた衛生管理」で対応できる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "うちの工場の「HACCPの考え方」を写真で紹介",
    "source": {
      "title": "HACCPに沿った衛生管理の制度化",
      "url": "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/haccp/01_00019.html",
      "publisher": "厚生労働省",
      "date": null
    }
  },
  {
    "id": "question-140",
    "kind": "question",
    "title": "小さな工場もHACCPは必要？",
    "summary": "食品の製造・加工に携わる人が50人未満の事業者などは、簡単な方の衛生管理で足りる。発注者向けに「どちらの方式で、どう記録しているか」を書くと安心材料になる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "取引先に聞かれる「HACCP対応してますか？」への答え",
    "source": {
      "title": "HACCPに沿った衛生管理",
      "url": "https://www.city.edogawa.tokyo.jp/e055/kenko/eisei/shokuhin/topics/edogawa_haccp.html",
      "publisher": "江戸川区",
      "date": null
    }
  },
  {
    "id": "pain-069",
    "kind": "pain",
    "title": "衛生管理の計画と記録が負担",
    "summary": "手引書には計画と記録のひな型が付いている。白紙から作らず、業種別手引書のひな型を使えば、小さな工場でも記録を回しやすい。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "shiori_tip",
      "question_example"
    ],
    "source": {
      "title": "HACCPに沿った衛生管理",
      "url": "https://www.city.edogawa.tokyo.jp/e055/kenko/eisei/shokuhin/topics/edogawa_haccp.html",
      "publisher": "江戸川区",
      "date": null
    }
  },
  {
    "id": "term-116",
    "kind": "term",
    "title": "業種別手引書",
    "summary": "業種ごとに業界団体が作った衛生管理の手引き。厚生労働省が内容を確認しホームページで公開している。自社の業種の手引書を確認するのが第一歩。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "HACCPの制度化について",
      "url": "https://www.pref.shimane.lg.jp/life/syoku/anzen/eisei/kisotisiki/haccpseidoka.data/haccp01.pdf",
      "publisher": "島根県",
      "date": null
    }
  },
  {
    "id": "trend-086",
    "kind": "trend",
    "official": true,
    "title": "手引書づくりのガイダンスは第5版",
    "summary": "厚生労働省は業界団体向けに「手引書策定のためのガイダンス」を公表し、2024年8月に第5版へ改正した。手引書は都道府県等に通知され、運用の統一に使われる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "手引書策定のためのガイダンス",
      "url": "https://www.mhlw.go.jp/content/12401000/001532851.pdf",
      "publisher": "厚生労働省",
      "date": "2024-08"
    }
  },
  {
    "id": "pain-070",
    "kind": "pain",
    "title": "自治体の古い資料に注意",
    "summary": "滋賀県は、平成26年作成の解説書が今の法令と合わない部分があると明記している。古い資料を基に記事を書くと誤りが出るので、最新の手引書で確かめる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "HACCP関連の解説",
      "url": "https://www.pref.shiga.lg.jp/ippan/kurashi/syokunoanzen/16467.html",
      "publisher": "滋賀県",
      "date": null
    }
  },
  {
    "id": "question-141",
    "kind": "question",
    "title": "食品OEMのロットは何で決まる？",
    "summary": "宮城県のOEMマッチングサイトでは、最小ロットを「物による」「内容で変動」とする事業者が多い。品目・工程・容器で変わるため、ロットの決まり方を記事で説明すると親切。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "最小ロットが品目ごとに違う理由",
    "source": {
      "title": "みやぎOEM 事業者詳細",
      "url": "https://www.pref.miyagi.jp/site/miyagi_oem/jigyosha/detail02.html",
      "publisher": "宮城県",
      "date": null
    }
  },
  {
    "id": "question-142",
    "kind": "question",
    "title": "ジェラートや調味料は何個から？",
    "summary": "宮城県の掲載例では、ジェラートは年間2,000個（100mlカップ換算）、調味料は300本以上という目安を出す事業者がある。具体的な数字をサイトに出すと問い合わせの前に判断できる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "みやぎOEM 仙台地域の事業者",
      "url": "https://www.pref.miyagi.jp/site/miyagi_oem/chiiki/sendai.html",
      "publisher": "宮城県",
      "date": null
    }
  },
  {
    "id": "question-143",
    "kind": "question",
    "title": "試作と本生産は分けて頼める？",
    "summary": "依頼サイトでは、初回は試作と賞味期限を決める検査まで頼み、実商品は最小ロットから始めたいという発注者がいる。試作・検査・本生産の段階別に費用を示すとよい。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "試作から初回生産まで、費用がかかる場面",
    "source": {
      "title": "食品OEMの依頼案件",
      "url": "https://www.biz.ne.jp/subject/toi_detail.html?tid=894601",
      "publisher": "ビズクリップ",
      "date": null
    }
  },
  {
    "id": "buyer-056",
    "kind": "buyer",
    "title": "食品OEM先は依頼サイトで探す人も",
    "summary": "発注者は、食品加工のOEM先を一覧サイトで探し、案件として依頼内容を掲載して受託先を募る方法も使っている。自社の対応品目・ロットが探されやすい言葉で載っているかが鍵。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "食品OEMの依頼先一覧",
      "url": "https://www.biz.ne.jp/subject/food-processing/oem/",
      "publisher": "ビズクリップ",
      "date": null
    }
  },
  {
    "id": "buyer-057",
    "kind": "buyer",
    "title": "県のマッチングサイトで探す",
    "summary": "宮城県は「OEM・商品化サポートマッチングサイト」で県内の受託事業者を地域・ジャンル別に検索できる。県は契約の仲介はしないので、発注者は各社に直接問い合わせる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "みやぎOEM ジャンル別（レシピ）",
      "url": "https://www.pref.miyagi.jp/site/miyagi_oem/genre/recipe.html",
      "publisher": "宮城県",
      "date": null
    }
  },
  {
    "id": "success-044",
    "kind": "success",
    "title": "最小ロットと対応時期を明記",
    "summary": "宮城県の掲載で、ある水産加工会社は最小500個・通年対応・ラベルや原材料表示の作成も可と明記している。条件を先に書くと、合わない問い合わせが減り判断も早い。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "何個から・いつ・どこまで。受託条件を全部書いた理由",
    "source": {
      "title": "みやぎOEM 事業者詳細",
      "url": "https://www.pref.miyagi.jp/site/miyagi_oem/jigyosha/detail44.html",
      "publisher": "宮城県",
      "date": null
    }
  },
  {
    "id": "success-045",
    "kind": "success",
    "title": "できない加工も書いておく",
    "summary": "宮城県掲載のある水産加工会社は、揚げる・焼くは受けず蒸し加工のみ小ロット可と書いている。できないことを書くと、合う客だけが来る。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "shiori_tip",
      "article_idea"
    ],
    "articleIdea": "うちで受けられない加工と、その理由",
    "source": {
      "title": "みやぎOEM 事業者詳細",
      "url": "https://www.pref.miyagi.jp/site/miyagi_oem/jigyosha/detail23.html",
      "publisher": "宮城県",
      "date": null
    }
  },
  {
    "id": "question-144",
    "kind": "question",
    "title": "菓子とレトルトでロットは違う？",
    "summary": "宮城県の掲載例では、同じ事業者でもレトルトは500個から、菓子は100個からと品目でロットが違う。品目別の早見表をサイトに置くと便利。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "みやぎOEM 仙南地域の事業者",
      "url": "https://www.pref.miyagi.jp/site/miyagi_oem/chiiki/sennan.html",
      "publisher": "宮城県",
      "date": null
    }
  },
  {
    "id": "question-145",
    "kind": "question",
    "title": "缶詰は何缶から作れる？",
    "summary": "宮城県掲載のある水産加工会社は、缶詰5,000缶から、レトルトパウチ1,500個から、未満は要相談としている。容器の種類で最小ロットが大きく違うことを伝えたい。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "缶詰とレトルトパウチ、ロットと日持ちの違い",
    "source": {
      "title": "みやぎOEM 事業者詳細",
      "url": "https://www.pref.miyagi.jp/site/miyagi_oem/jigyosha/detail05.html",
      "publisher": "宮城県",
      "date": null
    }
  },
  {
    "id": "question-146",
    "kind": "question",
    "title": "農産物加工はkg単位？",
    "summary": "宮城県掲載の農産物加工の事業者には、最小ロットを200kgとする例がある。個数でなく原料の重さで決まる場合があるので、発注者に分かりやすく換算して示すとよい。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "みやぎOEM 事業者詳細",
      "url": "https://www.pref.miyagi.jp/site/miyagi_oem/jigyosha/detail01.html",
      "publisher": "宮城県",
      "date": null
    }
  },
  {
    "id": "question-147",
    "kind": "question",
    "title": "既存レシピの改良も頼める？",
    "summary": "宮城県の掲載事業者には、100kgからの小ロット製造に加え、既存レシピの改良やベンチマーク品をもとにした設計に対応すると書く例がある。持ち込みレシピの扱いを明記するとよい。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "手づくりレシピを工場の味にするまで",
    "source": {
      "title": "みやぎOEM 事業者詳細",
      "url": "https://www.pref.miyagi.jp/site/miyagi_oem/jigyosha/detail17.html",
      "publisher": "宮城県",
      "date": null
    }
  },
  {
    "id": "success-046",
    "kind": "success",
    "title": "アレルゲン管理や減塩も強みに",
    "summary": "宮城県掲載のある水産加工会社は、HACCP準拠に加え、アレルゲン管理や塩分調整など個別の要望に応じると書いている。発注者の困りごとに合わせた対応力は言葉にして載せる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "みやぎOEM 事業者詳細",
      "url": "https://www.pref.miyagi.jp/site/miyagi_oem/jigyosha/detail42.html",
      "publisher": "宮城県",
      "date": null
    }
  },
  {
    "id": "buyer-058",
    "kind": "buyer",
    "title": "福祉事業所も受託先の候補",
    "summary": "宮城県のマッチングサイトには社会福祉法人の事業所も載っており、レトルトや菓子を小ロットで受けている。小ロット希望の発注者にとって候補が広がる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "みやぎOEM 事業者詳細",
      "url": "https://www.pref.miyagi.jp/site/miyagi_oem/jigyosha/detail28.html",
      "publisher": "宮城県",
      "date": null
    }
  },
  {
    "id": "pain-071",
    "kind": "pain",
    "title": "受託先リストの情報が古くなる",
    "summary": "宮城県の水産加工の受託製造リストは令和4年3月時点。公的な一覧は更新が遅れがちなので、自社サイトで最新の対応品目・ロットを出しておくことが大切。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "水産加工の受託製造リスト",
      "url": "https://www.pref.miyagi.jp/documents/37861/oemlist.pdf",
      "publisher": "宮城県",
      "date": "2022-03"
    }
  },
  {
    "id": "buyer-059",
    "kind": "buyer",
    "title": "レトルト加工の受託先を探す",
    "summary": "宮城県はジャンル別に、レトルト加工などを受ける事業者を一覧で見られるようにしている。業務用から小売の個包装まで小ロットで扱う例もあり、ジャンル名での掲載が探されやすい。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "みやぎOEM ジャンル別（レトルト）",
      "url": "https://www.pref.miyagi.jp/site/miyagi_oem/genre/nousanbutsuretoruto.html",
      "publisher": "宮城県",
      "date": null
    }
  },
  {
    "id": "question-148",
    "kind": "question",
    "title": "小ロットから始める方法は？",
    "summary": "小ロットからOEMを始める方法を解説する記事があり、在庫を抱えず試したい個人・D2C事業者の関心は高い。小ロット可否と単価の関係を説明する記事は需要がある。",
    "industries": [
      "食品製造",
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "小ロットで始めるとき、単価が上がる理由",
    "source": {
      "title": "小ロットから始めるOEMの解説",
      "url": "https://www.theckb.com/?p=20197",
      "publisher": "THE CKB",
      "date": null
    }
  },
  {
    "id": "question-149",
    "kind": "question",
    "title": "レシピは誰のものになる？",
    "summary": "レシピ開発を外部に頼むと、完成したレシピの権利がどちらに帰属するか不安になりやすい。依頼前に契約書で帰属・守秘を決めておく必要があると解説されている。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "お預かりしたレシピの扱いについて",
    "source": {
      "title": "パンや菓子のレシピ開発を頼む時の権利と守秘",
      "url": "https://atsoho.com/blog/recipe-development-rights-confidentiality",
      "publisher": "atsoho",
      "date": "2026"
    }
  },
  {
    "id": "question-150",
    "kind": "question",
    "title": "レシピの秘密はどう守る？",
    "summary": "海外の法律事務所は、レシピを文書化し、見られる人を絞り、外注先とも秘密保持契約を結ぶことを勧める。何でも秘密扱いにすると管理を示しにくいとも指摘。",
    "industries": [
      "食品製造",
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "レシピの守秘はどこまで？工場の管理方法",
    "source": {
      "title": "Recipe & Trade Secret Protection",
      "url": "https://www.daeryunlaw.com/ja/insights/recipe-and-trade-secret-protection-in-new-york",
      "publisher": "Daeryun Law",
      "date": null
    }
  },
  {
    "id": "question-151",
    "kind": "question",
    "title": "食品を売るのに許可は必要？",
    "summary": "食品の販売には食品衛生責任者と、食品衛生法に基づく営業許可が必要とされる。OEMで作る場合も、売る側に何が要るかを受託側が説明できると発注者は安心する。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "OEMで食品を売るときに発注者がそろえるもの",
    "source": {
      "title": "個人事業主のOEM活用",
      "url": "https://sogyotecho.jp/oem-soleproprietorship/",
      "publisher": "創業手帳",
      "date": null
    }
  },
  {
    "id": "buyer-060",
    "kind": "buyer",
    "title": "個人事業主もOEMを使う",
    "summary": "創業手帳は個人事業主向けにOEMの活用法を紹介しており、個人起業家も発注者になっている。法人向けとは別に、初めての人向けの説明ページを用意するとよい。",
    "industries": [
      "食品製造",
      "化粧品OEM"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "個人事業主のOEM活用",
      "url": "https://sogyotecho.jp/oem-soleproprietorship/",
      "publisher": "創業手帳",
      "date": null
    }
  },
  {
    "id": "buyer-061",
    "kind": "buyer",
    "title": "商品開発を外部の個人に頼む人も",
    "summary": "スキル販売サイトには商品開発の代行メニューも出ており、発注者は工場の前に開発支援者に相談することがある。開発支援者との連携を書いておくと入口が増える。",
    "industries": [
      "食品製造",
      "化粧品OEM"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "商品開発の出品サービス",
      "url": "https://www.lancers.jp/menu/detail/1233031",
      "publisher": "ランサーズ",
      "date": null
    }
  },
  {
    "id": "term-117",
    "kind": "term",
    "title": "OEMとは",
    "summary": "OEMは、他社のブランドの商品を受託して作ること。決済サービスの解説でも小売・飲食事業者向けに紹介されており、言葉は知っていても仕組みを知らない発注者は多い。",
    "industries": [
      "食品製造",
      "化粧品OEM"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "OEMとPBの違いを、うちの仕事でたとえると",
    "source": {
      "title": "OEMとは",
      "url": "https://squareup.com/jp/ja/townsquare/what-is-oem",
      "publisher": "Square",
      "date": null
    }
  },
  {
    "id": "term-118",
    "kind": "term",
    "title": "製造所固有記号",
    "summary": "容器の「製造者」の代わりに、消費者庁に届け出た記号で工場を示す仕組み。OEMでは委託先工場の名前の代わりに販売者の名称・所在地を表示できる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "OEM商品のラベルで工場名が出ない理由",
    "source": {
      "title": "製造所固有記号制度",
      "url": "https://www.pref.gunma.jp/uploaded/attachment/20404.pdf",
      "publisher": "群馬県",
      "date": null
    }
  },
  {
    "id": "question-152",
    "kind": "question",
    "title": "OEMの表示は販売者名だけでいい？",
    "summary": "製造所固有記号を使えば、委託先工場名の代わりに販売者名と所在地を表示できる。ただし乳・乳製品ではこの方法は認められず、製造者の表示が必要とされる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "製造所固有記号に関するQ&A",
      "url": "https://www.pref.ehime.jp/uploaded/attachment/53037.pdf",
      "publisher": "愛媛県",
      "date": null
    }
  },
  {
    "id": "pain-072",
    "kind": "pain",
    "title": "表示の運用は2016年に大きく変化",
    "summary": "製造所固有記号は平成28年4月の食品表示基準で使用条件や届出方法が大きく変わった。昔のやり方のまま説明していないか、見直しが要る。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造所固有記号に関する資料",
      "url": "https://www.pref.ehime.jp/uploaded/attachment/53036.pdf",
      "publisher": "愛媛県",
      "date": null
    }
  },
  {
    "id": "term-119",
    "kind": "term",
    "title": "栄養成分表示の5項目",
    "summary": "包装された一般用加工食品は、熱量・たんぱく質・脂質・炭水化物・食塩相当量の5項目の表示が原則義務。2020年4月から全面的に義務化された。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "栄養成分表示、5項目の意味",
    "source": {
      "title": "栄養成分表示について",
      "url": "https://www.city.osaka.lg.jp/kenko/cmsfiles/contents/0000537/537479/200904_1.pdf",
      "publisher": "大阪市",
      "date": null
    }
  },
  {
    "id": "question-153",
    "kind": "question",
    "title": "小さな会社は栄養表示を省ける？",
    "summary": "小規模事業者は「当分の間」栄養成分表示を省略できる。目安は従業員おおむね20人以下（商業・サービス業は5人以下）。ただし大きな小売が販売する場合は省けない。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "栄養成分表示、うちは省略できる？",
    "source": {
      "title": "栄養成分表示の資料",
      "url": "https://www.pref.tokushima.lg.jp/file/attachment/882504.pdf",
      "publisher": "徳島県",
      "date": null
    }
  },
  {
    "id": "question-154",
    "kind": "question",
    "title": "栄養成分は計算で出していい？",
    "summary": "表示値は日本食品標準成分表などを使った計算の「推定値」でもよい。ただし根拠のレシピやデータを保管しておく必要がある。許容差を超えると違反になる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "分析しない栄養成分表示の作り方",
    "source": {
      "title": "食品表示・栄養成分表示の手引き",
      "url": "https://www.zenshoren.or.jp/wordpress/wp-content/themes/zenshoren/img/member/0214_syokuhin01.pdf",
      "publisher": "全国商工団体連合会",
      "date": null
    }
  },
  {
    "id": "pain-073",
    "kind": "pain",
    "title": "栄養の言葉を入れると省略できない",
    "summary": "容器に「たんぱく質」「ミネラル」など栄養成分に関する表示をすると、小規模事業者でも栄養成分表示を省略できない。パッケージの文言を決める前に確認が必要。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "栄養成分表示の資料",
      "url": "https://www.pref.tokushima.lg.jp/file/attachment/882504.pdf",
      "publisher": "徳島県",
      "date": null
    }
  },
  {
    "id": "term-120",
    "kind": "term",
    "title": "消費期限と賞味期限",
    "summary": "消費期限は安全に食べられる期限で弁当・そうざいなど、賞味期限はおいしさなど品質が保てる期限でスナック菓子・カップめんなどに使う。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "消費期限と賞味期限、うちの商品はどっち？",
    "source": {
      "title": "消費期限と賞味期限",
      "url": "https://www.city.hiroshima.lg.jp/business/shokuhin-eisei/1051265/1014236.html",
      "publisher": "広島市",
      "date": null
    }
  },
  {
    "id": "question-155",
    "kind": "question",
    "title": "賞味期限は誰が決める？",
    "summary": "期限は製造・加工する事業者が科学的・合理的な根拠に基づき責任を持って決める。OEMでは誰が試験し誰が決めるかを契約時に話し合うと揉めにくい。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "賞味期限の決め方、試験から表示まで",
    "source": {
      "title": "期限設定の考え方",
      "url": "https://www.city.niigata.lg.jp:443/iryo/shoku/hyouji/hyouuji.files/kigennsettei.pdf",
      "publisher": "新潟市",
      "date": null
    }
  },
  {
    "id": "question-156",
    "kind": "question",
    "title": "期限設定にはどんな試験をする？",
    "summary": "新潟市の資料では、微生物試験（一般細菌・大腸菌群・カビ・酵母など）、理化学試験（水分・pH・過酸化物価など）、官能試験を挙げ、販売予定より少し長い期間で試すとしている。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "期限設定の考え方",
      "url": "https://www.city.niigata.lg.jp:443/iryo/shoku/hyouji/hyouuji.files/kigennsettei.pdf",
      "publisher": "新潟市",
      "date": null
    }
  },
  {
    "id": "buyer-062",
    "kind": "buyer",
    "title": "日持ちの検査は公的機関でも",
    "summary": "山口県は一般生菌数・大腸菌数などの検査や水分活性の測定を案内している。発注者は期限設定の検査先を探しており、受託側が検査先を紹介できると強み。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "食品の検査のご案内",
      "url": "https://www.pref.yamaguchi.lg.jp/uploaded/attachment/227760.pdf",
      "publisher": "山口県",
      "date": null
    }
  },
  {
    "id": "trend-087",
    "kind": "trend",
    "official": true,
    "title": "期限表示ガイドラインを改正",
    "summary": "消費者庁は2017年策定の食品期限表示の設定ガイドラインを見直し、2025年に改正した。改正案の意見募集は2025年2月7日〜3月10日に行われた。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "食品期限表示の設定のためのガイドライン改正案の意見募集",
      "url": "https://www.caa.go.jp/notice/entry/041074/",
      "publisher": "消費者庁",
      "date": "2025-02"
    }
  },
  {
    "id": "trend-088",
    "kind": "trend",
    "official": false,
    "title": "安全係数「0.8以上」の目安を削除",
    "summary": "改正で、期限計算に使う安全係数の0.8以上という目安が削除され、1に近づけることが望ましいとされたと報じられた。必要以上に短い期限を減らし食品ロスを抑える狙い。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "安全係数の見直しで、賞味期限はどう変わる？",
    "source": {
      "title": "期限表示GLの安全係数「0.8以上」を削除",
      "url": "https://data-max.co.jp/article/78029",
      "publisher": "データ・マックス",
      "date": null
    }
  },
  {
    "id": "pain-074",
    "kind": "pain",
    "title": "根拠なく期限を延ばす不安",
    "summary": "日本生協連は、根拠なく安全係数を1に近づけると品質トラブルになりかねず、製造のばらつきや流通中の温度変動も考えるべきと意見した。延ばすなら試験の根拠が要る。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "期限表示ガイドライン改正案への意見",
      "url": "https://jccu.coop/info/up_item/suggestion_20250310_01_01.pdf",
      "publisher": "日本生活協同組合連合会",
      "date": "2025-03"
    }
  },
  {
    "id": "pain-075",
    "kind": "pain",
    "title": "期限表示の改正を知らない",
    "summary": "飲食店向けメディアのアンケートで、期限表示ガイドラインの改正内容を詳しく知っていたのは7.9%にとどまった。制度の変更を分かりやすく解説する記事は役に立つ。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "賞味期限ガイドライン改正、作り手が見直すこと",
    "source": {
      "title": "期限表示ガイドライン改正の解説",
      "url": "https://www.inshokuten.com/foodist/article/7940/",
      "publisher": "飲食店.COM",
      "date": null
    }
  },
  {
    "id": "trend-089",
    "kind": "trend",
    "official": true,
    "title": "カシューナッツが表示義務に",
    "summary": "2026年4月1日の食品表示基準改正で、カシューナッツがアレルギー表示義務のある特定原材料に加わり、ピスタチオが推奨品目に入った。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "カシューナッツの表示義務化、うちの対応",
    "source": {
      "title": "食物アレルギー表示（カシューナッツ追加）",
      "url": "https://www.pref.yamanashi.jp/shokuhin-st/shokuhinhyouji/kurumi.html",
      "publisher": "山梨県",
      "date": null
    }
  },
  {
    "id": "trend-090",
    "kind": "trend",
    "official": true,
    "title": "表示切り替えは2028年3月まで猶予",
    "summary": "カシューナッツ追加の経過措置として、令和10年3月31日までに製造・加工・輸入された食品は従来の表示でよいとされている。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "食物アレルギー表示（カシューナッツ追加）",
      "url": "https://www.pref.yamanashi.jp/shokuhin-st/shokuhinhyouji/kurumi.html",
      "publisher": "山梨県",
      "date": null
    }
  },
  {
    "id": "term-121",
    "kind": "term",
    "title": "特定原材料は9品目",
    "summary": "表示が義務のアレルゲンは、えび・かに・くるみ・小麦・そば・卵・乳・落花生・カシューナッツの9品目。くるみは2023年3月に義務化された。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "アレルギー表示の9品目と20品目の違い",
    "source": {
      "title": "アレルギー表示について",
      "url": "https://www.pref.aichi.jp/eiseiken/5f/allergy.html",
      "publisher": "愛知県衛生研究所",
      "date": null
    }
  },
  {
    "id": "term-122",
    "kind": "term",
    "title": "特定原材料に準ずるもの",
    "summary": "表示が推奨される品目で、アーモンドやマカダミアナッツ、新たに加わったピスタチオなどが含まれる。義務ではないが、発注者や消費者からは聞かれやすい。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "アレルギー表示",
      "url": "https://www.pref.kyoto.jp/shoku-kawaraban/allergie01.html",
      "publisher": "京都府",
      "date": null
    }
  },
  {
    "id": "question-157",
    "kind": "question",
    "title": "なぜカシューナッツが義務に？",
    "summary": "名古屋市衛生研究所の資料では、全国調査で症例数が増え、公定の検査法が確立されたことから義務表示に移ったと説明されている。理由まで書くと読み手が納得しやすい。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "衛研だより No.140",
      "url": "https://www.city.nagoya.jp/_res/projects/default_project/_page_/001/052/633/eikendayori_no.140.pdf",
      "publisher": "名古屋市衛生研究所",
      "date": null
    }
  },
  {
    "id": "trend-091",
    "kind": "trend",
    "official": true,
    "title": "個別品目の表示ルールを整理中",
    "summary": "消費者庁は個別品目ごとの表示ルールを横断的な基準に合わせる方向で見直し、2025年3月に20品目、2026年4月に22品目の基準を改正した。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "食品表示に関する制度改正状況について（2026年版）",
      "url": "https://www.label-bank.co.jp/blog/foodlabel/202601foodlabel",
      "publisher": "ラベルバンク",
      "date": "2026-01"
    }
  },
  {
    "id": "trend-092",
    "kind": "trend",
    "official": false,
    "title": "表示事項を4つの区分で整理",
    "summary": "2025年11月の分科会では、残る個別ルールを「衛生上必要なら維持」「横断表示で代えられれば廃止」「品質に関するものは廃止」「監視に必要なら維持」の方向で整理した。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "食品表示制度の動向 2026年4月1日改正食品表示基準を中心に",
      "url": "https://food.uchida-it.co.jp/seminarreport/20260519/",
      "publisher": "食品ITnavi",
      "date": "2026-05"
    }
  },
  {
    "id": "trend-093",
    "kind": "trend",
    "official": true,
    "title": "表示のデジタル化は補完扱い",
    "summary": "消費者庁の分科会では、二次元コードなどデジタルツールの活用は容器包装の表示を置き換えるものでなく、事業者が選べる補完手段とする考えが示された。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "食品表示へのデジタルツール活用検討分科会 議事録",
      "url": "https://www.caa.go.jp/policies/policy/food_labeling/meeting_materials/assets/food_labeling_cms201_241028_01.pdf",
      "publisher": "消費者庁",
      "date": "2024-10"
    }
  },
  {
    "id": "trend-094",
    "kind": "trend",
    "official": true,
    "title": "2026年4月施行の表示基準改正",
    "summary": "消費者庁食品表示課の資料（令和8年1月）は、アレルギー表示の対象品目改正と個別品目の表示ルール見直しを柱とする食品表示基準の改正内容を示している。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "食品表示基準の一部改正について",
      "url": "https://www.cao.go.jp/consumer/kabusoshiki/syokuhinhyouji/doc/260206_shiryou2.pdf",
      "publisher": "消費者庁食品表示課(消費者委員会資料)",
      "date": "2026-01"
    }
  },
  {
    "id": "trend-095",
    "kind": "trend",
    "official": false,
    "title": "栄養士会も改正内容を周知",
    "summary": "日本栄養士会は2026年の食品表示基準一部改正について会員向けに情報を出している。発注者側の栄養士・飲食店にも制度変更が届いている。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "食品表示基準の一部改正等について",
      "url": "https://www.dietitian.or.jp/trends/2026/488.html",
      "publisher": "日本栄養士会",
      "date": "2026"
    }
  },
  {
    "id": "trend-096",
    "kind": "trend",
    "official": false,
    "title": "機能性表示食品に報告義務",
    "summary": "紅麹問題を受け、2024年9月1日から機能性表示食品の届出者に健康被害情報の収集と行政への報告が義務づけられた。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "機能性表示食品の制度改正で、受託工場に求められること",
    "source": {
      "title": "改正・機能性表示食品制度が9月1日スタート",
      "url": "https://data-max.co.jp/article/73210",
      "publisher": "データ・マックス",
      "date": "2024-09"
    }
  },
  {
    "id": "trend-097",
    "kind": "trend",
    "official": false,
    "title": "サプリにGMPが必須に",
    "summary": "改正制度では、サプリメント形状の機能性表示食品にGMPに基づく製造・品質管理が要件となった。受託工場はGMP対応の有無が選ばれる条件になる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "機能性表示食品制度の改正",
      "url": "https://www.yakuji.co.jp/entry110068.html",
      "publisher": "薬事日報",
      "date": "2024"
    }
  },
  {
    "id": "pain-076",
    "kind": "pain",
    "title": "報告まで2カ月かかった反省",
    "summary": "紅麹問題では、健康被害情報を把握してから行政に届くまで約2カ月かかり、その間に被害が広がったことが問題視された。迅速な報告体制が求められる背景。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "改正・機能性表示食品制度が9月1日スタート",
      "url": "https://data-max.co.jp/article/73210",
      "publisher": "データ・マックス",
      "date": "2024-09"
    }
  },
  {
    "id": "pain-077",
    "kind": "pain",
    "title": "報告期限があいまいとの声",
    "summary": "日本生協連は制度改正案に対し、報告を「速やかに」とするだけで具体的な期限が示されていないと指摘した。受託側は届出者と報告の流れを決めておく必要がある。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "機能性表示食品制度改正案への意見",
      "url": "https://jccu.coop/info/up_item/suggestion_20241004_01_01.pdf",
      "publisher": "日本生活協同組合連合会",
      "date": "2024-10"
    }
  },
  {
    "id": "question-158",
    "kind": "question",
    "title": "サプリは何個から作れる？",
    "summary": "PR TIMESのリリースでは、あるOEM会社が500個から対応し、錠剤・カプセル・顆粒・ドリンク・ゼリー・グミなど多様な剤形を扱うとしている。剤形別の最小ロットを出すと親切。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "サプリの剤形、錠剤・カプセル・グミの選び方",
    "source": {
      "title": "サプリメントOEMのリリース",
      "url": "https://prtimes.jp/main/html/rd/p/000000008.000181461.html",
      "publisher": "PR TIMES",
      "date": null
    }
  },
  {
    "id": "trend-098",
    "kind": "trend",
    "official": false,
    "title": "グミ形状のサプリが伸びる",
    "summary": "サプリOEMの紹介では、従来の錠剤・カプセルに加え、グミ形状の需要が急速に広がっているとされる。新しい剤形への対応は発信のネタになる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "グミサプリは何が難しい？作り手の視点",
    "source": {
      "title": "Food supplement OEM service",
      "url": "https://mono.ipros.com/en/cg3/Food supplement OEM service",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-063",
    "kind": "buyer",
    "title": "サプリOEMはポータルで比較",
    "summary": "イプロスにはサプリメントや食品OEMの受託企業が一覧で並び、発注者は剤形や小ロットの条件で比べる。掲載情報に剤形・ロット・試作の可否を書き分けたい。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "OEM製造 メーカー一覧",
      "url": "https://mono.ipros.com/cg1/OEM製造/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-159",
    "kind": "question",
    "title": "化粧品OEMは何個から？",
    "summary": "ECのミカタによると、STORESとサティス製薬の連携では初回100個から作れ、通常は1,000個以上が一般的とされる。小ロットの可否は発注者が最初に聞く点。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "化粧品は何個から作れる？ロットと単価の関係",
    "source": {
      "title": "STORESがサティス製薬と連携 オリジナル化粧品の開発支援",
      "url": "https://ecnomikata.com/ecnews/35199/",
      "publisher": "ECのミカタ",
      "date": null
    }
  },
  {
    "id": "question-160",
    "kind": "question",
    "title": "化粧品OEMの予算はいくら？",
    "summary": "韓国のCosmepolitanは新興ブランド向けに最小1,000個・最短3カ月・開発予算80万円からのプランを公表した。費用の目安を示すと、比べる発注者に選ばれやすい。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "Cosmepolitanが新興ブランド向け化粧品OEMプラン",
      "url": "https://ecnomikata.com/ecnews/35185/",
      "publisher": "ECのミカタ",
      "date": null
    }
  },
  {
    "id": "trend-099",
    "kind": "trend",
    "official": false,
    "title": "ECサービスと工場が組む",
    "summary": "ネットショップ作成サービスのSTORESが化粧品OEMのサティス製薬と連携し、中小事業者のオリジナル化粧品づくりを支援。販売の場と製造をつなぐ動きが出ている。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "STORESがサティス製薬と連携 オリジナル化粧品の開発支援",
      "url": "https://ecnomikata.com/ecnews/35199/",
      "publisher": "ECのミカタ",
      "date": null
    }
  },
  {
    "id": "success-047",
    "kind": "success",
    "title": "最低ロットを先に示す",
    "summary": "イプロスに掲載された化粧品メーカーは、発注の最低ロットを1,000本からと明示し、在庫リスクを抑えられると訴えている。条件の明記は比較の土台に乗る第一歩。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "化粧品OEM（イプロス掲載）",
      "url": "https://pr.mono.ipros.com/orioncosmetics/product/detail/2000964875",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-064",
    "kind": "buyer",
    "title": "化粧品OEM先は品目で探す",
    "summary": "イプロスの化粧品カテゴリでは、オールインワンジェル、リップ、固形石鹸、化粧水、入浴剤など品目ごとに小ロット対応の会社が並ぶ。得意品目を明記すると見つかりやすい。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "化粧品 メーカー・企業一覧",
      "url": "https://www.ipros.com/cg2/化粧品/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-123",
    "kind": "term",
    "title": "製造販売業許可",
    "summary": "自社ブランドの化粧品を市場に出すための許可。品質と安全に最終責任を負い、出荷後の安全情報の収集も担う。この許可だけでは製造作業はできない。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "化粧品の製造販売業と製造業、2つの許可の違い",
    "source": {
      "title": "化粧品製造販売業・製造業許可の種類",
      "url": "https://www.shigyo.co.jp/kyoninka/keshohin/keshohin_shurui.html",
      "publisher": "行政書士法人シグマ",
      "date": null
    }
  },
  {
    "id": "term-124",
    "kind": "term",
    "title": "化粧品製造業許可",
    "summary": "製造・包装・表示・保管などを行う場所ごとに取る許可。設備が基準に合うかが審査される。輸入品にラベルを貼る国内拠点にも必要。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "化粧品の許可に関する資料",
      "url": "https://www.pref.aichi.jp/uploaded/attachment/443647.pdf",
      "publisher": "愛知県",
      "date": null
    }
  },
  {
    "id": "question-161",
    "kind": "question",
    "title": "発注者も許可が必要？",
    "summary": "製造販売業許可を持つOEMメーカーに製造から出荷まで任せれば、発注者が許可を取らずに済む形がある。ただし判断は都道府県の薬務課などへの事前相談が確実。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "オリジナル化粧品、許可がなくても作れる？",
    "source": {
      "title": "化粧品を仕入れて売る副業の法律関係",
      "url": "https://atsoho.com/blog/cosmetics-resale-side-job-license",
      "publisher": "atsoho",
      "date": "2026"
    }
  },
  {
    "id": "question-162",
    "kind": "question",
    "title": "仕入れて売るだけなら？",
    "summary": "すでに流通する化粧品を仕入れて売るだけなら許可は不要とされる。ただし表示のルールは守る必要がある。副業の個人からよく出る疑問。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "化粧品を仕入れて売る副業の法律関係",
      "url": "https://atsoho.com/blog/cosmetics-resale-side-job-license",
      "publisher": "atsoho",
      "date": "2026"
    }
  },
  {
    "id": "trend-100",
    "kind": "trend",
    "official": false,
    "title": "許可は5年ごとに更新",
    "summary": "化粧品の製造販売業許可には有効期限があり、5年ごとに更新の手続きが要る。発注者が自社で許可を取るか迷うときの判断材料になる。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "化粧品製造販売業・製造業許可の種類",
      "url": "https://www.shigyo.co.jp/kyoninka/keshohin/keshohin_shurui.html",
      "publisher": "行政書士法人シグマ",
      "date": null
    }
  },
  {
    "id": "buyer-065",
    "kind": "buyer",
    "title": "自社で許可を取るか検討する",
    "summary": "神奈川県は化粧品製造販売業の取得を検討する人向けの資料を出している。発注者は自社取得とOEM先への委託を比べており、両方の違いを説明する記事が役立つ。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "化粧品製造販売業の取得検討",
      "url": "https://www.pref.kanagawa.jp/documents/9979/keshouhinseihan-shutokukentou.pdf",
      "publisher": "神奈川県",
      "date": null
    }
  },
  {
    "id": "question-163",
    "kind": "question",
    "title": "化粧品OEMの流れは？",
    "summary": "日本郵便のコラムは、化粧品OEMの仕組みと進め方を事業者向けに紹介している。企画・処方・試作・容器・製造の流れを順に示すと、初めての発注者が計画を立てやすい。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "企画から発売まで、化粧品OEMの7つの段階",
    "source": {
      "title": "化粧品OEMとは",
      "url": "https://www.post.japanpost.jp/bizpost/column/sales_promotion22/cosmetics-oem/",
      "publisher": "日本郵便",
      "date": null
    }
  },
  {
    "id": "pain-078",
    "kind": "pain",
    "title": "流れが分からず計画が組めない",
    "summary": "化粧品OEMの解説では、製造の流れが分からないと事業計画やスケジュールを細かく組めないことが発注者の悩みとされ、OEM会社にも得意・不得意があるとされる。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "化粧品OEMの流れ",
      "url": "https://www.commercepick.com/archives/77120",
      "publisher": "コマースピック",
      "date": null
    }
  },
  {
    "id": "term-125",
    "kind": "term",
    "title": "化粧品の効能56項目",
    "summary": "一般の化粧品がうたえる効能効果は56項目に限られ、それ以外は事実でも書けない。薬用化粧品（医薬部外品）は承認された範囲で表現できる。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "化粧品で言っていいこと・言えないこと",
    "source": {
      "title": "化粧品広告の表現",
      "url": "https://www.lycbiz.com/jp/column/ly-ads/marketing/cosmetic-ads-expression/?list=14311",
      "publisher": "LINEヤフー for Business",
      "date": null
    }
  },
  {
    "id": "question-164",
    "kind": "question",
    "title": "「即効美白」は使える？",
    "summary": "断定的な「即効美白」などはNGとされ、「肌にハリを与える」「キメを整える」など56項目の範囲の表現に言い換えるよう勧められている。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "化粧品広告の表現",
      "url": "https://www.lycbiz.com/jp/column/ly-ads/marketing/cosmetic-ads-expression/?list=14311",
      "publisher": "LINEヤフー for Business",
      "date": null
    }
  },
  {
    "id": "term-126",
    "kind": "term",
    "title": "薬機法第66条",
    "summary": "化粧品の効能について、はっきり書くか暗示するかを問わず、うそや大げさな広告を禁じる条文。SNS投稿や口コミの引用にも注意がいる。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "化粧品の広告規制",
      "url": "https://stock-sun.com/column/advertising-cosmetics",
      "publisher": "ストックサン",
      "date": null
    }
  },
  {
    "id": "buyer-066",
    "kind": "buyer",
    "title": "違反事例は自治体が公開",
    "summary": "静岡県は化粧品などの広告の違反事例をまとめた資料を出している。発注者は広告表現に不安を持っており、受託側が違反例を踏まえて助言できると頼られる。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "化粧品等の違反事例",
      "url": "https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/025/361/ihanjirei66.pdf",
      "publisher": "静岡県",
      "date": null
    }
  },
  {
    "id": "pain-079",
    "kind": "pain",
    "title": "SNSでの表現も規制の対象",
    "summary": "SNSの投稿でも薬機法の広告規制がかかると解説されている。D2Cブランドはインフルエンサー投稿で表現を誤りやすく、作り手側からの注意喚起が喜ばれる。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "SNSと薬機法",
      "url": "https://www.ownly.jp/sslab/sns-pmda",
      "publisher": "オウンリー",
      "date": null
    }
  },
  {
    "id": "pain-080",
    "kind": "pain",
    "title": "根拠法を取り違えやすい",
    "summary": "化粧品の広告NG例は、記事によって薬機法とするもの、景品表示法とするものがある。記事にするときは最新の厚生労働省の通知や自治体資料で確かめたい。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "化粧品広告の注意点",
      "url": "https://ecnomikata.com/column/30861/",
      "publisher": "ECのミカタ",
      "date": null
    }
  },
  {
    "id": "term-127",
    "kind": "term",
    "title": "オフセットとオンデマンドの違い",
    "summary": "オフセットは版を作って刷るので大部数ほど1枚が安く、色も細かい。オンデマンドは版なしでデータから直接刷るので、少部数・急ぎに向く。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "何部からオフセット？印刷方式の選び方",
    "source": {
      "title": "オンデマンド印刷とオフセット印刷の違い",
      "url": "https://imitsu.jp/matome/printing/on-demand-offset-printing-difference",
      "publisher": "アイミツ",
      "date": null
    }
  },
  {
    "id": "question-165",
    "kind": "question",
    "title": "何部を超えたらオフセットが得？",
    "summary": "版代を部数で割れるので、部数が多いほどオフセットが有利。数千部が目安とする解説がある。答えでは用紙や色数で境目が動くこと、見積もりで比べることを添える。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "部数別に見る印刷方式の損益分岐",
    "source": {
      "title": "オンデマンド印刷とオフセット印刷の違い",
      "url": "https://imitsu.jp/matome/printing/on-demand-offset-printing-difference",
      "publisher": "アイミツ",
      "date": null
    }
  },
  {
    "id": "question-166",
    "kind": "question",
    "title": "途中で内容を直せる？",
    "summary": "オンデマンドは版がないので、データを差し替えるだけで修正しやすい。オフセットは版の作り直しになる。答えでは修正の締め切りと費用の差を書く。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "オンデマンド印刷とオフセット印刷の違い",
      "url": "https://imitsu.jp/matome/printing/on-demand-offset-printing-difference",
      "publisher": "アイミツ",
      "date": null
    }
  },
  {
    "id": "term-128",
    "kind": "term",
    "title": "バリアブル印刷とは",
    "summary": "宛名や連番など、1枚ずつ中身を変えて刷る方法。版のないオンデマンド印刷の得意分野。DMや会員証、シリアル入りの札などで使われる。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "1枚ずつ違う印刷でできること",
    "source": {
      "title": "オンデマンド印刷とオフセット印刷の違い",
      "url": "https://imitsu.jp/matome/printing/on-demand-offset-printing-difference",
      "publisher": "アイミツ",
      "date": null
    }
  },
  {
    "id": "question-167",
    "kind": "question",
    "title": "オンデマンドの弱点は？",
    "summary": "手軽で安い反面、トナー由来の色ムラが出やすく、精密な表現には向かないとされる。答えでは用途ごとに許容できるかを一緒に考える姿勢を示す。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "オンデマンド印刷のデメリット",
      "url": "https://imitsu.jp/matome/printing/on-demand-printing-disadvantages",
      "publisher": "アイミツ",
      "date": null
    }
  },
  {
    "id": "buyer-067",
    "kind": "buyer",
    "title": "小ロット名刺はオンデマンド対応で探す",
    "summary": "少ない枚数の名刺を頼みたい人には、オンデマンド印刷に対応する会社が勧められている。対応方式と最小枚数をWebに書いておくと探す人に見つかりやすい。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "名刺は何枚から？少部数の頼み方",
    "source": {
      "title": "名刺印刷 小ロットに強い会社",
      "url": "https://imitsu.jp/list/printing/businesscardprinting-smalllot/",
      "publisher": "アイミツ",
      "date": null
    }
  },
  {
    "id": "term-129",
    "kind": "term",
    "title": "塗り足しとは",
    "summary": "仕上がりより上下左右3mmほど外まで背景を広げておくこと。断裁は1〜2mmずれることがあり、足りないと端に白いすき間が出る。最も多い不備の一つ。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "端が白くなる？塗り足し3mmの理由",
    "source": {
      "title": "データ入稿について",
      "url": "https://docs.channel.io/createguide/ja/articles/%E3%83%87%E3%83%BC%E3%82%BF%E5%85%A5%E7%A8%BF%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6-85a39dfb",
      "publisher": "ONLINE CREATE ご利用ガイド",
      "date": null
    }
  },
  {
    "id": "term-130",
    "kind": "term",
    "title": "トンボ（トリムマーク）とは",
    "summary": "断裁位置を示す目印。トンボのないデータは不備として差し戻されることがある。初めて頼む人向けに図で見せると親切。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "トンボって何？入稿前の確認表",
    "source": {
      "title": "Illustratorのトンボの付け方",
      "url": "https://cad-kenkyujo.com/illustrator-tonbo/",
      "publisher": "CAD研究所",
      "date": null
    }
  },
  {
    "id": "term-131",
    "kind": "term",
    "title": "アウトライン化とは",
    "summary": "文字を図形に変える処理。しないと印刷会社のパソコンに同じ書体がない場合、別の文字に化ける。入稿で定番の失敗。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "文字化けを防ぐアウトライン化",
    "source": {
      "title": "完全データ作成の手引き",
      "url": "https://docs.channel.io/createguide/ja/articles/%E5%AE%8C%E5%85%A8%E3%83%87%E3%83%BC%E3%82%BF%E4%BD%9C%E6%88%90%E3%81%AE%E6%89%8B%E5%BC%95%E3%81%8D-85a39dfb",
      "publisher": "ONLINE CREATE ご利用ガイド",
      "date": null
    }
  },
  {
    "id": "term-132",
    "kind": "term",
    "title": "完全データとは",
    "summary": "そのまま印刷できる状態に整えた入稿データのこと。塗り足し・トンボ・書体・画像の条件を満たす必要がある。会社ごとに条件が違うので自社の手引きを公開するとよい。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "source": {
      "title": "完全データ作成の手引き",
      "url": "https://docs.channel.io/createguide/ja/articles/%E5%AE%8C%E5%85%A8%E3%83%87%E3%83%BC%E3%82%BF%E4%BD%9C%E6%88%90%E3%81%AE%E6%89%8B%E5%BC%95%E3%81%8D-85a39dfb",
      "publisher": "ONLINE CREATE ご利用ガイド",
      "date": null
    }
  },
  {
    "id": "term-133",
    "kind": "term",
    "title": "画像解像度350dpiの意味",
    "summary": "印刷では実寸で350dpi程度以上の画像を求める案内が多い。Webから拾った小さな画像は粗く刷られる。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "スマホ写真は印刷に使える？",
    "source": {
      "title": "ノベルティ商品 入稿データ作成のご案内",
      "url": "https://www.yamato.co.jp/wp/wp-content/uploads/2024/07/ノベルティ商品-入稿データ作成のご案内_24.5.pdf",
      "publisher": "ノベルティ会社の入稿案内",
      "date": "2024-05"
    }
  },
  {
    "id": "question-168",
    "kind": "question",
    "title": "入稿データで最低限守ることは？",
    "summary": "書体のアウトライン化、文字5pt以上、画像の埋め込み、CMYKで作る、インク合計300%以内などが挙げられる。答えでは自社の条件を一覧にして示す。",
    "industries": [
      "印刷",
      "パッケージ"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "ノベルティ商品 入稿データ作成のご案内",
      "url": "https://www.yamato.co.jp/wp/wp-content/uploads/2024/07/ノベルティ商品-入稿データ作成のご案内_24.5.pdf",
      "publisher": "ノベルティ会社の入稿案内",
      "date": "2024-05"
    }
  },
  {
    "id": "pain-081",
    "kind": "pain",
    "title": "特色に透明効果で4色に化ける",
    "summary": "特色に透明効果をかけると、プロセス4色に変換されてしまうことがある。仕上がりが想定と変わる原因になる。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "入稿テンプレート注意事項",
      "url": "https://originalgoods.press/html/upload/draft_template/FA-318641.pdf",
      "publisher": "オリジナルグッズ印刷サービス",
      "date": null
    }
  },
  {
    "id": "term-134",
    "kind": "term",
    "title": "オーバープリントとは",
    "summary": "下の色を抜かずに上の色を重ねて刷る設定。意図せず使うと色が消えたり濁ったりするため、使わないよう求める印刷会社がある。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "article_idea"
    ],
    "source": {
      "title": "入稿テンプレート注意事項",
      "url": "https://originalgoods.press/html/upload/draft_template/FA-316654.pdf",
      "publisher": "オリジナルグッズ印刷サービス",
      "date": null
    }
  },
  {
    "id": "trend-101",
    "kind": "trend",
    "official": false,
    "title": "AI生成画像を入稿データに直す仕事",
    "summary": "AIで作った画像を、印刷会社に入稿できるデータへ整えるサービスがスキルマーケットに出ている。入稿エラーへの不安が背景にある。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "AIで作った画像、そのまま刷れる？",
    "source": {
      "title": "AI生成画像を入稿できるデータにします",
      "url": "https://coconala.com/services/4274739",
      "publisher": "ココナラ",
      "date": null
    }
  },
  {
    "id": "term-135",
    "kind": "term",
    "title": "RGBとCMYKの違い",
    "summary": "画面は光の3色(RGB)、印刷はインクの4色(CMYK)。印刷で出せる色の範囲は狭く、ネオンのような鮮やかな色は再現できずくすんで見える。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "画面より色がくすむのはなぜ",
    "source": {
      "title": "印刷用のCMYKについて",
      "url": "https://www.canva.com/ja_jp/help/cmyk-for-print/",
      "publisher": "Canva ヘルプ",
      "date": null
    }
  },
  {
    "id": "question-169",
    "kind": "question",
    "title": "変換すると色が沈むのはなぜ？",
    "summary": "RGBのまま入稿すると印刷側で変換され、鮮やかな色が沈む。答えでは事前にCMYKで確認する方法と、黒の濃さの扱いを書く。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "RGBからCMYKへの変換",
      "url": "https://community.adobe.com/%E8%B3%AA%E5%95%8F-267/photoshop-cmyk%E3%82%92rgb%E3%81%AB%E5%A4%89%E6%8F%9B-377237?lang=ja",
      "publisher": "Adobe コミュニティ",
      "date": null
    }
  },
  {
    "id": "term-136",
    "kind": "term",
    "title": "色校正（カラープルーフ）とは",
    "summary": "本番前に色の出方を確かめる試し刷り。画面と印刷物の色は一致しないことがあるため、色が大事な案件では欠かせない。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "色校正は必要？費用と効果",
    "source": {
      "title": "色校正の種類",
      "url": "https://jp.ext.hp.com/printers/digital-presses/indigo/printing/30indg13/",
      "publisher": "日本HP",
      "date": null
    }
  },
  {
    "id": "term-137",
    "kind": "term",
    "title": "本機校正・平台校正など校正の種類",
    "summary": "オフセットの色校正には本機校正、平台校正、インクジェットのデジタル機校正、インクジェットプリンター校正などがある。本番に近いほど費用と日数がかかる。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "4種類の色校正をやさしく比較",
    "source": {
      "title": "色校正の種類",
      "url": "https://jp.ext.hp.com/printers/digital-presses/indigo/printing/30indg13/",
      "publisher": "日本HP",
      "date": null
    }
  },
  {
    "id": "term-138",
    "kind": "term",
    "title": "連量と坪量とは",
    "summary": "紙の厚さの目安。坪量は1㎡あたりのg、連量は決まった寸法の紙1000枚のkg。同じkg表記でも四六判と菊判で坪量が違う。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "110kgってどのくらいの厚さ？",
    "source": {
      "title": "紙の重さ（連量・坪量）",
      "url": "https://www.jbc-ltd.com/column/2026/01/05/paper-weight/",
      "publisher": "JBC コラム",
      "date": "2026-01"
    }
  },
  {
    "id": "question-170",
    "kind": "question",
    "title": "「四六判110kg」はどれくらい？",
    "summary": "四六判110kgの上質紙は坪量で約128g/㎡と換算される例がある。答えでは実物見本や厚さの比較写真を添えると伝わりやすい。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "紙の重さ（連量・坪量）",
      "url": "https://www.jbc-ltd.com/column/2026/01/05/paper-weight/",
      "publisher": "JBC コラム",
      "date": "2026-01"
    }
  },
  {
    "id": "term-139",
    "kind": "term",
    "title": "上質紙・コート紙・マット紙",
    "summary": "上質紙は塗工なしで文字向き、反射が少ない。コート紙は塗工があり色がきれいでカタログ向き。マット紙はつやを抑え写真と文字の両方に向く。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "チラシ・冊子の紙の選び方",
    "source": {
      "title": "コピー用紙の種類",
      "url": "https://office110.jp/copy/knowledge/basic/copy-paper-type/",
      "publisher": "OFFICE110",
      "date": null
    }
  },
  {
    "id": "question-171",
    "kind": "question",
    "title": "一般的なコピー用紙の厚さは？",
    "summary": "普通のコピー用紙は坪量64〜68g/㎡程度。大事な書類や両面印刷は少し厚手を選ぶ方法がある。紙選びの基準に使える。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "用紙の厚さ",
      "url": "https://www.fujifilm.com/fb/support/colorprint/howto/paper/thickness.html",
      "publisher": "富士フイルムビジネスイノベーション",
      "date": null
    }
  },
  {
    "id": "term-140",
    "kind": "term",
    "title": "特色（DIC・PANTONE）とは",
    "summary": "4色の掛け合わせではなく、調合済みのインクで刷る色。色見本帳の番号で指定する。日本ではDIC、海外ではPANTONEが多い。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "会社の色を毎回同じに刷るには",
    "source": {
      "title": "特色指定（DICカラーガイドナンバー指定）について",
      "url": "https://docs.channel.io/sorealguide/ja/articles/693336f6",
      "publisher": "印刷サービスのご利用ガイド",
      "date": null
    }
  },
  {
    "id": "question-172",
    "kind": "question",
    "title": "特色はどの番号でも頼める？",
    "summary": "DICのみでPANTONE不可、受けない番号がある、特色2色は不可などの制限を設ける印刷サービスがある。答えでは自社の対応範囲を明記する。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "特色指定（DICカラーガイドナンバー指定）について",
      "url": "https://docs.channel.io/sorealguide/ja/articles/693336f6",
      "publisher": "印刷サービスのご利用ガイド",
      "date": null
    }
  },
  {
    "id": "pain-082",
    "kind": "pain",
    "title": "色見本と刷り上がりの差の説明",
    "summary": "DICの見本帳にはロットがあり確認が必要、PANTONEは見本との差を事前に説明する必要がある、とする印刷会社の資料がある。説明不足が苦情の元になる。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "印刷会社の業務改善資料",
      "url": "https://www.pref.wakayama.lg.jp/prefg/063100/d00207824_d/fil/05.pdf",
      "publisher": "和歌山県",
      "date": null
    }
  },
  {
    "id": "question-173",
    "kind": "question",
    "title": "箔押しやエンボスでいくら上がる？",
    "summary": "名刺の箔押し・エンボス・角丸などは印刷代に数百〜数千円上乗せされるとされ、加工を重ねるほど総額が膨らむ。答えでは加工ごとの内訳を示す。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "箔押し名刺はいくら？加工別の費用",
    "source": {
      "title": "名刺の費用相場",
      "url": "https://www.onamae.com/column/businesscard/5/",
      "publisher": "お名前.com コラム",
      "date": null
    }
  },
  {
    "id": "buyer-068",
    "kind": "buyer",
    "title": "名刺はデザインと印刷を分けて比べる",
    "summary": "外部に名刺を頼むと、デザインと印刷合わせて3,000円〜10万円と幅がある。分けて考えると比べやすいとされる。料金を分けて示すと選ばれやすい。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "名刺作成を依頼する費用相場",
      "url": "https://atsoho.com/blog/business-card-design-cost-2",
      "publisher": "アットSOHO",
      "date": "2026"
    }
  },
  {
    "id": "buyer-069",
    "kind": "buyer",
    "title": "特殊加工は内訳つきで見積もりを求める",
    "summary": "活版に箔とエンボスを組み合わせた100枚程度の名刺で、料金内訳を求める見積もり依頼が出ている。発注者は加工ごとの値段を知りたがる。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "見積もり依頼：活版・箔押し・エンボス名刺",
      "url": "https://www.biz.ne.jp/subject/toi_detail.html?tid=949873",
      "publisher": "ビジネス・マッチング・サイト(biz.ne.jp)",
      "date": null
    }
  },
  {
    "id": "term-141",
    "kind": "term",
    "title": "箔押しとは",
    "summary": "金や銀の箔を熱と圧で紙に転写する加工。金箔は格式、銀箔はすっきりした印象を与えるとされる。名刺や化粧箱で使われる。",
    "industries": [
      "印刷",
      "パッケージ"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "金と銀、箔押しで印象はどう変わる",
    "source": {
      "title": "箔押し印刷とは",
      "url": "https://biz.ne.jp/matome/2006453",
      "publisher": "ビジネス・マッチング・サイト(biz.ne.jp)",
      "date": null
    }
  },
  {
    "id": "term-142",
    "kind": "term",
    "title": "UV印刷とは",
    "summary": "紫外線ですぐ固まるインクで刷る方法。紙・樹脂・ガラス・木・金属など幅広い素材に刷れ、版を作らずフルカラーも出せる。",
    "industries": [
      "印刷",
      "樹脂成形"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "ノベルティ名入れの印刷方法比較",
    "source": {
      "title": "Pad Printing vs. UV Printing",
      "url": "https://www.protolabs.com/resources/blog/pad-printing-vs-uv-printing/",
      "publisher": "Protolabs",
      "date": "2025-09"
    }
  },
  {
    "id": "term-143",
    "kind": "term",
    "title": "パッド印刷とは",
    "summary": "シリコンのパッドで版のインクを製品に移す方法。ロゴや文字の単色印刷に長く使われる。版が要るので少数ではUV印刷が有利になりやすい。",
    "industries": [
      "印刷",
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "source": {
      "title": "Pad Printing vs. UV Printing",
      "url": "https://www.protolabs.com/resources/blog/pad-printing-vs-uv-printing/",
      "publisher": "Protolabs",
      "date": "2025-09"
    }
  },
  {
    "id": "question-174",
    "kind": "question",
    "title": "曲面や凹凸に印刷できる？",
    "summary": "パッド印刷もデジタル印刷も、対象の形に影響を受ける。答えでは実物で試し刷りする流れと、刷れる範囲の目安を示す。",
    "industries": [
      "印刷",
      "樹脂成形"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "Digital Printing Versus Pad Printing",
      "url": "https://www.rolanddga.com/blog/digital-printing-versus-pad-printing",
      "publisher": "Roland DGA",
      "date": null
    }
  },
  {
    "id": "trend-102",
    "kind": "trend",
    "official": false,
    "title": "印刷出荷額は5兆円台で下げ止まり",
    "summary": "経産省の経済構造実態調査では、2023年の印刷業の出荷額は5兆934億円で、2年連続5兆円超え。パッケージ需要と価格転嫁が支えたと業界団体は分析。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "JFPI ニュースレター",
      "url": "https://www.jfpi.or.jp/files/user/pdf/NewsLetterVol02.pdf",
      "publisher": "日本印刷産業連合会",
      "date": "2024"
    }
  },
  {
    "id": "trend-103",
    "kind": "trend",
    "official": false,
    "title": "出版・商業は縮小、パッケージは底堅い",
    "summary": "印刷業は1991年がピークで、2004年から2023年に約29%減った。出版・商業印刷の縮小とパッケージ印刷の底堅さという二極化が共通の論点。",
    "industries": [
      "印刷",
      "パッケージ"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "印刷業界の市場規模",
      "url": "https://www.crex-data.com/industry/bpo/printing/market-size",
      "publisher": "CREX",
      "date": null
    }
  },
  {
    "id": "success-048",
    "kind": "success",
    "title": "印刷会社が自社ブランドのカードへ",
    "summary": "ある印刷会社は、自社ブランドで売れる市場としてグリーティングカードに狙いを定めた。欧米で根付き日本にも広がる市場という理由。受注待ちからの脱却例。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "印刷技術を自社商品にする道",
    "source": {
      "title": "印刷会社のグリーティングカード事業",
      "url": "https://newswitch.jp/p/483",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "term-144",
    "kind": "term",
    "title": "化粧箱とは",
    "summary": "商品を入れて見せるための紙の箱。印刷や加工で商品の印象を高める。食品・化粧品・雑貨などで使われる。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "化粧箱・貼り箱・段ボールの違い",
    "source": {
      "title": "化粧箱とは",
      "url": "https://imitsu.jp/matome/printing/what-is-cosmetic-box",
      "publisher": "アイミツ",
      "date": null
    }
  },
  {
    "id": "term-145",
    "kind": "term",
    "title": "貼り箱とは",
    "summary": "厚いボールに紙を貼って作る丈夫な箱。高級感があり、百貨店の贈答品などで使われる。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "article_idea"
    ],
    "source": {
      "title": "高級化粧箱に強い会社",
      "url": "https://imitsu.jp/list/printing/cosmetic-box-luxury",
      "publisher": "アイミツ",
      "date": null
    }
  },
  {
    "id": "term-146",
    "kind": "term",
    "title": "四隅貼り箱とは",
    "summary": "側面の四隅を糊付けした、底が一枚でつながった箱。深さが足りず機械で糊貼りできない形でも、この形なら機械で貼れることが多い。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "article_idea"
    ],
    "source": {
      "title": "四隅貼り箱",
      "url": "https://pr.mono.ipros.com/kpac/product/detail/2001635584/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-147",
    "kind": "term",
    "title": "地獄底（底組み箱）とは",
    "summary": "底を差し込んで組む形式の箱。手作業で簡単に組み立てられ、梱包作業が早くなる。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "source": {
      "title": "地獄底箱",
      "url": "https://pr.mono.ipros.com/kpac/product/detail/2001635585/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-175",
    "kind": "question",
    "title": "オリジナル箱の値段は何で決まる？",
    "summary": "ロット、使う原紙、印刷の色数、表面加工、寸法と形で大きく変わる。答えでは見積もりに必要な情報の一覧を示すと問い合わせが増える。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "箱の見積もりに必要な5つの情報",
    "source": {
      "title": "オリジナル箱の印刷会社",
      "url": "https://imitsu.jp/list/printing/originalbox",
      "publisher": "アイミツ",
      "date": null
    }
  },
  {
    "id": "buyer-070",
    "kind": "buyer",
    "title": "化粧箱は小ロット対応の会社を探す",
    "summary": "50個から受ける会社や、小ロットなら短納期・低価格で対応する会社がある。発注者は複数社に問い合わせて比べるのが一般的。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "化粧箱 小ロット対応の会社",
      "url": "https://imitsu.jp/list/printing/cosmetic-box-small-lot",
      "publisher": "アイミツ",
      "date": null
    }
  },
  {
    "id": "term-148",
    "kind": "term",
    "title": "抜き型（トムソン型）とは",
    "summary": "切り抜きたい形に曲げた刃物を、ベニヤ板で支えた型。箱の展開形を打ち抜くのに使う。比較的短納期・低価格で作れる。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "箱の値段に入る「抜き型代」とは",
    "source": {
      "title": "トムソン型",
      "url": "https://mono.ipros.com/product/detail/2000547476",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "pain-083",
    "kind": "pain",
    "title": "抜き型の選び方で原価が変わる",
    "summary": "抜き型の選定はパッケージの仕上がりとコストに大きく影響する。型代の相場や耐用回数は公開情報が少なく、発注者が比べにくい。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "パッケージと抜き型",
      "url": "https://monoist.itmedia.co.jp/mn/spv/1912/24/news007.html",
      "publisher": "MONOist",
      "date": "2019-12"
    }
  },
  {
    "id": "success-049",
    "kind": "success",
    "title": "型代なしで10部から作る箱",
    "summary": "抜きにカッティングプロッターを使い、小ロットで重い木型代をなくして最小10部から受けるパッケージサービスがある。小ロットの壁を仕組みで下げた例。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "10個から作れるオリジナル箱",
    "source": {
      "title": "オリジナルパッケージの小ロット対応",
      "url": "https://ecnomikata.com/ecnews/32221/",
      "publisher": "ECのミカタ",
      "date": null
    }
  },
  {
    "id": "trend-104",
    "kind": "trend",
    "official": false,
    "title": "デジタル印刷で小中ロットの紙器",
    "summary": "デジタル印刷機で、小〜中ロットのラベルと紙器を両方作る印刷会社の事例がある。版がいらず多品種に向く。",
    "industries": [
      "印刷",
      "パッケージ"
    ],
    "useFor": [
      "article_idea"
    ],
    "source": {
      "title": "HP Indigo 導入事例",
      "url": "https://jp.ext.hp.com/printers/digital-presses/indigo/casestudy/pitkit/",
      "publisher": "日本HP",
      "date": null
    }
  },
  {
    "id": "trend-105",
    "kind": "trend",
    "official": false,
    "title": "箱の設計と印刷をWebで完結",
    "summary": "3Dで箱を設計し、そのまま印刷を頼めるオンラインツールが中国で急成長している。誰でも箱を作れる流れ。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "article_idea"
    ],
    "source": {
      "title": "3Dパッケージ設計と印刷のオンラインツール",
      "url": "https://36kr.jp/94919/",
      "publisher": "36Kr Japan",
      "date": null
    }
  },
  {
    "id": "term-149",
    "kind": "term",
    "title": "段ボールのフルートとは",
    "summary": "段ボールの波の部分。厚さの例はAが約5mm、Cが約4mm、Bが約3mm、Eが約1.5mm。厚いほど価格が高くなる傾向がある。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "AフルートとBフルート、どう選ぶ",
    "source": {
      "title": "段ボールの強度の研究",
      "url": "https://f.osaka-kyoiku.ac.jp/tennoji-j/wp-content/uploads/sites/4/2024/04/48-12.pdf",
      "publisher": "大阪教育大学附属天王寺中学校",
      "date": "2024-04"
    }
  },
  {
    "id": "question-176",
    "kind": "question",
    "title": "割れ物を送るならどの段ボール？",
    "summary": "Aフルートは厚く緩衝性が高く、壊れやすい物に向く。ただしかさばり、保管場所や送料に響く。答えでは中身・重さ・送り方を聞く。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "Corrugated Cardboard Flute Types",
      "url": "https://stationery.lazada.sg/corrugated-cardboard-flute-types-a-b-c-e-shock-protection-comparison-20260808/",
      "publisher": "Lazada 実務ガイド",
      "date": "2026-08"
    }
  },
  {
    "id": "term-150",
    "kind": "term",
    "title": "A式・B式・C式・N式とは",
    "summary": "段ボール箱の形。A式はみかん箱型、B式は差込みフタ式、C式は身とフタを合わせる式、N式は組立式。形はJISで分類されている。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "段ボール箱の形と使い分け",
    "source": {
      "title": "段ボールの形式",
      "url": "https://www.rakuten.ne.jp/gold/226-art/about_material.html",
      "publisher": "段ボール通販店",
      "date": null
    }
  },
  {
    "id": "term-151",
    "kind": "term",
    "title": "内寸と外寸",
    "summary": "内寸は中の寸法、外寸は板の厚みを足した外側の寸法。中身に合わせるのは内寸、送料のサイズは外寸で決まる。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "段ボール箱の選び方",
      "url": "https://choice.ameba.jp/cardboard-box/",
      "publisher": "Ameba Choice",
      "date": null
    }
  },
  {
    "id": "term-152",
    "kind": "term",
    "title": "JIS Z 1507（段ボール箱の形式）",
    "summary": "段ボール箱の形式を定めたJIS。官公庁の仕様書でも引用される。形式番号で伝えると誤解が減る。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "仕様書（段ボール箱）",
      "url": "https://www.mod.go.jp/gsdf/eae/eadep/tyokai/yooga/siyousyoop87.pdf",
      "publisher": "防衛省 陸上自衛隊",
      "date": null
    }
  },
  {
    "id": "trend-106",
    "kind": "trend",
    "official": false,
    "title": "オリジナル段ボールと再購入意向",
    "summary": "段ボール会社が20〜50代1,000人に調べたところ、オリジナル段ボールで届く方が再購入したいとの回答が6割以上。自社サービスの宣伝を兼ねる点は割り引いて読む。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "開梱体験と購入意向度の調査",
      "url": "https://www.commercepick.com/archives/40367",
      "publisher": "CommercePick",
      "date": null
    }
  },
  {
    "id": "buyer-071",
    "kind": "buyer",
    "title": "オリジナル段ボールはロットで断られる",
    "summary": "まとまった数からしか受けない業者が多い。小ロットに応える会社は、最小数・印刷方式・単価・納期をWebで示すと選ばれやすい。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "オリジナル段ボールの会社",
      "url": "https://imitsu.jp/list/printing/original-cardboard",
      "publisher": "アイミツ",
      "date": null
    }
  },
  {
    "id": "success-050",
    "kind": "success",
    "title": "箱の制作から在庫管理まで一括",
    "summary": "物流代行会社が、小ロットでも自社の梱包資材を使えるよう、制作から在庫管理まで一括で引き受けている。周辺の手間ごと請けると選ばれる。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "article_idea"
    ],
    "source": {
      "title": "オリジナル梱包資材の一括サービス",
      "url": "https://ecnomikata.com/ecnews/29206/",
      "publisher": "ECのミカタ",
      "date": null
    }
  },
  {
    "id": "question-177",
    "kind": "question",
    "title": "通販で箱にこだわる意味は？",
    "summary": "届いた箱の第一印象と開封の瞬間は、SNSでの広がりやリピートに影響するとされる。答えでは開封時の見え方の工夫を写真で見せる。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "開封体験で選ばれる箱づくり",
    "source": {
      "title": "ECのブランディング",
      "url": "https://stockcrew.co.jp/insights/ec-branding",
      "publisher": "STOCKCREW",
      "date": null
    }
  },
  {
    "id": "success-051",
    "kind": "success",
    "title": "段ボール会社が工作キットでBtoCへ",
    "summary": "企業向けだった段ボールの設計製造会社が、包装設計部門に個人向け商品を作らせ、段ボール工作キットを展開。早くに分社化し独立採算を目指した。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "BtoBの技術で個人向け商品を作る",
    "source": {
      "title": "元気なモノ作り中小企業",
      "url": "https://j-net21.smrj.go.jp/special/vibrant/20240304.html",
      "publisher": "J-Net21（中小機構）",
      "date": "2024-03"
    }
  },
  {
    "id": "success-052",
    "kind": "success",
    "title": "広告せず多品種を出して売れ筋を探す",
    "summary": "同じ例では、開発時から原価を意識し、あえて宣伝を控えて多くの商品を出し、売れ筋を見つける方法をとった。小さく試す姿勢が参考になる。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "元気なモノ作り中小企業",
      "url": "https://j-net21.smrj.go.jp/special/vibrant/20240304.html",
      "publisher": "J-Net21（中小機構）",
      "date": "2024-03"
    }
  },
  {
    "id": "success-053",
    "kind": "success",
    "title": "段ボール玩具が通販で長年のヒット",
    "summary": "大阪の段ボール会社が通販で個人向け製品を開発し、最初の子ども用玩具がネットで紹介されて長く売れ続けた。2016年ごろの資料。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "article_idea"
    ],
    "source": {
      "title": "段ボール業界の事例",
      "url": "https://www.pref.osaka.lg.jp/documents/30371/danbo-ru.doc",
      "publisher": "大阪府",
      "date": "2016"
    }
  },
  {
    "id": "trend-107",
    "kind": "trend",
    "official": false,
    "title": "段ボールを販促の道具として売る",
    "summary": "大手段ボール会社が、デジタル印刷の段ボールを販促ツールとして、マーケティング視点から提案している。箱が「広告」になる流れ。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "article_idea"
    ],
    "source": {
      "title": "プロモーションツールとしての段ボール",
      "url": "https://www.advertimes.com/?p=447896",
      "publisher": "宣伝会議 AdverTimes",
      "date": null
    }
  },
  {
    "id": "trend-108",
    "kind": "trend",
    "official": false,
    "title": "脱プラで紙の包装に新しい需要",
    "summary": "紙の需要がペーパーレスで減る一方、脱プラの代わりとして紙を使う余地がある。製紙会社は非フッ素の耐油紙などを打ち出している。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "article_idea"
    ],
    "source": {
      "title": "脱プラスチック",
      "url": "https://newswitch.jp/keyword/detail/58102",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "trend-109",
    "kind": "trend",
    "official": false,
    "title": "紙への置き換えは簡単ではない",
    "summary": "欧州の業界誌は、包装の紙化は簡単な解決策ではないと指摘する。強度やバリア性など、置き換えの条件を相談に乗れる会社に価値が出る。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "Five paper packaging predictions for 2025",
      "url": "https://packagingeurope.com/comment/five-paper-packaging-predictions-for-2025/12371.article",
      "publisher": "Packaging Europe",
      "date": "2025"
    }
  },
  {
    "id": "term-153",
    "kind": "term",
    "title": "白版（白インク）とは",
    "summary": "透明素材や色紙に刷るとき、色の下に敷く白の版。別のデータとして作る必要があり、専門の技術が要る。",
    "industries": [
      "印刷",
      "パッケージ"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "透明シールや色紙に刷るときの白版",
    "source": {
      "title": "白版印刷とは",
      "url": "https://imitsu.jp/matome/printing/what-is-white-printing",
      "publisher": "アイミツ",
      "date": null
    }
  },
  {
    "id": "question-178",
    "kind": "question",
    "title": "箱の展開図は自分で作るの？",
    "summary": "印刷通販では、専門業者が展開図を作り、その上に利用者がデザインを乗せる流れがある。答えでは自社が型紙を用意するかを明記する。",
    "industries": [
      "パッケージ"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "パッケージ展開図データの提供",
      "url": "https://www.value-press.com/pressrelease/80935",
      "publisher": "ValuePress",
      "date": null
    }
  },
  {
    "id": "term-154",
    "kind": "term",
    "title": "無垢材の反り・割れ",
    "summary": "無垢材は温度・湿度で伸び縮みを繰り返すため、多少の反りや割れが出る。乾燥に時間をかけても完全には防げない。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "無垢のテーブルが反る理由と対策",
    "source": {
      "title": "天然木家具についてのご注意",
      "url": "https://www.idee-online.com/images/item_page/caution_naturalwood.pdf",
      "publisher": "家具ブランドの取扱資料",
      "date": null
    }
  },
  {
    "id": "question-179",
    "kind": "question",
    "title": "見本と木目や色が違うのは？",
    "summary": "木目・節・色には一本ごとの差があり、カタログや展示品と違うことがある。答えでは差の例の写真と、材を選べるかを書く。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "天然木家具についてのご注意",
      "url": "https://www.idee-online.com/images/item_page/caution_naturalwood.pdf",
      "publisher": "家具ブランドの取扱資料",
      "date": null
    }
  },
  {
    "id": "question-180",
    "kind": "question",
    "title": "オイル仕上げの手入れの頻度は？",
    "summary": "使う頻度の高いテーブル天板は3か月に1回、その他は年1回ほどオイルを塗るのが目安とする家具会社がある。答えに手順を添える。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "天然木家具についてのご注意",
      "url": "https://www.idee-online.com/images/item_page/caution_naturalwood.pdf",
      "publisher": "家具ブランドの取扱資料",
      "date": null
    }
  },
  {
    "id": "term-155",
    "kind": "term",
    "title": "木の経年変化",
    "summary": "木地を生かした家具は、紫外線などで色が変わり、深い味わいが出てくる。欠点ではなく魅力として伝えられる。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "10年後の色を見せる記事",
    "source": {
      "title": "ホワイトオークについて",
      "url": "https://www.idee-online.com/images/item_page/attention_white_oak_1comon.pdf",
      "publisher": "家具ブランドの取扱資料",
      "date": null
    }
  },
  {
    "id": "term-156",
    "kind": "term",
    "title": "突板とは",
    "summary": "天然木を薄く削り、合板などに貼ったもの。木100%の無垢材と違い層になった材。見た目は天然木で、価格を抑えやすい。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "無垢と突板、どちらを選ぶ？",
    "source": {
      "title": "家づくりに使う木材の種類",
      "url": "https://crexgroup.com/ja/home-building/planning/house-building-wood-types-how-to-choose/",
      "publisher": "CREX",
      "date": null
    }
  },
  {
    "id": "term-157",
    "kind": "term",
    "title": "オイル仕上げとは",
    "summary": "植物性オイルを木に染み込ませる仕上げ。手触りが生き、傷は削って塗り直せる。水に弱く、濡れたコップで輪ジミができることがある。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "オイルとウレタン、仕上げの違い",
    "source": {
      "title": "オイル仕上げの家具",
      "url": "https://macaro-ni.jp/54127",
      "publisher": "macaroni",
      "date": null
    }
  },
  {
    "id": "term-158",
    "kind": "term",
    "title": "ウレタン塗装とは",
    "summary": "木の表面に樹脂の膜を作る塗装。汚れやシミに強く拭くだけで済む。ただし剥がれた膜は家で塗り直せず、業者の補修が要る。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "source": {
      "title": "ウレタン塗装の家具",
      "url": "https://yomuno.jp/posts/44839",
      "publisher": "YOMUNO",
      "date": null
    }
  },
  {
    "id": "question-181",
    "kind": "question",
    "title": "オイルが乾いてカサついたら？",
    "summary": "布に植物性オイルを含ませて拭く方法がある。メーカーは年1〜2回の手入れを勧める例がある。手入れ用品の案内と組み合わせるとよい。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "ウッドオイルの手入れ",
      "url": "https://www.harem-shop.com/images/support/manual_pdf/wood_oil.pdf",
      "publisher": "家具販売店の取扱説明",
      "date": null
    }
  },
  {
    "id": "buyer-072",
    "kind": "buyer",
    "title": "店舗什器は図面一式で頼む",
    "summary": "平面図・展開図・造作家具図・3Dパースまでの図面一式を作るサービスがある。木工所は「どこまで図面があれば見積もれるか」を示すとよい。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "articleIdea": "什器の見積もりに要る図面",
    "source": {
      "title": "店舗設計の図面作成",
      "url": "https://www.lancers.jp/menu/detail/1338457",
      "publisher": "ランサーズ",
      "date": null
    }
  },
  {
    "id": "buyer-073",
    "kind": "buyer",
    "title": "寸法と素材とイメージで依頼が来る",
    "summary": "特注什器の依頼では、幅・高さ・奥行・段数、参考の素材やイメージを具体的に書く例が多い。見積もりと工期を同時に求める。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "見積もり依頼：店舗什器",
      "url": "https://www.biz.ne.jp/subject/toi_detail.html?tid=947126",
      "publisher": "ビジネス・マッチング・サイト(biz.ne.jp)",
      "date": null
    }
  },
  {
    "id": "pain-084",
    "kind": "pain",
    "title": "什器に金属加工が絡む",
    "summary": "店舗什器で鉄筋の曲げ加工ができる会社を探す依頼がある。木だけで完結しない案件は、協力先を含めて受けられるかが勝負になる。",
    "industries": [
      "木工",
      "金属加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "見積もり依頼：店舗什器",
      "url": "https://www.biz.ne.jp/subject/toi_detail.html?tid=923001",
      "publisher": "ビジネス・マッチング・サイト(biz.ne.jp)",
      "date": null
    }
  },
  {
    "id": "trend-110",
    "kind": "trend",
    "official": false,
    "title": "旭川は新規参入が続く家具産地",
    "summary": "旭川は家具の五大産地の一つで、毎年のように新しい会社が入る珍しい集積とされる。若い世代の流入が存続に欠かせないとの論考。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "article_idea"
    ],
    "source": {
      "title": "旭川家具産地の研究",
      "url": "https://www.otaru-uc.ac.jp/wp-content/themes/main/pdf/cgs/esd/gakuron/h29/h28gakuron_04.pdf",
      "publisher": "小樽商科大学",
      "date": "2017"
    }
  },
  {
    "id": "term-159",
    "kind": "term",
    "title": "地域団体商標とは",
    "summary": "地域名と商品名を組み合わせた商標。「飛騨の家具」が登録されている。産地の名前を守り、品質の目印になる。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "地域団体商標 飛騨の家具",
      "url": "https://www.chubu.meti.go.jp/b36tokkyo/sesaku/chiiki_dantai_shohyo/pdf/gifu/hida_no_kagu.pdf",
      "publisher": "中部経済産業局",
      "date": null
    }
  },
  {
    "id": "trend-111",
    "kind": "trend",
    "official": false,
    "title": "大川は1,000社超の木工集積",
    "summary": "大川には家具・建具メーカー、木工機械、塗料、流通まで1,000社を超える木工関連企業が集まる。協力先を探しやすい産地。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "article_idea"
    ],
    "source": {
      "title": "大川の家具づくり",
      "url": "https://www.crossroadfukuoka.jp/business/learning/11162",
      "publisher": "クロスロードふくおか",
      "date": null
    }
  },
  {
    "id": "success-054",
    "kind": "success",
    "title": "工場見学とショールームを体験に",
    "summary": "大川の家具会社が、製造工程の見学、産地の歴史説明、ショールーム見学を体験プランとして案内している。作る現場を見せて個人客に近づく例。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "工場見学を受け入れて伝わること",
    "source": {
      "title": "家具工場見学",
      "url": "https://www.crossroadfukuoka.jp/spot/12888",
      "publisher": "クロスロードふくおか",
      "date": null
    }
  },
  {
    "id": "trend-112",
    "kind": "trend",
    "official": false,
    "title": "オーダー家具は短い納期が求められる",
    "summary": "世界のオーダーメイド家具市場の予測では、買い手はより細かな個別対応と短いリードタイムを求めているとされる。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "オーダーメイド家具市場",
      "url": "https://www.gii.co.jp/report/ires2011125-customized-furniture-market-by-product-type.html",
      "publisher": "グローバルインフォメーション",
      "date": "2026"
    }
  },
  {
    "id": "question-182",
    "kind": "question",
    "title": "オーダー家具はいつ作り始める？",
    "summary": "入金確認後に材料を手配して制作に入る工房がある。答えでは打ち合わせ・入金・材料手配・制作・納品の順と各期間を示すと安心される。",
    "industries": [
      "木工"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "articleIdea": "オーダー家具ができるまでの日数",
    "source": {
      "title": "ふるさと納税 オーダー家具",
      "url": "https://www.furusato-tax.jp/product/detail/21211/4800888",
      "publisher": "ふるさとチョイス",
      "date": null
    }
  },
  {
    "id": "term-160",
    "kind": "term",
    "title": "ガーバーデータとは",
    "summary": "基板を作るための図面データ。Gerberのほか IPC-2581 や ODB++ という形式もあり、穴あけ用のNCドリルデータも一緒に渡すのが一般的。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ガーバーデータって何？初めての基板発注で渡すもの",
    "source": {
      "title": "PCB設計の出力ファイルの概要",
      "url": "https://resources.altium.com/jp/p/overview-pcb-design-output-files",
      "publisher": "Altium",
      "date": null
    }
  },
  {
    "id": "question-183",
    "kind": "question",
    "title": "基板を頼むとき何のデータを渡す？",
    "summary": "基板の製造データ（ガーバー等）と穴あけデータに加え、組立用の資料も一式そろえてから送ると、やり取りが減る。足りない物の一覧を記事で示すと親切。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "基板実装の見積もり依頼で渡す資料チェックリスト",
    "source": {
      "title": "PCB設計の出力ファイルの概要",
      "url": "https://resources.altium.com/jp/p/overview-pcb-design-output-files",
      "publisher": "Altium",
      "date": null
    }
  },
  {
    "id": "term-161",
    "kind": "term",
    "title": "BOM（部品表）とは",
    "summary": "基板に載せる部品の一覧。部品の値、基板上の記号（リファレンス）、形（パッケージ）、メーカー型番を書くのが基本。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "BOMの書き方：型番が抜けると何が起きるか",
    "source": {
      "title": "PCB部品表（BOM）の重要な要素",
      "url": "https://resources.altium.com/jp/p/key-elements-pcb-bom",
      "publisher": "Altium",
      "date": null
    }
  },
  {
    "id": "question-184",
    "kind": "question",
    "title": "BOMに無い部品は付けてくれる？",
    "summary": "海外の実装サービスの案内では、基板に印字があってもBOMに書いていない部品は買わない・付けないのが標準。書き漏れは未実装になると伝える。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "「付いていない部品がある」を防ぐBOMの確認法",
    "source": {
      "title": "Seeed Fusion PCB & PCBA サービスガイド",
      "url": "https://wiki.seeedstudio.com/ja/Service_for_Fusion_PCB/",
      "publisher": "Seeed Studio",
      "date": null
    }
  },
  {
    "id": "question-185",
    "kind": "question",
    "title": "見積もりの最低限の資料は？",
    "summary": "ある実装サービスの案内では、ガーバーとBOMが見積もりと確認の基本ファイル。BOMには記号・型番・1台あたり数量を入れる。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "shiori_tip"
    ],
    "source": {
      "title": "Seeed Fusion PCB & PCBA サービスガイド",
      "url": "https://wiki.seeedstudio.com/ja/Service_for_Fusion_PCB/",
      "publisher": "Seeed Studio",
      "date": null
    }
  },
  {
    "id": "question-186",
    "kind": "question",
    "title": "部品は支給？それとも調達してもらう？",
    "summary": "どの部品を実装会社が買い、どれを発注者が支給するかを最初に決めて書き分ける。あいまいだと抜けや二重手配の元になる。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "部品支給と一括調達、どちらが得かの考え方",
    "source": {
      "title": "Seeed Fusion PCB & PCBA サービスガイド",
      "url": "https://wiki.seeedstudio.com/ja/Service_for_Fusion_PCB/",
      "publisher": "Seeed Studio",
      "date": null
    }
  },
  {
    "id": "term-162",
    "kind": "term",
    "title": "部品座標データ（CPL）とは",
    "summary": "表面実装で、部品をどこにどの向きで置くかを示すデータ。BOMとセットで必要になる。極性や向きは実装図でも示すとよい。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "座標データと実装図：向き間違いを防ぐ渡し方",
    "source": {
      "title": "PCB assemblage vereist goede BOM en CPL gegevens",
      "url": "https://fhi.nl/en/nieuws/pcb-assemblage-vereist-goede-bom-en-cpl-gegevens",
      "publisher": "FHI",
      "date": null
    }
  },
  {
    "id": "term-163",
    "kind": "term",
    "title": "SMTとDIPの違い",
    "summary": "SMTは基板の表面に小さな部品を載せる方式。DIPは本来は部品の形の名前だが、現場では穴に差し込む実装（挿入実装）全体をDIPと呼ぶことが多い。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "SMTとDIPの違いを図で：どちらで頼めばいい？",
    "source": {
      "title": "SMT and DIP assembly（解説記事一覧）",
      "url": "https://www.bestpcbs.com/blog/tag/smt-and-dip-assembly/",
      "publisher": "Best Technology",
      "date": null
    }
  },
  {
    "id": "term-164",
    "kind": "term",
    "title": "挿入部品のはんだ付け方法",
    "summary": "差し込む部品は、フロー（噴流）、選択はんだ、手はんだから、基板の作りや数量に合わせて選ぶ。コネクタなど力がかかる部品は挿入実装が多い。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "手はんだ・フロー・選択はんだの使い分け",
    "source": {
      "title": "SMT and DIP assembly（解説記事一覧）",
      "url": "https://www.bestpcbs.com/blog/tag/smt-and-dip-assembly/",
      "publisher": "Best Technology",
      "date": null
    }
  },
  {
    "id": "question-187",
    "kind": "question",
    "title": "基板実装は1台から頼める？",
    "summary": "1台からの試作や部品交換などのスポット作業を受ける実装会社もある。最小数量と費用の目安を記事で先に示すと試作者が問い合わせやすい。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "試作1台から頼める基板実装：費用の考え方",
    "source": {
      "title": "基板実装サービス（製品ページ）",
      "url": "https://mono.ipros.com/product/detail/2000481784",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "trend-113",
    "kind": "trend",
    "official": false,
    "title": "部品の生産終了が早まっている",
    "summary": "部品メーカーの再編や事業売却で、以前より早く生産終了（EOL）になる部品が増えていると、電子部品商社が2021年に指摘している。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "source": {
      "title": "News Letter Vol.12",
      "url": "https://www.hirotass.co.jp/wpmanage/wp-content/uploads/2021/12/News_Letter_Vol12_20211213.pdf",
      "publisher": "電子部品商社のニュースレター",
      "date": "2021-12"
    }
  },
  {
    "id": "question-188",
    "kind": "question",
    "title": "EOLにどう備えればいい？",
    "summary": "設計の段階で将来止まりそうな専用部品を避けて汎用品を選ぶ、代わりの部品を先に決めておく、生産終了の予告情報をつかんで必要数を先に確保する、が基本。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "部品の生産終了に慌てないための3つの備え",
    "source": {
      "title": "News Letter Vol.12",
      "url": "https://www.hirotass.co.jp/wpmanage/wp-content/uploads/2021/12/News_Letter_Vol12_20211213.pdf",
      "publisher": "電子部品商社のニュースレター",
      "date": "2021-12"
    }
  },
  {
    "id": "term-165",
    "kind": "term",
    "title": "EOL・ディスコンとは",
    "summary": "部品の生産終了のこと。EOL（エンド・オブ・ライフ）、ディスコン（製造中止）とも呼ぶ。止まった部品を別の基板から外して再生するサービスもある。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "EOL・ディスコンとは？発注者が知っておく基本",
    "source": {
      "title": "EOL（生産中止・ディスコン）部品を再生します",
      "url": "https://mono.ipros.com/product/detail/2000496249",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "pain-085",
    "kind": "pain",
    "title": "生産終了品は偽物をつかむおそれ",
    "summary": "部品が手に入らなくなると、代わりを探す、高値で買う、正規ルート外で買う、設計を変える、製品をやめる、と選択肢が狭まり、偽造品の危険も出る。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "正規ルート外の部品を使わない理由を説明する",
    "source": {
      "title": "電子部品の陳腐化とは",
      "url": "https://accuristech.com/ja/blog/electronic-part-obsolescence-explained/",
      "publisher": "Accuris",
      "date": null
    }
  },
  {
    "id": "pain-086",
    "kind": "pain",
    "title": "部品の寿命と製品の寿命が合わない",
    "summary": "ある支援会社の発表では、電子部品の寿命は2〜3年が多い一方、産業機器や医療機器は10〜20年使われるため、途中で部品の置き換えが必要になる。",
    "industries": [
      "電子部品",
      "基板実装",
      "装置"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "10年使う装置の基板を守る部品の置き換え",
    "source": {
      "title": "企業リリース（電子部品の置き換え支援）",
      "url": "https://www.nikkan.co.jp/releases/view/138938",
      "publisher": "日刊工業新聞（PR TIMES配信）",
      "date": null
    }
  },
  {
    "id": "pain-087",
    "kind": "pain",
    "title": "代わりの部品で設計変更と再認証",
    "summary": "代替品を使うには、調べるだけでなく回路や基板、ソフトの改版、製品の再認証まで必要になる場合があり、手間が大きい。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "EOL部品の代替・設計変更サービス（製品ページ）",
      "url": "https://mono.ipros.com/product/detail/2000998773",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-074",
    "kind": "buyer",
    "title": "設計者がいない会社は外部の設計支援へ",
    "summary": "社内に設計できる人が少ないと生産終了への対応が期限に間に合わず、生産が止まるおそれがある。外部の設計支援を探す会社がいる。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "設計者がいなくても基板の生産終了に対応する方法",
    "source": {
      "title": "EOL対応の設計支援（製品紹介）",
      "url": "https://www.marklines.com/ja/product/14445",
      "publisher": "マークラインズ",
      "date": null
    }
  },
  {
    "id": "term-166",
    "kind": "term",
    "title": "EOL予測・代替部品の推奨",
    "summary": "カタログ情報から部品の生産終了を割り出し、代わりの部品を推奨する情報サービスがある。部品選びの段階で使える。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "EOL情報の割り出しと代替品推奨のサービス",
      "url": "https://eetimes.itmedia.co.jp/ee/articles/1510/05/news123.html",
      "publisher": "EE Times Japan",
      "date": "2015-10"
    }
  },
  {
    "id": "trend-114",
    "kind": "trend",
    "official": false,
    "title": "半導体の発注を1年先まで前倒し",
    "summary": "2022年の報道では、大手自動車部品メーカーが外から買う半導体の発注を約3カ月先から1年先分へ前倒しした。調達難の時期の動き。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "半導体不足への対応（デンソー）",
      "url": "https://www.sbbit.jp/article/refers/88679",
      "publisher": "ビジネス+IT",
      "date": "2022-06"
    }
  },
  {
    "id": "trend-115",
    "kind": "trend",
    "official": false,
    "title": "装置メーカーでも部材不足で納期遅れ",
    "summary": "半導体製造装置の業界では、部材の調達難で装置の納期が遅れ、調達のうまさが業績を左右すると報じられた。",
    "industries": [
      "装置",
      "電子部品"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "半導体製造装置の部材調達難",
      "url": "https://newswitch.jp/p/30049",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "term-167",
    "kind": "term",
    "title": "メタルマスクとは",
    "summary": "はんだを基板に印刷するための穴の空いた金属板。試作や少量では、この製作費が初期費用の大きな割合を占めるという説明がある。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "試作基板の初期費用、メタルマスク代とは",
    "source": {
      "title": "フィルムマスク（製品ページ）",
      "url": "https://mono.ipros.com/product/detail/2000156044",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-189",
    "kind": "question",
    "title": "試作の初期費用を下げる方法は？",
    "summary": "マスクをフィルムで作る、社内で作る、枠なしの脱着式を使う、などで初期費用を抑える実装会社がある。費用の理由と下げ方を書くと選ばれやすい。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "試作基板の初期費用を抑える工夫",
    "source": {
      "title": "試作基板実装（製品ページ）",
      "url": "https://pr.mono.ipros.com/pulax/product/detail/2001527732/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-168",
    "kind": "term",
    "title": "マスクレス実装とは",
    "summary": "メタルマスクを作らず、プリンターのようにはんだを吹き付けて印刷する方式。1枚からの試作に向くとされる。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "マスクを作らない実装：試作1枚に向く理由",
    "source": {
      "title": "マスクレス実装（製品ページ）",
      "url": "https://pr.mono.ipros.com/agata-g/product/detail/2001626729/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "pain-088",
    "kind": "pain",
    "title": "マスクと基板の合わせ込み",
    "summary": "マスクのデータは基板の実物に合わせて補正することがあり、マスクと基板の精度をそろえる作業が品質を左右する。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "メタルマスクと基板の精度合わせ",
      "url": "https://monoist.itmedia.co.jp/mn/spv/1611/25/news016_2.html",
      "publisher": "MONOist",
      "date": "2016-11"
    }
  },
  {
    "id": "term-169",
    "kind": "term",
    "title": "基板のたわみ防止ホルダ",
    "summary": "実装中に基板がたわまないよう支える治具。製品ページでは1万〜10万円ほどの価格帯の例がある。",
    "industries": [
      "電子部品",
      "基板実装",
      "治具"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "基板たわみ防止ホルダ（製品ページ）",
      "url": "https://mono.ipros.com/product/detail/2000003121",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-170",
    "kind": "term",
    "title": "BGAとX線検査",
    "summary": "BGAは部品の裏にはんだの玉が並ぶ部品。接合部が見えないため、X線で透かして部品の下のはんだを確かめる。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "BGAはなぜX線で検査するのか",
    "source": {
      "title": "BGA PCBのはんだ付け",
      "url": "https://mokotechnology.com/ja/bga-pcb-soldering",
      "publisher": "MOKO Technology",
      "date": null
    }
  },
  {
    "id": "term-171",
    "kind": "term",
    "title": "ボイド（はんだの中の空洞）",
    "summary": "はんだの中に残る空洞。主に溶けたフラックスがガスになって残ることで生じる。大きいと接合の信頼性が心配になる。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ボイドとは？はんだの空洞が起きる理由",
    "source": {
      "title": "はんだ付けのボイド対策",
      "url": "https://monoist.itmedia.co.jp/mn/spv/1305/08/news054.html",
      "publisher": "MONOist",
      "date": "2013-05"
    }
  },
  {
    "id": "pain-089",
    "kind": "pain",
    "title": "パワー部品は大きなボイドが出やすい",
    "summary": "足のない部品やパワー系部品は基板との隙間がほとんどなく、ガスやフラックスの残りが抜けにくいため、大きな空洞になりやすい。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "はんだ付けのボイド対策",
      "url": "https://monoist.itmedia.co.jp/mn/spv/1305/08/news054.html",
      "publisher": "MONOist",
      "date": "2013-05"
    }
  },
  {
    "id": "question-190",
    "kind": "question",
    "title": "BGAのはんだ不良の原因は？",
    "summary": "英文の技術資料では、パッドや玉の酸化、部品や基板の吸湿、はんだペーストの期限切れ、印刷量不足、加熱条件の設定ミス、設計を原因に挙げる。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "BGA不良の原因と、発注前に確認したいこと",
    "source": {
      "title": "Reason for BGA insufficient solder",
      "url": "https://www.smtnet.com/library/files/upload/Reason%20for%20BGA%20insufficient%20solder.pdf",
      "publisher": "SMTnet",
      "date": null
    }
  },
  {
    "id": "success-055",
    "kind": "success",
    "title": "X線画像を数値にして説明",
    "summary": "X線画像からボイドの面積や位置を数値にするソフトがある。検査結果を数字で見せると、発注者に品質を伝えやすい。",
    "industries": [
      "電子部品",
      "基板実装"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "検査画像と数字で品質を見せる記事の作り方",
    "source": {
      "title": "BGAボイド解析ソフト（製品ページ）",
      "url": "https://pr.mono.ipros.com/hodaka-denshi/product/detail/2001208302",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-075",
    "kind": "buyer",
    "title": "EMSは分野の経験と認証で選ぶ",
    "summary": "EMSの解説では、医療・車載・産業機器は品質基準が違うため、その分野での受託経験と、ISO 9001やIATF 16949などの認証を確かめるよう勧める。",
    "industries": [
      "電子部品",
      "基板実装",
      "組立"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "EMSを選ぶときに見る経験と認証",
    "source": {
      "title": "EMS（電子機器受託製造）の解説",
      "url": "https://www.digima-japan.com/knowhow/world/17933.php",
      "publisher": "Digima〜出島〜",
      "date": null
    }
  },
  {
    "id": "term-172",
    "kind": "term",
    "title": "EMS（電子機器受託製造）とは",
    "summary": "他社の電子機器を設計図に沿って作る仕事。基板実装から組立・検査まで請け負う。大手は大量生産が中心で、小ロットは中規模や地域の会社も候補になる。",
    "industries": [
      "電子部品",
      "基板実装",
      "組立"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "EMSとは？小ロット試作はどこに頼む？",
    "source": {
      "title": "EMS（電子機器受託製造）の解説",
      "url": "https://www.digima-japan.com/knowhow/world/17933.php",
      "publisher": "Digima〜出島〜",
      "date": null
    }
  },
  {
    "id": "question-191",
    "kind": "question",
    "title": "ワイヤーハーネスは1本から頼める？",
    "summary": "1本の試作から受ける加工会社がある。最小数量と納期の目安を書いておくと、開発者の問い合わせにつながる。",
    "industries": [
      "組立",
      "電子部品"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "ハーネス1本からの試作：費用と納期の考え方",
    "source": {
      "title": "ワイヤーハーネス加工（製品ページ）",
      "url": "https://mono.ipros.com/product/detail/2000350558",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-192",
    "kind": "question",
    "title": "ハーネスの見積もりに必要なものは？",
    "summary": "配線図があれば見積もると案内する加工会社がある。電線・端子・コネクタの型番、長さ、数量も分かると早い（各社の依頼書式で確認）。",
    "industries": [
      "組立",
      "電子部品"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "ハーネス見積もりで最初に渡すもの",
    "source": {
      "title": "ワイヤーハーネス加工（製品ページ）",
      "url": "https://pr.mono.ipros.com/taiheidenki-kk/product/detail/2000618670/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-076",
    "kind": "buyer",
    "title": "図面なしで買える標準ハーネス",
    "summary": "図面を作らず、ECサイトから1点単位で注文できる標準のミニハーネスもある。特注が要るかどうかを先に見極めるとよい。",
    "industries": [
      "組立",
      "電子部品"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "特注と標準品、どちらでハーネスを頼むか",
    "source": {
      "title": "ミニハーネス（製品ページ）",
      "url": "https://pr.mono.ipros.com/tohodensen/product/detail/2001118853/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-056",
    "kind": "success",
    "title": "対応できる端子メーカーを一覧で公開",
    "summary": "扱える端子・コネクタのメーカー一覧をWebで公開しているハーネス加工会社がある。発注者が型番で探すときに当たりやすい。",
    "industries": [
      "組立",
      "電子部品"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "対応端子・コネクタ一覧ページの作り方",
    "source": {
      "title": "ハーネス加工 対応端子・コネクタ一覧",
      "url": "https://pr.mono.ipros.com/koshow/product/detail/2001249465",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "pain-090",
    "kind": "pain",
    "title": "ハーネスは仕様が客ごとにバラバラ",
    "summary": "自動化装置メーカーは、ハーネスは客ごとに仕様が違い、短期間に作る組み合わせがほぼ無限になると述べ、自動化の判断を難しくしている。",
    "industries": [
      "組立"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "Focus on higher automation",
      "url": "https://www.komaxgroup.com/stories/focus-on-higher-automation",
      "publisher": "Komax",
      "date": null
    }
  },
  {
    "id": "pain-091",
    "kind": "pain",
    "title": "設計変更が現場に届かない",
    "summary": "ハーネスは設計変更が多いのに、変更を組立ラインへ自動で伝える仕組みが多くの現場で足りず、指示書の作り直しが手作業になる。",
    "industries": [
      "組立"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "Focus on higher automation",
      "url": "https://www.komaxgroup.com/stories/focus-on-higher-automation",
      "publisher": "Komax",
      "date": null
    }
  },
  {
    "id": "pain-092",
    "kind": "pain",
    "title": "熟練のハーネス組立工が足りない",
    "summary": "熟練したハーネス組立の作業者を見つけるのが年々難しくなっていると、設計ツール会社の解説が指摘している。",
    "industries": [
      "組立"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ワイヤーハーネス組立の自動化とロボティクス",
      "url": "https://resources.altium.com/jp/p/automation-and-robotics-in-wire-harness-assembly",
      "publisher": "Altium",
      "date": null
    }
  },
  {
    "id": "trend-116",
    "kind": "trend",
    "official": false,
    "title": "ハーネス組付けの自動化研究",
    "summary": "大学の研究では、EV向けのハーネス組付けを技術面では自動化で支えられるが、作業者の役割など人の側の検討が大事だとしている。",
    "industries": [
      "組立"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ワイヤーハーネス組付け自動化の研究",
      "url": "https://re.public.polimi.it/handle/11311/1262654",
      "publisher": "ミラノ工科大学",
      "date": null
    }
  },
  {
    "id": "term-173",
    "kind": "term",
    "title": "圧着端子の引張試験とは",
    "summary": "圧着した端子を引っ張って抜けにくさを短時間で確かめる試験。値が外れたら、被覆のむき方、圧着の高さ、工具などを疑う。",
    "industries": [
      "組立",
      "電子部品"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "引張試験で分かる圧着の良し悪し",
    "source": {
      "title": "圧着端子の引張試験について",
      "url": "https://forum.digikey.com/t/topic/11757",
      "publisher": "DigiKey フォーラム",
      "date": null
    }
  },
  {
    "id": "term-174",
    "kind": "term",
    "title": "圧着が弱いと電気抵抗が増える",
    "summary": "十分な力で圧着すると金属同士がしっかり触れ合う。圧着不良は電気抵抗の増加につながる。",
    "industries": [
      "組立",
      "電子部品"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "圧着端子の引張試験について",
      "url": "https://forum.digikey.com/t/topic/11757",
      "publisher": "DigiKey フォーラム",
      "date": null
    }
  },
  {
    "id": "term-175",
    "kind": "term",
    "title": "圧着端子の規格（JIS C2805）",
    "summary": "銅線用圧着端子の引張の強さを確かめる規格として JIS C2805 が参照される。試験機の製品ページで規格名を確認できる。",
    "industries": [
      "組立",
      "電子部品"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "圧着端子引張試験機（製品ページ）",
      "url": "https://mono.ipros.com/product/detail/2000225684",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-057",
    "kind": "success",
    "title": "品質の取り組みを具体的に書く",
    "summary": "受託でハーネスを作る会社が、引張試験機での抜け強度の確認や、圧着部を切って磨く断面検査を品質の取り組みとして紹介している。",
    "industries": [
      "組立"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "圧着断面の写真で品質を見せる",
    "source": {
      "title": "ハーネス受託製作（製品紹介）",
      "url": "https://www.marklines.com/ja/product/14530",
      "publisher": "マークラインズ",
      "date": null
    }
  },
  {
    "id": "question-193",
    "kind": "question",
    "title": "組立を頼む流れは？",
    "summary": "ある組立受託の会社は、問い合わせ→図面・仕様の確認→見積もりの順。2D図面を3Dにして完成の形を確かめてから見積もる。",
    "industries": [
      "組立",
      "機械部品"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "ユニット組立を頼むときの流れ",
    "source": {
      "title": "ユニット部品の加工や組立、検査まで一貫生産",
      "url": "https://mono.ipros.com/product/detail/2000805549",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-058",
    "kind": "success",
    "title": "2D図面を3Dにして確認",
    "summary": "組立受託で、もらった2D図面を3Dデータにして完成状態を確かめる工程をWebで説明している例がある。食い違いを先に見つける姿勢が伝わる。",
    "industries": [
      "組立"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ユニット部品の加工や組立、検査まで一貫生産",
      "url": "https://mono.ipros.com/product/detail/2000805549",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-194",
    "kind": "question",
    "title": "組立は1個から頼める？",
    "summary": "試作品を自社の工作機械で加工し、1個単位から組立を受ける会社がある。部品加工から検査まで一括で頼めるかも確認点。",
    "industries": [
      "組立",
      "機械部品"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "ユニット部品の加工や組立、検査まで一貫生産",
      "url": "https://mono.ipros.com/product/detail/2000805549",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-059",
    "kind": "success",
    "title": "自社製の治具・検査装置で組立",
    "summary": "組立受託で、自社で作った設備・治具・検査装置を使って品質と生産性を上げていると説明する例がある。治具の写真は強みの証拠になる。",
    "industries": [
      "組立",
      "治具"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "組立の品質を支える自社治具の紹介",
    "source": {
      "title": "ユニット部品の加工や組立、検査まで一貫生産",
      "url": "https://mono.ipros.com/product/detail/2000805549",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-077",
    "kind": "buyer",
    "title": "仕様書と図面を対面で突き合わせる",
    "summary": "設備購入の実務解説では、製作提案図を受け取るだけでなく、対面で図面と購入仕様書が合っているかを細かく確認することが大事とする。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "専用機の設計審査で発注者が確認すること",
    "source": {
      "title": "設備購入仕様書と設備図面の確認（書籍紹介資料）",
      "url": "https://pubdata.nikkan.co.jp/uploads/magazine_introduce/pdf_620f093b1a271-5.pdf",
      "publisher": "日刊工業新聞社",
      "date": null
    }
  },
  {
    "id": "buyer-078",
    "kind": "buyer",
    "title": "見積もりと一緒に求める書類",
    "summary": "設備の見積もり時に、見積書だけでなく見積仕様書、製作日程表、製作承認図などの提出を求める一覧が示されている。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "専用機の見積もりで出してもらう書類",
    "source": {
      "title": "設備購入仕様書と設備図面の確認（書籍紹介資料）",
      "url": "https://pubdata.nikkan.co.jp/uploads/magazine_introduce/pdf_620f093b1a271-5.pdf",
      "publisher": "日刊工業新聞社",
      "date": null
    }
  },
  {
    "id": "question-195",
    "kind": "question",
    "title": "過去の似た機械のトラブルは？",
    "summary": "設備の発注では、過去の類似機で起きた故障やトラブルへの対策が入っているかを確かめるよう勧められている。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "類似機のトラブル対策を記事で見せる",
    "source": {
      "title": "設備購入仕様書と設備図面の確認（書籍紹介資料）",
      "url": "https://pubdata.nikkan.co.jp/uploads/magazine_introduce/pdf_620f093b1a271-5.pdf",
      "publisher": "日刊工業新聞社",
      "date": null
    }
  },
  {
    "id": "pain-093",
    "kind": "pain",
    "title": "社長の一声でロボットを急いで入れる",
    "summary": "よくある失敗は、社長の号令で担当者がSIerに急ぎ見積もらせ、ロボットを1台入れても成果が出ない形。段階的な計画が抜けている。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "ロボット1台目で失敗しないための計画",
    "source": {
      "title": "「工場の自動化がうまく進まない…」その原因はどこにあり、何をすべきなのか",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2509/19/news004.html",
      "publisher": "MONOist",
      "date": "2025-09"
    }
  },
  {
    "id": "pain-094",
    "kind": "pain",
    "title": "導入後のもめごとは認識のずれから",
    "summary": "ロボット導入後のトラブルの多くは、ユーザーとSIerが事前に認識をそろえていないことが原因。保守の範囲は文書で確かめておく。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "SIerと最初に決めておく保守の範囲",
    "source": {
      "title": "自動化機器/ロボットシステムの導入や運用時の注意点（2）",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2512/15/news010_2.html",
      "publisher": "MONOist",
      "date": "2025-12"
    }
  },
  {
    "id": "question-196",
    "kind": "question",
    "title": "装置はいつから使える？",
    "summary": "自動化機器は受注生産が多く、納期に数カ月〜半年かかることがある。入ってからも正式に使うまで2〜3カ月かかるとされる。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "専用機の納期と立ち上げ期間の目安",
    "source": {
      "title": "自動化機器/ロボットシステムの導入や運用時の注意点（2）",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2512/15/news010_2.html",
      "publisher": "MONOist",
      "date": "2025-12"
    }
  },
  {
    "id": "buyer-079",
    "kind": "buyer",
    "title": "SIerの選び方の観点",
    "summary": "SIer選びでは、仕事への理解、導入実績、対応力、保守・サポート体制、費用に注意するよう勧められている。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "SIerを選ぶ5つの観点を自社で答える記事",
    "source": {
      "title": "自動化機器/ロボットシステムの導入や運用時の注意点〜ロボットSIerをどう選ぶか",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2512/15/news010_3.html",
      "publisher": "MONOist",
      "date": "2025-12"
    }
  },
  {
    "id": "term-176",
    "kind": "term",
    "title": "ロボットSIerとは",
    "summary": "ロボット本体に周辺機器や制御を組み合わせ、現場で使える仕組みにして納める会社。導入の成否はSIer選びで決まると言われる。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ロボットSIerとは？何を頼める会社か",
    "source": {
      "title": "自動化機器/ロボットシステムの導入や運用時の注意点〜ロボットSIerをどう選ぶか",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2512/15/news010_3.html",
      "publisher": "MONOist",
      "date": "2025-12"
    }
  },
  {
    "id": "trend-117",
    "kind": "trend",
    "official": true,
    "title": "省力化補助金はカタログ型と一般型",
    "summary": "中小企業省力化投資補助金は、カタログから汎用製品を選ぶ型と、現場に合わせたオーダーメイド設備を補助する一般型がある（経産省資料、2025年3月）。",
    "industries": [
      "装置",
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "専用機は省力化補助金の一般型で使える？",
    "source": {
      "title": "中小企業省力化投資補助金 効果検証シナリオ",
      "url": "https://www.meti.go.jp/policy/policy_management/ebpm/kensyo_shinario/250331_syouryokuka.pdf",
      "publisher": "経済産業省",
      "date": "2025-03"
    }
  },
  {
    "id": "trend-118",
    "kind": "trend",
    "official": false,
    "title": "一般型の補助上限が大きく上がった",
    "summary": "2025年に新しく始まった一般型について、補助上限が1億円まで引き上げられたと民間の解説が伝えている。申請前に公募要領で確認が必要。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小企業省力化投資補助金（一般型）の解説",
      "url": "https://sogyotecho.jp/shouryokuka-hojyokin-ixtupangata/",
      "publisher": "創業手帳",
      "date": null
    }
  },
  {
    "id": "trend-119",
    "kind": "trend",
    "official": false,
    "title": "カタログ型は随時、一般型は公募回制",
    "summary": "民間の解説では、2025年度はカタログ注文型が随時受付、一般型が公募回ごとの受付で、対象経費が違えば両方使えると整理されている。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "省力化投資補助金2025の解説",
      "url": "https://article.ejinzai.jp/column/shoryokuka-2025/",
      "publisher": "e-人材",
      "date": null
    }
  },
  {
    "id": "term-177",
    "kind": "term",
    "title": "FAT（工場での受入試験）とは",
    "summary": "装置メーカーの工場で、出荷前に仕様どおり動くかを発注者と確かめる試験。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "FATとSATの違い：装置の検収で確かめること",
    "source": {
      "title": "The difference between a FAT and a SAT",
      "url": "https://kneat.com/article/the-difference-between-a-fat-and-a-sat/",
      "publisher": "Kneat",
      "date": null
    }
  },
  {
    "id": "term-178",
    "kind": "term",
    "title": "SAT（現地での受入試験）とは",
    "summary": "据え付けた後の発注者の工場で、電源や既存設備とつないで正しく動くかを確かめる試験。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "The difference between a FAT and a SAT",
      "url": "https://kneat.com/article/the-difference-between-a-fat-and-a-sat/",
      "publisher": "Kneat",
      "date": null
    }
  },
  {
    "id": "pain-095",
    "kind": "pain",
    "title": "メーカーの工場では本番条件が再現できない",
    "summary": "実際の生産条件が必要な試験は、メーカー側の工場では再現できないことがある。FATで済ませる項目と現地で見る項目を分けておく。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "工場試験と現地試験で確かめる項目の分け方",
    "source": {
      "title": "The difference between a FAT and a SAT",
      "url": "https://kneat.com/article/the-difference-between-a-fat-and-a-sat/",
      "publisher": "Kneat",
      "date": null
    }
  },
  {
    "id": "term-179",
    "kind": "term",
    "title": "幾何公差は「形と位置のずれ」の許容幅",
    "summary": "寸法公差が長さのばらつきを決めるのに対し、幾何公差は平らさ・まっすぐさ・位置などのずれをどこまで許すかを図面で決める。寸法だけでは部品の機能を守れないときに使う。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "寸法公差と幾何公差、発注前に知りたい違い",
    "source": {
      "title": "幾何公差の“目的”とは何か?産機設計者が解説「公差計算・公差解析」(3)",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1905/08/news006_2.html",
      "publisher": "MONOist",
      "date": "2019-05"
    }
  },
  {
    "id": "term-180",
    "kind": "term",
    "title": "平面度・真直度はデータム不要",
    "summary": "平面度・真直度・真円度・円筒度は「形状公差」と呼ばれ、基準面（データム）なしで理想の形との差を見る。姿勢・位置・振れの公差はデータムが必要になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "幾何公差の種類を4つに分けて覚える",
    "source": {
      "title": "幾何公差の基本",
      "url": "https://iri.pref.tochigi.lg.jp/content/files/kennan/幾何公差の基本.pdf",
      "publisher": "栃木県産業技術センター",
      "date": null
    }
  },
  {
    "id": "term-181",
    "kind": "term",
    "title": "真直度は細長い部品の反り対策",
    "summary": "細長い軸や角柱は加工の熱で反りやすいため、機能上反ると困る部分に真直度を指示する。何でも指示すると測定と加工の手間が増える。",
    "industries": [
      "切削加工",
      "研削",
      "機械部品"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "細長いシャフトの反りを防ぐ図面の書き方",
    "source": {
      "title": "さまざまな幾何公差【その1】〜その定義や例、測定方法について〜",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1908/05/news008.html",
      "publisher": "MONOist",
      "date": "2019-08"
    }
  },
  {
    "id": "term-182",
    "kind": "term",
    "title": "平面度はどう測るのか",
    "summary": "平面度はダイヤルゲージやハイトゲージで高い所と低い所の差を見る方法や、三次元測定機で多数の点を測る方法がある。測り方で検査費が変わるので、見積時に確認するとよい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "平面度の測り方と検査費の関係",
    "source": {
      "title": "さまざまな幾何公差【その1】〜その定義や例、測定方法について〜",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1908/05/news008.html",
      "publisher": "MONOist",
      "date": "2019-08"
    }
  },
  {
    "id": "term-183",
    "kind": "term",
    "title": "真円度と円筒度は別もの",
    "summary": "真円度は輪切りにした断面ごとに丸ければよく、軸全体がまっすぐかは問わない。軸全体を円筒としてそろえたいなら円筒度を使う。似た言葉で混同しやすい。",
    "industries": [
      "切削加工",
      "研削",
      "機械部品"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "真円度・円筒度・同軸度の違いを図で解説",
    "source": {
      "title": "幾何公差の基本",
      "url": "https://iri.pref.tochigi.lg.jp/content/files/kennan/幾何公差の基本.pdf",
      "publisher": "栃木県産業技術センター",
      "date": null
    }
  },
  {
    "id": "term-184",
    "kind": "term",
    "title": "データムは設計・加工・検査の共通の基準",
    "summary": "データムは幾何公差の基準となる面・線・点。設計者・加工者・検査者が同じ基準で作り測れるよう、機能と作業のしやすさを考えて選ぶのが理想とされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "データムの選び方で検査がもめなくなる",
    "source": {
      "title": "「データム」とは何か? をあらためて理解する",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1906/03/news009.html",
      "publisher": "MONOist",
      "date": "2019-06"
    }
  },
  {
    "id": "term-185",
    "kind": "term",
    "title": "データム記号は三角と四角枠",
    "summary": "図面では基準にする面に三角記号を付け、四角枠にA・Bなどのアルファベットを書く。三角は黒塗りでも白抜きでもよい。公差枠では左ほど優先順位が高い。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "幾何公差の基準「データム」を理解しよう",
      "url": "https://monoist.itmedia.co.jp/mn/articles/0905/14/news089.html",
      "publisher": "MONOist",
      "date": "2009-05"
    }
  },
  {
    "id": "term-186",
    "kind": "term",
    "title": "実際の測定は定盤を基準にする",
    "summary": "本物の面は完全な平面ではないため、検査では部品を定盤などに押し当て、その定盤を基準として扱う（実用データム）。測り方を加工先と合わせておくと検査結果のずれを防げる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "検査結果が客先と合わないときに見る点",
    "source": {
      "title": "幾何公差の基準「データム」を理解しよう",
      "url": "https://monoist.itmedia.co.jp/mn/articles/0905/14/news089.html",
      "publisher": "MONOist",
      "date": "2009-05"
    }
  },
  {
    "id": "term-187",
    "kind": "term",
    "title": "3つの直交面で部品の向きを決める",
    "summary": "部品の姿勢をきちんと決めるには、互いに直角な3つのデータム面（第1・第2・第3）を使うのが一般的。どの面から当てるかで測定値が変わることがある。",
    "industries": [
      "切削加工",
      "機械部品",
      "治具"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "「データム」とは何か? をあらためて理解する",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1906/03/news009.html",
      "publisher": "MONOist",
      "date": "2019-06"
    }
  },
  {
    "id": "pain-096",
    "kind": "pain",
    "title": "データムの付け方で迷う設計者",
    "summary": "どこにデータムを付けるか、付けないかで設計者が迷う場面は多い。加工側が「この面を基準に削る」と提案できると、図面の手直しが減り頼られる。",
    "industries": [
      "切削加工",
      "機械部品"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "加工屋が提案するデータムの付け方",
    "source": {
      "title": "そこにデータムを付けるのか、付けないのか 幾何公差徹底攻略(6)",
      "url": "https://monoist.itmedia.co.jp/mn/articles/0909/16/news121.html",
      "publisher": "MONOist",
      "date": "2009-09"
    }
  },
  {
    "id": "question-197",
    "kind": "question",
    "title": "図面から加工方法は読み取れる？",
    "summary": "図面の形状・公差・粗さの指示から、旋盤かフライスか、研削が要るかを加工側は判断している。発注者向けに「図面のここを見て工程を決める」と説明すると価格の納得感が上がる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "図面のどこを見て見積もるか公開します",
    "source": {
      "title": "「図面から加工方法を察してみよう」の巻 図面の読み描き超入門(4)",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1511/06/news003.html",
      "publisher": "MONOist",
      "date": "2015-11"
    }
  },
  {
    "id": "term-188",
    "kind": "term",
    "title": "H7/g6は「滑らかに動くはめあい」",
    "summary": "はめあい記号の大文字は穴、小文字は軸の公差域、数字は精度の等級で小さいほど厳しい。H7/g6はすきまが少しある組み合わせで、回転軸や摺動部に使われる代表例。",
    "industries": [
      "切削加工",
      "研削",
      "機械部品",
      "装置"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "H7/g6・H7/p6などはめあい記号の読み方",
    "source": {
      "title": "設計製図 s1-4",
      "url": "https://www.rs.noda.tus.ac.jp/nog/documents/sekkei1/s1-4.pdf",
      "publisher": "東京理科大学",
      "date": null
    }
  },
  {
    "id": "term-189",
    "kind": "term",
    "title": "穴基準が一般的な理由",
    "summary": "穴の寸法を固定し軸側で締まり具合を調整する「穴基準」が一般的。穴はリーマなど標準工具で決まった寸法に仕上げやすいからとされる。",
    "industries": [
      "切削加工",
      "機械部品"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "Understanding clearance, transition and interference fit",
      "url": "https://www.hubs.com/knowledge-base/understandings-clearance-transition-and-interference-fit/",
      "publisher": "Hubs",
      "date": null
    }
  },
  {
    "id": "term-190",
    "kind": "term",
    "title": "φ20のH7は＋0〜＋0.021mm",
    "summary": "呼び寸法20mmの穴をH7で指示すると、上の許容差＋0.021mm、下の許容差0mmになる。記号を数値に直して見せると、発注者にも精度の厳しさが伝わる。",
    "industries": [
      "切削加工",
      "機械部品"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "はめあい記号を数字に直す早見表",
    "source": {
      "title": "3D CADの基本（9）",
      "url": "https://news.mynavi.jp/article/3dcad_basic-9/",
      "publisher": "マイナビニュース",
      "date": null
    }
  },
  {
    "id": "term-191",
    "kind": "term",
    "title": "すきま・中間・しまりの3つのはめあい",
    "summary": "はめあいは、必ずすきまができる「すきまばめ」、どちらにもなりうる「中間ばめ」、必ず締まる「しまりばめ」に分かれる。圧入するか手で入れるかで選ぶ。",
    "industries": [
      "切削加工",
      "機械部品",
      "組立"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "圧入・すきまばめ、どれを選べばいい？",
    "source": {
      "title": "Understanding clearance, transition and interference fit",
      "url": "https://www.hubs.com/knowledge-base/understandings-clearance-transition-and-interference-fit/",
      "publisher": "Hubs",
      "date": null
    }
  },
  {
    "id": "term-192",
    "kind": "term",
    "title": "はめあいの使い分け例",
    "summary": "メーカー資料ではH7/h6は位置決め、H7/k6は押し込み、H7/p6は圧入といった使い分けが示されている。用途を書けば加工先が記号を提案できる。",
    "industries": [
      "切削加工",
      "機械部品"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "用途を伝えればはめあいは提案できます",
    "source": {
      "title": "はめあい",
      "url": "https://www.osg.co.jp/media_dl/technical/file/hameai.pdf",
      "publisher": "オーエスジー",
      "date": null
    }
  },
  {
    "id": "term-193",
    "kind": "term",
    "title": "普通公差は「中級」がふつう",
    "summary": "JIS B 0405の普通公差には精級・中級・粗級・極粗級がある。一般の機械部品は中級が多く、精級にすると加工費が上がる。図面の欄外に等級を書くのが基本。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "普通公差の等級で見積もりが変わる理由",
    "source": {
      "title": "寸法公差とJIS B 0405普通公差ガイド",
      "url": "https://renue.co.jp/posts/dimensional-tolerance-jis-b0405-general-tolerance-guide-2026",
      "publisher": "renue",
      "date": "2026"
    }
  },
  {
    "id": "term-194",
    "kind": "term",
    "title": "普通公差は樹脂3Dプリントには使えない",
    "summary": "JIS B 0405は金属の除去加工や板金成形の部品向けで、樹脂の3Dプリント品は対象外と解説されている。3Dプリントの精度は別に取り決める必要がある。",
    "industries": [
      "3Dプリンタ",
      "樹脂成形"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "3Dプリント品の寸法精度はどう決める？",
    "source": {
      "title": "寸法公差とJIS B 0405普通公差ガイド",
      "url": "https://renue.co.jp/posts/dimensional-tolerance-jis-b0405-general-tolerance-guide-2026",
      "publisher": "renue",
      "date": "2026"
    }
  },
  {
    "id": "term-195",
    "kind": "term",
    "title": "100mmで±0.3mmが中級の目安",
    "summary": "普通公差・中級では、100mmの寸法に対して±0.3mmの許容差とされる。数字で示すと「特に指定しないとどのくらいの精度か」が発注者に伝わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "技術資料（普通公差）",
      "url": "https://www.takachi-el.co.jp/images/pdfs/technical_data/2016-g-011.pdf",
      "publisher": "タカチ電機工業",
      "date": null
    }
  },
  {
    "id": "term-196",
    "kind": "term",
    "title": "公差が重なる直列寸法",
    "summary": "寸法を端から順につなぐ直列記入は、各寸法の公差が足し合わされてよい場合に使う。基準からの位置が大事なら並列・累進記入にすると誤差がたまらない。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "寸法の入れ方ひとつで穴位置がずれる話",
    "source": {
      "title": "「図面に寸法を入れて仕上げてみよう」の巻 図面の読み描き超入門(5)",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1512/04/news009_2.html",
      "publisher": "MONOist",
      "date": "2015-12"
    }
  },
  {
    "id": "term-197",
    "kind": "term",
    "title": "図面は「誰が見ても同じ意味」に",
    "summary": "2D図面では一義性（解釈が1つに決まること）が大切とされる。現場では最終的に加工者が誤解しないことを第一にした書き方が使われることもある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "加工屋が助かる図面・困る図面",
    "source": {
      "title": "2D図面の“一義性”を考える【その6】寸法数値/配置と寸法補助記号",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2201/12/news003_3.html",
      "publisher": "MONOist",
      "date": "2022-01"
    }
  },
  {
    "id": "term-198",
    "kind": "term",
    "title": "公差指示がない寸法はm級が通例",
    "summary": "個々の寸法に公差が書かれていない図面では、JIS B 0405の公差等級m（中級）を使うのが通例とされる。ただし図面に明記がないと解釈が分かれるので書いておく。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "寸法公差に関する資料",
      "url": "https://www.tsd.saitama-u.ac.jp/content/files/ghi/paper24-04.pdf",
      "publisher": "埼玉大学",
      "date": null
    }
  },
  {
    "id": "term-199",
    "kind": "term",
    "title": "3Dデータは基本STEPで渡す",
    "summary": "STEP（.stp/.step）は国際規格の3Dデータ形式で、形状を立体として正確に渡しやすい。相手のCADが分からないときの第一候補とされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "3Dデータは何形式で送ればいい？",
    "source": {
      "title": "STEPとIGESの違い AP203/AP214/AP242",
      "url": "https://renue.co.jp/posts/step-vs-iges-3d-cad-ap203-ap214-ap242-data-exchange-guide-2026",
      "publisher": "renue",
      "date": "2026"
    }
  },
  {
    "id": "term-200",
    "kind": "term",
    "title": "STEPにもAP203/214/242がある",
    "summary": "STEPは1つの形式ではなく用途別の規格の集まり。AP214は色やレイヤーも扱え、AP242は両者をまとめた現在の主流。書き出し時に選べるなら確認する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "STEPとIGESの違い AP203/AP214/AP242",
      "url": "https://renue.co.jp/posts/step-vs-iges-3d-cad-ap203-ap214-ap242-data-exchange-guide-2026",
      "publisher": "renue",
      "date": "2026"
    }
  },
  {
    "id": "term-201",
    "kind": "term",
    "title": "IGESは面の欠けが起きやすい",
    "summary": "IGESは面（サーフェス）中心の古い形式で、変換時に面のすき間や欠落が起きやすい。STEPが読めない古い設備向けに限るのがよいとされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "IGESで送ると何が困るのか",
    "source": {
      "title": "STEP vs IGES vs Parasolid",
      "url": "https://www.getleo.ai/blog/step-vs-iges-vs-parasolid",
      "publisher": "Leo AI",
      "date": null
    }
  },
  {
    "id": "term-202",
    "kind": "term",
    "title": "Parasolid（x_t）はCADの心臓部の形式",
    "summary": "Parasolid（.x_t/.x_b）は多くの3D CADの内部エンジンの形式で、形を正確に保てる。受け取る側が対応していればSTEPより確実なこともある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "STEP vs IGES vs Parasolid",
      "url": "https://www.getleo.ai/blog/step-vs-iges-vs-parasolid",
      "publisher": "Leo AI",
      "date": null
    }
  },
  {
    "id": "pain-097",
    "kind": "pain",
    "title": "3Dデータの単位違いで大きさが狂う",
    "summary": "3Dデータのやり取りでは、mmとインチなどの単位ずれが見た目で気づきにくく影響が大きいと指摘される。受け付け時に単位を確認する手順を書くと安心材料になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "データ受け取り時に必ず確認する5項目",
    "source": {
      "title": "STEP vs IGES vs Parasolid",
      "url": "https://www.getleo.ai/blog/step-vs-iges-vs-parasolid",
      "publisher": "Leo AI",
      "date": null
    }
  },
  {
    "id": "term-203",
    "kind": "term",
    "title": "DXFは2D図面の受け渡し用",
    "summary": "DXFは異なるCAD間で2D図形をやり取りするための形式で、DWGはAutodeskの独自形式。レーザー加工機のソフトではDXFが使われることが多い。",
    "industries": [
      "板金",
      "金属加工"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "DXFとDWG、板金の入稿はどっち？",
    "source": {
      "title": "DWG vs DXF",
      "url": "https://www.adobe.com/creativecloud/file-types/image/comparison/dwg-vs-dxf.html",
      "publisher": "Adobe",
      "date": null
    }
  },
  {
    "id": "question-198",
    "kind": "question",
    "title": "板金データの曲げ線はどう分ける？",
    "summary": "レーザー板金の業者から、切断線と曲げ線を別レイヤー・別色に分けたDXFを求められる例がある。入稿ルールを記事で示すと、やり取りの往復が減る。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "板金加工の入稿データ作り方ガイド",
    "source": {
      "title": "DXF bend lines on different layers",
      "url": "https://forum.solidworks.com/thread/235754",
      "publisher": "SOLIDWORKS Forum",
      "date": null
    }
  },
  {
    "id": "term-204",
    "kind": "term",
    "title": "ミルシートは材料の「出生証明書」",
    "summary": "ミルシートは鋼材などを作った製鉄所が出す証明書で、ロット・チャージ番号、化学成分、引張試験などの結果が書かれる。材料が規格どおりかを示す書類。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "ミルシートとは？見方と頼み方",
    "source": {
      "title": "鋼材システム（ミルシート管理）",
      "url": "https://pr.mono.ipros.com/toukei-nagoya/product/detail/2001505409/",
      "publisher": "イプロス（東計電算）",
      "date": null
    }
  },
  {
    "id": "question-199",
    "kind": "question",
    "title": "ミルシートは頼まなくても付く？",
    "summary": "鉄骨分野のQ&Aでは、要求しないとミルシートが提出されない場合もあると注意されている。必要なら発注時に「ミルシート要」と書くのが確実。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "ミルシートが必要なら発注書に書く",
    "source": {
      "title": "鉄骨工事Q&A A-1-3",
      "url": "https://nikkenren.com/kenchiku/sekou/steel_frame_Q&A/A-1-3.pdf",
      "publisher": "日本建設業連合会",
      "date": null
    }
  },
  {
    "id": "term-205",
    "kind": "term",
    "title": "公共工事ではミルシートの保管が求められる",
    "summary": "公共工事の仕様書には、受注者がミルシートなどの品質規格証明書を整え保管し、求めがあればすぐ見せるよう定めた例がある。",
    "industries": [
      "製缶",
      "溶接",
      "金属加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "岐阜県 工事仕様書（品質規格証明書の扱い）",
      "url": "https://www.pref.gifu.lg.jp/uploaded/attachment/101817.pdf",
      "publisher": "岐阜県",
      "date": null
    }
  },
  {
    "id": "term-206",
    "kind": "term",
    "title": "海外材はEN10204 3.1などの種類を確認",
    "summary": "海外では同様の書類をMill Test Certificateと呼び、EN10204の3.1など種類がある。材料の出どころが海外のときは、どの種類の証明書が出るかを事前に確認する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "輸入材のミルシートで確認すること",
    "source": {
      "title": "What Is a Material Test Certificate (Mill Test Certificate)?",
      "url": "https://www.hqts.com/material-test-certificate/",
      "publisher": "HQTS",
      "date": null
    }
  },
  {
    "id": "term-207",
    "kind": "term",
    "title": "初品検査は量産前に全項目を測る",
    "summary": "初品（初物）サンプル検査は、量産開始前に1回、寸法や材料など全項目を確かめるものとされる。継続して行う受入検査とは役割が違う。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "初品検査と受入検査の違い",
    "source": {
      "title": "First Article Inspection (FAI) - Procurement Glossary",
      "url": "https://www.tacto.ai/en/procurement-glossary/first-article-inspection-fai",
      "publisher": "tacto",
      "date": null
    }
  },
  {
    "id": "term-208",
    "kind": "term",
    "title": "量産の最初の0〜20%で検査する方法",
    "summary": "海外の検査会社は、量産開始直後（完成量おおむね0〜20%）に検査して、仕様の誤解や材料のすり替えを広がる前に止める方法を紹介している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "Initial Product Inspection: Catching Issues Before Production Scales",
      "url": "https://www.hqts.com/initial-product-inspection/",
      "publisher": "HQTS",
      "date": null
    }
  },
  {
    "id": "term-209",
    "kind": "term",
    "title": "量産前検査で材料と段取りを確認",
    "summary": "量産前検査（PPI）では、仕様・承認サンプル・部品表・工程が量産に耐える状態かを確かめる。小ロットでも量産前に確認点を共有すると手戻りが減る。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "量産前に確認するチェックリスト",
    "source": {
      "title": "What Is a Pre-Production Inspection? Definition, Purpose, and Checklist",
      "url": "https://racklify.com/encyclopedia/what-is-a-pre-production-inspection-definition-purpose-and-checklist/",
      "publisher": "Racklify",
      "date": null
    }
  },
  {
    "id": "term-210",
    "kind": "term",
    "title": "生産前に原材料と部品を検査する",
    "summary": "生産前検査（IPC）は、加工を始める前に原材料や部品が仕様どおりかを確かめるもの。材料起因の不良を早く止められる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "Initial Production Check (IPC) for Pre-Production Quality Control",
      "url": "https://qima.com/initial-production-check",
      "publisher": "QIMA",
      "date": null
    }
  },
  {
    "id": "question-200",
    "kind": "question",
    "title": "基板実装でも初品確認はできる？",
    "summary": "量産開始前に確認用の実装基板を短時間で検査し、実装不良を見つける装置が出ている。基板実装の受託でも初品の確認方法を示すと安心されやすい。",
    "industries": [
      "基板実装",
      "電子部品"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "実装基板の初品確認でやっていること",
    "source": {
      "title": "量産前確認用実装基板の検査装置",
      "url": "https://mono.ipros.com/product/detail/2614004",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-211",
    "kind": "term",
    "title": "ロット番号と製造番号は違う",
    "summary": "ロット番号は同じ条件でまとめて作った単位に付く番号、製造番号は製品1つずつに付く番号。どちらで管理するかで追跡できる細かさが変わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "ロット番号・製造番号・シリアルの違い",
    "source": {
      "title": "ロットトレーサビリティとは",
      "url": "https://www.issoh.co.jp/column/details/16801/",
      "publisher": "一創",
      "date": null
    }
  },
  {
    "id": "term-212",
    "kind": "term",
    "title": "トレーサビリティは「不良品の範囲を絞る力」",
    "summary": "部品のトレーサビリティは、受入から加工・出荷までを追えること。不具合が出たときに影響のあるロットだけを特定して回収できるかが大事とされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "不良が出たとき、どこまで追えますか？",
    "source": {
      "title": "部品ロットトレーサビリティ – サプライヤーからバッチまでのエンドツーエンドの系図",
      "url": "https://sgsystemsglobal.com/ja/%E7%94%A8%E8%AA%9E%E9%9B%86/%E9%83%A8%E5%93%81%E3%83%AD%E3%83%83%E3%83%88%E3%83%88%E3%83%AC%E3%83%BC%E3%82%B5%E3%83%93%E3%83%AA%E3%83%86%E3%82%A3/",
      "publisher": "SG Systems Global",
      "date": null
    }
  },
  {
    "id": "term-213",
    "kind": "term",
    "title": "記録するのは5M",
    "summary": "製造の記録対象として、材料・人・機械・方法・測定の5Mが挙げられる。どの5Mを記録しているかを書くと、品質管理の中身が発注者に伝わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "うちの工場が記録している5Mの中身",
    "source": {
      "title": "ロットトレーサビリティ",
      "url": "https://www.siemens.com/ja-jp/technology/lot-traceability/",
      "publisher": "シーメンス",
      "date": null
    }
  },
  {
    "id": "pain-098",
    "kind": "pain",
    "title": "ロット管理はルール決めが先",
    "summary": "ロットトレースは、ロットの切り方や記録の取り方などのルールを先に決めないと回らないとされる。小さな工場ほど紙とExcelでも続く形にすることが大切。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "小さな工場のロット管理の始め方",
    "source": {
      "title": "ロット管理・トレーサビリティの解説",
      "url": "https://boxil.jp/mag/a9542/",
      "publisher": "BOXIL Magazine",
      "date": null
    }
  },
  {
    "id": "question-201",
    "kind": "question",
    "title": "不良が出たら何をしてくれる？",
    "summary": "発注者は不具合時の対応を知りたい。トレーサビリティで影響範囲を絞り、原因を5Mでたどる流れを示すと、取引前の不安が減る。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "不良が出たときの対応の流れを公開",
    "source": {
      "title": "部品ロットトレーサビリティ – サプライヤーからバッチまでのエンドツーエンドの系図",
      "url": "https://sgsystemsglobal.com/ja/%E7%94%A8%E8%AA%9E%E9%9B%86/%E9%83%A8%E5%93%81%E3%83%AD%E3%83%83%E3%83%88%E3%83%88%E3%83%AC%E3%83%BC%E3%82%B5%E3%83%93%E3%83%AA%E3%83%86%E3%82%A3/",
      "publisher": "SG Systems Global",
      "date": null
    }
  },
  {
    "id": "term-214",
    "kind": "term",
    "title": "IATF16949はISO9001の上乗せ",
    "summary": "IATF16949は単独では取れず、ISO9001に自動車業界向けの追加要求を重ねた規格。審査ではISO9001の部分と追加部分の両方が見られる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "ISO9001とIATF16949の違い",
    "source": {
      "title": "IATF 16949の解説",
      "url": "https://www.dqsglobal.com/ja/topics/dqs-knowledge-center/iatf-16949no-jie-shuo",
      "publisher": "DQS",
      "date": null
    }
  },
  {
    "id": "term-215",
    "kind": "term",
    "title": "APQP・PPAP・FMEA・SPCとは",
    "summary": "IATF16949では、量産準備の計画（APQP）、部品承認（PPAP）、不具合の事前予測（FMEA）、統計的工程管理（SPC）などの手法が関わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "自動車部品の品質用語4つをやさしく",
    "source": {
      "title": "IATF 16949",
      "url": "https://www.bsigroup.com/ja-JP/IATF16949/",
      "publisher": "BSIグループジャパン",
      "date": null
    }
  },
  {
    "id": "buyer-080",
    "kind": "buyer",
    "title": "自動車業界ではIATFが取引の前提",
    "summary": "研究では、自動車部品サプライヤーにとってIATF16949は「営業許可」のような存在で、ISO9001だけでは評価されにくくなっているとされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "How does IATF 16949 add value to ISO 9001? An empirical study",
      "url": "https://addi.ehu.es/handle/10810/64518",
      "publisher": "バスク大学（学術論文）",
      "date": "2020"
    }
  },
  {
    "id": "question-202",
    "kind": "question",
    "title": "ISO9001があればIATFは楽になる？",
    "summary": "全社でISO9001を持っていれば、IATF16949では自動車関連部分だけを追加で審査する形がある。同時取得で時間と費用を抑える方法も紹介されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "ISO9001の次にIATFを取るときの順番",
    "source": {
      "title": "IATF 16949 v ISO 9001",
      "url": "https://www.nsf.org/knowledge-library/iatf-16949-v-iso-9001",
      "publisher": "NSF",
      "date": null
    }
  },
  {
    "id": "trend-120",
    "kind": "trend",
    "official": false,
    "title": "IATF16949も2027年に改訂見込み",
    "summary": "認証機関の解説では、IATF16949の次の版は改訂ISO9001の発行後、2026年10月に作業開始、2027年発行の見込みとされている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "IATF 16949の解説",
      "url": "https://www.dqsglobal.com/ja/topics/dqs-knowledge-center/iatf-16949no-jie-shuo",
      "publisher": "DQS",
      "date": null
    }
  },
  {
    "id": "trend-121",
    "kind": "trend",
    "official": false,
    "title": "ISO9001:2026が9月に発行",
    "summary": "認証機関LRQAなどは、ISO9001の2026年版が2026年9月16日に発行され、約3年の移行期間に入ったと伝えている。2015年版の認証は移行期間中も有効。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "ISO9001:2026、町工場は何をすればいい？",
    "source": {
      "title": "ISO 9001:2026 is live",
      "url": "https://www.lrqa.com/en/latest-news/iso-9001-2026-live/",
      "publisher": "LRQA",
      "date": "2026-09"
    }
  },
  {
    "id": "trend-122",
    "kind": "trend",
    "official": false,
    "title": "ISO9001の移行期限は2029年9月ごろ",
    "summary": "ISO9001:2026への移行期間は発行から3年で、2029年9月ごろ終了とされる。終了日は情報源で差があり、認証機関への確認が必要。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ISO 9001:2026 transition timeline",
      "url": "https://www.effivity.com/blog/iso-9001-2026-transition-timeline",
      "publisher": "Effivity",
      "date": null
    }
  },
  {
    "id": "term-216",
    "kind": "term",
    "title": "エコアクション21は中小向け環境認証",
    "summary": "エコアクション21は環境省のガイドラインに基づく認証・登録制度。ISO14001をもとに中小企業が取り組みやすい形にしたもの。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "ISO14001とエコアクション21の違い",
    "source": {
      "title": "エコアクション21 資料",
      "url": "https://www.env.go.jp/content/900495861.pdf",
      "publisher": "環境省",
      "date": null
    }
  },
  {
    "id": "term-217",
    "kind": "term",
    "title": "EA21の費用はISOの約10分の1",
    "summary": "広島県は、エコアクション21はISO取得に比べて1/10程度の費用で取得できると説明している。費用を理由に環境認証をあきらめていた会社の選択肢になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "エコアクション21",
      "url": "https://www.pref.hiroshima.lg.jp/soshiki/45/ecoaction21.html",
      "publisher": "広島県",
      "date": null
    }
  },
  {
    "id": "term-218",
    "kind": "term",
    "title": "EA21は環境経営レポートを公表",
    "summary": "エコアクション21の認証後は、環境への取り組みをまとめた「環境経営レポート」を作って公表する。ブログや会社サイトで発信する材料にもなる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "環境経営レポートをブログで紹介する",
    "source": {
      "title": "EA21認証・登録研修会チラシ",
      "url": "https://www.town.kawajima.saitama.jp/secure/13079/EA21認証・登録研修会チラシ.pdf",
      "publisher": "埼玉県川島町",
      "date": "2026"
    }
  },
  {
    "id": "trend-123",
    "kind": "trend",
    "official": true,
    "title": "EA21は約7,500社、9割が100人以下",
    "summary": "研修会の案内によると、2026年4月時点でエコアクション21に約7,500社が取り組み、その約9割が従業員100人以下の事業者。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "EA21認証・登録研修会チラシ",
      "url": "https://www.town.kawajima.saitama.jp/secure/13079/EA21認証・登録研修会チラシ.pdf",
      "publisher": "埼玉県川島町",
      "date": "2026"
    }
  },
  {
    "id": "trend-124",
    "kind": "trend",
    "official": false,
    "title": "EA21取得に自治体の補助も",
    "summary": "エコアクション21の取得費用を補助する自治体がある。例として埼玉県川越市は補助率1/2・上限5万円の事業を公募していた。年度ごとに内容は変わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "エコアクション21認証取得補助（川越市）",
      "url": "https://hojyokin-portal.jp/subsidies/73941",
      "publisher": "補助金ポータル",
      "date": null
    }
  },
  {
    "id": "term-219",
    "kind": "term",
    "title": "EA21は外部の個人審査人が審査",
    "summary": "エコアクション21は組織に属さない個人の審査人が審査する仕組みで、総額はおおむね15万〜45万円程度とする論文の記述がある（規模・業種で変わる）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "エコアクション21に関する論文",
      "url": "https://shizuoka.repo.nii.ac.jp/record/7157/files/5-0025.pdf",
      "publisher": "静岡大学学術リポジトリ",
      "date": null
    }
  },
  {
    "id": "term-220",
    "kind": "term",
    "title": "JIS Q 9100は航空宇宙向けの品質規格",
    "summary": "JIS Q 9100はISO9001に航空宇宙産業の要求事項を加えた規格。9100シリーズには製造、整備、販売・物流向けの3種類がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "航空機部品に参入するための認証とは",
    "source": {
      "title": "航空宇宙産業向け認証の解説資料",
      "url": "https://www.pref.aichi.jp/uploaded/attachment/615845.pdf",
      "publisher": "愛知県",
      "date": null
    }
  },
  {
    "id": "buyer-081",
    "kind": "buyer",
    "title": "欧米の航空宇宙企業は9100を条件に",
    "summary": "大手メーカーの発表では、欧米の航空宇宙企業は取引条件として9100規格への適合を求めることが多く、市場参入には必須だとしている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "JIS Q 9100の認証取得について",
      "url": "https://digitalpr.jp/r/73638",
      "publisher": "ニデック（プレスリリース）",
      "date": null
    }
  },
  {
    "id": "success-060",
    "kind": "success",
    "title": "認証＋展示会で航空機の売上3割",
    "summary": "JIS Q 9100を2008年に取った中小企業が、航空機関連で売上の3割を占めるまでになった例がある。一方で認証だけでは受注につながらず苦労した例もあり、顧客ニーズの把握が重要とされる。",
    "industries": [
      "機械部品",
      "切削加工"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "認証を取った後、受注につなげたやり方",
    "source": {
      "title": "航空機産業への中小企業参入",
      "url": "https://newswitch.jp/p/6454",
      "publisher": "ニュースイッチ（日刊工業新聞）",
      "date": null
    }
  },
  {
    "id": "trend-125",
    "kind": "trend",
    "official": true,
    "title": "JIS Q 9100の審査費に県の助成",
    "summary": "岐阜県は2023年度、JIS Q 9100の更新・定期審査の受審料に上限60万円・補助率1/2以内の助成を募集した。他県にも同様の補助があり、年度ごとに内容が変わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "JIS Q 9100等 更新審査・定期審査 助成金",
      "url": "https://www.pref.gifu.lg.jp/uploaded/attachment/350988.pdf",
      "publisher": "岐阜県",
      "date": "2023"
    }
  },
  {
    "id": "trend-126",
    "kind": "trend",
    "official": true,
    "title": "浜松でJISQ9100入門セミナー",
    "summary": "J-Net21によると、浜松地域イノベーション推進機構が2026年10月にJISQ9100入門セミナーを開催。航空宇宙やNadcap取得に必要な規格として紹介されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "JISQ9100入門セミナー（浜松）",
      "url": "https://j-net21.smrj.go.jp/snavi2/articles/189864",
      "publisher": "J-Net21（中小機構）",
      "date": "2026-10"
    }
  },
  {
    "id": "buyer-082",
    "kind": "buyer",
    "title": "大手はグリーン調達で取引先を選ぶ",
    "summary": "ISO14001を取った大手製造業は、環境負荷の少ない資材・サービスを優先して買う「グリーン調達」を進めている。部品の会社にも環境配慮が求められる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "取引先から環境認証を求められたら",
    "source": {
      "title": "ISO14001についてのQ&A",
      "url": "https://j-net21.smrj.go.jp/qa/org/Q0009.html",
      "publisher": "J-Net21（中小機構）",
      "date": null
    }
  },
  {
    "id": "term-221",
    "kind": "term",
    "title": "ISO14001のメリットはコスト削減も",
    "summary": "大阪府は、ISO14001のメリットとして取引先のグリーン調達への対応、法令を守る体制づくり、省エネ・省資源による経費削減などを挙げる。費用と人の負担は小さくないとも指摘。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ISO14001認証取得のメリット",
      "url": "https://www.pref.osaka.lg.jp/o120020/chikyukankyo/jigyotoppage/emsp1-6.html",
      "publisher": "大阪府",
      "date": null
    }
  },
  {
    "id": "success-061",
    "kind": "success",
    "title": "ISO14001で取引先の指定業者に",
    "summary": "大阪府の事例では、ISO14001に取り組んだ中小企業が、会社がまとまり、取引先から指定業者として扱われたという声がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "環境認証をとって社内と取引が変わった話",
    "source": {
      "title": "ISO14001取得事例",
      "url": "https://www.pref.osaka.lg.jp/o120020/chikyukankyo/jigyotoppage/emsp1-2-3.html",
      "publisher": "大阪府",
      "date": null
    }
  },
  {
    "id": "term-222",
    "kind": "term",
    "title": "SUS316はSUS304にモリブデン入り",
    "summary": "SUS316はSUS304に2〜3%のモリブデンを加え、塩分による点状のさび（孔食）に強くしたもの。海辺や薬品を使う場所向けで、価格は高い。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "SUS304とSUS316、どちらを選ぶ？",
    "source": {
      "title": "SUS304とSUS316の違い 耐食性・コスト・選び方",
      "url": "https://renue.co.jp/posts/sus304-vs-sus316-pren-corrosion-cost-selection-guide-2026",
      "publisher": "renue",
      "date": "2026"
    }
  },
  {
    "id": "term-223",
    "kind": "term",
    "title": "さびにくさはSUS316＞304＞430",
    "summary": "材料選定の解説では、さびにくさはSUS316＞SUS304＞SUS430の順とされる。磁石につくSUS430は安いが、屋外や水回りでは差が出る。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "articleIdea": "ステンレス3種の使い分け早見表",
    "source": {
      "title": "ステンレスの材料選定",
      "url": "https://monoist.itmedia.co.jp/mn/spv/1503/27/news021_2.html",
      "publisher": "MONOist",
      "date": "2015-03"
    }
  },
  {
    "id": "term-224",
    "kind": "term",
    "title": "A5052は曲げ・溶接向きのアルミ",
    "summary": "A5052は耐食性・成形性・溶接性に優れ、板金や海辺の用途に多い。熱処理では強度が上がらないタイプで、強さは中くらい。",
    "industries": [
      "板金",
      "金属加工",
      "切削加工"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "アルミ板金はなぜA5052が多いのか",
    "source": {
      "title": "Comprehensive Comparison of 5052, 6061, and 7075 Aluminum Alloys",
      "url": "https://shop.machinemfg.com/comprehensive-comparison-of-5052-6061-and-7075-aluminum-alloys/",
      "publisher": "MachineMFG",
      "date": null
    }
  },
  {
    "id": "term-225",
    "kind": "term",
    "title": "A6061は迷ったときのアルミ",
    "summary": "A6061は強度・削りやすさ・溶接性のバランスがよく、構造部品などに広く使われる汎用材とされる。",
    "industries": [
      "切削加工",
      "機械部品"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "Comprehensive Comparison of 5052, 6061, and 7075 Aluminum Alloys",
      "url": "https://shop.machinemfg.com/comprehensive-comparison-of-5052-6061-and-7075-aluminum-alloys/",
      "publisher": "MachineMFG",
      "date": null
    }
  },
  {
    "id": "term-226",
    "kind": "term",
    "title": "A7075は強いがさびと溶接に弱い",
    "summary": "A7075は3種の中で最も強い（参考値でT6材の引張強さ約570MPa、A6061-T6は約310MPa）。一方で耐食性・溶接性は劣るので、防食処理を前提にする。",
    "industries": [
      "切削加工",
      "機械部品"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "超々ジュラルミンを選ぶ前に知ること",
    "source": {
      "title": "Comprehensive Comparison of 5052, 6061, and 7075 Aluminum Alloys",
      "url": "https://shop.machinemfg.com/comprehensive-comparison-of-5052-6061-and-7075-aluminum-alloys/",
      "publisher": "MachineMFG",
      "date": null
    }
  },
  {
    "id": "term-227",
    "kind": "term",
    "title": "アルミは調質記号まで指定する",
    "summary": "同じアルミ合金でもT6やH32などの調質記号で性質が大きく変わる。発注時は「A5052」だけでなく「A5052-H32」のように調質まで書くとよい。",
    "industries": [
      "切削加工",
      "板金"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "材質欄の「-H32」「-T6」の意味",
    "source": {
      "title": "機械設計で押さえておきたいアルミ合金の基礎と調質、表面処理の考え方",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2601/09/news008_2.html",
      "publisher": "MONOist",
      "date": "2026-01"
    }
  },
  {
    "id": "term-228",
    "kind": "term",
    "title": "SPCCは冷延、SPHCは熱延",
    "summary": "SPCCは熱延鋼板を酸洗い・冷間圧延した薄板で、表面がきれいで板厚精度が高い。SPHCは熱間圧延で安いが、表面に黒い酸化皮膜（ミルスケール）が残る。",
    "industries": [
      "板金",
      "プレス"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "SPCCとSPHC、板金で使い分ける理由",
    "source": {
      "title": "Understanding Hot and Cold Rolled Steel Sheets and Plates",
      "url": "https://de.meviy.misumi-ec.com/info/en/?p=27404",
      "publisher": "meviy（ミスミ）",
      "date": null
    }
  },
  {
    "id": "term-229",
    "kind": "term",
    "title": "SPHC-Pは酸洗いした熱延板",
    "summary": "熱延板の酸化皮膜は塗装の付きを悪くするため、酸洗いで取り除くことが多い。酸洗い済みの熱延板はSPHC-Pと呼ばれる。",
    "industries": [
      "板金",
      "プレス",
      "塗装"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "Understanding Hot and Cold Rolled Steel Sheets and Plates",
      "url": "https://de.meviy.misumi-ec.com/info/en/?p=27404",
      "publisher": "meviy（ミスミ）",
      "date": null
    }
  },
  {
    "id": "term-230",
    "kind": "term",
    "title": "SECCはSPCCに亜鉛めっき",
    "summary": "電気亜鉛めっき鋼板は元の板で呼び名が変わり、SPCCにめっきしたものがSECC、SPHCにしたものがSEHC。SPCCはそのままだと錆びるので塗装かめっきが前提。",
    "industries": [
      "板金",
      "プレス"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "articleIdea": "SPCC・SECC・SPHCの違い",
    "source": {
      "title": "SPCCの解説",
      "url": "https://mono.ipros.com/product/detail/2000025390",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-231",
    "kind": "term",
    "title": "C3604は削りやすい真鍮",
    "summary": "C3604は快削黄銅と呼ばれる真鍮で、銅と亜鉛の合金。削りやすく、切削部品によく使われる。純銅C1100は電気を通しやすく、導電部品向け。",
    "industries": [
      "切削加工",
      "機械部品"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "真鍮と銅、部品にはどちらを使う？",
    "source": {
      "title": "真鍮C3604 切削加工",
      "url": "https://pr.mono.ipros.com/matsui-ss/product/detail/2000533317/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "trend-127",
    "kind": "trend",
    "official": false,
    "title": "鉛レスの真鍮も使われる",
    "summary": "一般的な快削真鍮は削りやすさのため鉛を含むが、人体や環境への配慮から鉛を除いたC3604も使われている。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "真鍮切削加工品",
      "url": "https://mono.ipros.com/cg3/真鍮切削加工品/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "trend-128",
    "kind": "trend",
    "official": false,
    "title": "特殊鋼が2026年に続けて値上げ",
    "summary": "愛知製鋼は2026年5月契約分に続き7月契約分も値上げ。構造用鋼などはトン当たり5千円以上で、鉄スクラップ高止まりと原油高を理由に挙げた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "材料値上げを見積もりにどう反映するか",
    "source": {
      "title": "特殊鋼製品の価格改定について",
      "url": "https://www.aichi-steel.co.jp/news/mt-assets/docs/20260708_news.pdf",
      "publisher": "愛知製鋼",
      "date": "2026-07"
    }
  },
  {
    "id": "trend-129",
    "kind": "trend",
    "official": false,
    "title": "大手高炉が薄板をトン1万円上げ",
    "summary": "日本製鉄とJFEスチールは2026年3月、原材料費や物流費の上昇を理由に薄板などをトン当たり1万円値上げすると報じられた。",
    "industries": [
      "板金",
      "プレス",
      "金属加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "Nippon Steel and JFE Steel raise sheet prices amid rising costs",
      "url": "https://gmk.center/en/news/nippon-steel-and-jfe-steel-raise-prices-for-flat-steel-products-amid-rising-costs/",
      "publisher": "GMK Center",
      "date": "2026-03"
    }
  },
  {
    "id": "trend-130",
    "kind": "trend",
    "official": false,
    "title": "棒鋼・線材も値上げ",
    "summary": "神戸製鋼は2026年4月出荷分の線材・棒鋼をトン当たり1万円以上値上げしたと報じられた。切削・鍛造など棒材を使う工場に影響する。",
    "industries": [
      "切削加工",
      "鍛造",
      "機械部品"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "Kobe Steel hikes wire rod and steel bar prices by over JPY 10,000/t for April shipments",
      "url": "https://www.bigmint.co/insights/detail/kobe-steel-hikes-wire-rod-and-steel-bar-prices-by-over-jpy-10000-t-for-april-shipments-734684",
      "publisher": "BigMint",
      "date": "2026"
    }
  },
  {
    "id": "pain-099",
    "kind": "pain",
    "title": "特殊鋼の値上げは部品全体に波及",
    "summary": "物流メディアは、特殊鋼は自動車・機械・建設などの基盤素材のため、値上げが部材コストを通じてサプライチェーン全体に広がる可能性を指摘した。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "特殊鋼値上げのサプライチェーンへの影響",
      "url": "https://www.logi-today.com/942929",
      "publisher": "LOGISTICS TODAY",
      "date": "2026"
    }
  },
  {
    "id": "term-232",
    "kind": "term",
    "title": "取適法は4つの義務と11の禁止",
    "summary": "取適法（中小受託取引適正化法）は2026年1月施行。解説記事では、発注する側（委託事業者）に4つの義務と11の禁止事項があると整理されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "発注者・受注者が知っておく取適法の基本",
    "source": {
      "title": "取適法（中小受託取引適正化法）とは",
      "url": "https://www.freee.co.jp/kb/kb-deals/toritekihou/",
      "publisher": "freee",
      "date": "2026"
    }
  },
  {
    "id": "trend-131",
    "kind": "trend",
    "official": true,
    "title": "発注書面はメールでも可に",
    "summary": "取適法では、発注内容を示す書面の交付を、受注側の承諾がなくてもメールなどの電子的な方法で行えるようになった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "取適法の概要",
      "url": "https://jsite.mhlw.go.jp/chiba-roudoukyoku/content/contents/002798979.pdf",
      "publisher": "厚生労働省 千葉労働局",
      "date": "2026"
    }
  },
  {
    "id": "trend-132",
    "kind": "trend",
    "official": false,
    "title": "金型以外の型や治具も対象に",
    "summary": "取適法では製造委託の対象物に、金型以外の木型など成形用の型や、工作物保持具（治具）などの特殊な工具が含まれるよう条文が書き下された。",
    "industries": [
      "金型",
      "治具",
      "樹脂成形",
      "鋳造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "取適法における型・治具の扱い",
      "url": "https://www.businesslawyers.jp/articles/1504",
      "publisher": "BUSINESS LAWYERS",
      "date": "2026"
    }
  },
  {
    "id": "trend-133",
    "kind": "trend",
    "official": true,
    "title": "運送の委託も規制対象に",
    "summary": "取適法では、製品の引渡しに必要な運送を委託する「特定運送委託」が対象に加わった。無償の荷役や長い荷待ちの強要も問題になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "取適法の概要",
      "url": "https://jsite.mhlw.go.jp/chiba-roudoukyoku/content/contents/002798979.pdf",
      "publisher": "厚生労働省 千葉労働局",
      "date": "2026"
    }
  },
  {
    "id": "trend-134",
    "kind": "trend",
    "official": false,
    "title": "取適法の初勧告は無償の荷役",
    "summary": "2026年7月、公取委は特定運送委託に基づく全国初の勧告を出した。運送事業者に546時間余りの荷役作業を無償でさせていたことが問題とされた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "無償荷役作業、公取委が勧告 取適法違反で全国初",
      "url": "https://www.sakigake.jp/news/article/20260710CO0122/",
      "publisher": "秋田魁新報（共同通信）",
      "date": "2026-07"
    }
  },
  {
    "id": "trend-135",
    "kind": "trend",
    "official": false,
    "title": "金型846個の無償保管で勧告",
    "summary": "同じ勧告では、大手メーカー子会社が製造委託先36社に金型など846個を費用負担なしで保管させたことも問題とされた（法改正前の取引のため旧下請法を適用）。",
    "industries": [
      "金型",
      "プレス",
      "樹脂成形"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "預かり金型の保管費、請求していいのか",
    "source": {
      "title": "546時間の“タダ働き” ミネベア子会社に公取委勧告",
      "url": "https://www.advertimes.com/20260710/article550344/",
      "publisher": "AdverTimes",
      "date": "2026-07"
    }
  },
  {
    "id": "trend-136",
    "kind": "trend",
    "official": true,
    "title": "報復の申告先に事業の所管省庁も",
    "summary": "取適法では、報復措置の申告先に公取委と中小企業庁に加え、事業を所管する省庁の大臣が加わり、連携して執行する体制が強められた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "【参考資料】中小受託取引適正化法（取適法）概要",
      "url": "https://www.pref.akita.lg.jp/uploads/public/archive_0000056716_00/03_【参考資料】中小受託取引適正化法（取適法）概要.pdf",
      "publisher": "秋田県",
      "date": "2026"
    }
  },
  {
    "id": "pain-100",
    "kind": "pain",
    "title": "図面や技術データを後から無償で要求",
    "summary": "中小企業庁の研究会資料には、発注内容に含まれていない金型設計図面などの技術データを、後から全て無償で出させられた事例が載っている。",
    "industries": [
      "金型",
      "機械部品",
      "装置"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "図面や技術データの扱いを先に決める",
    "source": {
      "title": "知財取引に関する研究会 資料",
      "url": "https://www.chusho.meti.go.jp/koukai/kenkyukai/chizaitorihiki/2020/200820chizaitorihiki03.pdf",
      "publisher": "中小企業庁",
      "date": "2020-08"
    }
  },
  {
    "id": "term-233",
    "kind": "term",
    "title": "NDAは終わった後の期間も決める",
    "summary": "NDA（秘密保持契約）は有効期間だけでなく、契約が終わった後も秘密を守る義務や目的外に使わない義務が何年続くかを別に決めておくことが大切と解説されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "NDAで見落としがちな「終了後の期間」",
    "source": {
      "title": "中小企業が気を付けるべき「秘密情報の目的外使用禁止義務」とは?",
      "url": "https://monoist.itmedia.co.jp/mn/spv/1605/31/news009_5.html",
      "publisher": "MONOist",
      "date": "2016-05"
    }
  },
  {
    "id": "term-234",
    "kind": "term",
    "title": "NDAは結ぶ時期と社内ルールも大事",
    "summary": "知財の講演では、NDAをいつ結ぶか、取引先との合意の仕方、社内ルールや契約管理が取り上げられている。図面を受け取る前に結ぶのが基本。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "図面を受け取る前に結ぶNDAの流れ",
    "source": {
      "title": "知財セミナーチラシ（NDA・契約管理）",
      "url": "https://www.jetro.go.jp/ext_images/_Events/gif/FY2025/20251028chirashi.pdf",
      "publisher": "JETRO",
      "date": "2025-10"
    }
  },
  {
    "id": "question-203",
    "kind": "question",
    "title": "図面を受け取った後どう管理する？",
    "summary": "発注者は図面がどう扱われるかを気にする。NDAの締結時期、社内での保管方法、返却・廃棄の手順をFAQに書くと、新規の相談を受けやすくなる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "お預かりした図面の管理方法",
    "source": {
      "title": "知財セミナーチラシ（NDA・契約管理）",
      "url": "https://www.jetro.go.jp/ext_images/_Events/gif/FY2025/20251028chirashi.pdf",
      "publisher": "JETRO",
      "date": "2025-10"
    }
  },
  {
    "id": "pain-101",
    "kind": "pain",
    "title": "小さい会社だから応募が来ない？",
    "summary": "同じ条件でも採用できている中小企業はある。原因は会社の大きさより、求職者の決め方に合わせた求人の作り方や、自社の良さの伝え方にあることが多いとマイナビの調査コラムは指摘する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "うちの規模でも人が来た、求人の見直し3点",
    "source": {
      "title": "中小企業の採用がうまくいかない理由",
      "url": "https://career-research.mynavi.jp/column/20260512_110124/",
      "publisher": "マイナビ キャリアリサーチLab",
      "date": "2026-05"
    }
  },
  {
    "id": "pain-102",
    "kind": "pain",
    "title": "知名度・条件・媒体数のせいにしがち",
    "summary": "応募が来ない理由を「知名度がない」「条件が負けている」「媒体が少ない」と考えがちだが、それはよくある勘違いだとされる。先に、求職者に何が伝わっていないかを確かめたい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "中小企業の採用がうまくいかない理由",
      "url": "https://career-research.mynavi.jp/column/20260512_110124/",
      "publisher": "マイナビ キャリアリサーチLab",
      "date": "2026-05"
    }
  },
  {
    "id": "pain-103",
    "kind": "pain",
    "title": "応募不足の原因は一つではない",
    "summary": "中小企業107社の応募データを分析し、応募が来ない原因を4つの型に分けた調査がある。「原稿が悪い」と決めつけると打ち手を間違えるため、まず自社がどの型か見極めることが大事。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "応募が来ない4つの型とうちの場合",
    "source": {
      "title": "中小企業107社の応募データ分析",
      "url": "https://www.tv-tokyo.co.jp/plus/external-pr/entry/274173.html",
      "publisher": "テレ東プラス（PR記事）",
      "date": null
    }
  },
  {
    "id": "pain-104",
    "kind": "pain",
    "title": "生産工程の求人倍率は高止まり",
    "summary": "生産工程の職業の有効求人倍率は1.8倍を超える高い水準が続く（厚労省データを引いた解説）。求人が多く、求職者が会社を選ぶ立場にあることを前提に発信を考える必要がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業の採用課題と解決策",
      "url": "https://crexgroup.com/ja/manufacturing/human/manufacturing-recruitment-solutions/",
      "publisher": "クレックスグループ",
      "date": null
    }
  },
  {
    "id": "pain-105",
    "kind": "pain",
    "title": "3Kイメージと地方立地の壁",
    "summary": "製造業の採用が難しい理由に、きつい・汚い・危険のイメージ、若手不足、採用ノウハウ不足、魅力が伝わらないこと、地方立地、採用に割ける人手の少なさが挙げられる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "「3K」と思われている点に一つずつ答える記事",
    "source": {
      "title": "製造業の採用課題と解決策",
      "url": "https://crexgroup.com/ja/manufacturing/human/manufacturing-recruitment-solutions/",
      "publisher": "クレックスグループ",
      "date": null
    }
  },
  {
    "id": "pain-106",
    "kind": "pain",
    "title": "媒体を他社のまねで選んで失敗",
    "summary": "求人媒体ごとに集まる人の層や特徴は違う。ほかの会社で効果があった媒体が、自社の欲しい人に届くとは限らないので、媒体選びは自社の求める人物像から考える。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業の採用課題と解決策",
      "url": "https://crexgroup.com/ja/manufacturing/human/manufacturing-recruitment-solutions/",
      "publisher": "クレックスグループ",
      "date": null
    }
  },
  {
    "id": "pain-107",
    "kind": "pain",
    "title": "応募が来ない？辞退される？",
    "summary": "SNS採用の解説では、まず数字で「応募が来ない」のか「来ても辞退される」のかを分けて考えるよう勧める。課題によって効く発信（認知・応募・入社の後押し）は変わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "応募数と辞退数を数えてみたら",
    "source": {
      "title": "SNS採用の成功事例",
      "url": "https://tatap.jp/knowledge/sns-recruitment-success-cases/",
      "publisher": "tatap",
      "date": null
    }
  },
  {
    "id": "pain-108",
    "kind": "pain",
    "title": "人手不足を残業と多能工化でしのぐ",
    "summary": "日本公庫総研の分析では、中小製造業の人手不足は業績に影響し始めており、残業を増やしたり多能工化したりして対応する会社が多い。一方、省力化投資で根本から解決しようとする会社もある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "人を増やせないとき、うちがやった3つのこと",
    "source": {
      "title": "中小製造業の人手不足への対応",
      "url": "https://www.jfc.go.jp/n/findings/pdf/ronbun2411_01.pdf",
      "publisher": "日本政策金融公庫総合研究所",
      "date": "2024-11"
    }
  },
  {
    "id": "question-204",
    "kind": "question",
    "title": "仕事内容欄に何を書けばいい？",
    "summary": "ハローワークの製造業向け資料は、扱う材料、持つ物の重さ、具体的な作業、シフトや夜勤の有無を書くと、求職者が仕事を思い浮かべやすいと案内している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "求人票では書ききれない、1日の仕事の流れ",
    "source": {
      "title": "求人票の書き方（製造編）",
      "url": "https://jsite.mhlw.go.jp/osaka-hellowork/content/contents/001906186.pdf",
      "publisher": "ハローワーク（大阪労働局）",
      "date": null
    }
  },
  {
    "id": "trend-137",
    "kind": "trend",
    "official": true,
    "title": "高卒求人票に履歴書の作り方を記入",
    "summary": "宮崎労働局の資料によると、令和6年度から高卒求人票の補足事項欄に、履歴書の作成方法を書くことが必須になった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "高卒求人票の記入の注意",
      "url": "https://jsite.mhlw.go.jp/miyazaki-roudoukyoku/content/contents/002245813.pdf",
      "publisher": "宮崎労働局",
      "date": null
    }
  },
  {
    "id": "term-235",
    "kind": "term",
    "title": "「高校中退者応募可」の意味",
    "summary": "高卒求人票で「高校中退者応募可」と書くと、1〜3年生のどの学年で中退した人も応募できるという意味になる。対象を絞りたいなら書き方に注意が必要だと宮崎労働局は案内する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "高卒求人票の記入の注意",
      "url": "https://jsite.mhlw.go.jp/miyazaki-roudoukyoku/content/contents/002245813.pdf",
      "publisher": "宮崎労働局",
      "date": null
    }
  },
  {
    "id": "question-205",
    "kind": "question",
    "title": "資格がなくても応募できる？",
    "summary": "入社後に取る必要がある免許・資格は「必須」と書き、「入社後の取得可」などと補足するよう求人票の手引きは案内する。記事では、取得の時期と会社の支援を具体的に書くとよい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "入社後に取る資格と、会社の応援のしかた",
    "source": {
      "title": "高卒求人票の記入の注意",
      "url": "https://jsite.mhlw.go.jp/miyazaki-roudoukyoku/content/contents/002245813.pdf",
      "publisher": "宮崎労働局",
      "date": null
    }
  },
  {
    "id": "question-206",
    "kind": "question",
    "title": "研修や資格の支援はある？",
    "summary": "秋田労働局の手引きは、求人票はやさしい言葉で書き、研修制度や資格取得支援などの自社の強みを示すよう勧める。求職者が知りたいのは「入ってから育ててもらえるか」。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "高卒求人の手引き",
      "url": "https://jsite.mhlw.go.jp/akita-roudoukyoku/content/contents/002665617.pdf",
      "publisher": "秋田労働局",
      "date": null
    }
  },
  {
    "id": "pain-109",
    "kind": "pain",
    "title": "受理印のない高卒求人票は無効",
    "summary": "高卒求人票はハローワークの受理印がないと無効になる。学校に出す前に受理確認印の有無を必ず確かめるよう、秋田労働局の資料は注意している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "高卒求人の手引き",
      "url": "https://jsite.mhlw.go.jp/akita-roudoukyoku/content/contents/002665617.pdf",
      "publisher": "秋田労働局",
      "date": null
    }
  },
  {
    "id": "success-062",
    "kind": "success",
    "title": "資格の道筋を見せて高卒に訴求",
    "summary": "製造業の高卒採用では、機械保全技能士や電気工事士など国家資格を目指せる道筋を示し、高校生・保護者・先生に伝えることが大事だと日経BPの資料は述べる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "入社1年目から5年目までに取れる資格",
    "source": {
      "title": "製造業の高卒採用ホワイトペーパー",
      "url": "https://active.nikkeibp.co.jp/atcl/wp/b/26/02/12/06012/",
      "publisher": "日経BP Active",
      "date": "2026-02"
    }
  },
  {
    "id": "buyer-083",
    "kind": "buyer",
    "title": "高卒採用は保護者と先生も読む",
    "summary": "高卒採用では本人だけでなく、保護者や進路の先生も会社を見て判断する。キャリアの道筋や資格の支援が分かる情報は、この3者に向けて用意すると伝わりやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業の高卒採用ホワイトペーパー",
      "url": "https://active.nikkeibp.co.jp/atcl/wp/b/26/02/12/06012/",
      "publisher": "日経BP Active",
      "date": "2026-02"
    }
  },
  {
    "id": "question-207",
    "kind": "question",
    "title": "求職者の目線で求人を見直す",
    "summary": "Indeedの解説は、求職者が知りたい情報や条件は何かを考えることを採用の出発点にしている。会社が言いたいことより、読む人が不安に思うことから書く。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "求人広告の効率を上げるコツ",
      "url": "https://jp.indeed.com/%E6%B1%82%E4%BA%BA%E5%BA%83%E5%91%8A/c/info/tips-to-improve-the-efficiency-of-recruitment-process",
      "publisher": "Indeed",
      "date": null
    }
  },
  {
    "id": "question-208",
    "kind": "question",
    "title": "求職者が一番知りたいのは雰囲気",
    "summary": "製造業で働く100人の調査では、転職・就職を考える人の6割弱が「職場の雰囲気・人間関係」を最も知りたいと答え、年収は3位（31%）だった（採用サービス会社の調査）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "写真で見る、うちの工場の昼休み",
    "source": {
      "title": "製造業で働く100人の調査",
      "url": "https://prtimes.jp/main/html/rd/p/000000002.000189120.html",
      "publisher": "PR TIMES（採用サービス会社の調査）",
      "date": null
    }
  },
  {
    "id": "success-063",
    "kind": "success",
    "title": "求人票で伝わらないことを記事に",
    "summary": "職場の雰囲気や人間関係は求人票では伝えにくい。社員の様子や、困ったときに誰に聞けるかを記事で見せると、求職者の一番の不安に答えられる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "新人が最初の1週間で聞いたこと",
    "source": {
      "title": "製造業で働く100人の調査",
      "url": "https://prtimes.jp/main/html/rd/p/000000002.000189120.html",
      "publisher": "PR TIMES（採用サービス会社の調査）",
      "date": null
    }
  },
  {
    "id": "question-209",
    "kind": "question",
    "title": "製造業は土日休みにできる？",
    "summary": "製造業でも働き方改革で土日休み・日勤固定の求人は増えている。一方で、生産効率のため曜日を問わず交代で働くシフト制の会社も多い。自社の休みの形を具体的に書くとよい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "うちの年間休日とカレンダー",
    "source": {
      "title": "製造業の休日と働き方",
      "url": "https://axxis.co.jp/magazine/58330",
      "publisher": "アクシス",
      "date": null
    }
  },
  {
    "id": "term-236",
    "kind": "term",
    "title": "シフト制と日勤固定",
    "summary": "シフト制は曜日や時間を交代で働く形、日勤固定は昼の決まった時間だけ働く形。製造業では両方があり、求職者が会社を比べるときの大きな判断材料になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業の休日と働き方",
      "url": "https://axxis.co.jp/magazine/58330",
      "publisher": "アクシス",
      "date": null
    }
  },
  {
    "id": "question-210",
    "kind": "question",
    "title": "未経験でも工場で働ける？",
    "summary": "製造の現場は作業の手順が決まっていることが多く、特別なスキルがなくても始めやすいとされる。入社後の研修やOJTで基本作業や安全を学べるかを、記事で具体的に示したい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "未経験で入った先輩の最初の3か月",
    "source": {
      "title": "未経験から製造業へ転職",
      "url": "https://axxis.co.jp/magazine/58251",
      "publisher": "アクシス",
      "date": null
    }
  },
  {
    "id": "question-211",
    "kind": "question",
    "title": "製造業はきついって本当？",
    "summary": "体力の負担や同じ作業の繰り返しといったイメージは実際にある。一方で、ものづくりのやりがい、雇用の安定、未経験から挑戦しやすい点も魅力とされる。良い面と大変な面の両方を書く。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "正直に書く、うちの仕事のきつい所と楽しい所",
    "source": {
      "title": "製造業がきついと言われる理由",
      "url": "https://crexgroup.com/ja/manufacturing/human/manufacturing-hard-reasons/",
      "publisher": "クレックスグループ",
      "date": null
    }
  },
  {
    "id": "pain-110",
    "kind": "pain",
    "title": "新人がつまずく専門用語の壁",
    "summary": "未経験者が最初にぶつかる壁は、専門用語や工程が分からないこと、正確さと速さへの慣れだとされる。質問しやすい雰囲気と指導の仕組みがあるかを伝えると安心される。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "新人向け、現場でよく聞く言葉10個",
    "source": {
      "title": "未経験から製造業へ転職",
      "url": "https://axxis.co.jp/magazine/58251",
      "publisher": "アクシス",
      "date": null
    }
  },
  {
    "id": "trend-138",
    "kind": "trend",
    "official": false,
    "title": "生産工程の求人倍率は全体より高い",
    "summary": "転職支援会社の解説によると、厚労省の統計で令和6年の生産工程従事者の求人倍率は1.57倍で、全体の1.25倍より高い。製造の仕事は求職者にとって選びやすい状況にある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業への転職は難しいか",
      "url": "https://axxis.co.jp/magazine/58284",
      "publisher": "アクシス",
      "date": null
    }
  },
  {
    "id": "trend-139",
    "kind": "trend",
    "official": false,
    "title": "未経験・第二新卒の採用が広がる",
    "summary": "設計や研究開発などの専門職は経験を求められやすいが、人手不足を背景に、未経験者や第二新卒を対象とした「ポテンシャル採用」は広がっているとされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "メーカーへの転職",
      "url": "https://mynavi-agent.jp/knowledge/maker/923.html",
      "publisher": "マイナビエージェント",
      "date": null
    }
  },
  {
    "id": "term-237",
    "kind": "term",
    "title": "ポテンシャル採用",
    "summary": "今の経験やスキルより、これからの伸びしろや意欲を見て採用すること。未経験者を育てる前提なので、教育の流れや先輩のサポートを示すことが応募の決め手になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "メーカーへの転職",
      "url": "https://mynavi-agent.jp/knowledge/maker/923.html",
      "publisher": "マイナビエージェント",
      "date": null
    }
  },
  {
    "id": "term-238",
    "kind": "term",
    "title": "有効求人倍率",
    "summary": "仕事を探す人1人あたりに求人がいくつあるかを表す数字。1倍より大きいと人手が足りない状態。製造の仕事はこの数字が高く、会社が選ばれる側になっている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業の採用課題と解決策",
      "url": "https://crexgroup.com/ja/manufacturing/human/manufacturing-recruitment-solutions/",
      "publisher": "クレックスグループ",
      "date": null
    }
  },
  {
    "id": "term-239",
    "kind": "term",
    "title": "OJT",
    "summary": "On the Job Training の略で、実際の仕事をしながら先輩が教える育て方。未経験者向けの記事では「誰が」「どのくらいの期間」付くのかを書くと伝わりやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "未経験から製造業へ転職",
      "url": "https://axxis.co.jp/magazine/58251",
      "publisher": "アクシス",
      "date": null
    }
  },
  {
    "id": "trend-140",
    "kind": "trend",
    "official": false,
    "title": "一人一社制の見直しを政府が検討",
    "summary": "高卒の就職で1人1社ずつ応募する慣行「一人一社制」を、政府の規制改革推進会議が見直しの検討対象にしたと報じられた。秋田・沖縄以外で慣例になっているとされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "一人一社制の見直し検討",
      "url": "https://newswitch.jp/p/17683",
      "publisher": "ニュースイッチ（日刊工業新聞）",
      "date": null
    }
  },
  {
    "id": "pain-111",
    "kind": "pain",
    "title": "新しい会社は学校とのつながりが壁",
    "summary": "一人一社制は地元の有力企業には安定した採用手段だが、進出して日が浅い会社にとっては学校との信頼関係づくりが壁になるという指摘がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "一人一社制の見直し検討",
      "url": "https://newswitch.jp/p/17683",
      "publisher": "ニュースイッチ（日刊工業新聞）",
      "date": null
    }
  },
  {
    "id": "term-240",
    "kind": "term",
    "title": "一人一社制",
    "summary": "高校生が就職活動で、決まった時期までは1社だけに応募・推薦を受ける慣行。地域によっては一定の時期以降に2社まで応募できるなど、運用が異なる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "一人一社制の見直し検討",
      "url": "https://newswitch.jp/p/17683",
      "publisher": "ニュースイッチ（日刊工業新聞）",
      "date": null
    }
  },
  {
    "id": "term-241",
    "kind": "term",
    "title": "応募前職場見学",
    "summary": "高校生が応募先を決める前に会社を見に行く仕組み。会社が任意で行い、選考の場ではない。見学の結果、応募しない生徒もいる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "応募前職場見学の注意",
      "url": "https://jsite.mhlw.go.jp/ishikawa-roudoukyoku/content/contents/001462561.pdf",
      "publisher": "石川労働局",
      "date": null
    }
  },
  {
    "id": "pain-112",
    "kind": "pain",
    "title": "見学会で選考してしまうミス",
    "summary": "応募前職場見学では採用選考をしてはいけない。生徒本人の状況を聞くなど、早い選考につながる行為は避けるよう労働局は注意している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "応募前職場見学の注意",
      "url": "https://jsite.mhlw.go.jp/ishikawa-roudoukyoku/content/contents/001462561.pdf",
      "publisher": "石川労働局",
      "date": null
    }
  },
  {
    "id": "trend-141",
    "kind": "trend",
    "official": true,
    "title": "求人申込で見学の予定表を提出",
    "summary": "島根労働局の2026年5月の資料では、新規高卒の求人申込のとき、応募前職場見学の実施予定表を出すよう求めている（見学日を「随時」とする場合は不要）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "新規高卒求人の手続き",
      "url": "https://jsite.mhlw.go.jp/shimane-roudoukyoku/content/contents/002652871.pdf",
      "publisher": "島根労働局",
      "date": "2026-05"
    }
  },
  {
    "id": "question-212",
    "kind": "question",
    "title": "職場見学は何のためにある？",
    "summary": "応募前の職場見学は、生徒が職場への理解を深め、自分で応募先を選ぶための機会。入社後に「思っていた職場と違う」と辞めるのを防ぐ狙いもある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "応募前職場見学のお願い",
      "url": "https://jsite.mhlw.go.jp/tokyo-hellowork/content/contents/001809467.pdf",
      "publisher": "東京労働局",
      "date": null
    }
  },
  {
    "id": "pain-113",
    "kind": "pain",
    "title": "見学の日程は夏の早い時期に",
    "summary": "高校生の応募先を決める日程の都合から、応募前職場見学はなるべく8月中旬ごろまでに設定するよう奈良労働局は求めている。夏休みなど授業に影響の少ない時期が勧められる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "応募前職場見学の実施について",
      "url": "https://jsite.mhlw.go.jp/nara-roudoukyoku/content/contents/002268110.pdf",
      "publisher": "奈良労働局",
      "date": null
    }
  },
  {
    "id": "pain-114",
    "kind": "pain",
    "title": "見学で書類や名前を求めない",
    "summary": "応募前職場見学では、学校からの職場見学依頼書のほかに書類を求めず、生徒の氏名も確認しないよう求められている。説明と質問への回答にとどめる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "応募前職場見学の実施について",
      "url": "https://jsite.mhlw.go.jp/nara-roudoukyoku/content/contents/002268110.pdf",
      "publisher": "奈良労働局",
      "date": null
    }
  },
  {
    "id": "success-064",
    "kind": "success",
    "title": "若手社員の声とミニ仕事体験",
    "summary": "見学では年の近い先輩社員の話が入社後の自分を想像しやすくするとされる。先輩との交流や簡単な仕事体験を入れて、職場の空気を体で感じてもらうことが勧められる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "高校生の見学で、うちの若手が話したこと",
    "source": {
      "title": "若者の採用・定着ガイド",
      "url": "https://www.pref.aomori.lg.jp/soshiki/kodomo/wakamono/files/R6RECRUIT.pdf",
      "publisher": "青森県",
      "date": "2024"
    }
  },
  {
    "id": "success-065",
    "kind": "success",
    "title": "大変な面も伝えて納得の応募",
    "summary": "見学で良い面だけを強調せず、仕事の厳しさや大変な部分も一緒に伝え、生徒が納得したうえで応募してもらうことが大切だとされる。早期離職の予防にもつながる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "source": {
      "title": "若者の採用・定着ガイド",
      "url": "https://www.pref.aomori.lg.jp/soshiki/kodomo/wakamono/files/R6RECRUIT.pdf",
      "publisher": "青森県",
      "date": "2024"
    }
  },
  {
    "id": "trend-142",
    "kind": "trend",
    "official": true,
    "title": "新卒募集では職場情報の提供が必要",
    "summary": "若者雇用促進法で、新卒者などを募集する会社は、応募者から求めがあれば「募集・採用」「労働時間など」「能力開発」の3つの分類ごとに1つ以上の職場情報を出す義務がある（2016年施行）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "若者雇用促進法の職場情報提供",
      "url": "https://www.mhlw.go.jp/file/06-Seisakujouhou-11600000-Shokugyouanteikyoku/0000134614.pdf",
      "publisher": "厚生労働省",
      "date": null
    }
  },
  {
    "id": "term-242",
    "kind": "term",
    "title": "青少年雇用情報",
    "summary": "若者雇用促進法で示された職場情報のこと。平均勤続年数、研修の有無と内容、前年度の月平均の残業時間、有給休暇の平均取得日数などが含まれる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "うちの残業時間と有休の取り方、全部見せます",
    "source": {
      "title": "新卒者等の求人と青少年雇用情報",
      "url": "https://jsite.mhlw.go.jp/shiga-roudoukyoku/var/rev0/0122/5446/2803sinsotu.pdf",
      "publisher": "滋賀労働局",
      "date": null
    }
  },
  {
    "id": "question-213",
    "kind": "question",
    "title": "残業や有休の実際を知りたい",
    "summary": "新卒求人では、前年度の月平均所定外労働時間や有給休暇の平均取得日数も職場情報の対象。ハローワークは新卒求人の受理時に、原則としてすべての情報の提供を求めている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "新卒者等の求人と青少年雇用情報",
      "url": "https://jsite.mhlw.go.jp/shiga-roudoukyoku/var/rev0/0122/5446/2803sinsotu.pdf",
      "publisher": "滋賀労働局",
      "date": null
    }
  },
  {
    "id": "pain-115",
    "kind": "pain",
    "title": "法令違反があると新卒求人が出せない",
    "summary": "一定の労働関係法令に違反した事業所の新卒求人は、ハローワークが一定期間受け付けない仕組みがある。採用活動の前に労務の基本を整えておく必要がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "新卒者等の求人と青少年雇用情報",
      "url": "https://jsite.mhlw.go.jp/shiga-roudoukyoku/var/rev0/0122/5446/2803sinsotu.pdf",
      "publisher": "滋賀労働局",
      "date": null
    }
  },
  {
    "id": "trend-143",
    "kind": "trend",
    "official": false,
    "title": "特定技能の製造業は工業製品製造業へ",
    "summary": "製造業の特定技能は、素形材・産業機械・電気電子の3分野から、2024年3月の閣議決定を経て「工業製品製造業分野」に名前と範囲が見直された。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "特定技能 製造業の採用ポイント",
      "url": "https://treeglobalpartners.com/articles/tokutei-ginou-seizogyo/",
      "publisher": "Tree Global Partners",
      "date": null
    }
  },
  {
    "id": "trend-144",
    "kind": "trend",
    "official": true,
    "title": "特定技能の新しい業種は1号のみ",
    "summary": "経済産業省の資料では、分野名を「工業製品製造業」に変え業種を追加した。新しく加えた業種では、1号の特定技能外国人だけを受け入れられると注記している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "繊維産業と特定技能（審議会資料）",
      "url": "https://www.meti.go.jp/shingikai/sankoshin/seizo_sangyo/textile_industry/pdf/011_03_01.pdf",
      "publisher": "経済産業省",
      "date": null
    }
  },
  {
    "id": "trend-145",
    "kind": "trend",
    "official": false,
    "title": "印刷・縫製・こん包なども対象に",
    "summary": "2024年の見直しで、紙器・段ボール箱、コンクリート製品、陶磁器、紡織、縫製、RPF、印刷・製本の7区分が新たに加わり、既存区分にも鉄鋼やプラスチック製品などが追加されたとされる。",
    "industries": [
      "印刷",
      "繊維",
      "パッケージ",
      "樹脂成形",
      "塗装"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "特定技能 製造業の採用ポイント",
      "url": "https://treeglobalpartners.com/articles/tokutei-ginou-seizogyo/",
      "publisher": "Tree Global Partners",
      "date": null
    }
  },
  {
    "id": "trend-146",
    "kind": "trend",
    "official": true,
    "title": "工業製品製造業の受入れ見込数",
    "summary": "出入国在留管理庁のページでは、工業製品製造業分野の特定技能1号の受入れ見込数（令和11年3月末までの上限）を199,500人としている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "特定技能 工業製品製造業分野",
      "url": "https://www.moj.go.jp/isa/policies/ssw/manufacturing.html",
      "publisher": "出入国在留管理庁",
      "date": null
    }
  },
  {
    "id": "term-243",
    "kind": "term",
    "title": "特定技能1号と2号",
    "summary": "特定技能は人手不足の分野で外国人が働ける在留資格。1号は一定の技能がある人向け、2号はより熟練した人向けで、分野や業務区分によって2号の対象かどうかが異なる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "特定技能 製造業の採用ポイント",
      "url": "https://treeglobalpartners.com/articles/tokutei-ginou-seizogyo/",
      "publisher": "Tree Global Partners",
      "date": null
    }
  },
  {
    "id": "term-244",
    "kind": "term",
    "title": "育成就労",
    "summary": "技能実習に代わる、外国人材を育てて確保するための新しい制度。人手不足の分野で受け入れ、育成して特定技能につなげることを目指す。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "育成就労制度のレポート",
      "url": "https://www.dlri.co.jp/report/ld/593008.html",
      "publisher": "第一生命経済研究所",
      "date": null
    }
  },
  {
    "id": "pain-116",
    "kind": "pain",
    "title": "育成就労で対象業種は広がらない？",
    "summary": "第一生命経済研究所のレポートは、育成就労で実際に技能実習の対象から広がった業種はわずかだと指摘する。自社の作業が対象になるか早めに確かめたい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "育成就労制度のレポート",
      "url": "https://www.dlri.co.jp/report/ld/593008.html",
      "publisher": "第一生命経済研究所",
      "date": null
    }
  },
  {
    "id": "question-214",
    "kind": "question",
    "title": "今いる技能実習生はどうなる？",
    "summary": "育成就労への切り替えでは経過措置があり、すでにいる技能実習生は移行期間中は今の制度のまま続けられるとされる。受け入れ中の会社は時期ごとの扱いを確認しておきたい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "技能実習から育成就労への経過措置",
      "url": "https://office-tree.jp/blog/immigration/ginou-jisshu-ikusei-shuro-keika-sochi/",
      "publisher": "office-tree",
      "date": null
    }
  },
  {
    "id": "success-066",
    "kind": "success",
    "title": "見学会で学生と出会う場",
    "summary": "名古屋の産業振興公社は「ものづくり企業見学会」として、愛知県内のものづくり中小企業と学生の交流の場をつくっている。地域の見学会に参加するのも採用の入口になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "source": {
      "title": "ものづくり企業見学会",
      "url": "https://www.nipc.or.jp/kougyou/pdf/kigyoukenngaku.pdf",
      "publisher": "名古屋産業振興公社",
      "date": null
    }
  },
  {
    "id": "success-067",
    "kind": "success",
    "title": "工場見学は取引先の信頼も得る",
    "summary": "近畿経済産業局の事例集では、中小製造業が工場見学をする目的として、取引先への信頼性のPRや自社ブランドの向上が挙げられている。採用と営業の両方に効く発信になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "見学に来た人が驚いた、うちの工場の3か所",
    "source": {
      "title": "関西の中小企業事例集 frontline",
      "url": "https://www.kansai.meti.go.jp/1-9chushoresearch/frontline/frontline_no14.pdf",
      "publisher": "近畿経済産業局",
      "date": null
    }
  },
  {
    "id": "success-068",
    "kind": "success",
    "title": "オープンファクトリーは社外への働きかけ",
    "summary": "近畿経済産業局の調査では、オープンファクトリーを取引先など社外への働きかけの手段として取り組む例が多く、品質への信頼を高める狙いもあった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "source": {
      "title": "オープンファクトリーの調査報告",
      "url": "https://www.kansai.meti.go.jp/1-9chushoresearch/openfactory/web_openfactoryreportbeyondexpo.pdf",
      "publisher": "近畿経済産業局",
      "date": null
    }
  },
  {
    "id": "success-069",
    "kind": "success",
    "title": "見せ方を考えると職人が変わる",
    "summary": "オープンファクトリーの一番の効果は職人の「気づき」で、どう見せるかを考えることが社内の意識づくり（インナーブランディング）につながる、と東北経産局の講演資料は紹介する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "source": {
      "title": "地方創生の取組（講演資料）",
      "url": "https://www.tohoku.meti.go.jp/kikaku/chihososei/topics/pdf/230106.pdf",
      "publisher": "東北経済産業局",
      "date": "2023-01"
    }
  },
  {
    "id": "term-245",
    "kind": "term",
    "title": "オープンファクトリー",
    "summary": "工場を一般の人や学生に開いて、ものづくりの現場を見たり体験したりしてもらう催し。地域でまとめて行うことが多く、採用・取引・地域づくりに役立つ。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "町工場のオープンファクトリー",
      "url": "https://newswitch.jp/p/19853",
      "publisher": "ニュースイッチ（日刊工業新聞）",
      "date": null
    }
  },
  {
    "id": "trend-147",
    "kind": "trend",
    "official": false,
    "title": "人手不足の町工場が工場を開く",
    "summary": "人手不足や住宅と工場の混在といった課題を抱える町工場が、解決策としてオープンファクトリーを活用する動きが広がっていると報じられている。人を呼び込み、魅力を体感してもらう狙い。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "町工場のオープンファクトリー",
      "url": "https://newswitch.jp/p/19853",
      "publisher": "ニュースイッチ（日刊工業新聞）",
      "date": null
    }
  },
  {
    "id": "term-246",
    "kind": "term",
    "title": "インナーブランディング",
    "summary": "会社の考え方や価値を、まず社員自身に分かってもらう取り組み。外に向けた発信（見学・ブログ）を考える過程で、社員が自分の仕事の価値に気づく効果がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "地方創生の取組（講演資料）",
      "url": "https://www.tohoku.meti.go.jp/kikaku/chihososei/topics/pdf/230106.pdf",
      "publisher": "東北経済産業局",
      "date": "2023-01"
    }
  },
  {
    "id": "success-070",
    "kind": "success",
    "title": "1日の仕事動画で知ってもらう",
    "summary": "SNS採用の成功事例を10の型に分けた解説では、仕事の1日を見せる動画や経営者の発信は「まず知ってもらう」段階に効くとしている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "新人の1日を朝から夕方まで追った",
    "source": {
      "title": "SNS採用の成功事例",
      "url": "https://tatap.jp/knowledge/sns-recruitment-success-cases/",
      "publisher": "tatap",
      "date": null
    }
  },
  {
    "id": "success-071",
    "kind": "success",
    "title": "条件は数字で先に出す",
    "summary": "同じ解説では、給与や休日などの条件を数字で先に出すことは応募数を増やす型、先輩社員の語りは入社を後押しする型とされる。課題に合う型を2〜3つ選ぶ。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "source": {
      "title": "SNS採用の成功事例",
      "url": "https://tatap.jp/knowledge/sns-recruitment-success-cases/",
      "publisher": "tatap",
      "date": null
    }
  },
  {
    "id": "pain-117",
    "kind": "pain",
    "title": "続ける人と応募の入口が要る",
    "summary": "SNS採用は、投稿を続ける体制、炎上を防ぐ工夫、応募までの道筋がないと、フォロワー数や再生数だけで終わりやすいと注意されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "SNS採用の成功事例",
      "url": "https://tatap.jp/knowledge/sns-recruitment-success-cases/",
      "publisher": "tatap",
      "date": null
    }
  },
  {
    "id": "question-215",
    "kind": "question",
    "title": "TikTokとInstagramどちら？",
    "summary": "運用代行会社のコラムでは、TikTokは10〜20代の利用が多く、転職を考える層の割合はInstagramより低いとしている。高卒・若手向けか転職者向けかで使い分けたい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "採用SNSの選び方",
      "url": "https://stock-sun.com/column/recruitment-sns/",
      "publisher": "ストックサン",
      "date": null
    }
  },
  {
    "id": "question-216",
    "kind": "question",
    "title": "技能検定って何がいい？",
    "summary": "厚労省の2008年の分析では、小さい会社ほど技能検定のメリットとして「社内での技能継承」を挙げる傾向があった。大きい会社では評価基準や取引上の効果が目立った。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "うちが技能検定を受けさせる理由",
    "source": {
      "title": "技能検定の受検動機等の分析",
      "url": "https://www.mhlw.go.jp/shingi/2008/11/dl/s1125-6a.pdf",
      "publisher": "厚生労働省（審議会資料）",
      "date": "2008-11"
    }
  },
  {
    "id": "success-072",
    "kind": "success",
    "title": "資格手当で受検を後押し",
    "summary": "厚労省の分析では、会社員の受検動機は「勤務先の勧め」が多く、合格時の資格手当とつながりやすい。受検料や講習会、材料費も会社負担の割合が高かった（2008年）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "source": {
      "title": "技能検定の受検動機等の分析",
      "url": "https://www.mhlw.go.jp/shingi/2008/11/dl/s1125-6a.pdf",
      "publisher": "厚生労働省（審議会資料）",
      "date": "2008-11"
    }
  },
  {
    "id": "success-073",
    "kind": "success",
    "title": "1級合格で後輩指導がしやすく",
    "summary": "機械加工技能士（数値制御旋盤作業）1級に合格した人は、後輩に教えやすくなり、専門用語がそろって打ち合わせがスムーズになったと語っている（厚労省の合格者の声）。",
    "industries": [
      "切削加工",
      "金属加工"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "技能士の先輩が語る、合格して変わったこと",
    "source": {
      "title": "合格者の声 機械加工技能士1級",
      "url": "https://waza.mhlw.go.jp/goukakusya/voice2.html",
      "publisher": "厚生労働省",
      "date": null
    }
  },
  {
    "id": "term-247",
    "kind": "term",
    "title": "技能検定と技能士",
    "summary": "技能検定は働く人の技能を国が決めた基準で認める試験で、合格すると「技能士」を名乗れる。等級は主に1級・2級・3級などに分かれる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "技能検定の受検申請",
      "url": "https://www.pref.ibaraki.jp/soshiki/shokorodo/sanjin/kentei/zyukensinsei.html",
      "publisher": "茨城県",
      "date": null
    }
  },
  {
    "id": "question-217",
    "kind": "question",
    "title": "技能検定は何年で受けられる？",
    "summary": "茨城県の案内では、実務経験だけで受ける場合の目安は1級7年以上、2級2年以上、3級は検定職種の実務経験が必要。学歴や訓練歴で年数が変わるので、県の協会で確認する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "入社何年目でどの級を目指せるか",
    "source": {
      "title": "技能検定の受検申請",
      "url": "https://www.pref.ibaraki.jp/soshiki/shokorodo/sanjin/kentei/zyukensinsei.html",
      "publisher": "茨城県",
      "date": null
    }
  },
  {
    "id": "trend-148",
    "kind": "trend",
    "official": true,
    "title": "若者の技能検定は手数料が安く",
    "summary": "鹿児島県では、23歳未満の人が2級・3級の実技試験を受けるとき受検手数料が減免される案内を出している。若手の資格取得を後押ししやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "若年者の技能検定 受検手数料減免",
      "url": "https://www.pref.kagoshima.jp/af04/sangyo-rodo/rodo/noryoku/r6jskunennsyagennmenn.html",
      "publisher": "鹿児島県",
      "date": "2024"
    }
  },
  {
    "id": "term-248",
    "kind": "term",
    "title": "機械保全技能士",
    "summary": "工場の機械を点検・修理する技能を認める技能検定の資格。高卒採用で「入社後に目指せる資格」として示すと、キャリアの道筋が伝わりやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業の高卒採用ホワイトペーパー",
      "url": "https://active.nikkeibp.co.jp/atcl/wp/b/26/02/12/06012/",
      "publisher": "日経BP Active",
      "date": "2026-02"
    }
  },
  {
    "id": "term-249",
    "kind": "term",
    "title": "資格手当",
    "summary": "会社が決めた資格を持つ社員に、毎月の給与に上乗せして払う手当。求人や記事で金額と対象資格を書くと、学ぶ意欲のある人に響く。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "技能検定の受検動機等の分析",
      "url": "https://www.mhlw.go.jp/shingi/2008/11/dl/s1125-6a.pdf",
      "publisher": "厚生労働省（審議会資料）",
      "date": "2008-11"
    }
  },
  {
    "id": "term-250",
    "kind": "term",
    "title": "多能工化",
    "summary": "一人が複数の作業や工程をこなせるようにする取り組み。トヨタ生産方式で知られ、休みや急な欠員があっても仕事が回る強い職場づくりにつながる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "一人で何台の機械を担当できるようにしたか",
    "source": {
      "title": "多能工化とは",
      "url": "https://www.kaonavi.jp/dictionary/tanokoka/",
      "publisher": "カオナビ人事用語集",
      "date": null
    }
  },
  {
    "id": "term-251",
    "kind": "term",
    "title": "単能工",
    "summary": "一つの作業を専門に担う人。難しい作業や想定外のトラブルにも強い一方、その人がいないと止まりやすい。多能工とどう組み合わせるかが大事。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "多能工化とは",
      "url": "https://www.kaonavi.jp/dictionary/tanokoka/",
      "publisher": "カオナビ人事用語集",
      "date": null
    }
  },
  {
    "id": "pain-118",
    "kind": "pain",
    "title": "多能工化は時間がかかり人も辞める？",
    "summary": "多能工化のデメリットとして、育てるのに時間がかかる、評価の仕組みを作り直す必要がある、負担が増えて離職につながるおそれがある、の3つが挙げられる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "source": {
      "title": "多能工化のメリット・デメリット",
      "url": "https://schoo.jp/biz/column/905",
      "publisher": "Schoo",
      "date": null
    }
  },
  {
    "id": "pain-119",
    "kind": "pain",
    "title": "覚えた技能を給与に反映できない",
    "summary": "多能工化を進めるには、身につけたスキルを評価して報酬に反映させる人事評価の見直しが大事だとされる。覚える作業だけ増えると不満のもとになる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "できる作業が増えると給料はどう変わるか",
    "source": {
      "title": "多能工化の進め方",
      "url": "https://business.ntt-east.co.jp/bizdrive/column/post_88.html",
      "publisher": "NTT東日本 BizDrive",
      "date": null
    }
  },
  {
    "id": "question-218",
    "kind": "question",
    "title": "いろいろな作業を覚えられる？",
    "summary": "多能工化は社員にとって成長の機会が広がり、将来の配置転換の幅も広がるとされる。求職者には「どの順番で何を覚えるか」を示すと、将来の姿が見えやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "多能工化のメリット・デメリット",
      "url": "https://schoo.jp/biz/column/905",
      "publisher": "Schoo",
      "date": null
    }
  },
  {
    "id": "term-252",
    "kind": "term",
    "title": "スキルマップ",
    "summary": "社員ごとに、どの作業がどのくらいできるかを一覧表にしたもの。多能工化や教育の計画に使い、求職者にも「育ち方」の見本として見せられる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "うちのスキルマップを見せます",
    "source": {
      "title": "多能工化とは",
      "url": "https://www.kaonavi.jp/dictionary/tanokoka/",
      "publisher": "カオナビ人事用語集",
      "date": null
    }
  },
  {
    "id": "success-074",
    "kind": "success",
    "title": "スマホで撮って作業マニュアル化",
    "summary": "岐阜県のプレス加工会社は、スマホで作業を撮って画像・動画付きの作業マニュアルを作り共有する仕組みを入れた。ベテランの経験に頼っていたノウハウが品質を支えていたと分かったのがきっかけ。",
    "industries": [
      "プレス"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "ベテランの作業をスマホで撮ってみた",
    "source": {
      "title": "スマホで作業マニュアルを作り技能伝承",
      "url": "https://d3hszuitxs3pnr.cloudfront.net/doc/factorymanagement_aitech.pdf",
      "publisher": "工場管理（記事抜刷）",
      "date": null
    }
  },
  {
    "id": "success-075",
    "kind": "success",
    "title": "熟練者のコツを動画とVRで伝える",
    "summary": "精密機械メーカーで、熟練技術者のノウハウを取り出して動画マニュアルにし、VR訓練やAR作業支援と組み合わせた例がある。習得期間の短縮や質問の減少が挙がるが、売り手側の紹介。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "source": {
      "title": "動画マニュアルとVR/ARで技能伝達",
      "url": "https://mono.ipros.com/product/detail/2001523692",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "trend-149",
    "kind": "trend",
    "official": false,
    "title": "撮るだけでAIが手順書を作る",
    "summary": "作業をスマホで撮影するだけで、AIが写真付きの手順書を作るサービスも出てきた。特別な機材は要らないとされる。小さな工場でも作業標準を残しやすくなっている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "スマホ撮影でAIが手順書を作るサービス",
      "url": "https://prtimes.jp/main/html/rd/p/000000002.000186286.html",
      "publisher": "PR TIMES",
      "date": null
    }
  },
  {
    "id": "success-076",
    "kind": "success",
    "title": "自治体もベテランの技を動画に",
    "summary": "静岡市の水道事業では、ベテラン職員の「熟練の技」に焦点を当てた動画を作った。製造業でなくても、技を動画で残す考え方は町工場の技能伝承の参考になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "source": {
      "title": "熟練の技を動画で残す",
      "url": "https://www.city.shizuoka.lg.jp/documents/1252/000927987.pdf",
      "publisher": "静岡市",
      "date": null
    }
  },
  {
    "id": "term-253",
    "kind": "term",
    "title": "暗黙知",
    "summary": "言葉や数字にしにくい、経験で身についた勘やコツ。町工場の品質を支えていることが多く、動画や写真で残すことが技能伝承の第一歩になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "言葉にできなかったベテランのコツを動画にした",
    "source": {
      "title": "スマホで作業マニュアルを作り技能伝承",
      "url": "https://d3hszuitxs3pnr.cloudfront.net/doc/factorymanagement_aitech.pdf",
      "publisher": "工場管理（記事抜刷）",
      "date": null
    }
  },
  {
    "id": "term-254",
    "kind": "term",
    "title": "作業標準書",
    "summary": "作業の手順・注意点・品質の基準を決めた書類。動画付きにすると新人が覚えやすく、ベテランと新人の動きを比べて教え方を改善することにも使える。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "スマホで作業マニュアルを作り技能伝承",
      "url": "https://d3hszuitxs3pnr.cloudfront.net/doc/factorymanagement_aitech.pdf",
      "publisher": "工場管理（記事抜刷）",
      "date": null
    }
  },
  {
    "id": "success-077",
    "kind": "success",
    "title": "女性専用トイレを増やして採用",
    "summary": "神奈川の輸送用機械メーカーは、女性採用を始めたのをきっかけに工場に女性専用トイレを増設した。事務職も含め全新入社員に現場実習をし、出た課題を改善している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "女性の社員が増えて変えた工場の設備",
    "source": {
      "title": "女性活躍・両立支援の事例",
      "url": "https://positive-ryouritsu.mhlw.go.jp/practice/detail?id=143",
      "publisher": "厚生労働省 両立支援のひろば",
      "date": null
    }
  },
  {
    "id": "success-078",
    "kind": "success",
    "title": "トイレ・更衣室で女性比率0→38%",
    "summary": "愛知県の製造業は、女性雇用を始めた当初は女性比率0%だったが、取引先の協力も得てトイレや更衣室、休憩室を整えたところ、最大38%まで伸びたと報告している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "source": {
      "title": "女性雇用の取組事例",
      "url": "https://www.city.handa.lg.jp/_res/projects/default_project/_page_/001/006/110/008_takedakougyou_jirei.pdf",
      "publisher": "半田市",
      "date": null
    }
  },
  {
    "id": "success-079",
    "kind": "success",
    "title": "女性の意見で設備を整える",
    "summary": "東京都大田区の町工場が、女性社員の意見を取り入れてトイレと更衣室を整えた例が日刊工業新聞で紹介されている。使う人の声から決めるのがポイント。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "source": {
      "title": "女性の意見でトイレ・更衣室整備",
      "url": "https://newswitch.jp/p/1553",
      "publisher": "ニュースイッチ（日刊工業新聞）",
      "date": null
    }
  },
  {
    "id": "pain-120",
    "kind": "pain",
    "title": "女性採用は環境整備に手間",
    "summary": "女性を採用するには更衣室や産休・育休の整備が必要で手間がかかる。ただ、その整備は社員全員の働く環境の向上にもつながるとされる（2018年の調査）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "source": {
      "title": "中小製造業の女性活躍",
      "url": "https://www.scbri.jp/reports/.assets/industry_20180926.pdf",
      "publisher": "信金中央金庫 地域・中小企業研究所",
      "date": "2018-09"
    }
  },
  {
    "id": "trend-150",
    "kind": "trend",
    "official": true,
    "title": "女性用トイレ等の整備に助成",
    "summary": "札幌市の「ものづくり企業女性就職促進助成金」（令和6年度）は、女性専用のトイレ・更衣室・休憩室の新設や増設に最大50万円、助成率3分の2を出す。制度は年度で変わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ものづくり企業女性就職促進助成金",
      "url": "https://www.city.sapporo.jp/keizai/seizo/shien/documents/r6zyoseisyusyokusokusinchirashi.pdf",
      "publisher": "札幌市",
      "date": "2024"
    }
  },
  {
    "id": "question-219",
    "kind": "question",
    "title": "女性でも働きやすい工場？",
    "summary": "女性の求職者は、トイレや更衣室、休憩室があるか、産休・育休が取れるかを気にする。設備の写真や、実際に働く女性の声を記事で見せると判断しやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "女性の先輩に聞いた、うちで働きやすい所",
    "source": {
      "title": "女性雇用の取組事例",
      "url": "https://www.city.handa.lg.jp/_res/projects/default_project/_page_/001/006/110/008_takedakougyou_jirei.pdf",
      "publisher": "半田市",
      "date": null
    }
  },
  {
    "id": "trend-151",
    "kind": "trend",
    "official": true,
    "title": "70歳までの就業確保、中小で3割強",
    "summary": "2024年の厚労省調査では、70歳までの就業確保措置を実施済みの会社は31.9%で、中小企業（21〜300人）は32.4%と大企業の25.5%より高かった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "70歳までの就業確保措置の状況",
      "url": "https://www.jil.go.jp/kokunai/blt/backnumber/2025/03/kokunai_02.html",
      "publisher": "労働政策研究・研修機構",
      "date": "2025-03"
    }
  },
  {
    "id": "term-255",
    "kind": "term",
    "title": "70歳就業確保措置",
    "summary": "70歳まで働く機会を確保するよう会社に求められている努力義務。定年の廃止・引き上げ、継続雇用制度、業務委託、社会貢献事業などの選び方がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "60代のベテランがうちで働き続ける理由",
    "source": {
      "title": "70歳までの就業確保措置の状況",
      "url": "https://www.jil.go.jp/kokunai/blt/backnumber/2025/03/kokunai_02.html",
      "publisher": "労働政策研究・研修機構",
      "date": "2025-03"
    }
  },
  {
    "id": "term-256",
    "kind": "term",
    "title": "継続雇用制度",
    "summary": "定年後も希望する社員を引き続き雇う制度。70歳までの就業確保の方法として最も多く選ばれており、ベテランの技能を若手に伝える時間をつくれる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "70歳までの就業確保措置の状況",
      "url": "https://www.jil.go.jp/kokunai/blt/backnumber/2025/03/kokunai_02.html",
      "publisher": "労働政策研究・研修機構",
      "date": "2025-03"
    }
  },
  {
    "id": "success-080",
    "kind": "success",
    "title": "シニア活躍の事例を探すには",
    "summary": "高齢・障害・求職者雇用支援機構の「高年齢者活躍企業事例サイト」で、高年齢者が活躍する会社の事例を探せる。製造業で絞り込めば、作業負担を減らす工夫などが参考になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "高年齢者活躍企業事例",
      "url": "https://www.kourei-koyou.mhlw.go.jp/seniorcitizen.html",
      "publisher": "高齢・障害・求職者雇用支援機構",
      "date": null
    }
  },
  {
    "id": "trend-152",
    "kind": "trend",
    "official": true,
    "title": "製造業の就業者は1,033万人に",
    "summary": "2026年版ものづくり白書によると、製造業の就業者は2023年の1,055万人から2025年は1,033万人に減った。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "2026年版ものづくり白書 概要",
      "url": "https://www.meti.go.jp/report/whitepaper/mono/2026/pdf/gaiyo.pdf",
      "publisher": "経済産業省・厚生労働省・文部科学省",
      "date": "2026-05"
    }
  },
  {
    "id": "trend-153",
    "kind": "trend",
    "official": true,
    "title": "製造業の若手比率は25%前後",
    "summary": "2026年版ものづくり白書では、製造業の34歳以下の割合は2002年の31.4%から2025年は25.0%に下がった。ただ、ここ10年ほどは25%前後で横ばいが続く。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "2026年版ものづくり白書 概要",
      "url": "https://www.meti.go.jp/report/whitepaper/mono/2026/pdf/gaiyo.pdf",
      "publisher": "経済産業省・厚生労働省・文部科学省",
      "date": "2026-05"
    }
  },
  {
    "id": "trend-154",
    "kind": "trend",
    "official": true,
    "title": "白書が能力開発の課題を節に",
    "summary": "2026年版ものづくり白書の目次には「製造業における能力開発の課題」という項目があり、リスキリングを含む能力開発の現状を取り上げている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "2026年版ものづくり白書 目次",
      "url": "https://www.meti.go.jp/report/whitepaper/mono/2026/pdf/mokuji.pdf",
      "publisher": "経済産業省・厚生労働省・文部科学省",
      "date": "2026-05"
    }
  },
  {
    "id": "trend-155",
    "kind": "trend",
    "official": true,
    "title": "ものづくり人材のリスキリング",
    "summary": "2025年版ものづくり白書は、第2章「就業動向と人材確保・育成」で、ものづくり人材のリスキリングを含む能力開発の現状を取り上げている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "2025年版ものづくり白書 目次",
      "url": "https://www.meti.go.jp/report/whitepaper/mono/2025/pdf/mokuji.pdf",
      "publisher": "経済産業省・厚生労働省・文部科学省",
      "date": "2025-05"
    }
  },
  {
    "id": "trend-156",
    "kind": "trend",
    "official": true,
    "title": "訓練休暇の助成を時間単位にも",
    "summary": "厚労省資料によると、2024年4月から人材開発支援助成金の人への投資促進コースで、長期教育訓練休暇を時間単位でも対象にし、中小企業の助成の上限や額を引き上げた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ものづくり人材の能力開発（資料）",
      "url": "https://www.mhlw.go.jp/content/001496473.pdf",
      "publisher": "厚生労働省",
      "date": "2025"
    }
  },
  {
    "id": "pain-121",
    "kind": "pain",
    "title": "DX人材が足りず社内で育てる",
    "summary": "2025年版ものづくり白書を解説したMONOistは、DX人材の不足が目立ち、社内での育成で間に合わせる傾向があると伝えている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "ものづくり白書2025 DX人材",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2506/11/news053_3.html",
      "publisher": "MONOist",
      "date": "2025-06"
    }
  },
  {
    "id": "term-257",
    "kind": "term",
    "title": "リスキリング",
    "summary": "仕事の変化に合わせて、新しい知識や技能を学び直すこと。町工場では、デジタル機器の扱いや新しい加工方法を社員に身につけてもらう取り組みを指すことが多い。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "50代の職人がCADを覚えた話",
    "source": {
      "title": "2025年版ものづくり白書 目次",
      "url": "https://www.meti.go.jp/report/whitepaper/mono/2025/pdf/mokuji.pdf",
      "publisher": "経済産業省・厚生労働省・文部科学省",
      "date": "2025-05"
    }
  },
  {
    "id": "trend-157",
    "kind": "trend",
    "official": false,
    "title": "統合補助金の第1回は締切延期",
    "summary": "ものづくり補助金と新事業進出補助金を一本化した新制度の第1回公募は、締切が2026年10月30日に延び、採択発表は2027年1月予定と報じられた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "「新事業進出・ものづくり商業サービス補助金」第1回公募スケジュールが変更",
      "url": "https://sogyotecho.jp/?p=263377",
      "publisher": "創業手帳",
      "date": "2026"
    }
  },
  {
    "id": "term-258",
    "kind": "term",
    "title": "統合補助金の3つの枠",
    "summary": "新しい「新事業進出・ものづくり商業サービス補助金」には、革新的新製品・サービス枠、新事業進出枠、グローバル枠があると紹介されている。金額や要件は公募要領の原本で確かめる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "新しい設備で何が作れるようになったかを書く",
    "source": {
      "title": "「新事業進出・ものづくり商業サービス補助金」第1回公募スケジュールが変更",
      "url": "https://sogyotecho.jp/?p=263377",
      "publisher": "創業手帳",
      "date": "2026"
    }
  },
  {
    "id": "term-259",
    "kind": "term",
    "title": "賃上げすると補助率が上がる特例",
    "summary": "統合前のものづくり補助金（第23次）では、事業所内の最低賃金を引き上げる事業者の補助率を2/3に上げる特例があった。新制度で続くかは公募要領で確認が必要。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "ものづくり補助金をわかりやすく解説",
      "url": "https://sogyotecho.jp/monodukurihojyo-wakariyasuku",
      "publisher": "創業手帳",
      "date": null
    }
  },
  {
    "id": "trend-158",
    "kind": "trend",
    "official": false,
    "title": "ものづくり補助金の採択率は3〜5割",
    "summary": "解説記事によると近年の採択率は35〜50%ほどで、第22次では高付加価値化枠が約38%、グローバル枠が約27%。回や枠で大きく変わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "ものづくり補助金 解説",
      "url": "https://samurai-law.com/hojokin/category/mono/",
      "publisher": "SAMURAI行政書士法人",
      "date": null
    }
  },
  {
    "id": "pain-122",
    "kind": "pain",
    "title": "計画書の専門用語が審査員に届かない",
    "summary": "審査員は1件を短い時間で読み、分からない言葉を調べてくれない。業界の中でしか通じない言葉は「書かれていない」のと同じ扱いになりやすいと指摘されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "専門用語を1行で言いかえる習慣をつける",
    "source": {
      "title": "補助金初心者向け解説",
      "url": "https://hojyokin-portal.jp/professional/HB0C73X67W57ST5/articles/hojyokin_beginner",
      "publisher": "補助金ポータル",
      "date": null
    }
  },
  {
    "id": "pain-123",
    "kind": "pain",
    "title": "審査項目・加点項目の書き漏れ",
    "summary": "不採択のあとに多い相談は「審査項目や加点項目について記載がない」と指摘されたというもの。公募要領の審査項目を見出しにして書くと漏れを防げる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "補助金初心者向け解説（2）",
      "url": "https://hojyokin-portal.jp/professional/HB0C73X67W57ST5/articles/hojyokin_beginner2",
      "publisher": "補助金ポータル",
      "date": null
    }
  },
  {
    "id": "term-260",
    "kind": "term",
    "title": "不採択の理由は教えてもらえない",
    "summary": "公募要領には、書類の不備や対象外の事業は審査されずに不採択となり、採択結果の理由開示や異議申し立ては受け付けないと書かれている。出す前の点検が大事。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "公募要領（栃木県掲載）",
      "url": "https://www.pref.tochigi.lg.jp/f02/documents/20250217102700.pdf",
      "publisher": "栃木県",
      "date": "2025-02"
    }
  },
  {
    "id": "pain-124",
    "kind": "pain",
    "title": "不採択から書き直して再挑戦",
    "summary": "ものづくり補助金で落ちた会社向けに、事業計画書をどう直して再申請するかを解説する記事が多い。落ちた原因の多くは計画の中身より伝え方にある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ものづくり補助金 不採択｜再申請で通すための事業計画書修正法",
      "url": "https://atsoho.com/blog/manufacturing-subsidy-reapplication-guide",
      "publisher": "atsoho",
      "date": null
    }
  },
  {
    "id": "term-261",
    "kind": "term",
    "title": "審査で見られる3つのキーワード",
    "summary": "事業再構築補助金の解説では、革新性・地域経済への効果・シナジー効果が計画書に入っているかが採択に効くとされる。ものづくり補助金の審査項目にも重なる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "補助金初心者向け解説（3）",
      "url": "https://hojyokin-portal.jp/professional/HB0C73X67W57ST5/articles/hojyokin_beginner3",
      "publisher": "補助金ポータル",
      "date": null
    }
  },
  {
    "id": "term-262",
    "kind": "term",
    "title": "補助金はお金を使ったあとに入る",
    "summary": "補助金は対象経費を払ったあとに交付される。投資のお金は先に用意する必要があり、入る予定の補助金で投資する計画や、すでに済んだ投資での申請は誤りとされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "補助金の活用について",
      "url": "https://www.pref.mie.lg.jp/common/content/000368976.pdf",
      "publisher": "三重県",
      "date": null
    }
  },
  {
    "id": "term-263",
    "kind": "term",
    "title": "補助金つなぎ融資という仕組み",
    "summary": "愛知県の「補助金つなぎ」融資は、交付決定を受けた中小企業が対象で、交付決定額が上限、期間2年以内・一括返済。補助金の振込先の金融機関が窓口になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "パワーアップ資金【補助金つなぎ】",
      "url": "https://www.pref.aichi.jp/uploaded/attachment/557999.pdf",
      "publisher": "愛知県",
      "date": null
    }
  },
  {
    "id": "pain-125",
    "kind": "pain",
    "title": "補助金ありきの計画になってしまう",
    "summary": "補助金はもともと考えていた投資を前倒しする後押しとして使うもので、補助金をもらうために事業を考えるのは筋が違う、という指摘がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "補助金より先に「なぜこの設備か」を書く",
    "source": {
      "title": "補助金活用の注意点",
      "url": "https://newswitch.jp/p/12042",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "term-264",
    "kind": "term",
    "title": "省力化補助金のカタログ型とは",
    "summary": "カタログ型は、清掃ロボットや無人搬送車など人手不足に効く汎用製品を「カタログ」に載せ、そこから選んで導入する方式。一般型は自社に合わせた設備が対象。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "中小企業省力化投資補助事業 EBPM検証シナリオ",
      "url": "https://www.meti.go.jp/policy/policy_management/ebpm/kensyo_shinario/260331_syoryokuka.pdf",
      "publisher": "経済産業省",
      "date": "2026-03"
    }
  },
  {
    "id": "term-265",
    "kind": "term",
    "title": "カタログ型は補助率1/2",
    "summary": "省力化投資補助金カタログ型の補助率は1/2で、補助上限額は従業員数によって違う。最新の上限は公式サイトで確かめる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "省力化投資補助金カタログ型 資料",
      "url": "https://www.ginga.or.jp/_cms/wp-content/uploads/2026/02/%E8%B3%87%E6%96%99%E2%91%A2%E7%9C%81%E5%8A%9B%E5%8C%96%E6%8A%95%E8%B3%87%E8%A3%9C%E5%8A%A9%E9%87%91%E3%82%AB%E3%82%BF%E3%83%AD%E3%82%B0%E5%9E%8B.pdf",
      "publisher": "銀河（支援機関）",
      "date": "2026-02"
    }
  },
  {
    "id": "term-266",
    "kind": "term",
    "title": "製造業×無人搬送車の例",
    "summary": "自治体の案内では、省力化投資補助金の使い方の例として「製造業×無人搬送車」が挙げられている。運搬の手間を減らす設備は製造業で使いやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "運搬を自動化して変わった工場の1日",
    "source": {
      "title": "省力化投資補助金の案内",
      "url": "https://www.pref.tokushima.lg.jp/file/attachment/940710.pdf",
      "publisher": "徳島県",
      "date": null
    }
  },
  {
    "id": "trend-159",
    "kind": "trend",
    "official": true,
    "title": "カタログ型の活用事例集が公開",
    "summary": "中小企業庁はカタログ注文型の活用事例集（2025年2月）を出し、補助を受けた事業者への聞き取りで省力化の効果やメッセージを紹介している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "カタログ注文型 活用事例集",
      "url": "https://www.pref.yamanashi.jp/documents/119555/shoryokuka_catalog_case_studies.pdf",
      "publisher": "中小企業庁（山梨県掲載）",
      "date": "2025-02"
    }
  },
  {
    "id": "trend-160",
    "kind": "trend",
    "official": false,
    "title": "一般型で複数設備を入れた製造業",
    "summary": "省力化投資補助金・一般型の採択事例として、複数の設備を入れて生産能力を上げた製造業の例が紹介されている。自社専用の設備を組み合わせられるのが一般型の特徴。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "設備導入で増えた生産能力を数字で書く",
    "source": {
      "title": "省力化投資補助金 採択事例",
      "url": "https://hojyokin-portal.jp/columns/shoryokuka_saitakujirei",
      "publisher": "補助金ポータル",
      "date": null
    }
  },
  {
    "id": "trend-161",
    "kind": "trend",
    "official": false,
    "title": "IT導入補助金が名前を変えた",
    "summary": "2026年からIT導入補助金は「デジタル化・AI導入補助金」に改称された。より踏み込んだデジタル化とAI活用を広めるためとされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "デジタル化・AI導入補助金2026",
      "url": "https://sogyotecho.jp/news/20260127digital-ai/",
      "publisher": "創業手帳",
      "date": "2026-01"
    }
  },
  {
    "id": "term-267",
    "kind": "term",
    "title": "支援事業者と組まないと申請できない",
    "summary": "デジタル化・AI導入補助金は、事務局に登録された「IT導入支援事業者」と組んで申請する。対象のツールも事前審査を受けて登録されたものに限られる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "デジタル化・AI導入補助金2026の公募",
      "url": "https://netshop.impress.co.jp/e/2026/05/01/16018",
      "publisher": "ネットショップ担当者フォーラム",
      "date": "2026-05"
    }
  },
  {
    "id": "trend-162",
    "kind": "trend",
    "official": false,
    "title": "2026年は3月末から順に締切",
    "summary": "デジタル化・AI導入補助金2026は3月30日に受付が始まり、1次5月12日から4次8月25日まで締切が続くと報じられた（5月時点）。回ごとに締切がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "デジタル化・AI導入補助金2026の公募",
      "url": "https://netshop.impress.co.jp/e/2026/05/01/16018",
      "publisher": "ネットショップ担当者フォーラム",
      "date": "2026-05"
    }
  },
  {
    "id": "question-220",
    "kind": "question",
    "title": "「AI導入補助金」は別にあるの？",
    "summary": "「AI導入補助金」という単独の制度はなく、この言葉はデジタル化・AI導入補助金を指すと解説されている。名前の似た制度に気をつける。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "AI導入補助金とは",
      "url": "https://www.issoh.co.jp/column/details/13781/",
      "publisher": "一創",
      "date": null
    }
  },
  {
    "id": "trend-163",
    "kind": "trend",
    "official": true,
    "title": "持続化補助金はおよそ半数が採択",
    "summary": "小規模事業者持続化補助金（一般型・第18回）は17,318件の申請に対し8,330件が採択（2026年3月発表）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "第18回公募 採択事業者の決定",
      "url": "https://www.chusho.meti.go.jp/koukai/hojyokin/saitaku/2026/260317002.html",
      "publisher": "中小企業庁",
      "date": "2026-03"
    }
  },
  {
    "id": "trend-164",
    "kind": "trend",
    "official": false,
    "title": "持続化補助金・第20回は12月締切",
    "summary": "持続化補助金（一般型・通常枠）第20回は、受付2026年11月5日〜12月15日、商工会等が出す事業支援計画書（様式4）の発行締切は12月4日と案内されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "小規模事業者持続化補助金（第20回）",
      "url": "https://www.shigyo.co.jp/post_topics/jizokuka20/",
      "publisher": "士業（解説サイト）",
      "date": "2026"
    }
  },
  {
    "id": "term-268",
    "kind": "term",
    "title": "様式4は早めに頼む",
    "summary": "持続化補助金では、地域の商工会・商工会議所が出す「事業支援計画書（様式4）」が必要で、申請締切より前に発行締切がある。ぎりぎりだと間に合わない。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "小規模事業者持続化補助金（第20回）",
      "url": "https://www.shigyo.co.jp/post_topics/jizokuka20/",
      "publisher": "士業（解説サイト）",
      "date": "2026"
    }
  },
  {
    "id": "term-269",
    "kind": "term",
    "title": "よろず支援拠点は無料の経営相談所",
    "summary": "よろず支援拠点は全国47都道府県にある無料の経営相談所。売上を伸ばす、資金繰り、IT活用・SNS・Webサイトなど幅広く相談できる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "秋田県よろず支援拠点",
      "url": "https://www.pref.akita.lg.jp/uploads/public/archive_0000070900_00/10_03_秋田県よろず支援拠点.pdf",
      "publisher": "秋田県",
      "date": null
    }
  },
  {
    "id": "success-081",
    "kind": "success",
    "title": "Webの悩みもよろずで相談",
    "summary": "よろず支援拠点によってはWeb・SNSの活用やマーケティングに詳しい相談員を置いている。ホームページやブログの直し方を無料で聞ける。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "よろず支援拠点の紹介（北陸）",
      "url": "https://lfb.mof.go.jp/hokuriku/content/022/2025053006.pdf",
      "publisher": "北陸財務局",
      "date": "2025-05"
    }
  },
  {
    "id": "trend-165",
    "kind": "trend",
    "official": true,
    "title": "東京のよろずは年1,252件を解決",
    "summary": "東京都よろず支援拠点は相談に合わせて解決策を助言し成果まで追う仕組みで、2022年の課題解決件数は1,252件と報告されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "東京都よろず支援拠点の取組",
      "url": "https://www.city.bunkyo.lg.jp/documents/7134/20242591731.pdf",
      "publisher": "文京区",
      "date": "2024"
    }
  },
  {
    "id": "term-270",
    "kind": "term",
    "title": "依頼試験と機器開放の違い",
    "summary": "公設試の「依頼試験」は職員が試験して報告書を出す方式、「機器開放」は自分で装置を動かしてその場で結果を見る方式。条件を変えて試すなら機器開放が向く。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "自社製品の性能を公設試で測った話",
    "source": {
      "title": "岐阜県工業技術研究所 レター",
      "url": "https://www.gitec.rd.pref.gifu.lg.jp/files/letters/2023/letter_gitec_2023_48.pdf",
      "publisher": "岐阜県工業技術研究所",
      "date": "2023"
    }
  },
  {
    "id": "term-271",
    "kind": "term",
    "title": "公設試は安く使える技術の相談先",
    "summary": "公設試験研究機関は、技術相談・依頼試験や分析・機器の利用・共同研究などを低い料金で提供している。自社に測定器がなくても評価データを取れる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "公設試のすすめ",
      "url": "https://www.kansai.meti.go.jp/2giki/sangiren/susume/2023kousetsushinosusume.pdf",
      "publisher": "近畿経済産業局",
      "date": "2023"
    }
  },
  {
    "id": "question-221",
    "kind": "question",
    "title": "公設試に出すと秘密は守られる？",
    "summary": "千葉県の例では、試験を受ける職員には地方公務員法の守秘義務があると案内されている。開発中の製品でも安心して出せる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "受託試験のご案内",
      "url": "https://www.pref.chiba.lg.jp/sanken/iraishiken/jutakushiken.html",
      "publisher": "千葉県産業支援技術研究所",
      "date": null
    }
  },
  {
    "id": "term-272",
    "kind": "term",
    "title": "依頼試験の費用を補助する区も",
    "summary": "東京都江戸川区は、区内中小企業が公設試の依頼試験や機器利用に払う費用の1/2以内（上限10万円）を補助している。申請前に電話で相談する決まり。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "依頼試験等の助成",
      "url": "https://www.city.edogawa.tokyo.jp/e093/shigotosangyo/jigyosha_oen/sangyo_jigyosya/jyosei/seihinkaihatsu/iraishiken.html",
      "publisher": "江戸川区",
      "date": null
    }
  },
  {
    "id": "success-082",
    "kind": "success",
    "title": "第三者のデータで信用を足す",
    "summary": "公設試の試験結果は、取引先から第三者機関の結果を求められたときにも使える。自社の言い分だけでなく、公的な機関で測った数字を示せる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "公設試で測った数字を事例記事に入れる",
    "source": {
      "title": "岐阜県工業技術研究所 レター",
      "url": "https://www.gitec.rd.pref.gifu.lg.jp/files/letters/2022/letter_gitec_2022_36.pdf",
      "publisher": "岐阜県工業技術研究所",
      "date": "2022"
    }
  },
  {
    "id": "pain-126",
    "kind": "pain",
    "title": "名刺の数で展示会を評価してしまう",
    "summary": "展示会でよくある失敗は、来場者数や名刺の枚数を成果と見ること。対象外の業界や決める立場にない人の名刺が多くても商談にはつながりにくい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "海外展示会の成果の出し方",
      "url": "https://www.shopowner-support.net/attracting_customers/overseas-marketing-strategy/overseas-exhibition/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "pain-127",
    "kind": "pain",
    "title": "展示会後のフォローが人任せ",
    "summary": "展示会後のフォローが担当者ごとにばらばらで、せっかくの見込み客が放置されるという不満が多い。誰がいつ連絡するかを先に決めておく。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "展示会マーケティング",
      "url": "https://www.sungrove.co.jp/exhibition-marketing/",
      "publisher": "サングローブ",
      "date": null
    }
  },
  {
    "id": "term-273",
    "kind": "term",
    "title": "展示会は前・中・後の3段階で考える",
    "summary": "出展費用を回収するには、出展前の準備、会場での運営、終わったあとのフォローの3段階すべてを設計する必要がある。名刺を集めて終わりでは投資の大半が無駄になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "展示会の前に記事を用意して当日に配る",
    "source": {
      "title": "展示会のリード獲得",
      "url": "https://stock-sun.com/column/tenjikai-lead-acquisition/",
      "publisher": "ストックサン",
      "date": null
    }
  },
  {
    "id": "success-083",
    "kind": "success",
    "title": "名刺にメモ、その日のうちにデータ化",
    "summary": "会場では名刺に話した内容のメモを残し、見込み客の情報は当日中にデジタル化するのがコツとされる。翌日以降だと記憶も熱も冷める。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "展示会リード獲得ガイド",
      "url": "https://start-link.jp/hubspot-ai/btob-marketing/lead-generation/exhibition-lead-acquisition-guide",
      "publisher": "StartLink",
      "date": null
    }
  },
  {
    "id": "pain-128",
    "kind": "pain",
    "title": "展示会の効果がすぐ出ない",
    "summary": "BtoBでは検討から発注まで数か月〜1年以上かかることもあり、展示会直後に成果がないと判断するのは早すぎるとされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "展示会で会った人が後から読む記事",
    "source": {
      "title": "展示会の効果",
      "url": "https://salesnow.jp/db/knowledge/50",
      "publisher": "SalesNow",
      "date": null
    }
  },
  {
    "id": "trend-166",
    "kind": "trend",
    "official": false,
    "title": "フォローは早いほど商談になる",
    "summary": "支援会社の記事は、展示会後24時間以内にフォローした見込み客の商談化率は1週間後の約4倍という調査を紹介し、48時間が勝負としている（元調査の業種は不明）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "展示会フォローは48時間が勝負",
      "url": "https://start-link.jp/hubspot-ai/btob-marketing/lead-generation/exhibition-followup-48hours",
      "publisher": "StartLink",
      "date": null
    }
  },
  {
    "id": "trend-167",
    "kind": "trend",
    "official": false,
    "title": "製造業の8割が展示会の効果測定に悩む",
    "summary": "マーケライズの調査（製造業の営業・販促担当、2026年4月）では約8割が効果測定に課題を感じ、明確に測れているのは2割ほど。見込み客の管理はExcelが過半数。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業界における展示会の実態を調査",
      "url": "https://prtimes.jp/main/html/rd/p/000000037.000022054.html",
      "publisher": "マーケライズ（PR TIMES）",
      "date": "2026-04"
    }
  },
  {
    "id": "pain-129",
    "kind": "pain",
    "title": "展示会で会っても連絡しない",
    "summary": "Sansanの資料（2024・2025年の調査を引用）では、展示会などで得た接点に、数回に1回ほどしかフォロー連絡をしていない人が多いと示されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "展示会フォローメールの資料",
      "url": "https://sin.sansan.com/wp-content/uploads/2025/04/sansan-exhibition-mail-followup.pdf",
      "publisher": "Sansan",
      "date": "2025-04"
    }
  },
  {
    "id": "term-274",
    "kind": "term",
    "title": "展示会の出展費を補助する市町村",
    "summary": "長野県茅野市は市内の中小企業の展示会出展に経費の1/2を補助し、上限は国内20万円・海外40万円・オンライン展示会10万円。地元の制度を先に調べる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "展示会等出展支援補助金",
      "url": "https://www.city.chino.lg.jp/uploaded/attachment/37119.pdf",
      "publisher": "茅野市",
      "date": null
    }
  },
  {
    "id": "pain-130",
    "kind": "pain",
    "title": "共同出展は補助の対象外のことも",
    "summary": "江東区は共同出展でも主催者に払った経費を人数で割って補助するが、豊島区は共同出展を対象外としている。自治体によって扱いが大きく違う。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "展示会出展補助",
      "url": "https://www.city.koto.lg.jp/102020/sangyoshigoto/chusho/hojokin/7610.html",
      "publisher": "江東区",
      "date": null
    }
  },
  {
    "id": "trend-168",
    "kind": "trend",
    "official": true,
    "title": "大阪府は小間料の2/3を補助",
    "summary": "大阪府の展示商談会向けの制度では、出展小間料が対象で補助率2/3、補助額10万〜78万円の範囲と案内されている（年度ごとに要確認）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "展示商談会出展支援",
      "url": "https://www.pref.osaka.lg.jp/documents/103578/chirasi.pdf",
      "publisher": "大阪府",
      "date": null
    }
  },
  {
    "id": "trend-169",
    "kind": "trend",
    "official": true,
    "title": "京都府は海外展示会を1/2補助",
    "summary": "京都府の海外展示会出展向けの制度は補助率1/2、上限50万円。府や市の多くは予算がなくなり次第受付を終える。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "海外展示会出展支援",
      "url": "https://www.pref.kyoto.jp/sangyo-sinko/monozukuri/kaigaitenkai/documents/tirasi.pdf",
      "publisher": "京都府",
      "date": null
    }
  },
  {
    "id": "term-275",
    "kind": "term",
    "title": "リアル展示会の強みは触れて聞けること",
    "summary": "実物に触れられ、スタッフに直接質問できるのはリアル展示会ならでは。触覚や匂いなどはオンラインで再現しにくいとMONOistは指摘している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業にとってオンライン展示会は“使える”のか？",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2304/17/news005.html",
      "publisher": "MONOist",
      "date": "2023-04"
    }
  },
  {
    "id": "pain-131",
    "kind": "pain",
    "title": "オンライン展示会は講演だけ見て帰る",
    "summary": "オンライン展示会で著名人の講演に人を集めても、聴いたらそのまま離れてしまいやすい。出展ブースまで見てもらう道筋づくりが課題。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業にとってオンライン展示会は“使える”のか？（2）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2304/17/news005_2.html",
      "publisher": "MONOist",
      "date": "2023-04"
    }
  },
  {
    "id": "success-084",
    "kind": "success",
    "title": "オンライン→自社開催→リアルの順に",
    "summary": "第三者主催のオンライン展示会で見込み客を集め、その情報を使って自社開催のオンライン展示会や実際の展示会へ呼ぶ、段階的な組み合わせ方が提案されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "展示会の内容をオンラインで後から見せる記事",
    "source": {
      "title": "製造業にとってオンライン展示会は“使える”のか？（2）",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2304/17/news005_2.html",
      "publisher": "MONOist",
      "date": "2023-04"
    }
  },
  {
    "id": "term-276",
    "kind": "term",
    "title": "オンライン展示会の費用の目安",
    "summary": "合同参加型のオンライン展示会は出展費20〜200万円ほど、自社で開く型は初期費用100万円以上が目安と解説されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "製造業のオンライン展示会",
      "url": "https://www.shopowner-support.net/attracting_customers/btob/event/online-exhibition-manufacturing-industry/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "success-085",
    "kind": "success",
    "title": "1分で説明できるブースにする",
    "summary": "J-Net21は、ブース設計の要点として、1分で説明できる、遠くと近くで見せ方を変える、会話のきっかけを作る、足を止める仕掛け、五感に訴える、の5つを挙げる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "自社の強みを1分で言う練習を記事にする",
    "source": {
      "title": "展示会で人を集めるブースの工夫は？",
      "url": "https://j-net21.smrj.go.jp/qa/development/Q0345.html",
      "publisher": "J-Net21（中小機構）",
      "date": null
    }
  },
  {
    "id": "success-086",
    "kind": "success",
    "title": "キャッチコピーは20m先から読める字で",
    "summary": "キャッチコピーは遠くから一目で読めることが大事で、20m前・5m前・目の前で見せ方を分ける。人の頭より上や小間の端に置くと混雑でも見える。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "展示会で人を集めるブースの工夫は？",
      "url": "https://j-net21.smrj.go.jp/solution/qa/special/Q0345.html",
      "publisher": "J-Net21（中小機構）",
      "date": null
    }
  },
  {
    "id": "success-087",
    "kind": "success",
    "title": "小間の場所で形を変える",
    "summary": "小間の位置で人の流れが変わるので、入口の前・狭い通路の前・休憩所の前など、場所に合わせて形や向きを変える考え方がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "展示会で人を集めるブースの工夫は？",
      "url": "https://j-net21.smrj.go.jp/qa/development/Q0345.html",
      "publisher": "J-Net21（中小機構）",
      "date": null
    }
  },
  {
    "id": "trend-170",
    "kind": "trend",
    "official": true,
    "title": "中小向けの展示会セミナーも無料で",
    "summary": "中小機構は「中小企業のための展示会成果向上セミナー」を2026年8月に八王子で無料開催した。人を引き寄せるブース設計を学べる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "中小企業のための展示会成果向上セミナー",
      "url": "https://j-net21.smrj.go.jp/snavi2/articles/187329",
      "publisher": "J-Net21（中小機構）",
      "date": "2026"
    }
  },
  {
    "id": "trend-171",
    "kind": "trend",
    "official": true,
    "title": "国が展示会の効果の測り方を調査",
    "summary": "経産省の委託調査（2026年3月）は、国内展示会の実態や効果の測り方のモデルづくり、中小企業やスタートアップが展示会で得る需要の効果を扱っている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "展示会産業の国際化に向けた実態把握調査",
      "url": "https://www.meti.go.jp/policy/mono_info_service/mono/creative/the_exhibition_industry_for_internationalization.pdf",
      "publisher": "経済産業省",
      "date": "2026-03"
    }
  },
  {
    "id": "trend-172",
    "kind": "trend",
    "official": true,
    "title": "新規輸出1万者支援に2.2万者超",
    "summary": "経産省・中企庁・ジェトロ・中小機構の「新規輸出1万者支援プログラム」は2022年12月開始で、登録は2万2,000者を超えたとジェトロが発表している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "ジェトロ ニュースリリース",
      "url": "https://www.jetro.go.jp/news/releases/2025/336cc66a3791e516.html",
      "publisher": "ジェトロ",
      "date": "2025"
    }
  },
  {
    "id": "term-277",
    "kind": "term",
    "title": "1万者支援は登録すると相談が来る",
    "summary": "新規輸出1万者支援プログラムは、ポータルから登録するとジェトロの専門家から連絡があり、個別のカウンセリングを受けられる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "新規輸出1万者支援プログラム",
      "url": "https://www.nishi.or.jp/jigyoshajoho/sangyoshinko/hanrokaitaku/JETROshinki1man.html",
      "publisher": "西宮市",
      "date": null
    }
  },
  {
    "id": "term-278",
    "kind": "term",
    "title": "ジェトロの展示会は出展料原則無料",
    "summary": "ジェトロの支援には、海外展示会への出展（出展料等は原則無料）、サンプル展示、オンライン商談、セミナー、商談準備の個別相談などがある。中身は開催地で違う。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "article_idea"
    ],
    "articleIdea": "海外の商談会に出て分かったこと",
    "source": {
      "title": "ジェトロの支援メニュー",
      "url": "https://www.kyo.or.jp/kyoto/pdf/kbr20260910_jetro.pdf",
      "publisher": "京都商工会議所",
      "date": "2026-09"
    }
  },
  {
    "id": "question-222",
    "kind": "question",
    "title": "輸出をやめていても支援を受けられる？",
    "summary": "新規輸出1万者支援は、新しい国や新しい商材で輸出する会社に加え、コロナ禍などで止まっていた輸出を再開する会社も対象になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "ジェトロの中小企業支援",
      "url": "https://www.shinkin.co.jp/osaka/corporation/support/img/jetro.pdf",
      "publisher": "大阪信用金庫",
      "date": null
    }
  },
  {
    "id": "term-279",
    "kind": "term",
    "title": "新輸出大国コンソーシアムの伴走",
    "summary": "海外展開を専門家が伴走して支える「新輸出大国コンソーシアム」のハンズオン支援があり、2025年度の採択企業は原則無料（審査あり）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "海外展開支援施策",
      "url": "https://www.tohoku.meti.go.jp/s_kokusai/kyogikai/pdf/260324_1-1.pdf",
      "publisher": "東北経済産業局",
      "date": "2026-03"
    }
  },
  {
    "id": "term-280",
    "kind": "term",
    "title": "ジェトロの貿易相談は無料",
    "summary": "ジェトロの貿易投資相談では、輸出入や海外進出の実務を経験あるアドバイザーが無料で答える。面談やメール（原則3営業日以内に回答）で使える。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "ジェトロ 案内パンフレット",
      "url": "https://www.jetro.go.jp/ext_images/jetro/profile/pdf/brochure_r.pdf",
      "publisher": "ジェトロ",
      "date": null
    }
  },
  {
    "id": "term-281",
    "kind": "term",
    "title": "海外企業の情報を無料で調べる",
    "summary": "ジェトロのビジネスライブラリでは、世界各国の企業情報や貿易統計のデータベースを誰でも無料で使える（事前予約制）。取引前の下調べに使える。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "ジェトロ名古屋のサービス",
      "url": "https://www.jetro.go.jp/ext_images//jetro/japan/nagoya/services/20260414.pdf",
      "publisher": "ジェトロ名古屋",
      "date": "2026-04"
    }
  },
  {
    "id": "pain-132",
    "kind": "pain",
    "title": "輸出代金が回収できない不安",
    "summary": "海外取引では、代金の回収不能や遅れ、品質トラブルが心配のたね。法務相談の資料では、こうした海外取引の予防と対処が相談の対象に挙げられている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "海外取引の法務相談",
      "url": "https://www.moj.go.jp/content/001422215.pdf",
      "publisher": "法務省",
      "date": "2024"
    }
  },
  {
    "id": "pain-133",
    "kind": "pain",
    "title": "海外から入札話と登録費の要求",
    "summary": "政府機関を名乗る相手から入札への参加をメールで誘われ、登録費などの名目で送金を求められる詐欺が在外公館から注意喚起されている。不自然な先払い要求には応じない。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "詐欺に関する注意喚起",
      "url": "https://www.az.emb-japan.go.jp/files/000476202.pdf",
      "publisher": "在アゼルバイジャン日本国大使館",
      "date": null
    }
  },
  {
    "id": "pain-134",
    "kind": "pain",
    "title": "社長になりすました送金指示",
    "summary": "米国の日系企業で、本社の社長を名乗る電話と、社長のアドレスを偽ったメールで送金を急がせる詐欺があった。振込先の変更は知っている連絡先で本人に確かめる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "詐欺に関する注意喚起",
      "url": "https://www.detroit.us.emb-japan.go.jp/files/000474806.pdf",
      "publisher": "在デトロイト日本国総領事館",
      "date": null
    }
  },
  {
    "id": "trend-173",
    "kind": "trend",
    "official": true,
    "title": "輸出管理の検査、中小は8割が指摘",
    "summary": "経産省の2024年度の集計で、輸出管理の立入検査で「重大な指摘」か「対応依頼」を受けた企業は全体の78%、中小企業では81%だった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "法令遵守立入検査の結果（令和6年度）",
      "url": "https://www.meti.go.jp/policy/anpo/compliance_programs_pdf/rikken_r6.pdf",
      "publisher": "経済産業省",
      "date": "2025"
    }
  },
  {
    "id": "term-282",
    "kind": "term",
    "title": "該非判定とは",
    "summary": "輸出する品物や技術が、規制リストに当たるかどうかを確かめるのが該非判定。リストは輸出令別表第1などにあり、細かい仕様は貨物等省令で照らし合わせる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "部品を海外に送る前に確かめること",
    "source": {
      "title": "安全保障貿易管理 説明資料",
      "url": "https://www.meti.go.jp/policy/anpo/seminer/shiryo/anpo_level3_part2.pdf",
      "publisher": "経済産業省",
      "date": null
    }
  },
  {
    "id": "term-283",
    "kind": "term",
    "title": "米国の輸出規制が日本企業にかかることも",
    "summary": "ジェトロの中小企業向けガイドは、米国の輸出管理制度（EAR）など他国の制度の中には、日本国内で商売する日本企業にも適用されるものがあると説明している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "安全保障貿易管理 早わかりガイド",
      "url": "https://www.Jetro.go.jp/ext_images/world/security_trade_control/pdf/guide/202401_v2.pdf",
      "publisher": "ジェトロ",
      "date": "2024-01"
    }
  },
  {
    "id": "term-284",
    "kind": "term",
    "title": "輸出管理の社内ルール（CP）",
    "summary": "経産省は輸出管理内部規程（CP）の整備と運用を包括許可の条件にし、立入検査で確かめている。中小企業も輸出するなら法令を守る体制が要る。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "安全保障貿易管理ガイダンス",
      "url": "https://www.meti.go.jp/policy/anpo/guidance/guidance.pdf",
      "publisher": "経済産業省",
      "date": null
    }
  },
  {
    "id": "success-088",
    "kind": "success",
    "title": "英語サイトは実績の数字と認証を先に",
    "summary": "海外のBtoBの買い手はサイトでまず実績の数値、認証・資格、事例を見るとされる。日本語サイトを訳しただけでは受注につながりにくい（制作会社の記事）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "英語ページに載せる実績と認証を整理する",
    "source": {
      "title": "海外顧客向けBtoBサイト戦略",
      "url": "https://www.utsubo.com/ja/blog/b2b-overseas-client-website-strategy-japan",
      "publisher": "utsubo",
      "date": null
    }
  },
  {
    "id": "pain-135",
    "kind": "pain",
    "title": "英語フォームに「ふりがな」が残る",
    "summary": "英語の問い合わせフォームにふりがな・郵便番号・都道府県など日本式の項目が残っていると、海外の人は途中でやめやすいと指摘されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "海外顧客向けBtoBサイト戦略",
      "url": "https://www.utsubo.com/ja/blog/b2b-overseas-client-website-strategy-japan",
      "publisher": "utsubo",
      "date": null
    }
  },
  {
    "id": "term-285",
    "kind": "term",
    "title": "JAPAN MALLは国内納品で海外販売",
    "summary": "ジェトロのJAPAN MALL事業は、登録企業を海外のECサイトにつなぎ、商品は原則国内の商社などに売る。国内で納品・決済できるので海外販売の手間が軽くなる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "JAPAN MALL事業の効果分析",
      "url": "https://www.rieti.go.jp/jp/publications/dp/23j012.pdf",
      "publisher": "経済産業研究所（RIETI）",
      "date": "2023"
    }
  },
  {
    "id": "trend-174",
    "kind": "trend",
    "official": true,
    "title": "JAPAN MALLの効果はまだ検証中",
    "summary": "RIETIの分析（2023年）では、JAPAN MALL利用で輸出額などに正の推定値が見られたが、前提を満たさない可能性があり、さらに精しい分析が必要とされた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "JAPAN MALL事業の効果分析",
      "url": "https://www.rieti.go.jp/jp/publications/dp/23j012.pdf",
      "publisher": "経済産業研究所（RIETI）",
      "date": "2023"
    }
  },
  {
    "id": "trend-175",
    "kind": "trend",
    "official": true,
    "title": "市が越境ECの導入を支援",
    "summary": "静岡市は令和7年度、自社で企画・製造した商品を売る市内中小事業者8者を選び、越境ECの導入を支援した。工業製品や伝統工芸品も対象。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "越境EC導入支援事業",
      "url": "https://www.city.shizuoka.lg.jp/documents/53437/flyer.pdf",
      "publisher": "静岡市",
      "date": "2025"
    }
  },
  {
    "id": "trend-176",
    "kind": "trend",
    "official": true,
    "title": "自治体の海外向け特設ECで試し売り",
    "summary": "川崎市は「KAWASAKI CITY STORE」で市内中小企業の自社商品を海外向けに売り、ECを使ったテストマーケティングを支援している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "海外展開支援事業",
      "url": "https://www.city.kawasaki.jp/280/cmsfiles/contents/0000165/165665/R6_BusinessDescription.pdf",
      "publisher": "川崎市",
      "date": "2024"
    }
  },
  {
    "id": "success-089",
    "kind": "success",
    "title": "補修部品の需要から越境EC",
    "summary": "工作機械に組み込まれて海外に出ていた工業用センサーの専門メーカーが、補修部品の海外需要をきっかけに越境ECに取り組んだ例が先進事例として紹介された。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "海外で使われている自社部品の交換需要",
    "source": {
      "title": "中小企業の越境EC",
      "url": "https://newswitch.jp/p/17529",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "term-286",
    "kind": "term",
    "title": "無電解ニッケルめっきとは",
    "summary": "電気を使わず、液の化学反応でニッケルを付ける方法。電気めっきのように角に厚く付きにくく、液に触れる面全体にほぼ均一な膜ができるとされる。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "電気と無電解、ニッケルめっきの違い",
    "source": {
      "title": "無電解めっき 析出",
      "url": "https://mono.ipros.com/cg3/無電解めっき/析出/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-223",
    "kind": "question",
    "title": "電気ニッケルと無電解、どっち？",
    "summary": "両者は膜の性質が違うので目的で選ぶ、とめっき会社は説明する。均一さ・耐食・耐摩耗なら無電解、と言われることが多い。答えには用途別の早見表を入れるとよい。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "用途から選ぶニッケルめっき早見表",
    "source": {
      "title": "無電解ニッケルめっき",
      "url": "https://mono.ipros.com/product/detail/2000802274",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-224",
    "kind": "question",
    "title": "無電解ニッケルは磁石につく？",
    "summary": "めっきしたままではほぼ非磁性で、熱処理をすると磁性が出るとされる。センサー周りや電子部品では熱処理の有無を図面に書く必要があると伝えるとよい。",
    "industries": [
      "表面処理",
      "電子部品"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "熱処理で変わる無電解ニッケルの性質",
    "source": {
      "title": "無電解ニッケルめっき",
      "url": "https://www.ipros.com/product/detail/2000085302",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-225",
    "kind": "question",
    "title": "めっきの膜厚はどこまで合う？",
    "summary": "指定膜厚の±10%以内で管理しているとうたうめっき会社もある。自社の管理幅と測り方（どの点を何で測るか）を書くと、設計者が公差を決めやすい。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "当社の膜厚管理と測定方法",
    "source": {
      "title": "無電解ニッケルめっき",
      "url": "https://pr.mono.ipros.com/eptec/product/detail/2000379056/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-287",
    "kind": "term",
    "title": "硬質アルマイトとは",
    "summary": "摩耗に強くする目的の厚いアルマイト。ある会社は硬さHv350〜450程度で、普通のアルマイトと違い通常は封孔処理をしないと説明する。30μm以上ないと特性が出ないという注意もある。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "硬質アルマイトと普通のアルマイトの違い",
    "source": {
      "title": "アルマイト処理",
      "url": "https://mono.ipros.com/product/detail/2000021498",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-226",
    "kind": "question",
    "title": "硬ければ摩耗に強い？",
    "summary": "硬さと耐摩耗は同じではない、と表面処理会社は注意する。発注者には硬度の数字だけでなく、相手材や使い方を伝えてもらうと処理を選びやすい、と書くとよい。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "硬さと耐摩耗性はどう違う？",
    "source": {
      "title": "硬質アルマイト",
      "url": "https://mono.ipros.com/product/detail/357452001",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-227",
    "kind": "question",
    "title": "黒アルマイトは色あせる？",
    "summary": "黒は熱や紫外線で退色することがある、とアルマイト会社は書く。屋外品や熱がかかる部品では、色の持ちを期待しすぎないよう前もって説明しておくとクレームを防げる。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "屋外で使う黒アルマイトの注意点",
    "source": {
      "title": "アルマイト処理",
      "url": "https://mono.ipros.com/product/detail/2000414351",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "pain-136",
    "kind": "pain",
    "title": "ダイカストに硬質アルマイトが難しい",
    "summary": "ダイカスト品は膜ができにくく、アルミ以外の金属を溶接・接合した部品は処理できない、とアルマイト会社は注意している。図面を受けた段階で材料を確認する手順が必要。",
    "industries": [
      "表面処理",
      "鋳造"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "アルマイトできない材料・形状",
    "source": {
      "title": "硬質アルマイト",
      "url": "https://mono.ipros.com/product/detail/2000747263",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "trend-177",
    "kind": "trend",
    "official": true,
    "title": "六価から三価クロメートへ",
    "summary": "亜鉛めっきの防錆処理は六価から三価クロメートに切り替わっている、と名古屋市工業研究所の資料は書く。耐食性はほぼ同等とされる。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "三価クロメートに変えて何が変わる？",
    "source": {
      "title": "研究報告",
      "url": "https://www.nmiri.city.nagoya.jp/wp-content/uploads/2023/02/research_8_16.pdf",
      "publisher": "名古屋市工業研究所",
      "date": null
    }
  },
  {
    "id": "question-228",
    "kind": "question",
    "title": "三価なら六価は全く出ない？",
    "summary": "名古屋市工業研究所の資料は、三価の皮膜からも時間がたつと六価クロムが検出された例があり、完全なクロムフリーが求められているとする。RoHS対応の説明では言い切りを避けたい。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "研究報告",
      "url": "https://www.nmiri.city.nagoya.jp/wp-content/uploads/2023/02/research_8_16.pdf",
      "publisher": "名古屋市工業研究所",
      "date": null
    }
  },
  {
    "id": "pain-137",
    "kind": "pain",
    "title": "黒色三価クロメートは錆びやすい",
    "summary": "埼玉県の研究報告は、黒の三価クロメートは銀色のものより白錆が出るまでの時間が短い傾向とし、仕上げ処理で改善を試みている。黒指定の部品は耐食性の話を先にしたい。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "黒い亜鉛めっきの耐食性",
    "source": {
      "title": "研究報告",
      "url": "https://www.pref.saitama.lg.jp/documents/143021/2005_403h.pdf",
      "publisher": "埼玉県",
      "date": null
    }
  },
  {
    "id": "trend-178",
    "kind": "trend",
    "official": true,
    "title": "クロムを使わない化成処理の研究",
    "summary": "茨城県はバナジウム・モリブデン、名古屋市はジルコニウム系などの代替剤を研究している。公設試の成果を引くと、新しい処理への質問に答えやすい。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "研究成果",
      "url": "https://www.itic.pref.ibaraki.jp/publication/doc/result/h26/H26_3-07.pdf",
      "publisher": "茨城県産業技術イノベーションセンター",
      "date": "2015"
    }
  },
  {
    "id": "term-288",
    "kind": "term",
    "title": "水素脆性とは",
    "summary": "めっきや酸洗いで鋼に水素が入り、もろくなって割れる現象。後から突然割れる『遅れ破壊』の原因になる。高強度のねじやばねで特に注意する。",
    "industries": [
      "表面処理",
      "熱処理",
      "機械部品"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "めっき後にボルトが割れる理由",
    "source": {
      "title": "水素脆性",
      "url": "https://kotobank.jp/word/水素脆性",
      "publisher": "コトバンク",
      "date": null
    }
  },
  {
    "id": "question-229",
    "kind": "question",
    "title": "ベーキングは何のため？",
    "summary": "めっきで入った水素を加熱して抜く処理。ねじメーカーの資料は、高強度の鋼には亜鉛めっき後のベーキングを求める規格があると紹介する。強度区分を必ず伝えてもらうとよい。",
    "industries": [
      "表面処理",
      "機械部品"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "Mikasa Topics vol 89",
      "url": "https://www.mikasa-byoura.co.jp/screw/Topics/Mikasa Topics vol 89.pdf",
      "publisher": "ねじメーカー技術資料",
      "date": null
    }
  },
  {
    "id": "pain-138",
    "kind": "pain",
    "title": "硬い部品ほど水素が抜けにくい",
    "summary": "新潟県の資料は、硬度が高いほどベーキングの効果が悪いとする。高強度品はベーキング任せにせず、実物での確認試験やめっき種の見直しを相談する必要がある。",
    "industries": [
      "表面処理",
      "熱処理"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "技術資料",
      "url": "https://www.pref.niigata.lg.jp/uploaded/attachment/430813.pdf",
      "publisher": "新潟県",
      "date": null
    }
  },
  {
    "id": "question-230",
    "kind": "question",
    "title": "ばね材に電気めっきしていい？",
    "summary": "薄いばね材などはベーキングが必要で、電気めっきの危険を避けて別の防錆処理を使う、と部品メーカーは説明している。ばね・座金の相談では処理の選択肢を並べて答えたい。",
    "industries": [
      "表面処理",
      "機械部品"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "技術資料",
      "url": "https://wpdemo.negurosu.co.jp/pdf/products/mini_021.pdf",
      "publisher": "部品メーカー技術資料",
      "date": null
    }
  },
  {
    "id": "term-289",
    "kind": "term",
    "title": "部分めっきの3つのやり方",
    "summary": "テープやレジストで覆ってめっき、全面めっき後に削る、端だけ液に浸ける、の3つがあると長野県の資料は整理する。それぞれ手間・ロス・形の制約がある。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "必要な所だけめっきする方法",
    "source": {
      "title": "新技術説明会資料",
      "url": "https://shingi.jst.go.jp/pdf/2025/2025_nagano-ig_003.pdf",
      "publisher": "JST・長野県工業技術総合センター",
      "date": "2025"
    }
  },
  {
    "id": "pain-139",
    "kind": "pain",
    "title": "テープマスキングの手間と廃棄",
    "summary": "テープは大量に捨てることになり、立体や細かい形には貼りにくい、と長野県の資料は課題を挙げる。マスキングの手間が単価に入る理由として発注者に説明できる。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "マスキング代はなぜかかる？",
    "source": {
      "title": "新技術説明会資料",
      "url": "https://shingi.jst.go.jp/pdf/2025/2025_nagano-ig_003.pdf",
      "publisher": "JST・長野県工業技術総合センター",
      "date": "2025"
    }
  },
  {
    "id": "question-231",
    "kind": "question",
    "title": "図面の寸法はめっき前？後？",
    "summary": "表面処理の図面では、寸法が処理前の素地か処理後の仕上がりかを明記するのが大事とされる。部分処理なら面ごとに処理と膜厚を注記する例がある。",
    "industries": [
      "表面処理",
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "表面処理の図面の書き方",
    "source": {
      "title": "表面処理の図面指示ガイド",
      "url": "https://renue.co.jp/posts/surface-treatment-plating-anodize-painting-drawing-guide-2026",
      "publisher": "renue",
      "date": "2026"
    }
  },
  {
    "id": "question-232",
    "kind": "question",
    "title": "樹脂めっきで裏にも付くと困る",
    "summary": "はめ合う裏のボスや爪にめっきが付くと不具合になるため、必要な所だけの部分めっきで解決する例がある。樹脂部品の設計者向けに図で見せると伝わる。",
    "industries": [
      "表面処理",
      "樹脂成形"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "部分めっき",
      "url": "https://mono.ipros.com/product/detail/2000650506",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-084",
    "kind": "buyer",
    "title": "部分めっきの価格は図面で比べる",
    "summary": "部分めっきの価格は掲載ページでも『問い合わせ』が多い。買い手は形・面積・膜厚・数量で変わるため、図面を付けて複数社に見積もりを取って比べている。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "部分めっきの見積もりに必要な情報",
    "source": {
      "title": "部分めっき 皮膜",
      "url": "https://mono.ipros.com/cg3/部分めっき/皮膜",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-090",
    "kind": "success",
    "title": "加工事例を毎月出して相談が倍に",
    "summary": "めっき・表面処理の会社が、発注者が検索しそうな言葉で毎月4件の事例を載せ、Web経由の問い合わせが2倍以上になったと支援会社が紹介している。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "毎月の加工事例を記事にする",
    "source": {
      "title": "めっき・表面処理の事例コンテンツSEO",
      "url": "https://valueagent.co.jp/result/mekki",
      "publisher": "バリューエージェント",
      "date": null
    }
  },
  {
    "id": "success-091",
    "kind": "success",
    "title": "技術を見える化して受注へ",
    "summary": "めっき加工の会社が、技術をWebで見える化して訴求力を上げ、問い合わせが増えて受注につながったと紹介されている。工程写真や断面の写真が手がかりになる。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "製造業ホームページの成功事例",
      "url": "https://www.seizogyo.com/homepage/success/",
      "publisher": "製造業.com",
      "date": null
    }
  },
  {
    "id": "success-092",
    "kind": "success",
    "title": "社名でなく技術ワードで狙う",
    "summary": "『〇〇加工 〇〇県』『〇〇 耐久性』など、発注側が打ち込む技術の言葉で上位を狙い、疑問に答える記事で信頼を得た事例がある。表面処理名＋地域は記事タイトルに向く。",
    "industries": [
      "表面処理",
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "製造業ホームページ制作 成功事例取材50社",
      "url": "https://techport.co.jp/archives/35309",
      "publisher": "テックポート",
      "date": null
    }
  },
  {
    "id": "success-093",
    "kind": "success",
    "title": "品質改善の事例をまとめて載せる",
    "summary": "めっきの技術サイトが『品質改善事例』のページで、不良の内容と対策を並べて公開している。困りごとから探す設計者に届きやすい形。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "よくあるめっき不良と当社の対策",
    "source": {
      "title": "品質改善事例",
      "url": "https://www.mekkikakou.com/quality-improvement/",
      "publisher": "めっき技術サイト",
      "date": null
    }
  },
  {
    "id": "buyer-085",
    "kind": "buyer",
    "title": "1個から受ける表面処理を探す",
    "summary": "試作の設計者は『1個から』『小ロット』と明記した会社を探す。部品1個から無電解金めっきを受けるとうたう掲載もある。最小数量と試作の納期を目立つ所に書くとよい。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "無電解金めっき",
      "url": "https://mono.ipros.com/product/detail/2000455773",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-086",
    "kind": "buyer",
    "title": "発注側もめっきの基本を学ぶ",
    "summary": "大阪産業技術研究所はめっきの種類・評価方法を学ぶ講座を開いている。品質管理やクレーム対応のために知識が要る、という買い手側の意識に応える記事が書ける。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "購買担当向け めっき入門",
    "source": {
      "title": "めっき講座資料",
      "url": "https://orist.jp/dl/izumi/seminar/2018/20181119_mekki.pdf",
      "publisher": "大阪産業技術研究所",
      "date": "2018"
    }
  },
  {
    "id": "trend-179",
    "kind": "trend",
    "official": false,
    "title": "全鍍連は1400社超・若手育成が課題",
    "summary": "全国鍍金工業組合連合会は24の工業組合・専業1400社超で構成され、高齢化が進む中で若い人材の育成も目標に挙げているとプレスリリースで紹介されている。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "プレスリリース",
      "url": "https://www.value-press.com/pressrelease/121795",
      "publisher": "ValuePress",
      "date": null
    }
  },
  {
    "id": "trend-180",
    "kind": "trend",
    "official": true,
    "title": "めっき組合と人手不足の見える化",
    "summary": "近畿経済産業局は2023年、大阪府鍍金工業組合などと連携し、人手不足の解決に向けて業務プロセスの可視化を進めると発表した。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "報道発表",
      "url": "https://www.kansai.meti.go.jp/3-5sangyo/jinzai/230921press.pdf",
      "publisher": "近畿経済産業局",
      "date": "2023-09"
    }
  },
  {
    "id": "trend-181",
    "kind": "trend",
    "official": false,
    "title": "EUが六価クロムの制限案を公表",
    "summary": "欧州化学品庁は2025年4月、六価クロム化合物の制限案を公表した。全面禁止でなく、作業者の曝露や工場の排出の上限を守る条件で使用を認める方向と解説されている。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "EU向け部品とクロムめっきの今後",
    "source": {
      "title": "六価クロムのREACH規則の制限提案の背景",
      "url": "https://www.tkk-lab.jp/post/reach20240531",
      "publisher": "TKK",
      "date": null
    }
  },
  {
    "id": "trend-182",
    "kind": "trend",
    "official": false,
    "title": "認可から制限へ移る初の例",
    "summary": "六価クロムはREACHの認可対象から外し制限に移す方針で、初めての例とされる。機能めっき（硬質クロム等）が注目されている、と専門メディアが解説する。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "第71回 六価クロムのREACH規則の制限提案の背景",
      "url": "https://johokiko.co.jp/chemmaga/tkk0071/tkk/",
      "publisher": "情報機構",
      "date": null
    }
  },
  {
    "id": "trend-183",
    "kind": "trend",
    "official": true,
    "title": "クロムめっきのPFOS代替",
    "summary": "ドイツ環境庁は2022年、クロムめっき液のミスト抑制に使われてきたPFOSの代替技術の報告書を出した。PFAS全体の規制も進み、薬品の切り替えが続く。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "Best available techniques for PFOS substitution",
      "url": "https://www.umweltbundesamt.de/en/publikationen/best-available-techniques-for-pfos-substitution-in",
      "publisher": "ドイツ連邦環境庁",
      "date": "2022"
    }
  },
  {
    "id": "question-233",
    "kind": "question",
    "title": "三価クロムめっきは有害？",
    "summary": "めっき会社のコラムが、三価と六価の違いや環境への影響を解説している。装飾クロムの三価化を聞かれたとき、色味や耐食の差も合わせて答えると親切。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "三価クロムめっきの色と性能",
    "source": {
      "title": "三価クロムめっきは有害？",
      "url": "https://www.tukada-riken.co.jp/column/trivalent-chromium-plating-harmful/",
      "publisher": "めっき会社コラム",
      "date": null
    }
  },
  {
    "id": "trend-184",
    "kind": "trend",
    "official": false,
    "title": "金高騰で金めっき基板が値上がり",
    "summary": "2025年10月中旬、金は1オンス4000ドル台で前年比約56%高と海外基板会社は伝え、ENIG基板のコストに直結するとした。金めっきの見積もりが動く理由として説明できる。",
    "industries": [
      "表面処理",
      "基板実装",
      "電子部品"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "Rising Gold Prices and PCB Costs",
      "url": "https://www.mclpcb.com/?p=9052",
      "publisher": "MCL",
      "date": "2025"
    }
  },
  {
    "id": "question-234",
    "kind": "question",
    "title": "金めっきの金を減らせる？",
    "summary": "必要な所だけの部分めっきや、硬い硬質金めっきで金の量と性能を最適化する加工例がある。金価格が上がる中、端子の膜厚と範囲を見直す提案記事が書ける。",
    "industries": [
      "表面処理",
      "電子部品"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "金価格が上がったときの金めっきの見直し",
    "source": {
      "title": "硬質金めっき",
      "url": "https://mono.ipros.com/product/detail/2000358016",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-235",
    "kind": "question",
    "title": "めっきの見積もりは何で決まる？",
    "summary": "製造業の見積もりは会社ごとの賃率（時間あたりの加工料）を基に計算するのが一般的。ロットが小さいと段取り費を少ない個数で割るので1個が高くなる、と説明するとよい。",
    "industries": [
      "表面処理",
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "小ロットのめっきが高い理由",
    "source": {
      "title": "賃率はどの様に決定されるの？",
      "url": "https://mono.ipros.com/product/detail/2000733031",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-290",
    "kind": "term",
    "title": "リン酸亜鉛（パーカー）処理",
    "summary": "鉄の表面にリン酸塩の膜を作り、塗装の密着とさび止めを良くする化成処理。灰〜黒っぽい色で、油なじみがよく滑りも良くなるとされる。",
    "industries": [
      "表面処理",
      "塗装"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "塗装の下地処理はなぜ必要？",
    "source": {
      "title": "リン酸亜鉛処理",
      "url": "https://www.ipros.com/product/detail/2000598512",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-291",
    "kind": "term",
    "title": "黒染め（四三酸化鉄）とは",
    "summary": "アルカリ液で鉄の表面に黒錆の薄い膜を作る処理。寸法がほぼ変わらないが膜が薄く耐食性は弱い。時間がたつと赤くなるので油で保護する。",
    "industries": [
      "表面処理",
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "黒染め",
      "url": "https://wpdemo.negurosu.co.jp/pdf/products/mini_006.pdf",
      "publisher": "部品メーカー技術資料",
      "date": null
    }
  },
  {
    "id": "buyer-087",
    "kind": "buyer",
    "title": "加工からめっきまで一括で頼む",
    "summary": "材料・機械加工・表面処理・検査を提携で一括して受けると案内する会社がある。購買担当は手配や納期調整を減らしたくて一貫対応先を探すので、対応範囲を図にするとよい。",
    "industries": [
      "表面処理",
      "切削加工"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "当社に頼める工程の全体図",
    "source": {
      "title": "一貫製造",
      "url": "https://mono.ipros.com/product/detail/2000924570",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-292",
    "kind": "term",
    "title": "カチオン電着塗装とは",
    "summary": "水に溶けた塗料に製品を浸し、電気で塗膜を付ける方法。自動車の下塗りの主流で、複雑な形の奥まで塗れて膜厚がそろい、さび止めに強いとされる。",
    "industries": [
      "塗装"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "電着・粉体・焼付の違い",
    "source": {
      "title": "電着塗装",
      "url": "https://mono.ipros.com/product/detail/2000553896",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-293",
    "kind": "term",
    "title": "マンセル値の読み方",
    "summary": "色を色相・明度・彩度の3つで表す方法で、『7.5R 7/6』のように色相、明度/彩度の順に書く、と亀岡市の資料は説明する。色指定の話の入り口に使える。",
    "industries": [
      "塗装"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "塗装の色はどう指定する？",
    "source": {
      "title": "色彩基準",
      "url": "https://www.city.kameoka.kyoto.jp/uploaded/attachment/15444.pdf",
      "publisher": "亀岡市",
      "date": null
    }
  },
  {
    "id": "question-236",
    "kind": "question",
    "title": "画面の色で決めていい？",
    "summary": "印刷やモニターの色は実際と違うので、実物の色票で確かめるよう堺市の資料は求めている。色指定は番号＋実物見本で、と記事で勧めるとトラブルが減る。",
    "industries": [
      "塗装"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "色彩基準",
      "url": "https://www.city.sakai.lg.jp/shisei/toshi/toshikeikan/keikakusingi/singikai/index.files/shikisaikijun.pdf",
      "publisher": "堺市",
      "date": null
    }
  },
  {
    "id": "pain-140",
    "kind": "pain",
    "title": "補修した所だけ色が違う",
    "summary": "同じロット・同じ塗り方でないと補修部分が目立つことがある、と塗料メーカーの資料にある。追加注文や手直しの色ずれを前もって説明する材料になる。",
    "industries": [
      "塗装"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "施工資料",
      "url": "https://www.paint-city.com/pdf/spmildcote.pdf",
      "publisher": "塗料メーカー",
      "date": null
    }
  },
  {
    "id": "buyer-088",
    "kind": "buyer",
    "title": "実物を見せて色を合わせる",
    "summary": "ある機械メーカーはマンセル番号で色を指定せず、塗装業者に実物を見せて合わせているとFAQで答える。買い手は番号だけで済まない場合があり、見本の預かり方を書くとよい。",
    "industries": [
      "塗装"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "色見本の送り方と色合わせの流れ",
    "source": {
      "title": "FAQ",
      "url": "https://www.brother.co.jp/pub/jp/machine/pdf/faq/s-001-002.pdf",
      "publisher": "機械メーカーFAQ",
      "date": null
    }
  },
  {
    "id": "pain-141",
    "kind": "pain",
    "title": "ピンホールの主な原因",
    "summary": "金属塗装の会社は、前処理後の水分残り・素材の油や錆・乾燥不足の3つが主な原因だとする。出荷後数か月でふくれが出ることもあり、前処理の説明が信頼につながる。",
    "industries": [
      "塗装"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "塗装のピンホールはなぜできる？",
    "source": {
      "title": "金属塗装の技術情報",
      "url": "https://pr.mono.ipros.com/kinzokutoso/product/detail/2001649932/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "pain-142",
    "kind": "pain",
    "title": "鋳物の塗装が泡立つ",
    "summary": "大阪産業技術研究所の技術シートは、素地から出るガスが膜の中に残ると発泡やふくれになり、鋳鉄の黒鉛が水分や油を吸うことも影響すると説明する。",
    "industries": [
      "塗装",
      "鋳造"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "技術シート",
      "url": "https://www2.orist.jp/technicalsheet/4001.PDF",
      "publisher": "大阪産業技術研究所",
      "date": null
    }
  },
  {
    "id": "question-237",
    "kind": "question",
    "title": "塗装がはがれた原因は？",
    "summary": "分析会社の事例では、保管トレーのシリコーンが付いて塗装がはがれた例や、フッ素系洗浄剤の残りで密着が悪くなった例がある。前工程や保管も原因になると伝えたい。",
    "industries": [
      "塗装",
      "樹脂成形"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "塗装はがれは前の工程が原因のことも",
    "source": {
      "title": "塗装・接着剥がれの原因分析",
      "url": "https://www.eurofins.com/ja-jp/materials-engineering-sciences/engineering-testing-services/analysis/separation/",
      "publisher": "ユーロフィン",
      "date": null
    }
  },
  {
    "id": "success-094",
    "kind": "success",
    "title": "施工事例は工程まで見せる",
    "summary": "技術の差が伝わりにくい塗装業では、施工事例（前後の写真・工程・地域）が一番の判断材料になると解説されている。工業塗装でも素材・塗料・膜厚を添えると効く。",
    "industries": [
      "塗装"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "塗装事例ページの書き方",
    "source": {
      "title": "塗装会社・建設業のホームページ集客の実務",
      "url": "https://www.webharu.com/posts/construction-paint-website",
      "publisher": "webharu",
      "date": "2026"
    }
  },
  {
    "id": "success-095",
    "kind": "success",
    "title": "悩みに答えるサイトにする",
    "summary": "立派なサイトでも訪問者の悩みに答えていないと問い合わせは来ない、と指摘される。検索で来る人はもう業者を探しているので、的確な答えがあれば連絡につながりやすい。",
    "industries": [
      "塗装",
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "塗装会社のホームページ集客",
      "url": "https://edeom.co.jp/column/painter-web/",
      "publisher": "エデオム",
      "date": null
    }
  },
  {
    "id": "buyer-089",
    "kind": "buyer",
    "title": "地図検索で塗装店を探す",
    "summary": "地域の塗装業者を探す人はGoogleマップでも探すため、地図での表示を整えるMEO対策が大事とされる。個人や近くの工場からの小口依頼に効く。",
    "industries": [
      "塗装"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "塗装会社のホームページ集客",
      "url": "https://edeom.co.jp/column/painter-web/",
      "publisher": "エデオム",
      "date": null
    }
  },
  {
    "id": "buyer-090",
    "kind": "buyer",
    "title": "ポータル経由は価格競争に",
    "summary": "塗装の紹介サイトは手数料がかかり価格比較になりやすく、自社サイトは直接の問い合わせ窓口になると解説されている。比較される前提で強みを書く必要がある。",
    "industries": [
      "塗装"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "塗装会社・建設業のホームページ集客の実務",
      "url": "https://www.webharu.com/posts/construction-paint-website",
      "publisher": "webharu",
      "date": "2026"
    }
  },
  {
    "id": "question-238",
    "kind": "question",
    "title": "Oリングの材質はどう選ぶ？",
    "summary": "温度・圧力・触れる液体で選ぶのが基本で、高い材質がすべてに優れるわけではない、とゴム会社は説明する。使用条件のチェック表を記事に付けると相談が具体的になる。",
    "industries": [
      "ゴム"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "Oリング材質選びのチェック表",
    "source": {
      "title": "Oリング材質",
      "url": "https://www.ipros.com/product/detail/2000165294",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-294",
    "kind": "term",
    "title": "NBR（ニトリルゴム）とは",
    "summary": "油や燃料に強い、いちばん汎用的なゴム。目安は-40〜120℃程度。オゾンが多い所や屋外、ケトン類には向かないとされる。",
    "industries": [
      "ゴム"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "NBR vs Silicone vs FKM vs EPDM",
      "url": "https://www.marcorubber.com/nbr-vs-sil-vs-fkm-vs-epdm/material-type/14v21v10v7",
      "publisher": "Marco Rubber",
      "date": null
    }
  },
  {
    "id": "term-295",
    "kind": "term",
    "title": "EPDMは油に弱い",
    "summary": "EPDMは水・蒸気・温水に向くが、潤滑油や燃料油など鉱油には耐えない。水回り用と油回り用で材質を取り違える失敗が多い、と記事で注意できる。",
    "industries": [
      "ゴム"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "水回りと油回りでゴムを変える理由",
    "source": {
      "title": "NBR vs Silicone vs FKM vs EPDM",
      "url": "https://www.marcorubber.com/nbr-vs-sil-vs-fkm-vs-epdm/material-type/14v21v10v7",
      "publisher": "Marco Rubber",
      "date": null
    }
  },
  {
    "id": "term-296",
    "kind": "term",
    "title": "デュロメータ（ショアA）とは",
    "summary": "ゴムの硬さを針の押し込みで測る計器。A型がゴムの主流で、硬いものはD型、柔らかいものはE型などを使う。値が押した直後から下がるので読み方に注意。",
    "industries": [
      "ゴム"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ゴム硬度70とはどのくらい？",
    "source": {
      "title": "デュロメータ",
      "url": "https://www.satosokuteiki.com/upload/items/2202/teclock-duro.pdf",
      "publisher": "計測器メーカー資料",
      "date": null
    }
  },
  {
    "id": "question-239",
    "kind": "question",
    "title": "小さいOリングの硬さは測れる？",
    "summary": "ショアAは厚み6mm以上の試料が要るため、Oリングなど小物はIRHD-Mで測ることがある。両者に明確な相関はないので、図面でどちらの方式か書くよう伝えたい。",
    "industries": [
      "ゴム"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "硬さ試験",
      "url": "https://masg.co.jp/sys_img/pdf/200_1tp.pdf",
      "publisher": "試験機メーカー資料",
      "date": null
    }
  },
  {
    "id": "question-240",
    "kind": "question",
    "title": "ゴム部品は1個から作れる？",
    "summary": "ゴムを削る加工なら金型なしで1個から作れる、とゴム加工会社は案内する。数が増えたら金型成形、という使い分けを費用の目安とともに書くと試作の人に届く。",
    "industries": [
      "ゴム"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "金型なしでゴムを試作する方法",
    "source": {
      "title": "ゴム切削加工",
      "url": "https://mono.ipros.com/product/detail/2000703597",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-091",
    "kind": "buyer",
    "title": "図面なしでもゴムを頼みたい",
    "summary": "カタログにないサイズのゴムを1枚から、図面なし・素材選びも任せられるサービスが2020年代に出ている。買い手は用途と設置場所を伝えれば提案してほしいと考えている。",
    "industries": [
      "ゴム"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "図面がなくてもゴム部品は頼めます",
    "source": {
      "title": "特注ゴム加工サービス開始",
      "url": "https://netshop.impress.co.jp/r/prtimes/items/000000020.000056846",
      "publisher": "ネットショップ担当者フォーラム",
      "date": null
    }
  },
  {
    "id": "buyer-092",
    "kind": "buyer",
    "title": "切削でも金型費を減らせる",
    "summary": "図面1枚・1個から、金型のいらない機械加工で金型の保管・管理コストを減らせる、とゴム加工会社は訴える。数量が少ない買い手は総額で比べている。",
    "industries": [
      "ゴム"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "ゴム機械加工",
      "url": "https://pr.mono.ipros.com/akitsukogyo/product/detail/2001639252/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "trend-185",
    "kind": "trend",
    "official": false,
    "title": "PFAS規制とフッ素ゴム",
    "summary": "欧州でのPFAS規制の議論を受け、製造時にフッ素系の乳化剤や溶媒を使わないフッ素ゴムが2025年に発売されたとMONOistが報じた。半導体装置のOリング需要が背景。",
    "industries": [
      "ゴム",
      "装置"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "PFAS規制でOリングはどうなる？",
    "source": {
      "title": "PFAS規制拡大を見据えたフッ素ゴム開発",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2509/02/news007.html",
      "publisher": "MONOist",
      "date": "2025-09"
    }
  },
  {
    "id": "trend-186",
    "kind": "trend",
    "official": false,
    "title": "EUのPFAS一括規制案",
    "summary": "ドイツなど5か国がPFASの段階的な廃止を目指す規制案を欧州化学品庁に出し、日本企業からも見直しを求める声が出ているとニュースイッチが報じた。",
    "industries": [
      "ゴム",
      "表面処理"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "PFAS規制",
      "url": "https://newswitch.jp/p/38545",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "trend-187",
    "kind": "trend",
    "official": true,
    "title": "中小向けPFAS対策セミナー",
    "summary": "大阪産業技術研究所などが、ものづくり中小企業向けにPFAS規制のリスク対策セミナーを2026年2月に開いた。フッ素ゴムや表面処理の顧客の不安に答える記事の材料になる。",
    "industries": [
      "ゴム",
      "表面処理"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "MOBIO Cafe",
      "url": "https://orist.jp/dl/orist/seminar/260226_MOBIO-Cafe.pdf",
      "publisher": "大阪産業技術研究所",
      "date": "2026-02"
    }
  },
  {
    "id": "success-096",
    "kind": "success",
    "title": "『ゴム成形』で公開直後に上位",
    "summary": "ゴム製品の製造業サイトが公開直後に『ゴム成形』で4位に入り、問い合わせ2件のうち1件がすぐ成約したと制作会社が紹介。ニッチなBtoBでも工程名で探されている。",
    "industries": [
      "ゴム"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "ゴム成形 SEO",
      "url": "https://www.branding-t.co.jp/case/manufacturing/7033/",
      "publisher": "ブランディングテクノロジー",
      "date": null
    }
  },
  {
    "id": "success-097",
    "kind": "success",
    "title": "素材ごとの事例でロングテール",
    "summary": "ゴム加工会社が加工素材ごとに事例ページを作り、検索数がほぼない『ウレタンローラー』の事例から月1〜2件の問い合わせが続いていると支援会社が紹介している。",
    "industries": [
      "ゴム"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "素材別の加工事例を1ページずつ",
    "source": {
      "title": "加工素材ごとの事例コンテンツ",
      "url": "https://www.branding-t.co.jp/case/manufacturing/7031/",
      "publisher": "ブランディングテクノロジー",
      "date": null
    }
  },
  {
    "id": "success-098",
    "kind": "success",
    "title": "工業用ゴム会社のサイト改修",
    "summary": "従業員35名の工業用ゴム製品会社が、サイト改修で問い合わせ約20倍、3か月で大型案件を受注したと支援会社が紹介する（自社の申告値）。",
    "industries": [
      "ゴム"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "製造業SEO成功事例",
      "url": "https://www.aily-lab.co.jp/column/manufacturing-seo-inquiry-20x-method/",
      "publisher": "アイリーラボ",
      "date": null
    }
  },
  {
    "id": "success-099",
    "kind": "success",
    "title": "検索数より買う人の言葉を",
    "summary": "製造業のSEOでは検索数の多さより、発注する人の意図がある言葉を選ぶべきだと解説されている。『Oリング 耐熱 小ロット』のような組み合わせが狙い目。",
    "industries": [
      "ゴム",
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "製造業のSEOキーワード選定",
      "url": "https://www.aily-lab.co.jp/column/manufacturing-seo-keyword-strategy/",
      "publisher": "アイリーラボ",
      "date": null
    }
  },
  {
    "id": "buyer-093",
    "kind": "buyer",
    "title": "1型20枚から縫製を探す人",
    "summary": "比較ビズの依頼掲載には、1型20枚から・納期1か月前後で縫製先を探すシャツブランドがある。最小ロットと納期を最初に書く工場が選ばれやすい。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "当社は1型何枚から縫えます",
    "source": {
      "title": "縫製OEM依頼",
      "url": "https://www.biz.ne.jp/subject/sewing-processing-print/oem/",
      "publisher": "比較ビズ",
      "date": null
    }
  },
  {
    "id": "buyer-094",
    "kind": "buyer",
    "title": "まずサンプル、次に小ロット",
    "summary": "縫製の依頼掲載の多くは、まずサンプル製作と見積もり、問題なければ小ロット量産へ、という流れを望んでいる。サンプル代と流れを先に示すと話が早い。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "サンプルから量産までの流れと費用",
    "source": {
      "title": "縫製依頼",
      "url": "https://www.biz.ne.jp/subject/toi_detail.html?tid=992614",
      "publisher": "比較ビズ",
      "date": null
    }
  },
  {
    "id": "question-241",
    "kind": "question",
    "title": "工場に何を聞けばいい？",
    "summary": "依頼者はサンプルの可否・最小ロット・納期・概算費用の4つを具体的に知りたがっている、と依頼掲載から読める。FAQの柱にこの4つを置くとよい。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "縫製依頼",
      "url": "https://www.biz.ne.jp/subject/toi_detail.html?tid=992568",
      "publisher": "比較ビズ",
      "date": null
    }
  },
  {
    "id": "success-100",
    "kind": "success",
    "title": "工場が自社ブランドを出す",
    "summary": "OEM中心の縫製工場やニッターが、ファクトリーブランドなど新しい事業に挑む例が増えていると繊研新聞が伝える。InstagramやXで発信し販売サイトへ誘う形が多い。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "奮闘する国内工場",
      "url": "https://senken.co.jp/posts/struggle-domestic-factory-2",
      "publisher": "繊研新聞",
      "date": null
    }
  },
  {
    "id": "success-101",
    "kind": "success",
    "title": "工場名と仕事風景で売る",
    "summary": "工場名を入れた商品名にし、サイトで工場の歴史や作業風景を紹介して物語を伝える直販の手法が日経で紹介された。卸を通さず価格を抑えられるのも強み。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "工場の仕事風景を見せる記事",
    "source": {
      "title": "下請け脱却へ工場直販",
      "url": "https://www.nikkei.com/article/DGXMZO20071840X10C17A8000000/",
      "publisher": "日本経済新聞",
      "date": "2017-08"
    }
  },
  {
    "id": "pain-143",
    "kind": "pain",
    "title": "技術がそのまま客に伝わらない",
    "summary": "受託で評価された技術が、そのまま消費者に伝わるとは限らない、とブランド立ち上げ支援会社は指摘する。技術を使う人の言葉に言い換える工夫が要る。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "工場の自社ブランドの立ち上げ",
      "url": "https://sense-co.com/factory-brand/",
      "publisher": "支援会社",
      "date": null
    }
  },
  {
    "id": "success-102",
    "kind": "success",
    "title": "裁縫動画でEC売上が大きく伸びた",
    "summary": "岐阜の縫製工場がインスタの動画で縫う様子を配信し、月10万円がやっとだった自社ECが100万円以上になったと繊研新聞が2021年に報じた。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "縫う工程を動画で見せる",
    "source": {
      "title": "IGTVで配信 EC売上10倍超",
      "url": "https://senken.co.jp/posts/xxdevelopment-210803",
      "publisher": "繊研新聞",
      "date": "2021-08"
    }
  },
  {
    "id": "success-103",
    "kind": "success",
    "title": "小ロットをメニューにする",
    "summary": "東京の縫製工場が小ロット対応をメニュー化し、個人インフルエンサーのファングッズの依頼が増えたと繊研新聞が報じた。個人の依頼者が頼みやすい形にした例。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "広がる個人インフルエンサーのファングッズ作り",
      "url": "https://senken.co.jp/posts/tokyo-garment-factory-210715",
      "publisher": "繊研新聞",
      "date": "2021-07"
    }
  },
  {
    "id": "buyer-095",
    "kind": "buyer",
    "title": "個人はSNSで工場を探す",
    "summary": "縫製を頼みたい個人の間で、InstagramやXで工場や職人を探す人が増え、発信内容から得意分野や仕事ぶりを確かめていると紹介されている。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "縫製の依頼方法と料金相場",
      "url": "https://sewing-biz.sakuraweb.com/sewing-request/",
      "publisher": "縫製依頼ガイド",
      "date": null
    }
  },
  {
    "id": "buyer-096",
    "kind": "buyer",
    "title": "マッチングサイトで縫製先探し",
    "summary": "縫製工場向けのマッチングサイトは多く、比較記事で12サイトが紹介されている。工場側は掲載先ごとに得意アイテム・ロットをそろえて書くと選ばれやすい。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "縫製工場向けマッチングサイト12選",
      "url": "https://www.shopowner-support.net/attracting_customers/manufacturing/factory/sewing-factory-matching-site/",
      "publisher": "キャククル",
      "date": null
    }
  },
  {
    "id": "trend-188",
    "kind": "trend",
    "official": false,
    "title": "衣料品の国産比率は約1%",
    "summary": "WWDJAPANは、2025年の衣料品の国産比率が数量で1.1%と過去最低を更新し、生産量は10年前の約半分になったと報じた。国内縫製の希少さを伝える材料になる。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "国内で縫うことの意味",
    "source": {
      "title": "衣料品の国産比率",
      "url": "https://www.wwdjapan.com/articles/2434709",
      "publisher": "WWDJAPAN",
      "date": null
    }
  },
  {
    "id": "trend-189",
    "kind": "trend",
    "official": true,
    "title": "繊維の事業所数は半分以下に",
    "summary": "経済産業省の資料は、国内の繊維工業の事業所数が過去15年で約半分以下になったと示している。産地の会議で使われた資料。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "繊維産地の現状",
      "url": "https://www.meti.go.jp/shingikai/mono_info_service/textile_production_area/pdf/001_04_00.pdf",
      "publisher": "経済産業省",
      "date": null
    }
  },
  {
    "id": "trend-190",
    "kind": "trend",
    "official": false,
    "title": "特定技能に縫製が加わった",
    "summary": "2024年、特定技能の工業製品製造業分野に縫製が加わり、技能実習に頼ってきた国内縫製業界から歓迎の声が出たとFASHIONSNAPが報じた。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "特定技能に縫製",
      "url": "https://www.fashionsnap.com/article/2024-04-06/tokutei-ginou/",
      "publisher": "FASHIONSNAP",
      "date": "2024-04"
    }
  },
  {
    "id": "pain-144",
    "kind": "pain",
    "title": "工賃と人件費の板挟み",
    "summary": "業界団体の2018年資料は、実習生の収入と市場が求める工賃の両立のため、縫製事業者は非常に厳しい経営を強いられていると述べる。適正な工賃を説明する記事の背景に。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "articleIdea": "縫製の工賃はなぜこの値段？",
    "source": {
      "title": "全日本婦人子供服工業組合連合会 資料",
      "url": "https://www.meti.go.jp/policy/mono_info_service/mono/fiber/ginoujisshukyougikai/180423/8_zenpuren.pdf",
      "publisher": "経済産業省掲載",
      "date": "2018-04"
    }
  },
  {
    "id": "trend-191",
    "kind": "trend",
    "official": true,
    "title": "発注元も工場の扱いに責任",
    "summary": "2023年の経産省掲載資料では、実習生の扱いが問題化して以降、発注元にも間接取引を含めた責任があるとされ、工場監査などの取り組みが紹介されている。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "writer_hint"
    ],
    "articleIdea": "働く人を大事にする工場の見せ方",
    "source": {
      "title": "繊維産業の取組",
      "url": "https://www.meti.go.jp/policy/mono_info_service/mono/fiber/pdf/20231016-5.pdf",
      "publisher": "経済産業省",
      "date": "2023-10"
    }
  },
  {
    "id": "pain-145",
    "kind": "pain",
    "title": "後継者がおらず工場を譲る",
    "summary": "事業承継サイトには、後継者不在を理由に縫製工場の譲渡を望む掲載がある。2026年の記事も、中小の縫製工場の廃業が相次ぐと伝えている。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "国内縫製工場",
      "url": "https://www.fashionsnap.com/article/2026-01-25/nestbowl-factelier-factory/",
      "publisher": "FASHIONSNAP",
      "date": "2026-01"
    }
  },
  {
    "id": "term-297",
    "kind": "term",
    "title": "縫製仕様書とは",
    "summary": "材料・型紙・縫い方の注意・数量・納期をまとめた、服の設計図。イラスト、サイズごとの寸法、生地の混率、色番号、付属品まで書くと工場との行き違いが減る。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "初めての縫製仕様書の書き方",
    "source": {
      "title": "縫製仕様書",
      "url": "https://biz.moneyforward.com/work-efficiency/basic/9092/",
      "publisher": "マネーフォワード",
      "date": "2024-12"
    }
  },
  {
    "id": "term-298",
    "kind": "term",
    "title": "パターンとグレーディング",
    "summary": "パターンは型紙。サンプルを縫って直したものが量産パターンになり、基本サイズから他のサイズへ広げる作業をグレーディングと呼ぶ、と厚生労働省の職業情報にある。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "職種：アパレル設計",
      "url": "https://www.mhlw.go.jp/content/11800000/000583555.doc",
      "publisher": "厚生労働省",
      "date": null
    }
  },
  {
    "id": "question-242",
    "kind": "question",
    "title": "サンプルが良ければ量産も同じ？",
    "summary": "量産では生地や糸のロット、縫う人やラインが変わるので、サンプルの出来が量産品質の保証にはならないと解説される。量産前サンプルで確かめる流れを書くとよい。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "アパレルOEMの工場選び",
      "url": "https://www.theckb.com/archive/what-matters-when-choosing-a-factory-for-apparel-oem/",
      "publisher": "THE CKB",
      "date": null
    }
  },
  {
    "id": "term-299",
    "kind": "term",
    "title": "量産前サンプルと基準見本",
    "summary": "初回サンプル→修正→量産前サンプル→基準見本（ゴールデンサンプル）の順で進め、素材・寸法・縫製・色・着用を確かめ、承認は書面に残すのがよいとされる。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "メンズアパレルOEMの工場の選び方",
      "url": "https://www.theckb.com/archive/how-to-choose-a-manufacturer-for-mens-apparel-oem-production/",
      "publisher": "THE CKB",
      "date": null
    }
  },
  {
    "id": "question-243",
    "kind": "question",
    "title": "小ロットでオリジナル服を作るには",
    "summary": "工場の既存の型紙（ボディ）を使い、プリントや刺繍、タグの付け替えで個性を出す方法が小ロット向けに紹介されている。型紙から作るより費用と日数を抑えられる。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "既製ボディで作る小ロット服",
    "source": {
      "title": "子ども服OEMを小ロットで始める",
      "url": "https://www.theckb.com/archive/how-to-start-a-childrens-clothing-oem-in-small-batches/",
      "publisher": "THE CKB",
      "date": null
    }
  },
  {
    "id": "buyer-097",
    "kind": "buyer",
    "title": "工場は得意分野と設備で選ぶ",
    "summary": "単価や最低ロットだけでなく、得意アイテム・設備・量産品質・品質管理体制まで確かめるべきと解説されている。工場は得意アイテムを写真付きで具体的に書くとよい。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "アパレルOEMの工場選び",
      "url": "https://www.theckb.com/archive/what-matters-when-choosing-a-factory-for-apparel-oem/",
      "publisher": "THE CKB",
      "date": null
    }
  },
  {
    "id": "question-244",
    "kind": "question",
    "title": "刺繍の料金は何で決まる？",
    "summary": "刺繍は針数で料金が変わるのが一般的で、ある小売の名入れ刺繍は5000針まで2500円、それ以上3500円とする。ワッペンは別に加工代がかかる。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "刺繍の見積もりの見方",
    "source": {
      "title": "刺繍サービス",
      "url": "https://www.muji.com/jp/shop/service/embroidery/",
      "publisher": "無印良品",
      "date": null
    }
  },
  {
    "id": "question-245",
    "kind": "question",
    "title": "刺繍は1枚から頼める？",
    "summary": "刺繍は小ロットが難しくコストや納期が課題になりがちだが、簡易ロゴ刺繍で1点から約5営業日をうたうサービスも出ている。最小枚数とデータ代の有無を書くとよい。",
    "industries": [
      "繊維"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "source": {
      "title": "1点から刺繍",
      "url": "https://netshop.impress.co.jp/r/prtimes/items/000000049.000085001",
      "publisher": "ネットショップ担当者フォーラム",
      "date": null
    }
  },
  {
    "id": "trend-192",
    "kind": "trend",
    "official": false,
    "title": "第三者承継の譲渡側で製造業は2位",
    "summary": "引継ぎ支援センターの成約で、譲り渡した会社の業種は製造業が23.4%で2番目に多い（2020年度、ニュースイッチ報道）。後継者がいない町工場が第三者に引き継ぐ例が増えている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "うちの工場が「続く会社」である理由",
    "source": {
      "title": "事業承継・引継ぎ支援センターの相談・成約が過去最高",
      "url": "https://newswitch.jp/p/28011",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "trend-193",
    "kind": "trend",
    "official": true,
    "title": "第三者承継の成約は年2千件超",
    "summary": "中小機構によると、引継ぎ支援センター経由の第三者承継の成約は2024年度2,132件、2025年度2,265件と過去最多を更新。新規相談者も2万4千者を超えた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "第三者承継の成約件数が過去最高",
      "url": "https://j-net21.smrj.go.jp/news/nskto6000001zltv.html",
      "publisher": "J-Net21（中小機構）",
      "date": null
    }
  },
  {
    "id": "trend-194",
    "kind": "trend",
    "official": true,
    "title": "引継ぎ支援の優良事例を国が表彰",
    "summary": "中小機構は全国48の引継ぎ支援センターの事例を表彰する「Best Practice 2025」を開催。親子承継や、清算まで支えた第三者承継などが選ばれ、支援の手法を全国で共有している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "事業承継・引継ぎ支援センターの優良支援事例を表彰",
      "url": "https://j-net21.smrj.go.jp/news/nskto6000001pmm7.html",
      "publisher": "J-Net21（中小機構）",
      "date": "2025-03"
    }
  },
  {
    "id": "pain-146",
    "kind": "pain",
    "title": "親子でも承継の話がまとまらない",
    "summary": "精密部品加工の町工場で、社長と長女の承継の話し合いが難航。第三者の専門家を交えて承継計画書をつくり、全員が納得できる形にした例がある（京都府センター）。",
    "industries": [
      "機械部品",
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "articleIdea": "娘が継ぐ町工場、計画書で話がまとまった",
    "source": {
      "title": "事業承継・引継ぎ支援事例",
      "url": "https://kyo.or.jp/keisyo/case/docs/24123.pdf",
      "publisher": "京都府事業承継・引継ぎ支援センター",
      "date": null
    }
  },
  {
    "id": "success-104",
    "kind": "success",
    "title": "今の技術で新事業を作って継ぐ",
    "summary": "京都府センターの事例では、家業の技術を使った新しい事業を社内で立ち上げ、後継者が「社内ベンチャー」として引き継いだ。継ぐ理由を新事業で示す形もある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "継ぐと決めて始めた新しい仕事の話",
    "source": {
      "title": "事業承継・引継ぎ支援事例（社内ベンチャー型）",
      "url": "https://kyo.or.jp/keisyo/case/docs/%E2%91%AA%E4%BA%8B%E6%A5%AD%E6%89%BF%E7%B6%99%E3%83%BB%E5%BC%95%E7%B6%99%E3%81%8E%E6%94%AF%E6%8F%B4%E4%BA%8B%E4%BE%8B%EF%BC%88%E3%88%B1%E4%B8%89%E6%9C%A8%E7%9B%9B%E9%80%B2%E5%A0%82%EF%BC%89.pdf",
      "publisher": "京都府事業承継・引継ぎ支援センター",
      "date": null
    }
  },
  {
    "id": "term-300",
    "kind": "term",
    "title": "従業員承継（社員承継）",
    "summary": "親族ではなく、社内の幹部社員などに会社を引き継ぐこと。経営に近い仕事をしてきた「番頭さん」が継ぐ例が多い。株を買うお金の問題があり、MBOファンドを使う方法もある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "従業員承継",
      "url": "https://j-net21.smrj.go.jp/handbook/succession/employee.html",
      "publisher": "J-Net21（中小機構）",
      "date": null
    }
  },
  {
    "id": "pain-147",
    "kind": "pain",
    "title": "社員に継がせたいが覚悟が育たない",
    "summary": "中小企業庁は事業承継ガイドラインを改訂し、従業員承継の解説を厚くした。後継者候補には早くから経理・営業・経営企画など幅広い仕事と重要な案件を任せるよう勧めている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "従業員承継 後継者候補へ早期教育を",
      "url": "https://www.rodo.co.jp/news/124038/",
      "publisher": "労働新聞社",
      "date": null
    }
  },
  {
    "id": "question-246",
    "kind": "question",
    "title": "社長が代わっても取引は続く？",
    "summary": "発注者は代替わりで品質や窓口が変わらないか気にする。後継者の経歴、承継の時期、技術を誰が受け継いでいるかを記事で先に伝えると安心につながる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "代替わりしても変わらないこと、変えること",
    "source": {
      "title": "従業員承継 後継者候補へ早期教育を",
      "url": "https://www.rodo.co.jp/news/124038/",
      "publisher": "労働新聞社",
      "date": null
    }
  },
  {
    "id": "pain-148",
    "kind": "pain",
    "title": "買収後に社員が不安で辞めそう",
    "summary": "日本公庫のレポートは、M&Aの後は経営者が相手先の現場に入り直接話して社員の不安を取り除くこと、相手のやり方を尊重することが大事だと指摘している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小企業のM&Aに関する調査",
      "url": "https://www.jfc.go.jp/n/release/pdf/topics_160715a.pdf",
      "publisher": "日本政策金融公庫",
      "date": null
    }
  },
  {
    "id": "buyer-098",
    "kind": "buyer",
    "title": "譲り受ける側は熟練工と技術を見る",
    "summary": "M&Aの買い手にとって、熟練の技能工や技術を持つ中小製造業は価値が高いとされる。利益の波が小さい会社は評価されやすい。技術と人を言葉にしておくことが承継でも役立つ。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小製造業のM&A",
      "url": "https://gentosha-go.com/articles/-/6743",
      "publisher": "幻冬舎ゴールドオンライン",
      "date": null
    }
  },
  {
    "id": "trend-195",
    "kind": "trend",
    "official": false,
    "title": "事業承継・M&A補助金の16次公募",
    "summary": "16次公募は2026年10月2日〜11月6日に受付（創業手帳）。事業承継促進枠・専門家活用枠・PMI推進枠・廃業・再チャレンジ枠がある。申請はJグランツのみ。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "「事業承継・M&A補助金」16次公募の書類が公開",
      "url": "https://sogyotecho.jp/news/20260928shoukei-mahojokin/",
      "publisher": "創業手帳",
      "date": "2026-09"
    }
  },
  {
    "id": "trend-196",
    "kind": "trend",
    "official": true,
    "title": "継ぐ前の設備投資にも補助",
    "summary": "事業承継促進枠は、親族内承継・従業員承継を予定する会社の設備投資などを支援する。小規模事業者は補助率2/3（中小企業庁の公募情報）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "承継をきっかけに入れた新しい機械",
    "source": {
      "title": "事業承継・M&A補助金 公募",
      "url": "https://www.chusho.meti.go.jp/koukai/hojyokin/kobo/2026/260522001.html",
      "publisher": "中小企業庁",
      "date": "2026-05"
    }
  },
  {
    "id": "term-301",
    "kind": "term",
    "title": "経営者保証の解除",
    "summary": "会社の借入れに社長個人が付ける保証を外すこと。後継者が保証を嫌って承継を断る例があり、国は2020年から承継時に保証を外す支援や、保証のいらない信用保証制度を設けている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "経営者保証の解除に向けた取組",
      "url": "https://www.chusho.meti.go.jp/kinyu/hosyoukaijo/",
      "publisher": "中小企業庁",
      "date": null
    }
  },
  {
    "id": "pain-149",
    "kind": "pain",
    "title": "続けたいが承継は考えていない",
    "summary": "上越市の調査（令和5年度）では後継者未定が44.2%、続ける予定なのに承継を検討していない会社が58.0%。考え始めるのが遅れがちな実態がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "事業承継に関する調査",
      "url": "https://www.city.joetsu.niigata.jp/uploaded/attachment/278487.pdf",
      "publisher": "上越市",
      "date": null
    }
  },
  {
    "id": "success-105",
    "kind": "success",
    "title": "二代目は理念を言い直して発信",
    "summary": "二代目は創業者のまねではなく、今の時代に合わせて理念を見直すことが大事とされる。継いだ理由と、これから大事にすることをブログで言葉にすると、社員にも取引先にも伝わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "二代目として、理念を自分の言葉に",
    "source": {
      "title": "二代目社長の経営",
      "url": "https://www.nihon-ma.co.jp/columns/2024/x20240514/",
      "publisher": "日本M&Aセンター",
      "date": "2024-05"
    }
  },
  {
    "id": "success-106",
    "kind": "success",
    "title": "強みが伝わるサイトに作り直す",
    "summary": "樹脂試作メーカーが、強みを伝えきれない旧サイトを製造業に詳しい制作会社と作り直し、問い合わせ・見積依頼が右肩上がりになったと紹介されている（制作会社の取材記事）。",
    "industries": [
      "樹脂成形",
      "3Dプリンタ"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "ホームページリニューアルで問い合わせ増",
      "url": "https://mono.ipros.com/news/detail/69157",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-107",
    "kind": "success",
    "title": "後付けセンサーで稼働率が上がった",
    "summary": "NTT東日本の工場向けIoTの試行で、埼玉の金属加工会社の鋼板加工装置の稼働率が4%上がり、年120万円の収益向上とされた（2018年ごろの事例）。古い機械にも後から付けられる。",
    "industries": [
      "金属加工",
      "板金"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "うちの機械、本当は何割動いている？",
    "source": {
      "title": "工場向けIoTで稼働を見える化",
      "url": "https://businessnetwork.jp/?p=7024",
      "publisher": "BUSINESS NETWORK",
      "date": null
    }
  },
  {
    "id": "term-302",
    "kind": "term",
    "title": "積層信号灯で稼働を見える化",
    "summary": "機械を改造せず、表示灯（シグナルタワー）の点灯時間を安いセンサーで読み取り、稼働率を記録する方法。産総研が中小工場向けに開発した。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "後付け型の稼働率可視化システム",
      "url": "https://www.aist.go.jp/Portals/0/kyushu/images/event/20190926/pos/PRE__miyazakiK.pdf",
      "publisher": "産業技術総合研究所",
      "date": "2019"
    }
  },
  {
    "id": "pain-150",
    "kind": "pain",
    "title": "IoTが目的なしで終わる",
    "summary": "IoTで多い失敗は目的があいまいなまま始めること。勘に頼っている工程を1つ選んでデータを取り、効果を確かめながら広げるのがよいと中小企業診断士が助言している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "はじめてのIoT活用入門",
      "url": "https://www.zeiken.co.jp/zeikenpress/column/0037zp20260713/",
      "publisher": "税研情報センター",
      "date": "2026-07"
    }
  },
  {
    "id": "success-108",
    "kind": "success",
    "title": "1工程だけ見える化して記事に",
    "summary": "小さく始めたIoTの「前と後」は記事にしやすい。どの工程で、何を測り、何が分かったかを数字で書くと、発注者には管理のできる工場として伝わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "1台の機械にセンサーを付けて分かったこと",
    "source": {
      "title": "はじめてのIoT活用入門",
      "url": "https://www.zeiken.co.jp/zeikenpress/column/0037zp20260713/",
      "publisher": "税研情報センター",
      "date": "2026-07"
    }
  },
  {
    "id": "pain-151",
    "kind": "pain",
    "title": "IoTブームから10年、進まない",
    "summary": "MONOistの連載は、IoTが話題になって10年たっても中小製造業での導入が進まない理由を整理している。費用や人の不足、効果の見えにくさが壁になりやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "なぜ中小製造業のIoT導入は進まないのか",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2407/16/news006_2.html",
      "publisher": "MONOist",
      "date": "2024-07"
    }
  },
  {
    "id": "pain-152",
    "kind": "pain",
    "title": "生産管理が大げさすぎて回らない",
    "summary": "10〜200人の工場では専任のIT担当がいない前提で選ぶ必要がある。大企業向けの機能をそのまま入れると現場が追いつかない。在庫管理から小さく始める進め方が紹介されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "中小製造業の生産管理システムの選び方",
      "url": "https://www.issoh.co.jp/column/details/15499/",
      "publisher": "issoh",
      "date": null
    }
  },
  {
    "id": "term-303",
    "kind": "term",
    "title": "生産管理システム",
    "summary": "受注・工程・在庫・出荷などをまとめて管理する仕組み。中小向けの標準パッケージは100万〜500万円ほどが目安とされる（issohの記事）。Excel管理から移る会社が多い。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小製造業の生産管理システムの選び方",
      "url": "https://www.issoh.co.jp/column/details/15499/",
      "publisher": "issoh",
      "date": null
    }
  },
  {
    "id": "pain-153",
    "kind": "pain",
    "title": "システムを入れてもExcelに戻る",
    "summary": "導入後もExcelで計算し続ける例が多い。原因はシステムより、移る前の準備不足や業務を変えない姿勢にあるとされる。現場の声を聞かずに入れると使われない。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "生産管理システム導入の失敗例",
      "url": "https://it-trend.jp/production_management/article/failure_case",
      "publisher": "ITトレンド",
      "date": null
    }
  },
  {
    "id": "pain-154",
    "kind": "pain",
    "title": "Excelの手入力でミスと重さ",
    "summary": "データが増えるとExcelは重くなり、手入力ミスや共有のしにくさが出る。複数人で同じ表を触ると最新版が分からなくなる、というのが脱Excelのきっかけになりやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "Excel管理の限界",
      "url": "https://boxil.jp/mag/a9520/",
      "publisher": "BOXIL",
      "date": null
    }
  },
  {
    "id": "question-247",
    "kind": "question",
    "title": "納期の回答が早い工場の仕組みは？",
    "summary": "発注者は納期回答の早さを見ている。工程や在庫をシステムで見えるようにした工場は、すぐ答えられる理由として記事で仕組みを説明できる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "納期を即答できるようになった理由",
    "source": {
      "title": "Excel管理の限界",
      "url": "https://boxil.jp/mag/a9520/",
      "publisher": "BOXIL",
      "date": null
    }
  },
  {
    "id": "success-109",
    "kind": "success",
    "title": "ネット見積は1時間以内に返す",
    "summary": "東京の精密板金会社は、ネットで見積を頼む人が一番気にするのは回答の速さと考え、依頼から1時間以内に返す体制を作り、多くの新規顧客を得た（MONOist）。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "見積の回答はなぜ早いのか",
    "source": {
      "title": "Webアクセスからの受注率を改善するポイント",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2305/16/news002_3.html",
      "publisher": "MONOist",
      "date": "2023-05"
    }
  },
  {
    "id": "buyer-099",
    "kind": "buyer",
    "title": "Webで見積を頼む人は速さで選ぶ",
    "summary": "ネット経由で見積を頼む人は、答えの速さを特に重視するとされる。「何時間で返します」と書いておくと選ばれやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "Webアクセスからの受注率を改善するポイント",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2305/16/news002_3.html",
      "publisher": "MONOist",
      "date": "2023-05"
    }
  },
  {
    "id": "term-304",
    "kind": "term",
    "title": "Web見積（オンライン見積）",
    "summary": "発注者がWeb上で仕様を入れると見積が出る仕組み。標準品は自動、特注は担当者が手で直す使い方もある。過去の見積が残るので再見積が早くなる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "BtoB向けWeb見積システムのリリース",
      "url": "https://img.ecnomikata.com/img_contents/pr/pdf_files/47177_pdf_1_B2Bcommerce_pressrelease.pdf",
      "publisher": "ECのミカタ",
      "date": null
    }
  },
  {
    "id": "trend-197",
    "kind": "trend",
    "official": true,
    "title": "DX事例はミラサポplusと白書で探せる",
    "summary": "IPAの案内では、ミラサポplusで「DX」と検索すると背景・課題・解決法・成果つきの事例が読める。中小企業白書の第2部にもDX事例がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小規模製造業のDX事例",
      "url": "https://www.ipa.go.jp/digital/dx/dxlink.html",
      "publisher": "IPA",
      "date": null
    }
  },
  {
    "id": "success-110",
    "kind": "success",
    "title": "DXの道のりを連載で語る",
    "summary": "MONOistは中小製造業が基幹業務をまとめてデジタル化した過程を連載で紹介している。苦労した点まで書いた記事は、同じ悩みの経営者や求職者にも読まれる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "紙とExcelをやめるまでの1年",
    "source": {
      "title": "基幹系をまとめてデジタル化した中小製造業",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2505/13/news001_2.html",
      "publisher": "MONOist",
      "date": "2025-05"
    }
  },
  {
    "id": "success-111",
    "kind": "success",
    "title": "DXで新しい顧客も得た事例集",
    "summary": "静岡市の事例集は、デジタル技術で人手不足・効率化・コスト削減に加え、新しい顧客の獲得につなげた地元企業の例を載せている。自治体の事例集は記事ネタの宝庫。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "静岡市DX事例集",
      "url": "https://www.city.shizuoka.lg.jp/s2746/s013073.html",
      "publisher": "静岡市",
      "date": null
    }
  },
  {
    "id": "trend-198",
    "kind": "trend",
    "official": false,
    "title": "会社として生成AIを推すのは2割",
    "summary": "東京商工リサーチの2026年春の調査（有効6,327社）では、生成AIを会社として活用推進しているのは20.3%。調査によって利用率の数字は大きく違う。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "生成AIの活用に関するアンケート",
      "url": "https://www.tsr-net.co.jp/data/detail/1202766_1527.html",
      "publisher": "東京商工リサーチ",
      "date": "2026-04"
    }
  },
  {
    "id": "trend-199",
    "kind": "trend",
    "official": false,
    "title": "経営者の44%が普段から生成AI",
    "summary": "エヌエヌ生命の2026年5月の調査（中小企業経営者5,673名）では44.2%が普段から生成AIを使い、39.3%は使わず検討もしていない。二極化が進む。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小企業経営者の生成AI利用",
      "url": "https://prtimes.jp/main/html/rd/p/000000184.000025186.html",
      "publisher": "エヌエヌ生命（PR TIMES）",
      "date": "2026-05"
    }
  },
  {
    "id": "pain-155",
    "kind": "pain",
    "title": "AIを一度も使っていない会社が6割",
    "summary": "大同生命の2026年3月発表の調査では、生成AIを活用したことがない中小企業が60%、日常的に使うのは13%だったと報じられた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "中小企業の6割がAI活用せず",
      "url": "https://www.oanda.jp/lab-education/market_news/kn_2026031101001102/",
      "publisher": "OANDA（共同通信配信）",
      "date": "2026-03"
    }
  },
  {
    "id": "success-112",
    "kind": "success",
    "title": "生成AIは日報と見積の下書きから",
    "summary": "失敗しても困らない事務から始めるのがよいとされる。設備工事向けの解説では、日報のたたき台や見積の項目整理に生成AIを使い、確認作業だけにする使い方が紹介されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "電気設備工事のAI活用ガイド2026",
      "url": "https://uravation.com/media/electrical-facility-construction-ai-guide-2026/",
      "publisher": "uravation",
      "date": "2026"
    }
  },
  {
    "id": "success-113",
    "kind": "success",
    "title": "社長の生成AI挑戦を発信",
    "summary": "埼玉県中央会のセミナーで町工場の代表が生成AIへの挑戦を語った。社長自らの試行錯誤は記事にすると親近感があり、新しいことに前向きな会社として伝わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "社長がAIを使ってみた1か月",
    "source": {
      "title": "DXセミナー（町工場の生成AI挑戦）",
      "url": "https://saitama-j.or.jp/wp-content/uploads/2024/08/dx_seminar2nd_09.13.2024.pdf",
      "publisher": "埼玉県中小企業団体中央会",
      "date": "2024-09"
    }
  },
  {
    "id": "question-248",
    "kind": "question",
    "title": "AIを使う工場に図面を渡して平気？",
    "summary": "発注者は情報の扱いを気にする。生成AIを使う場合は、図面や顧客名をAIに入れない、有料版で学習させない設定にしている等のルールを記事で示すと安心される。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "生成AIの活用に関するアンケート",
      "url": "https://www.tsr-net.co.jp/data/detail/1202766_1527.html",
      "publisher": "東京商工リサーチ",
      "date": "2026-04"
    }
  },
  {
    "id": "pain-156",
    "kind": "pain",
    "title": "CO2を出せと言われ何を集めるか",
    "summary": "取引先から製品あたりのCO2、CFP、再エネ比率などを求められる。何のデータを集めるか分からない、自信を持って答えられない、という悩みが多い。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "取引先から「CO2を出してください」と言われた製造業向けセミナー",
      "url": "https://prtimes.jp/main/html/rd/p/000000386.000023654.html",
      "publisher": "NTT-AT（PR TIMES）",
      "date": null
    }
  },
  {
    "id": "trend-200",
    "kind": "trend",
    "official": true,
    "title": "Tier1とTier2で製品CO2を算定",
    "summary": "三重県は自動車部品の取引で、完成車メーカーと直接取引する会社とその仕入先が組んで製品単位のCO2（CFP）を算定する実証の参加者を募った。",
    "industries": [
      "機械部品",
      "金属加工",
      "樹脂成形"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "サプライチェーンでのCFP算定実証",
      "url": "https://www.pref.mie.lg.jp/common/content/001070669.pdf",
      "publisher": "三重県",
      "date": null
    }
  },
  {
    "id": "term-305",
    "kind": "term",
    "title": "CFP（カーボンフットプリント）",
    "summary": "1つの製品が材料から作られ、使われ、捨てられるまでに出るCO2などを合計した量。部品メーカーは取引先から自社工程の分の数字を求められることが増えている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "サプライチェーンでのCFP算定実証",
      "url": "https://www.pref.mie.lg.jp/common/content/001070669.pdf",
      "publisher": "三重県",
      "date": null
    }
  },
  {
    "id": "question-249",
    "kind": "question",
    "title": "測っていない会社でもCO2は出せる？",
    "summary": "電気・燃料の使用量に排出係数をかければ自社のおよその排出量は出せる。広島市の資料では、統計の原単位から推計する方法も示されている。まず請求書の使用量を集めることから。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "温室効果ガス排出量の推計方法",
      "url": "https://www.city.hiroshima.lg.jp/_res/projects/default_project/_page_/001/023/980/46206.pdf",
      "publisher": "広島市",
      "date": null
    }
  },
  {
    "id": "term-306",
    "kind": "term",
    "title": "SBT（中小企業版）",
    "summary": "科学的な根拠に沿ったCO2削減目標を国際団体が認める仕組み。中小企業向けは条件が簡単で、取引先の信頼、認知度、資金調達や採用にもよいとされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小企業版SBT認定取得の案内",
      "url": "https://www.city.iida.lg.jp/uploaded/attachment/81707.pdf",
      "publisher": "飯田市",
      "date": null
    }
  },
  {
    "id": "trend-201",
    "kind": "trend",
    "official": true,
    "title": "SBT認定取得に県や市が補助",
    "summary": "新潟県や宇都宮市は中小企業のSBT認定取得を補助している。削減の対象が電気や燃料なので、取り組みが光熱費の削減にもつながるとされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小企業版SBT認定の補助",
      "url": "https://www.pref.niigata.lg.jp/uploaded/attachment/504649.pdf",
      "publisher": "新潟県",
      "date": null
    }
  },
  {
    "id": "success-114",
    "kind": "success",
    "title": "SBT認定を会社の強みとして書く",
    "summary": "認定を取ったら、目標と取り組みを会社紹介やブログに書く。CO2削減目標を持つ取引先を探す購買担当には、それ自体が選ぶ理由になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "うちがCO2削減目標を立てた理由",
    "source": {
      "title": "SBT認定取得支援補助金",
      "url": "https://www.city.utsunomiya.lg.jp/_res/projects/default_project/_page_/001/032/050/r8chirashisbt.pdf",
      "publisher": "宇都宮市",
      "date": "2026"
    }
  },
  {
    "id": "trend-202",
    "kind": "trend",
    "official": true,
    "title": "工場の省エネ診断は無料で受けられる",
    "summary": "神奈川県は事業所の省エネ診断を無料で行い、2026年度は申込が多く一次受付を早めに締め切った。国の制度（SII）でも専門家が訪問して改善を提案する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "省エネ診断",
      "url": "https://www.pref.kanagawa.jp/docs/ap4/cnt/f7226/syoueneshindan.html",
      "publisher": "神奈川県",
      "date": "2026"
    }
  },
  {
    "id": "success-115",
    "kind": "success",
    "title": "省エネ診断の結果を記事にする",
    "summary": "診断は約1日で工場全体のエネルギーのむだを見る方式もある。指摘された点と直した結果を記事にすれば、脱炭素に取り組む会社として取引先に説明しやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "省エネ診断で言われた3つのこと",
    "source": {
      "title": "省エネ診断の比較表",
      "url": "https://shigaplaza.or.jp/wp-content/uploads/2025/04/省エネ診断比較表.pdf",
      "publisher": "滋賀県産業支援プラザ",
      "date": "2025-04"
    }
  },
  {
    "id": "trend-203",
    "kind": "trend",
    "official": false,
    "title": "脱炭素の取組は省エネ設備が最多",
    "summary": "日商・東商の2026年7月の調査では、取組は省エネ設備への更新・導入が40.8%で最多。排出量の把握・測定をしている会社は約4割にとどまる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小企業の脱炭素の取組に関する調査",
      "url": "https://www.jcci.or.jp/file/sangyo2/202607/20260716_survey_release.pdf",
      "publisher": "日本商工会議所・東京商工会議所",
      "date": "2026-07"
    }
  },
  {
    "id": "pain-157",
    "kind": "pain",
    "title": "脱炭素の動機は光熱費の削減",
    "summary": "日商の調査では、脱炭素に取り組む理由は「光熱費・燃料費の削減」が75.2%で最多。評価や知名度の向上を挙げる会社は30.5%だった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "中小企業のカーボンニュートラルに関する調査",
      "url": "https://www.jcci.or.jp/file/sangyo2/202410/web_gaiyo_cn.pdf",
      "publisher": "日本商工会議所",
      "date": "2024-10"
    }
  },
  {
    "id": "buyer-100",
    "kind": "buyer",
    "title": "上場企業は仕入先のCO2を聞いている",
    "summary": "上場企業が仕入先の中小企業に排出量を問い合わせており、取引先の要望を事実上のルールと受け止める機械メーカーもある（ニュースイッチ）。脱炭素は取引条件になりつつある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "中小にも及ぶ脱炭素の要請",
      "url": "https://newswitch.jp/p/31431",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "question-250",
    "kind": "question",
    "title": "御社のCO2排出量を教えてもらえる？",
    "summary": "購買担当から聞かれる前に、年間の電気・燃料使用量からの排出量、減らすための取組、問い合わせ窓口をまとめたページを用意しておくと回答が早くなる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "CO2排出量の問い合わせにお答えします",
    "source": {
      "title": "中小にも及ぶ脱炭素の要請",
      "url": "https://newswitch.jp/p/31431",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "success-116",
    "kind": "success",
    "title": "再エネ導入と電力の見える化を発信",
    "summary": "川崎市の事例集には、再エネ電力の導入や電力使用の見える化をして、その取り組みを社外に発信している製造業が載っている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "脱炭素の取組事例一覧",
      "url": "https://www.city.kawasaki.jp/300/cmsfiles/contents/0000165/165720/jirei_ichiran.pdf",
      "publisher": "川崎市",
      "date": null
    }
  },
  {
    "id": "term-307",
    "kind": "term",
    "title": "GX（グリーントランスフォーメーション）",
    "summary": "化石燃料に頼る経済や事業を、CO2を出さない形に変えていくこと。中小企業では省エネ・省資源、電化、再エネへの切替が三つの柱とされる（中小機構）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小企業のカーボンニュートラル",
      "url": "https://j-net21.smrj.go.jp/special/chusho_sdgs/carbonneutral/index.html",
      "publisher": "J-Net21（中小機構）",
      "date": null
    }
  },
  {
    "id": "success-117",
    "kind": "success",
    "title": "脱炭素は投資として語る",
    "summary": "富山県の手引書は脱炭素を「コストではなく投資」とし、業種別の事例を載せている。設備更新の記事でも、電気代とCO2がどれだけ減ったかを書くと伝わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "article_idea"
    ],
    "articleIdea": "新しいコンプレッサーで電気代はどう変わった？",
    "source": {
      "title": "中小企業GX取組み手引書",
      "url": "https://www.pref.toyama.jp/documents/45794/250314_tirashi.pdf",
      "publisher": "富山県",
      "date": "2025-03"
    }
  },
  {
    "id": "term-308",
    "kind": "term",
    "title": "連携事業継続力強化計画",
    "summary": "複数の会社が組んで、災害時に資源の融通や代替生産、情報共有をし合う計画。国に認定されると、ものづくり補助金の加点などの支援を受けられる場合がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "事業継続力強化計画のご案内",
      "url": "https://www.chubu.meti.go.jp/c88bcp/sonota/zigyokeitirasi.pdf",
      "publisher": "中部経済産業局",
      "date": null
    }
  },
  {
    "id": "success-118",
    "kind": "success",
    "title": "被災時の代替生産の仕組みを書く",
    "summary": "連携先が代わりに作る体制があると、被災しても顧客に届け続けられ信頼が高まる（中部経産局の案内）。「もしもの時の供給」を一つの記事にすると発注者に響く。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "災害で工場が止まったら、どう届ける？",
    "source": {
      "title": "事業継続力強化計画のご案内",
      "url": "https://www.chubu.meti.go.jp/c88bcp/sonota/zigyokeitirasi.pdf",
      "publisher": "中部経済産業局",
      "date": null
    }
  },
  {
    "id": "trend-204",
    "kind": "trend",
    "official": true,
    "title": "強化計画の認定は製造業が約7割",
    "summary": "中小企業庁の資料では、事業継続力強化計画の認定事業者の約7割が製造業などで、自動車部品や食品製造が多い（2020年時点）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小企業強靱化研究会資料",
      "url": "https://www.chusho.meti.go.jp/koukai/kenkyukai/kyoujin/2020/201214kyoujin04.pdf",
      "publisher": "中小企業庁",
      "date": "2020-12"
    }
  },
  {
    "id": "pain-158",
    "kind": "pain",
    "title": "大手と組む連携BCPが進まない",
    "summary": "白書は、大企業が連携計画に入っても実質的な支援を受けにくく、連携の策定が進んでいないと指摘している。中小同士の連携が現実的な選択肢になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小企業白書2021 共通基盤の整備",
      "url": "https://www.chusho.meti.go.jp/pamflet/hakusyo/2021/chusho/b1_3_4.html",
      "publisher": "中小企業庁",
      "date": "2021"
    }
  },
  {
    "id": "question-251",
    "kind": "question",
    "title": "BCPを作っていますか？と聞かれたら",
    "summary": "発注者はサプライヤーにBCPの有無を聞くことがある。国の事業継続力強化計画の認定を受けていれば、その旨と認定年を書くだけで答えになる。認定後は低利融資なども使える。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "事業継続力強化計画の支援",
      "url": "https://www.jfc.go.jp/n/findings/pdf/420.pdf",
      "publisher": "日本政策金融公庫",
      "date": null
    }
  },
  {
    "id": "buyer-101",
    "kind": "buyer",
    "title": "発注者は1社に頼らない買い方を取る",
    "summary": "一社に頼ると災害などで生産が止まるため、発注者は同じ部品を複数の会社から買う。「2社目の仕入先」として選ばれる余地があるので、それを意識した書き方が効く。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "2社目の仕入先としてお使いください",
    "source": {
      "title": "複数社購買とは",
      "url": "https://biz.moneyforward.com/erp/basic/6312/",
      "publisher": "マネーフォワード",
      "date": "2025-09"
    }
  },
  {
    "id": "trend-205",
    "kind": "trend",
    "official": true,
    "title": "被災地の取引先への配慮を国が要請",
    "summary": "経産省は2024年11月、奥能登豪雨の被災地の中小企業との取引で、受領拒否や支払遅延、一方的な発注停止をしないよう事業者団体に要請した。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "奥能登豪雨に係る下請取引への配慮要請",
      "url": "https://jja.ne.jp/industry/giinfo/gi20241115.pdf",
      "publisher": "経済産業省の要請（jja.ne.jp掲載）",
      "date": "2024-11"
    }
  },
  {
    "id": "buyer-102",
    "kind": "buyer",
    "title": "製造業は取引先にBCPを求めがち",
    "summary": "調査では、取引先にBCP策定を依頼した会社は全産業で13%、製造業は23%。製造業ほど取引の中でBCPを求め、求められている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "BCPに関する調査",
      "url": "https://hokkeiren.gr.jp/news/data/5adf000b62e62f8396247d828e2f2844.pdf",
      "publisher": "北海道経済連合会",
      "date": null
    }
  },
  {
    "id": "success-119",
    "kind": "success",
    "title": "遠くの同業、近くの異業種と組む",
    "summary": "中部の防災ネットワークは「遠くの同業者、近くの異業種」と組むことを勧める。同時に被災しにくい遠方の同業と協力を決めておき、それを取引先に伝える方法がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "中部防災推進ネットワーク",
      "url": "https://www.gensai.nagoya-u.ac.jp/kyoso/pdf/cbsnw/mail-magazine20220627.pdf",
      "publisher": "名古屋大学減災連携研究センター",
      "date": "2022-06"
    }
  },
  {
    "id": "success-120",
    "kind": "success",
    "title": "遠方企業と相互応援の協定",
    "summary": "新潟の企業は、同時に被災しにくい東京の企業と相互応援の協定を結び、災害時にも供給責任を果たす体制を作った（内閣官房の事例）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "民間の国土強靱化事例",
      "url": "https://www.cas.go.jp/jp/seisaku/kokudo_kyoujinka/h29_minkan/pdf/2266.pdf",
      "publisher": "内閣官房",
      "date": "2017"
    }
  },
  {
    "id": "success-121",
    "kind": "success",
    "title": "横請けネットワークで受注を広げる",
    "summary": "大阪商工会議所は機械・金属加工の町工場をつなぎ、1社では受けられない仕事を共同で受ける「町工場ネットワーク」を作り、各社の設備・技術をデータベースにした。",
    "industries": [
      "金属加工",
      "機械部品"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "うちでできない加工は仲間の工場と",
    "source": {
      "title": "町工場の連携強める「横請け」",
      "url": "https://www.rodo.co.jp/news/23225/",
      "publisher": "労働新聞社",
      "date": "2017"
    }
  },
  {
    "id": "term-309",
    "kind": "term",
    "title": "発注者リスト",
    "summary": "価格交渉促進月間の調査で、中小企業の回答を点数にして、主な発注企業を価格交渉・転嫁・支払条件の4段階で実名公表するもの。年2回の月間ごとに出る。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "価格交渉促進月間フォローアップ調査",
      "url": "https://www.chusho.meti.go.jp/keiei/torihiki/follow-up/index.html",
      "publisher": "中小企業庁",
      "date": null
    }
  },
  {
    "id": "buyer-103",
    "kind": "buyer",
    "title": "大手は発注者リストを気にしている",
    "summary": "経団連は会員企業に向け、発注者リストの結果を受けた取引適正化の対応を呼びかけている。発注側も評価を気にしており、根拠のある値上げ相談は以前より通りやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "価格交渉促進月間の結果を踏まえた対応",
      "url": "https://www.keidanren.or.jp/announce/2026/0302.html",
      "publisher": "経団連",
      "date": "2026-03"
    }
  },
  {
    "id": "success-122",
    "kind": "success",
    "title": "公表データで値上げの根拠を作る",
    "summary": "中小企業庁は、労務費・原材料・エネルギーの上昇を示す公表資料の例を価格交渉ハンドブックに載せている。最低賃金の上昇率や春闘の妥結額などが根拠に使える。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "原価計算・価格交渉のための資料",
      "url": "https://www.chusho.meti.go.jp/keiei/torihiki/pamflet/genka_keisan.pdf",
      "publisher": "中小企業庁",
      "date": null
    }
  },
  {
    "id": "term-310",
    "kind": "term",
    "title": "労務費転嫁の指針",
    "summary": "人件費の上昇分を価格に乗せるため、内閣官房と公取委が出した発注側・受注側の行動の目安。発注者が根拠を求めるときは公表資料でよいとしている。2025年12月に改正された。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "価格転嫁のチラシ",
      "url": "https://www.pref.nagano.lg.jp/keieishien/documents/flier_kakakutenka.pdf",
      "publisher": "長野県",
      "date": null
    }
  },
  {
    "id": "pain-159",
    "kind": "pain",
    "title": "値上げの話を口頭で済ませてしまう",
    "summary": "交渉では原材料などの推移を示す客観データが有効で、取り決めや交渉の経過は議事録・見積書・契約書に残すことが大事とされる（神奈川県）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "適切な価格転嫁に向けた取組",
      "url": "https://www.pref.kanagawa.jp/docs/jf2/chusho/partnership.html",
      "publisher": "神奈川県",
      "date": null
    }
  },
  {
    "id": "trend-206",
    "kind": "trend",
    "official": true,
    "title": "価格転嫁の検討ツールがある",
    "summary": "商品別・取引先別の収支を見ながら目指す取引価格を検討できるシミュレーションツールが公的に用意されている。よろず支援拠点に価格転嫁の相談窓口もある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "労務費の適切な転嫁のための指針",
      "url": "https://www.pref.kagoshima.jp/af01/kakakutennka/roumuhinotennkasisin.html",
      "publisher": "鹿児島県",
      "date": null
    }
  },
  {
    "id": "success-123",
    "kind": "success",
    "title": "見積書に「単価の内訳」を書く",
    "summary": "材料費・加工費・段取り費などの内訳を見積書に出すと、値上げの理由を説明しやすく交渉の記録にもなる。ブログで見積の見方を解説しておくと話が早い。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "当社の見積書の見方、項目ごとに解説",
    "source": {
      "title": "適切な価格転嫁に向けた取組",
      "url": "https://www.pref.kanagawa.jp/docs/jf2/chusho/partnership.html",
      "publisher": "神奈川県",
      "date": null
    }
  },
  {
    "id": "trend-207",
    "kind": "trend",
    "official": false,
    "title": "でんさいも60日で満額でなければ不可",
    "summary": "取適法の下では、受け取りから60日以内に満額を受け取れない電子記録債権や一括決済も原則使えない。2027年3月末で電子交換所での手形交換も終わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "手形・電子記録債権の新ルール",
      "url": "https://www.logi-today.com/995982",
      "publisher": "LOGISTICS TODAY",
      "date": "2026-09"
    }
  },
  {
    "id": "question-252",
    "kind": "question",
    "title": "支払条件は何日払いですか？",
    "summary": "中小企業側も支払条件を確かめてよい。2024年11月以降、60日を超える手形等は指導の対象に。自社の取引条件（月末締め翌月末払いなど）を書いておくと話が早い。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "手形等のサイト短縮に関する指導方針",
      "url": "https://www.meti.go.jp/press/2024/10/20241001002/20241001002.html",
      "publisher": "経済産業省",
      "date": "2024-10"
    }
  },
  {
    "id": "question-253",
    "kind": "question",
    "title": "生産終了で図面もない部品は作れる？",
    "summary": "現物を3Dスキャナーなどで測ってCADデータや図面を起こせば、図面のない部品や生産終了品も作り直せる。精度が必要な所は三次元測定機で別に測る。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "図面のない古い部品、現物から作り直せます",
    "source": {
      "title": "リバースエンジニアリングで図面のない部品を再生",
      "url": "https://mono.ipros.com/product/detail/2000731840",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-311",
    "kind": "term",
    "title": "リバースエンジニアリング",
    "summary": "現物の形を測ってデータに戻し、図面や3Dモデルを作ること。測定にはどうしても誤差が出て、鋭い角などは欠けることもある。公差や材質は形からは分からない。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "リバースエンジニアリング",
      "url": "https://hexagon.com/ja/resources/resource-library/reverse-engineering",
      "publisher": "Hexagon",
      "date": null
    }
  },
  {
    "id": "buyer-104",
    "kind": "buyer",
    "title": "現物持ち込みで頼む人に伝えたいこと",
    "summary": "図面なしで頼む場合、重要寸法と公差、材質、使う環境、欲しいデータ形式（STEPか図面か）を伝えると見積のずれが減る。これを依頼の手引きとして載せると親切。",
    "industries": [
      "3Dプリンタ",
      "金属加工",
      "機械部品"
    ],
    "useFor": [
      "shiori_tip",
      "question_example"
    ],
    "source": {
      "title": "3Dスキャンと3Dプリントでのリバースエンジニアリング",
      "url": "https://formlabs.com/jp/blog/how-to-use-3d-scanning-and-3d-printing-for-reverse-engineering",
      "publisher": "Formlabs",
      "date": null
    }
  },
  {
    "id": "success-124",
    "kind": "success",
    "title": "再製作の流れを図で見せる",
    "summary": "スキャン→データ修正→CAD化→試作→評価と、図面のない部品の再製作の流れを一連で紹介すると、保全担当など初めての依頼者が相談しやすくなる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "壊れた部品から新品ができるまで",
    "source": {
      "title": "リバースエンジニアリングとは",
      "url": "https://formlabs.com/jp/blog/reverse-engineering/",
      "publisher": "Formlabs",
      "date": null
    }
  },
  {
    "id": "term-312",
    "kind": "term",
    "title": "8Dレポート",
    "summary": "不良が出たときに、チーム編成・現状把握・応急処置・原因・対策・再発防止などを8つの段階でまとめる報告書。自動車業界でよく求められる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "8D Report",
      "url": "https://www.siemens.com/en-gb/technology/8d-report/",
      "publisher": "Siemens",
      "date": null
    }
  },
  {
    "id": "buyer-105",
    "kind": "buyer",
    "title": "不良の報告で見られるのは流出の原因",
    "summary": "発注者は、なぜ不良が起きたかだけでなく、なぜ検査をすり抜けたかの原因も求める（品質担当者の投稿）。2つの原因を分けて書く会社は信頼される。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "8D Response - What do they want?",
      "url": "https://elsmar.com/elsmarqualityforum/threads/nonconforming-product-that-made-it-to-ford-8d-response-what-do-they-want.18519/",
      "publisher": "Elsmar Cove",
      "date": null
    }
  },
  {
    "id": "buyer-106",
    "kind": "buyer",
    "title": "設計者は最初に実績を見る",
    "summary": "MONOistのインタビューでは設計開発者4人全員がまず実績を見ると回答。製品実績で「作れるか」、取引先実績で「信用できるか」を判断している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "サプライヤーの探し方と選定基準の本音",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2404/19/news005_2.html",
      "publisher": "MONOist",
      "date": "2024-04"
    }
  },
  {
    "id": "buyer-107",
    "kind": "buyer",
    "title": "相見積もりは2〜3社、多いと10社",
    "summary": "設計者は相見積もりを必ず取り、基本は2〜3社、多いと10社ほど。最終決定は購買だが技術部の意見が強く、価格だけでなく技術力との兼ね合いで決まる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "サプライヤーの探し方と選定基準の本音（4/4）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2404/19/news005_4.html",
      "publisher": "MONOist",
      "date": "2024-04"
    }
  },
  {
    "id": "buyer-108",
    "kind": "buyer",
    "title": "「何でも対応」より特化が目に付く",
    "summary": "設計者には、何でもできると書く会社より特定の技術に特化した会社が目に付きやすい。精度などの性能データや工場の写真も確認されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "サプライヤーの探し方と選定基準の本音（4/4）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2404/19/news005_4.html",
      "publisher": "MONOist",
      "date": "2024-04"
    }
  },
  {
    "id": "buyer-109",
    "kind": "buyer",
    "title": "デザインより更新と返信の速さ",
    "summary": "Webサイトのデザインはほぼ気にされないが、古すぎると信用を落とす。ある程度の更新と、問い合わせへの早い返信が求められる（MONOist）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "サプライヤーの探し方と選定基準の本音（4/4）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2404/19/news005_4.html",
      "publisher": "MONOist",
      "date": "2024-04"
    }
  },
  {
    "id": "buyer-110",
    "kind": "buyer",
    "title": "探し方は既存網・展示会・Web検索",
    "summary": "設計者のサプライヤー探しは、購買や商社などの既存のつながり、展示会、Web検索の3つが中心（MONOistのインタビュー）。Webは他の2つで見つからないときの入口になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "サプライヤーの探し方と選定基準の本音（1/4）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2404/19/news005.html",
      "publisher": "MONOist",
      "date": "2024-04"
    }
  },
  {
    "id": "trend-208",
    "kind": "trend",
    "official": false,
    "title": "国内回帰で新しい加工先探しが増える",
    "summary": "国内調達に戻す流れで、新しい加工先を探す発注者が増えている。「加工できる会社」探しだけでなく工程全体を組み直す視点が求められている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "国内調達回帰と加工先の開拓",
      "url": "https://pr.mono.ipros.com/en/mandai-inc/product/detail/2001636941/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-313",
    "kind": "term",
    "title": "購買と調達の違い",
    "summary": "購買は決まったものを買う仕事、調達は仕入先を探し・選び・評価し、価格交渉や契約管理までする広い仕事。記事の読み手が購買か調達かで書く中身を変えるとよい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業の購買部門の役割",
      "url": "https://crexgroup.com/ja/manufacturing/operation/manufacturing-purchasing-department/",
      "publisher": "CREX",
      "date": null
    }
  },
  {
    "id": "success-125",
    "kind": "success",
    "title": "動画は社内のカメラで自作した",
    "summary": "2022年版中小企業白書は、山口県の製造業が工場見学動画など300種類超のデジタルコンテンツを自作した例を紹介。製品紹介や機械の使い方を知りたい声が多く、手持ちのカメラと編集ソフトで始めた。",
    "industries": [
      "装置",
      "機械部品"
    ],
    "useFor": [
      "article_idea",
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "スマホで撮った加工動画、始めてみて分かったこと",
    "source": {
      "title": "2022年版中小企業白書 第2節 中小企業におけるデジタル化とデータ利活用",
      "url": "https://www.chusho.meti.go.jp/pamflet/hakusyo/2022/chusho/b2_3_2.html",
      "publisher": "中小企業庁",
      "date": "2022"
    }
  },
  {
    "id": "success-126",
    "kind": "success",
    "title": "HP刷新とSNSで採用の窓口を作る",
    "summary": "中小企業庁の人材活用事例集(2023年)では、ホームページを新しくし、Facebook・Instagram・YouTubeで自社の取り組みを発信して人材確保につなげた中小企業が紹介されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小企業・小規模事業者の人材活用事例集",
      "url": "https://www.chusho.meti.go.jp/keiei/koyou/hitodebusoku/guideline/jirei.pdf",
      "publisher": "中小企業庁",
      "date": "2023-06"
    }
  },
  {
    "id": "success-127",
    "kind": "success",
    "title": "町工場の日常をインスタで発信",
    "summary": "中小機構のITツール活用事例では、2015年にInstagramを始めた町工場が仕事ぶりを発信し、4,000人超のフォロワーを獲得。SNS経由の問い合わせから受注にもつながったという。",
    "industries": [
      "金属加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "工場のインスタを10年続けて来た仕事",
    "source": {
      "title": "SNSで情報発信の質を高め新規顧客を順調に獲得",
      "url": "https://ittools.smrj.go.jp/case/cp577f0000004ytp.html",
      "publisher": "中小機構 ITツール活用事例",
      "date": null
    }
  },
  {
    "id": "success-128",
    "kind": "success",
    "title": "新規向けの製作品をインスタに載せる",
    "summary": "金属加工の町工場が、新規取引先向けに作った製品をInstagramに載せ、広告費なしで約7,000フォロワーを得たと支援サービスの記事が紹介。SNSとHPで取引先が増えたとあるが第三者の検証はない。",
    "industries": [
      "金属加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "町工場アトツギが営業不在でも1年で4つの新規開拓成功の秘密とは？",
      "url": "https://anytive.com/magazine/case_soga/",
      "publisher": "anytive",
      "date": null
    }
  },
  {
    "id": "success-129",
    "kind": "success",
    "title": "完成品より「削っている途中」を見せる",
    "summary": "町工場の発信ノートでは、完成品の写真より加工中の写真や動画のほうが反応がよく、「この部品もできますか」と具体的な相談が来るようになったと書かれている(運営者の体験談)。",
    "industries": [
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "この形はどう削る？加工の途中をお見せします",
    "source": {
      "title": "町工場のインスタ活用術-何を載せればいいのか",
      "url": "https://note.com/monozukuribito/n/n6ce92d4e604f",
      "publisher": "FACTORY note(note)",
      "date": null
    }
  },
  {
    "id": "success-130",
    "kind": "success",
    "title": "動画は採用、記事は受注と役割分担",
    "summary": "支援会社の2026年の記事は、現場のショート動画で採用を強め、技術記事で受注を伸ばした製造業の例から「動画＝採用」「記事＝受注」の二本立てを勧めている。支援会社の整理で第三者検証はない。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "町工場が現場動画と技術記事で採用と受注を伸ばした事例",
      "url": "https://hasshin-lab.comtri.jp/manufacturing-owned-media-case/",
      "publisher": "発信ラボ(コムトリ)",
      "date": "2026-06"
    }
  },
  {
    "id": "success-131",
    "kind": "success",
    "title": "技術メディアで受注を伸ばすばね会社",
    "summary": "同じ記事では、ばねメーカーが技術メディア(記事)で受注を伸ばした例として紹介されている。設計者が困る点を記事にして、指名の相談を増やす型。",
    "industries": [
      "機械部品"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ばねの設計で困りやすい5つのこと",
    "source": {
      "title": "町工場が現場動画と技術記事で採用と受注を伸ばした事例",
      "url": "https://hasshin-lab.comtri.jp/manufacturing-owned-media-case/",
      "publisher": "発信ラボ(コムトリ)",
      "date": "2026-06"
    }
  },
  {
    "id": "success-132",
    "kind": "success",
    "title": "強みが需要と合って半年でHPから相談",
    "summary": "小さな町工場が自社サイトと製造実績集を整えたところ、約半年でホームページからの問い合わせが少しずつ入り始めた。特殊な加工という強みと需要が合ったのが要因とされる(支援者のコラム)。",
    "industries": [
      "金属加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "全国から注文が入るようになった小さな町工場の地道なマーケティング",
      "url": "https://mbp-japan.com/aichi/matsuo-tmp/column/5120884/",
      "publisher": "マイベストプロ愛知",
      "date": null
    }
  },
  {
    "id": "success-133",
    "kind": "success",
    "title": "実績集をそろえてから載せる",
    "summary": "上のコラムでは、サイトを作るだけでなく「製造実績集」を作って一緒に見せたことが、全国からの注文につながった土台とされている。",
    "industries": [
      "金属加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "これまでに作った部品を一覧にしました",
    "source": {
      "title": "全国から注文が入るようになった小さな町工場の地道なマーケティング",
      "url": "https://mbp-japan.com/aichi/matsuo-tmp/column/5120884/",
      "publisher": "マイベストプロ愛知",
      "date": null
    }
  },
  {
    "id": "success-134",
    "kind": "success",
    "title": "ネット経由の新規受注が累計2億円",
    "summary": "2015年に自社サイトを開いた小さな工場が、2025年時点でネット経由の新規受注が累計2億円を超えたと、運営者が個人ブログで報告している。個人の記録で一般化はできない。",
    "industries": [
      "金属加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "町工場がウェブサイトを作ったらネット経由の累計受注が2億円を超えた話",
      "url": "https://hiraokayusaku.com/web/12749",
      "publisher": "個人ブログ",
      "date": "2025"
    }
  },
  {
    "id": "success-135",
    "kind": "success",
    "title": "10年続けたサイトが受注の柱に",
    "summary": "上の例のように、Web受注は短期で大きく伸びるより、何年も更新を続けて積み上がる形が多い。記事の継続を経営者が理解しておくことが大切。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "町工場がウェブサイトを作ったらネット経由の累計受注が2億円を超えた話",
      "url": "https://hiraokayusaku.com/web/12749",
      "publisher": "個人ブログ",
      "date": "2025"
    }
  },
  {
    "id": "success-136",
    "kind": "success",
    "title": "25社でオンライン共同受注",
    "summary": "川崎市の町工場など25社が、オンラインの共同受注の仕組みを2022年に始めた。1社では受けにくい案件も、得意分野の違う工場が組んで受ける狙い。",
    "industries": [
      "金属加工",
      "切削加工",
      "板金"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "うちだけでできない仕事も、仲間と受けます",
    "source": {
      "title": "川崎の町工場など25社 共同受注基盤スタート",
      "url": "https://www.nikkei.com/article/DGKKZO59319660T20C22A3L82000/",
      "publisher": "日本経済新聞",
      "date": "2022-03"
    }
  },
  {
    "id": "success-137",
    "kind": "success",
    "title": "職人技でBtoCのおもちゃ・しおり",
    "summary": "ニュースイッチは、町工場が職人技を生かしておもちゃやしおりなど一般向け製品を出す動きを紹介。消費者向けの商品が技術を知ってもらう入口にもなる。",
    "industries": [
      "金属加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "おもちゃやしおり…町工場が職人技で仕掛けるBtoC",
      "url": "https://newswitch.jp/p/13927",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "success-138",
    "kind": "success",
    "title": "試作の展示会形式で町工場を見せる",
    "summary": "東京・大田区では町工場が試作品を並べて見せる「試作市場」が始まったとニュースイッチが報じた。試作で何ができるかを実物で示す場。",
    "industries": [
      "切削加工",
      "板金"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "町工場の街、東京・大田区で始まった「試作市場」って何？",
      "url": "https://newswitch.jp/p/8843",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "success-139",
    "kind": "success",
    "title": "クラファンでB2C製品の注目を集める",
    "summary": "ぬか漬け容器を作った町工場はMakuakeで注目を集めた。B2Cの売上は当初あまり期待しておらず、技術を世に知ってもらう狙いが大きかったとされる。",
    "industries": [
      "樹脂成形",
      "金属加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "なぜ部品屋がぬか漬け容器を作ったのか",
    "source": {
      "title": "B2C製品作りで“攻めの工場”へ（ぬか漬け容器の事例）",
      "url": "https://newswitch.jp/p/15005",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "success-140",
    "kind": "success",
    "title": "海外商談会で1社平均15件の商談",
    "summary": "NCネットワークによると、2025年5月のバンコクの商談会で出展企業1社あたり平均15件の商談があり、半数以上が有効な見込み案件だった。出展の約7割は中小の受託加工企業。",
    "industries": [
      "切削加工",
      "金属加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "NCネットワーク、タイとベトナムでビジネスマッチング機会の最大化",
      "url": "https://webtan.impress.co.jp/r/prtimes/items/000000033.000052731",
      "publisher": "Web担当者Forum(PR TIMES転載)",
      "date": "2025"
    }
  },
  {
    "id": "success-141",
    "kind": "success",
    "title": "ポータルの会員網で見学会を開く",
    "summary": "受発注ポータルを運営するNCネットワークは、約2万2千社の会員企業を背景に工場見学会を案内している。ポータル登録は見学会や商談会への入口にもなる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "NCネットワーク 工場見学会の案内",
      "url": "https://pc.watch.impress.co.jp/docs/release/atpress/1559690.html",
      "publisher": "PC Watch(@Press転載)",
      "date": "2024-01"
    }
  },
  {
    "id": "success-142",
    "kind": "success",
    "title": "発注案件メルマガで案件を拾う",
    "summary": "エミダスは製造業向けメルマガを週2回出し、月曜は発注案件の新着、木曜は挑戦する製造業の紹介を届けている。案件情報の受け取りと自社の露出の両面で使える。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "メールマガジン配信(広告メニュー)",
      "url": "https://service.nc-net.com/advertising/mailmagazine/",
      "publisher": "NCネットワーク",
      "date": null
    }
  },
  {
    "id": "success-143",
    "kind": "success",
    "title": "出会いの3割はネットから",
    "summary": "NCネットワークの2020年の会員アンケートでは、取引先と出会うきっかけは「展示会」と「インターネット関係」がそれぞれ約3割だった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小製造業受注予測、取引先開拓に課題感",
      "url": "https://www.atpress.ne.jp/news/230691",
      "publisher": "@Press(NCネットワーク)",
      "date": "2020"
    }
  },
  {
    "id": "success-144",
    "kind": "success",
    "title": "イプロス経由の引き合いが1割商談化",
    "summary": "イプロスの公開事例では、展示会が難しくなった時期に掲載を始めた会社が、メール配信で得た引き合いの10％以上を商談にし、9か月で受注に至った案件もあった。運営会社自身の事例紹介。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "引き合いの10％以上が商談化｜イプロス成功事例",
      "url": "https://marketing.ipros.jp/case/93/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-145",
    "kind": "success",
    "title": "新製品の発売時にポータル掲載",
    "summary": "イプロスの事例では、中小メーカーが主力になる治具の新発売と同じ頃に掲載を始め、知名度が上がり商談化率も高かったとしている。運営会社の事例で第三者検証はない。",
    "industries": [
      "治具"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小企業の知名度向上を強力にサポート｜イプロス成功事例",
      "url": "https://marketing.ipros.jp/case/101/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-146",
    "kind": "success",
    "title": "設計者向けハンドブックを無料で配る",
    "summary": "切削・研削の加工会社などが、加工の基礎やコストダウンのこつをまとめたハンドブックを無料ダウンロードで配っている。フォーム入力と引き換えにし、見込み客の連絡先を得る型が多い。",
    "industries": [
      "切削加工",
      "研削"
    ],
    "useFor": [
      "article_idea",
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "設計者向け「加工費を下げる図面の書き方」",
    "source": {
      "title": "技術資料ダウンロード（研削・切削加工センター.com）",
      "url": "https://machining-costdown-center.com/download",
      "publisher": "加工会社の技術サイト",
      "date": null
    }
  },
  {
    "id": "success-147",
    "kind": "success",
    "title": "見積もりのポイントも資料にする",
    "summary": "研削・切削の技術サイトでは、加工技術に加え「加工見積りのポイント」を扱った資料も配っている。発注者が見積もり前に知りたいことを先回りで渡す工夫。",
    "industries": [
      "切削加工",
      "研削"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "見積もりが早く返る図面・依頼の出し方",
    "source": {
      "title": "技術資料ダウンロード（研削・切削加工センター.com）",
      "url": "https://machining-costdown-center.com/download",
      "publisher": "加工会社の技術サイト",
      "date": null
    }
  },
  {
    "id": "success-148",
    "kind": "success",
    "title": "板金の図面ミス防止資料を配る",
    "summary": "板金会社がポータル上で、設計者向けに図面作成のポイントをまとめた資料を無料DLで公開している。図面の書き方で困る設計者との最初の接点になる。",
    "industries": [
      "板金"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "板金図面でよくある指示漏れ",
    "source": {
      "title": "無料DL 板金加工の設計ミスを防ぐ図面の工夫",
      "url": "https://ja.nc-net.or.jp/company/5681/product/detail/231572",
      "publisher": "エミダス(NCネットワーク)",
      "date": null
    }
  },
  {
    "id": "success-149",
    "kind": "success",
    "title": "プレスの基礎知識ハンドブック",
    "summary": "プレス加工の会社が技術サイトで、絞り・せん断の基礎や鏡面加工のコストダウン事例のハンドブックを配っている。基礎＋事例の組み合わせは設計者に読まれやすい。",
    "industries": [
      "プレス"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "金属塑性加工.com 技術資料ダウンロード",
      "url": "https://takahasi-k.jp/download",
      "publisher": "プレス加工会社の技術サイト",
      "date": null
    }
  },
  {
    "id": "success-150",
    "kind": "success",
    "title": "板金＋配線組立の設計注意点集",
    "summary": "精密板金と配線組立を手がける会社は、設計時の注意点と設計改善の事例をまとめた技術ハンドブックを無料で配り、問い合わせフォームと並べている。",
    "industries": [
      "板金",
      "組立"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "電気機器 冷却機器 技術ハンドブック",
      "url": "https://www.shimadaind.com/handbook/10191/",
      "publisher": "板金・組立会社の自社サイト",
      "date": null
    }
  },
  {
    "id": "success-151",
    "kind": "success",
    "title": "治具の技術資料を先着限定で配る",
    "summary": "治具の設計・製作会社が、治工具に特化した技術資料を「先着100名」と数を絞って配布している。限定にすることで申し込みを促す工夫。",
    "industries": [
      "治具"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "技術ハンドブック紹介",
      "url": "https://jig-order.com/request/",
      "publisher": "治具会社の技術サイト",
      "date": null
    }
  },
  {
    "id": "success-152",
    "kind": "success",
    "title": "加工の工程をシリーズ動画に",
    "summary": "板金会社が「精密板金・加工工程シリーズ」としてTIG溶接などの工程を回ごとに動画で公開している。シリーズにすると継続して見てもらいやすい。",
    "industries": [
      "板金",
      "溶接"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "TIG溶接の工程を動画で解説",
    "source": {
      "title": "YouTube動画「精密板金・加工工程シリーズ」第3弾公開",
      "url": "https://www.sanyu-ss.co.jp/youtube-tig-welding/",
      "publisher": "板金会社の自社サイト",
      "date": null
    }
  },
  {
    "id": "success-153",
    "kind": "success",
    "title": "YouTubeは技術者の解説で集客",
    "summary": "製造業向け支援会社は2026年10月、製品紹介だけで終わらず、技術者の解説や製品デモを問い合わせにつなげる「製造業のYouTube集客ガイド」を公開した。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業のYouTube集客ガイドを無料公開",
      "url": "https://prtimes.jp/main/html/rd/p/000000086.000186443.html",
      "publisher": "PR TIMES",
      "date": "2026-10"
    }
  },
  {
    "id": "success-154",
    "kind": "success",
    "title": "加工事例ページにフォームを埋め込む",
    "summary": "支援会社の事例では、加工事例を案件ごとにページにし、各ページに問い合わせフォームを入れたところ、6か月後に事例ページ経由で月10件以上の問い合わせが入った。第三者検証はない。",
    "industries": [
      "切削加工",
      "板金"
    ],
    "useFor": [
      "article_idea",
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "この加工事例と同じものを相談する",
    "source": {
      "title": "製造業のコンテンツSEOで問い合わせを増やした事例と成功のポイント",
      "url": "https://www.synergy-marketing.co.jp/blog/manufacturing_content-seo_inquiry",
      "publisher": "シナジーマーケティング",
      "date": null
    }
  },
  {
    "id": "success-155",
    "kind": "success",
    "title": "コラム開始半年で問い合わせ3倍",
    "summary": "同じ支援会社の別事例では、技術コラムを始めて約6か月で新規問い合わせが3倍になったとしている。支援会社の自社事例。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業のコンテンツSEOで問い合わせを増やした事例と成功のポイント",
      "url": "https://www.synergy-marketing.co.jp/blog/manufacturing_content-seo_inquiry",
      "publisher": "シナジーマーケティング",
      "date": null
    }
  },
  {
    "id": "success-156",
    "kind": "success",
    "title": "FAQは問い合わせ前の不安を消す",
    "summary": "製造業のSEO解説では、FAQは発注者の疑問や不安を先回りして解き、問い合わせのハードルを下げる役目があるとされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "初めて加工を頼む方からよくある質問10",
    "source": {
      "title": "製造業のSEO対策完全ガイド",
      "url": "https://promotioninhouse.com/blog/manufacturing/manufacturing-seo-complete-guide/",
      "publisher": "promotion in-house",
      "date": null
    }
  },
  {
    "id": "success-157",
    "kind": "success",
    "title": "購買担当の疑問をQ&Aで並べる",
    "summary": "購買担当が持ちやすい疑問をQ&A形式でまとめ、FAQの構造化データも付ける方法が紹介されている。効果は3〜6か月で見え始めるとの見方(支援会社)。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "製造業のWebサイト改善で問い合わせを増やす方法",
      "url": "https://blog.w-creative.tv/manufacturing-website-improvement-strategy-increase-inquiries/",
      "publisher": "w-creative",
      "date": null
    }
  },
  {
    "id": "success-158",
    "kind": "success",
    "title": "「簡単相談」でボタンの敷居を下げる",
    "summary": "問い合わせボタンを「加工技術の簡単相談」のようにやわらかい言葉にすると申し込みが増えやすい、と制作会社が指摘している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "製造業のホームページ制作で問い合わせを増やす方法",
      "url": "https://www.mercury-cafe.com/article/10016/",
      "publisher": "mercury-cafe",
      "date": null
    }
  },
  {
    "id": "success-159",
    "kind": "success",
    "title": "「検討段階でも構いません」と添える",
    "summary": "図面を添付できるフォームと「検討段階でも構いません」の一文で、送るのをためらう人が減る、と制作会社は提案している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "製造業・工場のホームページ制作事例3選",
      "url": "https://www.seikoprocess.co.jp/web/factory-website-cases/",
      "publisher": "セイコープロセス",
      "date": null
    }
  },
  {
    "id": "success-160",
    "kind": "success",
    "title": "ニッチな分野で最初に引用される",
    "summary": "AI検索対策の解説では、中小は大手と同じ土俵で争うより、狭い製品・加工分野でAIに最初に引用される立場を取るのが有効とされる(支援会社の見解)。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "◯◯材の△△加工なら、まずここを読んでください",
    "source": {
      "title": "製造業のAIO対策とは？AI検索時代に商品情報を「選ばれるデータ」に",
      "url": "https://das-solution.akagane.co.jp/media/useful-info/aio-seo/",
      "publisher": "赤金(DAS SOLUTION)",
      "date": null
    }
  },
  {
    "id": "success-161",
    "kind": "success",
    "title": "AIに聞かれる質問を絞って書く",
    "summary": "AIO対策の解説では、ランチェスター戦略のように、AIに投げられそうな質問を絞り込み、その答えを集中して用意する戦い方が紹介されている(支援会社)。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業のAIO・LLMO対策ガイド",
      "url": "https://mediareach.co.jp/blog/manufacturing-aio-llmo-guide",
      "publisher": "メディアリーチ",
      "date": null
    }
  },
  {
    "id": "success-162",
    "kind": "success",
    "title": "対応範囲・設備・認証を一覧に",
    "summary": "調達担当は「◯◯加工 メーカー 比較」「小ロット対応」とAIに聞く。対応範囲・設備・認証の一覧や工法の比較ページを用意すると引用されやすい、と支援会社は説明する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "うちで対応できる材料・サイズ・数量の一覧",
    "source": {
      "title": "BtoBメーカーのAIO対策｜調達担当のAI比較質問で技術情報が引用される設計",
      "url": "https://0120.co.jp/blog/aio-152/",
      "publisher": "課題解決プラットフォーム",
      "date": null
    }
  },
  {
    "id": "success-163",
    "kind": "success",
    "title": "専門用語の解説とFAQで引用を狙う",
    "summary": "AI検索に引用されない原因として、専門用語の解説やFAQの不足、製品名・社名の表記ゆれが挙げられている。まず自社の分野の用語でAIが何を引用しているかを確かめるとよい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "発注者がつまずく加工用語やさしく解説",
    "source": {
      "title": "製造業のLLMO対策｜メーカーがAI検索に選ばれる方法",
      "url": "https://ai-commerce.jp/blog/manufacturing-industry-llmo/",
      "publisher": "ai-commerce.jp",
      "date": null
    }
  },
  {
    "id": "success-164",
    "kind": "success",
    "title": "業界誌寄稿や技術資料で外から言及",
    "summary": "AI検索対策として、業界専門誌への寄稿、技術資料の公開、比較・検索サイトへの掲載など、自社サイトの外で名前が出る場を増やす施策が挙げられている(支援会社)。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業のAI検索対策｜業界専門誌寄稿・技術論文公開で引用獲得",
      "url": "https://mesut.co.jp/manufacturing-ai-search/",
      "publisher": "mesut",
      "date": null
    }
  },
  {
    "id": "success-165",
    "kind": "success",
    "title": "構造化データとページ速度も整える",
    "summary": "製造業のAIO解説では、構造化データ(Schema.org)の設定、HTMLの整理、表示速度の改善が技術面の対策として挙がっている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業のAIO対策とは",
      "url": "https://www.seizogyo.com/marke/aio/",
      "publisher": "seizogyo.com",
      "date": null
    }
  },
  {
    "id": "success-166",
    "kind": "success",
    "title": "AI時代は「HQコンテンツ」を柱に",
    "summary": "MONOistの連載は、AI検索の台頭を受け、AI引用を意識した要点と、業界の第一人者としての立場を作る質の高いコンテンツ戦略を解説している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "AI時代における製造業のコンテンツ戦略：間違いだらけの製造業デジタルマーケティング（28）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2506/12/news004.html",
      "publisher": "MONOist",
      "date": "2025-06"
    }
  },
  {
    "id": "success-167",
    "kind": "success",
    "title": "まずやることは解析と改善の基本",
    "summary": "MONOistの連載第20回は、B2B製造業サイトで最低限やるべき解析と改善の手法を解説。数字を見て直す習慣が先とされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "B2B製造業Webサイト、これだけやればまずはOK！解析／改善手法",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2411/06/news001_3.html",
      "publisher": "MONOist",
      "date": "2024-11"
    }
  },
  {
    "id": "success-168",
    "kind": "success",
    "title": "調査で見えた注力すべき施策",
    "summary": "MONOistの連載第17回は、調査結果から製造業が今力を入れるべきWebマーケティング施策を整理している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "調査結果から見えた、いま製造業が注力すべきWebマーケティング施策",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2407/03/news001_3.html",
      "publisher": "MONOist",
      "date": "2024-07"
    }
  },
  {
    "id": "success-169",
    "kind": "success",
    "title": "自社の特徴を言葉にしてから発信",
    "summary": "MONOistの連載では、自社の特徴を効果的に伝える「言語化」や、買い手の購買の流れを図にして施策を選ぶ方法も扱っている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "お客様がうちを選んだ理由を聞いてみた",
    "source": {
      "title": "間違いだらけの製造業デジタルマーケティング(連載一覧)",
      "url": "https://monoist.itmedia.co.jp/mn/series/33703/",
      "publisher": "MONOist",
      "date": null
    }
  },
  {
    "id": "success-170",
    "kind": "success",
    "title": "SNSで国内外のファンを作りBtoCへ",
    "summary": "東京商工会議所の好事例集では、墨田区のガラス製品の会社がSNSで国内外のファンを増やし、BtoB中心からBtoCへ広げた例が紹介されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "中小製造業の好事例集",
      "url": "https://www.tokyo-cci.or.jp/seisaku/committee/mono/smart/",
      "publisher": "東京商工会議所",
      "date": null
    }
  },
  {
    "id": "success-171",
    "kind": "success",
    "title": "営業せずWebとSNSで大手から受注",
    "summary": "東京商工会議所の好事例集には、営業活動をせずWebサイトとSNSの発信に注力して大手企業の受注につなげた例もある(卸売業の例)。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小製造業の好事例集",
      "url": "https://www.tokyo-cci.or.jp/seisaku/committee/mono/smart/",
      "publisher": "東京商工会議所",
      "date": null
    }
  },
  {
    "id": "success-172",
    "kind": "success",
    "title": "ファンを巻き込み商品開発とPR",
    "summary": "東京商工会議所のスマートものづくり実践事例集では、製本会社がSNSを応用してファンを巻き込んだ商品開発・PRを行い、海外展開も強めた例が載っている。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "「スマートものづくり実践事例集」をリニューアル",
      "url": "https://www.tokyo-cci.or.jp/page.jsp?id=1033495",
      "publisher": "東京商工会議所",
      "date": null
    }
  },
  {
    "id": "success-173",
    "kind": "success",
    "title": "発売日にプレスリリースを合わせる",
    "summary": "鉄製品の設計・製造会社は2020年、感染対策製品の発売日に合わせてプレスリリースを出し、複数の大手メディアに載った(支援会社の事例紹介)。",
    "industries": [
      "金属加工",
      "製缶"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "新製品を出すとき、うちがやったこと",
    "source": {
      "title": "中小企業のプレスリリース活用事例5選",
      "url": "https://www.sunloft.co.jp/dx/blog/press-release/",
      "publisher": "サンロフト",
      "date": null
    }
  },
  {
    "id": "success-174",
    "kind": "success",
    "title": "複数社まとめてなら記事に載りやすい",
    "summary": "PR TIMESの寄稿記事は、1社では取り上げられにくい中小企業でも、複数社が並ぶ事例として掲載実績を積める可能性があると述べ、配信後の活用も重視している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小企業こそ戦略的なプレスリリース配信を",
      "url": "https://prtimes.com/magazine/contribution-2403/",
      "publisher": "PR TIMES MAGAZINE",
      "date": "2024-03"
    }
  },
  {
    "id": "success-175",
    "kind": "success",
    "title": "英語サイト化は公的支援も使える",
    "summary": "中小機構の海外展開支援には、海外戦略づくりや販路開拓に加え、Webサイトの外国語化や英文ホームページ翻訳の支援も含まれている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "海外展開事例",
      "url": "https://www.smrj.go.jp/sme/overseas/case/index.html",
      "publisher": "中小機構",
      "date": null
    }
  },
  {
    "id": "success-176",
    "kind": "success",
    "title": "公的なオンラインカタログに載せる",
    "summary": "2024年版中小企業白書は、JETROの海外バイヤー向けオンラインカタログに登録した企業が、商談会で商社との商談を成功させた例を紹介している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "2024年版中小企業白書 第8節 海外展開",
      "url": "https://www.chusho.meti.go.jp/pamflet/hakusyo/2024/chusho/b1_3_8.html",
      "publisher": "中小企業庁",
      "date": "2024"
    }
  },
  {
    "id": "success-177",
    "kind": "success",
    "title": "海外の要望に合わせ提案を変える",
    "summary": "JETROの新輸出大国コンソーシアムの事例では、海外市場のニーズを深く調べ、提案する商品や条件を柔軟に変えて引き合いの数と規模を広げた会社がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "新輸出大国コンソーシアムのご利用",
      "url": "https://www.jetro.go.jp/case_study/service/conso.html",
      "publisher": "JETRO",
      "date": null
    }
  },
  {
    "id": "success-178",
    "kind": "success",
    "title": "ウェビナーは月1回の定期開催で",
    "summary": "製造業ウェビナーの事例解説では、単発でなく月1〜2回の定期開催で積み上げる会社が成果を出しているとされる。支援会社の整理で数値は参考値。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業ウェビナーの成功事例5選",
      "url": "https://crexgroup.com/ja/manufacturing/sales/manufacturing-webinar-success-tips/",
      "publisher": "CREX",
      "date": null
    }
  },
  {
    "id": "success-179",
    "kind": "success",
    "title": "技術勉強会をオンラインで毎月",
    "summary": "従業員100人以下の樹脂成形メーカーが見込み客向けにオンライン技術勉強会を月1回開き、商談化率28%になったと支援会社が紹介。第三者の検証はない。",
    "industries": [
      "樹脂成形"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "成形不良の原因、オンラインで解説します",
    "source": {
      "title": "製造業ウェビナーの成功事例5選",
      "url": "https://crexgroup.com/ja/manufacturing/sales/manufacturing-webinar-success-tips/",
      "publisher": "CREX",
      "date": null
    }
  },
  {
    "id": "success-180",
    "kind": "success",
    "title": "セミナーは業界の課題をテーマに",
    "summary": "自社の製品紹介だけでは人が集まりにくく、業界の課題や技術の動きをテーマにしたほうが集客しやすい、と製造業向け支援会社は説明している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業でも有効！自社でウェビナーを開催するメリット",
      "url": "https://marketing.techport.co.jp/archives/26721/",
      "publisher": "テクノポート",
      "date": null
    }
  },
  {
    "id": "success-181",
    "kind": "success",
    "title": "Web発注の見積もり作業を自動化",
    "summary": "取引先のWeb発注システムから見積依頼を取り出し、過去の受注データで見積もりを作る作業を無料RPAで自動化し、月約40時間減らした町工場の例(ツール提供会社の事例)。",
    "industries": [
      "金属加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "見積業務を自動化し、月40時間の工数削減を実現した町工場DX",
      "url": "https://www.macroman.jp/case/suzuki-tekko",
      "publisher": "マクロマン(RPA提供会社)",
      "date": null
    }
  },
  {
    "id": "success-182",
    "kind": "success",
    "title": "図面をアップすると見積もりが出る",
    "summary": "3D CADや2D図面をアップするだけで見積もりが出て、1個の試作から発注・進捗管理までWebで完結するサービスがある。発注者はこうした手軽さに慣れ始めている。",
    "industries": [
      "切削加工",
      "板金",
      "3Dプリンタ"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "即時見積 - Kabuku Connect",
      "url": "https://www.kabuku.io/quote/",
      "publisher": "カブク",
      "date": null
    }
  },
  {
    "id": "success-183",
    "kind": "success",
    "title": "大手は技術資料PDFで会員登録",
    "summary": "大手計測機器メーカーは分野ごとに多数の技術解説サイトを持ち、ほぼ全記事に技術資料PDFを置いて会員登録につなげている。規模は違うが、記事＋資料の型は中小にも応用できる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "BtoBオウンドメディア成功事例10選",
      "url": "https://start-link.jp/hubspot-ai/btob-marketing/content-marketing-seo/btob-owned-media-success-cases",
      "publisher": "START LINK",
      "date": null
    }
  },
  {
    "id": "success-184",
    "kind": "success",
    "title": "業界別ページから資料DLへ",
    "summary": "技術系企業が業界別の説明ページを6本作り、資料ダウンロードにつなげて2か月で46件の見込み客を得た例がある(支援会社の事例で第三者検証はない)。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "自動車向け・医療向け、業界ごとの対応例",
    "source": {
      "title": "BtoB製造業のデジタルマーケティング成功事例15選",
      "url": "https://www.intrix.co.jp/btob-marketing-columns/digital-marketing-success-cases/",
      "publisher": "イントリックス",
      "date": null
    }
  },
  {
    "id": "success-185",
    "kind": "success",
    "title": "10人の町工場もサイトで勝負",
    "summary": "制作会社の成功事例集では、従業員10人ほどのばね製造の町工場のサイトが、町工場の成功例として取り上げられている。",
    "industries": [
      "機械部品"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業のホームページ成功事例10選【町工場別】",
      "url": "https://www.webdeki.com/column/4638/",
      "publisher": "webdeki",
      "date": null
    }
  },
  {
    "id": "pain-160",
    "kind": "pain",
    "title": "リニューアルで集客ページを消した",
    "summary": "MONOistの連載は、サイトのリニューアルで検索から人を集めていたページを安易に削ると、問い合わせが減って失敗しやすいと指摘している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "Webリニューアルが逆効果に？ 問い合わせを減らさない製造業のサイト改革",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2306/13/news001.html",
      "publisher": "MONOist",
      "date": "2023-06"
    }
  },
  {
    "id": "pain-161",
    "kind": "pain",
    "title": "見た目は良いのに問い合わせゼロ",
    "summary": "デザインを洗練させて文字を薄くしたりメニューを隠したりした結果、必要な情報にたどり着けず、問い合わせが減った製造業のリニューアル例が指摘されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "「見た目は良くなったのに、問い合わせゼロ」製造業のHPリニューアル",
      "url": "https://note.com/and_y_concept/n/n47dcd85b5e91",
      "publisher": "&Y CONCEPT(note)",
      "date": null
    }
  },
  {
    "id": "pain-162",
    "kind": "pain",
    "title": "精度や実績が書かれていない",
    "summary": "製造業サイトでは、加工精度・取引実績・技術の強みが書かれておらず、担当者が「ここに問い合わせていいか」判断できないことが、問い合わせが来ない原因に挙がる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "ホームページを作ったのに問い合わせが来ない理由と改善の考え方",
      "url": "https://peas-project.com/blog/homepage-no-inquiry-reason/",
      "publisher": "Peas Project",
      "date": null
    }
  },
  {
    "id": "pain-163",
    "kind": "pain",
    "title": "AIに聞いても自社が出てこない",
    "summary": "「ChatGPTで『◯◯加工 メーカー』と聞いても自社が出てこない」「技術情報を載せているのに問い合わせが来ない」という製造業の声が紹介されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "製造業のLLMO対策｜AIが調達担当に推すサプライヤーの6条件",
      "url": "https://jinrai.co.jp/blog/2026/05/27/manufacturing-llmo-ai-suppliers/",
      "publisher": "迅雷",
      "date": "2026-05"
    }
  },
  {
    "id": "pain-164",
    "kind": "pain",
    "title": "写真に図面や書類が写り込む",
    "summary": "SNSに上げた写真に企業名入りの書類が写り込み、過去の投稿にも機密が写っていた例がある。「この線より奥は撮らない」など撮影ルールと投稿前の確認が要る。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "SNSによる企業の情報漏洩を防ぐには？",
      "url": "https://www.skyseaclientview.net/media/article/3162/",
      "publisher": "SKYSEA Client View",
      "date": null
    }
  },
  {
    "id": "pain-165",
    "kind": "pain",
    "title": "作業動画が安全違反で炎上の恐れ",
    "summary": "職人の心意気として見せた作業風景が、保護具なしなど安全衛生の面で問題視され炎上するおそれがある、と製造業のSNSガイドラインの解説は注意している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業が策定すべきソーシャルメディアガイドライン",
      "url": "https://marketing.techport.co.jp/archives/29514/",
      "publisher": "テクノポート",
      "date": null
    }
  },
  {
    "id": "pain-166",
    "kind": "pain",
    "title": "担当1人で投稿を決めてしまう",
    "summary": "製造業のSNSでは図面・製品写真・取引先情報が特に危ない。担当者1人で判断せず、上長か現場責任者が画像を確認してから上げる体制が勧められている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "製造業のSNSは何から始めればいい？無理なくできる運用方法",
      "url": "https://cyber-intelligence.co.jp/marketing/post-35185/",
      "publisher": "サイバーインテリジェンス",
      "date": null
    }
  },
  {
    "id": "pain-167",
    "kind": "pain",
    "title": "クラファンは手間も情報公開も重い",
    "summary": "2012年のMONOist記事は、クラウドファンディングは社長や担当者の時間をかなり取り、仕様も先に公開するため機密性の高い製品には向かないと注意。特許出願は事前に。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "町工場発! 面白ガジェットとクラウドファンディング",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1207/20/news006_2.html",
      "publisher": "MONOist",
      "date": "2012-07"
    }
  },
  {
    "id": "pain-168",
    "kind": "pain",
    "title": "図面の自動読み取りは精度が出ない",
    "summary": "中小製造業の見積もり自動化を試した技術記事では、図面のOCR解析は精度が出ず苦戦したと報告。人の確認を残す半自動が現実的とされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中小製造業の自動化が見積り・図面で止まる構造的理由",
      "url": "https://qiita.com/5_years_apart/items/bab2015911f0ce12bbad",
      "publisher": "Qiita",
      "date": null
    }
  },
  {
    "id": "pain-169",
    "kind": "pain",
    "title": "やらなくていい施策まで手を出す",
    "summary": "中小製造業の支援者は、人手の少ない会社ほど施策を広げすぎず、まず「やらなくていいこと」を整理するよう勧めている。メルマガも売り込みでなく信頼づくりとして使う。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "中小製造業のマーケティング施策、まず“やらなくていいこと”を整理しよう",
      "url": "https://www.mp-strategy.com/2026/01/06/marketing/",
      "publisher": "MP-Strategy",
      "date": "2026-01"
    }
  },
  {
    "id": "buyer-111",
    "kind": "buyer",
    "title": "買い手の58%がChatGPTを使う",
    "summary": "HubSpot Japanの2026年調査で、BtoBの買い手のChatGPT利用(頻繁＋ときどき)は58.0%。売り手と接する時点で63.5%が複数の候補を挙げ終えていた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "日本のBtoB購買に関する意識・実態調査2026",
      "url": "https://www.hubspot.jp/company-news/state-of-buyer-2026",
      "publisher": "HubSpot Japan",
      "date": "2026"
    }
  },
  {
    "id": "buyer-112",
    "kind": "buyer",
    "title": "AIの情報は自分で確かめて使う",
    "summary": "同じ調査では、AI検索の情報への信頼度は10項目中最下位で、48.3%が自分で事実確認や加筆をしてから使っている。根拠のある公式情報が確認先になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "日本のBtoB購買に関する意識・実態調査2026",
      "url": "https://www.hubspot.jp/company-news/state-of-buyer-2026",
      "publisher": "HubSpot Japan",
      "date": "2026"
    }
  },
  {
    "id": "buyer-113",
    "kind": "buyer",
    "title": "発注担当の75%がAI検索を経験",
    "summary": "Piftee社の2026年調査(196人)では、発注先選びで生成AI検索を使った人は75%、製造業・メーカーでは78.4%(37人)。ただし最初の一手はGoogle検索が48%で最多。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "BtoB発注先選定におけるAI検索活用の実態調査2026",
      "url": "https://piftee.co.jp/blog/research-2",
      "publisher": "Piftee",
      "date": "2026"
    }
  },
  {
    "id": "buyer-114",
    "kind": "buyer",
    "title": "AIで知った会社に2割が発注",
    "summary": "同じ調査で、AI検索の利用者の82%が知らなかった会社を見つけ、うち21%が実際に発注・契約した。98%が裏取りをし、最も多いのは公式サイトの確認だった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "AIで当社を知った方へ、確認してほしいこと",
    "source": {
      "title": "BtoB発注先選定におけるAI検索活用の実態調査2026",
      "url": "https://piftee.co.jp/blog/research-2",
      "publisher": "Piftee",
      "date": "2026"
    }
  },
  {
    "id": "buyer-115",
    "kind": "buyer",
    "title": "図面を上げて10分で見積もり",
    "summary": "ミスミのマーケットプレイスは図面データを上げると条件に合う製造パートナーとつなぎ、最短10分で見積もりが取れるとうたう。設計者は速い見積もりに慣れてきている。",
    "industries": [
      "切削加工",
      "板金"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "メビーマーケットプレイス",
      "url": "https://marketplace.meviy.misumi-ec.com/ja-jp/",
      "publisher": "ミスミ",
      "date": null
    }
  },
  {
    "id": "trend-209",
    "kind": "trend",
    "official": false,
    "title": "AI検索対策に大手も参入",
    "summary": "大手印刷会社や新聞社もAI検索対策(GEO・AIO)のサービスを始めており、中小企業にも対策が必要かが話題になっていると、中小製造業の支援者が書いている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "「AI検索対策」は中小企業にも必要？",
      "url": "https://note.com/sandbox_dgn/n/n26a2d62aadf9",
      "publisher": "note(中小製造業DX支援者)",
      "date": null
    }
  },
  {
    "id": "trend-210",
    "kind": "trend",
    "official": true,
    "title": "中小向けにEC活用事例を公開",
    "summary": "中小機構はEC活用支援事例集で、商品を自社サイトやモールで売る中小企業の取り組みを紹介している。自社ECを考える町工場の参考になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "EC活用支援事例集",
      "url": "https://ec.smrj.go.jp/case/index.html",
      "publisher": "中小機構",
      "date": null
    }
  },
  {
    "id": "trend-211",
    "kind": "trend",
    "official": true,
    "title": "IT化の悩みは無料のオンライン相談",
    "summary": "中小機構のIT経営サポートセンターは、IT化の悩みをオンライン面談で無料相談できる窓口。ホームページや問い合わせ対応の見直しも相談できる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "IT経営サポートセンター",
      "url": "https://it-sodan.smrj.go.jp/index.html",
      "publisher": "中小機構",
      "date": null
    }
  },
  {
    "id": "trend-212",
    "kind": "trend",
    "official": true,
    "title": "補助金のITツール活用事例も公開",
    "summary": "中小機構はデジタル化・AI導入補助金の活用事例を公開し、製造業の事例も載せている。業種やテーマで絞って探せる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "ITツール活用事例",
      "url": "https://it-shien.smrj.go.jp/applicant/example/",
      "publisher": "中小機構",
      "date": null
    }
  },
  {
    "id": "buyer-116",
    "kind": "buyer",
    "title": "大型購買の9割超が選定で生成AIを使う",
    "summary": "IDEATECHが2026年、500万円以上のBtoB IT購買に関わった502人に聞くと、選定に生成AIを「多くの工程で」45.0%、「一部で」26.7%が使っていた。IT商材の調査だが傾向の参考に。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "BtoBの大型IT購買、9割超が選定に生成AIを利用【IDEATECH調査】",
      "url": "https://manamina.valuesccg.com/articles/5320",
      "publisher": "マナミナ（ヴァリューズ）",
      "date": "2026"
    }
  },
  {
    "id": "buyer-117",
    "kind": "buyer",
    "title": "比較表は生成AIで作る人が半数超",
    "summary": "同じIDEATECH調査（2026年）で、候補の比較表を生成AIで作った人は53.8%。比較される前提で、仕様・対応範囲・条件を表にしやすい形で書いておくと拾われやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "他社と比べやすい当社の仕様と対応範囲一覧",
    "source": {
      "title": "BtoBの大型IT購買、9割超が選定に生成AIを利用【IDEATECH調査】",
      "url": "https://manamina.valuesccg.com/articles/5320",
      "publisher": "マナミナ（ヴァリューズ）",
      "date": "2026"
    }
  },
  {
    "id": "buyer-118",
    "kind": "buyer",
    "title": "課題整理の入口は検索よりAI",
    "summary": "IDEATECH調査（2026年）では、課題を整理する段階の主な接点は「生成AI・AI検索」36.5%で、「検索エンジン」24.9%を上回った。悩みを言葉にする記事が入口になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "BtoBの大型IT購買、9割超が選定に生成AIを利用【IDEATECH調査】",
      "url": "https://manamina.valuesccg.com/articles/5320",
      "publisher": "マナミナ（ヴァリューズ）",
      "date": "2026"
    }
  },
  {
    "id": "buyer-119",
    "kind": "buyer",
    "title": "深く比べる段階では公式サイトが最多",
    "summary": "IDEATECH調査（2026年）では、候補を深く比べる段階の接点は「ベンダーの公式サイト」が22.1%で最多。AIで候補に入ったあと、最後に自社サイトで確かめられている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "BtoBの大型IT購買、9割超が選定に生成AIを利用【IDEATECH調査】",
      "url": "https://manamina.valuesccg.com/articles/5320",
      "publisher": "マナミナ（ヴァリューズ）",
      "date": "2026"
    }
  },
  {
    "id": "buyer-120",
    "kind": "buyer",
    "title": "候補でも8割超はフォームを送らない",
    "summary": "IDEATECHの発表（2026年）では、候補に挙がった会社でも84.7%はフォームに入力せずに情報集めを続けていた。問い合わせ前に答えが分かるページが比較を左右する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "問い合わせ前に分かること一覧（費用・納期・ロット）",
    "source": {
      "title": "【生成AI時代のBtoBバイヤー購買行動調査】BtoB大型購買の9割超が選定に生成AI",
      "url": "https://www.zaikei.co.jp/releases/3635171/",
      "publisher": "財経新聞（IDEATECHプレスリリース）",
      "date": "2026"
    }
  },
  {
    "id": "buyer-121",
    "kind": "buyer",
    "title": "買い手の動きは5段階で整理される",
    "summary": "IDEATECHらは延べ1,139人の調査をもとに、AI時代のBtoB購買の流れを5段階の地図にまとめ2026年10月に公開した。段階ごとに読む情報が違う前提で記事を分けるとよい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "AI時代のBtoBバイヤージャーニーマップ",
      "url": "https://ideatech.jp/research/btob-buyer-journey/",
      "publisher": "IDEATECH",
      "date": "2026-10"
    }
  },
  {
    "id": "buyer-122",
    "kind": "buyer",
    "title": "企業サイトは「一般論ばかり」と約8割",
    "summary": "IDEATECHが2026年に購買担当105人に聞くと、約8割が企業サイトはどこも一般論しか書いていないと感じていた。教科書的な説明だけの記事は差がつかない。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "AI時代のBtoB購買「情報接触」実態",
      "url": "https://prtimes.jp/main/html/rd/p/000000656.000045863.html",
      "publisher": "IDEATECH（PR TIMES）",
      "date": "2026-06"
    }
  },
  {
    "id": "buyer-123",
    "kind": "buyer",
    "title": "問い合わせの決め手はデメリットも書く誠実さ",
    "summary": "同調査（IDEATECH、2026年）で、問い合わせ先を決める一番の理由は「デメリットやリスクも公開する誠実さ」57.1%。できないこと・向かない案件を書くと信頼につながる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "当社に向かない加工・お断りしている案件",
    "source": {
      "title": "AI時代のBtoB購買「情報接触」実態",
      "url": "https://prtimes.jp/main/html/rd/p/000000656.000045863.html",
      "publisher": "IDEATECH（PR TIMES）",
      "date": "2026-06"
    }
  },
  {
    "id": "buyer-124",
    "kind": "buyer",
    "title": "サイトに求めるのは生々しい事例と現場の知恵",
    "summary": "同調査（IDEATECH、2026年）では、AI検索の普及後に企業サイトへ求める価値の最多が「AIには書けない生々しい事例や現場のノウハウ」で過半数。失敗と対策の話が強い。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "試作で失敗した部品と、直し方の記録",
    "source": {
      "title": "AI時代のBtoB購買「情報接触」実態",
      "url": "https://prtimes.jp/main/html/rd/p/000000656.000045863.html",
      "publisher": "IDEATECH（PR TIMES）",
      "date": "2026-06"
    }
  },
  {
    "id": "buyer-125",
    "kind": "buyer",
    "title": "サイトを読まずAIに要約させる人も",
    "summary": "同調査（IDEATECH、2026年）で、企業サイトを直接読まず生成AIで要約することが「ほぼ毎回」18.1%、「たまに」44.8%。要点を冒頭に置き、要約されても伝わる形に。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "AI時代のBtoB購買「情報接触」実態",
      "url": "https://prtimes.jp/main/html/rd/p/000000656.000045863.html",
      "publisher": "IDEATECH（PR TIMES）",
      "date": "2026-06"
    }
  },
  {
    "id": "buyer-126",
    "kind": "buyer",
    "title": "大型購買の検討は3〜5か月が最多",
    "summary": "IDEATECHが300万円以上の商材の検討者307人に聞いた調査（2026年）では、検討期間は3〜5か月が最多で、6か月以上も41.4%。すぐ返事がなくても読まれ続ける記事が要る。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "BtoB購買は“営業接触前から始まっている”? 300万円以上の大型商材の検討プロセスの実態",
      "url": "https://webtan.impress.co.jp/n/2026/04/23/52528",
      "publisher": "Web担当者Forum",
      "date": "2026-04"
    }
  },
  {
    "id": "buyer-127",
    "kind": "buyer",
    "title": "商品以外の情報提供で選定が変わる",
    "summary": "IDEATECHの調査では、大型購買で83.1%が商材以外の情報提供を「重要」と答え、69.5%が「それがなければ選定結果は変わった」と回答。業界の知識を渡す記事は営業の代わりになる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "大型商品購買で選ばれる営業の条件とは？",
      "url": "https://prtimes.jp/main/html/rd/p/000000444.000045863.html",
      "publisher": "IDEATECH（PR TIMES）",
      "date": null
    }
  },
  {
    "id": "buyer-128",
    "kind": "buyer",
    "title": "製造業の購買の27%がAIで外注先探し",
    "summary": "テクノポートが2026年に製造業317人に聞くと、生成AIの用途に「サプライヤー・外注先・代替部材の探索」27.1%、「候補の比較検討」26.5%が入った。AIが最初のふるい分けをする。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "製造業の購買活動における生成AI活用の実態調査【2026年版】",
      "url": "https://prtimes.jp/main/html/rd/p/000000062.000055603.html",
      "publisher": "テクノポート（PR TIMES）",
      "date": "2026-03"
    }
  },
  {
    "id": "trend-213",
    "kind": "trend",
    "official": false,
    "title": "AIに推される会社の5つの柱",
    "summary": "仁頼の解説（2026年5月）は、製造業がAIに推される条件として、構造化データ、技術仕様の整理、実績の一次データ化、規格対応の明示、独自ノウハウの発信を挙げる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "当社の対応規格と実績を一覧で公開",
    "source": {
      "title": "製造業のLLMO対策【完全ガイド】AIが調達担当に推すサプライヤーの6条件",
      "url": "https://jinrai.co.jp/blog/2026/05/27/manufacturing-llmo-ai-suppliers/",
      "publisher": "仁頼（GEO Hack）",
      "date": "2026-05"
    }
  },
  {
    "id": "trend-214",
    "kind": "trend",
    "official": false,
    "title": "FAQの構造化データは効果が下がった",
    "summary": "仁頼の記事の追記（2026年）によると、Googleは2026年5月7日にFAQリッチリザルトの表示を終えた。FAQの書き方より、質問と答えの中身そのものに力を入れたい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業のLLMO対策【完全ガイド】AIが調達担当に推すサプライヤーの6条件",
      "url": "https://jinrai.co.jp/blog/2026/05/27/manufacturing-llmo-ai-suppliers/",
      "publisher": "仁頼（GEO Hack）",
      "date": "2026-05"
    }
  },
  {
    "id": "buyer-129",
    "kind": "buyer",
    "title": "設計者向けにはSNSよりSEO",
    "summary": "MONOistの連載（2024年）は、設計者はSNSにあまり関心がない可能性があり、SNSよりSEOに力を入れた方が効果は高そうだとまとめている。技術者を狙うなら検索で読まれる記事を優先。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "「サプライヤーの探し方と選定基準」の本音（4/4）",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2404/19/news005_4.html",
      "publisher": "MONOist",
      "date": "2024-04"
    }
  },
  {
    "id": "buyer-130",
    "kind": "buyer",
    "title": "外注先は財務・信用・管理力で診られる",
    "summary": "MONOistの解説（2024年）では、外注先を比べる項目に資本金・借入金・売上などの財務、取引先からの信用、工程管理と品質管理の水準、立地による輸送費が挙がる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "取引前に聞かれる会社の基本情報まとめ",
    "source": {
      "title": "外注先の診断と評価を通して「真のアライアンスパートナー」を発掘する",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2404/11/news019.html",
      "publisher": "MONOist",
      "date": "2024-04"
    }
  },
  {
    "id": "buyer-131",
    "kind": "buyer",
    "title": "共に利益を得る姿勢も見られる",
    "summary": "MONOistの解説（2024年）は、外注先選びでは協業で互いに利益を得ようとする姿勢を重く見るべきだとする。価格だけでなく改善提案や相談への向き合い方が評価になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "外注先の診断と評価を通して「真のアライアンスパートナー」を発掘する",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2404/11/news019.html",
      "publisher": "MONOist",
      "date": "2024-04"
    }
  },
  {
    "id": "buyer-132",
    "kind": "buyer",
    "title": "外注するかは負荷工数で決める",
    "summary": "MONOistの解説（2024年）では、発注側は負荷工数を出して人員の過不足を確かめ、足りない分や自社でできない特殊加工を外に出すと判断する。繁忙期の受け皿は需要になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "繁忙期の外注先としての使い方",
    "source": {
      "title": "外注先の診断と評価を通して「真のアライアンスパートナー」を発掘する（2/3）",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2404/11/news019_2.html",
      "publisher": "MONOist",
      "date": "2024-04"
    }
  },
  {
    "id": "buyer-133",
    "kind": "buyer",
    "title": "見積が1日遅れるだけで失注も",
    "summary": "都度見積が要る金属加工はほぼ全件が相見積もりになり、見積が1日遅れるだけで失注する、とクラウドツール会社の発表は指摘する（売り手側の主張）。回答の目安日数を書くと安心材料に。",
    "industries": [
      "金属加工",
      "切削加工",
      "板金"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "articleIdea": "見積の返事は何日で届く？",
    "source": {
      "title": "見積が1日遅れるだけで失注（クラウドツールのプレスリリース）",
      "url": "https://prtimes.jp/main/html/rd/p/000000386.000042366.html",
      "publisher": "PR TIMES",
      "date": null
    }
  },
  {
    "id": "buyer-134",
    "kind": "buyer",
    "title": "買い手の不満は価格より遅さ",
    "summary": "Tactonの記事が紹介するマッキンゼー調査（B2B意思決定者1,000人）では、仕入先とのやり取りの遅さが最大の不満で、価格の約2倍挙がった。対応の早さは選ばれる理由になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "Why quoting speed matters",
      "url": "https://tacton.com/cpq-blog/why-quoting-speed-matters",
      "publisher": "Tacton",
      "date": null
    }
  },
  {
    "id": "buyer-135",
    "kind": "buyer",
    "title": "受注・失注は見積書の履歴で分かる",
    "summary": "三菱UFJリサーチ&コンサルティングのレポートは、出した見積書の履歴をたどり、受注・失注までの過程を分析する方法を紹介する。どんな依頼が決まりやすいかを記事に生かせる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業の見積業務の分析（レポート）",
      "url": "https://www.murc.jp/wp-content/uploads/2013/05/cr_110111.pdf",
      "publisher": "三菱UFJリサーチ&コンサルティング",
      "date": "2013"
    }
  },
  {
    "id": "buyer-136",
    "kind": "buyer",
    "title": "相見積もりは3社・同じ条件で",
    "summary": "相見積もりの解説（2026年）は、3社を目安に、依頼内容・納期・範囲を同じにして頼むのが基本とする。条件が違うと金額だけ比べても意味がない。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "相見積もりの依頼文に入れる5項目",
    "source": {
      "title": "相見積もりの取り方と比較のコツ",
      "url": "https://atsoho.com/blog/how-to-get-quotes",
      "publisher": "atsoho",
      "date": "2026"
    }
  },
  {
    "id": "question-254",
    "kind": "question",
    "title": "相見積もりだと嫌がられる？",
    "summary": "3社ほどから見積を取るのは普通の進め方とされる（相見積もり解説、2026年）。答えでは「相見積もりでも歓迎」「条件をそろえてもらうと正確に出せる」と伝えると依頼しやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "相見積もりでも気軽にご相談ください",
    "source": {
      "title": "相見積もりの取り方と比較のコツ",
      "url": "https://atsoho.com/blog/how-to-get-quotes",
      "publisher": "atsoho",
      "date": "2026"
    }
  },
  {
    "id": "buyer-137",
    "kind": "buyer",
    "title": "金額のほか範囲・納期・連絡の速さを比べる",
    "summary": "相見積もりのマナー解説（2026年）は、金額だけでなく業務範囲・納期・連絡の速さを横並びで比べるよう勧める。見積書に含む工程と含まない工程を明記すると比べられやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "見積書に含まれる工程・含まれない工程",
    "source": {
      "title": "相見積もりの取り方とマナー",
      "url": "https://atsoho.com/blog/aimitsumori-manner",
      "publisher": "atsoho",
      "date": "2026"
    }
  },
  {
    "id": "buyer-138",
    "kind": "buyer",
    "title": "選定基準は発注前に点数化する",
    "summary": "外注先選定の解説（2026年）は、基準は発注前に決め、実績・単価・相性を点数にして比べると選びやすいとする。点数の付け方に合わせて実績や対応を見せるとよい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "発注先の選定基準の決め方|実績・単価・相性を点数化して外注先を選ぶ",
      "url": "https://atsoho.com/blog/contractor-selection-criteria",
      "publisher": "atsoho",
      "date": "2026"
    }
  },
  {
    "id": "buyer-139",
    "kind": "buyer",
    "title": "金額によって3社以上を必須にする会社",
    "summary": "人事用語集の解説では、一定の金額を超えると3社以上の見積を社内ルールで必須にする例が紹介される。買い手は相見積もりを避けられないことも多い。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "相見積もりとは",
      "url": "https://www.kaonavi.jp/dictionary/aimitsumori/",
      "publisher": "カオナビ人事用語集",
      "date": null
    }
  },
  {
    "id": "buyer-140",
    "kind": "buyer",
    "title": "極端に安い見積は理由を確かめる",
    "summary": "相見積もりのチェック項目として、内訳が明確か、作業範囲がそろっているか、納期・保証・実績を見ること、極端に安い場合は理由を確かめることが挙がる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "articleIdea": "安い見積で後から困る3つのパターン",
    "source": {
      "title": "相見積もりのチェックポイント",
      "url": "https://www.onamae.com/business/article/305549/",
      "publisher": "お名前.com ビジネス",
      "date": null
    }
  },
  {
    "id": "buyer-141",
    "kind": "buyer",
    "title": "大学の研究者は直接発注できないことが多い",
    "summary": "國學院大學の資料（2017年）では、研究者は業者へ直接発注できず、事務が原則2社以上から見積を取り、最も安い業者へ発注する流れ。研究室の先生だけで決まらない。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "大学・研究室からのご注文の流れ",
    "source": {
      "title": "研究費による物品購入の流れ",
      "url": "https://www.kokugakuin.ac.jp/assets/uploads/2017/01/000050405.pdf",
      "publisher": "國學院大學",
      "date": "2017"
    }
  },
  {
    "id": "buyer-142",
    "kind": "buyer",
    "title": "教員が直接発注できる上限は大学しだい",
    "summary": "琉球大学の資料（2024年）では、教員が直接発注できるのは1回の総額100万円未満で契約書が要らないもの。以前は10万円未満の消耗品等に限られており、大学ごと・年ごとに違う。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "教員発注の取扱い",
      "url": "https://www.u-ryukyu.ac.jp/wp-content/uploads/2024/03/1569427bfcf70a9299e4d7cd77cb2a54.pdf",
      "publisher": "琉球大学",
      "date": "2024-03"
    }
  },
  {
    "id": "buyer-143",
    "kind": "buyer",
    "title": "分けて発注して上限を逃れるのは禁止",
    "summary": "琉球大学など多くの大学は、金額の上限を避けるために発注を分けることを禁じている。研究室向けには、まとめて1件で出せる見積が喜ばれる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "教員発注の取扱い",
      "url": "https://www.u-ryukyu.ac.jp/wp-content/uploads/2024/03/1569427bfcf70a9299e4d7cd77cb2a54.pdf",
      "publisher": "琉球大学",
      "date": "2024-03"
    }
  },
  {
    "id": "buyer-144",
    "kind": "buyer",
    "title": "学内の工作室に先に頼むこともある",
    "summary": "芝浦工業大学のものづくりセンターは研究目的の加工を有料で受け、材料や工作室にない工具は依頼側が用意する。学内でできない加工や量が外の工場に回ってくる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "学内工作室では難しい加工の外注先として",
    "source": {
      "title": "ものづくりセンター 機械加工依頼規程",
      "url": "https://www.shibaura-it.ac.jp/assets/MachiningRequestRules.pdf",
      "publisher": "芝浦工業大学",
      "date": null
    }
  },
  {
    "id": "question-255",
    "kind": "question",
    "title": "大学からの注文は見積書が先？",
    "summary": "豊橋技術科学大学の流れでは、業者から見積を受け、会計課が発注し、納品までに購入依頼書を出す。答えには見積書の宛名や有効期限、請求書の出し方をそろえるとよい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "大学向け見積書・請求書の書き方",
    "source": {
      "title": "物品購入の流れ",
      "url": "https://www.tut.ac.jp/develop/docs/buppin%20flow.pdf",
      "publisher": "豊橋技術科学大学",
      "date": null
    }
  },
  {
    "id": "buyer-145",
    "kind": "buyer",
    "title": "官公庁向けは入札参加資格が先",
    "summary": "石川県では、県が発注する物品の製造の請負などの入札に参加するには参加資格の取得が必要で、申請は原則電子で役員名簿などを登録する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "競争入札参加資格申請の手引",
      "url": "https://www.pref.ishikawa.lg.jp/kanzai/shikaku/documents/tebiki.pdf",
      "publisher": "石川県",
      "date": "2024"
    }
  },
  {
    "id": "buyer-146",
    "kind": "buyer",
    "title": "参加資格は発注する機関ごとに取る",
    "summary": "入札参加資格は国・都道府県・市区町村など発注機関ごとに別で、受付期間や書類も違う。まず狙う発注先を決め、その公式ページで確かめる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "競争入札参加資格申請の手引",
      "url": "https://www.pref.ishikawa.lg.jp/kanzai/shikaku/documents/tebiki.pdf",
      "publisher": "石川県",
      "date": "2024"
    }
  },
  {
    "id": "buyer-147",
    "kind": "buyer",
    "title": "地元の中小企業に限る入札もある",
    "summary": "京都府は、府内の中小企業に限った入札の対象物品を決めている。地域の製造業にとって官公需は入口の一つになる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "府内中小企業に限定した入札の対象物品",
      "url": "https://www.pref.kyoto.jp/zaisan/documents/hunaityuusyougenntei.pdf",
      "publisher": "京都府",
      "date": null
    }
  },
  {
    "id": "buyer-148",
    "kind": "buyer",
    "title": "官公需は種類が多く取引も確実",
    "summary": "神奈川県の案内は、官公需は種類が豊富で取引も確実なため、中小企業の経営基盤の安定に役立つと説明する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "官公需リーフレット",
      "url": "https://www.pref.kanagawa.jp/documents/32810/rihuretto.pdf",
      "publisher": "神奈川県",
      "date": null
    }
  },
  {
    "id": "buyer-149",
    "kind": "buyer",
    "title": "研究機関も独自の参加資格を持つ",
    "summary": "産業技術総合研究所は令和7〜9年度の物品等の競争参加資格の手引を出している。研究機関への納入は、機関ごとの資格が必要なことがある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "物品等の競争参加資格 申請の手引（令和7〜9年度）",
      "url": "https://www.aist.go.jp/Portals/0/resource_images/aist_j/procure/requirements/pdf/tebiki_buppin_R7-R9fy.pdf",
      "publisher": "産業技術総合研究所",
      "date": "2025"
    }
  },
  {
    "id": "buyer-150",
    "kind": "buyer",
    "title": "スタートアップは1時間で行ける工場を望む",
    "summary": "ハードウェアスタートアップの取材では、1時間以内で行けて直接話し合える工場を望んだという声が紹介された。近さと顔を合わせられることは選ぶ理由になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "試作の打合せに来社できる範囲",
    "source": {
      "title": "ハードウェアスタートアップと工場",
      "url": "https://ascii.jp/elem/000/001/540/1540089/",
      "publisher": "ASCII",
      "date": null
    }
  },
  {
    "id": "buyer-151",
    "kind": "buyer",
    "title": "量産経験のない相手とは期待がずれやすい",
    "summary": "経産省の資料（2017年）は、スタートアップと工場の間でコスト・スピード・品質や意思疎通のミスマッチが多く、量産にたどり着けない例もあると指摘する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "初めての量産で決めておくこと",
    "source": {
      "title": "公募説明会資料（経済産業省）",
      "url": "https://sii.or.jp/startup29r/uploads/koubosetsumeikai_meti.pdf",
      "publisher": "環境共創イニシアチブ／経済産業省",
      "date": "2017"
    }
  },
  {
    "id": "buyer-152",
    "kind": "buyer",
    "title": "自治体の窓口経由で工場と出会う",
    "summary": "仙台の事例では、市の経済局に相談して紹介された工場が取引先になった。公的窓口や業界団体の紹介は今も起業家の探し方の一つ。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ハードウェアスタートアップと工場",
      "url": "https://ascii.jp/elem/000/001/540/1540089/",
      "publisher": "ASCII",
      "date": null
    }
  },
  {
    "id": "buyer-153",
    "kind": "buyer",
    "title": "まず小さな取引から始めてみる",
    "summary": "深センの工場の取材（2016年）では、視察だけでなくサンプルを買うなど、小さくても実際の取引をすることが大切だとされた。試作1回の依頼が入口になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "お試しの小さな依頼から始める方法",
    "source": {
      "title": "Shenzhen's small factories eye startups",
      "url": "https://thebridge.jp/2016/08/shenzhens-small-factories-eye-startups-amid-rising-manufacturing-costs",
      "publisher": "THE BRIDGE",
      "date": "2016-08"
    }
  },
  {
    "id": "pain-170",
    "kind": "pain",
    "title": "経験ある工場でも新しい製品で苦労する",
    "summary": "ある企業は、ヘッドセットで実績のある工場でも、ファームウェアを含む製品の特殊さから不具合に苦労したと語る。経験の範囲を正直に伝えることが大切。",
    "industries": [
      "電子部品",
      "組立"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "ハードウェア量産の苦労",
      "url": "https://weekly.ascii.jp/elem/000/001/227/1227658/2/",
      "publisher": "週刊アスキー",
      "date": null
    }
  },
  {
    "id": "term-314",
    "kind": "term",
    "title": "ODMとは",
    "summary": "工場側が持つ企画・設計をもとに作ってもらう方式。OEMは企画・デザインを自社で決め、生産だけを任せる。ODMは初めての人でも始めやすいとされる。",
    "industries": [
      "繊維",
      "化粧品OEM",
      "食品製造"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "OEMとODM、どちらで始める？",
    "source": {
      "title": "アパレルODMでオリジナルブランドを作る",
      "url": "https://www.theckb.com/archive/apparel-odm-enables-you-to-create-your-original-brand/",
      "publisher": "THE CKB",
      "date": null
    }
  },
  {
    "id": "buyer-154",
    "kind": "buyer",
    "title": "小ロットに応じる工場が増えている",
    "summary": "個人のブランド立ち上げ支援の広がりを背景に、小ロットに柔軟に応じる工場が増えているとの解説がある。最小ロットを明記すると個人・D2Cに見つけてもらいやすい。",
    "industries": [
      "繊維",
      "化粧品OEM",
      "食品製造"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "子供服OEMを小ロットで始める方法",
      "url": "https://www.theckb.com/archive/how-to-start-a-childrens-clothing-oem-in-small-batches/",
      "publisher": "THE CKB",
      "date": null
    }
  },
  {
    "id": "buyer-155",
    "kind": "buyer",
    "title": "OEM先は一括見積サービスで探す人も",
    "summary": "3万社以上のOEM企業データを持ち、ロットや段階に合わせて工場を紹介する一括見積サービスがある。工場との交渉が苦手な発注者が使う。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "OEM工場探しの一括見積サービス紹介",
      "url": "https://www.commercepick.com/?p=19262",
      "publisher": "コマースピック",
      "date": null
    }
  },
  {
    "id": "buyer-156",
    "kind": "buyer",
    "title": "D2Cは4段階で立ち上げる",
    "summary": "D2Cの始め方の解説は、ブランド設計→商品と物流→EC基盤→集客の順で進めるのが一般的とし、化粧品・食品・アパレルなど繰り返し買われる商材と相性がよいとする。",
    "industries": [
      "化粧品OEM",
      "食品製造",
      "繊維"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "D2Cの始め方",
      "url": "https://www.issoh.co.jp/column/details/15222/",
      "publisher": "issoh",
      "date": null
    }
  },
  {
    "id": "buyer-157",
    "kind": "buyer",
    "title": "OEMは選定・品質・契約をセットで",
    "summary": "OEMの解説は、委託先選びの誤り、品質管理の不備、契約の曖昧さが深刻なトラブルになるとし、3つをまとめて考えるよう勧める。",
    "industries": [
      "化粧品OEM",
      "食品製造",
      "繊維"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "OEM契約で先に決めておくこと",
    "source": {
      "title": "OEM生産で失敗しないための委託先選定から品質管理・契約まで",
      "url": "https://www.theckb.com/archive/thorough-explanation-from-contractor-selection-to-quality-control-contract-to-avoid-failures-in-oem-production/",
      "publisher": "THE CKB",
      "date": null
    }
  },
  {
    "id": "buyer-158",
    "kind": "buyer",
    "title": "化粧品OEMは6つの観点で比べる",
    "summary": "化粧品OEMメーカーの資料は、見積条件・価格・対応力・進行・最小ロット・得意分野の6点で比べる考え方を示す（売り手の資料）。価格だけで選ぶ失敗を戒めている。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "化粧品OEMを比べる6つの観点",
    "source": {
      "title": "化粧品OEM選びの6つのポイント",
      "url": "https://pr.mono.ipros.com/orioncosmetics/product/detail/2001613588/",
      "publisher": "イプロス（化粧品OEMメーカーの資料）",
      "date": null
    }
  },
  {
    "id": "buyer-159",
    "kind": "buyer",
    "title": "処方を持たないなら開発力で選ぶ",
    "summary": "一般的なOEMはブランド側が処方やデザインを用意し製造を任せる形。処方を自社で持てない発注者は、メーカーの処方開発の支援力を重く見る必要がある。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "articleIdea": "処方がなくても相談できますか？",
    "source": {
      "title": "化粧品OEMの基礎",
      "url": "https://www.theckb.com/?p=19978",
      "publisher": "THE CKB",
      "date": null
    }
  },
  {
    "id": "question-256",
    "kind": "question",
    "title": "委託先の衛生管理は何を見れば？",
    "summary": "中小の食品事業者は「HACCPの考え方を取り入れた衛生管理」を行い、計画に沿って管理した記録を残す（食品産業センターの手引き）。答えでは記録の見せ方まで書くと安心される。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "当社の衛生管理の記録、見学で見られます",
    "source": {
      "title": "HACCPの考え方を取り入れた衛生管理の手引き",
      "url": "https://haccp.shokusan.or.jp/wp-content/uploads/2019/03/e-tool-12_00.pdf",
      "publisher": "食品産業センター",
      "date": "2019-03"
    }
  },
  {
    "id": "buyer-160",
    "kind": "buyer",
    "title": "基板試作は製造〜実装の一貫で比べる",
    "summary": "基板試作・実装の比較では、基板製造・部品調達・実装・組立を1社で完結できるか、試作1台から受けるかが軸になる。窓口が一つで済むのが発注者の利点。",
    "industries": [
      "基板実装",
      "電子部品"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "基板の製造から実装まで一括で頼む利点",
    "source": {
      "title": "基板試作／実装 の製品一覧",
      "url": "https://mono.ipros.com/cg3/基板試作/実装",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-161",
    "kind": "buyer",
    "title": "基板の標準納期は2〜8週、短納期は割高",
    "summary": "Altiumの解説では、標準的なPCB製造は2〜8週間かかることがあり、クイックターンで短くできる。短納期は一般に割高なので、納期と費用の段階を示すと選びやすい。",
    "industries": [
      "基板実装",
      "電子部品"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "articleIdea": "基板の納期と料金の関係",
    "source": {
      "title": "最短納期を提供するPCBメーカー",
      "url": "https://resources.altium.com/jp/p/pcb-manufacturers-offering-shortest-turnaround-times",
      "publisher": "Altium",
      "date": null
    }
  },
  {
    "id": "buyer-162",
    "kind": "buyer",
    "title": "受注から平均2〜3日の基板試作も",
    "summary": "市の企業紹介（2025年）では、ある基板会社が受注から納品まで平均2〜3日、最速当日に対応と説明する。短納期の実績は数字で書くと比べられる。",
    "industries": [
      "基板実装",
      "電子部品"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "プリント基板の短納期試作",
      "url": "https://www.city.fujimino.saitama.jp/material/files/group/20/puriken_202501_014.pdf",
      "publisher": "ふじみ野市（企業紹介）",
      "date": "2025-01"
    }
  },
  {
    "id": "buyer-163",
    "kind": "buyer",
    "title": "印刷会社は得意分野が合うかで選ぶ",
    "summary": "印刷会社の選び方の解説は、作りたい印刷物と会社の強み・得意分野が合うかを確かめることが大切とし、品質・信頼性・価格と納期の3点で見るよう勧める。",
    "industries": [
      "印刷"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "当社が得意な印刷物・苦手な印刷物",
    "source": {
      "title": "印刷会社の選び方",
      "url": "https://www.biz.ne.jp/matome/2003838/",
      "publisher": "比較ビズ",
      "date": null
    }
  },
  {
    "id": "buyer-164",
    "kind": "buyer",
    "title": "板金は溶接・塗装まで一貫か",
    "summary": "切断・曲げから溶接・切削・塗装・組立まで社内で一貫する板金会社は、輸送時間や外注費の削減、工程をまたいだ品質管理を利点に挙げる。発注者は窓口一本化を評価する。",
    "industries": [
      "板金",
      "溶接",
      "塗装"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "板金から塗装まで一社に頼む利点",
    "source": {
      "title": "板金の一貫生産",
      "url": "https://mono.ipros.com/product/detail/2000938318",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-165",
    "kind": "buyer",
    "title": "公的機関の発注案件一覧から探される",
    "summary": "栃木県の産業振興センターは受発注あっせんの発注案件一覧を公開し、外注品目・加工内容・必要設備・材質などを載せる。発注側も公的あっせんを使って外注先を探す。",
    "industries": [
      "金属加工",
      "板金",
      "切削加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "受発注あっせん 発注案件一覧（2023）",
      "url": "https://tochigi-iin.or.jp/content/files/torihikishien/hacyuuichiran2023.pdf",
      "publisher": "とちぎ産業創造プラザ（栃木県産業振興センター）",
      "date": "2023"
    }
  },
  {
    "id": "buyer-166",
    "kind": "buyer",
    "title": "自動機は設計力で選ばれる",
    "summary": "自動機は用途に合わせた受注製作が多く、効率化やコストダウンの成否は設計力しだいと説明される。過去の構想から完成までの事例が判断材料になる。",
    "industries": [
      "装置",
      "治具"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "構想図から納入までの装置事例",
    "source": {
      "title": "自動機 - メーカー・企業の製品一覧",
      "url": "https://www.ipros.com/cg2/自動機/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-167",
    "kind": "buyer",
    "title": "止まらない装置は市販部品の使い方で決まる",
    "summary": "ある装置会社は、設計で最優先すべきはトラブルの少なさで、汎用の市販部品をどこに使うかで停止時間を抑えられると述べる。保守のしやすさは発注者の関心事。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "故障しても早く直せる装置の作り方",
    "source": {
      "title": "自動機 - メーカー・企業14社の製品一覧",
      "url": "https://www.ipros.com/cg1/自動機/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-257",
    "kind": "question",
    "title": "装置は設計だけ・製作だけでも頼める？",
    "summary": "構想から設計・製造・据付・保守まで社内完結する会社もあれば、一貫体制の中から部分発注を受ける会社もある。答えでは受けられる範囲を工程ごとに示すとよい。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "装置の部分発注はどこまでできる？",
    "source": {
      "title": "自動機 - メーカー・企業14社の製品一覧",
      "url": "https://www.ipros.com/cg1/自動機/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-168",
    "kind": "buyer",
    "title": "制御・配線まで含むか確かめる",
    "summary": "FA装置の解説では、構想段階から一緒に検討してくれるかが比較点になる。機械設計だけか、制御盤・配線・ロボット教示まで含むかを先に確かめると手戻りが減る。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "FA装置メーカーの集客",
      "url": "https://www.shopowner-support.net/attracting_customers/manufacturing/manufacturing-general/fa-equipment-manufacturer/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "buyer-169",
    "kind": "buyer",
    "title": "最安見積と監査の省略は失敗のもと",
    "summary": "射出成形の外注先選びの解説は、設備・品質体制・認証・意思疎通・金型製作力で評価し、最安見積に飛びつくことや工場監査を省くことを失敗例に挙げる。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "成形の外注先を見に来るとき見てほしい所",
    "source": {
      "title": "中国の射出成形サプライヤーの選び方",
      "url": "https://zetarmold.com/ja/中国の射出成形サプライヤーの選び方-2/",
      "publisher": "Zetar Mold",
      "date": null
    }
  },
  {
    "id": "buyer-170",
    "kind": "buyer",
    "title": "きれいなサイトと実際の工場を見分ける",
    "summary": "同じ解説は、商社の洗練されたサイトを実際の生産能力と取り違える失敗にも注意を促す。自社工場の設備写真や台数は、本当に作れる証拠になる。",
    "industries": [
      "樹脂成形",
      "金型"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "中国の射出成形サプライヤーの選び方",
      "url": "https://zetarmold.com/ja/中国の射出成形サプライヤーの選び方-2/",
      "publisher": "Zetar Mold",
      "date": null
    }
  },
  {
    "id": "buyer-171",
    "kind": "buyer",
    "title": "金型は前後工程との合い方も比べる",
    "summary": "半導体向け金型の解説では、発注時に対象工程、成形装置との適合、試作から量産への移行、保守体制まで比べることが重要とされる。",
    "industries": [
      "金型",
      "樹脂成形"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "半導体金型メーカー",
      "url": "https://www.shopowner-support.net/attracting_customers/manufacturing/semiconductor/semiconductor-mold-manufacturer/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "buyer-172",
    "kind": "buyer",
    "title": "経産省の外注先チェックリストは9分野",
    "summary": "経産省の航空機部品向けチェックリストは、方針・組織・購買・生産管理・品質保証・生産技術・検査・特殊工程・その他の9分野をはい/いいえで確かめる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "初回の工場監査で聞かれること",
    "source": {
      "title": "サプライヤー（個社）チェックリスト",
      "url": "https://www.meti.go.jp/policy/mono_info_service/mono/aerospace/pdf/checklist_2.pdf",
      "publisher": "経済産業省",
      "date": null
    }
  },
  {
    "id": "buyer-173",
    "kind": "buyer",
    "title": "認証があっても運用まで見られる",
    "summary": "同チェックリストは、品質マネジメントの認証取得だけでは不十分で、実際の運用体制を見ることを強調する。記録や手順書を見せられるかが問われる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "サプライヤー（個社）チェックリスト",
      "url": "https://www.meti.go.jp/policy/mono_info_service/mono/aerospace/pdf/checklist_2.pdf",
      "publisher": "経済産業省",
      "date": null
    }
  },
  {
    "id": "buyer-174",
    "kind": "buyer",
    "title": "委託先の一覧管理と能力調査",
    "summary": "一貫生産の中核企業向けチェックリストでは、購買として委託先の能力調査をしているか、調査票の様式があるか、委託先と委託内容を一覧で管理しているかを問う。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "一貫生産中核企業チェックリスト",
      "url": "https://www.meti.go.jp/policy/mono_info_service/mono/aerospace/pdf/checklist_3.pdf",
      "publisher": "経済産業省",
      "date": null
    }
  },
  {
    "id": "buyer-175",
    "kind": "buyer",
    "title": "監査の指摘は3つに分けて直しを求める",
    "summary": "初めての工場監査の解説は、指摘を重大・主要・軽微の3区分に分け、根本原因と期限を書いた是正計画を求める方法を紹介する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "How to prepare for your first-time factory audit",
      "url": "https://dev.to/theinspectioncompany/how-to-prepare-for-your-first-time-factory-audit-5hdd",
      "publisher": "DEV Community",
      "date": null
    }
  },
  {
    "id": "question-258",
    "kind": "question",
    "title": "新規取引で最初に確かめられることは？",
    "summary": "freeeの解説では、初回取引ではまず反社会的勢力と関係がないか、実在し実態のある会社かを確かめ、その上で与信限度額を決める。会社概要や実績を出せると早い。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "初めてのお取引で用意している書類",
    "source": {
      "title": "与信管理とは",
      "url": "https://www.freee.co.jp/kb/kb-invoice/credit-managements/",
      "publisher": "freee",
      "date": null
    }
  },
  {
    "id": "term-315",
    "kind": "term",
    "title": "与信限度額",
    "summary": "取引先にいくらまで後払い（掛け）で売ってよいかの上限。決算書や信用情報をもとに決め、限度内なら取引を進める。新規取引の審査で使われる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "与信管理とは",
      "url": "https://www.freee.co.jp/kb/kb-invoice/credit-managements/",
      "publisher": "freee",
      "date": null
    }
  },
  {
    "id": "buyer-176",
    "kind": "buyer",
    "title": "反社チェックは契約更新時にもある",
    "summary": "反社チェックは新規取引の前だけでなく、契約更新時や既存取引先の定期見直しでも行われる。取引が続いても確認が入ることを知っておくと慌てない。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "反社チェックのタイミング",
      "url": "https://it-trend.jp/antisocial_check_tool/article/933-8494",
      "publisher": "ITトレンド",
      "date": null
    }
  },
  {
    "id": "buyer-177",
    "kind": "buyer",
    "title": "契約書に暴力団排除の条項を入れる",
    "summary": "反社チェックの結果に応じて、契約書に暴力団排除の特約条項を設ける対応が示されている。取引基本契約の雛形に入っているか確かめたい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "反社会的勢力の排除",
      "url": "https://www.legalontech.com/jp/media/elimination_of_antisocial_forces",
      "publisher": "LegalOn Technologies",
      "date": null
    }
  },
  {
    "id": "buyer-178",
    "kind": "buyer",
    "title": "手作業の反社チェックは1件15〜30分",
    "summary": "SalesNowの解説では、手作業の反社チェックは1件15〜30分かかり、ツールで数秒に縮められる。発注側にとって新しい取引先を増やすのは手間がかかる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "反社チェックのやり方",
      "url": "https://salesnow.jp/media/174/",
      "publisher": "SalesNow",
      "date": null
    }
  },
  {
    "id": "question-259",
    "kind": "question",
    "title": "インボイスの登録番号は聞かれる？",
    "summary": "登録番号は法人なら「T＋法人番号」。名称や登録年月日などは国税庁の公表サイトで確かめられるため、取引先登録で番号を聞かれることが多い。サイトに載せると手間が減る。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "articleIdea": "取引先登録で必要な情報はここに",
    "source": {
      "title": "適格請求書等保存方式の概要",
      "url": "https://www.nta.go.jp/publication/pamph/shohi/shohizei_11.pdf",
      "publisher": "国税庁",
      "date": null
    }
  },
  {
    "id": "buyer-179",
    "kind": "buyer",
    "title": "外注先の切り替えは並行して少しずつ",
    "summary": "OpenBOMの解説は、新旧の取引先を並行させ、旧先への発注を段階的に減らしながら新先を増やす方法を勧める。いきなり全量を移すと供給が途切れる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "今の外注先から少しずつ移す方法",
    "source": {
      "title": "Why & How to Switch Suppliers Without Affecting Output",
      "url": "https://openbom.com/blog/why-how-to-switch-suppliers-without-affecting-output",
      "publisher": "OpenBOM",
      "date": null
    }
  },
  {
    "id": "buyer-180",
    "kind": "buyer",
    "title": "図面とデータが整うほど移しやすい",
    "summary": "同解説では、製品データや図面が整理されているほど切り替えの期間が短くなるとされる。受ける側は図面の読み直しや現物からの起こしで支えられる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "Why & How to Switch Suppliers Without Affecting Output",
      "url": "https://openbom.com/blog/why-how-to-switch-suppliers-without-affecting-output",
      "publisher": "OpenBOM",
      "date": null
    }
  },
  {
    "id": "buyer-181",
    "kind": "buyer",
    "title": "不具合や返品の増加は切り替えの合図",
    "summary": "EWMの記事は、出荷品の品質低下や返品の増加が取引先を変える判断材料になるとする。品質の安定は、乗り換え先として選ばれる理由になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "The Top 3 Reasons Why You Should Switch Manufacturers",
      "url": "https://www.ewmfg.com/post/the-top-3-reasons-why-you-should-switch-manufacturers",
      "publisher": "EWM",
      "date": null
    }
  },
  {
    "id": "buyer-182",
    "kind": "buyer",
    "title": "認証と追跡記録が切り替えの条件にも",
    "summary": "航空・防衛・医療など規制の厳しい分野では、ISO 9001やIATF 16949などの認証、検査成績書や追跡記録を出せるかが外注先の切り替え基準になるとされる。",
    "industries": [
      "切削加工",
      "機械部品"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "When and How to Switch CNC Suppliers the Right Way?",
      "url": "https://frigate.ai/?p=82688",
      "publisher": "Frigate",
      "date": null
    }
  },
  {
    "id": "buyer-183",
    "kind": "buyer",
    "title": "委託先を変えると逆に費用が増えることも",
    "summary": "委託先の変更で設計変更や工程の見直しが必要になり、人件費や管理費が膨らんでコスト削減が相殺されることもあると指摘される。移管の手間を減らす提案は喜ばれる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "外注先を変えるときの隠れた費用",
    "source": {
      "title": "アウトソーシング先変更で混乱する製造業の実態",
      "url": "https://newji.ai/procurement-purchasing/manufacturing-industry-chaos-due-to-outsourcing-switch/",
      "publisher": "newji",
      "date": null
    }
  },
  {
    "id": "trend-215",
    "kind": "trend",
    "official": true,
    "title": "転嫁に応じない理由に仕入先変更の検討",
    "summary": "中小企業庁の2025年度取引条件改善状況調査は、コストを単価に反映できなかった理由の選択肢に「今後、取引中止や仕入先変更を検討しているため」を入れている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "令和7年度「取引条件改善状況調査」のお願い",
      "url": "https://www.chusho.meti.go.jp/keiei/torihiki/2025/251205chousa01.pdf",
      "publisher": "中小企業庁",
      "date": "2025-12"
    }
  },
  {
    "id": "buyer-184",
    "kind": "buyer",
    "title": "調達先の一極集中が心配",
    "summary": "日本能率協会のBCP調査（2022年）を紹介した記事では、サプライチェーンの問題点として「調達先の一極集中」が挙がる。2社目の調達先として選ばれる余地がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "2社目の調達先としてご検討ください",
    "source": {
      "title": "心配なのは「調達先の一極集中」 BCPの視点から見たサプライチェーンの問題点とは",
      "url": "https://atmarkit.itmedia.co.jp/ait/spv/2212/09/news052.html",
      "publisher": "@IT（日本能率協会の調査）",
      "date": "2022-12"
    }
  },
  {
    "id": "buyer-185",
    "kind": "buyer",
    "title": "BCPに代替の仕入先・委託先を書く",
    "summary": "北陸経済連合会の会員調査（能登半島地震後）では、BCPの記載項目に「代替仕入れ・販売先、業務委託先の確保」が挙がった。災害時の代わりの委託先探しも需要になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "BCPに関する会員調査",
      "url": "https://hokkeiren.gr.jp/news/data/0b65d9de50fa0604a47ee040ca4c34db.pdf",
      "publisher": "北陸経済連合会",
      "date": "2024"
    }
  },
  {
    "id": "trend-216",
    "kind": "trend",
    "official": false,
    "title": "取引先の2〜3社先までしか把握できず",
    "summary": "2025年版ものづくり白書を読み解く記事によると、川上・川下ともに直接の取引先から2〜3社先までの把握にとどまる事業者が5割弱だった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業の経済安保対応、サプライチェーン多元化が進む一方で未対応も「約6割」",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2508/01/news052.html",
      "publisher": "MONOist",
      "date": "2025-08"
    }
  },
  {
    "id": "trend-217",
    "kind": "trend",
    "official": false,
    "title": "経済安保のリスク分析は自社のSCが7割超",
    "summary": "同記事（2025年）によると、経済安全保障のリスク分析をしている企業の72.6%が「自社の事業に関わるサプライチェーン」を対象にしている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "製造業の経済安保対応、サプライチェーン多元化が進む一方で未対応も「約6割」",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2508/01/news052.html",
      "publisher": "MONOist",
      "date": "2025-08"
    }
  },
  {
    "id": "question-260",
    "kind": "question",
    "title": "見積用の図面も秘密保持の対象？",
    "summary": "JETROの資料では、秘密保持契約で扱う情報の例に仕様書・図面・見本・模型・設計図・金型が挙がる。見積用の図面も典型例で、扱いを先に決めておくと安心される。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "お預かりした図面の扱い方",
    "source": {
      "title": "秘密保持契約の基礎",
      "url": "https://www.jetro.go.jp/ext_images/jetro/japan/oita/magazine/back_number/128trade_o.pdf",
      "publisher": "JETRO大分",
      "date": null
    }
  },
  {
    "id": "trend-218",
    "kind": "trend",
    "official": false,
    "title": "設計図の流用でNDA違反とされた判決",
    "summary": "労働新聞社の報道では、和歌山地裁で設計図の流用が秘密保持契約の義務違反とされた（損害賠償請求は棄却）。図面の管理は発注者の関心が高い。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "秘密保持契約 設計図流用が義務違反に 損害賠償請求は棄却 和歌山地裁",
      "url": "https://www.rodo.co.jp/news/218326/",
      "publisher": "労働新聞社",
      "date": null
    }
  },
  {
    "id": "pain-171",
    "kind": "pain",
    "title": "試作や技術指導を無償で求められる",
    "summary": "中小企業庁の知財取引の検討会資料（2020年）には、適正な対価なしに技術指導や試作品製造を強いられる事例があると書かれている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "知財取引に関する検討会資料",
      "url": "https://www.chusho.meti.go.jp/koukai/kenkyukai/chizaitorihiki/2020/200820chizaitorihiki03.pdf",
      "publisher": "中小企業庁",
      "date": "2020-08"
    }
  },
  {
    "id": "buyer-186",
    "kind": "buyer",
    "title": "送信前に営業されるのが心配",
    "summary": "BtoB資料請求ページの解説では、請求後に何が得られるか分からないこと、営業接触への警戒が入力直前の離脱につながる。送信後の流れを書くと送りやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "お問い合わせ後の流れ（しつこい営業はしません）",
    "source": {
      "title": "BtoB資料ダウンロードLPのCVRチェックリスト",
      "url": "https://funnel-ai.jp/media/btob-download-lp-cvr-checklist/",
      "publisher": "funnel-ai",
      "date": null
    }
  },
  {
    "id": "question-261",
    "kind": "question",
    "title": "問い合わせフォームは何を聞けばいい？",
    "summary": "フォーム項目の解説は、項目を「必ず入れる欄」「目的に応じて入れる欄」「減らすべき欄」に分けて考えるよう勧める。図面添付と希望納期以外は任意にする手もある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "articleIdea": "見積フォームの必須項目を3つに絞った理由",
    "source": {
      "title": "問い合わせフォームの項目の決め方",
      "url": "https://atsoho.com/blog/contact-forms-fields",
      "publisher": "atsoho",
      "date": null
    }
  },
  {
    "id": "buyer-187",
    "kind": "buyer",
    "title": "エラーはどの欄か分かるように",
    "summary": "フォーム放棄を減らす方法として、どの項目で何が間違っているかを明記することが勧められている。添付ファイルの形式や容量の制限も先に書くとよい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "フォーム放棄率を低減する方法",
      "url": "https://help.zoho.com/portal/ja/kb/forms/how-tos/holiday-forms/articles/%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%E6%94%BE%E6%A3%84%E7%8E%87%E3%82%92%E4%BD%8E%E6%B8%9B%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95",
      "publisher": "Zoho",
      "date": null
    }
  },
  {
    "id": "question-262",
    "kind": "question",
    "title": "治具を頼むとき何を伝える？",
    "summary": "治具の相談では、作業の様子、置き場所の広さ、必要な台数、希望の納期、だいたいの予算を確かめる。記事では、これを事前に用意してもらうと話が早いと書くとよい。",
    "industries": [
      "治具"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "shiori_tip"
    ],
    "articleIdea": "治具の相談前にそろえてほしい5つのこと",
    "source": {
      "title": "【実例】現場の声から治具が出来上がるまで(その1) 治具設計の舞台裏(2)",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2209/01/news004.html",
      "publisher": "MONOist",
      "date": "2022-09"
    }
  },
  {
    "id": "pain-172",
    "kind": "pain",
    "title": "頼まれた治具と本当の困りごとが違う",
    "summary": "ある治具の相談では、要望の裏にあった本当の目的は「作業者ごとの油の使用量のばらつきをなくしたい」だった。表の注文だけでなく目的を聞き出すことが設計の出発点になる。",
    "industries": [
      "治具"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "「こんな治具を」の奥にある本当の困りごとの聞き方",
    "source": {
      "title": "【実例】現場の声から治具が出来上がるまで(その1) 治具設計の舞台裏(2)",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2209/01/news004.html",
      "publisher": "MONOist",
      "date": "2022-09"
    }
  },
  {
    "id": "term-316",
    "kind": "term",
    "title": "治具設計で決める4つのこと",
    "summary": "治具設計では、品質・納期・コストに加え、①ワークの位置を正確に決める方法、②どこを押さえるか、③押さえる力の大きさ、④扱いやすさ、を考える必要がある。",
    "industries": [
      "治具"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "治具の良し悪しは位置決めとクランプで決まる",
    "source": {
      "title": "【実例】現場の声から治具が出来上がるまで(その2) 治具設計の舞台裏(3)",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2210/05/news003.html",
      "publisher": "MONOist",
      "date": "2022-10"
    }
  },
  {
    "id": "pain-173",
    "kind": "pain",
    "title": "良かれと思った工夫が現場で裏目",
    "summary": "作業者のためと考えた工夫が、実際の現場ではトラブルのもとになることがある。設計前の聞き取りと、納品後に使い心地を聞くことが大切とされる。",
    "industries": [
      "治具"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "納品した治具を3か月後に見に行って直したこと",
    "source": {
      "title": "設計の前に現場と作業の実態をつかむ 治具設計の舞台裏(5)",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2212/01/news004_3.html",
      "publisher": "MONOist",
      "date": "2022-12"
    }
  },
  {
    "id": "term-317",
    "kind": "term",
    "title": "3-2-1の原則（位置決め）",
    "summary": "ワークの6つの動き（自由度）を6点で止めて位置を決める考え方。3点で基準の面、2点で直角の面、1点で残りの向きを決める。治具の基本としてやさしく説明できる。",
    "industries": [
      "治具",
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "治具の基本「3-2-1の原則」を図でやさしく",
    "source": {
      "title": "Workholding Technology Pt. 2: Locating Basics",
      "url": "https://us.misumi-ec.com/blog/workholding-locating-basics/",
      "publisher": "MISUMI USA",
      "date": null
    }
  },
  {
    "id": "question-263",
    "kind": "question",
    "title": "治具の設計から製作まで一社で？",
    "summary": "設計と製作の時間が取れず納期が遅れる悩みに対し、設計から製作まで一貫で受ける会社もある。工程を把握していれば打ち合わせの場でおおよその納期を答えられる、という点も強みになる。",
    "industries": [
      "治具"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "治具設計製作の紹介",
      "url": "https://mono.ipros.com/product/detail/2001224397",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-188",
    "kind": "buyer",
    "title": "治具の外注先は精度保証で選ぶ",
    "summary": "複合的なユニット治具を外注化した事例では、ワークのデータから3D設計を提案し、部品を重ねたときの公差まで考えた精度保証やセンサー調整までできる協力会社を探した。",
    "industries": [
      "治具",
      "装置"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip",
      "article_idea"
    ],
    "articleIdea": "精度保証まで任せられる治具屋の見分け方",
    "source": {
      "title": "複合的な要素を含むユニット治具の外注化に成功した事例",
      "url": "https://mono.ipros.com/product/detail/2001336462",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-189",
    "kind": "buyer",
    "title": "治具探しは依頼範囲を先に決める",
    "summary": "外注のガイドでは、探す前に頼む範囲と成果物を決めないと、見積もりの比較や納品の姿のすり合わせが難しくなるとされる。治具ならワーク図面・用途・精度を先に整理。",
    "industries": [
      "治具"
    ],
    "useFor": [
      "shiori_tip",
      "question_example"
    ],
    "source": {
      "title": "外注のやり方を基礎から解説 2026",
      "url": "https://atsoho.com/blog/outsourcing-how-to",
      "publisher": "atsoho",
      "date": "2026"
    }
  },
  {
    "id": "term-318",
    "kind": "term",
    "title": "治具の標準部品とは",
    "summary": "位置決めピンやトグルクランプなど、通販で買える治具用の既製部品。先端の形（丸・ダイヤ・球面など）を選べる。標準品で組むと一品ずつ作る部分が減り、費用を抑えやすい。",
    "industries": [
      "治具"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "治具は標準部品を使うと安く早くなる理由",
    "source": {
      "title": "治具用位置決めピン",
      "url": "https://jp.misumi-ec.com/vona2/maker/misumi/mech_locating/M0301000000/M0301040000",
      "publisher": "ミスミ",
      "date": null
    }
  },
  {
    "id": "success-186",
    "kind": "success",
    "title": "製作前に治具を3Dで見せる",
    "summary": "治具の標準部品化による低コストを打ち出し、製作前に3D-CADで組立治具を見える形にして提案する会社がある。完成イメージを先に見せるのは発信の材料にもなる。",
    "industries": [
      "治具",
      "組立"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "作る前に3Dで確認。治具のやり直しを減らす方法",
    "source": {
      "title": "治具標準部品化による低コスト治具",
      "url": "https://mono.ipros.com/product/detail/2000976001",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "trend-219",
    "kind": "trend",
    "official": false,
    "title": "治具を3Dプリンタで作る動き",
    "summary": "ストラタシス・ジャパンの資料では、金属で作っていたソフトジョーを3Dプリンタで作り、製造コスト50%減、準備を最大2週間早めた海外事例が紹介されている（販売元の事例）。",
    "industries": [
      "治具",
      "3Dプリンタ"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "うちが治具の一部を3Dプリンタに替えた理由",
    "source": {
      "title": "3Dプリンタで治具・工具を作る事例",
      "url": "https://www.sbbit.jp/document/sp/19329",
      "publisher": "ビジネス+IT(ストラタシス提供)",
      "date": null
    }
  },
  {
    "id": "term-319",
    "kind": "term",
    "title": "3Dプリント治具は材料選びが肝",
    "summary": "栃木県産業技術センターは電解研磨用治具の材料を評価し、PEEKの摩耗量はPOMの1/10で耐摩耗性が良好と報告した。樹脂治具は用途に合う材料の見極めが前提になる。",
    "industries": [
      "治具",
      "3Dプリンタ"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "3Dプリンタ材料による治具の評価",
      "url": "https://iri.pref.tochigi.lg.jp/content/files/openlab/k-04_2025.pdf",
      "publisher": "栃木県産業技術センター",
      "date": "2025"
    }
  },
  {
    "id": "success-187",
    "kind": "success",
    "title": "治具の専門店がネット販売",
    "summary": "プリンター用治具の専門メーカーは、創業した年のうちに販売サイトを立ち上げて規格品の販売を始め、オーダーメイドの治具も受けている。規格品をネットで売る入口の例。",
    "industries": [
      "治具"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "規格品をネットで売り、特注の相談につなげる",
    "source": {
      "title": "ものづくり補助金 成果事例",
      "url": "https://www.maido.or.jp/mono_hojokin/mono_seika_H24/40.pdf",
      "publisher": "大阪商工会議所",
      "date": null
    }
  },
  {
    "id": "buyer-190",
    "kind": "buyer",
    "title": "治具は安い仮治具で先に試す",
    "summary": "本番の前に安価でやわらかい仮の型や治具で試し、隠れた問題を見つけると後の損を減らせる、という海外の製造の助言がある。試作治具に応じる姿勢は選ばれる理由になる。",
    "industries": [
      "治具"
    ],
    "useFor": [
      "shiori_tip",
      "article_idea"
    ],
    "articleIdea": "本番治具の前に仮治具で確かめる進め方",
    "source": {
      "title": "Manufacturing tips",
      "url": "https://www.tharawat-magazine.com/?p=10596",
      "publisher": "Tharawat Magazine",
      "date": null
    }
  },
  {
    "id": "question-264",
    "kind": "question",
    "title": "大きな架台は歪まない？",
    "summary": "架台フレームは、どこから作るかで寸法の出方や歪みの大きさが変わるため、経験のある職人が製作の順番を工夫する。高精度な架台では溶接後の歪み取りも必要になる。",
    "industries": [
      "製缶",
      "溶接"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "架台の歪みは作る順番で決まる",
    "source": {
      "title": "架台フレームの製作事例",
      "url": "https://mono.ipros.com/product/detail/2001192011",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-265",
    "kind": "question",
    "title": "架台のタップ穴は溶接前？後？",
    "summary": "基準面が仕上げ後の面になる架台で、外注先の機械では内側のタップが加工できず、溶接前に厚板側にタップを入れた例がある。図面の段階で加工の順番と基準面を相談するのが大事。",
    "industries": [
      "製缶",
      "切削加工"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "架台フレームの製作事例",
      "url": "https://mono.ipros.com/product/detail/2001095431",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-320",
    "kind": "term",
    "title": "製缶品ができるまでの流れ",
    "summary": "ある事例では、厚板を開先を大きく取って全溶接し、機械加工、焼鈍し、ショットブラストを経て塗装に回している。工程の流れを写真付きで見せると、発注者に分かりやすい。",
    "industries": [
      "製缶",
      "溶接",
      "塗装"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "架台ができるまで。切断から塗装までの7工程",
    "source": {
      "title": "厚板製缶の加工事例",
      "url": "https://mono.ipros.com/product/detail/2001163849",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-191",
    "kind": "buyer",
    "title": "架台は取付部品と一緒に頼む",
    "summary": "架台に付ける部品と一緒に発注して、タップ穴加工用のゲージ費用を抑えられた例がある。まとめて頼む利点を見積もり時に示すと、発注者が判断しやすい。",
    "industries": [
      "製缶"
    ],
    "useFor": [
      "shiori_tip",
      "article_idea"
    ],
    "articleIdea": "架台と部品をまとめて頼むと安くなるわけ",
    "source": {
      "title": "架台フレームの製作事例",
      "url": "https://mono.ipros.com/product/detail/2001192011",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-266",
    "kind": "question",
    "title": "大物は何mまで作れる？運べる？",
    "summary": "対応できる大きさは工場で違い、4m程度までという工場もある。大物は重さに合わせて運搬車両を手配するため、納品方法も先に相談したい。最大サイズと運び方は記事に必ず書く。",
    "industries": [
      "製缶"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "製缶品の製作",
      "url": "https://www.ipros.com/product/detail/2000617914",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-321",
    "kind": "term",
    "title": "製缶と板金のちがい",
    "summary": "一般に、板金は薄い板を切って曲げて部品を作り、製缶は厚めの板や形鋼を溶接して箱や筒などの大きな構造物を作る。会社の紹介では両方を組み合わせて部品代を下げた例もある。",
    "industries": [
      "製缶",
      "板金"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "製缶と板金、どこが違う？頼む先の選び方",
    "source": {
      "title": "製缶・板金・機械加工の一貫生産",
      "url": "https://mono.ipros.com/product/detail/2000651194",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-188",
    "kind": "success",
    "title": "大物の最大加工サイズを数字で出す",
    "summary": "ある会社は最大8200×3200×2000mmの大物機械加工と、溶接定盤を使った大物精密製缶を紹介ページに数字で載せている。大きさの上限は大物を探す人の最初の条件になる。",
    "industries": [
      "製缶",
      "切削加工"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "source": {
      "title": "大物精密製缶・機械加工",
      "url": "https://mono.ipros.com/product/detail/2000523688",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-192",
    "kind": "buyer",
    "title": "切断から塗装まで一社で終わるか",
    "summary": "切断・製缶・板金・機械加工・組立・塗装まで社内で一貫して行うことを特徴に掲げる工場がある。大物ほど工程ごとの運搬が負担になるため、一貫対応の範囲は選ぶ決め手になる。",
    "industries": [
      "製缶"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "一貫生産の紹介",
      "url": "https://pr.mono.ipros.com/shoueigp/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-189",
    "kind": "success",
    "title": "製缶のコストダウン冊子を無料配布",
    "summary": "製缶・機械加工のコストダウンをまとめた技術小冊子を無料で配り、問い合わせにつなげている会社がある。設計者が知りたい知識を資料にするのは、技術コラムの出口として使える。",
    "industries": [
      "製缶",
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "設計者向け「製缶のコストを下げる図面」小冊子",
    "source": {
      "title": "製缶のコストダウン技術",
      "url": "https://mono.ipros.com/product/detail/2000618784",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-190",
    "kind": "success",
    "title": "VA/VEの技術情報サイトを運営",
    "summary": "設計段階で役立つ加工知識をまとめた、設計者向けのVA/VE・コストダウン技術情報サイトを運営する例がある。自社の加工の知恵を発信の柱にする形。",
    "industries": [
      "製缶",
      "金属加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "設計技術者向けVA/VE技術情報",
      "url": "https://mono.ipros.com/product/detail/2000142130",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-191",
    "kind": "success",
    "title": "溶接の種類を解説して問い合わせへ",
    "summary": "製缶・組立の現場で使うMIG溶接などを解説したPDFを用意し、詳しくはダウンロードか問い合わせで案内する形がある。工程の解説は記事にしやすい。",
    "industries": [
      "製缶",
      "溶接"
    ],
    "useFor": [
      "article_idea"
    ],
    "articleIdea": "MIG・TIG・半自動、製缶で使い分ける理由",
    "source": {
      "title": "MIG溶接の紹介",
      "url": "https://mono.ipros.com/product/detail/2000703644",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "pain-174",
    "kind": "pain",
    "title": "比較の場に自社が出てこない",
    "summary": "金属加工業の新規開拓が進まない原因は技術力不足ではなく、発注担当者が業者を比べる段階に自社が登場していないこと、という分析がある。見つけてもらう仕組みが要る。",
    "industries": [
      "金属加工",
      "製缶"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "コロナ後の金属加工業の集客",
      "url": "https://www.shopowner-support.net/attracting_customers/manufacturing/metal-processing/metal-processing-after-corona/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "term-322",
    "kind": "term",
    "title": "2B・BA・No.4・HLの意味",
    "summary": "ステンレス板の表面の記号。2Bは最も一般的な仕上げ、BAは光沢のある焼鈍し仕上げ、No.4は細かい研磨目、HL（ヘアライン）は連続した研磨目。用途の例と一緒に説明できる。",
    "industries": [
      "表面処理",
      "板金"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "2B・BA・No.4・HL、ステンレスの表面記号早わかり",
    "source": {
      "title": "Stainless steel surface finish guide: 2B, BA, No.4, HL, mirror",
      "url": "https://fxbxg.pages.dev/insights/stainless-steel-surface-finish-guide-2b-ba-no4-hl-mirror",
      "publisher": "Buying Guide",
      "date": null
    }
  },
  {
    "id": "question-267",
    "kind": "question",
    "title": "ヘアラインと書けば通じる？",
    "summary": "ヘアラインの番手は資料によって#150〜#320、150〜180など違う。記号だけでなく番手、研磨目の向き、Ra値、できれば見本を図面に添えると認識違いを防げる。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "question_example",
      "shiori_tip",
      "article_idea"
    ],
    "articleIdea": "「ヘアライン仕上げ」で外観トラブルを防ぐ指示の出し方",
    "source": {
      "title": "Polished stainless steel finish standards",
      "url": "https://seller.alibaba.com/blogs/2026/southeast-asia/metal-fabrication/polished-stainless-steel-finish-standards-guide-alibaba-b2b",
      "publisher": "Alibaba.com Seller Blog",
      "date": "2026"
    }
  },
  {
    "id": "term-323",
    "kind": "term",
    "title": "#400バフは鏡面の一歩手前",
    "summary": "#400のバフ研磨は鏡面に近い光沢の仕上げで、装飾品や建材、厨房用品によく使われる。さらに光沢を上げた上位品は写り込みと錆びにくさが増すと説明されている。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "source": {
      "title": "ステンレス研磨の新精鋭 バフ研磨“高光沢”",
      "url": "https://mono.ipros.com/product/detail/2001482268",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-268",
    "kind": "question",
    "title": "溶接焼けもヘアラインで消せる？",
    "summary": "溶接ビードの熱による歪みや圧痕を取り除き、ヘアラインやバイブレーション仕上げで整える研磨業がある。溶接後の仕上げをどこまで任せられるかは発注者の関心事。",
    "industries": [
      "表面処理",
      "溶接"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "溶接跡を目立たなくする研磨の仕事",
    "source": {
      "title": "溶接ビード除去とヘアライン仕上げ",
      "url": "https://mono.ipros.com/product/detail/2000191141",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-324",
    "kind": "term",
    "title": "電解研磨とは",
    "summary": "ステンレスを電気で溶かして表面を平らにする処理。機械で磨いても取りにくい異物や細かい汚れが落ち、クロムの多い強い不動態皮膜ができて錆びにくくなる。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "電解研磨でなぜステンレスが錆びにくくなる？",
    "source": {
      "title": "電解研磨の紹介",
      "url": "https://mono.ipros.com/product/detail/2000186104",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-325",
    "kind": "term",
    "title": "不動態化処理とは",
    "summary": "酸性の液に浸けて表面に薄い不動態皮膜を作り、錆びにくくする処理。皮膜はクロムと酸素が結びついた極めて薄い膜。電解研磨のあとに行うとさらに強い皮膜になるとする会社もある。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "電解研磨と不動態化、どちらを頼めばいい？",
    "source": {
      "title": "複合電解研磨と不動態化処理",
      "url": "https://pr.mono.ipros.com/kanekita/product/detail/2001639534/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "trend-220",
    "kind": "trend",
    "official": false,
    "title": "電解研磨は半導体・医療で使われる",
    "summary": "電解研磨はバリやパーティクルを取り除き、衛生管理が求められる半導体製造装置や医療機器、医薬品の配管などで使われていると、加工会社各社が紹介している。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "半導体・医療の部品で電解研磨が選ばれる理由",
    "source": {
      "title": "ステンレス電解研磨",
      "url": "https://mono.ipros.com/product/detail/2000542368",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "pain-175",
    "kind": "pain",
    "title": "アルマイト前の脱脂でムラ",
    "summary": "強いアルカリの脱脂剤は素地を溶かすため、部分的に強い油が残っていると外観にムラが出ることがある、と近畿大学の報告にある。前処理の管理が仕上がりを左右する。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "source": {
      "title": "アルミニウムの表面処理に関する報告",
      "url": "https://kindai.repo.nii.ac.jp/record/23745/files/AN0006353X-20220715-0008.pdf",
      "publisher": "近畿大学",
      "date": "2022-07"
    }
  },
  {
    "id": "question-269",
    "kind": "question",
    "title": "カラーアルマイトは色がそろう？",
    "summary": "カラーアルマイトはロットによって色合いに多少のばらつきが出ることがある、と注意書きを出すメーカーもある。追加注文で色が合うかは事前に伝えておくと揉めない。",
    "industries": [
      "表面処理"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "カラーアルマイト仕様",
      "url": "https://www.takachi-el.co.jp/images/pdfs/custom/color_anodized.pdf",
      "publisher": "タカチ電機工業",
      "date": null
    }
  },
  {
    "id": "success-192",
    "kind": "success",
    "title": "研磨の技術を発信し海外の仕事も",
    "summary": "中小企業庁の事例集では、研磨加工のコンサルティングという自社の技術を発信して、国内だけでなく海外の需要も取り込んだ会社が紹介されている。",
    "industries": [
      "研削",
      "表面処理"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "磨く技術を「教える」ことで仕事が来た話",
    "source": {
      "title": "がんばる中小企業・小規模事業者300社 2020",
      "url": "https://www.chusho.meti.go.jp/keiei/sapoin/monozukuri300sha/2020/juyou/juyou015.pdf",
      "publisher": "中小企業庁",
      "date": "2020"
    }
  },
  {
    "id": "success-193",
    "kind": "success",
    "title": "町工場向けSNS講座は棚卸しから",
    "summary": "八尾市の町工場向けSNS講座は、1日目に自社の技術・人・こだわりを棚卸しして発信のネタを探し、2日目に動画化と社内で無理なく続ける仕組みを学ぶ構成になっている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "article_idea"
    ],
    "articleIdea": "「発信するネタがない」を卒業した棚卸しのやり方",
    "source": {
      "title": "町工場のためのSNS実践講座",
      "url": "https://www.city.yao.osaka.jp/_res/projects/default_project/_page_/001/024/753/tirashi.pdf",
      "publisher": "八尾市",
      "date": null
    }
  },
  {
    "id": "term-326",
    "kind": "term",
    "title": "金属3Dプリンタの3方式",
    "summary": "PBF（粉を敷いてレーザー等で溶かす。高精細）、DED（粉やワイヤを溶かして盛る。大物や補修向き）、バインダージェット（結合剤で固めて焼結。量産向き）。用途で選ぶ。",
    "industries": [
      "3Dプリンタ"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "金属3Dプリンタの方式、どれで頼めばいい？",
    "source": {
      "title": "金属AMの造形方式",
      "url": "https://www.mitsubishielectric.co.jp/fa/products/mecha/am/pr/zoukei/index.html",
      "publisher": "三菱電機",
      "date": null
    }
  },
  {
    "id": "term-327",
    "kind": "term",
    "title": "バインダージェットは量産向き",
    "summary": "金属の粉を結合剤で固めて焼結する方式。型が要らず、PBFより造形が速く量産向きとされる。焼結前は崩れやすく、焼結で縮む分の対策が要る。",
    "industries": [
      "3Dプリンタ"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "BJT方式金属3Dプリンタの発表",
      "url": "https://www.mhi.com/jp/news/210708.html",
      "publisher": "三菱重工",
      "date": "2021-07"
    }
  },
  {
    "id": "term-328",
    "kind": "term",
    "title": "樹脂3Dプリンタの4方式",
    "summary": "FDM（溶かした樹脂を積む。形の確認向き）、光造形（細かく精密）、SLS（粉を焼結。表面はやや粗い）、MJF（粉方式で速く表面がきれい）。目的別に選ぶ。",
    "industries": [
      "3Dプリンタ"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "FDM・光造形・SLS・MJF、試作の目的で選ぶ",
    "source": {
      "title": "FDM vs. SLA光造形 vs SLS方式",
      "url": "https://formlabs.com/jp/types-of-3d-printers-3d-printing-technology/",
      "publisher": "Formlabs",
      "date": null
    }
  },
  {
    "id": "question-270",
    "kind": "question",
    "title": "3Dプリントの精度は方式で決まる？",
    "summary": "精度は方式だけでなく機種・材料・造形の大きさ・後処理で変わる。公差が大事な部品は、どの方式で何を保証できるかを個別に相談するよう記事で伝えたい。",
    "industries": [
      "3Dプリンタ"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "basics of 3d printing",
      "url": "https://formlabs.com/jp/resources/basics-of-3d-printing/",
      "publisher": "Formlabs",
      "date": null
    }
  },
  {
    "id": "pain-176",
    "kind": "pain",
    "title": "金属3Dプリントは後処理が重い",
    "summary": "後処理は金属3Dプリントで最も時間のかかる工程とされ、造形そのものより費用も時間もかかることがある、とSmarTech系の資料は指摘している。",
    "industries": [
      "3Dプリンタ"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "金属AMの後処理に関するレポート",
      "url": "https://www.dri.co.jp/auto/report/smartech/smpamppm0819.html",
      "publisher": "データリソース",
      "date": null
    }
  },
  {
    "id": "term-329",
    "kind": "term",
    "title": "サポートは反りを防ぐ支え",
    "summary": "金属造形では急な加熱と冷却で応力がたまり反るため、造形プレートとの間にサポートを設計する。下向きの面や中空の天井部分は何もしないと荒れたり崩れたりしやすい。",
    "industries": [
      "3Dプリンタ"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "金属3Dプリントの「サポート」って何？",
    "source": {
      "title": "金属3Dプリントシステム",
      "url": "https://canon.jp/biz/product/indtech/3dpsolution/3dsystems/3d-metal-print/system",
      "publisher": "キヤノンマーケティングジャパン",
      "date": null
    }
  },
  {
    "id": "question-271",
    "kind": "question",
    "title": "金属3Dプリントの材料費は？",
    "summary": "東京都立産業技術研究センターの事例として、材料費は50グラムごとに922円と高価で、複雑な形でも10時間ほどで試作品ができると紹介されている（2018年の記事）。",
    "industries": [
      "3Dプリンタ"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "受託金属積層造形の先駆けはオーダーメイド医療を目指す金属3Dプリンタ",
      "url": "https://monoist.itmedia.co.jp/mn/articles/1812/05/news022.html",
      "publisher": "MONOist",
      "date": "2018-12"
    }
  },
  {
    "id": "question-272",
    "kind": "question",
    "title": "3Dプリントは大きいと高い？",
    "summary": "出力代は材料代と造形時間で決まるため、大きく複雑なものは高くなりやすい。大きさや形を見直すと費用を下げられる場合がある、と記事で助言できる。",
    "industries": [
      "3Dプリンタ"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "3Dプリントの見積もりを下げる形の工夫",
    "source": {
      "title": "3Dプリント出力サービスの選び方",
      "url": "https://akiba-pc.watch.impress.co.jp/docs/sp/608275.html",
      "publisher": "AKIBA PC Hotline!",
      "date": null
    }
  },
  {
    "id": "buyer-193",
    "kind": "buyer",
    "title": "3Dプリントは複数社で自動見積もり",
    "summary": "外部の造形サービスの多くは3Dデータがあれば無償で見積もりを出し、アップロードで金額が出るものもある。複数サービスで比べると安い選択肢が見つかる、とMONOistは助言する。",
    "industries": [
      "3Dプリンタ"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "メカ設計者のための3Dプリンタ活用",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2204/14/news026_3.html",
      "publisher": "MONOist",
      "date": "2022-04"
    }
  },
  {
    "id": "success-194",
    "kind": "success",
    "title": "会員登録なしで1分見積もり",
    "summary": "DMM.make 3Dプリントは2022年、会員登録なしで3Dデータを上げるだけで1分ほどで見積もりが出る法人向けサービスを始めた。請求書払いの手続きも簡単にした。",
    "industries": [
      "3Dプリンタ"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "source": {
      "title": "DMM.make 法人向け簡易見積りサービス",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2209/14/news027.html",
      "publisher": "MONOist",
      "date": "2022-09"
    }
  },
  {
    "id": "buyer-194",
    "kind": "buyer",
    "title": "海外の造形サービスは通関が心配",
    "summary": "海外のまとめ型サービスは価格が安めな一方、配送や通関で遅れることがあるとされる。納期が大事な人には国内で頼む利点として伝えられる。",
    "industries": [
      "3Dプリンタ"
    ],
    "useFor": [
      "shiori_tip",
      "article_idea"
    ],
    "articleIdea": "国内で3Dプリントを頼む3つの安心",
    "source": {
      "title": "Third party 3D printing services",
      "url": "https://help.aobajapan.jp/AJIS-ICT/live/staff/third-party-3d-printing-services",
      "publisher": "Aoba-Japan International School",
      "date": null
    }
  },
  {
    "id": "buyer-195",
    "kind": "buyer",
    "title": "内製か外注かは隠れコストで決める",
    "summary": "社内で3Dプリントすると速く小回りが利くが、保守・失敗造形・操作者の教育などの見えにくい費用がかかる。外注は専門知識と量の増減に強いと比べられている。",
    "industries": [
      "3Dプリンタ"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "社内3Dプリンティング vs アウトソーシング",
      "url": "https://jlc3dp.com/jp/blog/in-house-vs-outsourcing-3d-printing",
      "publisher": "JLC3DP",
      "date": null
    }
  },
  {
    "id": "trend-221",
    "kind": "trend",
    "official": false,
    "title": "3Dプリンタを入れた職場は43.5%",
    "summary": "MONOistとTechFactoryの2024年7月の調査で、職場に3Dプリンタを導入していると答えた人は43.5%で、前回の37.8%から増えた。",
    "industries": [
      "3Dプリンタ"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "3Dプリンタ活用動向調査",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2411/26/news045.html",
      "publisher": "MONOist",
      "date": "2024-11"
    }
  },
  {
    "id": "pain-177",
    "kind": "pain",
    "title": "日本のAMは試作どまり",
    "summary": "日本AM協会の資料では、日本では3Dプリンタが研究や設計試作にしか使われていない状況が指摘される。量産に使うには材料・設計・装置・後加工・品質保証すべての見直しが要る。",
    "industries": [
      "3Dプリンタ"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "source": {
      "title": "AMが実製品活用されない国内事情とは何か",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2305/15/news005_2.html",
      "publisher": "MONOist",
      "date": "2023-05"
    }
  },
  {
    "id": "success-195",
    "kind": "success",
    "title": "治具いらずを金属3Dで売りに",
    "summary": "切削だと治具が必要で時間と費用がかかる部品を、金属3Dプリンタで治具なしに作り、短納期・低コストで応えた事例を出す会社がある。比較の切り口が記事になる。",
    "industries": [
      "3Dプリンタ",
      "切削加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "切削と金属3Dプリント、治具の有無で比べた話",
    "source": {
      "title": "金属3Dプリンタによる治具レス造形",
      "url": "https://pr.mono.ipros.com/mandai-inc/product/detail/2001220617",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-196",
    "kind": "buyer",
    "title": "個人の3Dプリント依頼先",
    "summary": "個人が3Dプリントを頼む先には、受注サイトの出品者、家庭用プリンタの持ち主とつなぐサービス、データを送ると工場を自動で選ぶマッチングなどがある。",
    "industries": [
      "3Dプリンタ"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "3D printer network",
      "url": "https://cgworld.jp/news/service/1503-3d3d-printer-network3d1000.html",
      "publisher": "CGWORLD",
      "date": null
    }
  },
  {
    "id": "buyer-197",
    "kind": "buyer",
    "title": "図面を送ると工場を自動で紹介",
    "summary": "関西経済連合会の資料には、図面や3Dデータを送ると世界約300の工場から合う工場を自動で結び付ける仕組みが紹介されている。発注者がこうした入口を使う前提で発信したい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "source": {
      "title": "IoT・ものづくり事例",
      "url": "https://www.kankeiren.or.jp/iot/pdf/iot11.pdf",
      "publisher": "関西経済連合会",
      "date": null
    }
  },
  {
    "id": "question-273",
    "kind": "question",
    "title": "ワイヤー放電の費用は何で決まる？",
    "summary": "板厚、形の複雑さ、求める精度と面粗さ（仕上げの回数）、加工時間で大きく変わる。ソディックの例では板厚20〜80mmのSKD11を±5μmで仕上げるのに約29時間かかった。",
    "industries": [
      "放電加工"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "ワイヤー放電の見積もりが変わる4つの条件",
    "source": {
      "title": "SampleTag W-AL",
      "url": "https://www.sodick.co.jp/special/WebExhibition_MECT2021/pdf/SampleTag_W-AL.pdf",
      "publisher": "ソディック",
      "date": "2021"
    }
  },
  {
    "id": "term-330",
    "kind": "term",
    "title": "形彫り放電は電極を写す加工",
    "summary": "形彫り放電は形を作った電極をワークに写し取る加工で、プラスチック成形の金型などで使われる。深く掘るほど電極の先が減って形が変わるため、補正や電極の工夫が要る。",
    "industries": [
      "放電加工",
      "金型"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "形彫り放電の電極ってどう作る？",
    "source": {
      "title": "形彫放電加工機のメリット",
      "url": "https://www.mitsubishielectric.co.jp/fa/products/mecha/edm/pmerit/index.html",
      "publisher": "三菱電機",
      "date": null
    }
  },
  {
    "id": "buyer-198",
    "kind": "buyer",
    "title": "形彫りは電極代と加工代を分けて",
    "summary": "形彫り放電の見積もりは、電極の製作費と放電の加工費を分けてもらうと比べやすい。リブ幅・深さ・角Rの最小値を図面に書くと、電極の作り方の提案も受けやすい。",
    "industries": [
      "放電加工"
    ],
    "useFor": [
      "shiori_tip",
      "question_example"
    ],
    "source": {
      "title": "高精度電極・銅電鋳電極",
      "url": "https://mono.ipros.com/product/detail/2000450659",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-331",
    "kind": "term",
    "title": "センタレス研削とは",
    "summary": "ワークを芯押しやチャックでつかまず、調整車と砥石で挟んで外径を削る研削。円筒研削盤では支えられない直径1mm以下の細いワークも扱える、とメーカーは説明している。",
    "industries": [
      "研削"
    ],
    "useFor": [
      "article_idea",
      "question_example"
    ],
    "articleIdea": "センタレス研削はなぜ細いシャフトが得意？",
    "source": {
      "title": "センタレス研削盤",
      "url": "https://mono.ipros.com/product/detail/2000616804",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-274",
    "kind": "question",
    "title": "センタレスの真円度はどこまで？",
    "summary": "あるメーカーは加工能力の例として真円度0.002mm以下、円筒度0.003mm以下を挙げる。量産で真円度0.0003mm相当に対応するという専門業者もある。",
    "industries": [
      "研削"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "センタレス研削盤の加工能力",
      "url": "https://pr.mono.ipros.com/nissin-cg/product/detail/2000721978/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "pain-178",
    "kind": "pain",
    "title": "砥石が崩れると真円度が落ちる",
    "summary": "ノリタケの資料では、連続して加工するうちに砥石の形が崩れ、ワークの真円度がだんだん悪くなると説明されている。ドレッシングの管理が品質を左右する。",
    "industries": [
      "研削"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "センタレス研削で真円度を守る砥石の手入れ",
    "source": {
      "title": "センタレス用砥石カタログ",
      "url": "https://noritake.co.jp/catalogType/download/7c690c0e64cc24d6885e985f4c89c1f2.pdf",
      "publisher": "ノリタケ",
      "date": null
    }
  },
  {
    "id": "question-275",
    "kind": "question",
    "title": "細長いシャフトの研削で伝えること",
    "summary": "小径で長いシャフトはたわみや振れが問題になりやすい。外径公差・真円度・円筒度・面粗さに加え、長さと径の比率、試作か量産か、ロット数を伝えると見積もりが早い。",
    "industries": [
      "研削",
      "機械部品"
    ],
    "useFor": [
      "question_example",
      "shiori_tip"
    ],
    "source": {
      "title": "センタレス研削の受託",
      "url": "https://mono.ipros.com/product/detail/2000503361",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-276",
    "kind": "question",
    "title": "ロボットは本体価格で入る？",
    "summary": "産業用ロボットはカタログの本体価格とSIerの見積総額が一致せず、総額は本体の2〜6倍ほどに広がるという解説がある。ハンド・周辺装置・安全柵・立ち上げが加わる。",
    "industries": [
      "装置",
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "ロボットの見積もり、本体以外に何がかかる？",
    "source": {
      "title": "産業用ロボットの導入費用",
      "url": "https://www.issoh.co.jp/column/details/16843/",
      "publisher": "issoh",
      "date": null
    }
  },
  {
    "id": "success-196",
    "kind": "success",
    "title": "100万円ほどで無人測定工程",
    "summary": "栃木県産業技術センターでは、周辺機器と組み合わせた簡素なシステムで、100万円程度の導入費用で無人の測定工程を作った例が紹介されている。小さく始める例として使える。",
    "industries": [
      "装置",
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "まず100万円の自動化から始めた話",
    "source": {
      "title": "オープンラボ成果",
      "url": "https://iri.pref.tochigi.lg.jp/content/files/openlab/j06_2025.pdf",
      "publisher": "栃木県産業技術センター",
      "date": "2025"
    }
  },
  {
    "id": "pain-179",
    "kind": "pain",
    "title": "仕様があいまいだと手戻りが膨らむ",
    "summary": "日本ロボットシステムインテグレータ協会の資料は、仕様があいまいなまま進むと、構築段階や導入後に問題が見つかり対応費用が大きく膨らむと警告し、仕様を書面でそろえるよう勧める。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "source": {
      "title": "ロボット導入の進め方",
      "url": "https://jarsia.jp/robot-intro/doc/intro_2.pdf",
      "publisher": "FA・ロボットシステムインテグレータ協会",
      "date": null
    }
  },
  {
    "id": "buyer-199",
    "kind": "buyer",
    "title": "要件定義をSIerに丸投げしない",
    "summary": "食品工場の導入事例記事は、要件定義はロボット導入の大事な工程で、SIerに丸投げせず自社も十分な人手と時間をかけるべきだとしている。",
    "industries": [
      "装置",
      "食品製造"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "中小食品メーカーのロボット導入と運用",
      "url": "https://news.nissyoku.co.jp/archives/news-keyword/中小食品メーカーのロボット導入と運用",
      "publisher": "日本食糧新聞",
      "date": null
    }
  },
  {
    "id": "buyer-200",
    "kind": "buyer",
    "title": "初期費用無料のSIerには注意",
    "summary": "実績づくりを急ぐスタートアップが初期費用を無料にするなど無理な価格で提案することがあり注意が必要、という指摘がある。国内のSIerは1000社以上とされる。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "shiori_tip",
      "question_example"
    ],
    "source": {
      "title": "ロボット導入に関する調査",
      "url": "https://lfb.mof.go.jp/kantou/content/000248350.pdf",
      "publisher": "関東財務局",
      "date": null
    }
  },
  {
    "id": "buyer-201",
    "kind": "buyer",
    "title": "本格導入の前にFSで確かめる",
    "summary": "経産省のロボット導入実証事業には実証とFS（実現可能性の調査）があり、実証209件・FS86件、中小企業が215件を占めた。いきなり入れず先に確かめる進め方が使える。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "ロボット導入実証事業の分析",
      "url": "https://kobegakuin-economics.jp/wp-content/uploads/2023/11/202311_55_001.pdf",
      "publisher": "神戸学院大学",
      "date": "2023-11"
    }
  },
  {
    "id": "question-277",
    "kind": "question",
    "title": "ロボットは何年で元が取れる？",
    "summary": "投資回収は「総投資額÷年間の純利益」で考える。国内の例では、約1000万円で成形品のゲートカットにロボット2台を入れ、24時間動かせば1年半で回収できるとした。",
    "industries": [
      "装置",
      "樹脂成形"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "ロボットの元が取れるか、計算の仕方",
    "source": {
      "title": "ロボット導入で費用回収",
      "url": "https://newswitch.jp/p/3281",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "question-278",
    "kind": "question",
    "title": "協働ロボの回収12〜18か月は本当？",
    "summary": "協働ロボットはうまく計画すれば多くの用途で12〜18か月で回収できるという見方があるが、メーカー系の数字。24時間稼働が前提かなど条件を確かめるよう記事で伝えたい。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "Cobot ROI calculator for SME manufacturing",
      "url": "https://www.evsint.com/ja/cobot-roi-calculator-sme-manufacturing/",
      "publisher": "EVS",
      "date": null
    }
  },
  {
    "id": "pain-180",
    "kind": "pain",
    "title": "自動化がうまく進まない現場",
    "summary": "中堅中小の製造現場では、自動化機器やロボットが期待ほど活用されていない例が散見される。MONOistの連載は、導入前・立ち上げ・運用の段階ごとに要因を整理している。",
    "industries": [
      "装置",
      "all"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "「工場の自動化がうまく進まない…」その原因はどこにあり、何をすべきなのか",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2509/19/news004.html",
      "publisher": "MONOist",
      "date": "2025-09"
    }
  },
  {
    "id": "buyer-202",
    "kind": "buyer",
    "title": "県のサイトでSIerを探す",
    "summary": "静岡県のロボット導入支援プラットフォームは、導入事例・SIerの紹介・問い合わせフォームを一か所にまとめている。発注者はこうした公的な入口からSIerを探すことがある。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "ロボット導入支援プラットフォーム",
      "url": "https://www.pref.shizuoka.jp/sangyoshigoto/kigyoshien/kigyoshien/1025705.html",
      "publisher": "静岡県",
      "date": null
    }
  },
  {
    "id": "success-197",
    "kind": "success",
    "title": "中小のロボット導入事例をセミナーで",
    "summary": "FA・ロボットシステムインテグレータ協会が、中小企業のロボット導入事例のセミナーを始めると報じられた。事例を語る場は、SIerにとって見込み客に出会う発信の機会になる。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "うちのロボット導入事例を、数字と失敗込みで公開",
    "source": {
      "title": "SIer協会の中小向け事例セミナー",
      "url": "https://newswitch.jp/p/33705",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "trend-222",
    "kind": "trend",
    "official": true,
    "title": "中小単独のロボット導入は難しい",
    "summary": "関東経済産業局の資料は、中堅・中小企業が自力でロボットを入れるのは困難という前提で、導入の流れと支援策をまとめている。相談先として記事で紹介できる。",
    "industries": [
      "装置"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "ロボット導入支援パッケージ",
      "url": "https://www.kanto.meti.go.jp/seisaku/iot_robot/robot/data/robot_package.pdf",
      "publisher": "関東経済産業局",
      "date": null
    }
  },
  {
    "id": "pain-181",
    "kind": "pain",
    "title": "町工場は新規・小ロットを断りがち",
    "summary": "中小の製造業の多くは大企業からの受託加工が中心で、新規や小ロットの注文を受けていないため、スタートアップとの連携が難しかったと報告されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "ハードウェアスタートアップと町工場",
      "url": "https://weekly.ascii.jp/elem/000/004/047/4047614/",
      "publisher": "週刊アスキー",
      "date": null
    }
  },
  {
    "id": "pain-182",
    "kind": "pain",
    "title": "ハードは直せないから量産が怖い",
    "summary": "ソフトは不具合をアップデートで直せるが、ハードの故障は大きな事故につながる可能性がある。試作を繰り返す資金と量産のノウハウが要るのがハード系スタートアップの壁。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "ハードウェアスタートアップ支援",
      "url": "https://weekly.ascii.jp/elem/000/001/532/1532536/",
      "publisher": "週刊アスキー",
      "date": null
    }
  },
  {
    "id": "question-279",
    "kind": "question",
    "title": "試作が動けば量産できる？",
    "summary": "試作が動いたことでDFM（作りやすさ）の指摘を軽く見て、量産で金型の変形や組立のばらつき、輸送試験での故障が出た例がある。試作の成功は量産の保証ではない。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea"
    ],
    "articleIdea": "試作が動いたのに量産でつまずく理由",
    "source": {
      "title": "Prototype Success Is NOT Production Readiness",
      "url": "https://qualityinspection.org/prototype-success-is-not-production-readiness/",
      "publisher": "QualityInspection.org",
      "date": null
    }
  },
  {
    "id": "term-332",
    "kind": "term",
    "title": "DFM（作りやすい設計）",
    "summary": "量産で作りやすく、ばらつきが出にくいように設計を見直すこと。金型を作る前なら直すのは早いが、後からだと費用がかさむ。早い段階で設計に組み込むほど安く済む。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "スタートアップに伝えたいDFMの基本",
    "source": {
      "title": "DFM as a design input",
      "url": "https://www.seasongroup.com/?p=5015",
      "publisher": "SEASON Group",
      "date": null
    }
  },
  {
    "id": "buyer-203",
    "kind": "buyer",
    "title": "委託先の量産経験を確かめる",
    "summary": "ODMの失敗談として、委託先に量産経験がない、仕様や目標の製品コストを十分に伝えない、契約前にコストや部品表を取り決めない、が挙げられている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "question_example"
    ],
    "source": {
      "title": "スタートアップが陥ったODMの失敗談から学ぶ",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2508/21/news008.html",
      "publisher": "MONOist",
      "date": "2025-08"
    }
  },
  {
    "id": "buyer-204",
    "kind": "buyer",
    "title": "目標原価を先に示すとぶれない",
    "summary": "目標の製品コストを先に示すと部品コストの目標が決まり、設計の方向がぶれにくい。スタートアップから相談を受ける側も、最初に目標原価を聞くとよい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "article_idea"
    ],
    "articleIdea": "量産の相談で最初に「目標原価」を聞く理由",
    "source": {
      "title": "スタートアップが陥ったODMの失敗談から学ぶ",
      "url": "https://monoist.itmedia.co.jp/mn/spv/2508/21/news008.html",
      "publisher": "MONOist",
      "date": "2025-08"
    }
  },
  {
    "id": "question-280",
    "kind": "question",
    "title": "量産後にもお金がかかる？",
    "summary": "量産のあとには修理・サービス対応や設計変更が必ず起きるため、その費用も見込んでおく必要がある、とMONOistの連載は説く。初めて量産する人への大事な助言。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example"
    ],
    "source": {
      "title": "自社オリジナル製品のシーズ探しから量産するまでのステップ【後編】",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2510/28/news005.html",
      "publisher": "MONOist",
      "date": "2025-10"
    }
  },
  {
    "id": "trend-223",
    "kind": "trend",
    "official": true,
    "title": "東京都のものづくりSU育成",
    "summary": "東京都の「TIB FAB Makers Challenge 2025」は、シード期のものづくり企業を約6か月集中支援し、試作後はパートナー連携やマッチングで量産化を後押しする。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "TIB FAB Makers Challenge 2025 参加者募集",
      "url": "https://tib.metro.tokyo.lg.jp/posts/clookqqd",
      "publisher": "東京都",
      "date": "2025-06"
    }
  },
  {
    "id": "trend-224",
    "kind": "trend",
    "official": true,
    "title": "多摩の製造業をSUに紹介",
    "summary": "東京都の多摩ものづくりスタートアップ起業家育成事業は、量産前の試作・検証を支え、多摩地域の製造事業者を開発の受託候補として紹介し、2年で最大1300万円の費用を支援する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "多摩ものづくりスタートアップ起業家育成事業",
      "url": "https://startup-station.jp/tn/services/tamamonozukuri-startup/",
      "publisher": "東京都",
      "date": null
    }
  },
  {
    "id": "buyer-205",
    "kind": "buyer",
    "title": "SUは支援機関経由で町工場を探す",
    "summary": "都や県の支援事業では、事務局が製造事業者を受託候補として紹介する。スタートアップはこうした窓口から工場を探すため、支援機関に登録・顔を出すことが入口になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "ものづくり起業家募集 製品開発スタートアップ支援",
      "url": "https://www.metro.tokyo.lg.jp/information/press/2026/05/2026051308",
      "publisher": "東京都",
      "date": "2026-05"
    }
  },
  {
    "id": "buyer-206",
    "kind": "buyer",
    "title": "モノづくり相談は具体案があってこそ",
    "summary": "神奈川のK-NICの随時募集のマッチング相談は、具体的な製品の製造課題や事業計画がある人が対象で、ごく初期の構想段階は対象外になる場合がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip"
    ],
    "source": {
      "title": "モノづくりマッチング相談プログラム",
      "url": "https://www.k-nic.jp/program/9881/",
      "publisher": "K-NIC",
      "date": null
    }
  },
  {
    "id": "success-198",
    "kind": "success",
    "title": "定額で職人に相談できる仕組み",
    "summary": "スタートアップの試作を多く支えてきた墨田区の町工場は、定額で職人に相談できるサービスを始めた。相談の入口を商品にするのは、発信と受注をつなぐ一つの形。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "「まず相談だけ」を受ける町工場の仕組み",
    "source": {
      "title": "定額で「職人に相談」のスタートアップ支援",
      "url": "https://newswitch.jp/image/19943",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "success-199",
    "kind": "success",
    "title": "量産化設計を試作ネットで支援",
    "summary": "京都のアクセラレーターは、地元の試作企業のネットワークを生かして、スタートアップの量産化設計や量産化試作を支援している。仲間と組んで窓口を作る例。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "Makers Boot Camp",
      "url": "https://initial.inc/s/MBC",
      "publisher": "INITIAL",
      "date": "2017"
    }
  },
  {
    "id": "trend-225",
    "kind": "trend",
    "official": false,
    "title": "オープンファクトリーが各地で増加",
    "summary": "町工場を一般に開く「オープンファクトリー」の開催が各地で増え、大田区では試作を軸にした「試作市場」という催しも行われている。見てもらう場が発信の場になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "工場を開いた日に、初めての試作相談が来た",
    "source": {
      "title": "町工場を体験「オープンファクトリー」、各地で開催が増える理由",
      "url": "https://newswitch.jp/keyword/detail/35878",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "pain-183",
    "kind": "pain",
    "title": "HPで問い合わせ増、でも売上ゼロ",
    "summary": "ある町工場はホームページを新しくして引き合いが急に増えたが、狙う客の絞り込みが足りず売上につながらなかった。数より、誰に来てほしいかを決めるのが先。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "articleIdea": "問い合わせが増えたのに売上が増えなかった失敗",
    "source": {
      "title": "町工場のホームページ刷新",
      "url": "https://newswitch.jp/index.php/p/35760",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "pain-184",
    "kind": "pain",
    "title": "HPがないと比較の候補に入らない",
    "summary": "ホームページやSNSがないと、検索や比較の対象にならず、新しい発注元に見つけてもらいにくい、と町工場の課題を扱う記事は指摘している。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "question_example"
    ],
    "source": {
      "title": "町工場の課題",
      "url": "https://ascii.jp/elem/000/004/310/4310196/",
      "publisher": "ASCII.jp",
      "date": null
    }
  },
  {
    "id": "term-333",
    "kind": "term",
    "title": "化粧品のOEMとODMの違い",
    "summary": "OEMはブランド側が商品の考えや処方の方向を出し、工場が開発と製造をする形。ODMは工場が持つ既存の処方をもとに、香りや色、容器を選んで整える形。処方の扱いが変わる。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "既存処方とオリジナル処方、どちらで始める？",
    "source": {
      "title": "OEM vs ODM Cosmetics Manufacturing",
      "url": "https://seller.alibaba.com/blogs/2026/southeast-asia/beauty-skincare/oem-odm-cosmetics-manufacturing-guide-alibaba-b2b",
      "publisher": "Alibaba.com Seller Blog",
      "date": "2026"
    }
  },
  {
    "id": "buyer-207",
    "kind": "buyer",
    "title": "処方の権利は契約前に確かめる",
    "summary": "工場は委託元の製品情報を深く知る立場になる。処方の持ち主、他社への転用の禁止、秘密保持、届出の名義などを契約書に書くよう求める発注者が多い。答えを記事に書くと安心される。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "処方は誰のもの？当社の契約の考え方",
    "source": {
      "title": "Regulatory Compliance for Cosmetics Contract Manufacturing in China",
      "url": "https://legalink.ch/groups/newsletter-articles/regulatory-compliance-for-cosmetics-contract-manufacturing-in-china/2922",
      "publisher": "Legalink（Grandway Law Offices）",
      "date": null
    }
  },
  {
    "id": "term-334",
    "kind": "term",
    "title": "ストック処方",
    "summary": "OEM会社がすでに承認や実績を持っている処方。使うと開発期間を短くできる。医薬部外品をオリジナル処方で作ると、承認までに約1年かかるとOEM会社が説明している。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ストック処方とオリジナル処方の期間と費用",
    "source": {
      "title": "イプロス掲載 化粧品・医薬部外品OEM",
      "url": "https://www.ipros.com/product/detail/2000842372",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-281",
    "kind": "question",
    "title": "薬用化粧品は何か月で出せる？",
    "summary": "オリジナル処方の医薬部外品は国の承認が要り、あるOEM会社は約1年かかると説明。承認済みの処方を使えば早いとも。期間の幅と、何で変わるかを答えに入れるとよい。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "イプロス掲載 化粧品・医薬部外品OEM",
      "url": "https://www.ipros.com/product/detail/2000842372",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-335",
    "kind": "term",
    "title": "医薬部外品と化粧品の違い",
    "summary": "医薬部外品は薬機法で決められた、体への作用がおだやかな製品で、医薬品ではない。主な目的は肌荒れなどの「防止」。化粧品より言える効果が広い分、国の承認が必要になる。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "化粧品と医薬部外品、どっちで作るべき？",
    "source": {
      "title": "医薬部外品の承認申請に関するPMDA資料",
      "url": "https://www.pmda.go.jp/files/000273942.pdf",
      "publisher": "PMDA",
      "date": null
    }
  },
  {
    "id": "question-282",
    "kind": "question",
    "title": "医薬部外品OEMだと何が言える？",
    "summary": "有効成分を入れて承認を取ると「美白」「育毛」など具体的な効果を書けるのが化粧品との大きな違い、とOEM会社は説明。その分、期間と費用が増えることも合わせて答える。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "イプロス掲載 医薬部外品OEM",
      "url": "https://mono.ipros.com/product/detail/2001176060",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "pain-185",
    "kind": "pain",
    "title": "「しっとり」の解釈ずれで試作が長引く",
    "summary": "化粧品の満足度は試作で決まることが多いが、「しっとり」「べたつかない」などの感覚の言葉は依頼側と工場で受け取り方がずれ、試作が想定より長引きやすい。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "試作の回数を減らす「感触の伝え方」",
    "source": {
      "title": "化粧品OEMの流れ（コマースピック専門家コラム）",
      "url": "https://www.commercepick.com/archives/77120",
      "publisher": "コマースピック",
      "date": null
    }
  },
  {
    "id": "question-283",
    "kind": "question",
    "title": "化粧品OEMの開発期間は？",
    "summary": "期間は一律ではなく、こだわりの度合いと発売したい時期で変わる。優先することを最初に工場へ伝えると進めやすい。答えには、何で延びるか（試作・容器・承認）を並べるとよい。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "化粧品OEMの流れ（コマースピック専門家コラム）",
      "url": "https://www.commercepick.com/archives/77120",
      "publisher": "コマースピック",
      "date": null
    }
  },
  {
    "id": "buyer-208",
    "kind": "buyer",
    "title": "見積は条件をそろえて比べる",
    "summary": "化粧品OEM会社の資料では、見積の条件・価格・対応力・進行・最小ロット・得意分野の6点で比べるよう勧めている。価格だけで決めると失敗しやすい。比べ方を記事にすると選ばれやすい。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "化粧品OEMの見積を正しく比べる6つの点",
    "source": {
      "title": "オリオン粧品工業 イプロス掲載資料",
      "url": "https://pr.mono.ipros.com/orioncosmetics/product/detail/2001613588",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-336",
    "kind": "term",
    "title": "製造窯の大きさとロット",
    "summary": "化粧品は製造窯の大きさで受けやすいロットや値下がりの仕方が変わる。大きな窯は大ロットで安くしやすく、小さな窯は小ロット向き。両方あれば幅広く受けられる。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "当社の窯のサイズと、得意なロット",
    "source": {
      "title": "イプロス特集 化粧品OEM",
      "url": "https://mono.ipros.com/en/feature/107803/",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-209",
    "kind": "buyer",
    "title": "化粧品OEM先は得意分野で選ぶ",
    "summary": "OEM会社は設備・実績・方針により作れる分野が限られることがある。作りたい品目を先に絞ってから探すと早い。工場側は得意な品目と苦手な品目を書いておくとよい。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "当社が得意な化粧品・頼まれても断る化粧品",
    "source": {
      "title": "化粧品OEM会社の選び方（コマースピック）",
      "url": "https://www.commercepick.com/archives/73969",
      "publisher": "コマースピック",
      "date": null
    }
  },
  {
    "id": "question-284",
    "kind": "question",
    "title": "容器も小ロットで作れる？",
    "summary": "容器メーカーのカタログでは、デジタル印刷を使い小ロットでも多彩なデザインに対応するチューブ容器を紹介している。容器が最小ロットを決めることがあるので、答えに入れたい。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "化粧品容器 製品カタログ（イプロス）",
      "url": "https://mono.ipros.com/product/detail/2000685519",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-337",
    "kind": "term",
    "title": "チューブ容器の層の構成",
    "summary": "化粧品のチューブは、中身（バルク）に合わせて単層・3層・5層・ラミネートなどから選ぶ。中身を守る力や値段が変わる。発注者には見た目以外の違いが分かりにくい。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "チューブの層の違いと選び方",
    "source": {
      "title": "チューブ容器カタログ2023",
      "url": "https://cdn.shopify.com/s/files/1/0552/1476/8175/files/kzcatalog_tube2023.pdf",
      "publisher": "容器メーカー",
      "date": "2023"
    }
  },
  {
    "id": "term-338",
    "kind": "term",
    "title": "エアレス容器",
    "summary": "外の空気が入らないようにして中身を守る容器。詰め替えるときは湿気で密封が壊れることがあるため、容器を完全に乾かす必要があるとされる。酸化しやすい中身に向く。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "エアレス・ポンプ・チューブ、中身で選ぶ容器",
    "source": {
      "title": "エアレスポンプボトルの使い方",
      "url": "https://www.songmile.com/ja/how-do-i-use-airless-pump-bottles-with-replaceable-inserts",
      "publisher": "Songmile",
      "date": null
    }
  },
  {
    "id": "question-285",
    "kind": "question",
    "title": "容器と中身の相性は確かめる？",
    "summary": "化粧品の包装の試験は、材料の安全性・密封性・使い勝手などに分けて行われる。工場が容器と中身の相性をどう確かめるかを答えに書くと、初めての発注者が安心する。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "化粧品包装試験サービス市場",
      "url": "https://www.gii.co.jp/report/qyr1710637-global-cosmetic-packaging-testing-services-market.html",
      "publisher": "グローバルインフォメーション",
      "date": null
    }
  },
  {
    "id": "question-286",
    "kind": "question",
    "title": "自社ブランド化粧品に要る許可は？",
    "summary": "市場に出す責任を負う「製造販売業」と、実際に作る工場の「製造業」は別の許可。自社ブランドで出すなら製造販売業許可が要る。OEM会社が製造販売元を引き受けるかも答えに入れる。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "化粧品を仕入れて売る副業の法律関係",
      "url": "https://atsoho.com/blog/cosmetics-resale-side-job-license",
      "publisher": "atsoho",
      "date": "2026"
    }
  },
  {
    "id": "term-339",
    "kind": "term",
    "title": "化粧品の「製造販売元」表示",
    "summary": "化粧品の容器には製造販売業者の名前と住所、製品名、製造番号、全成分などを書く決まり。表示の住所は総括製造販売責任者がいる事務所で、実際に作った工場とは限らない。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "化粧品のラベルに書くこと・誰の名前が載るか",
    "source": {
      "title": "化粧品の表示に関するチェックリスト",
      "url": "https://www.pref.kanagawa.jp/documents/9804/kesyouhin_hyouji.pdf",
      "publisher": "神奈川県",
      "date": null
    }
  },
  {
    "id": "term-340",
    "kind": "term",
    "title": "総括製造販売責任者",
    "summary": "化粧品の製造販売業者が置かなければならない責任者。薬剤師や化学系の課程を修めた常勤者などがなる。ブランド側が自分で許可を取るか、OEM会社に任せるかの分かれ目になる。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "自社で製造販売業を取るか、任せるか",
    "source": {
      "title": "化粧品製造販売業許可の取得検討",
      "url": "https://www.pref.kanagawa.jp/documents/9979/keshouhinseihan-shutokukentou.pdf",
      "publisher": "神奈川県",
      "date": null
    }
  },
  {
    "id": "pain-186",
    "kind": "pain",
    "title": "OEM先を変えると同じ品が作れない",
    "summary": "発売元になれば商品名や価格は自由に決められるが、OEM工場を変えると同じ製品を作れなくなることがある、と個人の解説。処方の持ち主を最初に決めておく大切さが分かる。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "工場を変えたら同じ化粧品は作れる？",
    "source": {
      "title": "化粧品OEMの解説（リベシティ）",
      "url": "https://library.libecity.com/articles/01JCVP1XDS9NX8SN3XKEMAD9SA",
      "publisher": "リベシティ",
      "date": null
    }
  },
  {
    "id": "success-200",
    "kind": "success",
    "title": "作った人が書く記事は信頼を生む",
    "summary": "化粧品のオウンドメディアでは、社内で製品開発にかかわった専門家が書く記事が製品への信頼を高めるとされる。OEM会社でも処方担当が書くと強い。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "処方担当が書く「この成分を選んだ理由」",
    "source": {
      "title": "化粧品業界のオウンドメディア",
      "url": "https://www.shopowner-support.net/attracting_customers/retail/cosmetics/cosmetics_ownedmedia/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "success-201",
    "kind": "success",
    "title": "商品リンクは控えめに、情報で集める",
    "summary": "化粧品会社のオウンドメディア事例では、美容や成分の情報を幅広く出し、記事の下だけに関連商品への入口を置く形が紹介されている。売り込みすぎない方が読まれる。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "化粧品業界のオウンドメディア",
      "url": "https://www.shopowner-support.net/attracting_customers/retail/cosmetics/cosmetics_ownedmedia/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "success-202",
    "kind": "success",
    "title": "立ち上げの流れをコラムで連載",
    "summary": "化粧品ビジネスを始めたい人向けに、OEMを使った立ち上げの流れ、狙う客の決め方、差別化などを連載するコラムがある。初めての人の順番で書くと、検索で見つけてもらいやすい。",
    "industries": [
      "化粧品OEM"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "はじめての化粧品づくり、全体の流れ",
    "source": {
      "title": "化粧品ビジネスを始めよう（タグ一覧）",
      "url": "https://www.commercepick.com/archives/tag/%E5%8C%96%E7%B2%A7%E5%93%81%E3%83%93%E3%82%B8%E3%83%8D%E3%82%B9%E3%82%92%E5%A7%8B%E3%82%81%E3%82%88%E3%81%86",
      "publisher": "コマースピック",
      "date": null
    }
  },
  {
    "id": "trend-226",
    "kind": "trend",
    "official": true,
    "title": "食品の営業許可は32業種に再編",
    "summary": "2021年6月施行の改正食品衛生法で、営業許可の業種が34から32に組み直された。食中毒のリスクや過去の発生状況を考えて決められた。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "法改正で当社の許可はどう変わった？",
    "source": {
      "title": "営業許可業種の見直しについて",
      "url": "https://www.city.sapporo.jp/hokenjo/shoku/info/30syokuhineiseihoukaisei/eigyouminaoshi.html",
      "publisher": "札幌市",
      "date": "2021"
    }
  },
  {
    "id": "trend-227",
    "kind": "trend",
    "official": true,
    "title": "漬物や水産製品も許可が必要に",
    "summary": "2021年の改正で、漬物製造業、水産製品製造業、液卵製造業などが新たに許可業種になった。以前は許可がいらなかった加工も、施設基準を満たす必要がある。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "食品衛生法改正について",
      "url": "https://www.pref.shizuoka.jp/kenkofukushi/eiseiyakuji/shokuanzen/hokaisei/1024997.html",
      "publisher": "静岡県",
      "date": "2021"
    }
  },
  {
    "id": "term-341",
    "kind": "term",
    "title": "営業届出制度",
    "summary": "許可業種以外の食品の営業でも、一部を除き保健所への届出が要る仕組み（2021年新設）。届出には氏名、施設の所在地、営業の形態、主な食品、食品衛生責任者などを書く。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "許可と届出、うちの工場はどっち？",
    "source": {
      "title": "食品衛生法改正について",
      "url": "https://www.pref.shizuoka.jp/kenkofukushi/eiseiyakuji/shokuanzen/hokaisei/1024997.html",
      "publisher": "静岡県",
      "date": "2021"
    }
  },
  {
    "id": "question-287",
    "kind": "question",
    "title": "リスクが低い業種は届出だけ？",
    "summary": "食中毒リスクが低い一部の業種は許可から届出に移った。熊本市の資料では乳類販売業や氷雪販売業などが例。委託先がどちらかを確かめたい発注者向けに答えを用意する。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "食品衛生法改正（営業許可・届出）",
      "url": "https://www.city.kumamoto.jp/kiji00333888/index.html",
      "publisher": "熊本市",
      "date": "2021"
    }
  },
  {
    "id": "question-288",
    "kind": "question",
    "title": "前から許可がある工場は再届出？",
    "summary": "旧法の許可を持つ事業者は届出をしたものとみなされる。ただ愛知県では、県条例による届出は法律の届出に切り替わるため出し直しが要るとしている。地域で違うので保健所に確認。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "営業許可・届出の見直し",
      "url": "https://www.pref.aichi.jp/soshiki/eisei/kyoka-todokede-minaoshi.html",
      "publisher": "愛知県",
      "date": "2021"
    }
  },
  {
    "id": "term-342",
    "kind": "term",
    "title": "アレルゲンのコンタミネーション",
    "summary": "原材料に使っていないのに、同じ製造ラインや器具などからアレルギー物質が意図せず混ざること。可能性を消せない場合は、原材料欄の外に注意をうながす表示をするのが一般的。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "同じラインで作るときのアレルゲン対策",
    "source": {
      "title": "食物アレルギーの表示",
      "url": "https://www.hokeniryo1.metro.tokyo.lg.jp/allergy/pdf/pri05_4.pdf",
      "publisher": "東京都",
      "date": null
    }
  },
  {
    "id": "question-289",
    "kind": "question",
    "title": "同じラインでアレルゲンは混ざる？",
    "summary": "防ぐ方法は、ラインを十分に洗う、特定原材料を含まない食品から先に作る、できるだけ専用の器具を使うこと。工場の実際の手順を書くと、委託先を探す人の判断材料になる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "アレルゲンのコンタミネーション防止",
      "url": "https://www.city.edogawa.tokyo.jp/documents/34118/contamination2025.pdf",
      "publisher": "江戸川区",
      "date": "2025"
    }
  },
  {
    "id": "pain-187",
    "kind": "pain",
    "title": "注意表示の出しすぎも問題",
    "summary": "微量でも症状が出る人がいる一方、念のための注意表示を増やしすぎると、アレルギーのある人が選べる食品が減ってしまう。表示を抜かすのも過剰にするのも避けたい。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "注意喚起表示を減らせる工場の工夫",
    "source": {
      "title": "衛生研究所ニュース（アレルギー物質）",
      "url": "https://www.pref.kanagawa.jp/sys/eiken/005_databox/0504_jouhou/0601_eiken_news/files/eiken_news140.htm",
      "publisher": "神奈川県衛生研究所",
      "date": null
    }
  },
  {
    "id": "term-343",
    "kind": "term",
    "title": "アレルゲンの「可能性表示」",
    "summary": "「入っているかもしれない」のような書き方は可能性表示と呼ばれ、認められていないと解説されている。一方、混入を否定できない時の注意喚起表示は推奨。違いを記事で説明できる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "「入っているかも」と書けない理由",
    "source": {
      "title": "食物アレルギー表示の解説",
      "url": "https://www.issoh.co.jp/column/details/18450/",
      "publisher": "issoh",
      "date": null
    }
  },
  {
    "id": "trend-228",
    "kind": "trend",
    "official": true,
    "title": "県がコンタミ防止策を監視指導",
    "summary": "岐阜県は県内の食品製造施設で、原材料の使い方や工程を確かめ、アレルゲンの意図しない混入を防ぐ対策と表示の方法を監視・指導している。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "食品衛生監視指導計画",
      "url": "https://www.pref.gifu.lg.jp/uploaded/attachment/136251.pdf",
      "publisher": "岐阜県",
      "date": null
    }
  },
  {
    "id": "question-290",
    "kind": "question",
    "title": "サプリの形は何が選べる？",
    "summary": "受託会社は錠剤、カプセル、顆粒、ドリンク、ゼリー、グミなどを扱う。500個から受ける会社もある。形ごとの向き不向きと最小ロットを答えに入れるとよい。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "Food supplement OEM manufacturing（イプロス）",
      "url": "https://mono.ipros.com/en/cg3/Food supplement OEM manufacturing",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "term-344",
    "kind": "term",
    "title": "賦形剤",
    "summary": "粉の原料を錠剤などの形にして量産するときに入れる、形を保つための材料。量は剤形や処方で変わる。発注者は「余計なものが入る」と不安に思いやすいので、役割を説明したい。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "賦形剤ってなに？入れる理由",
    "source": {
      "title": "Food supplement OEM manufacturing（イプロス）",
      "url": "https://mono.ipros.com/en/cg3/Food supplement OEM manufacturing",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-291",
    "kind": "question",
    "title": "グミと錠剤、どちらがいい？",
    "summary": "錠剤は量を正確にそろえやすいとされ、グミは飲みやすさで選ばれる。販売側の記事なので一般論として扱う。剤形で原料の入れられる量や保存性も変わることを答えに足す。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "ビタミングミと錠剤の比較",
      "url": "https://www.jinlupacking.com/ja/blogs/vitamin-gummies-vs-pills/",
      "publisher": "Jinlu Packing",
      "date": null
    }
  },
  {
    "id": "trend-229",
    "kind": "trend",
    "official": true,
    "title": "錠剤型サプリにGMPの自主取組",
    "summary": "国の資料で、錠剤・カプセルなどの「サプリメント」を作る事業者には、まずGMP（製造管理の基準）を自主的に守るよう促すとしている。機能性表示食品以外も対象になる流れ。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "当社のサプリ製造とGMPの取り組み",
    "source": {
      "title": "錠剤・カプセル状食品の製造管理に関する資料",
      "url": "https://h-crisis.niph.go.jp/wp-content/uploads/2026/06/001714756.pdf",
      "publisher": "国立保健医療科学院（掲載）",
      "date": "2026-06"
    }
  },
  {
    "id": "question-292",
    "kind": "question",
    "title": "食品OEMはどんな順で進む？",
    "summary": "ある食品OEM会社は、打ち合わせ（形・ロット）→見積→試作→評価→正式見積→発注→納品の順を示す。試作は見積の後に入る。各段階の目安日数を書けると親切。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "食品OEM 製品紹介（イプロス）",
      "url": "https://mono.ipros.com/product/detail/2000461766",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "question-293",
    "kind": "question",
    "title": "食品の試作費は無料？",
    "summary": "大手グループの調味料OEMでは、液体製品の1kg以下の初回ラボ試作を無料とする例がある。何回目から有料か、どの量までかを書くと、比べている人の判断が早くなる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "液体調味料OEM（イプロス）",
      "url": "https://pr.mono.ipros.com/yutakafoods/product/detail/2001600991",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "buyer-210",
    "kind": "buyer",
    "title": "20社に聞いて開発に10か月",
    "summary": "食品を企画した個人の体験記では、20社に問い合わせ、開発に10か月かかった。発注する側は思ったより時間がかかる。工場側は最初の返事の速さと目安日数で差をつけられる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "初めての食品OEM、相談から発売まで",
    "source": {
      "title": "食品OEMの体験記（リベシティ）",
      "url": "https://library.libecity.com/articles/01M3ZSB91541XD34HRECQ8TMST",
      "publisher": "リベシティ",
      "date": null
    }
  },
  {
    "id": "buyer-211",
    "kind": "buyer",
    "title": "県のOEMカタログで探す",
    "summary": "鹿児島県は、県内を中心に九州の農林水産物をOEMで受ける企業23社を紹介するカタログを出している。発注者は自治体の一覧から候補を探す。載ることも発信の一つ。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "農林水産物加工OEMカタログ",
      "url": "https://www.pref.kagoshima.jp/ag36/oem_katarogu.html",
      "publisher": "鹿児島県",
      "date": null
    }
  },
  {
    "id": "buyer-212",
    "kind": "buyer",
    "title": "マッチングサイトで最小ロット順",
    "summary": "OEMマッチングサイトには、工場が設備・作れる商品・最小ロットを載せており、展示会より多くの候補から選べるとされる。小ロットの新商品なら最小ロットで先に絞る人が多い。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "当社の最小ロットと、小ロットの考え方",
    "source": {
      "title": "食品OEMの探し方",
      "url": "https://www.shopowner-support.net/?p=44942",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "buyer-213",
    "kind": "buyer",
    "title": "OEM展示会で委託先を探す",
    "summary": "委託したい企業とOEMメーカーをつなぐ展示会が増えている。日本食糧新聞社は2019年に東京ビッグサイトで食品・飲料のOEMマッチングEXPOを開いた。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "食品&飲料OEMマッチングEXPO",
      "url": "https://news.nissyoku.co.jp/?p=531227",
      "publisher": "日本食糧新聞",
      "date": "2019"
    }
  },
  {
    "id": "buyer-214",
    "kind": "buyer",
    "title": "製造から出荷まで一括を求める",
    "summary": "案件の依頼サイトには、食品を作るだけでなく梱包・出荷まで一括で頼める先を探す依頼が出ている。D2C事業者は手間を減らしたい。対応範囲を書くと選ばれやすい。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "作るだけ？出荷まで？当社が受けられる範囲",
    "source": {
      "title": "食品加工 仕事の依頼",
      "url": "https://www.biz.ne.jp/subject/toi_detail.html?tid=957096",
      "publisher": "ビズネット",
      "date": null
    }
  },
  {
    "id": "trend-230",
    "kind": "trend",
    "official": false,
    "title": "輸出商談会向けのOEM先を募集",
    "summary": "札幌の事業では、オーストラリア向け商談会に向け、抹茶スプレッドやラーメン、土産菓子のOEM・共同開発の相手を募集。賞味期限の条件も示された。輸出向けの受託も入口になる。",
    "industries": [
      "食品製造"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "オーストラリア向けOEMパートナー募集",
      "url": "https://sec.or.jp/hanro-kakudai/wp-content/uploads/2026/04/Australia_OEM.pdf",
      "publisher": "さっぽろ産業振興財団",
      "date": "2026-04"
    }
  },
  {
    "id": "pain-188",
    "kind": "pain",
    "title": "問い合わせが来ないサイト",
    "summary": "サイト制作会社は「情報が足りない」「デザインが古い」「技術や製品の良さが伝わらない」「問い合わせが来ない」を見直しの合図に挙げる。食品工場もまず情報の量から。",
    "industries": [
      "食品製造",
      "化粧品OEM"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "製造業ホームページリニューアル（イプロス）",
      "url": "https://mono.ipros.com/product/detail/2001035904",
      "publisher": "イプロス",
      "date": null
    }
  },
  {
    "id": "success-203",
    "kind": "success",
    "title": "店長ブログで法人の問い合わせ増",
    "summary": "近畿経産局の資料によると、和歌山の飲食企業はスマホ向けにサイトを直し、店長らがブログを書くようにしたところ、企業からの会食の問い合わせが増え、売上が前年比5％以上増えた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "現場の人がブログを書くと何が変わる？",
    "source": {
      "title": "生産性向上事例",
      "url": "https://www.kansai.meti.go.jp/3-2sashitsu/service/seisansei_jirei/waraiya.pdf",
      "publisher": "近畿経済産業局",
      "date": null
    }
  },
  {
    "id": "success-204",
    "kind": "success",
    "title": "公的なブログ枠で無料発信",
    "summary": "大阪産業局のビジネスマッチングブログは、中小企業が無料でブログを出せる仕組みで、問い合わせを増やしたい企業向けの説明会も開いている。自社サイトと併用できる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "ビジネスマッチングブログ説明会",
      "url": "https://orist.jp/dl/pdf/20231017BMB.pdf",
      "publisher": "大阪産業局ほか",
      "date": "2023-10"
    }
  },
  {
    "id": "buyer-215",
    "kind": "buyer",
    "title": "OEM先は仕様を決める力で選ぶ",
    "summary": "OEMは依頼側が仕様を決め、工場はその通りに作る。だから依頼側にも知識が要る。委託先の選び間違い、品質管理の甘さ、あいまいな契約がトラブルの元とされる。",
    "industries": [
      "食品製造",
      "化粧品OEM"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "仕様が決まっていなくても相談できます",
    "source": {
      "title": "OEM生産で失敗しないための委託先選定から品質管理・契約まで",
      "url": "https://www.theckb.com/archive/thorough-explanation-from-contractor-selection-to-quality-control-contract-to-avoid-failures-in-oem-production/",
      "publisher": "THE CKB",
      "date": null
    }
  },
  {
    "id": "pain-189",
    "kind": "pain",
    "title": "D2Cが陥りやすい3つの失敗",
    "summary": "海外のD2C事例では、速さを優先して独自性がなくなる、開発が終わらない、素材の品質を軽く見る、の3つが失敗につながると指摘されている。工場が止め役になれる場面。",
    "industries": [
      "食品製造",
      "化粧品OEM"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "D2Cの新商品、工場から見た失敗の型",
    "source": {
      "title": "Lessons from 10 D2C startups that partnered with OEM factories",
      "url": "https://hisoair.com/fr/lessons-from-10-d2c-startups-that-partnered-with-oem-factories/",
      "publisher": "Hisoair",
      "date": null
    }
  },
  {
    "id": "success-205",
    "kind": "success",
    "title": "SNSで応募が年3人→半年20人",
    "summary": "群馬の電気工事会社は、SNSで発信を続けた結果、求人の応募が年3人から半年で20人に増えたと発表した（会社の発表）。社員や地域とのつながりにも役立っているという。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "SNSを始めて半年、応募はどう変わった？",
    "source": {
      "title": "電気工事会社がSNSで変えた採用と会社の未来",
      "url": "https://prtimes.jp/main/html/rd/p/000000004.000180249.html",
      "publisher": "PR TIMES",
      "date": "2026"
    }
  },
  {
    "id": "success-206",
    "kind": "success",
    "title": "役員が踊るTikTokで説明会増",
    "summary": "兵庫の金属部品加工会社は2021年にTikTokを始め、役員や管理職が流行のダンスに本気で挑む動画で、2022年9月にフォロワー5万8千超。動画を見て説明会に来る学生が増えたという。",
    "industries": [
      "金属加工",
      "機械部品"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "うちの社員、こんな人たちです（動画つき）",
    "source": {
      "title": "TikTokで採用活動をする製造業",
      "url": "https://gentosha-go.com/articles/-/52849",
      "publisher": "幻冬舎ゴールドオンライン",
      "date": "2022"
    }
  },
  {
    "id": "success-207",
    "kind": "success",
    "title": "コメントには全部返す",
    "summary": "TikTokで採用につなげた金属部品加工会社は、見た人のコメントに必ず全部返信していた。「応援したくなる」と思われることが、応募の前の親しみにつながる。",
    "industries": [
      "金属加工"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "TikTokで採用活動をする製造業",
      "url": "https://gentosha-go.com/articles/-/52849",
      "publisher": "幻冬舎ゴールドオンライン",
      "date": "2022"
    }
  },
  {
    "id": "pain-190",
    "kind": "pain",
    "title": "バズっても応募が来るとは限らない",
    "summary": "採用支援会社は、TikTok採用は「バズれば応募が増える」施策ではないと指摘。誰に見せるか、何を投稿するか、プロフィールから応募までの道筋を設計する必要がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "TikTok採用",
      "url": "https://www.shopowner-support.net/hr/recruitment-measures/social-recruiting/tiktok-recruiting/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "success-208",
    "kind": "success",
    "title": "研修生に1日ついて回る動画",
    "summary": "ドイツの解説では、研修生の仕事に1日同行する形や、社員が仕事の魅力を語る短い動画が特に効くとされる。技術職では事実をそのまま分かりやすく見せるのがよいという。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "入社1年目の1日に密着",
    "source": {
      "title": "TikTok: How the industry finds skilled workers via social media",
      "url": "https://www.leuze-verlag.de/en/free-content-gt/tiktok-how-the-industry-finds-skilled-workers-via-social-media",
      "publisher": "Leuze Verlag",
      "date": null
    }
  },
  {
    "id": "question-294",
    "kind": "question",
    "title": "求職者は動画で何を見たい？",
    "summary": "候補者が知りたいのは、社内の雰囲気、上司の話し方、社員の表情、仕事の進め方、残業の実態、評価の考え方。文字では伝わりにくいこれらを動画で補うとよい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "YouTube採用の始め方",
      "url": "https://atsoho.com/blog/youtube-recruiting-video-planning-tips",
      "publisher": "atsoho",
      "date": null
    }
  },
  {
    "id": "success-209",
    "kind": "success",
    "title": "ショートと長尺で役割を分ける",
    "summary": "採用動画は、TikTokやリール、YouTubeショートで知ってもらい、長い動画で深く伝えるなど、媒体ごとに役割を分ける考え方がある。1本で全部伝えようとしない。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "採用動画ガイド",
      "url": "https://stock-sun.com/column/recruitment-video-guide/",
      "publisher": "STOCK SUN",
      "date": null
    }
  },
  {
    "id": "success-210",
    "kind": "success",
    "title": "見学で「知っている工場」になる",
    "summary": "静岡のオープンファクトリー関係者は、外への発信を早くから続けた町工場が採用でうまくいっていると話す。一般の人への見せ方を工夫すれば自社の雇用につながるという。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "工場を開けてみて分かったこと",
    "source": {
      "title": "現場見学で見せる町工場の底力",
      "url": "https://monoist.itmedia.co.jp/mn/articles/2311/07/news001.html",
      "publisher": "MONOist",
      "date": "2023-11"
    }
  },
  {
    "id": "trend-231",
    "kind": "trend",
    "official": true,
    "title": "県がオープンファクトリー参加社を募集",
    "summary": "滋賀県は、子どもや若者に自社の技術や製品の魅力を伝える場としてオープンファクトリーを進め、参加する事業者を募集している。単独で開くより始めやすい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "滋賀県オープンファクトリー推進事業 参加事業者の募集",
      "url": "https://www.pref.shiga.lg.jp/fa00/23975.html",
      "publisher": "滋賀県",
      "date": null
    }
  },
  {
    "id": "trend-232",
    "kind": "trend",
    "official": true,
    "title": "工場見学を人材確保策に位置づけ",
    "summary": "和歌山県は、工場見学や体験で従業員と来た人の交流が生まれ、人材の育成と確保につながるとして事業を進めている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "オープンファクトリー事業の概要",
      "url": "https://www.pref.wakayama.lg.jp/prefg/061000/d00221860_d/fil/gaiyousiryo.pdf",
      "publisher": "和歌山県",
      "date": null
    }
  },
  {
    "id": "success-211",
    "kind": "success",
    "title": "見学会の参加者が正社員に",
    "summary": "川崎市の工場見学会の案内では、参加した企業に正社員として採用された卒業生がいたと紹介されている。生徒が現場を見ることが応募先選びにつながる一例。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "川崎市 工場見学会の案内",
      "url": "https://www.pen-kanagawa.ed.jp/mukainooka-th/teiji/shinro/news/2017f/documents/s47.pdf",
      "publisher": "神奈川県立高校",
      "date": "2017"
    }
  },
  {
    "id": "success-212",
    "kind": "success",
    "title": "高校時代の会社見学で入社を決めた",
    "summary": "労働局の資料で、秋田の工場の社員は高校生のときの会社見学で現場を見て、雰囲気になじめると感じて入社したと話す。見学は応募のきっかけになる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "会社見学でここを見てください",
    "source": {
      "title": "秋田労働局 若手社員の声",
      "url": "https://jsite.mhlw.go.jp/akita-roudoukyoku/content/contents/002794261.pdf",
      "publisher": "秋田労働局",
      "date": null
    }
  },
  {
    "id": "success-213",
    "kind": "success",
    "title": "HPのひと言で入社を決めた",
    "summary": "山梨の工場の若手社員は、高卒後にものづくりの仕事を探していて、ホームページの「金属加工のプロ集団」という言葉に興味を持って入社した。短い言葉でも効く。",
    "industries": [
      "金属加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "山梨労働局 事業所紹介",
      "url": "https://jsite.mhlw.go.jp/yamanashi-roudoukyoku/content/contents/002717634.pdf",
      "publisher": "山梨労働局",
      "date": null
    }
  },
  {
    "id": "success-214",
    "kind": "success",
    "title": "見学とインターン含む4段階で採用",
    "summary": "大田区の町工場は、工場見学やインターンを含む4段階の新卒採用を行い、時間をかけることで定着率を上げたと説明している。急がない採用が辞めない採用になる。",
    "industries": [
      "切削加工",
      "金属加工"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "当社の採用は4ステップ、その理由",
    "source": {
      "title": "町工場の新卒採用",
      "url": "https://newswitch.jp/index.php/p/13868",
      "publisher": "ニュースイッチ",
      "date": null
    }
  },
  {
    "id": "success-215",
    "kind": "success",
    "title": "人間関係を求人票の強みに",
    "summary": "神奈川の製作所の求人票は、人間関係や職場の空気を自社の強みとして前面に出している。給与や設備で大手に勝てなくても書ける強みがある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "ハローワーク求人事例",
      "url": "https://jsite.mhlw.go.jp/kanagawa-hellowork/content/contents/41.pdf",
      "publisher": "神奈川労働局",
      "date": null
    }
  },
  {
    "id": "term-345",
    "kind": "term",
    "title": "ユースエール認定",
    "summary": "若者の採用・育成に積極的で雇用管理がよい、従業員300人以下の中小企業を国が認める制度。直近3年の新卒等の離職率20％以下、月平均残業20時間以下などが基準。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ユースエール認定を取りました",
    "source": {
      "title": "ユースエール認定制度",
      "url": "https://jsite.mhlw.go.jp/toyama-roudoukyoku/hourei_seido_tetsuzuki/shokugyou_shoukai/hourei_seido/_119983.html",
      "publisher": "富山労働局",
      "date": null
    }
  },
  {
    "id": "question-295",
    "kind": "question",
    "title": "ユースエール認定で何が得？",
    "summary": "ハローワークでの重点的なPRや認定企業向け面接会への参加、認定マークの使用、助成金の優遇、日本政策金融公庫の低利融資、公共調達での加点などがある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "ユースエール認定",
      "url": "https://jsite.mhlw.go.jp/niigata-hellowork/youthyell_001.html",
      "publisher": "新潟労働局",
      "date": null
    }
  },
  {
    "id": "trend-233",
    "kind": "trend",
    "official": false,
    "title": "ユースエールは製造業が多い",
    "summary": "2017年の報道では、ユースエール認定企業が200社を超え、業種別では製造業が61社で最も目立った。今の数は公式サイトで確かめたい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "ユースエールが200社超える",
      "url": "https://www.rodo.co.jp/news/16175/",
      "publisher": "労働新聞社",
      "date": "2017"
    }
  },
  {
    "id": "term-346",
    "kind": "term",
    "title": "ものづくりマイスター",
    "summary": "1級技能士相当以上の熟練者が、中小企業や学校で若い技能者に実技を教える国の制度。令和7年度の要領では建設・製造・IT系などに分野が広がった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "ベテランがマイスターに認定されました",
    "source": {
      "title": "令和7年度 ものづくりマイスター認定申請要領",
      "url": "https://waza.mhlw.go.jp/monodukuri/r7-mm_youryou.pdf",
      "publisher": "厚生労働省",
      "date": "2025"
    }
  },
  {
    "id": "question-296",
    "kind": "question",
    "title": "マイスター派遣の費用は？",
    "summary": "派遣に必要な費用は、事業で決めた範囲内で地域技能振興コーナー（厚生労働省の事業）が負担する。熟練者が辞めて技を伝えられない会社が相談先にできる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "ものづくりマイスター派遣",
      "url": "https://monozukuri-meister.mhlw.go.jp/mm/mm/contents/haken/30",
      "publisher": "厚生労働省",
      "date": null
    }
  },
  {
    "id": "question-297",
    "kind": "question",
    "title": "マイスターはどこに頼む？",
    "summary": "申し込みは各都道府県の地域技能振興コーナーが窓口。新潟県では県職業能力開発協会が受け付けている。教わる人は主に若手だが、習熟度によっては35歳以上も対象になる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "ものづくりマイスター制度",
      "url": "https://jsite.mhlw.go.jp/niigata-hellowork/monodukuri-meister.html",
      "publisher": "新潟労働局",
      "date": null
    }
  },
  {
    "id": "success-216",
    "kind": "success",
    "title": "マイスター活用の好事例集",
    "summary": "厚生労働省は、中小企業がものづくりマイスターを使って若手を育てた例を好事例集にまとめている。教わった若手の声は採用ページの材料にもなる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "平成28年度 ものづくりマイスター活用好事例集（企業編）",
      "url": "https://monozukuri-meister.mhlw.go.jp/mm/mm/contents/haken/28jireishu-kigyou-hen/",
      "publisher": "厚生労働省",
      "date": "2016"
    }
  },
  {
    "id": "trend-234",
    "kind": "trend",
    "official": true,
    "title": "育成就労の対象は17分野",
    "summary": "入管庁のQ&Aでは、育成就労の対象分野は2026年1月23日に閣議決定した分野別運用方針で決まったとされる。制度の開始は2027年4月1日。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "育成就労制度Q&A",
      "url": "https://www.moj.go.jp/isa/applications/faq/ikusei_qa_00002.html",
      "publisher": "出入国在留管理庁",
      "date": "2026"
    }
  },
  {
    "id": "trend-235",
    "kind": "trend",
    "official": true,
    "title": "工業製品製造業の育成就労基準",
    "summary": "法務省・厚労省・経産省は2026年6月、工業製品製造業分野で育成就労を受け入れる基準を運用要領の別冊にまとめた。町工場が受け入れる前に読む資料。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "育成就労で外国人を迎える準備",
    "source": {
      "title": "特定の分野に係る育成就労制度運用要領（工業製品製造業分野）",
      "url": "https://www.moj.go.jp/isa/content/001463736.pdf",
      "publisher": "法務省・厚生労働省・経済産業省",
      "date": "2026-06"
    }
  },
  {
    "id": "question-298",
    "kind": "question",
    "title": "育成就労は何を目指す制度？",
    "summary": "運用要領では、育成就労産業分野で3年間働きながら、特定技能1号の水準の人材に育てることと、人材の確保を目的にしている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "育成就労制度 運用要領",
      "url": "https://www.moj.go.jp/isa/content/001467946.pdf",
      "publisher": "出入国在留管理庁・厚生労働省",
      "date": "2026-08"
    }
  },
  {
    "id": "trend-236",
    "kind": "trend",
    "official": false,
    "title": "航空と自動車運送は育成就労の外",
    "summary": "解説サイトでは、特定技能の19分野のうち国内での育成になじまない航空と自動車運送業を除いた17分野が育成就労の対象。2025年に加わったリネン、物流倉庫、資源循環も入る。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "育成就労の対象分野一覧",
      "url": "https://tomohata.jp/guide/ikusei-shuro-bunya",
      "publisher": "トモハタ",
      "date": "2026"
    }
  },
  {
    "id": "trend-237",
    "kind": "trend",
    "official": true,
    "title": "分野別の運用要領は順次改正中",
    "summary": "入管庁の育成就労制度のページでは、分野ごとの運用要領が順に公表・改正されている。2026年10月には鉄道と木材産業の分野が改正された。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "育成就労制度",
      "url": "https://www.moj.go.jp/isa/applications/index_00005.html",
      "publisher": "出入国在留管理庁",
      "date": "2026-10"
    }
  },
  {
    "id": "trend-238",
    "kind": "trend",
    "official": true,
    "title": "小さい職場ほど3年で辞めやすい",
    "summary": "厚労省の新規学卒者の離職状況では、規模の小さい事業所ほど3年以内の離職率が高く、5人未満では高卒・大卒とも半数を超える。小さな工場は定着策を書く意味が大きい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "小さな工場で若手が辞めないためにしていること",
    "source": {
      "title": "新規学卒就職者の離職状況",
      "url": "https://www.mhlw.go.jp/stf/houdou/0000177553_00011.html",
      "publisher": "厚生労働省",
      "date": null
    }
  },
  {
    "id": "pain-191",
    "kind": "pain",
    "title": "頼れる人がいないと辞めたくなる",
    "summary": "職場に気軽に話せる人がいないと、新人は「ここに居場所がない」と感じ、離職を考えやすくなる。メンター制度や1on1で孤立を防ぐことが勧められている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "新人に先輩がつく当社の育て方",
    "source": {
      "title": "新入社員の早期離職と対策",
      "url": "https://biz.moneyforward.com/payroll/basic/123619/",
      "publisher": "マネーフォワード",
      "date": "2026-07"
    }
  },
  {
    "id": "pain-192",
    "kind": "pain",
    "title": "評価があいまいだと辞める",
    "summary": "評価の基準が見えないと不公平感が生まれ、退職のきっかけになるとされる。技能が上がると何が変わるかを見せることが、定着と採用の両方に効く。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "人事評価と離職",
      "url": "https://biz.moneyforward.com/payroll/basic/123363/",
      "publisher": "マネーフォワード",
      "date": "2026-07"
    }
  },
  {
    "id": "question-299",
    "kind": "question",
    "title": "入社前に何を正直に伝える？",
    "summary": "早期離職の主な原因は入社前後のずれと労働環境への不満。採用の段階で、労働条件と仕事の実態（きつい点も）を正直に伝えると入社後のギャップが減る。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "新入社員の早期離職と対策",
      "url": "https://biz.moneyforward.com/payroll/basic/123619/",
      "publisher": "マネーフォワード",
      "date": "2026-07"
    }
  },
  {
    "id": "trend-239",
    "kind": "trend",
    "official": false,
    "title": "若手の改善提案で定着を図る",
    "summary": "愛知県は、若手社員が職場の改善策を提案するなどの定着の取り組みを事例集にまとめた（2025年版は専門家を派遣した12社の例）。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "若手から改善策提案 職場定着へ事例集",
      "url": "https://www.rodo.co.jp/news/193839/",
      "publisher": "労働新聞社",
      "date": "2025"
    }
  },
  {
    "id": "success-217",
    "kind": "success",
    "title": "塗装・溶射会社の定着好事例",
    "summary": "愛知県の若者職場定着支援事業では、従業員45人ほどの金属製品の塗装・溶射会社の取り組みが好事例として紹介された（2019年度）。",
    "industries": [
      "塗装",
      "表面処理"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "若者職場定着取組好事例紹介",
      "url": "https://www.pref.aichi.jp/uploaded/attachment/325927.pdf",
      "publisher": "愛知県",
      "date": "2019"
    }
  },
  {
    "id": "term-347",
    "kind": "term",
    "title": "若者応援宣言企業",
    "summary": "若者の採用・育成に積極的な中小企業が、決められた基準をすべて満たすと宣言できる国の制度。ハローワークの求人で情報を詳しく出せる。ユースエールより手前の段階。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "article_idea",
      "writer_hint"
    ],
    "source": {
      "title": "若者応援宣言企業",
      "url": "https://jsite.mhlw.go.jp/mie-roudoukyoku/var/rev0/0115/2224/2015105141831.pdf",
      "publisher": "三重労働局",
      "date": "2015"
    }
  },
  {
    "id": "question-300",
    "kind": "question",
    "title": "求人票の字数が足りない",
    "summary": "高卒の求人票は書ける字数が限られる。青森県の資料は、採用パンフレットや自社サイトで魅力を補うよう勧める。求人票から自社サイトへ来た人向けのページを用意したい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "高卒採用の手引き",
      "url": "https://www.pref.aomori.lg.jp/soshiki/kodomo/wakamono/files/R4recruit.pdf",
      "publisher": "青森県",
      "date": "2022"
    }
  },
  {
    "id": "question-301",
    "kind": "question",
    "title": "高校生は求人票のどこを見る？",
    "summary": "高校生は仕事内容の具体的な書き方をよく見る。他社に勝る点がなければ、若手が育つ環境、残業の少なさ、定着率から探し、例や数字を添えて書くよう勧められている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "question_example",
      "writer_hint"
    ],
    "source": {
      "title": "高卒採用の手引き",
      "url": "https://www.pref.aomori.lg.jp/soshiki/kodomo/wakamono/files/R4recruit.pdf",
      "publisher": "青森県",
      "date": "2022"
    }
  },
  {
    "id": "pain-193",
    "kind": "pain",
    "title": "応募前の職場見学で面接はNG",
    "summary": "高卒の応募前の職場見学は選考の場ではない。会社説明にとどめ、面接や試験と思われる質問や、内定と受け取られる発言は避けるよう求められている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "高卒求人 確認事項",
      "url": "https://jsite.mhlw.go.jp/kanagawa-hellowork/content/contents/002212043.pdf",
      "publisher": "神奈川労働局",
      "date": null
    }
  },
  {
    "id": "pain-194",
    "kind": "pain",
    "title": "募集人数は「若干名」では弱い",
    "summary": "大阪の資料では、新卒の募集は「若干名」ではなく、大学生○名・高校生○名のような具体的な採用計画を立てるよう求めている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "新規学校卒業予定者の募集について",
      "url": "https://jsite.mhlw.go.jp/osaka-hellowork/content/contents/002231539.pdf",
      "publisher": "大阪労働局",
      "date": null
    }
  },
  {
    "id": "pain-195",
    "kind": "pain",
    "title": "社員インタビューが応募に効かない",
    "summary": "入社理由などのプロフィールを並べるだけのインタビューは応募につながりにくい。求職者は「仕事が合うか」「未経験でもついていけるか」を知りたい。そこに答える中身にする。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "articleIdea": "未経験で入った先輩、最初の3か月",
    "source": {
      "title": "採用サイトの社員インタビュー記事",
      "url": "https://www.shopowner-support.net/hr/recruitment-measures/recruit-site/recruitment-site-interview-article/",
      "publisher": "ショップオーナーサポート",
      "date": null
    }
  },
  {
    "id": "pain-196",
    "kind": "pain",
    "title": "採用サイトの目的が「応募数」だけ",
    "summary": "採用サイトの目的を「応募を増やす」とだけ置くと中身の設計が粗くなる。どの職種のどんな人に、どの段階で何をしてほしいかを先に決めるべきだという指摘がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "shiori_tip",
      "writer_hint"
    ],
    "source": {
      "title": "採用サイトリニューアル",
      "url": "https://digital-gorilla.co.jp/examples/recruit-site-renewal/",
      "publisher": "デジタルゴリラ",
      "date": null
    }
  }
];
