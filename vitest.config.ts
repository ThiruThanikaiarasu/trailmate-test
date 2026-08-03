import { defineConfig } from 'vitest/config';

// The API is tested with Jest (see apps/api/jest.config.cjs); Vitest covers the shared package and the web app.
export default defineConfig({
  test: {
    projects: ['packages/shared', 'apps/web'],
  },
});
