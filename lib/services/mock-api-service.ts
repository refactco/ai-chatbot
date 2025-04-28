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

// Sample artifact content for testing
const SAMPLE_IMAGE_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAnElEQVR42u3RAQ0AAAgDoM/0qQFrHN4Egmh3pgkCQIAAAQJEgAABAgQIECBAgAABAgQIECBAgAABAgQIECBABAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQAQIECBAgAABAgQIECBAgAABAgQIEA+xMnAAD0KOdQ4AAAAASUVORK5CYII=';

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
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate a mock response based on the input
      let response = '';
      let reasoning = '';

      // Handle special test phrases for artifacts
      const isTestImageRequest = message
        .toLowerCase()
        .includes('test image artifact');
      const isTestTextRequest = message
        .toLowerCase()
        .includes('test text artifact');
      const isTestSheetRequest = message
        .toLowerCase()
        .includes('test sheet artifact');

      // New direct message type triggers - check for exact commands
      const isImageMessage = message.toLowerCase() === '!image';
      const isSheetMessage = message.toLowerCase() === '!sheet';
      const isArticleMessage = message.toLowerCase() === '!article';
      const isReasoningMessage = message.toLowerCase() === '!reasoning';

      // Keep the regular text analysis for non-command messages
      const hasImageWord =
        message.toLowerCase().includes('image') &&
        !isImageMessage &&
        !isTestImageRequest;
      const hasDocumentWord =
        message.toLowerCase().includes('document') &&
        !isArticleMessage &&
        !isTestTextRequest;
      const hasWeatherWord = message.toLowerCase().includes('weather');
      const hasGreeting =
        message.toLowerCase().includes('hello') ||
        message.toLowerCase().includes('hi');

      if (isImageMessage) {
        response = "Here's an image as requested:";
        reasoning =
          'User requested an image message. Displaying an image in the chat.';
      } else if (isSheetMessage) {
        response = "Here's a data table as requested:";
        reasoning =
          'User requested a sheet/table message. Displaying tabular data in the chat.';
      } else if (isArticleMessage) {
        response = "Here's the article text as requested:";
        reasoning =
          'User requested an article/text message. Displaying formatted text in the chat.';
      } else if (isReasoningMessage) {
        response = "Here's my reasoning process:";
        reasoning =
          'User requested to see a reasoning message directly. Displaying reasoning in the chat.';
      } else if (isTestImageRequest) {
        response = "I'll create a test image artifact for you to view.";
        reasoning =
          "User requested to test the image artifact viewer. I'll create a sample image artifact.";
      } else if (isTestTextRequest) {
        response = "I'll create a test text document for you to edit.";
        reasoning =
          "User requested to test the text artifact viewer. I'll create a sample text document.";
      } else if (isTestSheetRequest) {
        response = "I'll create a test spreadsheet for you to view and edit.";
        reasoning =
          "User requested to test the sheet artifact viewer. I'll create a sample spreadsheet.";
      } else if (hasGreeting) {
        response =
          "Hello there! I'm your AI assistant. How can I help you today?";
        reasoning =
          "User sent a greeting, so I'll respond with a friendly welcome message and offer assistance.";
      } else if (hasWeatherWord) {
        response =
          "I don't have real-time weather data in this mock implementation, but I can tell you that it's a lovely day in the virtual world!";
        reasoning =
          "User asked about weather data. In a real implementation, I would access a weather API. For now, I'll explain this limitation.";
      } else if (hasImageWord) {
        response =
          "I see you're interested in images. In the full implementation, I'll be able to process and generate images based on your requests.";
        reasoning =
          "User mentioned 'image', indicating interest in image processing or generation. I'll explain the capabilities that would be available in a full implementation.";
      } else if (hasDocumentWord) {
        response =
          "I see you're working with documents. I'll be able to analyze and work with your documents in the full implementation.";
        reasoning =
          "User mentioned 'document', suggesting they want to work with document data. I'll inform them about document analysis capabilities in the full version.";
      } else {
        response = `Thank you for your message: "${message}". This is a mock response from the AI agent. In the real implementation, you'll get responses based on your backend's AI model.`;
        reasoning = `Received a general message: "${message}". Since this is a mock implementation, I'll provide a generic response explaining that this is a placeholder.`;
      }

      // First, create and send a reasoning message
      const reasoningMessage: ChatMessage = {
        id: generateUUID(),
        content: '',
        role: 'system',
        createdAt: new Date(),
      };

      // Stream the reasoning first
      const reasoningChunks = reasoning.split(/(?<=[.!?])\s+/);
      let accumulatedReasoning = '';

      for (let i = 0; i < reasoningChunks.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        accumulatedReasoning = `${accumulatedReasoning}${reasoningChunks[i]} `;
        reasoningMessage.content = accumulatedReasoning;
        onChunk(reasoningMessage);
      }

      // Create the assistant message
      const assistantMessage: ChatMessage = {
        id: generateUUID(),
        content: '',
        role: 'assistant',
        createdAt: new Date(),
      };

      // Short pause between reasoning and response
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Now stream the assistant response
      const sentences = response.split(/(?<=[.!?])\s+/);
      let accumulatedResponse = '';

      for (let i = 0; i < sentences.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        accumulatedResponse = `${accumulatedResponse}${sentences[i]} `;
        assistantMessage.content = accumulatedResponse;
        onChunk(assistantMessage);
      }

      // Save both messages to chat history
      if (chatHistory[currentChatId]) {
        chatHistory[currentChatId].messages.push(reasoningMessage);
        chatHistory[currentChatId].messages.push(assistantMessage);
      }

      // Add artifacts if requested
      if (isTestImageRequest || isTestTextRequest || isTestSheetRequest) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const artifactId = generateUUID();

        if (isTestImageRequest) {
          // Send an image artifact
          onChunk({
            id: generateUUID(),
            role: 'assistant',
            content: '',
            createdAt: new Date(),
            reasoning: 'Generating image artifact',
            attachments: [
              {
                type: 'image-delta',
                url: `artifact:${artifactId}`,
                content: SAMPLE_IMAGE_BASE64,
              },
            ],
          });
        } else if (isTestTextRequest) {
          // Send a text artifact
          onChunk({
            id: generateUUID(),
            role: 'assistant',
            content: '',
            createdAt: new Date(),
            reasoning: 'Generating text artifact',
            attachments: [
              {
                type: 'text-delta',
                url: `artifact:${artifactId}`,
                content: SAMPLE_TEXT,
              },
            ],
          });
        } else if (isTestSheetRequest) {
          // Send a sheet artifact
          onChunk({
            id: generateUUID(),
            role: 'assistant',
            content: '',
            createdAt: new Date(),
            reasoning: 'Generating sheet artifact',
            attachments: [
              {
                type: 'sheet-delta',
                url: `artifact:${artifactId}`,
                content: SAMPLE_SHEET,
              },
            ],
          });
        }
      }

      // Add direct message content types
      if (
        isImageMessage ||
        isSheetMessage ||
        isArticleMessage ||
        isReasoningMessage
      ) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (isImageMessage) {
          // Add image to the assistant message
          assistantMessage.attachments = [
            {
              type: 'image',
              url: `data:image/png;base64,${SAMPLE_IMAGE_BASE64}`,
              content: SAMPLE_IMAGE_BASE64,
            },
          ];
        } else if (isSheetMessage) {
          // Add sheet/table data to the assistant message
          assistantMessage.attachments = [
            {
              type: 'sheet',
              url: 'sheet:table-data',
              content: SAMPLE_SHEET,
            },
          ];
        } else if (isArticleMessage) {
          // Add article/text to the assistant message
          assistantMessage.attachments = [
            {
              type: 'text',
              url: 'text:article',
              content: SAMPLE_TEXT,
            },
          ];
        } else if (isReasoningMessage) {
          // For reasoning, we'll directly add it to the assistant message
          // and mark it specially for the UI to render it differently
          assistantMessage.reasoning =
            "This is a detailed reasoning process that explains my thought process step by step. I'm analyzing the request, considering relevant information, and providing a structured explanation of how I arrived at my response.";
        }
      }

      // Signal completion with the assistant message
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
