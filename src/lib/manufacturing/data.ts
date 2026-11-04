// 製造業の知識表（データ）。2026-11-04 に公的機関・業界メディア・調査の公開情報を検索で集め、要点だけを自分の言葉でまとめた。
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
      "研磨"
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
      "研磨"
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
      "研磨"
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
      "研磨"
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
    "title": "下請法が取適法に（2026年1月施行）",
    "summary": "下請法が改正され、2026年1月1日から「中小受託取引適正化法（取適法）」として施行。発注側と受注側が対等な立場で価格を決め、取引全体で価格転嫁を根付かせるのがねらい。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "official": true,
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
    "title": "「下請」の呼び方が変わった",
    "summary": "取適法では「親事業者」は「委託事業者」、「下請事業者」は「中小受託事業者」と呼ぶ。記事でも新しい用語に合わせると、取引のルールを理解している会社だと伝わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "official": true,
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
    "title": "取適法は従業員数でも対象に",
    "summary": "取適法では資本金に加えて従業員数の基準ができ、運送の委託も対象に加わった。これまで対象外だった取引先との関係も、ルールの中に入る可能性がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": true,
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
    "title": "一方的な代金決定や手形払いが禁止に",
    "summary": "取適法では、協議に応じず一方的に代金を決めることや、手形での支払いが禁止された。受注側は「価格の相談ができる」「現金で受け取れる」ことを前提に交渉できる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": true,
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
    "title": "約束手形の廃止に向け支払い適正化を要請",
    "summary": "公取委と中小企業庁は2026年9月、約束手形の利用廃止を見据え、支払いサイトの短縮や現金払いへの切り替えを業界団体などに求めた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "official": true,
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
    "title": "2027年4月から「支払告示」施行",
    "summary": "独占禁止法の新しい告示が2027年4月に施行予定。取適法の対象外の取引でも、受け取ってから60日を超えて代金を払わないことを禁じる趣旨。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "official": true,
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
    "title": "勧告の多くは製造委託の取引",
    "summary": "公取委によると、2025年度の取適法（下請法）に基づく勧告は39件で、うち37件が製造委託など。不当な経済上の利益の提供要請が最も多かった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "official": true,
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
    "title": "支払い遅延で中企庁が措置請求",
    "summary": "2026年9月、中小企業庁は支払いが遅れた代金の支払いを求め、ある製造業者について公取委に措置請求した。支払期日を守ることは取引先の信用に直結する。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "official": true,
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
    "title": "価格転嫁率は53.5%（2025年9月）",
    "summary": "2025年9月の価格交渉促進月間の調査で、価格転嫁率は53.5%。労務費の転嫁率が初めて50%に届いた。改善傾向だが、まだ道半ばとされる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": true,
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
    "title": "価格転嫁率54.2%、交渉実施は9割",
    "summary": "2026年3月の調査では、価格転嫁率54.2%、価格交渉が行われた割合は90.7%。原材料費55.7%、労務費50.0%、エネルギー48.9%の転嫁率だった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": true,
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
    "title": "発注者リストと都道府県別の転嫁率",
    "summary": "中小企業庁は調査結果をもとに、発注者ごとの評価リストや都道府県別の転嫁率を公表している。地域による差は20%以上ある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "shiori_tip"
    ],
    "official": true,
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
    "title": "労務費転嫁の指針と12の行動",
    "summary": "内閣官房と公取委の指針は、発注者・受注者・双方がとるべき12の行動を示す。受注側は最低賃金など公表資料を根拠に、自分から希望額を示すことが勧められている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": true,
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
    "title": "最低賃金、2025年度は66円上げ",
    "summary": "2025年度の最低賃金は全国加重平均で1121円、66円の引き上げで目安制度が始まって以来最大と報じられた。人件費が上がる根拠として取引先への説明に使える。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "official": false,
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
    "title": "最低賃金、2026年度は1177円へ",
    "summary": "2026年度の最低賃金は全国加重平均1177円（56円増）となり、過去2番目の上げ幅と伝えられている。10月以降に都道府県ごとに順次発効。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": false,
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
    "title": "2026年春闘、中小は4.69%",
    "summary": "連合の最終集計で2026年春闘の賃上げ率は5.01%、300人未満の中小組合は4.69%だった。同じ業種でも価格転嫁の可否で差が出ていると指摘された。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": false,
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
    "title": "人手不足倒産が3年連続最多",
    "summary": "帝国データバンクによると、2025年の人手不足倒産は427件で3年連続の過去最多。従業員の退職がきっかけの倒産も増え、製造業も初めて20件を超えた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": false,
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
    "title": "外国人労働者257万人、製造業が最多",
    "summary": "2025年10月末の外国人労働者は257万人余りで過去最多と報じられた。業種別では製造業が約4分の1で最も多い。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": false,
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
    "title": "技能実習は2027年4月に育成就労へ",
    "summary": "外国人材の新制度「育成就労」が2027年4月に始まり、技能実習制度は廃止されると報じられた。目的が技能移転から人材の育成と確保に変わる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": false,
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
    "title": "日米関税合意で税率15%に",
    "summary": "2025年7月、日米は関税交渉で合意し、相互関税を15%、日本車への関税も合計15%にする内容と報じられた。輸出企業の取引先を通じて影響が及ぶ。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "official": false,
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
    "title": "米大統領令で自動車関税15%へ",
    "summary": "2025年9月、米大統領が日本車の関税を27.5%から15%に下げる大統領令に署名したと報じられた。自動車部品の受注見通しに関わる。",
    "industries": [
      "機械部品",
      "金属加工"
    ],
    "useFor": [
      "writer_hint"
    ],
    "official": false,
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
    "title": "米最高裁が相互関税を違法と判断",
    "summary": "2026年2月、米最高裁はIEEPAに基づく関税を違法と判断したと報じられた。鉄鋼・自動車などの232条関税は別扱いで、関税の先行きはなお不透明。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "official": false,
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
    "title": "関税でマイナス影響は約35%",
    "summary": "日本政策金融公庫の2025年4〜6月期の特別調査で、米関税で「マイナスの影響」と答えた中小企業は34.9%。対策は経費削減や価格転嫁が多かった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": false,
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
    "title": "関税と物価高が中小の経営を揺さぶる",
    "summary": "日刊工業新聞は2025年版中小企業白書を紹介し、米関税政策と物価高の長期化が中小企業の経営基盤を揺さぶっていると伝えた。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "official": false,
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
    "title": "2026年版白書のテーマは「稼ぐ力」",
    "summary": "2026年版の中小企業白書は4月に閣議決定。生産性を上げる取り組みや経営者の基本知識（経営リテラシー）、企業同士の連携による事業の維持がテーマ。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": true,
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
    "title": "省力化投資補助金（一般型）の公募続く",
    "summary": "ロボットやIoTなど、現場に合わせた省力化設備の導入を支援する補助金。2026年も一般型の公募が複数回行われていると伝えられている。次回日程は公式で確認が必要。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "official": false,
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
    "title": "ものづくり補助金が新事業進出と統合",
    "summary": "ものづくり補助金と新事業進出補助金が一本化され「新事業進出・ものづくり商業サービス補助金」に。2026年6月に第1回公募が始まった。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": true,
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
    "title": "取引先からの脱炭素要請は約2割",
    "summary": "日本商工会議所などの2025年度調査で、取引先から脱炭素への対応を求められた中小企業は約2割。支援を受けているのはその3割ほどにとどまる。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": false,
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
    "title": "排出量取引制度が2026年度に本格稼働",
    "summary": "国の排出量取引制度（GX-ETS）が2026年度から本格稼働。CO2を多く出す大企業が対象で、その取引先にも排出量の把握を求める動きが広がる可能性がある。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "official": true,
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
    "title": "BCPの計画認定で税の優遇",
    "summary": "事業継続力強化計画の認定を受けると、防災・減災設備の特別償却などの支援がある。税制の対象は2027年3月末までの認定。取引先へのBCP説明にも使える。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "official": true,
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
    "title": "技能五輪全国大会は愛知で開催",
    "summary": "2025年10月、第63回技能五輪全国大会が愛知で開かれ、42職種に約1000人が参加。若手の技能を発信する機会として、人材育成の記事に使える。",
    "industries": [
      "all"
    ],
    "useFor": [
      "article_idea",
      "writer_hint"
    ],
    "official": true,
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
    "title": "技能五輪国際大会、2028年は愛知",
    "summary": "2026年9月に上海で第48回技能五輪国際大会が開かれ、日本から64人が出場。2028年の国際大会は愛知県で開かれる予定。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "official": true,
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
    "title": "製造業の生成AI導入は約65%",
    "summary": "MONOistの調査で製造業の約65%が生成AIを導入済みとされた一方、従業員10人未満の企業では導入が1割以下という調査も紹介されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": false,
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
    "title": "無料AIの利用で情報流出に注意",
    "summary": "東京商工会議所の調査で、生成AIを使う中小企業の4割強が無料版のみを利用していると報じられた。図面や顧客情報を入力する際の管理が課題。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": false,
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
    "title": "大手で品質不正の疑いが判明",
    "summary": "2026年5月、大手モーターメーカーで顧客の承認なしに材料や工程を変更した疑いが1000件超あると報じられた。変更管理と記録の大切さが改めて注目されている。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint",
      "article_idea"
    ],
    "official": false,
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
    "title": "電気・ガス料金の補助は時期限定",
    "summary": "国の電気・ガス料金補助は冬の一部期間に限って実施されてきた。補助がない月は負担が増えるため、省エネやエネルギー費の価格転嫁が引き続き課題。",
    "industries": [
      "all"
    ],
    "useFor": [
      "writer_hint"
    ],
    "official": false,
    "source": {
      "title": "電気・ガス料金補助、3カ月で約7000円の負担減 26年1〜2月に重点",
      "url": "https://www.nikkei.com/article/DGXZQOUA213RP0R21C25A1000000/",
      "publisher": "日本経済新聞",
      "date": "2025-11"
    }
  }
];
