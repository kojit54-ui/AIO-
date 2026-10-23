"use client";

// 画面試作用の擬似API。ブラウザ内に架空データを持ち、通信の遅れと失敗を再現する。
// 関数の形は docs/DATA.md「API案」と揃えてあり、API接続時（T2-9）にこの層だけを差し替える。

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type {
  ArticleImage,
  Answer,
  Article,
  ArticleVersion,
  Block,
  CoachingInternalNote,
  CoachingNote,
  CompanyProfile,
  FactCheck,
  FactCheckStatus,
  GenerationErrorCode,
  Organization,
  ReferenceArticle,
  Review,
  ReviewDecision,
  ReviewPolicy,
  SessionUser,
  Theme,
} from "@/types/domain";
import { slotOf } from "@/lib/imageSlot";
import { applyAction, type ArticleAction, TransitionError } from "@/lib/workflow";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { RemoteBackend } from "@/lib/remote/backend";
import * as seed from "./data";
import { buildBody, buildOutline, buildTitleCandidates, extractFactChecks } from "./sampleGenerator";

export interface MockDb {
  organizations: Organization[];
  coachingNotes: CoachingNote[];
  internalNotes: CoachingInternalNote[];
  themes: Theme[];
  referenceArticles: ReferenceArticle[];
  articles: Article[];
  versions: ArticleVersion[];
  factChecks: FactCheck[];
  reviews: Review[];
  draftAnswers: Record<string, { answers: Answer[]; step: number }>;
}

/** 試作パネルで切り替える「次の操作で起こすこと」 */
export interface Simulation {
  saveError: boolean;
  generationError: boolean;
  conflict: boolean;
  sessionExpired: boolean;
  slow: boolean;
}

export class ApiError extends Error {
  constructor(
    public readonly code: "save_failed" | "conflict" | "session_expired" | "forbidden" | "not_found" | GenerationErrorCode | TransitionError["code"],
    message: string,
  ) {
    super(message);
  }
}

const STORAGE_KEY = "cotam-blog-mock-v1";
const SESSION_KEY = "cotam-blog-mock-user";

function seedDb(): MockDb {
  return structuredClone({
    organizations: seed.ORGANIZATIONS,
    coachingNotes: seed.COACHING_NOTES,
    internalNotes: seed.INTERNAL_NOTES,
    themes: seed.THEMES,
    referenceArticles: seed.REFERENCE_ARTICLES,
    articles: seed.ARTICLES,
    versions: seed.VERSIONS,
    factChecks: seed.FACT_CHECKS,
    reviews: seed.REVIEWS,
    draftAnswers: seed.DRAFT_ANSWERS,
  });
}

function readStorage<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 保存できない環境（プライベートウィンドウ等）でも画面は動かす
  }
}

const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`;
const now = () => new Date().toISOString();

interface StoreValue {
  /** mock＝ブラウザ内の架空データ、remote＝Supabase の本物のデータ */
  mode: "mock" | "remote";
  ready: boolean;
  db: MockDb;
  user: SessionUser | null;
  sim: Simulation;
  /** 今月（YYYY-MM）。架空データでは固定、本物のデータでは日本時間の今月 */
  month: string;
  /** 本物のデータを読めなかった・所属が無いときの表示 */
  loadError: string | null;
  setSim: (s: Partial<Simulation>) => void;
  login: (userId: string) => void;
  logout: () => void;
  resetDemo: () => void;
  api: MockApi;
}

export type MockApi = ReturnType<typeof createApi>;

const StoreContext = createContext<StoreValue | null>(null);

/** 画面試作で作った画像（ブラウザの中だけ。再読み込みで消える） */
const mockImages = new Map<string, ArticleImage[]>();
const SAMPLE_IMAGE_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="#e5e7eb"/><text x="320" y="190" font-size="28" text-anchor="middle" fill="#6b7280" font-family="sans-serif">サンプル（AIは未接続）</text></svg>',
)}`;

