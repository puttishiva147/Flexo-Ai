#!/usr/bin/env python3
"""Generate Android launcher raster sizes from the official Flexo SVG icon.

The in-app WebView uses flexo-icon.svg and flexo-wordmark.svg directly.
Only Android launcher compatibility assets are rasterized from the same SVG source.
"""
from io import BytesIO
from pathlib import Path

import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "app/src/main/assets"
ICON_SVG = ASSETS / "flexo-icon.svg"

if not ICON_SVG.is_file():
    raise SystemExit(f"Missing official vector icon: {ICON_SVG}")

# Render the SVG at high resolution, preserving its transparency and artwork.
png_bytes = cairosvg.svg2png(url=str(ICON_SVG), output_width=512, output_height=512)
logo = Image.open(BytesIO(png_bytes)).convert("RGBA")

# Center the original aspect ratio inside a transparent square; do not crop or recolour it.
logo.thumbnail((410, 410), Image.Resampling.LANCZOS)
canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
canvas.alpha_composite(logo, ((512 - logo.width) // 2, (512 - logo.height) // 2))

out = ROOT / "app/src/main/res"
(out / "drawable-nodpi").mkdir(parents=True, exist_ok=True)
canvas.save(out / "drawable-nodpi/flexo_logo.png", optimize=True)

for density, size in {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}.items():
    folder = out / ("mipmap-" + density)
    folder.mkdir(parents=True, exist_ok=True)
    canvas.resize((size, size), Image.Resampling.LANCZOS).save(folder / "ic_launcher.png", optimize=True)

adaptive = out / "mipmap-anydpi-v26"
adaptive.mkdir(parents=True, exist_ok=True)
(adaptive / "ic_launcher.xml").write_text(
    '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\\n'
    '    <background android:drawable="@android:color/transparent"/>\\n'
    '    <foreground android:drawable="@drawable/flexo_logo"/>\\n'
    '</adaptive-icon>\\n',
    encoding="utf-8",
)
print("Generated Android launcher compatibility PNGs from flexo-icon.svg; app UI continues to use SVG directly.")
