export type PlatformType =
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'tiktok'
  | 'pinterest'
  | 'youtube';

export interface PlatformAccount {
  id: string;
  userId: string;
  platform: PlatformType;
  platformUserId: string;
  platformUsername: string | null;
  pageId: string | null;
  pageName: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
}

export interface PublishResult {
  platformPostId: string;
  platformPostUrl: string | null;
}

export interface PostMetrics {
  impressions: number;
  reach: number;
  engagements: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  videoViews: number;
}
