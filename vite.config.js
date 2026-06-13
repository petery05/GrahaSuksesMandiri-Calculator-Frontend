import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward API calls to the Django dev server
      '/api': 'http://localhost:8000',
    },
  },
});
