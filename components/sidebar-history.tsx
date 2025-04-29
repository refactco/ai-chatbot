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
import { ChatItem } from './sidebar-history-item';
import {
  mockApiService,
  type ChatSummary,
} from '@/lib/services/mock-api-service';

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

// Number of chats to fetch per page
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
      const chatDate = new Date(chat.createdAt);

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

  // Fetch chat history from mock API on initial load
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        const chats = await mockApiService.getChatHistory(PAGE_SIZE);
        setChatHistory(chats);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  /**
   * Handles chat deletion with toast notification feedback
   * Uses optimistic update pattern to immediately update UI
   * Redirects to home page if current chat is deleted
   */
  const handleDelete = async () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          // Remove from local state
          setChatHistory((prevChats) =>
            prevChats.filter((chat) => chat.id !== deleteId),
          );
          resolve('Chat deleted successfully');
        }, 500);
      }),
      {
        loading: 'Deleting chat...',
        success: 'Chat deleted successfully',
        error: 'Failed to delete chat',
      },
    );

    setShowDeleteDialog(false);

    // Navigate to home if deleted the current chat
    if (deleteId === id) {
      router.push('/');
    }
  };

  // Determine if the history is empty for conditional rendering
  const hasEmptyChatHistory = chatHistory.length === 0;

  // Show loading skeleton while data is being fetched
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

  // Show empty state message when no chats exist
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

  // Render grouped chat history list
  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {(() => {
              // Group chats by date categories
              const groupedChats = groupChatsByDate(chatHistory);

              return (
                <div className="flex flex-col gap-6">
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
