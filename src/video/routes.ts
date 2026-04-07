import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { requireAuth } from '../auth/middleware';
import { getUserAccess } from '../db';
import { films } from '../data/films';

const router = Router();
const VIDEOS_DIR = path.join(__dirname, '../../videos');

function getContentType(filePath: string): string {
  if (filePath.endsWith('.mov')) return 'video/quicktime';
  if (filePath.endsWith('.webm')) return 'video/webm';
  return 'video/mp4';
}

function streamVideo(filePath: string, req: Request, res: Response) {
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
  const contentType = getContentType(filePath);

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': contentType,
    });
    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': contentType,
    });
    fs.createReadStream(filePath).pipe(res);
  }
}

// Public: stream trailer
router.get('/:slug/trailer', (req: Request, res: Response) => {
  const film = films.find(f => f.slug === req.params.slug);
  if (!film || !film.trailerFile) {
    res.status(404).json({ error: 'Trailer not found' });
    return;
  }
  streamVideo(path.join(VIDEOS_DIR, film.trailerFile), req, res);
});

// Protected: stream full film
router.get('/:slug/film', requireAuth, async (req: Request, res: Response) => {
  const film = films.find(f => f.slug === req.params.slug);
  if (!film || !film.filmFile) {
    res.status(404).json({ error: 'Film not found' });
    return;
  }

  const access = await getUserAccess(req.user!.userId, req.params.slug);
  if (!access) {
    res.status(403).json({ error: 'Purchase required' });
    return;
  }

  streamVideo(path.join(VIDEOS_DIR, film.filmFile), req, res);
});

export default router;
