/**
 * Sidebar History Component
 *
 * This component displays a chronologically grouped list of past chat conversations.
 * Features:
 * - Time-based grouping (Today, Yesterday, Last 7 Days, Last 30 Days, Older)
 * - Loading skeletons during data fetching with variable widths
 * - Empty state handling with informative message
 * - Chat history retrieval from mock API service
 * - Deletion functionality with confirmation dialog and toast notifications
 * - Current chat highlighting with active state styling
 * - Mobile-responsive behavior with sidebar state management
 *
 * This component is rendered in the sidebar to provide navigation between
 * previous conversations and history management capabilities.
 */

'use client';

import { isToday, isYesterday, subMonths, subWeeks } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import useSWR, { useSWRConfig } from 'swr';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import { ChatItem } from './history-item';
import {
  apiService,
  API_CONFIG,
  type ChatSummary,
} from '@/lib/services/api-service';
import { CHAT_HISTORY_KEY } from '@/lib/utils/chat-history';

/**
 * Structure for grouping chats by date categories
 * Each property contains an array of chat summaries belonging to that time period
 */
type GroupedChats = {
  today: ChatSummary[];
  yesterday: ChatSummary[];
  lastWeek: ChatSummary[];
  lastMonth: ChatSummary[];
  older: ChatSummary[];
};

/**
 * Interface representing the chat history data structure
 * @property chats - Array of chat summary objects
 * @property hasMore - Flag indicating if more chats are available to load
 */
export interface ChatHistory {
  chats: Array<ChatSummary>;
  hasMore: boolean;
}

const PAGE_SIZE = 20;

/**
 * Organizes chat summaries into time-based groups
 * @param chats - Array of chat summaries to categorize
 * @returns Object with chats grouped by time periods
 */
const groupChatsByDate = (chats: ChatSummary[]): GroupedChats => {
  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const oneMonthAgo = subMonths(now, 1);

  return chats.reduce(
    (groups, chat) => {
      const chatDate = new Date(chat.timestamp);

      if (isToday(chatDate)) {
        groups.today.push(chat);
      } else if (isYesterday(chatDate)) {
        groups.yesterday.push(chat);
      } else if (chatDate > oneWeekAgo) {
        groups.lastWeek.push(chat);
      } else if (chatDate > oneMonthAgo) {
        groups.lastMonth.push(chat);
      } else {
        groups.older.push(chat);
      }

      return groups;
    },
    {
      today: [],
      yesterday: [],
      lastWeek: [],
      lastMonth: [],
      older: [],
    } as GroupedChats,
  );
};

/**
 * Generates a cache key for SWR pagination
 * @param pageIndex - Page number to generate key for
 * @returns Array containing the resource type and page index
 */
export function getChatHistoryPaginationKey(pageIndex: number) {
  return ['chatHistory', pageIndex];
}

