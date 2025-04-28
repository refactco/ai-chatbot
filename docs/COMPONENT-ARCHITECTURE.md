# Component Architecture

This document provides a detailed overview of the component architecture in the AI Chatbot application, showing how the components interact with each other and how data flows through the system.

## Core Component Hierarchy

```
App
├── SidebarProvider
│   ├── AppSidebar
│   │   ├── SidebarHistory
│   │   └── SidebarUserNav
│   └── Chat
│       ├── ChatHeader
│       ├── Messages
│       │   └── Message (multiple)
│       ├── MultimodalInput
│       └── Artifact
│           ├── ArtifactMessages
│           ├── ArtifactActions
│           ├── VersionFooter (conditional)
│           └── Specialized Content Viewers (based on artifact type)
```

## Message Components

### Message Component (`components/message.tsx`)

The `Message` component is responsible for rendering individual messages in the chat. It handles:

- Different message types (user, assistant, system)
- Message styling with appropriate icons
- Message content rendering with Markdown support
- Message editing functionality
- Attachments display

Key features:
- Uses `AnimatePresence` from Framer Motion for smooth animations
- Handles "thinking" state with a special UI
- Supports message editing for user messages
- Displays reasoning process for AI messages

### Messages Component (`components/messages.tsx`)

The `Messages` component manages the collection of message components:

- Renders the list of messages
- Handles automatic scrolling to the newest message
- Displays a greeting when there are no messages
- Shows thinking state when waiting for AI response

## Chat Component (`components/chat.tsx`)

The `Chat` component is the central orchestrator that:

- Integrates the message display with input functionality
- Manages the chat state using the `useChat` hook
- Handles message submission and AI responses
- Controls the artifact panel visibility

Data flow in the Chat component:
1. Receives initial messages and chat ID as props
2. Uses `useChat` to manage message state and interactions
3. Customizes the message submission behavior for mock API
4. Renders the Messages component with the current message array
5. Controls the MultimodalInput component for user input
6. Manages the Artifact component for displaying AI-generated content

## UI State Management

### UseChatHelpers Interface (`lib/ai/types.ts`)

The `UseChatHelpers` interface defines the core chat functionality:

```typescript
export interface UseChatHelpers {
  messages: UIMessage[];
  append: (message: UIMessage | Message | CreateMessage) => void;
  reload: () => void;
  stop: () => void;
  isLoading: boolean;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event?, options?) => Promise<string | null | undefined>;
  setMessages: (messages: UIMessage[] | ((messages: UIMessage[]) => UIMessage[])) => void;
  status: 'streaming' | 'error' | 'submitted' | 'ready';
}
```

### useChat Hook (`lib/ai/react.ts`)

The `useChat` hook provides the message state management and chat interactions:

- Manages message state with useState
- Provides methods for appending messages
- Handles message submission and response streaming
- Controls loading and status states

## Sidebar Components

### AppSidebar (`components/app-sidebar.tsx`)

The `AppSidebar` component provides navigation and chat history:

- Renders the application title/logo
- Displays chat history through SidebarHistory
- Provides a "New Chat" button
- Shows user information through SidebarUserNav

### SidebarProvider (`components/ui/sidebar.tsx`)

The `SidebarProvider` manages the sidebar state:

- Controls sidebar visibility on desktop and mobile
- Handles sidebar animations and transitions
- Provides context for sidebar state to child components

## Mock API Integration

### Chat to API Flow

1. User enters message in MultimodalInput
2. Chat component's `customHandleSubmit` function captures the message
3. Message is sent to `mockApiService.sendMessage`
4. User message is added to the UI
5. `mockApiService.streamResponse` is called to simulate AI response
6. Response chunks are streamed back to the UI via callback functions
7. Messages component updates with new content

## Artifact System

The Artifact system consists of multiple interconnected components:

### Artifact Component (`components/artifact.tsx`)

The main container component that:
- Manages the artifact panel UI (split view on desktop, full screen on mobile)
- Handles document fetching and version control
- Coordinates between messages and content views
- Transitions between artifact states with animations

