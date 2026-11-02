# キーワードツールの準備（田村さん向けの手順）

書く記事リストの「月の検索回数」と、キーワードの提案に本物の数字を使うための準備です。
決めたこと：docs/DECISIONS.md 2026-11-01（Search Console → キーワードプランナー → ラッコキーワード。Semrush の API は利用者が増えてから）。

キーやトークンは、チャット・GitHub・画面に貼らないでください。入れる場所は Vercel の環境変数と、常時稼働PCの `.env.local` だけです（docs/AI_SETUP.md と同じ）。
下の環境変数の名前は案です。つなぐ作業（CX）で変わる場合は、このファイルを直します。

## 1. ラッコキーワード（スタンダードプラン）

1. ラッコキーワード（https://rakkokeyword.com/）に、コタムのアカウントでログインする
2. スタンダードプラン（月2,475円〜、2026年2月25日以降の新プラン）を契約する。古いプランのままだと API は使えません
3. API キーを作る（作り方：https://rakkokeyword.com/knowledge/78/ 。キーは5個まで作れる。IP制限は任意）
4. キーを Vercel の環境変数 `RAKKO_API_KEY` と、常時稼働PCの `.env.local` に入れる（Vercel はプロジェクト aio → Settings → Environments → Production の下の Environment Variables）
5. 常時稼働PCで本物を1回試す：`RAKKO_LIVE=1 npx vitest run src/lib/keywords/rakko.live.test.ts --silent=false`（3クレジット。プランと残高、質問とサジェストが表示される）

状況（2026-11-01）：スタンダードを年額で契約済み。Vercel の Production と常時稼働PCの `.env.local` に `RAKKO_API_KEY` を登録済み。常時稼働PCで本物のテストが通った（「断熱リフォーム」で質問10件、サジェスト10件、検索数は全件に数字あり）。

使ってよい範囲：API利用ガイドライン（https://rakkokeyword.com/knowledge/9510/）。コタムが加工して特定の顧客に渡すのは申し込み不要。コタムのキー1つで顧客にデータを出すのは個別ライセンス（月55,000円・1年契約）。このサービスの使い方は docs/DECISIONS.md 2026-11-01 のとおりで、公開の前にラッコへ問い合わせる。

API の仕様：https://api.rakkokeyword.com/docs （写し /mnt/project-files/keyword-tools/rakko-openapi-1.26.0.json）。認証はヘッダー `X-API-Key`。クレジットはサジェスト・よくある質問が1回1.5、アカウント情報は0。レート制限は60回/60秒

## 2. Google キーワードプランナー（Google 広告 API）

時間がかかるのは 4 の審査です（数日〜数週間かかることがあります）。先に申し込みだけ進めてください。

1. コタムの Google アカウントで、Google 広告の「クライアント センター（MCC、管理者アカウント）」を作る
   - ヘルプ：https://support.google.com/google-ads/answer/7459399
2. その下に、ふつうの Google 広告アカウントを1つ作る（キーワードプランナーを使うため。広告は出さなくてよい。支払い方法の登録を求められたら登録だけする）
3. 管理者アカウントで API センター（https://ads.google.com/aw/apicenter）を開き、申し込みの用紙に答えて規約に同意する
   - 使い道は「自社サービスで、顧客のブログ記事のキーワードの検索回数を調べるため（広告の作成・変更はしない）」
4. 開発者トークンが「承認待ち」で出る。「ベーシック アクセス」を申し込む（テスト用のままだと本物の数字が取れません）
5. 承認されたら、開発者トークンと管理者アカウントの番号（10桁）を、Vercel の環境変数 `GOOGLE_ADS_DEVELOPER_TOKEN`・`GOOGLE_ADS_LOGIN_CUSTOMER_ID` に入れる
6. Google Cloud の設定（Google Ads API を有効にする、OAuth のクライアントを作る）は、CX と一緒に進める

注意：広告費を出していないアカウントでは、検索回数が「1,000〜1万」のようなおおまかな幅になります。画面ではそのまま幅で表示し、数字を作りません。

## 3. Google Search Console

つなぎ方はA（お客様が、コタムのサービス用アカウントを「制限付き」で足す）に決めました（docs/DECISIONS.md 2026-11-02）。コタムの準備は1回だけです。

1. Google Cloud（https://console.cloud.google.com/）に、コタムの Google アカウントでログインし、上の「プロジェクトを選択」→「新しいプロジェクト」で「cotam-aio」を作る
2. 左上のメニュー →「APIとサービス」→「ライブラリ」で「Google Search Console API」を探して「有効にする」
3. 「APIとサービス」→「認証情報」→「認証情報を作成」→「サービス アカウント」。名前は「aio-reader」。役割（ロール）は付けずに完了
4. できたサービスアカウントを開き、「鍵」→「鍵を追加」→「新しい鍵を作成」→「JSON」。JSON のファイルがダウンロードされる（これが鍵です。チャットや GitHub に貼らない）
5. JSON の中の client_email を Vercel の環境変数 `GOOGLE_SERVICE_ACCOUNT_EMAIL` に、private_key（-----BEGIN から END PRIVATE KEY-----
 まで）を `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` に入れる（Production と Preview）。常時稼働PCの `.env.local` にも同じ2つ。入れたら Vercel で Redeploy
6. Supabase の SQL Editor で supabase/migrations/20261102160000_search_console.sql を流す
7. コタムの Search Console で試す：お客様の画面の「つなぐ」から、client_email を「制限付き」で足し、サイトのURLを入れる

お客様の手順は画面（/search-console）に出ます。料金はかかりません（Search Console API は無料。1日あたりの回数の上限は十分）。

## 出典

- Google 広告 API 開発者トークン：https://developers.google.com/google-ads/api/docs/get-started/dev-token
- Google 広告 API のキーワードの案と検索回数：https://developers.google.com/google-ads/api/reference/rpc/v25/KeywordPlanIdeaService
- ラッコキーワード API の発表：https://prtimes.jp/main/html/rd/p/000000065.000040858.html
