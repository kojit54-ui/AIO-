# DATA：データ構成と権限

DBは Supabase（PostgreSQL）を想定。会社単位のデータはすべて `organization_id` を持ち、行レベルセキュリティ（RLS）とサーバー処理の両方でアクセスを制限する。

型は提案。`id` は uuid、日時は timestamptz、`created_at` / `updated_at` は全テーブルに持つ（省略）。

## テーブル

### organizations
| 列 | 型 | 説明 |
|---|---|---|
| name | text | 会社名 |
| profile | jsonb | 事業、対象顧客、強み、文体、禁止表現、問い合わせ先 |
| profile_approved_at | timestamptz | 顧客が確認した日時。AIへ渡すのは確認済みのプロフィールのみ |
| review_policy | text | `optional`（初期値）または `required` |
| monthly_generation_limit | int | 初期値 30 |

### memberships
| 列 | 型 | 説明 |
|---|---|---|
| user_id | uuid | auth.users |
| organization_id | uuid | |
| role | text | `client_member` / `coach` |
| revoked_at | timestamptz | 退会・担当外れでアクセス無効 |

全社管理者は `app_admins(user_id)` に分けて持つ（会社単位の役割と混ぜない）。

### invitations
| 列 | 型 | 説明 |
|---|---|---|
| organization_id, email, role | | |
| token_hash | text | トークンはハッシュで保存 |
| expires_at | timestamptz | 発行から7日（提案） |
| accepted_at | timestamptz | |

リンクのトークンはサーバーで作り（32バイトの乱数）、DBには SHA-256 のハッシュだけを保存する。関数：
- `invitation_status(token_hash)`：valid / expired / used / invalid と会社名（service role だけ）
- `accept_invitation(token_hash)`：期限・使用済みを検査し、同じメールアドレスの auth.users に所属を作る。外された人の再招待では所属を戻す（service role だけ）
- `revoke_membership(membership_id)`：所属を外し、その人の未使用の招待も無効にする（全社管理者だけ）
- `list_members(organization_id)`：所属者とメールアドレス（全社管理者だけ）

流れは docs/SUPABASE_SETUP.md「招待とログインの流れ」。

### coaching_notes
| 列 | 型 | 説明 |
|---|---|---|
| organization_id | uuid | |
| target_month | date | 月初日 |
| focus, audience, purpose, avoid | text | 重点テーマ、想定読者、記事の目的、避ける内容 |
| client_visible_note | text | 顧客向けメモ（AIに渡す） |
| internal_note | text | コタム内部メモ（顧客に見せない、AIに渡さない） |

`internal_note` は顧客から読めないよう、別テーブル `coaching_internal_notes` に分ける実装でもよい（RLSを列単位にしないため）。

### themes
| 列 | 型 | 説明 |
|---|---|---|
| organization_id | uuid | |
| target_month | date | |
| title | text | |
| reader_problem | text | 誰の悩みに答えるか |
| message | text | 伝えたい内容 |
| sort_order | int | |
| source | text | `coach`（コタム登録）/ `client`（自分で決めた） |

### reference_articles
| 列 | 型 | 説明 |
|---|---|---|
| organization_id | uuid | |
| title, body | text | 貼り付けた本文 |
| url | text | 任意 |
| published_on | date | 任意 |
| usable_for_ai | bool | AIの参考に使うか |

### articles
| 列 | 型 | 説明 |
|---|---|---|
| organization_id | uuid | |
| theme_id | uuid | |
| status | text | 下記の状態 |
| current_version_id | uuid | |
| approved_version_id | uuid | 承認された版。編集で無効化 |
| published_url | text | |
| published_at | timestamptz | |
| published_without_approval | bool | 任意設定の会社で未承認のまま公開した記録 |
| lock_version | int | 編集競合の検知用（楽観ロック） |
| draft_answers, draft_step | jsonb, int | 質問への回答の下書きと、何問目まで進んだか |

### article_versions
| 列 | 型 | 説明 |
|---|---|---|
| article_id, organization_id | uuid | |
| version_no | int | |
| answers | jsonb | 質問への回答 |
| outline | jsonb | 見出し案 |
| title | text | |
| body | jsonb | 構造化本文（見出し・段落・箇条書き）。HTMLは書き出し時に生成 |
| generation_settings | jsonb | 提供元（provider）、サンプルか（sample）、手で直したか（edited）、足りない情報（needs_info）、画像の提案（eyecatch、image_suggestions）、点検の結果（review：provider・summary・findings・rewritten）、工程ごとの提供元と成否（steps）。手で直した版にも画像の提案と点検の結果を引き継ぐ |
| parent_version_id | uuid | 元にした版 |
| created_by | uuid | |
| frozen | bool | 確認依頼中・承認済みの版は true（以後編集不可） |

