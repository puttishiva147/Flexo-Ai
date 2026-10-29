#!/usr/bin/env python3
import base64, re
from collections import deque
from io import BytesIO
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "app/src/main/assets/index.html"
text = HTML.read_text(encoding="utf-8")
match = re.search(r'var ICON="data:image/png;base64,([A-Za-z0-9+/=]+)"', text)
if not match:
    raise SystemExit("Original Flexo icon data URL not found")
im = Image.open(BytesIO(base64.b64decode(match.group(1)))).convert("RGBA")
px = im.load(); w,h = im.size
corners=[px[0,0],px[w-1,0],px[0,h-1],px[w-1,h-1]]
bg=tuple(sum(c[i] for c in corners)//4 for i in range(3))
def is_bg(x,y):
    r,g,b,a=px[x,y]
    if a==0:return True
    chroma=max(r,g,b)-min(r,g,b); lum=(r+g+b)/3
    dist=((r-bg[0])**2+(g-bg[1])**2+(b-bg[2])**2)**0.5
    return chroma<34 and 42<lum<190 and dist<62
seen=bytearray(w*h); q=deque()
for x in range(w): q.append((x,0));q.append((x,h-1))
for y in range(h): q.append((0,y));q.append((w-1,y))
while q:
    x,y=q.popleft(); i=y*w+x
    if seen[i] or not is_bg(x,y):continue
    seen[i]=1;r,g,b,a=px[x,y];px[x,y]=(r,g,b,0)
    if x:q.append((x-1,y))
    if x+1<w:q.append((x+1,y))
    if y:q.append((x,y-1))
    if y+1<h:q.append((x,y+1))
for y in range(h):
    for x in range(w):
        r,g,b,a=px[x,y]
        if a and max(r,g,b)-min(r,g,b)<24:
            dist=((r-bg[0])**2+(g-bg[1])**2+(b-bg[2])**2)**0.5
            if dist<34 and 50<(r+g+b)/3<180:px[x,y]=(r,g,b,0)
out=ROOT/"app/src/main/res"
(out/"drawable-nodpi").mkdir(parents=True,exist_ok=True)
im.save(out/"drawable-nodpi/flexo_logo.png",optimize=True)
square=Image.new("RGBA",(512,512),(0,0,0,0))
im.thumbnail((472,472),Image.Resampling.LANCZOS)
square.alpha_composite(im,((512-im.width)//2,(512-im.height)//2))
for density,size in {"mdpi":48,"hdpi":72,"xhdpi":96,"xxhdpi":144,"xxxhdpi":192}.items():
    folder=out/("mipmap-"+density);folder.mkdir(parents=True,exist_ok=True)
    square.resize((size,size),Image.Resampling.LANCZOS).save(folder/"ic_launcher.png",optimize=True)
adaptive=out/"mipmap-anydpi-v26";adaptive.mkdir(parents=True,exist_ok=True)
(adaptive/"ic_launcher.xml").write_text('<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n    <background android:drawable="@android:color/transparent"/>\n    <foreground android:drawable="@drawable/flexo_logo"/>\n</adaptive-icon>\n',encoding="utf-8")
buf=BytesIO();square.save(buf,format="PNG",optimize=True)
b64=base64.b64encode(buf.getvalue()).decode("ascii")
HTML.write_text(text[:match.start(1)]+b64+text[match.end(1):],encoding="utf-8")
print("Transparent original Flexo logo assets generated.")
