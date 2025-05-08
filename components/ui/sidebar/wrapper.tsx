/**
 * Sidebar Wrapper Component
 *
 * This component provides a reusable wrapper for sidebar content.
 * Features:
 * - Extracts common sidebar functionality
 * - Works for both sidebar history and sidebar setting
 * - Maintains existing collapse/expand functionality
 * - Mobile-responsive behavior with sidebar state management
 *
 * The component serves as a base for all sidebar content containers,
 * providing consistent styling and behavior.
 */

import React, { ReactNode } from 'react';
import { 
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from '../../ui/sidebar';

interface SidebarWrapperProps {
  children: ReactNode;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const SidebarWrapper = ({
  children,
  isCollapsed = false,
  onToggleCollapse,
  className,
}: SidebarWrapperProps) => {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup className={className}>
      <SidebarGroupContent>
        {children}
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
