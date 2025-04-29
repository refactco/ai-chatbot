/**
 * Sidebar Toggle Component
 *
 * A button component that toggles the sidebar's open/closed state.
 * Features:
 * - Uses the useSidebar hook to access the toggleSidebar function
 * - Displays a tooltip on hover for better user experience
 * - Responsive styling with different appearance on mobile vs desktop
 * - Visually consistent with the application's design system
 *
 * This component is used in the application header to allow users to
 * collapse or expand the sidebar navigation.
 */

import type { ComponentProps } from 'react';

import { type SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { SidebarLeftIcon } from './icons';
import { Button } from './ui/button';

export function SidebarToggle({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={toggleSidebar}
          variant="outline"
          className="md:px-2 md:h-fit"
        >
          <SidebarLeftIcon size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent align="start">Toggle Sidebar</TooltipContent>
    </Tooltip>
  );
}
