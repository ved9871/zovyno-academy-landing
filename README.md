# ZOVYNO Academy — Landing Page Design Draft

A working design draft of the ZOVYNO Academy homepage, built for management review **before development begins**. It shows what the page contains, in what order, and how it behaves on desktop and mobile.

It follows the approved **ZOVYNO 2026 Website UI/UX Final Design Blueprint v1.1** (Concept A — Immersive Midnight hero + light education sections) and the exact colours in `design-tokens.json`.

> **Status: design concept.** This is not a live academy. There is no enrollment, login, payment, certificate, wallet or trading integration, and every course is labelled *Planned*.

## How to view it

No build step and no dependencies. Either:

- open `index.html` in a browser, or
- serve the folder: `python -m http.server 4173` and visit `http://localhost:4173`.

### Section guide (for reviewers)

Click **Section guide** (bottom-right), or open `index.html?guide=1`. Each section is outlined and labelled with its order, name and the visitor outcome it is meant to achieve, taken from the Blueprint's information architecture.

## What the page consists of

| # | Section | What the visitor gets |
|---|---|---|
| 01 | Hero & navigation | The promise ("Learn. Decentralize. Lead."), two entry choices, and the five disciplines as a clickable network |
| 02 | Choose your starting point | Three paths: Web3, Trading, Marketing & Leadership. Each opens the course list pre-filtered |
| 03 | Five disciplines | The exact teaching scope |
| 04 | Foundation courses | Five planned courses with filters and a preview pop-up listing proposed modules |
| 05 | Learning journey | Learn → Practice → Validate → Lead |
| 06 | ORZENO practice lab | An illustrated, clearly simulated lab concept |
| 07 | Leadership pathway | Five competence-based steps; nothing is guaranteed or purchasable |
| 08 | Mission | Local educators, multilingual access (English first; Bangla and Hindi planned), future credentials |
| 09 | FAQ | Availability, tokens and wallets, AI scope, trading risk, certificates |
| 10 | Final call to action + footer | Return to the free foundations; "Powered by NodalWaves" and disclosures |

## Structure

```
index.html              the whole page
assets/css/tokens.css   design tokens: primitive -> semantic -> component
assets/css/styles.css   all page styles (uses tokens only)
assets/css/review.css   section-guide styles (review aid, remove for production)
assets/js/site.js       menu, course filters, course pop-ups, scroll reveal
assets/js/review.js     section guide (review aid, remove for production)
assets/fonts/           self-hosted Inter variable font
assets/img/             favicon, touch icon, share image
design-tokens.json      approved brand tokens (source of truth)
```

## Design rules kept from the Blueprint

- **Palette:** Midnight Navy `#14233D`, Deep Navy `#0D172B`, Deep Teal `#087B73`, Golden Amber `#F2B24C`, Silver `#C6CDD7`, Cloud `#F4F7FA`, Ink `#18283D`, Mint `#B8F4E9`. Amber is used sparingly, and never as normal-size text on a light background.
- **Shape and type:** 11 px buttons, 18 px cards, 22 px hero cards; Inter.
- **Honesty:** no student counts, ratings, testimonials, partner logos, return promises or "live" claims. Status is written in words (*Planned*, *Simulated · Not live*), never colour alone.
- **Accessibility targets:** keyboard-operable menu, filters, pop-ups and FAQ; visible focus rings on light and dark surfaces; 44 px touch targets; motion switched off under `prefers-reduced-motion`.
- **Performance by construction:** static HTML, self-hosted font, CSS/SVG artwork, about 6 KB of JavaScript.

## What is deliberately not here

Student accounts, progress, quizzes, payments, certificates, the ORZENO sandbox, live market data, analytics, a CMS and sign-up forms. These belong to the LMS, curriculum and leadership workstreams.

## Before any public launch

1. Management review of copy and claims; legal review for each target country.
2. Brand, domain and trademark clearance for "ZOVYNO Academy", and approved logo artwork.
3. Verified course availability before any label changes from *Planned*.
4. Independent browser, screen-reader and performance testing (targets: WCAG 2.2 AA; LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1).
5. Remove the section guide (`review.css`, `review.js`, the `#guide-toggle` button) and the `noindex` meta tag.

## Checked so far

Viewed in a Chromium browser at 1440 px and 390 px wide: all ten sections render, there is no sideways scrolling, and the menu, course filters, course pop-ups, FAQ and section guide work. Other browsers, screen readers and real-device performance have not been tested.
