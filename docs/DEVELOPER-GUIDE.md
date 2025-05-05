# Developer Guide

This guide provides detailed instructions for developers working on the AI Chatbot project, covering installation, setup, and development workflows.

## Getting Started

### Prerequisites

- Node.js (v16.x or later)
- npm or yarn
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ai-chatbot.git
   cd ai-chatbot
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Edit the `.env.local` file to add any necessary API keys or configuration values.

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
ai-chatbot/
├── app/                     # Next.js app router pages
│   ├── (auth)/              # Authentication pages (login, register)
│   ├── (chat)/              # Chat application pages
│   └── layout.tsx           # Root layout component
├── components/              # Reusable React components
│   ├── ui/                  # UI components (buttons, inputs, etc.)
│   ├── chat.tsx             # Main chat component
│   ├── message.tsx          # Message component
│   ├── artifact.tsx         # Artifact container component
│   ├── version-footer.tsx   # Version control UI
│   └── ...                  # Other components
├── artifacts/               # Artifact type implementations
│   ├── text/                # Text artifact components
│   ├── image/               # Image artifact components
│   └── sheet/               # Sheet artifact components
├── hooks/                   # Custom React hooks
│   ├── use-artifact.ts      # Artifact state management
│   ├── use-chat-visibility.ts # Chat visibility control
│   ├── use-mobile.tsx       # Mobile device detection
│   └── ...                  # Other hooks
├── lib/                     # Utility functions and services
│   ├── ai/                  # AI-related utilities and types
│   ├── services/            # API services (mock and real)
│   └── utils.ts             # General utilities
├── public/                  # Static assets
├── styles/                  # Global styles
├── docs/                    # Documentation
├── .env.example             # Example environment variables
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## Development Workflows

### Common Tasks

#### Adding a New Component

1. Create the component file in the `components` directory:

   ```tsx
   /**
    * MyComponent
    *
    * Description of what this component does.
    * Features:
    * - Feature 1
    * - Feature 2
    */

   export function MyComponent({ prop1, prop2 }: MyComponentProps) {
     return <div>{/* Component content */}</div>;
   }

   interface MyComponentProps {
     prop1: string;
     prop2: number;
   }
   ```

2. Export the component from its directory (if part of a group):

   ```tsx
   // components/index.ts
   export * from './MyComponent';
   ```

3. Import and use the component elsewhere:
   ```tsx
   import { MyComponent } from '@/components/MyComponent';
   ```

#### Modifying the Chat Interface

1. Understand the chat component hierarchy:

   - `Chat` is the main container
   - `Messages` renders the collection of messages
   - `Message` renders individual messages
   - `MultimodalInput` handles user input
   - `DataStreamHandler` processes streaming data

2. To modify message rendering, edit `components/message.tsx`

3. To change how messages are processed, modify `lib/services/mock-api-service.ts` (for mock implementation) or `lib/ai/react.ts` (for general chat handling)

4. To modify data streaming behavior, update `components/data-stream-handler.tsx`

#### Working with the Artifact System

The artifact system uses a pluggable architecture for different content types:

1. **Understanding Artifact Types**:

   - Artifacts are defined in `/artifacts/{type}/client.tsx`
   - Each artifact type implements a standard interface
   - Core artifact UI is in `components/artifact.tsx`
   - State management is handled with `useArtifact` hook

2. **Adding a New Artifact Type**:

   ```tsx
   /**
    * My New Artifact Type
    *
    * Description of what this artifact type does.
    * Features:
    * - Feature 1
    * - Feature 2
    */

   import { ArtifactContentProps } from '@/lib/types';

   export const myNewArtifact = {
     kind: 'mynew',
     name: 'My New Artifact',
     description: 'Description of the new artifact type',

     // Optional initialization function
     initialize: ({ documentId, setMetadata }) => {
       // Set up any initial state or metadata
       setMetadata({
         /* initial metadata */
       });
     },

     // Component to render the content
     content: ({
       content,
       onSaveContent,
       mode,
       isCurrentVersion,
       metadata,
       setMetadata,
       // other props...
     }: ArtifactContentProps) => {
       return <div>{/* Artifact content implementation */}</div>;
     },
   };
   ```

3. **Register the New Artifact Type**:

   ```tsx
   // components/artifact.tsx
   import { myNewArtifact } from '@/artifacts/mynew/client';

   // Add to artifact definitions
   export const artifactDefinitions = [
     textArtifact,
     imageArtifact,
     sheetArtifact,
     myNewArtifact, // Add your new artifact type
   ];
   ```

4. **Testing Your Artifact**:
   - Add a test trigger in the mock service
   - Use specialized mock data for your artifact type
   - See `docs/ARTIFACT-TESTING.md` for detailed testing procedures

#### Working with Version Control

The version control system supports both API and localStorage backends:

1. **Version Data Structure**:

   ```typescript
   interface Document {
     id: string;
     kind: string;
     title: string;
     content: string;
     createdAt: Date;
     updatedAt: Date;
     userId: string;
   }
   ```

