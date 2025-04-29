/**
 * Browser MSW Worker Setup
 *
 * This file sets up the MSW worker for browser environments.
 * It's used for client-side API mocking during development.
 *
 * Features:
 * - Client-side MSW configuration
 * - Request handlers registration
 * - Service worker integration
 *
 * The worker is imported by the initialize module and started
 * when the application runs in a browser environment.
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * MSW worker instance configured with all mock API handlers
 */
export const worker = setupWorker(...handlers);
