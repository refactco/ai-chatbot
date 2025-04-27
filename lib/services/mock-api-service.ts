/**
 * Mock API Service for AI Agent Backend
 *
 * This service simulates the backend API endpoints for the AI agent.
 * It provides the following endpoints:
 * 1. sendMessage - For sending user messages to the AI
 * 2. streamResponse - For streaming AI responses back
 * 3. getChatHistory - For retrieving chat history
 *
 * This will be replaced with actual API calls to your backend once it's ready.
 */

import { generateUUID } from '@/lib/utils';
import type { Attachment } from '@/lib/ai/types';

// Type definitions
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: Date;
  attachments?: Attachment[];
}

export interface ChatSummary {
  id: string;
  title: string;
  lastMessagePreview: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StreamResponseOptions {
  onChunk: (chunk: string) => void;
  onFinish: (message: ChatMessage) => void;
  onError: (error: Error) => void;
}

// In-memory storage for chat history
const chatHistory: Record<
  string,
  {
    chat: ChatSummary;
    messages: ChatMessage[];
  }
> = {};

// The mock API service
export const mockApiService = {
  /**
   * Send a message to the AI agent
   */
  sendMessage: async (
    message: string,
    attachments: Attachment[] = [],
    chatId?: string,
  ): Promise<ChatMessage> => {
    // Log for debugging
    console.log('Sending message to AI:', message, attachments);

    const currentChatId = chatId || 'dev-static-chat-id';

    // Create a user message record
    const userMessage = {
      id: generateUUID(),
      content: message,
      role: 'user' as const,
      createdAt: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    // Save to chat history
    if (!chatHistory[currentChatId]) {
      // Create new chat if it doesn't exist
      chatHistory[currentChatId] = {
        chat: {
          id: currentChatId,
          title:
            message.length > 30 ? `${message.substring(0, 30)}...` : message,
          lastMessagePreview: message,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        messages: [userMessage],
      };
    } else {
      // Add message to existing chat
      chatHistory[currentChatId].messages.push(userMessage);
      chatHistory[currentChatId].chat.lastMessagePreview = message;
      chatHistory[currentChatId].chat.updatedAt = new Date();
    }

    return userMessage;
  },

  /**
   * Stream an AI response based on a user message
   * This simulates the streaming response from the backend
   */
  streamResponse: async (
    message: string,
    options: StreamResponseOptions,
    chatId?: string,
    attachments: Attachment[] = [],
  ): Promise<void> => {
    const { onChunk, onFinish, onError } = options;
    const currentChatId = chatId || 'dev-static-chat-id';

    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate a mock response based on the input
      let response = '';

      if (
        message.toLowerCase().includes('hello') ||
        message.toLowerCase().includes('hi')
      ) {
        response =
          "Hello there! I'm your AI assistant. How can I help you today?";
      } else if (message.toLowerCase().includes('weather')) {
        response =
          "I don't have real-time weather data in this mock implementation, but I can tell you that it's a lovely day in the virtual world!";
      } else if (message.toLowerCase().includes('image')) {
        response =
          "I see you're interested in images. In the full implementation, I'll be able to process and generate images based on your requests.";
      } else if (message.toLowerCase().includes('document')) {
        response =
          "I see you're working with documents. I'll be able to analyze and work with your documents in the full implementation.";
      } else {
        response = `Thank you for your message: "${message}". This is a mock response from the AI agent. In the real implementation, you'll get responses based on your backend's AI model.`;
      }

      // Stream the response word by word to simulate streaming
      const words = response.split(' ');
      for (const word of words) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        onChunk(`${word} `);
      }

      // Create the final message
      const assistantMessage: ChatMessage = {
        id: generateUUID(),
        content: response,
        role: 'assistant',
        createdAt: new Date(),
      };

      // Save assistant message to chat history
      if (chatHistory[currentChatId]) {
        chatHistory[currentChatId].messages.push(assistantMessage);
      }

      // Signal completion
      onFinish(assistantMessage);
    } catch (error) {
      console.error('Error in mock API stream:', error);
      onError(
        error instanceof Error
          ? error
          : new Error('Unknown error in stream response'),
      );
    }
  },

  /**
   * Get chat history
   * This simulates fetching chat history from the backend
   */
  getChatHistory: async (limit = 20, offset = 0): Promise<ChatSummary[]> => {
    console.log('Fetching chat history with limit:', limit, 'offset:', offset);

    // Get all chats, sort by updatedAt (newest first), and apply pagination
    return Object.values(chatHistory)
      .map((entry) => entry.chat)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(offset, offset + limit);
  },

  /**
   * Get chat by ID with its messages
   */
  getChatById: async (
    chatId: string,
  ): Promise<{ chat: ChatSummary; messages: ChatMessage[] } | null> => {
    console.log('Fetching chat by ID:', chatId);

    if (!chatHistory[chatId]) {
      return null;
    }

    return chatHistory[chatId];
  },

  /**
   * Create a new empty chat
   */
  createNewChat: async (): Promise<ChatSummary> => {
    const chatId = generateUUID();
    const newChat: ChatSummary = {
      id: chatId,
      title: 'New Conversation',
      lastMessagePreview: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    chatHistory[chatId] = {
      chat: newChat,
      messages: [],
    };

    return newChat;
  },
};
