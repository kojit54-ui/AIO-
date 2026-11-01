# キーワードツールの準備（田村さん向けの手順）

書く記事リストの「月の検索回数」と、キーワードの提案に本物の数字を使うための準備です。
決めたこと：docs/DECISIONS.md 2026-11-01（Search Console → キーワードプランナー → ラッコキーワード。Semrush の API は利用者が増えてから）。

キーやトークンは、チャット・GitHub・画面に貼らないでください。入れる場所は Vercel の環境変数と、常時稼働PCの `.env.local` だけです（docs/AI_SETUP.md と同じ）。
下の環境変数の名前は案です。つなぐ作業（CX）で変わる場合は、このファイルを直します。

## 1. ラッコキーワード（スタンダードプラン）

1. ラッコキーワード（https://related-keywords.com/）に、コタムのアカウントでログインする
2. スタンダードプラン（月2,475円〜、2026年2月25日以降の新プラン）を契約する。古いプランのままだと API は使えません
3. マイページで API の画面を開き、API キーを作る（画面の名前と場所は未確認。見つからなければ、そこで止めて教えてください）
4. キーを Vercel の環境変数 `RAKKO_API_KEY` と、常時稼働PCの `.env.local` に入れる

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

つなぎ方（顧客がコタムのアカウントを閲覧者に追加する案がおすすめ）は、まだ決めていません（docs/DECISIONS.md 2026-10-23）。キーワードプランナーとラッコの後に決めます。

## 出典

- Google 広告 API 開発者トークン：https://developers.google.com/google-ads/api/docs/get-started/dev-token
- Google 広告 API のキーワードの案と検索回数：https://developers.google.com/google-ads/api/reference/rpc/v25/KeywordPlanIdeaService
- ラッコキーワード API の発表：https://prtimes.jp/main/html/rd/p/000000065.000040858.html
