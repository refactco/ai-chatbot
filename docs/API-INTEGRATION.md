# AI Agent API Integration Guide

## Overview

This project serves as a frontend for an AI assistant application built with Next.js and React. It provides a modern UI for interacting with AI models through text-based conversations, with support for document processing and artifact generation.

## Current Architecture

The frontend communicates with the backend through several main API endpoints:
1. `sendMessage` - For sending user messages to the AI
2. `streamResponse` - For streaming AI responses back to the user
3. `getChatHistory` - For retrieving chat history
4. `document` - For managing document versions and content

Currently, the application uses mock services to simulate backend behavior:

1. **Mock API Service** (`lib/services/mock-api-service.ts`): Simulates AI responses, chat history, and artifact generation
2. **Local Storage API Service** (`lib/services/api-service.ts`): Provides persistence using browser localStorage
3. **Dual Storage System**: Supports both API and localStorage for artifact data

### Mock API Service Endpoints

The mock API service implements these key functions:

- `sendMessage`: Processes a user message and creates a chat entry
- `streamResponse`: Streams an AI response with support for text, reasoning, and attachments
- `getChatHistory`: Retrieves chat history for display in the sidebar
- `getChatById`: Gets a specific chat with its messages
- `createNewChat`: Creates a new conversation

### Mock Implementation Details

The mock API simulates backend behavior with:
- Message processing
- Response streaming
- Chat history management
- In-memory chat storage
- Delay simulation for realistic feel
- Artifact generation (text, images, data tables)
- Version control for artifacts

## Data Structures

### Message Types

```typescript
// Message structure for chat messages
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: Date;
  attachments?: Attachment[];
  reasoning?: string;
}

// UI message structure used in components
export interface UIMessage extends Message {
  attachments?: Attachment[];
  createdAt?: Date;
  reasoning?: string;
}
```

### Attachment Structure

```typescript
export interface Attachment {
  type: string;
  name?: string;
  content?: string;
  url: string;
}
```

### Document Structure

```typescript
export interface Document {
  id: string;
  kind: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
```

## Artifact System Integration

The artifact system uses a dual-storage approach for document management:

### API-Based Document Storage

```typescript
// Fetch document versions
const { data: apiDocuments } = useSWR<Array<Document>>(
  `/api/document?id=${documentId}`,
  fetcher
);

// Create new document version
await fetch(`/api/document?id=${documentId}`, {
  method: 'POST',
  body: JSON.stringify({
    title,
    content,
    kind,
  }),
});

// Restore previous document version
await fetch(
  `/api/document?id=${documentId}&timestamp=${timestamp}`,
  { method: 'DELETE' }
);
```

### Local Storage Document Management

For development or special document types, the system uses localStorage:

```typescript
// Storage key pattern
const localStorageKey = `local-document-${documentId}`;

// Save document versions
localStorage.setItem(localStorageKey, JSON.stringify(documents));

// Retrieve document versions
const storedData = localStorage.getItem(localStorageKey);
const documents = storedData ? JSON.parse(storedData) : [];
```

## Real Backend Integration Process

When the real backend is ready, follow these steps to integrate it:

### Step 1: Set Up API Client

Create a real API client that connects to your backend:

```typescript
// Example: lib/services/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
```

### Step 2: Implement Real API Service

Create a real implementation of the API service that replaces the mock version:

```typescript
// Example: lib/services/real-api-service.ts
import apiClient from './api-client';
import type { Attachment } from '@/lib/ai/types';
import type { ChatMessage, ChatSummary, StreamResponseOptions } from './types';

export const realApiService = {
  // Send a message to the AI
  sendMessage: async (
    message: string,
    attachments: Attachment[] = [],
    chatId?: string
  ): Promise<ChatMessage> => {
    const response = await apiClient.post('/api/message', {
      message,
      attachments,
      chatId,
    });
    return response.data;
  },

  // Stream an AI response
  streamResponse: async (
    message: string,
    options: StreamResponseOptions,
    chatId?: string,
    attachments: Attachment[] = []
  ): Promise<void> => {
    const { onChunk, onFinish, onError } = options;
    
    try {
      // Use SSE or WebSockets for streaming
      const eventSource = new EventSource(
        `/api/stream?message=${encodeURIComponent(message)}&chatId=${chatId || ''}`
      );
      
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onChunk(data);
      };
      
      eventSource.onerror = (error) => {
        eventSource.close();
        onError(new Error('Stream error'));
      };
      
      eventSource.addEventListener('complete', (event) => {
        const finalMessage = JSON.parse(event.data);
        onFinish(finalMessage);
        eventSource.close();
      });
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  },
  
  // Get chat history
  getChatHistory: async (limit = 20, offset = 0): Promise<ChatSummary[]> => {
    const response = await apiClient.get(`/api/chats?limit=${limit}&offset=${offset}`);
    return response.data;
  },
  
  // Get chat by ID
  getChatById: async (chatId: string) => {
    const response = await apiClient.get(`/api/chats/${chatId}`);
    return response.data;
  },
  
  // Create new chat
  createNewChat: async (): Promise<ChatSummary> => {
    const response = await apiClient.post('/api/chats');
    return response.data;
  },
  
  // Document API
  
  // Get document versions
  getDocumentVersions: async (documentId: string): Promise<Document[]> => {
    const response = await apiClient.get(`/api/document?id=${documentId}`);
    return response.data;
  },
  
  // Create document version
  createDocumentVersion: async (
    documentId: string,
    title: string,
    content: string,
    kind: string
  ): Promise<Document> => {
    const response = await apiClient.post(`/api/document?id=${documentId}`, {
      title,
      content,
      kind,
    });
    return response.data;
  },
  
  // Restore document version
  restoreDocumentVersion: async (
    documentId: string,
    timestamp: string
  ): Promise<void> => {
    await apiClient.delete(`/api/document?id=${documentId}&timestamp=${timestamp}`);
  },
};
```

