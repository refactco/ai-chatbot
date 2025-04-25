# AI Chatbot

AI Chatbot is a Next.js application that demonstrates modern application development patterns. It features a chat interface that simulates AI responses and document generation using Mock Service Worker (MSW) for development and testing.

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions
- [AI SDK](https://sdk.vercel.ai/docs) integration
  - Simulated AI responses for development
  - Document generation (text, code, images)
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com)
- Data Persistence
  - [Postgres](https://www.postgresql.org/) for saving chat history and user data
- [Auth.js](https://authjs.dev)
  - Modern authentication with Next.js App Router integration
  - Email & password authentication

## Development Mode with Mock Service Worker

The application uses Mock Service Worker (MSW) to intercept API calls during development. This makes development faster and removes dependency on external services.

### How MSW Mocking Works

1. MSW intercepts network requests at the service worker level
2. It provides mock responses that simulate API behavior
3. Authentication, document generation, and chat responses are all simulated

### Authentication in Development

For development and testing, the application includes MSW handlers for authentication:

- **Default test credentials**: 
  - Email: `user@example.com`
  - Password: `password`

- **Authentication flow**:
  - Login and registration are fully simulated
  - Session data is maintained in memory during your session
  - No actual database interaction is required

### Document Generation & Chat Features

To see the document preview and skeleton components in action:

1. Start the application in development mode
2. In the chat interface, ask for document creation with prompts like:
   - "Create a document about React"
   - "Show me a code example for async functions"
   - "Generate an image of a sunset"

## MSW Implementation Details

The mock implementation is located in:
- `mocks/handlers.ts` - API route handlers and mock data 
- `mocks/browser.ts` - Browser service worker setup
- `app/msw-provider.tsx` - MSW provider component

## Running Locally

```bash
# Install dependencies
npm install
# or
pnpm install

# Start the development server
npm run dev
# or
pnpm dev
```

The application will be available at http://localhost:3000.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Auth.js Configuration
AUTH_SECRET=your-secret-key

# For development only - to bypass DB in local dev
NEXT_PUBLIC_USE_MSW=true
```

For production, you will need to add proper database connection strings and other configuration.