import { create } from 'zustand';
import * as authApi from '../api/auth.api';
import { applyTheme } from '../i18n/themes';
import { getLanguage, LangCode } from '../i18n/translations';

interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  timezone: string;
  plan: string;
  role: string;
  language: string;
  theme: string;
  isActive: boolean;
  subscriptionStatus: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('newswalla_token'),
  loading: true,

  login: async (email, password) => {
    const { data } = await authApi.login(email, password);
    localStorage.setItem('newswalla_token', data.token);
    applyUserPrefs(data.user);
    set({ user: data.user, token: data.token });
  },

  register: async (email, password, fullName) => {
    const { data } = await authApi.register({ email, password, fullName });
    localStorage.setItem('newswalla_token', data.token);
    applyUserPrefs(data.user);
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
      applyUserPrefs(data);
      set({ user: data, loading: false });
    } catch {
      localStorage.removeItem('newswalla_token');
      set({ user: null, token: null, loading: false });
    }
  },

  updateUser: (data) => {
    set((state) => ({ user: state.user ? { ...state.user, ...data } : null }));
  },

  isAdmin: () => get().user?.role === 'admin',
}));

function applyUserPrefs(user: User) {
  if (user.theme) applyTheme(user.theme);
  if (user.language) {
    const lang = getLanguage(user.language as LangCode);
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = user.language;
    if (lang.font) {
      document.documentElement.style.fontFamily = `"${lang.font}", sans-serif`;
    } else {
      document.documentElement.style.fontFamily = '';
    }
  }
}