function createApi(
  getDb: () => MockDb,
  commit: (db: MockDb) => void,
  getUser: () => SessionUser | null,
  getSim: () => Simulation,
  clearSim: (k: keyof Simulation) => void,
) {
  const delay = (ms: number) => new Promise((r) => setTimeout(r, getSim().slow ? ms * 4 : ms));

  function requireUser(): SessionUser {
    const user = getUser();
    if (!user) throw new ApiError("session_expired", "ログインしてください");
    if (getSim().sessionExpired) {
      clearSim("sessionExpired");
      throw new ApiError("session_expired", "ログインの有効期限が切れました");
    }
    return user;
  }

  // 会社単位のアクセス制御。本番ではRLSとサーバー処理の両方で行う
  function requireOrg(user: SessionUser, orgId: string) {
    if (!user.organizationIds.includes(orgId)) throw new ApiError("forbidden", "この会社の情報を表示する権限がありません");
  }

  function getArticleForUser(db: MockDb, user: SessionUser, articleId: string): Article {
    const a = db.articles.find((x) => x.id === articleId);
    if (!a) throw new ApiError("not_found", "記事が見つかりません");
    requireOrg(user, a.organizationId);
    return a;
  }

  function policyOf(db: MockDb, orgId: string): ReviewPolicy {
    return db.organizations.find((o) => o.id === orgId)?.reviewPolicy ?? "optional";
  }

  function transition(db: MockDb, user: SessionUser, article: Article, action: ArticleAction): Article {
    try {
      return { ...applyAction(article, action, user.role, policyOf(db, article.organizationId)), updatedAt: now() };
    } catch (e) {
      if (e instanceof TransitionError) throw new ApiError(e.code, e.message);
      throw e;
    }
  }

  function replaceArticle(db: MockDb, a: Article): MockDb {
    return { ...db, articles: db.articles.map((x) => (x.id === a.id ? a : x)) };
  }

  function checkSaveSimulations(expectedLock?: number, actualLock?: number) {
    const sim = getSim();
    if (sim.saveError) {
      clearSim("saveError");
      throw new ApiError("save_failed", "保存できませんでした。通信状態を確認して、もう一度お試しください");
    }
    if (sim.conflict || (expectedLock !== undefined && expectedLock !== actualLock)) {
      clearSim("conflict");
      throw new ApiError("conflict", "別の画面でこの記事が更新されました");
    }
  }

  async function runGeneration(orgId: string) {
    const db = getDb();
    const org = db.organizations.find((o) => o.id === orgId)!;
    if (org.generationsUsedThisMonth >= org.monthlyGenerationLimit) {
      throw new ApiError("limit_reached", "今月の生成回数の上限に達しました。コタムにご相談ください");
    }
    await delay(1600);
    if (getSim().generationError) {
      clearSim("generationError");
      throw new ApiError("provider_error", "文章を作れませんでした。入力内容は残っています");
    }
    const fresh = getDb();
    commit({
      ...fresh,
      organizations: fresh.organizations.map((o) =>
        o.id === orgId ? { ...o, generationsUsedThisMonth: o.generationsUsedThisMonth + 1 } : o,
      ),
    });
  }

  return {
    /** 記事を新規作成（テーマ選択時） */
    async createArticle(input: { themeId: string } | { customTheme: { title: string; readerProblem: string } }) {
      const user = requireUser();
      await delay(300);
      let db = getDb();
      const orgId = user.organizationIds[0];
      let themeId: string;
      if ("themeId" in input) {
        themeId = input.themeId;
      } else {
        const theme: Theme = {
          id: uid("th"),
          organizationId: orgId,
          targetMonth: seed.CURRENT_MONTH,
          title: input.customTheme.title,
          readerProblem: input.customTheme.readerProblem,
          message: "",
          sortOrder: 99,
          source: "client",
        };
        db = { ...db, themes: [...db.themes, theme] };
        themeId = theme.id;
      }
      const article: Article = {
        id: uid("a"),
        organizationId: orgId,
        themeId,
        status: "drafting",
        currentVersionId: null,
        approvedVersionId: null,
        reviewRequestedVersionId: null,
        publishedUrl: null,
        publishedAt: null,
        publishedWithoutApproval: false,
        lockVersion: 0,
        updatedAt: now(),
      };
      commit({ ...db, articles: [article, ...db.articles] });
      return article;
    },

    /** 質問の回答を下書き保存 */
    async saveAnswers(articleId: string, answers: Answer[], step: number) {
      const user = requireUser();
      getArticleForUser(getDb(), user, articleId);
      await delay(400);
      checkSaveSimulations();
      const db = getDb();
      commit({
        ...db,
        draftAnswers: { ...db.draftAnswers, [articleId]: { answers, step } },
        articles: db.articles.map((a) => (a.id === articleId ? { ...a, updatedAt: now() } : a)),
      });
    },

    /** 記事の画像の一覧。enabled が false なら生成のボタンを出さない */
    async listImages(articleId: string): Promise<{ enabled: boolean; images: ArticleImage[] }> {
      const user = requireUser();
      getArticleForUser(getDb(), user, articleId);
      return { enabled: true, images: mockImages.get(articleId) ?? [] };
    },

    /** 画像を作る（サンプル）。slots が空なら、今の版の提案すべて */
    async generateImages(articleId: string, slots: string[]): Promise<{ images: ArticleImage[]; failed: number }> {
      const user = requireUser();
      const db = getDb();
      const article = getArticleForUser(db, user, articleId);
      const ideas = db.versions.find((v) => v.id === article.currentVersionId)?.imageIdeas;
      const all = [...(ideas?.eyecatch ? [{ slot: "eyecatch", alt: ideas.eyecatch.alt }] : []), ...(ideas?.perHeading ?? []).map((i) => ({ slot: slotOf(i.heading), alt: i.alt }))];
      const targets = slots.length ? all.filter((x) => slots.includes(x.slot)) : all;
      if (!targets.length) throw new ApiError("invalid_input", "先に本文を作ってください（画像の提案がありません）");
      await delay(1600);
      if (getSim().generationError) {
        clearSim("generationError");
        throw new ApiError("provider_error", "画像を作れませんでした。もう一度お試しください");
      }
      const made = targets.map((t) => ({ slot: t.slot, alt: t.alt, url: SAMPLE_IMAGE_URL, downloadUrl: SAMPLE_IMAGE_URL, isSample: true, createdAt: now() }));
      const keep = (mockImages.get(articleId) ?? []).filter((x) => !made.some((m) => m.slot === x.slot));
      mockImages.set(articleId, [...keep, ...made]);
      return { images: mockImages.get(articleId)!, failed: 0 };
    },

    /** 見出し案を作る（サンプル）。新しい版を作る */
    async generateOutline(articleId: string) {
      const user = requireUser();
      const article = getArticleForUser(getDb(), user, articleId);
      await runGeneration(article.organizationId);
      const db = getDb();
      const theme = db.themes.find((t) => t.id === article.themeId)!;
      const answers = db.draftAnswers[articleId]?.answers ?? [];
      const prev = db.versions.filter((v) => v.articleId === articleId);
      const v: ArticleVersion = {
        id: uid("v"),
        articleId,
        versionNo: prev.length + 1,
        title: theme.title,
        titleCandidates: buildTitleCandidates(theme),
        outline: buildOutline(answers).map((s) => ({ heading: s.heading })),
        body: [],
        answers,
        frozen: false,
        createdAt: now(),
        createdBy: user.id,
        isSample: true,
      };
      const next = transition(db, user, article, { type: "edit", newVersionId: v.id });
      commit(replaceArticle({ ...db, versions: [...db.versions, v] }, next));
      return v;
    },

    /** 本文を作る／もう一度作る（サンプル）。元の版は残し、新しい版を作る */
    async generateBody(articleId: string, headings: string[]) {
      const user = requireUser();
      const article = getArticleForUser(getDb(), user, articleId);
      await runGeneration(article.organizationId);
      const db = getDb();
      const theme = db.themes.find((t) => t.id === article.themeId)!;
      const org = db.organizations.find((o) => o.id === article.organizationId)!;
      const base = db.versions.find((v) => v.id === article.currentVersionId);
      const answers = base?.answers ?? db.draftAnswers[articleId]?.answers ?? [];
      const body = buildBody(answers, headings, theme, org.profile);
      const id = uid("v");
      const v: ArticleVersion = {
        id,
        articleId,
        versionNo: db.versions.filter((x) => x.articleId === articleId).length + 1,
        title: base?.title ?? theme.title,
        titleCandidates: base?.titleCandidates ?? buildTitleCandidates(theme),
        outline: headings.map((heading) => ({ heading })),
        body,
        answers,
        frozen: false,
        createdAt: now(),
        createdBy: user.id,
        isSample: true,
        ...sampleAiExtras(headings),
      };
      const next = transition(db, user, article, { type: "edit", newVersionId: id });
      commit(
        replaceArticle({ ...db, versions: [...db.versions, v], factChecks: [...db.factChecks, ...extractFactChecks(body, id)] }, next),
      );
      return v;
    },

    /** 編集内容を新しい版として保存。lockVersion で編集競合を検知する */
    async saveVersion(articleId: string, input: { title: string; body: Block[]; outline?: { heading: string }[] }, expectedLock: number) {
      const user = requireUser();
      const article = getArticleForUser(getDb(), user, articleId);
      await delay(500);
      checkSaveSimulations(expectedLock, article.lockVersion);
      const db = getDb();
      const base = db.versions.find((v) => v.id === article.currentVersionId);
      const id = uid("v");
      const v: ArticleVersion = {
        id,
        articleId,
        versionNo: db.versions.filter((x) => x.articleId === articleId).length + 1,
        title: input.title,
        titleCandidates: base?.titleCandidates ?? [input.title],
        outline: input.outline ?? base?.outline ?? [],
        body: input.body,
        answers: base?.answers ?? [],
        frozen: false,
        createdAt: now(),
        createdBy: user.id,
        isSample: base?.isSample ?? false,
        imageIdeas: base?.imageIdeas,
        aiReview: base?.aiReview,
      };
      // 要確認箇所の確認結果は、同じ箇所が残っていれば引き継ぐ
      const prevChecks = db.factChecks.filter((f) => f.versionId === base?.id);
      const checks = extractFactChecks(input.body, id).map((c) => {
        const same = prevChecks.find((p) => p.excerpt === c.excerpt);
        return same ? { ...c, status: same.status } : c;
      });
      const next = transition(db, user, article, { type: "edit", newVersionId: id });
      commit(replaceArticle({ ...db, versions: [...db.versions, v], factChecks: [...db.factChecks, ...checks] }, next));
      return { article: next, version: v };
    },

    /** 以前の版を復元（その内容で新しい版を作る） */
    async restoreVersion(articleId: string, versionId: string, expectedLock: number) {
      const db = getDb();
      const v = db.versions.find((x) => x.id === versionId && x.articleId === articleId);
      if (!v) throw new ApiError("not_found", "版が見つかりません");
      return this.saveVersion(articleId, { title: v.title, body: v.body, outline: v.outline }, expectedLock);
    },

    async setFactCheck(factCheckId: string, status: FactCheckStatus) {
      requireUser();
      await delay(200);
      const db = getDb();
      commit({ ...db, factChecks: db.factChecks.map((f) => (f.id === factCheckId ? { ...f, status } : f)) });
    },

    async requestReview(articleId: string) {
      const user = requireUser();
      const db0 = getDb();
      const article = getArticleForUser(db0, user, articleId);
      await delay(400);
      checkSaveSimulations();
      const db = getDb();
      const next = transition(db, user, article, { type: "request_review" });
      commit(
        replaceArticle({ ...db, versions: db.versions.map((v) => (v.id === next.reviewRequestedVersionId ? { ...v, frozen: true } : v)) }, next),
      );
    },

    async review(articleId: string, decision: ReviewDecision, comment: string) {
      const user = requireUser();
      const article = getArticleForUser(getDb(), user, articleId);
      await delay(400);
      checkSaveSimulations();
      let db = getDb();
      const versionId = article.reviewRequestedVersionId ?? article.currentVersionId ?? "";
      if (decision !== "comment") {
        const next = transition(db, user, article, { type: decision === "approved" ? "approve" : "request_changes" });
        db = replaceArticle(db, next);
      } else if (user.role !== "coach") {
        throw new ApiError("forbidden", "コメントはコタム担当者が行います");
      }
      const r: Review = { id: uid("r"), articleId, versionId, reviewerName: user.name, comment, decision, createdAt: now() };
      commit({ ...db, reviews: [...db.reviews, r] });
    },

    async markPublished(articleId: string, url: string) {
      const user = requireUser();
      const article = getArticleForUser(getDb(), user, articleId);
      await delay(400);
      checkSaveSimulations();
      const db = getDb();
      commit(replaceArticle(db, transition(db, user, article, { type: "publish", url, at: now() })));
    },

    async updateOrganization(orgId: string, patch: Partial<Organization>) {
      const user = requireUser();
      requireOrg(user, orgId);
      if (user.role !== "coach") throw new ApiError("forbidden", "設定を変更できるのはコタム担当者です");
      await delay(400);
      checkSaveSimulations();
      const db = getDb();
      commit({ ...db, organizations: db.organizations.map((o) => (o.id === orgId ? { ...o, ...patch } : o)) });
    },

    async addTheme(orgId: string, input: { title: string; readerProblem: string; message: string }) {
      const user = requireUser();
      requireOrg(user, orgId);
      if (user.role !== "coach") throw new ApiError("forbidden", "テーマを登録できるのはコタム担当者です");
      await delay(300);
      checkSaveSimulations();
      const db = getDb();
      const t: Theme = {
        id: uid("th"),
        organizationId: orgId,
        targetMonth: seed.CURRENT_MONTH,
        ...input,
        sortOrder: db.themes.filter((x) => x.organizationId === orgId).length + 1,
        source: "coach",
      };
      commit({ ...db, themes: [...db.themes, t] });
    },

    /** コタムがプロフィールを登録・更新。顧客の確認は取り直す */
    async saveProfile(orgId: string, profile: CompanyProfile) {
      const user = requireUser();
      requireOrg(user, orgId);
      if (user.role !== "coach") throw new ApiError("forbidden", "プロフィールを編集できるのはコタム担当者です");
      await delay(400);
      checkSaveSimulations();
      const db = getDb();
      commit({ ...db, organizations: db.organizations.map((o) => (o.id === orgId ? { ...o, profile, profileApprovedAt: null } : o)) });
    },

    /** 顧客がプロフィールの内容を確認した。確認済みのものだけがAIに渡る */
    async approveProfile(orgId: string) {
      const user = requireUser();
      requireOrg(user, orgId);
      if (user.role !== "client_member") throw new ApiError("forbidden", "プロフィールの確認は顧客担当者が行います");
      await delay(300);
      checkSaveSimulations();
      const db = getDb();
      commit({ ...db, organizations: db.organizations.map((o) => (o.id === orgId ? { ...o, profileApprovedAt: now() } : o)) });
    },

    async saveCoachingNote(orgId: string, input: Omit<CoachingNote, "id" | "organizationId" | "targetMonth">, internalNote: string) {
      const user = requireUser();
      requireOrg(user, orgId);
      if (user.role !== "coach") throw new ApiError("forbidden", "指導メモを編集できるのはコタム担当者です");
      await delay(400);
      checkSaveSimulations();
      const db = getDb();
      const month = seed.CURRENT_MONTH;
      const existing = db.coachingNotes.find((n) => n.organizationId === orgId && n.targetMonth === month);
      const note: CoachingNote = { id: existing?.id ?? uid("cn"), organizationId: orgId, targetMonth: month, ...input };
      commit({
        ...db,
        coachingNotes: [...db.coachingNotes.filter((n) => n !== existing), note],
        internalNotes: [
          ...db.internalNotes.filter((n) => !(n.organizationId === orgId && n.targetMonth === month)),
          { organizationId: orgId, targetMonth: month, note: internalNote },
        ],
      });
    },

    async addReferenceArticle(orgId: string, input: Omit<ReferenceArticle, "id" | "organizationId">) {
      const user = requireUser();
      requireOrg(user, orgId);
      if (user.role !== "coach") throw new ApiError("forbidden", "過去記事を登録できるのはコタム担当者です");
      await delay(300);
      checkSaveSimulations();
      const db = getDb();
      commit({ ...db, referenceArticles: [...db.referenceArticles, { id: uid("ref"), organizationId: orgId, ...input }] });
    },

    async setReferenceUsable(refId: string, usableForAi: boolean) {
      const user = requireUser();
      const db = getDb();
      const ref = db.referenceArticles.find((r) => r.id === refId);
      if (!ref) throw new ApiError("not_found", "過去記事が見つかりません");
      requireOrg(user, ref.organizationId);
      if (user.role !== "coach") throw new ApiError("forbidden", "設定を変更できるのはコタム担当者です");
      await delay(200);
      commit({ ...db, referenceArticles: db.referenceArticles.map((r) => (r.id === refId ? { ...r, usableForAi } : r)) });
    },
  };
}

