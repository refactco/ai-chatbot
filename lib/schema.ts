/**
 * Schema types for client-side use
 * Replaces server-side database schema
 *
 * These interfaces define the shape of data used throughout the app.
 * They are used for type safety and consistency when working with localStorage or client-side data.
 */

// Represents a user in the system
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string; // Optional user avatar image URL
}

// Represents a chat session
export interface Chat {
  id: string;
  userId: string; // The user who owns this chat
  title: string;
  createdAt: Date;
  updatedAt: Date;
  visibility?: 'private' | 'public' | 'unlisted'; // Optional visibility setting
}

// Represents a single message in a chat
export interface Message {
  id: string;
  chatId: string; // The chat this message belongs to
  content: string;
  role: 'user' | 'assistant' | 'system'; // Who sent the message
  createdAt: Date;
  updatedAt: Date;
}

// Alias for Message, for compatibility
export type DBMessage = Message;

// Represents a user document (e.g., for RAG or knowledge base)
export interface Document {
  id: string;
  userId: string;
  title: string;
  content: string;
  kind: string; // Document type or category
  createdAt: Date;
  updatedAt: Date;
}

// Represents a suggestion for a document (e.g., for collaborative editing)
export interface Suggestion {
  id: string;
  documentId: string;
  userId: string;
  content: string;
  createdAt: Date;
  originalText: string;
  suggestedText: string;
}

// Represents a vote on a message (e.g., upvote/downvote for feedback)
export interface Vote {
  id: string;
  userId: string;
  messageId: string;
  type: 'up' | 'down';
  createdAt: Date;
}
