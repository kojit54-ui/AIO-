# AIOえらばれ帳 ロゴ v3（現場の野帳）。3AIの批評をうけて寸法から作り直し。
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
from text import font, palt_map
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
F = os.path.join(HERE, '..', '..', 'font')
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'out')
os.makedirs(OUT, exist_ok=True)

C = dict(indigo='#1E4F7C', brass='#E9B53B', paper='#F7F4EC', sumi='#1F2A33', white='#FFFFFF')

# ---------- マーク（本体 70x100、しおりは下へ12はみ出す。座標は 0..120） ----------
X0, Y0, W, H = 25, 4, 70, 100        # 本体
RB, RF = 3, 9                         # 綴じ側・小口側の角の半径
SPX, SPW = X0 + 9, 3                  # 背の溝
LBX, LBY, LBW, LBH, LBR = X0 + 22, Y0 + 17, 36, 18, 1.5   # 表題欄
RBX, RBW, RBY, RBB, VD = X0 + 44, 11, Y0 + 82, Y0 + H + 12, 4   # しおり（上端・下端・V字の深さ）

def body_d():
    x1, y1 = X0 + W, Y0 + H
    return (f"M{X0+RB},{Y0} H{x1-RF} A{RF},{RF} 0 0 1 {x1},{Y0+RF} V{y1-RF} A{RF},{RF} 0 0 1 {x1-RF},{y1} "
            f"H{X0+RB} A{RB},{RB} 0 0 1 {X0},{y1-RB} V{Y0+RB} A{RB},{RB} 0 0 1 {X0+RB},{Y0} Z")

def ribbon_d(top=RBY, bottom=RBB):
    cx = RBX + RBW / 2
    return f"M{RBX},{top} H{RBX+RBW} V{bottom} L{cx},{bottom-VD} L{RBX},{bottom} Z"

def mark(theme='color', small=False):
    """theme: color / reverse（濃い地） / white / ink。small=True は 24px 以下用（溝を太く、しおりは四角）"""
    spw = SPW * (1.6 if small else 1)
    if theme in ('white', 'ink'):
        fg = C['white'] if theme == 'white' else C['sumi']
        mid = f'm-{theme}{"-s" if small else ""}'
        # 1色版：しおりは本体の中では「抜き」、はみ出す所は「塗り」。形だけで読めるようにする
        return f'''<defs><mask id="{mid}" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120"><rect width="120" height="120" fill="#fff"/>
<rect x="{SPX}" y="{Y0-1}" width="{spw}" height="{H+2}" fill="#000"/><rect x="{LBX}" y="{LBY}" width="{LBW}" height="{LBH}" rx="{LBR}" fill="#000"/>
<rect x="{RBX-2.5}" y="{RBY-2.5}" width="{RBW+5}" height="{H-(RBY-Y0)+3}" fill="#000"/></mask></defs>
<path fill="{fg}" mask="url(#{mid})" d="{body_d()}"/>
<path fill="{fg}" d="{ribbon_d(RBY, RBB) if not small else f'M{RBX},{RBY} H{RBX+RBW} V{RBB} H{RBX} Z'}"/>'''
    body = C['indigo']
    groove = C['paper'] if theme == 'color' else C['paper']
    return f'''<path fill="{body}" d="{body_d()}"/>
<rect x="{SPX}" y="{Y0}" width="{spw}" height="{H}" fill="{groove}"/>
<rect x="{LBX}" y="{LBY}" width="{LBW}" height="{LBH}" rx="{LBR}" fill="{C['paper']}"/>
<path fill="{C['brass']}" d="{ribbon_d() if not small else f'M{RBX},{RBY} H{RBX+RBW} V{RBB} H{RBX} Z'}"/>'''

