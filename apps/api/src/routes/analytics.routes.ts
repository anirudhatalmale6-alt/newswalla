import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as analyticsService from '../services/analytics.service';

const router = Router();
router.use(authMiddleware);

router.get('/overview', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const overview = await analyticsService.getOverview(req.user!.userId, days);
    res.json(overview);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/account/:id', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const metrics = await analyticsService.getAccountMetrics(req.params.id, days);
    res.json(metrics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/post/:id', async (req: Request, res: Response) => {
  try {
    const metrics = await analyticsService.getPostMetrics(req.params.id);
    res.json(metrics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
