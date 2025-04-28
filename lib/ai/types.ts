import React from 'react';

// Type definitions to replace those from the AI package

// Common message types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool' | 'function' | 'data';
  content: string;
  name?: string;
  function_call?: any;
  tool_calls?: any[];
}

// CreateMessage type for compatibility with AI SDK
export interface CreateMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system' | 'tool' | 'function' | 'data';
  content: string;
  name?: string;
}

// UI-specific message type
export interface UIMessage extends Message {
  attachments?: Attachment[];
  createdAt?: Date;
  reasoning?: string;
}

export interface Attachment {
  type: string;
  name?: string;
  content?: string;
  url: string;
}

// For core message types
export interface CoreAssistantMessage {
  role: 'assistant';
  content: string;
}

export interface CoreToolMessage {
  role: 'tool';
  content: string;
  name?: string;
}

// Stream writer interface
export interface DataStreamWriter<T> {
  write(data: T): void;
  writeData(data: any): void;
  close(): void;
}

// Chat request options
export interface ChatRequestOptions {
  data?: any; // Use any to be compatible with JSONValue including null
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
  experimental_attachments?: Attachment[];
}

// Chat helpers options
export interface UseChatOptions {
  api?: string;
  id?: string;
  initialMessages?: UIMessage[];
  initialInput?: string;
  body?: any;
  onResponse?: (response: any) => void;
  onFinish?: (message: UIMessage) => void;
  onError?: (error: Error) => void;
  experimental_throttle?: number;
  sendExtraMessageFields?: boolean;
  generateId?: () => string;
}

// Chat helpers type
export interface UseChatHelpers {
  messages: UIMessage[];
  append: (message: UIMessage | Message | CreateMessage) => void;
  reload: () => void;
  stop: () => void;
  isLoading: boolean;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;

  // Additional properties used by components
  handleSubmit: (
    event?: { preventDefault?: () => void } | undefined,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  setMessages: (
    messages: UIMessage[] | ((messages: UIMessage[]) => UIMessage[]),
  ) => void;
  status: 'streaming' | 'error' | 'submitted' | 'ready';
}
