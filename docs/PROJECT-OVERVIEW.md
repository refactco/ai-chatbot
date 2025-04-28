# Project Overview

## Introduction

This project is an AI chatbot application with a modern UI built with Next.js. It supports:

- Chat-based conversations with AI
- File attachments and multimodal content
- Creation and editing of artifacts (text documents, images, spreadsheets)
- Version control system for artifacts

## Architecture

The application follows a modern architecture:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  UI Components  │◄───►│   API Service   │◄───►│     Backend     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

- **UI Components**: React components handling user interaction and rendering
- **API Service**: Interface between UI and the backend services
- **Backend**: Real or mock API implementation for data and AI services

## Key Features

### Chat Interface

The chat interface supports:
- Text-based conversation
- File attachment uploads
- Markdown formatting
- Code syntax highlighting
- Streaming responses

### Artifact System

The artifact system allows the creation and manipulation of:
- Text documents
- Images
- Spreadsheets

Each artifact type has dedicated editors and viewers, with:
- Real-time editing
- Version control
- Export capabilities
- Collaboration features

### Storage Systems

The application supports two storage backends:
- API-based storage (for production)
- LocalStorage-based storage (for development/testing)

Documents are identified with prefixes (e.g., `local:` for localStorage) to determine their storage backend.

## Tech Stack

- **Frontend Framework**: Next.js 14 with App Router
- **UI Components**: React, Tailwind CSS, shadcn/ui
- **State Management**: React Context and custom hooks
- **API Communication**: Fetch API with streaming support
- **Mock Backend**: MSW (Mock Service Worker)
- **Type Safety**: TypeScript
- **Testing**: Jest, React Testing Library

## Development Workflow

The project uses a modern development workflow:
1. Local development with mock API
2. Comprehensive test suite
3. CI/CD pipeline
4. Production deployment

## Documentation Structure

The project documentation is organized into:
- **Project Overview** (this document)
- **Component Architecture**
- **API Integration**
- **Artifact System**
- **Version Control System**
- **Developer Guide**
- **Mock Services**

For specific details on any aspect of the project, please refer to the corresponding documentation file.

## Recent Updates

1. **API-Focused Architecture**: The codebase has been migrated from an AI-specific implementation to a purely API-focused architecture, making it more maintainable and easier to integrate with different backends.

2. **Version Control System**: Added a robust version control system for artifacts, allowing users to track changes, restore previous versions, and compare differences.

3. **Enhanced Artifact System**: Improved the artifact creation, editing, and storage mechanisms with a dual-storage approach that works consistently across both API and localStorage backends.

4. **Updated Documentation**: Comprehensive documentation updates to reflect the latest architectural changes and provide better guidance for developers.

## Next Steps

1. Integration with production API endpoints
2. Enhanced testing for artifact version control
3. Mobile-optimized interface improvements
4. Additional artifact types 