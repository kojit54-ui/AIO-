# 役割別テスト（お客様役・管理者役を AI が採点）

画面を直したら、田村さんの手を止めずに、本番で「お客様」と「コタムの担当者」の目で確かめる。2026-11-08 に、この形で両方 9.5 点を超えた（お客様 9.6／9.7、管理者 10.0／9.9）。

## 役
- お客様役：58歳・社員10人の金属加工の社長。ITは苦手、スマホ（375px）。アカウント tamura+kyaku@co-tam.co.jp
- 管理者役：コタムの担当者。PC（1280px）。アカウント tamura@co-tam.co.jp（app_admins）
- 採点：GPT と Gemini が両方の役を採点する。Claude は直す側（全体の点検と修正）

## 手順
1. 本番に出してから試す（ブランチのためし公開はしない。vercel.json）
2. 撮る（ログインの番号はメールで届く。Gmail コネクタで tamura@co-tam.co.jp の受信箱から「次の番号を入れてください：NNNNNN」を読み、宛先で2人を見分けて `<出力>/code-<role>.txt` に書く）
   - お客様：`FULL=1 node scripts/role-test/browse.mjs <出力> customer tamura+kyaku@co-tam.co.jp /,/mypage`
   - 管理者：`FULL=1 node scripts/role-test/browse.mjs <出力> admin tamura@co-tam.co.jp /coach,/admin/usage,/admin/invitations,/admin/trial,/admin/waitlist`
   - 1分あけてから：`node scripts/role-test/sent.mjs <出力> tamura+kyaku@co-tam.co.jp`（続けて送ると 429）
3. 採点：`node scripts/role-test/score.mjs <customer|admin> <出力> [前回の出力] [直したことのメモ.txt]`
4. 減点の理由を直し、2 から繰り返す。両方の役で GPT・Gemini とも 9.5 以上で終わり

## 採点の決まり（scripts/role-test/roles/rubric.md）
- 前回の指摘が直ったかを ○△× で確かめてから、4つの観点（迷わず進める・言葉・表示の崩れ・目的が果たせる）の平均を最終点にする
- 減点は「実際に困る・間違える」ものだけ。好みや新しい機能の案は「追加の案」にして減点しない。前回の直しと逆向きの提案はさせない
- 全体の写し（FULL=1）を渡す。途中で切れた写しを「表示が切れている」と読まれるため
- 前回の指摘を渡さずに採ると、同じ画面でも GPT は 0.3 点ほど辛くなる。比べるときは同じ渡し方で

## 分かったこと
- 「点数だけを聞く」採点では、何を直しても GPT が 8.5 で止まり、前回と逆の直しを求めることがあった（11回目まで）。今の決まりにしてから上がった
- 直したら、撮った画面を Claude が自分の目でも見る。スマホでボタンを横に並べて文が数文字ずつ折り返す、のような崩れは採点役が見落とすことがある
- 本番のDBに表や列を足すときは、田村さんのOKをもらってから
