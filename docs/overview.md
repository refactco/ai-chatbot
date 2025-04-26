# AI Chatbot - Project Overview

## Purpose and Goals

This project is an AI-powered chatbot application built with Next.js. The primary goals of the application are:

1. Provide an intuitive chat interface for users to interact with AI models
2. Support various AI providers/models with a unified interface
3. Enable authentication for personalized chat history
4. Support multimodal inputs including text, images, and documents
5. Allow for artifact creation and management
6. Provide data visualization capabilities

## High-Level Architecture

The application follows a modern web application architecture:

- **Frontend**: Next.js with React for the UI components
- **Backend**: Next.js API routes for server-side logic
- **Database**: PostgreSQL (via Vercel Postgres and Drizzle ORM)
- **Authentication**: Next-Auth for user authentication
- **AI Integration**: AI SDK for interfacing with various AI models
- **Styling**: Tailwind CSS for UI styling
- **Testing**: Playwright for end-to-end testing

## Tech Stack

### Frontend
- Next.js 15.3 (with App Router)
- React 19
- Tailwind CSS
- Radix UI components
- Framer Motion for animations
- CodeMirror for code editing
- ProseMirror for text editing

### Backend
- Next.js API Routes
- Drizzle ORM
- PostgreSQL (Vercel Postgres)
- Next-Auth for authentication

### AI/ML
- AI SDK (@ai-sdk/react, @ai-sdk/xai)
- Various AI model integrations

### Data Management
- Drizzle ORM
- Vercel Postgres
- Vercel Blob for file storage

### Testing & Quality
- Playwright for testing
- ESLint and Biome for linting
- TypeScript for type safety

### Deployment
- Vercel for hosting and deployment

## Key Features

1. Chat interface with AI models
2. User authentication and session management
3. Conversation history
4. Multimodal input support (text, images, documents)
5. Artifact creation and management
6. Code editing and highlighting
7. Text editing with rich formatting
8. Theme customization (light/dark)
9. Weather data visualization

## Directory Structure Overview

- `/app`: Next.js app router pages and API routes
- `/components`: React components
- `/lib`: Core utilities and business logic
- `/hooks`: Custom React hooks
- `/public`: Static assets
- `/tests`: Test files
- `/mocks`: Mock data for testing

For a detailed breakdown of each directory and its contents, see [directory-structure.md](./directory-structure.md). 