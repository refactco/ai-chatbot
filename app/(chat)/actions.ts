'use client';

import type { Message } from '@/lib/services/api-service';

// Type definition for visibility
export type VisibilityType = 'private' | 'public' | 'unlisted';

// Save chat model preference to cookie
export function saveChatModelAsCookie(model: string) {
  if (typeof window === 'undefined') return;

  // In a cookie-based implementation, we'd use document.cookie
  // For simplicity, we'll use localStorage
  localStorage.setItem('chat-model', model);
}

// Generate a title from a user message
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

// Delete trailing messages
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

// Update chat visibility
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
