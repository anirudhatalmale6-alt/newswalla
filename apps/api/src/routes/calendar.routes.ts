import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as postService from '../services/post.service';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
  try {
    const start = req.query.start as string;
    const end = req.query.end as string;
    if (!start || !end) {
      res.status(400).json({ error: 'start and end query params required' });
      return;
    }
    const events = await postService.getCalendarPosts(req.user!.userId, start, end);
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:postId/move', async (req: Request, res: Response) => {
  try {
    const { newTime } = req.body;
    if (!newTime) { res.status(400).json({ error: 'newTime required' }); return; }
    const post = await postService.updatePost(req.params.postId, req.user!.userId, {
      scheduledAt: newTime,
      status: 'scheduled',
    });
    res.json(post);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;
