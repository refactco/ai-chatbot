import { apiService } from '@/lib/services/api-service';
import { generateUUID } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ChatRequestOptions,
  CreateMessage,
  Message,
  UIMessage,
  UseChatHelpers,
  UseChatOptions,
} from './types';

/**
 * Hook for managing chat interactions
 * This handles sending messages to the API and receiving responses
 */
export function useChat(options: UseChatOptions): UseChatHelpers {
  const {
    id,
    initialMessages = [],
    initialInput = '',
    onFinish,
    onError,
  } = options;

  const chatId = id || generateUUID();
  const [messages, setMessages] = useState<UIMessage[]>(initialMessages);
  const [input, setInput] = useState(initialInput);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<
    'streaming' | 'error' | 'submitted' | 'ready'
  >('ready');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Add a message to the chat
   */
  const append = useCallback((message: UIMessage | Message | CreateMessage) => {
    // Ensure message has an id if not provided
    const messageWithId = {
      ...message,
      id: message.id || generateUUID(),
    } as UIMessage;

    setMessages((current) => [...current, messageWithId]);
  }, []);

  /**
   * Reload the chat (simply refetches the chat from the API if available)
   */
  const reload = useCallback(async () => {
    try {
      setStatus('ready');
      setIsLoading(false);

      if (chatId) {
        const chatData = await apiService.getChatById(chatId);
        if (chatData) {
          setMessages(chatData.messages);
        }
      }
    } catch (error) {
      console.error('Failed to reload chat:', error);
      if (onError) {
        onError(error as Error);
      }
    }
  }, [chatId, onError]);

  /**
   * Stop the current streaming response
   */
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setStatus('ready');
  }, []);

  /**
   * Handle submitting a new message
   */
  const handleSubmit = useCallback(
    async (
      event?: { preventDefault?: () => void } | undefined,
      chatRequestOptions?: ChatRequestOptions,
    ) => {
      if (event?.preventDefault) {
        event.preventDefault();
      }

      if (!input.trim()) {
        return null;
      }

      setIsLoading(true);
      setStatus('streaming');

      const userMessage = {
        id: generateUUID(),
        content: input,
        role: 'user' as const,
        createdAt: new Date(),
        attachments: chatRequestOptions?.attachments,
      };

      // Add user message to UI immediately
      append(userMessage);

      // Clear input
      setInput('');

      try {
        // Create a new abort controller for this request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        // Send message to API
        await apiService.sendMessage(
          userMessage.content,
          userMessage.attachments || [],
          chatId,
        );

        // Get conversation ID from the most recent message if available
        const lastMessage = messages[messages.length - 1];
        const existingConversationId = lastMessage?.conversationId;

        // Stream response from API
        await apiService.streamResponse(
          userMessage.content,
          {
            onStart: () => {},
            onChunk: (chunkOrMessage) => {
              if (typeof chunkOrMessage !== 'string') {
                setMessages((messages) => [...messages, chunkOrMessage]);
              }
            },
            onFinish: (message) => {
              // Finalize the assistant message
              setMessages((messages) => [...messages, message]);
              setStatus('ready');
              setIsLoading(false);

              if (onFinish) {
                onFinish(message);
              }
            },
            onError: (error) => {
              console.error('Stream error:', error);
              setStatus('error');
              setIsLoading(false);

              if (onError) {
                onError(error);
              }
            },
          },
          chatId,
          userMessage.attachments,
          existingConversationId, // Pass the conversationId if available
        );

        return userMessage.id;
      } catch (error) {
        console.error('Chat submission error:', error);
        setStatus('error');
        setIsLoading(false);

        if (onError) {
          onError(error as Error);
        }
        return null;
      }
    },
    [append, chatId, input, onError, onFinish, messages],
  );

  return {
    messages,
    append,
    reload,
    stop,
    isLoading,
    input,
    setInput,
    setMessages,
    handleSubmit,
    status,
  };
}
