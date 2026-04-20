import { create } from 'zustand';
import * as postsApi from '../api/posts.api';

interface PostState {
  posts: any[];
  total: number;
  loading: boolean;
  fetchPosts: (params?: any) => Promise<void>;
  createPost: (data: any) => Promise<any>;
  deletePost: (id: string) => Promise<void>;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  total: 0,
  loading: false,

  fetchPosts: async (params) => {
    set({ loading: true });
    try {
      const { data } = await postsApi.getPosts(params);
      set({ posts: data.posts, total: data.total, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  createPost: async (postData) => {
    const { data } = await postsApi.createPost(postData);
    set((state) => ({ posts: [data, ...state.posts] }));
    return data;
  },

  deletePost: async (id) => {
    await postsApi.deletePost(id);
    set((state) => ({ posts: state.posts.filter(p => p.id !== id) }));
  },
}));
