/**
 * Utility Functions
 *
 * This file contains common utility functions used throughout the application.
 * It provides various helpers for data manipulation, localStorage access, and id generation.
 *
 * Features:
 * - Tailwind CSS class name merging
 * - Fetch utilities with error handling
 * - LocalStorage access helpers
 * - UUID generation
 * - Message and document utilities
 *
 * These utilities simplify common operations and provide type safety
 * for frequently used functionality across the application.
 */

import type { UIMessage, Message as CoreMessage } from '@/lib/api/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Document } from '@/lib/schema';

/**
 * Merges multiple class values into a single className string
 * Uses clsx for conditional class merging and tailwind-merge for Tailwind compatibility
 *
 * @param inputs - Class values to merge (strings, objects, arrays, etc.)
 * @returns A single className string with merged and de-duplicated classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Custom error type for fetch operations
 * Extends the standard Error with additional fields for API errors
 */
interface ApplicationError extends Error {
  info: string;
  status: number;
}

/**
 * Fetches data from a URL with error handling
 * Designed to work with SWR or React Query data fetching patterns
 *
 * @param url - The URL to fetch data from
 * @returns Parsed JSON response
 * @throws ApplicationError with status and additional info on failure
 */
export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      'An error occurred while fetching the data.',
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

/**
 * Gets data from localStorage by key and parses it as JSON
 * Safe for SSR (returns empty array when window is not available)
 *
 * @param key - The localStorage key to retrieve
 * @returns Parsed JSON value or empty array if not found
 */
export function getLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  return [];
}

/**
 * Generates a random UUID v4 string
 * Used for creating client-side IDs when needed
 *
 * @returns A UUID v4 format string
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Types for response messages
 * Used for message tracking in chat UIs
 */
type ResponseMessageWithoutId = CoreMessage | CoreMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

/**
 * Gets the most recent user message from a list of UI messages
 * Useful for generating context or handling the latest user input
 *
 * @param messages - Array of UI messages to search
 * @returns The most recent user message or undefined if none exists
 */
export function getMostRecentUserMessage(messages: Array<UIMessage>) {
  const userMessages = messages.filter((message) => message.role === 'user');
  return userMessages.at(-1);
}

/**
 * Gets the timestamp of a document by its index in an array
 * Falls back to current date if index is out of bounds
 *
 * @param documents - Array of documents to search
 * @param index - Index of the document to get timestamp for
 * @returns Date object representing the document's creation time
 */
export function getDocumentTimestampByIndex(
  documents: Array<Document>,
  index: number,
) {
  if (!documents) return new Date();
  if (index > documents.length) return new Date();

  return documents[index].createdAt;
}

/**
 * Gets the ID of the last message in an array
 * Useful for tracking conversation flow and message chains
 *
 * @param messages - Array of messages to check
 * @returns ID of the last message or null if array is empty
 */
export function getTrailingMessageId({
  messages,
}: {
  messages: Array<ResponseMessage>;
}): string | null {
  const trailingMessage = messages.at(-1);

  if (!trailingMessage) return null;

  return trailingMessage.id;
}
