/**
 * Mock Chat API
 *
 * This file provides mock chat API endpoints
 * simulating backend chat functionality.
 */

import type {
  Chat,
  Message,
  CreateChatRequest,
  CreateMessageRequest,
  ChatDetailResponse,
  ChatCompletionRequest,
  ChatCompletionResponse,
  Suggestion,
} from './models';
import { mockChats, mockMessages } from './data';
import type { MockResponse, PaginatedResponse } from './utils';
import {
  mockSuccess,
  mockError,
  mockStorage,
  generateId,
  paginateResults,
  simulateDelay,
} from './utils';

// Get all chats for a user
export const getUserChats = async (
  userId: string,
  page = 1,
  pageSize = 20,
): Promise<MockResponse<PaginatedResponse<Chat>>> => {
  // Get chats from storage or initial data
  const chats = mockStorage.getItem<Chat[]>('chats') || mockChats;

  // Filter by user ID
  const userChats = chats.filter((chat) => chat.userId === userId);

  // Sort by updated date (newest first)
  const sortedChats = [...userChats].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  // Paginate results
  const paginatedChats = paginateResults(sortedChats, page, pageSize);

  return mockSuccess(paginatedChats);
};

// Get a single chat by ID
export const getChatById = async (
  chatId: string,
): Promise<MockResponse<ChatDetailResponse>> => {
  // Get chats from storage or initial data
  const chats = mockStorage.getItem<Chat[]>('chats') || mockChats;

  // Find the chat
  const chat = chats.find((c) => c.id === chatId);

  if (!chat) {
    return mockError('Chat not found', 404);
  }

  // Get messages for this chat
  const messages = mockStorage.getItem<Message[]>('messages') || mockMessages;
  const chatMessages = messages.filter((message) => message.chatId === chatId);

  // Sort messages by created date (oldest first)
  const sortedMessages = [...chatMessages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return mockSuccess({
    chat,
    messages: sortedMessages,
  });
};

// Create a new chat
export const createChat = async (
  chatData: CreateChatRequest,
): Promise<MockResponse<Chat>> => {
  // Validate required fields
  if (!chatData.userId || !chatData.title) {
    return mockError('User ID and title are required', 400);
  }

  // Create new chat
  const newChat: Chat = {
    id: generateId(),
    userId: chatData.userId,
    title: chatData.title,
    createdAt: new Date(),
    updatedAt: new Date(),
    path: `/chat/${generateId()}`,
    isShared: false,
  };

  // Store chat in mock storage
  const chats = mockStorage.getItem<Chat[]>('chats') || mockChats;
  mockStorage.setItem('chats', [...chats, newChat]);

  return mockSuccess(newChat);
};

// Update a chat
export const updateChat = async (
  chatId: string,
  updates: Partial<Chat>,
): Promise<MockResponse<Chat>> => {
  // Get chats from storage or initial data
  const chats = mockStorage.getItem<Chat[]>('chats') || mockChats;

  // Find the chat
  const chatIndex = chats.findIndex((c) => c.id === chatId);

  if (chatIndex === -1) {
    return mockError('Chat not found', 404);
  }

  // Update the chat
  const updatedChat: Chat = {
    ...chats[chatIndex],
    ...updates,
    updatedAt: new Date(),
  };

  // Store updated chat
  const updatedChats = [
    ...chats.slice(0, chatIndex),
    updatedChat,
    ...chats.slice(chatIndex + 1),
  ];
  mockStorage.setItem('chats', updatedChats);

  return mockSuccess(updatedChat);
};

// Delete a chat
export const deleteChat = async (
  chatId: string,
): Promise<MockResponse<{ success: boolean }>> => {
  // Get chats from storage or initial data
  const chats = mockStorage.getItem<Chat[]>('chats') || mockChats;

  // Find the chat
  const chatIndex = chats.findIndex((c) => c.id === chatId);

  if (chatIndex === -1) {
    return mockError('Chat not found', 404);
  }

  // Remove the chat
  const updatedChats = [
    ...chats.slice(0, chatIndex),
    ...chats.slice(chatIndex + 1),
  ];
  mockStorage.setItem('chats', updatedChats);

  // Also remove all messages for this chat
  const messages = mockStorage.getItem<Message[]>('messages') || mockMessages;
  const updatedMessages = messages.filter(
    (message) => message.chatId !== chatId,
  );
  mockStorage.setItem('messages', updatedMessages);

  return mockSuccess({ success: true });
};

// Get messages for a chat
export const getChatMessages = async (
  chatId: string,
  page = 1,
  pageSize = 50,
): Promise<MockResponse<PaginatedResponse<Message>>> => {
  // Get messages from storage or initial data
  const messages = mockStorage.getItem<Message[]>('messages') || mockMessages;

  // Filter by chat ID
  const chatMessages = messages.filter((message) => message.chatId === chatId);

  // Sort by created date (oldest first for chat messages)
  const sortedMessages = [...chatMessages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  // Paginate results
  const paginatedMessages = paginateResults(sortedMessages, page, pageSize);

  return mockSuccess(paginatedMessages);
};

// Create a new message
export const createMessage = async (
  messageData: CreateMessageRequest,
): Promise<MockResponse<Message>> => {
  // Validate required fields
  if (!messageData.chatId || !messageData.content || !messageData.role) {
    return mockError('Chat ID, content, and role are required', 400);
  }

  // Create new message
  const newMessage: Message = {
    id: generateId(),
    chatId: messageData.chatId,
    content: messageData.content,
    role: messageData.role,
    createdAt: new Date(),
    updatedAt: new Date(),
    attachments: messageData.attachments
      ? messageData.attachments.map((attachment) => ({
          id: generateId(),
          messageId: '', // Will be updated after creation
          type: attachment.type,
          url: attachment.url,
          name: attachment.name,
          size: attachment.size,
          createdAt: new Date(),
        }))
      : [],
  };

  // Update attachment message IDs
  if (newMessage.attachments && newMessage.attachments.length > 0) {
    newMessage.attachments = newMessage.attachments.map((attachment) => ({
      ...attachment,
      messageId: newMessage.id,
    }));
  }

  // Store message in mock storage
  const messages = mockStorage.getItem<Message[]>('messages') || mockMessages;
  mockStorage.setItem('messages', [...messages, newMessage]);

  // Update chat's updatedAt timestamp
  const chats = mockStorage.getItem<Chat[]>('chats') || mockChats;
  const chatIndex = chats.findIndex((c) => c.id === messageData.chatId);

  if (chatIndex !== -1) {
    const updatedChat: Chat = {
      ...chats[chatIndex],
      updatedAt: new Date(),
    };

    const updatedChats = [
      ...chats.slice(0, chatIndex),
      updatedChat,
      ...chats.slice(chatIndex + 1),
    ];
    mockStorage.setItem('chats', updatedChats);
  }

  return mockSuccess(newMessage);
};

// AI chat completion (simulated)
export const createChatCompletion = async (
  request: ChatCompletionRequest,
): Promise<MockResponse<ChatCompletionResponse>> => {
  // Validate required fields
  if (!request.chatId || !request.message) {
    return mockError('Chat ID and message are required', 400);
  }

  // First create a user message
  const userMessage: CreateMessageRequest = {
    chatId: request.chatId,
    content: request.message,
    role: 'user',
  };

  const userMessageResponse = await createMessage(userMessage);

  if (userMessageResponse.error) {
    return mockError(userMessageResponse.error, userMessageResponse.status);
  }

  // Now create a mock AI response
  const aiResponses = [
    "I'm a simulated AI response. In a real application, this would come from an actual AI model.",
    'This is a mock AI chatbot. The actual response would be generated by a language model like GPT or Claude.',
    "I'm generating this response locally without making an API call to an AI service.",
    "In production, this would connect to an AI provider's API. For now, I'm just a pre-written response.",
    'This is a placeholder response. The real application would use an AI model to generate more meaningful content.',
  ];

  // Choose a random response
  const randomResponse =
    aiResponses[Math.floor(Math.random() * aiResponses.length)];

  // Add some context based on the user's message
  let contextualResponse = randomResponse;

  if (request.message.toLowerCase().includes('help')) {
    contextualResponse = `I see you're asking for help. ${randomResponse}`;
  } else if (request.message.toLowerCase().includes('example')) {
    contextualResponse = `You're looking for an example. ${randomResponse}`;
  } else if (request.message.toLowerCase().includes('code')) {
    contextualResponse = `You mentioned code. ${randomResponse}\n\nHere's a simple example:\n\`\`\`javascript\nconsole.log('Hello, world!');\n\`\`\``;
  }

  // Simulate thinking delay
  await simulateDelay(1500);

  // Create the assistant message
  const assistantMessage: CreateMessageRequest = {
    chatId: request.chatId,
    content: contextualResponse,
    role: 'assistant',
  };

  const assistantMessageResponse = await createMessage(assistantMessage);

  if (assistantMessageResponse.error) {
    return mockError(
      assistantMessageResponse.error,
      assistantMessageResponse.status,
    );
  }

  return mockSuccess({
    message: assistantMessageResponse.data,
    isStreaming: false,
  });
};

// Stream chat completion (simulated)
export const streamChatCompletion = async (
  request: ChatCompletionRequest,
  onChunk: (chunk: string) => void,
): Promise<MockResponse<ChatCompletionResponse>> => {
  // Validate required fields
  if (!request.chatId || !request.message) {
    return mockError('Chat ID and message are required', 400);
  }

  // First create a user message
  const userMessage: CreateMessageRequest = {
    chatId: request.chatId,
    content: request.message,
    role: 'user',
  };

  const userMessageResponse = await createMessage(userMessage);

  if (userMessageResponse.error) {
    return mockError(userMessageResponse.error, userMessageResponse.status);
  }

  // Generate a mock AI response to stream
  let response = '';

  if (request.message.toLowerCase().includes('help')) {
    response =
      "I see you're asking for help. I'm a simulated AI response streaming tokens to you one by one. In a real application, this would come from an actual AI model that generates content incrementally.";
  } else if (request.message.toLowerCase().includes('example')) {
    response =
      "You're looking for an example. This is a demonstration of streaming responses from a mock AI chatbot. The actual response would come from a language model like GPT or Claude with each token delivered as it's generated.";
  } else if (request.message.toLowerCase().includes('code')) {
    response =
      "You mentioned code. Here's a simple example:\n\n```javascript\n// A simple greeting function\nfunction sayHello(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(sayHello('world'));\n```\n\nIn a real app, this would be generated by an AI.";
  } else {
    response =
      "I'm a simulated AI response. This demonstrates how streaming works in a chat interface. Each character is sent individually to create a typing effect. In a real application, an AI model would generate this content progressively.";
  }

  // Create the message object first
  const assistantMessage: Message = {
    id: generateId(),
    chatId: request.chatId,
    content: '', // Will be filled as we stream
    role: 'assistant',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Store the initial empty message
  const messages = mockStorage.getItem<Message[]>('messages') || mockMessages;
  mockStorage.setItem('messages', [...messages, assistantMessage]);

  // Simulate streaming by sending one token at a time
  const tokens = response.split(' ');
  let currentContent = '';

  for (const token of tokens) {
    currentContent += `${token} `;

    // Send the chunk to the callback
    onChunk(`${token} `);

    // Update the message in storage
    const updatedAssistantMessage = {
      ...assistantMessage,
      content: currentContent,
      updatedAt: new Date(),
    };

    // Update the message in storage
    const updatedMessages =
      mockStorage.getItem<Message[]>('messages') || mockMessages;
    const messageIndex = updatedMessages.findIndex(
      (m) => m.id === assistantMessage.id,
    );

    if (messageIndex !== -1) {
      const newMessages = [
        ...updatedMessages.slice(0, messageIndex),
        updatedAssistantMessage,
        ...updatedMessages.slice(messageIndex + 1),
      ];
      mockStorage.setItem('messages', newMessages);
    }

    // Simulate typing delay
    await simulateDelay(50 + Math.random() * 150);
  }

  // Update the chat's updatedAt timestamp
  const chats = mockStorage.getItem<Chat[]>('chats') || mockChats;
  const chatIndex = chats.findIndex((c) => c.id === request.chatId);

  if (chatIndex !== -1) {
    const updatedChat: Chat = {
      ...chats[chatIndex],
      updatedAt: new Date(),
    };

    const updatedChats = [
      ...chats.slice(0, chatIndex),
      updatedChat,
      ...chats.slice(chatIndex + 1),
    ];
    mockStorage.setItem('chats', updatedChats);
  }

  // Get the final message
  const finalMessages =
    mockStorage.getItem<Message[]>('messages') || mockMessages;
  const finalMessage = finalMessages.find((m) => m.id === assistantMessage.id);

  if (!finalMessage) {
    return mockError('Failed to retrieve final message', 500);
  }

  return mockSuccess({
    message: finalMessage,
    isStreaming: false, // Now done streaming
  });
};

// Document handling (for the suggestion tool)
interface Document {
  id: string;
  title: string;
  content: string;
  kind: string;
  createdAt: Date;
}

// Mock documents storage
const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    title: 'Sample Document',
    content:
      'This is a sample document that can be used for testing suggestions. The writing could be improved in various ways.',
    kind: 'text',
    createdAt: new Date(),
  },
];

// Get document by ID
export const getDocumentById = async ({
  id,
}: { id: string }): Promise<Document | null> => {
  const documents =
    mockStorage.getItem<Document[]>('documents') || mockDocuments;
  const document = documents.find((doc) => doc.id === id);

  if (!document) {
    return null;
  }

  return mockSuccess(document).then((response) => response.data);
};

// Save suggestions
export const saveSuggestions = async ({
  suggestions,
}: {
  suggestions: Suggestion[];
}): Promise<MockResponse<{ success: boolean }>> => {
  const storedSuggestions =
    mockStorage.getItem<Suggestion[]>('suggestions') || [];

  mockStorage.setItem('suggestions', [...storedSuggestions, ...suggestions]);

  return mockSuccess({ success: true });
};
