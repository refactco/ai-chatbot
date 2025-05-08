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

import React, { memo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import equal from 'fast-deep-equal';
import type { UIMessage, UseChatHelpers } from '../../../lib/api/types';
import { cn } from '../../../lib/utils';
import { DocumentPreview } from '../../../components/document-preview';
import { PencilEditIcon, SparklesIcon, UserIcon } from '../../../components/ui/icons';
import { Markdown } from '../../../components/markdown';
import { MessageEditor } from '../../../components/message-editor';
import { PreviewAttachment } from '../../../components/preview-attachment';
import ToolResult from '../tool-result/tool-result';
import { Button } from '../../../components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../components/ui/tooltip';

export interface MessageProps {
  message: UIMessage;
  isLoading?: boolean;
  isLast?: boolean;
  isEditing?: boolean;
  onEditMessage?: UseChatHelpers['onEditMessage'];
  onDeleteMessage?: UseChatHelpers['onDeleteMessage'];
  readonly?: boolean;
}

export function Message({
  message,
  isLoading,
  isLast,
  isEditing: _isEditing,
  onEditMessage,
  onDeleteMessage,
  readonly,
}: MessageProps) {
  const [isEditing, setIsEditing] = useState(_isEditing || false);
  const [isHovering, setIsHovering] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmitEdit = (value: string) => {
    if (onEditMessage) {
      onEditMessage(message.id, value);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        'group relative mb-4 flex flex-col',
        message.role === 'user' ? 'items-end' : 'items-start',
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={cn(
          'flex max-w-full flex-col gap-2 rounded-lg px-4 py-2',
          message.role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted',
          message.role === 'assistant' && message.thinking
            ? 'bg-muted/50'
            : '',
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex size-6 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
            {message.role === 'user' ? (
              <UserIcon className="size-4" />
            ) : (
              <SparklesIcon className="size-4" />
            )}
          </div>
          <div className="text-sm font-medium">
            {message.role === 'user' ? 'You' : 'AI'}
          </div>
          {!readonly && message.role === 'user' && !isEditing && (
            <AnimatePresence>
              {isHovering && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-2 top-2"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={handleEditClick}
                      >
                        <PencilEditIcon className="size-3" />
                        <span className="sr-only">Edit message</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit message</TooltipContent>
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
        {isEditing ? (
          <MessageEditor
            content={message.content}
            onSubmit={handleSubmitEdit}
            onCancel={handleCancelEdit}
          />
        ) : (
          <div className="message-content">
            {message.thinking ? (
              <div className="text-muted-foreground">
                <em>AI is thinking...</em>
              </div>
            ) : (
              <Markdown content={message.content} />
            )}
            {message.attachments?.map((attachment) => (
              <div key={attachment.id} className="mt-4">
                <PreviewAttachment attachment={attachment} />
              </div>
            ))}
            {message.artifacts?.map((artifact) => (
              <div key={artifact.id} className="mt-4">
                <DocumentPreview artifact={artifact} />
              </div>
            ))}
            {message.toolCalls?.map((toolCall, index) => (
              <div key={index} className="mt-4">
                <ToolResult
                  toolCalls={toolCall}
                  onAccept={() => {}}
                  onReject={() => {}}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const PreviewMessage = memo(Message, (prevProps, nextProps) => {
  return equal(prevProps.message, nextProps.message);
});

PreviewMessage.displayName = 'PreviewMessage';

export function ThinkingMessage() {
  return (
    <div className="group relative mb-4 flex flex-col items-start">
      <div className="flex max-w-full flex-col gap-2 rounded-lg bg-muted/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex size-6 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
            <SparklesIcon className="size-4" />
          </div>
          <div className="text-sm font-medium">AI</div>
        </div>
        <div className="text-muted-foreground">
          <em>AI is thinking...</em>
        </div>
      </div>
    </div>
  );
}
