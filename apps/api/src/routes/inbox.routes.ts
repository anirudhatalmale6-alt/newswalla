import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { query, queryOne } from '../config/database';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const messages = await query(
      `SELECT im.*, pa.platform, pa.platform_username
       FROM inbox_messages im
       JOIN platform_accounts pa ON pa.id = im.platform_account_id
       WHERE pa.user_id = $1 AND im.is_archived = false
       ORDER BY im.platform_created_at DESC NULLS LAST
       LIMIT $2 OFFSET $3`,
      [req.user!.userId, limit, offset]
    );

    const countResult = await queryOne<any>(
      `SELECT COUNT(*) FROM inbox_messages im
       JOIN platform_accounts pa ON pa.id = im.platform_account_id
       WHERE pa.user_id = $1 AND im.is_archived = false`,
      [req.user!.userId]
    );

    res.json({
      messages,
      total: parseInt(countResult?.count || '0'),
      page,
      limit,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:messageId/read', async (req: Request, res: Response) => {
  try {
    await queryOne(
      `UPDATE inbox_messages SET is_read = true
       WHERE id = $1 AND platform_account_id IN (
         SELECT id FROM platform_accounts WHERE user_id = $2
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
    await queryOne(
      `UPDATE inbox_messages SET is_archived = true
       WHERE id = $1 AND platform_account_id IN (
         SELECT id FROM platform_accounts WHERE user_id = $2
       )`,
      [req.params.messageId, req.user!.userId]
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
