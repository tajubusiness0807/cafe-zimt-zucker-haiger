// Erzeugt index.html, sitemap.xml und robots.txt aus content.json.
// Aufruf: node build.mjs
import fs from 'node:fs';

const c = JSON.parse(fs.readFileSync(new URL('./content.json', import.meta.url), 'utf8'));
const css = fs.readFileSync(new URL('./src/site.css', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('./src/site.js', import.meta.url), 'utf8');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const minCss = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').replace(/\s*([{};:,>])\s*/g, '$1').replace(/;}/g, '}');
const amp = (s) => esc(s).replace(/ &amp; /g, ' <span class="amp">&amp;</span> ');

const site = c.site.url.replace(/\/?$/, '/');
const a = c.adresse;
const addrLine = `${a.strasse}, ${a.plz} ${a.ort}`;
const mapsDir = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${c.name}, ${addrLine}`)}`;
const mapsPlace = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.name}, ${addrLine}`)}`;
const title = `${c.name} | ${c.ort}`;
const description = `${c.name} in der ${a.strasse} in ${a.ort}: Torten, Kuchen, Waffeln und Cappuccino, dazu Frühstück und Mittagessen. Gemütliches kleines Café – vor Ort, zum Mitnehmen oder per Lieferdienst.`;

/* ---------- icons ---------- */
const STAR = 'M50 14 L60.9 39 L88 41.6 L67.6 59.7 L73.5 86.4 L50 72.5 L26.5 86.4 L32.4 59.7 L12 41.6 L39.1 39Z';
const ico = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 6.9 6.9l1.3-2 4 1.6V19a1.8 1.8 0 0 1-1.9 1.8A16 16 0 0 1 3.2 5.9 1.8 1.8 0 0 1 5 4z"/></svg>',
  route: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  arrow: '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>',
  star: `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${STAR}" fill="currentColor" stroke="currentColor" stroke-width="8" stroke-linejoin="round"/></svg>`,
  heart: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20.3 4.7 13a4.6 4.6 0 0 1 6.5-6.5l.8.8.8-.8a4.6 4.6 0 0 1 6.5 6.5z"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
  bike: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="16.5" r="3.5"/><circle cx="18" cy="16.5" r="3.5"/><path d="M6 16.5 9.5 9h6l2.5 7.5M9.5 9 8.5 6.5H6.5M12.5 16.5 15.5 9"/></svg>',
  chair: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3v10h10M7 13l-1 8M17 13l1 8M7 9h8"/></svg>',
};
const menuIco = {
  torten: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 26h22M6 26V15l20-6v17"/><path d="M6 15h20M6 20.5h20"/><path d="M19 7.5c0-1.6 1.3-2.5 2.5-2.5"/><circle cx="21.5" cy="4.6" r="1.2" fill="currentColor"/></svg>',
  waffeln: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 27 5.6 16.6a6 6 0 0 1 8.5-8.5L16 10l1.9-1.9a6 6 0 0 1 8.5 8.5z"/><path d="M9 12.5l11 11M13 9l10 10M23 9 12 20M27 13l-11 11M9 19l6-6" opacity=".55"/></svg>',
  kaffee: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 13h16v6a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7z"/><path d="M22 15h1.5a3 3 0 0 1 0 6H21"/><path d="M4 28h20"/><path d="M11 9c0-1.5 1.5-1.5 1.5-3S11 4.5 11 3M16 9c0-1.5 1.5-1.5 1.5-3S16 4.5 16 3"/></svg>',
  fruehstueck: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 22c-3-3.5-2-10 3.5-12.5 3-1.4 5-.5 7.5-1.5 4-1.6 8 1.8 7.5 6.5-.4 3.5-3.5 4.5-4 7.5-.6 3.6-4.5 5.5-8 4.5-2.7-.8-4.4-2.2-6.5-4.5z"/><circle cx="16" cy="17" r="3.6"/></svg>',
  mittag: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 16h24a12 10 0 0 1-24 0z"/><path d="M10 26h12"/><path d="M12 12c0-1.5 1.5-1.5 1.5-3S12 7.5 12 6M18 12c0-1.5 1.5-1.5 1.5-3S18 7.5 18 6"/></svg>',
};
const merkmalIco = { 'Von Frauen geführt': ico.heart, 'Vor Ort genießen': ico.chair, 'Zum Mitnehmen': ico.bag, 'Lieferdienst': ico.bike };