### fact_checks
| 列 | 型 | 説明 |
|---|---|---|
| version_id, organization_id | uuid | |
| location | jsonb | 本文中の位置 |
| excerpt | text | 該当箇所 |
| kind | text | `number` / `achievement` / `price` / `customer_name` / `other` |
| status | text | `unchecked` / `confirmed` / `fixed` / `removed` |
| checked_by, checked_at | | |

### reviews
| 列 | 型 | 説明 |
|---|---|---|
| article_id, version_id, organization_id | uuid | |
| reviewer_id | uuid | |
| comment | text | 本文全体へのコメント |
| decision | text | `comment` / `changes_requested` / `approved` |
| reviewer_name | text | 書いた時点の表示名（auth.users は利用者から読めないため） |

### generation_runs
| 列 | 型 | 説明 |
|---|---|---|
| organization_id, article_id | uuid | |
| kind | text | `outline` / `body` / `rewrite` / `followup_questions` / `image` |
| status | text | `queued` / `running` / `succeeded` / `failed` |
| idempotency_key | text | 二重クリック防止（unique） |
| input_chars | int | |
| usage | jsonb | トークン数・概算費用 |
| error_code | text | 本文や個人情報はログに残さない |
| result_version_id | uuid | |
| cost_yen | numeric | 概算費用（円）。月額予算の判定に使う |

受付は `start_generation(article_id, kind, idempotency_key, input_chars)` だけで行い、利用者は generation_runs に直接書けない。判定の順番：
1. 所属（顧客担当者かコタム担当者）と入力（8,000字まで、キー8〜200字）。違えば `forbidden` / `invalid_input`
2. 同じキーの受付があれば、それをそのまま返す（二重クリック）
3. 10分（app_settings.generation_timeout_seconds）を過ぎた実行中の受付は `timeout` で失敗にする
4. 同じ会社で実行中があれば `busy`
5. 全社の今月の費用が予算に達していれば `budget_exceeded`
6. 本文（kind=body）だけ、会社の月の上限（organizations.monthly_generation_limit）と記事ごとの上限（app_settings.article_body_limit、初期値10）。失敗した回と時間切れの回は数えない。超えれば `limit_reached`
7. 画像（kind=image）は記事ごとの回数（app_settings.article_image_limit、初期値10）。1回でアイキャッチと見出しごとの画像をまとめて作る。失敗した回は数えない。費用は作れた枚数×画像の提供元の単価（google 11円、openai 38円。src/lib/generation/images.ts の IMAGE_COST_YEN）

画面は `get_generation(run_id)` で状態を問い合わせる。時間を過ぎた受付はここでも失敗（timeout）になるので、次の生成を押さなくても「生成中」のままにならない。

結果は `finish_generation(run_id, status, usage, cost_yen, error_code, result_version_id)` でサーバーだけが記録する。cost_yen はその回の費用の合計で、同じ報告を再送しても増えない。予算は `budget_status()` で確認し、通知したら `mark_budget_notified()`。月の区切りは日本時間。

### app_settings
全社共通の設定（1行）。利用者からは読み書きできない。
| 列 | 型 | 説明 |
|---|---|---|
| monthly_budget_yen | int | 全社の月額予算。初期値 10000 |
| budget_notify_ratio | numeric | 通知する割合。初期値 0.80 |
| budget_notified_month | date | 今月通知済みか |
| article_body_limit | int | 同じ記事の本文生成の上限。初期値 10 |
| generation_timeout_seconds | int | 実行中のまま失敗とみなすまでの秒数。初期値 600 |
| article_image_limit | int | 同じ記事で画像を作れる回数。初期値 10 |

### article_images
記事の画像（ナノバナナで作ったもの）。記事ごと・枠ごとに1枚で、作り直すと置き換わる。ファイルは Supabase Storage の非公開バケット `article-images`（`{organization_id}/{article_id}/{eyecatch|h番号}-{時刻}.{拡張子}`）に置く。書き込みはサーバー（service role）だけ。画面には、この表をRLSで読めた行についてだけ、サーバーが1時間有効のURL（表示用とダウンロード用）を渡す（GET/POST `/api/articles/[id]/images`）。
| 列 | 型 | 説明 |
|---|---|---|
| article_id, organization_id | uuid | |
| slot | text | `eyecatch` または見出しの文字列（unique(article_id, slot)） |
| alt | text | 代替テキスト |
| storage_path | text | Storage の場所 |
| mime_type | text | |
| is_sample | boolean | キーが無いときのサンプル |
| created_by, created_at | | |

