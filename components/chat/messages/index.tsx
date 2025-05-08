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

import React, { memo, useEffect, useRef } from 'react';
import equal from 'fast-deep-equal';
import type { UIMessage, UseChatHelpers } from '../../../lib/api/types';
import { Greeting } from '../../../components/greeting';
import { PreviewMessage, ThinkingMessage } from '../message';

export interface MessagesProps {
  messages: UIMessage[];
  isLoading?: boolean;
  onEditMessage?: UseChatHelpers['onEditMessage'];
  onDeleteMessage?: UseChatHelpers['onDeleteMessage'];
  readonly?: boolean;
}

export function Messages({
  messages,
  isLoading,
  onEditMessage,
  onDeleteMessage,
  readonly,
}: MessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto">
        <Greeting />
      </div>
    );
  }

  return (
    <div
      ref={scrollAreaRef}
      className="flex-1 overflow-y-auto px-4 pt-4 md:px-8"
    >
      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          message={message}
          isLoading={isLoading && index === messages.length - 1}
          isLast={index === messages.length - 1}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
          readonly={readonly}
        />
      ))}
      {isLoading && <ThinkingMessage />}
      <div ref={messagesEndRef} />
    </div>
  );
}

export const MemoizedMessages = memo(Messages, (prevProps, nextProps) => {
  return (
    equal(prevProps.messages, nextProps.messages) &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.readonly === nextProps.readonly
  );
});

MemoizedMessages.displayName = 'MemoizedMessages';
