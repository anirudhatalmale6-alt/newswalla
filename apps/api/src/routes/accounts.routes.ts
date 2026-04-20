import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { query, queryOne, run } from '../config/database';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
  try {
    const accounts = query(
      `SELECT id, platform, platform_user_id, platform_username, page_id, page_name,
              avatar_url, is_active, created_at
       FROM platform_accounts
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user!.userId]
    );
    res.json(accounts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// OAuth connect - initiates OAuth flow for a platform
router.get('/connect/:platform', async (req: Request, res: Response) => {
  const { platform } = req.params;
  // TODO: Implement OAuth redirect per platform
  res.json({
    message: `OAuth flow for ${platform} - configure API keys in Settings`,
    platform,
  });
});

// OAuth callback
router.get('/callback/:platform', async (req: Request, res: Response) => {
  const { platform } = req.params;
  const { code } = req.query;
  // TODO: Exchange code for tokens, save to platform_accounts
  res.json({ message: `OAuth callback for ${platform}`, code });
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const existing = queryOne(
      'SELECT id FROM platform_accounts WHERE id = ? AND user_id = ?',
      [req.params.id, req.user!.userId]
    );
    if (!existing) { res.status(404).json({ error: 'Account not found' }); return; }
    run('DELETE FROM platform_accounts WHERE id = ? AND user_id = ?', [req.params.id, req.user!.userId]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