const logo = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" fill="#b4592d"/><path d="${STAR}" transform="translate(50 52) scale(.62) translate(-50 -50)" fill="#fffaf3" stroke="#fffaf3" stroke-width="9" stroke-linejoin="round"/><circle cx="74" cy="26" r="4.2" fill="#fffaf3" opacity=".9"/></svg>`;

/* ---------- sections ---------- */
const hoursRows = c.oeffnungszeiten.tage.map((t) =>
  `<tr data-day="${t.kurz}"${t.zeit ? '' : ' class="closed"'}><th scope="row">${t.tag}</th><td>${t.zeit ? `<time>${t.zeit.replace('–', '</time>–<time>')}</time> Uhr` : 'Ruhetag'}</td></tr>`
).join('');

const heroHours = 'Mi–Fr 12:00–17:30 · Sa & So 09:30–17:30';

const [feature, ...rest] = (() => {
  const items = c.angebot.filter((x) => x.status !== 'zu bestätigen');
  const w = items.find((x) => x.id === 'waffeln');
  return [w, ...items.filter((x) => x !== w)];
})();

const cards = rest.map((x, i) => `
        <article class="card${rest.length === 4 && i >= 2 ? ' card--half' : ''} reveal" data-delay="${(i % 3) + 1}">
          <div class="ico">${menuIco[x.id] || ''}</div>
          <h3>${amp(x.titel)}</h3>
          <p>${esc(x.text)}</p>
        </article>`).join('');

const quotes = c.rezensionen.slice(0, 3).map((r, i) => `
        <li class="reveal" data-delay="${i + 1}"><figure class="quote">
          <blockquote><p style="margin:0">${esc(r.text)}</p></blockquote>
          <figcaption>${esc(r.quelle)}</figcaption>
        </figure></li>`).join('');

const chips = c.merkmale.map((m) => `<li>${merkmalIco[m] || ''}${esc(m)}</li>`).join('');

const jsonld = {
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  name: c.name,
  url: site,
  image: site + 'assets/img/og.jpg',
  telephone: c.telefon.international,
  address: { '@type': 'PostalAddress', streetAddress: a.strasse, postalCode: a.plz, addressLocality: a.ort, addressRegion: a.region, addressCountry: a.land },
  geo: { '@type': 'GeoCoordinates', latitude: a.geo.lat, longitude: a.geo.lng },
  hasMap: mapsPlace,
  servesCuisine: ['Kaffee', 'Kuchen', 'Torten', 'Waffeln'],
};

const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${c.site.indexierbar ? '<meta name="robots" content="index, follow, max-image-preview:large">' : '<meta name="robots" content="noindex, follow">'}
<link rel="canonical" href="${site}">
<meta name="theme-color" content="#1c110c">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="${esc(c.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="Torten, Kuchen, Waffeln & Cappuccino in der ${esc(a.strasse)}, ${esc(a.ort)}.">
<meta property="og:url" content="${site}">
<meta property="og:image" content="${site}assets/img/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Cappuccino mit Zimtstern auf einem dunklen Holztisch – ${esc(c.name)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="geo.region" content="DE-HE">
<meta name="geo.placename" content="${esc(a.ort)}">
<meta name="geo.position" content="${a.geo.lat};${a.geo.lng}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<link rel="preload" href="assets/fonts/fraunces-opsz.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/instrument-sans.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" as="image" href="assets/img/cup.webp" imagesrcset="assets/img/cup-sm.webp 563w, assets/img/cup.webp 1126w" imagesizes="(max-width: 820px) min(108vw, 560px), 62vw" fetchpriority="high">
<link rel="preload" as="image" href="assets/img/table-1600.webp" imagesrcset="assets/img/table-960.webp 960w, assets/img/table-1600.webp 1600w, assets/img/table-2560.webp 2560w" imagesizes="108vw">
<script>document.documentElement.classList.add('js')</script>
<style>${minCss(css)}</style>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<a class="skip" href="#inhalt">Zum Inhalt springen</a>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="blur" filterUnits="userSpaceOnUse" x="-60" y="-60" width="320" height="320"><feGaussianBlur stdDeviation="7"/></filter></svg>

