/**
 * Mock API data
 *
 * This file contains mock data for the application.
 * It serves as an in-memory database for the mock API layer.
 */

import {
  User,
  Chat,
  Message,
  Artifact,
  Attachment,
  MessageRole,
  ArtifactType,
  daysAgo,
} from './models';
import { generateId } from './utils';

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Demo User',
    email: 'demo@example.com',
    image: 'https://ui-avatars.com/api/?name=Demo+User',
    emailVerified: daysAgo(30),
    createdAt: daysAgo(60),
    updatedAt: daysAgo(60),
  },
  {
    id: 'user-2',
    name: 'Test User',
    email: 'test@example.com',
    image: 'https://ui-avatars.com/api/?name=Test+User',
    emailVerified: daysAgo(20),
    createdAt: daysAgo(40),
    updatedAt: daysAgo(40),
  },
];

// Mock chats
export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    userId: 'user-1',
    title: 'Getting Started',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(2),
    path: '/chat/chat-1',
    isShared: false,
  },
  {
    id: 'chat-2',
    userId: 'user-1',
    title: 'Project Ideas',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
    path: '/chat/chat-2',
    isShared: false,
  },
  {
    id: 'chat-3',
    userId: 'user-1',
    title: 'Technical Questions',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(0),
    path: '/chat/chat-3',
    isShared: true,
    sharePath: '/share/chat-3',
  },
];

// Mock messages
export const mockMessages: Message[] = [
  // Chat 1 messages
  {
    id: 'msg-1',
    chatId: 'chat-1',
    content: 'Hello! How can I help you today?',
    role: 'assistant',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    id: 'msg-2',
    chatId: 'chat-1',
    content: "I'd like to learn more about this AI chatbot.",
    role: 'user',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    id: 'msg-3',
    chatId: 'chat-1',
    content:
      'This is a mock AI chatbot built with React, Next.js, and TypeScript. It uses modern web technologies to provide a realistic chat experience without requiring an actual database.',
    role: 'assistant',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    id: 'msg-4',
    chatId: 'chat-1',
    content: 'Can you show me an example of code?',
    role: 'user',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: 'msg-5',
    chatId: 'chat-1',
    content: "Here's a simple React component:",
    role: 'assistant',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    artifacts: [
      {
        id: 'artifact-1',
        userId: 'user-1',
        messageId: 'msg-5',
        title: 'React Component',
        type: 'code',
        content: `import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};

export default Counter;`,
        createdAt: daysAgo(2),
        updatedAt: daysAgo(2),
      },
    ],
  },

  // Chat 2 messages
  {
    id: 'msg-6',
    chatId: 'chat-2',
    content: 'I need some project ideas for a portfolio.',
    role: 'user',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    id: 'msg-7',
    chatId: 'chat-2',
    content:
      'Here are some project ideas for a developer portfolio:\n\n1. Personal blog with a headless CMS\n2. E-commerce store with payment integration\n3. Real-time chat application\n4. Task management app with drag-and-drop\n5. Weather application using a public API',
    role: 'assistant',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    id: 'msg-8',
    chatId: 'chat-2',
    content:
      'The chat app sounds interesting. What technologies would you recommend?',
    role: 'user',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: 'msg-9',
    chatId: 'chat-2',
    content:
      'For a real-time chat application, I recommend:\n\n- Frontend: React or Next.js with TypeScript\n- Styling: Tailwind CSS\n- Real-time: Socket.io or Firebase\n- State Management: React Context or Redux\n- Authentication: NextAuth.js or Firebase Auth\n- Deployment: Vercel or Netlify',
    role: 'assistant',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },

  // Chat 3 messages
  {
    id: 'msg-10',
    chatId: 'chat-3',
    content: "What's the difference between useMemo and useCallback in React?",
    role: 'user',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: 'msg-11',
    chatId: 'chat-3',
    content:
      'Both `useMemo` and `useCallback` are hooks in React for optimization:\n\n- `useMemo` memoizes a computed value, recalculating only when dependencies change\n- `useCallback` memoizes a function instance, preventing unnecessary re-renders of components that rely on reference equality\n\nUse `useMemo` for expensive calculations and `useCallback` for functions passed to child components.',
    role: 'assistant',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: 'msg-12',
    chatId: 'chat-3',
    content: 'Can you provide examples of each?',
    role: 'user',
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
  },
  {
    id: 'msg-13',
    chatId: 'chat-3',
    content: 'Here are examples of useMemo and useCallback:',
    role: 'assistant',
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
    artifacts: [
      {
        id: 'artifact-2',
        userId: 'user-1',
        messageId: 'msg-13',
        title: 'useMemo Example',
        type: 'code',
        content: `import React, { useMemo } from 'react';

function ExpensiveCalculation({ items }) {
  // This calculation will only run when 'items' changes
  const processedItems = useMemo(() => {
    console.log('Processing items...');
    return items.map(item => item * 2).filter(item => item > 10);
  }, [items]);
  
  return <div>{processedItems.join(', ')}</div>;
}`,
        createdAt: daysAgo(0),
        updatedAt: daysAgo(0),
      },
      {
        id: 'artifact-3',
        userId: 'user-1',
        messageId: 'msg-13',
        title: 'useCallback Example',
        type: 'code',
        content: `import React, { useCallback, useState } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);
  
  // This function instance is preserved between renders unless 'count' changes
  const handleClick = useCallback(() => {
    console.log('Button clicked, count:', count);
  }, [count]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ChildComponent onClick={handleClick} />
    </div>
  );
}

// This component will only re-render when the 'onClick' function reference changes
const ChildComponent = React.memo(({ onClick }) => {
  console.log('ChildComponent rendered');
  return <button onClick={onClick}>Click me</button>;
});`,
        createdAt: daysAgo(0),
        updatedAt: daysAgo(0),
      },
    ],
  },
];

// Mock artifacts (already defined inline with messages above)
export const mockArtifacts: Artifact[] = [
  // Get artifacts from the messages
  ...mockMessages
    .filter((message) => message.artifacts)
    .flatMap((message) => message.artifacts || []),
];

// Mock attachments
export const mockAttachments: Attachment[] = [
  {
    id: 'attachment-1',
    messageId: 'msg-6',
    type: 'image/jpeg',
    url: 'https://picsum.photos/seed/picsum/200/300',
    name: 'example-image.jpg',
    size: 12345,
    createdAt: daysAgo(3),
  },
];

// Helper function to get all messages for a chat
export const getMessagesForChat = (chatId: string): Message[] => {
  return mockMessages.filter((message) => message.chatId === chatId);
};

// Helper function to initialize mock data in localStorage for persistence
export const initializeMockData = (): void => {
  localStorage.setItem('mock_users', JSON.stringify(mockUsers));
  localStorage.setItem('mock_chats', JSON.stringify(mockChats));
  localStorage.setItem('mock_messages', JSON.stringify(mockMessages));
  localStorage.setItem('mock_artifacts', JSON.stringify(mockArtifacts));
  localStorage.setItem('mock_attachments', JSON.stringify(mockAttachments));
};
