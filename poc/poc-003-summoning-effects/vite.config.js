import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'gsap': ['gsap'],
          'particles': ['@tsparticles/engine', '@tsparticles/slim']
        }
      }
    }
  },
  server: {
    port: 3003,
    open: true,
    cors: true
  },
  optimizeDeps: {
    include: ['three', 'gsap', '@tsparticles/engine', '@tsparticles/slim']
  }
});