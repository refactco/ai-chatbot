import React from 'react';

/**
 * Base message interface used in chat conversations
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  name?: string;
}

/**
 * Message type used when creating a new message
 */
export interface CreateMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  name?: string;
}

/**
 * Enhanced message type with UI-specific properties
 */
export interface UIMessage extends Message {
  attachments?: Attachment[];
  createdAt?: Date;
  reasoning?: string;
}

/**
 * Attachment interface for various content types
 */
export interface Attachment {
  type: string;
  name?: string;
  content?: string;
  url: string;
  title?: string;
}

/**
 * Chat request options for API calls
 */
export interface ChatRequestOptions {
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
  attachments?: Attachment[];
}

/**
 * Options for the useChat hook
 */
export interface UseChatOptions {
  api?: string;
  id?: string;
  initialMessages?: UIMessage[];
  initialInput?: string;
  body?: any;
  onResponse?: (response: any) => void;
  onFinish?: (message: UIMessage) => void;
  onError?: (error: Error) => void;
  sendExtraMessageFields?: boolean;
  generateId?: () => string;
}

/**
 * Chat helper functions and state returned by useChat
 */
export interface UseChatHelpers {
  messages: UIMessage[];
  append: (message: UIMessage | Message | CreateMessage) => void;
  reload: () => void;
  stop: () => void;
  isLoading: boolean;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (
    event?: { preventDefault?: () => void } | undefined,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  setMessages: (
    messages: UIMessage[] | ((messages: UIMessage[]) => UIMessage[]),
  ) => void;
  status: 'streaming' | 'error' | 'submitted' | 'ready';
}

/**
 * Stream writer interface for artifact data streaming
 */
export interface DataStreamWriter<T> {
  write(data: T): void;
  writeData(data: any): void;
  close(): void;
}
