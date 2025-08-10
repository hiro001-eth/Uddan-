import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.int.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  roots: ['<rootDir>/tests'],
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
  setupFiles: ['dotenv/config'],
};

export default config;
