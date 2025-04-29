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
 *
 * This is the entry point for setting up mock API handlers and should be
 * imported and called during application initialization.
 */

export async function initializeMocks() {
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
