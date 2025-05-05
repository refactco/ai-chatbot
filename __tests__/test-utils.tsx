/**
 * Test Utilities
 *
 * This file provides utility functions and wrappers for testing components.
 * It helps with consistent test setup across all test files.
 *
 * Features:
 * - Custom render method with providers
 * - Common test utilities
 */

import {
  RenderOptions,
  render as testingLibraryRender,
} from '@testing-library/react';
import React, { ReactElement } from 'react';

// Function to create a wrapper with providers
function AllTheProviders({ children }: { children: React.ReactNode }) {
  // Add any providers here (ThemeProvider, etc.)
  return <>{children}</>;
}

// Custom render method that includes providers
const render = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  testingLibraryRender(ui, { wrapper: AllTheProviders, ...options });

// Export our custom render
export { render };
