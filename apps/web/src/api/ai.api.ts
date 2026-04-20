import api from './client';

export const generateCaption = (data: { topic: string; platform?: string; tone?: string }) =>
  api.post('/ai/generate-caption', data);
export const generateHashtags = (data: { content: string; platform?: string }) =>
  api.post('/ai/generate-hashtags', data);
export const rewriteContent = (data: { content: string; style: string }) =>
  api.post('/ai/rewrite', data);
