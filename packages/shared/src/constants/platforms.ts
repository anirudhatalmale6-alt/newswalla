import { PlatformType } from '../types/platform';

export interface PlatformLimits {
  maxTextLength: number;
  maxImages: number;
  maxVideoLength: number;
  maxVideoSize: number;
  supportedMediaTypes: string[];
  hashtagLimit: number | null;
}

export const PLATFORM_LIMITS: Record<PlatformType, PlatformLimits> = {
  facebook: {
    maxTextLength: 63206,
    maxImages: 10,
    maxVideoLength: 240 * 60,
    maxVideoSize: 10 * 1024 * 1024 * 1024,
    supportedMediaTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
    hashtagLimit: null,
  },
  instagram: {
    maxTextLength: 2200,
    maxImages: 10,
    maxVideoLength: 90,
    maxVideoSize: 100 * 1024 * 1024,
    supportedMediaTypes: ['image/jpeg', 'image/png', 'video/mp4'],
    hashtagLimit: 30,
  },
  twitter: {
    maxTextLength: 280,
    maxImages: 4,
    maxVideoLength: 140,
    maxVideoSize: 512 * 1024 * 1024,
    supportedMediaTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
    hashtagLimit: null,
  },
  linkedin: {
    maxTextLength: 3000,
    maxImages: 9,
    maxVideoLength: 600,
    maxVideoSize: 5 * 1024 * 1024 * 1024,
    supportedMediaTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
    hashtagLimit: null,
  },
  tiktok: {
    maxTextLength: 2200,
    maxImages: 0,
    maxVideoLength: 600,
    maxVideoSize: 4 * 1024 * 1024 * 1024,
    supportedMediaTypes: ['video/mp4'],
    hashtagLimit: null,
  },
  pinterest: {
    maxTextLength: 500,
    maxImages: 5,
    maxVideoLength: 900,
    maxVideoSize: 2 * 1024 * 1024 * 1024,
    supportedMediaTypes: ['image/jpeg', 'image/png', 'video/mp4'],
    hashtagLimit: 20,
  },
  youtube: {
    maxTextLength: 5000,
    maxImages: 0,
    maxVideoLength: 43200,
    maxVideoSize: 256 * 1024 * 1024 * 1024,
    supportedMediaTypes: ['video/mp4', 'video/avi', 'video/mov'],
    hashtagLimit: 15,
  },
};

export const PLATFORM_NAMES: Record<PlatformType, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'X (Twitter)',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  pinterest: 'Pinterest',
  youtube: 'YouTube',
};

export const PLATFORM_COLORS: Record<PlatformType, string> = {
  facebook: '#1877F2',
  instagram: '#E4405F',
  twitter: '#000000',
  linkedin: '#0A66C2',
  tiktok: '#000000',
  pinterest: '#BD081C',
  youtube: '#FF0000',
};
