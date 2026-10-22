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
