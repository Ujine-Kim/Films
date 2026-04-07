# Cinematic Scroll Experience — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Noumenon homepage into a 6-act cinematic scroll narrative and evolve the film detail page with a progress bar, single buy card, and awards section.

**Architecture:** The homepage (`src/pages/index.html`) is rewritten from a carousel-based layout to a full-page scroll experience with 6 sequential sections driven by `IntersectionObserver` and scroll events. The film detail page (`src/pages/film.html`) is surgically updated — hero carousel stays, rent card is replaced with a single buy card, a progress bar is added, and an awards section is conditionally rendered. All animation logic stays as vanilla JS inline in each HTML file; no new dependencies.

**Tech Stack:** Vanilla JS, CSS transitions, `IntersectionObserver`, `requestAnimationFrame`, Cormorant Garamond + Montserrat (Google Fonts CDN), Tailwind CSS CDN (homepage only), Express + TypeScript backend (unchanged).

---

## Chunk 1: Data Baseline + films.ts Sync

### Task 1: Sync inline film data in `index.html` to match updated `films.ts`

**Files:**
- Modify: `src/pages/index.html` (inline `<script>` films array)

The `films.ts` data model was already updated (rentPrice removed, videoPreview added for The Drift, director.based updated). The inline JS array in `index.html` must match.

- [ ] **Step 1: Open `src/pages/index.html` and locate the inline films array**

It lives inside a `<script>` tag near the bottom of the file. It will contain `rentPrice: 3.99` on both film objects.

- [ ] **Step 2: Remove `rentPrice` from both film objects in the inline array**

Find and delete both lines like:
```js
rentPrice: 3.99,
```

- [ ] **Step 3: Add `videoPreview` to The Drift film object in the inline array**

In the `the-drift` object, add after the `poster` line:
```js
videoPreview: '/video/drift-trailer.mp4',
```

The Lyrics object gets no `videoPreview` field.

- [ ] **Step 4: Update `director.based` in the inline director object (if present)**

If `index.html` has a `director` object inline, change:
```js
based: "Yerevan / Amsterdam"
```
to:
```js
based: "Yerevan · Amsterdam"
```

- [ ] **Step 5: Verify no TypeScript errors in `films.ts`**

Run:
```bash
cd /Users/e.kim/Desktop/noumenon && npx tsc --noEmit
```
Expected: no errors. If errors, check `films.ts` — `rentPrice` should be absent from interface and both film objects.

- [ ] **Step 6: Verify `films.ts` baseline**

`films.ts` was already updated prior to this task. Confirm its current state:
```bash
cd /Users/e.kim/Desktop/noumenon && grep -n "rentPrice\|videoPreview\|based" src/data/films.ts
```
Expected output should show NO `rentPrice` lines, one `videoPreview` line on The Drift, and `based: "Yerevan · Amsterdam"`.

- [ ] **Step 7: Commit**

```bash
cd /Users/e.kim/Desktop/noumenon
git add src/pages/index.html
git commit -m "chore: sync index.html inline data — remove rentPrice, add videoPreview, update director.based"
```

---

### Task 2: Sync inline film data in `film.html` to match updated `films.ts`

**Files:**
- Modify: `src/pages/film.html` (inline `<script>` films array)

- [ ] **Step 1: Open `src/pages/film.html` and locate the inline films array**

It lives inside a `<script>` tag. Both film objects will have `rentPrice: 3.99`.

- [ ] **Step 2: Remove `rentPrice` from both film objects**

Delete both lines:
```js
rentPrice: 3.99,
```

- [ ] **Step 3: Add `videoPreview` to The Drift film object**

In the `the-drift` object, add:
```js
videoPreview: '/video/drift-trailer.mp4',
```

- [ ] **Step 4: Update `director.based` if present in the inline data**

Change `"Yerevan / Amsterdam"` to `"Yerevan · Amsterdam"`.

- [ ] **Step 5: Commit**

```bash
cd /Users/e.kim/Desktop/noumenon
git add src/pages/film.html
git commit -m "chore: sync film.html inline data — remove rentPrice, add videoPreview"
```

---

## Chunk 2: Homepage — Acts 1 & 2

### Task 3: Rewrite `index.html` — base structure and Act 1 (Atmospheric Entry)

**Files:**
- Modify: `src/pages/index.html` (full rewrite of `<body>` content; keep `<head>`, fonts, Tailwind CDN, CSS variables)

**Before starting:** Copy the existing `index.html` to `src/pages/index.html.bak` as a reference.

```bash
cp src/pages/index.html src/pages/index.html.bak
```

- [ ] **Step 1: Keep the `<head>` section entirely as-is**

Fonts, Tailwind CDN link, CSS variables (`--accent`, `--ink`, `--paper`, `--dust`), and the existing `<style>` block all stay. Only the `<body>` content changes.

- [ ] **Step 2: Replace the `<body>` content with the new scroll container**

First, locate the existing nav in `index.html` — it is the `<nav>` element near the top of `<body>`, contains the `noúmenon` logo and the EN/RU toggle buttons. Copy it exactly. Then wrap it with the opacity/pointer-events inline styles:

