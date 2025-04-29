/**
 * Chat Visibility Hook
 *
 * This hook manages the visibility state of chat conversations.
 * It provides functionality to get and update a chat's visibility status.
 *
 * Features:
 * - Retrieves current visibility status (private/shared)
 * - Updates visibility in both local state and backend
 * - Syncs with SWR cache for consistent state management
 * - Handles fallback when chat data is missing
 *
 * Used in chat interfaces to control whether conversations are private
 * or shared with other users.
 */

'use client';

import { useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { unstable_serialize } from 'swr/infinite';
import {
  updateChatVisibility,
  type VisibilityType,
} from '@/app/(chat)/actions';
import {
  getChatHistoryPaginationKey,
  type ChatHistory,
} from '@/components/sidebar-history';

/**
 * Hook for managing chat visibility settings
 *
 * @param chatId - The ID of the chat whose visibility is being managed
 * @param initialVisibility - The initial visibility state to use
 * @returns Object containing current visibility type and a function to update it
 */
export function useChatVisibility({
  chatId,
  initialVisibility,
}: {
  chatId: string;
  initialVisibility: VisibilityType;
}) {
  const { mutate, cache } = useSWRConfig();
  const history: ChatHistory = cache.get('/api/history')?.data;

  // Store local visibility state with SWR
  const { data: localVisibility, mutate: setLocalVisibility } = useSWR(
    `${chatId}-visibility`,
    null,
    {
      fallbackData: initialVisibility,
    },
  );

  /**
   * Determine the current visibility type from cache or local state
   * Prioritizes the value from chat history cache if available
   */
  const visibilityType = useMemo(() => {
    if (!history) return localVisibility;
    const chat = history.chats.find((chat) => chat.id === chatId);
    if (!chat) return 'private';
    // Handle the case where visibility may not exist on the chat object
    return (chat as any).visibility || 'private';
  }, [history, chatId, localVisibility]);

  /**
   * Updates the visibility type both locally and on the server
   * @param updatedVisibilityType - The new visibility type to set
   */
  const setVisibilityType = (updatedVisibilityType: VisibilityType) => {
    // Update local state
    setLocalVisibility(updatedVisibilityType);

    // Update SWR cache for chat history
    mutate(unstable_serialize(getChatHistoryPaginationKey));

    // Persist the change to the server
    updateChatVisibility({
      chatId: chatId,
      visibility: updatedVisibilityType,
    });
  };

  return { visibilityType, setVisibilityType };
}
