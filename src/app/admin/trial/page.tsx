import { redirect } from "next/navigation";
import { EmptyState, Notice } from "@/components/ui";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { setTrialEnabled, setTrialLimits } from "./actions";
import { TRIAL_RANGES } from "./ranges";
import { groupTrialReasons } from "@/lib/admin/trialReason";

// 30秒でためす（/try）の見守り。全社管理者だけ。入力は残していないので、回数と費用と、見本に切り替えた理由だけを見る。

const jstDay = (d: Date) => new Date(d.getTime() + 9 * 3600_000).toISOString().slice(0, 10);

/** 画面を作った時刻（サーバーで1回だけ読む） */
function currentTime(): Date {
  return new Date();
}

interface Run {
  status: string;
  cost_yen: number;
  error_code: string | null;
  created_at: string;
}

export default async function AdminTrialPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="page max-w-3xl">
        <EmptyState title="この画面は検証環境・本番環境で使います">画面試作（架空データ）では使えません。</EmptyState>
      </main>
    );
  }
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?next=/admin/trial");
  const { data: isAdmin } = await supabase.from("app_admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (!isAdmin) {
    return (
      <main className="page max-w-3xl">
        <EmptyState mood="sad" title="この画面を表示する権限がありません">全社管理者だけが使えます。</EmptyState>
      </main>
    );
  }

  const admin = createAdminSupabase();
  const now = currentTime();
  const since = new Date(now.getTime() - 31 * 24 * 3600_000).toISOString();
  const [{ data: settings, error: sErr }, { data: runs, error: rErr }] = await Promise.all([
    admin.from("app_settings").select("trial_ai_enabled, trial_daily_per_visitor, trial_daily_total, trial_monthly_budget_yen").eq("id", true).maybeSingle(),
    admin.from("trial_runs").select("status, cost_yen, error_code, created_at").gte("created_at", since).order("created_at", { ascending: false }).limit(5000),
  ]);

  if (sErr || rErr || !settings) {
    return (
      <main className="page max-w-3xl space-y-4">
        <h1 className="text-2xl font-black">30秒でためすの見守り</h1>
        <Notice tone="warn" title="まだ使えません">
          SQL（supabase/migrations/20261103120000_trial_ai.sql）を流すと、この画面が使えるようになります。
        </Notice>
      </main>
    );
  }

  const list = (runs ?? []) as Run[];
  const today = jstDay(now);
  const month = today.slice(0, 7);
  const todays = list.filter((r) => jstDay(new Date(r.created_at)) === today);
  const monthRuns = list.filter((r) => jstDay(new Date(r.created_at)).startsWith(month));
  const monthCost = monthRuns.reduce((s, r) => s + Number(r.cost_yen || 0), 0);
  const rejected = monthRuns.filter((r) => r.status !== "succeeded" && r.status !== "running");
  const reasons = Object.entries(
    rejected.reduce<Record<string, number>>((m, r) => ((m[r.error_code ?? "other"] = (m[r.error_code ?? "other"] ?? 0) + 1), m), {}),
  ).sort((a, b) => b[1] - a[1]);
  const days = Array.from({ length: 14 }, (_, i) => jstDay(new Date(now.getTime() - (13 - i) * 24 * 3600_000)));
  const perDay = days.map((d) => ({ d, n: list.filter((r) => jstDay(new Date(r.created_at)) === d).length }));
  const peak = Math.max(1, ...perDay.map((x) => x.n));
  const budgetRatio = settings.trial_monthly_budget_yen > 0 ? Math.min(1, monthCost / settings.trial_monthly_budget_yen) : 1;

  return (
    <main className="page max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-black sm:text-3xl">30秒でためすの見守り</h1>
      </div>

      <section className={`card space-y-3 border-2 ${settings.trial_ai_enabled ? "border-ok-bright" : "border-danger"}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-lg font-black">
            AIは今 {settings.trial_ai_enabled ? <span className="text-ok">動いています</span> : <span className="text-danger">止まっています（見本で動きます）</span>}
          </p>
          <form action={setTrialEnabled}>
            <input type="hidden" name="enabled" value={settings.trial_ai_enabled ? "false" : "true"} />
            <button type="submit" className={settings.trial_ai_enabled ? "btn-danger" : "btn-primary"}>
              {settings.trial_ai_enabled ? "AIを止める" : "AIを再開する"}
            </button>
          </form>
        </div>
        <p className="text-sm text-muted">止めても /try は見本で最後まで動きます。</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="今日ためした回数" value={`${todays.length} 回`} note={`全体の上限 ${settings.trial_daily_total} 回`} />
        <Stat label="今日AIで作れた回数" value={`${todays.filter((r) => r.status === "succeeded").length} 回`} note="見本に切り替えた分はのぞく" />
        <Stat label="今月の費用（目安）" value={`${Math.round(monthCost).toLocaleString()} 円`} note={`上限 ${settings.trial_monthly_budget_yen.toLocaleString()} 円`} />
      </section>

      <section className="card space-y-2">
        <h2 className="font-black">今月の予算の使い方</h2>
        <div className="h-4 overflow-hidden rounded-full bg-canvas-deep" role="img" aria-label={`${Math.round(budgetRatio * 100)}%`}>
          <div className={`h-full rounded-full ${budgetRatio >= 0.8 ? "bg-danger" : "bg-brand"}`} style={{ width: `${budgetRatio * 100}%` }} />
        </div>
        <p className="text-sm text-muted">{Math.round(budgetRatio * 100)}% を使いました。上限に着くと、その月はAIを呼ばずに見本で動きます。</p>
      </section>

      <section className="card space-y-3">
        <h2 className="font-black">この2週間、ためされた回数</h2>
        <p className="text-xs text-muted">AIで作れた回と、見本に切り替えた回を合わせた数です。</p>
        <ol className="flex h-32 items-end gap-1" aria-label="日ごとの回数">
          {perDay.map((x) => (
            <li key={x.d} className="flex flex-1 flex-col items-center gap-1" title={`${x.d}：${x.n}回`}>
              <span className="text-[10px] font-bold text-muted">{x.n || ""}</span>
              <span className="w-full rounded-t-md bg-brand" style={{ height: `${(x.n / peak) * 88}px`, minHeight: x.n ? 3 : 0 }} />
              <span className="text-[10px] text-muted">{Number(x.d.slice(8))}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="card space-y-2">
        <h2 className="font-black">今月、見本に切り替えた理由</h2>
        {reasons.length === 0 ? (
          <p className="text-muted">ありません。</p>
        ) : (
          <ul className="space-y-1">
            {groupTrialReasons(reasons).map((g) => (
              <li key={g.label} className="flex justify-between gap-3 rounded-xl bg-canvas px-3 py-1">
                <span className="min-w-0">
                  {g.label}
                  {g.next && <span className="block text-sm text-brand-dark">やること：{g.next}</span>}
                  {g.details.map((d) => (
                    <span key={d} className="block break-all text-xs text-muted">
                      {d}
                    </span>
                  ))}
                </span>
                <b className="shrink-0 whitespace-nowrap">{g.count} 回</b>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-muted">ためした人の入力と、AIの文章は残していません。回数・費用・理由だけです。</p>
      </section>

      <section className="card space-y-3">
        <h2 className="font-black">上限を変える</h2>
        <form action={setTrialLimits} className="grid gap-3 sm:grid-cols-3 sm:items-end">
          <Limit name="trial_daily_per_visitor" label="1人1日の回数" value={settings.trial_daily_per_visitor} />
          <Limit name="trial_daily_total" label="全体の1日の回数" value={settings.trial_daily_total} />
          <Limit name="trial_monthly_budget_yen" label="ためす用の月の予算（円）" value={settings.trial_monthly_budget_yen} />
          <button type="submit" className="btn-primary sm:col-span-3">
            この上限にする
          </button>
        </form>
        <p className="text-xs text-muted">行き過ぎないよう、入れられる値に上限があります（1人1日20回、全体1日1,000回、月5万円まで）。全体の月の予算（記事づくりと合わせた分）も別に効きます。</p>
      </section>
    </main>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="card">
      <p className="text-sm font-bold text-muted">{label}</p>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs text-muted">{note}</p>
    </div>
  );
}

function Limit({ name, label, value }: { name: keyof typeof TRIAL_RANGES; label: string; value: number }) {
  const r = TRIAL_RANGES[name];
  return (
    <label className="block">
      <span className="field-label text-sm">{label}</span>
      <input name={name} type="number" min={r.min} max={r.max} defaultValue={value} className="field" />
    </label>
  );
}
