/**
 * Theme Provider Component
 *
 * This component wraps the application with Next.js theme context provider.
 * Features:
 * - Provides dark/light theme switching capability
 * - Persists theme preference in localStorage
 * - Supports system theme detection
 * - Enables theme values to be accessed throughout the application
 * - Manages CSS class application for theme switching
 *
 * This is a core infrastructure component that enables theming support
 * across the entire application with minimal configuration.
 */

'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';

/**
 * ThemeProvider wrapper component
 * @property children - Child components to be wrapped with theme context
 * @property props - Additional theme provider configuration options
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
