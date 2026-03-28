# Noumenon — Cinematic Scroll Experience
**Date:** 2026-03-28
**Status:** Approved for implementation

---

## Goals

- **Emotional impact** — Transform the site from a static brochure into a cinematic journey visitors feel, not just browse
- **Drive film sales** — Purchase decision arrives at the emotional peak of each film's moment; rent option removed entirely
- **Audience** — Mix of cinephiles and general audience; artful enough for film lovers, accessible for casual visitors
- **Visual direction** — Evolve the existing dark/grain/gold/serif identity; do not replace it

---

## Homepage Redesign — 6-Act Scroll Narrative

The homepage becomes a single continuous scroll experience structured as six acts. The existing hero carousel is removed and replaced entirely by this scroll structure.

### Act 1 — Atmospheric Entry (100vh)
Full-screen black viewport. SVG grain texture at full intensity. The fixed nav is **hidden** (opacity: 0, pointer-events: none) during this act — it fades in (opacity → 1, transition 0.8s) once the user scrolls past Act 1's 80% threshold. This preserves the "wordmark emerges from darkness" effect without the nav logo spoiling it.

A single italic serif line fades in via typewriter effect (char-by-char, 60ms interval): *"Some stories refuse to be forgotten."* After 1.2s delay, the `noúmenon` wordmark emerges (opacity 0→1 over 1.5s, scale 0.97→1). The `by Armenak` subtitle follows 0.3s later. A pulsing `scroll to begin ↓` hint appears at the bottom. No carousel — pure atmosphere.

**Mobile:** Wordmark at 36px (down from ~52px desktop). Tagline at 13px. Scroll hint visible.

### Act 2 — The Director's World (100vh)
Scroll into this section triggers a parallax image reveal. The image (dark cinematic gradient stand-in until a real director photo is available) drifts upward at 0.4× scroll speed via a `scroll` event listener — **this is the one intentional exception to the no-scroll-polling rule**, justified because CSS scroll-driven animations have insufficient cross-browser support without a polyfill. The listener is throttled with `requestAnimationFrame`.

`ARMENAK` appears letter by letter (each `<span>` staggered at 80ms `transitionDelay`). A one-sentence biography in Montserrat 300: *"A filmmaker working at the intersection of documentary and fiction — searching for the moment truth becomes story."* Location below in small spaced caps, sourced from `director.based` field (rendered as-is; the field value will be updated to use `·` separator).

**Trigger:** `IntersectionObserver` at 20% visibility threshold.
**Mobile:** Parallax disabled (image fixed, no translateY). Prevents jank on iOS.

### Act 3 — Film #1 Viewport Takeover (100vh)
As the section enters the viewport, the film's poster image bleeds in via `clip-path: inset(0 50% 0 50%) → inset(0 0% 0 0%)` reveal. The film's accent color tints the grain layer. Content stacks bottom-left:
- Genre · Duration (9px spaced caps, accent color)
- Film title (Cormorant Garamond ~64px, white)
- Tagline (italic 14px, muted)
- Two buttons: `View Film →` (outline, links to `/film/:slug`) | `Buy $9.99` (solid white, bold — Stripe hook)
- Award badge top-right (hidden when `awards` array is empty)
- Year top-left in muted spaced caps

**"View Film →"** links to `/film/the-lyrics`. It is a navigation link, not a streaming action. Label uses "View Film" (not "Watch Film") to avoid implying streaming functionality that doesn't yet exist.

**Video:** If `film.videoPreview` is set, it plays as a silent ambient loop behind the poster once the section is ≥80% in viewport. Poster image sits at 0.65 opacity over the video. `video.play()` called on intersection enter; `video.pause()` on exit.

**Mobile:** Font sizes scale: title 38px, tagline 12px. Buttons stack vertically.

### Act 4 — Interstitial Breath (60vh)
Near-black section, maximum grain. A pull-quote displayed in large italic Cormorant Garamond, centered.

**Quote source logic:**
- If `film.awards[0].quote` exists → use that quote
- Otherwise → use hardcoded fallback: *"Between sound and silence, there is a moment where everything is true."*

Both films currently have `awards: []`, so the fallback is used at launch. When real awards are added to `films.ts`, the quote updates automatically.

Text starts at near-invisible (`color: #1a1814`) and reveals to `#8a8070` over 1.2s. Slight `translateY(12px) → translateY(0)` on entry.

**Mobile:** Quote at 16px, max-width 85vw, centered.

### Act 5 — Film #2 Viewport Takeover (100vh)
Identical structure to Act 3 but with Film #2's palette (`#c47a4a` warm brown for The Drift). The Drift's trailer loop (`film.videoPreview = '/video/drift-trailer.mp4'`) plays on intersection. Same CTA pattern: `View Film →` (links to `/film/the-drift`) | `Buy $9.99` (solid).

