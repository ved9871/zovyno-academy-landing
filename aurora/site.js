/* ZOVYNO Academy — Design 3 "Aurora": menu, filters, dialogs, reveal and motion. */
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

  /* Discipline tabs */
  const tabs = $$('.disc-tabs [role="tab"]');
  const selectTab = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    const list = tab.parentElement;
    if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: tab.offsetLeft - 12, behavior: 'smooth' });
    if (focus) tab.focus();
  };
  if (tabs.length) {
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => selectTab(t));
      t.addEventListener('keydown', (e) => {
        const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        selectTab(tabs[(i + step + tabs.length) % tabs.length], true);
      });
    });
    const fromHash = () => tabs.find((t) => `#${t.getAttribute('aria-controls')}` === location.hash);
    selectTab(fromHash() || tabs[0]);
    $$('a[href^="#pillar-"]').forEach((a) =>
      a.addEventListener('click', () => {
        const t = tabs.find((x) => `#${x.getAttribute('aria-controls')}` === a.getAttribute('href'));
        if (t) selectTab(t);
      })
    );
    window.addEventListener('hashchange', () => fromHash() && selectTab(fromHash()));
  }

  /* Journey rail fills as the section scrolls through the viewport */
  const steps = $('#steps');
  if (steps && !reduced) {
    const fill = () => {
      const r = steps.getBoundingClientRect();
      const p = (window.innerHeight * 0.85 - r.top) / (r.height + window.innerHeight * 0.35);
      steps.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
    };
    window.addEventListener('scroll', () => requestAnimationFrame(fill), { passive: true });
    fill();
  }
})();
