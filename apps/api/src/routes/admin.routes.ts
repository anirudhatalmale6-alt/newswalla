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

// ============ LANGUAGES MANAGEMENT ============

// GET /api/admin/languages
router.get('/languages', async (req: Request, res: Response) => {
  try {
    const langs = settingsService.getSetting('custom_languages');
    if (langs) {
      res.json(JSON.parse(langs));
    } else {
      // Default languages
      res.json([
        { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', font: '', enabled: true },
        { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl', font: 'Noto Nastaliq Urdu', enabled: true },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', font: '', enabled: true },
        { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', dir: 'ltr', font: '', enabled: true },
        { code: 'sv', name: 'Swedish', nativeName: 'Svenska', dir: 'ltr', font: '', enabled: true },
        { code: 'phr', name: 'Pahari', nativeName: 'پہاڑی', dir: 'rtl', font: '', enabled: true },
        { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', dir: 'ltr', font: '', enabled: true },
        { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر', dir: 'rtl', font: '', enabled: true },
        { code: 'fa', name: 'Persian', nativeName: 'فارسی', dir: 'rtl', font: '', enabled: true },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', font: '', enabled: true },
      ]);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/languages
router.put('/languages', async (req: Request, res: Response) => {
  try {
    const { languages } = req.body;
    settingsService.setSetting('custom_languages', JSON.stringify(languages));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============ CONTACT SUPPORT ============

// GET /api/admin/contact-messages
router.get('/contact-messages', async (req: Request, res: Response) => {
  try {
    const { query: dbQuery } = await import('../config/database');
    const messages = dbQuery<any>('SELECT * FROM contact_messages ORDER BY created_at DESC', []);
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============ SUBSCRIPTION / ALLOWED USERS ============

// GET /api/admin/subscription-settings
router.get('/subscription-settings', async (req: Request, res: Response) => {
  try {
    const maxUsers = settingsService.getSetting('max_allowed_users') || '5';
    const freePostLimit = settingsService.getSetting('free_post_limit') || '5';
    const freeAccountLimit = settingsService.getSetting('free_account_limit') || '2';
    const proPrice = settingsService.getSetting('pro_price') || '5';
    const teamPrice = settingsService.getSetting('team_price') || '10';
    const teamMaxUsers = settingsService.getSetting('team_max_users') || '5';
    const registrationOpen = settingsService.getSetting('registration_open') || 'true';
    res.json({ maxUsers, freePostLimit, freeAccountLimit, proPrice, teamPrice, teamMaxUsers, registrationOpen });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/subscription-settings
router.put('/subscription-settings', async (req: Request, res: Response) => {
  try {
    const { maxUsers, freePostLimit, freeAccountLimit, proPrice, teamPrice, teamMaxUsers, registrationOpen } = req.body;
    if (maxUsers !== undefined) settingsService.setSetting('max_allowed_users', String(maxUsers));
    if (freePostLimit !== undefined) settingsService.setSetting('free_post_limit', String(freePostLimit));
    if (freeAccountLimit !== undefined) settingsService.setSetting('free_account_limit', String(freeAccountLimit));
    if (proPrice !== undefined) settingsService.setSetting('pro_price', String(proPrice));
    if (teamPrice !== undefined) settingsService.setSetting('team_price', String(teamPrice));
    if (teamMaxUsers !== undefined) settingsService.setSetting('team_max_users', String(teamMaxUsers));
    if (registrationOpen !== undefined) settingsService.setSetting('registration_open', String(registrationOpen));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