### Act 6 — The Close (80vh)
End-credits energy. Dark, dense grain. `NOÚMENON` in large spaced Cormorant Garamond (80px). Armenak's name below in Montserrat 300 spaced caps. Closing line: *"New films in production."* A press/contact link in muted spaced caps. No hard footer line — the page dissolves into darkness.

**Mobile:** Logo 48px.

---

## Film Detail Page (`/film/:slug`) — Evolution

The existing film detail page is **evolved, not replaced**. The hero carousel (poster frames + video loop) stays as-is — it is the immersive deep-dive that the homepage Acts 3/5 link to. "View Film →" on the homepage is the invitation; the carousel on the detail page is the delivery.

Changes:

### Read Progress Bar
A 1px line beneath the fixed nav, using the film's accent color, that fills left-to-right as the user scrolls. Implemented via `scroll` event → `(scrollY / (documentHeight - viewportHeight)) * 100`%. Gives a sense of narrative depth.

### Purchase Section — Buy Only
The existing two-column rent/buy grid is replaced with a single confident purchase card:
- Label: `Own Forever` (9px spaced caps, muted)
- Price: `$9.99` (Cormorant Garamond 48px, white)
- Description: *"Permanent access. Support independent cinema directly."*
- CTA: `Buy Film` — full-width solid white button
- Calls `handlePurchase('buy')` — existing Stripe placeholder hook

Rent card removed entirely from UI and data display.

### Awards Section
Rendered only when `film.awards.length > 0`. Layout: quote in italic Cormorant Garamond 20px, source attribution below in 9px spaced caps, left border in film accent color. Currently renders nothing for both films (empty arrays) — no empty state shown, section simply absent.

### Hero Carousel
Unchanged. The carousel with its poster frames, video loop, and dot navigation stays as implemented.

---

## Data Model Changes

### `src/data/films.ts`

1. **Remove** `rentPrice: number` field from `Film` interface and both film objects
2. **Add** `videoPreview?: string` field to `Film` interface
3. **Populate** `videoPreview: '/video/drift-trailer.mp4'` on The Drift film object (The Lyrics has no video preview — field absent/undefined)
4. **Update** `director.based` from `"Yerevan / Amsterdam"` to `"Yerevan · Amsterdam"`

### Inline data in `index.html` and `film.html`
Both HTML files contain a duplicate hardcoded `films` array that mirrors `films.ts`. These are updated manually to match. **Architectural note:** Fetching from `/api/films` at runtime would be cleaner but requires async rendering before paint — outside scope for this iteration. Manual sync is acceptable given the 2-film scale.

---

## What Stays Unchanged

- Dark theme (`#080808` background, `#f5f0e8` text)
- Grain texture (SVG noise overlay)
- Cormorant Garamond + Montserrat typography
- Gold accent (`#e8c97a`)
- Custom cursor system (dot + ring)
- EN/RU language toggle + localStorage persistence
- Express + TypeScript backend
- Vercel deployment config
- `/api/films`, `/api/director`, `/film/:slug` routes
- Film detail hero carousel

---

## What Gets Added / Changed

| Feature | File | Mechanism |
|---|---|---|
| Nav hidden during Act 1 | `index.html` | `IntersectionObserver` on Act 1 section |
| Typewriter tagline | `index.html` | JS char-by-char `setInterval` |
| Wordmark fade-in | `index.html` | CSS `opacity` + `transform` on load |
| Director section (Act 2) | `index.html` | `IntersectionObserver` + scroll parallax |
| Letter-by-letter name | `index.html` | Staggered `transitionDelay` per `<span>` |
| Parallax image (desktop only) | `index.html` | `requestAnimationFrame` scroll listener |
| Film viewport takeovers | `index.html` | `clip-path` reveal + `IntersectionObserver` |
| Ambient video on scroll | `index.html` | `play()`/`pause()` on intersection |
| Interstitial quote | `index.html` | `IntersectionObserver` fade + data fallback |
| End credits footer | `index.html` | Static HTML, scroll reveal |
| Read progress bar | `film.html` | `scroll` event → width % |
| Single buy card | `film.html` | Remove rent card, restyle |
| Awards section | `film.html` | Conditional render from `film.awards[]` |
| `videoPreview` field | `films.ts` | Add to interface + The Drift object |
| Remove `rentPrice` | `films.ts` + both HTMLs | Delete field everywhere |
| Update `director.based` | `films.ts` | Change separator to `·` |

---

## Out of Scope

- Stripe payment integration (`handlePurchase` remains a placeholder)
- Director photo (bio section uses gradient stand-in)
- New films beyond the existing two
- Admin CMS for adding films
- Email capture / mailing list
- CSS scroll-driven animations API (limited browser support, no polyfill)
