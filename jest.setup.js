/**
 * Jest Setup File
 *
 * This file configures the testing environment before each test runs.
 * It imports the @testing-library/jest-dom library to extend Jest with custom matchers
 * for asserting on DOM elements.
 *
 * Features:
 * - DOM element matchers (toBeInTheDocument, toHaveTextContent, etc.)
 * - Custom jest-dom extensions
 */

// Import jest-dom additions
import '@testing-library/jest-dom';

// Mock the next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Define any global variables or settings for tests here