### audit_logs
| 列 | 型 | 説明 |
|---|---|---|
| actor_id, organization_id | uuid | |
| action | text | 招待、役割変更、設定変更、承認、削除など |
| target | jsonb | |

## 記事の状態

```
drafting ──確認依頼──▶ in_review ──修正依頼──▶ changes_requested
   ▲                      │                         │
   │                      └──承認──▶ approved        │顧客が編集開始
   │                                  │              ▼
   ├──────────承認後に編集（承認無効）──┘           drafting
   │
   └─(review_policy=optional のみ)──公開済み登録──▶ published
approved ──公開済み登録──▶ published
published ──修正開始──▶ drafting（公開URLは保持）
```

- 確認依頼すると、その版を `frozen=true` にする。確認待ち中の編集は新しい版として保存し、確認待ちの版は変えない
- 承認後に編集したら `approved_version_id` を null に戻し、状態を drafting にする
- `review_policy=required` の会社では approved からしか published にできない（サーバーで検査）
- optional の会社で drafting から published にした場合は `published_without_approval=true`
- 書き出し（コピー）では状態を変えない

## 権限

| 操作 | client_member | coach（担当企業） | admin |
|---|---|---|---|
| 自社記事の閲覧・作成・編集 | ○ | 閲覧・レビュー | ○ |
| 確認依頼 | ○ | − | ○ |
| コメント・修正依頼・承認 | − | ○ | ○ |
| プロフィール編集 | 確認のみ | ○ | ○ |
| 顧客向け指導メモ・テーマ・過去記事 | 閲覧 | ○ | ○ |
| 内部メモ | × | ○ | ○ |
| 確認依頼の必須・任意設定 | × | ○ | ○ |
| 招待・役割変更 | × | × | ○ |

RLSの基本形：`organization_id in (select organization_id from memberships where user_id = auth.uid() and revoked_at is null)`。役割による制限は書き込み系のポリシーとサーバー処理で追加する。

## 受け入れ確認

- 別企業のアカウントで他社の記事・回答・過去記事を読む／書くAPI操作がすべて拒否される（RLSとAPIの両方でテスト）
- 担当外の企業はコタム担当者でも読めない
- AIへの入力に内部メモと他社のデータが含まれないことをテストで確認する

## UI試作で使う型（画面とAPIの受け渡し）

画面試作では次のTypeScript型に合わせた架空データを使い、API接続時にそのまま差し替える。正本は実装時に `src/types/domain.ts` に置く。

```ts
type ArticleStatus = 'drafting' | 'in_review' | 'changes_requested' | 'approved' | 'published';
type Role = 'client_member' | 'coach';

interface ArticleSummary {
  id: string; title: string; themeTitle: string;
  status: ArticleStatus; updatedAt: string; hasCoachComment: boolean;
}

interface ArticleVersion {
  id: string; versionNo: number; title: string;
  outline: { heading: string }[];
  body: Block[]; frozen: boolean; createdAt: string;
}

type Block =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] };

interface FactCheck {
  id: string; excerpt: string;
  kind: 'number' | 'achievement' | 'price' | 'customer_name' | 'other';
  status: 'unchecked' | 'confirmed' | 'fixed' | 'removed';
}

interface GenerationRun {
  id: string; status: 'queued' | 'running' | 'succeeded' | 'failed';
  errorCode?: 'limit_reached' | 'timeout' | 'provider_error' | 'invalid_input' | 'busy' | 'budget_exceeded';
  resultVersionId?: string;
}
```

## 画面とデータのつなぎ方（T2-9）

- Supabase の値（NEXT_PUBLIC_SUPABASE_URL・NEXT_PUBLIC_SUPABASE_ANON_KEY）があれば src/lib/remote/backend.ts、無ければ src/mock/ の架空データ。画面は同じ `useStore()` を使う
- 読み書きはブラウザからログイン中の利用者として行う。記事の更新は `lock_version` が読んだ時点と一致するときだけ書き、ずれていれば競合
- 確認依頼・承認した版は、記事の更新に合わせてDBのトリガー（freeze_requested_version）が固定する
- 顧客のプロフィール確認は `approve_profile(organization_id)`（会社の行は顧客から更新できないため）
- 手動の保存（新しい版＋要確認箇所＋記事の更新）とレビュー（記事の状態＋レビューの行）は `save_article_change` で1つのトランザクションにする。版番号はDBで決め、lock_version が違えば `conflict` を返す。競合したら画面は最新を読み直してから選択肢を出す
- 生成は POST /api/articles/[id]/generations `{ kind, headings, idempotencyKey }` → `{ versionId }`。サーバーが start_generation → AI → 版・要確認箇所の保存 → 記事の更新 → finish_generation を行う（src/lib/generation/server.ts）

