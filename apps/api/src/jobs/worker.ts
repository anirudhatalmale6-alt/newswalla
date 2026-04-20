import { query, queryOne, run } from '../config/database';
import { logger } from '../utils/logger';

let schedulerInterval: ReturnType<typeof setInterval> | null = null;

// Schedule a post for future publishing (no-op, the interval will pick it up)
export async function schedulePost(postId: string, publishAt: Date) {
  logger.info({ postId, publishAt }, 'Post scheduled for publishing');
}

// Cancel a scheduled post
export async function cancelScheduledPost(postId: string) {
  run("UPDATE posts SET status = 'draft' WHERE id = ? AND status = 'scheduled'", [postId]);
  logger.info({ postId }, 'Scheduled post cancelled');
}

// Publish a single post
async function publishPost(postId: string) {
  logger.info({ postId }, 'Publishing post');

  run(
    "UPDATE posts SET status = 'publishing', updated_at = datetime('now') WHERE id = ?",
    [postId]
  );

  const variants = query<any>(
    `SELECT pv.*, pa.platform, pa.access_token_enc, pa.page_id
     FROM post_variants pv
     JOIN platform_accounts pa ON pa.id = pv.platform_account_id
     WHERE pv.post_id = ? AND pv.status = 'pending'`,
    [postId]
  );

  const post = queryOne<any>('SELECT * FROM posts WHERE id = ?', [postId]);
  if (!post) {
    logger.error({ postId }, 'Post not found during publishing');
    return;
  }

  let publishedCount = 0;
  let failedCount = 0;

  for (const variant of variants) {
    try {
      const content = variant.content_override || post.content_global;

      // TODO: Call platform adapter to publish
      logger.info({ platform: variant.platform, postId }, 'Publishing to platform');

      run(
        `UPDATE post_variants
         SET status = 'published', published_at = datetime('now'), platform_post_id = ?
         WHERE id = ?`,
        [`sim_${Date.now()}`, variant.id]
      );
      publishedCount++;
    } catch (err: any) {
      logger.error({ err, platform: variant.platform, postId }, 'Failed to publish to platform');
      run(
        `UPDATE post_variants SET status = 'failed', error_message = ? WHERE id = ?`,
        [err.message, variant.id]
      );
      failedCount++;
    }
  }

  const finalStatus = failedCount === 0 ? 'published'
    : publishedCount === 0 ? 'failed'
    : 'partially_failed';

  run(
    `UPDATE posts SET status = ?, published_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`,
    [finalStatus, postId]
  );

  logger.info({ postId, published: publishedCount, failed: failedCount }, 'Post publishing complete');
}

// Check for scheduled posts every 30 seconds
function checkScheduledPosts() {
  try {
    const due = query<any>(
      `SELECT id FROM posts
       WHERE status = 'scheduled'
         AND scheduled_at <= datetime('now')`,
      []
    );

    for (const post of due) {
      publishPost(post.id).catch(err => {
        logger.error({ err, postId: post.id }, 'Error publishing scheduled post');
      });
    }
  } catch (err) {
    logger.error({ err }, 'Error checking scheduled posts');
  }
}

export function startScheduler() {
  if (schedulerInterval) return;
  schedulerInterval = setInterval(checkScheduledPosts, 30_000);
  // Also run immediately on start
  checkScheduledPosts();
  logger.info('Post scheduler started (checking every 30s)');
}

export function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    logger.info('Post scheduler stopped');
  }
}
