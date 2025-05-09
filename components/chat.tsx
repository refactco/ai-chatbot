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
 * - Support for all event types (user_message, assistant_message)
 *
 * This component acts as the central hub for all chat-related functionality,
 * connecting the UI components with the backend services.
 */

'use client';

import { ChatHeader } from '@/components/chat-header';
import { useArtifactSelector } from '@/hooks/use-artifact';
import { useChat } from '@/lib/api/chat';
import type { Attachment, UIMessage } from '@/lib/api/types';
import { apiService } from '@/lib/services/api-service';
import { generateUUID } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { unstable_serialize } from 'swr/infinite';
import { Artifact } from './artifact';
import { Messages } from './messages';
import { MultimodalInput } from './multimodal-input';
import { getChatHistoryPaginationKey } from './sidebar-history';

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
  const [isStreamingComplete, setIsStreamingComplete] = useState(true);
  const [conversationId, setConversationId] = useState<string | undefined>(
    undefined,
  );
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

      setIsStreamingComplete(false);

      // Stream the AI response, passing the conversationId if we have one
      await apiService.streamResponse(
        userMessage.content,
        {
          onStart: (conversationId) => {
            setConversationId(conversationId);
          },
          onChunk: (chunk) => {
            // // Check if the chunk has a conversation_id and store it
            // if (
            //   typeof chunk !== 'string' &&
            //   chunk.conversationId &&
            //   !conversationId
            // ) {
            //   setConversationId(chunk.conversationId);
            // }

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
                // ===== Improved Message Handling =====

                // Handle user_message and assistant_message event types
                if (chunk.role === 'user' || chunk.role === 'assistant') {
                  // Look for existing message with same ID to update
                  const existingIndex = messages.findIndex(
                    (msg) => msg.id === chunk.id,
                  );

                  if (existingIndex !== -1) {
                    // Update existing message
                    const updatedMessages = [...messages];
                    updatedMessages[existingIndex] = {
                      ...updatedMessages[existingIndex],
                      ...chunk,
                      // Ensure type is a valid UIMessage type
                      role: chunk.role as 'user' | 'assistant',
                      createdAt:
                        chunk.createdAt ||
                        updatedMessages[existingIndex].createdAt ||
                        new Date(),
                    };
                    return updatedMessages;
                  } else {
                    // Add as new message
                    return [
                      ...messages,
                      {
                        ...chunk,
                        // Ensure type is a valid UIMessage type
                        role: chunk.role as 'user' | 'assistant',
                        createdAt: chunk.createdAt || new Date(),
                      } as UIMessage,
                    ];
                  }
                }

                // For streaming responses (ongoing AI response), update existing message
                if (chunk.id && chunk.id.includes('response-')) {
                  // Look for existing message or add new one
                  const existingIndex = messages.findIndex(
                    (msg) =>
                      msg.id === chunk.id ||
                      (msg.id && msg.id.includes('response-')),
                  );

                  if (existingIndex !== -1) {
                    // Update existing response
                    const updatedMessages = [...messages];
                    updatedMessages[existingIndex] = {
                      ...updatedMessages[existingIndex],
                      content: chunk.content,
                    };
                    return updatedMessages;
                  } else {
                    // Add new response message
                    return [
                      ...messages,
                      {
                        ...chunk,
                        createdAt: chunk.createdAt || new Date(),
                      } as UIMessage,
                    ];
                  }
                }

                // For event messages, always add as new message
                // This ensures tool events are always displayed
                return [
                  ...messages,
                  {
                    ...chunk,
                    createdAt: chunk.createdAt || new Date(),
                  } as UIMessage,
                ];
              }
            });
          },
          onFinish: (message) => {
            // If we received a conversation_id in the final message, store it
            if (message.conversationId && !conversationId) {
              setConversationId(message.conversationId);
            }

            setIsStreamingComplete(true);
          },
          onError: (error) => {
            console.error('Error streaming response:', error);
            toast.error('Error streaming response. Please try again.');
          },
        },
        undefined,
        userMessage.attachments || [],
        conversationId,
      );
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('An error occurred. Please try again.');
      setIsStreamingComplete(true);
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
          isStreamingComplete={isStreamingComplete}
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
