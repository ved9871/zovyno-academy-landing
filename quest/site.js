/* ZOVYNO Academy — Design 4 "Quest": menu, filters, dialogs, reveal and motion. */
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
  window.matchMedia('(min-width: 1101px)').addEventListener('change', (e) => e.matches && setMenu(false));

  /* Course filters */
  const chips = $$('.chip');
  const quests = $$('.quest[data-category]');
  const count = $('#course-count');
  const names = { web3: 'Web3', trading: 'Trading', marketing: 'Marketing', leadership: 'Leadership' };
  const applyFilter = (filter) => {
    let shown = 0;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === filter)));
    quests.forEach((row) => {
      const cat = row.dataset.category;
      const show = filter === 'all' || cat === 'all' || cat === filter;
      row.hidden = !show;
      if (show) {
        row.classList.remove('is-pop');
        void row.offsetWidth;
        row.classList.add('is-pop');
        if (cat !== 'all') shown += 1;
      }
    });
    count.textContent =
      filter === 'all'
        ? 'Showing all 5 planned foundation courses.'
        : `Showing ${shown} planned ${names[filter]} foundation course${shown === 1 ? '' : 's'}.`;
  };
  chips.forEach((c) => c.addEventListener('click', () => applyFilter(c.dataset.filter)));
  $$('[data-path-filter]').forEach((a) => a.addEventListener('click', () => applyFilter(a.dataset.pathFilter)));

  /* Course dialogs */
  $$('[data-dialog]').forEach((btn) => {
    const dialog = document.getElementById(btn.dataset.dialog);
    if (!dialog || typeof dialog.showModal !== 'function') return;
    btn.addEventListener('click', () => dialog.showModal());
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
    });
    dialog.addEventListener('close', () => btn.focus());
  });

  /* Scroll reveal (staggered inside groups), with a 4 s safety net */
  const revealEls = $$('[data-reveal]');
  const stages = $('#stages');
  const crt = $('#crt');
  const onShown = (el) => {
    el.classList.add('is-in');
    if (stages && stages.contains(el)) stages.classList.add('is-drawn');
    if (crt && el.contains(crt)) crt.classList.add('is-on');
  };
  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(onShown);
  } else {
    revealEls.forEach((el) => {
      const sibs = [...el.parentElement.children].filter((n) => n.hasAttribute('data-reveal'));
      el.style.setProperty('--d', `${Math.min(sibs.indexOf(el), 5) * 90}ms`);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          onShown(en.target);
          io.unobserve(en.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
    window.setTimeout(() => {
      revealEls.forEach(onShown);
      io.disconnect();
    }, 4000);
  }

  /* Active nav link */
  const navLinks = $$('.nav a');
  const sections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const line = window.innerHeight * 0.35;
    let current = null;
    sections.forEach((s) => {
      if (s.getBoundingClientRect().top <= line) current = s;
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
})();
