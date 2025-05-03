import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AsanaLogo } from '../icons/asana-logo';

export interface IToolResultLayoutProps {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
  showAction?: boolean;
  mainIcon?: React.ReactNode;
}

const ToolResultLayout = ({
  children,
  title,
  action,
  showAction,
  mainIcon = <AsanaLogo />,
}: IToolResultLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="flex flex-col w-full bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between px-4 py-2 h-11',
          isCollapsed ? '' : 'border-b border-neutral-800',
        )}
      >
        <span className="text-neutral-300 text-sm flex items-center gap-2">
          {mainIcon} {title}
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
        <div className="p-4 flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
};

export default ToolResultLayout;