<header class="site-header">
  <div class="wrap">
    <a class="brand" href="#top" aria-label="${esc(c.name)} – zum Seitenanfang">${logo}<span>Zimt <em>&amp;</em> Zucker</span></a>
    <nav class="nav" aria-label="Hauptnavigation">
      <a href="#cafe">Das Café</a>
      <a href="#angebot">Angebot</a>
      <a href="#stimmen">Stimmen</a>
      <a href="#besuch">Besuch</a>
      <a class="btn" href="${c.telefon.link}">${ico.phone}<span>Anrufen</span></a>
    </nav>
  </div>
</header>

<main id="inhalt">
  <section class="hero" id="top" aria-labelledby="hero-title">
    <div class="hero__layer hero__table" data-depth="0.42">
      <img src="assets/img/table-1600.webp" srcset="assets/img/table-960.webp 960w, assets/img/table-1600.webp 1600w, assets/img/table-2560.webp 2560w" sizes="108vw" width="2560" height="1440" alt="">
    </div>
    <div class="hero__layer hero__props" data-depth="0.3">
      <img class="prop prop--sticks" src="assets/img/sticks.webp" srcset="assets/img/sticks-sm.webp 345w, assets/img/sticks.webp 690w" sizes="(max-width: 820px) 42vw, 22vw" width="690" height="356" alt="" decoding="async">
      <img class="prop prop--anise" src="assets/img/anise.webp" srcset="assets/img/anise-sm.webp 278w, assets/img/anise.webp 556w" sizes="(max-width: 820px) 24vw, 13vw" width="556" height="557" alt="" decoding="async">
      <img class="prop prop--cubes" src="assets/img/cubes.webp" srcset="assets/img/cubes-sm.webp 311w, assets/img/cubes.webp 623w" sizes="14vw" width="623" height="455" alt="" decoding="async">
    </div>
    <div class="hero__layer hero__cupwrap" data-depth="0.18">
      <img class="prop prop--cup" src="assets/img/cup.webp" srcset="assets/img/cup-sm.webp 563w, assets/img/cup.webp 1126w" sizes="(max-width: 820px) min(108vw, 560px), 62vw" width="1126" height="1126" alt="Cappuccino mit Zimtstern aus Zimtpulver auf einer Untertasse" fetchpriority="high">
      <svg class="steam" viewBox="0 0 200 200" aria-hidden="true">
        <g><path d="M100 190c-14-22 16-34 2-58s14-36 0-62"/>
        <path d="M84 190c-12-20 12-30 0-52s10-30-2-52"/>
        <path d="M116 190c-10-24 14-30 4-54s12-32 2-56"/></g>
      </svg>
    </div>
    <div class="hero__shade"></div>
    <div class="hero__layer hero__front" data-depth="-0.12" aria-hidden="true">
      <span class="mote" style="width:22px;height:22px;left:58%;top:18%;filter:blur(2px)"></span>
      <span class="mote" style="width:40px;height:40px;left:88%;top:72%;filter:blur(5px);animation-delay:-4s"></span>
      <span class="mote" style="width:14px;height:14px;left:46%;top:64%;filter:blur(1px);animation-delay:-8s"></span>
      <span class="mote" style="width:30px;height:30px;left:72%;top:8%;filter:blur(4px);animation-delay:-2s"></span>
    </div>

    <div class="wrap hero__content">
      <span class="eyebrow reveal">${ico.star}Café in ${esc(a.ort)}</span>
      <h1 id="hero-title" class="reveal" data-delay="1"><span class="cafe">Café</span>Zimt <span class="amp">&amp;</span> Zucker</h1>
      <p class="lede reveal" data-delay="2">Torten, Waffeln und Cappuccino – ein gemütliches kleines Café in der ${esc(a.strasse)}.</p>
      <div class="hero__actions reveal" data-delay="3">
        <a class="btn" href="${mapsDir}" target="_blank" rel="noopener">${ico.route}<span>Route planen</span></a>
        <a class="btn btn--ghost" href="${c.telefon.link}">${ico.phone}<span>${esc(c.telefon.anzeige)}</span></a>
      </div>
      <div class="hero__meta reveal" data-delay="4">
        <div>${ico.clock}<span><strong>${heroHours}</strong></span></div>
        <div>${ico.route}<span>${esc(addrLine)}</span></div>
      </div>
    </div>
    <a class="scroll-cue" href="#cafe" aria-label="Weiter zum Café"></a>
  </section>

  <section class="section about" id="cafe" aria-labelledby="cafe-title">
    <div class="wrap about__grid">
      <div class="about__text">
        <span class="eyebrow reveal">${ico.star}Das Café</span>
        <h2 id="cafe-title" class="reveal" data-delay="1" style="margin:.5em 0 .6em">Klein, gemütlich – <em>und süß</em> im besten Sinne.</h2>
        <p class="reveal" data-delay="2">Zimt &amp; Zucker ist ein kleines Café in ${esc(a.ort)}: für das Stück Torte am Nachmittag, eine Waffel zum Cappuccino oder eine Mittagspause in Ruhe.</p>
        <p class="reveal" data-delay="2">Gäste beschreiben es als gemütlich und schön – und loben Kuchen, Torten und den freundlichen Service.</p>
        <ul class="chips reveal" data-delay="3" aria-label="Merkmale">${chips}</ul>
      </div>
      <div class="about__art reveal" data-delay="2" aria-hidden="true">
        <div class="ring"></div>
        <div class="disc"></div>
        <img class="a-cup" src="assets/img/cup-sm.webp" width="563" height="563" alt="" loading="lazy" decoding="async" data-depth="0.08">
        <img class="a-anise" src="assets/img/anise-sm.webp" width="278" height="278" alt="" loading="lazy" decoding="async" data-depth="0.35">
        <img class="a-cubes" src="assets/img/cubes-sm.webp" width="311" height="227" alt="" loading="lazy" decoding="async" data-depth="0.5">
        <img class="a-sticks" src="assets/img/sticks-sm.webp" width="345" height="178" alt="" loading="lazy" decoding="async" data-depth="0.25">
      </div>
    </div>
  </section>

  <section class="section menu" id="angebot" aria-labelledby="angebot-title">
    <div class="wrap">
      <div class="section__head">
        <span class="eyebrow reveal">${ico.star}Angebot</span>
        <h2 id="angebot-title" class="reveal" data-delay="1">Was auf den Tisch kommt</h2>
      </div>
      <div class="menu__grid">
        <article class="card card--feature reveal">
          <div>
            <div class="ico">${menuIco.waffeln}</div>
            <h3>${amp(feature.titel)}</h3>
            <p>${esc(feature.text)}</p>
            <span class="badge">Beliebt bei Gästen</span>
          </div>
          <img class="waffle" src="assets/img/waffle-sm.webp" srcset="assets/img/waffle-sm.webp 500w, assets/img/waffle.webp 1000w" sizes="(max-width: 620px) 90vw, 420px" width="1000" height="1000" alt="Herzwaffel mit Puderzucker auf einem Teller" loading="lazy" decoding="async" data-depth="0.12">
        </article>${cards}
      </div>
      <div class="menu__note reveal">
        <p>${esc(c.angebot_hinweis)} Vor Ort, zum Mitnehmen oder per Lieferdienst.</p>
        <a class="btn btn--line" href="${c.telefon.link}">${ico.phone}<span>${esc(c.telefon.anzeige)}</span></a>
      </div>
    </div>
  </section>

  <section class="section reviews" id="stimmen" aria-labelledby="stimmen-title">
    <img class="reviews__deco reviews__deco--a" src="assets/img/anise-sm.webp" width="278" height="278" alt="" loading="lazy" decoding="async" data-depth="0.6">
    <img class="reviews__deco reviews__deco--b" src="assets/img/sticks-sm.webp" width="345" height="178" alt="" loading="lazy" decoding="async" data-depth="0.35">
    <div class="wrap">
      <div class="section__head">
        <span class="eyebrow reveal">${ico.star}Stimmen unserer Gäste</span>
        <h2 id="stimmen-title" class="reveal" data-delay="1">„Ein Gedicht“ – sagen Gäste.</h2>
      </div>
      <ul class="quotes">${quotes}
      </ul>
    </div>
  </section>

  <section class="section visit" id="besuch" aria-labelledby="besuch-title">
    <div class="wrap">
      <div class="section__head">
        <span class="eyebrow reveal">${ico.star}Besuch</span>
        <h2 id="besuch-title" class="reveal" data-delay="1">Auf einen Kaffee vorbeikommen</h2>
      </div>
      <div class="visit__grid">
        <div class="panel reveal" data-delay="1">
          <h3>${ico.clock}Öffnungszeiten</h3>
          <table class="hours"><caption class="sr-only">Öffnungszeiten</caption><tbody>${hoursRows}</tbody></table>
          <small>${esc(c.oeffnungszeiten.hinweis)}</small>
        </div>
        <div class="panel panel--dark reveal" data-delay="2">
          <h3>${ico.route}So finden Sie uns</h3>
          <address class="addr"><a href="${mapsDir}" target="_blank" rel="noopener">${esc(a.strasse)}<br>${esc(a.plz)} ${esc(a.ort)}</a></address>
          <p class="pluscode">Plus Code ${esc(a.pluscode)}</p>
          <ul class="contact-list">
            <li><a href="${mapsDir}" target="_blank" rel="noopener"><span class="i">${ico.route}</span><span><span class="k">Google Maps</span><span class="v">Route planen</span></span>${ico.arrow}</a></li>
            <li><a href="${c.telefon.link}"><span class="i">${ico.phone}</span><span><span class="k">Telefon</span><span class="v">${esc(c.telefon.anzeige)}</span></span>${ico.arrow}</a></li>
          </ul>
          <img class="deco" src="assets/img/cubes-sm.webp" width="311" height="227" alt="" loading="lazy" decoding="async" data-depth="0.4">
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="wrap">
    <div class="footer__top">
      <p class="big">Zimt <em>&amp;</em><br>Zucker</p>
      <div class="footer__cols">
        <p><span class="k">Adresse</span><a href="${mapsDir}" target="_blank" rel="noopener">${esc(a.strasse)}<br>${esc(a.plz)} ${esc(a.ort)}</a></p>
        <p><span class="k">Telefon</span><a href="${c.telefon.link}">${esc(c.telefon.anzeige)}</a></p>
        <p><span class="k">Geöffnet</span>Mi–Fr 12:00–17:30<br>Sa &amp; So 09:30–17:30</p>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© ${new Date().getFullYear()} ${esc(c.name)}, ${esc(a.ort)}</span>
      <span>Bilder: digitale Illustrationen</span>
    </div>
  </div>
</footer>

<div class="actionbar" role="navigation" aria-label="Schnellzugriff">
  <a class="btn" href="${c.telefon.link}">${ico.phone}<span>Anrufen</span></a>
  <a class="btn btn--ghost" href="${mapsDir}" target="_blank" rel="noopener">${ico.route}<span>Route</span></a>
</div>

<script>${js}</script>
</body>
</html>
`;

fs.writeFileSync(new URL('./index.html', import.meta.url), html);
fs.writeFileSync(new URL('./robots.txt', import.meta.url), `User-agent: *\nAllow: /\n\nSitemap: ${site}sitemap.xml\n`);
fs.writeFileSync(new URL('./sitemap.xml', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site}</loc></url></urlset>\n`);
console.log(`index.html geschrieben (${(html.length / 1024).toFixed(1)} KB)`);