/** 試作用の招待トークン。本番ではハッシュで保存し、期限と使用済みを検査する */
export const DEMO_INVITES: Record<string, { userId: string; expired: boolean }> = {
  "demo-hanamaru": { userId: "u_hanamaru", expired: false },
  "demo-expired": { userId: "u_hanamaru", expired: true },
};

const DEFAULT_SIM: Simulation = { saveError: false, generationError: false, conflict: false, sessionExpired: false, slow: false };

interface BackendState {
  ready: boolean;
  db: MockDb;
  user: SessionUser | null;
  sim: Simulation;
}

/** ブラウザ内の擬似バックエンド。React の外に状態を持ち、useSyncExternalStore で読む */
class MockBackend {
  private state: BackendState | null = null;
  private listeners = new Set<() => void>();
  readonly serverState: BackendState = { ready: false, db: seedDb(), user: null, sim: DEFAULT_SIM };

  get = (): BackendState => {
    if (!this.state) {
      const userId = readStorage<string>(SESSION_KEY);
      this.state = {
        ready: true,
        db: readStorage<MockDb>(STORAGE_KEY) ?? seedDb(),
        user: seed.USERS.find((x) => x.id === userId) ?? null,
        sim: DEFAULT_SIM,
      };
    }
    return this.state;
  };

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  set(patch: Partial<BackendState>) {
    this.state = { ...this.get(), ...patch };
    if (patch.db) writeStorage(STORAGE_KEY, patch.db);
    if ("user" in patch) writeStorage(SESSION_KEY, patch.user?.id ?? null);
    this.listeners.forEach((l) => l());
  }
}

