# 経済構造実態調査 製造業事業所調査（e-Stat）の Excel から、知識表の「国の統計の数字」（kind stat）を作る。
# 使い方: python3 estat_items.py <このフォルダ> <Excelのフォルダ（k3.xlsx 産業別・k4.xlsx 地域別）> <出力.json>
# Excel は https://www.e-stat.go.jp/stat-search/files?toukei=00200555 の「製造業事業所調査」→「二次集計」から。年が変わったら SRC と年（2024）を直す。
# 出力は kind "stat"。そのまま merge.py に渡せる。
import openpyxl, json, sys, re
sys.path.insert(0, sys.argv[1]); from estat_map import M
D=sys.argv[2]; OUT=sys.argv[3]
SRC={"title":"2025年経済構造実態調査 製造業事業所調査（2024年実績）","url":"https://www.e-stat.go.jp/stat-search/files?page=1&toukei=00200555&tstat=000001245387","publisher":"経済産業省","date":"2026-07"}
def num(v):
    try: return float(v)
    except: return None
# 規模別（第5表）
wb=openpyxl.load_workbook(D+'/k3.xlsx',read_only=True); ws=wb['第５表']
size={}
for r in ws.iter_rows(min_row=10,values_only=True):
    if str(r[2])!='2024': continue
    size.setdefault(r[3],{})[r[5]]=dict(n=num(r[7]),emp=num(r[8]),ship=num(r[11]),va=num(r[13]),name=r[4])
# 都道府県（k4 第6表）
wb4=openpyxl.load_workbook(D+'/k4.xlsx',read_only=True); ws=wb4['第６表']
pref={}
for r in ws.iter_rows(min_row=10,values_only=True):
    if str(r[2])!='2024' or r[3] in ('00',None): continue
    if len(str(r[3]))!=2: continue
    n=num(r[7])
    if n: pref.setdefault(r[5],[]).append((r[4],int(n)))
def oku(m): # 百万円 -> 表記
    if m>=100: return f"約{m/100:.1f}億円".replace(".0億","億")
    return f"約{m*100:,.0f}万円"
items=[]
for code,(short,inds) in M.items():
    s=size.get(code)
    if not s or '000' not in s or not s['000']['n']: continue
    t=s['000']; N=int(t['n'])
    small=sum((s.get(k,{}).get('n') or 0) for k in ('601','602','603'))
    p=round(small/N*100) if N else None
    avg=t['ship']/N if t['ship'] else None
    summ=f"国の調査（2024年実績、個人経営を除く）で{short}は全国{N:,}事業所。"
    if p is not None: summ+=f"うち従業者29人以下が{p}%。"
    if avg: summ+=f"1事業所の年間出荷額は平均{oku(avg)}。"
    if len(summ)<=130:
        items.append({"kind":"stat","title":f"{short}の事業所は全国{N:,}か所",
          "summary":summ,"industries":inds,"useFor":["writer_hint","shiori_tip"],"source":SRC})
    # 小さな事業所の姿
    a=s.get('601',{}); b=s.get('604',{})
    if a.get('n') and a.get('ship') and a.get('emp') and b.get('n') and b.get('ship'):
        perA=a['ship']/a['n']; perB=b['ship']/b['n']; vaA=(a['va'] or 0)/a['emp']
        summ=f"{short}で従業者1〜9人の事業所は{int(a['n']):,}か所、1事業所の年間出荷額は平均{oku(perA)}。30〜99人では平均{oku(perB)}。"
        if len(summ)>130: summ=f"{short}で従業者1〜9人の事業所は{int(a['n']):,}か所、年間出荷額は平均{oku(perA)}。30〜99人は平均{oku(perB)}。"
        if len(summ)<=130:
            items.append({"kind":"stat","title":f"{short}、1〜9人規模は平均{oku(perA).replace('約','')}",
              "summary":summ,"industries":inds,"useFor":["writer_hint"],"source":SRC})
    # 都道府県
    pl=sorted(pref.get(code,[]),key=lambda x:-x[1])
    if len(pl)>=3:
        tot=sum(x[1] for x in pl); top5=sum(x[1] for x in pl[:5])
        names="・".join(x[0] for x in pl[:3])
        summ=f"国の調査（2024年実績）で{short}の事業所が多いのは{pl[0][0]}（{pl[0][1]}）、{pl[1][0]}（{pl[1][1]}）、{pl[2][0]}（{pl[2][1]}）。上位5都道府県で全国の{round(top5/tot*100)}%。地域名を添えると近くの発注者に届きやすい。"
        if len(summ)>130: summ=summ.replace("地域名を添えると近くの発注者に届きやすい。","")
        if len(summ)<=130:
            items.append({"kind":"stat","title":f"{short}は{pl[0][0]}が最多の{pl[0][1]}か所",
              "summary":summ,"industries":inds,"useFor":["writer_hint","article_idea"],
              "articleIdea":f"{pl[0][0]}で{short}を頼むなら"[:40],"source":SRC})
# 都道府県ごとの製造業の顔ぶれ（中分類、k4 第1表）
ws=wb4['第１表']; byp={}; tot={}
for r in ws.iter_rows(min_row=10,values_only=True):
    if str(r[2])!='2024' or not r[5] or len(str(r[5]))!=2 or r[5]=='00' or not num(r[7]): continue
    if r[3]=='00': tot[r[6]]=int(num(r[7])); continue
    byp.setdefault(r[6],[]).append((re.sub(r"製造業$","",r[4]).replace("・同関連業",""),int(num(r[7]))))
for p,l in byp.items():
    l=sorted(l,key=lambda x:-x[1])
    summ=f"国の調査（2024年実績、個人経営を除く）で{p}の製造業は{tot[p]:,}事業所。多い順に{l[0][0]}（{l[0][1]}）、{l[1][0]}（{l[1][1]}）、{l[2][0]}（{l[2][1]}）。"
    if len(summ)<=130:
        items.append({"kind":"stat","title":f"{p}の製造業{tot[p]:,}事業所、最多は{l[0][0]}",
          "summary":summ,"industries":["all"],"useFor":["writer_hint"],"source":{**SRC,"title":"2025年経済構造実態調査 製造業事業所調査（地域別統計表）"}})
json.dump(items,open(OUT,"w"),ensure_ascii=False,indent=1)
print(len(items)); 
for x in items[:4]+items[-2:]: print(x["title"],"|",x["summary"],len(x["summary"]))
