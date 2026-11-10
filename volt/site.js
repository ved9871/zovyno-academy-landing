/* ZOVYNO Academy — Design 1 "Volt": menu, filters, dialogs, reveal and motion. */
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
  const courses = $$('.course[data-category]');
  const count = $('#course-count');
  const names = { web3: 'Web3', trading: 'Trading', marketing: 'Marketing', leadership: 'Leadership' };
  const applyFilter = (filter) => {
    let shown = 0;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === filter)));
    courses.forEach((card) => {
      const cat = card.dataset.category;
      const show = filter === 'all' || cat === 'all' || cat === filter;
      card.hidden = !show;
      if (show) {
        card.classList.remove('is-pop');
        void card.offsetWidth;
        card.classList.add('is-pop');
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

  /* Scroll reveal (staggered inside grids), with a safety net */
  const revealEls = $$('[data-reveal]');
  const showAll = () => {
    revealEls.forEach((el) => el.classList.add('is-in'));
    $('#steps')?.classList.add('is-drawn');
  };
  if (reduced || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    revealEls.forEach((el) => {
      const sibs = [...el.parentElement.children].filter((n) => n.hasAttribute('data-reveal'));
      el.style.setProperty('--d', `${Math.min(sibs.indexOf(el), 5) * 80}ms`);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add('is-in');
          if (en.target.closest('#steps')) $('#steps').classList.add('is-drawn');
          io.unobserve(en.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
    window.setTimeout(() => {
      revealEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
      });
    }, 4000);
  }

  /* Scroll progress + active nav link */
  const bar = $('#progress-bar');
  const navLinks = $$('.nav a');
  const sections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
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

  /* Cursor spotlight on cards */
  if (window.matchMedia('(hover: hover)').matches) {
    $$('.spot').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* Decorative candle bars (not market data) */
  const candles = $('#candles');
  if (candles) {
    const heights = [34, 52, 41, 66, 48, 72, 58, 80, 62, 46, 70, 88, 64, 76, 54, 92, 68, 84, 60, 96, 74, 86];
    candles.innerHTML = heights
      .map(
        (h, i) =>
          `<i class="${i % 3 === 1 ? 'is-b' : ''}" style="height:${h}%;animation-delay:${-(i * 0.37).toFixed(2)}s;animation-duration:${(2 + (i % 5) * 0.35).toFixed(2)}s"></i>`
      )
      .join('');
  }

  /* Headline scramble */
  const scr = $('[data-scramble]');
  if (scr && !reduced) {
    const final = scr.textContent;
    const glyphs = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#/<>';
    const total = 34;
    let frame = 0;
    const run = () => {
      frame += 1;
      const settled = Math.floor((frame / total) * final.length);
      scr.textContent = [...final]
        .map((ch, i) => (i < settled || ch === '.' ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]))
        .join('');
      if (frame < total) window.setTimeout(run, 34);
      else scr.textContent = final;
    };
    window.setTimeout(run, 350);
  }
})();
