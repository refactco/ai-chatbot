import { useEffect, useState } from 'react';
import type { Attachment } from '@/lib/ai/types';

import { LoaderIcon } from './icons';

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
}: {
  attachment: Attachment;
  isUploading?: boolean;
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
            <div className="" />
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
