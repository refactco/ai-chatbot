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
 * - Support for both mock and real API implementations
 */

import type { Attachment } from '@/lib/api/types';

// Backend API configuration
const API_CONFIG = {
  // For direct backend access (server-side only)
  BACKEND_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333',
  // For client-side access (uses Next.js API route proxy)
  BASE_URL: '/api',
  ENDPOINTS: {
    CHAT_STREAM: '/chat/stream',
  },
};

// Configuration flag to switch between mock and real API
const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === 'true';

// User token for authentication with real API
const API_TOKEN =
  process.env.NEXT_PUBLIC_API_TOKEN ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVlMGZhMDk1LWQyNjctNGFlYy05NjMxLTJiMzRhODVjNzM2MyIsImVtYWlsIjoiZGV2QHJlZmFjdC5jbyIsImV4cCI6NDg5OTU5OTk4MywiaWF0IjoxNzQ1OTk5OTgzfQ.0pDb3MuRpaO-9N8C92ugzDmsq5pnMxL78c1Wz77hpJ4';

console.log({
  USE_REAL_API,
  API_TOKEN,
  API_CONFIG,
});

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
  id: string;
  title: string;
  lastMessagePreview: string;
  createdAt: Date;
  updatedAt: Date;
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

    if (!USE_REAL_API) {
      // Use the mock implementation when real API is disabled
      await mockStreamResponse(message, options, chatId, attachments);
      return;
    }

    try {
      // Encode the message for the query parameter
      const encodedMessage = encodeURIComponent(message);

      console.log(
        'Starting chat stream request to real API:',
        encodedMessage.substring(0, 30) + '...',
      );

      // Build the API URL with message and token
      const apiUrl = `${API_CONFIG.BACKEND_URL}${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT_STREAM}?message=${encodedMessage}&token=${API_TOKEN}`;

      // Connect to the real backend API endpoint for streaming
      const eventSource = new EventSource(apiUrl, {
        withCredentials: false, // Add this to handle CORS
      });

      // Track seen event types for debugging
      const seenEventTypes = new Set<string>();

      // Generate a unique session ID for this conversation
      const sessionId = `session-${Date.now()}`;

      // Create a stable ID for the final streaming response
      const finalResponseId = `response-${sessionId}`;

      // Store all streaming chunks
      let responseContent = '';

      // Process events from the stream
      eventSource.onmessage = (event) => {
        try {
          // Parse the event data
          const parsedData = JSON.parse(event.data);
          console.log('Received streaming data:', parsedData);

          // Extract content from the response
          const content = parsedData.content || '';

          // Accumulate content
          responseContent += content;

          // Create or update the streaming message
          const streamingMessage = {
            id: finalResponseId,
            role: 'assistant' as const,
            content: responseContent,
            createdAt: new Date(),
          };

          // Send to UI
          onChunk(streamingMessage);
        } catch (error) {
          console.error('Error parsing stream data:', error);
        }
      };

      // Handle errors
      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        eventSource.close();

        // If we've collected some response, still consider it complete
        if (responseContent.length > 0) {
          const finalMessage = {
            id: finalResponseId,
            role: 'assistant' as const,
            content: responseContent,
            createdAt: new Date(),
          };

          onFinish(finalMessage);
        } else {
          onError(new Error('Stream connection error'));
        }
      };

      // Handle stream completion
      eventSource.addEventListener('done', (event) => {
        eventSource.close();

        const finalMessage = {
          id: finalResponseId,
          role: 'assistant' as const,
          content: responseContent,
          createdAt: new Date(),
        };

        onFinish(finalMessage);
      });
    } catch (error) {
      console.error('Stream error:', error);
      onError(
        error instanceof Error ? error : new Error('Unknown stream error'),
      );
    }
  },

  // Get chat by ID
  getChatById: async (chatId: string): Promise<ChatDetailResponse | null> => {
    try {
      const response = await fetch(`/api/chat/${chatId}`);
      if (!response.ok) {
        throw new Error(`Error fetching chat: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching chat:', error);
      // Fall back to local storage
      return await chatService.getChatById(chatId);
    }
  },

  // Get chat history
  getChatHistory: async (limit = 20, offset = 0): Promise<ChatSummary[]> => {
    try {
      const response = await fetch(
        `/api/chats?limit=${limit}&offset=${offset}`,
      );
      if (!response.ok) {
        throw new Error(`Error fetching chat: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching chat history:', error);
      // Return empty array on error
      return [];
    }
  },

  // Create a new empty chat
  createNewChat: async (): Promise<ChatSummary> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Error creating chat: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating new chat:', error);
      // Fall back to creating a local chat
      const userId = 'local-user';
      const newChat = await chatService.createChat(userId, 'New Conversation');
      return {
        ...newChat,
        lastMessagePreview: '',
      };
    }
  },
};

// Mock implementation of stream response
// This is used when the real API is disabled
async function mockStreamResponse(
  message: string,
  options: StreamResponseOptions,
  chatId?: string,
  attachments: Attachment[] = [],
): Promise<void> {
  const { onChunk, onFinish, onError } = options;
  const currentChatId = chatId || 'dev-static-chat-id';

  try {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Generate a simple response
    const mockResponse = `This is a mock response to: "${message}"`;

    // Split the message into words to simulate streaming
    const words = mockResponse.split(' ');
    const responseId = `mock-response-${Date.now()}`;
    let accumulatedResponse = '';

    // Stream each word with a small delay
    for (const word of words) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      accumulatedResponse += (accumulatedResponse ? ' ' : '') + word;

      onChunk({
        id: responseId,
        role: 'assistant',
        content: accumulatedResponse,
        createdAt: new Date(),
      });
    }

    // Send the final message
    const assistantMessage = {
      id: responseId,
      content: accumulatedResponse,
      role: 'assistant' as const,
      createdAt: new Date(),
    };

    onFinish(assistantMessage);
  } catch (error) {
    onError(
      error instanceof Error
        ? error
        : new Error('Unknown error in mock stream response'),
    );
  }
}

// Helper function to format events for display
function formatEventContent(event: any): string {
  const { type, content, data } = event;
  return content;
}
