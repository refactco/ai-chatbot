# Comprehensive Project Guide

This document provides a detailed understanding of the AI Chatbot project beyond what's covered in the standard documentation. It's intended to be updated as development progresses and serves as a central reference for the project's technical implementation details.

## Core Technical Information

### Project Structure and Codebase

- **Next.js App Router Structure**: The project uses Next.js app router with route groups for authentication and chat functionality
- **Component Organization**: UI components are separated from functional components
- **State Management**: Uses React's Context API and hooks for state management
- **UI Framework**: Built on Tailwind CSS with shadcn/ui components
- **Artifact System**: Modular system for AI-generated rich content with version history
- **Lib Directory Structure**:
  - `lib/ai`: Core AI functionality and types
  - `lib/services`: API services and data handling
  - `lib/utils`: Shared utility functions
  - `lib/schema`: Data models and type definitions

### Dependency Graph

- **Frontend Framework**: Next.js with React and TypeScript
- **UI Libraries**: Tailwind CSS, shadcn/ui, framer-motion for animations
- **Data Fetching**: SWR for data fetching and caching
- **Date Handling**: date-fns for date formatting and calculations
- **Utilities**: usehooks-ts for common React hooks
- **Performance**: fast-deep-equal for optimized component memoization

### Build and Configuration

- **Development Environment**: Uses Next.js development server
- **Production Build**: Optimized with tree-shaking and code splitting
- **Environment Variables**: Configured through `.env.local` for local development
- **TypeScript**: Strict mode with comprehensive type definitions

## Implementation Details

### Component Implementation Specifics

- **Message Rendering**: Uses AnimatePresence from framer-motion for smooth animations
- **Streaming Content**: Implemented with custom streaming hooks and handlers
- **Responsive Design**: Mobile-first approach with desktop optimizations
- **State Management Patterns**:
  - `useArtifact` hook for artifact state management
  - `useSidebar` context for sidebar state
  - `useChat` hook for chat message handling

### Artifact System Architecture

- **Split Panel Design**: Messages on left, content on right (desktop view)
- **Version Control**: Complete version history for all artifact types
- **Storage Options**: Dual support for API and localStorage backends
- **Content Types**: Specialized viewers for text, image, and sheet data
- **UI Animations**: Smooth transitions between states and versions

### API Communication Details

- **Mock Implementation**: Currently uses mock API services with simulated delays
- **Response Streaming**: Chunks responses to simulate real-time AI responses
- **Error Handling**: Progressive enhancement with fallbacks
- **Local Storage Fallback**: For development and offline capabilities

### UI/UX Implementation

- **Dark Mode Support**: UI adapts to light and dark mode preferences
- **Accessibility**: ARIA roles, keyboard navigation, and focus management
- **Animation Patterns**: Message animations, transitions between states
- **Responsive Breakpoints**:
  - Mobile: Full-screen optimized views
  - Tablet: Hybrid layout with collapsible sidebar
  - Desktop: Split-panel layout with fixed sidebar

## Runtime and Testing Environment

### Test Coverage and Approach

- **Component Testing**: Individual component tests with React Testing Library
- **Mock Strategy**: Service mocks for API dependencies
- **Artifact Testing**: Special commands to trigger artifact generation

### Runtime Behavior

- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile Support**: Responsive design with mobile-specific adaptations
- **Performance Targets**:
  - Initial load under 2s
  - Interactive response under 200ms
  - Smooth animations at 60fps

## Project History and Roadmap

### Known Issues and Technical Debt

- **Current Limitations**: Mock API implementation limitations
- **Authentication**: Not fully implemented, using mock user data
- **Mobile Optimization**: Some complex interactions need refinement on mobile
- **Performance**: Large artifact datasets may need pagination or virtualization

### Feature Roadmap

