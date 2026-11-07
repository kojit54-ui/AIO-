"use client";

// Search Console をつなぐ（docs/DECISIONS.md 2026-11-02、つなぎ方A）。
// お客様が自分の Search Console に、コタムのアドレスを「制限付き（閲覧のみ）」で足し、ここにサイトのURLを入れる。

import Link from "next/link";
import { useEffect, useState } from "react";
import { Toast } from "@/components/fun";
import { type GuideStep, StepGuide } from "@/components/talk";
import { WaitingScreen } from "@/components/WaitingScreen";
import { Notice } from "@/components/ui";
import { ApiError, useStore } from "@/mock/store";
import { GuideName } from "@/components/useGuide";

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
  const [step, setStep] = useState(0);
  // つながっている会社が「はじめから見る」を押したとき
  const [again, setAgain] = useState(false);

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
      if (r.connected) {
        setDone(true);
        setAgain(false);
        setStep(6);
      }
      else setError(r.message ?? "まだつながりません");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "つなげませんでした");
    }
    setBusy(false);
  }

  const connected = done || !!link?.verifiedAt;
  const steps: GuideStep[] = [
    {
      title: "開く",
      mood: "point",
      say: ["まず、Search Console を開きましょう。", "いつも使っている Google アカウントで入ってくださいね。"],
      body: (
        <a href={SC_USERS_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          Search Console を開く ↗
        </a>
      ),
      next: "開けた！",
    },
    { title: "サイト", mood: "right", say: ["画面の左上に、サイトの名前が出ています。", "あなたの会社のサイトになっているか見てください。違ったら、押して選び直します。"], next: "なっていた！" },
    { title: "追加", mood: "point", say: "右上の「ユーザーを追加」という青いボタンを押してください。", next: "押した！" },
    {
      title: "貼る",
      mood: "ask",
      say: ["小さな窓が出ましたね。", "下のアドレスをコピーして、「メールアドレス」の欄に貼ってください。"],
      body:
        email === undefined ? (
          <p className="text-muted">読み込み中…</p>
        ) : email ? (
          <div className="flex flex-wrap items-center gap-2">
            <code className="break-all rounded-xl bg-canvas px-3 py-2 text-sm">{email}</code>
            <button type="button" className="btn-secondary min-h-10 px-4 text-sm" onClick={copy}>
              {copied ? "コピーしました ✓" : "コピー"}
            </button>
          </div>
        ) : (
          <Notice tone="info" title="コタムが準備中です">準備ができたら、ここにアドレスが出ます。少しお待ちください。</Notice>
        ),
      next: email ? "貼れた！" : null,
    },
    { title: "制限付き", mood: "right", say: ["「権限」は「制限付き」を選んで、「追加」を押します。", "見るだけの権限なので、サイトは何も変わりませんよ。"], next: "追加できた！" },
    {
      title: "つなぐ",
      mood: "jersey-cheer",
      say: ["最後です！", "あなたのサイトのURLを入れて、「つなぐ」を押してください。"],
      body: (
        <div className="space-y-2">
          <label htmlFor="sc-site" className="field-label">
            サイトのURL
          </label>
          <input id="sc-site" className="field" inputMode="url" placeholder="例：https://www.sakura-reform.jp/" value={site} onChange={(e) => setSite(e.target.value)} />
          {error && <Notice tone="warn" title={error} />}
          <button type="button" className="btn-primary" disabled={busy || !site.trim()} onClick={connect}>
            つなぐ
          </button>
          <p className="text-xs text-muted">ドメインで登録している場合は「sc-domain:example.jp」の形でも入れられます。</p>
        </div>
      ),
      next: null,
    },
  ];

  return (
    <main className="page max-w-3xl space-y-6">
      {busy && <WaitingScreen label="Search Console につないでいます" note="Google に、コタムのアドレスで見られるかを確かめています。" />}
      {done && <Toast>つながりました！ホームに「検索での見られ方」が出ます</Toast>}
      <div className="animate-rise">
        <Link href="/" className="text-sm text-brand-dark underline">
          ホームへ戻る
        </Link>
        <h1 className="text-2xl font-black">Search Console をつなぐ</h1>
        <p className="text-muted">つなぐと、書いた記事がどんな言葉で検索に出ているかを、<GuideName />がホームで見せます。次のテーマ選びにも使います。3分ほどで終わります。</p>
      </div>

      {link && !link.verifiedAt && link.lastError && <Notice tone="warn" title="まだつながっていません">{link.lastError}</Notice>}

      <section className="card">
        <StepGuide
          steps={steps}
          step={connected && step < steps.length && !again ? steps.length : step}
          onStep={(n) => {
            setAgain(n < steps.length);
            setStep(n);
          }}
          doneSay={[`つながりました！${link?.siteUrl ? `（${link.siteUrl}）` : ""}`, "これから、検索で見られた言葉をホームでお見せしますね。"].join("")}
          doneBody={
            <Link href="/" className="btn-primary">
              ホームで見る
            </Link>
          }
        />
      </section>
      <p className="text-xs text-muted">Search Console をまだ使っていない場合は、ホームページを作った会社か、コタムにご相談ください。つながなくても、記事づくりはいつもどおり使えます。</p>
    </main>
  );
}