```html
<body>
  <!-- Fixed nav (hidden initially, revealed after Act 1) -->
  <!-- COPY the existing <nav> element here, then add these inline styles to it: -->
  <nav id="main-nav" style="opacity:0;pointer-events:none;transition:opacity 0.8s ease;">
    <!-- ... existing nav content ... -->
  </nav>

  <!-- Scroll container -->
  <main id="scroll-container">
    <section id="act1" class="act act--entry">...</section>
    <section id="act2" class="act act--director">...</section>
    <section id="act3" class="act act--film" data-film-index="0">...</section>
    <section id="act4" class="act act--breath">...</section>
    <section id="act5" class="act act--film" data-film-index="1">...</section>
    <section id="act6" class="act act--close">...</section>
  </main>

  <!-- existing grain overlay -->
  <!-- existing cursor HTML -->
  <!-- scripts at bottom -->
</body>
```

- [ ] **Step 3: Add Act 1 HTML — Atmospheric Entry**

```html
<section id="act1" class="act act--entry">
  <div class="act1-grain"></div>
  <div class="act1-content">
    <p class="act1-tagline" id="act1-tagline"></p>
    <div class="act1-logo">
      <span class="logo-word">noúmenon</span>
      <span class="logo-sub" data-en="by Armenak" data-ru="от Арменака">by Armenak</span>
    </div>
  </div>
  <div class="act1-scroll-hint" data-en="scroll to begin ↓" data-ru="прокрутите ↓">scroll to begin ↓</div>
</section>
```

- [ ] **Step 4: Add Act 1 CSS to the existing `<style>` block**

```css
/* ---- ACT BASE ---- */
.act { min-height: 100vh; position: relative; overflow: hidden; }

/* ---- ACT 1 ---- */
.act--entry {
  background: #060606;
  display: flex; align-items: center; justify-content: center;
}
.act1-grain {
  position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E");
  opacity: 0.8;
}
.act1-content { text-align: center; position: relative; z-index: 1; }
.act1-tagline {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: 18px;
  color: #4a4438; letter-spacing: 1px;
  margin-bottom: 32px; min-height: 28px;
}
.act1-logo { opacity: 0; transform: scale(0.97); transition: opacity 1.5s ease, transform 1.5s ease; }
.act1-logo.visible { opacity: 1; transform: scale(1); }
.logo-word {
  display: block;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(36px, 6vw, 64px);
  color: var(--paper); letter-spacing: 6px; font-weight: 300;
}
.logo-sub {
  display: block; margin-top: 6px;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px; letter-spacing: 5px;
  color: #4a4438; text-transform: uppercase;
  opacity: 0; transition: opacity 1.5s ease 0.3s;
}
.act1-logo.visible .logo-sub { opacity: 1; }
.act1-scroll-hint {
  position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
  font-size: 10px; letter-spacing: 3px; color: #3a3030; text-transform: uppercase;
  animation: pulse 2.5s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
```

- [ ] **Step 5: Add Act 1 JS — typewriter + logo reveal + nav trigger**

Add this JS inside a `<script>` tag at the bottom of `<body>`:

```js
// ---- ACT 1: Typewriter + logo reveal ----
const ACT1_TAGLINE = { en: '"Some stories refuse to be forgotten."', ru: '«Некоторые истории отказываются быть забытыми.»' };

function runAct1() {
  const el = document.getElementById('act1-tagline');
  const logo = document.querySelector('.act1-logo');
  const lang = localStorage.getItem('noumenon-lang') || 'en';
  const text = ACT1_TAGLINE[lang];
  let i = 0;
  el.textContent = '';
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      setTimeout(() => logo.classList.add('visible'), 1200);
    }
  }, 60);
}

window.addEventListener('load', () => setTimeout(runAct1, 300));

// ---- NAV: hide during Act 1, reveal after ----
const nav = document.getElementById('main-nav');
const act1Section = document.getElementById('act1');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      nav.style.opacity = '0';
      nav.style.pointerEvents = 'none';
    } else {
      nav.style.opacity = '1';
      nav.style.pointerEvents = 'auto';
    }
  });
}, { threshold: 0.8 });
navObserver.observe(act1Section);
```

- [ ] **Step 6: Start dev server and verify Act 1 in browser**

```bash
cd /Users/e.kim/Desktop/noumenon && npm run dev
```

Open `http://localhost:3000`. Verify:
- Black screen on load
- Typewriter text appears char by char
- Logo fades in after typewriter completes
- Nav is hidden while Act 1 is in view
- Nav appears when scrolling past Act 1

- [ ] **Step 7: Commit**

```bash
cd /Users/e.kim/Desktop/noumenon
git add src/pages/index.html
git commit -m "feat: homepage Act 1 — atmospheric entry with typewriter and nav reveal"
```

---

### Task 4: Homepage — Act 2 (The Director's World)

**Files:**
- Modify: `src/pages/index.html`

- [ ] **Step 1: Add Act 2 HTML**

