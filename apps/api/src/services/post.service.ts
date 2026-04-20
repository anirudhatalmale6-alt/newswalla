import { query, queryOne, pool } from '../config/database';

export interface CreatePostInput {
  userId: string;
  contentGlobal: string;
  platforms: { accountId: string; contentOverride?: string }[];
  mediaIds?: string[];
  scheduledAt?: string;
  publishNow?: boolean;
}

export async function createPost(input: CreatePostInput) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const status = input.publishNow ? 'publishing' : input.scheduledAt ? 'scheduled' : 'draft';
    const post = (await client.query(
      `INSERT INTO posts (user_id, status, content_global, scheduled_at, created_by)
       VALUES ($1, $2, $3, $4, $1)
       RETURNING *`,
      [input.userId, status, input.contentGlobal, input.scheduledAt || null]
    )).rows[0];

    for (const p of input.platforms) {
      await client.query(
        `INSERT INTO post_variants (post_id, platform_account_id, content_override)
         VALUES ($1, $2, $3)`,
        [post.id, p.accountId, p.contentOverride || null]
      );
    }

    if (input.mediaIds?.length) {
      for (let i = 0; i < input.mediaIds.length; i++) {
        await client.query(
          'UPDATE media SET post_id = $1, sort_order = $2 WHERE id = $3 AND user_id = $4',
          [post.id, i, input.mediaIds[i], input.userId]
        );
      }
    }

    await client.query('COMMIT');
    return getPostById(post.id, input.userId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getPostById(postId: string, userId: string) {
  const post = await queryOne<any>(
    'SELECT * FROM posts WHERE id = $1 AND user_id = $2',
    [postId, userId]
  );
  if (!post) return null;

  const variants = await query<any>(
    `SELECT pv.*, pa.platform, pa.platform_username, pa.page_name
     FROM post_variants pv
     JOIN platform_accounts pa ON pa.id = pv.platform_account_id
     WHERE pv.post_id = $1`,
    [postId]
  );

  const media = await query<any>(
    'SELECT * FROM media WHERE post_id = $1 ORDER BY sort_order',
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

  let where = 'WHERE p.user_id = $1';
  const params: any[] = [userId];

  if (filters.status) {
    params.push(filters.status);
    where += ` AND p.status = $${params.length}`;
  }

  const posts = await query<any>(
    `SELECT p.*,
       json_agg(DISTINCT jsonb_build_object(
         'id', pv.id, 'platform', pa.platform, 'platformUsername', pa.platform_username,
         'contentOverride', pv.content_override, 'status', pv.status
       )) FILTER (WHERE pv.id IS NOT NULL) as variants
     FROM posts p
     LEFT JOIN post_variants pv ON pv.post_id = p.id
     LEFT JOIN platform_accounts pa ON pa.id = pv.platform_account_id
     ${where}
     GROUP BY p.id
     ORDER BY COALESCE(p.scheduled_at, p.created_at) DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );

  const countResult = await queryOne<any>(
    `SELECT COUNT(*) FROM posts p ${where}`,
    params
  );

  return {
    posts: posts.map(p => ({
      ...formatPostRow(p),
      variants: p.variants || [],
    })),
    total: parseInt(countResult?.count || '0'),
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
  let idx = 1;

  if (updates.contentGlobal !== undefined) {
    sets.push(`content_global = $${idx++}`);
    params.push(updates.contentGlobal);
  }
  if (updates.scheduledAt !== undefined) {
    sets.push(`scheduled_at = $${idx++}`);
    params.push(updates.scheduledAt);
  }
  if (updates.status) {
    sets.push(`status = $${idx++}`);
    params.push(updates.status);
  }

  sets.push(`updated_at = NOW()`);

  params.push(postId, userId);
  await queryOne(
    `UPDATE posts SET ${sets.join(', ')} WHERE id = $${idx++} AND user_id = $${idx}`,
    params
  );

  return getPostById(postId, userId);
}

export async function deletePost(postId: string, userId: string) {
  const result = await queryOne<any>(
    'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id',
    [postId, userId]
  );
  if (!result) throw Object.assign(new Error('Post not found'), { status: 404 });
}

export async function getCalendarPosts(userId: string, start: string, end: string) {
  const posts = await query<any>(
    `SELECT p.id, p.content_global, p.status, p.scheduled_at, p.published_at,
       array_agg(DISTINCT pa.platform) as platforms
     FROM posts p
     LEFT JOIN post_variants pv ON pv.post_id = p.id
     LEFT JOIN platform_accounts pa ON pa.id = pv.platform_account_id
     WHERE p.user_id = $1
       AND COALESCE(p.scheduled_at, p.created_at) >= $2
       AND COALESCE(p.scheduled_at, p.created_at) <= $3
     GROUP BY p.id
     ORDER BY COALESCE(p.scheduled_at, p.created_at)`,
    [userId, start, end]
  );

  return posts.map(p => ({
    id: p.id,
    title: (p.content_global || '').substring(0, 60) + ((p.content_global?.length || 0) > 60 ? '...' : ''),
    start: p.scheduled_at || p.created_at,
    end: p.scheduled_at || p.created_at,
    status: p.status,
    platforms: p.platforms?.filter(Boolean) || [],
  }));
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
    aiGenerated: row.ai_generated,
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
