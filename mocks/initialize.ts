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