```html
<section id="act2" class="act act--director">
  <div class="act2-parallax" id="act2-parallax"></div>
  <div class="act2-overlay"></div>
  <div class="act2-content">
    <div class="act2-name" id="act2-name"></div>
    <p class="act2-bio" data-en="A filmmaker working at the intersection of documentary and fiction — searching for the moment truth becomes story." data-ru="Режиссёр, работающий на пересечении документального и игрового кино — в поисках момента, когда правда становится историей.">
      A filmmaker working at the intersection of documentary and fiction — searching for the moment truth becomes story.
    </p>
    <p class="act2-location" id="act2-location">Yerevan · Amsterdam</p>
  </div>
</section>
```

- [ ] **Step 2: Add Act 2 CSS**

```css
/* ---- ACT 2 ---- */
.act--director {
  background: #080808;
  display: flex; align-items: flex-end;
}
.act2-parallax {
  position: absolute; inset: -20%; /* oversized for parallax movement */
  background: linear-gradient(135deg, #1a1510 0%, #0a0808 60%, #060606 100%);
  will-change: transform;
}
.act2-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, #080808 0%, rgba(8,8,8,0.3) 60%, transparent 100%);
}
.act2-content {
  position: relative; z-index: 1;
  padding: 0 8vw 80px;
  max-width: 640px;
}
.act2-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(32px, 5vw, 56px);
  color: var(--paper); letter-spacing: 8px;
  text-transform: uppercase;
  margin-bottom: 20px; min-height: 60px;
}
.act2-name span { opacity: 0; transition: opacity 0.3s ease; display: inline-block; }
.act2-name span.visible { opacity: 1; }
.act2-bio {
  font-family: 'Montserrat', sans-serif; font-weight: 300;
  font-size: 14px; color: #8a8070; line-height: 1.9;
  letter-spacing: 0.3px; margin-bottom: 16px;
  opacity: 0; transform: translateY(12px);
  transition: opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s;
}
.act2-bio.visible { opacity: 1; transform: translateY(0); }
.act2-location {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px; letter-spacing: 4px;
  color: #4a4030; text-transform: uppercase;
  opacity: 0; transition: opacity 0.8s ease 0.7s;
}
.act2-location.visible { opacity: 1; }
```

- [ ] **Step 3: Add Act 2 JS — letter reveal + parallax**

```js
// ---- ACT 2: Letter reveal + parallax ----
function buildLetterSpans(text) {
  return text.split('').map(ch =>
    `<span>${ch === ' ' ? '&nbsp;' : ch}</span>`
  ).join('');
}

const act2Name = document.getElementById('act2-name');
act2Name.innerHTML = buildLetterSpans('Armenak');

const act2Observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    // Reveal letters staggered
    act2Name.querySelectorAll('span').forEach((s, i) => {
      setTimeout(() => s.classList.add('visible'), i * 80);
    });
    // Reveal bio + location
    document.querySelector('.act2-bio').classList.add('visible');
    document.querySelector('.act2-location').classList.add('visible');
    act2Observer.disconnect();
  });
}, { threshold: 0.2 });
act2Observer.observe(document.getElementById('act2'));

// Parallax — desktop only
function isMobile() { return window.innerWidth < 768; }
const act2Parallax = document.getElementById('act2-parallax');
let rafPending = false;
window.addEventListener('scroll', () => {
  if (isMobile() || rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    const act2 = document.getElementById('act2');
    const rect = act2.getBoundingClientRect();
    const progress = -rect.top / window.innerHeight;
    act2Parallax.style.transform = `translateY(${progress * 40 * 0.4}px)`;
    rafPending = false;
  });
});
```

- [ ] **Step 4: Update language toggle to handle Act 2 content**

In the existing `setLanguage()` function, after updating `[data-en]`/`[data-ru]` elements, add:
```js
// Update Act 2 location from director data
const locationEl = document.getElementById('act2-location');
if (locationEl) locationEl.textContent = director.based; // always uses · separator now
```

- [ ] **Step 5: Verify Act 2 in browser**

Scroll past Act 1. Verify:
- `ARMENAK` letters appear one by one
- Bio text fades up
- Location line fades in
- On desktop: background image drifts upward as you scroll through Act 2
- On mobile (resize to < 768px): no parallax movement

- [ ] **Step 6: Commit**

```bash
cd /Users/e.kim/Desktop/noumenon
git add src/pages/index.html
git commit -m "feat: homepage Act 2 — director section with letter reveal and parallax"
```

---

## Chunk 3: Homepage — Acts 3, 4, 5

### Task 5: Homepage — Act 3 (Film #1 Viewport Takeover)

**Files:**
- Modify: `src/pages/index.html`

- [ ] **Step 1: Add Act 3 HTML**

This section is generated dynamically from the films array. Add a placeholder that JS will populate:

```html
<section id="act3" class="act act--film" data-film-index="0">
  <!-- populated by renderFilmAct() -->
</section>
```

- [ ] **Step 2: Add film takeover CSS**