const backend = new MockBackend();
const api = createApi(
  () => backend.get().db,
  (db) => backend.set({ db }),
  () => backend.get().user,
  () => backend.get().sim,
  (k) => backend.set({ sim: { ...backend.get().sim, [k]: false } }),
);

const actions = {
  setSim: (s: Partial<Simulation>) => backend.set({ sim: { ...backend.get().sim, ...s } }),
  login: (userId: string) => backend.set({ user: seed.USERS.find((x) => x.id === userId) ?? null }),
  logout: () => backend.set({ user: null }),
  resetDemo: () => backend.set({ db: seedDb() }),
};

// Supabase の接続先があれば本物のデータ、無ければ架空データで動かす
let remote: RemoteBackend | null = null;
function getRemote(): RemoteBackend | null {
  const env = getSupabaseEnv();
  if (!env) return null;
  remote ??= new RemoteBackend(env);
  return remote;
}

function MockStoreProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(backend.subscribe, backend.get, () => backend.serverState);
  const value = useMemo<StoreValue>(
    () => ({ ...state, ...actions, api, mode: "mock", month: seed.CURRENT_MONTH, loadError: null }),
    [state],
  );
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function RemoteStoreProvider({ remote, children }: { remote: RemoteBackend; children: React.ReactNode }) {
  const state = useSyncExternalStore(remote.subscribe, remote.get, () => remote.serverState);
  const value = useMemo<StoreValue>(() => ({ ...state, ...remote.actions, api: remote.api, mode: "remote" }), [state, remote]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const r = getRemote();
  return r ? <RemoteStoreProvider remote={r}>{children}</RemoteStoreProvider> : <MockStoreProvider>{children}</MockStoreProvider>;
}

export function useStore(): StoreValue {
  const v = useContext(StoreContext);
  if (!v) throw new Error("StoreProvider の内側で使ってください");
  return v;
}

/** 画像の提案と点検のサンプル。本物のAIと見間違えないよう、すべてに「サンプル（AIは未接続）」を付ける */
function sampleAiExtras(headings: string[]): Pick<ArticleVersion, "imageIdeas" | "aiReview"> {
  const label = "サンプル（AIは未接続）";
  const idea = (heading: string) => ({ heading, photoIdea: `${label}：「${heading || "記事全体"}」に合う写真の提案が入ります。`, alt: heading || "アイキャッチ", imagePrompt: "A simple illustration" });
  return {
    imageIdeas: { eyecatch: idea(""), perHeading: headings.map(idea) },
    aiReview: {
      provider: "sample",
      summary: `${label}：独自性・AI検索への対策・AIらしさなどの点検結果が入ります。`,
      findings: [{ category: "ai_tone", excerpt: headings[0] ?? "", advice: `${label}：指摘の例。本物のAIでは、指摘に沿って書き直した本文になります。` }],
      rewritten: false,
    },
  };
}
