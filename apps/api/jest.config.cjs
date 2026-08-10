const path = require('node:path');

/** @type {import('jest').Config} */
module.exports = {
  displayName: 'api',
  rootDir: __dirname,
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: path.join(__dirname, 'tsconfig.json') }],
  },
  moduleNameMapper: {
    '^@trailmate/shared$': '<rootDir>/../../packages/shared/src/index.ts',
  },
  clearMocks: true,
};
