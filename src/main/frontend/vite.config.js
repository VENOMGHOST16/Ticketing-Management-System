import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // forward requests starting with /api to Spring Boot at :8080
      '/api': 'http://localhost:8080'
    }
  }
});