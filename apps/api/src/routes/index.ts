import { Router } from 'express';
import authRoutes from './auth.routes';
import postsRoutes from './posts.routes';
import calendarRoutes from './calendar.routes';
import accountsRoutes from './accounts.routes';
import analyticsRoutes from './analytics.routes';
import inboxRoutes from './inbox.routes';
import aiRoutes from './ai.routes';
import teamsRoutes from './teams.routes';
import mediaRoutes from './media.routes';
import settingsRoutes from './settings.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postsRoutes);
router.use('/calendar', calendarRoutes);
router.use('/accounts', accountsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/inbox', inboxRoutes);
router.use('/ai', aiRoutes);
router.use('/teams', teamsRoutes);
router.use('/media', mediaRoutes);
router.use('/settings', settingsRoutes);

export default router;
