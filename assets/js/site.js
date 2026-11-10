/* ZOVYNO Academy — page interactions. The page stays readable without JavaScript. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Mobile menu */
  var toggle = document.getElementById('menu-toggle');
  var panel = document.getElementById('mobile-panel');
  var header = document.getElementById('site-header');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.hidden = !open;
  }

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenu(false);
      });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener('pointerdown', function (event) {
      if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) setMenu(false);
    });
    window.matchMedia('(min-width: 1101px)').addEventListener('change', function (event) {
      if (event.matches) setMenu(false);
    });
  }

  /* Course filters */
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.course'));
  var courses = cards.filter(function (card) {
    return !card.classList.contains('course--note');
  });
  var count = document.getElementById('course-count');

  function applyFilter(category) {
    var label = '';
    chips.forEach(function (chip) {
      var active = chip.dataset.filter === category;
      chip.setAttribute('aria-pressed', String(active));
      if (active) label = chip.textContent.trim();
    });

    var visible = 0;
    cards.forEach(function (card) {
      var match = category === 'all' || card.dataset.category === category;
      card.hidden = !match;
      if (match && courses.indexOf(card) !== -1) visible += 1;
    });

    if (!count) return;
    count.textContent =
      category === 'all'
        ? 'Showing all ' + visible + ' planned foundation courses.'
        : 'Showing ' + visible + ' ' + label.toLowerCase() + (visible === 1 ? ' course' : ' courses') +
          ' of ' + courses.length + ' planned foundations.';
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      applyFilter(chip.dataset.filter);
    });
  });
  document.querySelectorAll('[data-path-filter]').forEach(function (link) {
    link.addEventListener('click', function () {
      applyFilter(link.dataset.pathFilter);
    });
  });

  /* Course preview dialogs (native <dialog> gives focus trap, Escape and focus return) */
  document.querySelectorAll('[data-dialog]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var dialog = document.getElementById(trigger.dataset.dialog);
      if (!dialog || typeof dialog.showModal !== 'function') return;
      document.documentElement.classList.add('dialog-open');
      dialog.showModal();
    });
  });
  document.querySelectorAll('.course-dialog').forEach(function (dialog) {
    dialog.querySelectorAll('[data-close]').forEach(function (control) {
      control.addEventListener('click', function () {
        dialog.close();
      });
    });
    dialog.addEventListener('click', function (event) {
      if (event.target !== dialog) return;
      var box = dialog.getBoundingClientRect();
      var inside =
        event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
      if (!inside) dialog.close();
    });
    dialog.addEventListener('close', function () {
      document.documentElement.classList.remove('dialog-open');
    });
  });

  /* Scroll reveal */
  var revealSelector = [
    '.section-head > *',
    '.path-card',
    '.pillar',
    '.course',
    '.step',
    '.split > *',
    '.faq-copy',
    '.faq-list details',
    '.final-cta .shell > *',
  ].join(',');
  var items = Array.prototype.slice.call(document.querySelectorAll(revealSelector));

  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    items.forEach(function (item) {
      var siblings = Array.prototype.slice.call(item.parentElement.children);
      item.style.setProperty('--reveal-delay', Math.min(siblings.indexOf(item), 5) * 70 + 'ms');
      item.setAttribute('data-reveal', '');
    });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );
    items.forEach(function (item) {
      observer.observe(item);
    });
    /* Safety net: content must never stay hidden. */
    window.setTimeout(function () {
      items.forEach(function (item) {
        item.classList.add('is-in');
      });
    }, 4000);
  }
})();
