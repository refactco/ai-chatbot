/**
 * Messages Component
 *
 * This component displays the chat message history.
 * Features:
 * - Auto-scrolling to the latest message
 * - Thinking indicator for in-progress responses
 * - Empty state with welcome greeting
 * - Performance optimized with memoization
 * - Support for readonly mode in shared chats
 * - Loading states for messages being streamed
 *
 * This is the main container for all chat messages and
 * handles the overall message list rendering and behavior.
 */

import type { UIMessage, UseChatHelpers } from '@/lib/api/types';
import { PreviewMessage, ThinkingMessage } from './message';
import { Greeting } from './greeting';
import { memo, useRef } from 'react';
import equal from 'fast-deep-equal';

interface MessagesProps {
  chatId: string;
  status: UseChatHelpers['status'];
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
  isReadonly: boolean;
  isArtifactVisible: boolean;
}

/**
 * Main messages container component
 * Renders the full chat history and handles scrolling behavior
 */
function PureMessages({
  chatId,
  status,
  messages,
  setMessages,
  reload,
  isReadonly,
}: MessagesProps) {
  // Type assertion to help TypeScript understand the compatibility
  const compatibleMessages = messages as any;
  const compatibleSetMessages = setMessages as any;
  const compatibleReload = reload as any;

  // Simple refs without auto-scrolling
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {/* Show greeting for empty chats */}
      {compatibleMessages.length === 0 && <Greeting />}

      {/* Render all messages in the chat */}
      {compatibleMessages.map((message: any, index: number) => {
        // Ensure each message has a unique key, using message.id if available,
        // or a combination of role, content, and index as fallback
        const messageKey =
          message.id ||
          `message-${message.role}-${index}-${message.content?.substring(0, 10) || 'empty'}`;

        return (
          <PreviewMessage
            key={messageKey}
            chatId={chatId}
            message={message}
            isLoading={
              status === 'streaming' && compatibleMessages.length - 1 === index
            }
            setMessages={compatibleSetMessages}
            reload={compatibleReload}
            isReadonly={isReadonly}
          />
        );
      })}

      {/* Show thinking indicator when waiting for response */}
      {status === 'submitted' &&
        compatibleMessages.length > 0 &&
        compatibleMessages[compatibleMessages.length - 1].role === 'user' && (
          <ThinkingMessage key="thinking-message" />
        )}

      {/* End anchor element */}
      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}

/**
 * Memoized messages component for performance optimization
 * Prevents unnecessary re-renders when artifact state changes
 */
export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isArtifactVisible && nextProps.isArtifactVisible) return true;

  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.status && nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;

  return true;
});
