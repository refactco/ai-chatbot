/**
 * Collapsible Card Component
 *
 * This component provides a reusable, collapsible card container.
 * Features:
 * - Expandable/collapsible content area
 * - Custom header with title and icon
 * - Optional action buttons
 * - Smooth animations for expanding/collapsing
 * - Responsive design
 *
 * This is a generalized version of the previous tool-result layout,
 * designed to work across the entire application.
 */

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../../lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface CollapsibleCardProps {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
  showAction?: boolean;
  icon?: React.ReactNode;
  maxItems?: number;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export const CollapsibleCard = ({
  children,
  title,
  action,
  showAction,
  icon,
  maxItems = 5,
  className,
  headerClassName,
  contentClassName,
}: CollapsibleCardProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    undefined,
  );
  const itemHeight = 25; // Approximate height of each item in pixels

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className={cn(
      "flex flex-col w-full bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800",
      className
    )}>
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between px-4 py-2 h-11',
          isCollapsed ? '' : 'border-b border-neutral-800',
          headerClassName
        )}
      >
        <span className="text-neutral-300 text-sm flex items-center gap-2">
          {icon} {title}
        </span>
        <div className="flex justify-end items-center">
          {showAction ? action : null}
          <button
            onClick={toggleCollapse}
            className="flex items-center justify-center hover:bg-neutral-700 rounded p-1 transition-colors"
            aria-label={isCollapsed ? 'Expand content' : 'Collapse content'}
          >
            {isCollapsed ? (
              <ChevronDown className="size-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="size-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
      {/* Content with animation */}
      <div
        ref={contentRef}
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          height: isCollapsed ? 0 : contentHeight,
          opacity: isCollapsed ? 0 : 1,
          padding: isCollapsed ? '0px' : undefined,
        }}
      >
        <div
          className={cn(
            "p-4 flex flex-col gap-2 overflow-y-auto",
            contentClassName
          )}
          style={{
            maxHeight: `${maxItems * itemHeight + 32}px`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
