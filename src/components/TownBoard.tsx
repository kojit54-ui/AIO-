"use client";

// 案4「AIの町すごろく」（2026-11-03）。ホームに出す。
// 記事をブログに載せるほど、町に会社の建物が建って大きくなる。マスは実際の記録で進み、
// 最後の「お客様に選ばれた（お問い合わせ）」は会社の人が自分で押す。進んだときは、コマが1マスずつ跳んで紙吹雪。
// コマは会社の家（しおりの絵は動かさない）。

import { useEffect, useState } from "react";
import { Confetti } from "@/components/fun";
import { SIDE_STAMP_IDS, TOWN_LEVELS, type TownStep, publishedCount, skippedSteps, townLevel, townPosition, townSteps } from "@/lib/growth/town";
import { badges, type Badge } from "@/lib/growth/badges";
import type { MockDb } from "@/mock/store";
import { GuideText } from "@/components/useGuide";

const INQUIRY_KEY = (orgId: string) => `town:inquiry:${orgId}`;
const SEEN_KEY = (orgId: string) => `town:seen:${orgId}`;

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // 覚えられなくても表示はできる
  }
}

const NEXT_LABEL: Record<string, string> = {
  hello: "質問に答える",
  first: "記事を書く",
  check: "記事のチェックへ進む",
  publish: "記事を開く",
  five: "次の記事を書く",
};

export function TownBoard({ db, orgId, orgName }: { db: MockDb; orgId: string; orgName: string }) {
  // マスごとの行き先。チェック・載せるは、いちばん新しい記事へ
  const latest = db.articles.filter((a) => a.organizationId === orgId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const nextHref = (id: string): string | null =>
    id === "hello" ? "/profile" : id === "first" || id === "five" ? "/articles/new" : id === "check" || id === "publish" ? (latest ? `/articles/${latest.id}` : "/articles/new") : null;
  const [inquiry, setInquiry] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setInquiry(read(INQUIRY_KEY(orgId)) === "1");
      setLoaded(true);
    }, 0);
    return () => clearTimeout(t);
  }, [orgId]);

  const steps = townSteps(db, orgId, inquiry);
  const published = publishedCount(db, orgId);
  const side = badges(db, orgId).filter((b) => SIDE_STAMP_IDS.includes(b.id));
  return <TownView steps={steps} published={published} orgId={orgId} orgName={orgName} loaded={loaded} side={side} nextHref={nextHref} onInquiry={(v) => {
    write(INQUIRY_KEY(orgId), v ? "1" : null);
    setInquiry(v);
  }} />;
}

