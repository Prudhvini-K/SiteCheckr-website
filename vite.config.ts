import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/screenshot': 'http://localhost:3001',
      '/health': 'http://localhost:3001'
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
