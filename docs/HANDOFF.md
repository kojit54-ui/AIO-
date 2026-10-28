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

### 2026-10-28 CC（Claude、プロジェクトのスレッド）その14
- ブランチ / コミット：claude/project-thread-rey7mz（main から作り直し）
- 変更点：田村さんがClaude・Geminiのキーを作り直し、OpenAIのキー（cotam-blog-vercel）と合わせて Vercel（Production・Preview）に登録。検証環境で 20261025000000_article_images.sql を実行。本物のAIで記事を1本作り、見出し案→本文→点検→書き直し（第2版）まで動いた。タイトル欄にテーマの文が残る問題を直した（src/lib/generation/server.ts の pickTitle）
- 確認結果：単体テスト、型検査、lint が通過
- 未完了：点検タブと画像の生成の確認（田村さん）
- 次の作業と担当：田村さんが点検タブと画像を確認 → 1〜2社で試す準備

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
