# AI Chatbot Project Overview

## Introduction

This project is a modern, interactive AI chatbot application built with Next.js and React. It provides a user-friendly interface for interacting with AI models through text-based conversations. The application features a clean UI, responsive design, authentication capabilities, and real-time AI responses.

## Key Features

- **Interactive Chat Interface**: Modern UI for sending messages and receiving AI responses
- **Message Streaming**: Responses stream in real-time rather than appearing all at once
- **Authentication**: Login and registration system (currently using mock data)
- **Chat History**: Sidebar displays previous conversations
- **Artifact Generation**: Support for generating text documents, images, and spreadsheets
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: UI adapts to light and dark mode preferences

## Architecture

The application follows a modern React architecture with Next.js:

- **Frontend**: Next.js with React and TypeScript
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and context
- **API Communication**: Currently using mock services to simulate backend

### Key Directories

- `/app`: Next.js app router pages and layouts
- `/components`: Reusable UI components
- `/lib`: Utility functions, types, and services
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

- `components/artifact.tsx`: Artifact panel for showing AI-generated content
- `components/data-stream-handler.tsx`: Handles streaming artifact data

## Data Flow

1. User enters a message in the input component
2. Message is sent to mock API service (`lib/services/mock-api-service.ts`)
3. API response is streamed back to the UI
4. UI updates to display the message and response
5. Chat history is updated

## Mock API Services

Currently, backend functionality is simulated using:

- `lib/services/mock-api-service.ts`: Simulates AI responses and streaming
- `lib/services/api-service.ts`: Local storage-based persistence for user data

## Planned Integrations

- Real backend API integration with AI models
- OAuth authentication with Google
- Persistent database storage for chat history
- Advanced artifact generation with specialized AI models

## Development Guidelines

- Use TypeScript for type safety
- Follow component composition patterns
- Maintain responsive design principles
- Keep UI components modular and reusable
- Handle loading and error states gracefully 