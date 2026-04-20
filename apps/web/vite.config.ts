import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/newswalla/',
  server: {
    port: 5173,
    proxy: {
      '/newswalla/api': { target: 'http://localhost:3060', rewrite: (path) => path.replace(/^\/newswalla/, '') },
      '/newswalla/uploads': { target: 'http://localhost:3060', rewrite: (path) => path.replace(/^\/newswalla/, '') },
    },
  },
});
