import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  build: {
    // Vite inlines files under 4 KB into the JavaScript by default. The small
    // WebP sponsor logos would then sit in the main bundle that every page must
    // download before it can render, so keep images as separate files.
    assetsInlineLimit: (filePath) => (filePath.endsWith('.webp') ? false : undefined),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
