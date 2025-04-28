import { http, HttpResponse } from 'msw';
import { generateUUID } from '@/lib/utils';
import type { Attachment } from '@/lib/ai/types';
import { DOCUMENT_TITLES, SAMPLE_TEXT, SAMPLE_SHEET } from './data';

interface ChatMessageRequest {
  message: string;
  attachments?: Attachment[];
  chatId?: string;
}

interface Chat {
  id: string;
  title: string;
  lastMessagePreview: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: Date;
  attachments?: Attachment[];
  reasoning?: string;
}

interface ChatHistoryEntry {
  chat: Chat;
  messages: ChatMessage[];
}

const chatHistory: Record<string, ChatHistoryEntry> = {};

export const handlers = [
  // Handler for sending user messages
  http.post('/api/chat/message', async ({ request }) => {
    const {
      message,
      attachments = [],
      chatId = 'dev-static-chat-id',
    } = (await request.json()) as ChatMessageRequest;

    console.log('Sending message to AI:', message, attachments);

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
      chatHistory[chatId].messages.push(userMessage);
      chatHistory[chatId].chat.lastMessagePreview = message;
      chatHistory[chatId].chat.updatedAt = new Date();
    }

    return HttpResponse.json(userMessage);
  }),

  // Handler for streaming AI responses
  http.post('/api/chat/stream', async ({ request }) => {
    // Always return a single, generic assistant message
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 300));
          const assistantMessage = {
            id: generateUUID(),
            content: 'This is a mock AI response.',
            role: 'assistant',
            createdAt: new Date(),
          };
          controller.enqueue(
            encoder.encode(
              `${JSON.stringify({
                type: 'assistant',
                message: assistantMessage,
              })}\n`,
            ),
          );
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
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }),

  // Handler for fetching chat history
  http.get('/api/chats', () => {
    // Get all chats, sort by updatedAt (newest first)
    const chats = Object.values(chatHistory)
      .map((entry) => entry.chat)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return HttpResponse.json(chats);
  }),

  // Handler for fetching a specific chat with messages
  http.get(
    '/api/chat/:chatId',
    ({ params }: { params: { chatId: string } }) => {
      const { chatId } = params;

      if (!chatHistory[chatId]) {
        return new HttpResponse(null, { status: 404 });
      }

      return HttpResponse.json(chatHistory[chatId]);
    },
  ),

  // Handler for creating a new chat
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

  // Handler for retrieving document versions
  http.get('/api/document', ({ request }) => {
    const url = new URL(request.url);
    const documentId = url.searchParams.get('id');

    // Determine document kind and title based on ID
    let kind = 'text';
    let title = DOCUMENT_TITLES.TEXT;

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

  // Handler for creating new document versions
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
