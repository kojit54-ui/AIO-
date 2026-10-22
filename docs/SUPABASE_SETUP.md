# SUPABASE_SETUP：Supabase の準備

検証用と本番用でプロジェクトを分ける（docs/RELEASE.md）。秘密の値（DBのパスワード、service_role キー）はチャット・Git・画面に出さない。

## 作ったプロジェクト

| 環境 | プロジェクト名 | 場所 | URL | 作成日 |
|---|---|---|---|---|
| 検証 | cotam-blog-staging（組織 co-tam、Free） | South Asia (Mumbai) | https://yxpteazaakcpyfvuikap.supabase.co | 2026-10-22 |
| 本番 | 未作成。Northeast Asia (Tokyo) で作る | | | |

## 手順（新しいプロジェクトを作るとき）

1. 組織の画面で「New project」。Region は `Northeast Asia (Tokyo)`。DBのパスワードは「Generate a password」で作り、パスワード管理にだけ保存する
2. SQL Editor で supabase/migrations/ のファイルを古い順に実行する（「Success. No rows returned」で完了）
3. Authentication → Sign In / Providers で「Allow new users to sign up」をオフにして Save（招待した人だけがログインできる）
4. Authentication → Emails → Magic Link を次に差し替える（別の端末でメールを開いてもログインできるよう、token_hash で確認する）
   - Subject：`コタム ブログ執筆支援 ログイン用のリンク`
   - Body：
     ```
     <h2>ログイン用のリンク</h2>
     <p>下のリンクを開くと、コタム ブログ執筆支援にログインします（1時間有効）。</p>
     <p><a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email">ログインする</a></p>
     <p>心当たりがない場合は、このメールを破棄してください。</p>
     ```
5. Authentication → URL Configuration
   - Site URL：アプリのURL（例：Vercel の URL）
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
