import { defineConfig } from 'vite';

export default defineConfig({
  root: 'dist', // Serve from the dist directory where HTML files are
  server: {
    port: 3000,
    host: true,
    open: true // Automatically open browser
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false // Don't empty dist directory on build
  }
});