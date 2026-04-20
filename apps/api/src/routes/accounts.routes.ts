import { Router, Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { authMiddleware } from '../middleware/auth';
import { query, queryOne, run } from '../config/database';

const router = Router();
router.use(authMiddleware);

// GET /api/accounts - list all connected accounts
router.get('/', async (req: Request, res: Response) => {
  try {
    const accounts = query(
      `SELECT id, platform, platform_user_id, platform_username, page_id, page_name,
              avatar_url, is_active, created_at
       FROM platform_accounts
       WHERE user_id = ?
       ORDER BY platform, created_at DESC`,
      [req.user!.userId]
    );
    res.json(accounts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/accounts - manually add a platform account
const addAccountSchema = z.object({
  platform: z.enum(['facebook_page', 'facebook_group', 'facebook_profile', 'instagram', 'youtube', 'linkedin', 'tiktok', 'pinterest']),
  accountName: z.string().min(1),
  accountId: z.string().min(1),
  accessToken: z.string().optional(),
  pageId: z.string().optional(),
  pageName: z.string().optional(),
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const input = addAccountSchema.parse(req.body);
    const id = crypto.randomUUID();

    run(
      `INSERT INTO platform_accounts (id, user_id, platform, platform_user_id, platform_username, access_token_enc, page_id, page_name, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [id, req.user!.userId, input.platform, input.accountId, input.accountName, input.accessToken || '', input.pageId || null, input.pageName || null]
    );

    const account = queryOne(
      'SELECT id, platform, platform_user_id, platform_username, page_id, page_name, avatar_url, is_active, created_at FROM platform_accounts WHERE id = ?',
      [id]
    );
    res.status(201).json(account);
  } catch (err: any) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

// PUT /api/accounts/:id - update account
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const existing = queryOne(
      'SELECT id FROM platform_accounts WHERE id = ? AND user_id = ?',
      [req.params.id, req.user!.userId]
    );
    if (!existing) { res.status(404).json({ error: 'Account not found' }); return; }

    const { accountName, is_active } = req.body;
    const updates: string[] = [];
    const params: any[] = [];

    if (accountName) { updates.push('platform_username = ?'); params.push(accountName); }
    if (is_active !== undefined) { updates.push('is_active = ?'); params.push(is_active ? 1 : 0); }

    if (updates.length > 0) {
      params.push(req.params.id);
      run(`UPDATE platform_accounts SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const account = queryOne(
      'SELECT id, platform, platform_user_id, platform_username, page_id, page_name, avatar_url, is_active, created_at FROM platform_accounts WHERE id = ?',
      [req.params.id]
    );
    res.json(account);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// OAuth connect - initiates OAuth flow for a platform
router.get('/connect/:platform', async (req: Request, res: Response) => {
  const { platform } = req.params;
  res.json({
    message: `OAuth flow for ${platform} - configure API keys in Settings first`,
    platform,
  });
});

// OAuth callback
router.get('/callback/:platform', async (req: Request, res: Response) => {
  const { platform } = req.params;
  const { code } = req.query;
  res.json({ message: `OAuth callback for ${platform}`, code });
});

// DELETE /api/accounts/:id
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
