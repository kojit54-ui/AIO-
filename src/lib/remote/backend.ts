"use client";

// 本物のデータ（Supabase）を使う画面側の層。src/mock/store.tsx の架空データと同じ形（MockDb と api）で画面に渡す。
// 読み書きはログイン中の利用者として行い、会社ごとの制限・状態遷移・版の固定はDB（RLSとトリガー）が検査する。
// 生成だけはAIのキーを持つサーバー（/api/articles/[id]/generations）を通す。
// 件数が少ない前提（3〜5社）で、変更のたびに見える範囲をまとめて読み直す。

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Answer, Article, Block, CompanyProfile, FactCheckStatus, GenerationErrorCode, ReviewDecision, SessionUser } from "@/types/domain";
import { applyAction, type ArticleAction, TransitionError } from "@/lib/workflow";
import { extractFactChecks } from "@/mock/sampleGenerator";
import type { MockApi, MockDb, Simulation } from "@/mock/store";
import { ApiError } from "@/mock/store";
import type { SupabaseEnv } from "@/lib/supabase/env";
import {
  countBodyRunsThisMonth,
  currentMonthJst,
  fromArticle,
  fromMonth,
  toArticle,
  toCoachingNote,
  toFactCheck,
  toInternalNote,
  toOrganization,
  toReferenceArticle,
  toReview,
  toTheme,
  toVersion,
} from "./mapping";

export interface RemoteState {
  ready: boolean;
  db: MockDb;
  user: SessionUser | null;
  sim: Simulation;
  month: string;
  /** 読み込みに失敗したときの表示用 */
  loadError: string | null;
}

const EMPTY_DB: MockDb = {
  organizations: [],
  coachingNotes: [],
  internalNotes: [],
  themes: [],
  referenceArticles: [],
  articles: [],
  versions: [],
  factChecks: [],
  reviews: [],
  draftAnswers: {},
};
const NO_SIM: Simulation = { saveError: false, generationError: false, conflict: false, sessionExpired: false, slow: false };

const GENERATION_MESSAGES: Record<GenerationErrorCode, string> = {
  limit_reached: "今月の生成回数の上限に達しました。コタムにご相談ください",
  busy: "同じ会社で文章を作っている途中です。終わってからもう一度お試しください",
  budget_exceeded: "今月は新しい文章を作れなくなっています。コタムにご連絡ください",
  timeout: "時間内に文章を作れませんでした。入力内容は残っています",
  provider_error: "文章を作れませんでした。入力内容は残っています",
  invalid_input: "入力の内容を確認してください",
};

/** supabase-js のエラーを画面のエラーに変える。本文や個人情報はログに出さない */
function toApiError(error: { code?: string; message?: string } | null, fallback = "保存できませんでした。通信状態を確認して、もう一度お試しください"): ApiError {
  if (error?.code === "40001" || error?.code === "23505") return new ApiError("conflict", "別の画面でこの記事が更新されました");
  if (error?.code === "42501" || error?.code === "PGRST301") return new ApiError("forbidden", "この操作を行う権限がありません");
  if (error?.code === "PGRST303" || error?.message?.includes("JWT")) return new ApiError("session_expired", "ログインの有効期限が切れました");
  return new ApiError("save_failed", fallback);
}

export class RemoteBackend {
  private state: RemoteState;
  private listeners = new Set<() => void>();
  private _client: SupabaseClient | null = null;
  readonly serverState: RemoteState;

  /** ブラウザでだけ作る（サーバーでの描画中は使わない） */
  private get client(): SupabaseClient {
    this._client ??= createBrowserClient(this.env.url, this.env.anonKey);
    return this._client;
  }

  constructor(private readonly env: SupabaseEnv) {
    const initial = { ready: false, db: EMPTY_DB, user: null, sim: NO_SIM, month: currentMonthJst(), loadError: null };
    this.state = initial;
    this.serverState = initial;
    if (typeof window !== "undefined") void this.load();
  }

  get = (): RemoteState => this.state;

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  private set(patch: Partial<RemoteState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }

