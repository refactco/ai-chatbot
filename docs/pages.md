# Pages

This document outlines all the pages in the application, their purposes, components used, and key functionalities.

## Main Pages

### Home Page

**Path**: `/app/(chat)/page.tsx`

The home page serves as the main chat interface for logged-in users. It includes:

- Chat input area
- Message display area
- AI model selector
- Sidebar with chat history
- Multimodal input options

**Key Components**:
- `Chat`: Main chat component
- `Messages`: Message display component
- `MultimodalInput`: Input area with support for text, files, and other inputs
- `SidebarHistory`: Chat history sidebar

**Functionality**:
- Send and receive messages
- View chat history
- Upload files and images
- Create artifacts
- Select AI models

### Login Page

**Path**: `/app/(auth)/login/page.tsx`

The login page allows existing users to log in to their accounts.

**Key Components**:
- `AuthForm`: Authentication form component

**Functionality**:
- User login with email/password
- Error handling for invalid credentials
- Redirection after successful login

### Registration Page

**Path**: `/app/(auth)/register/page.tsx`

The registration page allows new users to create accounts.

**Key Components**:
- `AuthForm`: Authentication form component

**Functionality**:
- User registration with email/password
- Validation of registration information
- Account creation
- Redirection after successful registration

## Chat Pages

### Chat Detail Page

**Path**: `/app/(chat)/chat/[id]/page.tsx`

This page displays a specific chat conversation based on the ID parameter.

**Key Components**:
- `Chat`: Main chat component
- `Messages`: Message display component
- `MultimodalInput`: Input area

**Functionality**:
- Load and display specific chat conversation
- Continue conversation with AI
- View and interact with artifacts

## Layouts

### Root Layout

**Path**: `/app/layout.tsx`

The root layout applies to all pages in the application. It includes:

- Global CSS
- Theme provider
- Analytics
- Toast notifications
- Authentication context

**Key Components**:
- `ThemeProvider`: Provides theme context
- `Toaster`: Toast notification component

### Chat Layout

**Path**: `/app/(chat)/layout.tsx`

This layout applies to all chat-related pages. It includes:

- App sidebar
- Session validation
- Navigation structure

**Key Components**:
- `AppSidebar`: Application sidebar with navigation
- `SidebarToggle`: Toggle for sidebar visibility

### Auth Layout

**Path**: `/app/(auth)/layout.tsx`

This layout applies to all authentication-related pages. It includes:

- Minimal layout for authentication pages
- Redirect logic for authenticated users

## Page Structure and Navigation

The application uses Next.js App Router for routing with the following structure:

- The root `/` path redirects to the main chat interface
- Authentication routes are under the `/login` and `/register` paths
- Chat conversations are accessible at `/chat/[id]` where `[id]` is the chat ID
- Authentication is required for all chat-related pages
- Unauthenticated users are redirected to the login page

## Page Loading and Data Fetching

Pages use a combination of:

1. **Server Components**: For initial data loading
2. **Client Components**: For interactive elements
3. **Server Actions**: For data mutations
4. **API Routes**: For complex operations and AI interactions

## Responsive Design

All pages are responsive and adapt to different screen sizes:

- Mobile: Single column layout with collapsible sidebar
- Tablet: Two-column layout with resizable panels
- Desktop: Full layout with multiple panels and sidebars

## Page-Specific Functionality

### Home Page

- **New Chat Creation**: Users can start new chat conversations
- **Model Selection**: Users can select different AI models
- **Multimodal Input**: Support for text, images, and documents
- **File Upload**: Users can upload files for AI to process

### Chat Detail Page

- **Conversation Continuation**: Users can continue existing conversations
- **Artifact Viewing**: View artifacts created in the conversation
- **Message Editing**: Edit previously sent messages
- **Message Actions**: Additional actions on messages (copy, regenerate, etc.)

### Login/Register Pages

- **Form Validation**: Client-side validation of form inputs
- **Error Handling**: Display of authentication errors
- **Redirection**: Redirect to appropriate pages after authentication 