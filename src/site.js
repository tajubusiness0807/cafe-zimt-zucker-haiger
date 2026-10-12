(() => {
  const root = document.documentElement;
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const bar = document.querySelector('.actionbar');
  const hero = document.querySelector('.hero');

  /* Highlight today's row in the opening hours (Europe/Berlin), no "open now" status. */
  try {
    const wd = new Intl.DateTimeFormat('de-DE', { weekday: 'short', timeZone: 'Europe/Berlin' })
      .format(new Date()).replace('.', '');
    const row = document.querySelector(`.hours tr[data-day="${wd}"]`);
    if (row) row.classList.add('is-today');
  } catch (e) { /* ignore */ }

  /* Reveal on scroll */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* Parallax: translate-only, rAF-throttled, scoped to visible sections */
  const layers = [...document.querySelectorAll('[data-depth]')].map((el) => ({
    el,
    depth: parseFloat(el.dataset.depth) || 0,
    scope: el.closest('section, .hero, footer') || document.body,
    x: 0, y: 0,
  }));
  let px = 0, py = 0, tx = 0, ty = 0;
  let ticking = false;
  let vh = innerHeight;

  function frame() {
    ticking = false;
    const scrollY = window.scrollY;
    const still = motionQuery.matches;
    // read all geometry first, then write, to avoid forced reflows
    const rects = still ? [] : layers.map((l) => l.scope.getBoundingClientRect());
    header && header.classList.toggle('is-solid', scrollY > 40);
    bar && bar.classList.toggle('is-visible', scrollY > vh * 0.55);
    if (still) return;

    const mobile = innerWidth < 820;
    const strength = mobile ? 0.55 : 1;
    // ease pointer offsets toward their targets
    px += (tx - px) * 0.08; py += (ty - py) * 0.08;

    layers.forEach((l, i) => {
      const r = rects[i];
      if (r.bottom < -200 || r.top > vh + 200) return;
      const isHero = l.scope === hero;
      // hero: offset from page top; other sections: offset of section centre from viewport centre
      const delta = isHero ? -r.top : (r.top + r.height / 2) - vh / 2;
      const y = delta * l.depth * strength * (isHero ? 1 : -0.35);
      const pxOff = isHero ? px * l.depth * 60 : 0;
      const pyOff = isHero ? py * l.depth * 40 : 0;
      l.el.style.translate = `${pxOff.toFixed(2)}px ${(y + pyOff).toFixed(2)}px`;
    });
    if (Math.abs(tx - px) > 0.001 || Math.abs(ty - py) > 0.001) request();
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => { vh = innerHeight; request(); }, { passive: true });
  if (matchMedia('(pointer: fine)').matches && hero) {
    hero.addEventListener('pointermove', (e) => {
      tx = (e.clientX / innerWidth - 0.5); ty = (e.clientY / innerHeight - 0.5); request();
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { tx = ty = 0; request(); });
  }
  motionQuery.addEventListener && motionQuery.addEventListener('change', () => {
    if (motionQuery.matches) layers.forEach((l) => (l.el.style.translate = ''));
    request();
  });
  request();
})();
