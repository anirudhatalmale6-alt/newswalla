import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';
import * as authService from '../services/auth.service';
import * as settingsService from '../services/settings.service';

const router = Router();
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/admin/users
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await authService.listUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/users
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1),
  role: z.enum(['admin', 'user']).optional(),
});

router.post('/users', async (req: Request, res: Response) => {
  try {
    const input = createUserSchema.parse(req.body);
    const user = await authService.createUser(input);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

// PUT /api/admin/users/:id
const updateUserSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'user']).optional(),
  is_active: z.boolean().optional(),
});

router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const input = updateUserSchema.parse(req.body);
    const user = await authService.updateUser(req.params.id, input);
    res.json(user);
  } catch (err: any) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

// PUT /api/admin/users/:id/reset-password
const resetPasswordSchema = z.object({
  password: z.string().min(8),
});

router.put('/users/:id/reset-password', async (req: Request, res: Response) => {
  try {
    const { password } = resetPasswordSchema.parse(req.body);
    const result = await authService.resetUserPassword(req.params.id, password);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    if (req.params.id === req.user!.userId) {
      res.status(400).json({ error: 'Cannot delete your own account' });
      return;
    }
    const result = await authService.deleteUser(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/theme - get global theme settings
router.get('/theme', async (req: Request, res: Response) => {
  try {
    const theme = settingsService.getSetting('global_theme') || 'blue';
    const customColors = settingsService.getSetting('custom_theme_colors') || '';
    res.json({ theme, customColors });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/theme - set global theme
router.put('/theme', async (req: Request, res: Response) => {
  try {
    const { theme, customColors } = req.body;
    if (theme) settingsService.setSetting('global_theme', theme);
    if (customColors !== undefined) settingsService.setSetting('custom_theme_colors', customColors);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