- **Authentication**: Implement Google OAuth with NextAuth.js
- **Real API Integration**: Connect to the real backend API
- **Enhanced Artifact Features**: Collaborative editing and real-time updates
- **Advanced Version Control**: Diff visualization and selective restoration
- **Export/Import**: Enhanced export options for artifacts
- **Responsive Enhancements**: Further mobile optimizations

### Development History

- **Initial Implementation**: Basic chat interface with mock API
- **Artifact System Addition**: Support for specialized content types
- **Version Control**: Complete version history and management
- **Storage Architecture**: Dual support for API and localStorage

## External Integration Points

### Authentication Details

- **Current State**: Using mock authentication with hardcoded user data
- **Planned Implementation**: Google OAuth using NextAuth.js
- **Token Management**: JWT-based authentication with refresh tokens

### Backend Service Interfaces

- **Message API**: Endpoints for sending and receiving messages
- **Chat History API**: Endpoints for managing chat history
- **Artifact API**: Infrastructure for generating and managing artifacts
- **Document API**: Version control and document management

### Third-party Services

- **Storage Options**: Integration with cloud storage for artifacts
- **AI Services**: Pluggable architecture for different AI providers

## Best Practices and Conventions

### Coding Standards

- **TypeScript Usage**: Strong typing for all components and functions
- **Component Patterns**: Functional components with hooks
- **Naming Conventions**:
  - PascalCase for components
  - camelCase for functions and variables
  - UPPERCASE for constants

### Performance Considerations

- **Memoization**: React.memo with custom equality checks
- **Debounced Updates**: For artifact editing and search
- **Virtualization**: For long lists of messages
- **Chunked Responses**: Messages streamed in chunks for perceived performance

### Security Considerations

- **Content Sanitization**: Markdown content is sanitized
- **Input Validation**: All user inputs validated before processing
- **Authentication**: Token-based with proper expiration

## Development Workflow

### Setup Process

- **Development Environment**: See DEVELOPER-GUIDE.md for initial setup
- **Configuration Options**: Environment variables for API endpoints and features

### Debugging Strategies

- **React DevTools**: For component and state inspection
- **Network Monitoring**: For API request debugging
- **Local Storage Inspection**: For artifact version debugging
- **Console Logging**: Strategic logging for state transitions

### Contribution Guidelines

- **Branch Strategy**: Feature branches from main
- **Testing Requirements**: All new features should include tests
- **Documentation**: Update relevant docs with significant changes
- **Code Review**: Required for all PRs with focus on type safety and performance

## Notes and Updates

This section will be updated with important notes as development progresses:

- [2023-10-01] Initial document creation
- [2023-11-15] Added artifact system details
- [2023-12-10] Enhanced version control documentation
- [2024-01-20] Updated with storage architecture improvements

## Real API Integration

The application now supports integration with a real streaming chat API. This functionality is implemented with a dual approach that allows developers to easily switch between the mock API implementation and the real API.

### Environment-Based Configuration

The application uses environment variables to control which API implementation to use:

```
# Set to true to use the real API instead of mock data
NEXT_PUBLIC_USE_REAL_API=true

# Base URL for the real chat API
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333

# JWT token for authentication with the real API
NEXT_PUBLIC_API_TOKEN=your-jwt-token
```

By toggling the `NEXT_PUBLIC_USE_REAL_API` flag, developers can switch between implementations without code changes.

### Streaming API Implementation

The streaming API implementation uses Server-Sent Events (SSE) to establish a connection to the real API endpoint and process the streamed response. This approach provides real-time updates to the UI as the AI generates its response.

The key components of the integration are:

1. **API Service Layer** (`lib/services/api-service.ts`): Provides a unified interface for both mock and real API implementations
2. **API Proxy** (`app/api/chat/stream/route.ts`): Acts as a proxy to the real API while maintaining backward compatibility
3. **Error Handling**: Includes fallback mechanisms to ensure the application remains functional even if the real API is unavailable

For detailed information about the API integration, please refer to `docs/API-INTEGRATION.md`.
