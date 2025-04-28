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

#### Working with Mock API

The application uses mock services for development. When adding new features:

1. Add new mock endpoints to `lib/services/mock-api-service.ts`
2. Simulate realistic delays and responses
3. Test all scenarios (success, error, loading states)

### Testing

Run the test suite:
```bash
npm run test
# or
yarn test
```

For component testing, use React Testing Library:
```tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent prop1="test" prop2={123} />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
```

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

### Debugging Tools

1. React Developer Tools browser extension
2. Next.js built-in error overlay
3. Browser console and network tab

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