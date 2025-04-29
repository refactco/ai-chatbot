/**
 * Message Component
 *
 * This component renders individual messages in the chat interface.
 * It handles different message types (user, assistant, system) and their styling.
 *
 * Features:
 * - Role-based message styling and icons
 * - Support for attachments and artifacts
 * - Message editing functionality
 * - Animation for message transitions
 * - Support for AI reasoning display
 *
 * This component is optimized with memoization to prevent unnecessary re-renders
 * and supports both plain text and markdown content.
 */

'use client';

import type { UIMessage } from '@/lib/api/types';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState } from 'react';
import { PencilEditIcon, SparklesIcon, UserIcon, BrainIcon } from './icons';
import { Markdown } from './markdown';
import { MessageActions } from './message-actions';
import { PreviewAttachment } from './preview-attachment';
import { DocumentPreview } from './document-preview';
import equal from 'fast-deep-equal';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { MessageEditor } from './message-editor';
import type { UseChatHelpers } from '@/lib/api/types';
import { MessageReasoning } from './message-reasoning';

/**
 * The core message component that renders a single chat message
 *
 * @param chatId - ID of the current chat
 * @param message - Message data to render
 * @param isLoading - Whether the message is currently loading
 * @param setMessages - Function to update messages
 * @param reload - Function to reload the chat
 * @param isReadonly - Whether the chat is in readonly mode
 * @returns A rendered message with appropriate styling based on role
 */
const PurePreviewMessage = ({
  chatId,
  message,
  isLoading,
  setMessages,
  reload,
  isReadonly,
}: {
  chatId: string;
  message: UIMessage;
  isLoading: boolean;
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
  isReadonly: boolean;
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            'flex gap-4 w-full group-data-[role=user]/message:max-w-2xl',
            {
              'w-full': mode === 'edit',
              'group-data-[role=user]/message:w-fit': mode !== 'edit',
            },
          )}
        >
          {/* System message avatar */}
          {message.role === 'system' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <BrainIcon size={14} />
              </div>
            </div>
          )}

          {/* Assistant message avatar */}
          {message.role === 'assistant' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          {/* User message avatar */}
          {message.role === 'user' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <UserIcon size={14} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            {/* Handle user-uploaded attachments */}
            {message.attachments && (
              <div
                data-testid={`message-attachments`}
                className="flex flex-row justify-end gap-2"
              >
                {message.attachments
                  .filter(
                    (a) =>
                      !a.type?.startsWith('text') &&
                      !a.type?.startsWith('sheet') &&
                      !a.type?.startsWith('image'),
                  )
                  .map((attachment) => (
                    <PreviewAttachment
                      key={
                        attachment.url ||
                        `attachment-${Math.random().toString(36).substring(2, 9)}`
                      }
                      attachment={attachment}
                    />
                  ))}
              </div>
            )}

            {/* Handle system message content - AI reasoning */}
            {message.role === 'system' && message.content && (
              <div className="flex flex-col gap-2">
                <div
                  data-testid="reasoning-content"
                  className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border border-border"
                >
                  <div className="text-xs font-medium mb-1 text-foreground/80">
                    AI Reasoning Process:
                  </div>
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
            )}

            {/* Handle assistant message content */}
            {message.role === 'assistant' && message.content && (
              <div className="flex flex-col gap-4">
                <div
                  data-testid="message-content"
                  className="flex flex-col gap-4"
                >
                  <Markdown>{message.content}</Markdown>
                </div>

                {message.reasoning && (
                  <MessageReasoning
                    isLoading={isLoading}
                    reasoning={message.reasoning}
                  />
                )}
              </div>
            )}

            {/* Handle artifact attachments separately */}
            {message.attachments && (
              <div className="flex flex-col gap-4 mt-2">
                {message.attachments
                  .filter(
                    (a) =>
                      a.type?.startsWith('text') ||
                      a.type?.startsWith('sheet') ||
                      a.type?.startsWith('image') ||
                      a.type?.endsWith('-delta'),
                  )
                  .map((attachment) => {
                    // Handle image content properly
                    const content =
                      attachment.type?.startsWith('image') && attachment.content
                        ? attachment.content.startsWith('data:')
                          ? attachment.content.split(',')[1] // Extract base64 from data URL
                          : attachment.content
                        : attachment.content || '';

                    return (
                      <DocumentPreview
                        key={
                          attachment.url ||
                          `artifact-${Math.random().toString(36).substring(2, 9)}`
                        }
                        isReadonly={isReadonly}
                        result={{
                          id: attachment.url?.replace('artifact:', '') || '',
                          title:
                            attachment.title || attachment.name || 'Untitled',
                          kind:
                            attachment.type?.replace('-delta', '') || 'text',
                          content: content,
                        }}
                      />
                    );
                  })}
              </div>
            )}

            {/* Handle user message content with edit capability */}
            {message.role === 'user' &&
              message.content &&
              (mode === 'view' ? (
                <div className="flex flex-row gap-2 items-start">
                  <div
                    data-testid="message-content"
                    className="bg-primary text-primary-foreground px-3 py-2 rounded-xl"
                  >
                    <Markdown>{message.content}</Markdown>
                  </div>

                  {!isReadonly && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          data-testid="message-edit-button"
                          variant="ghost"
                          className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                          onClick={() => {
                            setMode('edit');
                          }}
                        >
                          <PencilEditIcon />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit message</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              ) : (
                <div className="flex flex-row gap-2 items-start">
                  <div className="size-8" />

                  <MessageEditor
                    key={message.id}
                    message={message as any}
                    setMode={setMode}
                    setMessages={setMessages as any}
                    reload={reload as any}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Message actions for assistant messages */}
        {message.role === 'assistant' && !isLoading && (
          <div className="flex w-full justify-start gap-2 pl-12 mt-1">
            <MessageActions chatId={chatId} message={message} />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Memoized message component to prevent unnecessary re-renders
 * Only re-renders when the message content or loading state changes
 */
export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (!equal(prevProps.message, nextProps.message)) return false;

    return true;
  },
);

/**
 * Component to show a loading indicator while the AI is generating a response
 * @returns A placeholder message with loading animation
 */
export const ThinkingMessage = () => {
  return (
    <div className="flex items-center gap-4 mx-auto max-w-3xl px-4">
      <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
        <div className="translate-y-px">
          <SparklesIcon size={14} />
        </div>
      </div>
    </div>
  );
};
