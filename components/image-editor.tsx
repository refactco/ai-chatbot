import { LoaderIcon } from './icons';
import cn from 'classnames';
import { useMemo } from 'react';

// Define placeholder images (matching the pattern from mock-api-service.ts)
const DEFAULT_PLACEHOLDER_IMAGE =
  'https://placehold.co/600x400/3498db/ffffff?text=AI+Generated+Image';

interface ImageEditorProps {
  title: string;
  content: string;
  isCurrentVersion: boolean;
  currentVersionIndex: number;
  status: string;
  isInline: boolean;
}

export function ImageEditor({
  title,
  content,
  status,
  isInline,
}: ImageEditorProps) {
  // Create a stable image source that won't change on re-renders
  const imageSrc = useMemo(() => {
    // If no content or empty string, use placeholder
    if (!content || content.trim() === '') {
      return DEFAULT_PLACEHOLDER_IMAGE;
    }

    // If already a data URL, use as is
    if (content.startsWith('data:')) {
      return content;
    }

    // If it's a URL but not a data URL, use as is
    if (content.startsWith('http')) {
      return content;
    }

    // Otherwise assume it's base64 and add the data URL prefix
    return `data:image/png;base64,${content}`;
  }, [content]); // Only recalculate when content changes

  return (
    <div
      className={cn('flex flex-row items-center justify-center w-full', {
        'h-[calc(100dvh-60px)]': !isInline,
        'h-[200px]': isInline,
      })}
    >
      {status === 'streaming' ? (
        <div className="flex flex-row gap-4 items-center">
          {!isInline && (
            <div className="animate-spin">
              <LoaderIcon />
            </div>
          )}
          <div>Generating Image...</div>
        </div>
      ) : (
        <picture>
          <img
            className={cn('w-full h-fit max-w-[800px]', {
              'p-0 md:p-20': !isInline,
            })}
            src={imageSrc}
            alt={title}
            data-generated={!content || content.trim() === ''}
          />
        </picture>
      )}
    </div>
  );
}
