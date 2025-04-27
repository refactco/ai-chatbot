# API Migration Guide

This document provides instructions for migrating from the mock API implementation to a real backend API.

## Overview

The application is currently using a client-side mock API to simulate backend functionality. This approach allows for frontend development without database dependencies. When the backend API is ready, you'll need to migrate from the mock implementation to the real API.

## Migration Strategy

The migration strategy follows these principles:

1. **Service Layer Pattern**: The service layer abstracts API calls from components
2. **Consistent Interfaces**: All API functions maintain consistent signatures
3. **Progressive Migration**: APIs can be migrated one at a time
4. **Type Safety**: TypeScript interfaces ensure compatible data structures

## Migration Steps

### 1. Configure API Endpoints

Create an API configuration file:

```typescript
// lib/config/api.ts
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com/v1',
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      USER: '/auth/user',
    },
    CHAT: {
      LIST: '/chats',
      DETAIL: (id: string) => `/chats/${id}`,
      CREATE: '/chats',
      UPDATE: (id: string) => `/chats/${id}`,
      DELETE: (id: string) => `/chats/${id}`,
      MESSAGES: (id: string) => `/chats/${id}/messages`,
      COMPLETION: '/chat/completion',
    },
    STORAGE: {
      UPLOAD: '/storage/upload',
      FILES: '/storage/files',
      FILE: (id: string) => `/storage/files/${id}`,
    }
  }
};
```

### 2. Create API Client

Implement a simple API client using fetch or Axios:

```typescript
// lib/services/api-client.ts
import { API_CONFIG } from '../config/api';

// HTTP error with status code
export class ApiError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Base API client
export const apiClient = {
  // GET request
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...options?.headers,
      },
      ...options,
    });

    return handleResponse<T>(response);
  },

  // POST request
  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return handleResponse<T>(response);
  },

  // PUT request
  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return handleResponse<T>(response);
  },

  // DELETE request
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...options?.headers,
      },
      ...options,
    });

    return handleResponse<T>(response);
  },
};

// Helper to get auth header
function getAuthHeader() {
  // For client-side requests, get the token from localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

// Helper to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `API error: ${response.status}`,
      response.status
    );
  }

  // Check if the response is empty
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  
  return {} as T;
}
```

### 3. Update Service Implementations

Refactor each service to use the real API:

#### Authentication Service

```typescript
// lib/services/auth-service.ts
import { apiClient } from './api-client';
import { API_CONFIG } from '../config/api';
import type { User, AuthResponse } from '../types';

export const authService = {
  // Register a new user
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      name,
      email,
      password
    });
  },
  
  // Login a user
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      email,
      password
    });
    
    // Store token in localStorage
    localStorage.setItem('auth_token', response.token);
    
    return response;
  },
  
  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      return await apiClient.get<User>(API_CONFIG.ENDPOINTS.AUTH.USER);
    } catch (error) {
      localStorage.removeItem('auth_token');
      return null;
    }
  },
  
  // Update user profile
  updateProfile: async (userId: string, userData: Partial<User>): Promise<User> => {
    return apiClient.put<User>(`${API_CONFIG.ENDPOINTS.AUTH.USER}/${userId}`, userData);
  },
  
  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } finally {
      localStorage.removeItem('auth_token');
    }
  }
};
```

#### Chat Service

```typescript
// lib/services/chat-service.ts
import { apiClient } from './api-client';
import { API_CONFIG } from '../config/api';
import type { 
  Chat, 
  Message, 
  ChatDetailResponse,
  ChatCompletionResponse
} from '../types';

export const chatService = {
  // Get all chats for a user
  getUserChats: async (userId: string): Promise<Chat[]> => {
    const response = await apiClient.get<{ chats: Chat[] }>(
      `${API_CONFIG.ENDPOINTS.CHAT.LIST}?userId=${userId}`
    );
    return response.chats;
  },
  
  // Get a single chat by ID
  getChatById: async (chatId: string): Promise<ChatDetailResponse> => {
    return apiClient.get<ChatDetailResponse>(
      API_CONFIG.ENDPOINTS.CHAT.DETAIL(chatId)
    );
  },
  
  // Create a new chat
  createChat: async (userId: string, title: string): Promise<Chat> => {
    return apiClient.post<Chat>(API_CONFIG.ENDPOINTS.CHAT.CREATE, {
      userId,
      title
    });
  },
  
  // And other methods similarly...
};
```

### 4. Setup Environment Variables

Add the following to your `.env.local` file:

```
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/v1
NEXT_PUBLIC_API_TIMEOUT=30000
```

### 5. Test and Validate

Test each API endpoint to ensure compatibility:

1. Verify that expected data structures match
2. Check error handling
3. Validate authentication flows
4. Test with real backend endpoints

### 6. Incremental Rollout

You can incrementally roll out API migration:

1. Start with non-critical endpoints
2. Use feature flags to toggle between mock and real
3. Monitor errors during transition

### Fallback Strategy

Implement a fallback strategy to revert to mock API if needed:

```typescript
// lib/services/api-service.ts
import { realAuthService } from './real-auth-service';
import { mockAuthService } from './mock-auth-service';

const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === 'true';

// Export real or mock services based on config
export const authService = USE_REAL_API ? realAuthService : mockAuthService;
```

## API Differences to Watch For

When migrating, be aware of these potential differences:

1. **Pagination**: Backend may use different pagination patterns
2. **Error Formats**: Error responses may differ
3. **Date Formats**: Ensure consistent date handling
4. **Authentication**: Token formats and refresh mechanisms may differ
5. **Rate Limiting**: Backend may implement rate limiting

## Testing during Migration

During migration, implement thorough testing:

1. **Unit Tests**: Test individual service functions
2. **Integration Tests**: Test complete workflows
3. **UI Tests**: Ensure the UI works with the real API
4. **Error Handling**: Test error states and recovery

By following this guide, you should be able to smoothly migrate from the mock API to a real backend API while maintaining application functionality. 