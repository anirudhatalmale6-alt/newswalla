import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { query, queryOne } from '../config/database';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
  try {
    const accounts = await query(
      `SELECT id, platform, platform_user_id, platform_username, page_id, page_name,
              avatar_url, is_active, created_at
       FROM platform_accounts
       WHERE user_id = $1
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
    message: `OAuth flow for ${platform} - configure ${platform.toUpperCase()}_CLIENT_ID and ${platform.toUpperCase()}_CLIENT_SECRET in .env`,
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
    const result = await queryOne(
      'DELETE FROM platform_accounts WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user!.userId]
    );
    if (!result) { res.status(404).json({ error: 'Account not found' }); return; }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
