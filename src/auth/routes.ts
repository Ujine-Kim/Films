import { Router, Request, Response } from 'express';
import { sendMagicCode, verifyMagicCode } from './magic-link';
import { signToken, setAuthCookie, clearAuthCookie, requireAuth } from './middleware';

const router = Router();

router.post('/send-code', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Email required' });
    return;
  }
  try {
    await sendMagicCode(email.toLowerCase().trim());
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to send code:', err);
    res.status(500).json({ error: 'Failed to send code' });
  }
});

router.post('/verify', async (req: Request, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code) {
    res.status(400).json({ error: 'Email and code required' });
    return;
  }
  try {
    const user = await verifyMagicCode(email.toLowerCase().trim(), code.trim());
    if (!user) {
      res.status(401).json({ error: 'Invalid or expired code' });
      return;
    }
    const token = signToken(user as { id: number; email: string });
    setAuthCookie(res, token);
    res.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('Verify failed:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

router.get('/me', (req: Request, res: Response) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

router.post('/logout', (_req: Request, res: Response) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

export default router;
