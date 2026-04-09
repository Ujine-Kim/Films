import express, { Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { films, director } from './data/films';
import { authMiddleware } from './auth/middleware';
import { initDB } from './db';
import authRoutes from './auth/routes';
import purchaseRoutes from './purchases/routes';
import videoRoutes from './video/routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);
app.use(express.static(path.join(__dirname, '../public')));

// Pages
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/privacy', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'pages', 'privacy.html'));
});

app.get('/film/:slug', (req: Request, res: Response) => {
  const film = films.find(f => f.slug === req.params.slug);
  if (!film) return res.status(404).send('Film not found');
  res.sendFile(path.join(__dirname, 'pages', 'film.html'));
});

// API
app.use('/api/auth', authRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/video', videoRoutes);

app.get('/api/films', (_req: Request, res: Response) => {
  res.json(films);
});

app.get('/api/films/:slug', (req: Request, res: Response) => {
  const film = films.find(f => f.slug === req.params.slug);
  if (!film) return res.status(404).json({ error: 'Film not found' });
  res.json(film);
});

app.get('/api/director', (_req: Request, res: Response) => {
  res.json(director);
});

// Start
async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});

export default app;
