# AIO：このサービスが目指すこと

最終更新：2026-10-25（次の見直し：毎週月曜の定期更新。下の「更新の決まり」）

AIO（AI検索に紹介されるための工夫）は、このサービスを作るときの土台の考え方です。画面、質問、AIへの指示、点検は、すべてここに合わせます。AI検索の仕組みは日々変わるため、このファイルは常に最新に保ちます（田村さん、2026-10-23）。

## なぜAIOが必要か

**AI時代に、ウェブサイトで売上を上げるため。**（田村さん、2026-10-23）

- お客様は Google で検索するだけでなく、AI（Google の AI による概要、ChatGPT など）にも相談するようになった
- AIは答えの中で、会社や記事を紹介する。紹介された会社に問い合わせが来る
- だから、AIに「この地域でこのことなら、この会社」と紹介される記事を、顧客が自分で書き続けられるようにする

## いま分かっている公式の考え方（2026-10-25 時点）

公式のページは、この作業環境からは直接開けなかった。下は検索結果と報道からの要約で、正確な文言は未確認。

**Google（AIによる概要・AIモード）**
- 公式の説明ページは「AI features and your website」（https://developers.google.com/search/docs/appearance/ai-features）。AIによる概要は関連サイトへのリンクを出し、1つの質問を関連する複数の検索に広げて（クエリ・ファンアウト）答えを作る。通常の検索より役に立つときだけ出る。SEOの基本はAIの機能にもそのまま当てはまる
- 2026年5月15日に、生成AIの機能に向けた最適化の案内が出た（その後も更新）。要点は「AIへの最適化も検索への最適化であり、SEOのまま」。検索に出られる状態（クロールでき、スニペットを出せる）と、独自の内容、画像と動画の質が大事
- やらなくてよいと明言されたこと：llms.txt（Google検索は使わない）、記事を細かく区切ること（理想の長さは無い）、AI専用の構造化データ、不自然な言及集め（スパムとして除かれる）
- 2026年6月の報道：AIの機能に自分のサイトを使わせるかを選べる設定を、Search Console で試している。使わせない場合、AIの機能からの表示と流入は無くなる。英国の競争当局（CMA）の命令を受けて英国から先に始まり（2026年6月）、2026年8月31日に世界中に広がったと報道されている（公式の確認は未確認）。対象は AIによる概要・AIモード・Discover のAIによる概要で、Gemini アプリは対象外（報道）
- 2026年6月3日の公式ブログ：Search Console に「生成AIの掲載結果」のレポートができた。AIによる概要・AIモードでの表示回数、ページ、国、日付が見られる（2026年5月18日以降のデータ）。クリック数と検索語は無い。はじめは一部のサイトだけだったが、2026年8月31日にすべてのサイトに広がったと公式ブログに追記された（報道で確認）。データが少ないサイトには出ないことがある。Search Console の API ではまだ取り出せない（報道）
- 2026年10月15日の公式の発表（Google の Keyword ブログ「More ways to connect with the web from Search」）：AIモードとAIによる概要で、文中のリンクをより上に、より多く出す。答えの終わりのリンクに画像を付ける。手続きなどで「公式の場所」になる1〜2サイトを答えの上に出す枠を試験中。ニュースの記事の並び（カルーセル）を国と言語を広げて出す。「優先するソース」の利用は年初から7倍超。流入が増えたかの数字は出していない（公式ページは未読、報道で確認）

**OpenAI（ChatGPT の検索）**
- ChatGPT の検索に出るには、サイトが OAI-SearchBot（検索用のクローラー）を拒否していないこと。学習用の GPTBot とは別に設定できる。出る位置は保証されない。順位の付け方は公開されていない
- 2026年10月時点で、引用の仕方を変えたという公式の発表は見つからなかった。調査会社の集計（Ahrefs など、2026年3月と9月の比較）では、Reddit や Wikipedia の引用が減り、一次調査・公的機関・実際に試した記事の引用が増えたとされる。調査会社の数字で、公式の確認は無い（報道・未確認）

**Perplexity・Claude**
- 2026年10月に、引用の条件が変わったという公式の発表は見つからなかった（未確認）

**このサービスへの意味**
- 小手先の技（専用ファイル、専用の目印、細切れの記事）より、その会社にしかない体験・数字・答えを、読む人に役立つ形で書くことが一番の近道。下の「材料」はこの考え方に沿っている
- Google も ChatGPT も、引用先をはっきり見せる方向に動いている（Google は2026年10月にリンクを上に出すと発表）。「この会社にしかない体験」と「問い合わせできる次の一歩」が、紹介されたあとにクリックと売上につながる
- 顧客のサイトの設定（robots.txt で Googlebot や OAI-SearchBot を拒否していないか、ページがクロールできるか）は、コタムが最初に確かめる項目にする（チェック項目の画面は未作成）

## AIに紹介される記事の材料

その会社の記事が紹介されるために、AIが紹介しやすい記事の材料を8つにまとめた。画面では、質問ごとに「どの材料のために聞いているか」を伝える（src/prototype/growth.ts の AIO_POINTS）。

