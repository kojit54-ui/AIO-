"use client";

// ホームの「しおりのスタンプ帳」。取ったバッジは色つき、まだのものは取り方を見せる。
// 新しく取ったバッジがあれば、スタンプを押す動きと紙吹雪でお祝いする（見たものはこのブラウザに覚える）。

import { useEffect, useState } from "react";
import { Confetti } from "@/components/fun";
import { ShioriTalk } from "@/components/talk";
import { badges, newlyGot } from "@/lib/growth/badges";
import type { MockDb } from "@/mock/store";

const KEY = (orgId: string) => `stampbook:${orgId}`;

function loadSeen(orgId: string): string[] | null {
  try {
    const raw = window.localStorage.getItem(KEY(orgId));
    return raw ? (JSON.parse(raw) as string[]) : null;
  } catch {
    return [];
  }
}

export function StampBook({ db, orgId }: { db: MockDb; orgId: string }) {
  const list = badges(db, orgId);
  const got = list.filter((b) => b.got);
  const [fresh, setFresh] = useState<string[]>([]);
  const gotKey = got.map((b) => b.id).join(",");

  useEffect(() => {
    const seen = loadSeen(orgId);
    const ids = gotKey ? gotKey.split(",") : [];
    // はじめて開いたときは、今までの分をお祝いせずに覚えるだけ
    const news = seen === null ? [] : newlyGot(list, seen).map((b) => b.id);
    // 覚えるのとお祝いは同じタイミングで。開発中の二度呼び（StrictMode）で、先に覚えてお祝いが消えないように
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(KEY(orgId), JSON.stringify(ids));
      } catch {
        // 覚えられなくても表示はできる
      }
      if (news.length) setFresh(news);
    }, 0);
    return () => clearTimeout(t);
    // バッジがそろったときだけ確かめ直す
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, gotKey]);

  const nextOne = list.find((b) => !b.got);
  const newest = list.find((b) => fresh.includes(b.id));

  return (
    <section className="card animate-rise space-y-3" aria-labelledby="stamp-heading">
      {newest && <Confetti count={60} />}
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 id="stamp-heading" className="text-lg font-black">
          🎖️ しおりのスタンプ帳
        </h2>
        <p className="rounded-full bg-sun-soft px-3 py-0.5 text-sm font-black">
          {got.length} / {list.length} こ
        </p>
      </div>
      {newest ? (
        <ShioriTalk mood="jersey-done" size="sm" lines={[`やりましたね！「${newest.title}」のスタンプです！`, nextOne ? `次は「${nextOne.how}」で、「${nextOne.title}」がもらえますよ。` : "スタンプが全部そろいました！"]} />
      ) : (
        nextOne && <ShioriTalk mood="point" size="sm" lines={`次のスタンプは「${nextOne.title}」。${nextOne.how}ともらえます。`} />
      )}
      <ul className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {list.map((b, i) => (
          <li key={b.id} className="text-center" title={b.got ? b.title : `まだ：${b.how}`}>
            <span
              className={`mx-auto grid h-12 w-12 place-items-center rounded-full border-2 text-2xl ${
                b.got ? `border-sun bg-sun-soft ${fresh.includes(b.id) ? "animate-stamp" : ""}` : "border-dashed border-line bg-canvas opacity-50 grayscale"
              }`}
              style={fresh.includes(b.id) ? { animationDelay: `${0.3 + i * 0.05}s` } : undefined}
              aria-hidden
            >
              {b.got ? b.icon : "？"}
            </span>
            <span className={`mt-1 block text-[0.7rem] leading-tight ${b.got ? "font-bold" : "text-muted"}`}>{b.title}</span>
            <span className="sr-only">{b.got ? `${b.title}（取りました）` : `${b.title}（まだ。${b.how}）`}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
