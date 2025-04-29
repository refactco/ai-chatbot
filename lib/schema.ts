/**
 * Schema Definitions
 *
 * This file defines the core data types used throughout the application.
 * It provides type definitions for database-like entities on the client side.
 *
 * Features:
 * - Type definitions for all major domain entities
 * - Interface-based schema for type safety
 * - Consistent naming and structure
 * - Documentation for field purposes
 *
 * These schema definitions ensure consistency across the application
 * and provide type safety when working with data objects.
 */

/**
 * Represents a user in the system
 * Used for authentication, authorization, and user-specific features
 */
export interface User {
  id: string; // Unique identifier
  name: string; // Display name
  email: string; // Email address (often used as username)
  image?: string; // Optional user avatar image URL
}

/**
 * Represents a chat conversation
 * Contains metadata about the conversation but not the messages themselves
 */
export interface Chat {
  id: string; // Unique identifier
  userId: string; // The user who owns this chat
  title: string; // Display title for the conversation
  createdAt: Date; // When the chat was created
  updatedAt: Date; // When the chat was last updated
  visibility?: 'private' | 'public' | 'unlisted'; // Privacy setting
}

/**
 * Represents a single message in a chat
 * Core building block for conversations
 */
export interface Message {
  id: string; // Unique identifier
  chatId: string; // The chat this message belongs to
  content: string; // The message content/text
  role: 'user' | 'assistant' | 'system'; // Who sent the message
  createdAt: Date; // When the message was created
  updatedAt: Date; // When the message was last updated
}

/**
 * Alias for Message, for compatibility with database patterns
 * Allows for consistent naming in database-related code
 */
export type DBMessage = Message;

/**
 * Represents a user document/artifact
 * Used for storing content that can be edited and versioned
 */
export interface Document {
  id: string; // Unique identifier
  userId: string; // The user who owns this document
  title: string; // Display title
  content: string; // The document content (varies by kind)
  kind: string; // Document type (e.g., 'text', 'image', 'sheet')
  createdAt: Date; // When the document was created
  updatedAt: Date; // When the document was last updated
}

/**
 * Represents a suggestion for improving a document
 * Used for collaborative editing and AI-assisted improvements
 */
export interface Suggestion {
  id: string; // Unique identifier
  documentId: string; // The document this suggestion applies to
  userId: string; // The user who created this suggestion
  content: string; // Suggestion description or explanation
  createdAt: Date; // When the suggestion was created
  originalText: string; // The text being replaced
  suggestedText: string; // The suggested replacement text
}

/**
 * Represents a user vote on a message
 * Used for feedback and quality assessment
 */
export interface Vote {
  id: string; // Unique identifier
  userId: string; // The user who cast this vote
  messageId: string; // The message being voted on
  type: 'up' | 'down'; // Vote direction (positive or negative)
  createdAt: Date; // When the vote was cast
}
