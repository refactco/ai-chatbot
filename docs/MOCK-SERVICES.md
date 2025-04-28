# Mock Services Implementation

This project uses a comprehensive mock service implementation to simulate backend behavior during development. This enables development and testing of frontend features before the real backend is available.

## Overview

The mock services implementation consists of:

1. **Mock API Service** (`lib/services/mock-api-service.ts`): Core implementation that simulates API responses and streaming.
2. **Local Storage API Service** (`lib/services/api-service.ts`): Provides local storage-based persistence for chat history and user data.
3. **Mock Service Worker** (MSW): Intercepts HTTP requests at the network level for a realistic mock API experience.

## API Endpoints

The following API endpoints are mocked:

- `POST /api/chat/message`: Processes user messages sent to the AI
- `POST /api/chat/stream`: Streams AI responses back to the client
- `GET /api/chats`: Retrieves a list of chat history
- `GET /api/chat/:chatId`: Gets a specific chat and its messages
- `POST /api/chat`: Creates a new chat
- `GET /api/document`: Retrieves document versions for artifacts
- `POST /api/document`: Creates new document versions
- `DELETE /api/document`: Restores previous document versions

## Special Message Commands

The mock API service recognizes special commands that trigger different response types:

### Basic Commands

- `!image`: Returns a response with an image attachment
- `!sheet`: Returns a response with a spreadsheet attachment
- `!article`: Returns a response with a text document attachment
- `!reasoning`: Returns a response with a reasoning explanation

### Artifact Testing Commands

- `test image artifact`: Creates a test image artifact
- `test text artifact`: Creates a test text document artifact
- `test sheet artifact`: Creates a test spreadsheet artifact

## Storage System

The mock implementation includes a dual storage approach:

### API-Based Storage Simulation

For documents that don't have special prefixes, the system simulates API-based storage:
- `GET /api/document?id=${documentId}` returns document versions
- `POST /api/document?id=${documentId}` creates new versions
- `DELETE /api/document?id=${documentId}&timestamp=${timestamp}` restores versions

### Local Storage Implementation

For documents with special prefixes (`local:`, `text:`, `sheet:`, etc.), the system uses browser's localStorage:
- Document versions are stored with keys like `local-document-${documentId}`
- Versions are maintained as JSON arrays with timestamp-based ordering
- Version restoration works by filtering out newer versions

## Development with Mock Services

### Enabling/Disabling MSW

MSW is enabled in development mode by default. Toggle it by setting the `NEXT_PUBLIC_API_MOCKING` environment variable in `.env.development`:

```
NEXT_PUBLIC_API_MOCKING=enabled  # To enable MSW
NEXT_PUBLIC_API_MOCKING=disabled # To disable MSW
```

### Extending the Mock API

To add new endpoints or modify existing ones:

1. Edit `mocks/handlers.ts` to add or modify request handlers
2. For new features, add corresponding implementation in `mock-api-service.ts`
3. Update the `apiService` in `lib/services/api-service.ts` to use the new endpoints

### Testing Artifact Generation

1. Start a chat conversation in the application
2. Type one of the artifact test commands (e.g., `test text artifact`)
3. Interact with the generated artifact
4. Test version control by:
   - Making changes to create multiple versions
   - Using navigation controls to browse versions
   - Trying version restoration

### Real API Integration

When transitioning to a real API:

1. Set `NEXT_PUBLIC_API_MOCKING=disabled` in your environment variables
2. Follow the migration strategy in API-INTEGRATION.md
3. Ensure real API endpoints match the paths used in the application

## Troubleshooting

If you encounter issues with mock services:

1. **General Issues**:
   - Check the browser console for MSW-related log messages
   - Verify service worker registration if using MSW (`mockServiceWorker.js`)
   - Ensure API paths match between handlers and application code

2. **Artifact System Issues**:
   - For localStorage documents, check browser's Application > Local Storage
   - Look for keys starting with `local-document-`
   - Examine the JSON structure for proper versioning information

3. **Version Control Issues**:
   - Ensure timestamps in document versions are properly ordered
   - Check console logs for version creation and restoration operations
   - Verify that content is being properly saved in each version

## Performance Considerations

The mock implementation includes realistic delays to simulate network latency. If you need to adjust these for development:

1. Modify delay values in `mock-api-service.ts` (search for `setTimeout`)
2. For MSW handlers, adjust delay time in `mocks/handlers.ts`

## Future Improvements

Planned enhancements to the mock services:

1. Advanced error simulation for testing error handling
2. Network condition simulation (slow connections, intermittent failures)
3. Enhanced artifact generation with more realistic content
4. Collaborative editing simulation for multi-user testing 