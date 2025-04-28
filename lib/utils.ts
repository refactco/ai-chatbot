import type { UIMessage, Message as CoreMessage } from '@/lib/api/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Document } from '@/lib/schema';

// Utility to merge Tailwind and custom class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Custom error type for fetcher
interface ApplicationError extends Error {
  info: string;
  status: number;
}

// Fetch utility with error handling for use with SWR or React Query
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

// Get a value from localStorage by key, parsed as JSON (returns [] if not found)
export function getLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  return [];
}

// Generate a UUID v4 string (random)
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Types for response messages
// ResponseMessageWithoutId: a tool or assistant message without an id
// ResponseMessage: same as above, but with an id
// Used for message tracking in chat UIs

type ResponseMessageWithoutId = CoreMessage | CoreMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

// Get the most recent user message from a list of UI messages
export function getMostRecentUserMessage(messages: Array<UIMessage>) {
  const userMessages = messages.filter((message) => message.role === 'user');
  return userMessages.at(-1);
}

// Get the createdAt timestamp of a document by index, or now if out of bounds
export function getDocumentTimestampByIndex(
  documents: Array<Document>,
  index: number,
) {
  if (!documents) return new Date();
  if (index > documents.length) return new Date();

  return documents[index].createdAt;
}

// Get the id of the last message in a list, or null if empty
export function getTrailingMessageId({
  messages,
}: {
  messages: Array<ResponseMessage>;
}): string | null {
  const trailingMessage = messages.at(-1);

  if (!trailingMessage) return null;

  return trailingMessage.id;
}
