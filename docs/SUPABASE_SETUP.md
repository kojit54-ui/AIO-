# SUPABASE_SETUP：Supabase の準備

検証用と本番用でプロジェクトを分ける（docs/RELEASE.md）。秘密の値（DBのパスワード、service_role キー）はチャット・Git・画面に出さない。

## 作ったプロジェクト

| 環境 | プロジェクト名 | 場所 | URL | 作成日 |
|---|---|---|---|---|
| 検証 | cotam-blog-staging（組織 co-tam、Free） | South Asia (Mumbai) | https://yxpteazaakcpyfvuikap.supabase.co | 2026-10-22 |
| 本番 | 未作成。Northeast Asia (Tokyo) で作る | | | |

検証用のアプリは Vercel のプロジェクト aio（kojit54-ui's projects、Hobby）で、https://aio-erabare.jp （2026-11-04 から。前の https://aio-roan.vercel.app も開ける）。main に入ると自動で公開される。
環境変数は NEXT_PUBLIC_SUPABASE_URL・NEXT_PUBLIC_SUPABASE_ANON_KEY・SUPABASE_SERVICE_ROLE_KEY の3つ（2026-10-22）。AIのキーは未設定のため、生成はサンプルになる。
お客様に使ってもらう前に Pro に切り替える（Hobby は商用利用不可）。

## 手順（新しいプロジェクトを作るとき）

1. 組織の画面で「New project」。Region は `Northeast Asia (Tokyo)`。DBのパスワードは「Generate a password」で作り、パスワード管理にだけ保存する
2. SQL Editor で supabase/migrations/ のファイルを古い順に実行する（「Success. No rows returned」で完了）
3. Authentication → Sign In / Providers で「Allow new users to sign up」をオフにして Save（招待した人だけがログインできる）
4. メールの文面は、独自ドメインの SMTP を設定するまで変えられない（Supabase の制限）。標準の文面のままだと、ログイン用のメールは**送ったのと同じブラウザで**開く必要がある（/auth/confirm は code で受ける）。SMTP の設定後（T3-2）に Authentication → Emails → Magic Link を次に差し替えると、別の端末で開いてもログインできる
   - Subject：`AIOえらばれ帳 ログイン用のリンク`
   - Body：
     ```
     <h2>ログイン用のリンク</h2>
     <p>下のリンクを開くと、AIOえらばれ帳にログインします（1時間有効）。</p>
     <p><a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email">ログインする</a></p>
     <p>心当たりがない場合は、このメールを破棄してください。</p>
     ```
5. Authentication → URL Configuration
   - Site URL：アプリのURL（検証は https://aio-erabare.jp ）
   - Redirect URLs：`<アプリのURL>/auth/confirm**`（ローカルで試すときは `http://localhost:3000/auth/confirm**` も）。ここに無いURLへはメールのリンクが戻らない
6. Project Settings → API Keys から `URL`、`anon`（公開してよい鍵）、`service_role`（秘密）を、Vercel の環境変数に入れる（.env.example の名前）
7. 最初の全社管理者：Authentication → Users →「Add user」でメールアドレスを登録し、SQL Editor で
   `insert into public.app_admins (user_id) select id from auth.users where email = '<メールアドレス>';`
   を実行する。以後は /admin/invitations から会社の追加と招待ができる
8. 本番だけ：独自ドメインの SMTP を Authentication → Emails → SMTP Settings に設定する（T3-2）。標準のメール送信は1時間あたりの通数が少ない

## 招待とログインの流れ

1. 全社管理者が /admin/invitations で会社を選び、メールアドレスと役割を入れて「招待リンクを作る」
2. 表示されたリンク（7日間有効、この1回だけ表示）を、本人にメールなどで送る
3. 本人がリンクを開いて「同意してはじめる」→ 招待先のメールアドレスにログイン用のメールが届く
4. メールのリンクを開くとログインする。次からは /login でメールアドレスを入れるとログイン用のメールが届く
5. 退会・担当外れは /admin/invitations の「所属を外す」。その人は何も見えなくなり、未使用の招待も無効になる。招待し直すと戻れる

## Googleでログイン（T6-7）

招待制のまま、招待されたメールアドレスと同じ Google アカウントだけ入れる。「Allow new users to sign up」がオフなので、招待されていない Google アカウントは作られない。念のため /auth/confirm（via=google）で所属か全社管理者かを確かめ、無ければログアウトさせる（src/lib/auth/google.ts）。

1. Google Cloud（プロジェクト cotam-aio）→ 「APIとサービス」→「OAuth 同意画面」（Google Auth Platform）：アプリ名「AIOえらばれ帳」、サポートメール、対象は「外部」、承認済みドメイン aio-erabare.jp と supabase.co。公開ステータスを「本番環境」にする（テストのままだと登録したテストユーザーしか入れない）。スコープは email・profile・openid だけなので審査はいらない
2. 「認証情報」→「OAuth クライアント ID を作成」→ 種類「ウェブ アプリケーション」。承認済みのリダイレクト URI に `https://<SupabaseのプロジェクトID>.supabase.co/auth/v1/callback`（ステージングは https://yxpteazaakcpyfvuikap.supabase.co/auth/v1/callback）
3. Supabase → Authentication → Sign In / Providers → Google を有効にし、クライアント ID とクライアント シークレットを貼って Save。「Allow new users to sign up」はオフのまま
4. Supabase → Authentication → URL Configuration の Redirect URLs に `https://aio-erabare.jp/auth/confirm**` があること
5. Vercel の環境変数 `NEXT_PUBLIC_GOOGLE_LOGIN=on` を足して Redeploy（ビルド時に埋め込まれるため）

## メールの6桁の番号でログイン（T6-8）

ログインのメールに、リンクと一緒に6桁の番号を載せる。リンクがスマホでうまく開けない人や、パソコンで入りたいのにメールはスマホで読む人のため。番号は Supabase が作り、`verifyOtp({ type: "email" })` で確かめる（src/lib/auth/loginCode.ts）。

1. Supabase → Authentication → Emails → Magic Link の Body の「ログインする」の行の下に足して Save
   ```
   <p>または、ログインの画面で次の番号を入れてください：<b style="font-size:24px;letter-spacing:4px">{{ .Token }}</b></p>
   ```
2. Authentication → Providers → Email の「Email OTP Length」が 6 であること（6〜8桁なら受けられる）
3. Vercel の環境変数 `NEXT_PUBLIC_LOGIN_CODE=on` を足して Redeploy
