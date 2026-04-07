import { Router, Request, Response } from 'express';
import { requireAuth } from '../auth/middleware';
import { createPurchase, getUserPurchases, getUserAccess } from '../db';
import { films } from '../data/films';

const router = Router();

router.post('/', requireAuth, async (req: Request, res: Response) => {
  const { filmSlug, type } = req.body;
  if (!filmSlug || !['rent', 'buy'].includes(type)) {
    res.status(400).json({ error: 'filmSlug and type (rent/buy) required' });
    return;
  }
  if (!films.find(f => f.slug === filmSlug)) {
    res.status(404).json({ error: 'Film not found' });
    return;
  }
  try {
    // TODO: Integrate Stripe payment before recording purchase
    const purchase = await createPurchase(req.user!.userId, filmSlug, type);
    res.json({ purchase });
  } catch (err) {
    console.error('Purchase failed:', err);
    res.status(500).json({ error: 'Purchase failed' });
  }
});

router.get('/library', requireAuth, async (req: Request, res: Response) => {
  try {
    const purchases = await getUserPurchases(req.user!.userId);
    res.json({ purchases });
  } catch (err) {
    console.error('Failed to get library:', err);
    res.status(500).json({ error: 'Failed to get library' });
  }
});

router.get('/access/:slug', requireAuth, async (req: Request, res: Response) => {
  try {
    const access = await getUserAccess(req.user!.userId, req.params.slug);
    res.json({
      hasAccess: !!access,
      type: access?.type || null,
      expiresAt: access?.expiresAt || null,
    });
  } catch (err) {
    console.error('Access check failed:', err);
    res.status(500).json({ error: 'Access check failed' });
  }
});

export default router;