  /** ログイン中の利用者と、見える範囲のデータをまとめて読む */
  async load(): Promise<void> {
    const c = this.client;
    const { data: auth } = await c.auth.getUser();
    if (!auth.user) {
      this.set({ ready: true, user: null, db: EMPTY_DB, loadError: null });
      return;
    }
    const uid = auth.user.id;
    const [members, admin, orgs, notes, internal, themes, refs, articles, versions, facts, reviews, runs] = await Promise.all([
      c.from("memberships").select("organization_id, role").eq("user_id", uid).is("revoked_at", null),
      c.from("app_admins").select("user_id").eq("user_id", uid).maybeSingle(),
      c.from("organizations").select("*").order("name"),
      c.from("coaching_notes").select("*"),
      c.from("coaching_internal_notes").select("*"),
      c.from("themes").select("*").order("sort_order"),
      c.from("reference_articles").select("*").order("created_at"),
      c.from("articles").select("*").order("updated_at", { ascending: false }),
      c.from("article_versions").select("*").order("version_no"),
      c.from("fact_checks").select("*"),
      c.from("reviews").select("*").order("created_at"),
      c.from("generation_runs").select("organization_id, kind, status, created_at").gte("created_at", new Date(Date.now() - 32 * 864e5).toISOString()),
    ]);
    const failed = [members, orgs, notes, themes, refs, articles, versions, facts, reviews, runs].find((r) => r.error);
    if (failed) {
      this.set({ ready: true, loadError: "データを読み込めませんでした。再読み込みしてください" });
      return;
    }

    const month = currentMonthJst();
    const isAdmin = !!admin.data;
    const roles = members.data ?? [];
    const coachOrgs = roles.filter((m) => m.role === "coach").map((m) => m.organization_id as string);
    const clientOrgs = roles.filter((m) => m.role === "client_member").map((m) => m.organization_id as string);
    // 全社管理者はすべての会社をコタム担当者として扱う（DBの is_coach と同じ）
    const role = isAdmin || coachOrgs.length > 0 ? "coach" : "client_member";
    const organizationIds = isAdmin ? (orgs.data ?? []).map((o) => o.id as string) : role === "coach" ? coachOrgs : clientOrgs;
    const user: SessionUser | null =
      organizationIds.length > 0 ? { id: uid, name: (auth.user.user_metadata?.name as string) || auth.user.email || "利用者", role, organizationIds } : null;

    const runRows = runs.data ?? [];
    const articleRows = articles.data ?? [];
    this.set({
      ready: true,
      loadError: user
        ? null
        : isAdmin
          ? "会社がまだありません。招待と所属の管理（/admin/invitations）から会社を追加してください"
          : "この会社の情報を表示する権限がありません。コタムの担当者にお問い合わせください",
      month,
      user,
      db: {
        organizations: (orgs.data ?? []).map((o) => toOrganization(o, countBodyRunsThisMonth(runRows, o.id, month))),
        coachingNotes: (notes.data ?? []).map(toCoachingNote),
        internalNotes: (internal.data ?? []).map(toInternalNote),
        themes: (themes.data ?? []).map(toTheme),
        referenceArticles: (refs.data ?? []).map(toReferenceArticle),
        articles: articleRows.map(toArticle),
        versions: (versions.data ?? []).map(toVersion),
        factChecks: (facts.data ?? []).map(toFactCheck),
        reviews: (reviews.data ?? []).map(toReview),
        draftAnswers: Object.fromEntries(
          articleRows.map((a) => [a.id as string, { answers: (a.draft_answers as Answer[]) ?? [], step: (a.draft_step as number) ?? 0 }]),
        ),
      },
    });
  }

  private requireUser(): SessionUser {
    const u = this.state.user;
    if (!u) throw new ApiError("session_expired", "ログインしてください");
    return u;
  }

  private article(id: string): Article {
    const a = this.state.db.articles.find((x) => x.id === id);
    if (!a) throw new ApiError("not_found", "記事が見つかりません");
    return a;
  }

  private transition(article: Article, action: ArticleAction): Article {
    const user = this.requireUser();
    const policy = this.state.db.organizations.find((o) => o.id === article.organizationId)?.reviewPolicy ?? "optional";
    try {
      return applyAction(article, action, user.role, policy);
    } catch (e) {
      if (e instanceof TransitionError) throw new ApiError(e.code, e.message);
      throw e;
    }
  }

  /** 記事を更新する。読んだ時点の lock_version と一致するときだけ書き、ずれていれば競合にする */
  private async writeArticle(before: Article, next: Article, extra: Record<string, unknown> = {}) {
    const { data, error } = await this.client
      .from("articles")
      .update({ ...fromArticle(next), ...extra })
      .eq("id", before.id)
      .eq("lock_version", before.lockVersion)
      .select("id");
    if (error) throw await this.failed(error);
    if (!data?.length) throw await this.failed({ code: "40001" });
  }

  /** 記事の変更と版・要確認箇所・レビューの追加を1つのトランザクションで行う（DBの save_article_change） */
  private async saveChange(
    before: Article,
    next: Article | null,
    extra: { version?: Record<string, unknown>; factChecks?: Record<string, unknown>[]; review?: Record<string, unknown> } = {},
  ): Promise<string | null> {
    const { data, error } = await this.client.rpc("save_article_change", {
      p_article_id: before.id,
      p_expected_lock: before.lockVersion,
      p_article: next ? fromArticle(next) : null,
      p_version: extra.version ?? null,
      p_fact_checks: extra.factChecks ?? [],
      p_review: extra.review ?? null,
    });
    if (error) throw await this.failed(error);
    return data as string | null;
  }