/** 見た目だけ（30秒でためすの見本でも使う） */
export function TownView({
  steps,
  published,
  orgId,
  orgName,
  loaded = true,
  onInquiry,
  preview = false,
  side = [],
  nextHref = () => null,
}: {
  /** 次のマスへ進む行き先（無ければボタンを出さない） */
  nextHref?: (id: string) => string | null;
  steps: TownStep[];
  /** 寄り道のスタンプ（すごろくのマスに無いもの） */
  side?: Badge[];
  published: number;
  orgId: string;
  orgName: string;
  loaded?: boolean;
  onInquiry?: (v: boolean) => void;
  /** 登録前の見本。覚えない・ボタンを出さない */
  preview?: boolean;
}) {
  const pos = townPosition(steps);
  const [shown, setShown] = useState(pos);
  const [party, setParty] = useState(0);

  // 前に見たときより進んでいたら、1マスずつ跳んで進む
  useEffect(() => {
    if (!loaded || preview) return;
    const seen = Number(read(SEEN_KEY(orgId)) ?? pos);
    write(SEEN_KEY(orgId), String(pos));
    if (!(seen < pos)) {
      const t = setTimeout(() => setShown(pos), 0);
      return () => clearTimeout(t);
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setShown(seen), 0));
    for (let i = seen + 1; i <= pos; i++) timers.push(setTimeout(() => setShown(i), 500 + (i - seen) * 450));
    timers.push(setTimeout(() => setParty((n) => n + 1), 600 + (pos - seen) * 450));
    return () => timers.forEach(clearTimeout);
  }, [loaded, preview, pos, orgId]);

  const { index, level, next } = townLevel(published);
  const goal = pos >= steps.length;
  const current = steps[Math.min(shown, steps.length - 1)];
  const mentioned = steps.find((s) => s.id === "mention")?.done ?? false;
  const inquired = steps.find((s) => s.id === "inquiry")?.done ?? false;
  const skipped = skippedSteps(steps);

  return (
    <section className="card animate-rise space-y-4" aria-labelledby="town-heading">
      {party > 0 && <Confetti key={party} count={60} />}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="town-heading" className="text-lg font-black">
          🏘️ AIの町すごろく
        </h2>
        <span className="rounded-full bg-sun-soft px-3 text-sm font-black">
          建物：{level.name}
          {next && <span className="font-bold text-muted">（あと{next.min - published}本で「{next.name}」）</span>}
        </span>
      </div>

      <Town level={index} name={orgName} mentioned={mentioned} inquired={inquired} />

      <ol className="grid grid-cols-4 gap-2 sm:grid-cols-8" aria-label="すごろくのマス">
        <Cell n={0} icon="🏁" label="スタート" state="done" />
        {steps.map((s, i) => (
          <Cell key={s.id} n={i + 1} icon={s.icon} label={s.label} stage={s.stage} state={i === shown && !goal ? "here" : s.done ? "done" : i < pos ? "skipped" : "todo"} />
        ))}
      </ol>

      {goal ? (
        <p className="rounded-2xl bg-sun-soft px-4 py-3 font-black">🎉 ゴール！ AIに選ばれて、お客様に選ばれました。この調子で、町のシンボルを目指しましょう！</p>
      ) : (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-canvas px-4 py-3">
          <p className="min-w-0 flex-1">
            <span className="block text-xs font-black text-brand-dark">次のマス：{current.label}</span>
            <span className="font-bold"><GuideText text={current.how} /></span>
          </p>
          {skipped.length > 0 && (
            <span className="block w-full text-xs text-muted">
              とばしたマス：{skipped.map((x) => x.label).join("・")}（いつでも進められます）
            </span>
          )}
          {/* 次のマスへ進む場所をはっきり見せる（2026-11-08 お客様役「押す場所が分からない」） */}
          {!preview && nextHref(current.id) && (
            <a href={nextHref(current.id)!} className="btn-primary min-h-11 px-4 text-sm">
              {NEXT_LABEL[current.id] ?? "進む"} →
            </a>
          )}
          {!preview && current.id === "inquiry" && onInquiry && (
            <button type="button" className="btn-primary min-h-11 px-4 text-sm" onClick={() => onInquiry(true)}>
              🎉 お問い合わせが来た！
            </button>
          )}
        </div>
      )}
      {!preview && inquired && onInquiry && (
        <p className="text-right text-xs">
          <button type="button" className="font-bold text-muted underline" onClick={() => onInquiry(false)}>
            「お問い合わせが来た」を取り消す
          </button>
        </p>
      )}
      {side.length > 0 && (
        <div className="rounded-2xl border border-line px-3 py-2">
          <p className="mb-1 text-xs font-black text-muted">
            寄り道スタンプ {side.filter((b) => b.got).length} / {side.length}
          </p>
          <ul className="flex flex-wrap gap-2">
            {side.map((b) => (
              <li key={b.id} title={b.got ? b.title : b.how} className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${b.got ? "bg-sun-soft" : "border border-dashed border-line text-muted"}`}>
                <span aria-hidden className={b.got ? "" : "opacity-40 grayscale"}>
                  {b.icon}
                </span>
                {b.got ? b.title : b.how}
                <span className="sr-only">{b.got ? "（もらった）" : "（まだ）"}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-xs text-muted">
        マスは、書いた・載せた・チェックした記録で進みます。建物は、ブログに載せた本数で{TOWN_LEVELS.length}段階に育ちます。お問い合わせはこのサービスでは分からないので、来たらご自分で押してください（いま使っているスマホ・パソコンに記録されます）。
      </p>
    </section>
  );
}

function Cell({ n, icon, label, stage, state }: { n: number; icon: string; label: string; stage?: "ai" | "people"; state: "done" | "here" | "todo" | "skipped" }) {
  const tone =
    state === "todo" || state === "skipped"
      ? "border-dashed border-line bg-surface text-muted"
      : stage === "people"
        ? "border-sun-dark bg-sun"
        : stage === "ai"
          ? "border-brand bg-brand-soft"
          : "border-ok-bright bg-ok-soft";
  return (
    <li className={`relative flex min-h-20 flex-col items-center justify-center gap-0.5 rounded-2xl border-2 p-1.5 text-center ${tone} ${state === "here" ? "ring-4 ring-sun/70" : ""}`}>
      <span className="absolute left-1.5 top-1 text-[0.65rem] font-black text-muted">{n}</span>
      {state === "here" ? (
        <span className="animate-hop text-2xl" aria-label="いまここ">
          🏠
        </span>
      ) : (
        <span className={`text-xl ${state === "todo" || state === "skipped" ? "opacity-50 grayscale" : ""}`} aria-hidden>
          {icon}
        </span>
      )}
      <span className="text-[0.7rem] font-black leading-tight sm:text-xs">{label}</span>
      {state === "done" && n > 0 && <span className="sr-only">（済み）</span>}
      {state === "skipped" && <span className="absolute right-1 top-0.5 rounded-full bg-sun px-1 text-[0.6rem] font-black text-ink">まだ</span>}
    </li>
  );
}

/** 町の絵。真ん中があなたの会社。大きさは5段階 */
function Town({ level, name, mentioned, inquired }: { level: number; name: string; mentioned: boolean; inquired: boolean }) {
  const label = Array.from(name).slice(0, 9).join("");
  // 建物の高さと幅（空き地は看板だけ）
  const h = [0, 34, 50, 72, 96][level];
  const w = [0, 52, 64, 70, 78][level];
  const x = 170 - w / 2;
  const ground = 150;
  return (
    <svg viewBox="0 0 340 170" preserveAspectRatio="xMidYMax meet" className="h-44 w-full rounded-2xl bg-gradient-to-b from-sky/40 to-brand-soft sm:h-56" role="img" aria-label={`町の中のあなたの会社：${["空き地", "小さなお店", "町のお店", "目立つビル", "町のシンボル"][level]}`}>
      {/* 遠くの山と雲 */}
      {/* 横に広い画面では、viewBox の外まで町が続く */}
      <path d="M-500 110 L-420 82 L-340 116 L-250 78 L-160 112 L-80 88 L0 120 L60 80 L110 115 L170 70 L240 118 L300 86 L340 110 L420 84 L500 116 L590 76 L680 112 L760 90 L840 110 V170 H-500z" fill="#fff" opacity={0.5} />
      <g className="animate-float" style={{ transformBox: "fill-box" }}>
        <ellipse cx={60} cy={30} rx={22} ry={8} fill="#fff" />
        <ellipse cx={280} cy={24} rx={18} ry={7} fill="#fff" />
      </g>
      {/* となりの建物 */}
      <rect x={30} y={ground - 46} width={44} height={46} rx={4} fill="var(--color-line)" />
      <rect x={82} y={ground - 30} width={36} height={30} rx={4} fill="var(--color-canvas-deep)" />
      <rect x={232} y={ground - 38} width={40} height={38} rx={4} fill="var(--color-canvas-deep)" />
      <rect x={280} y={ground - 58} width={36} height={58} rx={4} fill="var(--color-line)" />
      {[-200, -140, -70, 360, 420, 480].map((bx, i) => (
        <rect key={bx} x={bx} y={ground - [40, 62, 34, 50, 30, 66][i]} width={[44, 38, 50, 40, 46, 36][i]} height={[40, 62, 34, 50, 30, 66][i]} rx={4} fill={i % 2 ? "var(--color-line)" : "var(--color-canvas-deep)"} />
      ))}
      {/* 地面 */}
      <rect x={-500} y={ground} width={1340} height={20} fill="var(--color-ok-bright)" opacity={0.55} />
      <rect x={-500} y={ground + 8} width={1340} height={4} fill="#fff" opacity={0.6} />

      {level === 0 ? (
        <g>
          <rect x={150} y={ground - 40} width={40} height={24} rx={4} fill="#fff" stroke="var(--color-sun-dark)" strokeWidth={2} />
          <rect x={168} y={ground - 16} width={4} height={16} fill="var(--color-sun-dark)" />
          <text x={170} y={ground - 24} textAnchor="middle" fontSize={8} fontWeight={900} fill="var(--color-ink)">
            ここに建つ
          </text>
        </g>
      ) : (
        <g key={level} className="animate-pop" style={{ transformBox: "fill-box", transformOrigin: "bottom" }}>
          {level === 4 && <rect x={168} y={ground - h - 22} width={4} height={22} fill="var(--color-ink)" />}
          {level === 4 && <circle cx={170} cy={ground - h - 24} r={4} className="animate-twinkle" fill="var(--color-sun)" />}
          {level <= 2 ? (
            <path d={`M${x - 6} ${ground - h} L170 ${ground - h - 20} L${x + w + 6} ${ground - h}z`} fill="var(--color-danger)" />
          ) : null}
          <rect x={x} y={ground - h} width={w} height={h} rx={5} fill="var(--color-brand)" />
          {/* 窓 */}
          {Array.from({ length: Math.max(0, Math.floor((h - 26) / 16)) }).map((_, r) =>
            [0, 1, 2].map((c) => <rect key={`${r}-${c}`} x={x + 10 + c * ((w - 26) / 2)} y={ground - h + 8 + r * 16} width={6} height={8} rx={1.5} fill="var(--color-sun)" opacity={0.9} />),
          )}
          <rect x={164} y={ground - 16} width={12} height={16} rx={2} fill="#fff" />
          {/* 看板 */}
          <rect x={126} y={ground - 31} width={88} height={13} rx={4} fill="#fff" stroke="var(--color-ink)" strokeWidth={1.2} />
          <text x={170} y={ground - 21.5} textAnchor="middle" fontSize={8} fontWeight={900} fill="var(--color-ink)">
            {label}
          </text>
        </g>
      )}

      {/* AIに選ばれたら、AIの星が建物のまわりを回る */}
      {mentioned && (
        <g className="animate-float" style={{ transformBox: "fill-box" }}>
          <circle cx={222} cy={ground - Math.max(h, 40) - 18} r={11} fill="var(--color-ink)" />
          <text x={222} y={ground - Math.max(h, 40) - 14} textAnchor="middle" fontSize={11} fill="#fff">
            ✦
          </text>
        </g>
      )}
      {/* お客様に選ばれたら、お客様が入り口へ */}
      {inquired && (
        <g className="animate-nudge" style={{ transformBox: "fill-box" }}>
          <circle cx={140} cy={ground - 14} r={4} fill="var(--color-ink)" />
          <rect x={136.5} y={ground - 10} width={7} height={10} rx={3} fill="var(--color-sun-dark)" />
          <text x={128} y={ground - 22} fontSize={10}>
            💬
          </text>
        </g>
      )}
    </svg>
  );
}
