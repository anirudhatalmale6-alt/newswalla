import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { startScheduler } from './jobs/worker';

// Start the post scheduler
startScheduler();

app.listen(env.PORT, () => {
  logger.info(`NewsWalla API running on port ${env.PORT}`);
});
