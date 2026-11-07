import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from text import text_path
F = os.path.join(os.path.dirname(__file__), '..', 'font')
W900 = os.path.join(F, 'zm900.ttf'); W700 = os.path.join(F, 'zm700.ttf')
OUT = sys.argv[1] if len(sys.argv) > 1 else 'out'
os.makedirs(OUT, exist_ok=True)

C = dict(brand='#2f6fdb', dark='#2258b8', sun='#ffc93c', sunDark='#e0a800', ink='#1f2b3d', sky='#9bd3ff', paper='#ffffff', muted='#55637a')

def sparkle(cx, cy, r, k=0.22):
    """4つの角を持つ、ふっくらした星（AIのきらめき）"""
    i = r * k
    return (f"M{cx},{cy-r} C{cx+i*0.6},{cy-i*1.6} {cx+i*1.6},{cy-i*0.6} {cx+r},{cy} "
            f"C{cx+i*1.6},{cy+i*0.6} {cx+i*0.6},{cy+i*1.6} {cx},{cy+r} "
            f"C{cx-i*0.6},{cy+i*1.6} {cx-i*1.6},{cy+i*0.6} {cx-r},{cy} "
            f"C{cx-i*1.6},{cy-i*0.6} {cx-i*0.6},{cy-i*1.6} {cx},{cy-r} Z")

def mark(c=C, mono=None):
    """マーク（120x120）。帳面（青）＋しおり（黄）＋AIのきらめき（白）。
    mono='white' / 'ink' で1色版"""
    if mono:
        fg = '#ffffff' if mono == 'white' else c['ink']
        mid = 'aioMono' + mono
        # 1色版：表紙は塗り、きらめきは抜き、しおりは表紙とのあいだにすきまを空けて見せる
        return f'''<g>
  <defs><mask id="{mid}" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
    <rect width="120" height="120" fill="#fff"/>
    <path d="M78 6 H92 A2 2 0 0 1 94 8 V44 L85 37 L76 44 V8 A2 2 0 0 1 78 6 Z" fill="none" stroke="#000" stroke-width="7" stroke-linejoin="round"/>
    <path d="{sparkle(60, 68, 25)} {sparkle(84, 91, 8)}" fill="#000"/>
  </mask></defs>
  <rect x="14" y="14" width="88" height="98" rx="16" fill="{fg}" mask="url(#{mid})"/>
  <path d="M78 6 H92 A2 2 0 0 1 94 8 V44 L85 37 L76 44 V8 A2 2 0 0 1 78 6 Z" fill="{fg}"/>
</g>'''
    return f'''<g>
  <rect x="20" y="18" width="90" height="94" rx="16" fill="{c['sky']}"/>
  <rect x="24" y="16" width="84" height="92" rx="14" fill="#ffffff"/>
  <rect x="14" y="14" width="88" height="98" rx="16" fill="{c['brand']}"/>
  <path d="M30 14 H34 V112 H30 A16 16 0 0 1 14 96 V30 A16 16 0 0 1 30 14 Z" fill="{c['dark']}"/>
  <path d="M78 6 H92 A2 2 0 0 1 94 8 V44 L85 37 L76 44 V8 A2 2 0 0 1 78 6 Z" fill="{c['sun']}"/>
  <path fill="#ffffff" d="{sparkle(60, 68, 25)}"/>
  <path fill="{c['sun']}" d="{sparkle(84, 91, 8)}"/>
</g>'''

