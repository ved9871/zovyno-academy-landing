/* ZOVYNO Academy — Design 5 "Ledger": menu, course tour, reveal and stage motion. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile menu */
  const menuBtn = $('#menu-btn');
  const panel = $('#mobile-panel');
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.hidden = !open;
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', (e) => e.target.closest('a') && setMenu(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuBtn.focus();
    }
  });
  window.matchMedia('(min-width: 1181px)').addEventListener('change', (e) => e.matches && setMenu(false));

  /* Course tour: tabs + category filter */
  const tabs = $$('.tour-tabs [role="tab"]');
  const chips = $$('.chip');
  const count = $('#course-count');
  const names = { web3: 'Web3', trading: 'Trading', marketing: 'Marketing', leadership: 'Leadership' };
  const selectTab = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  };
  const visibleTabs = () => tabs.filter((t) => !t.hidden);
  const applyFilter = (filter) => {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === filter)));
    tabs.forEach((t) => (t.hidden = filter !== 'all' && t.dataset.category !== filter));
    const shown = visibleTabs();
    const current = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
    if (shown.length && (!current || current.hidden)) selectTab(shown[0]);
    count.textContent =
      filter === 'all'
        ? 'Showing all 5 planned foundation courses.'
        : `Showing ${shown.length} planned ${names[filter]} foundation course${shown.length === 1 ? '' : 's'}.`;
  };
  tabs.forEach((t) => {
    t.addEventListener('click', () => selectTab(t));
    t.addEventListener('keydown', (e) => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const list = visibleTabs();
      selectTab(list[(list.indexOf(t) + step + list.length) % list.length], true);
    });
  });
  if (tabs.length) selectTab(tabs[0]);
  chips.forEach((c) => c.addEventListener('click', () => applyFilter(c.dataset.filter)));
  $$('[data-path-filter]').forEach((a) => a.addEventListener('click', () => applyFilter(a.dataset.pathFilter)));

  /* Scroll reveal, with a safety net */
  const revealEls = $$('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else {
    revealEls.forEach((el) => {
      const sibs = [...el.parentElement.children].filter((n) => n.hasAttribute('data-reveal'));
      el.style.setProperty('--d', `${Math.min(sibs.indexOf(el), 5) * 90}ms`);
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));
    window.setTimeout(() => {
      revealEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
      });
    }, 4000);
  }

  /* Scroll-linked values: surfaces separate, journey rule fills, nav highlights */
  const stage = $('#stage');
  const surfaces = $('#surfaces');
  const moves = $('#moves');
  const navLinks = $$('.nav a');
  const sections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const clamp = (n) => Math.max(0, Math.min(1, n));
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const vh = window.innerHeight;
    if (!reduced) {
      surfaces.style.setProperty('--s', clamp(window.scrollY / (stage.offsetHeight * 0.7)).toFixed(3));
      const r = moves.getBoundingClientRect();
      moves.style.setProperty('--p', clamp((vh * 0.85 - r.top) / (r.height + vh * 0.3)).toFixed(3));
    }
    let current = null;
    sections.forEach((s) => {
      if (s.getBoundingClientRect().top <= vh * 0.35) current = s;
    });
    navLinks.forEach((a) => a.classList.toggle('is-active', !!current && a.getAttribute('href') === `#${current.id}`));
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  /* Pointer parallax on the hero surfaces */
  let paused = false;
  if (!reduced && window.matchMedia('(hover: hover) and (min-width: 1001px)').matches) {
    stage.addEventListener('pointermove', (e) => {
      if (paused) return;
      const r = stage.getBoundingClientRect();
      surfaces.style.setProperty('--px', `${(((e.clientX - r.left) / r.width - 0.5) * 7).toFixed(2)}deg`);
      surfaces.style.setProperty('--py', `${(((e.clientY - r.top) / r.height - 0.5) * -5).toFixed(2)}deg`);
    });
    stage.addEventListener('pointerleave', () => {
      surfaces.style.setProperty('--px', '0deg');
      surfaces.style.setProperty('--py', '0deg');
    });
  }

  /* Pause motion control */
  const pause = $('#pause');
  pause.addEventListener('click', () => {
    paused = !paused;
    document.documentElement.classList.toggle('is-paused', paused);
    pause.setAttribute('aria-pressed', String(paused));
    pause.lastElementChild.textContent = paused ? 'Resume motion' : 'Pause motion';
  });
})();
