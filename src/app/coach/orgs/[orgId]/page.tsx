"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Forbidden, NotFound, Notice, monthLabel } from "@/components/ui";
import { ApiError, useStore } from "@/mock/store";
import { CoachingNoteForm, PROFILE_FIELDS, ProfileForm, ReferenceArticleForm } from "@/components/CoachForms";

export default function CoachOrgPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const { db, user, api, month } = useStore();
  const [message, setMessage] = useState<{ tone: "ok" | "danger"; text: string } | null>(null);
  const [editing, setEditing] = useState<null | "profile" | "note" | "ref">(null);

  if (!user) return null;
  const org = db.organizations.find((o) => o.id === orgId);
  if (!org) return <NotFound what="会社" />;
  // 担当外の会社は表示しない（本番はサーバー側でも拒否する）
  if (user.role !== "coach" || !user.organizationIds.includes(orgId)) return <Forbidden />;

  const note = db.coachingNotes.find((n) => n.organizationId === orgId && n.targetMonth === month);
  const internal = db.internalNotes.find((n) => n.organizationId === orgId && n.targetMonth === month);
  const themes = db.themes.filter((t) => t.organizationId === orgId && t.targetMonth === month);
  const refs = db.referenceArticles.filter((r) => r.organizationId === orgId);

  async function run(fn: () => Promise<void>, ok: string): Promise<boolean> {
    setMessage(null);
    try {
      await fn();
      setMessage({ tone: "ok", text: ok });
      return true;
    } catch (e) {
      setMessage({ tone: "danger", text: e instanceof ApiError ? e.message : "保存できませんでした" });
      return false;
    }
  }

  return (
    <main className="page space-y-5">
      <div>
        <Link href="/coach" className="text-sm text-brand-dark underline">
          管理画面へ戻る
        </Link>
        <h1 className="text-2xl font-bold">{org.name}</h1>
      </div>
      {message && <Notice tone={message.tone} title={message.text} />}

      <section className="card space-y-3" aria-labelledby="settings">
        <h2 id="settings" className="text-lg font-bold">
          設定
        </h2>
        <fieldset>
          <legend className="field-label">公開前のコタムの確認</legend>
          <div className="flex flex-wrap gap-4">
            {(["optional", "required"] as const).map((p) => (
              <label key={p} className="inline-flex items-center gap-2">
                <input type="radio" name="policy" checked={org.reviewPolicy === p} onChange={() => run(() => api.updateOrganization(orgId, { reviewPolicy: p }), "設定を保存しました")} />
                {p === "optional" ? "任意（未承認でも公開済みにできる。記録は残る）" : "必須（承認済みの記事だけ公開済みにできる）"}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="text-sm text-muted">
          今月の生成回数：{org.generationsUsedThisMonth} / {org.monthlyGenerationLimit}回
        </p>
      </section>

      <section className="card" aria-labelledby="profile">
        <h2 id="profile" className="mb-3 text-lg font-bold">
          会社プロフィール
        </h2>
        {editing === "profile" || !org.profile ? (
          <ProfileForm
            initial={org.profile}
            onCancel={org.profile ? () => setEditing(null) : undefined}
            onSave={async (p) => {
              const ok = await run(() => api.saveProfile(orgId, p), "プロフィールを保存しました。顧客に確認を依頼します");
              if (ok) setEditing(null);
              return ok;
            }}
          />
        ) : (
          <>
            <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-[10rem_1fr]">
              {PROFILE_FIELDS.map(([k, label]) => (
                <div key={k} className="contents">
                  <dt className="text-muted">{label}</dt>
                  <dd>{org.profile![k]}</dd>
                </div>
              ))}
            </dl>
            <p className={`mt-3 text-sm ${org.profileApprovedAt ? "text-muted" : "font-semibold text-warn"}`}>
              {org.profileApprovedAt ? "顧客の確認済み" : "顧客の確認待ち（確認されるまでAIには渡しません）"}
            </p>
            <button type="button" className="btn-secondary mt-3" onClick={() => setEditing("profile")}>
              編集する
            </button>
          </>
        )}
      </section>

      <section className="card" aria-labelledby="note">
        <h2 id="note" className="mb-3 text-lg font-bold">
          {monthLabel(month)}の指導メモ
        </h2>
        {editing === "note" || !note ? (
          <CoachingNoteForm
            initial={note}
            internal={internal}
            onCancel={note ? () => setEditing(null) : undefined}
            onSave={async (n, i) => {
              const ok = await run(() => api.saveCoachingNote(orgId, n, i), "指導メモを保存しました");
              if (ok) setEditing(null);
              return ok;
            }}
          />
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted">顧客向け（顧客に表示し、AIにも渡します）</p>
              <p>{note.clientVisibleNote}</p>
            </div>
            <dl className="grid gap-x-4 gap-y-1 sm:grid-cols-[10rem_1fr]">
              {(
                [
                  ["重点テーマ", note.focus],
                  ["想定読者", note.audience],
                  ["記事の目的", note.purpose],
                  ["避ける内容", note.avoid],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="rounded-lg border border-dashed border-line p-3">
              <p className="text-sm font-semibold text-muted">コタム内部メモ（顧客には見えません。AIにも渡しません）</p>
              <p>{internal?.note ?? "なし"}</p>
            </div>
            <button type="button" className="btn-secondary" onClick={() => setEditing("note")}>
              編集する
            </button>
          </div>
        )}
      </section>

      <section className="card" aria-labelledby="themes">
        <h2 id="themes" className="mb-3 text-lg font-bold">
          テーマ
        </h2>
        {themes.length === 0 ? (
          <p className="text-muted">今月のテーマはまだありません。</p>
        ) : (
          <ul className="space-y-2">
            {themes.map((t) => (
              <li key={t.id} className="rounded-lg border border-line p-3">
                <p className="font-semibold">
                  {t.title}
                  {t.source === "client" && <span className="ml-2 text-sm font-normal text-muted">（顧客が自分で決めたテーマ）</span>}
                </p>
                <p className="text-sm text-muted">{t.readerProblem}</p>
              </li>
            ))}
          </ul>
        )}
        <ThemeForm onSubmit={async (input) => { await run(() => api.addTheme(orgId, input), "テーマを追加しました"); }} />
      </section>

      <section className="card" aria-labelledby="refs">
        <h2 id="refs" className="mb-3 text-lg font-bold">
          過去記事
        </h2>
        {refs.length === 0 ? (
          <p className="text-muted">登録された過去記事はありません。</p>
        ) : (
          <ul className="space-y-2">
            {refs.map((r) => (
              <li key={r.id} className="rounded-lg border border-line p-3">
                <p className="font-semibold">{r.title}</p>
                <p className="text-sm text-muted">{r.publishedOn ?? "公開日なし"}</p>
                <label className="mt-1 inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={r.usableForAi} onChange={(e) => run(() => api.setReferenceUsable(r.id, e.target.checked), "設定を保存しました")} />
                  AIの参考に使う
                </label>
              </li>
            ))}
          </ul>
        )}
        {editing === "ref" ? (
          <ReferenceArticleForm onCancel={() => setEditing(null)} onSave={(r) => run(() => api.addReferenceArticle(orgId, r), "過去記事を登録しました")} />
        ) : (
          <button type="button" className="btn-secondary mt-3" onClick={() => setEditing("ref")}>
            過去記事を登録
          </button>
        )}
      </section>
    </main>
  );
}

function ThemeForm({ onSubmit }: { onSubmit: (input: { title: string; readerProblem: string; message: string }) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [readerProblem, setReaderProblem] = useState("");
  const [message, setMessage] = useState("");
  if (!open)
    return (
      <button type="button" className="btn-secondary mt-3" onClick={() => setOpen(true)}>
        テーマを追加
      </button>
    );
  return (
    <form
      className="mt-3 space-y-3 rounded-lg bg-canvas p-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit({ title: title.trim(), readerProblem: readerProblem.trim(), message: message.trim() });
        setTitle("");
        setReaderProblem("");
        setMessage("");
        setOpen(false);
      }}
    >
      <div>
        <label htmlFor="t-title" className="field-label">
          テーマ
        </label>
        <input id="t-title" required className="field" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="t-problem" className="field-label">
          誰の悩みに答えるか
        </label>
        <input id="t-problem" required className="field" value={readerProblem} onChange={(e) => setReaderProblem(e.target.value)} />
      </div>
      <div>
        <label htmlFor="t-message" className="field-label">
          伝えたい内容
        </label>
        <input id="t-message" required className="field" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">
          追加する
        </button>
        <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
          やめる
        </button>
      </div>
    </form>
  );
}