### ArtifactMessages Component (`components/artifact-messages.tsx`)

A specialized message display that:
- Shows conversation context related to the current artifact
- Provides a message input specifically for the artifact context
- Updates in real-time as new artifact-related messages arrive

### Version Control Components

The artifact system includes robust version control:

1. **ArtifactActions** (`components/artifact-actions.tsx`):
   - Provides toolbar controls for version navigation
   - Allows switching between edit and diff modes
   - Shows current version status

2. **VersionFooter** (`components/version-footer.tsx`):
   - Appears when viewing historical versions
   - Provides version restoration controls
   - Shows contextual information about the selected version

### Artifact Type System

Content display is handled through a pluggable architecture:

```typescript
export const artifactDefinitions = [textArtifact, imageArtifact, sheetArtifact];
```

Each artifact type implements:
- Specialized content viewers/editors
- Type-specific controls and interactions
- Custom metadata handling

### Storage System Integration

The artifact component integrates with two storage systems:

1. **API-Based Storage**:
   - For production use with server persistence
   - Uses SWR for data fetching and caching
   - Handles API-based version creation and restoration

2. **Local Storage System**:
   - For development and special document types
   - Uses browser localStorage for persistence
   - Handles local version history with the same UI as API storage

### Data Flow for Artifacts

1. **Artifact Creation**:
   - Chat receives a message with attachment having artifact URL
   - Chat passes attachment to DataStreamHandler
   - DataStreamHandler recognizes artifact type and updates artifact state
   - Artifact component becomes visible with initial content

2. **Content Editing**:
   - User edits content in specialized editor
   - Edits are debounced to prevent excessive version creation
   - Changes are saved to appropriate storage system
   - New version is created with timestamp

3. **Version Navigation**:
   - User navigates between versions using UI controls
   - Version changes update content display
   - Historical versions show restoration UI
   - Diff mode allows comparison between versions

4. **Artifact Interaction with Chat**:
   - Messages related to artifact displayed in left panel
   - New messages can be sent in context of artifact
   - Artifact changes can trigger new chat interactions

## Animation System

The application uses Framer Motion for smooth animations:

- Message appearances and transitions
- Artifact panel opening/closing
- Version history navigation
- Loading and status indicators

Animation is controlled with consistent patterns:

```tsx
<AnimatePresence>
  {condition && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
    >
      {/* Component content */}
    </motion.div>
  )}
</AnimatePresence>
```

## Responsive Design

Components adapt to different screen sizes:

- Desktop: Full layout with sidebar and split artifact view
- Tablet: Modified layout with collapsible sidebar
- Mobile: Simplified layout with full-screen artifact view

Responsive behavior is implemented using:
- Tailwind CSS breakpoints (`md:`, `lg:`)
- `useWindowSize` hook for dynamic adjustments
- Conditional rendering for mobile layouts

## Performance Optimization

Key performance strategies:

1. **Memoization**:
   - React.memo for expensive components
   - Custom equality checks for specific props
   - useMemo for computed values

2. **Debouncing**:
   - Input handlers for typing
   - Content saving for artifact edits
   - Search and filter operations

3. **Load Optimization**:
   - Conditional fetching with SWR
   - Optimistic UI updates
   - Progressive loading indicators

## Component Communication

Components communicate through several patterns:

1. **Prop Passing**:
   - Direct parent-child communication
   - Function callbacks for actions

2. **Context API**:
   - `SidebarProvider` for sidebar state
   - `useArtifact` hook for artifact state

3. **Custom Hooks**:
   - `useChat` for message state
   - `useScrollToBottom` for scroll behavior
   - `useArtifact` for artifact management

## Integration Testing Guidance

For effective integration testing:

1. **Mock API Triggers**:
   - "test image artifact" - Creates image artifact
   - "test text artifact" - Creates text document
   - "test sheet artifact" - Creates spreadsheet

2. **Component States**:
   - Test artifact with streaming status
   - Test version history navigation
   - Test responsive layouts at breakpoints

3. **User Flows**:
   - Chat to artifact creation flow
   - Artifact editing and version creation
   - Version restoration process 