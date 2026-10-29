#!/usr/bin/env python3
"""Create transparent Flexo AI launcher assets without modifying app routes or content."""
import base64
import re
from collections import deque
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "app/src/main/assets/index.html"
source = HTML.read_text(encoding="utf-8")
match = re.search(r'var ICON="data:image/png;base64,([A-Za-z0-9+/=]+)"', source)
if not match:
    raise SystemExit("Original Flexo icon data URL not found")

original = Image.open(BytesIO(base64.b64decode(match.group(1)))).convert("RGBA")
im = original.copy()
px = im.load()
w, h = im.size
corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
bg = tuple(sum(c[i] for c in corners) // 4 for i in range(3))

# Remove only neutral, grey background pixels connected to the outer edge.
# Do not run a global colour-removal pass: that can erase the logo's white/cream details.
def is_background(x, y):
    r, g, b, a = px[x, y]
    if a == 0:
        return True
    chroma = max(r, g, b) - min(r, g, b)
    luminance = (r + g + b) / 3
    distance = sum((v - bg[i]) ** 2 for i, v in enumerate((r, g, b))) ** 0.5
    return chroma <= 32 and 35 <= luminance <= 190 and distance <= 58

seen = bytearray(w * h)
queue = deque()
for x in range(w):
    queue.append((x, 0))
    queue.append((x, h - 1))
for y in range(h):
    queue.append((0, y))
    queue.append((w - 1, y))

while queue:
    x, y = queue.popleft()
    index = y * w + x
    if seen[index] or not is_background(x, y):
        continue
    seen[index] = 1
    r, g, b, _ = px[x, y]
    px[x, y] = (r, g, b, 0)
    if x > 0:
        queue.append((x - 1, y))
    if x + 1 < w:
        queue.append((x + 1, y))
    if y > 0:
        queue.append((x, y - 1))
    if y + 1 < h:
        queue.append((x, y + 1))

# Crop transparent margins so the symbol fills its icon area consistently.
bbox = im.getbbox()
if bbox is None:
    raise SystemExit("Logo became fully transparent; refusing to generate a broken icon")
im = im.crop(bbox)

out = ROOT / "app/src/main/res"
(out / "drawable-nodpi").mkdir(parents=True, exist_ok=True)
# Keep the symbol centered, with safe padding for Android's launcher masks.
canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
im.thumbnail((410, 410), Image.Resampling.LANCZOS)
canvas.alpha_composite(im, ((512 - im.width) // 2, (512 - im.height) // 2))
canvas.save(out / "drawable-nodpi/flexo_logo.png", optimize=True)

for density, size in {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}.items():
    folder = out / ("mipmap-" + density)
    folder.mkdir(parents=True, exist_ok=True)
    canvas.resize((size, size), Image.Resampling.LANCZOS).save(folder / "ic_launcher.png", optimize=True)

adaptive = out / "mipmap-anydpi-v26"
adaptive.mkdir(parents=True, exist_ok=True)
(adaptive / "ic_launcher.xml").write_text(
    '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
    '    <background android:drawable="@android:color/transparent"/>\n'
    '    <foreground android:drawable="@drawable/flexo_logo"/>\n'
    '</adaptive-icon>\n',
    encoding="utf-8",
)

# Keep the app's existing ICON data URL functional, but replace it with the cleaned,
# padded icon only. No routes, links, or other app data are rewritten.
buffer = BytesIO()
canvas.save(buffer, format="PNG", optimize=True)
encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
HTML.write_text(source[:match.start(1)] + encoded + source[match.end(1):], encoding="utf-8")
print(f"Transparent Flexo icon generated from {original.size}; cropped to {im.size} and padded to 512x512.")
