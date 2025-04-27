/**
 * API Service
 *
 * This file provides a service layer for API interactions.
 * It currently uses the mock API but is designed to be easily
 * replaceable with real API calls in the future.
 */

import { authApi, chatApi } from '../mockApi';
import type {
  User,
  Chat,
  Message,
  CreateChatRequest,
  CreateMessageRequest,
  AuthResponse,
  ChatCompletionRequest,
} from '../mockApi';

// Authentication Services
export const authService = {
  // Register a new user
  register: async (name: string, email: string, password: string) => {
    const response = await authApi.register({ name, email, password });

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
  },

  // Login a user
  login: async (email: string, password: string) => {
    const response = await authApi.login(email, password);

    if (response.error) {
      throw new Error(response.error);
    }

    // Store token in localStorage for session management
    localStorage.setItem('auth_token', response.data.token);

    return response.data;
  },

  // Get the current user
  getCurrentUser: async () => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      return null;
    }

    try {
      const response = await authApi.getUserByToken(token);

      if (response.error) {
        localStorage.removeItem('auth_token');
        return null;
      }

      return response.data;
    } catch (error) {
      localStorage.removeItem('auth_token');
      return null;
    }
  },

  // Logout the current user
  logout: async () => {
    await authApi.logout();
    localStorage.removeItem('auth_token');
  },

  // Update user profile
  updateProfile: async (userId: string, userData: Partial<User>) => {
    const response = await authApi.updateProfile(userId, userData);

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
  },
};

// Chat Services
export const chatService = {
  // Get all chats for a user
  getUserChats: async (userId: string) => {
    const response = await chatApi.getUserChats(userId);

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data.items;
  },

  // Get a single chat by ID
  getChatById: async (chatId: string) => {
    const response = await chatApi.getChatById(chatId);

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
  },

  // Create a new chat
  createChat: async (userId: string, title: string) => {
    const response = await chatApi.createChat({ userId, title });

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
  },

  // Update a chat
  updateChat: async (chatId: string, updates: Partial<Chat>) => {
    const response = await chatApi.updateChat(chatId, updates);

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
  },

  // Delete a chat
  deleteChat: async (chatId: string) => {
    const response = await chatApi.deleteChat(chatId);

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
  },

  // Get messages for a chat
  getChatMessages: async (chatId: string) => {
    const response = await chatApi.getChatMessages(chatId);

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data.items;
  },

  // Create a new message
  createMessage: async (
    chatId: string,
    content: string,
    role: 'user' | 'assistant' | 'system',
  ) => {
    const response = await chatApi.createMessage({
      chatId,
      content,
      role,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
  },

  // Create a chat completion (AI response)
  createChatCompletion: async (chatId: string, message: string) => {
    const response = await chatApi.createChatCompletion({
      chatId,
      message,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
  },

  // Stream a chat completion (AI response)
  streamChatCompletion: async (
    chatId: string,
    message: string,
    onChunk: (chunk: string) => void,
  ) => {
    const response = await chatApi.streamChatCompletion(
      { chatId, message },
      onChunk,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
  },
};

// Export a single API service object
export const apiService = {
  auth: authService,
  chat: chatService,
};
