/**
 * Jest Configuration
 *
 * This configuration file sets up Jest for testing React components in a Next.js application.
 * It includes support for TypeScript and provides appropriate test environment settings.
 *
 * Features:
 * - TypeScript support via ts-jest
 * - DOM testing environment
 * - Module name mapping for Next.js
 * - Setup files for jest-dom extensions
 */

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js|jsx)'],
  // Ignore build directories
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
