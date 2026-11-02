// Search Console をつなぐ・読み直す（サーバー側だけで使う）。API の入口（/api/organizations/[id]/search-console）から呼ぶ。
// 読み書きの権限：会社の人かどうかは利用者のセッションで確かめ、保存はサーバー（service role）が行う。

import type { SupabaseClient } from "@supabase/supabase-js";
import { ScError, fetchSnapshot, normalizeSite, scAccount } from "@/lib/searchConsole";

type Fail = { ok: false; status: number; code: string; message: string };
const fail = (status: number, code: string, message: string): Fail => ({ ok: false, status, code, message });

/** 何時間ごとに読み直すか（Search Console のデータは1日に1回ほどしか増えない） */
export const REFRESH_HOURS = 12;

async function requireMember(db: SupabaseClient, orgId: string, clientOnly: boolean) {
  const { data: auth } = await db.auth.getUser();
  if (!auth.user) return fail(401, "session_expired", "ログインの有効期限が切れました");
  const { data: m } = await db.from("memberships").select("role").eq("user_id", auth.user.id).eq("organization_id", orgId).is("revoked_at", null).maybeSingle();
  if (!m || (clientOnly && m.role !== "client_member")) return fail(403, "forbidden", "この会社の設定を変える権限がありません");
  return null;
}

/** サイトのURLを保存して、つながるか確かめる。コタムの準備がまだでも、URLは残す */
export async function connectSearchConsole(deps: { user: SupabaseClient; admin: SupabaseClient }, req: { organizationId: string; siteUrl: string }) {
  const denied = await requireMember(deps.user, req.organizationId, true);
  if (denied) return denied;
  const site = normalizeSite(req.siteUrl);
  if (!site) return fail(400, "invalid_input", "サイトのURLを確かめてください（例：https://example.jp/）");
  try {
    const snapshot = await fetchSnapshot(site);
    await deps.admin.from("search_console").upsert({ organization_id: req.organizationId, site_url: site, verified_at: new Date().toISOString(), last_error: null, snapshot, fetched_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    return { ok: true as const, connected: true };
  } catch (e) {
    const message = e instanceof ScError ? e.message : "Search Console を読めませんでした";
    await deps.admin.from("search_console").upsert({ organization_id: req.organizationId, site_url: site, verified_at: null, last_error: message, updated_at: new Date().toISOString() });
    return { ok: true as const, connected: false, message };
  }
}

/** つながっている会社の数字を、古くなっていれば読み直す */
export async function refreshSearchConsole(deps: { user: SupabaseClient; admin: SupabaseClient }, req: { organizationId: string }) {
  const denied = await requireMember(deps.user, req.organizationId, false);
  if (denied) return denied;
  const { data: row } = await deps.admin.from("search_console").select("site_url, verified_at, fetched_at").eq("organization_id", req.organizationId).maybeSingle();
  if (!row?.verified_at) return { ok: true as const, refreshed: false };
  if (row.fetched_at && Date.now() - new Date(row.fetched_at).getTime() < REFRESH_HOURS * 3600_000) return { ok: true as const, refreshed: false };
  try {
    const snapshot = await fetchSnapshot(row.site_url);
    await deps.admin.from("search_console").update({ snapshot, fetched_at: new Date().toISOString(), last_error: null, updated_at: new Date().toISOString() }).eq("organization_id", req.organizationId);
    return { ok: true as const, refreshed: true };
  } catch (e) {
    const message = e instanceof ScError ? e.message : "Search Console を読めませんでした";
    // 権限を外されたら、つながっていない状態に戻す
    const lost = e instanceof ScError && (e.code === "no_access" || e.code === "not_found");
    await deps.admin.from("search_console").update({ last_error: message, ...(lost ? { verified_at: null } : {}), updated_at: new Date().toISOString() }).eq("organization_id", req.organizationId);
    return { ok: true as const, refreshed: false, message };
  }
}

/** お客様に足してもらうアドレス（秘密ではない）。準備がまだなら null */
export const scServiceEmail = () => scAccount()?.email ?? null;
