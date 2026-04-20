import crypto from 'crypto';
import { db, query, queryOne, run } from '../config/database';

export interface CreatePostInput {
  userId: string;
  contentGlobal: string;
  platforms: { accountId: string; contentOverride?: string }[];
  mediaIds?: string[];
  scheduledAt?: string;
  publishNow?: boolean;
}

export async function createPost(input: CreatePostInput) {
  const status = input.publishNow ? 'publishing' : input.scheduledAt ? 'scheduled' : 'draft';
  const postId = crypto.randomUUID();

  const createTx = db.transaction(() => {
    run(
      `INSERT INTO posts (id, user_id, status, content_global, scheduled_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [postId, input.userId, status, input.contentGlobal, input.scheduledAt || null, input.userId]
    );

    for (const p of input.platforms) {
      run(
        `INSERT INTO post_variants (id, post_id, platform_account_id, content_override)
         VALUES (?, ?, ?, ?)`,
        [crypto.randomUUID(), postId, p.accountId, p.contentOverride || null]
      );
    }

    if (input.mediaIds?.length) {
      for (let i = 0; i < input.mediaIds.length; i++) {
        run(
          'UPDATE media SET post_id = ?, sort_order = ? WHERE id = ? AND user_id = ?',
          [postId, i, input.mediaIds[i], input.userId]
        );
      }
    }
  });

  createTx();
  return getPostById(postId, input.userId);
}

export async function getPostById(postId: string, userId: string) {
  const post = queryOne<any>(
    'SELECT * FROM posts WHERE id = ? AND user_id = ?',
    [postId, userId]
  );
  if (!post) return null;

  const variants = query<any>(
    `SELECT pv.*, pa.platform, pa.platform_username, pa.page_name
     FROM post_variants pv
     JOIN platform_accounts pa ON pa.id = pv.platform_account_id
     WHERE pv.post_id = ?`,
    [postId]
  );

  const media = query<any>(
    'SELECT * FROM media WHERE post_id = ? ORDER BY sort_order',
    [postId]
  );

  return formatPost(post, variants, media);
}

export async function listPosts(userId: string, filters: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;

  let where = 'WHERE p.user_id = ?';
  const params: any[] = [userId];

  if (filters.status) {
    params.push(filters.status);
    where += ' AND p.status = ?';
  }

  // Get posts
  const posts = query<any>(
    `SELECT p.*
     FROM posts p
     ${where}
     ORDER BY COALESCE(p.scheduled_at, p.created_at) DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  // Get variants for each post (aggregation done in JS)
  const postsWithVariants = posts.map(p => {
    const variants = query<any>(
      `SELECT pv.id, pa.platform, pa.platform_username, pv.content_override, pv.status
       FROM post_variants pv
       JOIN platform_accounts pa ON pa.id = pv.platform_account_id
       WHERE pv.post_id = ?`,
      [p.id]
    );
    return {
      ...formatPostRow(p),
      variants: variants.map(v => ({
        id: v.id,
        platform: v.platform,
        platformUsername: v.platform_username,
        contentOverride: v.content_override,
        status: v.status,
      })),
    };
  });

  const countResult = queryOne<any>(
    `SELECT COUNT(*) as count FROM posts p ${where}`,
    params
  );

  return {
    posts: postsWithVariants,
    total: countResult?.count || 0,
    page,
    limit,
  };
}

export async function updatePost(postId: string, userId: string, updates: {
  contentGlobal?: string;
  scheduledAt?: string | null;
  status?: string;
}) {
  const sets: string[] = [];
  const params: any[] = [];

  if (updates.contentGlobal !== undefined) {
    sets.push('content_global = ?');
    params.push(updates.contentGlobal);
  }
  if (updates.scheduledAt !== undefined) {
    sets.push('scheduled_at = ?');
    params.push(updates.scheduledAt);
  }
  if (updates.status) {
    sets.push('status = ?');
    params.push(updates.status);
  }

  sets.push("updated_at = datetime('now')");

  params.push(postId, userId);
  run(
    `UPDATE posts SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`,
    params
  );

  return getPostById(postId, userId);
}

export async function deletePost(postId: string, userId: string) {
  const result = queryOne<any>(
    'SELECT id FROM posts WHERE id = ? AND user_id = ?',
    [postId, userId]
  );
  if (!result) throw Object.assign(new Error('Post not found'), { status: 404 });
  run('DELETE FROM posts WHERE id = ? AND user_id = ?', [postId, userId]);
}

export async function getCalendarPosts(userId: string, start: string, end: string) {
  const posts = query<any>(
    `SELECT p.id, p.content_global, p.status, p.scheduled_at, p.published_at, p.created_at
     FROM posts p
     WHERE p.user_id = ?
       AND COALESCE(p.scheduled_at, p.created_at) >= ?
       AND COALESCE(p.scheduled_at, p.created_at) <= ?
     ORDER BY COALESCE(p.scheduled_at, p.created_at)`,
    [userId, start, end]
  );

  return posts.map(p => {
    // Get platforms for each post in JS
    const platforms = query<any>(
      `SELECT DISTINCT pa.platform
       FROM post_variants pv
       JOIN platform_accounts pa ON pa.id = pv.platform_account_id
       WHERE pv.post_id = ?`,
      [p.id]
    ).map(r => r.platform);

    return {
      id: p.id,
      title: (p.content_global || '').substring(0, 60) + ((p.content_global?.length || 0) > 60 ? '...' : ''),
      start: p.scheduled_at || p.created_at,
      end: p.scheduled_at || p.created_at,
      status: p.status,
      platforms,
    };
  });
}

function formatPostRow(row: any) {
  return {
    id: row.id,
    userId: row.user_id,
    teamId: row.team_id,
    status: row.status,
    contentGlobal: row.content_global,
    scheduledAt: row.scheduled_at,
    publishedAt: row.published_at,
    aiGenerated: !!row.ai_generated,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function formatPost(post: any, variants: any[], media: any[]) {
  return {
    ...formatPostRow(post),
    variants: variants.map(v => ({
      id: v.id,
      postId: v.post_id,
      platformAccountId: v.platform_account_id,
      platform: v.platform,
      platformUsername: v.platform_username,
      pageName: v.page_name,
      contentOverride: v.content_override,
      platformPostId: v.platform_post_id,
      platformPostUrl: v.platform_post_url,
      status: v.status,
      errorMessage: v.error_message,
    })),
    media: media.map(m => ({
      id: m.id,
      fileUrl: m.file_url,
      thumbnailUrl: m.thumbnail_url,
      fileType: m.file_type,
      mimeType: m.mime_type,
      sortOrder: m.sort_order,
    })),
  };
}