```css
/* ---- ACT 3 & 5: Film Takeover ---- */
.act--film {
  display: flex; flex-direction: column;
  justify-content: flex-end;
  padding: 0 8vw 80px;
}
.film-act-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  transition: opacity 1.2s ease;
}
.film-act-bg-video {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; opacity: 0;
  transition: opacity 1s ease;
}
/* Video fades to full opacity when playing; poster sits at 0.65 opacity on top */
.film-act-bg-video.playing { opacity: 1; }
.film-act-poster {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  clip-path: inset(0 50% 0 50%);
  transition: clip-path 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.65; /* semi-transparent so video shows through beneath */
}
.film-act-poster.revealed { clip-path: inset(0 0% 0 0%); }
.film-act-gradient {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(6,4,4,0.95) 0%, rgba(6,4,4,0.3) 55%, transparent 100%);
}
.film-act-accent-line {
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  opacity: 0.5;
}
.film-act-year {
  position: absolute; top: 24px; left: 8vw;
  font-size: 9px; letter-spacing: 4px; color: #4a4030; text-transform: uppercase;
}
.film-act-award {
  position: absolute; top: 20px; right: 8vw;
  padding: 5px 12px; font-size: 9px; letter-spacing: 1px;
  border: 1px solid; border-radius: 2px;
  opacity: 0; transition: opacity 0.6s ease 0.8s;
}
.film-act-award.visible { opacity: 1; }
.film-act-content { position: relative; z-index: 1; }
.film-act-genre {
  font-size: 9px; letter-spacing: 4px; text-transform: uppercase;
  margin-bottom: 14px;
  opacity: 0; transform: translateY(16px);
  transition: opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s;
}
.film-act-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(40px, 7vw, 80px);
  color: var(--paper); letter-spacing: 2px;
  line-height: 1; margin-bottom: 12px;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s;
}
.film-act-tagline {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: 15px;
  color: #9a9080; margin-bottom: 32px;
  opacity: 0; transform: translateY(16px);
  transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
}
.film-act-btns {
  display: flex; gap: 14px; flex-wrap: wrap;
  opacity: 0; transform: translateY(12px);
  transition: opacity 0.6s ease 0.65s, transform 0.6s ease 0.65s;
}
.film-act-genre.visible,
.film-act-title.visible,
.film-act-tagline.visible,
.film-act-btns.visible { opacity: 1; transform: translateY(0); }

.btn-view-film {
  padding: 11px 24px; font-size: 10px; letter-spacing: 2.5px;
  text-transform: uppercase; text-decoration: none;
  border: 1px solid rgba(245,240,232,0.3); color: var(--paper);
  transition: border-color 0.3s, background 0.3s;
}
.btn-view-film:hover { border-color: rgba(245,240,232,0.7); }
.btn-buy-film {
  padding: 11px 24px; font-size: 10px; letter-spacing: 2.5px;
  text-transform: uppercase; text-decoration: none;
  background: var(--paper); color: var(--ink); font-weight: 600;
  border: 1px solid transparent;
  transition: opacity 0.3s;
}
.btn-buy-film:hover { opacity: 0.85; }

@media (max-width: 768px) {
  .film-act-btns { flex-direction: column; gap: 10px; }
  .btn-view-film, .btn-buy-film { text-align: center; }
}
```

- [ ] **Step 3: Add `renderFilmAct()` JS function**

This reads from the inline `films` array and populates each `.act--film` section:

```js
function renderFilmAct(section, film) {
  const lang = localStorage.getItem('noumenon-lang') || 'en';
  const title = lang === 'ru' ? film.titleRu : film.title;
  const tagline = lang === 'ru' ? film.taglineRu : film.tagline;
  const genre = lang === 'ru' ? film.genreRu : film.genre;
  const duration = film.duration + ' ' + (lang === 'ru' ? 'мин' : 'min');
  const hasAward = film.awards && film.awards.length > 0;

  section.style.position = 'relative';

  section.innerHTML = `
    <div class="film-act-accent-line" style="background:${film.accentColor}"></div>
    <div class="film-act-year">${film.year}</div>
    ${hasAward ? `<div class="film-act-award" style="color:${film.accentColor};border-color:${film.accentColor}33">${film.awards[0].source}</div>` : ''}
    ${film.videoPreview ? `<video class="film-act-bg-video" src="${film.videoPreview}" muted playsinline loop></video>` : ''}
    <div class="film-act-poster" style="background-image:url('${film.poster}')"></div>
    <div class="film-act-gradient"></div>
    <div class="film-act-content">
      <div class="film-act-genre" style="color:${film.accentColor}">${genre} · ${duration}</div>
      <div class="film-act-title">${title}</div>
      <div class="film-act-tagline">${tagline}</div>
      <div class="film-act-btns">
        <a href="/film/${film.slug}" class="btn-view-film" data-en="View Film →" data-ru="Смотреть →">View Film →</a>
        <a href="#" class="btn-buy-film" onclick="handlePurchase('buy'); return false;">Buy $${film.buyPrice.toFixed(2)}</a>
      </div>
    </div>
  `;
}

// Render all film acts
document.querySelectorAll('.act--film').forEach(section => {
  const idx = parseInt(section.dataset.filmIndex);
  if (films[idx]) renderFilmAct(section, films[idx]);
});
```

- [ ] **Step 4: Add IntersectionObserver for film act reveal + video**

