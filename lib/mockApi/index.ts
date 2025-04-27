/**
 * Mock API Index
 *
 * This file exports all mock API services and initializes the mock data.
 */

// Export models
export * from './models';

// Export utilities
export * from './utils';

// Export data
export * from './data';

// Export API services
export * as authApi from './authApi';
export * as chatApi from './chatApi';
export * as storageApi from './storageApi';

// Initialize mock data in localStorage
import { mockStorage } from './utils';
import { initializeMockData } from './data';

// Function to initialize the mock API
export const initMockApi = (): void => {
  // Only initialize if in browser environment
  if (typeof window !== 'undefined') {
    // Check if data is already initialized
    if (!mockStorage.getItem('mock_users')) {
      initializeMockData();
    }

    console.log('Mock API initialized');
  }
};

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  // Delay initialization to ensure it happens after hydration
  setTimeout(() => {
    initMockApi();
  }, 0);
}
