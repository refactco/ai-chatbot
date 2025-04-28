import { useEffect, useState } from 'react';
import type { Attachment } from '@/lib/ai/types';
import { LoaderIcon, FileIcon, ImageIcon } from './icons';
import { Markdown } from './markdown';

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
  inMessage = false,
}: {
  attachment: Attachment;
  isUploading?: boolean;
  inMessage?: boolean;
}) => {
  const { name, url, type, content } = attachment;
  const [displayUrl, setDisplayUrl] = useState<string>(url || '');

  useEffect(() => {
    // For local:// URLs, get the data URL from localStorage
    if (url?.startsWith('local://')) {
      const storedFiles = localStorage.getItem('stored_files');
      if (storedFiles) {
        const files = JSON.parse(storedFiles);
        const file = files.find((f: any) => f.url === url);
        if (file?.dataUrl) {
          setDisplayUrl(file.dataUrl);
        }
      }
    }
  }, [url]);

  // If the attachment is shown inside a message, display it appropriately
  if (inMessage) {
    if (type === 'image') {
      return (
        <div className="w-full max-w-[600px] rounded-md overflow-hidden my-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayUrl}
            alt={name || 'Image'}
            className="w-full h-auto object-contain"
          />
          {name && (
            <div className="text-xs text-muted-foreground mt-1">{name}</div>
          )}
        </div>
      );
    }

    if (type === 'sheet') {
      return (
        <div className="w-full max-w-[600px] rounded-md border border-border p-4 my-2">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon size={16} />
            <span className="font-medium">{name || 'Data Table'}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                {content?.split('\n')?.map((row, rowIndex) => (
                  <tr
                    key={`row-${rowIndex}-${row.substring(0, 8)}`}
                    className={rowIndex === 0 ? 'bg-muted' : ''}
                  >
                    {row.split(',').map((cell, cellIndex) => (
                      <td
                        key={`cell-${rowIndex}-${cellIndex}-${cell.substring(0, 8)}`}
                        className="border border-border px-2 py-1 text-sm"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (type === 'text') {
      return (
        <div className="w-full max-w-[600px] rounded-md border border-border p-4 my-2">
          <div className="flex items-center gap-2 mb-2">
            <FileIcon size={16} />
            <span className="font-medium">{name || 'Text Document'}</span>
          </div>
          <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:text-muted-foreground">
            {content && <Markdown>{content}</Markdown>}
          </div>
        </div>
      );
    }
  }

  // Default thumbnail view for attachments (used in the input area)
  return (
    <div data-testid="input-attachment-preview" className="flex flex-col gap-2">
      <div className="w-20 h-16 aspect-video bg-muted rounded-md relative flex flex-col items-center justify-center">
        {type ? (
          type?.startsWith('image') ? (
            // NOTE: it is recommended to use next/image for images
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={displayUrl}
              alt={name ?? 'An image attachment'}
              className="rounded-md size-full object-cover"
            />
          ) : (
            <div className="">
              {type === 'sheet' && <ImageIcon size={20} />}
              {type === 'text' && <FileIcon size={20} />}
            </div>
          )
        ) : (
          <div className="" />
        )}

        {isUploading && (
          <div
            data-testid="input-attachment-loader"
            className="animate-spin absolute text-zinc-500"
          >
            <LoaderIcon />
          </div>
        )}
      </div>
      <div className="text-xs text-zinc-500 max-w-16 truncate">{name}</div>
    </div>
  );
};