## API案（T1-9、CXのレビュー待ち）

画面試作の擬似API（src/mock/store.tsx の `createApi`）と同じ形で、サーバー側に用意する想定。すべて認証必須で、会社の所属と役割をサーバーで検査する。状態遷移は src/lib/workflow.ts の `applyAction` をサーバーでも使う。

| 操作 | 方法・パス案 | 入力 | 主なエラー |
|---|---|---|---|
| 記事を作る | POST /api/articles | `{ themeId }` または `{ customTheme: { title, readerProblem } }` | forbidden |
| 回答を下書き保存 | PUT /api/articles/:id/answers | `{ answers, step }` | save_failed, session_expired |
| 見出し案を作る | POST /api/articles/:id/generations | `{ kind: "outline", idempotencyKey }` → `GenerationRun` | limit_reached, provider_error, timeout |
| 本文を作る／もう一度作る | POST /api/articles/:id/generations | `{ kind: "body", headings, idempotencyKey }` | 同上 |
| 生成の状態を確認 | GET /api/generations/:runId | − | not_found |
| 版を保存 | POST /api/articles/:id/versions | `{ title, body, outline?, expectedLockVersion }` | conflict（409）, save_failed |
| 版を復元 | POST /api/articles/:id/versions/:versionId/restore | `{ expectedLockVersion }` | conflict |
| 要確認箇所を更新 | PATCH /api/fact-checks/:id | `{ status }` | forbidden |
| 確認依頼 | POST /api/articles/:id/review-request | − | invalid_state |
| レビュー | POST /api/articles/:id/reviews | `{ decision, comment }` | forbidden, invalid_state |
| 公開済みにする | POST /api/articles/:id/publish | `{ url }` | approval_required, invalid_url |
| 会社設定を変更 | PATCH /api/organizations/:id | `{ reviewPolicy }` など | forbidden |
| テーマを追加 | POST /api/organizations/:id/themes | `{ title, readerProblem, message }` | forbidden |

- 生成は受付後すぐ `GenerationRun`（queued）を返し、画面は状態を問い合わせる。画面試作では待ち時間を擬似的に入れて完了まで待っている
- エラーは `{ code, message }` で返す。`code` は src/mock/store.tsx の `ApiError` と同じ値を使う

## 育つブログ（案、T5-3。CXのレビュー待ち）

画面試作（src/prototype/growth.ts）の型をもとにした案。どのテーブルも organization_id を持ち、RLS は既存と同じく `app.is_member` で会社ごとに絞る。

| テーブル | 主な列 | 書ける人 |
|---|---|---|
| hearing_answers | organization_id、question_id、text、follow_ups（jsonb：深掘りの質問と答えの配列。飛ばした深掘りは答えを空で残す）、is_draft（boolean、既定 true。「次へ」を押すまで書きかけ）、updated_by、updated_at。unique(organization_id, question_id) | 顧客担当者とコタム（同じ行を両方が直せる。最後に保存した内容が残る） |
| keyword_plans | id、organization_id、proposal（jsonb：選んだ提案の柱・クラスター・ねらい）、chosen_by、chosen_at、archived_at | 顧客担当者 |
| keyword_rows | id、plan_id、organization_id、kind（pillar／cluster）、keyword、reader_question、status（todo／writing／published）、article_id（記事ができたら）、sort_order | 顧客担当者。status は記事の状態から自動で変える（記事が published になったら published） |

- 深掘りの質問とキーワードの提案の指示と返答の検査は src/lib/ai/growthPrompts.ts（FOLLOWUP_SYSTEM_PROMPT・PROPOSAL_SYSTEM_PROMPT、parseFollowUp・parseProposals）。生成と同じくサーバーで作り、generation_runs に kind（hearing_followup／keyword_proposal）で記録して予算に数える
- 答え終わったか（isAnswerDone）は「text がある・is_draft が false・深掘りが残っていない」で決め、続きの位置、答えた数、ヒアリングの点、提案を作れるかに同じ判定を使う
- レベルとバッジは保存せず、keyword_rows と hearing_answers から毎回計算する（computeGrowth と同じ式）
- 第2段階で search_console_daily（organization_id、date、query、page、clicks、impressions、position）を足す。書き込みは service role だけ
