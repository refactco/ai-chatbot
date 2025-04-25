import { setupWorker } from 'msw';
import { handlers, authHandlers } from './handlers';

// Export the worker directly
export const worker = setupWorker(...authHandlers, ...handlers); 