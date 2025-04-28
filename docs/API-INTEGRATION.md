# AI Agent API Integration Guide

## Overview

This project serves as a frontend for an AI assistant application built with Next.js and React. It provides a modern UI for interacting with AI models through text-based conversations, with support for document processing and artifact generation.

## Current Architecture

The frontend communicates with the backend through three main API endpoints:
1. `sendMessage` - For sending user messages to the AI
2. `streamResponse` - For streaming AI responses back to the user
3. `getChatHistory` - For retrieving chat history

Currently, the application uses mock services to simulate backend behavior:

1. **Mock API Service** (`lib/services/mock-api-service.ts`): Simulates AI responses, chat history, and artifact generation
2. **Local Storage API Service** (`lib/services/api-service.ts`): Provides persistence using browser localStorage

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

## Authentication Integration

### Authentication with Google OAuth

Implement proper authentication using NextAuth.js:

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user ID to session
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Add Auth Headers to API Requests

Ensure API requests include authentication tokens:

```typescript
import { getSession } from 'next-auth/react';

// Add auth interceptor
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.user) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});
```

## Error Handling and Testing

### Error Handling Strategies

- Implement retry mechanisms for transient errors
- Add fallback content for failed API calls
- Create user-friendly error messages
- Log detailed error information for debugging

### Testing Strategy

1. Create a testing environment that can be switched between mock and real APIs
2. Implement feature flags to gradually roll out real API integration
3. Add monitoring and logging to catch integration issues

## Implementation Roadmap

1. **Authentication**: Implement Google OAuth with NextAuth.js
2. **Real API Integration**: Connect to the real backend API once it's ready
3. **Enhanced Error Handling**: Add more robust error handling for API failures
4. **Document Upload**: Implement the document upload functionality
5. **Artifact Generation**: Complete the integration of real artifact generation

## Key Components

- **AI Provider**: Acts as a bridge between the UI and the API (`lib/ai/providers.ts`)
- **Chat Component**: The main UI component for the chat interface (`components/chat.tsx`)
- **DataStreamHandler**: Handles streaming data for artifacts (`components/data-stream-handler.tsx`)
- **SidebarHistory**: Displays chat history from the API (`components/sidebar-history.tsx`)

## Notes

The mock API structure closely mirrors the expected real API, making the transition smoother when the backend is ready. The chat history currently uses in-memory storage that persists for the duration of the browser session. In the real implementation, this will be replaced with proper persistent storage in a database. 