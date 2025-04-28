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

// Placeholder image URLs for testing - using public placeholder services
const PLACEHOLDER_IMAGE_URLS = [
  'https://placehold.co/600x400/3498db/ffffff?text=AI+Generated+Image',
  'https://placehold.co/600x400/e74c3c/ffffff?text=AI+Generated+Chart',
  'https://placehold.co/600x400/27ae60/ffffff?text=AI+Generated+Visualization',
  'https://placehold.co/600x400/f39c12/ffffff?text=AI+Generated+Graph',
  'https://placehold.co/600x400/9b59b6/ffffff?text=AI+Generated+Diagram',
];

// Get a random placeholder image URL
const getRandomPlaceholderImageUrl = () => {
  const randomIndex = Math.floor(Math.random() * PLACEHOLDER_IMAGE_URLS.length);
  return PLACEHOLDER_IMAGE_URLS[randomIndex];
};

// Constants for consistent document IDs
const DOCUMENT_IDS = {
  TEXT: 'text:article',
  SHEET: 'sheet:table-data',
};

// Document titles for each artifact type
const DOCUMENT_TITLES = {
  TEXT: 'Comprehensive Research Document',
  SHEET: 'Sales Data Analysis',
  IMAGE: 'AI-Generated Visual Output',
};

const SAMPLE_TEXT = `# Sample Text Document

This is a sample text document for testing the text artifact viewer. You can edit this text to test the document editing capabilities.

## Features
- Supports Markdown formatting
- Real-time editing
- Version history

## Next Steps
1. Try editing this document
2. Create a new version
3. Check the version history`;

const SAMPLE_SHEET = `Name,Age,City,Occupation
John Doe,32,New York,Engineer
Jane Smith,28,San Francisco,Designer
Michael Johnson,45,Chicago,Manager
Linda Williams,39,Boston,Doctor
Robert Brown,24,Seattle,Developer`;

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
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Generate a deterministic image URL based on the message content
      // This ensures the same message always gets the same image
      const getImageUrlForMessage = (message: string) => {
        // Simple hash function to get a deterministic index
        const hashStr = message.toLowerCase().trim();
        let hash = 0;
        for (let i = 0; i < hashStr.length; i++) {
          hash = (hash << 5) - hash + hashStr.charCodeAt(i);
        }
        // Use absolute value and mod for consistent index
        const index = Math.abs(hash) % PLACEHOLDER_IMAGE_URLS.length;
        return PLACEHOLDER_IMAGE_URLS[index];
      };

      // Handle sheet artifact request
      if (
        message.toLowerCase().includes('sheet') ||
        message.toLowerCase().includes('table')
      ) {
        // Create sheet attachment with consistent ID format
        const sheetAttachment = {
          type: 'sheet',
          url: DOCUMENT_IDS.SHEET,
          content: SAMPLE_SHEET,
          title: DOCUMENT_TITLES.SHEET,
        };

        const assistantMessage: ChatMessage = {
          id: generateUUID(),
          content: 'Here is your requested data table.',
          role: 'assistant',
          createdAt: new Date(),
          attachments: [sheetAttachment],
        };

        onChunk(assistantMessage);
        onFinish(assistantMessage);
        return;
      }

      // Handle text/document artifact request
      if (
        message.toLowerCase().includes('text') ||
        message.toLowerCase().includes('document')
      ) {
        // Create text attachment with consistent ID format - identical pattern to sheet
        const textAttachment = {
          type: 'text',
          url: DOCUMENT_IDS.TEXT,
          content: SAMPLE_TEXT,
          title: DOCUMENT_TITLES.TEXT,
        };

        const assistantMessage: ChatMessage = {
          id: generateUUID(),
          content: 'Here is your requested text document.',
          role: 'assistant',
          createdAt: new Date(),
          attachments: [textAttachment],
        };

        onChunk(assistantMessage);
        onFinish(assistantMessage);
        return;
      }

      // If the message contains specific keywords, return appropriate artifacts
      if (message.toLowerCase().includes('image')) {
        // Create image attachment with consistent URL
        const imageAttachment = {
          type: 'image',
          url: getImageUrlForMessage(message),
          title: DOCUMENT_TITLES.IMAGE,
        };

        const assistantMessage: ChatMessage = {
          id: generateUUID(),
          content: 'Here is your generated image.',
          role: 'assistant',
          createdAt: new Date(),
          attachments: [imageAttachment],
        };

        onChunk(assistantMessage);
        onFinish(assistantMessage);
        return;
      }

      // Add reasoning to messages when the keyword is present
      if (
        message.toLowerCase().includes('reason') ||
        message.toLowerCase().includes('reasoning')
      ) {
        const reasoningContent = `I need to respond to the user message "${message}". 

Let me analyze this step by step:
1. First, I should understand the user's intent
2. Then, I need to gather relevant information
3. Finally, I will formulate a helpful response

Based on my analysis, I believe the user is looking for information about reasoning, so I should explain how reasoning works in this chatbot.`;

        const assistantMessage: ChatMessage = {
          id: generateUUID(),
          content:
            'I understand you want to see the reasoning component. I have included my reasoning process for this response, which you can see in the reasoning section below.',
          role: 'assistant',
          createdAt: new Date(),
          reasoning: reasoningContent,
        };

        onChunk(assistantMessage);
        onFinish(assistantMessage);
        return;
      }

      // Default response for all other messages
      const assistantMessage: ChatMessage = {
        id: generateUUID(),
        content: 'This is a mock AI response.',
        role: 'assistant',
        createdAt: new Date(),
      };
      onChunk(assistantMessage);
      onFinish(assistantMessage);
    } catch (error) {
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
