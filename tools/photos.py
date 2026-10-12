"""Bereitet Café-Fotos für die Galerie vor.

Aufruf: python3 tools/photos.py BILD1.jpg BILD2.jpg ...
Erzeugt assets/photos/<name>-{480,800,1200}.webp (ohne EXIF/GPS-Daten)
und trägt die Bilder in content.json → "galerie" ein (alt-Text danach anpassen).
Anschließend: node build.mjs
"""
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "photos"
SIZES = (480, 800, 1200)


def slug(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s or "foto"


def main(paths):
    OUT.mkdir(parents=True, exist_ok=True)
    content_path = ROOT / "content.json"
    content = json.loads(content_path.read_text(encoding="utf-8"))
    galerie = content.setdefault("galerie", [])
    known = {g["datei"] for g in galerie}

    for p in map(Path, paths):
        im = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
        name = slug(p.stem)
        for w in SIZES:
            scaled = im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
            scaled.save(OUT / f"{name}-{w}.webp", quality=80, method=6)
        w = min(im.width, SIZES[-1])
        h = round(im.height * w / im.width)
        datei = f"assets/photos/{name}"
        if datei not in known:
            galerie.append({"datei": datei, "breite": w, "hoehe": h, "alt": "Foto aus dem Café Zimt & Zucker"})
            known.add(datei)
        print(f"{p.name} -> {datei}-*.webp ({w}x{h})")

    content_path.write_text(json.dumps(content, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1:])