  /** 競合したら最新の状態を読み直してから伝える（「自分の内容を新しい版として残す」が最新の lock_version を使えるように） */
  private async failed(error: { code?: string; message?: string }): Promise<ApiError> {
    const e = toApiError(error);
    if (e.code === "conflict") await this.load().catch(() => undefined);
    return e;
  }

  private async generate(articleId: string, body: Record<string, unknown>) {
    this.requireUser();
    let res: Response;
    try {
      res = await fetch(`/api/articles/${encodeURIComponent(articleId)}/generations`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...body, idempotencyKey: crypto.randomUUID() }),
      });
    } catch {
      throw new ApiError("provider_error", GENERATION_MESSAGES.provider_error);
    }
    const json = (await res.json().catch(() => ({}))) as { code?: string; message?: string; versionId?: string };
    await this.load();
    if (!res.ok || !json.versionId) {
      const code = (json.code ?? "provider_error") as GenerationErrorCode | "session_expired" | "forbidden" | "not_found";
      throw new ApiError(code, json.message ?? GENERATION_MESSAGES[code as GenerationErrorCode] ?? GENERATION_MESSAGES.provider_error);
    }
    const v = this.state.db.versions.find((x) => x.id === json.versionId);
    if (!v) throw new ApiError("not_found", "版が見つかりません");
    return v;
  }

  readonly api: MockApi = {
    createArticle: async (input) => {
      const user = this.requireUser();
      const orgId = user.organizationIds[0];
      let themeId: string;
      if ("themeId" in input) {
        themeId = input.themeId;
      } else {
        const { data, error } = await this.client
          .from("themes")
          .insert({
            organization_id: orgId,
            target_month: fromMonth(this.state.month),
            title: input.customTheme.title,
            reader_problem: input.customTheme.readerProblem,
            sort_order: 99,
            source: "client",
          })
          .select("id")
          .single();
        if (error) throw toApiError(error, "テーマを保存できませんでした");
        themeId = data.id;
      }
      const { data, error } = await this.client
        .from("articles")
        .insert({ organization_id: orgId, theme_id: themeId, created_by: user.id })
        .select("*")
        .single();
      if (error) throw toApiError(error, "記事を作れませんでした。もう一度お試しください");
      await this.load();
      return toArticle(data);
    },

    saveAnswers: async (articleId, answers, step) => {
      const a = this.article(articleId);
      await this.writeArticle(a, { ...a, lockVersion: a.lockVersion + 1 }, { draft_answers: answers, draft_step: step });
      await this.load();
    },

    generateOutline: (articleId) => this.generate(articleId, { kind: "outline" }),

    generateBody: (articleId, headings) => this.generate(articleId, { kind: "body", headings }),

    saveVersion: async (articleId, input: { title: string; body: Block[]; outline?: { heading: string }[] }, expectedLock) => {
      this.requireUser();
      const a = this.article(articleId);
      if (a.lockVersion !== expectedLock) throw new ApiError("conflict", "別の画面でこの記事が更新されました");
      const { db } = this.state;
      const base = db.versions.find((v) => v.id === a.currentVersionId);
      // 要確認箇所の確認結果は、同じ箇所が残っていれば引き継ぐ
      const prev = db.factChecks.filter((f) => f.versionId === base?.id);
      const factChecks = extractFactChecks(input.body, "new").map((c) => ({
        excerpt: c.excerpt,
        kind: c.kind,
        status: prev.find((p) => p.excerpt === c.excerpt)?.status ?? "unchecked",
      }));
      // 新しい版の id はDBが決め、記事の current_version_id にも入れる
      const next = this.transition(a, { type: "edit", newVersionId: "new" });
      const versionId = await this.saveChange(a, next, {
        version: {
          title: input.title,
          title_candidates: base?.titleCandidates ?? [input.title],
          outline: input.outline ?? base?.outline ?? [],
          body: input.body,
          answers: base?.answers ?? [],
          parent_version_id: base?.id ?? null,
          generation_settings: { sample: base?.isSample ?? false, edited: true },
        },
        factChecks,
      });
      await this.load();
      const version = this.state.db.versions.find((v) => v.id === versionId);
      if (!version) throw new ApiError("not_found", "版が見つかりません");
      return { article: this.article(articleId), version };
    },

    restoreVersion: async (articleId, versionId, expectedLock) => {
      const v = this.state.db.versions.find((x) => x.id === versionId && x.articleId === articleId);
      if (!v) throw new ApiError("not_found", "版が見つかりません");
      return this.api.saveVersion(articleId, { title: v.title, body: v.body, outline: v.outline }, expectedLock);
    },

    setFactCheck: async (factCheckId: string, status: FactCheckStatus) => {
      const user = this.requireUser();
      const { error } = await this.client
        .from("fact_checks")
        .update({ status, checked_by: user.id, checked_at: new Date().toISOString() })
        .eq("id", factCheckId);
      if (error) throw toApiError(error);
      await this.load();
    },

    requestReview: async (articleId) => {
      const a = this.article(articleId);
      await this.writeArticle(a, this.transition(a, { type: "request_review" }));
      await this.load();
    },

    review: async (articleId, decision: ReviewDecision, comment) => {
      const user = this.requireUser();
      const a = this.article(articleId);
      if (user.role !== "coach") throw new ApiError("forbidden", "コメントはコタム担当者が行います");
      const versionId = a.reviewRequestedVersionId ?? a.currentVersionId;
      if (!versionId) throw new ApiError("invalid_state", "確認する版がありません");
      const next = decision === "comment" ? null : this.transition(a, { type: decision === "approved" ? "approve" : "request_changes" });
      await this.saveChange(a, next, { review: { version_id: versionId, reviewer_name: user.name, comment, decision } });
      await this.load();
    },

    markPublished: async (articleId, url) => {
      const a = this.article(articleId);
      await this.writeArticle(a, this.transition(a, { type: "publish", url, at: new Date().toISOString() }));
      await this.load();
    },

    updateOrganization: async (orgId, patch) => {
      const row: Record<string, unknown> = {};
      if (patch.reviewPolicy) row.review_policy = patch.reviewPolicy;
      if (patch.monthlyGenerationLimit !== undefined) row.monthly_generation_limit = patch.monthlyGenerationLimit;
      if (patch.name) row.name = patch.name;
      const { data, error } = await this.client.from("organizations").update(row).eq("id", orgId).select("id");
      if (error) throw toApiError(error);
      if (!data?.length) throw new ApiError("forbidden", "設定を変更できるのはコタム担当者です");
      await this.load();
    },

    addTheme: async (orgId, input) => {
      const sortOrder = this.state.db.themes.filter((t) => t.organizationId === orgId).length + 1;
      const { error } = await this.client.from("themes").insert({
        organization_id: orgId,
        target_month: fromMonth(this.state.month),
        title: input.title,
        reader_problem: input.readerProblem,
        message: input.message,
        sort_order: sortOrder,
        source: "coach",
      });
      if (error) throw toApiError(error);
      await this.load();
    },

    saveProfile: async (orgId, profile: CompanyProfile) => {
      // 内容を変えたら、顧客の確認を取り直す
      const { data, error } = await this.client.from("organizations").update({ profile, profile_approved_at: null }).eq("id", orgId).select("id");
      if (error) throw toApiError(error);
      if (!data?.length) throw new ApiError("forbidden", "プロフィールを編集できるのはコタム担当者です");
      await this.load();
    },

    approveProfile: async (orgId) => {
      const { error } = await this.client.rpc("approve_profile", { p_organization_id: orgId });
      if (error) throw toApiError(error);
      await this.load();
    },

    saveCoachingNote: async (orgId, input, internalNote) => {
      const target_month = fromMonth(this.state.month);
      const { error } = await this.client.from("coaching_notes").upsert(
        {
          organization_id: orgId,
          target_month,
          focus: input.focus,
          audience: input.audience,
          purpose: input.purpose,
          avoid: input.avoid,
          client_visible_note: input.clientVisibleNote,
        },
        { onConflict: "organization_id,target_month" },
      );
      if (error) throw toApiError(error);
      const { error: ie } = await this.client
        .from("coaching_internal_notes")
        .upsert({ organization_id: orgId, target_month, note: internalNote, updated_at: new Date().toISOString() }, { onConflict: "organization_id,target_month" });
      if (ie) throw toApiError(ie);
      await this.load();
    },

    addReferenceArticle: async (orgId, input) => {
      const { error } = await this.client.from("reference_articles").insert({
        organization_id: orgId,
        title: input.title,
        body: input.body,
        url: input.url || null,
        published_on: input.publishedOn || null,
        usable_for_ai: input.usableForAi,
      });
      if (error) throw toApiError(error);
      await this.load();
    },

    setReferenceUsable: async (refId, usableForAi) => {
      const { error } = await this.client.from("reference_articles").update({ usable_for_ai: usableForAi }).eq("id", refId);
      if (error) throw toApiError(error);
      await this.load();
    },
  };

  readonly actions = {
    setSim: () => {},
    /** 「もう一度ログイン」：ログイン画面へ。戻り先は今の画面 */
    login: () => {
      // セッションを読み直すため、画面遷移ではなくページごと読み込む
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    },
    logout: () => {
      const form = document.createElement("form");
      form.method = "post";
      form.action = "/auth/signout";
      document.body.appendChild(form);
      form.submit();
    },
    resetDemo: () => {},
  };
}
