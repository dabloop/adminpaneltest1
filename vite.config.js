import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    outDir: 'dist',  // Ensure this matches your deployment expectations
  },
  server: {
    open: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  preview: {
    open: true,
    host: true,
    port: 80,  // This is the port your frontend is running on
    historyApiFallback: true,  // Ensure SPA routes are handled correctly
  },
});
