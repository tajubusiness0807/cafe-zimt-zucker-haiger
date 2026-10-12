# Café Zimt & Zucker – Website

Statischer Onepager für das Café Zimt & Zucker, Mühlenstraße 4, 35708 Haiger.

- **Inhalte bearbeiten:** `content.json` ändern, dann `node build.mjs` ausführen. Das erzeugt `index.html`, `robots.txt` und `sitemap.xml`.
- **Gestaltung/Verhalten:** `src/site.css` und `src/site.js` (beide werden beim Build in `index.html` eingebettet).
- **Bilder:** `assets/img/` – digitale Illustrationen (Shader-gerendert), WebP mit Alphakanal; `og.jpg` für Social Previews.
- **Schriften:** Fraunces und Instrument Sans, lokal eingebunden (SIL OFL, Lizenzen in `assets/fonts/`).
- **Kein Tracking, keine Cookies, keine externen Requests** beim Seitenaufruf.

## Veröffentlichen mit GitHub Pages

1. Repository in `cafe-zimt-zucker-haiger` umbenennen (Settings → General), damit die Adresse `https://tajubusiness0807.github.io/cafe-zimt-zucker-haiger/` lautet. Andernfalls `site.url` in `content.json` anpassen und neu bauen.
2. Settings → Pages → Source: „Deploy from a branch“ → Branch mit dieser Seite, Ordner `/ (root)`.

Vor dem Livegang: siehe [OFFENE-PUNKTE.md](OFFENE-PUNKTE.md).
