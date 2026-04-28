# Phenomenon Films — Filmmaker Website

A cinematic portfolio & film sales site. Dark, editorial aesthetic inspired by siena.film.

🌐 Live: [phenomenonfilms.art](https://phenomenonfilms.art)

## Stack
- **TypeScript** + **Node.js** (Express)
- **Tailwind CSS** (via CDN, no build step needed)
- **Vanilla JS** for interactivity

## Setup

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Structure

```
armenak-film/
├── src/
│   ├── server.ts          # Express server + API routes
│   ├── data/
│   │   └── films.ts       # Film data + types (edit here to add films)
│   └── pages/
│       ├── index.html     # Homepage (hero + film grid + bio)
│       └── film.html      # Film detail (synopsis + buy/rent + awards)
├── public/                # Static assets (images go here)
├── package.json
└── tsconfig.json
```

## Adding a Real Film

1. Edit `src/data/films.ts` — add a new entry to the `films` array
2. Add poster image to `public/` and update `poster` field
3. Restart dev server

## Adding Real Payments (Stripe)

1. `npm install stripe`
2. Add `STRIPE_SECRET_KEY` to `.env`
3. Create a `/api/checkout` endpoint in `server.ts`
4. Replace `handlePurchase()` in `film.html` with a fetch to your endpoint

## Language Support

Both pages support EN/RU switching. All strings have `data-en` / `data-ru` attributes.
Language preference is saved to `localStorage`.

## Deploying

- **Railway** or **Render** — push repo, set `npm start` as start command
- **Vercel** — add `vercel.json` with serverless function config
