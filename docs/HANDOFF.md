# HANDOFF：引き継ぎ

作業を終えるたびに、一番上に新しい記録を追加する。未コミットの変更を残したまま相手に切り替えない。

## 記録の書式

```
### 2026-10-22 CC（Claude、プロジェクトのスレッド）その4
- ブランチ / コミット：claude/project-thread-iawszb（claude/project-thread-g8uiym の上）
- 変更点：文章の既定を OpenAI に変更。src/lib/ai/providers/openaiText.ts（Responses API を HTTP で呼ぶ。JSONで返させ、store: false）。config.ts に TEXT_PROVIDER（openai／anthropic）を追加。.env.example、docs/AI_SETUP.md、docs/DECISIONS.md を更新。依存の追加なし
- 確認結果：単体テスト67件、型検査、lint が通過。本物のAPIでの確認は OPENAI_API_KEY 待ち
- 未完了：本物のAPIでの確認、画面からの呼び出し（認証の後）
- 次の作業と担当：タムさんが OPENAI_API_KEY を設定 → CC が `npm run test:live` で確認 → CX が接続部分をレビュー

### 2026-10-20 CC（Claude、プロジェクトのスレッド）その3
- ブランチ / コミット：feat/ai-providers（feat/prototype の上）
- 変更点：
  - 文章：src/lib/ai/providers/anthropic.ts（公式SDK。普段は Sonnet、仕上げは Opus。断られたときはサーバー側の代替モデル）
  - 画像：src/lib/ai/images.ts と providers/google.ts（既定）、providers/openai.ts（切り替え用）。見出しごとの画像案（撮るとよい写真・代替テキスト・生成用の指示）を本文と一緒に返す
  - src/lib/ai/config.ts：環境変数で提供元を選ぶ。キーが無ければ providers/sample.ts のサンプルを返す
  - .env.example、docs/AI_SETUP.md（キーの取り方と設定場所）、`npm run test:live`（本物のAPIで1回試す）
  - 依存追加：@anthropic-ai/sdk、@google/genai
- 確認結果：単体テスト65件、型検査、lint が通過。本物のAPIでの確認はキー待ち
- 未完了：画面からの呼び出し（認証と generation_runs の記録が先。T2-1〜T2-3）、画像の保存先（Supabase Storage）
- 次の作業と担当：タムさんがキーを作って設定（docs/AI_SETUP.md）→ CC が `npm run test:live` で確認 → CX が接続部分をレビュー

### YYYY-MM-DD 担当（CC / CX）
- ブランチ / コミット：
- 変更点：
- 実行方法：
- 確認結果（テスト、375px・1280pxの表示など）：
- 未完了：
- 次の作業と担当：
```


## 記録

### 2026-11-03 CC（Claude、プロジェクトのスレッド）しおりの自己紹介・招待状
- ブランチ / コミット：claude/project-thread-ksfvfg（main から）
- 変更点：/shiori（src/app/shiori/）、src/components/InviteLetter.tsx、招待のページ（本番・試作）を招待状に、管理画面の招待に宛名・ひとこと・無料の札・見え方の確認、src/lib/auth/invitations.ts で invitation_letter を読む（SQL前は無しで続く）、管理画面の作成は SQL 前なら宛名なしで作る、マイグレーション 20261103130000_invitation_letter.sql、入口のヘッダーと足もとに /shiori
- 確認結果：DBのテスト（招待状・権限・長さ）、lint、型検査、build。375px・1280px で /shiori・招待状（閉じた封筒・開いた後）・入口を確認
- 未完了：田村さんが SQL（20261103120000_trial_ai.sql、20261103130000_invitation_letter.sql）を流す。管理画面の見え方の確認は本番で
- 次の作業と担当：田村さんが SQL → CC が本番で確認 → CX がレビュー

### 2026-11-03 CC（Claude、プロジェクトのスレッド）30秒でためすにAI
- ブランチ / コミット：claude/project-thread-ksfvfg（main から）
- 変更点：POST /api/try（同じサイトだけ・ロボットよけ・入力の検査・start_trial_run・AI・答えの検査・finish_trial_run。だめなら mode: sample）、src/lib/tryoutAi.ts（入力の検査・指示・答えの検査）、マイグレーション 20261103120000_trial_ai.sql（trial_runs、app_settings の trial_*、start_trial_run・finish_trial_run は service role だけ）、/try の画面（AIの結果・見本の理由）、.env.example に TRIAL_SALT（任意）
- 確認結果：単体テスト（入力・答えの検査）、DBのテスト（回数・予算・スイッチ・権限）、型検査、lint、build。本物のAIでの確認は本番で SQL を流した後
- 未完了：田村さんが SQL を流す。本番で1回ためして確かめる
- 次の作業と担当：田村さんが SQL → CC が本番で確認 → CX がレビュー

### 2026-11-03 CC（Claude、プロジェクトのスレッド）30秒でためす
- ブランチ / コミット：claude/project-thread-ksfvfg（PR #54 のマージ後の main から）
- 変更点：/try（src/app/try/）、src/lib/tryout.ts（準備度・段・足りない材料・お客さんの質問・書き出しのサンプル）とテスト、入口の見出しの下と最後に /try への入口、AppShell で /try をログインなしに
- 確認結果：lint、型検査、単体テスト332件、build。375px・1280px で 入口 → 診断 → 結果 → 書き出し まで通し、横はみ出し・エラーなし
- 未完了：本物のAIにつなぐか（使いすぎ防止と費用）、入力した会社のことをログイン後に引き継ぐか
- 次の作業と担当：田村さんが触って感想 → CC が手直し → 本物のAIにつなぐなら CX と受付の回数・費用を決める

