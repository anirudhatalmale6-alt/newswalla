import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';
import * as approvalService from '../services/approval.service';

const router = Router();
router.use(authMiddleware);

// GET /api/approvals - list approvals (admin sees all, editors see theirs)
router.get('/', async (req: Request, res: Response) => {
  try {
    const approvals = await approvalService.getAllApprovals();
    res.json(approvals);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/approvals/pending - pending approvals (admin only)
router.get('/pending', adminMiddleware, async (req: Request, res: Response) => {
  try {
    const approvals = await approvalService.getPendingApprovals();
    res.json(approvals);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/approvals/:id/approve (admin only)
router.post('/:id/approve', adminMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await approvalService.approvePost(req.params.id, req.user!.userId, req.body.comment);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// POST /api/approvals/:id/reject (admin only)
router.post('/:id/reject', adminMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await approvalService.rejectPost(req.params.id, req.user!.userId, req.body.comment);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// GET /api/approvals/notifications - get user's notifications
router.get('/notifications', async (req: Request, res: Response) => {
  try {
    const notifications = await approvalService.getNotifications(req.user!.userId);
    const unreadCount = approvalService.getUnreadCount(req.user!.userId);
    res.json({ notifications, unreadCount });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/approvals/notifications/read-all
router.post('/notifications/read-all', async (req: Request, res: Response) => {
  try {
    approvalService.markAllRead(req.user!.userId);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/approvals/notifications/:id/read
router.post('/notifications/:id/read', async (req: Request, res: Response) => {
  try {
    approvalService.markNotificationRead(req.params.id, req.user!.userId);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