```js
document.querySelectorAll('.act--film').forEach(section => {
  const filmObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        // Reveal poster
        section.querySelector('.film-act-poster')?.classList.add('revealed');
        // Reveal content elements
        ['film-act-genre','film-act-title','film-act-tagline','film-act-btns'].forEach(cls => {
          section.querySelector('.' + cls)?.classList.add('visible');
        });
        // Show award badge
        section.querySelector('.film-act-award')?.classList.add('visible');
        // Play video if present
        const video = section.querySelector('.film-act-bg-video');
        if (video) { video.play().catch(()=>{}); video.classList.add('playing'); }
      } else {
        // Pause video when out of view
        const video = section.querySelector('.film-act-bg-video');
        if (video) { video.pause(); video.classList.remove('playing'); }
      }
    });
  }, { threshold: 0.8 });
  filmObserver.observe(section);
});
```

- [ ] **Step 5: Verify Act 3 in browser**

Scroll to Act 3 (`data-film-index="0"` = The Lyrics). Verify:
- Poster bleeds in from center on entry (clip-path reveal)
- Genre, title, tagline, buttons fade up in sequence
- **No video** for The Lyrics (it has no `videoPreview`) — poster is the only background
- "View Film →" links to `/film/the-lyrics`
- "Buy $9.99" calls `handlePurchase('buy')`
- Award badge hidden (both films have empty awards array)

