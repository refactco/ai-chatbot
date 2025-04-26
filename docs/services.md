# Services

This document outlines the key services, API routes, and server-side functionality in the application.

## API Routes

The application uses Next.js API routes to handle server-side operations. These routes are organized as follows:

### Authentication API Routes

**Path**: `/app/(auth)/api`

- **Registration**: Handles user registration
- **Login**: Processes user login
- **Session Management**: Manages user sessions
- **Logout**: Handles user logout

### Chat API Routes

**Path**: `/app/(chat)/api`

These routes handle the chat functionality including:

- **Chat Completion**: Processes chat messages and gets AI responses
- **Chat History**: Manages and retrieves user chat history
- **Message Management**: Stores and retrieves individual messages

### AI Integration

The application integrates with various AI models through a unified interface. The main services include:

- **Provider Integration**: Connect to different AI providers
- **Model Selection**: Allow selection of different AI models
- **Chat Completion**: Process messages and generate responses
- **Streaming**: Support for streaming responses
- **Tool Usage**: Enable AI models to use tools
- **Multimodal Inputs**: Process different types of inputs (text, images, documents)

### Database Services

The application uses Drizzle ORM with PostgreSQL to manage data:

- **User Management**: Store and retrieve user information
- **Chat History**: Persist chat conversations
- **Message Storage**: Store individual messages
- **Artifact Management**: Store metadata about generated artifacts

### Authentication Service

Built on Next-Auth, the authentication service handles:

- **User Registration**: Creating new user accounts
- **User Login**: Authenticating existing users
- **Session Management**: Maintaining user sessions
- **Password Hashing**: Securely storing user passwords
- **OAuth Integration**: Support for third-party authentication

### Blob Storage

Uses Vercel Blob for file storage:

- **File Upload**: Handling file uploads
- **File Retrieval**: Retrieving stored files
- **Document Processing**: Processing uploaded documents
- **Image Storage**: Storing and retrieving images

### Server Actions

Next.js server actions handle various operations:

- **Chat Management**: Creating and updating chats
- **User Settings**: Managing user preferences
- **Artifact Creation**: Generating and managing artifacts
- **Document Processing**: Processing and storing documents

## Key Service Files

### AI Services

- `/lib/ai/providers.ts`: AI provider configuration
- `/lib/ai/models.ts`: Model definitions
- `/lib/ai/prompts.ts`: Prompt templates for AI models
- `/lib/ai/tools/`: Tools for AI to use

### Database Services

- `/lib/db/index.ts`: Database connection configuration
- `/lib/db/schema/`: Database schema definitions
- `/lib/db/migrate.ts`: Database migration utilities

### Authentication Services

- `/app/(auth)/auth.ts`: Authentication utilities
- `/app/(auth)/auth.config.ts`: Authentication configuration
- `/app/(auth)/actions.ts`: Authentication server actions

### Server Actions

- `/app/(chat)/actions.ts`: Chat-related server actions

## Service Workflows

### Chat Workflow

1. User sends a message via the UI
2. The message is processed by the client-side chat component
3. The message is sent to the AI service via API route
4. The AI service processes the message and generates a response
5. The response is streamed back to the client
6. The chat history is updated in the database
7. The UI is updated with the new message and response

### Authentication Workflow

1. User submits login or registration form
2. Credentials are sent to authentication API route
3. The authentication service processes the credentials
4. If valid, a session is created and the user is redirected
5. If invalid, an error is returned and displayed to the user

### Artifact Creation Workflow

1. User initiates artifact creation
2. The client sends request to server action
3. The server processes the request and generates the artifact
4. The artifact is stored in blob storage
5. The artifact metadata is stored in the database
6. The client is updated with the new artifact

### Document Processing Workflow

1. User uploads a document
2. The document is sent to the blob storage service
3. The document is processed and metadata is extracted
4. The document URL and metadata are stored in the database
5. The document is available for AI to reference in conversations 