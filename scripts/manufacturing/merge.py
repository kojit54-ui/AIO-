#!/usr/bin/env python3
"""製造業の知識表（src/lib/manufacturing/data.json）に、調べた結果の JSON を足す。

使い方（docs/MANUFACTURING_RESEARCH.md）:
  python3 scripts/manufacturing/merge.py <調べた結果のフォルダ>            # 何件足せるかを見るだけ
  python3 scripts/manufacturing/merge.py <調べた結果のフォルダ> --write    # data.json に書き込む
  python3 scripts/manufacturing/merge.py --export <フォルダ>               # 既にある見出しと出典URLの一覧を書き出す

フォルダの *.json（ファイル名が ov で始まるものは海外の箱）を読み、見出しが同じ・よく似たもの、長すぎるもの、形が違うものを除き、
種類ごとの続き番号の id を付けて足す。
データは data.json に置く（TSの配列だとビルドが2分以上かかったため。2026-11-07）。data.ts は読み込むだけ。
"""
import json, re, glob, sys, os, difflib
from collections import Counter
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA = os.path.join(ROOT, "src/lib/manufacturing/data.json")
args = [a for a in sys.argv[1:] if not a.startswith("--")]
old = json.load(open(DATA, encoding="utf-8"))

if not args:
    sys.exit(__doc__)
if "--export" in sys.argv:
    os.makedirs(args[0], exist_ok=True)
    open(os.path.join(args[0], "existing_titles.txt"), "w").write("\n".join(x["kind"] + "\t" + x["title"] for x in old))
    open(os.path.join(args[0], "existing_urls.txt"), "w").write("\n".join(sorted({x["source"]["url"] for x in old})))
    print("exported", len(old))
    sys.exit(0)
R = args[0]

ALIAS = {"切削": "切削加工", "研磨": "研削", "機械": "機械部品", "化粧品": "化粧品OEM", "食品OEM": "食品製造", "食品": "食品製造",
         "紙器": "パッケージ", "段ボール": "パッケージ", "家具": "木工", "縫製": "繊維", "アパレル": "繊維", "鉄工": "金属加工",
         "3Dプリンター": "3Dプリンタ", "放電": "放電加工", "ワイヤーカット": "放電加工", "基板": "基板実装", "EMS": "組立",
         "ロボット": "装置", "FA": "装置", "めっき": "表面処理", "メッキ": "表面処理", "射出成形": "樹脂成形", "健康食品": "食品製造",
         "サプリ": "食品製造", "精密加工": "金属加工", "部品加工": "金属加工", "ダイカスト": "鋳造", "電子機器": "電子部品",
         "装置設計": "装置", "省力化装置": "装置", "化粧品製造": "化粧品OEM", "研削加工": "研削", "製本": "印刷", "製版": "印刷", "特殊印刷": "印刷", "ラベル印刷": "印刷", "印刷関連": "印刷", "印刷関連業": "印刷", "印刷業": "印刷", "印刷機": "印刷機械", "印刷機械業": "印刷機械", "紙器加工": "パッケージ"}
KNOWN = set("切削加工 研削 放電加工 板金 プレス 溶接 製缶 樹脂成形 ゴム 金型 鋳造 鍛造 熱処理 表面処理 塗装 食品製造 化粧品OEM 印刷 パッケージ 木工 繊維 電子部品 基板実装 組立 装置 治具 3Dプリンタ 金属加工 機械部品 印刷機械".split()) | {"ばね・線材","ねじ・締結部品","歯車","パイプ加工","医療機器","半導体","自動車部品","航空宇宙","看板・サイン","ガラス・セラミック","化学・塗料・接着剤","建材・金物","刃物・工具","食品機械","産業機械","精密機器","紙加工","プラスチック加工品","酒・醸造"}
KINDS = {"pain", "question", "success", "buyer", "trend", "term", "case", "stat"}
USES = {"question_example", "article_idea", "writer_hint", "shiori_tip"}

def norm_inds(l):
    out = []
    for i in l or ["all"]:
        i = ALIAS.get(i, i)
        if i == "all" or i in KNOWN:
            if i not in out: out.append(i)
        else:
            unknown[i] += 1
    return out or ["all"]

def key(t): return re.sub(r"[\s　？?！!。、「」・（）()]", "", t)

unknown = Counter()
for x in old: x["industries"] = norm_inds(x["industries"])
seen = {key(x["title"]): x for x in old}
keys_by_kind = {}
for x in old: keys_by_kind.setdefault(x["kind"], []).append(key(x["title"]))
new, drop = [], Counter()
for f in sorted(glob.glob(os.path.join(R, "*.json"))):
    try: items = json.load(open(f))
    except Exception as e: print("BAD", f, e); continue
    for x in items:
        try:
            k = x["kind"]; t = x["title"].strip(); s = x["summary"].strip(); srcd = x["source"]
            assert k in KINDS and t and s
            assert re.match(r"^https?://[^\s]+\.[^\s]+", srcd["url"])
        except Exception:
            drop["malformed"] += 1; continue
        if len(t) > 40 or len(s) > 130: drop["too_long"] += 1; continue
        kk = key(t)
        if kk in seen: drop["dup_title"] += 1; continue
        close = difflib.get_close_matches(kk, keys_by_kind.get(k, []), n=1, cutoff=0.86)
        # 数字だけが違う見出し（統計の「全国719か所」と「全国1,856か所」など）は別のものとして残す
        if close and re.findall(r"\d+", close[0]) == re.findall(r"\d+", kk): drop["near_dup"] += 1; continue
        d = srcd.get("date"); d = str(d).strip() if d not in (None, "") else None
        if d and not re.match(r"^\d{4}(-\d{2})?$", str(d)):
            m = re.match(r"^(\d{4})(?:[-/.](\d{1,2}))?", str(d))
            d = (m.group(1) + ("-%02d" % int(m.group(2)) if m.group(2) else "")) if m else None
        o = {"kind": k}
        if os.path.basename(f).startswith("ov") or x.get("region") == "overseas": o["region"] = "overseas"
        if k == "trend": o["official"] = bool(x.get("official"))
        o.update({"title": t, "summary": s, "industries": norm_inds(x.get("industries")),
                  "useFor": [u for u in x.get("useFor", []) if u in USES] or ["writer_hint"]})
        ai = (x.get("articleIdea") or "").strip()
        if ai and len(ai) <= 50: o["articleIdea"] = ai
        o["source"] = {"title": (srcd.get("title") or srcd.get("publisher") or "出典").strip(), "url": srcd["url"].strip(),
                       "publisher": (srcd.get("publisher") or "").strip(), "date": d or None}
        seen[kk] = o; keys_by_kind.setdefault(k, []).append(kk); new.append(o)

cnt = Counter(x["kind"] for x in old)
def nid(k):
    cnt[k] += 1; return f"{k}-{cnt[k]:03d}"
for o in new: o["id"] = nid(o["kind"])
def ordered(o):
    keys = ["id", "kind", "official", "region", "title", "summary", "industries", "useFor", "articleIdea", "source"]
    return {k: o[k] for k in keys if k in o}
allx = [ordered(x) for x in old] + [ordered(x) for x in new]
print("old", len(old), "new", len(new), "total", len(allx), "dropped", dict(drop))
print("overseas", sum(1 for x in allx if x.get("region") == "overseas"))
print("kinds", Counter(x["kind"] for x in allx))
print("industries", Counter(i for x in allx for i in x["industries"]).most_common())
print("unknown industries", unknown.most_common(30))
if "--write" in sys.argv:
    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(allx, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print("written")
