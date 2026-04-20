import { create } from 'zustand';
import * as authApi from '../api/auth.api';

interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  timezone: string;
  plan: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('newswalla_token'),
  loading: true,

  login: async (email, password) => {
    const { data } = await authApi.login(email, password);
    localStorage.setItem('newswalla_token', data.token);
    set({ user: data.user, token: data.token });
  },

  register: async (email, password, fullName) => {
    const { data } = await authApi.register({ email, password, fullName });
    localStorage.setItem('newswalla_token', data.token);
    set({ user: data.user, token: data.token });
  },

  logout: () => {
    localStorage.removeItem('newswalla_token');
    set({ user: null, token: null });
  },

  loadUser: async () => {
    try {
      const token = localStorage.getItem('newswalla_token');
      if (!token) { set({ loading: false }); return; }
      const { data } = await authApi.getMe();
      set({ user: data, loading: false });
    } catch {
      localStorage.removeItem('newswalla_token');
      set({ user: null, token: null, loading: false });
    }
  },
}));
