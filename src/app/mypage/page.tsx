"use client";

// マイページ：社名を直す、ログインしているメール、しおり通信の受け取り、ログアウト（docs/TASKS.md T6-2）

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShioriTalk } from "@/components/talk";
import { Notice } from "@/components/ui";
import { LegalLinks } from "@/components/LegalLinks";
import { ORG_NAME_MAX, normalizeOrgName } from "@/lib/orgName";
import { TONES } from "@/lib/shioriTone";
import { useShioriTone } from "@/components/useShioriTone";
import { useStore } from "@/mock/store";

export default function MyPage() {
  const { db, user, api, logout } = useStore();
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    api
      .accountEmail()
      .then((e) => alive && setEmail(e))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [api]);
  if (!user) return null;
  const org = user.role === "client_member" ? db.organizations.find((o) => o.id === user.organizationIds[0]) : null;

  return (
    <main className="page max-w-2xl space-y-5">
      <Link href={user.role === "coach" ? "/coach" : "/"} className="text-sm text-brand-dark underline">
        ホームへ戻る
      </Link>
      <h1 className="text-2xl font-black sm:text-3xl">マイページ</h1>
      <ShioriTalk mood="point" lines={["ここでは、社名やしおりの話し方、メールの受け取りを変えられます。", "変えたいところだけ、1つずつどうぞ。"]} />

      {org && <OrgNameCard orgId={org.id} current={org.name} />}

      {org && <ToneCard />}

      <section className="card space-y-1">
        <h2 className="font-black">ログインしているメールアドレス</h2>
        <p className="break-all text-lg font-bold">{email ?? "…"}</p>
        <p className="text-sm text-muted">ログインのメールは、このアドレスに届きます。変えたいときは、コタムの担当者にお知らせください。</p>
      </section>

      {org && (
        <section className="card space-y-3">
          <h2 className="font-black">しおり通信（毎月1日のメール）</h2>
          <NewsletterToggle />
          <Link href="/newsletter" className="text-sm font-bold text-brand-dark underline">
            どんなメールか見本を見る
          </Link>
        </section>
      )}

      {org && (
        <section className="card space-y-2">
          <h2 className="font-black">会社の情報</h2>
          <p className="text-sm text-muted">事業内容や強みなど、記事を作るときに使う会社の情報です。</p>
          <Link href="/profile" className="btn-secondary">
            会社の情報を確かめる
          </Link>
        </section>
      )}

      <section className="card flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold">{user.name} さん</p>
        <button type="button" className="btn-secondary" onClick={logout}>
          ログアウト
        </button>
      </section>
      <LegalLinks />
    </main>
  );
}

function OrgNameCard({ orgId, current }: { orgId: string; current: string }) {
  const { api } = useStore();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(current);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const clean = normalizeOrgName(value);

  async function save() {
    if (!clean) return;
    setBusy(true);
    setError(null);
    try {
      await api.renameOrganization(orgId, clean);
      setEditing(false);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存できませんでした。少し待ってからもう一度お試しください");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card space-y-3">
      <h2 className="font-black">社名</h2>
      {editing ? (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <label className="block">
            <span className="field-label text-sm">新しい社名</span>
            <input className="field" value={value} maxLength={ORG_NAME_MAX + 10} onChange={(e) => setValue(e.target.value)} autoFocus />
          </label>
          <p className="text-sm text-muted">
            記事やAIへのお願いにも、この社名を使います。正式な名前（「株式会社」なども）で入れてください。{value.trim().length}／{ORG_NAME_MAX}文字
          </p>
          {error && <p className="text-sm font-bold text-danger">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn-primary" disabled={!clean || clean === current || busy}>
              {busy ? "保存しています…" : "この社名にする"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setEditing(false);
                setValue(current);
                setError(null);
              }}
            >
              やめる
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="text-xl font-black">{current}</p>
          {saved && <Notice tone="ok" title="社名を変えました。これからの記事とAIへのお願いに使います" />}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setValue(current);
              setSaved(false);
              setEditing(true);
            }}
          >
            社名を直す
          </button>
        </>
      )}
    </section>
  );
}

function NewsletterToggle() {
  const { db, api } = useStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const on = !db.newsletterOptOut;
  return (
    <div className="space-y-2">
      <p>
        いまは <b className={on ? "text-ok" : "text-muted"}>{on ? "受け取る" : "受け取らない"}</b> になっています。
      </p>
      <button
        type="button"
        className="btn-secondary"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError(null);
          try {
            await api.setNewsletterOptOut(on);
          } catch {
            setError("変えられませんでした。少し待ってからもう一度お試しください");
          } finally {
            setBusy(false);
          }
        }}
      >
        {on ? "受け取らないようにする" : "受け取るようにする"}
      </button>
      {error && <p className="text-sm font-bold text-danger">{error}</p>}
    </div>
  );
}

function ToneCard() {
  const [tone, setTone] = useShioriTone();
  const picked = TONES.find((t) => t.id === tone) ?? TONES[1];
  return (
    <section className="card space-y-3">
      <h2 className="font-black">しおりの話し方</h2>
      <p className="text-sm text-muted">しおりがどのくらい厳しく声をかけるかを選べます。このパソコン・スマホで覚えます。</p>
      <div role="radiogroup" aria-label="しおりの話し方" className="grid gap-2 sm:grid-cols-3">
        {TONES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={tone === t.id}
            onClick={() => setTone(t.id)}
            className={`rounded-2xl border-2 px-3 py-2 text-left transition ${tone === t.id ? "border-brand bg-brand-soft" : "border-line bg-surface hover:border-brand"}`}
          >
            <span className="block font-black">{t.label}</span>
            <span className="block text-xs text-muted">{t.note}</span>
          </button>
        ))}
      </div>
      <ShioriTalk key={picked.id} mood={picked.id === "gentle" ? "joy" : picked.id === "strict" ? "point" : "cheer"} lines={[picked.sample]} />
    </section>
  );
}
