/**
 * Chat Component
 *
 * This component serves as the main orchestrator for the chat interface.
 * It manages the chat state, message submission, and UI rendering.
 *
 * Features:
 * - Message state management and rendering
 * - Integration with real API service
 * - File attachment handling
 * - Streaming response processing
 * - Artifact integration
 *
 * This component acts as the central hub for all chat-related functionality,
 * connecting the UI components with the backend services.
 */

'use client';

import type { Attachment, UIMessage } from '@/lib/api/types';
import { useChat } from '@/lib/api/chat';
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
import { apiService } from '@/lib/services/api-service';

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

  /**
   * Initialize chat state using the useChat hook
   * This provides core functionality for message management
   */
  const {
    messages,
    setMessages,
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

  /**
   * Custom submit handler that uses the API service
   * Manages user message submission and AI response streaming
   */
  const customHandleSubmit = async (
    event?: { preventDefault?: () => void },
    options?: any,
  ) => {
    event?.preventDefault?.();

    if (!input.trim()) return;

    try {
      // Send the user message to the API and get user message object
      const userMessage = await apiService.sendMessage(input, attachments);

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

      // Maintain a mapping of message IDs for tracking updates
      const messageIds = new Map();

      // Stream the AI response
      await apiService.streamResponse(
        userMessage.content,
        {
          onChunk: (chunk) => {
            // For each chunk, update the appropriate message
            setMessages((messages) => {
              if (typeof chunk === 'string') {
                // Handle string chunks (legacy method)
                const assistantMessageIndex = messages.findIndex(
                  (msg) => msg.role === 'assistant' && msg.content === '',
                );

                if (assistantMessageIndex === -1) {
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
                  const updatedMessages = [...messages];
                  updatedMessages[assistantMessageIndex] = {
                    ...updatedMessages[assistantMessageIndex],
                    content: chunk,
                  };
                  return updatedMessages;
                }
              } else {
                // Handle ChunkMessage objects
                // Check if we've seen this message ID before
                if (!messageIds.has(chunk.id)) {
                  // New message, add it to the map and to the messages
                  messageIds.set(chunk.id, messages.length);
                  return [
                    ...messages,
                    { ...chunk, createdAt: chunk.createdAt || new Date() },
                  ];
                } else {
                  // Update existing message
                  const messageIndex = messageIds.get(chunk.id);
                  const updatedMessages = [...messages];
                  updatedMessages[messageIndex] = {
                    ...updatedMessages[messageIndex],
                    content: chunk.content,
                  };
                  return updatedMessages;
                }
              }
            });
          },
          onFinish: (message) => {
            // When done, ensure the final message is properly formatted
            setMessages((messages) =>
              messages.map((msg) => {
                // Only update the assistant message (not the reasoning message)
                if (msg.id === message.id) {
                  return {
                    ...msg,
                    content: message.content,
                  };
                }
                return msg;
              }),
            );
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
      {/* Main chat container with messages and input */}
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

      {/* Artifact panel for document viewing/editing */}
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
