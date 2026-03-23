import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    include: ['src/tests/**/*.test.{js,jsx}'],
    exclude: ['src/tests/**/*.integration.test.{js,jsx}'],
    globals: true,
  },
});