2. **Creating New Versions**:

   ```typescript
   // For API documents
   mutate<Array<Document>>(
     `/api/document?id=${artifact.documentId}`,
     async (currentDocuments) => {
       if (!currentDocuments) return undefined;

       // Create new version with current content
       await fetch(`/api/document?id=${artifact.documentId}`, {
         method: 'POST',
         body: JSON.stringify({
           title: artifact.title,
           content: updatedContent,
           kind: artifact.kind,
         }),
       });

       // Return updated documents array with new version
       const newDocument = {
         ...currentDocument,
         content: updatedContent,
         createdAt: new Date(),
       };

       return [...currentDocuments, newDocument];
     },
     { revalidate: false }, // Prevent automatic revalidation
   );

   // For local documents
   setLocalDocuments((currentDocuments) => {
     if (!currentDocuments) return undefined;

     const newDocument = {
       id: actualDocumentId,
       kind: artifact.kind,
       title: artifact.title,
       content: updatedContent,
       createdAt: new Date(),
       updatedAt: new Date(),
       userId: 'local-user',
     };

     return [...currentDocuments, newDocument];
   });
   ```

3. **Navigating Versions**:

   ```typescript
   const handleVersionChange = (
     type: 'next' | 'prev' | 'toggle' | 'latest',
   ) => {
     if (!documents) return;

     if (type === 'latest') {
       setCurrentVersionIndex(documents.length - 1);
       setMode('edit');
     }

     if (type === 'toggle') {
       setMode((mode) => (mode === 'edit' ? 'diff' : 'edit'));
     }

     if (type === 'prev') {
       if (currentVersionIndex > 0) {
         setCurrentVersionIndex((index) => index - 1);
       }
     } else if (type === 'next') {
       if (currentVersionIndex < documents.length - 1) {
         setCurrentVersionIndex((index) => index + 1);
       }
     }
   };
   ```

4. **Debouncing Content Changes**:

   ```typescript
   // Import the debounce hook
   import { useDebounceCallback } from 'usehooks-ts';

   // Set up debounced save function
   const debouncedHandleContentChange = useDebounceCallback(
     handleContentChange,
     1000, // 1 second debounce time
   );

   // Use in your component
   const saveContent = (updatedContent: string, debounce: boolean) => {
     setIsContentDirty(true); // Show saving indicator

     if (debounce) {
       debouncedHandleContentChange(updatedContent);
     } else {
       handleContentChange(updatedContent);
     }
   };
   ```

### Using SWR for Data Fetching

The application uses SWR (stale-while-revalidate) for data fetching and state management:

1. **Fetching Documents**:

   ```typescript
   const { data: documents, mutate } = useSWR<Array<Document>>(
     `/api/document?id=${documentId}`,
     fetcher,
   );
   ```

2. **Mutating Data**:

   ```typescript
   // Update data and revalidate
   mutate(newData);

   // Update data without revalidation
   mutate(newData, { revalidate: false });

   // Function-based updates
   mutate((currentData) => {
     // Transform current data
     return [...currentData, newItem];
   });
   ```

3. **Global State with SWR**:

   ```typescript
   // In a hook
   const { data: state, mutate: setState } = useSWR('unique-key', null, {
     fallbackData: initialState,
   });

   // Usage elsewhere
   setState(newState);
   ```

### Custom Hooks

The application provides several custom hooks for common functionality:

1. **useArtifact**:

   ```typescript
   const { artifact, setArtifact, metadata, setMetadata } = useArtifact();

   // Update artifact state
   setArtifact((current) => ({
     ...current,
     content: newContent,
   }));

   // Update metadata
   setMetadata(newMetadata);
   ```

2. **useArtifactSelector** (for optimized rerenders):

   ```typescript
   // Only rerender when title changes
   const title = useArtifactSelector((state) => state.title);
   ```

3. **useMobile**:

   ```typescript
   const isMobile = useMobile();

   return (
     <div className={isMobile ? "mobile-view" : "desktop-view"}>
       {/* Responsive content */}
     </div>
   );
   ```

## Testing Commands

The application includes several testing commands for development:

- `test image artifact`: Generates a sample image artifact
- `test text artifact`: Creates a text document artifact
- `test sheet artifact`: Produces a spreadsheet artifact
- `test streaming`: Demonstrates streaming response capabilities
- `artifact testing`: Shows complete artifact testing procedures

## Documentation Structure

Refer to these documents for specific aspects of the application:

- `PROJECT-OVERVIEW.md`: High-level understanding of the system
- `COMPONENT-ARCHITECTURE.md`: Component relationships and structure
- `ARTIFACT-SYSTEM.md`: Details of the artifact implementation
- `VERSION-CONTROL-SYSTEM.md`: Documentation for version control features
- `MOCK-API-INTEGRATION.md`: Details on the mock API implementation
- `REAL-API-INTEGRATION.md`: Guide for integrating real backend APIs
- `ARTIFACT-TESTING.md`: Procedures for testing artifact functionality

## Best Practices

1. **Component Documentation**:

   - Add file description comments to every component
   - Document props with JSDoc comments
   - Include section comments in complex components

2. **State Management**:

   - Use SWR for global state when possible
   - Use React Context for deeply nested state
   - Use local component state for UI-specific state
   - Leverage custom hooks to encapsulate complex logic

3. **Performance Optimization**:

   - Memoize expensive components with React.memo
   - Use debouncing for expensive operations (like content editing)
   - Implement custom equality checks for memoized components
   - Create selectors for optimized state updates

4. **Code Style**:

   - Follow existing code formatting patterns
   - Use meaningful variable and function names
   - Add comments for complex logic
   - Maintain consistent naming conventions

5. **Version Control**:
   - Create proper version detection checks
   - Use debounced saving for content changes
   - Provide clear UI indicators for version operations
   - Maintain consistent behavior across storage backends
