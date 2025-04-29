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
const API_CONFIG = {
  // For direct backend access (server-side only)
  BACKEND_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://159.223.110.52:3333',
  // For client-side access (uses Next.js API route proxy)
  BASE_URL: '/api',
  ENDPOINTS: {
    CHAT_STREAM: '/chat/stream',
  }
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
  role: 'user' | 'assistant' | 'system';
  createdAt: Date;
  attachments?: Attachment[];
  reasoning?: string;
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
      throw new Error(`Error sending message: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      
      // Connect to the backend API endpoint for streaming
      const eventSource = new EventSource(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT_STREAM}?message=${encodedMessage}`, {
        withCredentials: false // Add this to handle CORS
      });
      
      let assistantMessage: ChatMessage | null = null;
      let messageCount = 0;
      
      // Handle the different event types from the API
      eventSource.addEventListener('delta', (event) => {
        try {
          const data = JSON.parse(event.data);
          messageCount++;
          console.log('Event data:', data);
          
          // Generate a unique ID for this message
          const messageId = `msg-${messageCount}-${Date.now()}`;
          
          switch (data.type) {
            case 'system_prompt':
              // Display system prompt message
              onChunk({
                id: messageId,
                role: 'assistant' as const,
                content: `system_prompt: ${data.content}`,
                createdAt: new Date(),
              });
              break;
              
            case 'user_message':
              // Display user message echo
              onChunk({
                id: messageId,
                role: 'assistant' as const,
                content: `user_message: ${data.content}`,
                createdAt: new Date(),
              });
              break;
              
            case 'thinking':
              // Display thinking message
              onChunk({
                id: messageId,
                role: 'assistant' as const,
                content: `thinking: ${data.content}`,
                createdAt: new Date(),
              });
              break;
              
            case 'selected_tool':
              // Display selected tools
              onChunk({
                id: messageId,
                role: 'assistant' as const,
                content: `selected_tool:\n\`\`\`json\n${JSON.stringify(data.data, null, 2)}\n\`\`\``,
                createdAt: new Date(),
              });
              break;
              
            case 'tool_called':
              // Display tool called
              onChunk({
                id: messageId,
                role: 'assistant' as const,
                content: `tool_called:\n\`\`\`json\n${JSON.stringify(data.data, null, 2)}\n\`\`\``,
                createdAt: new Date(),
              });
              break;
              
            case 'tool_result':
              // Display tool results
              onChunk({
                id: messageId,
                role: 'assistant' as const,
                content: `tool_result:\n\`\`\`json\n${JSON.stringify(data.data, null, 2)}\n\`\`\``,
                createdAt: new Date(),
              });
              break;
              
            case 'llm_streaming_response':
              // Handle streaming response from LLM
              if (!assistantMessage) {
                // Create a new message for the first chunk
                assistantMessage = {
                  id: `response-${Date.now()}`,
                  role: 'assistant' as const,
                  content: data.content || '',
                  createdAt: new Date(),
                };
                onChunk(assistantMessage);
              } else {
                // Update existing message with new content
                assistantMessage.content += data.content || '';
                onChunk({
                  ...assistantMessage,
                  content: assistantMessage.content,
                });
              }
              break;
              
            default:
              // Handle any other event types we don't explicitly recognize
              onChunk({
                id: messageId,
                role: 'assistant' as const,
                content: `${data.type}:\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``,
                createdAt: new Date(),
              });
          }
        } catch (e) {
          console.error('Error parsing stream chunk:', e, event.data);
        }
      });
      
      // Handle completion of the stream
      eventSource.addEventListener('end', (event) => {
        eventSource.close();
        
        if (assistantMessage) {
          onFinish(assistantMessage);
        } else {
          // If no assistant message was created, create a default one
          const defaultMessage = {
            id: generateId(),
            role: 'assistant' as const,
            content: 'I processed your request but no response was generated.',
            createdAt: new Date(),
          };
          onFinish(defaultMessage);
        }
      });
      
      // Handle errors
      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        eventSource.close();
        
        // Create a helpful error message for the user
        const errorMessage = 
          "Connection to the AI service failed. This could be due to network issues or the server may be temporarily unavailable.";
        
        // Display in the UI as an error message
        if (!assistantMessage) {
          assistantMessage = {
            id: generateId(),
            role: 'assistant' as const,
            content: `⚠️ ${errorMessage}`,
            createdAt: new Date(),
          };
          onChunk(assistantMessage);
          onFinish(assistantMessage);
        }
        
        onError(new Error(errorMessage));
      };
    } catch (error) {
      console.error('Error in API stream:', error);
      onError(
        error instanceof Error
          ? error
          : new Error('Unknown error in stream response'),
      );
    }
  },

  // Get chat history
  getChatHistory: async (limit = 20, offset = 0): Promise<ChatSummary[]> => {
    const response = await fetch(`/api/chats?limit=${limit}&offset=${offset}`);

    if (!response.ok) {
      throw new Error(`Error fetching chat history: ${response.statusText}`);
    }

    return await response.json();
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
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error creating chat: ${response.statusText}`);
    }

    return await response.json();
  },
};
