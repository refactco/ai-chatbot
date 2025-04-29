/**
 * Node.js MSW Server Setup
 *
 * This file sets up the MSW server for Node.js environments.
 * It's used for server-side rendering (SSR) during development.
 *
 * Features:
 * - Server-side MSW configuration
 * - Request handlers registration
 * - Used in server-side contexts like Next.js API routes
 *
 * The server is imported by the initialize module and started
 * when the application runs in a Node.js environment.
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW server instance configured with all mock API handlers
 */
export const server = setupServer(...handlers);
