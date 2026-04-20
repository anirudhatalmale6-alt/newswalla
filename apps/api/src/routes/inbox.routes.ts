import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { query, queryOne, run } from '../config/database';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const messages = query(
      `SELECT im.*, pa.platform, pa.platform_username
       FROM inbox_messages im
       JOIN platform_accounts pa ON pa.id = im.platform_account_id
       WHERE pa.user_id = ? AND im.is_archived = 0
       ORDER BY im.platform_created_at DESC
       LIMIT ? OFFSET ?`,
      [req.user!.userId, limit, offset]
    );

    const countResult = queryOne<any>(
      `SELECT COUNT(*) as count FROM inbox_messages im
       JOIN platform_accounts pa ON pa.id = im.platform_account_id
       WHERE pa.user_id = ? AND im.is_archived = 0`,
      [req.user!.userId]
    );

    res.json({
      messages,
      total: countResult?.count || 0,
      page,
      limit,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:messageId/read', async (req: Request, res: Response) => {
  try {
    run(
      `UPDATE inbox_messages SET is_read = 1
       WHERE id = ? AND platform_account_id IN (
         SELECT id FROM platform_accounts WHERE user_id = ?
       )`,
      [req.params.messageId, req.user!.userId]
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:messageId/archive', async (req: Request, res: Response) => {
  try {
    run(
      `UPDATE inbox_messages SET is_archived = 1
       WHERE id = ? AND platform_account_id IN (
         SELECT id FROM platform_accounts WHERE user_id = ?
       )`,
      [req.params.messageId, req.user!.userId]
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
