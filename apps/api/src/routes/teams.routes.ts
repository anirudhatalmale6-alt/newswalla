import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { query, queryOne, pool } from '../config/database';

const router = Router();
router.use(authMiddleware);

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = z.object({ name: z.string().min(1) }).parse(req.body);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const team = (await client.query(
        'INSERT INTO teams (name, owner_id) VALUES ($1, $2) RETURNING *',
        [name, req.user!.userId]
      )).rows[0];
      await client.query(
        `INSERT INTO team_members (team_id, user_id, role, can_publish) VALUES ($1, $2, 'owner', true)`,
        [team.id, req.user!.userId]
      );
      await client.query('COMMIT');
      res.status(201).json(team);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err: any) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const teams = await query(
      `SELECT t.*, tm.role as my_role
       FROM teams t
       JOIN team_members tm ON tm.team_id = t.id
       WHERE tm.user_id = $1`,
      [req.user!.userId]
    );
    res.json(teams);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const team = await queryOne(
      `SELECT t.* FROM teams t
       JOIN team_members tm ON tm.team_id = t.id
       WHERE t.id = $1 AND tm.user_id = $2`,
      [req.params.id, req.user!.userId]
    );
    if (!team) { res.status(404).json({ error: 'Team not found' }); return; }

    const members = await query(
      `SELECT tm.*, u.full_name, u.email, u.avatar_url
       FROM team_members tm
       JOIN users u ON u.id = tm.user_id
       WHERE tm.team_id = $1`,
      [req.params.id]
    );
    res.json({ ...team, members });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/invite', async (req: Request, res: Response) => {
  try {
    const { email, role } = z.object({
      email: z.string().email(),
      role: z.enum(['admin', 'editor', 'member']).default('member'),
    }).parse(req.body);

    const user = await queryOne<any>('SELECT id FROM users WHERE email = $1', [email]);
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    await queryOne(
      `INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)
       ON CONFLICT (team_id, user_id) DO UPDATE SET role = $3`,
      [req.params.id, user.id, role]
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

export default router;
