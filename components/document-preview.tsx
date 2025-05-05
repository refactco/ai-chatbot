/**
 * Document Preview Component
 *
 * This component provides a compact preview of document artifacts in the chat interface.
 * Features:
 * - Support for multiple artifact types (text, image, sheet)
 * - Interactive fullscreen expansion capability
 * - Loading state visualization with skeletons
 * - Streaming content updates during generation
 * - Type-specific rendering for different content formats
 * - Optimized rendering with memoization
 * - Local and API-based document handling
 *
 * This component serves as the inline preview of artifacts within the chat,
 * with the ability to expand into the full artifact view when clicked.
 */

'use client';

import { useArtifact } from '@/hooks/use-artifact';
import type { Document } from '@/lib/schema';
import { cn, fetcher } from '@/lib/utils';
import equal from 'fast-deep-equal';
import type { MouseEvent } from 'react';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import useSWR from 'swr';
import type { ArtifactKind, UIArtifact } from './artifact';
import { DocumentToolCall, DocumentToolResult } from './document';
import { InlineDocumentSkeleton } from './document-skeleton';
import { FileIcon, FullscreenIcon, ImageIcon, LoaderIcon } from './icons';
import { ImageEditor } from './image-editor';
import { SpreadsheetEditor } from './sheet-editor';
import { Editor } from './text-editor';

/**
 * Props for the DocumentPreview component
 * @property isReadonly - Whether the document is in read-only mode
 * @property result - Result data for document that was created
 * @property args - Arguments passed to create the document
 */
interface DocumentPreviewProps {
  isReadonly: boolean;
  result?: any;
  args?: any;
}

/**
 * Main document preview component
 * Handles fetching, display, and interaction with document artifacts
 */
export function DocumentPreview({
  isReadonly,
  result,
  args,
}: DocumentPreviewProps) {
  const { artifact, setArtifact } = useArtifact();

  // Skip API calls for:
  // 1. Placeholder images (URLs that start with http or contain placehold.co)
  // 2. Special document IDs like text:article or sheet:table-data
  const shouldFetchDocument =
    result?.id &&
    !String(result.id).startsWith('http') &&
    !String(result.id).includes('placehold.co') &&
    !String(result.id).startsWith('text:') &&
    !String(result.id).startsWith('sheet:');

  // Fetch document data from API if needed
  const { data: documents, isLoading: isDocumentsFetching } = useSWR<
    Array<Document>
  >(shouldFetchDocument ? `/api/document?id=${result.id}` : null, fetcher);

  const previewDocument = useMemo(() => documents?.[0], [documents]);
  const hitboxRef = useRef<HTMLDivElement>(null);

  // Update artifact bounding box for animation when opening in fullscreen
  useEffect(() => {
    const boundingBox = hitboxRef.current?.getBoundingClientRect();

    if (artifact.documentId && boundingBox) {
      setArtifact((artifact) => ({
        ...artifact,
        boundingBox: {
          left: boundingBox.x,
          top: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
        },
      }));
    }
  }, [artifact.documentId, setArtifact]);

  // If the artifact is already visible, show appropriate components
  if (artifact.isVisible) {
    if (result) {
      return (
        <DocumentToolResult
          type="create"
          result={{ id: result.id, title: result.title, kind: result.kind }}
          isReadonly={isReadonly}
        />
      );
    }

    if (args) {
      return (
        <DocumentToolCall
          type="create"
          args={{ title: args.title }}
          isReadonly={isReadonly}
        />
      );
    }
  }

  // Show loading skeleton while fetching document data
  if (isDocumentsFetching) {
    return (
      <LoadingSkeleton artifactKind={result?.kind || args?.kind || 'text'} />
    );
  }

  // If documents failed to load but we have result data, use that directly
  const document: Document | null = previewDocument
    ? previewDocument
    : result
      ? {
          title: result.title || 'Untitled',
          kind: (result.kind as ArtifactKind) || 'text',
          content: result.content || '',
          id: result.id || '',
          createdAt: new Date(),
          userId: 'noop',
          updatedAt: new Date(),
        }
      : artifact.status === 'streaming'
        ? {
            title: artifact.title,
            kind: artifact.kind as ArtifactKind,
            content: artifact.content,
            id: artifact.documentId,
            createdAt: new Date(),
            userId: 'noop',
            updatedAt: new Date(),
          }
        : null;

  if (!document) return <LoadingSkeleton artifactKind={artifact.kind} />;

  return (
    <div className="relative w-full cursor-pointer">
      <HitboxLayer
        hitboxRef={hitboxRef}
        result={result || document}
        setArtifact={setArtifact}
      />
      <DocumentHeader
        title={document.title}
        kind={document.kind as ArtifactKind}
        isStreaming={artifact.status === 'streaming'}
      />
      <DocumentContent document={document} />
    </div>
  );
}

/**
 * Loading skeleton component for document previews
 * Shows appropriate placeholder based on artifact type
 */
const LoadingSkeleton = ({ artifactKind }: { artifactKind: ArtifactKind }) => (
  <div className="w-full">
    {/* Header skeleton with pulsing elements */}
    <div className="p-4 border rounded-t-2xl flex flex-row gap-2 items-center justify-between dark:bg-muted h-[57px] dark:border-zinc-700 border-b-0">
      <div className="flex flex-row items-center gap-3">
        <div className="text-muted-foreground">
          <div className="animate-pulse rounded-md size-4 bg-muted-foreground/20" />
        </div>
        <div className="animate-pulse rounded-lg h-4 bg-muted-foreground/20 w-24" />
      </div>
      <div>
        <FullscreenIcon />
      </div>
    </div>
    {/* Content skeleton differs by artifact type */}
    {artifactKind === 'image' ? (
      <div className="overflow-y-scroll border rounded-b-2xl bg-muted border-t-0 dark:border-zinc-700">
        <div className="animate-pulse h-[257px] bg-muted-foreground/20 w-full" />
      </div>
    ) : (
      <div className="overflow-y-scroll border rounded-b-2xl p-8 pt-4 bg-muted border-t-0 dark:border-zinc-700">
        <InlineDocumentSkeleton />
      </div>
    )}
  </div>
);

