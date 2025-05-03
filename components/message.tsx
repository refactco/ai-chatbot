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
 * - Support for user_message and assistant_message event types
 *
 * This component is optimized with memoization to prevent unnecessary re-renders
 * and supports both plain text and markdown content.
 */

'use client';

import type { UIMessage, UseChatHelpers } from '@/lib/api/types';
import { cn } from '@/lib/utils';
import equal from 'fast-deep-equal';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState } from 'react';
import { DocumentPreview } from './document-preview';
import { PencilEditIcon, SparklesIcon, UserIcon } from './icons';
import { Markdown } from './markdown';
import { MessageEditor } from './message-editor';
import { PreviewAttachment } from './preview-attachment';
import ToolResult from './tool-result/tool-result';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

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
  showAssistantIcon = false,
}: {
  chatId: string;
  message: UIMessage;
  isLoading: boolean;
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
  isReadonly: boolean;
  showAssistantIcon: boolean;
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  // Determine if the message is a user_message or assistant_message event
  const isUserMessageEvent = message.role === 'user';
  const isAssistantMessageEvent = message.role === 'assistant';
  const isToolMessageEvent = message.role === 'tool';
  // Set role based on message type if it exists
  const messageRole =
    message.role ||
    (isUserMessageEvent
      ? 'user'
      : isAssistantMessageEvent
        ? 'assistant'
        : message.role);

  console.log({ previewMessage: message });

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${messageRole}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={messageRole}
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
          {/* {messageRole === 'tool' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <BrainIcon size={14} />
              </div>
            </div>
          )} */}

          {/* Assistant message avatar */}
          {isAssistantMessageEvent || isToolMessageEvent ? (
            <div
              className={cn(
                'size-8 flex items-center rounded-full justify-center shrink-0 bg-background',
                showAssistantIcon ? 'ring-1 ring-border' : '',
              )}
            >
              <div className="translate-y-px">
                <SparklesIcon
                  color={showAssistantIcon ? undefined : 'black'}
                  size={14}
                />
              </div>
            </div>
          ) : null}

          {/* User message avatar */}
          {isUserMessageEvent && (
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
            {isToolMessageEvent && message.content && (
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
            {isAssistantMessageEvent && message.content && (
              <div className="flex flex-col gap-4">
                <div
                  data-testid="message-content"
                  className="flex flex-col gap-4"
                >
                  <Markdown>{message.content}</Markdown>
                </div>

                {/* {message.reasoning && (
                    <MessageReasoning
                      isLoading={isLoading}
                      reasoning={message.reasoning}
                    />
                  )} */}
              </div>
            )}

            {isAssistantMessageEvent && message.tool_calls ? (
              <ToolResult
                toolCalls={message.tool_calls}
                // onAccept={() => {
                //   // Refresh the message to reflect the updated task status
                //   // (actual status update happens in ToolResult component)
                //   setMessages((prev) => [...prev]);
                // }}
                // onReject={() => {
                //   // Refresh the message to reflect the updated task status
                //   // (actual status update happens in ToolResult component)
                //   setMessages((prev) => [...prev]);
                // }}
                // onAcceptAll={() => {
                //   // Refresh the message to reflect all tasks accepted
                //   // (actual status update happens in ToolResult component)
                //   setMessages((prev) => [...prev]);
                // }}
                // onRejectAll={() => {
                //   // Refresh the message to reflect all tasks rejected
                //   // (actual status update happens in ToolResult component)
                //   setMessages((prev) => [...prev]);
                // }}
              />
            ) : null}

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
            {isUserMessageEvent &&
              message.content &&
              (mode === 'view' ? (
                <div className="flex flex-row gap-2 items-start">
                  <div
                    data-testid="message-content"
                    className={cn(
                      'px-3 py-2 rounded-xl',
                      isUserMessageEvent
                        ? 'bg-neutral-800 border border-border text-foreground'
                        : 'bg-neutral-800 text-white',
                    )}
                  >
                    <Markdown>{message.content}</Markdown>
                  </div>

                  {!isReadonly && !isUserMessageEvent && (
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

            {/* Display human_in_the_loop data if available */}
            {/* {message.human_in_the_loop && (
              <div className="text-sm text-muted-foreground mt-1">
                {message.human_in_the_loop.data && (
                  <div className="flex flex-col gap-2 border border-border rounded-md p-3 bg-muted/20">
                    <div className="text-xs font-medium text-foreground/80">
                      Human Interaction:
                    </div>
                    <pre className="text-xs overflow-auto whitespace-pre-wrap">
                      {JSON.stringify(message.human_in_the_loop.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )} */}
          </div>
        </div>

        {/* Message actions component */}
        {/* <MessageActions
          message={message}
          isLoading={isLoading}
          reload={reload as any}
        /> */}
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
