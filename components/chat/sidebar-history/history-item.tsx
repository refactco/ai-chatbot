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

import React, { memo } from 'react';
import Link from 'next/link';
import type { ChatSummary } from '../../../lib/services/api-service';
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../../components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { MoreHorizontalIcon, TrashIcon } from '../../../components/ui/icons';

interface ChatItemProps {
  chat: ChatSummary;
  isActive?: boolean;
  onDelete: (id: string) => void;
  setOpenMobile: (open: boolean) => void;
}

export const ChatItem = memo(
  ({ chat, isActive, onDelete, setOpenMobile }: ChatItemProps) => {
    return (
      <SidebarMenuItem className="group/menu-item">
        <Link
          href={`/chat/${chat.id}`}
          onClick={() => {
            setOpenMobile(false);
          }}
          className="w-full"
        >
          <SidebarMenuButton isActive={isActive}>
            <span>{chat.title}</span>
          </SidebarMenuButton>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction
              showOnHover
              aria-label="More options"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreHorizontalIcon />
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                onDelete(chat.id);
              }}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  },
);

ChatItem.displayName = 'ChatItem';
