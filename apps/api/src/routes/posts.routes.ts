import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import * as postService from '../services/post.service';
import * as approvalService from '../services/approval.service';
import { queryOne } from '../config/database';

const router = Router();
router.use(authMiddleware);

const createPostSchema = z.object({
  contentGlobal: z.string().min(1),
  platforms: z.array(z.object({
    accountId: z.string().uuid(),
    contentOverride: z.string().optional(),
  })).min(1),
  mediaIds: z.array(z.string().uuid()).optional(),
  scheduledAt: z.string().optional(),
  publishNow: z.boolean().optional(),
});

const updatePostSchema = z.object({
  contentGlobal: z.string().optional(),
  scheduledAt: z.string().nullable().optional(),
  status: z.string().optional(),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await postService.listPosts(req.user!.userId, {
      status: req.query.status as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const input = createPostSchema.parse(req.body);
    const user = queryOne<any>('SELECT role FROM users WHERE id = ?', [req.user!.userId]);
    const isEditor = user?.role === 'user'; // non-admin users are editors

    // Editors: create post as pending_approval, notify admins
    if (isEditor && (input.publishNow || input.scheduledAt)) {
      const post = await postService.createPost({
        userId: req.user!.userId,
        ...input,
        publishNow: false, // override - editors can't publish directly
      });
      // Override status to pending_approval
      const { run: dbRun } = await import('../config/database');
      dbRun("UPDATE posts SET status = 'pending_approval' WHERE id = ?", [post.id]);

      // Create approval request and notify admins
      approvalService.createApprovalRequest(post.id, req.user!.userId);

      res.status(201).json({ ...post, status: 'pending_approval', needsApproval: true });
    } else {
      const post = await postService.createPost({
        userId: req.user!.userId,
        ...input,
      });
      res.status(201).json(post);
    }
  } catch (err: any) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const post = await postService.getPostById(req.params.id, req.user!.userId);
    if (!post) { res.status(404).json({ error: 'Post not found' }); return; }
    res.json(post);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updates = updatePostSchema.parse(req.body);
    const post = await postService.updatePost(req.params.id, req.user!.userId, updates);
    res.json(post);
  } catch (err: any) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await postService.deletePost(req.params.id, req.user!.userId);
    res.json({ success: true });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;