Scroll to Act 5 (`data-film-index="1"` = The Drift). Verify:
- The Drift poster reveals
- Video trailer plays silently behind poster (accent: #c47a4a warm brown)
- "View Film →" links to `/film/the-drift`

- [ ] **Step 6: Commit**

```bash
cd /Users/e.kim/Desktop/noumenon
git add src/pages/index.html
git commit -m "feat: homepage Acts 3 & 5 — film viewport takeovers with poster reveal and video"
```

---

### Task 6: Homepage — Act 4 (Interstitial Breath) + Act 6 (The Close)

**Files:**
- Modify: `src/pages/index.html`

- [ ] **Step 1: Add Act 4 HTML**

```html
<section id="act4" class="act act--breath">
  <div class="act4-grain"></div>
  <!-- Empty on load — JS sets the correct language text on IntersectionObserver trigger -->
  <blockquote class="act4-quote" id="act4-quote"></blockquote>
</section>
```

- [ ] **Step 2: Add Act 4 CSS**

```css
/* ---- ACT 4: Interstitial ---- */
.act--breath {
  min-height: 60vh;
  background: #040404;
  display: flex; align-items: center; justify-content: center;
  padding: 80px 8vw;
}
.act4-grain {
  position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.1'/%3E%3C/svg%3E");
}
.act4-quote {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: clamp(18px, 3vw, 28px);
  color: #1a1814; text-align: center;
  max-width: 640px; line-height: 1.7; letter-spacing: 0.5px;
  border: none; margin: 0; padding: 0;
  position: relative; z-index: 1;
  opacity: 0; transform: translateY(12px);
  transition: opacity 1.2s ease, transform 1.2s ease, color 1.2s ease;
}
.act4-quote.visible { opacity: 1; transform: translateY(0); color: #8a8070; }
```

- [ ] **Step 3: Add Act 4 JS — quote population + reveal**

```js
// ---- ACT 4: Quote reveal ----
function getAct4Quote(lang) {
  // Use first award quote if available, otherwise fallback
  for (const film of films) {
    if (film.awards && film.awards.length > 0) {
      return lang === 'ru' ? film.awards[0].quoteRu : film.awards[0].quote;
    }
  }
  return lang === 'ru'
    ? '«Между звуком и тишиной есть момент, когда всё становится правдой.»'
    : '"Between sound and silence, there is a moment where everything is true."';
}

const act4QuoteEl = document.getElementById('act4-quote');
const act4Observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const lang = localStorage.getItem('noumenon-lang') || 'en';
    act4QuoteEl.textContent = getAct4Quote(lang);
    act4QuoteEl.classList.add('visible');
    act4Observer.disconnect();
  });
}, { threshold: 0.3 });
act4Observer.observe(document.getElementById('act4'));
```

- [ ] **Step 4: Add Act 6 HTML — The Close**

```html
<section id="act6" class="act act--close">
  <div class="act6-grain"></div>
  <div class="act6-content">
    <div class="act6-logo">NOÚMENON</div>
    <div class="act6-name" data-en="by Armenak" data-ru="от Арменака">by Armenak</div>
    <p class="act6-line" data-en="New films in production." data-ru="Новые фильмы в производстве.">New films in production.</p>
    <a href="mailto:press@noumenon.film" class="act6-contact" data-en="Press & Inquiries" data-ru="Пресса и запросы">Press & Inquiries</a>
  </div>
</section>
```

- [ ] **Step 5: Add Act 6 CSS**

```css
/* ---- ACT 6: The Close ---- */
.act--close {
  min-height: 80vh;
  background: #040404;
  display: flex; align-items: center; justify-content: center;
}
.act6-grain {
  position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E");
}
.act6-content {
  position: relative; z-index: 1;
  text-align: center; display: flex;
  flex-direction: column; align-items: center; gap: 16px;
}
.act6-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(40px, 8vw, 88px);
  color: var(--paper); letter-spacing: 10px; font-weight: 300;
  opacity: 0; transform: translateY(20px);
  transition: opacity 1s ease, transform 1s ease;
}
.act6-name {
  font-family: 'Montserrat', sans-serif; font-weight: 300;
  font-size: 11px; letter-spacing: 5px; color: #4a4030;
  text-transform: uppercase;
  opacity: 0; transition: opacity 1s ease 0.3s;
}
.act6-line {
  font-family: 'Montserrat', sans-serif; font-size: 12px;
  color: #3a3028; letter-spacing: 1px; margin-top: 8px;
  opacity: 0; transition: opacity 1s ease 0.5s;
}
.act6-contact {
  font-size: 9px; letter-spacing: 3px; color: #5a5040;
  text-transform: uppercase; text-decoration: none;
  opacity: 0; transition: opacity 1s ease 0.7s, color 0.3s;
  margin-top: 8px;
}
.act6-contact:hover { color: #8a8070; }
.act6-logo.visible { opacity: 1; transform: translateY(0); }
.act6-name.visible, .act6-line.visible, .act6-contact.visible { opacity: 1; }
```

- [ ] **Step 6: Add Act 6 JS — reveal on scroll**

```js
// ---- ACT 6: Reveal ----
const act6Observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    document.querySelector('.act6-logo').classList.add('visible');
    document.querySelector('.act6-name').classList.add('visible');
    document.querySelector('.act6-line').classList.add('visible');
    document.querySelector('.act6-contact').classList.add('visible');
    act6Observer.disconnect();
  });
}, { threshold: 0.2 });
act6Observer.observe(document.getElementById('act6'));
```

- [ ] **Step 7: Verify Acts 4 and 6 in browser**

Scroll through the full page. Verify:
- Act 4: dark section between films, quote fades in from near-black to visible gray
- Act 6: logo, name, tagline, contact link all fade in on scroll entry
- Full scroll journey flows: Act 1 → 2 → 3 → 4 → 5 → 6

- [ ] **Step 8: Commit**

```bash
cd /Users/e.kim/Desktop/noumenon
git add src/pages/index.html
git commit -m "feat: homepage Acts 4 & 6 — interstitial breath and end credits close"
```

---

## Chunk 4: Film Detail Page Evolution

### Task 7: Film Detail — Read Progress Bar

**Files:**
- Modify: `src/pages/film.html`

- [ ] **Step 1: Add progress bar HTML just inside the `<nav>` element**

Find the closing `</nav>` tag in `film.html` and insert before it:
```html
<div id="read-progress" style="
  position: absolute; bottom: 0; left: 0; height: 1px;
  width: 0%; transition: width 0.1s linear;
  background: var(--film-accent, #c4b08a);
"></div>
```

The `var(--film-accent)` CSS variable will be set dynamically by the existing JS that reads `film.accentColor`.

- [ ] **Step 2: Set `--film-accent` CSS variable from film data**

In `film.html`, search for the string `accentColor` — it is referenced in the JS block that identifies the current film from the slug. It will look something like:
```js
const film = films.find(f => f.slug === slug);
```
Immediately after that line (once `film` is confirmed non-null), add:
```js
document.documentElement.style.setProperty('--film-accent', film.accentColor);
```
`film.accentColor` is `"#c4b08a"` for The Lyrics and `"#c47a4a"` for The Drift — both values exist in `films.ts` and the inline data.

- [ ] **Step 3: Add scroll listener for progress bar**

```js
// ---- Read progress bar ----
const progressBar = document.getElementById('read-progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
});
```

- [ ] **Step 4: Verify in browser**

Navigate to `http://localhost:3000/film/the-lyrics`. Scroll down the page. Verify:
- A thin colored line fills left-to-right beneath the nav as you scroll
- Color matches the film's accent color (`#c4b08a` for The Lyrics, `#c47a4a` for The Drift)
- Bar reaches 100% at the bottom of the page

- [ ] **Step 5: Commit**

```bash
cd /Users/e.kim/Desktop/noumenon
git add src/pages/film.html
git commit -m "feat: film detail — scroll-driven read progress bar"
```

---

### Task 8: Film Detail — Replace Rent/Buy with Single Buy Card

**Files:**
- Modify: `src/pages/film.html`

- [ ] **Step 1: Find the price section in `film.html`**

Search for `rentPrice` in `film.html` — this will locate the exact function and lines that render the old two-card layout. The function rendering prices will reference both `f.rentPrice` and `f.buyPrice`. That entire function (and its call site) is what gets replaced in Step 2. `buyPrice` is confirmed present on both film objects (`buyPrice: 9.99`).

- [ ] **Step 2: Replace the two-card layout with a single buy card**

Find the price section render code and replace it with:
```js
function renderPriceSection(film) {
  const lang = localStorage.getItem('noumenon-lang') || 'en';
  return `
    <div class="price-section">
      <div class="buy-card">
        <div class="buy-label" data-en="Own Forever" data-ru="Навсегда">
          ${lang === 'ru' ? 'Навсегда' : 'Own Forever'}
        </div>
        <div class="buy-amount">$${film.buyPrice.toFixed(2)}</div>
        <p class="buy-desc" data-en="Permanent access. Support independent cinema directly." data-ru="Постоянный доступ. Поддержите независимое кино напрямую.">
          ${lang === 'ru' ? 'Постоянный доступ. Поддержите независимое кино напрямую.' : 'Permanent access. Support independent cinema directly.'}
        </p>
        <button class="buy-btn" onclick="handlePurchase('buy')">
          ${lang === 'ru' ? 'Купить фильм' : 'Buy Film'}
        </button>
      </div>
    </div>
  `;
}
```

- [ ] **Step 3: Add CSS for the single buy card**

In the `<style>` block of `film.html`:
```css
.price-section { padding: 80px 8vw; }
.buy-card {
  max-width: 420px;
  border: 1px solid #2a2418;
  padding: 40px;
  background: #0f0c08;
}
.buy-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 9px; letter-spacing: 3px;
  color: #6a6050; text-transform: uppercase;
  margin-bottom: 16px;
}
.buy-amount {
  font-family: 'Cormorant Garamond', serif;
  font-size: 56px; color: var(--paper);
  line-height: 1; margin-bottom: 16px;
}
.buy-desc {
  font-family: 'Montserrat', sans-serif; font-weight: 300;
  font-size: 12px; color: #5a5040; line-height: 1.8;
  margin-bottom: 28px;
}
.buy-btn {
  width: 100%; padding: 14px;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
  background: var(--paper); color: var(--ink);
  border: none; cursor: pointer; font-weight: 600;
  transition: opacity 0.3s;
}
.buy-btn:hover { opacity: 0.85; }
```

- [ ] **Step 4: Remove old rent CSS**

Delete or comment out any CSS classes that were only used by the rent card (e.g., `.rent-card`, `.price-grid`, `.price-card--rent`).

- [ ] **Step 5: Verify in browser**

Navigate to `/film/the-lyrics`. Scroll to the price section. Verify:
- Single buy card visible — "Own Forever" label, `$9.99`, description, "Buy Film" button
- No rent card anywhere on the page
- Toggle EN/RU and verify labels update

- [ ] **Step 6: Commit**

```bash
cd /Users/e.kim/Desktop/noumenon
git add src/pages/film.html
git commit -m "feat: film detail — replace rent/buy grid with single buy card"
```

---

### Task 9: Film Detail — Awards Section

**Files:**
- Modify: `src/pages/film.html`

- [ ] **Step 1: Add awards render function**

In the JS in `film.html`, add:
```js
function renderAwards(film) {
  if (!film.awards || film.awards.length === 0) return '';
  const lang = localStorage.getItem('noumenon-lang') || 'en';
  const awardsHtml = film.awards.map(a => `
    <div class="award-item">
      <blockquote class="award-quote">${lang === 'ru' ? a.quoteRu : a.quote}</blockquote>
      <cite class="award-source">${a.source}</cite>
    </div>
  `).join('');
  return `
    <div class="awards-section">
      <div class="awards-label" data-en="Recognition" data-ru="Признание">
        ${lang === 'ru' ? 'Признание' : 'Recognition'}
      </div>
      ${awardsHtml}
    </div>
  `;
}
```

- [ ] **Step 2: Insert awards section into the detail page render**

After the synopsis/metadata section and before the footer, call `renderAwards(film)`. It returns an empty string when `film.awards` is empty, so nothing renders for current films — correct behavior per spec.

- [ ] **Step 3: Add awards CSS**

Visibility is controlled entirely by JS (`renderAwards()` returns `''` when no awards exist, so the section is simply never inserted into the DOM). No CSS show/hide logic needed.

```css
.awards-section {
  padding: 60px 8vw;
  border-top: 1px solid #1a1814;
}
.awards-label {
  font-size: 9px; letter-spacing: 3px; color: #4a4030;
  text-transform: uppercase; margin-bottom: 32px;
}
.award-item {
  border-left: 2px solid var(--film-accent, #c4b08a);
  padding-left: 24px; margin-bottom: 32px;
}
.award-quote {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: 20px;
  color: #8a8070; line-height: 1.6;
  border: none; margin: 0 0 10px 0; padding: 0;
}
.award-source {
  font-size: 9px; letter-spacing: 2px; color: #4a4030;
  text-transform: uppercase; font-style: normal;
}
```

**Note:** The awards section will not visually appear until real award data is added to `films.ts`. This is correct — the section is conditionally rendered.

- [ ] **Step 4: Verify section is absent in browser (correct behavior)**

Navigate to `/film/the-lyrics`. Verify awards section is NOT visible (both films have empty awards arrays). Open devtools and confirm `renderAwards()` returns `''`.

- [ ] **Step 5: Commit**

```bash
cd /Users/e.kim/Desktop/noumenon
git add src/pages/film.html
git commit -m "feat: film detail — conditional awards section"
```

---

## Chunk 5: Language Toggle + Final Polish

### Task 10: Update Language Toggle for New Homepage Sections

**Files:**
- Modify: `src/pages/index.html`

The existing `setLanguage()` function handles `[data-en]`/`[data-ru]` attribute swapping. The new scroll sections use these attributes, so they should largely work. However, Act 1's typewriter effect needs special handling.

- [ ] **Step 1: Make Act 1 typewriter re-run on language change**

In the existing `setLanguage(lang)` function, after updating `[data-en]`/`[data-ru]` text, add:
```js
// Re-run Act 1 typewriter if Act 1 is still in view
const act1El = document.getElementById('act1');
if (act1El) {
  const rect = act1El.getBoundingClientRect();
  if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
    document.querySelector('.act1-logo').classList.remove('visible');
    runAct1();
  }
}
```

- [ ] **Step 2: Ensure film act content re-renders on language change**

After language switch, re-render film act content and re-apply any CSS reveal classes that were active before the re-render. `renderFilmAct()` replaces `innerHTML`, which destroys `.revealed` and `.visible` classes that were added by the IntersectionObserver. The section element itself is not replaced, so the observer reference remains valid — but the child elements are new and start hidden. Re-apply the classes immediately after re-render if the section was already in view:

```js
// In setLanguage(), after updating [data-en]/[data-ru]:
document.querySelectorAll('.act--film').forEach(section => {
  const idx = parseInt(section.dataset.filmIndex);
  if (!films[idx]) return;

  // Track which classes were active before re-render
  const wasRevealed = section.querySelector('.film-act-poster')?.classList.contains('revealed');
  const wasVisible = section.querySelector('.film-act-title')?.classList.contains('visible');

  renderFilmAct(section, films[idx]);

  // Re-apply reveal state if section was already scrolled into view
  if (wasRevealed) {
    section.querySelector('.film-act-poster')?.classList.add('revealed');
  }
  if (wasVisible) {
    ['film-act-genre','film-act-title','film-act-tagline','film-act-btns'].forEach(cls => {
      section.querySelector('.' + cls)?.classList.add('visible');
    });
    section.querySelector('.film-act-award')?.classList.add('visible');
    // Re-start video if present
    const video = section.querySelector('.film-act-bg-video');
    if (video) { video.play().catch(()=>{}); video.classList.add('playing'); }
  }
});
```

- [ ] **Step 3: Update Act 4 quote on language change**

In `setLanguage()`, add:
```js
const act4El = document.getElementById('act4-quote');
if (act4El && act4El.classList.contains('visible')) {
  act4El.textContent = getAct4Quote(lang);
}
```

- [ ] **Step 4: Verify language toggle across all acts**

Toggle EN → RU. Verify:
- Act 2 bio text changes language
- Act 2 location stays `Yerevan · Amsterdam` (no translation needed, separator is `·`)
- Acts 3 & 5: genre, tagline, button labels update
- Act 4: quote updates if already revealed
- Act 6: name, line, contact label update

- [ ] **Step 5: Commit**

```bash
cd /Users/e.kim/Desktop/noumenon
git add src/pages/index.html
git commit -m "feat: language toggle updates for new scroll sections"
```

---

### Task 11: Remove Old Carousel Code + Final Cleanup

**Files:**
- Modify: `src/pages/index.html`

- [ ] **Step 1: Delete the old hero carousel HTML**

The old `<section class="hero-carousel">` or equivalent (the full-screen sliding carousel from the original homepage) should now be gone — replaced by the 6-act structure. Confirm it is not present in the current file. If any leftover carousel container HTML remains from the original, delete it.

- [ ] **Step 2: Delete unused carousel JS**

Remove any JS functions that were only used for the old carousel: functions like `initCarousel()`, `goToSlide()`, `startCarouselTimer()`, `updateHeroContent()` etc. The new Acts 3/5 use their own `renderFilmAct()` + `IntersectionObserver`. Keep `handlePurchase()` — it is still used.

- [ ] **Step 3: Delete unused carousel CSS**

Remove CSS classes that were only used by the old homepage carousel. Keep: CSS variables, font imports, `.act` classes, cursor styles, grain overlay styles.

- [ ] **Step 4: Delete `src/pages/index.html.bak`**

```bash
rm /Users/e.kim/Desktop/noumenon/src/pages/index.html.bak
```

- [ ] **Step 5: Final full-page verification**

Visit `http://localhost:3000`. Walk through the complete experience:
1. Act 1: black screen, typewriter, logo fade-in, nav hidden
2. Act 2: scroll in, letters reveal, bio fades up, parallax moves (desktop)
3. Act 3: poster reveals from center, content stacks up, buttons appear
4. Act 4: quote fades in from near-invisible
5. Act 5: The Drift takeover, video plays, accent color changes
6. Act 6: end credits logo, name, tagline, contact link

Also verify `/film/the-lyrics` and `/film/the-drift`:
- Progress bar fills on scroll
- Single buy card visible (no rent)
- Hero carousel intact
- Awards section absent (both films have empty awards)

- [ ] **Step 6: Commit**

```bash
cd /Users/e.kim/Desktop/noumenon
git add src/pages/index.html
git commit -m "chore: remove old carousel code and clean up unused CSS/JS"
```

---

### Task 12: Git Push to GitHub

- [ ] **Step 1: Push all commits to origin**

```bash
cd /Users/e.kim/Desktop/noumenon
git push origin main
```

Expected: all commits from Tasks 1–11 pushed to `git@github-ujine:Ujine-Kim/Films.git`

- [ ] **Step 2: Verify on GitHub**

Open `https://github.com/Ujine-Kim/Films` and confirm the latest commits are visible.

- [ ] **Step 3: Verify Vercel auto-deploy (if connected)**

If the Vercel project is connected to the GitHub repo, check the Vercel dashboard for a new deployment triggered by the push. Otherwise deploy manually via Vercel CLI or dashboard.
