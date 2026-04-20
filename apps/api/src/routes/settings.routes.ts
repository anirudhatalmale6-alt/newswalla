import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as settingsService from '../services/settings.service';

const router = Router();
router.use(authMiddleware);

// GET /api/settings - get all settings
router.get('/', async (req: Request, res: Response) => {
  try {
    const settings = settingsService.getAllSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings - update settings
router.put('/', async (req: Request, res: Response) => {
  try {
    const { key, value, settings } = req.body;

    if (settings && typeof settings === 'object') {
      // Bulk update: { settings: { key1: value1, key2: value2, ... } }
      for (const [k, v] of Object.entries(settings)) {
        settingsService.setSetting(k, String(v));
      }
    } else if (key && value !== undefined) {
      // Single update: { key, value }
      settingsService.setSetting(key, String(value));
    } else {
      res.status(400).json({ error: 'Provide { key, value } or { settings: { ... } }' });
      return;
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/settings/api-keys - get all configured API keys (masked)
router.get('/api-keys', async (req: Request, res: Response) => {
  try {
    const keys = settingsService.getApiKeysMasked();
    res.json({ keys });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings/api-keys - update API keys
router.put('/api-keys', async (req: Request, res: Response) => {
  try {
    const keys = req.body.keys || req.body;
    if (!keys || typeof keys !== 'object') {
      res.status(400).json({ error: 'Provide { keys: { ... } } or an object of API key-value pairs' });
      return;
    }
    settingsService.setApiKeys(keys);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