### 2026-11-03 CC（Claude、プロジェクトのスレッド）入口とログイン
- ブランチ / コミット：claude/project-thread-ksfvfg（main から）
- 変更点：入口のページ /welcome（src/app/welcome/）、共通の部品 src/components/landing.tsx（LoginStage・Reveal・useInView・useGreeting）、ログイン（メール・試作）と招待の画面を LoginStage に。未ログインで / を開くと /welcome へ（AppShell）。globals.css に twinkle・fly・blob。talk.tsx の Typed を export
- 確認結果：単体テスト316件、型検査、lint、build。375px・1280px で入口・ログイン（試作とメール）・招待を確認、横はみ出しなし
- 未完了：新規顧客の受付と料金の表示（未決定）、利用規約とプライバシーの説明
- 次の作業と担当：田村さんが本番で見て感想 → CC が手直し → CX がレビュー

### 2026-11-02 CC（Claude、プロジェクトのスレッド）Search Console
- ブランチ / コミット：claude/search-console（main から）
- 変更点：Search Console のつなぎ方A（DECISIONS 2026-11-02）。src/lib/searchConsole.ts（サービス用アカウントの JWT、URL をそろえる、28日分を読む）、src/lib/growth/searchConsoleServer.ts、/api/organizations/[id]/search-console（+/refresh）、/api/search-console-account、/search-console の画面、ホームの SearchConsoleCard、試作のサンプルの数字、マイグレーション 20261102160000_search_console.sql
- 確認結果：単体テスト（URL、JWT とトークン、28日の範囲、403・404）、DBの権限テスト、型検査、lint、build。試作で つなぐ → ホームに数字 を確認
- 未完了：田村さんの Google Cloud の準備（docs/KEYWORD_TOOLS_SETUP.md の 3）と SQL の実行。本物のサイトでの確認
- 次の作業と担当：田村さんが準備 → CC が検証環境で確かめる → CX がレビュー

### 2026-11-02 CC（Claude、プロジェクトのスレッド）その21
- ブランチ / コミット：claude/self-start（PR #28 の上。PR #32 も含む）
- 変更点：コタムを待たずに書き始める（DECISIONS 2026-11-02）。src/components/ProfileSetup.tsx、isOrgReady（今月の方針は任意）、/profile のまとめ直し、src/lib/growth/hearingAi.ts と /api/organizations/[id]/hearing-follow-up・profile-from-hearing、growthPrompts の深掘り（理由つき）と会社の情報の指示、growth.ts の pending・deepDiveDone・MAX_AI_DEEP_DIVES、ヒアリングの画面、マイグレーション 20261102130000_hearing_ai.sql
- 確認結果：単体テスト276件、型検査、lint、build。架空データで、会社の情報が無い会社として 会社のことを教える → 深掘り（理由つき）→ まとめる → 確かめる → テーマを選ぶ、まで確認
- 未完了：検証環境で 20261102130000_hearing_ai.sql を実行（田村さん）。本物のAIの深掘りの質の確認
- 次の作業と担当：PR #32・#28 のあとにマージ → 田村さんが SQL を実行して試す → CX がレビュー

### 2026-11-02 CC（Claude、プロジェクトのスレッド）その29
- ブランチ / コミット：claude/project-thread-n66pdb（PR #27 のマージ後の main から）
- 変更点：T5-4 の提案の入口（田村さんの判断で CC が作り、Codex が点検）。supabase/migrations/20261102000000_keyword_proposals.sql（generation_runs に記事を指さない種類 keyword_proposal、受付 start_keyword_proposal、できた提案を残す keyword_proposals、1社の月の回数 app_settings.keyword_proposal_limit＝10、start_generation が提案の受付のキーを返さないよう修正）。src/lib/growth/proposals.ts（ヒアリングと今売りたいもの → ラッコの下調べ → AI → 保存 → 記録。返事の形が違えば1回だけ聞き直す。キーが無ければサンプルを保存し、下調べもしない）。POST /api/organizations/:id/keyword-proposals。画面は「書く記事を決める」を開くと、答えがそろっていて提案が無ければ自動で作り、「コタムからの提案」として出す。提案はDBから読み、同じ会社の人（顧客・コタム）に同じものが出る
- 確認結果：DBのテスト（受付・回数・予算・他社・キーの使い回し・書き込み不可）、提案の作り方のテスト（下調べの渡し方、検索数の数字を渡さない、聞き直し、サンプル、失敗の記録）、画面の状態のテストを含む単体テスト、型検査、lint、build が通過。試作のままの画面を 375px・1280px で確認。本物のAI・ラッコ・ステージングでの確認はまだ（ステージングに SQL の適用が要る）
- 未完了：ステージングへの SQL 適用と通し確認、コタムの画面からの作り直し、深掘りの質問をAIで作る（hearing_followup）
- 次の作業と担当：Codex が点検 → マージ後にステージングへ SQL を適用 → ログインして「書く記事を決める」を開いて確かめる

### 2026-11-02 CC（Claude、プロジェクトのスレッド）その20
- ブランチ / コミット：claude/coach-friendly（PR #30）
- 変更点：
  - コタム側の画面を顧客側と同じ見た目に（管理画面のあいさつとしおり、カード、生成回数の棒）
  - 公開前のコタムの確認をなくし「AIOのチェック」に置き換え（DECISIONS 2026-11-02、UI.md S4・S5、DATA.md aio_checks）。src/lib/aioCheck.ts（11項目・試作のサンプル）、src/lib/ai/aioCheckPrompt.ts（チェックと反映の指示・返答の検査）、src/lib/generation/aioCheck.ts と /api/articles/[id]/aio-check（実施）・/aio-check/apply（反映）、src/components/AioCheckPanel.tsx、マイグレーション 20261102120000_aio_check.sql（aio_checks、kind aio_check、review_policy をすべて optional）
  - コタム：記事の画面で結果とやり取りを読み、「コメントを残す」。お客様の記事の画面の上にコメントを出す
- 確認結果：単体テスト241件（aio_checks の権限と受付のテストを追加）、型検査、lint、build が通過。架空データで、チェック→聞き返し→反映→コタムのコメント→お客様の画面に表示、まで確認
- 未完了：検証環境で 20261102120000_aio_check.sql を SQL Editor で実行（田村さん）。実行前でも画面は動き、チェックだけが失敗する。本物のAIでのチェックの質の確認
- 次の作業と担当：田村さんが SQL を実行 → 検証環境で1本チェック → CX がレビュー

