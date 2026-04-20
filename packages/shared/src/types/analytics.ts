export interface AnalyticsOverview {
  totalFollowers: number;
  followerGrowth: number;
  totalImpressions: number;
  totalEngagements: number;
  engagementRate: number;
  topPost: { id: string; content: string; engagements: number } | null;
  platformBreakdown: PlatformMetrics[];
}

export interface PlatformMetrics {
  platform: string;
  accountName: string;
  followers: number;
  impressions: number;
  engagements: number;
  posts: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export type TimeRange = '7d' | '30d' | '90d' | '12m';
