# AI Agent Frontend

This project serves as the frontend for a simple AI agent application. It's built on top of the IntelOps AI Chatbot template but customized to work with a dedicated backend for AI processing.

## Features

- **Simple Text Interface**: Users can send text messages to the AI and receive responses
- **Document Support**: Users can upload documents that the AI can process (future implementation)
- **Artifact Support**: The AI can generate code, tables, and text artifacts (future implementation)
- **Streaming Responses**: The AI responses are streamed in real-time
- **Chat History**: Conversations are preserved and can be accessed from the sidebar
- **Authentication**: Uses Google OAuth for user authentication (to be implemented)

## Architecture

The frontend communicates with the backend through three main API endpoints:
1. `sendMessage` - For sending user messages to the AI
2. `streamResponse` - For streaming AI responses back to the user
3. `getChatHistory` - For retrieving chat history

Currently, the application uses a mock API service that simulates these endpoints, allowing frontend development to proceed without the backend being ready.

## Key Components

- **Mock API Service**: Simulates the backend API endpoints (`lib/services/mock-api-service.ts`)
- **AI Provider**: Acts as a bridge between the UI and the API (`lib/ai/providers.ts`)
- **Chat Component**: The main UI component for the chat interface (`components/chat.tsx`)
- **DataStreamHandler**: Handles streaming data for artifacts (`components/data-stream-handler.tsx`)
- **SidebarHistory**: Displays chat history from the mock API (`components/sidebar-history.tsx`)

## Implementation Details

### Mock API

The mock API simulates backend behavior with:
- Message processing
- Response streaming
- Chat history management
- In-memory chat storage
- Delay simulation for realistic feel

### API Integration

When the real backend is ready, you'll need to:
1. Replace the mock API service with real API calls
2. Update authentication to use Google OAuth
3. Ensure proper error handling and state management

## Next Steps

1. **Authentication**: Implement Google OAuth with Supabase
2. **Real API Integration**: Connect to the real backend API once it's ready
3. **Enhanced Error Handling**: Add more robust error handling for API failures
4. **Document Upload**: Implement the document upload functionality
5. **Artifact Generation**: Complete the integration of artifact generation

## Development

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Notes

This implementation provides a foundation that balances immediate development needs with future integration capabilities. The mock API structure closely mirrors the expected real API, making the transition smoother when the backend is ready. 

The chat history functionality uses an in-memory storage solution that persists for the duration of the browser session. Once refreshed, the history starts over - this is expected in the mock implementation but will be replaced with proper persistent storage in the real implementation. 