### 2026-11-01 CC（Claude、プロジェクトのスレッド）その28
- ブランチ / コミット：claude/project-thread-n66pdb（PR #26 のマージ後の main から）
- 変更点：T5-5 の前半。/prototype の画面を、Supabase の接続先があるときはログイン中の会社のデータにつないだ。src/prototype/remote.ts（DBとの変換と読み書き。エラーは日本語にして本文を出さない）、store.ts（試作ではブラウザ、本物ではDB。画面はすぐ書きかえ、保存はうしろで。失敗したら知らせて読み直す。途中の答えと並べかえは0.8秒まとめる。組み立てを選んだら DB の id に置きかえ、待つあいだの進み具合も残す）。layout.tsx（未ログインなら案内、会社が複数なら切りかえ、保存の状態と失敗の表示、本物では「最初からやり直す」を出さない）。書く記事リストの「どこから」にラッコ・キーワードプランナーを追加（表示は「検索のしらべ」）
- 確認結果：remote.test.ts・store.test.ts（にせのDBで、まとめて保存・失敗時の読み直し・id の置きかえ）を含む単体テスト、型検査、lint、build が通過。試作のままの画面を 375px・1280px で確認（再読み込みで答えが残る）。接続先ありの未ログイン表示を確認。ステージングでのログインしての確認はまだ
- 未完了：ステージングでの通し確認、提案をAIで作る入口（ラッコの下調べつき）、記事ごとの一問一答の保存、記事作成へのつなぎ。ログイン後に /prototype へ戻る案内
- 次の作業と担当：CX が点検 → マージ後に田村さんがステージングでログインして試す → CC が提案の入口

### 2026-11-01 CC（Claude、プロジェクトのスレッド）その27
- ブランチ / コミット：claude/project-thread-n66pdb（PR #25 のマージ後の main から）
- 変更点：T5-3 の保存を追加（supabase/migrations/20261101000000_growth.sql）。hearing_answers・sell_items・keyword_plans・keyword_rows と RLS、関数 choose_keyword_plan（組み立てを選ぶ。前の組み立てをしまい、書いた・やった行を引き継ぐ）と save_sell_items（売りたいものの順番を置きかえる）。トリガーで、会社の違う組み立て・記事・売りたいものを指せない、月の検索回数は利用者が書けない、記事を公開したら行を「やった」にする。DATA・TASKS・DECISIONS を更新。ラッコへの問い合わせはしない（田村さんの判断）
- 確認結果：supabase/tests/growth.test.ts（12件）を含む単体テスト、型検査、lint が通過
- 未完了：画面（/prototype の書く記事リスト・会社のことを教える）を本物のデータにつなぐ（T5-5）。ラッコの下調べつきの提案を作るサーバーの入口
- 次の作業と担当：CX が点検 → 田村さんがマージし、Supabase の SQL Editor で 20261101000000_growth.sql を実行 → CC が T5-5

### 2026-11-01 CC（Claude、プロジェクトのスレッド）その26
- ブランチ / コミット：claude/project-thread-n66pdb（PR #25 に追加）
- 変更点：ラッコキーワード API の呼び出しを追加（src/lib/keywords/rakko.ts。サジェスト・よくある質問・アカウント情報。キーはヘッダーだけ、エラーは種類ごとに日本語で、402 はクレジット切れ）。下調べ（research.ts）で1回3語まで集め、検索数は「多い・ふつう・少ない」に丸めて、提案役の指示（growthPrompts.ts の buildProposalPrompt）に research として渡す。本物で試すテスト rakko.live.test.ts（RAKKO_LIVE=1 のときだけ）。DECISIONS・LESSONS・KEYWORD_TOOLS_SETUP・TASKS・.env.example を更新
- 確認結果：単体テスト、型検査、lint が通過。常時稼働PCで本物の API のテストが通過（スタンダードプラン、「断熱リフォーム」で質問10件・サジェスト10件、月間検索数は全件に数字あり）。空白だけ違うサジェストが別々に返るので、1つにまとめるよう直した
- 未完了：提案の保存と画面へのつなぎ込み（ヒアリングの保存 T5-3 の後）。公開の前にラッコへ問い合わせ（下書き /mnt/project-files/keyword-tools/rakko-inquiry-draft.md）
- 次の作業と担当：CX がレビュー → 田村さんがマージ。田村さんがラッコへ問い合わせ

### 2026-11-01 CC（Claude、プロジェクトのスレッド）その25
- ブランチ / コミット：claude/project-thread-n66pdb（PR #24 のマージ後の main から）
- 変更点：顧客の画面に出るエラー文の古い言葉（確認依頼・承認・公開済み・版・生成回数など）を、用語集の「顧客向けの言い方」に合わせた。src/lib/workflow.ts、src/lib/remote/backend.ts、src/mock/store.tsx の文言だけで、処理は変えていない（backend.ts は CX の担当範囲なので CX が確認）
- 確認結果：単体テスト、型検査、lint が通過
- 次の作業と担当：CX が文言の変更を確認 → 田村さんがマージ

### 2026-11-01 CC（Claude、プロジェクトのスレッド）その24
- ブランチ / コミット：claude/project-thread-n66pdb（PR #23 のマージ後の main から）
- 変更点：本番の顧客向け画面（ホーム、テーマ選び、質問、記事を整える、会社の情報）の言葉を「やること」ベースに言い換え。記事の状態の表示名（src/lib/workflow.ts の STATUS_LABEL）も変更。言い換えの一覧は LESSONS の用語集「顧客向けの言い方」。コタムだけが見る文言とサーバーのエラー文は変えていない
- 確認結果：単体テスト、型検査、lint が通過。架空データで 375px・1280px のホームと記事の画面を確認
- 未完了：コタムの画面・サーバーのエラー文の見直し
- 次の作業と担当：田村さんが言葉を確認

