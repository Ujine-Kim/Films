import express, { Request, Response } from 'express';
import path from 'path';
import { films, director } from './data/films';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'html');

// Serve HTML pages directly
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/video/drift-trailer.mp4', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/video/DRIFT ТРЕЙЛЕР.mp4'));
});

app.get('/film/:slug', (req: Request, res: Response) => {
  const film = films.find(f => f.slug === req.params.slug);
  if (!film) return res.status(404).sendFile(path.join(__dirname, 'pages', '404.html'));
  res.sendFile(path.join(__dirname, 'pages', 'film.html'));
});

// API endpoints
app.get('/api/films', (req: Request, res: Response) => {
  res.json(films);
});

app.get('/api/films/:slug', (req: Request, res: Response) => {
  const film = films.find(f => f.slug === req.params.slug);
  if (!film) return res.status(404).json({ error: 'Film not found' });
  res.json(film);
});

app.get('/api/director', (req: Request, res: Response) => {
  res.json(director);
});

app.listen(PORT, () => {
  console.log(`🎬 Server running at http://localhost:${PORT}`);
});

export default app;
