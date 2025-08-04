import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: '/index.html' // Abre automáticamente
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        biotienda: resolve(__dirname, 'public/biotienda.html'),
        menu: resolve(__dirname, 'public/menu.html'),
        admin: resolve(__dirname, 'public/admin/index.html')
      }
    }
  }
});