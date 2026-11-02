"use client";

// Search Console をつなぐ（docs/DECISIONS.md 2026-11-02、つなぎ方A）。
// お客様が自分の Search Console に、コタムのアドレスを「制限付き（閲覧のみ）」で足し、ここにサイトのURLを入れる。

import Link from "next/link";
import { useEffect, useState } from "react";
import { Confetti, Shiori, Toast } from "@/components/fun";
import { WaitingScreen } from "@/components/WaitingScreen";
import { Notice } from "@/components/ui";
import { ApiError, useStore } from "@/mock/store";

const SC_USERS_URL = "https://search.google.com/search-console/users";

export default function SearchConsolePage() {
  const { db, user, api } = useStore();
  const orgId = user?.organizationIds[0] ?? "";
  const link = (db.searchConsole ?? []).find((x) => x.organizationId === orgId);
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [site, setSite] = useState(link?.siteUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.searchConsoleAccount().then(setEmail, () => setEmail(null));
  }, [api]);

  if (!user) return null;
  if (user.role !== "client_member") return <main className="page"><Notice tone="info" title="Search Console は、お客様の画面でつなぎます" /></main>;

  async function copy() {
    if (!email) return;
    await navigator.clipboard.writeText(email).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function connect() {
    setBusy(true);
    setError(null);
    try {
      const r = await api.connectSearchConsole(orgId, site);
      if (r.connected) setDone(true);
      else setError(r.message ?? "まだつながりません");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "つなげませんでした");
    }
    setBusy(false);
  }

  const steps = [
    { title: "Search Console を開く", body: <>いつも使っている Google アカウントで、Search Console の「ユーザーと権限」を開きます。<a href={SC_USERS_URL} target="_blank" rel="noopener noreferrer" className="ml-1 font-bold text-brand-dark underline">開く ↗</a></> },
    {
      title: "コタムのアドレスを足す",
      body: (
        <>
          「ユーザーを追加」を押し、下のアドレスを貼って、権限は<b>「制限付き」</b>を選びます。見るだけの権限なので、サイトの設定は変わりません。
          {email === undefined ? (
            <span className="mt-2 block text-muted">読み込み中…</span>
          ) : email ? (
            <span className="mt-2 flex flex-wrap items-center gap-2">
              <code className="break-all rounded-xl bg-canvas px-3 py-2 text-sm">{email}</code>
              <button type="button" className="btn-secondary min-h-10 px-4 text-sm" onClick={copy}>
                {copied ? "コピーしました" : "コピー"}
              </button>
            </span>
          ) : (
            <span className="mt-2 block text-muted">コタムが準備中です。準備ができたら、ここにアドレスが出ます。</span>
          )}
        </>
      ),
    },
    { title: "サイトのURLを入れる", body: <>Search Console に登録しているサイトのURLを入れて、「つなぐ」を押します。ドメインで登録している場合は「sc-domain:example.jp」の形でも入れられます。</> },
  ];

  return (
    <main className="page space-y-6">
      {busy && <WaitingScreen label="Search Console につないでいます" note="Google に、コタムのアドレスで見られるかを確かめています。" />}
      {done && <Confetti />}
      {done && <Toast>つながりました！ホームに「検索での見られ方」が出ます</Toast>}
      <div className="flex animate-rise items-end gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-black">Search Console をつなぐ</h1>
          <p className="text-muted">つなぐと、書いた記事がどんな言葉で検索に出ているかを、しおりがホームで見せます。次のテーマ選びにも使います。</p>
        </div>
        <Shiori mood={done || link?.verifiedAt ? "jersey-done" : "point"} className="hidden h-32 w-auto shrink-0 animate-float sm:block" />
      </div>

      {link?.verifiedAt && !done && <Notice tone="ok" title={`つながっています：${link.siteUrl}`}>別のサイトにつなぎ直すときは、下でURLを変えて「つなぐ」を押してください。</Notice>}
      {link && !link.verifiedAt && link.lastError && <Notice tone="warn" title="まだつながっていません">{link.lastError}</Notice>}

      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={s.title} className="card animate-rise flex gap-3" style={{ animationDelay: `${i * 0.08}s` }}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand font-black text-white">{i + 1}</span>
            <div className="min-w-0">
              <p className="font-black">{s.title}</p>
              <p className="text-sm">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="card space-y-3" aria-labelledby="site-heading">
        <label id="site-heading" htmlFor="sc-site" className="font-black">
          サイトのURL
        </label>
        <input id="sc-site" className="field" inputMode="url" placeholder="例：https://www.sakura-reform.jp/" value={site} onChange={(e) => setSite(e.target.value)} />
        {error && <Notice tone="warn" title={error} />}
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary" disabled={busy || !site.trim()} onClick={connect}>
            つなぐ
          </button>
          <Link href="/" className="btn-secondary">
            ホームへ
          </Link>
        </div>
        <p className="text-xs text-muted">Search Console をまだ使っていない場合は、ホームページを作った会社か、コタムにご相談ください。つながなくても、記事づくりはいつもどおり使えます。</p>
      </section>
    </main>
  );
}
