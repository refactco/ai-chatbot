/**
 * Mock API utilities
 *
 * This file contains utility functions for the mock API implementation
 * that simulate real-world API behavior (delays, errors, etc.)
 */

// Simulate network delay
export const simulateDelay = async (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Mock API response structure
export type MockResponse<T> = {
  data: T;
  error?: string;
  status: number;
};

// Simulate API success response
export const mockSuccess = <T>(
  data: T,
  delay: number = 500,
): Promise<MockResponse<T>> => {
  return simulateDelay(delay).then(() => ({
    data,
    status: 200,
  }));
};

// Simulate API error response
export const mockError = <T>(
  message: string,
  status: number = 400,
  delay: number = 500,
): Promise<MockResponse<T>> => {
  return simulateDelay(delay).then(() => ({
    data: null as unknown as T,
    error: message,
    status,
  }));
};

// Random failure for testing error handling (fails ~20% of the time)
export const randomFailure = <T>(
  data: T,
  failureMsg: string = 'Random API failure',
  delay: number = 500,
): Promise<MockResponse<T>> => {
  return simulateDelay(delay).then(() => {
    if (Math.random() < 0.2) {
      return {
        data: null as unknown as T,
        error: failureMsg,
        status: 500,
      };
    }
    return {
      data,
      status: 200,
    };
  });
};

// Mock storage utilities using localStorage
export const mockStorage = {
  // Get item from localStorage
  getItem: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(`mock_${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error retrieving ${key} from mock storage:`, error);
      return null;
    }
  },

  // Set item in localStorage
  setItem: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(`mock_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Error storing ${key} in mock storage:`, error);
    }
  },

  // Remove item from localStorage
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(`mock_${key}`);
    } catch (error) {
      console.error(`Error removing ${key} from mock storage:`, error);
    }
  },

  // Clear all mock storage items
  clear: (): void => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('mock_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing mock storage:', error);
    }
  },
};

// Generate a simple UUID for mock entities
export const generateId = (): string => {
  return (
    'id-' +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Pagination helper
export type PaginatedResponse<T> = {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export const paginateResults = <T>(
  items: T[],
  page: number = 1,
  pageSize: number = 10,
): PaginatedResponse<T> => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    totalItems: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
};
