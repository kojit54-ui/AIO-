# 本番での通しテスト（自動）

2026-11-08 田村さん「テストはそちらでやって。最終チェックだけする」。直したら、Claude が本番でテスト専用の会社として記事を1本書き、9人で採点してから報告する。

## テスト専用の会社
- 会社：テスト製作所（自動テスト用）。アカウント e2e-test@aio-erabare.jp（顧客担当者）
- 実在の会社ではない。答えは scripts/e2e/persona.json（架空）
- パスワードはコード・Git・チャットに出さない。分からないときは、田村さんの許可を得て作り直す（bcrypt のハッシュだけを auth.users に入れる）

## 動かし方
クラウド環境の通信許可に aio-erabare.jp と qzmoasfypcjkyfiwqjan.supabase.co が要る（2026-11-08 追加済み）。Node の fetch は NODE_USE_ENV_PROXY=1 が要る。

    E2E_BASE=https://aio-erabare.jp E2E_SUPABASE_URL=https://qzmoasfypcjkyfiwqjan.supabase.co \
    E2E_ANON=<公開キー> E2E_EMAIL=e2e-test@aio-erabare.jp E2E_PASSWORD=<パスワード> \
    NODE_USE_ENV_PROXY=1 NODE_PATH=$(npm root -g) node scripts/e2e/article-flow.mjs all <出力フォルダ>

段階は hearing / profile / plan / write / all。出力フォルダに画面の写真と article.json（本文）が残る。

## 9人の採点
node scripts/e2e/council.mjs <article.json> <出力フォルダ> で GPT・Gemini の6人（書く人・読む人・AIOの人）を呼ぶ。Claude の3人は同じ指示文（出力フォルダの brief-claude.txt）で採点する。9.5点が「プロが手を入れずに公開できる」水準。
