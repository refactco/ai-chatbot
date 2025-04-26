# Directory Structure

This document provides a detailed overview of the project's directory structure and the purpose of each key file and folder.

## Root Directory

- `/.next`: Generated Next.js build folder (generated during build)
- `/app`: Contains all Next.js app router pages and API routes
- `/components`: React components used throughout the application
- `/hooks`: Custom React hooks
- `/lib`: Core utilities, services, and business logic
- `/mocks`: Mock data for testing and development
- `/public`: Static assets like images, favicons, etc.
- `/tests`: Test files for Playwright testing
- `/artifacts`: Folder for user-generated artifacts
- `/.github`: GitHub workflows and configuration
- `/.vscode`: VS Code settings for development
- `/node_modules`: External dependencies (generated during installation)

## Key Configuration Files

- `package.json`: NPM package definition and scripts
- `next.config.ts`: Next.js configuration
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `drizzle.config.ts`: Drizzle ORM configuration
- `postcss.config.mjs`: PostCSS configuration
- `biome.jsonc`: Biome linter configuration
- `playwright.config.ts`: Playwright testing configuration
- `.eslintrc.json`: ESLint configuration

## App Directory (`/app`)

The `/app` directory follows Next.js App Router structure:

- `/app/layout.tsx`: Root layout component for the entire application
- `/app/globals.css`: Global CSS styles
- `/app/msw-provider.tsx`: Mock Service Worker provider for testing

### Authentication (`/app/(auth)`)

- `/app/(auth)/login`: Login page
- `/app/(auth)/register`: Registration page
- `/app/(auth)/auth.ts`: Authentication utilities
- `/app/(auth)/auth.config.ts`: Next-Auth configuration
- `/app/(auth)/actions.ts`: Server actions for authentication
- `/app/(auth)/api`: API routes for authentication

### Chat (`/app/(chat)`)

- `/app/(chat)/page.tsx`: Home page with chat interface
- `/app/(chat)/layout.tsx`: Layout for chat pages
- `/app/(chat)/actions.ts`: Server actions for chat functionality
- `/app/(chat)/chat`: Chat-specific pages and components
- `/app/(chat)/api`: API routes for chat functionality

## Components Directory (`/components`)

Contains reusable React components:

- `/components/ui`: UI components like buttons, inputs, modals
- `/components/chat.tsx`: Main chat component
- `/components/chat-header.tsx`: Header component for chat interface
- `/components/message.tsx`: Message component for displaying chat messages
- `/components/messages.tsx`: Container for chat messages
- `/components/sidebar-history.tsx`: Sidebar with chat history
- `/components/artifact.tsx`: Component for displaying artifacts
- `/components/code-editor.tsx`: Code editor component
- `/components/text-editor.tsx`: Text editor component
- `/components/document-preview.tsx`: Preview component for documents
- `/components/markdown.tsx`: Markdown rendering component
- `/components/multimodal-input.tsx`: Input component for different types of content
- ... and many more specialized UI components

## Lib Directory (`/lib`)

Contains core business logic and utilities:

### Database (`/lib/db`)

- Database connection and schema definitions
- Migration utilities
- ORM configurations

### AI (`/lib/ai`)

- AI model definitions
- Prompt templates
- Provider configurations
- AI tools and utilities

### Artifacts (`/lib/artifacts`)

- Artifact management logic
- Processing utilities for different artifact types

### Editor (`/lib/editor`)

- Text and code editor utilities
- Formatting helpers

## Hooks Directory (`/hooks`)

Contains custom React hooks for reusable logic:

- State management hooks
- Data fetching hooks
- UI interaction hooks

## Tests Directory (`/tests`)

Contains Playwright end-to-end tests:

- Page tests
- Component tests
- Integration tests

## Public Directory (`/public`)

Contains static assets:

- Images
- Fonts
- Favicons
- Other static files served by the web server 