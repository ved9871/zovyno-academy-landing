/*
  ZOVYNO Academy — Design 2: "Pop"
  Menu, course filters, course previews, marquee and scroll reveal. No dependencies.
*/
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function all(selector, root) {
    return Array.prototype.slice.call((root || doc).querySelectorAll(selector));
  }

  /* ------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------ */
  var toggle = doc.getElementById('menu-toggle');
  var panel = doc.getElementById('mobile-panel');

  function setMenu(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.hidden = !open;
  }

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    all('a', panel).forEach(function (link) {
      link.addEventListener('click', function () {
        setMenu(false);
      });
    });
    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    if (window.matchMedia) {
      var wide = window.matchMedia('(min-width: 1201px)');
      var onWide = function (event) {
        if (event.matches) setMenu(false);
      };
      if (wide.addEventListener) wide.addEventListener('change', onWide);
      else if (wide.addListener) wide.addListener(onWide);
    }
  }

  /* ------------------------------------------------------------------
     Course filters (chips + path cards that pre-filter the catalog)
     ------------------------------------------------------------------ */
  var chips = all('.chip[data-filter]');
  var courses = all('.course[data-category]');
  var countEl = doc.getElementById('course-count');
  var labels = { web3: 'Web3', trading: 'Trading', marketing: 'Marketing', leadership: 'Leadership' };

  function applyFilter(filter) {
    var known = chips.some(function (chip) {
      return chip.getAttribute('data-filter') === filter;
    });
    if (!known) filter = 'all';

    chips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(chip.getAttribute('data-filter') === filter));
    });

    var shown = 0;
    courses.forEach(function (course) {
      var category = course.getAttribute('data-category');
      var isNote = category === 'all';
      var visible = isNote || filter === 'all' || category === filter;
      var wasHidden = course.hidden;
      course.hidden = !visible;
      if (visible && !isNote) shown += 1;
      if (visible && wasHidden && !reduceMotion) {
        course.classList.remove('is-popping');
        void course.offsetWidth; // restart the pop animation
        course.classList.add('is-popping');
      }
    });

    if (countEl) {
      countEl.textContent =
        filter === 'all'
          ? 'Showing all ' + shown + ' planned foundation courses.'
          : 'Showing ' + shown + ' planned ' + labels[filter] + ' foundation ' + (shown === 1 ? 'course' : 'courses') + '.';
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      applyFilter(chip.getAttribute('data-filter'));
    });
  });

  all('[data-path-filter]').forEach(function (card) {
    card.addEventListener('click', function () {
      applyFilter(card.getAttribute('data-path-filter'));
    });
  });

  /* ------------------------------------------------------------------
     Course preview dialogs
     ------------------------------------------------------------------ */
  var lastOpener = null;

  function closeDialog(dialog) {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  all('[data-dialog]').forEach(function (button) {
    button.addEventListener('click', function () {
      var dialog = doc.getElementById(button.getAttribute('data-dialog'));
      if (!dialog) return;
      lastOpener = button;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    });
  });

  all('dialog.course-dialog').forEach(function (dialog) {
    all('[data-close]', dialog).forEach(function (button) {
      button.addEventListener('click', function () {
        closeDialog(dialog);
      });
    });
    // a click on the backdrop lands on the dialog element itself
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) closeDialog(dialog);
    });
    dialog.addEventListener('close', function () {
      if (lastOpener && typeof lastOpener.focus === 'function') lastOpener.focus();
      lastOpener = null;
    });
  });

  /* ------------------------------------------------------------------
     Marquee bands: clone each list so the loop is seamless on wide screens.
     Skipped entirely when the visitor prefers reduced motion.
     ------------------------------------------------------------------ */
  if (!reduceMotion) {
    all('.track').forEach(function (track) {
      var list = track.querySelector('ul');
      if (!list) return;
      for (var i = 0; i < 3; i += 1) {
        var clone = list.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      }
      track.classList.add('is-rolling');
    });
  }

  /* ------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------ */
  var revealItems = all('[data-reveal]');

  function settle(item) {
    item.classList.add('is-done');
  }

  function reveal(item, instant) {
    if (item.classList.contains('is-in')) return;
    item.classList.add('is-in');
    if (instant) settle(item);
    else {
      var delay = parseInt(item.style.getPropertyValue('--d'), 10) || 0;
      window.setTimeout(function () {
        settle(item);
      }, delay + 800);
    }
  }

  all('[data-stagger]').forEach(function (group) {
    all('[data-reveal]', group).forEach(function (item, index) {
      item.style.setProperty('--d', index * 90 + 'ms');
    });
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) {
      reveal(item, true);
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          reveal(entry.target, false);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    revealItems.forEach(function (item) {
      observer.observe(item);
    });

    // Safety net: never leave content hidden if the observer does not fire.
    window.setTimeout(function () {
      revealItems.forEach(function (item) {
        reveal(item, false);
      });
      observer.disconnect();
    }, 4000);
  }
})();
