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

### article_versions
| 列 | 型 | 説明 |
|---|---|---|
| article_id, organization_id | uuid | |
| version_no | int | |
| answers | jsonb | 質問への回答 |
| outline | jsonb | 見出し案 |
| title | text | |
| body | jsonb | 構造化本文（見出し・段落・箇条書き）。HTMLは書き出し時に生成 |
| generation_settings | jsonb | モデル、プロンプト版、使用した過去記事ID |
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

### generation_runs
| 列 | 型 | 説明 |
|---|---|---|
| organization_id, article_id | uuid | |
| kind | text | `outline` / `body` / `rewrite` / `followup_questions` |
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
6. 本文（kind=body）だけ、会社の月の上限（organizations.monthly_generation_limit）と記事ごとの上限（app_settings.article_body_limit、初期値10）。失敗した回は数えない。超えれば `limit_reached`

結果は `finish_generation(run_id, status, usage, cost_yen, error_code, result_version_id)` でサーバーだけが記録する。予算は `budget_status()` で確認し、通知したら `mark_budget_notified()`。月の区切りは日本時間。

### app_settings
全社共通の設定（1行）。利用者からは読み書きできない。
| 列 | 型 | 説明 |
|---|---|---|
| monthly_budget_yen | int | 全社の月額予算。初期値 10000 |
| budget_notify_ratio | numeric | 通知する割合。初期値 0.80 |
| budget_notified_month | date | 今月通知済みか |
| article_body_limit | int | 同じ記事の本文生成の上限。初期値 10 |
| generation_timeout_seconds | int | 実行中のまま失敗とみなすまでの秒数。初期値 600 |

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
