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
 * - Support for toggling between real and mock APIs
 *
 * This is the entry point for setting up mock API handlers and should be
 * imported and called during application initialization.
 */

export async function initializeMocks() {
  // Don't initialize mocks if using real API and API mocking isn't explicitly enabled
  if (
    process.env.NEXT_PUBLIC_USE_REAL_API === 'true' &&
    process.env.NEXT_PUBLIC_API_MOCKING !== 'enabled'
  ) {
    console.log('🔶 Using real API - MSW disabled');
    return null;
  }

  if (typeof window === 'undefined') {
    // For Node.js environment (SSR)
    const { server } = await import('./node');
    server.listen({ onUnhandledRequest: 'bypass' });
    console.log('🔶 MSW server started');
    return server;
  } else {
    // For browser environment
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
