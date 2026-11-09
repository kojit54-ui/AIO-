# 有料プラン（Stripe）の準備と確かめ方

条件は docs/DECISIONS.md（2026-11-07・2026-11-09）。コードは src/lib/billing/、画面は /signup・/signup/done・マイページの「お支払い」・/admin/billing。

## 入れるもの

| どこ | 名前 | 値 |
|---|---|---|
| Vercel（本番） | STRIPE_SECRET_KEY | テストのあいだは sk_test_…、受付開始のときに sk_live_… |
| Vercel（本番） | SIGNUP_OPEN | 本番の鍵で受付を始めるとき `on` |
| Vercel（本番） | NEXT_PUBLIC_SIGNUP_OPEN | 入口ページに申し込みのボタンを出すとき `on` |
| Supabase（東京） | SQL | supabase/migrations/20261109150000_billing.sql |

Stripe の画面での設定は要らない。料金（lookup_key `aio_erabare_monthly_55000_jpy`）・カスタマーポータルの設定・Webhook の届け先（/api/stripe/webhook）は、最初の申し込みのときにアプリが作る（/admin/billing のボタンでも作れる）。テストと本番は別々に作られる。

## テストモードで通す

1. @co-tam.co.jp のアドレス（例 tamura+pay1@co-tam.co.jp）で /signup から申し込む。番号は Gmail で読む
2. 最終確認で条件を見て同意 → Stripe の画面でカード 4242 4242 4242 4242・期限は未来・CVC 何でも
3. /signup/done で「お試し中」。マイページの「お支払い」に初回の請求日が出る
4. マイページ →「カード・解約・領収書」→ 解約 → マイページに「お試し中（解約の手続き済み）」
5. 期限切れ・支払い失敗は Stripe のテストクロック、またはサブスクリプションを API で止めて、/admin/billing と画面の案内（AIが止まる）を見る

## 未確認

- 適格請求書（インボイス）の登録番号を Stripe の請求書に載せるか（田村さんに確認）
- 本番の鍵に切りかえる日と、受付開始の日
