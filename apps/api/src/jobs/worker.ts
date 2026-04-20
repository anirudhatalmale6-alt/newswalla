import { Worker, Queue } from 'bullmq';
import { redis } from '../config/redis';
import { query, queryOne } from '../config/database';
import { logger } from '../utils/logger';

const connection = { host: 'localhost', port: 6379 };

// Post publisher queue
export const postQueue = new Queue('post-publisher', { connection });

// Schedule a post for future publishing
export async function schedulePost(postId: string, publishAt: Date) {
  const delay = publishAt.getTime() - Date.now();
  if (delay <= 0) {
    await postQueue.add('publish', { postId }, { jobId: postId });
  } else {
    await postQueue.add('publish', { postId }, { jobId: postId, delay });
  }
  logger.info({ postId, publishAt }, 'Post scheduled for publishing');
}

// Cancel a scheduled post
export async function cancelScheduledPost(postId: string) {
  const job = await postQueue.getJob(postId);
  if (job) await job.remove();
}

// Worker processor
const worker = new Worker('post-publisher', async (job) => {
  const { postId } = job.data;
  logger.info({ postId }, 'Publishing post');

  // Update status to publishing
  await queryOne(
    "UPDATE posts SET status = 'publishing', updated_at = NOW() WHERE id = $1",
    [postId]
  );

  // Get post variants with platform accounts
  const variants = await query<any>(
    `SELECT pv.*, pa.platform, pa.access_token_enc, pa.page_id
     FROM post_variants pv
     JOIN platform_accounts pa ON pa.id = pv.platform_account_id
     WHERE pv.post_id = $1 AND pv.status = 'pending'`,
    [postId]
  );

  const post = await queryOne<any>('SELECT * FROM posts WHERE id = $1', [postId]);
  if (!post) throw new Error(`Post ${postId} not found`);

  let publishedCount = 0;
  let failedCount = 0;

  for (const variant of variants) {
    try {
      const content = variant.content_override || post.content_global;

      // TODO: Call platform adapter to publish
      // const adapter = getAdapter(variant.platform);
      // const result = await adapter.publishPost(account, { text: content });

      // For now, simulate publishing
      logger.info({ platform: variant.platform, postId }, 'Publishing to platform');

      await queryOne(
        `UPDATE post_variants
         SET status = 'published', published_at = NOW(), platform_post_id = $2
         WHERE id = $1`,
        [variant.id, `sim_${Date.now()}`]
      );
      publishedCount++;
    } catch (err: any) {
      logger.error({ err, platform: variant.platform, postId }, 'Failed to publish to platform');
      await queryOne(
        `UPDATE post_variants SET status = 'failed', error_message = $2 WHERE id = $1`,
        [variant.id, err.message]
      );
      failedCount++;
    }
  }

  // Update post status
  const finalStatus = failedCount === 0 ? 'published'
    : publishedCount === 0 ? 'failed'
    : 'partially_failed';

  await queryOne(
    `UPDATE posts SET status = $2, published_at = NOW(), updated_at = NOW() WHERE id = $1`,
    [postId, finalStatus]
  );

  logger.info({ postId, published: publishedCount, failed: failedCount }, 'Post publishing complete');
}, { connection });

worker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err }, 'Job failed');
});

logger.info('VTN Worker started');
