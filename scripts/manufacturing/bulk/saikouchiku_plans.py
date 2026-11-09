# 事業再構築補助金の「採択案件一覧【事業計画書の概要】」製造業（seizo_NN.pdf）から、都道府県・事業計画名・概要だけを取り出す（会社名・法人番号は取らない）。
# 使い方: seizo_NN.pdf を置いたフォルダで python3 saikouchiku_plans.py → saikou_rows.json
# PDF は https://jigyou-saikouchiku.go.jp/result.html の「事業計画の概要」製造業。
import pdfplumber, json, sys, glob
out=[]
for f in sorted(glob.glob('seizo_*.pdf')):
    rnd=f.split('_')[1][:2]
    with pdfplumber.open(f) as p:
        for pg in p.pages:
            for t in pg.extract_tables():
                for r in t:
                    if not r or len(r)<9 or r[0] in ('エリア',None) or not r[7]: continue
                    out.append({"round":int(rnd),"pref":r[1],"plan":(r[7] or '').replace('\n',''),"summary":(r[8] or '').replace('\n','')})
json.dump(out,open('saikou_rows.json','w'),ensure_ascii=False)
print(len(out)); import collections; print(collections.Counter(x['round'] for x in out))