### 2026-11-01 CC（Claude、プロジェクトのスレッド）その23
- ブランチ / コミット：claude/project-thread-n66pdb（PR #22 のマージ後の main から作り直し）
- 変更点：書く記事リストに「今売りたいものの順番を決める」を追加（src/prototype/SellRanking.tsx。指でもマウスでもドラッグでき、▲▼でも動かせる）。おすすめ順＝しおりのおすすめ度＋売りたいものの順位の点（keywords.ts の rowScore・sellItemOf・sellItemsFromAnswer・moveItem）。記事に「売りたい 〇位」の札、記事を足すときに売りたいものを選べる。並べ方の最初を「おすすめ順」に。ホームの次の記事も同じ順。DECISIONS・DATA（sell_items の案）・UI・TASKS を更新
- 確認結果：単体テスト（売りたいもの4件を追加）、型検査、lint が通過。375px・1280px で表示、1280px でドラッグして順番とおすすめ順が変わることを確認
- 未完了：保存（sell_items と keyword_rows.sell_item_id は CX）
- 次の作業と担当：田村さんが画面を確認 → CX が DATA.md の案をレビュー

### 2026-11-01 CC（Claude、プロジェクトのスレッド）その22
- ブランチ / コミット：claude/project-thread-n66pdb（その21の上、PR #22）
- 変更点：試作の顧客向けの言葉を「やること」ベースに言い換え（田村さんの依頼。DECISIONS 2026-11-01、LESSONS の用語集「顧客向けの言い方」）。メニューは ホーム／会社のことを教える／書く記事を決める／書く記事リスト。柱・周りの記事は KIND_LABEL（まとめ記事・くわしい記事）にまとめた。「公開済み」は全画面で「やった」。コタムの画面の見出しもそろえた。URL とコードの名前は変えていない
- 確認結果：単体テスト、型検査、lint が通過。375px・1280px でホーム・書く記事を決める・書く記事リストを確認
- 未完了：本番の画面（/articles など）の言葉は未見直し
- 次の作業と担当：田村さんが言葉を確認

### 2026-11-01 CC（Claude、プロジェクトのスレッド）その21
- ブランチ / コミット：claude/project-thread-n66pdb（main の上）
- 変更点：試作に「キーワード管理表」（/prototype/keywords）を追加。考え方は src/prototype/keywords.ts（次の1本、おすすめ順、柱ごと、足す・やめておく、前の保存データの補い）。KeywordRow に優先度・ねらい・出どころ・月間検索数（null）・やめておく・柱の id を追加（任意の項目なので前の保存データも動く）。設計図の画面の表は管理表への入口に置き換え。ホームの「次の記事」もおすすめ順に。docs/UI.md・DATA.md・TASKS.md を更新
- 確認結果：単体テスト（keywords.test.ts 7件を追加）、型検査、lint が通過。375px・1280px で表示を確認
- 未完了：保存（T5-3 の keyword_rows に priority などの列を足す案を DATA.md に書いた）、SEMrush・Search Console からの取り込み
- 次の作業と担当：タムさんが画面を確認 → CX が DATA.md の列の案をレビュー

### 2026-11-01 CC（Claude、プロジェクトのスレッド）その20
- ブランチ / コミット：claude/project-thread-fxmdf9（main と、AIO.md の週次更新 claude/project-thread-e5mw2e＝PR #13 を取り込み）
- 変更点：AIOの最新情報を顧客に伝え、AIへの指示に組み込む（DECISIONS 2026-11-01、TASKS T5-10）。src/lib/aioNews.ts（AIOの知識表。日付・出典・公式か報道か・顧客向けのひとこと・関係する材料・AIへの指示）。ホームに「しおりのAIOニュース」（AioNews）、質問の「なぜ聞くの？」に関係する最新情報。書き手（SYSTEM_PROMPT）と点検役（REVIEW_SYSTEM_PROMPT）に、公式の発表の決まりだけを差し込む。docs/AIO.md「更新の決まり」に知識表を同じPRで直す手順。毎週月曜の定期作業は、最初に AIO.md の「更新の決まり」を読む指示になっているため、決まりの側に知識表の手順を書いた（定期作業の指示文はこの画面から書き換えられず、作り直すと過去の実行記録が消えるため変えていない）
- 確認結果：単体テスト（知識表の形、報道がAIの指示に入らないこと、AIO.md の最終更新と知識表の日付がそろうこと）、型検査、lint が通過。架空データで 375px・1280px のホームと質問の画面を確認
- 未完了：試作（/prototype）の画面には AIOニュースを出していない。本物のAIで1本作って、差し込んだ決まりが効いているかの確認
- 次の作業と担当：CX がレビュー → 田村さんがマージ。次の月曜の定期作業から、知識表も一緒に直したPRが届く

### 2026-11-01 CC（Claude、プロジェクトのスレッド）その19
- ブランチ / コミット：claude/friendly-ui（main から）
- 変更点：画面の見た目を案B「さわやか」に（docs/UI.md「見た目と動き」、DECISIONS 2026-11-01）。globals.css の色・丸ゴシック・ボタン・カード・動きの定義、src/components/fun.tsx（道のり・ほめる言葉・紙吹雪・質問ごとの絵）、aio.tsx（なぜ聞くの？・材料がポンと増える）、質問に答える画面の組み直し、ホーム・テーマ選び・ログイン・生成中の表示。ほめる言葉は答えて進んだ直後だけ出す（開き直したときは出さない）。記事の画面と試作（/prototype）は色と部品の変更を受け継ぐだけ
- 確認結果：単体テスト146件、型検査、lint、build が通過。架空データで 375px・1280px の表示と、質問を最後まで答えて紙吹雪→見出し案まで進むことを確認
- 追加（同じブランチ）：記事の画面（/articles/[id]）に、記事ができるまでの道のり（ArticleSteps）、見出し案の番号の丸と並び出る動き、できたばかりの版を開いたときのほめる言葉と紙吹雪、成功のトースト、丸いタブ・要確認の黄色い枠。BlockEditor の枠も丸く
- 未完了：コタムの画面の作り込み、質問ごとの絵を写真にするか
- 次の作業と担当：CX がレビュー → 田村さんが検証環境で見て、気になる所を伝える

