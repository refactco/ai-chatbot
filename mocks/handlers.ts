/**
 * Mock API Handlers
 *
 * This file defines the mock API handlers for simulating backend functionality.
 * It provides request handlers for the Mock Service Worker (MSW) library.
 *
 * Features:
 * - Mock chat messaging system (send, receive, stream)
 * - Mock conversation history management
 * - Mock document management for artifacts
 * - In-memory data storage for testing
 *
 * These handlers simulate the backend API functionality during development
 * and testing, allowing the frontend to work without a real backend connection.
 */

import type { Attachment } from '@/lib/api/types';
import { generateUUID } from '@/lib/utils';
import { http, HttpResponse } from 'msw';
import { DOCUMENT_TITLES, SAMPLE_SHEET, SAMPLE_TEXT } from './data';

/**
 * Interface for chat message request payload
 */
interface ChatMessageRequest {
  message: string;
  attachments?: Attachment[];
  chatId?: string;
}

/**
 * Interface for chat metadata
 */
interface Chat {
  id: string;
  title: string;
  lastMessagePreview: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for individual chat messages
 */
interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: Date;
  attachments?: Attachment[];
  reasoning?: string;
}

/**
 * Interface combining chat metadata with its messages
 */
interface ChatHistoryEntry {
  chat: Chat;
  messages: ChatMessage[];
}

/**
 * In-memory storage for chat history
 * Maps chat IDs to their full data including messages
 */
const chatHistory: Record<string, ChatHistoryEntry> = {};

/**
 * Collection of mock API request handlers for MSW
 */
export const handlers = [
  /**
   * Handler for sending user messages
   * Creates a user message and stores it in chat history
   */
  http.post('/api/chat/message', async ({ request }) => {
    const {
      message,
      attachments = [],
      chatId = 'dev-static-chat-id',
    } = (await request.json()) as ChatMessageRequest;

    // Create a user message
    const userMessage: ChatMessage = {
      id: generateUUID(),
      content: message,
      role: 'user',
      createdAt: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    // Save to chat history
    if (!chatHistory[chatId]) {
      // Create new chat if it doesn't exist
      chatHistory[chatId] = {
        chat: {
          id: chatId,
          title:
            message.length > 30 ? `${message.substring(0, 30)}...` : message,
          lastMessagePreview: message,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        messages: [userMessage],
      };
    } else {
      // Add to existing chat
      chatHistory[chatId].messages.push(userMessage);
      chatHistory[chatId].chat.lastMessagePreview = message;
      chatHistory[chatId].chat.updatedAt = new Date();
    }

    return HttpResponse.json(userMessage);
  }),

  /**
   * Handler for streaming AI responses
   * Simulates a streaming response with a simple message
   * NOTE: Disabled to allow real API calls to go through
   */
  /*
  http.post('/api/chat/stream', async ({ request }) => {
    // Always return a single, generic assistant message
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Add a small delay to simulate network latency
          await new Promise((resolve) => setTimeout(resolve, 300));
          const assistantMessage = {
            id: generateUUID(),
            content: 'This is a mock AI response.',
            role: 'assistant',
            createdAt: new Date(),
          };

          // Send the assistant message
          controller.enqueue(
            encoder.encode(
              `${JSON.stringify({
                type: 'assistant',
                message: assistantMessage,
              })}\n`,
            ),
          );

          // Send the finish message
          controller.enqueue(
            encoder.encode(
              `${JSON.stringify({
                type: 'finish',
                message: assistantMessage,
              })}\n`,
            ),
          );
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    // Return streaming response with appropriate headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }),
  */

  /**
   * Handler for fetching chat history
   * Returns a list of all chats, sorted by recent activity
   */
  http.get('/api/chats', () => {
    // Get all chats, sort by updatedAt (newest first)
    const chats = Object.values(chatHistory)
      .map((entry) => entry.chat)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return HttpResponse.json(chats);
  }),

  /**
   * Handler for fetching a specific chat with messages
   * Returns complete chat data including message history
   */
  http.get(
    '/api/chat/:chatId',
    ({ params }: { params: { chatId: string } }) => {
      const { chatId } = params;

      // Return 404 if chat doesn't exist
      if (!chatHistory[chatId]) {
        return new HttpResponse(null, { status: 404 });
      }

      return HttpResponse.json(chatHistory[chatId]);
    },
  ),

  /**
   * Handler for creating a new chat
   * Returns a new empty chat with a generated ID
   */
  http.post('/api/chat', () => {
    const chatId = generateUUID();
    const newChat = {
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

    return HttpResponse.json(newChat);
  }),

  /**
   * Handler for retrieving document versions
   * Returns mock document data based on document ID
   */
  http.get('/api/document', ({ request }) => {
    const url = new URL(request.url);
    const documentId = url.searchParams.get('id');

    // Determine document kind and title based on ID
    let kind = 'text';
    let title = DOCUMENT_TITLES.TEXT;

    // Infer document type from ID prefix
    if (documentId?.startsWith('text:')) {
      kind = 'text';
      title = DOCUMENT_TITLES.TEXT;
    } else if (documentId?.startsWith('sheet:')) {
      kind = 'sheet';
      title = DOCUMENT_TITLES.SHEET;
    } else if (
      documentId?.includes('image') ||
      documentId?.includes('placehold.co')
    ) {
      kind = 'image';
      title = DOCUMENT_TITLES.IMAGE;
    }

    // Create a sample document with the appropriate content
    const content =
      kind === 'text' ? SAMPLE_TEXT : kind === 'sheet' ? SAMPLE_SHEET : '';

    const document = {
      id: documentId || '',
      title,
      kind,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'mock-user',
    };

    return HttpResponse.json([document]);
  }),

  /**
   * Handler for creating new document versions
   * Accepts updates to documents and returns the updated version
   */
  http.post('/api/document', async ({ request }) => {
    const url = new URL(request.url);
    const documentId = url.searchParams.get('id');
    const reqBody = (await request.json()) as {
      title?: string;
      kind?: string;
      content?: string;
    };

    // Return the updated document
    const document = {
      id: documentId || '',
      title: reqBody.title || 'Untitled',
      kind: reqBody.kind || 'text',
      content: reqBody.content || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'mock-user',
    };

    return HttpResponse.json(document);
  }),
];
