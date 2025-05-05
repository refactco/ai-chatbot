/**
 * Sidebar History Item Component
 *
 * This component renders an individual chat history item in the sidebar.
 * Features:
 * - Link navigation to chat conversations
 * - Active state highlighting for current chat
 * - Dropdown menu with actions (delete)
 * - Responsive mobile behavior
 * - Performance optimization with memoization
 * - Accessible controls with appropriate labels
 *
 * Used within the SidebarHistory component to display each chat entry
 * with consistent styling and interactive elements.
 */

import type { ChatSummary } from '@/lib/services/api-service';
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { MoreHorizontalIcon, TrashIcon } from './icons';
import { memo } from 'react';

/**
 * Props for the ChatItem component
 * @property chat - Chat summary data to display
 * @property isActive - Whether this item represents the current active chat
 * @property onDelete - Callback function when delete action is triggered
 * @property setOpenMobile - Function to control mobile sidebar visibility
 */
const PureChatItem = ({
  chat,
  isActive,
  onDelete,
  setOpenMobile,
}: {
  chat: ChatSummary;
  isActive: boolean;
  onDelete: (chatId: string) => void;
  setOpenMobile: (open: boolean) => void;
}) => {
  return (
    <SidebarMenuItem>
      {/* Chat title with link to conversation */}
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={`/chat/${chat.id}`} onClick={() => setOpenMobile(false)}>
          <span>{chat.title}</span>
        </Link>
      </SidebarMenuButton>

      {/* Actions dropdown menu */}
      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5"
            showOnHover={!isActive}
          >
            <MoreHorizontalIcon />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="end">
          {/* Delete action with destructive styling */}
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
            onSelect={() => onDelete(chat.id)}
          >
            <TrashIcon />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

/**
 * Memoized ChatItem component to prevent unnecessary re-renders
 * Only re-renders when the active state changes
 */
export const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false;
  return true;
});
