import api from './client';

export const getPosts = (params?: any) => api.get('/posts', { params });
export const getPost = (id: string) => api.get(`/posts/${id}`);
export const createPost = (data: any) => api.post('/posts', data);
export const updatePost = (id: string, data: any) => api.put(`/posts/${id}`, data);
export const deletePost = (id: string) => api.delete(`/posts/${id}`);
export const getCalendar = (start: string, end: string) =>
  api.get('/calendar', { params: { start, end } });
export const moveCalendarPost = (postId: string, newTime: string) =>
  api.put(`/calendar/${postId}/move`, { newTime });
