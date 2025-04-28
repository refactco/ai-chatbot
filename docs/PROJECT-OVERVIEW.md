# AI Chatbot Project Overview

## Introduction

This project is a modern, interactive AI chatbot application built with Next.js and React. It provides a user-friendly interface for interacting with AI models through text-based conversations. The application features a clean UI, responsive design, authentication capabilities, and real-time AI responses with support for rich content generation.

## Key Features

- **Interactive Chat Interface**: Modern UI for sending messages and receiving AI responses
- **Message Streaming**: Responses stream in real-time rather than appearing all at once
- **Authentication**: Login and registration system (currently using mock data)
- **Chat History**: Sidebar displays previous conversations
- **Artifact Generation**: Support for generating text documents, images, and spreadsheets
- **Version Control**: Complete history tracking for all artifact types
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: UI adapts to light and dark mode preferences

## Architecture

The application follows a modern React architecture with Next.js:

- **Frontend**: Next.js with React and TypeScript
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and context
- **Animation**: Framer Motion for smooth transitions
- **Data Fetching**: SWR for data and document management
- **Storage**: Dual support for API and localStorage
- **API Communication**: Currently using mock services to simulate backend

### Key Directories

- `/app`: Next.js app router pages and layouts
- `/components`: Reusable UI components
- `/lib`: Utility functions, types, and services
- `/artifacts`: Type-specific artifact implementations
- `/hooks`: Custom React hooks
- `/public`: Static assets
- `/docs`: Project documentation

## Core Components

### Authentication

- `app/(auth)/login/page.tsx`: Login page component
- `app/(auth)/register/page.tsx`: Registration page component

### Chat Interface

- `components/chat.tsx`: Main chat component integrating messages and input
- `components/message.tsx`: Renders individual messages with proper styling
- `components/messages.tsx`: Manages the collection of messages in a chat
- `components/multimodal-input.tsx`: Input component with attachment support

### Sidebar and Navigation

- `components/app-sidebar.tsx`: Main sidebar for navigation and chat history
- `components/sidebar-history.tsx`: Displays chat history in the sidebar

### Artifact System

- `components/artifact.tsx`: Main artifact panel with split-view layout
- `components/artifact-messages.tsx`: Specialized messages view for artifacts
- `components/artifact-actions.tsx`: Toolbar controls for artifact actions
- `components/version-footer.tsx`: Version restoration interface
- `components/data-stream-handler.tsx`: Handles streaming artifact data

### Artifact Type System

- `/artifacts/text/client.tsx`: Text document implementation
- `/artifacts/image/client.tsx`: Image artifact implementation
- `/artifacts/sheet/client.tsx`: Spreadsheet implementation

## Data Flow

1. User enters a message in the input component
2. Message is sent to mock API service (`lib/services/mock-api-service.ts`)
3. API response is streamed back to the UI
4. UI updates to display the message and response
5. For artifact generation:
   - Artifact data is streamed with `-delta` type attachments
   - DataStreamHandler recognizes and processes these attachments
   - Artifact panel becomes visible with the generated content
   - User can interact with and edit the artifact
   - Changes create new versions in the version history

## Storage Systems

The application supports two storage mechanisms:

### API-Based Storage

For production use, documents are managed through API endpoints:
- `/api/document?id=${documentId}` for fetching versions
- POST to same endpoint for creating new versions
- DELETE with timestamp for restoring versions

### Local Storage System

For development or special document types:
- Documents with `local:` prefix use localStorage
- Each document has a localStorage key: `local-document-${documentId}`
- Document versions are stored as a JSON array of document objects
- Version history and restoration work identically to API storage

## Version Control System

The artifact system includes comprehensive version control:

1. **Version Creation**: Each edit creates a new version with timestamp
2. **Version Navigation**: UI for browsing through version history
3. **Diff Mode**: Compare changes between versions
4. **Version Restoration**: Return to any previous state

## Mock API Services

Currently, backend functionality is simulated using:

- `lib/services/mock-api-service.ts`: Simulates AI responses and streaming
- `lib/services/api-service.ts`: Local storage-based persistence for user data

## Planned Integrations

- Real backend API integration with AI models
- OAuth authentication with Google
- Persistent database storage for chat history
- Advanced artifact generation with specialized AI models
- Enhanced version control with visual diff highlighting
- Collaborative editing features

## Development Guidelines

- Use TypeScript for type safety
- Follow component composition patterns
- Maintain responsive design principles
- Keep UI components modular and reusable
- Handle loading and error states gracefully
- Add comprehensive documentation for new features 