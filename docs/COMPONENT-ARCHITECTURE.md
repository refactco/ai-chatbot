# Component Architecture

## Overview

This document provides a detailed overview of the component architecture in the AI Chatbot application, showing how the components interact with each other and how data flows through the system.

## Core Component Hierarchy

1. **App**
   - **SidebarProvider**
     - **AppSidebar**
       - SidebarHistory
       - SidebarUserNav
     - **Chat**
       - ChatHeader
       - Messages
         - Message (multiple)
       - MultimodalInput
       - Artifact
         - ArtifactMessages
         - ArtifactActions
         - VersionFooter (conditional)
         - Specialized Content Viewers (based on artifact type)

## Message Components

### Message
- **File**: `components/message.tsx`
- **Description**: Responsible for rendering individual messages in the chat
- **Responsibilities**:
  - Different message types (user, assistant, system)
  - Message styling with appropriate icons
  - Message content rendering with Markdown support
  - Message editing functionality
  - Attachments display
- **Features**:
  - Uses AnimatePresence from Framer Motion for smooth animations
  - Handles "thinking" state with a special UI
  - Supports message editing for user messages
  - Displays reasoning process for AI messages

### Messages
- **File**: `components/messages.tsx`
- **Description**: Manages the collection of message components
- **Responsibilities**:
  - Renders the list of messages
  - Handles automatic scrolling to the newest message
  - Displays a greeting when there are no messages
  - Shows thinking state when waiting for AI response

## Chat Component

- **File**: `components/chat.tsx`
- **Description**: The central orchestrator
- **Responsibilities**:
  - Integrates the message display with input functionality
  - Manages the chat state using the useChat hook
  - Handles message submission and AI responses
  - Controls the artifact panel visibility
- **Data Flow**:
  1. Receives initial messages and chat ID as props
  2. Uses useChat to manage message state and interactions
  3. Customizes the message submission behavior for mock API
  4. Renders the Messages component with the current message array
  5. Controls the MultimodalInput component for user input
  6. Manages the Artifact component for displaying AI-generated content

## Artifact System

### Artifact
- **File**: `components/artifact.tsx`
- **Description**: The main container component
- **Features**:
  - Manages the artifact panel UI (split view on desktop, full screen on mobile)
  - Handles document fetching and version control
  - Coordinates between messages and content views
  - Transitions between artifact states with animations

### ArtifactMessages
- **File**: `components/artifact-messages.tsx`
- **Description**: A specialized message display
- **Features**:
  - Shows conversation context related to the current artifact
  - Provides a message input specifically for the artifact context
  - Updates in real-time as new artifact-related messages arrive

### Storage Systems

#### API-Based
- For production use with server persistence
- Uses SWR for data fetching and caching
- Handles API-based version creation and restoration

#### LocalStorage
- For development and special document types
- Uses browser localStorage for persistence
- Handles local version history with the same UI as API storage 