| 材料 | 中身 | 聞いている質問 |
|---|---|---|
| 体験（一次情報） | その会社にしかない実際の相談、対応、結果。一般論はAIに紹介されにくい | ヒアリング「選ばれる理由」、記事「どんな相談があったか」 |
| 具体的な数字 | 価格、期間、件数、年数。AIが答えに引用しやすい | 記事「結果はどうだったか」、深掘りの質問 |
| 誰が・どこで | 会社名、地域、資格、事業の中身。AIが「この地域ならこの会社」と結び付けやすい | ヒアリング「お仕事」「地域」 |
| 質問と答え | お客様がAIに聞く質問は、ふだん会社が聞かれている質問と同じ。そのまま答える | ヒアリング「お客様」「よく聞かれる質問」、記事「どう答えたか」 |
| 比べる材料 | 選び方、違い、頼み先ごとの特徴。迷っている人の質問に使われる | ヒアリング「比べられる会社」 |
| プロの知見 | 注意点、よくある誤解。専門家だから書ける信頼の材料 | 記事「よくある誤解」 |
| 次の一歩 | 読んだ人がすぐ問い合わせできる出口。売上につながる | ヒアリング「売りたいサービス」、記事「次に何をしてほしいか」 |
| 信頼 | 大げさな言葉や根拠のない言い切りをしない。正確さが紹介される近道 | ヒアリング「使ってほしくない言葉」 |

記事の組み立て（柱の記事と周りの記事＝ピラーとクラスター）も、「この会社はこのテーマにくわしい」と伝えるためのAIOの工夫の1つ。これだけにこだわらない。

## 作るときの約束

- 質問を増やすときは、どの材料のためかを決めてから足す。理由を言えない質問は足さない
- 顧客には「AIOのためにくわしく聞いている。AI時代に売上を上げるため」を、明るく、励ましながら伝える。答えるたびに、集まった材料を見せる
- 材料が無いのに、数字や実績をAIに作らせない（作り話はAIOにも信頼にも逆効果）
- 点検役（Claude）は、この8つの材料が記事に入っているかを見る。足りなければ、顧客に追加で聞く質問を返す（T5-4）
- 効果は、第2段階から Search Console の表示回数と検索語で確かめる。Google のAIの機能での表示回数は、Search Console の「生成AIの掲載結果」で見られるようになった（2026年8月31日から全サイト。クリック数と検索語は無く、API でも取り出せない）。ChatGPT などでの紹介回数を直接測る方法は未確認

## 更新の決まり

- 毎週月曜に、AI検索（Google、ChatGPT、Perplexity、Claude など）の公式の発表と信頼できる報道を確かめ、変わったことをこのファイルに書き足して PR を作る（定期の作業として設定済み）
- 書き足すときは、日付・出典・「公式か報道か」を必ず書く。確かめられないことは「未確認」と書く
- 材料や質問の考え方が変わる場合は、docs/DECISIONS.md に理由を書き、src/prototype/growth.ts の AIO_POINTS と質問も合わせて直す
- 対策会社の宣伝記事だけを根拠にしない

## 更新履歴

| 日付 | 変えたこと | 出典 |
|---|---|---|
| 2026-10-23 | 初版。なぜAIOか、8つの材料、作るときの約束 | 田村さんの意図、下の参考 |
| 2026-10-23 | Google の公式の考え方（2026年5月の案内、やらなくてよいこと）と ChatGPT の検索の条件を追加。更新の決まりを追加 | 下の参考（検索結果と報道。公式ページは未読） |
| 2026-10-25 | Google の2026年10月15日のリンク表示の変更、Search Console の生成AIのレポート（2026年6月）、AIを使わせない設定の範囲を追加。ChatGPT・Perplexity・Claude は公式の変化なし（調査会社の集計は未確認として記載）。8つの材料は変えない | 公式：Google Keyword ブログ、Search Central ブログ。報道：9to5Google、PPC Land、Tech Times、MarketingProfs（下の参考） |

## 参考

- Google「More ways to connect with the web from Search」（公式、2026-10-15）：https://blog.google/products-and-platforms/products/search/updates-ai-mode-overviews-explore-web/
- 同じ発表の報道：https://9to5google.com/2026/10/15/google-ai-mode-overviews-links/ 、https://ppc.land/google-pushes-links-higher-in-ai-answers-as-preferred-sources-use-rises-7x/
- Search Console の生成AIのレポート（公式、2026-06-03）：https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports
- Search Console の生成AIのレポートとAIを使わせない設定が世界に広がった報道（2026-08-31）：https://www.searchenginejournal.com/google-search-console-ai-reports-rolled-out-worldwide/587836/
- AIを使わせない設定の報道（2026-06）：https://www.techtimes.com/articles/317979/20260608/google-ai-overviews-opt-out-hits-search-console-gemini-excluded-publishers-weigh-trade-offs.htm 、https://digiday.com/media/googles-ai-opt-out-leaves-publishers-with-a-choice-they-cant-safely-use/
- ChatGPT の引用先の変化（調査会社の集計の紹介）：https://www.marketingprofs.com/opinions/2026/56192/ai-update-october-16-2026-ai-news-and-views-from-the-past-week
- 2026年6月の Google の案内の報道：https://www.digitalinformationworld.com/2026/06/google-says-ai-overviews-has-over-25.html
- Google「AI features and your website」：https://developers.google.com/search/docs/appearance/ai-features
- 2026年5月の Google の案内の報道：https://www.searchenginejournal.com/googles-new-ai-search-guide-calls-aeo-and-geo-still-seo/575026/ 、https://www.practicalecommerce.com/google-says-ai-optimization-is-just-seo
- ChatGPT の検索とクローラーの解説（宣伝を含む）：https://www.anagram.ai/blog/gptbot-explained-how-chatgpt-crawls-sees-and-cites-your-site-in-2026
- 中小企業向けの一次情報の考え方（対策会社の記事。効果の検証は無い）：https://yoshikazunomori.com/?p=9848