### 2026-10-28 CC（Claude、プロジェクトのスレッド）その18
- ブランチ / コミット：claude/project-thread-rey7mz（PR #17 マージ後の main から作り直し）
- 分かったこと：検証環境で画像の提案と画像の生成（ナノバナナ）が動いた。Gemini は AI Studio の前払いクレジットで払う（田村さんが購入済み）
- 変更点：画像の枠に作風の選択（写真風・イラスト風・サイトに合わせる）を足した。src/lib/ai/images.ts の styleLine が指示文に作風を足し、文字を入れない条件は最後に残す。「サイトに合わせる」は雰囲気のメモが無いと作れない。選択は localStorage（imageLook:会社ID）に保存
- 確認結果：単体テスト146件、型検査、lint が通過。試作で 375px・1280px と、再読み込み後に選択が残ることを確認
- 未完了：会社ごとの作風をDBに保存して全員で共有するか（使ってみてから判断。DBは CX の担当）
- 次の作業と担当：CX がレビュー → 田村さんがマージして、作風を変えて1枚ずつ試す

### 2026-10-28 CC（Claude、プロジェクトのスレッド）その17
- ブランチ / コミット：claude/project-thread-rey7mz（PR #16 マージ後の main から作り直し）
- 変更点：Google の 402（前払いクレジット切れ）を AiProviderError の billing として分け、「クレジット残高が足りません」と出す（文章・画像の両方）
- 分かったこと：このアカウントの Gemini API は Google AI Studio の前払いクレジットで払う。支払い方法を設定しても、クレジットが ¥0 なら 402 になる。田村さんが購入するか判断中
- 確認結果：単体テスト、型検査、lint が通過
- 次の作業と担当：田村さんがクレジットを買って「画像の提案を作る」→画像1枚を試す

### 2026-10-28 CC（Claude、プロジェクトのスレッド）その16
- ブランチ / コミット：claude/project-thread-rey7mz（PR #15 マージ後の main から作り直し）
- 変更点：
  - 画像を補助情報のタブから出し、右側に独立した「画像」の枠として常に出す。スマホの切り替えボタンは「画像・確認事項」にした。田村さんの「場所が非常にわかりづらい」から
  - 画像の提案の作り直しが失敗したとき、理由（AIの返事が切れた・読み取れない・提供元の状態コード）を画面に出す。検証環境で「もう一度お試しください」だけが出て原因が分からなかったため
  - Gemini の権限エラー（auth）の原因は、Google Cloud の請求先アカウントでメインのお支払い方法が未設定だったこと。田村さんが設定して Tier 1 に戻った
- 確認結果：単体テスト145件、型検査、lint が通過。試作で 375px・1280px の表示を確認
- 未完了：検証環境で「画像の提案を作る」が通るか。出た理由を見て直す
- 次の作業と担当：CX がレビュー → 田村さんがマージして試す

### 2026-10-28 CC（Claude、プロジェクトのスレッド）その15
- ブランチ / コミット：claude/project-thread-rey7mz（PR #14 マージ後の main から作り直し）
- 変更点：
  - 記事の画面の補助情報タブ（要確認・コメント・AIの点検・画像・回答・指導方針）を、枠付きのボタン3列にし、上に「見たいものを選んでください」を付けた。田村さんが「画像」タブを見つけられなかったため
  - 検証環境の第2版で、画像の提案（Gemini）の工程だけが失敗していた（generation_settings.steps の images が ok:false）。返答の上限を 6000 → 16000 に広げ（IMAGE_IDEAS_MAX_TOKENS）、失敗の種類を steps[].error に残すようにした
  - 「画像」タブに提案が無いとき「画像の提案を作る」ボタンを出し、提案だけを作り直す（src/app/api/articles/[id]/image-ideas/route.ts、server.ts の runImageIdeas）。試作（src/mock/store.tsx）にも同じ操作を足した
- 確認結果：単体テスト145件、型検査、lint が通過。試作で 375px・1280px の表示と「画像の提案を作る」→ 提案と「この画像を作る」が出ることを確認
- 未完了：検証環境で田村さんが「画像の提案を作る」→ 画像を1枚作って確かめる。失敗したら generation_runs の error_code とサーバーのログ（reason）で種類を見る
- 次の作業と担当：CX がレビュー → 田村さんがマージ

### 2026-10-28 CC（Claude、プロジェクトのスレッド）その14
- ブランチ / コミット：claude/project-thread-rey7mz（main から作り直し）
- 変更点：田村さんがClaude・Geminiのキーを作り直し、OpenAIのキー（cotam-blog-vercel）と合わせて Vercel（Production・Preview）に登録。検証環境で 20261025000000_article_images.sql を実行。本物のAIで記事を1本作り、見出し案→本文→点検→書き直し（第2版）まで動いた。タイトル欄にテーマの文が残る問題を直した（src/lib/generation/server.ts の pickTitle）
- 確認結果：単体テスト、型検査、lint が通過
- 未完了：点検タブと画像の生成の確認（田村さん）
- 次の作業と担当：田村さんが点検タブと画像を確認 → 1〜2社で試す準備

### 2026-10-25 CC（Claude、AIO.md の週次アップデート）
- ブランチ / コミット：claude/project-thread-e5mw2e（main から）
- 変更点：docs/AIO.md に Google の2026年10月15日のリンク表示の変更、Search Console の生成AIのレポート、AIを使わせない設定の範囲を追加。ChatGPT・Perplexity・Claude は公式の変化なし。8つの材料と質問は変えない
- 確認結果：文書のみの変更。公式ページはこの環境から開けず、検索結果と報道で確認（AIO.md に明記）
- 次の作業と担当：タムさんが PR を確認。次回は翌週の定期更新

