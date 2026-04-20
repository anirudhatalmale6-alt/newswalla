import crypto from 'crypto';
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { db, query, queryOne, run } from '../config/database';

const router = Router();
router.use(authMiddleware);

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = z.object({ name: z.string().min(1) }).parse(req.body);

    const teamId = crypto.randomUUID();
    const memberId = crypto.randomUUID();

    const createTeam = db.transaction(() => {
      run(
        'INSERT INTO teams (id, name, owner_id) VALUES (?, ?, ?)',
        [teamId, name, req.user!.userId]
      );
      run(
        `INSERT INTO team_members (id, team_id, user_id, role, can_publish) VALUES (?, ?, ?, 'owner', 1)`,
        [memberId, teamId, req.user!.userId]
      );
    });

    createTeam();

    const team = queryOne('SELECT * FROM teams WHERE id = ?', [teamId]);
    res.status(201).json(team);
  } catch (err: any) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const teams = query(
      `SELECT t.*, tm.role as my_role
       FROM teams t
       JOIN team_members tm ON tm.team_id = t.id
       WHERE tm.user_id = ?`,
      [req.user!.userId]
    );
    res.json(teams);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const team = queryOne(
      `SELECT t.* FROM teams t
       JOIN team_members tm ON tm.team_id = t.id
       WHERE t.id = ? AND tm.user_id = ?`,
      [req.params.id, req.user!.userId]
    );
    if (!team) { res.status(404).json({ error: 'Team not found' }); return; }

    const members = query(
      `SELECT tm.*, u.full_name, u.email, u.avatar_url
       FROM team_members tm
       JOIN users u ON u.id = tm.user_id
       WHERE tm.team_id = ?`,
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

    const user = queryOne<any>('SELECT id FROM users WHERE email = ?', [email]);
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    // SQLite upsert
    const existing = queryOne(
      'SELECT id FROM team_members WHERE team_id = ? AND user_id = ?',
      [req.params.id, user.id]
    );
    if (existing) {
      run(
        'UPDATE team_members SET role = ? WHERE team_id = ? AND user_id = ?',
        [role, req.params.id, user.id]
      );
    } else {
      run(
        'INSERT INTO team_members (id, team_id, user_id, role) VALUES (?, ?, ?, ?)',
        [crypto.randomUUID(), req.params.id, user.id, role]
      );
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

export default router;
