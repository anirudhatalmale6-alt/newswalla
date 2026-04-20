import { PlatformType } from './platform';

export type PostStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'failed'
  | 'partially_failed';

export interface Post {
  id: string;
  userId: string;
  teamId: string | null;
  status: PostStatus;
  contentGlobal: string | null;
  scheduledAt: string | null;
  publishedAt: string | null;
  aiGenerated: boolean;
  createdBy: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  variants?: PostVariant[];
  media?: Media[];
}

export interface PostVariant {
  id: string;
  postId: string;
  platformAccountId: string;
  contentOverride: string | null;
  platformPostId: string | null;
  platformPostUrl: string | null;
  status: 'pending' | 'published' | 'failed';
  errorMessage: string | null;
  publishedAt: string | null;
}

export interface Media {
  id: string;
  userId: string;
  postId: string | null;
  fileUrl: string;
  thumbnailUrl: string | null;
  fileType: 'image' | 'video' | 'gif';
  mimeType: string | null;
  fileSizeBytes: number | null;
  width: number | null;
  height: number | null;
  durationSec: number | null;
  sortOrder: number;
}

export interface CreatePostInput {
  contentGlobal: string;
  platforms: { accountId: string; contentOverride?: string }[];
  mediaIds?: string[];
  scheduledAt?: string;
  publishNow?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  status: PostStatus;
  platforms: PlatformType[];
}
