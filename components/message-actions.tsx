/**
 * Message Actions Component
 *
 * This component provides interaction buttons for chat messages.
 * Features:
 * - Copy-to-clipboard functionality for message content
 * - Tooltip-enhanced buttons for better usability
 * - Conditional rendering based on message role
 * - Success/error notifications via toast
 * - Memoized rendering for performance optimization
 *
 * Currently displays only for assistant messages and provides
 * copy functionality, with architecture supporting additional
 * actions in the future.
 */

import { useCopyToClipboard } from 'usehooks-ts';
import type { UIMessage } from '@/lib/api/types';
import { CopyIcon } from './icons';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { memo } from 'react';
import equal from 'fast-deep-equal';
import { toast } from 'sonner';

/**
 * Main message actions component that displays action buttons
 * Only renders for assistant messages, not user messages
 */
export function PureMessageActions({
  chatId,
  message,
}: {
  chatId: string;
  message: UIMessage;
}) {
  const [_, copyToClipboard] = useCopyToClipboard();

  // Don't show actions for user messages
  if (message.role === 'user') return null;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground"
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
  );
}

/**
 * Memoized version of the message actions component
 * Only re-renders when message content changes
 */
export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (!equal(prevProps.message, nextProps.message)) return false;
    return true;
  },
);
