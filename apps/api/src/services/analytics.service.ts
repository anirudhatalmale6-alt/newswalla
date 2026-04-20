import { query, queryOne } from '../config/database';

export async function getOverview(userId: string, days: number = 30) {
  const accounts = await query<any>(
    'SELECT id, platform, platform_username, page_name FROM platform_accounts WHERE user_id = $1 AND is_active = true',
    [userId]
  );

  const accountIds = accounts.map(a => a.id);
  if (!accountIds.length) {
    return {
      totalFollowers: 0,
      followerGrowth: 0,
      totalImpressions: 0,
      totalEngagements: 0,
      engagementRate: 0,
      topPost: null,
      platformBreakdown: [],
    };
  }

  const metrics = await queryOne<any>(
    `SELECT
       COALESCE(SUM(impressions), 0) as total_impressions,
       COALESCE(SUM(engagements), 0) as total_engagements,
       COALESCE(SUM(likes), 0) as total_likes,
       COALESCE(SUM(comments), 0) as total_comments,
       COALESCE(SUM(shares), 0) as total_shares
     FROM analytics_snapshots
     WHERE platform_account_id = ANY($1)
       AND snapshot_date >= CURRENT_DATE - $2::int`,
    [accountIds, days]
  );

  const latestFollowers = await query<any>(
    `SELECT DISTINCT ON (platform_account_id)
       platform_account_id, followers_count
     FROM analytics_snapshots
     WHERE platform_account_id = ANY($1) AND followers_count IS NOT NULL
     ORDER BY platform_account_id, snapshot_date DESC`,
    [accountIds]
  );

  const totalFollowers = latestFollowers.reduce((sum: number, r: any) => sum + (r.followers_count || 0), 0);
  const totalImpressions = parseInt(metrics?.total_impressions || '0');
  const totalEngagements = parseInt(metrics?.total_engagements || '0');

  const platformBreakdown = accounts.map(a => {
    const followers = latestFollowers.find((f: any) => f.platform_account_id === a.id);
    return {
      platform: a.platform,
      accountName: a.page_name || a.platform_username || a.platform,
      followers: followers?.followers_count || 0,
      impressions: 0,
      engagements: 0,
      posts: 0,
    };
  });

  return {
    totalFollowers,
    followerGrowth: 0,
    totalImpressions,
    totalEngagements,
    engagementRate: totalImpressions > 0 ? (totalEngagements / totalImpressions * 100) : 0,
    topPost: null,
    platformBreakdown,
  };
}

export async function getAccountMetrics(accountId: string, days: number = 30) {
  const snapshots = await query<any>(
    `SELECT snapshot_date, impressions, reach, engagements, likes, comments, shares, followers_count
     FROM analytics_snapshots
     WHERE platform_account_id = $1
       AND snapshot_date >= CURRENT_DATE - $2::int
       AND post_variant_id IS NULL
     ORDER BY snapshot_date`,
    [accountId, days]
  );

  return snapshots.map(s => ({
    date: s.snapshot_date,
    impressions: s.impressions,
    reach: s.reach,
    engagements: s.engagements,
    likes: s.likes,
    comments: s.comments,
    shares: s.shares,
    followers: s.followers_count,
  }));
}

export async function getPostMetrics(postId: string) {
  const metrics = await query<any>(
    `SELECT a.*, pa.platform, pa.platform_username
     FROM analytics_snapshots a
     JOIN post_variants pv ON pv.id = a.post_variant_id
     JOIN platform_accounts pa ON pa.id = pv.platform_account_id
     WHERE pv.post_id = $1
     ORDER BY a.snapshot_date DESC`,
    [postId]
  );

  return metrics;
}
