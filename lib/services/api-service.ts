/**
 * API Service (Local Storage Version)
 *
 * This file provides a service layer using browser localStorage
 * for data persistence without any external API calls.
 *
 * NOTE: Dates are stored as ISO strings in localStorage. When retrieving,
 * they are plain strings. If you need Date methods, convert them using new Date().
 */

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
};