# ---------- ワードマーク ----------
def glyphs(text, fontfile, size, kern=None, tracking=0, use_palt=True):
    """返り値: (path_d, width, (ymin, ymax) 字面の上下, 各字の左端)"""
    f = font(os.path.join(F, fontfile))
    upm = f['head'].unitsPerEm; s = size / upm
    gs = f.getGlyphSet(); cmap = f.getBestCmap(); hmtx = f['hmtx']
    pm = palt_map(f) if use_palt else {}
    pen = SVGPathPen(gs, ntos=lambda v: ('%.2f' % v).rstrip('0').rstrip('.'))
    bp = BoundsPen(gs)
    cx = 0; lefts = []
    for i, ch in enumerate(text):
        g = cmap[ord(ch)]
        xp, xa = pm.get(g, (0, 0))
        if i > 0 and kern: cx += kern.get(text[i-1:i+1], 0)
        lefts.append(cx * s)
        gs[g].draw(TransformPen(pen, (s, 0, 0, -s, (cx + xp) * s, 0)))
        gs[g].draw(TransformPen(bp, (s, 0, 0, -s, (cx + xp) * s, 0)))
        cx += hmtx[g][0] + xa + (tracking if i < len(text) - 1 else 0)
    b = bp.bounds  # (xmin, ymin, xmax, ymax) SVG座標（y下向き）
    return pen.getCommands(), cx * s, b

KANA_KERN = {'えら': -40, 'らば': -70, 'ばれ': -10}   # Geminiの指摘（1000分率）
def wordmark(size, ink, accent):
    """「AIO」+「えらばれ」+「帳」。返り値: (svg要素, 幅, 字面の上, 字面の下)。y=0 が和文のベースライン"""
    kd, kw, kb = glyphs('えらばれ', 'zk900.ttf', size, kern=KANA_KERN)
    # 「帳」は同じ Black を 95% にして、字面の中央を「えらばれ」にそろえる（Boldだと腰くだけに見えた）
    cd, cw, cb = glyphs('帳', 'zk900.ttf', size * 0.95)
    top, bot = kb[1], kb[3]
    face = bot - top
    # AIO の大文字の高さ＝和文の字面の 0.80、字面の中央にそろえて 1.5% 上へ
    a_test, _, ab = glyphs('AIO', 'barlow700.ttf', 100, use_palt=False)
    cap = ab[3] - ab[1]
    asize = 100 * face * 0.80 / cap
    ad, aw, abx = glyphs('AIO', 'barlow700.ttf', asize, kern={'AI': -30, 'IO': 20}, tracking=30, use_palt=False)
    a_mid = (abx[1] + abx[3]) / 2
    k_mid = (top + bot) / 2 - face * 0.015
    ay = k_mid - a_mid
    gap = size * 0.10
    kx = aw + gap
    cx = kx + kw + size * (-30 / 1000)
    cy = ((kb[1] + kb[3]) - (cb[1] + cb[3])) / 2   # 帳の字面の中央を、かなの字面の中央へ
    el = (f'<path fill="{accent}" transform="translate(0,{ay:.2f})" d="{ad}"/>'
          f'<path fill="{ink}" transform="translate({kx:.2f},0)" d="{kd}"/>'
          f'<path fill="{ink}" transform="translate({cx:.2f},{cy:.2f})" d="{cd}"/>')
    return el, cx + cw, top, bot

def colors(theme):
    if theme == 'color': return C['sumi'], C['indigo']
    if theme == 'reverse': return C['white'], C['brass']
    if theme == 'white': return C['white'], C['white']
    return C['sumi'], C['sumi']

def svg(w, h, body, label):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" width="{w:.0f}" height="{h:.0f}" role="img" aria-label="{label}">'
            f'<title>{label}</title>\n{body}\n</svg>\n')

def horizontal(theme='color'):
    ink, acc = colors(theme)
    size = 56
    el, ww, top, bot = wordmark(size, ink, acc)
    # 文字の字面の中央を、マーク本体の中央（y=54）に合わせる
    base = 54 - (top + bot) / 2
    mx = 120 - X0 - W + size * 0.42   # マークの右端から和文 0.42 字
    x = X0 + W + size * 0.42
    Wd = x + ww + 6
    return svg(Wd, 120, f'<g transform="translate(-{X0-4},0)">{mark(theme)}</g>\n<g transform="translate({x-X0+4:.2f},{base:.2f})">{el}</g>', 'AIOえらばれ帳'), Wd - 0

