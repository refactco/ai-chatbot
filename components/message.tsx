'use client';

import type { UIMessage } from '@/lib/ai/types';
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
import type { UseChatHelpers } from '@/lib/ai/types';
import { MessageReasoning } from './message-reasoning';

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
          {message.role === 'system' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <BrainIcon size={14} />
              </div>
            </div>
          )}

          {message.role === 'assistant' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

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

            {/* Handle message content */}
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
                          title: attachment.name || 'Untitled',
                          kind:
                            attachment.type?.replace('-delta', '') || 'text',
                          content: content,
                        }}
                      />
                    );
                  })}
              </div>
            )}

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

        {message.role === 'assistant' && !isLoading && (
          <div className="flex w-full justify-start gap-2 pl-12 mt-1">
            <MessageActions chatId={chatId} message={message} />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (!equal(prevProps.message, nextProps.message)) return false;

    return true;
  },
);

export const ThinkingMessage = () => {
  return (
    <div className="flex items-center gap-4 mx-auto max-w-3xl px-4">
      <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
        <div className="translate-y-px">
          <SparklesIcon size={14} />
        </div>
      </div>
      <div className="h-8 flex items-center text-muted-foreground">
        Thinking…
      </div>
    </div>
  );
};
