# Mock API Documentation

This document explains how the mock API works and how to use it during frontend development.

## Overview

The mock API provides a client-side implementation of backend services, allowing frontend development without a database connection. It simulates API responses, manages data locally in the browser, and provides realistic behavior like network delays and error handling.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Application                            │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │   UI        │    │  Hooks &    │    │   Components    │  │
│  │ Components  │    │  Context    │    │                 │  │
│  └──────┬──────┘    └──────┬──────┘    └─────────┬───────┘  │
│         │                  │                     │          │
│         └──────────────────┼─────────────────────┘          │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │    Auth     │    │    Chat     │    │     Storage     │  │
│  │   Service   │    │   Service   │    │     Service     │  │
│  └──────┬──────┘    └──────┬──────┘    └─────────┬───────┘  │
│         │                  │                     │          │
│         └──────────────────┼─────────────────────┘          │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                       Mock API Layer                        │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │   Auth API  │    │   Chat API  │    │   Storage API   │  │
│  └──────┬──────┘    └──────┬──────┘    └─────────┬───────┘  │
│         │                  │                     │          │
│         └──────────────────┼─────────────────────┘          │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      localStorage                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │    Users    │    │    Chats    │    │     Files       │  │
│  │  Messages   │    │  Artifacts  │    │                 │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Key Features

1. **In-memory and localStorage persistence**: Data persists within a session and between page reloads
2. **Realistic API behavior**: Simulated delays, error states, and loading states
3. **Full CRUD operations**: Create, read, update, and delete operations for all entities
4. **Streaming responses**: Simulated streaming for chat completions
5. **Type-safe interfaces**: Full TypeScript typing matches expected backend responses

## Available APIs

### Authentication API

```typescript
import { authService } from 'lib/services/api-service';

// Register a new user
const newUser = await authService.register('John Doe', 'john@example.com', 'password123');

// Login
const authResponse = await authService.login('john@example.com', 'password123');

// Get current user
const currentUser = await authService.getCurrentUser();

// Logout
await authService.logout();

// Update profile
await authService.updateProfile(userId, { name: 'John Smith' });
```

### Chat API

```typescript
import { chatService } from 'lib/services/api-service';

// Get user's chats
const chats = await chatService.getUserChats(userId);

// Get single chat with messages
const chat = await chatService.getChatById(chatId);

// Create new chat
const newChat = await chatService.createChat(userId, 'New Conversation');

// Update chat
await chatService.updateChat(chatId, { title: 'Updated Title' });

// Delete chat
await chatService.deleteChat(chatId);

// Get chat messages
const messages = await chatService.getChatMessages(chatId);

// Create message
const newMessage = await chatService.createMessage(chatId, 'Hello!', 'user');

// Get AI completion
const completion = await chatService.createChatCompletion(chatId, 'What is React?');

// Stream AI completion
const streamedResponse = await chatService.streamChatCompletion(
  chatId, 
  'Tell me about Next.js',
  (chunk) => {
    // Handle each chunk as it arrives
    console.log('Chunk received:', chunk);
  }
);
```

### Storage API

```typescript
import storageService from 'lib/services/storage-service';

// Upload file
const file = new File([blob], 'example.jpg', { type: 'image/jpeg' });
const uploadedFile = await storageService.uploadFile(file, { 
  folder: 'chat-attachments',
  maxSizeMB: 5,
  acceptedTypes: ['image/jpeg', 'image/png', 'image/gif']
});

// Get file metadata
const fileInfo = await storageService.getFile(fileUrl);

// Get file data
const fileData = await storageService.getFileData(fileUrl);

// Delete file
await storageService.deleteFile(fileUrl);

// List files in folder
const files = await storageService.listFiles('chat-attachments');
```

## Demo Accounts

The mock API comes with pre-configured demo accounts:

| Email              | Password  | Description       |
|--------------------|-----------|-------------------|
| demo@example.com   | any       | Demo user account |
| test@example.com   | password  | Test user account |

## Data Persistence

Mock data is stored in localStorage with the following keys:

- `mock_users`: User accounts
- `mock_chats`: Chat conversations
- `mock_messages`: Chat messages
- `mock_artifacts`: Generated artifacts
- `mock_attachments`: File attachments
- `mock_file_*`: File data (as data URLs)

You can clear this data to reset the application state by running:

```javascript
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('mock_')) {
    localStorage.removeItem(key);
  }
});
```

## Adding New Mock Functionality

To add new mock functionality:

1. Define the data model in `lib/mockApi/models.ts`
2. Add mock data in `lib/mockApi/data.ts`
3. Create a new API file (e.g., `lib/mockApi/newFeatureApi.ts`)
4. Export the API from `lib/mockApi/index.ts`
5. Create a service wrapper in `lib/services/`

## Transitioning to Real API

The mock API is designed to be easily replaceable with a real backend API:

1. The service layer (`lib/services/`) provides a consistent interface
2. API response structures match expected backend responses
3. Replace mock API calls with real API calls when ready

To switch to a real API, update the service implementations to use fetch/axios instead of the mock API, while keeping the same function signatures and return types. 