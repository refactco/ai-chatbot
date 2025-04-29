/**
 * Chat Action Functions
 *
 * This file contains client-side utility functions for chat management:
 * - Saving user preferences to browser storage
 * - Generating chat titles from messages
 * - Managing message history
 * - Updating chat visibility settings
 *
 * These functions handle local storage operations and provide consistent
 * interfaces for performing common actions across the chat application.
 */

'use client';

import type { Message } from '@/lib/services/api-service';

// Type definition for visibility
export type VisibilityType = 'private' | 'public' | 'unlisted';

/**
 * Saves the user's preferred chat model to browser storage
 * @param model - The model identifier to save
 */
export function saveChatModelAsCookie(model: string) {
  if (typeof window === 'undefined') return;

  // In a cookie-based implementation, we'd use document.cookie
  // For simplicity, we'll use localStorage
  localStorage.setItem('chat-model', model);
}

/**
 * Generates a chat title from the first user message
 * @param message - The user message to extract title from
 * @returns A string title created from the first few words of the message
 */
export function generateTitleFromUserMessage({
  message,
}: {
  message: Message;
}) {
  // Simple client-side implementation
  // Extract first few words from the message content
  const words = message.content.split(' ');
  const titleWords = words.slice(0, 4);

  // Add ellipsis if the message is longer
  if (words.length > 4) {
    titleWords.push('...');
  }

  return titleWords.join(' ');
}

/**
 * Deletes all messages that come after a specified message in a chat
 * @param id - The ID of the message after which all messages should be deleted
 */
export function deleteTrailingMessages({ id }: { id: string }) {
  if (typeof window === 'undefined') return;

  // Get messages from localStorage
  const messagesJson = localStorage.getItem('messages');
  if (!messagesJson) return;

  const messages: Message[] = JSON.parse(messagesJson);

  // Find the target message
  const messageIndex = messages.findIndex((m) => m.id === id);
  if (messageIndex === -1) return;

  const message = messages[messageIndex];

  // Filter out messages that are in the same chat and created after the target message
  const filteredMessages = messages.filter(
    (m) =>
      m.chatId !== message.chatId ||
      new Date(m.createdAt).getTime() <= new Date(message.createdAt).getTime(),
  );

  // Save the filtered messages
  localStorage.setItem('messages', JSON.stringify(filteredMessages));
}

/**
 * Updates the visibility setting for a specific chat
 * @param chatId - The ID of the chat to update
 * @param visibility - The new visibility setting (private, public, or unlisted)
 */
export function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  if (typeof window === 'undefined') return;

  // Get chats from localStorage
  const chatsJson = localStorage.getItem('chats');
  if (!chatsJson) return;

  const chats = JSON.parse(chatsJson);

  // Find and update the target chat
  const chatIndex = chats.findIndex((c: any) => c.id === chatId);
  if (chatIndex === -1) return;

  chats[chatIndex].visibility = visibility;

  // Save the updated chats
  localStorage.setItem('chats', JSON.stringify(chats));
}
