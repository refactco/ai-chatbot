# Comprehensive Project Guide

This document provides a detailed understanding of the AI Chatbot project beyond what's covered in the standard documentation. It's intended to be updated as development progresses and serves as a central reference for the project's technical implementation details.

## Core Technical Information

### Project Structure and Codebase
- **Next.js App Router Structure**: The project uses Next.js app router with route groups for authentication and chat functionality
- **Component Organization**: UI components are separated from functional components
- **State Management**: Uses React's Context API and hooks for state management
- **UI Framework**: Built on Tailwind CSS with shadcn/ui components
- **TO COMPLETE**: Detailed structure of lib directory and utility organization

### Dependency Graph
- **Frontend Framework**: Next.js with React and TypeScript
- **UI Libraries**: Tailwind CSS, shadcn/ui, framer-motion for animations
- **Data Fetching**: SWR for data fetching and caching
- **TO COMPLETE**: Complete list of npm dependencies and their purposes

### Build and Configuration
- **Development Environment**: Uses Next.js development server
- **TO COMPLETE**: Production build process and optimization settings
- **TO COMPLETE**: Environment variables and configuration patterns

## Implementation Details

### Component Implementation Specifics
- **Message Rendering**: Uses AnimatePresence from framer-motion for smooth animations
- **Streaming Content**: Implemented with custom streaming hooks and handlers
- **Responsive Design**: Mobile-first approach with desktop optimizations
- **TO COMPLETE**: Detailed state management patterns across components

### API Communication Details
- **Mock Implementation**: Currently uses mock API services with simulated delays
- **Response Streaming**: Chunks responses to simulate real-time AI responses
- **TO COMPLETE**: Error handling strategies and retry mechanisms

### UI/UX Implementation
- **Dark Mode Support**: UI adapts to light and dark mode preferences
- **Accessibility**: TO COMPLETE
- **Animation Patterns**: Message animations, transitions between states
- **TO COMPLETE**: Detailed responsive breakpoints and strategies

## Runtime and Testing Environment

### Test Coverage and Approach
- **TO COMPLETE**: Current testing structure and methodologies
- **TO COMPLETE**: Mock strategies for external dependencies

### Runtime Behavior
- **Browser Compatibility**: TO COMPLETE
- **Mobile Support**: Responsive design with mobile-specific adaptations
- **TO COMPLETE**: Performance metrics and expectations

## Project History and Roadmap

### Known Issues and Technical Debt
- **Current Limitations**: Mock API implementation limitations
- **Authentication**: Not fully implemented, using mock user data
- **TO COMPLETE**: Areas identified for refactoring

### Feature Roadmap
- **Authentication**: Implement Google OAuth with NextAuth.js
- **Real API Integration**: Connect to the real backend API
- **Enhanced Error Handling**: Add more robust error handling
- **Document Upload**: Implement document upload functionality
- **Artifact Generation**: Complete the integration of artifact generation
- **TO COMPLETE**: Feature priorities and dependencies

### Development History
- **TO COMPLETE**: Major architectural decisions and their rationale
- **TO COMPLETE**: Evolution of key components

## External Integration Points

### Authentication Details
- **Current State**: Using mock authentication with hardcoded user data
- **Planned Implementation**: Google OAuth using NextAuth.js
- **TO COMPLETE**: Complete authentication flow and token management

### Backend Service Interfaces
- **Message API**: Endpoints for sending and receiving messages
- **Chat History API**: Endpoints for managing chat history
- **Artifact API**: Infrastructure for generating and managing artifacts
- **TO COMPLETE**: Complete API contract details

### Third-party Services
- **TO COMPLETE**: Integration with external AI services
- **TO COMPLETE**: Other third-party services and their purposes

## Best Practices and Conventions

### Coding Standards
- **TypeScript Usage**: Strong typing for all components and functions
- **Component Patterns**: Functional components with hooks
- **TO COMPLETE**: Naming conventions and style guidelines

### Performance Considerations
- **Chunked Responses**: Messages streamed in chunks to improve perceived performance
- **TO COMPLETE**: Lazy loading strategies
- **TO COMPLETE**: Optimization techniques

### Security Considerations
- **TO COMPLETE**: Authentication security measures
- **TO COMPLETE**: Data handling security practices

## Development Workflow

### Setup Process
- **Development Environment**: See DEVELOPER-GUIDE.md for initial setup
- **TO COMPLETE**: Advanced setup configurations

### Debugging Strategies
- **Common Issues**: See DEVELOPER-GUIDE.md for common issues
- **TO COMPLETE**: Advanced debugging techniques for complex issues

### Contribution Guidelines
- **Branch Strategy**: Feature branches from main
- **TO COMPLETE**: Code review process
- **TO COMPLETE**: Release and versioning strategy

## Notes and Updates

This section will be updated with important notes as development progresses:

- [Date: TBD] Initial document creation
- [Date: TBD] Updated with additional implementation details 