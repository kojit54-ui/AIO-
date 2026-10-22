# AGENTS.md

株式会社コタムの既存顧客向けブログ執筆支援サービス（招待制Webアプリ）。

## 最初に読むもの

仕様の正本は docs/ 配下。要件をこのファイルにコピーしない。

1. docs/HANDOFF.md：前回の作業と次の作業
2. docs/TASKS.md：担当と完了条件（Codex の担当は「CX」）
3. 作業内容に応じて docs/PRD.md、docs/UI.md、docs/DATA.md、docs/DECISIONS.md、docs/RELEASE.md

## 役割

- Codex：認証・データ保存・AI接続・テスト・公開設定が主担当。Claude Code の変更をレビューする
- 画面とフロントエンドは Claude Code の担当。画面側の変更が必要なら docs/HANDOFF.md に書いて引き継ぐ
- 共有の型（src/types/）、依存ファイル（package.json・ロックファイル）、DBマイグレーションは、docs/TASKS.md で担当になっている側だけが変更する

## 作業前の確認

- `git status` で未コミットの変更がないこと。あれば自分のものか確認してから進める
- 作業ブランチを切る（例：`git switch -c feat/blog-api`）。main に直接コミットしない
- Claude Code と同時に作業する場合は別の worktree か clone を使い、同じ作業フォルダで同時に動かさない

## コマンド

```
npm install        # 初回のみ
npm run dev        # http://localhost:3000 で起動
npm run lint
npm run typecheck
npm test           # 状態遷移・HTML書き出し・サンプル生成の単体テスト
npm run build
npm run test:live  # 本物のAIで1回試す（.env.local にキーが必要。docs/AI_SETUP.md）
```

画面試作の段階では、データはブラウザ内の架空データ（src/mock/）だけを使う。右下の「試作の確認用」から保存失敗・生成失敗・編集競合・セッション切れを再現できる。

## 作業後

- lint・型検査・テストを通す。権限まわりの変更では他社アクセス拒否のテストを必ず実行
- コミットして push し、レビュー用のPRを作る
- docs/HANDOFF.md に記録を追加し、docs/TASKS.md の状態を更新
- 仕様を変えた場合は docs/ を更新し、理由を docs/DECISIONS.md に書く

## 秘密情報

- APIキー、Supabase の service role キー、SMTP の認証情報をコード・Git・ブラウザに出さない。`.env.local` は Git に入れない
- 検証用と本番用のDB・秘密情報を分ける
- ログに記事本文や個人情報を出さない
- AIへ渡すのは、当該企業の確認済みプロフィール、顧客向け指導メモ、今回の回答、選択した過去記事だけ。内部メモと他社データは渡さない