/**
 * Invisible hitbox layer that handles clicks to expand the document
 * Captures position and dimensions for animation when expanding
 */
const PureHitboxLayer = ({
  hitboxRef,
  result,
  setArtifact,
}: {
  hitboxRef: React.RefObject<HTMLDivElement>;
  result: any;
  setArtifact: (
    updaterFn: UIArtifact | ((currentArtifact: UIArtifact) => UIArtifact),
  ) => void;
}) => {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      const boundingBox = event.currentTarget.getBoundingClientRect();

      // Create a sanitized document ID that won't trigger unnecessary API calls
      // For special document types like text:article, we'll use a special prefix
      let documentId = result?.id || '';

      // Don't store URLs or special document IDs directly to prevent API calls
      if (
        documentId.startsWith('http') ||
        documentId.includes('placehold.co') ||
        documentId.startsWith('text:') ||
        documentId.startsWith('sheet:')
      ) {
        // Use a local identifier prefix to prevent API calls
        documentId = `local:${documentId}`;
      }

      const artifactData = {
        title: result?.title || 'Untitled',
        documentId,
        kind: result?.kind || 'text',
        content: result?.content || '',
      };

      setArtifact((artifact) => ({
        ...artifact,
        ...artifactData,
        isVisible: true,
        boundingBox: {
          left: boundingBox.x,
          top: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
        },
        status: 'idle',
      }));
    },
    [setArtifact, result],
  );

  return (
    <div
      className="size-full absolute top-0 left-0 rounded-xl z-10"
      ref={hitboxRef}
      onClick={handleClick}
      role="presentation"
      aria-hidden="true"
    >
      <div className="w-full p-4 flex justify-end items-center">
        <button
          type="button"
          aria-label="Open in fullscreen"
          className="absolute right-[9px] top-[13px] p-2 hover:dark:bg-zinc-700 rounded-md hover:bg-zinc-100"
          onClick={(e) => {
            e.stopPropagation();
            handleClick(e as MouseEvent<HTMLElement>);
          }}
        >
          <FullscreenIcon />
        </button>
      </div>
    </div>
  );
};

/**
 * Memoized hitbox layer to prevent unnecessary re-renders
 * Only updates when the result data changes
 */
const HitboxLayer = memo(PureHitboxLayer, (prevProps, nextProps) => {
  return equal(prevProps.result, nextProps.result);
});

/**
 * Document header showing title and type icon
 * Displays loading animation during streaming
 */
const PureDocumentHeader = ({
  title,
  kind,
  isStreaming,
}: {
  title: string;
  kind: ArtifactKind;
  isStreaming: boolean;
}) => (
  <div className="p-4 border rounded-t-2xl flex flex-row gap-2 items-start sm:items-center justify-between dark:bg-muted border-b-0 dark:border-zinc-700">
    <div className="flex flex-row items-start sm:items-center gap-3">
      <div className="text-muted-foreground">
        {isStreaming ? (
          <div className="animate-spin">
            <LoaderIcon />
          </div>
        ) : kind === 'image' ? (
          <ImageIcon />
        ) : (
          <FileIcon />
        )}
      </div>
      <div className="-translate-y-1 sm:translate-y-0 font-medium">{title}</div>
    </div>
    <div className="w-8" />
  </div>
);

/**
 * Memoized document header component
 * Only re-renders when title or streaming state changes
 */
const DocumentHeader = memo(PureDocumentHeader, (prevProps, nextProps) => {
  if (prevProps.title !== nextProps.title) return false;
  if (prevProps.isStreaming !== nextProps.isStreaming) return false;

  return true;
});

/**
 * Document content display based on artifact type
 * Renders appropriate editor for each content format
 */
const DocumentContent = ({ document }: { document: Document }) => {
  const { artifact } = useArtifact();

  // Apply different styling based on document type
  const containerClassName = cn(
    'h-[257px] overflow-y-scroll border rounded-b-2xl dark:bg-muted border-t-0 dark:border-zinc-700',
    {
      'p-4 sm:px-14 sm:py-16': document.kind === 'text',
      'p-0': document.kind === 'sheet' || document.kind === 'image',
    },
  );

  // Common props for all editor types
  const commonProps = {
    content: document.content ?? '',
    isCurrentVersion: true,
    currentVersionIndex: 0,
    status: artifact.status,
    saveContent: () => {},
    suggestions: [],
  };

  return (
    <div className={containerClassName}>
      {/* Render appropriate editor based on document kind */}
      {document.kind === 'text' ? (
        <Editor {...commonProps} onSaveContent={() => {}} />
      ) : document.kind === 'sheet' ? (
        <div className="flex flex-1 relative size-full p-4">
          <div className="absolute inset-0">
            <SpreadsheetEditor {...commonProps} />
          </div>
        </div>
      ) : document.kind === 'image' ? (
        <ImageEditor
          title={document.title}
          content={document.content ?? ''}
          isCurrentVersion={true}
          currentVersionIndex={0}
          status={artifact.status}
          isInline={true}
        />
      ) : null}
    </div>
  );
};
