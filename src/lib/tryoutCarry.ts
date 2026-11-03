// 30秒でためす（/try）で入れた会社のことを、ログインしたあとのヒアリングで使う（2026-11-03）。
// 本人が「覚えておく」を選んだときだけ、このブラウザの中にだけ置く（サーバーには送らない）。7日で使えなくなる。

const KEY = "tryout:carry";
const DAYS = 7;

export interface TryCarry {
  company: string;
  region: string;
  job: string;
  story: string;
  at: number;
}

export function saveTryCarry(v: Omit<TryCarry, "at">): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...v, at: Date.now() }));
    return true;
  } catch {
    return false;
  }
}

export function loadTryCarry(now = Date.now()): TryCarry | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<TryCarry>;
    if (typeof v.at !== "number" || now - v.at > DAYS * 24 * 3600_000) {
      window.localStorage.removeItem(KEY);
      return null;
    }
    const s = (x: unknown) => (typeof x === "string" ? x.slice(0, 400) : "");
    return { company: s(v.company), region: s(v.region), job: s(v.job), story: s(v.story), at: v.at };
  } catch {
    return null;
  }
}

export function clearTryCarry() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // 消せなくても7日で使えなくなる
  }
}
