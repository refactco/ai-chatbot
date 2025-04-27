'use client';

import type { UIMessage } from '@/lib/ai/types';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState } from 'react';
import { PencilEditIcon, SparklesIcon, UserIcon } from './icons';
import { Markdown } from './markdown';
import { MessageActions } from './message-actions';
import { PreviewAttachment } from './preview-attachment';
import equal from 'fast-deep-equal';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { MessageEditor } from './message-editor';
import type { UseChatHelpers } from '@/lib/ai/types';

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
            {message.attachments && (
              <div
                data-testid={`message-attachments`}
                className="flex flex-row justify-end gap-2"
              >
                {message.attachments.map((attachment) => (
                  <PreviewAttachment
                    key={attachment.url}
                    attachment={attachment}
                  />
                ))}
              </div>
            )}

            {message.role === 'assistant' && message.content && (
              <div className="flex flex-row gap-2 items-start">
                <div
                  data-testid="message-content"
                  className="flex flex-col gap-4"
                >
                  <Markdown>{message.content}</Markdown>
                </div>
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
