'use client';

import { useEffect, useState } from 'react';
import { ReactNode } from 'react';

export function MSWProvider({ children }: { children: ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    async function enableMocking() {
      if (process.env.NODE_ENV !== 'development') {
        return;
      }

      try {
        // Set a mock AUTH_SECRET for development
        if (typeof window !== 'undefined') {
          // @ts-ignore - This is a hack for development only
          window.process = window.process || {};
          // @ts-ignore
          window.process.env = window.process.env || {};
          // @ts-ignore
          window.process.env.AUTH_SECRET = 'development-secret-key-not-for-production';
        }

        // Dynamically import MSW to avoid import validation issues
        const { worker } = await import('@/mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
        console.log('%c MSW enabled for development', 'color: green; font-weight: bold;');
        setMswReady(true);
      } catch (error) {
        console.error('Error starting MSW:', error);
      }
    }

    enableMocking();
  }, []);

  return <>{children}</>;
} 