def svg(w, h, body, title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" width="{w:.0f}" height="{h:.0f}" role="img" aria-label="{title}"><title>{title}</title>\n{body}\n</svg>\n'

def words(x, y, size, ink, accent, tag_color, tagline=True, align='left', total_w=None):
    """「AI時代の、」＋「AIOえらばれ帳」。y は名前のベースライン"""
    aio_d, aio_w = text_path('AIO', W900, size, 0, 0, tracking=10)
    gap = size * 0.06
    rest_d, rest_w = text_path('えらばれ帳', W900, size, 0, 0, tracking=0)
    name_w = aio_w + gap + rest_w
    tsize = size * 0.36
    tag_d, tag_w = text_path('AI時代の、', W700, tsize, 0, 0, tracking=60)
    ox = x if align == 'left' else x - name_w / 2
    tx = ox if align == 'left' else x - tag_w / 2
    out = []
    if tagline:
        out.append(f'<path fill="{tag_color}" transform="translate({tx:.2f},{y - size*0.98:.2f})" d="{text_path("AI時代の、", W700, tsize, 0, 0, tracking=60)[0]}"/>')
    out.append(f'<path fill="{accent}" transform="translate({ox:.2f},{y:.2f})" d="{aio_d}"/>')
    out.append(f'<path fill="{ink}" transform="translate({ox + aio_w + gap:.2f},{y:.2f})" d="{rest_d}"/>')
    return '\n'.join(out), name_w

def horizontal(theme='color'):
    ink, accent, tag = C['ink'], C['brand'], C['muted']
    m = mark()
    if theme == 'white': ink, accent, tag = '#ffffff', '#ffffff', '#ffffffcc'; m = mark(mono='white')
    if theme == 'reverse': ink, accent, tag = '#ffffff', C['sun'], '#ffffffd9'
    if theme == 'ink': ink, accent, tag = C['ink'], C['ink'], C['ink']; m = mark(mono='ink')
    size = 64
    w_body, name_w = words(148, 96, size, ink, accent, tag)
    W = 148 + name_w + 8
    return svg(W, 120, f'{m}\n{w_body}', 'AIOえらばれ帳'), W

def vertical(theme='color'):
    ink, accent, tag = C['ink'], C['brand'], C['muted']
    m = mark()
    if theme == 'white': ink, accent, tag = '#ffffff', '#ffffff', '#ffffffcc'; m = mark(mono='white')
    if theme == 'ink': ink, accent, tag = C['ink'], C['ink'], C['ink']; m = mark(mono='ink')
    size = 56
    _, name_w = words(0, 0, size, ink, accent, tag, tagline=False)
    W = max(name_w, 200) + 16
    body, _ = words(W/2, 222, size, ink, accent, tag, align='center')
    return svg(W, 240, f'<g transform="translate({W/2-66:.2f},0) scale(1.1)">{m}</g>\n{body}', 'AIOえらばれ帳')

def mark_file(theme='color'):
    m = mark() if theme == 'color' else mark(mono=theme)
    return svg(120, 120, m, 'AIOえらばれ帳のマーク')

def app_icon():
    # 角丸の白い台の上にマーク（アプリ・ファビコン用）
    return svg(120, 120, f'<rect width="120" height="120" rx="26" fill="#f2f8ff"/><g transform="translate(9,9) scale(0.85)">{mark()}</g>', 'AIOえらばれ帳')

files = {
  'logo-mark.svg': mark_file(), 'logo-mark-white.svg': mark_file('white'), 'logo-mark-ink.svg': mark_file('ink'),
  'logo-horizontal.svg': horizontal()[0], 'logo-horizontal-reverse.svg': horizontal('reverse')[0],
  'logo-horizontal-white.svg': horizontal('white')[0], 'logo-horizontal-ink.svg': horizontal('ink')[0],
  'logo-vertical.svg': vertical(), 'logo-vertical-white.svg': vertical('white'),
  'app-icon.svg': app_icon(),
}
for n, s in files.items():
    open(os.path.join(OUT, n), 'w').write(s)
print('wrote', len(files), 'width', horizontal()[1])

# --- SNSで共有されたときの絵（1200x630） ---
def og():
    W, H = 1200, 630
    logo, lw = horizontal()
    inner = logo.split('\n', 1)[1].rsplit('</svg>', 1)[0].split('</title>', 1)[-1]
    sc = 1.15
    lx = (W - lw * sc) / 2
    p1, w1 = text_path('AIに選ばれて、', W900, 46, 0, 0, tracking=20)
    p2, w2 = text_path('これから出会うお客様に選ばれる会社へ。', W900, 46, 0, 0, tracking=20)
    p3, w3 = text_path('ものづくりの会社のための、AIO記事づくり', W700, 26, 0, 0, tracking=60)
    body = f'''<rect width="{W}" height="{H}" fill="#f2f8ff"/>
<circle cx="80" cy="70" r="190" fill="#e2efff"/><circle cx="1140" cy="600" r="230" fill="#e2efff"/>
<circle cx="1110" cy="90" r="70" fill="#fff4d1"/>
<path fill="#ffc93c" d="{sparkle(1040, 520, 22)}"/><path fill="#9bd3ff" d="{sparkle(150, 520, 14)}"/><path fill="#ffc93c" d="{sparkle(200, 470, 8)}"/>
<g transform="translate({lx:.1f},70) scale({sc})">{inner}</g>
<path fill="#1f2b3d" transform="translate({(W-w1)/2:.1f},{330})" d="{p1}"/>
<path fill="#1f2b3d" transform="translate({(W-w2)/2:.1f},{400})" d="{p2}"/>
<rect x="{(W-w3)/2-28:.1f}" y="452" width="{w3+56:.1f}" height="54" rx="27" fill="#2f6fdb"/>
<path fill="#ffffff" transform="translate({(W-w3)/2:.1f},{489})" d="{p3}"/>'''
    return svg(W, H, body, 'AIOえらばれ帳')
open(os.path.join(OUT, 'og.svg'), 'w').write(og())
