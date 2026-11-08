"use client";

// マイページ：社名を直す、ログインしているメール、しおり通信の受け取り、ログアウト（docs/TASKS.md T6-2）

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShioriTalk } from "@/components/talk";
import { Notice } from "@/components/ui";
import { LegalLinks } from "@/components/LegalLinks";
import { ORG_NAME_MAX, normalizeOrgName } from "@/lib/orgName";
import { PERSON_NAME_MAX, normalizePersonName } from "@/lib/personName";
import { TONES } from "@/lib/shioriTone";
import { AUTO_OUTFIT, GUIDES, seasonalOutfit } from "@/lib/guideCharacter";
import { useGuide, useGuideOutfit, GuideName } from "@/components/useGuide";
import { Shiori, ShioriFace } from "@/components/fun";
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
      <Link href={user.role === "coach" ? "/coach" : "/"} className="btn-secondary min-h-11 px-4 py-2">
        <span aria-hidden>←</span> ホームへ戻る
      </Link>
      <h1 className="text-2xl font-black sm:text-3xl">マイページ</h1>
      <p className="text-muted">{org ? "お名前・社名・案内役・メールの受け取りを変えられます。変えたいところだけどうぞ。" : "管理の画面へすぐ移れます。担当している会社の社名や、案内役も変えられます。"}</p>

      {/* 上の説明と同じ順（お名前・社名・案内役・メール）に並べる */}
      <NameCard current={user.name} />

      {org && <OrgNameCard orgId={org.id} current={org.name} />}

      {!org && <CoachShortcuts orgs={db.organizations.filter((o) => user.organizationIds.includes(o.id))} />}

      <GuideCard />

      <ToneCard />

      <section className="card space-y-1">
        <h2 className="font-black">ログインしているメールアドレス</h2>
        <p className="break-all text-lg font-bold">{email ?? "…"}</p>
        <p className="text-sm text-muted">
          ログインのメールは、このアドレスに届きます。
          {org ? "変えたいときは、コタムの担当者にお知らせください。" : "Googleでログインするときも、このアドレスのアカウントを選んでください。"}
        </p>
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

      <section className="card flex flex-wrap items-center justify-end gap-3">
        <button type="button" className="btn-secondary" onClick={logout}>
          ログアウト
        </button>
      </section>
      <LegalLinks />
    </main>
  );
}