### Step 3: Replace Mock Service References

Update imports throughout the application to use the real implementation:

```typescript
// Before
import { mockApiService } from '@/lib/services/mock-api-service';

// After
import { realApiService } from '@/lib/services/real-api-service';
```

### Step 4: Update Chat Component

Modify the Chat component to use the real API service:

```typescript
// In components/chat.tsx
const customHandleSubmit = async (
  event?: { preventDefault?: () => void },
  options?: any,
) => {
  event?.preventDefault?.();

  if (!input.trim()) return;

  try {
    // Use real API service
    const userMessage = await realApiService.sendMessage(input, attachments);
    
    // Add user message to UI
    append({
      id: userMessage.id,
      role: 'user',
      content: userMessage.content,
      createdAt: userMessage.createdAt,
      attachments: userMessage.attachments,
    });

    // Clear input and attachments
    setInput('');
    setAttachments([]);
    
    // Stream AI response
    await realApiService.streamResponse(
      userMessage.content,
      {
        onChunk: (chunk) => {
          // Handle streamed chunks
          setMessages((messages) => {
            // Implementation to handle chunks
            // ...
          });
        },
        onFinish: (message) => {
          // Handle completion
          // ...
        },
        onError: (error) => {
          console.error('Error streaming response:', error);
          toast.error('Error streaming response. Please try again.');
        }
      },
      id,
      userMessage.attachments || [],
    );
  } catch (error) {
    console.error('Error in handleSubmit:', error);
    toast.error('An error occurred. Please try again.');
  }
};
```

### Step 5: Update Artifact Component

Modify the artifact component to use real document API:

```typescript
// Replace in components/artifact.tsx
const { data: apiDocuments, mutate: mutateDocuments } = useSWR<Array<Document>>(
  shouldFetchDocument ? `/api/document?id=${actualDocumentId}` : null,
  fetcher,
);

// Replace handleContentChange with real API
const handleContentChange = useCallback(
  async (updatedContent: string) => {
    if (!artifact) return;
    
    setIsContentDirty(true);
    
    try {
      await realApiService.createDocumentVersion(
        artifact.documentId,
        artifact.title,
        updatedContent,
        artifact.kind
      );
      
      mutateDocuments();
      setIsContentDirty(false);
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to save changes. Please try again.');
      setIsContentDirty(false);
    }
  },
  [artifact, mutateDocuments]
);
```

## Authentication Integration

### JWT Authentication

Implement JWT-based authentication:

```typescript
// lib/services/auth-service.ts
import apiClient from './api-client';
import { User } from '@/lib/schema';

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/login', {
      email,
      password,
    });
    
    // Store tokens
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    
    return response.data;
  },
  
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/register', {
      name,
      email,
      password,
    });
    
    // Store tokens
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
    
    // Clear tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
  
  refreshToken: async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await apiClient.post('/api/auth/refresh', {
      refreshToken,
    });
    
    localStorage.setItem('token', response.data.token);
    
    return response.data.token;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },
};
```

### Axios Interceptor for Token Refresh

Add an interceptor to handle token expiration:

```typescript
// lib/services/api-client.ts
import axios from 'axios';
import { authService } from './auth-service';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Refresh token
        const newToken = await authService.refreshToken();
        
        // Update header
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Retry request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Testing the Integration

Test both the API service and authentication with these strategies:

1. **Start with Non-Critical Endpoints**: Begin by integrating read-only endpoints like chat history
2. **Add Authentication**: Implement login/register before message endpoints
3. **Integrate Message Endpoints**: Move to message sending and receiving
4. **Artifact Integration**: Finally, integrate artifact and document endpoints
5. **Error Handling**: Test all error scenarios thoroughly

## Real-time Features

For real-time updates and collaborative features:

```typescript
// Example WebSocket integration
const connectWebSocket = (userId: string, token: string) => {
  const socket = new WebSocket(
    `${process.env.NEXT_PUBLIC_WS_URL}/ws?userId=${userId}&token=${token}`
  );
  
  socket.onopen = () => {
    console.log('WebSocket connected');
  };
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    // Handle different message types
    switch (data.type) {
      case 'new_message':
        // Handle new message
        break;
      case 'artifact_update':
        // Handle artifact update
        break;
      case 'user_activity':
        // Handle user activity
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  };
  
  socket.onclose = () => {
    console.log('WebSocket disconnected');
    // Reconnect logic
    setTimeout(() => connectWebSocket(userId, token), 5000);
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return socket;
};
```

## Migration Strategy

To ensure a smooth transition from mock to real API:

1. **Parallel Implementation**: Keep mock services while implementing real ones
2. **Feature Flags**: Use environment variables to toggle between implementations
3. **Gradual Rollout**: Migrate one endpoint at a time
4. **Comprehensive Testing**: Test each migration thoroughly before proceeding
5. **Fallback Mechanisms**: Implement fallbacks to mock services if real API fails 