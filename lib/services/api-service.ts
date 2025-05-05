/**
 * API Service
 *
 * This file provides a service layer for API interactions.
 * It integrates with the backend API for chat functionality.
 *
 * Features:
 * - User message handling
 * - Streaming response processing
 * - Chat history management
 * - Error handling and recovery
 */

import type { Attachment } from '@/lib/api/types';

// Backend API configuration
export const API_CONFIG = {
  // For direct backend access (server-side only)
  BACKEND_URL: 'http://localhost:3333',
  // For client-side access (uses real API endpoint)
  BASE_URL: 'http://localhost:3333/api',
  ENDPOINTS: {
    CHAT_STREAM: '/chat/stream',
  },
  // Real API token
  AUTH_TOKEN:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVlMGZhMDk1LWQyNjctNGFlYy05NjMxLTJiMzRhODVjNzM2MyIsImVtYWlsIjoiZGV2QHJlZmFjdC5jbyIsImV4cCI6NDg5OTU5OTk4MywiaWF0IjoxNzQ1OTk5OTgzfQ.0pDb3MuRpaO-9N8C92ugzDmsq5pnMxL78c1Wz77hpJ4',
};

// Type definitions for User, Chat, Message, and API responses
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Chat {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ChatDetailResponse {
  chat: Chat;
  messages: Message[];
}

export interface ChatCompletionResponse {
  message: Message;
  isStreaming?: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'tool';
  createdAt: Date;
  attachments?: Attachment[];
  // reasoning?: string;
  // type?: string;
}

export interface ChatSummary {
  id: string; // Mapped from _id or conversation_id
  title: string; // Extracted from content
  lastMessagePreview: string; // Extracted from content
  timestamp: string; // From backend conversation structure
  content: any; // From backend conversation structure
  conversation_id: string; // From backend conversation structure
  message_id: string; // From backend conversation structure
  _id: string; // From backend conversation structure
}

export interface StreamResponseOptions {
  onChunk: (chunk: string | ChatMessage) => void;
  onFinish: (message: ChatMessage) => void;
  onError: (error: Error) => void;
}

// Helper function to get data from localStorage by key
// Returns an array of type T, or an empty array if not found or not in browser
const getLocalData = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];

  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Helper function to set data in localStorage by key
const setLocalData = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

// Helper to generate a random string ID
const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Authentication Services
export const authService = {
  // Register a new user and store in localStorage
  register: async (name: string, email: string, password: string) => {
    const users = getLocalData<User & { password: string }>('users');

    // Check if email is already taken
    if (users.some((u) => u.email === email)) {
      throw new Error('Email is already taken');
    }

    const newUser: User & { password: string } = {
      id: generateId(),
      name,
      email,
      password, // In a real app, this would be hashed
    };

    users.push(newUser);
    setLocalData('users', users);

    const { password: _, ...user } = newUser;
    const token = generateId();

    localStorage.setItem('auth_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));

    return { user, token };
  },

  // Login a user by checking email and password
  login: async (email: string, password: string) => {
    const users = getLocalData<User & { password: string }>('users');
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userData } = user;
    const token = generateId();

    localStorage.setItem('auth_token', token);
    localStorage.setItem('current_user', JSON.stringify(userData));

    return { user: userData, token };
  },

  // Get the current user from localStorage (if logged in)
  getCurrentUser: async () => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      return null;
    }

    try {
      const userData = localStorage.getItem('current_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      return null;
    }
  },

  // Logout the current user (removes token and user from localStorage)
  logout: async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  },

  // Update user profile in localStorage
  updateProfile: async (userId: string, userData: Partial<User>) => {
    const users = getLocalData<User & { password: string }>('users');
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = { ...users[userIndex], ...userData };
    users[userIndex] = updatedUser;

    setLocalData('users', users);

    const { password: _, ...user } = updatedUser;
    localStorage.setItem('current_user', JSON.stringify(user));

    return user;
  },
};