function OrgNameCard({ orgId, current, flat = false }: { orgId: string; current: string; flat?: boolean }) {
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
    <section className={flat ? "space-y-3" : "card space-y-3"}>
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
            記事やAIへのお願いにも、この社名を使います。正式な名前（「株式会社」なども）で入れてください。
            {value.trim().length}／{ORG_NAME_MAX}文字
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
  const [guide] = useGuide();
  return (
    <section className="card space-y-3">
      <h2 className="font-black">{guide.name}の話し方</h2>
      <p className="text-sm text-muted">{guide.name}がどのくらい厳しく声をかけるかを選べます。次にこの画面を開いたときも、選んだままです。</p>
      <div role="radiogroup" aria-label={`${guide.name}の話し方`} className="grid gap-2 sm:grid-cols-3">
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

/** コタムの方のマイページ：管理の画面への近道と、担当している会社（2026-11-07 田村さん「管理画面で何もできない」） */
function CoachShortcuts({ orgs }: { orgs: { id: string; name: string }[] }) {
  const tools = [
    {
      href: "/admin/invitations",
      icon: "✉️",
      label: "お客様を招待する",
      note: "招待状を作って送る",
    },
    {
      href: "/admin/usage",
      icon: "📊",
      label: "利用金額と利用頻度",
      note: "AIの費用、会社ごとに使った日",
    },
    {
      href: "/admin/trial",
      icon: "🧪",
      label: "「30秒でためす」の見守り",
      note: "回数・費用、AIを止める",
    },
    {
      href: "/admin/knowledge",
      icon: "🏭",
      label: "製造業の知識表",
      note: "集めた悩み・疑問・事例",
    },
    {
      href: "/updates",
      icon: "✨",
      label: "新しくなったこと",
      note: "お客様に出ているお知らせ",
    },
  ];
  return (
    <>
      <section className="card space-y-3">
        <h2 className="font-black">管理の画面</h2>
        <p className="text-sm text-muted">全社管理者として登録された方だけが開けます。</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {tools.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="flex items-center gap-3 rounded-2xl border-2 border-line bg-surface px-3 py-2 transition hover:border-brand">
                <span className="text-2xl" aria-hidden>
                  {t.icon}
                </span>
                <span className="min-w-0">
                  <b className="block">{t.label}</b>
                  <span className="block text-xs text-muted">{t.note}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="card space-y-2">
        <h2 className="font-black">担当している会社</h2>
        {orgs.length === 0 ? (
          <p className="text-sm text-muted">まだありません。招待するとここに出ます。</p>
        ) : (
          <ul className="space-y-3">
            {orgs.map((o) => (
              <li key={o.id} className="space-y-2 rounded-2xl border-2 border-line p-3">
                <Link href={`/coach/orgs/${o.id}`} className="text-sm font-bold text-brand-dark underline">
                  この会社の画面を開く
                </Link>
                <OrgNameCard orgId={o.id} current={o.name} flat />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

/** 担当者の名前（2026-11-07 田村さん「担当者の名前も入れたい」）。しおりの呼びかけやメールの宛名に使う */
function NameCard({ current }: { current: string }) {
  const { api } = useStore();
  // まだ名前が無く、メールアドレスがそのまま入っているときは、空から入れてもらう
  const looksLikeEmail = current.includes("@");
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(looksLikeEmail ? "" : current);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const clean = normalizePersonName(value);

  async function save() {
    if (!clean) return;
    setBusy(true);
    setError(null);
    try {
      await api.renameSelf(clean);
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
      <h2 className="font-black">担当者のお名前</h2>
      {editing ? (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <label className="block">
            <span className="field-label text-sm">お名前</span>
            <input className="field" value={value} maxLength={PERSON_NAME_MAX + 5} placeholder="例）田村 巧次" onChange={(e) => setValue(e.target.value)} autoFocus />
          </label>
          <p className="text-sm text-muted"><GuideName />の呼びかけや、メールの宛名に使います。「さん」は付けなくて大丈夫です。</p>
          {error && <p className="text-sm font-bold text-danger">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn-primary" disabled={!clean || clean === current || busy}>
              {busy ? "保存しています…" : "この名前にする"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setEditing(false);
                setError(null);
              }}
            >
              やめる
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="text-xl font-black">{looksLikeEmail ? <span className="text-muted">まだ入っていません</span> : `${current} さん`}</p>
          {saved && <Notice tone="ok" title="お名前を変えました" />}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setValue(looksLikeEmail ? "" : current);
              setSaved(false);
              setEditing(true);
            }}
          >
            {looksLikeEmail ? "お名前を入れる" : "お名前を直す"}
          </button>
        </>
      )}
    </section>
  );
}

/** 案内役を選ぶ（2026-11-07 田村さん「しおりだけじゃなくて、男の人と、キャラクターを選べるようにしたい」） */
function GuideCard() {
  const { guide, outfit, pickedOutfit, setOutfit } = useGuideOutfit();
  const [, setGuide] = useGuide();
  return (
    <section className="card space-y-3">
      <h2 className="font-black">案内役</h2>
      <p className="text-sm text-muted">いっしょに書いてくれる案内役を選べます。画面の絵がかわります。次に開いたときも、選んだままです。</p>
      <div role="radiogroup" aria-label="案内役" className="grid grid-cols-3 gap-2">
        {GUIDES.map((g) => (
          <button
            key={g.id}
            type="button"
            role="radio"
            aria-checked={guide.id === g.id}
            onClick={() => setGuide(g.id)}
            className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-2 py-3 text-center transition ${guide.id === g.id ? "border-brand bg-brand-soft" : "border-line bg-surface hover:border-brand"}`}
          >
            <ShioriFace as={g.id} className="h-16 w-16" />
            <span className="block font-black">{g.name}</span>
            <span className="block text-xs text-muted">{g.note}</span>
          </button>
        ))}
      </div>
      {guide.outfits.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-black">{guide.name}の服</h3>
          <div role="radiogroup" aria-label={`${guide.name}の服`} className="flex gap-2 overflow-x-auto pb-1">
            {guide.outfits.map((o, i) => {
              const on = pickedOutfit === o.id || (!pickedOutfit && i === 0);
              return (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setOutfit(guide.id, o.id)}
                  className={`flex w-20 shrink-0 flex-col items-center gap-1 rounded-2xl border-2 px-1 pb-2 pt-1 text-center transition ${on ? "border-brand bg-brand-soft" : "border-line bg-surface hover:border-brand"}`}
                >
                  <Shiori mood="ask" file={o.file} className="h-24 w-auto" />
                  <span className="block text-xs font-black">{o.label}</span>
                </button>
              );
            })}
            {guide.outfits.some((o) => o.id === "summer" || o.id === "winter") && (
              <button
                type="button"
                role="radio"
                aria-checked={pickedOutfit === AUTO_OUTFIT}
                onClick={() => setOutfit(guide.id, AUTO_OUTFIT)}
                className={`flex w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border-2 px-1 py-2 text-center transition ${pickedOutfit === AUTO_OUTFIT ? "border-brand bg-brand-soft" : "border-line bg-surface hover:border-brand"}`}
              >
                <span aria-hidden className="text-3xl">🍂</span>
                <span className="block text-xs font-black">おまかせ</span>
                <span className="block text-[10px] text-muted">季節で着がえる（今は{seasonalOutfit(guide, new Date().getMonth() + 1)?.label}）</span>
              </button>
            )}
          </div>
        </div>
      )}
      <ShioriTalk key={`${guide.id}-${outfit?.id ?? ""}`} mood="joy" lines={[outfit && outfit !== guide.outfits[0] ? `${guide.name}です。今日は${outfit.label}で来ました。いっしょにがんばりましょう！` : `${guide.name}です。これから、いっしょにがんばりましょう！`]} />
    </section>
  );
}
