import type { UIMessage, UseChatHelpers } from '@/lib/ai/types';
import { PreviewMessage, ThinkingMessage } from './message';
import { useScrollToBottom } from './use-scroll-to-bottom';
import { Greeting } from './greeting';
import { memo } from 'react';
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

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {compatibleMessages.length === 0 && <Greeting />}

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

      {status === 'submitted' &&
        compatibleMessages.length > 0 &&
        compatibleMessages[compatibleMessages.length - 1].role === 'user' && (
          <ThinkingMessage key="thinking-message" />
        )}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isArtifactVisible && nextProps.isArtifactVisible) return true;

  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.status && nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;

  return true;
});