export function SidebarHistory() {
  const { setOpenMobile } = useSidebar();
  const { id } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatSummary[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const { mutate } = useSWRConfig();
  
  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      const chats = await apiService.getChatHistory(PAGE_SIZE, 0);
      setChatHistory(chats);
      setHasMore(chats.length === PAGE_SIZE);
      setOffset(PAGE_SIZE);
      return chats;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const { data } = useSWR(CHAT_HISTORY_KEY, fetchChatHistory, {
    revalidateOnFocus: false,
    dedupingInterval: 5000, // Avoid duplicate requests
  });
  
  const loadMoreChats = async () => {
    if (!hasMore || isLoading) return;
    
    try {
      setIsLoading(true);
      const moreChats = await apiService.getChatHistory(PAGE_SIZE, offset);
      if (moreChats.length === 0) {
        setHasMore(false);
      } else {
        setChatHistory((prevChats) => [...prevChats, ...moreChats]);
        setOffset((prevOffset) => prevOffset + moreChats.length);
        setHasMore(moreChats.length === PAGE_SIZE);
      }
    } catch (error) {
      console.error('Error fetching more chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles chat deletion with toast notification feedback
   * Uses optimistic update pattern to immediately update UI
   * Redirects to home page if current chat is deleted
   */
  const handleDelete = async () => {
    if (!deleteId) return;
    
    toast.promise(
      (async () => {
        try {
          setChatHistory((prevChats) =>
            prevChats.filter((chat) => chat.id !== deleteId),
          );
          
          const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/conversations/${deleteId}?token=${API_CONFIG.AUTH_TOKEN}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            throw new Error(`Failed to delete chat: ${response.statusText}`);
          }
          
          return 'Chat deleted successfully';
        } catch (error) {
          console.error('Error deleting chat:', error);
          const chats = await apiService.getChatHistory(PAGE_SIZE, 0);
          setChatHistory(chats);
          throw error;
        }
      })(),
      {
        loading: 'Deleting chat...',
        success: 'Chat deleted successfully',
        error: 'Failed to delete chat',
      },
    );

    setShowDeleteDialog(false);

    if (deleteId === id) {
      router.push('/');
    }
  };

  const hasEmptyChatHistory = chatHistory.length === 0;

  if (isLoading) {
    return (
      <SidebarGroup>
        <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
          Today
        </div>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {/* Variable-width skeleton items to simulate chat titles */}
            {[44, 32, 28, 64, 52].map((item) => (
              <div
                key={item}
                className="rounded-md h-8 flex gap-2 px-2 items-center"
              >
                <div
                  className="h-4 rounded-md flex-1 max-w-[--skeleton-width] bg-sidebar-accent-foreground/10"
                  style={
                    {
                      '--skeleton-width': `${item}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (hasEmptyChatHistory) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
            Your conversations will appear here once you start chatting!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {(() => {
              const groupedChats = groupChatsByDate(chatHistory);

              return (
                <div 
                  className="flex flex-col gap-6"
                  onScroll={(e) => {
                    const target = e.target as HTMLDivElement;
                    if (
                      target.scrollHeight - target.scrollTop <= target.clientHeight + 100 &&
                      hasMore &&
                      !isLoading
                    ) {
                      loadMoreChats();
                    }
                  }}
                  style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
                >
                  {/* Today's chats section */}
                  {groupedChats.today.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                        Today
                      </div>
                      {groupedChats.today.map((chat) => (
                        <ChatItem
                          key={chat.id}
                          chat={chat}
                          isActive={chat.id === id}
                          onDelete={(chatId) => {
                            setDeleteId(chatId);
                            setShowDeleteDialog(true);
                          }}
                          setOpenMobile={setOpenMobile}
                        />
                      ))}
                    </div>
                  )}

                  {/* Yesterday's chats section */}
                  {groupedChats.yesterday.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                        Yesterday
                      </div>
                      {groupedChats.yesterday.map((chat) => (
                        <ChatItem
                          key={chat.id}
                          chat={chat}
                          isActive={chat.id === id}
                          onDelete={(chatId) => {
                            setDeleteId(chatId);
                            setShowDeleteDialog(true);
                          }}
                          setOpenMobile={setOpenMobile}
                        />
                      ))}
                    </div>
                  )}

                  {/* Last 7 days chats section */}
                  {groupedChats.lastWeek.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                        Last 7 Days
                      </div>
                      {groupedChats.lastWeek.map((chat) => (
                        <ChatItem
                          key={chat.id}
                          chat={chat}
                          isActive={chat.id === id}
                          onDelete={(chatId) => {
                            setDeleteId(chatId);
                            setShowDeleteDialog(true);
                          }}
                          setOpenMobile={setOpenMobile}
                        />
                      ))}
                    </div>
                  )}

                  {/* Last 30 days chats section */}
                  {groupedChats.lastMonth.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                        Last 30 Days
                      </div>
                      {groupedChats.lastMonth.map((chat) => (
                        <ChatItem
                          key={chat.id}
                          chat={chat}
                          isActive={chat.id === id}
                          onDelete={(chatId) => {
                            setDeleteId(chatId);
                            setShowDeleteDialog(true);
                          }}
                          setOpenMobile={setOpenMobile}
                        />
                      ))}
                    </div>
                  )}

                  {/* Older chats section */}
                  {groupedChats.older.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                        Older
                      </div>
                      {groupedChats.older.map((chat) => (
                        <ChatItem
                          key={chat.id}
                          chat={chat}
                          isActive={chat.id === id}
                          onDelete={(chatId) => {
                            setDeleteId(chatId);
                            setShowDeleteDialog(true);
                          }}
                          setOpenMobile={setOpenMobile}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Loading indicator for pagination */}
                  {isLoading && hasMore && (
                    <div className="flex justify-center py-4">
                      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-sidebar-foreground"></div>
                    </div>
                  )}
                </div>
              );
            })()}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Confirmation dialog for chat deletion */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the chat and all of its messages for you and your
              team. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
