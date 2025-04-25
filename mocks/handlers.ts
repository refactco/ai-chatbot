import { rest } from 'msw';
import { generateUUID } from '@/lib/utils';

// Helper to determine document type based on user request
const determineDocumentType = (content: string): 'text' | 'code' | 'image' | 'sheet' => {
  const lowercaseContent = content.toLowerCase();
  if (
    lowercaseContent.includes('code') ||
    lowercaseContent.includes('function') ||
    lowercaseContent.includes('programming') ||
    lowercaseContent.includes('javascript') ||
    lowercaseContent.includes('python')
  ) {
    return 'code';
  } else if (
    lowercaseContent.includes('image') ||
    lowercaseContent.includes('picture') ||
    lowercaseContent.includes('photo') ||
    lowercaseContent.includes('diagram')
  ) {
    return 'image';
  }
  return 'text';
};

// Helper to check if a message might trigger document creation
const messageTriggersDocumentCreation = (content: string): boolean => {
  const lowercaseContent = content.toLowerCase();
  return (
    lowercaseContent.includes('create a document') ||
    lowercaseContent.includes('make a document') ||
    lowercaseContent.includes('code example') ||
    lowercaseContent.includes('code sample') ||
    lowercaseContent.includes('create an image') ||
    lowercaseContent.includes('generate an image') ||
    lowercaseContent.includes('make an image') ||
    lowercaseContent.includes('show me code') ||
    lowercaseContent.includes('write code')
  );
};

// Helper to generate a title based on content
const generateTitle = (content: string): string => {
  const words = content.split(' ');
  const significantWords = words.filter(word => word.length > 3).slice(0, 3);
  if (significantWords.length > 0) {
    return significantWords.join(' ').replace(/[?.,!]/g, '') + '...';
  }
  return 'Document ' + new Date().toLocaleTimeString();
};

// Generate content based on document type and user message
const generateDocumentContent = (content: string, documentType: 'text' | 'code' | 'image' | 'sheet'): string => {
  if (documentType === 'code') {
    return `function example() {
  console.log("This is a code example");
  
  // Sample code showing how to use a loop
  for (let i = 0; i < 10; i++) {
    console.log(\`Iteration \${i}\`);
  }
  
  return "Completed example";
}

// Usage
example();`;
  } else if (documentType === 'image') {
    return 'https://via.placeholder.com/800x500?text=Mock+Image+Content';
  }
  
  const title = generateTitle(content);
  return `# ${title}

This is a sample document created based on your request:
"${content}"

## Key Points
1. First important point
2. Second important point
3. Third important point

---

This is just a demonstration of the document preview and skeleton loading functionality.`;
};

// Define types for request bodies
interface ChatRequestBody {
  messages: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  id: string;
  selectedChatModel?: string;
}

interface DocumentRequestBody {
  title?: string;
  kind?: 'text' | 'code' | 'image' | 'sheet';
  content?: string;
}

// Default is not authenticated
let isAuthenticated = false;
// Mock user store
let mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    password: '$2a$10$Q7QJSLqsCZLBf4.dX/gI3.aotjDMva1wvDP6PV5BXES1b.uXYVXTe' // hashed "password"
  }
];

// Special route to allow credentials to work without a real DB
// Since MSW can't intercept direct function calls but only HTTP requests
let credentialsToUse = {
  email: 'user@example.com',
  password: 'password'
};

// IMPORTANT: For testing, use email: user@example.com and password: password

