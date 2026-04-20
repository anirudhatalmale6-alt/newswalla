import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import * as aiService from '../services/ai.service';

const router = Router();
router.use(authMiddleware);

router.post('/generate-caption', async (req: Request, res: Response) => {
  try {
    const { topic, platform, tone } = z.object({
      topic: z.string().min(1),
      platform: z.string().optional(),
      tone: z.string().optional(),
    }).parse(req.body);
    const caption = await aiService.generateCaption({ topic, platform, tone });
    res.json({ caption });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/generate-hashtags', async (req: Request, res: Response) => {
  try {
    const { content, platform } = z.object({
      content: z.string().min(1),
      platform: z.string().optional(),
    }).parse(req.body);
    const hashtags = await aiService.generateHashtags(content, platform);
    res.json({ hashtags });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/rewrite', async (req: Request, res: Response) => {
  try {
    const { content, style } = z.object({
      content: z.string().min(1),
      style: z.string().min(1),
    }).parse(req.body);
    const rewritten = await aiService.rewriteContent(content, style);
    res.json({ content: rewritten });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;
