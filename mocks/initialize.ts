/**
 * Mock API Initialization
 *
 * This file handles the initialization of Mock Service Worker (MSW)
 * for both server-side and client-side environments.
 *
 * Features:
 * - Environment detection (Node.js vs Browser)
 * - Conditional initialization based on environment
 * - Configurable through environment variables
 * - Console logging for debugging
 * - Support for real API integration
 *
 * This is the entry point for setting up mock API handlers and should be
 * imported and called during application initialization.
 */

// Flag to use real API instead of mocks
const USE_REAL_API = true; // Set to true to use the real API endpoint

export async function initializeMocks() {
  if (typeof window === 'undefined') {
    // For Node.js environment (SSR)
    if (USE_REAL_API) {
      console.log('🔶 Using real API endpoints - MSW server not started');
      return null;
    }

    const { server } = await import('./node');
    server.listen({ onUnhandledRequest: 'bypass' });
    console.log('🔶 MSW server started');
    return server;
  } else {
    // For browser environment
    if (USE_REAL_API) {
      console.log('🔶 Using real API endpoints - MSW worker not started');
      return null;
    }

    if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
      const { worker } = await import('./browser');
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      });
      console.log('🔶 MSW worker started');
      return worker;
    }
  }
}
