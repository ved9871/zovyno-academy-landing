# ZOVYNO Academy — Landing Page Design Directions

Design samples of the ZOVYNO Academy homepage for client and management review **before development begins**.

> **Status: design concepts.** This is not a live academy. There is no enrollment, login, payment, certificate, wallet or trading integration, and every course is labelled *Planned*.

## What is here

| Path | What it is |
|---|---|
| `index.html` | Chooser page linking to the designs |
| `volt/` | **Design 1 — Volt.** Dark neon trading terminal: electric lime on near-black, oversized kinetic headlines, console panels, ticker. Fonts: Unbounded, Space Grotesk, JetBrains Mono |
| `pop/` | **Design 2 — Pop.** Loud neo-brutalist: sticker headlines, thick outlines, hard shadows, colour-blocked sections. Fonts: Bricolage Grotesque, DM Sans, Space Mono |
| `classic/` | Earlier draft that follows the client's Blueprint v1.1 (calm navy concept), kept for reference |

Each design is self-contained (`index.html`, `styles.css`, `site.js`), with no build step and no dependencies apart from Google Fonts.

## How to view

- Serve the folder: `python -m http.server 4173` and open `http://localhost:4173`.
- Or open any `index.html` directly in a browser.

## Same content in both designs

1. Hero and navigation — "Learn. Decentralize. Lead."
2. Choose your starting point — three paths that pre-filter the course list
3. Five disciplines
4. Foundation courses — filters and a preview pop-up with proposed modules
5. Learning journey — Learn → Practice → Validate → Lead
6. ORZENO practice lab — clearly simulated
7. Leadership pathway — five competence-based steps
8. Mission — local educators, English first, Bangla and Hindi planned
9. FAQ
10. Final call to action and footer — "Powered by NodalWaves" and disclosures

## Rules kept in every design

- No student counts, ratings, testimonials, partner logos, prices, return promises or live market data.
- Status is written in words (*Planned*, *Simulated · Not live*), never colour alone.
- Charts and candle bars are decorative and labelled as such.
- Keyboard-operable menu, filters, pop-ups and FAQ; visible focus rings; motion switched off under `prefers-reduced-motion`.
- `noindex` on every page.

## Before any public launch

1. Client picks a direction; management and legal review of copy and claims for each target country.
2. Brand, domain and trademark clearance for "ZOVYNO Academy", and approved logo artwork.
3. Verified course availability before any label changes from *Planned*.
4. Self-host the fonts, then run independent browser, screen-reader and performance testing.
5. Remove the chooser page, the design-switch pill and the `noindex` tags.
