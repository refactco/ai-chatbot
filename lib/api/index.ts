/**
 * API Module Exports
 *
 * This file serves as the main entry point for all API-related functionality.
 * It centralizes exports from various API-related modules for convenient imports.
 *
 * Features:
 * - Centralized API exports
 * - Type definitions
 * - Chat hooks and utilities
 * - API service access
 *
 * By importing from this file, components can access all API-related
 * functionality without needing to know the specific module structure.
 */

// Export type definitions for API responses and requests
export * from './types';

// Export chat-related hooks and utilities
export * from './chat';

// Export the API service implementation
// This provides direct access to the API client
export { apiService } from '@/lib/services/api-service';
