# 使い方: python3 monodukuri_cases.py <出力.json>（約4,500行・数分。0.4秒ずつ間をあける）
# ものづくり補助金 成果事例検索から製造業の行を集める（会社名は保存しない）
import requests, re, sys, json, time
from bs4 import BeautifulSoup
U="https://portal.monodukuri-hojo.jp/jireisearch.aspx"
OUT=sys.argv[1]
MFG=['食料品製造業','飲料・たばこ・飼料製造業','繊維工業','木材・木製品製造業','家具・装備品製造業','パルプ・紙・紙加工品製造業','印刷・同関連業','化学工業','プラスチック製品製造業','ゴム製品製造業','なめし革・同製品・毛皮製造業','窯業・土石製品製造業','鉄鋼業','非鉄金属製造業','金属製品製造業','はん用機械器具製造業','生産用機械器具製造業','業務用機械器具製造業','電気機械器具製造業','情報通信機械器具製造業','電子部品・デバイス・電子回路製造業','輸送用機械器具製造業','その他の製造業']
def hidden(soup): return {i["name"]:i.get("value","") for i in soup.select("input[type=hidden]")}
def rows(soup):
    out=[]
    for tr in soup.select("tr[data-href]"):
        td=[x.get_text(strip=True) for x in tr.find_all("td")]
        if len(td)>=6:
            out.append({"id":tr["data-href"].split("id=")[-1],"pref":td[0],"plan":td[2],"industry":td[3],"tech":td[4],"year":td[5]})
    return out
allrows={}
try: allrows={r["id"]:r for r in json.load(open(OUT))}
except Exception: pass
for ind in MFG:
    s=requests.Session(); s.headers["User-Agent"]="Mozilla/5.0"
    soup=BeautifulSoup(s.get(U,timeout=60).text,"html.parser")
    names=[]
    for inp in soup.select("input[id^=ContentPlaceHolder1_listIndustryType_IndustryTypeID_]"):
        lab=soup.find("label",attrs={"for":inp["id"]})
        if lab and lab.get_text(strip=True)==ind: names.append(inp["name"])
    d=hidden(soup)
    for n in names: d[n]="on"
    d["ctl00$ContentPlaceHolder1$btnDoSearch2.x"]="10"; d["ctl00$ContentPlaceHolder1$btnDoSearch2.y"]="10"
    soup=BeautifulSoup(s.post(U,data=d,timeout=120).text,"html.parser")
    m=re.search(r"検索結果：\s*([\d,]+)\s*件",soup.get_text()); total=int(m.group(1).replace(",","")) if m else 0
    got=0; page=0
    while True:
        rs=rows(soup); 
        for r in rs: allrows[r["id"]]=r
        got+=len(rs); page+=1
        if got>=total or not rs or not soup.find(id="ContentPlaceHolder1_btnPgN"): break
        d=hidden(soup); d["__EVENTTARGET"]="ctl00$ContentPlaceHolder1$btnPgN"; d["__EVENTARGUMENT"]=""
        # keep the industry checkbox state
        time.sleep(0.4)
        for t in range(3):
            try: soup=BeautifulSoup(s.post(U.replace("jireisearch.aspx","jireisearch_result.aspx"),data=d,timeout=120).text,"html.parser"); break
            except Exception: time.sleep(3)
    print(ind,total,got,flush=True)
    json.dump(list(allrows.values()),open(OUT,"w"),ensure_ascii=False)
print("ALL",len(allrows))
