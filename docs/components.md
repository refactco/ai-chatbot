# Components

This document provides an overview of the key UI components used in the application.

## Core Components

### Chat Components

#### `Chat` (`/components/chat.tsx`)

The main chat component that orchestrates the chat interface. It handles:
- Message display
- Message input
- AI response processing
- Chat state management

#### `Message` (`/components/message.tsx`)

Renders individual chat messages with support for:
- Text content
- Code blocks
- Images
- Documents
- Error states
- Loading states
- Message actions

#### `Messages` (`/components/messages.tsx`)

Container component for displaying a list of messages. Features:
- Auto-scrolling
- Virtual scrolling for performance
- Message grouping
- Typing indicators

#### `MultimodalInput` (`/components/multimodal-input.tsx`)

Input component with support for various input types:
- Text input
- File uploads
- Image uploads
- Document uploads
- Suggested actions

### Sidebar Components

#### `AppSidebar` (`/components/app-sidebar.tsx`)

Main application sidebar with:
- Navigation links
- User information
- Settings access

#### `SidebarHistory` (`/components/sidebar-history.tsx`)

Displays chat history with:
- Chat list
- Search functionality
- Chat management options
- Date grouping

#### `SidebarToggle` (`/components/sidebar-toggle.tsx`)

Toggle button for showing/hiding the sidebar.

#### `SidebarUserNav` (`/components/sidebar-user-nav.tsx`)

User navigation component in the sidebar with:
- User profile information
- Settings access
- Sign out option

### Editor Components

#### `CodeEditor` (`/components/code-editor.tsx`)

Code editor component with:
- Syntax highlighting
- Line numbers
- Multiple language support
- Copy functionality

#### `TextEditor` (`/components/text-editor.tsx`)

Rich text editor component with:
- Formatting options
- Markdown support
- Text formatting
- Insert capabilities (links, images)

### Document Components

#### `DocumentPreview` (`/components/document-preview.tsx`)

Preview component for documents with:
- Document rendering
- Thumbnail generation
- Document metadata display
- Download option

#### `Markdown` (`/components/markdown.tsx`)

Markdown rendering component with support for:
- GitHub-flavored markdown
- Code highlighting
- Tables
- Links
- Images

### Artifact Components

#### `Artifact` (`/components/artifact.tsx`)

Component for displaying and interacting with artifacts:
- Different artifact types (code, text, image)
- Edit functionality
- Export options
- Sharing capabilities

#### `CreateArtifact` (`/components/create-artifact.tsx`)

Form for creating new artifacts with:
- Type selection
- Content input
- Metadata input
- Creation workflow

#### `ArtifactActions` (`/components/artifact-actions.tsx`)

Action buttons for artifacts:
- Download
- Copy
- Edit
- Delete
- Share

## UI Components

Located in `/components/ui/`, these are foundational UI components used throughout the application:

- `Button`: Various button styles
- `Card`: Card container
- `Dialog`: Modal dialogs
- `DropdownMenu`: Dropdown menus
- `Input`: Text input fields
- `Label`: Form labels
- `Select`: Dropdown selectors
- `Separator`: Visual separators
- `Sheet`: Slide-in panels
- `Tooltip`: Information tooltips
- And many more based on Radix UI primitives

### Weather Components

#### `Weather` (`/components/weather.tsx`)

Weather data visualization component:
- Data fetching
- Chart rendering
- Visual display of weather information
- Interactive elements

### Shared Components

#### `ModelSelector` (`/components/model-selector.tsx`)

Dropdown for selecting AI models with:
- Model list
- Description tooltips
- Selection persistence

#### `VisibilitySelector` (`/components/visibility-selector.tsx`)

Component for selecting visibility options (public/private).

#### `ChatHeader` (`/components/chat-header.tsx`)

Header for chat interface with:
- Title display
- Action buttons
- Navigation options

#### `SubmitButton` (`/components/submit-button.tsx`)

Button for submitting chat messages with loading state.

#### `SuggestedActions` (`/components/suggested-actions.tsx`)

Displays suggested actions or follow-up prompts.

#### `Toast` (`/components/toast.tsx`)

Notification toast component for system messages.

#### `Toolbar` (`/components/toolbar.tsx`)

Toolbar component with various actions and tools.

## Component Design Patterns

### Client vs. Server Components

Components are divided between:
- **Client Components**: Interactive components that use hooks and state
- **Server Components**: Static components rendered on the server

### Component Composition

Components are designed to be composable, with:
- Higher-order components for shared functionality
- Component props for customization
- Render props for flexible rendering

### State Management

Components manage state through:
- React hooks
- Context API
- SWR for data fetching
- Server components for initial state

### Styling Approach

Components use a combination of:
- Tailwind CSS for utility-based styling
- CSS variables for theming
- CSS modules for component-specific styles
- Framer Motion for animations

### Accessibility

Components are designed with accessibility in mind:
- Proper ARIA attributes
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus management 