### 2026-10-23 CC（Claude、プロジェクトのスレッド）その13
- ブランチ / コミット：claude/project-thread-rey7mz（PR #12 に追加、42372a4〜2035626）
- 変更点：Codex の指摘を6回分直した。顧客の答えを指示に入れるとき区切りを閉じられないようにした（asData）。深掘り・提案の返答を厳しく検査する（follow_up が無い・空白、3案未満、柱の重なり、理由なし）。ヒアリングは書きかけを保存し（draft）、読み込み直すと深掘りの続きから始める。飛ばした深掘りは聞き直さない。答え終わりの判定（isAnswerDone）を続きの位置・答えた数・点・提案に共通で使う。コタムが答えを書き直したら前の深掘りを消す。記事の質問は答えていない問いから再開する。設計図を選び直したら記事の答えを消す。見出しの上限12を src/lib/limits.ts にまとめ、追加ボタン・生成の受け口（超えたら400）・見出し案・画像の提案でそろえた。docs/DATA.md の hearing_answers に is_draft を追加
- 確認結果：単体テスト、型検査、lint が通過。ヒアリングと記事の質問の再開を 375px のブラウザで確認。Codex の最後のレビュー（2035626）は指摘なし
- 未完了：深掘りの質問とキーワードの提案の本物のAI（T5-4）、試作の保存（T5-3、CX。is_draft を含める）
- 次の作業と担当：田村さんが PR #12 をマージ

### 2026-10-23 CC（Claude、プロジェクトのスレッド）その12
- ブランチ / コミット：claude/project-thread-rey7mz（PR #12 に追加）
- 変更点：docs/AIO.md を最新の公式情報で更新（Google の2026年5月の案内、やらなくてよいこと、ChatGPT の検索の条件）し、「最終更新」「更新の決まり」「更新履歴」を追加。毎週月曜 8:41（日本時間）に AIO.md を更新して PR を作る定期の作業を設定。AIOの材料を src/lib/aio.ts と src/components/aio.tsx に移し、今の記事作成の質問（S3）にも「なぜ聞くの？」・答えた後のひとこと・集まった材料を表示（Question.aio）。書き手と点検役の指示（src/lib/ai/prompt.ts）にAIOの8つの材料を入れた。深掘りの質問とキーワードの提案の指示・返答の検査を src/lib/ai/growthPrompts.ts に追加（呼び出しはまだ）
- 確認結果：単体テスト、型検査、lint が通過。S3 を 375px・1280px で確認し、横スクロールなし
- 未完了：深掘りの質問とキーワードの提案の本物のAI（T5-4）、試作の保存（T5-3、CX）
- 次の作業と担当：CX が PR #12 をレビュー → 田村さんがマージ。点検の指示の変更は、本物のAIで1本作って確かめる（キー待ち）

### 2026-10-23 CC（Claude、プロジェクトのスレッド）その11
- ブランチ / コミット：claude/project-thread-rey7mz（PR #12 に追加）
- 変更点：仕切り直しの計画（docs/DECISIONS.md 2026-10-23「仕切り直し」、計画書 https://claude.ai/artifact/AEPQ3RXGbzeQnyMpzVABAs）の第1段階を画面試作にした。/prototype（ホームとレベルアップ）、/prototype/hearing（一問一答のヒアリング。答えが短いと深掘りの質問を返す）、/prototype/plan（キーワードの提案3つ → ピラーとクラスターの図 → キーワード管理表）、/prototype/write/[rowId]（1本ずつの一問一答。例とコツつき）、/prototype/coach（コタムが聞きながらまとめて入力、担当企業の様子）。ロジックは src/prototype/growth.ts、状態は src/prototype/store.ts（localStorage だけ。本物のデータとAIにはつながない）。/prototype はログイン不要で、すべての画面に「サンプル（AIは未接続）」を表示。今の記事作成の質問（S3）にもコツを足した（Question.tip）。画像の提案は12件まで、50件を超える指定は断る（Codex の指摘）
- 追加（同日）：docs/AIO.md（なぜAIOか、AIOの8つの材料、作るときの約束）。試作の質問に「なぜ聞くの？（AIOのどの材料のためか）」とアイコン、答えた後の励まし、「AIに紹介される材料」の集まり具合、ホームに「なぜくわしく聞くの？」の図を追加。CLAUDE.md・AGENTS.md の最初に読むものに docs/AIO.md を追加
- 実行方法：`npm run dev` → http://localhost:3000/prototype。「最初からやり直す」で入力を消せる
- 確認結果：単体テスト130件（試作のロジック6件を含む）、型検査、lint が通過。375px・1280px でヒアリング（深掘りを含む）→ 提案 → 設計図 → 1本書く → 公開 → レベルアップ → コタムの画面を自動操作で通し、横スクロールなし
- 未完了：ヒアリング・設計図・管理表のDBと本物のAI（CX、インターフェース案は docs/DATA.md「育つブログ（案）」）、Search Console（第2段階）、GA4 とキーワードツール（第3段階）
- 次の作業と担当：田村さんが試作を触って直したいところを伝える → CC が画面を直す → CX が保存とAIをつなぐ。並行して、今のver1を1〜2社で試す準備（田村さん：Claude のキーの作り直し、画像の SQL、Vercel に3社のキー）

### 2026-10-23 CC（Claude、プロジェクトのスレッド）その10
- ブランチ / コミット：claude/project-thread-rey7mz（PR #10 のマージ後に main から作り直し）
- 変更点：画像の生成（T4-1、docs/DECISIONS.md 2026-10-23）
  - DB：supabase/migrations/20261025000000_article_images.sql（article_images、generation_runs.kind に image、app_settings.article_image_limit、start_generation に画像の回数の判定）
  - サーバー：src/lib/generation/images.ts（今の版の画像の提案からナノバナナで作り、Storage の非公開バケット article-images に置く。1枚失敗しても残りは残す）、/api/articles/[id]/images（GET 一覧、POST 生成）
  - 画面：「画像」タブに、まだ無い画像をまとめて作る・1枚ずつ作り直す・ダウンロードのボタン。型 ArticleImage。架空データでは灰色のサンプル画像
  - IMAGE_MODE の既定を generate に
- 確認結果：単体テスト（DBの画像の回数とRLS、画像の生成の流れ）、型検査、lint が通過。架空データで画像を作り、375px・1280pxで横スクロールが無いことを確認。本物の Storage と Gemini での確認は、マイグレーションの実行とキー待ち
- 未完了：検証環境への 20261025000000_article_images.sql の実行（タムさん、SQL Editor）、本物のAIでの確認、HTML書き出しへの画像の埋め込み（ver1 はダウンロードで渡す）
- 次の作業と担当：CX がレビュー → タムさんがマージとSQLの実行、3社のキーを Vercel に入れる → CC が1本作って確認

