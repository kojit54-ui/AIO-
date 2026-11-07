# テキストをフォントの輪郭（path）に変える。palt（約物・かなの詰め）を使って字間を整える
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

FONTS = {}
def font(path):
    if path not in FONTS:
        FONTS[path] = TTFont(path)
    return FONTS[path]

def palt_map(f):
    """GPOS の palt から、グリフ名 -> (xPlacement, xAdvance) を作る"""
    m = {}
    if 'GPOS' not in f: return m
    gpos = f['GPOS'].table
    lookups = set()
    for fr in gpos.FeatureList.FeatureRecord:
        if fr.FeatureTag == 'palt':
            lookups.update(fr.Feature.LookupListIndex)
    for li in lookups:
        lk = gpos.LookupList.Lookup[li]
        for st in lk.SubTable:
            if lk.LookupType == 9: st = st.ExtSubTable
            if getattr(st, 'LookupType', lk.LookupType) != 1 and lk.LookupType not in (1,9): continue
            cov = st.Coverage.glyphs
            if st.Format == 1:
                for g in cov: m[g] = (getattr(st.Value,'XPlacement',0) or 0, getattr(st.Value,'XAdvance',0) or 0)
            else:
                for g, v in zip(cov, st.Value): m[g] = (getattr(v,'XPlacement',0) or 0, getattr(v,'XAdvance',0) or 0)
    return m

def text_path(text, fontpath, size, x=0, y=0, tracking=0, use_palt=True):
    """返り値: (d, width)。y はベースライン。size はpx、tracking は em の1000分率"""
    f = font(fontpath)
    upm = f['head'].unitsPerEm
    s = size / upm
    gs = f.getGlyphSet(); cmap = f.getBestCmap(); hmtx = f['hmtx']
    pm = palt_map(f) if use_palt else {}
    pen = SVGPathPen(gs, ntos=lambda v: ('%.2f' % v).rstrip('0').rstrip('.'))
    cx = 0
    for i, ch in enumerate(text):
        g = cmap[ord(ch)]
        xp, xa = pm.get(g, (0, 0))
        tp = TransformPen(pen, (s, 0, 0, -s, x + (cx + xp) * s, y))
        gs[g].draw(tp)
        cx += hmtx[g][0] + xa + (tracking if i < len(text) - 1 else 0)
    return pen.getCommands(), cx * s