// Chat Services
export const chatService = {
  // Get all chats for a user
  getUserChats: async (userId: string) => {
    const chats = getLocalData<Chat>('chats');
    return chats.filter((chat) => chat.userId === userId);
  },

  // Get a single chat by ID, including its messages
  getChatById: async (chatId: string) => {
    const chats = getLocalData<Chat>('chats');
    const chat = chats.find((c) => c.id === chatId);

    if (!chat) {
      throw new Error('Chat not found');
    }

    // Get and sort messages for this chat
    const messages = getLocalData<Message>('messages')
      .filter((m) => m.chatId === chatId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    return { chat, messages };
  },

  // Create a new chat for a user
  createChat: async (userId: string, title: string) => {
    const chats = getLocalData<Chat>('chats');

    const newChat: Chat = {
      id: generateId(),
      userId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    chats.push(newChat);
    setLocalData('chats', chats);

    return newChat;
  },

  // Update a chat's details
  updateChat: async (chatId: string, updates: Partial<Chat>) => {
    const chats = getLocalData<Chat>('chats');
    const chatIndex = chats.findIndex((c) => c.id === chatId);

    if (chatIndex === -1) {
      throw new Error('Chat not found');
    }

    const updatedChat = {
      ...chats[chatIndex],
      ...updates,
      updatedAt: new Date(),
    };

    chats[chatIndex] = updatedChat;
    setLocalData('chats', chats);

    return updatedChat;
  },

  // Delete a chat and its associated messages
  deleteChat: async (chatId: string) => {
    const chats = getLocalData<Chat>('chats');
    const filteredChats = chats.filter((c) => c.id !== chatId);

    if (filteredChats.length === chats.length) {
      throw new Error('Chat not found');
    }

    setLocalData('chats', filteredChats);

    // Also delete associated messages
    const messages = getLocalData<Message>('messages');
    const filteredMessages = messages.filter((m) => m.chatId !== chatId);
    setLocalData('messages', filteredMessages);

    return { success: true };
  },

  // Get all messages for a chat, sorted by creation date
  getChatMessages: async (chatId: string) => {
    const messages = getLocalData<Message>('messages')
      .filter((m) => m.chatId === chatId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    return messages;
  },

  // Create a new message for a chat
  createMessage: async (
    chatId: string,
    content: string,
    role: 'user' | 'assistant' | 'system',
  ) => {
    const messages = getLocalData<Message>('messages');

    const newMessage: Message = {
      id: generateId(),
      chatId,
      content,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    messages.push(newMessage);
    setLocalData('messages', messages);

    return newMessage;
  },

  // Simulate an AI chat completion (assistant response)
  createChatCompletion: async (chatId: string, message: string) => {
    // Create a user message first
    const userMessage = await chatService.createMessage(
      chatId,
      message,
      'user',
    );

    // Create a simple assistant response
    const assistantMessage = await chatService.createMessage(
      chatId,
      `This is a locally stored AI response to: "${message}"`,
      'assistant',
    );

    return {
      message: assistantMessage,
    };
  },

  // Simulate streaming an AI chat completion (assistant response)
  streamChatCompletion: async (
    chatId: string,
    message: string,
    onChunk: (chunk: string) => void,
  ) => {
    // Create a user message first
    const userMessage = await chatService.createMessage(
      chatId,
      message,
      'user',
    );

    // Simulate streaming with a timeout
    const response = `This is a locally stored AI response to: "${message}"`;

    // Split the message into parts to simulate streaming
    const parts = response.split(' ');

    let fullResponse = '';

    for (const part of parts) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      fullResponse += `${part} `;
      onChunk(`${part} `);
    }

    // Create the final message
    const assistantMessage = await chatService.createMessage(
      chatId,
      fullResponse.trim(),
      'assistant',
    );

    return {
      message: assistantMessage,
      isStreaming: true,
    };
  },
};

// Export a single API service object for convenience
export const apiService = {
  auth: authService,
  chat: chatService,

  // Send a message to the AI agent
  sendMessage: async (
    message: string,
    attachments: Attachment[] = [],
    chatId?: string,
  ): Promise<ChatMessage> => {
    try {
      // Since our backend API doesn't require a separate call to send user messages,
      // we just need to create a local representation of the message to display in UI
      const userMessage = {
        id: generateId(),
        content: message,
        role: 'user' as const,
        createdAt: new Date(),
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      return userMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error(
        `Error sending message: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  },

  // Stream an AI response based on a user message
  streamResponse: async (
    message: string,
    options: StreamResponseOptions,
    chatId?: string,
    attachments: Attachment[] = [],
  ): Promise<void> => {
    const { onChunk, onFinish, onError } = options;

    try {
      // Encode the message for the query parameter
      const encodedMessage = encodeURIComponent(message);

      console.log(
        'Starting chat stream request:',
        encodedMessage.substring(0, 30) + '...',
      );

      // Connect to the backend API endpoint for streaming with token
      const eventSource = new EventSource(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT_STREAM}?message=${encodedMessage}&token=${API_CONFIG.AUTH_TOKEN}`,
        {
          withCredentials: false, // Add this to handle CORS
        },
      );

      // Track seen event types for debugging
      const seenEventTypes = new Set<string>();

      // Generate a unique session ID for this conversation
      const sessionId = `session-${Date.now()}`;

      // Create a stable ID for the final streaming response
      const finalResponseId = `response-${sessionId}`;

      // Store all streaming chunks
      let responseContent = '';

      // Process events from the stream
      eventSource.addEventListener('message', (event) => {
        try {
          // Parse the event data
          const parsedData = JSON.parse(event.data);

          // Log for debugging real API responses
          console.log('Real API event data:', {
            event: event,
            parsedData: parsedData,
            role: parsedData.role,
            content: parsedData.content,
            toolCalls: parsedData.tool_calls,
          });

          const eventType = parsedData.role;

          // Track event types seen
          seenEventTypes.add(eventType);

          if (eventType === 'user' && !parsedData.content) {
            return;
          }

          // Skip user message events (redundant with UI)
          // if (eventType === 'user') {
          //   const eventMessage = {
          //     id: `${eventType}-${sessionId}-${Math.random().toString(36).substring(2, 9)}`,
          //     role: 'user' as const,
          //     content: formatEventContent(parsedData),
          //     createdAt: new Date(),
          //   };

          //   onChunk(eventMessage);
          //   return;
          // }

          // Handle streaming response chunks
          // if (eventType === 'llm_streaming_response') {
          //   // Accumulate content
          //   responseContent += parsedData.content || '';

          //   // Create or update the streaming message
          //   const streamingMessage = {
          //     id: finalResponseId,
          //     role: 'assistant' as const,
          //     content: responseContent,
          //     createdAt: new Date(),
          //   };

          //   // Send to UI
          //   onChunk(streamingMessage);
          //   return;
          // }

          // Create a message for all other event types
          const eventMessage = {
            id: `${eventType}-${sessionId}-${Math.random().toString(36).substring(2, 9)}`,
            role: parsedData.role,
            content: formatEventContent(parsedData),
            tool_calls: parsedData.tool_calls,
            createdAt: new Date(),
          };

          onChunk(eventMessage);
        } catch (error) {
          console.error('Error processing event:', error);
        }
      });

      // Handle stream completion
      eventSource.addEventListener('end', () => {
        console.log('Stream completed. Event types seen:', [...seenEventTypes]);
        eventSource.close();

        // Ensure we have a complete final response
        if (responseContent) {
          const finalMessage = {
            id: finalResponseId,
            role: 'assistant' as const,
            content: responseContent,
            createdAt: new Date(),
          };
          onFinish(finalMessage);
        } else {
          // Fallback if no streaming response was received
          onFinish({
            id: generateId(),
            role: 'assistant' as const,
            content: 'Processing complete.',
            createdAt: new Date(),
          });
        }
      });

      // Handle errors
      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        eventSource.close();
        onError(new Error('Connection to the AI service failed.'));
      };
    } catch (error) {
      console.error('Error in stream setup:', error);
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  },

  // Get chat history
  getChatHistory: async (limit = 20, offset = 0): Promise<ChatSummary[]> => {
    const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/conversations?limit=${limit}&offset=${offset}&token=${API_CONFIG.AUTH_TOKEN}`);

    if (!response.ok) {
      throw new Error(`Error fetching chat history: ${response.statusText}`);
    }

    const conversations = await response.json();
    
    // Transform the response data to match our expected structure
    return conversations.map((conversation: any) => {
      const contentStr = typeof conversation.content === 'string' 
        ? conversation.content 
        : JSON.stringify(conversation.content);
      
      const title = contentStr.substring(0, 30) + (contentStr.length > 30 ? '...' : '');
      const lastMessagePreview = contentStr.substring(0, 50) + (contentStr.length > 50 ? '...' : '');
      
      return {
        id: conversation._id || conversation.conversation_id,
        title,
        lastMessagePreview,
        timestamp: conversation.timestamp,
        content: conversation.content,
        conversation_id: conversation.conversation_id,
        message_id: conversation.message_id,
        _id: conversation._id
      };
    });
  },

  // Get chat by ID with its messages
  getChatById: async (
    chatId: string,
  ): Promise<{ chat: ChatSummary; messages: ChatMessage[] } | null> => {
    const response = await fetch(`/api/chat/${chatId}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Error fetching chat: ${response.statusText}`);
    }

    return await response.json();
  },

  // Create a new empty chat
  createNewChat: async (): Promise<ChatSummary> => {
    const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/chat?token=${API_CONFIG.AUTH_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error creating chat: ${response.statusText}`);
    }

    // Get the new chat data
    const newChat = await response.json();
    
    // Return the transformed chat data to match our expected structure
    return {
      id: newChat._id || newChat.conversation_id,
      title: typeof newChat.content === 'string' 
        ? newChat.content.substring(0, 30) + (newChat.content.length > 30 ? '...' : '')
        : 'New Conversation',
      lastMessagePreview: typeof newChat.content === 'string'
        ? newChat.content.substring(0, 50) + (newChat.content.length > 50 ? '...' : '')
        : '',
      timestamp: newChat.timestamp,
      content: newChat.content,
      conversation_id: newChat.conversation_id,
      message_id: newChat.message_id,
      _id: newChat._id
    };
  },
};

// Helper function to format events for display
function formatEventContent(event: any): string {
  // If there's direct content, use it
  if (event.content && typeof event.content === 'string') {
    return event.content;
  }

  // For tool calls, format them appropriately
  if (event.tool_calls) {
    if (event.tool_calls.type === 'request' && event.tool_calls.title) {
      return event.tool_calls.title;
    } else if (
      event.tool_calls.items &&
      Array.isArray(event.tool_calls.items)
    ) {
      const itemsList = event.tool_calls.items
        .map((item: any) => `- ${item.name || 'Unnamed item'}`)
        .join('\n');
      return `${event.tool_calls.title || 'Tool Request'}:\n${itemsList}`;
    }
  }

  // Format based on event type/role
  switch (event.role) {
    case 'system_prompt':
      return `System: ${event.content || 'System message'}`;
    case 'thinking':
      return `Thinking: ${event.content || 'Processing...'}`;
    case 'selected_tool':
      return `Selected tool: ${event.content || 'Unknown tool'}`;
    case 'tool_called':
      return `Tool called: ${event.content || 'Unknown tool'}`;
    case 'tool_result':
      return `Tool result: ${event.content || 'No result'}`;
    case 'llm_streaming_response':
      return event.content || '';
    default:
      // For any other type, just return the content if available
      return event.content || `Event: ${event.role || 'unknown'}`;
  }
}

// Helper to format JSON data with truncation
function formatJsonData(data: any): string {
  if (!data) return '';

  try {
    const jsonStr =
      typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const lines = jsonStr.split('\n');

    if (lines.length > 8) {
      return `\`\`\`json\n${lines.slice(0, 8).join('\n')}\n... (${lines.length - 8} more lines)\n\`\`\``;
    }

    return `\`\`\`json\n${jsonStr}\n\`\`\``;
  } catch (e) {
    return String(data);
  }
}