### 2026-10-23 CC（Claude、プロジェクトのスレッド）その9
- ブランチ / コミット：claude/project-thread-rey7mz（PR #10 に追加）
- 変更点：
  - AIの役割分担（docs/DECISIONS.md 2026-10-23）：src/lib/ai/provider.ts の generateReviewedBody（書く → 点検と画像の提案を同時に → 指摘があれば1回書き直す）、prompt.ts に点検・書き直し・画像の提案の指示文と検査、config.ts に役割ごとの提供元（REVIEW_PROVIDER・IMAGE_IDEA_PROVIDER など）
  - Gemini でも文章を書ける（providers/googleText.ts）。費用は工程ごとの会社の単価で合計（cost.ts）
  - 生成の保存（src/lib/generation/server.ts）：generation_settings に eyecatch・image_suggestions・review・steps。手で直した版にも引き継ぐ（mapping.ts の carriedSettings）
  - 画面：記事の補助情報に「AIの点検」と「画像」のタブ。型 ArticleVersion に imageIdeas と aiReview（src/types/domain.ts）
- 確認結果：単体テスト、型検査、lint が通過。架空データで本文を作り直し、2つのタブを375px・1280pxで表示して横スクロールが無いことを確認。本物のAIでの確認は3社のキー待ち
- 未完了：画像の生成と保存・表示・ダウンロード（T4-1）、本物のAIでの確認
- 次の作業と担当：タムさんが Vercel に OPENAI_API_KEY・ANTHROPIC_API_KEY・GEMINI_API_KEY を入れる → CC が1本作って確認 → CC が T4-1

### 2026-10-23 CC（Claude、プロジェクトのスレッド）その8
- ブランチ / コミット：claude/project-thread-rey7mz（PR #8 のマージ後の main から）
- 変更点：PR #8（T2-9）に Codex の指摘を反映。手動の保存とレビューを `save_article_change`（1つのトランザクション、版番号はDBで決める）に、生成の材料が1つでも読めなければ止める、結果の記録は3回までやり直す。検証環境を作成：Vercel のプロジェクト aio（https://aio-roan.vercel.app）、Supabase の URL 設定、最初の全社管理者（tamura@co-tam.co.jp）
- 確認結果：検証環境で、会社の追加 → 招待（kojit54@gmail.com）→ メールのリンクでログイン → プロフィール確認 → テーマ選択 → 質問 → 見出し案 → 本文 → 確認依頼 → コタムの承認 まで本物のデータで通った。生成はAIのキー未設定のためサンプル
- 未確認：本文の手動編集と保存、公開済みにする・書き出し、修正依頼、AIの実際の生成
- 気づいた点：レビューの表示名がメールアドレスになる（利用者の名前を持っていないため）。テストで作ったテーマの題名が長いまま残っている（検証環境のみ）
- 次の作業と担当：タムさんが漏れた Anthropic・Gemini のキーを作り直し、新しいキーを Vercel の環境変数に入れる → CC が実際の生成を確認。並行して SMTP（T3-2）、監視と予算の通知（T3-3）、利用規約（T3-4、タムさん）、バックアップ（T3-5）

### 2026-10-23 CC（Claude、プロジェクトのスレッド）
- ブランチ / コミット：claude/project-thread-v1jf2e
- 変更点：講演資料「印刷業界におけるAI活用」の考え方（経験を手順・ルール・テストに残す）を取り入れ、docs/LESSONS.md（経験から決めたルールと用語集）を追加。AGENTS.md と CLAUDE.md に「経験をルールに残す」を追加し、最初に読むものに LESSONS.md を入れた。コードの変更なし
- 未完了：なし
- 次の作業と担当：CX がレビュー → タムさんがマージ。以後、不具合やレビュー指摘で分かったことは CC・CX が LESSONS.md に追記する

### 2026-10-22 CC（Claude、プロジェクトのスレッド）その7
- ブランチ / コミット：claude/project-thread-rey7mz（PR #7 のマージ後の main から）
- 変更点：画面を本物のデータにつなぐ（T2-9）。src/lib/remote/（DBの行と画面の型の変換、Supabase を使う store）、src/mock/store.tsx は Supabase の値があれば本物のデータに切り替え、`month`（日本時間の今月）と `loadError` を追加。生成のサーバー処理 src/lib/generation/server.ts と /api/articles/[id]/generations、概算費用 src/lib/ai/cost.ts。マイグレーション 20261024000000_app_data.sql（回答の下書き列、レビューの表示名、確認依頼・承認した版の固定、approve_profile）。本物のデータのときは試作確認パネルを出さない
- 確認結果：単体テスト104件（DBテストに下書き保存・版の固定・プロフィール確認を追加）、型検査、lint、本番ビルドが通過。仮の Supabase 値でホームからログイン画面への転送を、値なしで架空データのログインからホームまでを、ブラウザで確認。本物の Supabase での主導線は未確認
- 気づいた点：approve_profile の権限判定で、所属の無い会社だと is_client が null になり判定をすり抜けていたのをテストで見つけて修正（coalesce）
- 未完了：Vercel（T3-1）で環境変数を入れ、招待 → ログイン → テーマ選択 → 質問 → 見出し → 本文 → 確認依頼 → 承認 → 書き出しを実際に通す
- 次の作業と担当：タムさんが SQL Editor で 20261024000000_app_data.sql を実行 → Vercel を作成 → CC が検証環境で主導線を確認

