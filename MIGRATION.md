# Migration Guide: From AI-Specific to API-Focused Architecture

This guide outlines the steps to migrate the codebase from an AI-specific implementation to a purely API-focused architecture. The frontend will interact with the API (mock or real) without any direct AI-specific code.

## Migration Overview

1. Move from `/lib/ai` to `/lib/api`
2. Update imports across components
3. Simplify type definitions
4. Test with the mock API

## Step 1: Create API-Focused Modules

We've created the following new modules:

- `/lib/api/types.ts`: Contains all the types needed for the chat interface
- `/lib/api/chat.ts`: Contains the `useChat` hook for managing chat state
- `/lib/api/index.ts`: Exports all API-related functions and types

## Step 2: Update Component Imports

For each component that imports from `/lib/ai`, update the imports to use `/lib/api` instead:

```diff
- import type { Attachment, UIMessage } from '@/lib/ai/types';
- import { useChat } from '@/lib/ai/react';
+ import type { Attachment, UIMessage } from '@/lib/api/types';
+ import { useChat } from '@/lib/api/chat';
```

Components to update:
- `components/chat.tsx`
- `components/message.tsx`
- `components/multimodal-input.tsx`
- `components/artifact.tsx`
- `components/message-actions.tsx`
- `components/messages.tsx`
- `components/preview-attachment.tsx`
- `components/artifact-messages.tsx`
- `app/(chat)/chat/[id]/page.tsx`

## Step 3: Update Service Implementations

The API service implementations remain the same, but we need to update their imports:

```diff
- import type { Attachment } from '@/lib/ai/types';
+ import type { Attachment } from '@/lib/api/types';
```

Files to update:
- `lib/services/mock-api-service.ts`
- `lib/services/api-service.ts`
- `lib/utils.ts`
- `mocks/handlers.ts`

## Step 4: Artifact Implementation Updates

For the artifact implementation files, update imports and remove AI-specific code:

```diff
- import { provider } from '@/lib/ai/providers';
- import { streamText } from '@/lib/ai/stream-utils';
+ import { apiService } from '@/lib/api';
```

Files to update:
- `artifacts/text/server.ts`
- `artifacts/image/server.ts`
- `artifacts/sheet/server.ts`

## Step 5: Test With the Mock API

To verify the migration:

1. Start the development server
2. Test chat functionality
3. Test artifact creation and interaction
4. Verify version control works correctly

## Step 6: Final Cleanup

Once all components are working correctly:

1. Remove the `/lib/ai` directory
2. Update documentation to reflect the API-focused architecture

## Benefits of the Migration

1. **Cleaner Architecture**: The codebase now clearly separates API interactions from UI components
2. **Framework Agnostic**: The frontend doesn't depend on any specific AI implementation
3. **Easier API Integration**: When connecting to a real backend, only the API service needs to be updated
4. **Simplified Testing**: Mocking is more straightforward with a pure API approach

## Note About the Mock Implementation

The mock implementation (`mock-api-service.ts`) remains the same, continuing to simulate API responses with attachments, reasoning, and streaming capabilities. This allows the frontend to be developed and tested independently of the backend. 