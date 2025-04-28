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
│   └── ...                  # Other components
├── artifacts/               # Artifact type implementations
│   ├── text/                # Text artifact components
│   ├── image/               # Image artifact components
│   └── sheet/               # Sheet artifact components
├── hooks/                   # Custom React hooks
│   ├── use-artifact.ts      # Artifact state management
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
   // components/MyComponent.tsx
   export function MyComponent({ prop1, prop2 }: MyComponentProps) {
     return (
       <div>
         {/* Component content */}
       </div>
     );
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

2. To modify message rendering, edit `components/message.tsx`

3. To change how messages are processed, modify `lib/services/mock-api-service.ts` (for mock implementation) or `lib/ai/react.ts` (for general chat handling)

#### Working with the Artifact System

The artifact system uses a pluggable architecture for different content types:

1. **Understanding Artifact Types**:
   - Artifacts are defined in `/artifacts/{type}/client.tsx`
   - Each artifact type implements a standard interface
   - Core artifact UI is in `components/artifact.tsx`

2. **Adding a New Artifact Type**:
   ```tsx
   // artifacts/mynew/client.tsx
   import { ArtifactContentProps } from '@/lib/types';
   
   export const myNewArtifact = {
     kind: 'mynew',
     name: 'My New Artifact',
     description: 'Description of the new artifact type',
     
     // Component to render the content
     content: ({ 
       content, 
       onSaveContent, 
       mode,
       isCurrentVersion,
       // other props...
     }: ArtifactContentProps) => {
       return (
         <div>
           {/* Artifact content implementation */}
         </div>
       );
     }
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
     myNewArtifact // Add your new artifact type
   ];
   ```

4. **Testing Your Artifact**:
   - Add a test trigger in the mock service
   - Use specialized mock data for your artifact type

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
   await fetch(`/api/document?id=${documentId}`, {
     method: 'POST',
     body: JSON.stringify({
       title,
       content,
       kind,
     }),
   });
   
   // For local documents
   const newDocument = {
     id: documentId,
     kind,
     title,
     content,
     createdAt: new Date(),
     updatedAt: new Date(),
     userId: 'local-user',
   };
   localStorage.setItem(
     `local-document-${documentId}`,
     JSON.stringify([...currentDocuments, newDocument])
   );
   ```

3. **Navigating Versions**:
   ```typescript
   // Navigate to a specific version
   setCurrentVersionIndex(targetIndex);
   
   // Get content of specific version
   const versionContent = documents[currentVersionIndex]?.content || '';
   ```

4. **Restoring Versions**:
   ```typescript
   // Filter versions to keep only those before selected timestamp
   const restoredVersions = documents.filter(
     doc => !isAfter(new Date(doc.createdAt), selectedTimestamp)
   );
   ```

### Working with Mock API

The application uses mock services for development. When adding new features:

1. Add new mock endpoints to `lib/services/mock-api-service.ts`
2. Simulate realistic delays and responses
3. Test all scenarios (success, error, loading states)

### Testing Artifacts

To test artifact generation and interaction:

1. Use predefined test commands in the chat input:
   - `test text artifact` - Creates a text document
   - `test image artifact` - Creates an image
   - `test sheet artifact` - Creates a spreadsheet

2. Test version control features:
   - Edit artifacts to create multiple versions
   - Navigate between versions using the UI controls
   - Compare versions with diff mode
   - Restore previous versions

3. Test storage backends:
   - API storage (default)
   - Local storage (for documents with special prefixes)

### Building for Production

Build the application:
```bash
npm run build
# or
yarn build
```

Start the production server:
```bash
npm run start
# or
yarn start
```

## Debugging Tips

### Common Issues

1. **Messages not appearing in the chat**:
   - Check that message IDs are unique
   - Verify the message format matches the expected interface
   - Look for errors in the console

2. **Styling inconsistencies**:
   - Ensure Tailwind classes are applied correctly
   - Check for CSS conflicts
   - Verify the component accepts className prop for customization

3. **Mock API not responding**:
   - Check browser console for errors
   - Verify that mock service functions are being called
   - Ensure promise chains are properly handled

4. **Artifact rendering issues**:
   - Check that artifact kind is registered in artifactDefinitions
   - Verify content format matches expected format for the artifact type
   - Check local storage for document versions (if using local storage)

5. **Version control problems**:
   - Look for localStorage entries with keys starting with `local-document-`
   - Check the JSON structure of stored documents
   - Verify timestamp ordering for version navigation
   - Console log versions during navigation and restoration

### Debugging Tools

1. React Developer Tools browser extension
2. Next.js built-in error overlay
3. Browser console and network tab
4. Local Storage inspector in browser developer tools

## Performance Optimization

When working with artifacts:

1. **Memoize components**:
   - Use React.memo for artifact content components
   - Implement custom equality checks for complex props

2. **Debounce expensive operations**:
   - Use debouncing for content editing
   - Consider throttling for real-time updates

3. **Optimize version handling**:
   - Be cautious with large document sizes
   - Consider pagination for large version histories

## Contributing Guidelines

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. Make your changes and commit using descriptive messages:
   ```bash
   git commit -m "Add new feature: description of changes"
   ```

3. Push to your branch and create a pull request:
   ```bash
   git push origin feature/my-new-feature
   ```

4. Follow the code style guidelines:
   - Use TypeScript for type safety
   - Follow component composition patterns
   - Maintain responsive design principles
   - Keep UI components modular and reusable
   - Handle loading and error states gracefully 