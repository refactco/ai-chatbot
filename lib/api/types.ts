/**
 * API Type Definitions
 *
 * This file defines the core types used for API interactions throughout the application.
 * It provides consistent type definitions for messages, attachments, and API options.
 *
 * Features:
 * - Message type definitions
 * - Attachment structure
 * - API request and response types
 * - Hook interface definitions
 * - Streaming data interfaces
 *
 * These types ensure consistency between frontend components and API interactions,
 * providing type safety for all communication with the backend.
 */

import React from 'react';

/**
 * Base message interface used in chat conversations
 * Core message structure shared across the application
 */
export interface Message {
  id: string; // Unique identifier
  role: 'user' | 'assistant' | 'tool'; // Who sent the message
  content: string; // Message text content
  name?: string; // Optional sender name for multi-user contexts
}

/**
 * Message type used when creating a new message
 * Similar to Message but with optional ID (auto-generated if missing)
 */
export interface CreateMessage {
  id?: string; // Optional - will be generated if not provided
  role: 'user' | 'assistant' | 'tool'; // Who sent the message
  content: string; // Message text content
  name?: string; // Optional sender name
}

/**
 * Human in the loop interaction data
 * Represents data for user feedback or interaction
 */
export interface HumanInTheLoop {
  message_id?: string; // ID of the message being responded to
  data?: any; // Any additional interaction data
}

/**
 * Tool result data structure
 * Represents the result of a tool execution
 */
export interface ToolResult {
  data?: any; // Tool execution result data
}

/**
 * Enhanced message type with UI-specific properties
 * Extends base Message with additional fields needed for display
 */
export interface UIMessage extends Message {
  attachments?: Attachment[]; // Files or artifacts attached to the message
  createdAt?: Date; // When the message was created
  // reasoning?: string; // Optional AI reasoning explanation
  // role?: 'user' | 'assistant' | 'tool'; // Event type for stream events
  // human_in_the_loop?: HumanInTheLoop; // Human interaction data
  tool_calls?: ToolResult; // Tool execution results
}

/**
 * Attachment interface for various content types
 * Used for adding files, images, or other artifacts to messages
 */
export interface Attachment {
  type: string; // Content type (e.g., 'image', 'text', 'sheet')
  name?: string; // Optional filename
  content?: string; // Optional content data (text, base64, etc.)
  url: string; // Resource URL or identifier
  title?: string; // Optional display title
}

/**
 * Chat request options for API calls
 * Configures fetch request parameters for chat operations
 */
export interface ChatRequestOptions {
  headers?: Record<string, string>; // Custom HTTP headers
  body?: any; // Request body data
  credentials?: RequestCredentials; // Auth credentials setting
  attachments?: Attachment[]; // Files to attach to the message
}

/**
 * Options for the useChat hook
 * Configures the behavior of the chat functionality
 */
export interface UseChatOptions {
  api?: string; // API endpoint URL
  id?: string; // Chat session ID
  initialMessages?: UIMessage[]; // Starting messages to display
  initialInput?: string; // Pre-filled input text
  body?: any; // Additional data to send with requests
  onResponse?: (response: any) => void; // Response callback
  onFinish?: (message: UIMessage) => void; // Completion callback
  onError?: (error: Error) => void; // Error handling callback
  sendExtraMessageFields?: boolean; // Whether to send additional fields
  generateId?: () => string; // Custom ID generator function
}

/**
 * Chat helper functions and state returned by useChat
 * Provides the interface for components to interact with chat functionality
 */
export interface UseChatHelpers {
  messages: UIMessage[]; // Current message history
  append: (message: UIMessage | Message | CreateMessage) => void; // Add message
  reload: () => void; // Reload/restart the conversation
  stop: () => void; // Stop the current response generation
  isLoading: boolean; // Whether a request is in progress
  input: string; // Current input field value
  setInput: React.Dispatch<React.SetStateAction<string>>; // Update input
  handleSubmit: (
    event?: { preventDefault?: () => void } | undefined,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>; // Submit handler
  setMessages: (
    messages: UIMessage[] | ((messages: UIMessage[]) => UIMessage[]),
  ) => void; // Update message history
  status: 'streaming' | 'error' | 'submitted' | 'ready'; // Current status
}

/**
 * Stream writer interface for artifact data streaming
 * Used for sending real-time updates during content generation
 */
export interface DataStreamWriter<T> {
  write(data: T): void; // Write complete data object
  writeData(data: any): void; // Write partial data update
  close(): void; // Close the stream
}
