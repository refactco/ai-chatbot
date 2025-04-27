/**
 * Mock API data models
 *
 * This file defines the data structures used by the mock API
 * to simulate responses from a real backend.
 */

// User model
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Session model
export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  sessionToken: string;
}

// Chat model
export interface Chat {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  path?: string;
  sharePath?: string;
  isShared?: boolean;
}

// Message role type
export type MessageRole = 'user' | 'assistant' | 'system';

// Message model
export interface Message {
  id: string;
  chatId: string;
  content: string;
  role: MessageRole;
  createdAt: Date;
  updatedAt: Date;
  artifacts?: Artifact[];
  attachments?: Attachment[];
}

// Artifact type
export type ArtifactType = 'code' | 'image' | 'document' | 'other';

// Artifact model
export interface Artifact {
  id: string;
  userId: string;
  messageId?: string;
  title: string;
  type: ArtifactType;
  content?: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Attachment model
export interface Attachment {
  id: string;
  messageId: string;
  type: string;
  url: string;
  name: string;
  size: number;
  createdAt: Date;
}

// API request types

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  image?: string;
}

export interface CreateChatRequest {
  userId: string;
  title: string;
}

export interface CreateMessageRequest {
  chatId: string;
  content: string;
  role: MessageRole;
  attachments?: Omit<Attachment, 'id' | 'messageId' | 'createdAt'>[];
}

export interface CreateArtifactRequest {
  userId: string;
  messageId?: string;
  title: string;
  type: ArtifactType;
  content?: string;
  url?: string;
}

// API response types

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface ChatListResponse {
  chats: Chat[];
  totalCount: number;
}

export interface ChatDetailResponse {
  chat: Chat;
  messages: Message[];
}

export interface MessageListResponse {
  messages: Message[];
  totalCount: number;
}

export interface ChatCompletionRequest {
  chatId: string;
  message: string;
  model?: string;
}

export interface ChatCompletionResponse {
  message: Message;
  isStreaming?: boolean;
}

// Helper function to create dates in the past
export const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// Add the Suggestion interface
export interface Suggestion {
  id: string;
  documentId: string;
  userId: string;
  originalText: string;
  suggestedText: string;
  description: string;
  isResolved: boolean;
  createdAt: Date;
  documentCreatedAt: Date;
}