def vertical(theme='color'):
    ink, acc = colors(theme)
    size = 50
    el, ww, top, bot = wordmark(size, ink, acc)
    Wd = max(ww, 120) + 24
    mark_scale = 1.15
    my = 8
    ty = my + 116 * mark_scale + 20 - top
    return svg(Wd, ty + bot + 12, f'<g transform="translate({Wd/2 - 60*mark_scale:.2f},{my}) scale({mark_scale})">{mark(theme)}</g>\n<g transform="translate({(Wd-ww)/2:.2f},{ty:.2f})">{el}</g>', 'AIOえらばれ帳')

def mark_file(theme='color', small=False):
    return svg(120, 120, mark(theme, small), 'AIOえらばれ帳のマーク')

def app_icon():
    # 生成りの台に、マーク（ホーム画面・ブラウザのタブ）
    return svg(120, 120, f'<rect width="120" height="120" rx="26" fill="{C["paper"]}"/><g transform="translate(12,10) scale(0.8)">{mark()}</g>', 'AIOえらばれ帳')

def favicon():
    return svg(120, 120, f'<rect width="120" height="120" rx="22" fill="{C["paper"]}"/><g transform="translate(6,3) scale(0.95)">{mark(small=True)}</g>', 'AIOえらばれ帳')

if __name__ == '__main__':
    files = {
        'logo-mark.svg': mark_file(), 'favicon-16.svg': mark_file(small=True),
        'logo-mark-white.svg': mark_file('white'), 'logo-mark-ink.svg': mark_file('ink'),
        'logo-horizontal.svg': horizontal()[0], 'logo-horizontal-reverse.svg': horizontal('reverse')[0],
        'logo-horizontal-white.svg': horizontal('white')[0], 'logo-horizontal-ink.svg': horizontal('ink')[0],
        'logo-vertical.svg': vertical(), 'logo-vertical-white.svg': vertical('white'),
        'app-icon.svg': app_icon(), 'favicon.svg': favicon(),
    }
    for n, s in files.items():
        open(os.path.join(OUT, n), 'w').write(s)
    print('ok', round(horizontal()[1]))

def og():
    Wd, Hd = 1200, 630
    logo, lw = horizontal()
    inner = logo.split('</title>', 1)[1].rsplit('</svg>', 1)[0]
    sc = 1.25
    d1, w1, _ = glyphs('現場の話を、選ばれる理由に。', 'zk900.ttf', 64, kern=None, tracking=0)
    d2, w2, _ = glyphs('町工場の仕事を聞きとり、AIにも人にも伝わる記事にする。', 'zk700.ttf', 28, tracking=20)
    body = f'''<rect width="{Wd}" height="{Hd}" fill="{C['paper']}"/>
<rect x="28" y="28" width="{Wd-56}" height="{Hd-56}" fill="none" stroke="{C['sumi']}" stroke-width="2"/>
<g transform="translate(96,92) scale({sc})">{inner}</g>
<rect x="96" y="268" width="80" height="6" fill="{C['brass']}"/>
<path fill="{C['sumi']}" transform="translate(96,382)" d="{d1}"/>
<path fill="{C['sumi']}" opacity=".8" transform="translate(96,450)" d="{d2}"/>
<line x1="28" y1="520" x2="{Wd-28}" y2="520" stroke="{C['sumi']}" stroke-width="1"/>
<path fill="{C['sumi']}" transform="translate(96,568)" d="{glyphs('aio-erabare.jp', 'barlow600.ttf', 26, use_palt=False)[0]}"/>
<path fill="{C['sumi']}" transform="translate({Wd-96-glyphs('運営　株式会社コタム', 'zk700.ttf', 22)[1]:.1f},566)" d="{glyphs('運営　株式会社コタム', 'zk700.ttf', 22)[0]}"/>'''
    return svg(Wd, Hd, body, 'AIOえらばれ帳')

if __name__ == '__main__':
    open(os.path.join(OUT, 'og.svg'), 'w').write(og())