### 2026-10-22 CC（Claude、プロジェクトのスレッド）その6
- ブランチ / コミット：claude/project-thread-rey7mz（main から作り直し）
- 変更点：招待制ログイン（T2-3）。supabase/migrations/20261023000000_invitations.sql（invitation_status、accept_invitation、revoke_membership、list_members）。src/lib/supabase/（接続先、ログイン中の利用者用、service role 用）、src/lib/auth/（トークン、招待の受諾）、src/proxy.ts（セッション更新）、/auth/confirm、/auth/signout、/login と /invite/[token] は Supabase 設定時にメールでのログインに切り替え、/admin/invitations（会社の追加、招待リンクの発行、所属を外す）。依存追加：@supabase/supabase-js、@supabase/ssr。docs/SUPABASE_SETUP.md を追加
- 検証プロジェクト：タムさんが cotam-blog-staging を作成（ムンバイ）。最初の2つのマイグレーション、新規登録オフまで済み。メール文面は独自SMTPの設定まで変えられないため、当面は標準の文面（同じブラウザで開く）
- 確認結果：単体テスト94件（招待・退会のDBテスト8件を含む）、型検査、lint、本番ビルドが通過。Supabase の値を仮に入れて /login・/invite・/admin・/auth/confirm の表示と転送を確認。本物の Supabase での操作は未確認
- 未完了：環境変数を入れた環境（Vercel、T3-1）での実際の招待→ログイン、ログイン後の画面を本物のデータにつなぐ（T2-9。今は Supabase を設定してもログイン後の画面は架空データのまま）
- 次の作業と担当：タムさんが PR をマージ → SQL Editor で 20261023000000_invitations.sql を実行 → Vercel を作成（T3-1）→ CC が画面を本物のデータにつなぐ（T2-9）

### 2026-10-22 CC（Claude、プロジェクトのスレッド）その5
- ブランチ / コミット：claude/project-thread-rey7mz（main から）
- 変更点：supabase/migrations/20261022000000_generation_guard.sql。生成の受付 start_generation（二重クリック、1社1件の同時実行、本文の月の上限と記事ごとの上限、全社の月額予算で停止、10分で時間切れ）、結果の記録 finish_generation、予算の確認 budget_status と mark_budget_notified、全社設定 app_settings、generation_runs.cost_yen。エラーコードに busy と budget_exceeded を追加（src/types/domain.ts、docs/DATA.md、docs/UI.md）。依存の追加なし
- 確認結果：supabase/tests/generation.test.ts（12件、PGlite 上の PostgreSQL）を含め、単体テスト・型検査・lint が通過
- 未完了：サーバーからの呼び出し（T2-9）、80％の通知の送り先（T3-3）、費用の円換算の単価表
- ver1 までの残り：①ログインと招待をSupabaseにつなぐ（T2-3、タムさんの Supabase 作成が先）②画面を本物の保存とAIにつなぐ（T2-9）③Vercel・メール・監視（T3-1〜T3-3）④利用規約など（T3-4、タムさん）⑤バックアップと復旧（T3-5）⑥リリース判定（T3-6）
- 次の作業と担当：CX がこのDB関数をレビュー → タムさんが Supabase の検証プロジェクトを作成 → CC が T2-3 に着手

### 2026-10-20 CC（Claude、プロジェクトのスレッド）その2
- ブランチ / コミット：feat/db-foundation（feat/blog-ui の上。ローカルのみ、push待ち）
- 変更点：
  - 画面：会社プロフィール・指導メモ・過去記事の登録フォーム、顧客のプロフィール確認画面、招待を受ける画面（/invite/demo-hanamaru、期限切れは /invite/demo-expired）
  - DB：supabase/migrations/20261020000000_init.sql（docs/DATA.md の全テーブル、RLS、状態遷移と版の固定のトリガー）
  - AI：src/lib/ai/（AIに渡す情報の限定、指示文、返答の検査、提供元の差し替え口）。提供元への接続はまだ
- 確認結果：単体テスト56件（うちDBのRLS・状態遷移27件は PGlite 上の実際の PostgreSQL で実行）、型検査、lint、本番ビルドが通過。招待 → プロフィール確認 → テーマ選択の流れを375px・1280pxで自動操作して確認
- CXに見てほしい点：RLSの方針（security definer の判定関数）、状態遷移トリガーと src/lib/workflow.ts の二重管理、generation_runs と audit_logs を service role だけが書く前提
- 未完了：Supabase 検証プロジェクトへの適用（T2-1の残り）、招待の発行とメール送信、AI提供元の比較（T2-6）と接続
- 次の作業と担当：リポジトリ接続後に push → CX がDBとAIの方針をレビュー → AI提供元を決める（タムさん）

### 2026-10-20 CC（Claude、プロジェクトのスレッド）
- ブランチ / コミット：feat/blog-ui（ローカル。GitHubのリポジトリが未接続のため push していない）
- 変更点：Next.js 16 + TypeScript + Tailwind CSS 4 の雛形、ドメイン型（src/types/domain.ts）、状態遷移（src/lib/workflow.ts）、HTML書き出し（src/lib/exportText.ts）、架空データと擬似API（src/mock/）、画面 S0〜S5a
- 実行方法：`npm install` → `npm run dev`。ログイン画面で「佐藤（顧客・確認任意）」「高橋（顧客・確認必須・生成上限到達）」「コタム担当者A」を選ぶ
- 確認結果：lint・型検査・単体テスト20件・本番ビルドが通過。375px と 1280px で、テーマ選択 → 質問（追加質問を含む）→ 見出し案 → 本文 → 編集・保存 → 要確認箇所 → 確認依頼 → HTMLコピー → 保存失敗と再試行 → コタムの承認 → 他社記事の権限なし → 確認必須の会社で公開済み登録が無効 → 生成上限、を自動操作で通し、横スクロールが出ないことを確認
- 未完了：会社プロフィール・指導メモの登録フォーム（表示のみ）、招待受諾画面、過去記事の登録フォーム、顧客1〜2名でのユーザーテスト（T1-10と合わせて）
- 次の作業と担当：タムさんがリポジトリを作成して接続 → CC が push してPR作成 → CX が docs/DATA.md「API案」をレビューし T2-1 から着手

### 2026-10-20 Claude（プロジェクトのスレッド）
- ブランチ / コミット：なし（リポジトリ未作成）
- 変更点：ブリーフv0.2を元に docs 一式、CLAUDE.md、AGENTS.md を作成
- 未完了：リポジトリ作成（T0-1）と登録（T0-2）
- 次の作業と担当：タムさんがリポジトリを作成 → CC が T0-2、T1-1 から着手
