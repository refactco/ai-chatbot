// React integration to replace @ai-sdk/react
import { useState, useCallback } from 'react';
import type {
  ChatRequestOptions,
  UIMessage,
  UseChatHelpers,
  UseChatOptions,
  Message,
  CreateMessage,
} from './types';

export function useChat(options: UseChatOptions): UseChatHelpers {
  const [messages, setMessages] = useState<UIMessage[]>(
    options.initialMessages || [],
  );
  const [input, setInput] = useState(options.initialInput || '');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<
    'streaming' | 'error' | 'submitted' | 'ready'
  >('ready');

  const append = useCallback((message: UIMessage | Message | CreateMessage) => {
    // Ensure message has an id if not provided
    const messageWithId = {
      ...message,
      id: message.id || generateRandomId(),
    } as UIMessage;

    setMessages((current) => [...current, messageWithId]);
  }, []);

  const reload = useCallback(() => {
    console.log('Reload functionality not implemented');
  }, []);

  const stop = useCallback(() => {
    console.log('Stop functionality not implemented');
    setIsLoading(false);
    setStatus('ready');
  }, []);

  const handleSubmit = useCallback(
    async (
      event?: { preventDefault?: () => void } | undefined,
      chatRequestOptions?: ChatRequestOptions,
    ) => {
      if (event?.preventDefault) {
        event.preventDefault();
      }

      setIsLoading(true);
      setStatus('streaming');

      try {
        // Simulate API call
        console.log('Chat submission with options:', chatRequestOptions);
        await new Promise((resolve) => setTimeout(resolve, 500));

        setStatus('submitted');
        setIsLoading(false);
        return 'success';
      } catch (error) {
        console.error('Chat submission error:', error);
        setStatus('error');
        setIsLoading(false);
        if (options.onError) {
          options.onError(error as Error);
        }
        return null;
      }
    },
    [options],
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

// Helper function to generate random IDs
function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}
