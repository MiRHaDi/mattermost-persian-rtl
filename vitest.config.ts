import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['webapp/src/**/*.test.ts'],
    restoreMocks: true,
  },
});
