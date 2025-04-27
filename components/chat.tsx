'use client';

import type { Attachment, UIMessage } from '@/lib/ai/types';
import { useChat } from '@/lib/ai/react';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { ChatHeader } from '@/components/chat-header';
import { generateUUID } from '@/lib/utils';
import { Artifact } from './artifact';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import { useArtifactSelector } from '@/hooks/use-artifact';
import { toast } from 'sonner';
import { unstable_serialize } from 'swr/infinite';
import { getChatHistoryPaginationKey } from './sidebar-history';
import { mockApiService } from '@/lib/services/mock-api-service';

export function Chat({
  id,
  initialMessages,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
  } = useChat({
    id,
    body: { id },
    initialMessages,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: () => {
      toast.error('An error occurred, please try again!');
    },
  });

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector(
    (state: { isVisible: boolean }) => state.isVisible,
  );

  // Custom handleSubmit to use our mock API
  const customHandleSubmit = async (
    event?: { preventDefault?: () => void },
    options?: any,
  ) => {
    event?.preventDefault?.();

    if (!input.trim()) return;

    try {
      // Send the user message to the API and get user message object
      const userMessage = await mockApiService.sendMessage(input, attachments);

      // Add the user message to the UI
      append({
        id: userMessage.id,
        role: 'user',
        content: userMessage.content,
        createdAt: userMessage.createdAt,
        attachments: userMessage.attachments,
      });

      // Clear the input and attachments
      setInput('');
      setAttachments([]);

      // Stream the AI response
      await mockApiService.streamResponse(
        userMessage.content,
        {
          onChunk: (chunk) => {
            // For each chunk, update the assistant message
            setMessages((messages) => {
              // Find if we already have a streaming message
              const assistantMessageIndex = messages.findIndex(
                (msg) => msg.role === 'assistant' && msg.content === '',
              );

              if (assistantMessageIndex === -1) {
                // If not, add a new empty assistant message
                return [
                  ...messages,
                  {
                    id: generateUUID(),
                    role: 'assistant',
                    content: chunk,
                    createdAt: new Date(),
                  },
                ];
              } else {
                // If yes, update the existing message
                const updatedMessages = [...messages];
                updatedMessages[assistantMessageIndex] = {
                  ...updatedMessages[assistantMessageIndex],
                  content: chunk,
                };
                return updatedMessages;
              }
            });
          },
          onFinish: (message) => {
            // When done, ensure the final message is properly formatted
            setMessages((messages) => {
              const assistantMessageIndex = messages.findIndex(
                (msg) =>
                  msg.role === 'assistant' &&
                  !msg.content.endsWith(message.content),
              );

              if (assistantMessageIndex !== -1) {
                // Update to the final message
                const updatedMessages = [...messages];
                updatedMessages[assistantMessageIndex] = {
                  ...updatedMessages[assistantMessageIndex],
                  id: message.id,
                  content: message.content,
                };
                return updatedMessages;
              }
              return messages;
            });
          },
          onError: (error) => {
            console.error('Error streaming response:', error);
            toast.error('Error streaming response. Please try again.');
          },
        },
        undefined,
        userMessage.attachments || [],
      );
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader chatId={id} isReadonly={isReadonly} />

        <Messages
          chatId={id}
          status={status}
          messages={messages as any}
          setMessages={setMessages as any}
          reload={reload as any}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
        />

        <form
          className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl"
          onSubmit={(e) => customHandleSubmit(e)}
        >
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput as any}
              handleSubmit={customHandleSubmit as any}
              status={status}
              stop={stop}
              attachments={attachments as any}
              setAttachments={setAttachments as any}
              messages={messages as any}
              setMessages={setMessages as any}
              append={append as any}
            />
          )}
        </form>
      </div>

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput as any}
        handleSubmit={customHandleSubmit as any}
        status={status}
        stop={stop}
        attachments={attachments as any}
        setAttachments={setAttachments as any}
        append={append as any}
        messages={messages as any}
        setMessages={setMessages as any}
        reload={reload as any}
        isReadonly={isReadonly}
      />
    </>
  );
}