export const authHandlers = [
  // Catch all POST requests that might be server actions
  rest.post('*', async (req, res, ctx) => {
    const url = req.url.toString();
    const body = await req.clone().text();
    
    // For Server Actions
    if (url.includes('_next/server-action') || url.includes('actions')) {
      console.log('[MSW] Intercepted server action:', url);
      
      if (body.includes('login')) {
        console.log('[MSW] Login action detected');
        isAuthenticated = true;
        
        return res(
          ctx.status(200),
          ctx.json({ status: 'success' })
        );
      }
      
      if (body.includes('register')) {
        console.log('[MSW] Register action detected');
        isAuthenticated = true;
        
        return res(
          ctx.status(200),
          ctx.json({ status: 'success' })
        );
      }
    }
    
    // For Auth.js v5 endpoints
    if (url.includes('/api/auth')) {
      if (url.includes('callback/credentials')) {
        console.log('[MSW] Auth.js credentials callback detected');
        isAuthenticated = true;
        
        return res(
          ctx.status(200),
          ctx.json({
            user: {
              id: '1',
              email: credentialsToUse.email,
              name: 'Test User',
            },
          })
        );
      }
      
      if (url.includes('signin') || url.includes('login')) {
        console.log('[MSW] Auth.js signin detected');
        isAuthenticated = true;
        
        return res(
          ctx.status(200),
          ctx.json({
            url: '/',
            ok: true
          })
        );
      }
      
      if (url.includes('signout')) {
        console.log('[MSW] Auth.js signout detected');
        isAuthenticated = false;
        
        return res(
          ctx.status(200),
          ctx.json({ success: true })
        );
      }
    }
    
    // Let other POST requests pass through
    return req.passthrough();
  }),
  
  // Mock DB user query endpoint (for getUser in db/queries.ts)
  rest.get('/api/db/user', (req, res, ctx) => {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    
    console.log('[MSW] DB user query for email:', email);
    
    if (email === credentialsToUse.email) {
      return res(
        ctx.status(200),
        ctx.json([mockUsers[0]])
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json([])
    );
  }),
  
  // Handle Next Auth session endpoint
  rest.get('/api/auth/session', (req, res, ctx) => {
    console.log('[MSW] Auth session check, isAuthenticated:', isAuthenticated);
    
    if (isAuthenticated) {
      return res(
        ctx.status(200),
        ctx.json({
          user: {
            id: '1',
            email: credentialsToUse.email,
            name: 'Test User',
          },
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        })
      );
    } else {
      // Return null when not authenticated
      return res(ctx.status(200), ctx.json(null));
    }
  }),
  
  // Force authentication for testing purposes
  rest.get('/api/auth/debug/login', (req, res, ctx) => {
    console.log('[MSW] Debug login endpoint called');
    isAuthenticated = true;
    
    return res(
      ctx.status(200),
      ctx.json({ success: true, message: 'Debug login successful' })
    );
  }),
  
  // Force logout for testing purposes
  rest.get('/api/auth/debug/logout', (req, res, ctx) => {
    console.log('[MSW] Debug logout endpoint called');
    isAuthenticated = false;
    
    return res(
      ctx.status(200),
      ctx.json({ success: true, message: 'Debug logout successful' })
    );
  }),
];

export const handlers = [
  // Main chat API handler for creating documents
  rest.post('/api/chat', async (req, res, ctx) => {
    // Get the request body
    const body = await req.json() as ChatRequestBody;
    const { messages, id } = body;
    const userMessage = messages[messages.length - 1];
    
    // Check if this message should trigger a document creation
    if (messageTriggersDocumentCreation(userMessage.content)) {
      const documentType = determineDocumentType(userMessage.content);
      const title = generateTitle(userMessage.content);
      const docId = generateUUID();
      
      // Step 1: Add delay to simulate server processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Then send a message with tool call showing skeleton
      const initialResponse = {
        id,
        messages: [
          {
            id: generateUUID(),
            role: 'assistant',
            content: `I'll create a ${documentType} document for you.`,
            createdAt: new Date(),
            parts: [
              {
                type: 'text',
                text: `I'll create a ${documentType} document for you.`
              },
              {
                type: 'tool-invocation',
                toolInvocation: {
                  toolName: 'createDocument',
                  toolCallId: generateUUID(),
                  state: 'call',
                  args: {
                    title,
                    kind: documentType
                  }
                }
              }
            ]
          }
        ],
        firstMessage: `I'll create a ${documentType} document for you.`,
        done: false
      };
      
      return res(ctx.status(200), ctx.json(initialResponse));
    }
    
    // Return a standard text response
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return res(
      ctx.status(200),
      ctx.json({
        id,
        messages: [
          {
            id: generateUUID(),
            role: 'assistant',
            content: `This is a mock response to: "${userMessage.content}"`,
            createdAt: new Date(),
            parts: [
              {
                type: 'text',
                text: `This is a mock response to: "${userMessage.content}"`
              }
            ]
          }
        ],
        firstMessage: `This is a mock response to: "${userMessage.content}"`,
        done: true
      })
    );
  }),
  
  // This handler completes document creation by resolving the tool call
  rest.post('/api/chat/tool', async (req, res, ctx) => {
    interface ToolRequestBody {
      toolCallId: string;
      toolName: string;
      args: {
        title: string;
        kind: string;
        [key: string]: any;
      };
    }
    
    const body = await req.json() as ToolRequestBody;
    const { toolCallId, toolName, args } = body;
    
    if (toolName === 'createDocument') {
      const { title, kind } = args;
      const content = generateDocumentContent(title, kind as 'text' | 'code' | 'image' | 'sheet');
      const docId = generateUUID();
      
      // Simulate delay to show skeleton loader
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return res(
        ctx.status(200),
        ctx.json({
          result: {
            id: docId,
            title,
            kind,
            content
          }
        })
      );
    }
    
    return res(
      ctx.status(400),
      ctx.json({
        error: 'Unknown tool'
      })
    );
  }),
  
  // Document creation handler to simulate tool calls
  rest.post('/api/document', async (req, res, ctx) => {
    const body = await req.json() as DocumentRequestBody;
    const { title = 'Mock Document', kind = 'text', content } = body;
    
    // Simulate server processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return res(
      ctx.status(200),
      ctx.json({
        id: generateUUID(),
        title,
        kind,
        content: content || `This is a mock ${kind} document content`,
        createdAt: new Date(),
        userId: 'mock-user-id'
      })
    );
  }),
  
  // Handle document retrieval
  rest.get('/api/document', async (req, res, ctx) => {
    const url = new URL(req.url.toString());
    const id = url.searchParams.get('id');
    
    if (!id) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'No document ID provided' })
      );
    }
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return res(
      ctx.status(200),
      ctx.json([{
        id,
        title: 'Mock Document',
        kind: 'text',
        content: '# Mock Document Content\n\nThis is a mock document for preview purposes.',
        createdAt: new Date(),
        userId: 'mock-user-id'
      }])
    );
  }),
  
  // Handle vote API
  rest.get('/api/vote', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
  
  // Handle history API
  rest.get('/api/history', async (req, res, ctx) => {
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return res(
      ctx.status(200),
      ctx.json({
        chats: [
          {
            id: 'mock-chat-1',
            title: 'Mock Chat 1',
            createdAt: new Date(Date.now() - 1000 * 60 * 60),
            updatedAt: new Date(),
            userId: 'mock-user-id'
          },
          {
            id: 'mock-chat-2',
            title: 'Mock Chat 2',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60),
            userId: 'mock-user-id'
          }
        ]
      })
    );
  })
]; 