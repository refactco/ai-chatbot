/**
 * Message Actions Component
 *
 * This component provides interaction buttons for chat messages.
 * Features:
 * - Copy-to-clipboard functionality for message content
 * - Tooltip-enhanced buttons for better usability
 * - Conditional rendering based on message role and type
 * - Success/error notifications via toast
 * - Memoized rendering for performance optimization
 * - Copy button only visible on hover
 * - Support for streaming message states
 *
 * Displays for assistant messages and provides copy functionality,
 * with architecture supporting additional actions in the future.
 */

import type { UIMessage, UseChatHelpers } from '@/lib/api/types';
import equal from 'fast-deep-equal';
import { memo } from 'react';
import { toast } from 'sonner';
import { useCopyToClipboard } from 'usehooks-ts';
import { CopyIcon } from './icons';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

/**
 * Main message actions component that displays action buttons
 * Only renders for assistant messages, not user messages
 */
export function PureMessageActions({
  message,
  isLoading,
  reload,
}: {
  message: UIMessage;
  isLoading?: boolean;
  reload?: UseChatHelpers['reload'];
}) {
  const [_, copyToClipboard] = useCopyToClipboard();

  // Determine message role considering both standard role and event types
  const isUserMessage =
    message.role === 'user' || message.type === 'user_message';

  // Don't show actions for user messages or when loading
  if (isUserMessage || isLoading) return null;

  return (
    <div className="flex w-full justify-start gap-2 pl-12 mt-1">
      <TooltipProvider delayDuration={0}>
        <div className="flex flex-row gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="py-1 px-2 h-fit text-muted-foreground opacity-0 group-hover/message:opacity-100 transition-opacity"
                variant="outline"
                onClick={async () => {
                  if (!message.content) {
                    toast.error("There's no text to copy!");
                    return;
                  }

                  await copyToClipboard(message.content);
                  toast.success('Copied to clipboard!');
                }}
              >
                <CopyIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}

/**
 * Memoized version of the message actions component
 * Only re-renders when message content changes
 */
export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (!equal(prevProps.message, nextProps.message)) return false;
    return true;
  },
);
