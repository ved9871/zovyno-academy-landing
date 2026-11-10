/*
  Management review aid — "Section guide".
  Labels every section with its order, name and intended visitor outcome.
  Open the page with ?guide=1 to start with the guide on. Remove for production.
*/
(function () {
  'use strict';

  var button = document.getElementById('guide-toggle');
  if (!button) return;

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-guide]'));
  var built = false;

  function build() {
    sections.forEach(function (section, index) {
      var tag = document.createElement('aside');
      tag.className = 'guide-tag';
      tag.setAttribute('role', 'note');

      var order = document.createElement('b');
      order.textContent = 'Section ' + String(index + 1).padStart(2, '0') + ' of ' + sections.length;
      var name = document.createElement('strong');
      name.textContent = section.dataset.guide;
      var outcome = document.createElement('span');
      outcome.textContent = section.dataset.guideOutcome;

      tag.append(order, name, outcome);
      section.prepend(tag);
    });
    built = true;
  }

  function setGuide(on) {
    if (on && !built) build();
    document.body.classList.toggle('guide-on', on);
    button.setAttribute('aria-pressed', String(on));
  }

  button.addEventListener('click', function () {
    setGuide(button.getAttribute('aria-pressed') !== 'true');
  });

  if (new URLSearchParams(window.location.search).get('guide') === '1') setGuide(true);
})();
