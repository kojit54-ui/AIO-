-- 有料プラン（Stripe のカード払い、7日間のお試し）。docs/DECISIONS.md 2026-11-07・2026-11-09。
-- 会社ごとに1行。行が無い会社は、これまでどおり招待（コタムとの個別の契約）で使う会社として扱う。
-- 書き込むのはサーバー（service role）だけ。お客様は自分の会社の行を読むだけ。
-- 使えない状態（お試しも契約も切れた）の会社では、AIの受付（generation_runs への追加）を止める。
-- 何度流しても同じ結果になる。

create table if not exists public.org_billing (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  -- stripe：カード払いで申し込んだ会社。invited：招待の会社を後から有料に切りかえた記録用
  plan text not null default 'stripe' check (plan in ('stripe', 'invited')),
  -- Stripe のサブスクリプションの状態をそのまま写す。申し込みの途中は incomplete
  status text not null default 'incomplete'
    check (status in ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  trial_end timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  -- お試しを一度使ったか（2回目からはお試しなし）
  trial_used boolean not null default false,
  -- 申し込みの最終確認で同意した規約の版と日時
  terms_version text,
  terms_agreed_at timestamptz,
  terms_agreed_by uuid references auth.users (id) on delete set null,
  -- 初めての請求の前の日のお知らせを送った日時
  trial_reminder_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.org_billing enable row level security;
drop policy if exists org_billing_select on public.org_billing;
create policy org_billing_select on public.org_billing for select to authenticated
  using (app.is_member(organization_id) or app.is_admin());
revoke insert, update, delete on public.org_billing from anon, authenticated;
grant select on public.org_billing to authenticated;

-- 使える会社か。行が無い（招待の会社）・お試し中・契約中・支払いの再試行中は使える
create or replace function app.org_entitled(org uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select b.status in ('trialing', 'active', 'past_due') from org_billing b where b.organization_id = org),
    true
  );
$$;

-- AIの受付をすべて止める（記事・点検・画像・ヒアリング・キーワードの提案。どれも generation_runs に入る）
create or replace function app.guard_billing() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.organization_id is not null and not app.org_entitled(new.organization_id) then
    raise exception 'billing_inactive' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists generation_runs_billing on public.generation_runs;
create trigger generation_runs_billing before insert on public.generation_runs
  for each row execute function app.guard_billing();
