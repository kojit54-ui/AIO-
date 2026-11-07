"use client";

// 選んだ案内役をこのブラウザに覚える（覚えられないときは しおり）。変えたらすぐ同じ画面の絵も変わる。

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { DEFAULT_GUIDE, guideOf, isGuideId, resolveOutfit, withGuideName, type GuideCharacter, type GuideId, type Outfit } from "@/lib/guideCharacter";

const KEY = "cotam-guide-v1";
/** 案内役ごとに選んだ服（{"shiori":"work"} の形） */
const OUTFIT_KEY = "cotam-guide-outfit-v1";
const EVENT = "cotam-guide";

function read(): GuideId {
  try {
    const v = window.localStorage.getItem(KEY);
    return isGuideId(v) ? v : DEFAULT_GUIDE;
  } catch {
    return DEFAULT_GUIDE;
  }
}

function readOutfits(): string {
  try {
    return window.localStorage.getItem(OUTFIT_KEY) ?? "{}";
  } catch {
    return "{}";
  }
}

function parseOutfits(raw: string): Record<string, string> {
  try {
    const v: unknown = JSON.parse(raw);
    return v && typeof v === "object" ? (v as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** ログイン前の画面（入口・ためす・自己紹介・ログイン・招待・規約）は、サービスの顔の しおり のまま */
const PUBLIC = ["/welcome", "/try", "/shiori", "/login", "/invite", "/terms", "/privacy", "/tokushoho"];
export const isPublicPath = (p: string | null) => !!p && PUBLIC.some((x) => p === x || p.startsWith(`${x}/`));

export interface GuideState {
  guide: GuideCharacter;
  /** 今着ている服（着がえない案内役は undefined） */
  outfit: Outfit | undefined;
  /** 選んでいる服の id か "auto"（おまかせ）。未選択は undefined */
  pickedOutfit: string | undefined;
}

function useGuideState(): GuideState {
  const picked = useSyncExternalStore(subscribe, read, () => DEFAULT_GUIDE);
  const rawOutfits = useSyncExternalStore(subscribe, readOutfits, () => "{}");
  const pub = isPublicPath(usePathname());
  const guide = guideOf(pub ? DEFAULT_GUIDE : picked);
  // ログイン前の画面は、いつものスーツの しおり
  const pickedOutfit = pub ? undefined : parseOutfits(rawOutfits)[guide.id];
  return { guide, outfit: resolveOutfit(guide, pickedOutfit, new Date().getMonth() + 1), pickedOutfit };
}

function save(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // 覚えられないときは ふだんのまま
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useGuide(): [GuideCharacter, (id: GuideId) => void] {
  const { guide } = useGuideState();
  return [guide, (next: GuideId) => save(KEY, next)];
}

/** 案内役と服。setOutfit は今の案内役の服を選ぶ（"auto" でおまかせ） */
export function useGuideOutfit(): GuideState & { setOutfit: (guide: GuideId, outfit: string) => void } {
  const state = useGuideState();
  const setOutfit = (g: GuideId, outfit: string) => save(OUTFIT_KEY, JSON.stringify({ ...parseOutfits(readOutfits()), [g]: outfit }));
  return { ...state, setOutfit };
}

/** 画面の言葉の「しおり」を、選んだ案内役の名前にする関数（ログイン前の画面は しおり のまま） */
export function useGuideText(): (text: string) => string {
  const { guide } = useGuideState();
  return (text: string) => withGuideName(text, guide.name);
}

/** 選んだ案内役の名前（画面の文の中に置く） */
export function GuideName() {
  return useGuideState().guide.name;
}

/** 文の中の「しおり」を、選んだ案内役の名前にして出す */
export function GuideText({ text }: { text: string }) {
  const named = useGuideText();
  return named(text);
}
