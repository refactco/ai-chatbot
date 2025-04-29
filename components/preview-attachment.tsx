/**
 * Preview Attachment Component
 *
 * This component renders a preview thumbnail of file attachments in the chat interface.
 * Features:
 * - Image preview rendering for supported file types
 * - Loading state indication during file uploads with animated spinner
 * - Compact thumbnail presentation with truncated filename display
 * - Consistent sizing and styling across the application
 * - Accessible image alt text for screen readers
 *
 * Used in the multimodal input area to display file attachments when users
 * upload files before sending messages.
 */

import type { Attachment } from '@/lib/api/types';
import { LoaderIcon } from './icons';

/**
 * Props for the PreviewAttachment component
 * @property attachment - The attachment object containing file metadata
 * @property isUploading - Optional flag indicating if the file is currently uploading
 */
export const PreviewAttachment = ({
  attachment,
  isUploading = false,
}: {
  attachment: Attachment;
  isUploading?: boolean;
}) => {
  const { name, url, type } = attachment;

  return (
    <div data-testid="input-attachment-preview" className="flex flex-col gap-2">
      {/* Attachment preview container with consistent sizing and optional loading overlay */}
      <div className="w-20 h-16 aspect-video bg-muted rounded-md relative flex flex-col items-center justify-center">
        {type?.startsWith('image') ? (
          // Image preview thumbnail for image file types
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={url}
            src={url}
            alt={name ?? 'An image attachment'}
            className="rounded-md size-full object-cover"
          />
        ) : (
          // Placeholder for non-image file types
          <div className="" />
        )}

        {/* Animated loading spinner overlay when upload is in progress */}
        {isUploading && (
          <div
            data-testid="input-attachment-loader"
            className="animate-spin absolute text-zinc-500"
          >
            <LoaderIcon />
          </div>
        )}
      </div>

      {/* Filename display with truncation for long filenames */}
      <div className="text-xs text-zinc-500 max-w-16 truncate">{name}</div>
    </div>
  );
};
